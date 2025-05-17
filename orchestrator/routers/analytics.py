
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import get_session
from schemas.analytics import AnalyticsRequest, AnalyticsDashboardResponse
import logging
from services import analytics_service

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/dashboard", response_model=AnalyticsDashboardResponse)
async def get_analytics_dashboard(request: AnalyticsRequest, session: AsyncSession = Depends(get_session)):
    """
    Get analytics dashboard data
    """
    try:
        return await analytics_service.get_dashboard_data(session, request)
    except Exception as e:
        logger.error(f"Error retrieving analytics dashboard: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve analytics dashboard: {str(e)}")

@router.get("/campaigns/performance")
async def get_campaign_performance(campaign_id: int = None, session: AsyncSession = Depends(get_session)):
    """
    Get campaign performance metrics
    """
    try:
        return await analytics_service.get_campaign_performance(session, campaign_id)
    except Exception as e:
        logger.error(f"Error retrieving campaign performance: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve campaign performance: {str(e)}")

@router.get("/bots/performance")
async def get_bot_performance(bot_id: int = None, session: AsyncSession = Depends(get_session)):
    """
    Get bot performance metrics
    """
    try:
        return await analytics_service.get_bot_performance(session, bot_id)
    except Exception as e:
        logger.error(f"Error retrieving bot performance: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve bot performance: {str(e)}")

@router.get("/content/performance")
async def get_content_performance(content_id: int = None, session: AsyncSession = Depends(get_session)):
    """
    Get content performance metrics
    """
    try:
        return await analytics_service.get_content_performance(session, content_id)
    except Exception as e:
        logger.error(f"Error retrieving content performance: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve content performance: {str(e)}")
