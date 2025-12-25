@echo off
echo ========================================
echo Starting E-Commerce Application
echo ========================================
echo.
echo Building and running Spring Boot application...
echo Application will start on http://localhost:8080
echo.
echo Default admin credentials:
echo Username: admin
echo Password: admin123
echo.
echo Press Ctrl+C to stop the application
echo ========================================
echo.

gradlew.bat bootRun
