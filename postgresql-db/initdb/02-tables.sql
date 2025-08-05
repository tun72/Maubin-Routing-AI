-- 1. ENHANCED USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    preferences JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE user_refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT false
);

-- 2. LOCATIONS (POIs)
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    burmese_name VARCHAR(255) NOT NULL,
    english_name VARCHAR(255) NOT NULL,
    address TEXT,
    geom GEOGRAPHY(POINT, 4326) NOT NULL,
    type VARCHAR(50) CHECK(type IN (
        'restaurant', 'hospital', 'gas_station', 'landmark', 
        'intersection', 'park', 'school', 'store', 'pagoda', 'other'
    )),
    CONSTRAINT unique_location_point UNIQUE (geom)
);

-- 3. ROAD NETWORK
CREATE TABLE roads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    burmese_name VARCHAR(255) NOT NULL,
    english_name VARCHAR(255) NOT NULL,
    geom GEOGRAPHY(LINESTRING, 4326) NOT NULL,
    length_m FLOAT NOT NULL CHECK (length_m > 0),
    road_type VARCHAR(20) CHECK(road_type IN (
        'highway', 'local', 'residential', 'service', 'pedestrian'
    )),
    is_oneway BOOLEAN DEFAULT false,
    CONSTRAINT valid_linestring CHECK (ST_GeometryType(geom::geometry) = 'ST_LineString')
);

-- 4. ROUTE REQUESTS
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    start_loc GEOGRAPHY(POINT, 4326) NOT NULL,
    end_loc GEOGRAPHY(POINT, 4326) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    optimization_type VARCHAR(20) DEFAULT 'fastest' CHECK(optimization_type IN (
        'fastest', 'shortest', 'scenic', 'efficient', 'safest'
    )),
    avoid_tolls BOOLEAN DEFAULT false,
    wheelchair_accessible BOOLEAN DEFAULT false,
    total_distance_m FLOAT CHECK (total_distance_m > 0),
    estimated_time_s FLOAT CHECK (estimated_time_s > 0),
    geom GEOGRAPHY(LINESTRING, 4326),
    CONSTRAINT valid_route_linestring CHECK (
        geom IS NULL OR ST_GeometryType(geom::geometry) = 'ST_LineString'
    )
);

-- 5. USER ROUTE HISTORY
CREATE TABLE user_route_history (
    history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    accessed_at TIMESTAMP DEFAULT NOW(),
    rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
    notes TEXT,
    start_name VARCHAR(255),
    end_name VARCHAR(255),
    total_distance_m FLOAT,
    duration_min FLOAT
);

-- 6. USER SAVED LOCATIONS
CREATE TABLE user_saved_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    custom_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_refresh_tokens_user ON user_refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_token ON user_refresh_tokens (refresh_token);
CREATE INDEX idx_locations_geom ON locations USING GIST (geom);
CREATE INDEX idx_roads_geom ON roads USING GIST (geom);
CREATE INDEX idx_routes_geom ON routes USING GIST (geom);
CREATE INDEX idx_routes_start ON routes USING GIST (start_loc);
CREATE INDEX idx_routes_end ON routes USING GIST (end_loc);
CREATE INDEX idx_history_user ON user_route_history (user_id);
CREATE INDEX idx_history_route ON user_route_history (route_id);
CREATE INDEX idx_saved_locations_user ON user_saved_locations (user_id);