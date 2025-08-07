from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
import psycopg2
import psycopg2.extras
from geopy.distance import great_circle
import os
import uuid
import math
from dotenv import load_dotenv
import datetime
from functools import wraps

app = Flask(__name__)
load_dotenv()
CORS(app, origins=os.environ.get('ORIGIN').split(","), supports_credentials=True)
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET')
jwt = JWTManager(app)

# Database connection function
def get_db_connection():
    conn = psycopg2.connect(
        host=os.environ.get('DB_HOST'),
        database=os.environ.get('DB_NAME'),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        port=os.environ.get('DB_PORT')
    )
    return conn

def calculate_distance(point1, point2):
    return great_circle((point1[1], point1[0]), (point2[1], point2[0])).meters

# Graph class for route planning
class RoadGraph:
    def __init__(self):
        self.nodes = {}
        self.edges = {}
        self.build_graph()
        
    def build_graph(self):
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        # Load all roads
        cur.execute("SELECT id, ST_AsText(geom) AS wkt, length_m, is_oneway FROM roads;")
        roads = cur.fetchall()
        
        for road in roads:
            road_id = road['id']
            wkt = road['wkt']
            length = road['length_m']
            is_oneway = road['is_oneway']
            
            # Parse WKT to extract coordinates
            coords_str = wkt.replace('LINESTRING(', '').replace(')', '')
            coords_list = [tuple(map(float, c.split())) for c in coords_str.split(',')]
            
            # Add start and end nodes
            start_node = coords_list[0]
            end_node = coords_list[-1]
            
            if start_node not in self.nodes:
                self.nodes[start_node] = []
            if end_node not in self.nodes:
                self.nodes[end_node] = []
                
            # Add edge from start to end
            self.nodes[start_node].append(end_node)
            self.edges[(start_node, end_node)] = {
                'id': road_id,
                'length': length,
                'geometry': coords_list
            }
            
            # Add reverse edge if not one-way
            if not is_oneway:
                self.nodes[end_node].append(start_node)
                self.edges[(end_node, start_node)] = {
                    'id': road_id,
                    'length': length,
                    'geometry': list(reversed(coords_list))
                }
        
            app.logger.info(f"Road graph built with {len(self.nodes)} nodes and {len(self.edges)} edges")

            # Validate graph connectivity
            if not self.nodes:
                app.logger.error("Road graph is empty!")
            elif not self.edges:
                app.logger.error("No edges in road graph!")

        
        cur.close()
        conn.close()

    def find_nearest_node(self, point):
        max_distance = 500 
        nearest_node = None
        min_distance = float('inf')
        
        for node in self.nodes.keys():
            distance = calculate_distance(point, node)
            if distance < min_distance:
                min_distance = distance
                nearest_node = node
                
        if min_distance > max_distance:
            app.logger.warning(f"No nearby node found within {max_distance}m")
            return None

        return nearest_node
    
    def dijkstra(self, start, end):
        # # Convert to (lon, lat) for consistency
        # start_point = (start[0], start[1])
        # end_point = (end[0], end[1])
        
        start_node = self.find_nearest_node(start)
        end_node = self.find_nearest_node(end)
        
        # Check if start/end nodes are valid
        if start_node is None or end_node is None:
            app.logger.warning(f"Couldn't find nearest node: start={start}, end={end}")
            return None, 0
        
        # Dijkstra's algorithm
        distances = {node: float('inf') for node in self.nodes}
        previous_nodes = {node: None for node in self.nodes}
        distances[start_node] = 0
        
        unvisited = set(self.nodes.keys())
        
        while unvisited:
            # Find unvisited node with smallest distance
            current = min(unvisited, key=lambda node: distances[node], default=None)
            if current is None or distances[current] == float('inf'):
                break
            unvisited.remove(current)
            
            if current == end_node:
                break
                
            for neighbor in self.nodes[current]:
                if neighbor not in unvisited:
                    continue
                    
                edge_key = (current, neighbor)
                if edge_key in self.edges:
                    edge_length = self.edges[edge_key]['length']
                    new_distance = distances[current] + edge_length
                    
                    if new_distance < distances[neighbor]:
                        distances[neighbor] = new_distance
                        previous_nodes[neighbor] = current
        
        # Check if path was found
        if previous_nodes.get(end_node) is None:
            app.logger.warning(f"No path found: start={start_point} end={end_point}")
            return None, 0
        
        # Reconstruct path
        path = []
        current = end_node
        while current:
            path.insert(0, current)
            current = previous_nodes.get(current)
        
        # Convert path to LineString
        line_coords = []
        for i in range(len(path) - 1):
            edge_key = (path[i], path[i+1])
            if edge_key in self.edges:
                # For first segment, include all points
                if i == 0:
                    line_coords.extend(self.edges[edge_key]['geometry'])
                else:
                    # Skip first point (duplicate of previous segment's last point)
                    line_coords.extend(self.edges[edge_key]['geometry'][1:])
        
        total_distance = distances[end_node]
        return line_coords, total_distance

