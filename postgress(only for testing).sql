-- Spatial Extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. LOCATIONS (POIs)
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    -- Spatial Point (lat, lng)
    geom GEOGRAPHY(POINT, 4326) NOT NULL,
    type VARCHAR(50) CHECK(type IN ('restaurant', 'hospital', 'gas_station', 'landmark', 'other')),
    popularity INT DEFAULT 0,
    CONSTRAINT unique_location UNIQUE (geom)
);

-- 3. ROAD NETWORK (Graph structure for routing)
CREATE TABLE roads (
    id SERIAL PRIMARY KEY,
    -- Line geometry representing road segment
    geom GEOGRAPHY(LINESTRING, 4326) NOT NULL,
    length_m FLOAT NOT NULL, -- In meters
    max_speed_kmh INT NOT NULL,
    road_type VARCHAR(20) CHECK(road_type IN ('highway', 'local', 'residential', 'service')),
    is_oneway BOOLEAN DEFAULT false,
    name VARCHAR(255)
);

-- 4. TRAFFIC & CONDITIONS (Real-time updates)
CREATE TABLE traffic (
    road_id INT REFERENCES roads(id) ON DELETE CASCADE,
    recorded_at TIMESTAMP DEFAULT NOW(),
    speed_kmh FLOAT NOT NULL, -- Current speed
    congestion_level INT CHECK(congestion_level BETWEEN 1 AND 10),
    weather VARCHAR(20) CHECK(weather IN ('clear', 'rain', 'snow', 'fog')),
    PRIMARY KEY (road_id, recorded_at)
);

-- 5. ROUTE REQUESTS (AI routing context)
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    start_loc GEOGRAPHY(POINT, 4326) NOT NULL,
    end_loc GEOGRAPHY(POINT, 4326) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    -- AI Parameters
    optimization_type VARCHAR(20) CHECK(optimization_type IN ('fastest', 'shortest', 'scenic', 'efficient')),
    avoid_tolls BOOLEAN DEFAULT false,
    wheelchair_accessible BOOLEAN DEFAULT false,
    -- Results
    total_distance_m FLOAT,
    estimated_time_s FLOAT,
    geom GEOGRAPHY(LINESTRING, 4326) -- Final path
);


-- Find locations within 1km radius (using PostGIS)
SELECT name, address, ST_Y(geom::geometry) AS lat, ST_X(geom::geometry) AS lng
FROM locations
WHERE ST_DWithin(
    geom, 
    ST_MakePoint(-74.006, 40.7128)::GEOGRAPHY, -- NYC coordinates
    1000 -- 1km radius
);