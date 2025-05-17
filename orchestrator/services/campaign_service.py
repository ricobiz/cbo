
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload
from db.models import (
    Campaign as CampaignModel,
    CampaignAction as CampaignActionModel,
    CampaignMetric as CampaignMetricModel,
    CampaignPlatform as CampaignPlatformModel
)
from schemas.campaign import CampaignCreate, CampaignUpdate, CampaignStatus, CampaignAction, CampaignMetric
import logging

logger = logging.getLogger(__name__)

async def create_campaign(session: AsyncSession, campaign: CampaignCreate):
    """
    Create a new campaign
    """
    # Create the campaign
    db_campaign = CampaignModel(
        name=campaign.name,
        description=campaign.description,
        type=campaign.type,
        status=campaign.status,
        start_date=campaign.start_date,
        end_date=campaign.end_date,
        budget=campaign.budget,
        tags=campaign.tags
    )
    session.add(db_campaign)
    await session.commit()
    await session.refresh(db_campaign)
    
    # Add platform relations
    for platform in campaign.platforms:
        platform_rel = CampaignPlatformModel(
            campaign_id=db_campaign.id,
            platform=platform
        )
        session.add(platform_rel)
    
    await session.commit()
    await session.refresh(db_campaign)
    
    return db_campaign

async def get_campaign(session: AsyncSession, campaign_id: int):
    """
    Get a campaign by ID with its actions, metrics, and platforms
    """
    result = await session.execute(
        select(CampaignModel)
        .options(
            selectinload(CampaignModel.actions),
            selectinload(CampaignModel.metrics),
            selectinload(CampaignModel.platforms)
        )
        .where(CampaignModel.id == campaign_id)
    )
    return result.scalars().first()

async def get_campaigns(session: AsyncSession, filters: dict, skip: int = 0, limit: int = 100):
    """
    Get all campaigns with optional filtering
    """
    query = select(CampaignModel).options(
        selectinload(CampaignModel.actions),
        selectinload(CampaignModel.metrics),
        selectinload(CampaignModel.platforms)
    )
    
    # Apply filters
    if filters.get("status"):
        query = query.where(CampaignModel.status.in_(filters["status"]))
    
    if filters.get("type"):
        query = query.where(CampaignModel.type.in_(filters["type"]))
    
    if filters.get("platform") and filters["platform"]:
        # This requires a join with CampaignPlatformModel
        query = query.join(CampaignModel.platforms).where(CampaignPlatformModel.platform.in_(filters["platform"]))
    
    if filters.get("search"):
        search = f"%{filters['search']}%"
        query = query.where(
            (CampaignModel.name.ilike(search)) | 
            (CampaignModel.description.ilike(search))
        )
    
    query = query.offset(skip).limit(limit)
    result = await session.execute(query)
    return result.scalars().all()

async def update_campaign(session: AsyncSession, campaign_id: int, campaign_update: CampaignUpdate):
    """
    Update a campaign
    """
    # Get the campaign first to check if it exists
    db_campaign = await get_campaign(session, campaign_id)
    if not db_campaign:
        return None
    
    # Prepare update values, only include fields that are not None
    update_data = {k: v for k, v in campaign_update.dict().items() 
                   if v is not None and k != 'platforms'}
    
    # Update the campaign
    await session.execute(
        update(CampaignModel)
        .where(CampaignModel.id == campaign_id)
        .values(**update_data)
    )
    
    # Update platforms if provided
    if campaign_update.platforms is not None:
        # Delete existing platforms
        await session.execute(
            delete(CampaignPlatformModel)
            .where(CampaignPlatformModel.campaign_id == campaign_id)
        )
        
        # Add new platforms
        for platform in campaign_update.platforms:
            platform_rel = CampaignPlatformModel(
                campaign_id=campaign_id,
                platform=platform
            )
            session.add(platform_rel)
    
    await session.commit()
    
    # Get the updated campaign
    return await get_campaign(session, campaign_id)

async def delete_campaign(session: AsyncSession, campaign_id: int):
    """
    Delete a campaign
    """
    # Check if the campaign exists
    db_campaign = await get_campaign(session, campaign_id)
    if not db_campaign:
        return False
    
    # Delete the campaign
    await session.execute(delete(CampaignModel).where(CampaignModel.id == campaign_id))
    await session.commit()
    
    return True

async def update_campaign_status(session: AsyncSession, campaign_id: int, status: CampaignStatus):
    """
    Update campaign status
    """
    # Get the campaign first to check if it exists
    db_campaign = await get_campaign(session, campaign_id)
    if not db_campaign:
        return None
    
    # Update status
    db_campaign.status = status
    await session.commit()
    await session.refresh(db_campaign)
    
    return db_campaign

async def add_campaign_action(session: AsyncSession, campaign_id: int, action: CampaignAction):
    """
    Add an action to a campaign
    """
    # Check if the campaign exists
    db_campaign = await get_campaign(session, campaign_id)
    if not db_campaign:
        return None
    
    # Create a new action
    db_action = CampaignActionModel(
        campaign_id=campaign_id,
        type=action.type,
        status=action.status,
        scheduled_for=action.scheduled_for,
        platform=action.platform,
        details=action.details
    )
    
    session.add(db_action)
    await session.commit()
    await session.refresh(db_action)
    
    return db_action

async def add_campaign_metric(session: AsyncSession, campaign_id: int, metric: CampaignMetric):
    """
    Add a metric to a campaign
    """
    # Check if the campaign exists
    db_campaign = await get_campaign(session, campaign_id)
    if not db_campaign:
        return None
    
    # Create a new metric
    db_metric = CampaignMetricModel(
        campaign_id=campaign_id,
        name=metric.name,
        value=metric.value,
        target=metric.target,
        change=metric.change
    )
    
    session.add(db_metric)
    await session.commit()
    await session.refresh(db_metric)
    
    return db_metric
