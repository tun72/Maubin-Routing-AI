from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import psycopg2
import psycopg2.extras
from geopy.distance import great_circle
import os
import uuid
import math
import json
from dotenv import load_dotenv
import datetime
from functools import wraps

app = Flask(__name__)
load_dotenv()
CORS(app, origins=os.environ.get('ORIGIN').split(","), supports_credentials=True)
app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_SECRET')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(days=7)
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

        def get_or_create_node(coord, node_map, threshold=0.001): 
            for existing in node_map:
                if calculate_distance(coord, existing) < threshold:
                    return existing
            return coord

        self.nodes = {}
        self.edges = {}

        cur.execute("SELECT id, ST_AsText(geom) AS wkt, length_m, is_oneway FROM roads;")
        roads = cur.fetchall()

        for road in roads:
            road_id = road['id']
            wkt = road['wkt']
            segment_lengths = road['length_m']  
            is_oneway = road['is_oneway']

            coords_str = wkt.replace('LINESTRING(', '').replace(')', '')
            coords_list = [tuple(map(float, c.split())) for c in coords_str.split(',')]

            snapped_coords = []
            for coord in coords_list:
                snapped = get_or_create_node(coord, self.nodes)
                if snapped not in self.nodes:
                    self.nodes[snapped] = []
                snapped_coords.append(snapped)

            for i in range(len(snapped_coords) - 1):
                start_node = snapped_coords[i]
                end_node = snapped_coords[i + 1]

                if segment_lengths and i < len(segment_lengths):
                    segment_length = segment_lengths[i]
                else:
                    segment_length = calculate_distance(start_node, end_node)

                self.nodes[start_node].append(end_node)
                self.edges[(start_node, end_node)] = {
                    'id': road_id,
                    'length': segment_length,
                    'geometry': [start_node, end_node]
                }

                if not is_oneway:
                    self.nodes[end_node].append(start_node)
                    self.edges[(end_node, start_node)] = {
                        'id': road_id,
                        'length': segment_length,
                        'geometry': [end_node, start_node]
                    }

        app.logger.info(f"Road graph built with {len(self.nodes)} nodes and {len(self.edges)} edges")

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
            app.logger.warning(f"No nearby node found within {max_distance}m for point {point}")
            return None

        app.logger.info(f"Found nearest node at {min_distance:.2f}m for point {point}")
        return nearest_node
    
    def dijkstra(self, start, end):        
        start_node = self.find_nearest_node(start)
        end_node = self.find_nearest_node(end)
        
        if start_node is None or end_node is None:
            app.logger.warning(f"Couldn't find nearest node: start={start}, end={end}")
            return None, 0, []
        
        distances = {node: float('inf') for node in self.nodes}
        previous_nodes = {node: None for node in self.nodes}
        distances[start_node] = 0
        
        unvisited = set(self.nodes.keys())
        
        while unvisited:
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
        
        if previous_nodes.get(end_node) is None:
            app.logger.warning(f"No path found: start={start} end={end}")
            return None, 0, []
        
        path = []
        current = end_node
        while current:
            path.insert(0, current)
            current = previous_nodes.get(current)
        
        line_coords = []
        road_segments = []
        
        line_coords.append(start)
        
        start_to_first_node_distance = calculate_distance(start, start_node)
        
        if start != start_node and start_to_first_node_distance > 0:
            road_segments.append({
                'road_id': 'user_to_road',
                'length': start_to_first_node_distance,
                'type': 'user_segment',
                'from': start,
                'to': start_node
            })
        
        if start != start_node:
            line_coords.append(start_node)
        
        for i in range(len(path) - 1):
            edge_key = (path[i], path[i+1])
            if edge_key in self.edges:
                edge = self.edges[edge_key]
                line_coords.append(edge['geometry'][1])
                
                road_segments.append({
                    'road_id': edge['id'],
                    'length': edge['length']
                })
            else:
                segment_distance = calculate_distance(path[i], path[i+1])
                line_coords.append(path[i+1])
                
                road_segments.append({
                    'road_id': 'unknown_road',
                    'length': segment_distance,
                    'type': 'unknown_segment',
                    'from': path[i],
                    'to': path[i+1]
                })
        
        end_node_to_end_distance = calculate_distance(end_node, end)
        
        if end != end_node and end_node_to_end_distance > 0:
            road_segments.append({
                'road_id': 'road_to_user',
                'length': end_node_to_end_distance,
                'type': 'user_segment',
                'from': end_node,
                'to': end
            })
        
        if not line_coords or line_coords[-1] != end:
            line_coords.append(end)
        
        total_distance = start_to_first_node_distance + distances[end_node] + end_node_to_end_distance
        
        return line_coords, total_distance, road_segments

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

