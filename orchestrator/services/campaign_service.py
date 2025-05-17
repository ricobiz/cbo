
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from typing import List, Dict, Any, Optional
from db.models import Campaign, CampaignAction, CampaignMetric, CampaignPlatform
from schemas.campaign import CampaignCreate, CampaignUpdate, CampaignStatus
import logging
from celery_app import app as celery_app
from datetime import datetime

logger = logging.getLogger(__name__)

async def create_campaign(session: AsyncSession, campaign_data: CampaignCreate) -> Dict[str, Any]:
    """Create a new campaign"""
    try:
        new_campaign = Campaign(
            name=campaign_data.name,
            description=campaign_data.description,
            type=campaign_data.type,
            status=campaign_data.status,
            start_date=campaign_data.start_date,
            end_date=campaign_data.end_date,
            budget=campaign_data.budget,
            tags=campaign_data.tags
        )
        
        session.add(new_campaign)
        await session.commit()
        await session.refresh(new_campaign)
        
        # Add platforms to the campaign
        for platform in campaign_data.platforms:
            campaign_platform = CampaignPlatform(
                campaign_id=new_campaign.id,
                platform=platform
            )
            session.add(campaign_platform)
        
        await session.commit()
        
        # Create a Celery task for campaign processing
        task = celery_app.send_task(
            'tasks.campaign_tasks.process_campaign', 
            args=[new_campaign.id]
        )
        
        # Convert to dict for serialization
        campaign_dict = {
            "id": str(new_campaign.id),
            "name": new_campaign.name,
            "description": new_campaign.description,
            "type": new_campaign.type,
            "status": new_campaign.status,
            "platforms": [p for p in campaign_data.platforms],
            "startDate": new_campaign.start_date.isoformat() if new_campaign.start_date else None,
            "endDate": new_campaign.end_date.isoformat() if new_campaign.end_date else None,
            "budget": new_campaign.budget,
            "tags": new_campaign.tags or [],
            "metrics": [],
            "actions": [],
            "createdAt": new_campaign.created_at.isoformat() if new_campaign.created_at else None,
            "updatedAt": new_campaign.updated_at.isoformat() if new_campaign.updated_at else None,
            "taskId": task.id
        }
        
        return campaign_dict
    except Exception as e:
        logger.error(f"Error creating campaign: {str(e)}")
        await session.rollback()
        raise

async def get_campaign(session: AsyncSession, campaign_id: int) -> Optional[Dict[str, Any]]:
    """Get a campaign by ID"""
    try:
        result = await session.execute(
            select(Campaign).filter(Campaign.id == campaign_id)
        )
        campaign = result.scalars().first()
        
        if not campaign:
            return None
            
        # Get platforms
        platforms_result = await session.execute(
            select(CampaignPlatform).filter(CampaignPlatform.campaign_id == campaign_id)
        )
        platforms = platforms_result.scalars().all()
        
        # Get metrics
        metrics_result = await session.execute(
            select(CampaignMetric).filter(CampaignMetric.campaign_id == campaign_id)
        )
        metrics = metrics_result.scalars().all()
        
        # Get actions
        actions_result = await session.execute(
            select(CampaignAction).filter(CampaignAction.campaign_id == campaign_id)
        )
        actions = actions_result.scalars().all()
        
        # Convert to dict for serialization
        return {
            "id": str(campaign.id),
            "name": campaign.name,
            "description": campaign.description,
            "type": campaign.type,
            "status": campaign.status,
            "platforms": [p.platform for p in platforms],
            "startDate": campaign.start_date.isoformat() if campaign.start_date else None,
            "endDate": campaign.end_date.isoformat() if campaign.end_date else None,
            "budget": campaign.budget,
            "tags": campaign.tags or [],
            "metrics": [
                {
                    "name": m.name,
                    "value": m.value,
                    "target": m.target,
                    "change": m.change
                } for m in metrics
            ],
            "actions": [
                {
                    "id": str(a.id),
                    "type": a.type,
                    "status": a.status,
                    "platform": a.platform,
                    "scheduledFor": a.scheduled_for.isoformat() if a.scheduled_for else None,
                    "completedAt": a.completed_at.isoformat() if a.completed_at else None,
                    "details": a.details or {},
                    "results": a.results or {}
                } for a in actions
            ],
            "createdAt": campaign.created_at.isoformat() if campaign.created_at else None,
            "updatedAt": campaign.updated_at.isoformat() if campaign.updated_at else None
        }
    except Exception as e:
        logger.error(f"Error retrieving campaign: {str(e)}")
        raise

