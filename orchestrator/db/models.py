
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Float, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class Bot(Base):
    __tablename__ = "bots"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)
    platform = Column(String)
    status = Column(String, default="idle")
    health = Column(String, default="unknown")
    proxy_status = Column(String, default="inactive")
    description = Column(Text, nullable=True)
    avatar = Column(String, nullable=True)
    last_active = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    config = Column(JSON, nullable=True)
    
    # Relationships
    actions = relationship("BotAction", back_populates="bot", cascade="all, delete-orphan")
    activities = relationship("BotActivity", back_populates="bot", cascade="all, delete-orphan")
    
class BotAction(Base):
    __tablename__ = "bot_actions"
    
    id = Column(Integer, primary_key=True, index=True)
    bot_id = Column(Integer, ForeignKey("bots.id"))
    type = Column(String)
    status = Column(String)
    target = Column(String, nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    details = Column(JSON, nullable=True)
    
    # Relationships
    bot = relationship("Bot", back_populates="actions")
    
class BotActivity(Base):
    __tablename__ = "bot_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    bot_id = Column(Integer, ForeignKey("bots.id"))
    type = Column(String)
    description = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    details = Column(JSON, nullable=True)
    
    # Relationships
    bot = relationship("Bot", back_populates="activities")
    
class Campaign(Base):
    __tablename__ = "campaigns"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    type = Column(String)
    status = Column(String, default="draft")
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    budget = Column(Float, nullable=True)
    tags = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    actions = relationship("CampaignAction", back_populates="campaign", cascade="all, delete-orphan")
    metrics = relationship("CampaignMetric", back_populates="campaign", cascade="all, delete-orphan")
    platforms = relationship("CampaignPlatform", back_populates="campaign", cascade="all, delete-orphan")
    
class CampaignAction(Base):
    __tablename__ = "campaign_actions"
    
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"))
    type = Column(String)
    status = Column(String)
    scheduled_for = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    platform = Column(String, nullable=True)
    details = Column(JSON, nullable=True)
    results = Column(JSON, nullable=True)
    
    # Relationships
    campaign = relationship("Campaign", back_populates="actions")
    
class CampaignMetric(Base):
    __tablename__ = "campaign_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"))
    name = Column(String)
    value = Column(Float)
    target = Column(Float, nullable=True)
    change = Column(Float, nullable=True)
    
    # Relationships
    campaign = relationship("Campaign", back_populates="metrics")
    
class CampaignPlatform(Base):
    __tablename__ = "campaign_platforms"
    
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"))
    platform = Column(String)
    
    # Relationships
    campaign = relationship("Campaign", back_populates="platforms")
    
class Content(Base):
    __tablename__ = "contents"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)  # text, image, audio
    title = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    media_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=True)
    platform = Column(String, nullable=True)
    metadata = Column(JSON, nullable=True)
