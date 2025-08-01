# Maubin Routing AI - Python API

A Flask-based REST API for the Maubin Routing AI system with PostgreSQL and PostGIS spatial database support.

## Features

- **Spatial Database**: PostgreSQL with PostGIS extension for geographic data
- **Location Management**: Points of Interest (POIs) with spatial queries
- **Road Network**: Road segments with geometry and traffic data
- **Real-time Traffic**: Traffic conditions and congestion monitoring
- **AI Routing**: Route optimization with multiple algorithms
- **User Management**: User accounts and route history

## Database Schema

The system uses the following spatial tables:
- **users**: User accounts
- **locations**: Points of Interest (POIs) with geographic coordinates
- **roads**: Road network segments with line geometry
- **traffic**: Real-time traffic data for roads
- **routes**: AI-generated routes with optimization parameters

## Setup

### 1. Prerequisites

- Python 3.8+
- PostgreSQL 12+
- PostGIS extension

### 2. Install PostgreSQL and PostGIS

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib postgis postgresql-12-postgis-3
```

**macOS:**
```bash
brew install postgresql postgis
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### 3. Create Virtual Environment

```bash
python -m venv venv
```

### 4. Activate Virtual Environment

```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 5. Install Dependencies

```bash
pip install -r requirements.txt
```

### 6. Database Configuration

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=maubin_routing_db
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/maubin_routing_db
SECRET_KEY=your-secret-key-here
```

### 7. Initialize Database

```bash
python init_db.py
```

This script will:
- Create the database if it doesn't exist
- Install PostGIS extensions
- Create sample data for testing

### 8. Run the Application

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Core Endpoints
- `GET /` - Welcome message and API overview
- `GET /health` - Health check with database status

### Locations (POIs)
- `GET /api/locations` - Get all locations or search by radius
- `POST /api/locations` - Create new location

**Query Parameters:**
- `type`: Filter by location type (restaurant, hospital, gas_station, landmark, other)
- `lat`, `lng`: Center point for radius search
- `radius`: Search radius in meters (default: 1000)

### Roads
- `GET /api/roads` - Get all road segments
- `POST /api/roads` - Create new road segment

### Traffic
- `GET /api/traffic` - Get traffic data
- `POST /api/traffic` - Create new traffic data

**Query Parameters:**
- `road_id`: Filter by specific road

### Routes
- `GET /api/routes` - Get all routes
- `POST /api/routes` - Create new route request
- `GET /api/routes/<route_id>` - Get specific route

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user

## Example Usage

### Create a Location
```bash
curl -X POST "http://localhost:5000/api/locations" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Maubin Central Market",
       "address": "Maubin, Ayeyarwady Region, Myanmar",
       "lat": 16.7314,
       "lng": 95.6544,
       "type": "landmark"
     }'
```

### Find Locations Near a Point
```bash
curl "http://localhost:5000/api/locations?lat=16.7314&lng=95.6544&radius=1000"
```

### Create a Route
```bash
curl -X POST "http://localhost:5000/api/routes" \
     -H "Content-Type: application/json" \
     -d '{
       "start_lat": 16.7300,
       "start_lng": 95.6530,
       "end_lat": 16.7320,
       "end_lng": 95.6550,
       "optimization_type": "fastest",
       "avoid_tolls": false,
       "wheelchair_accessible": false
     }'
```

## Spatial Queries

The API supports PostGIS spatial queries:

- **Radius Search**: Find locations within a specified radius
- **Distance Calculations**: Calculate distances between points
- **Geographic Filtering**: Filter data by geographic boundaries

## Development

The Flask app runs in debug mode by default, so changes will be automatically reloaded.

### Database Migrations

For production, consider using Alembic for database migrations:

```bash
pip install alembic
alembic init migrations
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### Testing

Create test data and verify spatial queries:

```bash
python init_db.py  # Creates sample data
curl http://localhost:5000/api/locations  # Test location endpoints
```

## Production Deployment

For production deployment:

1. Use a production WSGI server (Gunicorn)
2. Set up proper environment variables
3. Configure database connection pooling
4. Enable HTTPS
5. Set up monitoring and logging
6. Implement proper authentication and authorization