# Initialize the graph when the app starts
road_graph = RoadGraph()

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@app.route('/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    response = jsonify({'status': 'OK'})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# === USER AUTHENTICATION ===

# User Registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({"msg": "Missing required fields"}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute(
            "INSERT INTO users (username, email, password_hash) "
            "VALUES (%s, %s, crypt(%s, gen_salt('bf'))) RETURNING id;",
            (username, email, password)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        return jsonify({"id": user_id, "msg": "User created successfully"}), 201
    except psycopg2.errors.UniqueViolation:
        return jsonify({"msg": "Username or email already exists"}), 400
    finally:
        cur.close()
        conn.close()

# User Login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print(f"Login attempt for user: {data.get('email')}")
    email = data.get('email')
    password = data.get('password')
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    cur.execute(
        "SELECT * FROM users "
        "WHERE email = %s AND password_hash = crypt(%s, password_hash);",
        (email, password)
    )
    user = cur.fetchone()
    
    if user:
        cur.execute(
            "UPDATE users SET last_login = NOW() WHERE id = %s;",
            (user['id'],)
        )
        conn.commit()
    else:
        app.logger.warning(f"Login failed for user: {email}")

    if user:
        access_token = create_access_token(identity=str(user['id']))
        refresh_token = create_refresh_token(identity=str(user['id']))
        
        expires_at = datetime.datetime.utcnow() + datetime.timedelta(days=7)
        cur.execute(
            "INSERT INTO user_refresh_tokens (user_id, refresh_token, expires_at) VALUES (%s, %s, %s);",
            (user['id'], refresh_token, expires_at)
        )
        conn.commit()
        cur.close()
        conn.close()
        
        user_dict = dict(user)
        user_dict.pop('password_hash', None)
        return jsonify(access_token=access_token, refresh_token=refresh_token, user=user_dict), 200

    cur.close()
    conn.close()
    return jsonify({"msg": "Invalid credentials"}), 401

# Refresh Token
@app.route('/refresh-token', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    current_user = get_jwt_identity()
    jti = get_jwt()["jti"]
    refresh_token = request.json.get("refresh_token")
    if not refresh_token:
        return jsonify({"msg": "Missing refresh token"}), 400

    # Check if refresh token is valid and not revoked
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT revoked, expires_at FROM user_refresh_tokens WHERE refresh_token = %s AND user_id = %s;",
        (refresh_token, current_user)
    )
    row = cur.fetchone()
    if not row:
        cur.close()
        conn.close()
        return jsonify({"msg": "Invalid refresh token"}), 401
    revoked, expires_at = row
    if revoked or expires_at < datetime.datetime.utcnow():
        cur.close()
        conn.close()
        return jsonify({"msg": "Refresh token expired or revoked"}), 401

    # Issue new access token
    access_token = create_access_token(identity=current_user)
    cur.close()
    conn.close()
    return jsonify(access_token=access_token), 200

# User Logout
@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    data = request.get_json()
    refresh_token = data.get('refresh_token')
    if not refresh_token:
        return jsonify({"msg": "Missing refresh_token in request body"}), 400

    user_id = get_jwt_identity()
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE user_refresh_tokens SET revoked = TRUE WHERE user_id = %s AND refresh_token = %s;",
            (user_id, refresh_token)
        )
        conn.commit()
        return jsonify({"msg": "Successfully logged out"}), 200
    except Exception as e:
        conn.rollback()
        app.logger.error(f"Logout failed: {e}")
        return jsonify({"msg": "Logout failed"}), 500
    finally:
        cur.close()
        conn.close()

