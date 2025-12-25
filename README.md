# 🛒 E-Commerce Portfolio Project

A full-featured, production-ready e-commerce application built with Spring Boot and modern web technologies. Features include JWT authentication, role-based access control, product management, shopping cart, order history, and a beautiful responsive UI.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📸 Screenshots

### Home Page - Product Catalog
![Product Catalog](https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=400&fit=crop)
*Modern glassmorphism design with gradient backgrounds and beautiful product cards*

### Shopping Cart
![Shopping Cart](https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&h=400&fit=crop)
*Intuitive cart management with quantity controls and real-time price calculations*

### Order History
![Order History](https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop)
*Track your orders with detailed status badges and order items*

### Admin Dashboard
![Admin Dashboard](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop)
*Production-ready admin panel for managing products, categories, users, and orders*

## ✨ Features

### User Features
- 🔐 **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- 👤 **User Registration & Login**: Easy account creation and login
- 🛍️ **Product Browsing**: Browse products with search and category filtering
- 🛒 **Shopping Cart**: Add/remove items with quantity management
- 📦 **Order Management**: Place orders and track order history
- 💳 **Checkout System**: Complete checkout with tax calculation
- 📱 **Responsive Design**: Beautiful UI that works on all devices

### Admin Features
- 📊 **Admin Dashboard**: Comprehensive management interface
- 🏷️ **Product Management**: Create, update, delete products with stock control
- 📁 **Category Management**: Organize products into categories
- 👥 **User Management**: Manage user accounts and roles
- 📦 **Stock Management**: Quick stock updates with dedicated modal
- 🔒 **Access Control**: Assign USER and ADMIN roles to users
- 📋 **Order Monitoring**: View all orders across all users

### Technical Features
- 🔒 **Role-Based Access Control (RBAC)**: USER and ADMIN roles
- 🎨 **Modern UI**: Glassmorphism design with gradients and animations
- 📸 **Product Images**: Integration with Unsplash API for beautiful product images
- 🧪 **Comprehensive Testing**: 35+ unit tests with high coverage
- 🚀 **Production Ready**: Exception handling, validation, and security best practices
- 📝 **RESTful API**: Well-structured REST endpoints with DTOs
- 💾 **Database**: PostgreSQL with JPA/Hibernate

## 🏗️ Tech Stack

### Backend
- **Java 17** - Modern Java with latest features
- **Spring Boot 3.2.1** - Application framework
- **Spring Security 6** - Authentication and authorization
- **Spring Data JPA** - Data persistence
- **JWT (jjwt 0.12.3)** - Stateless authentication
- **PostgreSQL 16** - Relational database
- **Lombok** - Reduce boilerplate code
- **Gradle 8.5** - Build automation

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with glassmorphism
- **JavaScript ES6+** - Vanilla JavaScript
- **Fetch API** - HTTP requests
- **LocalStorage** - Client-side JWT storage

### Testing
- **JUnit 5** - Unit testing framework
- **Mockito** - Mocking framework
- **Spring Boot Test** - Integration testing

## 🚀 Getting Started

### Prerequisites

