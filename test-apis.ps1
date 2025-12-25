# API Testing Script for E-commerce Application
# Base URL
$BASE_URL = "http://localhost:8080/api"

Write-Host "=== E-commerce API Testing ===" -ForegroundColor Green
Write-Host ""

# 1. Test public endpoints (no auth required)
Write-Host "1. Getting all products (Public):" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BASE_URL/products" -Method Get
$response | ConvertTo-Json
Write-Host ""

Write-Host "2. Getting all categories (Public):" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BASE_URL/categories" -Method Get
$response | ConvertTo-Json
Write-Host ""

# 2. Login as admin
Write-Host "3. Admin Login:" -ForegroundColor Yellow
$loginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $loginBody

$ADMIN_TOKEN = $loginResponse.token
Write-Host "Admin Token: $ADMIN_TOKEN"
Write-Host "Admin Details:" -ForegroundColor Cyan
$loginResponse | ConvertTo-Json
Write-Host ""

# 3. Create a new product (admin only)
Write-Host "4. Creating new product (Admin):" -ForegroundColor Yellow
$productBody = @{
    name = "Test Product"
    description = "Test Description"
    price = 99.99
    sku = "TEST-001"
    stockQuantity = 50
    categoryId = 1
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/products" `
      -Method Post `
      -ContentType "application/json" `
      -Headers @{Authorization = "Bearer $ADMIN_TOKEN"} `
      -Body $productBody
    $response | ConvertTo-Json
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 4. Register a new user
Write-Host "5. Registering new user:" -ForegroundColor Yellow
$registerBody = @{
    username = "testuser"
    email = "test@example.com"
    password = "Test@123"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/auth/register" `
      -Method Post `
      -ContentType "application/json" `
      -Body $registerBody
    $response | ConvertTo-Json
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 5. Login as user
Write-Host "6. User Login:" -ForegroundColor Yellow
$userLoginBody = @{
    username = "testuser"
    password = "Test@123"
} | ConvertTo-Json

try {
    $userLoginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" `
      -Method Post `
      -ContentType "application/json" `
      -Body $userLoginBody

    $USER_TOKEN = $userLoginResponse.token
    Write-Host "User Token: $USER_TOKEN"
    Write-Host "User Details:" -ForegroundColor Cyan
    $userLoginResponse | ConvertTo-Json
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    $USER_TOKEN = $null
}
Write-Host ""

# 6. Add item to cart (user only)
if ($USER_TOKEN) {
    Write-Host "7. Adding item to cart (User):" -ForegroundColor Yellow
    $cartBody = @{
        productId = 1
        quantity = 2
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/cart/items" `
          -Method Post `
          -ContentType "application/json" `
          -Headers @{Authorization = "Bearer $USER_TOKEN"} `
          -Body $cartBody
        $response | ConvertTo-Json
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""

    # 7. View cart (user only)
    Write-Host "8. Viewing cart (User):" -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$BASE_URL/cart" `
          -Method Get `
          -Headers @{Authorization = "Bearer $USER_TOKEN"}
        $response | ConvertTo-Json
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "=== Testing Complete ===" -ForegroundColor Green
