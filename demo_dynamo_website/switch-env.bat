@echo off
echo 🔧 Dynamo Web Development Mode Switcher
echo.

if "%1"=="docker" (
    echo 🐳 Switching to Docker development mode...
    copy .env.docker .env.local
    echo ✅ Environment configured for Docker development
    echo 📡 Backend URL: http://host.docker.internal:8080
    echo.
    echo To build and run:
    echo   docker-compose up --build
) else if "%1"=="local" (
    echo 🏠 Switching to local development mode...
    copy .env.development.local .env.local
    echo ✅ Environment configured for local development
    echo 📡 Backend URL: http://localhost:8080
    echo.
    echo To run locally:
    echo   npm run dev
) else (
    echo Usage:
    echo   .\switch-env.bat docker   - Configure for Docker development
    echo   .\switch-env.bat local    - Configure for local development
    echo.
    echo Current environment variables:
    echo NEXT_PUBLIC_BACKEND_URL:
    findstr "NEXT_PUBLIC_BACKEND_URL" .env.local 2>nul || echo "Not found in .env.local"
)