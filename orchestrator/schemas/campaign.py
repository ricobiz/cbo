
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum

class CampaignStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class CampaignType(str, Enum):
    PROMOTION = "promotion"
    TREND = "trend"
    AWARENESS = "awareness"
    ENGAGEMENT = "engagement"

class CampaignPlatform(str, Enum):
    YOUTUBE = "youtube"
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"
    TWITTER = "twitter"
    SPOTIFY = "spotify"

class CampaignMetricBase(BaseModel):
    name: str
    value: float
    target: Optional[float] = None
    change: Optional[float] = None

class CampaignMetric(CampaignMetricBase):
    id: int
    campaign_id: int

    class Config:
        from_attributes = True

class CampaignPlatformBase(BaseModel):
    platform: CampaignPlatform

class CampaignPlatformSchema(CampaignPlatformBase):
    id: int
    campaign_id: int

    class Config:
        from_attributes = True

class CampaignActionBase(BaseModel):
    type: str
    status: str
    platform: Optional[CampaignPlatform] = None
    scheduled_for: Optional[datetime] = None
    details: Optional[Dict[str, Any]] = None

class CampaignActionCreate(CampaignActionBase):
    pass

class CampaignAction(CampaignActionBase):
    id: int
    campaign_id: int
    completed_at: Optional[datetime] = None
    results: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class CampaignBase(BaseModel):
    name: str
    description: Optional[str] = None
    type: CampaignType
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: Optional[float] = None
    tags: Optional[List[str]] = None

class CampaignCreate(CampaignBase):
    status: CampaignStatus = CampaignStatus.DRAFT
    platforms: List[CampaignPlatform]

class Campaign(CampaignBase):
    id: int
    status: CampaignStatus
    created_at: datetime
    updated_at: datetime
    platforms: List[CampaignPlatformSchema] = []
    actions: List[CampaignAction] = []
    metrics: List[CampaignMetric] = []

    class Config:
        from_attributes = True

class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[CampaignType] = None
    status: Optional[CampaignStatus] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: Optional[float] = None
    tags: Optional[List[str]] = None
    platforms: Optional[List[CampaignPlatform]] = None

class CampaignFilter(BaseModel):
    status: Optional[List[CampaignStatus]] = None
    type: Optional[List[CampaignType]] = None
    platform: Optional[List[CampaignPlatform]] = None
    date_range: Optional[Dict[str, datetime]] = None
    search: Optional[str] = None