# === AUTHENTICATION ===

# User Registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not email or not password:
        return jsonify({"is_success": False ,"msg": "Missing required fields"}), 400
    
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
        return jsonify({"id": user_id, "is_success": True, "msg": "User created successfully"}), 201
    except psycopg2.errors.UniqueViolation:
        return jsonify({"is_success": False, "msg": "Username or email already exists"}), 400
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
        
        cur.close()
        conn.close()
        
        user_dict = dict(user)
        user_dict.pop('password_hash', None)
        return jsonify({"is_success": True, "access_token": access_token, "user": user_dict}), 200

    cur.close()
    conn.close()
    return jsonify({"is_success": False, "msg": "Invalid credentials"}), 401

# User Logout
@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({"is_success": True, "msg": "Successfully logged out"}), 200

# === USER ===

# User Profile
@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    try:
        cur.execute("SELECT id, username, email, is_admin, last_login FROM users WHERE id = %s;", (user_id,))
        user = cur.fetchone()
        
        if not user:
            return jsonify({"is_success": False, "msg": "User not found"}), 404

        user_dict = dict(user)
        user_dict['last_login'] = user_dict['last_login'].isoformat() if user_dict['last_login'] else None

        return jsonify({"is_success": True, "user": user_dict}), 200

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
        return jsonify({"is_success": True, "msg": "Profile updated successfully"}), 200

    except Exception as e:
        conn.rollback()
        app.logger.error(f"Database error: {str(e)}")
        return jsonify({"is_success": False, "msg": "Failed to update profile"}), 500

    finally:
        cur.close()
        conn.close()

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
        return jsonify({"is_success": False, "msg": "Missing coordinates"}), 400

    try:
        start_point = (float(start_lon), float(start_lat))
        end_point = (float(end_lon), float(end_lat))
    except ValueError:
        return jsonify({"is_success": False, "msg": "Invalid coordinates"}), 400
    
    path_coords, total_distance, road_segments = road_graph.dijkstra(start_point, end_point)

    if not path_coords or len(path_coords) < 2:
        return jsonify({
            "is_success": False,
            "msg": "No valid route found between the points",
            "suggestion": "Try closer points or check road network data"
        }), 404

    road_names = []
    start_location = None
    end_location = None
    step_locations = []
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        if road_segments:
            for segment in road_segments:
                road_id = str(segment['road_id'])
                
                if segment['road_id'] in ['user_to_road', 'road_to_user']:
                    if segment['road_id'] == 'user_to_road':
                        road_names.append({
                            'road_id': road_id,
                            'burmese_name': 'စတင်သည့်နေရာမှအနီးဆုံးသတ်မှတ်နေရာသို့',
                            'english_name': 'From Start Location to Nearest Defined Location',
                            'length': f"{segment['length']} meters",
                            'type': 'user_segment'
                        })
                    else: 
                        road_names.append({
                            'road_id': road_id,
                            'burmese_name': 'အနီးဆုံးသတ်မှတ်နေရာမှပြီးဆုံးနေရာသို့',
                            'english_name': 'From Nearest Defined Location to End Location',
                            'length': f"{segment['length']} meters",
                            'type': 'user_segment'
                        })
                elif segment['road_id'] == 'unknown_road':
                    road_names.append({
                        'road_id': road_id,
                        'burmese_name': 'အမည်မသိလမ်း',
                        'english_name': 'Unknown Road Segment',
                        'length': f"{segment['length']} meters",
                        'type': 'unknown_segment'
                    })
                else:
                    cur.execute(
                        "SELECT id, burmese_name, english_name FROM roads WHERE id::text = %s;",
                        (road_id,)
                    )
                    road_data = cur.fetchone()
                    if road_data:
                        road_names.append({
                            'road_id': road_id,
                            'burmese_name': road_data['burmese_name'],
                            'english_name': road_data['english_name'],
                            'length': f"{segment['length']} meters"
                        })
                    else:
                        road_names.append({
                            'road_id': road_id,
                            'burmese_name': 'အမည်မသိလမ်း',
                            'english_name': 'Unknown Road',
                            'length': f"{segment['length']} meters"
                        })

        cur.execute(
            "SELECT burmese_name, english_name, address, ST_X(geom::geometry) AS lon, ST_Y(geom::geometry) AS lat "
            "FROM locations;"
        )
        locations = cur.fetchall()

        def find_nearest_location(point, locations, max_dist=500):
            min_dist = float('inf')
            nearest = None
            for loc in locations:
                dist = calculate_distance(point, (loc['lon'], loc['lat']))
                if dist < min_dist and dist <= max_dist:
                    min_dist = dist
                    nearest = loc
            return nearest

        nearest_start_location = find_nearest_location(start_point, locations)
        nearest_end_location = find_nearest_location(end_point, locations)
        
        close_start_location = find_nearest_location(start_point, locations, max_dist=50)
        close_end_location = find_nearest_location(end_point, locations, max_dist=50)
        
        if close_start_location:
            start_location = {
                "burmese_name": close_start_location["burmese_name"],
                "english_name": close_start_location["english_name"],
                "address": close_start_location["address"],
                "longitude": close_start_location["lon"],
                "latitude": close_start_location["lat"],
                "type": "defined_location"
            }
        else:
            start_location = {
                "longitude": start_point[0],
                "latitude": start_point[1],
                "coordinates": f"{start_point[0]}, {start_point[1]}",
                "type": "user_input"
            }
        
        if close_end_location:
            end_location = {
                "burmese_name": close_end_location["burmese_name"],
                "english_name": close_end_location["english_name"],
                "address": close_end_location["address"],
                "longitude": close_end_location["lon"],
                "latitude": close_end_location["lat"],
                "type": "defined_location"
            }
        else:
            end_location = {
                "longitude": end_point[0],
                "latitude": end_point[1],
                "coordinates": f"{end_point[0]}, {end_point[1]}",
                "type": "user_input"
            }
        
        added_locations = set() 
        
        for i, coord in enumerate(path_coords):
            if i > 0 and coord == path_coords[i-1]:
                continue
            
            coord_key = f"{coord[0]:.7f},{coord[1]:.7f}"
            if coord_key in added_locations:
                continue
                
            if i == 0:
                if close_start_location:
                    step_locations.append({
                        "burmese_name": close_start_location["burmese_name"],
                        "english_name": close_start_location["english_name"],
                        "address": close_start_location["address"],
                        "longitude": close_start_location["lon"],
                        "latitude": close_start_location["lat"],
                        "type": "defined_location"
                    })
                    added_locations.add(f"{close_start_location['lon']:.7f},{close_start_location['lat']:.7f}")
                else:
                    step_locations.append({
                        "longitude": coord[0],
                        "latitude": coord[1],
                        "coordinates": f"{coord[0]}, {coord[1]}",
                        "type": "user_input_start"
                    })
                    added_locations.add(coord_key)
            elif i == len(path_coords) - 1:
                if close_end_location:
                    close_coord_key = f"{close_end_location['lon']:.7f},{close_end_location['lat']:.7f}"
                    if close_coord_key not in added_locations:
                        step_locations.append({
                            "burmese_name": close_end_location["burmese_name"],
                            "english_name": close_end_location["english_name"],
                            "address": close_end_location["address"],
                            "longitude": close_end_location["lon"],
                            "latitude": close_end_location["lat"],
                            "type": "defined_location"
                        })
                        added_locations.add(close_coord_key)
                else:
                    if coord_key not in added_locations:
                        step_locations.append({
                            "longitude": coord[0],
                            "latitude": coord[1], 
                            "coordinates": f"{coord[0]}, {coord[1]}",
                            "type": "user_input_end"
                        })
                        added_locations.add(coord_key)
            else:
                loc = find_nearest_location(coord, locations)
                if loc:
                    loc_coord_key = f"{loc['lon']:.7f},{loc['lat']:.7f}"
                    if loc_coord_key not in added_locations:
                        step_locations.append({
                            "burmese_name": loc["burmese_name"],
                            "english_name": loc["english_name"],
                            "address": loc["address"],
                            "longitude": loc["lon"],
                            "latitude": loc["lat"],
                            "type": "defined_location"
                        })
                        added_locations.add(loc_coord_key)
                else:
                    if coord_key not in added_locations:
                        step_locations.append({
                            "longitude": coord[0],
                            "latitude": coord[1],
                            "coordinates": f"{coord[0]}, {coord[1]}",
                            "type": "road_point"
                        })
                        added_locations.add(coord_key)
    finally:
        cur.close()
        conn.close()

    geojson_route = {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "LineString",
            "coordinates": [[lon, lat] for lon, lat in path_coords] 
        }
    }

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        wkt_coords = ", ".join([f"{lon} {lat}" for lat, lon in path_coords])
        wkt_linestring = f"LINESTRING({wkt_coords})"

        estimated_time = total_distance / 5.0  

        cur.execute(
            "INSERT INTO routes (user_id, start_loc, end_loc, "
            "total_distance_m, estimated_time_s, geom) "
            "VALUES (%s, ST_GeogFromText(%s), ST_GeogFromText(%s), "
            "%s, %s, ST_GeogFromText(%s)) "
            "RETURNING id;",
            (
                user_id,
                f"SRID=4326;POINT({start_lon} {start_lat})",
                f"SRID=4326;POINT({end_lon} {end_lat})",
                total_distance,
                estimated_time,
                f"SRID=4326;{wkt_linestring}"
            )
        )
        route_id = cur.fetchone()[0]

        cur.execute(
            "INSERT INTO user_route_history (user_id, route_id, "
            "start_name, end_name, total_distance_m, duration_min) "
            "VALUES (%s, %s, %s, %s, %s, %s);",
            (
                user_id,
                route_id,
                (nearest_start_location['burmese_name'] if nearest_start_location else data.get('start_name', 'Start')),
                (nearest_end_location['burmese_name'] if nearest_end_location else data.get('end_name', 'End')),
                total_distance,
                estimated_time / 60
            )
        )
        
        conn.commit()
        
        response = {
            "is_success": True,
            "route_id": route_id,
            "distance": total_distance,
            "estimated_time": estimated_time,
            "route": geojson_route,
            "road_names": road_names,
            "step_locations": step_locations,
            "start_location": start_location,
            "end_location": end_location
        }
        return jsonify(response), 200

    except Exception as e:
        conn.rollback()
        app.logger.error(f"Database error: {str(e)}")
        return jsonify({"is_success": False, "msg": "Error saving route", "error": str(e)}), 500
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
            "SELECT "
            "h.history_id, h.route_id, h.accessed_at, h.start_name, h.end_name, "
            "h.total_distance_m, h.duration_min, ST_AsGeoJSON(r.geom::geometry) AS geojson "
            "FROM user_route_history h "
            "JOIN routes r ON h.route_id = r.id "
            "WHERE h.user_id = %s "
            "ORDER BY h.accessed_at DESC "
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
                "duration": item['duration_min'],
                "route": json.loads(item['geojson']) if item['geojson'] else None
            })

        return jsonify({"is_success": True, "history": history_list}), 200

    finally:
        cur.close()
        conn.close()

