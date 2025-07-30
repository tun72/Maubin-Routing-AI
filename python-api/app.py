from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route('/')
def home():
    return jsonify({
        "message": "Welcome to Maubin Routing AI API",
        "status": "success",
        "version": "1.0.0"
    })

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "message": "API is running successfully"
    })

@app.route('/api/route')
def get_route():
    return jsonify({
        "message": "Route endpoint",
        "data": {
            "start_location": "Maubin",
            "end_location": "Yangon",
            "distance": "120 km",
            "estimated_time": "2.5 hours"
        }
    })

@app.route('/api/routes')
def get_routes():
    sample_routes = [
        {
            "id": 1,
            "name": "Maubin to Yangon",
            "distance": "120 km",
            "estimated_time": "2.5 hours"
        },
        {
            "id": 2,
            "name": "Maubin to Pathein",
            "distance": "85 km",
            "estimated_time": "1.8 hours"
        },
        {
            "id": 3,
            "name": "Maubin to Pyapon",
            "distance": "45 km",
            "estimated_time": "1 hour"
        }
    ]
    
    return jsonify({
        "message": "Available routes",
        "data": sample_routes,
        "count": len(sample_routes)
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
