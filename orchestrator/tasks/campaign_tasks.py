
from celery_app import app
import logging
import asyncio

logger = logging.getLogger(__name__)

@app.task(bind=True, max_retries=3)
def execute_campaign_action(self, campaign_id: int, action_id: int):
    """
    Execute a campaign action
    """
    try:
        logger.info(f"Executing action {action_id} for campaign {campaign_id}")
        
        # Run async function in synchronous Celery task
        loop = asyncio.get_event_loop()
        loop.run_until_complete(_execute_campaign_action(campaign_id, action_id))
        
        return {"status": "success", "message": f"Campaign action {action_id} executed successfully"}
    except Exception as e:
        logger.error(f"Error executing campaign action {action_id}: {str(e)}")
        self.retry(exc=e, countdown=60)  # Retry after 60 seconds
        return {"status": "error", "message": str(e)}

@app.task(bind=True, max_retries=3)
def check_scheduled_actions(self):
    """
    Check for scheduled campaign actions and execute them
    """
    try:
        logger.info("Checking for scheduled campaign actions")
        
        # Run async function in synchronous Celery task
        loop = asyncio.get_event_loop()
        loop.run_until_complete(_check_scheduled_actions())
        
        return {"status": "success", "message": "Scheduled campaign actions checked successfully"}
    except Exception as e:
        logger.error(f"Error checking scheduled campaign actions: {str(e)}")
        self.retry(exc=e, countdown=300)  # Retry after 5 minutes
        return {"status": "error", "message": str(e)}

@app.task(bind=True, max_retries=3)
def update_campaign_metrics(self, campaign_id: int):
    """
    Update campaign metrics from external sources
    """
    try:
        logger.info(f"Updating metrics for campaign {campaign_id}")
        
        # Run async function in synchronous Celery task
        loop = asyncio.get_event_loop()
        loop.run_until_complete(_update_campaign_metrics(campaign_id))
        
        return {"status": "success", "message": f"Campaign {campaign_id} metrics updated successfully"}
    except Exception as e:
        logger.error(f"Error updating campaign metrics: {str(e)}")
        self.retry(exc=e, countdown=300)  # Retry after 5 minutes
        return {"status": "error", "message": str(e)}

# Async implementations for Celery tasks

async def _execute_campaign_action(campaign_id: int, action_id: int):
    """
    Execute a campaign action
    """
    from db.database import async_session
    from sqlalchemy import update, select
    from db.models import Campaign, CampaignAction
    from datetime import datetime
    
    logger.info(f"Executing action {action_id} for campaign {campaign_id}")
    
    async with async_session() as session:
        # Get the action
        result = await session.execute(
            select(CampaignAction).where(
                CampaignAction.id == action_id,
                CampaignAction.campaign_id == campaign_id
            )
        )
        action = result.scalars().first()
        
        if not action:
            raise ValueError(f"Campaign action {action_id} not found")
        
        # In a real implementation, this would execute the actual action
        # For now, we'll just update the action status
        
        # Mock execution
        import random
        success = random.random() > 0.1  # 90% success rate
        
        if success:
            # Update action status
            await session.execute(
                update(CampaignAction)
                .where(CampaignAction.id == action_id)
                .values(
                    status="completed",
                    completed_at=datetime.now().isoformat(),
                    results={
                        "success": True,
                        "metrics": {
                            "views": random.randint(100, 5000),
                            "likes": random.randint(10, 500),
                            "comments": random.randint(0, 50)
                        }
                    }
                )
            )
        else:
            # Update action status with error
            await session.execute(
                update(CampaignAction)
                .where(CampaignAction.id == action_id)
                .values(
                    status="failed",
                    completed_at=datetime.now().isoformat(),
                    results={
                        "success": False,
                        "error": "Execution failed due to platform error"
                    }
                )
            )
        
        await session.commit()
        
        logger.info(f"Action {action_id} for campaign {campaign_id} executed with status: {'success' if success else 'failed'}")

async def _check_scheduled_actions():
    """
    Check for scheduled campaign actions and execute them
    """
    from db.database import async_session
    from sqlalchemy import select, update
    from db.models import CampaignAction
    from datetime import datetime
    
    logger.info("Checking for scheduled campaign actions")
    
    async with async_session() as session:
        # Find actions that are scheduled for now or in the past and still pending
        now = datetime.now().isoformat()
        result = await session.execute(
            select(CampaignAction).where(
                CampaignAction.status == "pending",
                CampaignAction.scheduled_for <= now
            )
        )
        actions = result.scalars().all()
        
        logger.info(f"Found {len(actions)} actions to execute")
        
        for action in actions:
            # Update status to in-progress
            await session.execute(
                update(CampaignAction)
                .where(CampaignAction.id == action.id)
                .values(status="in-progress")
            )
            await session.commit()
            
            # Trigger a task to execute the action
            # In a real implementation, this would call the execute_campaign_action task
            # execute_campaign_action.delay(action.campaign_id, action.id)
            
            logger.info(f"Triggered execution for action {action.id} of campaign {action.campaign_id}")

async def _update_campaign_metrics(campaign_id: int):
    """
    Update campaign metrics from external sources
    """
    from db.database import async_session
    from sqlalchemy import select, update, delete
    from db.models import Campaign, CampaignMetric
    import random
    
    logger.info(f"Updating metrics for campaign {campaign_id}")
    
    async with async_session() as session:
        # Get the campaign
        result = await session.execute(
            select(Campaign).where(Campaign.id == campaign_id)
        )
        campaign = result.scalars().first()
        
        if not campaign:
            raise ValueError(f"Campaign {campaign_id} not found")
        
        # In a real implementation, this would fetch metrics from external sources
        # For demonstration, we'll generate random metrics
        
        # Define metrics to update
        metrics = [
            {"name": "views", "value": random.randint(1000, 10000), "target": 15000},
            {"name": "likes", "value": random.randint(100, 1500), "target": 2000},
            {"name": "comments", "value": random.randint(10, 200), "target": 300},
            {"name": "shares", "value": random.randint(5, 100), "target": 150}
        ]
        
        # Delete existing metrics
        await session.execute(
            delete(CampaignMetric).where(CampaignMetric.campaign_id == campaign_id)
        )
        
        # Add new metrics
        for metric in metrics:
            db_metric = CampaignMetric(
                campaign_id=campaign_id,
                name=metric["name"],
                value=metric["value"],
                target=metric["target"],
                change=random.uniform(-10, 30)  # Random change percentage
            )
            session.add(db_metric)
        
        await session.commit()
        
        logger.info(f"Updated metrics for campaign {campaign_id}")
