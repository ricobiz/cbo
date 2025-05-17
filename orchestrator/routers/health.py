
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import get_session
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/")
async def health_check(session: AsyncSession = Depends(get_session)):
    """
    Basic health check endpoint
    """
    try:
        # Test database connection
        await session.execute("SELECT 1")
        return {"status": "ok", "message": "API server is running, database connection successful"}
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {"status": "error", "message": f"Database connection failed: {str(e)}"}
