import { botService, BotConfig, BotProxy, BotSchedule, BotType } from './BotService';
import { externalAPIService } from './ExternalAPIService';

interface AICommandResult {
  success: boolean;
  message: string;
  botsCreated: number;
  taskId?: string;
}

interface BotTask {
  type: BotType;
  targetPlatform: string;
  targetURL?: string;
  targetAction: string;
  targetCount: number;
  targetDuration?: number; // в часах
  description: string;
  useExternalAPIs?: boolean;
}

// Функция для обработки команды от ИИ
export async function processAICommand(command: string): Promise<AICommandResult> {
  try {
    // Сначала попытаемся анализировать с помощью OpenRouter, если настроен
    let taskInfo: BotTask | null = null;
    
    if (externalAPIService.hasOpenRouterApiKey()) {
      console.log("Using OpenRouter for command analysis");
      const aiAnalysis = await externalAPIService.analyzeCommand(command);
      
      if (aiAnalysis) {
        taskInfo = {
          type: mapActionToType(aiAnalysis.action || ""),
          targetPlatform: aiAnalysis.platform || "",
          targetURL: aiAnalysis.url,
          targetAction: aiAnalysis.action || "",
          targetCount: aiAnalysis.count || 100,
          description: generateTaskDescription(aiAnalysis.platform || "", aiAnalysis.action || "", aiAnalysis.count || 100),
          useExternalAPIs: true
        };
      }
    }
    
    // Если не получилось с OpenRouter, используем встроенный анализатор
    if (!taskInfo) {
      taskInfo = analyzeCommand(command);
    }
    
    if (!taskInfo) {
      return {
        success: false,
        message: "Не удалось определить задачу. Пожалуйста, уточните запрос. Например: 'Прокачай аккаунт Spotify на 1000 прослушиваний' или 'Создай 50 комментариев к видео на YouTube'.",
        botsCreated: 0
      };
    }

    // Создаем ботов для выполнения задачи
    const createdBots = setupBotsForTask(taskInfo);
    
    if (createdBots === 0) {
      return {
        success: false,
        message: "Не удалось создать ботов для выполнения задачи. Возможно, недостаточно ресурсов или неподдерживаемый тип действия.",
        botsCreated: 0
      };
    }
    
    // Возвращаем результат
    return {
      success: true,
      message: generateSuccessMessage(taskInfo, createdBots),
      botsCreated: createdBots,
      taskId: Date.now().toString()
    };
  } catch (error) {
    console.error("Error processing AI command:", error);
    return {
      success: false,
      message: "Произошла ошибка при обработке команды. Пожалуйста, попробуйте еще раз или обратитесь в поддержку.",
      botsCreated: 0
    };
  }
}

function mapActionToType(action: string): BotType {
  if (['listen', 'view', 'watch'].includes(action?.toLowerCase())) {
    return 'click';
  }
  if (['like', 'follow', 'subscribe'].includes(action?.toLowerCase())) {
    return 'interaction';
  }
  if (['comment', 'generate', 'create'].includes(action?.toLowerCase())) {
    return 'content';
  }
  return 'click'; // Default
}

