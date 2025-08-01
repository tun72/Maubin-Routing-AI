#!/usr/bin/env python3
"""
Database initialization script for Maubin Routing AI
This script sets up the PostGIS extension and creates all necessary tables.
"""

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv

load_dotenv()

def create_database():
    """Create the database if it doesn't exist"""
    # Connect to PostgreSQL server (not to a specific database)
    conn = psycopg2.connect(
        host="localhost",
        port='5432',
        user='postgres',
        password="root",
        database='postgres'  # Connect to default postgres database
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    db_name = "my_db"
    
    try:
        # Check if database exists
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'")
        exists = cursor.fetchone()
        
        if not exists:
            print(f"Creating database '{db_name}'...")
            cursor.execute(f'CREATE DATABASE {db_name}')
            print(f"Database '{db_name}' created successfully!")
        else:
            print(f"Database '{db_name}' already exists.")
            
    except Exception as e:
        print(f"Error creating database: {e}")
    finally:
        cursor.close()
        conn.close()

def setup_postgis():
    """Set up PostGIS extension in the database"""
    conn = psycopg2.connect(
        host="localhost",
        port='5432',
        user='postgres',
        password="root",
        database='postgres'  # Connect to default postgres database
    )
    cursor = conn.cursor()
    
    try:
        print("Setting up PostGIS extension...")
        cursor.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
        cursor.execute("CREATE EXTENSION IF NOT EXISTS postgis_topology;")
        cursor.execute("CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;")
        cursor.execute("CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;")
        
        # Verify PostGIS is working
        cursor.execute("SELECT PostGIS_Version();")
        version = cursor.fetchone()
        print(f"PostGIS version: {version[0]}")
        
        conn.commit()
        print("PostGIS extension setup completed!")
        
    except Exception as e:
        print(f"Error setting up PostGIS: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def create_sample_data():
    """Create sample data for testing"""
    from app import create_app
    from models import db, Location, Road, Traffic, User
    
    app = create_app()
    
    with app.app_context():
        try:
            print("Creating sample data...")
            
            # Create sample user
            user = User(
                email="test@example.com",
                password_hash="hashed_password_here"
            )
            db.session.add(user)
            db.session.commit()
            print("Sample user created.")
            
            # Create sample locations
            locations_data = [
                {
                    'name': 'Maubin Central Market',
                    'address': 'Maubin, Ayeyarwady Region, Myanmar',
                    'lat': 16.7314,
                    'lng': 95.6544,
                    'type': 'landmark'
                },
                {
                    'name': 'Maubin Hospital',
                    'address': 'Hospital Road, Maubin, Myanmar',
                    'lat': 16.7320,
                    'lng': 95.6550,
                    'type': 'hospital'
                },
                {
                    'name': 'Maubin Gas Station',
                    'address': 'Main Road, Maubin, Myanmar',
                    'lat': 16.7300,
                    'lng': 95.6530,
                    'type': 'gas_station'
                }
            ]
            
            for loc_data in locations_data:
                location = Location(
                    name=loc_data['name'],
                    address=loc_data['address'],
                    type=loc_data['type']
                )
                location.set_coordinates(loc_data['lat'], loc_data['lng'])
                db.session.add(location)
            
            db.session.commit()
            print("Sample locations created.")
            
            # Create sample road
            road = Road(
                name='Main Street',
                road_type='local',
                max_speed_kmh=50,
                length_m=1000,
                is_oneway=False
            )
            # Sample road coordinates (straight line)
            road_coords = [
                (16.7300, 95.6530),  # Start
                (16.7320, 95.6550)   # End
            ]
            road.set_geometry(road_coords)
            db.session.add(road)
            db.session.commit()
            print("Sample road created.")
            
            # Create sample traffic data
            traffic = Traffic(
                road_id=road.id,
                speed_kmh=45,
                congestion_level=3,
                weather='clear'
            )
            db.session.add(traffic)
            db.session.commit()
            print("Sample traffic data created.")
            
            print("Sample data creation completed!")
            
        except Exception as e:
            print(f"Error creating sample data: {e}")
            db.session.rollback()

if __name__ == '__main__':
    print("=== Maubin Routing AI Database Setup ===")
    
    # Step 1: Create database
    create_database()
    
    # Step 2: Setup PostGIS
    setup_postgis()
    
    # Step 3: Create sample data
    create_sample_data()
    
    print("Database setup completed!")
    print("\nNext steps:")
    print("1. Update your .env file with correct database credentials")
    print("2. Run: python app.py")
    print("3. Access the API at: http://localhost:4000") 