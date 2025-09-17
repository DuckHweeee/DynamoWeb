# Dynamo Web - Docker Guide

This guide will help you run the Dynamo Web application locally using Docker on different machines.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)
- Git (to clone the repository)

## Quick Start

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd demo_dynamo_website
```

### 2. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your configuration
# Update API endpoints, database connections, etc.
```

### 3. Build and Run

#### Option A: Using Docker Compose (Recommended)
```bash
# Start the application
docker-compose up

# Or run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

#### Option B: Using Docker directly
```bash
# Build the image
docker build -t dynamo-web:latest .

# Run the container
docker run -p 3000:3000 --env-file .env dynamo-web:latest
```

### 4. Access the Application
Open your browser and navigate to: http://localhost:3000

## Scripts for Easy Setup

We've provided convenience scripts for different operating systems:

### Windows
```cmd
# Run the setup script
scripts\dev-setup.bat

# Or just build
scripts\build.bat
```

### Linux/macOS
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Run the setup script
./scripts/dev-setup.sh

# Or just build
./scripts/build.sh
```

## Development Workflow

### Starting Development
```bash
# Start all services
docker-compose up -d

# View real-time logs
docker-compose logs -f app

# Execute commands in the container
docker-compose exec app npm run dev
```

### Making Changes
The application supports hot reloading. Any changes to your code will be automatically reflected in the running container.

### Stopping Development
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (if needed)
docker-compose down -v
```

## Environment Configuration

### Required Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Application
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-api-server.com
API_SECRET_KEY=your-secret-key

# Database (if applicable)
DATABASE_URL=your-database-url

# Authentication (if applicable)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

### Development vs Production

- **Development**: Uses `docker-compose.yml` with hot reloading
- **Production**: Uses optimized build with Nginx reverse proxy

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using port 3000
   netstat -ano | findstr :3000  # Windows
   lsof -i :3000                 # macOS/Linux
   
   # Change port in docker-compose.yml or .env
   ```

2. **Docker Build Fails**
   ```bash
   # Clear Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **Permission Issues (Linux/macOS)**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

4. **Memory Issues**
   ```bash
   # Increase Docker memory limit in Docker Desktop settings
   # Or add to docker-compose.yml:
   services:
     app:
       deploy:
         resources:
           limits:
             memory: 2G
   ```

### Debugging

1. **Check Container Status**
   ```bash
   docker-compose ps
   ```

2. **View Container Logs**
   ```bash
   docker-compose logs app
   ```

3. **Access Container Shell**
   ```bash
   docker-compose exec app sh
   ```

4. **Inspect Container**
   ```bash
   docker inspect dynamo-web:latest
   ```

## Production Deployment

### Using Docker Compose with Nginx
```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d
```

### Using Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml dynamo-web
```

### Using Kubernetes
```bash
# Build and tag image
docker build -t your-registry/dynamo-web:latest .
docker push your-registry/dynamo-web:latest

# Apply Kubernetes manifests (create separately)
kubectl apply -f k8s/
```

## GitHub Actions CI/CD

The repository includes GitHub Actions workflows for automated deployment:

- **CI/CD Pipeline**: `.github/workflows/ci-cd.yml`
- **Development**: `.github/workflows/development.yml`

### Required Secrets

Add these secrets in your GitHub repository settings:

```
DOCKER_USERNAME=your-docker-username
DOCKER_PASSWORD=your-docker-password
SSH_PRIVATE_KEY=your-deployment-server-ssh-key
SSH_HOST=your-deployment-server-host
SSH_USER=your-deployment-server-user
```

## Performance Tips

1. **Multi-stage Build**: The Dockerfile uses multi-stage builds to reduce image size
2. **Caching**: Leverage Docker layer caching for faster builds
3. **Resource Limits**: Set appropriate memory and CPU limits
4. **Health Checks**: Monitor container health with built-in health checks

## Support

For issues and questions:

1. Check the logs: `docker-compose logs`
2. Verify environment variables are set correctly
3. Ensure Docker has sufficient resources allocated
4. Check network connectivity for API calls

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)