// Анализ команды (упрощенная имплементация)
function analyzeCommand(command: string): BotTask | null {
  const lowercaseCommand = command.toLowerCase();
  
  // Определяем платформу
  let targetPlatform = "";
  if (lowercaseCommand.includes("spotify")) targetPlatform = "spotify";
  else if (lowercaseCommand.includes("youtube") || lowercaseCommand.includes("ютуб")) targetPlatform = "youtube";
  else if (lowercaseCommand.includes("instagram") || lowercaseCommand.includes("инстаграм")) targetPlatform = "instagram";
  else if (lowercaseCommand.includes("tiktok") || lowercaseCommand.includes("тикток")) targetPlatform = "tiktok";
  else if (lowercaseCommand.includes("facebook") || lowercaseCommand.includes("фейсбук")) targetPlatform = "facebook";
  else if (lowercaseCommand.includes("twitter") || lowercaseCommand.includes("твиттер") || lowercaseCommand.includes("x")) targetPlatform = "twitter";
  else return null;
  
  // Определяем тип действия
  let botType: BotType = "interaction";
  let targetAction = "";
  
  if (
    lowercaseCommand.includes("прослушива") || 
    lowercaseCommand.includes("слушать") || 
    lowercaseCommand.includes("стрим")
  ) {
    targetAction = "listen";
    botType = "click";
  } else if (
    lowercaseCommand.includes("просмотр") || 
    lowercaseCommand.includes("смотреть") ||
    lowercaseCommand.includes("view") ||
    lowercaseCommand.includes("показ")
  ) {
    targetAction = "view";
    botType = "click";
  } else if (
    lowercaseCommand.includes("лайк") || 
    lowercaseCommand.includes("нравится") ||
    lowercaseCommand.includes("like")
  ) {
    targetAction = "like";
    botType = "interaction";
  } else if (
    lowercaseCommand.includes("коммент") || 
    lowercaseCommand.includes("comment")
  ) {
    targetAction = "comment";
    botType = "content";
  } else if (
    lowercaseCommand.includes("подпис") || 
    lowercaseCommand.includes("follow") ||
    lowercaseCommand.includes("фолловер")
  ) {
    targetAction = "follow";
    botType = "interaction";
  } else if (
    lowercaseCommand.includes("создай контент") || 
    lowercaseCommand.includes("генерируй контент") ||
    lowercaseCommand.includes("создать контент")
  ) {
    targetAction = "generate";
    botType = "content";
  } else {
    // Если не определили конкретное действие, пробуем угадать по контексту
    if (targetPlatform === "spotify") {
      targetAction = "listen";
      botType = "click";
    } else {
      targetAction = "view";
      botType = "click";
    }
  }
  
  // Находим числа в команде для определения целевого количества
  const numbersInCommand = command.match(/\d+/g);
  const targetCount = numbersInCommand ? parseInt(numbersInCommand[0]) : 100;
  
  // URL, если указан (упрощенно ищем ссылки)
  const urlMatch = command.match(/(https?:\/\/[^\s]+)/);
  const targetURL = urlMatch ? urlMatch[0] : undefined;
  
  return {
    type: botType,
    targetPlatform,
    targetURL,
    targetAction,
    targetCount,
    targetDuration: estimateDuration(targetCount, targetAction),
    description: generateTaskDescription(targetPlatform, targetAction, targetCount)
  };
}

// Создание ботов для задачи
function setupBotsForTask(task: BotTask): number {
  try {
    // Определяем оптимальное количество ботов для задачи
    const optimalBotCount = calculateOptimalBotCount(task);
    let createdBots = 0;
    
    for (let i = 0; i < optimalBotCount; i++) {
      const actionsPerBot = Math.ceil(task.targetCount / optimalBotCount);
      const botName = generateBotName(task, i+1, optimalBotCount);
      
      // Создаем бота
      const botConfig = generateBotConfig(task);
      const botSchedule = generateBotSchedule(task);
      const botProxy = generateBotProxy(task);
      
      const botData = {
        name: botName,
        description: `${task.description} (Бот ${i+1}/${optimalBotCount})`,
        type: task.type,
        config: botConfig,
        schedule: botSchedule,
        proxy: botProxy
      };
      
      const botId = botService.createBot(botData);
      if (botId) {
        createdBots++;
        
        // Добавляем специфичные для задачи логи
        botService.addLog(botId, "Бот создан для автоматизированной задачи");
        botService.addLog(botId, `Цель: ${actionsPerBot} ${getActionName(task.targetAction)} на ${task.targetPlatform}`);
        
        if (task.useExternalAPIs && externalAPIService.hasBrowserUseApiKey()) {
          botService.addLog(botId, "Будет использован Browser Use API для выполнения задачи");
          
          // При наличии Browser Use API, запускаем бота через него
          if (task.targetURL) {
            botService.addLog(botId, `Целевой URL: ${task.targetURL}`);
            
            // Запустить сессию Browser Use асинхронно
            setupBrowserUseSession(botId, task).catch(err => {
              botService.addLog(botId, `Ошибка настройки сессии Browser Use: ${err.message}`);
            });
          }
        } else if (task.targetURL) {
          botService.addLog(botId, `Целевой URL: ${task.targetURL}`);
        }
      }
    }
    
    return createdBots;
  } catch (error) {
    console.error("Error setting up bots for task:", error);
    return 0;
  }
}

