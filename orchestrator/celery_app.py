
import os
from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('CELERY_CONFIG', 'celery_config')

# Create Celery app
app = Celery('orchestrator')

# Use a string here instead of a module directly to avoid any problems with
# importing modules when using Windows.
app.config_from_object('celery_config')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks(['tasks'])

if __name__ == '__main__':
    app.start()
