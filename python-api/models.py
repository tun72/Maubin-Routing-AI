from flask_sqlalchemy import SQLAlchemy
from geoalchemy2 import Geography, Geometry
from geoalchemy2.shape import from_shape, to_shape
from shapely.geometry import Point, LineString
from datetime import datetime
import uuid

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    routes = db.relationship('Route', backref='user', lazy=True)

class Location(db.Model):
    __tablename__ = 'locations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    address = db.Column(db.Text, nullable=False)
    geom = db.Column(Geography('POINT', srid=4326), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    popularity = db.Column(db.Integer, default=0)
    
    __table_args__ = (
        db.UniqueConstraint('geom', name='unique_location'),
    )
    
    def set_coordinates(self, lat, lng):
        """Set coordinates using lat/lng"""
        point = Point(lng, lat)  # PostGIS uses (lng, lat) order
        self.geom = from_shape(point, srid=4326)
    
    def get_coordinates(self):
        """Get coordinates as (lat, lng) tuple"""
        if self.geom:
            point = to_shape(self.geom)
            return (point.y, point.x)  # Return as (lat, lng)
        return None

class Road(db.Model):
    __tablename__ = 'roads'
    
    id = db.Column(db.Integer, primary_key=True)
    geom = db.Column(Geography('LINESTRING', srid=4326), nullable=False)
    length_m = db.Column(db.Float, nullable=False)
    max_speed_kmh = db.Column(db.Integer, nullable=False)
    road_type = db.Column(db.String(20), nullable=False)
    is_oneway = db.Column(db.Boolean, default=False)
    name = db.Column(db.String(255))
    
    # Relationships
    traffic_data = db.relationship('Traffic', backref='road', lazy=True, cascade='all, delete-orphan')
    
    def set_geometry(self, coordinates):
        """Set road geometry from list of (lat, lng) coordinates"""
        # Convert to (lng, lat) for PostGIS
        lng_lat_coords = [(coord[1], coord[0]) for coord in coordinates]
        line = LineString(lng_lat_coords)
        self.geom = from_shape(line, srid=4326)
    
    def get_coordinates(self):
        """Get road coordinates as list of (lat, lng) tuples"""
        if self.geom:
            line = to_shape(self.geom)
            return [(coord[1], coord[0]) for coord in line.coords]  # Return as (lat, lng)
        return []

class Traffic(db.Model):
    __tablename__ = 'traffic'
    
    road_id = db.Column(db.Integer, db.ForeignKey('roads.id', ondelete='CASCADE'), primary_key=True)
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow, primary_key=True)
    speed_kmh = db.Column(db.Float, nullable=False)
    congestion_level = db.Column(db.Integer, nullable=False)
    weather = db.Column(db.String(20), nullable=False)
    
    __table_args__ = (
        db.CheckConstraint('congestion_level BETWEEN 1 AND 10', name='check_congestion_level'),
    )

class Route(db.Model):
    __tablename__ = 'routes'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    start_loc = db.Column(Geography('POINT', srid=4326), nullable=False)
    end_loc = db.Column(Geography('POINT', srid=4326), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # AI Parameters
    optimization_type = db.Column(db.String(20), nullable=False)
    avoid_tolls = db.Column(db.Boolean, default=False)
    wheelchair_accessible = db.Column(db.Boolean, default=False)
    
    # Results
    total_distance_m = db.Column(db.Float)
    estimated_time_s = db.Column(db.Float)
    geom = db.Column(Geography('LINESTRING', srid=4326))
    
    __table_args__ = (
        db.CheckConstraint("optimization_type IN ('fastest', 'shortest', 'scenic', 'efficient')", name='check_optimization_type'),
    )
    
    def set_start_location(self, lat, lng):
        """Set start location coordinates"""
        point = Point(lng, lat)
        self.start_loc = from_shape(point, srid=4326)
    
    def set_end_location(self, lat, lng):
        """Set end location coordinates"""
        point = Point(lng, lat)
        self.end_loc = from_shape(point, srid=4326)
    
    def set_route_geometry(self, coordinates):
        """Set route geometry from list of (lat, lng) coordinates"""
        lng_lat_coords = [(coord[1], coord[0]) for coord in coordinates]
        line = LineString(lng_lat_coords)
        self.geom = from_shape(line, srid=4326)
    
    def get_start_coordinates(self):
        """Get start coordinates as (lat, lng) tuple"""
        if self.start_loc:
            point = to_shape(self.start_loc)
            return (point.y, point.x)
        return None
    
    def get_end_coordinates(self):
        """Get end coordinates as (lat, lng) tuple"""
        if self.end_loc:
            point = to_shape(self.end_loc)
            return (point.y, point.x)
        return None
    
    def get_route_coordinates(self):
        """Get route coordinates as list of (lat, lng) tuples"""
        if self.geom:
            line = to_shape(self.geom)
            return [(coord[1], coord[0]) for coord in line.coords]
        return [] 