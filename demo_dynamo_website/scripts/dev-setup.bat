@echo off
REM Development setup script for Windows
echo 🔧 Setting up Dynamo Web Development Environment...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Create environment file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ✅ .env file created. Please update it with your configuration.
)

REM Pull necessary Docker images
echo 📦 Pulling Docker images...
docker-compose pull

REM Build the application
echo 🏗️ Building application...
docker-compose build

REM Start the development environment
echo 🚀 Starting development environment...
docker-compose up -d

echo ✅ Development environment is ready!
echo.
echo 🌐 Application: http://localhost:3000
echo.
echo To stop the development environment:
echo   docker-compose down
echo.
echo To view logs:
echo   docker-compose logs -f