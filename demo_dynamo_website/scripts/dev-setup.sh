#!/bin/bash

# Development setup script
echo "🔧 Setting up Dynamo Web Development Environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
fi

# Pull necessary Docker images
echo "📦 Pulling Docker images..."
docker-compose pull

# Build the application
echo "🏗️ Building application..."
docker-compose build

# Start the development environment
echo "🚀 Starting development environment..."
docker-compose up -d

echo "✅ Development environment is ready!"
echo ""
echo "🌐 Application: http://localhost:3000"
echo ""
echo "To stop the development environment:"
echo "  docker-compose down"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"