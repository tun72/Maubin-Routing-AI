-- Sample users
INSERT INTO users (username, email, password_hash, is_admin) VALUES
('admin', 'admin@mubroute.com', crypt('@dm!nMubr0ut3', gen_salt('bf')), true),
('traveler_john', 'john@example.com', crypt('Password123', gen_salt('bf')), false),
('city_explorer', 'sara@explorer.com', crypt('SecurePass!456', gen_salt('bf')), false);

-- Sample locations
INSERT INTO locations (burmese_name, english_name, address, geom, type) VALUES
('ဓမ္မနောရမ ဝိပဿနာရိပ်သာ', 'DHAMMA MANORAMA VIPASSANA CENTRE', 'Myo Shaung Road & 3rd Street', ST_GeogFromText('POINT(95.6444175781722 16.737319085010462)'), 'other');

-- Sample roads
INSERT INTO roads (burmese_name, english_name, geom, length_m, road_type) VALUES
(
  'မြို့ရှောင်လမ်း',
  'Myo Shaung Road',
  ST_GeogFromText('LINESTRING(95.6129154 16.7498012, 95.6444175 16.7373190, 95.643255 16.735858, 95.6410117 16.728777)'),
  ARRAY[200, 500, 300, 600],
  'highway'
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