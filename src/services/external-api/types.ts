
// Add the missing AudioGenerationParams type
export interface AudioGenerationParams {
  text: string;
  voice: string;
  format?: string;
  speed?: number;
}
