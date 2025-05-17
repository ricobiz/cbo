
# Influence Flux Orchestrator

Backend API orchestrator for Influence Flux Automator built with FastAPI, SQLAlchemy, and Celery.

## Features

- RESTful API endpoints for bots, campaigns, content, and analytics
- PostgreSQL database with SQLAlchemy ORM
- Asynchronous task processing with Celery and Redis
- Dockerized development and production environments
- Comprehensive data models and schemas

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. Clone the repository
2. Navigate to the orchestrator directory
3. Create a `.env` file (use `.env.example` as a template)
4. Run the application with Docker Compose:

```bash
docker-compose up -d
```

### API Documentation

Once running, the API documentation is available at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
orchestrator/
├── main.py                  # FastAPI application entry point
├── routers/                 # API route definitions
├── schemas/                 # Pydantic models for request/response validation
├── services/                # Business logic layer
├── db/                      # Database models and connection
├── tasks/                   # Celery background tasks
├── utils/                   # Helper utilities
├── migrations/              # Alembic database migrations
├── Dockerfile               # Docker container definition
├── docker-compose.yml       # Docker Compose configuration
└── requirements.txt         # Python dependencies
```

## API Endpoints

### Bots
- `POST /bots/` - Create a new bot
- `GET /bots/{bot_id}` - Get details for a specific bot
- `GET /bots/` - List all bots with optional filtering

### Campaigns
- `POST /campaigns/` - Create a new campaign
- `GET /campaigns/{campaign_id}` - Get details for a specific campaign
- `GET /campaigns/` - List all campaigns with optional filtering

### Content
- `POST /content/generate` - Generate content (text/image/audio)
- `GET /content/{content_id}` - Get details for specific content
- `GET /content/` - List all content

### Analytics
- `POST /analytics/dashboard` - Get analytics dashboard data
- `GET /analytics/campaigns/performance` - Get campaign performance metrics
- `GET /analytics/bots/performance` - Get bot performance metrics
- `GET /analytics/content/performance` - Get content performance metrics

## Development

### Database Migrations

Create a new migration:

```bash
docker-compose exec api alembic revision --autogenerate -m "description"
```

Apply migrations:

```bash
docker-compose exec api alembic upgrade head
```

### Celery Tasks

Worker logs:

```bash
docker-compose logs -f celery_worker
```

Beat scheduler logs:

```bash
docker-compose logs -f celery_beat
```

## Integration with Frontend

The frontend should interact with this API using standard HTTP requests. Example:

```typescript
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const createBot = async (botData) => {
  const response = await axios.post(`${API_URL}/bots/`, botData);
  return response.data;
};
```
