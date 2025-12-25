# E-Commerce API Testing Guide

## Prerequisites

1. PostgreSQL database running
2. Application started on port 8080

## Default Credentials

### Admin Account
- Username: `admin`
- Password: `admin123`

## API Testing with cURL

### 1. Authentication

#### Register New User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### User Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "password123"
  }'
```

#### Admin Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Save the JWT token from the response for subsequent requests!**

### 2. Products (Public Read Access)

#### Get All Products
```bash
curl -X GET http://localhost:8080/api/products
```

#### Get Active Products Only
```bash
curl -X GET "http://localhost:8080/api/products?active=true"
```

#### Get Product by ID
```bash
curl -X GET http://localhost:8080/api/products/1
```

#### Search Products
```bash
curl -X GET "http://localhost:8080/api/products/search?keyword=laptop"
```

#### Get Products by Category
```bash
curl -X GET http://localhost:8080/api/products/category/1
```

### 3. Products (Admin Only)

#### Create Product (Admin Only)
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "stockQuantity": 50,
    "sku": "PROD-001",
    "categoryId": 1,
    "active": true
  }'
```

#### Update Product (Admin Only)
```bash
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "name": "Updated Product",
    "description": "Updated description",
    "price": 119.99,
    "stockQuantity": 40,
    "sku": "PROD-001",
    "categoryId": 1,
    "active": true
  }'
```

#### Delete Product (Admin Only)
```bash
curl -X DELETE http://localhost:8080/api/products/1 \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### 4. Categories (Public Read Access)

#### Get All Categories
```bash
curl -X GET http://localhost:8080/api/categories
```

#### Get Active Categories Only
```bash
curl -X GET "http://localhost:8080/api/categories?active=true"
```

#### Get Category by ID
```bash
curl -X GET http://localhost:8080/api/categories/1
```

### 5. Categories (Admin Only)

#### Create Category (Admin Only)
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "name": "New Category",
    "description": "Category description",
    "active": true
  }'
```

#### Update Category (Admin Only)
```bash
curl -X PUT http://localhost:8080/api/categories/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "name": "Updated Category",
    "description": "Updated description",
    "active": true
  }'
```

#### Delete Category (Admin Only)
```bash
curl -X DELETE http://localhost:8080/api/categories/1 \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

### 6. Shopping Cart (User/Admin)

#### Get User's Cart
```bash
curl -X GET http://localhost:8080/api/cart \
  -H "Authorization: Bearer YOUR_USER_JWT_TOKEN"
```

#### Add Item to Cart
```bash
curl -X POST http://localhost:8080/api/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_USER_JWT_TOKEN" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

#### Update Cart Item Quantity
```bash
curl -X PUT "http://localhost:8080/api/cart/items/1?quantity=3" \
  -H "Authorization: Bearer YOUR_USER_JWT_TOKEN"
```

#### Remove Item from Cart
```bash
curl -X DELETE http://localhost:8080/api/cart/items/1 \
  -H "Authorization: Bearer YOUR_USER_JWT_TOKEN"
```

#### Clear Cart
```bash
curl -X DELETE http://localhost:8080/api/cart \
  -H "Authorization: Bearer YOUR_USER_JWT_TOKEN"
```

## Testing with Postman

1. Import the collection by creating requests for each endpoint above
2. Set up environment variables:
   - `base_url`: http://localhost:8080
   - `user_token`: (paste JWT after login)
   - `admin_token`: (paste admin JWT after login)

3. Use `{{base_url}}` and `{{user_token}}` / `{{admin_token}}` in your requests

## Database Access

To access PostgreSQL directly:
```bash
psql -h localhost -U ecommerce_user -d ecommerce_db
```

Password: `ecommerce_pass`

## Common SQL Queries

### View all users
```sql
SELECT * FROM users;
```

### View all products with categories
```sql
SELECT p.*, c.name as category_name 
FROM products p 
LEFT JOIN categories c ON p.category_id = c.id;
```

### View user's cart
```sql
SELECT u.username, p.name, ci.quantity, ci.subtotal 
FROM cart_items ci
JOIN carts c ON ci.cart_id = c.id
JOIN users u ON c.user_id = u.id
JOIN products p ON ci.product_id = p.id;
```
