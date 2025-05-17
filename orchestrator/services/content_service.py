
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict, Any, Optional
from db.models import Content
from schemas.content import ContentCreate, TextGenerationRequest, ImageGenerationRequest, AudioGenerationRequest, ContentGenerationRequest
import logging
from datetime import datetime
from fastapi import BackgroundTasks
from celery_app import app as celery_app
import os
import httpx

logger = logging.getLogger(__name__)

# Import OpenRouter service for text generation
class OpenRouterService:
    """Simple OpenRouter service for text generation"""
    
    @staticmethod
    async def generate_text(prompt: str) -> str:
        """Generate text using OpenRouter API"""
        # In a real implementation, this would call the OpenRouter API
        # For now, we'll just return a dummy response
        return f"Generated text based on: {prompt}"

open_router_service = OpenRouterService()

async def create_content(session: AsyncSession, content_data: ContentCreate) -> Dict[str, Any]:
    """Create new content"""
    try:
        new_content = Content(
            type=content_data.type,
            title=content_data.title,
            description=content_data.description,
            content=content_data.content,
            media_url=content_data.media_url,
            campaign_id=content_data.campaign_id,
            platform=content_data.platform,
            metadata=content_data.metadata
        )
        
        session.add(new_content)
        await session.commit()
        await session.refresh(new_content)
        
        # Convert to dict for serialization
        content_dict = {
            "id": new_content.id,
            "type": new_content.type,
            "title": new_content.title,
            "description": new_content.description,
            "content": new_content.content,
            "media_url": new_content.media_url,
            "campaign_id": new_content.campaign_id,
            "platform": new_content.platform,
            "metadata": new_content.metadata,
            "created_at": new_content.created_at.isoformat() if new_content.created_at else None
        }
        
        return content_dict
    except Exception as e:
        logger.error(f"Error creating content: {str(e)}")
        await session.rollback()
        raise

async def get_content(session: AsyncSession, content_id: int) -> Optional[Dict[str, Any]]:
    """Get content by ID"""
    try:
        result = await session.execute(select(Content).filter(Content.id == content_id))
        content = result.scalars().first()
        
        if not content:
            return None
            
        # Convert to dict for serialization
        return {
            "id": content.id,
            "type": content.type,
            "title": content.title,
            "description": content.description,
            "content": content.content,
            "media_url": content.media_url,
            "campaign_id": content.campaign_id,
            "platform": content.platform,
            "metadata": content.metadata,
            "created_at": content.created_at.isoformat() if content.created_at else None
        }
    except Exception as e:
        logger.error(f"Error retrieving content: {str(e)}")
        raise

async def get_all_content(session: AsyncSession, skip: int, limit: int) -> List[Dict[str, Any]]:
    """Get all content"""
    try:
        result = await session.execute(select(Content).offset(skip).limit(limit))
        contents = result.scalars().all()
        
        # Convert to list of dicts for serialization
        content_list = []
        for content in contents:
            content_list.append({
                "id": content.id,
                "type": content.type,
                "title": content.title,
                "description": content.description,
                "content": content.content,
                "media_url": content.media_url,
                "campaign_id": content.campaign_id,
                "platform": content.platform,
                "metadata": content.metadata,
                "created_at": content.created_at.isoformat() if content.created_at else None
            })
            
        return content_list
    except Exception as e:
        logger.error(f"Error retrieving content: {str(e)}")
        raise

