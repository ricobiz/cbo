
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from typing import List, Dict, Any, Optional
from db.models import Bot, BotAction, BotActivity
from schemas.bot import BotCreate, BotUpdate, BotStatus
import logging

logger = logging.getLogger(__name__)

async def create_bot(session: AsyncSession, bot_data: BotCreate) -> Dict[str, Any]:
    """Create a new bot"""
    try:
        new_bot = Bot(
            name=bot_data.name,
            type=bot_data.type,
            platform=bot_data.platform,
            status=bot_data.status,
            health=bot_data.health,
            proxy_status=bot_data.proxy_status,
            description=bot_data.description,
            avatar=bot_data.avatar,
            config=bot_data.config
        )
        
        session.add(new_bot)
        await session.commit()
        await session.refresh(new_bot)
        
        # Convert to dict for serialization
        bot_dict = {
            "id": str(new_bot.id),  # Convert ID to string to match frontend expectations
            "name": new_bot.name,
            "type": new_bot.type,
            "platform": new_bot.platform,
            "status": new_bot.status,
            "health": new_bot.health,
            "proxyStatus": new_bot.proxy_status,
            "description": new_bot.description,
            "avatar": new_bot.avatar,
            "createdAt": new_bot.created_at.isoformat() if new_bot.created_at else None,
            "updatedAt": new_bot.updated_at.isoformat() if new_bot.updated_at else None,
            "config": new_bot.config or {}
        }
        
        return bot_dict
    except Exception as e:
        logger.error(f"Error creating bot: {str(e)}")
        await session.rollback()
        raise

async def get_bot(session: AsyncSession, bot_id: int) -> Optional[Dict[str, Any]]:
    """Get a bot by ID"""
    try:
        result = await session.execute(select(Bot).filter(Bot.id == bot_id))
        bot = result.scalars().first()
        
        if not bot:
            return None
            
        # Convert to dict for serialization
        return {
            "id": str(bot.id),  # Convert ID to string to match frontend expectations
            "name": bot.name,
            "type": bot.type,
            "platform": bot.platform,
            "status": bot.status,
            "health": bot.health,
            "proxyStatus": bot.proxy_status,
            "description": bot.description,
            "avatar": bot.avatar,
            "lastActive": bot.last_active.isoformat() if bot.last_active else None,
            "createdAt": bot.created_at.isoformat() if bot.created_at else None,
            "updatedAt": bot.updated_at.isoformat() if bot.updated_at else None,
            "config": bot.config or {}
        }
    except Exception as e:
        logger.error(f"Error retrieving bot: {str(e)}")
        raise

async def get_bots(session: AsyncSession, filters: Dict[str, Any], skip: int, limit: int) -> List[Dict[str, Any]]:
    """Get all bots with optional filtering"""
    try:
        query = select(Bot)
        
        # Apply filters if provided
        if filters.get("status"):
            query = query.filter(Bot.status.in_(filters["status"]))
            
        if filters.get("type"):
            query = query.filter(Bot.type.in_(filters["type"]))
            
        if filters.get("platform"):
            query = query.filter(Bot.platform.in_(filters["platform"]))
            
        if filters.get("health"):
            query = query.filter(Bot.health.in_(filters["health"]))
            
        if filters.get("search"):
            search = f"%{filters['search']}%"
            query = query.filter(Bot.name.ilike(search) | Bot.description.ilike(search))
            
        # Apply pagination
        query = query.offset(skip).limit(limit)
        
        result = await session.execute(query)
        bots = result.scalars().all()
        
        # Convert to list of dicts for serialization
        bot_list = []
        for bot in bots:
            bot_list.append({
                "id": str(bot.id),  # Convert ID to string to match frontend expectations
                "name": bot.name,
                "type": bot.type,
                "platform": bot.platform,
                "status": bot.status,
                "health": bot.health,
                "proxyStatus": bot.proxy_status,
                "description": bot.description,
                "avatar": bot.avatar,
                "lastActive": bot.last_active.isoformat() if bot.last_active else None,
                "createdAt": bot.created_at.isoformat() if bot.created_at else None,
                "updatedAt": bot.updated_at.isoformat() if bot.updated_at else None,
                "config": bot.config or {}
            })
            
        return bot_list
    except Exception as e:
        logger.error(f"Error retrieving bots: {str(e)}")
        raise

