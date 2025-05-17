
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
