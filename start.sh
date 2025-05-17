
#!/bin/bash
set -e

echo "==== Setting up Bot Orchestration Platform ===="

# Check if .env file exists, if not copy from example
if [ ! -f ".env" ]; then
  echo "Creating .env file from example..."
  cp .env.example .env
  echo "Please review .env file and update with your configurations."
fi

# Start the services
echo "Starting services with Docker Compose..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

echo "==== Setup Complete ===="
echo "API is available at: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo "Frontend is available at: http://localhost:8080"
echo "To stop the services, run: docker-compose down"

# Make the script executable with: chmod +x start.sh
