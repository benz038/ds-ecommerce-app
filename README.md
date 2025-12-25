# E-Commerce Portfolio Project

A full-featured e-commerce application built with Spring Boot, demonstrating modern backend development practices.

## Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control (RBAC)**: User and Admin roles with different permissions
- **Product Catalog**: Complete product management with categories
- **Shopping Cart**: Add to cart functionality for users
- **PostgreSQL Database**: Production-ready relational database
- **Comprehensive Testing**: Unit and integration tests for all APIs

## Tech Stack

- Java 17
- Spring Boot 3.2.1
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Gradle
- JUnit 5 & Mockito

## Getting Started

### Prerequisites

- JDK 17 or higher
- PostgreSQL 14 or higher
- Gradle 8.5 or higher (included via wrapper)

### Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE ecommerce_db;
CREATE USER ecommerce_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce_user;
```

### Configuration

Update `src/main/resources/application.yml` with your database credentials.

### Running the Application

```bash
./gradlew bootRun
```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

### Products (Public Read, Admin Write)
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/{id}` - Update product (Admin only)
- `DELETE /api/products/{id}` - Delete product (Admin only)

### Categories (Public Read, Admin Write)
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/{id}` - Update category (Admin only)
- `DELETE /api/categories/{id}` - Delete category (Admin only)

### Cart (User only)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{id}` - Update cart item quantity
- `DELETE /api/cart/items/{id}` - Remove item from cart

## Testing

Run all tests:

```bash
./gradlew test
```

## License

This project is for portfolio purposes.
