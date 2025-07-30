# Maubin Routing AI - Python API

A Flask-based REST API for the Maubin Routing AI system.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/route` - Sample route information
- `GET /api/routes` - List of available routes

## Development

The Flask app runs in debug mode by default, so changes will be automatically reloaded.
