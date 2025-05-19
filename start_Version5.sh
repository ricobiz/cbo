#!/bin/bash

ENV_FILE=".env"
EXAMPLE_ENV_FILE=".env.example"

if [ ! -f "$ENV_FILE" ]; then
    if [ -f "$EXAMPLE_ENV_FILE" ]; then
        echo "Файл $ENV_FILE не найден. Копирую из $EXAMPLE_ENV_FILE..."
        cp "$EXAMPLE_ENV_FILE" "$ENV_FILE"
        echo "Пожалуйста, проверьте и при необходимости отредактируйте $ENV_FILE."
    else
        echo "Ошибка: $ENV_FILE не найден, и $EXAMPLE_ENV_FILE тоже отсутствует."
        exit 1
    fi
fi

echo "Запуск всех сервисов с помощью Docker Compose..."
docker-compose up -d --build --remove-orphans

echo ""
echo "Проверка статуса контейнеров:"
docker-compose ps
echo ""
echo "---------------------------------------------------------------------"
echo "Приложение должно быть доступно через несколько минут:"
echo "  Фронтенд: http://localhost:8080"
echo "  API (бэкенд): http://localhost:8000"
echo "  Документация API (Swagger): http://localhost:8000/docs"
echo "---------------------------------------------------------------------"
echo "Логи: docker-compose logs -f"
echo "Остановка: docker-compose down"
echo "---------------------------------------------------------------------"