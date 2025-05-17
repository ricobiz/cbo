
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import logging

load_dotenv()

logger = logging.getLogger(__name__)

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@db:5432/influenceflux")

Base = declarative_base()

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    future=True
)

# Create async session
async_session = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

async def get_session() -> AsyncSession:
    """
    Get database session dependency
    """
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()

async def create_tables():
    """
    Create database tables on startup
    """
    try:
        async with engine.begin() as conn:
            # Uncomment for production - use alembic for migrations instead
            # await conn.run_sync(Base.metadata.create_all)
            logger.info("Database connected successfully")
    except Exception as e:
        logger.error(f"Error connecting to database: {str(e)}")
        raise
