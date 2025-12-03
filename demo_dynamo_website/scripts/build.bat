@echo off
REM Build script for local development on Windows
echo 🚀 Building Dynamo Web Application...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Build the Docker image
echo 🐳 Building Docker image...
docker build -t dynamo-web:latest .

REM Check build status
if %errorlevel% equ 0 (
    echo ✅ Docker image built successfully!
    echo.
    echo To run the application:
    echo   docker run -p 3000:3000 dynamo-web:latest
    echo.
    echo Or use docker-compose:
    echo   docker-compose up
) else (
    echo ❌ Docker build failed!
    exit /b 1
)