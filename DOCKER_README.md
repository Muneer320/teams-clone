# Teams Clone - Docker Setup

This project uses Docker and Docker Compose to easily run both the frontend and backend services.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your system
- [Docker Compose](https://docs.docker.com/compose/install/) installed (usually comes with Docker Desktop)

## Quick Start

### 1. Clone the repository (if not already done)
```bash
git clone https://github.com/Muneer320/teams-clone.git
cd teams-clone
```

### 2. Start all services with Docker Compose
```bash
docker-compose up
```

This single command will:
- Build the Docker images for both frontend and backend
- Start the backend service on `http://localhost:3001`
- Start the frontend service on `http://localhost:5173`
- Set up networking between the containers

### 3. Access the application
- **Frontend**: Open your browser and navigate to `http://localhost:5173`
- **Backend API**: Available at `http://localhost:3001`

## Docker Commands

### Start services in detached mode (background)
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### Rebuild images (after code changes)
```bash
docker-compose up --build
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Restart a specific service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Stop and remove all containers, networks, and volumes
```bash
docker-compose down -v
```

## Project Structure

```
teams-clone/
├── backend/
│   ├── Dockerfile           # Backend Docker configuration
│   ├── .dockerignore        # Files to exclude from Docker build
│   ├── package.json
│   └── src/
├── frontend/
│   ├── Dockerfile           # Frontend Docker configuration
│   ├── .dockerignore        # Files to exclude from Docker build
│   ├── package.json
│   └── src/
├── docker-compose.yml       # Orchestrates both services
└── DOCKER_README.md         # This file
```

## Environment Variables

### Backend Environment Variables
The backend uses the following environment variables (configured in `docker-compose.yml`):
- `PORT=3001` - Backend server port
- `CORS_ORIGIN=http://localhost:5173` - Frontend URL for CORS
- `NODE_ENV=development` - Environment mode

### Frontend Environment Variables
The frontend uses the following environment variables:
- `VITE_API_URL=http://localhost:3001` - Backend API URL
- `VITE_SOCKET_URL=http://localhost:3001` - WebSocket server URL

## Development Workflow

### Making Code Changes
The Docker setup includes volume mounts, so changes to your code are reflected immediately:
- **Backend**: Uses `npm start` with Node's watch mode
- **Frontend**: Uses Vite's hot module replacement (HMR)

Just edit your files and refresh the browser (frontend) or wait for the server to restart (backend).

### Installing New Dependencies

If you add new npm packages, you'll need to rebuild the containers:

```bash
# Stop the services
docker-compose down

# Rebuild with new dependencies
docker-compose up --build
```

## Troubleshooting

### Port already in use
If you get an error about ports already in use:
1. Stop any local development servers running on ports 3001 or 5173
2. Or modify the ports in `docker-compose.yml`

### Database not persisting
The database is stored in `./backend/database` and is mounted as a volume, so data persists across container restarts.

### Permission issues on Linux/Mac
If you encounter permission issues:
```bash
sudo chown -R $USER:$USER .
```

### Clear everything and start fresh
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Production Deployment

For production deployment, you'll want to:
1. Create a production Dockerfile for the frontend that builds static assets
2. Update environment variables for production URLs
3. Use a reverse proxy like Nginx
4. Set up proper SSL/TLS certificates

## Support

For issues or questions, please open an issue on the GitHub repository.
