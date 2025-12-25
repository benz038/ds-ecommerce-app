@echo off
echo ========================================
echo E-Commerce Database Setup
echo ========================================
echo.
echo This will create:
echo - Database: ecommerce_db
echo - User: ecommerce_user
echo - Password: ecommerce_pass
echo.
echo Please enter your PostgreSQL 'postgres' user password when prompted.
echo.
pause

"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -f setup-db.sql

echo.
echo ========================================
echo Database setup complete!
echo ========================================
pause