# Save Location
@app.route('/locations', methods=['POST'])
@jwt_required()
def save_location():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    burmese_name = data.get('burmese_name')
    english_name = data.get('english_name')
    address = data.get('address')
    lon = data.get('lon')
    lat = data.get('lat')
    type = data.get('type')

    if not burmese_name or english_name is None or address is None or lon is None or lat is None or type is None:
        return jsonify({"is_success": False, "msg": "Missing required fields"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    
    try:        
        cur.execute(
            "INSERT INTO locations (burmese_name, english_name, address, geom, type) "
            "VALUES (%s, %s, %s, ST_GeogFromText(%s), %s) "
            "RETURNING id;",
            (burmese_name, english_name, address, f"SRID=4326;POINT({lon} {lat})", type)
        )
        location_id = cur.fetchone()[0]

        custom_name = data.get('custom_name', burmese_name)
        cur.execute(
            "INSERT INTO user_saved_locations (user_id, location_id, custom_name) "
            "VALUES (%s, %s, %s) "
            "RETURNING id;",
            (user_id, location_id, custom_name)
        )
        saved_id = cur.fetchone()[0]
        
        conn.commit()
        return jsonify({"is_success": True, "id": saved_id}), 201

    except psycopg2.errors.UniqueViolation:
        return jsonify({"is_success": False, "msg": "Location already exists"}), 400
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
            "SELECT ul.id, ul.custom_name, l.burmese_name, l.english_name, l.address, "
            "ST_X(l.geom::geometry) AS lon, ST_Y(l.geom::geometry) AS lat, l.type, ul.created_at "
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
                "burmese_name": loc['burmese_name'],
                "english_name": loc['english_name'],
                "address": loc['address'],
                "lon": loc['lon'],
                "lat": loc['lat'],
                "type": loc['type'],
                "created_at": loc['created_at'].isoformat()
            })

        return jsonify({"is_success": True, "locations": locations_list}), 200

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
            (burmese_name, english_name, address, f"SRID=4326;POINT({lon} {lat})", loc_type)
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
            "ST_X(ST_GeomFromEWKB(geom::geometry)) AS lon, ST_Y(ST_GeomFromEWKB(geom::geometry)) AS lat "
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
        params.append(f"SRID=4326;POINT({data['lon']} {data['lat']})::geometry")
    
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
    burmese_name = data.get('burmese_name')
    english_name = data.get('english_name')
    coordinates = data.get('coordinates')
    length_m = data.get('length_m')
    road_type = data.get('road_type')
    is_oneway = data.get('is_oneway', False)
    
    if not isinstance(coordinates, list) or len(coordinates) < 2:
        return jsonify({"msg": "At least 2 coordinate points required (list of [lon, lat])"}), 400

    if not isinstance(length_m, list) or len(length_m) != len(coordinates) - 1:
        return jsonify({"msg": "Length must be an array with one less element than coordinates"}), 400

    validated_coords = []
    for idx, point in enumerate(coordinates):
        if not isinstance(point, (list, tuple)) or len(point) != 2:
            return jsonify({"msg": f"Coordinate at index {idx} must be a list/tuple of [lon, lat], got: {point}"}), 400
        try:
            lon = float(point[0])
            lat = float(point[1])
        except (ValueError, TypeError):
            return jsonify({"msg": f"Coordinate at index {idx} contains non-numeric values: {point}"}), 400
        validated_coords.append((lon, lat))

    if len(validated_coords) < 2:
        return jsonify({"msg": "At least 2 valid coordinate points required"}), 400

    wkt_coords = ", ".join([f"{lon} {lat}" for lon, lat in validated_coords])
    wkt_linestring = f"LINESTRING({wkt_coords})"
    
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO roads (geom, length_m, road_type, is_oneway, burmese_name, english_name) "
            "VALUES (ST_GeogFromText(%s), %s, %s, %s, %s, %s) "
            "RETURNING id;",
            (f"SRID=4326;{wkt_linestring}", length_m, road_type, is_oneway, burmese_name, english_name)
        )
        road_id = cur.fetchone()[0]
        conn.commit()

        road_graph.build_graph()

        return jsonify({
            "id": road_id,
            "segment_lengths": length_m,
            "total_length": sum(length_m),
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
            "SELECT id, burmese_name, english_name, road_type, is_oneway, length_m, "
            "ST_AsGeoJSON(geom::geometry) AS geojson "
            "FROM roads;"
        )
        roads = cur.fetchall()
        
        result_roads = []
        for road in roads:
            road_dict = dict(road)
            if road_dict['length_m'] and isinstance(road_dict['length_m'], list):
                road_dict['total_length'] = sum(road_dict['length_m'])
            else:
                road_dict['total_length'] = road_dict['length_m'] or 0
            result_roads.append(road_dict)
            
        return jsonify(result_roads), 200
    finally:
        cur.close()
        conn.close()

# Update Road (Admin)
@app.route('/admin/roads/<uuid:road_id>', methods=['PUT'])
@admin_required
def update_road(road_id):
    data = request.get_json()
    updates = []
    params = []

    if 'burmese_name' in data:
        updates.append("burmese_name = %s")
        params.append(data['burmese_name'])

    if 'english_name' in data:
        updates.append("english_name = %s")
        params.append(data['english_name'])

    if 'length_m' in data:
        length_data = data['length_m']
        if isinstance(length_data, list):
            updates.append("length_m = %s")
            params.append(length_data)
        else:
            updates.append("length_m = %s")
            params.append([length_data])

    if 'road_type' in data:
        updates.append("road_type = %s")
        params.append(data['road_type'])
    
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
    
    if not updates:
        return jsonify({"msg": "No updates provided"}), 400
    
    params.append(str(road_id))
    
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        query = f"UPDATE roads SET {', '.join(updates)} WHERE id = %s RETURNING id;"
        cur.execute(query, tuple(params))
        updated = cur.fetchone()
        if not updated:
            return jsonify({"is_success": False, "msg": "Road not found"}), 404

        conn.commit()
        
        if 'coordinates' in data:
            road_graph.build_graph()
            
        return jsonify({"is_success": True, "msg": "Road updated"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"is_success": False, "msg": str(e)}), 500
    finally:
        cur.close()
        conn.close()

# Delete Road (Admin)
@app.route('/admin/roads/<uuid:road_id>', methods=['DELETE'])
@admin_required
def delete_road(road_id):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        road_id_str = str(road_id)
        cur.execute("DELETE FROM roads WHERE id = %s RETURNING id;", (road_id_str,))
        deleted = cur.fetchone()
        if not deleted:
            return jsonify({"is_success": False,"msg": "Road not found"}), 404

        conn.commit()
        
        road_graph.build_graph()

        return jsonify({"is_success": True,"msg": "Road deleted"}), 200
    except psycopg2.errors.ForeignKeyViolation:
        conn.rollback()
        return jsonify({
            "is_success": False,
            "msg": "Cannot delete road referenced by traffic or routes",
            "solution": "Delete dependent records first"
        }), 400
    finally:
        cur.close()
        conn.close()

# === ADMIN USER MANAGEMENT ===

# Make User Admin
@app.route('/admin/users/<uuid:user_id>/make-admin', methods=['POST'])
@admin_required
def make_user_admin(user_id):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        user_id_str = str(user_id)
        cur.execute(
            "UPDATE users SET is_admin = TRUE WHERE id = %s RETURNING id;",
            (user_id_str,)
        )
        updated = cur.fetchone()
        if not updated:
            return jsonify({"is_success": False,"msg": "User not found"}), 404
            
        conn.commit()
        return jsonify({"is_success": True,"msg": "User granted admin privileges"}), 200
    finally:
        cur.close()
        conn.close()
        
# Health Check
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "nodes": len(road_graph.nodes)})

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"is_success": False,"msg": "Resource not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    app.logger.error(f"Server error: {str(error)}")
    return jsonify({"is_success": False,"msg": "Internal server error"}), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)