
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload
from db.models import Bot as BotModel, BotAction as BotActionModel, BotActivity as BotActivityModel
from schemas.bot import BotCreate, BotUpdate, BotStatus
import logging

logger = logging.getLogger(__name__)

async def create_bot(session: AsyncSession, bot: BotCreate):
    """
    Create a new bot
    """
    db_bot = BotModel(
        name=bot.name,
        type=bot.type,
        platform=bot.platform,
        status=bot.status,
        health=bot.health,
        proxy_status=bot.proxy_status,
        description=bot.description,
        avatar=bot.avatar,
        config=bot.config
    )
    session.add(db_bot)
    await session.commit()
    await session.refresh(db_bot)
    return db_bot

async def get_bot(session: AsyncSession, bot_id: int):
    """
    Get a bot by ID with its actions and activities
    """
    result = await session.execute(
        select(BotModel)
        .options(selectinload(BotModel.actions), selectinload(BotModel.activities))
        .where(BotModel.id == bot_id)
    )
    return result.scalars().first()

async def get_bots(session: AsyncSession, filters: dict, skip: int = 0, limit: int = 100):
    """
    Get all bots with optional filtering
    """
    query = select(BotModel).options(selectinload(BotModel.actions), selectinload(BotModel.activities))
    
    # Apply filters
    if filters.get("status"):
        query = query.where(BotModel.status.in_(filters["status"]))
    
    if filters.get("type"):
        query = query.where(BotModel.type.in_(filters["type"]))
    
    if filters.get("platform"):
        query = query.where(BotModel.platform.in_(filters["platform"]))
    
    if filters.get("health"):
        query = query.where(BotModel.health.in_(filters["health"]))
    
    if filters.get("search"):
        search = f"%{filters['search']}%"
        query = query.where((BotModel.name.ilike(search)) | (BotModel.description.ilike(search)))
    
    query = query.offset(skip).limit(limit)
    result = await session.execute(query)
    return result.scalars().all()

async def update_bot(session: AsyncSession, bot_id: int, bot_update: BotUpdate):
    """
    Update a bot
    """
    # Get the bot first to check if it exists
    db_bot = await get_bot(session, bot_id)
    if not db_bot:
        return None
    
    # Prepare update values, only include fields that are not None
    update_data = {k: v for k, v in bot_update.dict().items() if v is not None}
    
    # Update the bot
    await session.execute(
        update(BotModel)
        .where(BotModel.id == bot_id)
        .values(**update_data)
    )
    
    await session.commit()
    
    # Get the updated bot
    return await get_bot(session, bot_id)

async def delete_bot(session: AsyncSession, bot_id: int):
    """
    Delete a bot
    """
    # Check if the bot exists
    db_bot = await get_bot(session, bot_id)
    if not db_bot:
        return False
    
    # Delete the bot
    await session.execute(delete(BotModel).where(BotModel.id == bot_id))
    await session.commit()
    
    return True

async def update_bot_status(session: AsyncSession, bot_id: int, status: BotStatus):
    """
    Update bot status and add activity log
    """
    # Get the bot first to check if it exists
    db_bot = await get_bot(session, bot_id)
    if not db_bot:
        return None
    
    # Update status
    db_bot.status = status
    
    # Add activity log
    activity = BotActivityModel(
        bot_id=bot_id,
        type="status_change",
        description=f"Bot status changed to {status}"
    )
    
    session.add(activity)
    await session.commit()
    await session.refresh(db_bot)
    
    return db_bot

async def get_bot_actions(session: AsyncSession, bot_id: int, skip: int = 0, limit: int = 100):
    """
    Get all actions for a bot
    """
    result = await session.execute(
        select(BotActionModel)
        .where(BotActionModel.bot_id == bot_id)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

async def get_bot_activities(session: AsyncSession, bot_id: int, skip: int = 0, limit: int = 100):
    """
    Get all activities for a bot
    """
    result = await session.execute(
        select(BotActivityModel)
        .where(BotActivityModel.bot_id == bot_id)
        .order_by(BotActivityModel.timestamp.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()
