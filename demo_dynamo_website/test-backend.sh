#!/bin/bash

echo "🔍 Testing Backend Connectivity..."
echo ""

# Test from host machine
echo "📋 Testing from host machine (localhost):"
echo "Machine API:" 
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/machine || echo "Failed"
echo ""

echo "Staff API:" 
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/staff || echo "Failed"
echo ""

echo "Group API:" 
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/group || echo "Failed"
echo ""

echo "Process API:" 
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/drawing-code-process || echo "Failed"
echo ""

echo "🐳 Testing from Docker (host.docker.internal):"
echo "This should be tested from inside the Docker container"
echo ""

echo "✅ Backend connectivity test complete!"
echo ""
echo "Expected responses:"
echo "- 200: API is working"
echo "- 404: Endpoint not found but server is reachable"
echo "- Failed/timeout: Server is not running or not accessible"