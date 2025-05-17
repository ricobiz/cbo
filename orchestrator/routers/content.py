
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from db.database import get_session
from schemas.content import (
    Content, ContentCreate, ContentGenerationRequest,
    TextGenerationRequest, ImageGenerationRequest, AudioGenerationRequest,
    ContentGenerationResponse
)
import logging
from services import content_service

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=Content)
async def create_content(content: ContentCreate, session: AsyncSession = Depends(get_session)):
    """
    Create new content
    """
    try:
        return await content_service.create_content(session, content)
    except Exception as e:
        logger.error(f"Error creating content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create content: {str(e)}")

@router.get("/{content_id}", response_model=Content)
async def get_content(content_id: int, session: AsyncSession = Depends(get_session)):
    """
    Get content by ID
    """
    try:
        content = await content_service.get_content(session, content_id)
        if not content:
            raise HTTPException(status_code=404, detail=f"Content with ID {content_id} not found")
        return content
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve content: {str(e)}")

@router.get("/", response_model=List[Content])
async def get_all_content(skip: int = 0, limit: int = 100, session: AsyncSession = Depends(get_session)):
    """
    Get all content
    """
    try:
        return await content_service.get_all_content(session, skip, limit)
    except Exception as e:
        logger.error(f"Error retrieving content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve content: {str(e)}")

@router.post("/generate/text", response_model=ContentGenerationResponse)
async def generate_text(request: TextGenerationRequest, background_tasks: BackgroundTasks, session: AsyncSession = Depends(get_session)):
    """
    Generate text content
    """
    try:
        # Generate content asynchronously
        return await content_service.generate_text(session, request, background_tasks)
    except Exception as e:
        logger.error(f"Error generating text content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate text content: {str(e)}")

@router.post("/generate/image", response_model=ContentGenerationResponse)
async def generate_image(request: ImageGenerationRequest, background_tasks: BackgroundTasks, session: AsyncSession = Depends(get_session)):
    """
    Generate image content
    """
    try:
        # Generate content asynchronously
        return await content_service.generate_image(session, request, background_tasks)
    except Exception as e:
        logger.error(f"Error generating image content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate image content: {str(e)}")

@router.post("/generate/audio", response_model=ContentGenerationResponse)
async def generate_audio(request: AudioGenerationRequest, background_tasks: BackgroundTasks, session: AsyncSession = Depends(get_session)):
    """
    Generate audio content
    """
    try:
        # Generate content asynchronously
        return await content_service.generate_audio(session, request, background_tasks)
    except Exception as e:
        logger.error(f"Error generating audio content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate audio content: {str(e)}")

@router.post("/generate", response_model=ContentGenerationResponse)
async def generate_content(request: ContentGenerationRequest, background_tasks: BackgroundTasks, session: AsyncSession = Depends(get_session)):
    """
    Generate content based on type
    """
    try:
        if request.type == "text":
            return await content_service.generate_text(session, request, background_tasks)
        elif request.type == "image":
            return await content_service.generate_image(session, request, background_tasks)
        elif request.type == "audio":
            return await content_service.generate_audio(session, request, background_tasks)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported content type: {request.type}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate content: {str(e)}")
