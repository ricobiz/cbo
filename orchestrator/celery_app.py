
from celery import Celery
import os

# Create Celery instance
app = Celery('orchestrator')

# Load celery configuration from celery_config.py module
app.config_from_object('celery_config')

# Auto-discover tasks in the project
app.autodiscover_tasks(['tasks'])

if __name__ == '__main__':
    app.start()
