
# Bot Orchestration Platform

A full-stack platform for orchestrating and managing bots across multiple platforms.

## Architecture

- **Frontend**: React + TypeScript + Vite, with Tailwind CSS and shadcn/ui
- **Backend**: FastAPI + SQLAlchemy + Celery
- **Database**: PostgreSQL
- **Queue**: Redis

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. Clone the repository
2. Run the setup script:

```bash
chmod +x start.sh
./start.sh
```

This will:
- Create a `.env` file from `.env.example` if none exists
- Start all services with Docker Compose
- Make the application available

### Accessing the Application

- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Project Structure

```
.
├── src/                      # Frontend React application
│   ├── components/           # UI components
│   ├── pages/                # Page components
│   ├── services/             # Frontend services
│   └── ...
├── orchestrator/             # Backend FastAPI application
│   ├── main.py               # FastAPI application entry point
│   ├── routers/              # API route definitions
│   ├── schemas/              # Pydantic models
│   ├── services/             # Business logic
│   ├── db/                   # Database models and connection
│   └── ...
├── docker-compose.yml        # Docker Compose configuration
├── Dockerfile                # Backend Docker configuration
└── README.md                 # This file
```

## Development

### Running in Development Mode

1. Start the backend services:

```bash
docker-compose up -d db redis api
```

2. Start the frontend development server:

```bash
cd frontend
npm install
npm run dev
```

### Running Tests

```bash
# Backend tests
docker-compose exec api pytest

# Frontend tests
npm test
```

## Environment Variables

See `.env.example` for all available configuration options.

## API Testing

You can test the API using curl or any HTTP client:

### Health Check

```bash
# Test API health
curl http://localhost:8000/health

# Expected response:
# {"status":"ok","message":"API server is running, database connection successful","version":"1.0.0","system":{"os":"Linux","python":"3.11.0"}}
```

### Bots API

```bash
# Get all bots
curl http://localhost:8000/bots

# Create a new bot
curl -X POST http://localhost:8000/bots \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Bot","platform":"instagram"}'
  
# Get a specific bot
curl http://localhost:8000/bots/1
```

### Campaigns API

```bash
# Get all campaigns
curl http://localhost:8000/campaigns

# Create a new campaign
curl -X POST http://localhost:8000/campaigns \
  -H "Content-Type: application/json" \
  -d '{"name":"Summer Campaign","description":"Summer promotion","platforms":["instagram"]}'
```

## Offline Mode

The application supports an offline mode when API server is not available. To use it:

1. Go to Settings > API
2. Enable "Offline Mode" toggle
3. The application will use mock data instead of real API calls

