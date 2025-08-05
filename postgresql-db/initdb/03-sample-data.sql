-- Sample users
INSERT INTO users (username, email, password_hash, is_admin) VALUES
('admin', 'admin@mubroute.com', crypt('@dm!nMubr0ut3', gen_salt('bf')), true),
('traveler_john', 'john@example.com', crypt('Password123', gen_salt('bf')), false),
('city_explorer', 'sara@explorer.com', crypt('SecurePass!456', gen_salt('bf')), false);

-- Sample locations
INSERT INTO locations (burmese_name, english_name, address, geom, type) VALUES
('မြို့တော်ပန်းခြံ', 'Central Park', 'Park Avenue', ST_GeogFromText('POINT(-73.9688 40.7851)'), 'park'),
('ပြည်သူ့ဆေးရုံကြီး', 'Main Hospital', '123 Medical Dr', ST_GeogFromText('POINT(-73.9722 40.7798)'), 'hospital'),
('ည‌ဈေးတန်း', 'Downtown Diner', '45 Food Street', ST_GeogFromText('POINT(-73.9653 40.7824)'), 'restaurant');

-- Sample roads
INSERT INTO roads (burmese_name, english_name, geom, length_m, road_type) VALUES
(
  'ပန်းခြံလမ်း',
  'Park Avenue',
  ST_GeogFromText('LINESTRING(-73.9688 40.7851, -73.9722 40.7798)'),
  850,
  'residential'
),
(
  'အစားအသောက်တန်း',
  'Food Street',
  ST_GeogFromText('LINESTRING(-73.9653 40.7824, -73.9688 40.7851)'),
  600,
  'local'
);

-- Sample route
INSERT INTO routes (
  user_id, 
  start_loc, 
  end_loc, 
  optimization_type,
  total_distance_m,
  estimated_time_s,
  geom
) VALUES (
  (SELECT id FROM users WHERE username = 'traveler_john'),
  ST_GeogFromText('POINT(-73.9653 40.7824)'),
  ST_GeogFromText('POINT(-73.9722 40.7798)'),
  'shortest',
  1450,
  1200,
  ST_GeogFromText('LINESTRING(-73.9653 40.7824, -73.9688 40.7851, -73.9722 40.7798)')
);

-- Sample history
INSERT INTO user_route_history (
  user_id,
  route_id,
  start_name,
  end_name,
  total_distance_m,
  duration_min
) VALUES (
  (SELECT id FROM users WHERE username = 'traveler_john'),
  (SELECT id FROM routes LIMIT 1),
  'Downtown Diner',
  'Main Hospital',
  1450,
  20
);

-- Sample saved location
INSERT INTO user_saved_locations (
  user_id,
  location_id,
  custom_name
) VALUES (
  (SELECT id FROM users WHERE username = 'traveler_john'),
  (SELECT id FROM locations WHERE english_name = 'Central Park'),
  'Favorite Park'
);