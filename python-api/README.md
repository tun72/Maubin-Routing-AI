# Maubin Routing AI - Backend API

A Flask-based REST API for route planning and location management in Maubin, Myanmar. Features JWT authentication, spatial data processing with PostGIS, and efficient route calculation using Dijkstra's algorithm.

## Tech Stack

- **Backend**: Flask (Python)
- **Database**: PostgreSQL with PostGIS extension
- **Authentication**: JWT (Access & Refresh Tokens)
- **Deployment**: Render/Railway compatible
- **CORS**: Configured for frontend integration

## Features

### 🔐 Authentication System

- User registration and login
- JWT-based authentication with refresh tokens
- Role-based access control (Admin/User)
- Secure logout with token revocation

### 🗺️ Route Planning

- Dijkstra's algorithm for shortest path calculation
- Real-time route computation between any two points
- Geographic distance calculations using Haversine formula
- Road network graph optimization

### 📍 Location Management

- User-specific saved locations
- Admin CRUD operations for global locations
- Bilingual support (Myanmar/English names)
- PostGIS spatial indexing for performance

### 📊 User Data

- Personal route history tracking
- Location favorites and custom names
- User profile management

## Quick Start

### Prerequisites

- Python 3.12+ (recommended for deployment compatibility)
- PostgreSQL 14+ with PostGIS extension

### Installation

1. **Clone and navigate to API directory**

```bash
git clone <repository-url>
cd python-api
```

2. **Set up virtual environment**

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Environment configuration**

Create a `.env` file:

```env
# Database (Supabase/PostgreSQL)
DB_HOST=your-database-host
DB_NAME=postgres
DB_USER=your-username
DB_PASSWORD=your-password
DB_PORT=5432

# Security
JWT_SECRET=your-super-secret-jwt-key

# Frontend CORS
ORIGIN=http://localhost:3000,http://localhost:5173
```

5. **Start development server**

```bash
python app.py
```

API runs on `http://localhost:5000`

## API Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Create new user account | ❌ |
| POST | `/login` | Authenticate user | ❌ |
| POST | `/refresh-token` | Get new access token | 🔄 Refresh |
| POST | `/logout` | Revoke refresh token | ✅ |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Get user profile | ✅ |
| PUT | `/profile` | Update user profile | ✅ |
| GET | `/history` | Get route history | ✅ |
| GET | `/locations` | Get saved locations | ✅ |
| POST | `/locations` | Save new location | ✅ |

### Route Planning

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/routes` | Calculate route between points | ✅ |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/locations` | List all locations | 👑 Admin |
| POST | `/admin/locations` | Create location | 👑 Admin |
| PUT | `/admin/locations/<id>` | Update location | 👑 Admin |
| DELETE | `/admin/locations/<id>` | Delete location | 👑 Admin |

## Request Examples

### User Registration
```bash
curl -X POST "http://localhost:5000/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### User Login
```bash
curl -X POST "http://localhost:5000/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Plan Route
```bash
curl -X POST "http://localhost:5000/routes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "start_lon": 95.6530,
    "start_lat": 16.7300,
    "end_lon": 95.6550,
    "end_lat": 16.7320,
    "start_name": "Maubin Market",
    "end_name": "Maubin Bridge"
  }'
```

### Create Location (Admin)
```bash
curl -X POST "http://localhost:5000/admin/locations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -d '{
    "burmese_name": "မအူပင်ဈေး",
    "english_name": "Maubin Central Market",
    "address": "Maubin, Ayeyarwady Region, Myanmar",
    "lon": 95.6544,
    "lat": 16.7314,
    "type": "landmark"
  }'
```

## Response Examples

### Successful Login Response
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "username": "johndoe",
    "email": "john@example.com",
    "is_admin": false
  }
}
```

### Route Planning Response
```json
{
  "route_id": "987fcdeb-51a2-43d1-b67e-89abcdef0123",
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

## Deployment

### Render Deployment

1. **Connect GitHub repository** to Render
2. **Set environment variables** in Render dashboard
3. **Configure build settings**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
   - Python Version: `3.12`

### Environment Variables for Production

```env
DB_HOST=your-supabase-host.supabase.co
DB_NAME=postgres
DB_USER=postgres.yourproject
DB_PASSWORD=your-secure-password
DB_PORT=6543
JWT_SECRET=super-secure-production-secret
ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

## Project Structure

```Structure
python-api/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── .env               # Environment variables (local)
├── .env.example       # Environment template
└── README.md          # This file
```

## Development

### Code Style

- Follow PEP 8 conventions
- Use descriptive variable names
- Add comments for complex logic

### Database Migrations

- Manual SQL scripts in `../postgresql-db/initdb/`
- Run scripts in numerical order
- Test migrations on development database first

### Testing API Endpoints

- Use Postman, Thunder Client, or cURL
- Test authentication flows thoroughly
- Verify CORS headers for frontend integration

## Troubleshooting

### Common Issues

**"Module not found" errors**
```bash
pip install -r requirements.txt
source venv/bin/activate  # Ensure virtual environment is active
```

**Database connection errors**
- Verify `.env` file exists and has correct credentials
- Check database server is running and accessible
- Ensure PostGIS extension is installed

**CORS errors**
- Add your frontend URL to `ORIGIN` environment variable
- Check that `flask-cors` is installed

**JWT errors**
- Ensure `JWT_SECRET` is set in environment
- Use fresh tokens (access tokens expire)
- Check token format in Authorization header
