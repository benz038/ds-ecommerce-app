-- E-Commerce Database Setup Script
-- Run this with: psql -U postgres -f setup-db.sql

-- Create database
CREATE DATABASE ecommerce_db;

-- Connect to the database
\c ecommerce_db

-- Create user
CREATE USER ecommerce_user WITH PASSWORD 'ecommerce_pass';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO ecommerce_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ecommerce_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ecommerce_user;

-- Verify
SELECT current_database();
