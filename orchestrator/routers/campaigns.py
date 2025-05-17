
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from db.database import get_session
from db.models import Campaign as CampaignModel
from schemas.campaign import (
    Campaign, CampaignCreate, CampaignUpdate,
    CampaignStatus, CampaignType, CampaignPlatform,
    CampaignAction, CampaignMetric
)
import logging
from services import campaign_service

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=Campaign)
async def create_campaign(campaign: CampaignCreate, session: AsyncSession = Depends(get_session)):
    """
    Create a new campaign
    """
    try:
        return await campaign_service.create_campaign(session, campaign)
    except Exception as e:
        logger.error(f"Error creating campaign: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create campaign: {str(e)}")

@router.get("/{campaign_id}", response_model=Campaign)
async def get_campaign(campaign_id: int, session: AsyncSession = Depends(get_session)):
    """
    Get a campaign by ID
    """
    try:
        campaign = await campaign_service.get_campaign(session, campaign_id)
        if not campaign:
            raise HTTPException(status_code=404, detail=f"Campaign with ID {campaign_id} not found")
        return campaign
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving campaign: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve campaign: {str(e)}")

@router.get("/", response_model=List[Campaign])
async def get_campaigns(
    status: Optional[List[CampaignStatus]] = Query(None),
    type: Optional[List[CampaignType]] = Query(None),
    platform: Optional[List[CampaignPlatform]] = Query(None),
    search: Optional[str] = None,
    skip: int = 0, 
    limit: int = 100,
    session: AsyncSession = Depends(get_session)
):
    """
    Get all campaigns with optional filtering
    """
    try:
        filters = {
            "status": status,
            "type": type,
            "platform": platform,
            "search": search
        }
        return await campaign_service.get_campaigns(session, filters, skip, limit)
    except Exception as e:
        logger.error(f"Error retrieving campaigns: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve campaigns: {str(e)}")

@router.put("/{campaign_id}", response_model=Campaign)
async def update_campaign(campaign_id: int, campaign_update: CampaignUpdate, session: AsyncSession = Depends(get_session)):
    """
    Update a campaign
    """
    try:
        campaign = await campaign_service.update_campaign(session, campaign_id, campaign_update)
        if not campaign:
            raise HTTPException(status_code=404, detail=f"Campaign with ID {campaign_id} not found")
        return campaign
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating campaign: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update campaign: {str(e)}")

@router.delete("/{campaign_id}")
async def delete_campaign(campaign_id: int, session: AsyncSession = Depends(get_session)):
    """
    Delete a campaign
    """
    try:
        success = await campaign_service.delete_campaign(session, campaign_id)
        if not success:
            raise HTTPException(status_code=404, detail=f"Campaign with ID {campaign_id} not found")
        return {"message": f"Campaign with ID {campaign_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting campaign: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete campaign: {str(e)}")

@router.post("/{campaign_id}/actions", response_model=CampaignAction)
async def add_campaign_action(campaign_id: int, action: CampaignAction, session: AsyncSession = Depends(get_session)):
    """
    Add an action to a campaign
    """
    try:
        return await campaign_service.add_campaign_action(session, campaign_id, action)
    except Exception as e:
        logger.error(f"Error adding campaign action: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to add campaign action: {str(e)}")

@router.post("/{campaign_id}/metrics", response_model=CampaignMetric)
async def add_campaign_metric(campaign_id: int, metric: CampaignMetric, session: AsyncSession = Depends(get_session)):
    """
    Add a metric to a campaign
    """
    try:
        return await campaign_service.add_campaign_metric(session, campaign_id, metric)
    except Exception as e:
        logger.error(f"Error adding campaign metric: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to add campaign metric: {str(e)}")

@router.post("/{campaign_id}/status")
async def update_campaign_status(campaign_id: int, status: CampaignStatus, session: AsyncSession = Depends(get_session)):
    """
    Update campaign status
    """
    try:
        campaign = await campaign_service.update_campaign_status(session, campaign_id, status)
        if not campaign:
            raise HTTPException(status_code=404, detail=f"Campaign with ID {campaign_id} not found")
        return {"message": f"Campaign status updated to {status}"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating campaign status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update campaign status: {str(e)}")
