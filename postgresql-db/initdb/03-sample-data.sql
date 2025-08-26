INSERT INTO users (username, email, password_hash, is_admin) VALUES
('admin', 'admin@mubroute.com', crypt('@dm!nMubr0ut3', gen_salt('bf')), true),