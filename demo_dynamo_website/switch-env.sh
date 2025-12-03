#!/bin/bash

echo "🔧 Dynamo Web Development Mode Switcher"
echo ""

if [ "$1" == "docker" ]; then
    echo "🐳 Switching to Docker development mode..."
    cp .env.docker .env.local
    echo "✅ Environment configured for Docker development"
    echo "📡 Backend URL: http://host.docker.internal:8080"
    echo ""
    echo "To build and run:"
    echo "  docker-compose up --build"
elif [ "$1" == "local" ]; then
    echo "🏠 Switching to local development mode..."
    cp .env.development.local .env.local
    echo "✅ Environment configured for local development"
    echo "📡 Backend URL: http://localhost:8080"
    echo ""
    echo "To run locally:"
    echo "  npm run dev"
else
    echo "Usage:"
    echo "  ./switch-env.sh docker   - Configure for Docker development"
    echo "  ./switch-env.sh local    - Configure for local development"
    echo ""
    echo "Current environment variables:"
    echo "NEXT_PUBLIC_BACKEND_URL:"
    grep "NEXT_PUBLIC_BACKEND_URL" .env.local 2>/dev/null || echo "Not found in .env.local"
fi