
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from db.database import get_session
import logging
import platform
import sys

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/")
async def health_check(session: AsyncSession = Depends(get_session)):
    """
    Enhanced health check endpoint
    Returns system information and database status
    """
    try:
        # Test database connection
        await session.execute("SELECT 1")
        
        # Get Python and system information
        python_version = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
        system_info = {
            "os": platform.system(),
            "python": python_version
        }
        
        return {
            "status": "ok", 
            "message": "API server is running, database connection successful",
            "version": "1.0.0",  # API version
            "system": system_info
        }
    except Exception as e:
        error_message = str(e)
        logger.error(f"Health check failed: {error_message}")
        
        return {
            "status": "error", 
            "message": f"Database connection failed: {error_message}",
            "version": "1.0.0",  # API version even when error occurs
            "error": error_message
        }

@router.get("/ping")
async def ping():
    """
    Simple ping endpoint for basic connectivity check
    """
    return {"status": "ok", "message": "pong"}