# User Profile
@app.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    try:
        cur.execute("SELECT id, username, email, is_admin, last_login FROM users WHERE id = %s;", (user_id,))
        user = cur.fetchone()
        
        if not user:
            return jsonify({"msg": "User not found"}), 404
            
        user_dict = dict(user)
        user_dict['last_login'] = user_dict['last_login'].isoformat() if user_dict['last_login'] else None
        
        return jsonify(user_dict), 200
        
    finally:
        cur.close()
        conn.close()

# User Profile Update
@app.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "UPDATE users SET username = %s, email = %s WHERE id = %s;",
            (username, email, user_id)
        )
        conn.commit()
        return jsonify({"msg": "Profile updated successfully"}), 200

    except Exception as e:
        conn.rollback()
        app.logger.error(f"Database error: {str(e)}")
        return jsonify({"msg": "Failed to update profile"}), 500

    finally:
        cur.close()
        conn.close()

# === ROUTE PLANNING ===

# Route Planning
@app.route('/routes', methods=['POST'])
@jwt_required()
def plan_route():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    start_lon = data.get('start_lon')
    start_lat = data.get('start_lat')
    end_lon = data.get('end_lon')
    end_lat = data.get('end_lat')
    optimization = data.get('optimization', 'shortest')
    
    if None in (start_lon, start_lat, end_lon, end_lat):
        return jsonify({"msg": "Missing coordinates"}), 400
    
    # Convert to floats
    try:
        start_point = (float(start_lon), float(start_lat))
        end_point = (float(end_lon), float(end_lat))
    except ValueError:
        return jsonify({"msg": "Invalid coordinates"}), 400
    
    # Calculate route
    path_coords, total_distance = road_graph.dijkstra(start_point, end_point)
    
    # Validate path coordinates
    if not path_coords or len(path_coords) < 2:
        return jsonify({
            "msg": "No valid route found between the points",
            "suggestion": "Try closer points or check road network data"
        }), 404
    
    # Convert to GeoJSON format
    geojson_route = {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "LineString",
            "coordinates": [[lon, lat] for lon, lat in path_coords] 
        }
    }
    
    # Save to database
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Create LineString WKT
        wkt_coords = ", ".join([f"{lon} {lat}" for lat, lon in path_coords])
        wkt_linestring = f"LINESTRING({wkt_coords})"
        
        # Calculate estimated time (simplified: 5 m/s walking speed)
        estimated_time = total_distance / 5.0  # in seconds
        
        # Insert route
        cur.execute(
            "INSERT INTO routes (user_id, start_loc, end_loc, "
            "optimization_type, total_distance_m, estimated_time_s, geom) "
            "VALUES (%s, ST_GeogFromText(%s), ST_GeogFromText(%s), "
            "%s, %s, %s, ST_GeogFromText(%s)) "
            "RETURNING id;",
            (
                user_id,
                f"POINT({start_lon} {start_lat})",
                f"POINT({end_lon} {end_lat})",
                optimization,
                total_distance,
                estimated_time,
                f"SRID=4326;{wkt_linestring}"
            )
        )
        route_id = cur.fetchone()[0]
        
        # Add to history
        cur.execute(
            "INSERT INTO user_route_history (user_id, route_id, "
            "start_name, end_name, total_distance_m, duration_min) "
            "VALUES (%s, %s, %s, %s, %s, %s);",
            (
                user_id,
                route_id,
                data.get('start_name', 'Start'),
                data.get('end_name', 'End'),
                total_distance,
                estimated_time / 60  # convert to minutes
            )
        )
        
        conn.commit()
        
        return jsonify({
            "route_id": route_id,
            "distance": total_distance,
            "estimated_time": estimated_time,
            "route": geojson_route
        }), 200
        
    except Exception as e:
        conn.rollback()
        app.logger.error(f"Database error: {str(e)}")
        return jsonify({"msg": "Error saving route", "error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# Get Route History
@app.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    try:
        cur.execute(
            "SELECT history_id, route_id, accessed_at, start_name, end_name, "
            "total_distance_m, duration_min "
            "FROM user_route_history "
            "WHERE user_id = %s "
            "ORDER BY accessed_at DESC "
            "LIMIT 20;",
            (user_id,)
        )
        history = cur.fetchall()
        
        history_list = []
        for item in history:
            history_list.append({
                "id": item['history_id'],
                "route_id": item['route_id'],
                "accessed_at": item['accessed_at'].isoformat(),
                "start": item['start_name'],
                "end": item['end_name'],
                "distance": item['total_distance_m'],
                "duration": item['duration_min']
            })
            
        return jsonify(history_list), 200
        
    finally:
        cur.close()
        conn.close()

# Save Location
@app.route('/locations', methods=['POST'])
@jwt_required()
def save_location():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    name = data.get('name')
    lon = data.get('lon')
    lat = data.get('lat')
    
    if not name or lon is None or lat is None:
        return jsonify({"msg": "Missing required fields"}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Create location
        cur.execute(
            "INSERT INTO locations (name, geom) "
            "VALUES (%s, ST_GeogFromText(%s)) "
            "RETURNING id;",
            (name, f"POINT({lon} {lat})")
        )
        location_id = cur.fetchone()[0]
        
        # Save to user's locations
        custom_name = data.get('custom_name', name)
        cur.execute(
            "INSERT INTO user_saved_locations (user_id, location_id, custom_name) "
            "VALUES (%s, %s, %s) "
            "RETURNING id;",
            (user_id, location_id, custom_name)
        )
        saved_id = cur.fetchone()[0]
        
        conn.commit()
        return jsonify({"id": saved_id}), 201
        
    except psycopg2.errors.UniqueViolation:
        return jsonify({"msg": "Location already exists"}), 400
    finally:
        cur.close()
        conn.close()

# Get Saved Locations
@app.route('/locations', methods=['GET'])
@jwt_required()
def get_saved_locations():
    user_id = get_jwt_identity() 
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    try:
        cur.execute(
            "SELECT ul.id, ul.custom_name, l.name, "
            "ST_X(l.geom::geometry) AS lon, ST_Y(l.geom::geometry) AS lat "
            "FROM user_saved_locations ul "
            "JOIN locations l ON ul.location_id = l.id "
            "WHERE ul.user_id = %s;",
            (user_id,)
        )
        locations = cur.fetchall()
        
        locations_list = []
        for loc in locations:
            locations_list.append({
                "id": loc['id'],
                "custom_name": loc['custom_name'],
                "name": loc['name'],
                "lon": loc['lon'],
                "lat": loc['lat']
            })
            
        return jsonify(locations_list), 200
        
    finally:
        cur.close()
        conn.close()

# === ADMIN ===

# Admin check decorator
def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        conn = get_db_connection()
        cur = conn.cursor()
        try:
            cur.execute("SELECT is_admin FROM users WHERE id = %s;", (user_id,))
            user = cur.fetchone()
            if not user or not user[0]:
                return jsonify({"msg": "Admin access required"}), 403
        finally:
            cur.close()
            conn.close()
        return fn(*args, **kwargs)
    return wrapper

# === LOCATIONS CRUD ===

# Create Location (Admin)
@app.route('/admin/locations', methods=['POST'])
@admin_required
def create_location():
    data = request.get_json()
    burmese_name = data.get('burmese_name')
    english_name = data.get('english_name')
    address = data.get('address')
    lon = data.get('lon')
    lat = data.get('lat')
    loc_type = data.get('type')

    if not burmese_name or english_name is None or address is None or lon is None or lat is None:
        return jsonify({"msg": "Missing name or coordinates"}), 400
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute(
            "INSERT INTO locations (burmese_name, english_name, address, geom, type) "
            "VALUES (%s, %s, %s, ST_GeogFromText(%s), %s) "
            "RETURNING id, burmese_name, english_name, address, type;",
            (burmese_name, english_name, address, f"POINT({lon} {lat})", loc_type)
        )
        location = cur.fetchone()
        conn.commit()

        if not location:
            return jsonify({"msg": "Failed to create location, no data returned."}), 500

        return jsonify({
            "id": location['id'],
            "burmese_name": location['burmese_name'],
            "english_name": location['english_name'],
            "address": location['address'],
            "type": location['type'],
            "msg": "Location created"
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"msg": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# Get All Locations (Admin)
@app.route('/admin/locations', methods=['GET'])
@admin_required
def get_all_locations():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute(
            "SELECT id, burmese_name, english_name, address, type, "
            "ST_X(geom::geometry) AS lon, ST_Y(geom::geometry) AS lat "
            "FROM locations;"
        )
        locations = cur.fetchall()
        return jsonify([dict(loc) for loc in locations]), 200
    finally:
        cur.close()
        conn.close()

# Update Location (Admin)
@app.route('/admin/locations/<uuid:location_id>', methods=['PUT'])
@admin_required
def update_location(location_id):
    data = request.get_json()
    updates = []
    params = []

    if 'burmese_name' in data:
        updates.append("burmese_name = %s")
        params.append(data['burmese_name'])

    if 'english_name' in data:
        updates.append("english_name = %s")
        params.append(data['english_name'])

    if 'address' in data:
        updates.append("address = %s")
        params.append(data['address'])
    
    if 'type' in data:
        updates.append("type = %s")
        params.append(data['type'])
    
    if 'lon' in data and 'lat' in data:
        updates.append("geom = ST_GeogFromText(%s)")
        params.append(f"POINT({data['lon']} {data['lat']})")
    
    if not updates:
        return jsonify({"msg": "No updates provided"}), 400
    
    params.append(str(location_id))
    
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        query = f"UPDATE locations SET {', '.join(updates)} WHERE id = %s RETURNING id;"
        cur.execute(query, tuple(params))
        updated = cur.fetchone()
        if not updated:
            return jsonify({"msg": "Location not found"}), 404
            
        conn.commit()
        return jsonify({"msg": "Location updated"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"msg": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# Delete Location (Admin)
@app.route('/admin/locations/<uuid:location_id>', methods=['DELETE'])
@admin_required
def delete_location(location_id):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM locations WHERE id = %s RETURNING id;", (str(location_id),))
        deleted = cur.fetchone()
        if not deleted:
            return jsonify({"msg": "Location not found"}), 404
            
        conn.commit()
        return jsonify({"msg": "Location deleted"}), 200
    except psycopg2.errors.ForeignKeyViolation:
        conn.rollback()
        return jsonify({
            "msg": "Cannot delete location referenced by other records",
            "solution": "Remove dependent records first"
        }), 400
    finally:
        cur.close()
        conn.close()

# === ROADS CRUD ===

# Create Road (Admin)
@app.route('/admin/roads', methods=['POST'])
@admin_required
def create_road():
    data = request.get_json()
    name = data.get('name')
    road_type = data.get('road_type')
    max_speed = data.get('max_speed_kmh')
    is_oneway = data.get('is_oneway', False)
    coordinates = data.get('coordinates')  # [[lon, lat], [lon, lat], ...]
    
    if not coordinates or len(coordinates) < 2:
        return jsonify({"msg": "At least 2 points required"}), 400
    
    # Create LineString WKT
    wkt_coords = ", ".join([f"{point[0]} {point[1]}" for point in coordinates])
    wkt_linestring = f"LINESTRING({wkt_coords})"
    
    # Calculate length (simplified)
    total_length = 0
    for i in range(len(coordinates) - 1):
        total_length += calculate_distance(coordinates[i], coordinates[i+1])
    
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO roads (geom, length_m, max_speed_kmh, road_type, is_oneway, name) "
            "VALUES (ST_GeogFromText(%s), %s, %s, %s, %s, %s) "
            "RETURNING id;",
            (f"SRID=4326;{wkt_linestring}", total_length, max_speed, road_type, is_oneway, name)
        )
        road_id = cur.fetchone()[0]
        conn.commit()
        
        # Rebuild graph since road network changed
        road_graph.build_graph()
        
        return jsonify({
            "id": road_id,
            "length": total_length,
            "msg": "Road created"
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"msg": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# Get All Roads (Admin)
@app.route('/admin/roads', methods=['GET'])
@admin_required
def get_all_roads():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        cur.execute(
            "SELECT id, name, road_type, max_speed_kmh, is_oneway, length_m, "
            "ST_AsGeoJSON(geom::geometry) AS geojson "
            "FROM roads;"
        )
        roads = cur.fetchall()
        
        result = []
        for road in roads:
            road_dict = dict(road)
            road_dict['geojson'] = json.loads(road['geojson'])
            result.append(road_dict)
            
        return jsonify(result), 200
    finally:
        cur.close()
        conn.close()

# Update Road (Admin)
@app.route('/admin/roads/<int:road_id>', methods=['PUT'])
@admin_required
def update_road(road_id):
    data = request.get_json()
    updates = []
    params = []
    
    if 'name' in data:
        updates.append("name = %s")
        params.append(data['name'])
    
    if 'road_type' in data:
        updates.append("road_type = %s")
        params.append(data['road_type'])
    
    if 'max_speed_kmh' in data:
        updates.append("max_speed_kmh = %s")
        params.append(data['max_speed_kmh'])
    
    if 'is_oneway' in data:
        updates.append("is_oneway = %s")
        params.append(data['is_oneway'])
    
    if 'coordinates' in data:
        if len(data['coordinates']) < 2:
            return jsonify({"msg": "At least 2 points required"}), 400
            
        wkt_coords = ", ".join([f"{point[0]} {point[1]}" for point in data['coordinates']])
        wkt_linestring = f"LINESTRING({wkt_coords})"
        updates.append("geom = ST_GeogFromText(%s)")
        params.append(f"SRID=4326;{wkt_linestring}")
        
        # Recalculate length
        total_length = 0
        for i in range(len(data['coordinates']) - 1):
            total_length += calculate_distance(data['coordinates'][i], data['coordinates'][i+1])
        updates.append("length_m = %s")
        params.append(total_length)
    
    if not updates:
        return jsonify({"msg": "No updates provided"}), 400
    
    params.append(road_id)
    
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        query = f"UPDATE roads SET {', '.join(updates)} WHERE id = %s RETURNING id;"
        cur.execute(query, tuple(params))
        updated = cur.fetchone()
        if not updated:
            return jsonify({"msg": "Road not found"}), 404
            
        conn.commit()
        
        # Rebuild graph if geometry changed
        if 'coordinates' in data:
            road_graph.build_graph()
            
        return jsonify({"msg": "Road updated"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"msg": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# Delete Road (Admin)
@app.route('/admin/roads/<int:road_id>', methods=['DELETE'])
@admin_required
def delete_road(road_id):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM roads WHERE id = %s RETURNING id;", (road_id,))
        deleted = cur.fetchone()
        if not deleted:
            return jsonify({"msg": "Road not found"}), 404
            
        conn.commit()
        
        # Rebuild graph since road network changed
        road_graph.build_graph()
        
        return jsonify({"msg": "Road deleted"}), 200
    except psycopg2.errors.ForeignKeyViolation:
        conn.rollback()
        return jsonify({
            "msg": "Cannot delete road referenced by traffic or routes",
            "solution": "Delete dependent records first"
        }), 400
    finally:
        cur.close()
        conn.close()

# === ADMIN USER MANAGEMENT ===

# Make User Admin
@app.route('/admin/users/<int:user_id>/make-admin', methods=['POST'])
@admin_required
def make_user_admin(user_id):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "UPDATE users SET is_admin = TRUE WHERE id = %s RETURNING id;",
            (user_id,)
        )
        updated = cur.fetchone()
        if not updated:
            return jsonify({"msg": "User not found"}), 404
            
        conn.commit()
        return jsonify({"msg": "User granted admin privileges"}), 200
    finally:
        cur.close()
        conn.close()
        
# Health Check
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "nodes": len(road_graph.nodes)})

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"msg": "Resource not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    app.logger.error(f"Server error: {str(error)}")
    return jsonify({"msg": "Internal server error"}), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000, debug=True)