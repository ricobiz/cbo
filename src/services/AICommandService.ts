
import { OpenRouterResponse, CommandAnalysisResult } from './external-api/types';
import externalAPIService from "./external-api";

interface AICommandResult {
  success: boolean;
  message: string;
  botsCreated?: number;
  botIds?: string[];
}

/**
 * Processes an AI command to generate content and automate social media tasks.
 * @param command The command to process.
 * @returns A promise that resolves with the result of the command processing.
 */
export async function processAICommand(command: string): Promise<AICommandResult> {
  try {
    // 1. Analyze the Command
    const analysisResult = await externalAPIService.analyzeCommand(command);
    console.log("Command Analysis Result:", analysisResult);
    
    if (!analysisResult) {
      return {
        success: false,
        message: "Не удалось проанализировать команду. Пожалуйста, уточните запрос."
      };
    }
    
    // 2. Generate Content (if needed)
    let generatedContent = '';
    if (analysisResult.action === 'create_content') {
      const openRouterResponse: OpenRouterResponse | null = await externalAPIService.sendToOpenRouter(
        `Создай привлекательный контент для ${analysisResult.platform} на тему ${command}.`
      );
      
      if (openRouterResponse && openRouterResponse.choices && openRouterResponse.choices.length > 0) {
        generatedContent = openRouterResponse.choices[0].message.content;
      } else {
        console.warn("Failed to generate content via OpenRouter.");
        generatedContent = "Не удалось сгенерировать контент автоматически.";
      }
    }
    
    // 3. Create Bots
    const numberOfBots = analysisResult.count || 1;
    const platform = analysisResult.platform || 'unknown';
    const action = analysisResult.action || 'unknown';
    
    const botIds: string[] = [];
    for (let i = 0; i < numberOfBots; i++) {
      // Simulate bot creation
      const botId = `bot-${Date.now()}-${i}`;
      botIds.push(botId);
      console.log(`Бот ${botId} создан для ${platform} для выполнения действия: ${action}`);
    }
    
    // 4. Return Result
    return {
      success: true,
      message: `Команда успешно обработана. Создано ${numberOfBots} ботов для выполнения задачи.`,
      botsCreated: numberOfBots,
      botIds: botIds
    };
  } catch (error) {
    console.error("Ошибка при обработке команды ИИ:", error);
    return {
      success: false,
      message: `Произошла ошибка при обработке команды: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}.`
    };
  }
}
