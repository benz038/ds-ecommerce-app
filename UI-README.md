# E-commerce Project - UI User Guide

## 📋 Table of Contents
- [Getting Started](#getting-started)
- [Accessing the Application](#accessing-the-application)
- [User Features](#user-features)
- [Admin Features](#admin-features)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Prerequisites
1. **Backend API must be running** on `http://localhost:8080`
2. **Web browser** (Chrome, Firefox, Edge, or Safari)

### Starting the Application

1. **Start the Backend Server:**
   ```bash
   .\gradlew bootRun
   ```
   Wait until you see: `Started EcommerceApplication in X seconds`

2. **Open the UI:**
   - Open your browser
   - Navigate to the `frontend` folder in your project
   - Open `index.html` file in your browser
   - Or use a live server (recommended for better experience)

---

## 🌐 Accessing the Application

### Home Page
- **URL**: `index.html`
- **Features**: 
  - View all products
  - Browse by categories
  - Search products
  - Login/Register buttons

### Pages Overview
- **index.html** - Main product catalog page
- **login.html** - User/Admin login page
- **register.html** - New user registration
- **cart.html** - Shopping cart management (User only)
- **admin.html** - Admin dashboard (Admin only)

---

## 👤 User Features

### 1. User Registration
**Steps:**
1. Click **"Register"** button on home page
2. Fill in the registration form:
   - Username (required)
   - Email (required, valid format)
   - Password (required, min 6 characters)
   - First Name (required)
   - Last Name (required)
3. Click **"Register"** button
4. You'll be redirected to login page

**Sample User:**
```
Username: testuser
Email: test@example.com
Password: password123
```

### 2. User Login
**Steps:**
1. Click **"Login"** button on home page
2. Enter credentials:
   - Username: `testuser`
   - Password: `password123`
3. Click **"Login"** button
4. You'll be redirected to the home page (now authenticated)

**Default Users:**
- **Regular User**: `testuser` / `password123`
- **Admin User**: `admin` / `admin123`

### 3. Browse Products
**Features:**
- View all products on the home page
- Each product card shows:
  - Product image
  - Product name
  - Description
  - Price
  - Stock availability
  - Category
- **Filter by Category**: Use the category dropdown
- **Search Products**: Use the search bar

### 4. Add to Cart
**Steps:**
1. **Login first** (required)
2. Browse products
3. Click **"Add to Cart"** button on any product
4. Enter quantity (default: 1)
5. Product added to your cart

### 5. View & Manage Cart
**Steps:**
1. Click **"Cart"** icon/button in navigation
2. View all items in your cart:
   - Product details
   - Quantity
   - Price per item
   - Subtotal
   - **Total Price** at the bottom
3. **Update Quantity**: Change quantity and click update
4. **Remove Item**: Click remove/delete button
5. **Clear Cart**: Remove all items at once

---

## 👨‍💼 Admin Features

### 1. Admin Login
**Credentials:**
```
Username: admin
Password: admin123
```

**Steps:**
1. Go to login page
2. Enter admin credentials
3. Click **"Login"**
4. You'll be redirected to admin dashboard

### 2. Admin Dashboard
**URL**: `admin.html`

#### Manage Products
**View All Products:**
- See complete product list with details
- Stock levels
- Active/Inactive status

**Add New Product:**
1. Click **"Add Product"** button
2. Fill in product details:
   - Name (required)
   - Description (required)
   - Price (required, positive number)
   - SKU (required, unique code)
   - Stock Quantity (required)
   - Category (select from dropdown)
   - Image URL (optional)
3. Click **"Save"** or **"Create"**

**Edit Product:**
1. Click **"Edit"** button on any product
2. Modify the details in the form
3. Click **"Update"** to save changes

**Delete Product:**
1. Click **"Delete"** button on any product
2. Confirm deletion
3. Product will be removed from the catalog

#### Manage Categories
**View All Categories:**
- See all product categories
- Number of products in each category

**Add New Category:**
1. Click **"Add Category"** button
2. Fill in:
   - Name (required, unique)
   - Description (required)
3. Click **"Save"**

**Edit Category:**
1. Click **"Edit"** button on any category
2. Modify name/description
3. Click **"Update"**

**Delete Category:**
1. Click **"Delete"** button
2. Note: Cannot delete categories with products
3. Remove all products from category first

---

## 🔒 Security Features

### Authentication
- **JWT Token**: Stored in browser localStorage
- **Auto-logout**: Token expires after configured time
- **Protected Pages**: 
  - Cart requires user authentication
  - Admin dashboard requires admin role

### Access Control
- **Public Access**: Home page, product browsing
- **User Access**: Cart management
- **Admin Access**: Product/category management

---

## 💡 Tips & Best Practices

### For Users
1. **Logout**: Always logout when done shopping
2. **Cart Persistence**: Cart items are saved per user
3. **Stock Check**: Products show stock availability
4. **Search**: Use search for quick product finding

### For Admins
1. **Unique SKU**: Each product must have unique SKU
2. **Stock Management**: Update stock after sales
3. **Category First**: Create categories before products
4. **Product Validation**: All required fields must be filled

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Cannot Load Products
**Problem**: Products not showing on home page

**Solutions:**
- ✅ Ensure backend is running (`.\gradlew bootRun`)
- ✅ Check browser console for errors (F12)
- ✅ Verify API endpoint: `http://localhost:8080/api/products`
- ✅ Check CORS configuration in backend

#### 2. Login Not Working
**Problem**: Login button doesn't work or shows error

**Solutions:**
- ✅ Verify credentials are correct
- ✅ Check backend logs for authentication errors
- ✅ Clear browser cache and localStorage
- ✅ Try with default admin credentials

#### 3. Cart Not Updating
**Problem**: Items not adding to cart

**Solutions:**
- ✅ Ensure you're logged in
- ✅ Check JWT token in localStorage
- ✅ Verify product has stock available
- ✅ Check browser console for API errors

#### 4. Admin Dashboard Not Loading
**Problem**: Cannot access admin features

**Solutions:**
- ✅ Login with admin credentials (`admin` / `admin123`)
- ✅ Check user role in JWT token
- ✅ Verify admin endpoints in backend

#### 5. CORS Errors
**Problem**: Browser blocks API requests

**Solutions:**
- ✅ Use Live Server extension in VS Code
- ✅ Or run a local web server:
  ```bash
  # Python
  python -m http.server 8000
  
  # Node.js
  npx http-server
  ```
- ✅ Don't open HTML files directly with `file://` protocol

---

## 📱 Browser Compatibility

### Supported Browsers
- ✅ **Chrome** (Recommended) - Version 90+
- ✅ **Firefox** - Version 88+
- ✅ **Edge** - Version 90+
- ✅ **Safari** - Version 14+

### Required Features
- JavaScript enabled
- LocalStorage enabled
- Cookies enabled

---

## 🎨 UI Features

### Responsive Design
- **Desktop**: Full-width layout
- **Tablet**: Optimized grid view
- **Mobile**: Single column layout

### User Experience
- **Loading Indicators**: Shows during API calls
- **Error Messages**: Clear error notifications
- **Success Feedback**: Confirmation messages
- **Form Validation**: Real-time input validation

---

## 📞 Support

### Need Help?
1. Check this README first
2. Review browser console for errors (F12)
3. Check backend logs
4. Verify API endpoints using Postman

### Quick Test
**Test if backend is running:**
```bash
curl http://localhost:8080/api/products
```

**Test admin login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 📝 Sample Workflows

### Customer Journey
1. Browse products on home page
2. Register new account
3. Login with credentials
4. Search for products
5. Add items to cart
6. View cart and update quantities
7. Logout

### Admin Workflow
1. Login as admin
2. Go to admin dashboard
3. Add new category
4. Add products to category
5. Update product stock
6. Manage product availability
7. Logout

---

## 🔄 Quick Reference

### Default Login Credentials
| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| User | testuser | password123 |

### API Base URL
```
http://localhost:8080/api
```

### Frontend Files
```
frontend/
├── index.html          (Home/Products)
├── login.html          (Login)
├── register.html       (Register)
├── cart.html           (Shopping Cart)
├── admin.html          (Admin Dashboard)
├── css/
│   └── style.css       (All styles)
└── js/
    ├── api.js          (API calls)
    ├── auth.js         (Authentication)
    ├── products.js     (Product functions)
    ├── cart.js         (Cart functions)
    └── admin.js        (Admin functions)
```

---

**Happy Shopping! 🛍️**