async def generate_text(session: AsyncSession, request: TextGenerationRequest, background_tasks: BackgroundTasks) -> Dict[str, Any]:
    """Generate text content"""
    try:
        # Create a new content record
        content_data = ContentCreate(
            type="text",
            title=f"Generated Text - {datetime.now().isoformat()}",
            description=request.prompt[:100] + "..." if len(request.prompt) > 100 else request.prompt,
            content="Generating...",  # Placeholder until generation is complete
            platform=request.platform,
            campaign_id=request.campaign_id,
            metadata={
                "prompt": request.prompt,
                "parameters": request.parameters,
                "length": request.length,
                "tone": request.tone
            }
        )
        
        new_content = await create_content(session, content_data)
        
        # Generate content asynchronously using OpenRouter
        # In a real implementation, this would be a Celery task
        task = celery_app.send_task(
            'tasks.content_tasks.generate_text',
            args=[new_content["id"], request.prompt, request.dict()]
        )
        
        # For demo purposes, also generate text synchronously
        generated_text = await open_router_service.generate_text(request.prompt)
        
        # Update the content with the generated text
        result = await session.execute(select(Content).filter(Content.id == new_content["id"]))
        content = result.scalars().first()
        if content:
            content.content = generated_text
            await session.commit()
            await session.refresh(content)
        
        return {
            "id": new_content["id"],
            "type": "text",
            "content": generated_text,
            "created_at": new_content["created_at"],
            "task_id": task.id
        }
    except Exception as e:
        logger.error(f"Error generating text content: {str(e)}")
        raise

async def generate_image(session: AsyncSession, request: ImageGenerationRequest, background_tasks: BackgroundTasks) -> Dict[str, Any]:
    """Generate image content"""
    try:
        # Create a new content record
        content_data = ContentCreate(
            type="image",
            title=f"Generated Image - {datetime.now().isoformat()}",
            description=request.prompt[:100] + "..." if len(request.prompt) > 100 else request.prompt,
            platform=request.platform,
            campaign_id=request.campaign_id,
            metadata={
                "prompt": request.prompt,
                "parameters": request.parameters,
                "width": request.width,
                "height": request.height,
                "style": request.style
            }
        )
        
        new_content = await create_content(session, content_data)
        
        # Generate image asynchronously
        task = celery_app.send_task(
            'tasks.content_tasks.generate_image',
            args=[new_content["id"], request.prompt, request.dict()]
        )
        
        # For demo purposes, return a placeholder image URL
        placeholder_url = "https://placehold.co/600x400?text=Generating+Image"
        
        # Update the content with the placeholder URL
        result = await session.execute(select(Content).filter(Content.id == new_content["id"]))
        content = result.scalars().first()
        if content:
            content.media_url = placeholder_url
            await session.commit()
            await session.refresh(content)
        
        return {
            "id": new_content["id"],
            "type": "image",
            "media_url": placeholder_url,
            "created_at": new_content["created_at"],
            "task_id": task.id
        }
    except Exception as e:
        logger.error(f"Error generating image content: {str(e)}")
        raise

async def generate_audio(session: AsyncSession, request: AudioGenerationRequest, background_tasks: BackgroundTasks) -> Dict[str, Any]:
    """Generate audio content"""
    try:
        # Create a new content record
        content_data = ContentCreate(
            type="audio",
            title=f"Generated Audio - {datetime.now().isoformat()}",
            description=request.prompt[:100] + "..." if len(request.prompt) > 100 else request.prompt,
            platform=request.platform,
            campaign_id=request.campaign_id,
            metadata={
                "prompt": request.prompt,
                "parameters": request.parameters,
                "duration": request.duration,
                "voice": request.voice
            }
        )
        
        new_content = await create_content(session, content_data)
        
        # Generate audio asynchronously
        task = celery_app.send_task(
            'tasks.content_tasks.generate_audio',
            args=[new_content["id"], request.prompt, request.dict()]
        )
        
        # For demo purposes, return a placeholder audio URL
        placeholder_url = "https://example.com/placeholder-audio.mp3"
        
        # Update the content with the placeholder URL
        result = await session.execute(select(Content).filter(Content.id == new_content["id"]))
        content = result.scalars().first()
        if content:
            content.media_url = placeholder_url
            await session.commit()
            await session.refresh(content)
        
        return {
            "id": new_content["id"],
            "type": "audio",
            "media_url": placeholder_url,
            "created_at": new_content["created_at"],
            "task_id": task.id
        }
    except Exception as e:
        logger.error(f"Error generating audio content: {str(e)}")
        raise
