
# Celery Configuration
broker_url = 'redis://redis:6379/0'
result_backend = 'redis://redis:6379/0'

# Task settings
task_serializer = 'json'
accept_content = ['json']
result_serializer = 'json'
timezone = 'UTC'
enable_utc = True

# Task execution settings
worker_concurrency = 8
worker_prefetch_multiplier = 1
task_acks_late = True
task_reject_on_worker_lost = True
task_time_limit = 600  # 10 minutes
task_soft_time_limit = 500  # Gracefully handle timeouts

# Task routing
task_routes = {
    'tasks.bot_tasks.*': {'queue': 'bots'},
    'tasks.content_tasks.*': {'queue': 'content'},
    'tasks.campaign_tasks.*': {'queue': 'campaigns'},
}

# Logging
worker_hijack_root_logger = False
worker_log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
worker_task_log_format = '%(asctime)s - %(name)s - %(levelname)s - %(task_name)s[%(task_id)s] - %(message)s'
