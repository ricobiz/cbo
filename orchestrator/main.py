
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import bots, campaigns, content, analytics, health
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

app = FastAPI(title="Bot Orchestration Platform API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(bots.router, prefix="/bots", tags=["bots"])
app.include_router(campaigns.router, prefix="/campaigns", tags=["campaigns"])
app.include_router(content.router, prefix="/content", tags=["content"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(health.router, prefix="/health", tags=["health"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Bot Orchestration Platform API"}
