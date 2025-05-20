
#!/bin/bash
set -e

echo "==== Setting up Bot Orchestration Platform ===="

# Проверяем наличие .env файла
if [ ! -f ".env" ]; then
  echo "Creating .env file from example..."
  cp .env.example .env
  echo "Please review .env file and update with your configurations."
fi

# Функция для проверки доступности сервиса
check_service() {
  local host=$1
  local port=$2
  local service_name=$3
  local max_attempts=$4
  local wait_seconds=$5
  
  echo "Waiting for $service_name to be ready..."
  
  for ((i=1; i<=max_attempts; i++)); do
    if nc -z $host $port > /dev/null 2>&1; then
      echo "$service_name is available!"
      return 0
    fi
    echo "Attempt $i/$max_attempts: $service_name not ready yet. Waiting $wait_seconds seconds..."
    sleep $wait_seconds
  done
  
  echo "Error: $service_name is not available after $max_attempts attempts."
  return 1
}

# Запускаем сервисы
echo "Starting services with Docker Compose..."
docker-compose up -d

# Проверяем доступность PostgreSQL
check_service "localhost" 5432 "PostgreSQL" 10 3

# Проверяем доступность Redis
check_service "localhost" 6379 "Redis" 10 3

# Даем API немного времени на запуск
echo "Waiting for API to start (this may take up to 30 seconds)..."
sleep 5

# Проверяем доступность API
check_service "localhost" 8000 "API" 10 3

echo "==== Setup Complete ===="
echo "API is available at: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo "Frontend is available at: http://localhost:8080"

echo "Testing API health endpoint..."
if curl -s "http://localhost:8000/health" | grep -q '"status":"ok"'; then
  echo "✅ API health check succeeded!"
else
  echo "⚠️ API health check failed. Services might still be starting up."
fi

echo ""
echo "To stop the services, run: docker-compose down"
echo "To view logs, run: docker-compose logs -f"

# Make the script executable with: chmod +x start.sh