// Функция для настройки сессии Browser Use
async function setupBrowserUseSession(botId: string, task: BotTask): Promise<void> {
  try {
    // Создаём сессию браузера
    const sessionId = await externalAPIService.createBrowserSession({
      proxy: "auto" // Использовать прокси автоматически
    });
    
    if (!sessionId) {
      throw new Error("Не удалось создать сессию браузера");
    }
    
    botService.addLog(botId, `Создана новая сессия браузера ${sessionId.substring(0, 8)}...`);
    
    // Если есть URL, переходим на него
    if (task.targetURL) {
      const navResult = await externalAPIService.executeBrowserAction({
        type: 'navigate',
        params: { url: task.targetURL }
      }, sessionId);
      
      if (navResult?.success) {
        botService.addLog(botId, `Успешно открыт URL: ${task.targetURL}`);
      } else {
        botService.addLog(botId, `Ошибка при открытии URL: ${task.targetURL}`);
      }
    } else {
      // Если URL нет, но есть платформа, переходим на платформу
      const platformUrl = getPlatformUrl(task.targetPlatform);
      const navResult = await externalAPIService.executeBrowserAction({
        type: 'navigate',
        params: { url: platformUrl }
      }, sessionId);
      
      if (navResult?.success) {
        botService.addLog(botId, `Успешно открыта платформа: ${task.targetPlatform}`);
      } else {
        botService.addLog(botId, `Ошибка при открытии платформы: ${task.targetPlatform}`);
      }
    }
    
    // Дополнительные действия в зависим��сти от типа задачи
    // Это упрощенный пример, в реальности нужна более сложная логика
    switch (task.targetAction) {
      case 'listen':
        botService.addLog(botId, "Запуск сценария прослушивания...");
        break;
      case 'view':
        botService.addLog(botId, "Запуск сценария просмотра...");
        break;
      case 'like':
        botService.addLog(botId, "Запуск сценария лайков...");
        break;
      case 'comment':
        botService.addLog(botId, "Запуск сценария комментирования...");
        break;
      default:
        botService.addLog(botId, "Запуск базового сценария взаимодействия...");
    }
  } catch (error) {
    console.error("Error setting up Browser Use session:", error);
    throw error;
  }
}

function getPlatformUrl(platform: string): string {
  const platforms: Record<string, string> = {
    'spotify': 'https://open.spotify.com',
    'youtube': 'https://www.youtube.com',
    'instagram': 'https://www.instagram.com',
    'tiktok': 'https://www.tiktok.com',
    'facebook': 'https://www.facebook.com',
    'twitter': 'https://twitter.com',
  };
  
  return platforms[platform.toLowerCase()] || 'https://www.google.com';
}

// Вспомогательные функции
function calculateOptimalBotCount(task: BotTask): number {
  // Упрощенная логика: 1 бот на каждые 100-200 действий
  // В реальном пр��ложении здесь будет более сложная логика с учетом доступных ресурсов и ограничений
  const actionsPerBot = task.targetAction === "comment" ? 50 : 200;
  return Math.max(1, Math.min(5, Math.ceil(task.targetCount / actionsPerBot)));
}

function generateBotName(task: BotTask, botNumber: number, totalBots: number): string {
  const platformMap: Record<string, string> = {
    "spotify": "Spotify",
    "youtube": "YouTube",
    "instagram": "Instagram",
    "tiktok": "TikTok",
    "facebook": "Facebook",
    "twitter": "Twitter/X"
  };
  
  const actionMap: Record<string, string> = {
    "listen": "Listener",
    "view": "Viewer",
    "like": "Liker",
    "comment": "Commenter",
    "follow": "Follower",
    "generate": "Generator"
  };
  
  const platform = platformMap[task.targetPlatform] || task.targetPlatform;
  const action = actionMap[task.targetAction] || "Engagement";
  
  return totalBots > 1 
    ? `${platform} ${action} Bot #${botNumber}` 
    : `${platform} ${action} Bot`;
}

function generateTaskDescription(platform: string, action: string, count: number): string {
  const platformMap: Record<string, string> = {
    "spotify": "Spotify",
    "youtube": "YouTube",
    "instagram": "Instagram",
    "tiktok": "TikTok",
    "facebook": "Facebook",
    "twitter": "Twitter/X"
  };
  
  const actionMap: Record<string, { verb: string, noun: string }> = {
    "listen": { verb: "прослушиваний", noun: "прослушиваний" },
    "view": { verb: "просмотров", noun: "просмотров" },
    "like": { verb: "лайков", noun: "лайков" },
    "comment": { verb: "комментариев", noun: "комментариев" },
    "follow": { verb: "подписок", noun: "подписчиков" },
    "generate": { verb: "контента", noun: "публикаций" }
  };
  
  const platformName = platformMap[platform] || platform;
  const { noun } = actionMap[action] || { verb: "действий", noun: "действий" };
  
  return `Набрать ${count} ${noun} на ${platformName}`;
}

