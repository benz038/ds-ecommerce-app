-- Insert default roles
INSERT INTO roles (id, name) VALUES (1, 'ROLE_USER') ON CONFLICT DO NOTHING;
INSERT INTO roles (id, name) VALUES (2, 'ROLE_ADMIN') ON CONFLICT DO NOTHING;

-- Insert default admin user (password: admin123)
INSERT INTO users (id, username, email, password, first_name, last_name, active, created_at, updated_at)
VALUES (1, 'admin', 'admin@ecommerce.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Admin', 'User', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert default test user (password: password123)
INSERT INTO users (id, username, email, password, first_name, last_name, active, created_at, updated_at)
VALUES (2, 'testuser', 'test@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Test', 'User', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id) VALUES (1, 2) ON CONFLICT DO NOTHING;

-- Assign user role to test user
INSERT INTO user_roles (user_id, role_id) VALUES (2, 1) ON CONFLICT DO NOTHING;

-- Create cart for test user
INSERT INTO carts (id, user_id, total_price, created_at, updated_at)
VALUES (1, 2, 0.0, NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Insert sample categories
INSERT INTO categories (id, name, description, active, created_at, updated_at)
VALUES (1, 'Electronics', 'Electronic devices and accessories', true, NOW(), NOW()) ON CONFLICT DO NOTHING;

INSERT INTO categories (id, name, description, active, created_at, updated_at)
VALUES (2, 'Clothing', 'Apparel and fashion items', true, NOW(), NOW()) ON CONFLICT DO NOTHING;

INSERT INTO categories (id, name, description, active, created_at, updated_at)
VALUES (3, 'Books', 'Books and reading materials', true, NOW(), NOW()) ON CONFLICT DO NOTHING;

INSERT INTO categories (id, name, description, active, created_at, updated_at)
VALUES (4, 'Home & Kitchen', 'Home appliances and kitchen items', true, NOW(), NOW()) ON CONFLICT DO NOTHING;

INSERT INTO categories (id, name, description, active, created_at, updated_at)
VALUES (5, 'Sports', 'Sports equipment and accessories', true, NOW(), NOW()) ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO products (id, name, description, price, stock_quantity, image_url, sku, active, category_id, created_at, updated_at)
VALUES (1, 'Laptop HP Pavilion', 'High-performance laptop with 16GB RAM and 512GB SSD', 899.99, 25, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop', 'ELEC-LAP-001', true, 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, stock_quantity, image_url, sku, active, category_id, created_at, updated_at)
VALUES (2, 'Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 29.99, 100, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', 'ELEC-MOU-001', true, 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, stock_quantity, image_url, sku, active, category_id, created_at, updated_at)
VALUES (3, 'T-Shirt Cotton', 'Comfortable cotton t-shirt in various sizes', 19.99, 200, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop', 'CLOT-TSH-001', true, 2, NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, stock_quantity, image_url, sku, active, category_id, created_at, updated_at)
VALUES (4, 'Java Programming Book', 'Complete guide to Java programming', 49.99, 50, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop', 'BOOK-JAV-001', true, 3, NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, stock_quantity, image_url, sku, active, category_id, created_at, updated_at)
VALUES (5, 'Coffee Maker', 'Automatic coffee maker with timer', 79.99, 40, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop', 'HOME-COF-001', true, 4, NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, stock_quantity, image_url, sku, active, category_id, created_at, updated_at)
VALUES (6, 'Yoga Mat', 'Non-slip yoga mat with carry strap', 24.99, 75, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop', 'SPOR-YOG-001', true, 5, NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, stock_quantity, image_url, sku, active, category_id, created_at, updated_at)
VALUES (7, 'Smartphone Samsung', 'Latest model with 5G capability', 699.99, 30, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop', 'ELEC-PHO-001', true, 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, stock_quantity, image_url, sku, active, category_id, created_at, updated_at)
VALUES (8, 'Jeans Denim', 'Classic fit denim jeans', 59.99, 150, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop', 'CLOT-JEA-001', true, 2, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Reset sequences for PostgreSQL
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

