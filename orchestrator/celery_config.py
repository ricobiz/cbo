
from celery import Celery
import os

# Define Celery configurations
broker_url = os.environ.get("CELERY_BROKER_URL", "redis://redis:6379/0")
result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://redis:6379/0")

task_serializer = 'json'
result_serializer = 'json'
accept_content = ['json']
timezone = 'UTC'
enable_utc = True

# Task routes
task_routes = {
    'tasks.bot_tasks.*': {'queue': 'bot_tasks'},
    'tasks.campaign_tasks.*': {'queue': 'campaign_tasks'},
    'tasks.content_tasks.*': {'queue': 'content_tasks'},
}

# Task soft time limit (30 minutes)
task_soft_time_limit = 1800

# Task hard time limit (35 minutes)
task_time_limit = 2100