function generateSuccessMessage(task: BotTask, botsCreated: number): string {
  const platformMap: Record<string, string> = {
    "spotify": "Spotify",
    "youtube": "YouTube",
    "instagram": "Instagram",
    "tiktok": "TikTok",
    "facebook": "Facebook",
    "twitter": "Twitter/X"
  };
  
  const actionMap: Record<string, { present: string, future: string }> = {
    "listen": { 
      present: "прослушивают", 
      future: "будут прослушивать" 
    },
    "view": { 
      present: "просматривают", 
      future: "будут просматривать"
    },
    "like": { 
      present: "лайкают", 
      future: "будут лайкать" 
    },
    "comment": { 
      present: "комментируют", 
      future: "будут комментировать"
    },
    "follow": { 
      present: "подписываются", 
      future: "будут подписываться"
    },
    "generate": { 
      present: "создают", 
      future: "будут создавать"
    }
  };
  
  const platformName = platformMap[task.targetPlatform] || task.targetPlatform;
  const { future } = actionMap[task.targetAction] || { present: "взаимодействуют", future: "будут взаимодействовать" };
  
  let message = `Задача принята! Я создал ${botsCreated} ${botsCreated === 1 ? "бота" : botsCreated < 5 ? "бота" : "ботов"}, которые ${future} контент на ${platformName}.`;
  
  if (task.targetCount) {
    message += ` Целево�� количество: ${task.targetCount}.`;
  }
  
  if (task.targetDuration) {
    const hours = Math.floor(task.targetDuration);
    const minutes = Math.round((task.targetDuration - hours) * 60);
    
    if (hours > 0 && minutes > 0) {
      message += ` Ориентировочное время выполнения: ${hours} ч ${minutes} мин.`;
    } else if (hours > 0) {
      message += ` Ориентировочное время выполнения: ${hours} ч.`;
    } else if (minutes > 0) {
      message += ` Ориентировочное время выполнения: ${minutes} мин.`;
    }
  }
  
  return message;
}

function estimateDuration(count: number, action: string): number {
  // Возвращаем приблизительное время в часах
  const actionToTimeMap: Record<string, number> = {
    "listen": 3 / 60, // 3 минуты на прослушивание
    "view": 2 / 60,   // 2 минуты на просмотр
    "like": 0.5 / 60, // 30 секунд на лайк
    "comment": 2 / 60, // 2 минуты на комментарий
    "follow": 1 / 60,  // 1 минута на подписку
    "generate": 10 / 60 // 10 минут на генерацию контента
  };
  
  const timePerAction = actionToTimeMap[action] || 2 / 60;
  const totalTime = count * timePerAction;
  
  // Учитываем параллельность и оптимизации
  const parallelFactor = 5; // Предполагаем, что 5 действий могут выполняться параллельно
  return Math.max(0.1, totalTime / parallelFactor); // Минимум 6 минут (0.1 часа)
}

function getActionName(action: string): string {
  const actionMap: Record<string, string> = {
    "listen": "прослушиваний",
    "view": "просмотров",
    "like": "лайков",
    "comment": "комментариев",
    "follow": "подписок",
    "generate": "публикаций"
  };
  
  return actionMap[action] || "действий";
}

function generateBotConfig(task: BotTask): BotConfig {
  // Базовая конфигурация
  const baseConfig: BotConfig = {
    actionDelay: [1500, 3000],
    mouseMovement: 'natural',
    scrollPattern: 'variable',
    randomnessFactor: 0.8,
    sessionVariability: 0.25,
    behaviorProfile: 'Gen-Z Content Consumer'
  };
  
  // Настройки в зависимости от типа задачи
  if (task.targetPlatform === 'spotify') {
    baseConfig.actionDelay = [5000, 10000]; // Более долгие задержки для прослушивания
    baseConfig.behaviorProfile = 'Music Enthusiast';
  } else if (task.targetAction === 'comment') {
    baseConfig.randomnessFactor = 0.9; // Больше случайности для комментариев
    baseConfig.behaviorProfile = 'Engaged Commenter';
  } else if (task.targetAction === 'like') {
    baseConfig.actionDelay = [800, 2500]; // Быстрее для лайков
  }
  
  return baseConfig;
}

function generateBotSchedule(task: BotTask): BotSchedule {
  // Базовое расписание
  return {
    active: true,
    startTime: "09:00",
    endTime: "23:00",
    breakDuration: [15, 45] as [number, number], // Перерывы от 15 до 45 минут
    daysActive: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  };
}

function generateBotProxy(task: BotTask): BotProxy {
  // Базовые настройки прокси
  let rotationFrequency = 60; // Раз в час
  
  // Для разных платформ разные настройки
  if (task.targetPlatform === 'instagram' || task.targetPlatform === 'facebook') {
    rotationFrequency = 30; // Чаще для социальных сетей с более строгой защитой
  }
  
  return {
    useRotation: true,
    rotationFrequency,
    provider: "luminati",
    regions: ["us", "ca", "uk", "au"]
  };
}
