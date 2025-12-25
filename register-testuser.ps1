# Register testuser via API
$registerUrl = "http://localhost:8080/api/auth/register"

$userData = @{
    username = "testuser"
    email = "test@example.com"
    password = "password123"
    firstName = "Test"
    lastName = "User"
} | ConvertTo-Json

Write-Host "Registering testuser..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $registerUrl `
        -Method Post `
        -ContentType "application/json" `
        -Body $userData
    
    Write-Host "Success! User registered:" -ForegroundColor Green
    $response | ConvertTo-Json
    Write-Host ""
    Write-Host "You can now login with:" -ForegroundColor Yellow
    Write-Host "Username: testuser" -ForegroundColor White
    Write-Host "Password: password123" -ForegroundColor White
} catch {
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "Registration failed: $($errorDetails.message)" -ForegroundColor Red
    
    if ($errorDetails.message -like "*already exists*") {
        Write-Host ""
        Write-Host "User already exists. Try logging in with:" -ForegroundColor Yellow
        Write-Host "Username: testuser" -ForegroundColor White
        Write-Host "Password: password123" -ForegroundColor White
    }
}