async def get_campaigns(session: AsyncSession, filters: Dict[str, Any], skip: int, limit: int) -> List[Dict[str, Any]]:
    """Get all campaigns with optional filtering"""
    try:
        query = select(Campaign)
        
        # Apply filters if provided
        if filters.get("status"):
            query = query.filter(Campaign.status.in_(filters["status"]))
            
        if filters.get("type"):
            query = query.filter(Campaign.type.in_(filters["type"]))
            
        if filters.get("platform") and filters["platform"]:
            # This requires a join with platform table
            query = query.join(CampaignPlatform).filter(CampaignPlatform.platform.in_(filters["platform"]))
            
        if filters.get("search"):
            search = f"%{filters['search']}%"
            query = query.filter(Campaign.name.ilike(search) | Campaign.description.ilike(search))
            
        # Apply pagination
        query = query.offset(skip).limit(limit)
        
        result = await session.execute(query)
        campaigns = result.scalars().all()
        
        # Convert to list of dicts for serialization
        campaign_list = []
        for campaign in campaigns:
            # Get platforms for this campaign
            platforms_result = await session.execute(
                select(CampaignPlatform).filter(CampaignPlatform.campaign_id == campaign.id)
            )
            platforms = platforms_result.scalars().all()
            
            # Get metrics for this campaign
            metrics_result = await session.execute(
                select(CampaignMetric).filter(CampaignMetric.campaign_id == campaign.id)
            )
            metrics = metrics_result.scalars().all()
            
            # Get actions for this campaign
            actions_result = await session.execute(
                select(CampaignAction).filter(CampaignAction.campaign_id == campaign.id)
            )
            actions = actions_result.scalars().all()
            
            campaign_list.append({
                "id": str(campaign.id),
                "name": campaign.name,
                "description": campaign.description,
                "type": campaign.type,
                "status": campaign.status,
                "platforms": [p.platform for p in platforms],
                "startDate": campaign.start_date.isoformat() if campaign.start_date else None,
                "endDate": campaign.end_date.isoformat() if campaign.end_date else None,
                "budget": campaign.budget,
                "tags": campaign.tags or [],
                "metrics": [
                    {
                        "name": m.name,
                        "value": m.value,
                        "target": m.target,
                        "change": m.change
                    } for m in metrics
                ],
                "actions": [
                    {
                        "id": str(a.id),
                        "type": a.type,
                        "status": a.status,
                        "platform": a.platform,
                        "scheduledFor": a.scheduled_for.isoformat() if a.scheduled_for else None,
                        "completedAt": a.completed_at.isoformat() if a.completed_at else None,
                        "details": a.details or {},
                        "results": a.results or {}
                    } for a in actions
                ],
                "createdAt": campaign.created_at.isoformat() if campaign.created_at else None,
                "updatedAt": campaign.updated_at.isoformat() if campaign.updated_at else None
            })
            
        return campaign_list
    except Exception as e:
        logger.error(f"Error retrieving campaigns: {str(e)}")
        raise

async def update_campaign(session: AsyncSession, campaign_id: int, campaign_update: CampaignUpdate) -> Optional[Dict[str, Any]]:
    """Update a campaign"""
    try:
        result = await session.execute(select(Campaign).filter(Campaign.id == campaign_id))
        campaign = result.scalars().first()
        
        if not campaign:
            return None
            
        # Update fields if provided in the update data
        update_data = campaign_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            if key != "platforms":  # Handle platforms separately
                setattr(campaign, key, value)
        
        # Update platforms if provided
        if campaign_update.platforms is not None:
            # Delete existing platforms
            await session.execute(delete(CampaignPlatform).filter(CampaignPlatform.campaign_id == campaign_id))
            
            # Add new platforms
            for platform in campaign_update.platforms:
                campaign_platform = CampaignPlatform(
                    campaign_id=campaign.id,
                    platform=platform
                )
                session.add(campaign_platform)
        
        campaign.updated_at = datetime.now()
        await session.commit()
        
        # Return updated campaign
        return await get_campaign(session, campaign_id)
    except Exception as e:
        logger.error(f"Error updating campaign: {str(e)}")
        await session.rollback()
        raise

