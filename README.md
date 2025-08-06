# Maubin-Routing-AI

An intelligent routing system for Maubin and surrounding areas, built with AI-powered route optimization. This project provides smart navigation solutions to help users find the most efficient routes in the Maubin region of Myanmar.

## 🚀 Features

- **JWT Authentication System** - Secure user registration and login
- **Real-time Route Planning** - Dijkstra's algorithm for optimal pathfinding
- **Spatial Database Integration** - PostGIS with Supabase for geographic data
- **Admin Dashboard** - Location and route management interface
- **User Profiles** - Personal route history and saved locations
- **RESTful API** - Clean API design for frontend integration
- **Modern Web Interface** - Responsive Next.js frontend

## 🏗️ Project Structure

```Structure
Maubin-Routing-AI/
├── README.md
├── .gitignore
├── nextjs-frontend/          # Next.js React frontend
│   └── (frontend code)
├── python-api/               # Flask Python backend
│   ├── app.py               # Main Flask application
│   ├── requirements.txt     # Python dependencies
│   ├── README.md            # API documentation
│   └── .env                 # Environment variables (Supabase config)
└── postgresql-db/           # Database schema (for reference)
    └── initdb/              # SQL scripts for Supabase setup
        ├── 01-extensions.sql
        └── 02-tables.sql
```

## 🛠️ Technology Stack

### Backend (Python API)

- **Flask** - Lightweight Python web framework
- **Flask-JWT-Extended** - JWT authentication system
- **PostGIS** - Spatial database extension for PostgreSQL
- **Supabase** - Cloud PostgreSQL database with PostGIS
- **Geopy** - Geographic calculations and distance computation
- **Python 3.11+** - Programming language

### Frontend (Next.js)

- **Next.js** - React framework
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

## 📋 Prerequisites

Before running this project, make sure you have:

- **Python 3.11+** installed
- **Node.js 18+** and npm/yarn installed
- **Git** for version control
- **Supabase account** for cloud database (or local PostgreSQL with PostGIS)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/aung-khantkyaw/Maubin-Routing-AI.git
cd Maubin-Routing-AI
```

### 2. Setup Python API

```bash
cd python-api

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows (Git Bash)
source venv/Scripts/activate
# On Windows (Command Prompt)
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your Supabase credentials
# Copy .env.example to .env and fill in your database details

# Run the Flask API
python app.py
```

The API will be available at `http://localhost:5000`

**Database Setup:**

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Enable PostGIS extension in your Supabase SQL editor:

   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```

3. Run the database schema from `postgresql-db/initdb/` scripts in your Supabase SQL editor
4. Add your Supabase credentials to the `.env` file

### 3. Setup Next.js Frontend

```bash
cd nextjs-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

The Python API provides comprehensive route planning and location management:

| Category | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| **Auth** | POST | `/register` | User registration |
| **Auth** | POST | `/login` | User authentication |
| **Auth** | POST | `/logout` | User logout |
| **Auth** | POST | `/refresh-token` | Refresh access token |
| **Routes** | POST | `/routes` | Calculate optimal route |
| **User** | GET | `/profile` | Get user profile |
| **User** | GET | `/history` | Get route history |
| **User** | GET/POST | `/locations` | Manage saved locations |
| **Admin** | GET/POST/PUT/DELETE | `/admin/locations` | Location management |

### Example Route Planning Request

```json
{
  "start_lon": 95.6530,
  "start_lat": 16.7300,
  "end_lon": 95.6550,
  "end_lat": 16.7320,
  "start_name": "Maubin Market",
  "end_name": "Maubin Bridge"
}
```

### Example Route Response

```json
{
  "route_id": "123e4567-e89b-12d3-a456-426614174000",
  "distance": 1250.5,
  "estimated_time": 250.1,
  "route": {
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": [[95.6530, 16.7300], [95.6550, 16.7320]]
    }
  }
}
```

## 🌍 Coverage Areas

Current routing coverage includes:

- **Maubin** (Primary hub)
- More areas coming soon...

## 🐛 Known Issues

- Route optimization is limited to basic Dijkstra's algorithm
- Real-time traffic data integration not yet implemented
- Mobile app version in development
- Limited to Maubin region road network data