async def update_bot(session: AsyncSession, bot_id: int, bot_update: BotUpdate) -> Optional[Dict[str, Any]]:
    """Update a bot"""
    try:
        result = await session.execute(select(Bot).filter(Bot.id == bot_id))
        bot = result.scalars().first()
        
        if not bot:
            return None
            
        # Update fields if provided in the update data
        update_data = bot_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(bot, key, value)
            
        await session.commit()
        await session.refresh(bot)
        
        # Convert to dict for serialization
        return {
            "id": str(bot.id),
            "name": bot.name,
            "type": bot.type,
            "platform": bot.platform,
            "status": bot.status,
            "health": bot.health,
            "proxyStatus": bot.proxy_status,
            "description": bot.description,
            "avatar": bot.avatar,
            "lastActive": bot.last_active.isoformat() if bot.last_active else None,
            "createdAt": bot.created_at.isoformat() if bot.created_at else None,
            "updatedAt": bot.updated_at.isoformat() if bot.updated_at else None,
            "config": bot.config or {}
        }
    except Exception as e:
        logger.error(f"Error updating bot: {str(e)}")
        await session.rollback()
        raise

async def delete_bot(session: AsyncSession, bot_id: int) -> bool:
    """Delete a bot"""
    try:
        result = await session.execute(select(Bot).filter(Bot.id == bot_id))
        bot = result.scalars().first()
        
        if not bot:
            return False
            
        await session.delete(bot)
        await session.commit()
        return True
    except Exception as e:
        logger.error(f"Error deleting bot: {str(e)}")
        await session.rollback()
        raise

async def update_bot_status(session: AsyncSession, bot_id: int, status: BotStatus) -> Optional[Dict[str, Any]]:
    """Update bot status"""
    try:
        result = await session.execute(select(Bot).filter(Bot.id == bot_id))
        bot = result.scalars().first()
        
        if not bot:
            return None
            
        bot.status = status
        await session.commit()
        await session.refresh(bot)
        
        # Convert to dict for serialization
        return {
            "id": str(bot.id),
            "name": bot.name,
            "type": bot.type,
            "platform": bot.platform,
            "status": bot.status,
            "health": bot.health,
            "proxyStatus": bot.proxy_status,
            "description": bot.description,
            "avatar": bot.avatar,
            "lastActive": bot.last_active.isoformat() if bot.last_active else None,
            "createdAt": bot.created_at.isoformat() if bot.created_at else None,
            "updatedAt": bot.updated_at.isoformat() if bot.updated_at else None,
            "config": bot.config or {}
        }
    except Exception as e:
        logger.error(f"Error updating bot status: {str(e)}")
        await session.rollback()
        raise

async def get_bot_actions(session: AsyncSession, bot_id: int, skip: int, limit: int) -> List[Dict[str, Any]]:
    """Get bot actions"""
    try:
        query = select(BotAction).filter(BotAction.bot_id == bot_id).offset(skip).limit(limit)
        result = await session.execute(query)
        actions = result.scalars().all()
        
        # Convert to list of dicts for serialization
        action_list = []
        for action in actions:
            action_list.append({
                "id": str(action.id),
                "type": action.type,
                "status": action.status,
                "startedAt": action.started_at.isoformat() if action.started_at else None,
                "completedAt": action.completed_at.isoformat() if action.completed_at else None,
                "target": action.target,
                "details": action.details or {}
            })
            
        return action_list
    except Exception as e:
        logger.error(f"Error retrieving bot actions: {str(e)}")
        raise

async def get_bot_activities(session: AsyncSession, bot_id: int, skip: int, limit: int) -> List[Dict[str, Any]]:
    """Get bot activities"""
    try:
        query = select(BotActivity).filter(BotActivity.bot_id == bot_id).offset(skip).limit(limit)
        result = await session.execute(query)
        activities = result.scalars().all()
        
        # Convert to list of dicts for serialization
        activity_list = []
        for activity in activities:
            activity_list.append({
                "id": str(activity.id),
                "type": activity.type,
                "description": activity.description,
                "timestamp": activity.timestamp.isoformat() if activity.timestamp else None,
                "details": activity.details or {}
            })
            
        return activity_list
    except Exception as e:
        logger.error(f"Error retrieving bot activities: {str(e)}")
        raise
