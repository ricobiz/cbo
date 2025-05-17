
import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import routers
from routers import bots, campaigns, content, analytics
from db.database import create_tables

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Influence Flux Orchestrator",
    description="API orchestrator for Influence Flux Automator",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(bots.router, prefix="/bots", tags=["bots"])
app.include_router(campaigns.router, prefix="/campaigns", tags=["campaigns"])
app.include_router(content.router, prefix="/content", tags=["content"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up FastAPI application")
    await create_tables()

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down FastAPI application")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
