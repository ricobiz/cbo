
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum

class ContentType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    AUDIO = "audio"

class Platform(str, Enum):
    YOUTUBE = "youtube"
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"
    TWITTER = "twitter"
    SPOTIFY = "spotify"

class ContentBase(BaseModel):
    type: ContentType
    title: Optional[str] = None
    description: Optional[str] = None
    platform: Optional[Platform] = None
    campaign_id: Optional[int] = None

class TextContentCreate(ContentBase):
    content: str
    type: ContentType = ContentType.TEXT

class ImageContentCreate(ContentBase):
    media_url: str
    type: ContentType = ContentType.IMAGE

class AudioContentCreate(ContentBase):
    media_url: str
    type: ContentType = ContentType.AUDIO

class ContentCreate(BaseModel):
    type: ContentType
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    media_url: Optional[str] = None
    platform: Optional[Platform] = None
    campaign_id: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None

class Content(ContentCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ContentGenerationRequest(BaseModel):
    type: ContentType
    prompt: str
    platform: Optional[Platform] = None
    campaign_id: Optional[int] = None
    parameters: Optional[Dict[str, Any]] = None

class TextGenerationRequest(ContentGenerationRequest):
    type: ContentType = ContentType.TEXT
    length: Optional[int] = 250
    tone: Optional[str] = "neutral"

class ImageGenerationRequest(ContentGenerationRequest):
    type: ContentType = ContentType.IMAGE
    width: Optional[int] = 1024
    height: Optional[int] = 1024
    style: Optional[str] = "realistic"

class AudioGenerationRequest(ContentGenerationRequest):
    type: ContentType = ContentType.AUDIO
    duration: Optional[int] = 30
    voice: Optional[str] = "neutral"

class ContentGenerationResponse(BaseModel):
    id: int
    type: ContentType
    content: Optional[str] = None
    media_url: Optional[str] = None
    created_at: datetime