async def delete_campaign(session: AsyncSession, campaign_id: int) -> bool:
    """Delete a campaign"""
    try:
        result = await session.execute(select(Campaign).filter(Campaign.id == campaign_id))
        campaign = result.scalars().first()
        
        if not campaign:
            return False
            
        await session.delete(campaign)
        await session.commit()
        return True
    except Exception as e:
        logger.error(f"Error deleting campaign: {str(e)}")
        await session.rollback()
        raise

async def update_campaign_status(session: AsyncSession, campaign_id: int, status: CampaignStatus) -> Optional[Dict[str, Any]]:
    """Update campaign status"""
    try:
        result = await session.execute(select(Campaign).filter(Campaign.id == campaign_id))
        campaign = result.scalars().first()
        
        if not campaign:
            return None
            
        campaign.status = status
        campaign.updated_at = datetime.now()
        await session.commit()
        
        # Return updated campaign
        return await get_campaign(session, campaign_id)
    except Exception as e:
        logger.error(f"Error updating campaign status: {str(e)}")
        await session.rollback()
        raise

async def add_campaign_action(session: AsyncSession, campaign_id: int, action_data: Dict[str, Any]) -> Dict[str, Any]:
    """Add an action to a campaign"""
    try:
        result = await session.execute(select(Campaign).filter(Campaign.id == campaign_id))
        campaign = result.scalars().first()
        
        if not campaign:
            raise ValueError(f"Campaign with ID {campaign_id} not found")
            
        new_action = CampaignAction(
            campaign_id=campaign_id,
            type=action_data.get("type"),
            status=action_data.get("status", "pending"),
            scheduled_for=datetime.fromisoformat(action_data.get("scheduledFor")) if action_data.get("scheduledFor") else None,
            completed_at=datetime.fromisoformat(action_data.get("completedAt")) if action_data.get("completedAt") else None,
            platform=action_data.get("platform"),
            details=action_data.get("details"),
            results=action_data.get("results")
        )
        
        session.add(new_action)
        await session.commit()
        await session.refresh(new_action)
        
        campaign.updated_at = datetime.now()
        await session.commit()
        
        # Convert to dict for serialization
        action_dict = {
            "id": str(new_action.id),
            "type": new_action.type,
            "status": new_action.status,
            "platform": new_action.platform,
            "scheduledFor": new_action.scheduled_for.isoformat() if new_action.scheduled_for else None,
            "completedAt": new_action.completed_at.isoformat() if new_action.completed_at else None,
            "details": new_action.details or {},
            "results": new_action.results or {}
        }
        
        return action_dict
    except Exception as e:
        logger.error(f"Error adding campaign action: {str(e)}")
        await session.rollback()
        raise

async def add_campaign_metric(session: AsyncSession, campaign_id: int, metric_data: Dict[str, Any]) -> Dict[str, Any]:
    """Add a metric to a campaign"""
    try:
        result = await session.execute(select(Campaign).filter(Campaign.id == campaign_id))
        campaign = result.scalars().first()
        
        if not campaign:
            raise ValueError(f"Campaign with ID {campaign_id} not found")
            
        new_metric = CampaignMetric(
            campaign_id=campaign_id,
            name=metric_data.get("name"),
            value=metric_data.get("value"),
            target=metric_data.get("target"),
            change=metric_data.get("change")
        )
        
        session.add(new_metric)
        await session.commit()
        await session.refresh(new_metric)
        
        campaign.updated_at = datetime.now()
        await session.commit()
        
        # Convert to dict for serialization
        metric_dict = {
            "id": new_metric.id,
            "name": new_metric.name,
            "value": new_metric.value,
            "target": new_metric.target,
            "change": new_metric.change
        }
        
        return metric_dict
    except Exception as e:
        logger.error(f"Error adding campaign metric: {str(e)}")
        await session.rollback()
        raise
