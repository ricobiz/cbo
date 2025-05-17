
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from typing import List, Optional
from db.database import get_session
from db.models import Bot as BotModel, BotAction as BotActionModel, BotActivity as BotActivityModel
from schemas.bot import Bot, BotCreate, BotUpdate, BotAction, BotActivity, BotStatus, BotType, BotPlatform, BotHealthStatus
import logging
from services import bot_service

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=Bot)
async def create_bot(bot: BotCreate, session: AsyncSession = Depends(get_session)):
    """
    Create a new bot
    """
    try:
        return await bot_service.create_bot(session, bot)
    except Exception as e:
        logger.error(f"Error creating bot: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create bot: {str(e)}")

@router.get("/{bot_id}", response_model=Bot)
async def get_bot(bot_id: int, session: AsyncSession = Depends(get_session)):
    """
    Get a bot by ID
    """
    try:
        bot = await bot_service.get_bot(session, bot_id)
        if not bot:
            raise HTTPException(status_code=404, detail=f"Bot with ID {bot_id} not found")
        return bot
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving bot: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve bot: {str(e)}")

@router.get("/", response_model=List[Bot])
async def get_bots(
    status: Optional[List[BotStatus]] = Query(None),
    type: Optional[List[BotType]] = Query(None),
    platform: Optional[List[BotPlatform]] = Query(None),
    health: Optional[List[BotHealthStatus]] = Query(None),
    search: Optional[str] = None,
    skip: int = 0, 
    limit: int = 100,
    session: AsyncSession = Depends(get_session)
):
    """
    Get all bots with optional filtering
    """
    try:
        filters = {
            "status": status,
            "type": type,
            "platform": platform,
            "health": health,
            "search": search
        }
        return await bot_service.get_bots(session, filters, skip, limit)
    except Exception as e:
        logger.error(f"Error retrieving bots: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve bots: {str(e)}")

@router.put("/{bot_id}", response_model=Bot)
async def update_bot(bot_id: int, bot_update: BotUpdate, session: AsyncSession = Depends(get_session)):
    """
    Update a bot
    """
    try:
        bot = await bot_service.update_bot(session, bot_id, bot_update)
        if not bot:
            raise HTTPException(status_code=404, detail=f"Bot with ID {bot_id} not found")
        return bot
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating bot: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update bot: {str(e)}")

@router.delete("/{bot_id}")
async def delete_bot(bot_id: int, session: AsyncSession = Depends(get_session)):
    """
    Delete a bot
    """
    try:
        success = await bot_service.delete_bot(session, bot_id)
        if not success:
            raise HTTPException(status_code=404, detail=f"Bot with ID {bot_id} not found")
        return {"message": f"Bot with ID {bot_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting bot: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete bot: {str(e)}")

@router.post("/{bot_id}/start")
async def start_bot(bot_id: int, session: AsyncSession = Depends(get_session)):
    """
    Start a bot
    """
    try:
        bot = await bot_service.update_bot_status(session, bot_id, BotStatus.RUNNING)
        if not bot:
            raise HTTPException(status_code=404, detail=f"Bot with ID {bot_id} not found")
        # Here we would also trigger a Celery task to actually start the bot
        # bot_tasks.start_bot.delay(bot_id)
        return {"message": f"Bot with ID {bot_id} started successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error starting bot: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to start bot: {str(e)}")

@router.post("/{bot_id}/stop")
async def stop_bot(bot_id: int, session: AsyncSession = Depends(get_session)):
    """
    Stop a bot
    """
    try:
        bot = await bot_service.update_bot_status(session, bot_id, BotStatus.IDLE)
        if not bot:
            raise HTTPException(status_code=404, detail=f"Bot with ID {bot_id} not found")
        # Here we would also trigger a Celery task to actually stop the bot
        # bot_tasks.stop_bot.delay(bot_id)
        return {"message": f"Bot with ID {bot_id} stopped successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error stopping bot: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to stop bot: {str(e)}")

@router.get("/{bot_id}/actions", response_model=List[BotAction])
async def get_bot_actions(bot_id: int, skip: int = 0, limit: int = 100, session: AsyncSession = Depends(get_session)):
    """
    Get all actions for a bot
    """
    try:
        bot = await bot_service.get_bot(session, bot_id)
        if not bot:
            raise HTTPException(status_code=404, detail=f"Bot with ID {bot_id} not found")
        return await bot_service.get_bot_actions(session, bot_id, skip, limit)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving bot actions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve bot actions: {str(e)}")

@router.get("/{bot_id}/activities", response_model=List[BotActivity])
async def get_bot_activities(bot_id: int, skip: int = 0, limit: int = 100, session: AsyncSession = Depends(get_session)):
    """
    Get all activities for a bot
    """
    try:
        bot = await bot_service.get_bot(session, bot_id)
        if not bot:
            raise HTTPException(status_code=404, detail=f"Bot with ID {bot_id} not found")
        return await bot_service.get_bot_activities(session, bot_id, skip, limit)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving bot activities: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve bot activities: {str(e)}")
