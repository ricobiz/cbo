
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum

class BotStatus(str, Enum):
    IDLE = "idle"
    RUNNING = "running"
    PAUSED = "paused"
    ERROR = "error"

class BotType(str, Enum):
    VIEW = "view"
    INTERACTION = "interaction"
    COMMENT = "comment"
    SHARE = "share"

class BotPlatform(str, Enum):
    YOUTUBE = "youtube"
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"
    TWITTER = "twitter"
    SPOTIFY = "spotify"

class BotHealthStatus(str, Enum):
    HEALTHY = "healthy"
    WARNING = "warning"
    CRITICAL = "critical"
    UNKNOWN = "unknown"

class ProxyStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ERROR = "error"

class BotBase(BaseModel):
    name: str
    type: BotType
    platform: BotPlatform
    description: Optional[str] = None
    avatar: Optional[str] = None

class BotCreate(BotBase):
    status: BotStatus = BotStatus.IDLE
    health: BotHealthStatus = BotHealthStatus.UNKNOWN
    proxy_status: ProxyStatus = ProxyStatus.INACTIVE
    config: Optional[Dict[str, Any]] = None

class BotActionBase(BaseModel):
    type: str
    status: str
    target: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

class BotActionCreate(BotActionBase):
    pass

class BotAction(BotActionBase):
    id: int
    bot_id: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class BotActivityBase(BaseModel):
    type: str
    description: str
    details: Optional[Dict[str, Any]] = None

class BotActivityCreate(BotActivityBase):
    pass

class BotActivity(BotActivityBase):
    id: int
    bot_id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class ConsumptionInfo(BaseModel):
    cpu: Optional[float] = 0
    memory: Optional[float] = 0
    network: Optional[float] = 0
    quota: Optional[float] = 0

class Bot(BotBase):
    id: int
    status: BotStatus
    health: BotHealthStatus
    proxy_status: ProxyStatus
    last_active: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    config: Optional[Dict[str, Any]] = None
    consumption: Optional[ConsumptionInfo] = None
    actions: List[BotAction] = []
    activities: List[BotActivity] = []

    class Config:
        from_attributes = True

class BotUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[BotType] = None
    platform: Optional[BotPlatform] = None
    status: Optional[BotStatus] = None
    health: Optional[BotHealthStatus] = None
    proxy_status: Optional[ProxyStatus] = None
    description: Optional[str] = None
    avatar: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
