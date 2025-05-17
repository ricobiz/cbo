
import { ImageGenerationParams, ImageGenerationResult } from './types';

/**
 * Service for handling image generation
 */
export class ImageGenerationService {
  /**
   * Generate an image based on the provided parameters
   * @param params Parameters for image generation
   * @returns Promise with the image generation result
   */
  static async generateImage(params: ImageGenerationParams): Promise<ImageGenerationResult> {
    try {
      // In a real implementation, we would call an actual AI image generation API
      // For now, we'll simulate it with a mock response after a delay
      
      console.log("Generating image with params:", params);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Placeholder image URLs based on style
      const styleImages = {
        'photographic': [
          "https://images.unsplash.com/photo-1682686580186-b55d2a91053c?q=80&w=1075&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1170&auto=format&fit=crop"
        ],
        'digital-art': [
          "https://images.unsplash.com/photo-1633109741715-4f9b7d8b18cb?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1633193272757-89bd3b231e21?q=80&w=1974&auto=format&fit=crop"
        ],
        'cartoon': [
          "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?q=80&w=1770&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1605979257913-1704eb7b6246?q=80&w=1770&auto=format&fit=crop"
        ],
        '3d-render': [
          "https://images.unsplash.com/photo-1617791160536-598cf32026fb?q=80&w=1964&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?q=80&w=1776&auto=format&fit=crop"
        ],
        'pixel-art': [
          "https://images.unsplash.com/photo-1633056819603-6e64d0a1d539?q=80&w=1780&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1623275564858-6e9c86e93d01?q=80&w=1964&auto=format&fit=crop"
        ]
      };
      
      // Select a random image from the appropriate style
      const style = params.style || 'photographic';
      const images = styleImages[style as keyof typeof styleImages] || styleImages.photographic;
      const selectedImage = images[Math.floor(Math.random() * images.length)];

      // Get random dimensions based on the size parameter
      const sizeDimensions = {
        '512x512': { width: 512, height: 512 },
        '1024x1024': { width: 1024, height: 1024 },
        '1024x1792': { width: 1024, height: 1792 },
        '1792x1024': { width: 1792, height: 1024 }
      };
      
      const size = params.size || '1024x1024';
      const dimensions = sizeDimensions[size as keyof typeof sizeDimensions] || sizeDimensions['1024x1024'];
      
      // Return the result
      return {
        url: selectedImage,
        width: dimensions.width,
        height: dimensions.height
      };
    } catch (error) {
      console.error("Error in image generation:", error);
      throw new Error("Failed to generate image");
    }
  }
  
  /**
   * Get image generation history from local storage
   */
  static getImageHistory(): { 
    id: string;
    url: string; 
    prompt: string; 
    style: string;
    timestamp: Date;
  }[] {
    try {
      const storedHistory = localStorage.getItem('imageGenerationHistory');
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error("Error retrieving image history:", error);
      return [];
    }
  }
  
  /**
   * Save a generated image to history in local storage
   */
  static saveToHistory(image: ImageGenerationResult, prompt: string, style: string): void {
    try {
      const history = this.getImageHistory();
      
      // Add new image to history
      const newItem = {
        id: Date.now().toString(),
        url: image.url,
        prompt,
        style,
        timestamp: new Date()
      };
      
      // Add to beginning of array and limit to 10 items
      const updatedHistory = [newItem, ...history.slice(0, 9)];
      
      // Save to localStorage
      localStorage.setItem('imageGenerationHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Error saving image to history:", error);
    }
  }
}