- **JDK 17** or higher ([Download](https://adoptium.net/))
- **PostgreSQL 16** or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

### Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE ecommerce_db;
```

2. The application will automatically create tables and seed initial data on startup.

### Configuration

Update database credentials in `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ecommerce_db
    username: postgres
    password: your_password
```

### Running the Application

#### Using Gradle Wrapper (Recommended)

```bash
# Clone the repository
git clone https://github.com/benz038/ds-ecommerce-app.git
cd ds-ecommerce-app

# Build the project
./gradlew build

# Run the application
./gradlew bootRun
```

#### Using JAR file

```bash
# Build JAR
./gradlew bootJar

# Run JAR
java -jar build/libs/ecommerce-0.0.1-SNAPSHOT.jar
```

The application will start on **http://localhost:8080**

### Default Accounts

| Role  | Username | Password    | Description          |
|-------|----------|-------------|----------------------|
| Admin | admin    | admin123    | Full system access   |
| User  | testuser | password123 | Standard user access |

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "username": "admin",
  "roles": ["ROLE_ADMIN"]
}
```

### Product Endpoints

#### Get All Products
```http
GET /api/products
```

#### Get Product by ID
```http
GET /api/products/{id}
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 899.99,
  "stockQuantity": 50,
  "sku": "LAP-001",
  "categoryId": 1,
  "imageUrl": "https://example.com/image.jpg",
  "active": true
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/{id}
Authorization: Bearer {token}
```

### Category Endpoints

#### Get All Categories
```http
GET /api/categories
```

#### Create Category (Admin Only)
```http
POST /api/categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices",
  "active": true
}
```

### Cart Endpoints (Authenticated Users)

#### Get Cart
```http
GET /api/cart
Authorization: Bearer {token}
```

#### Add Item to Cart
```http
POST /api/cart/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /api/cart/items/{itemId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove Cart Item
```http
DELETE /api/cart/items/{itemId}
Authorization: Bearer {token}
```

### Order Endpoints (Authenticated Users)

#### Create Order (Checkout)
```http
POST /api/orders
Authorization: Bearer {token}
```

#### Get User Orders
```http
GET /api/orders
Authorization: Bearer {token}
```

#### Get Order by ID
```http
GET /api/orders/{id}
Authorization: Bearer {token}
```

### User Management Endpoints (Admin Only)

#### Get All Users
```http
GET /api/users
Authorization: Bearer {token}
```

#### Get User by ID
```http
GET /api/users/{id}
Authorization: Bearer {token}
```

#### Update User
```http
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "newemail@example.com",
  "firstName": "John",
  "lastName": "Updated",
  "active": true,
  "roles": ["USER", "ADMIN"]
}
```

## 🧪 Testing

### Run All Tests
```bash
./gradlew test
```

### Run Tests with Coverage
```bash
./gradlew test jacocoTestReport
```

### Test Coverage
- **Unit Tests**: 35+ tests
- **Coverage**: High coverage of service and repository layers
- **Test Categories**: Product, Category, Cart, User services

## 🏛️ Architecture

### Project Structure
```
src/
├── main/
│   ├── java/com/portfolio/ecommerce/
│   │   ├── controller/       # REST Controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── exception/       # Custom Exceptions
│   │   ├── model/           # JPA Entities
│   │   ├── repository/      # JPA Repositories
│   │   ├── security/        # Security Configuration
│   │   └── service/         # Business Logic
│   └── resources/
│       ├── application.yml  # Configuration
│       ├── data.sql        # Initial Data
│       └── static/         # Frontend Files
│           ├── css/
│           ├── js/
│           └── *.html
└── test/                   # Test Files
```

### Database Schema
```
users (id, username, email, password, first_name, last_name, active)
  └─ user_roles (user_id, role_id) ─┐
                                      │
roles (id, name)                      │
                                      │
categories (id, name, description, active)
  │
  └─ products (id, name, description, price, stock_quantity, sku, category_id, image_url, active)
       │
       ├─ cart_items (id, cart_id, product_id, quantity, price, subtotal)
       │    └─ carts (id, user_id, total_price)
       │
       └─ order_items (id, order_id, product_id, quantity, price, subtotal)
            └─ orders (id, user_id, subtotal, tax, total_price, status, order_date)
```

## 🎨 UI Features

### Design Elements
- **Glassmorphism**: Modern translucent design with backdrop-filter
- **Gradient Backgrounds**: Purple/indigo gradient theme (#667eea to #764ba2)
- **Animations**: Smooth transitions, fade-in effects, hover animations
- **Responsive**: Mobile-first design with breakpoints
- **Status Badges**: Color-coded order status and stock levels
- **Toast Notifications**: User feedback for actions

### Pages
1. **index.html** - Home page with product catalog
2. **login.html** - User/Admin login
3. **register.html** - New user registration
4. **cart.html** - Shopping cart management
5. **orders.html** - Order history
6. **admin.html** - Admin dashboard

## 🔒 Security Features

- **JWT Authentication**: Stateless token-based auth
- **Password Encryption**: BCrypt with strength 10
- **CORS Configuration**: Secure cross-origin requests
- **Role-Based Access**: Method-level security with @PreAuthorize
- **Input Validation**: DTO validation with annotations
- **Exception Handling**: Global exception handler
- **SQL Injection Prevention**: JPA parameterized queries

## 🚀 Deployment

### Docker (Optional)

```dockerfile
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build and run:
```bash
docker build -t ecommerce-app .
docker run -p 8080:8080 ecommerce-app
```

### Production Considerations
- Set `spring.jpa.hibernate.ddl-auto=validate` in production
- Use environment variables for sensitive data
- Enable HTTPS
- Configure proper CORS origins
- Set up database backups
- Monitor application with Spring Boot Actuator

## 📝 License

This project is for portfolio purposes. Feel free to use it as a reference.

## 👤 Author

**Benz038**
- GitHub: [@benz038](https://github.com/benz038)
- Repository: [ds-ecommerce-app](https://github.com/benz038/ds-ecommerce-app)

## 🙏 Acknowledgments

- Spring Boot Team for excellent documentation
- Unsplash for product images
- Modern CSS techniques from the web community

---

⭐ If you find this project useful, please consider giving it a star!

