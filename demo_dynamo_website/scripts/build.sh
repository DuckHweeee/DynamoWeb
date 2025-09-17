#!/bin/bash

# Build script for local development
echo "🚀 Building Dynamo Web Application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build the Docker image
echo "🐳 Building Docker image..."
docker build -t dynamo-web:latest .

# Check build status
if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo ""
    echo "To run the application:"
    echo "  docker run -p 3000:3000 dynamo-web:latest"
    echo ""
    echo "Or use docker-compose:"
    echo "  docker-compose up"
else
    echo "❌ Docker build failed!"
    exit 1
fi