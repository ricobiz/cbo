import { botService, BotConfig, BotProxy, BotSchedule, BotType } from './BotService';
import { externalAPIService } from './external-api';
import { useBotStore } from '@/store/BotStore';

interface AICommandResult {
  success: boolean;
  message: string;
  botsCreated: number;
  taskId?: string;
  botIds?: string[];
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
    const { createdBots, botIds } = setupBotsForTask(taskInfo);
    
    if (createdBots === 0) {
      return {
        success: false,
        message: "Не удалось создать ботов для выполнения задачи. Возможно, недостаточно ресурсов или неподдерживаемый тип действия.",
        botsCreated: 0
      };
    }
    
    // Обновляем состояние ботов в хранилище
    const botStore = useBotStore.getState();
    botStore.fetchBots();
    
    // Возвращаем результат
    return {
      success: true,
      message: generateSuccessMessage(taskInfo, createdBots),
      botsCreated: createdBots,
      taskId: Date.now().toString(),
      botIds: botIds
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
  if (['listen', 'view', 'watch', 'play'].includes(action?.toLowerCase())) {
    return 'click';
  }
  if (['like', 'follow', 'subscribe', 'join', 'react', 'участвовать'].includes(action?.toLowerCase())) {
    return 'interaction';
  }
  if (['comment', 'generate', 'create', 'write', 'post', 'publish'].includes(action?.toLowerCase())) {
    return 'content';
  }
  if (['collect', 'parse', 'scrape', 'extract'].includes(action?.toLowerCase())) {
    return 'parser';
  }
  return 'click'; // Default
}

// Анализ команды (упрощенная имплементация)
function analyzeCommand(command: string): BotTask | null {
  const lowercaseCommand = command.toLowerCase();
  
  // Определяем платформу
  let targetPlatform = "";
  const platforms = {
    "youtube": ["youtube", "ютуб", "ютьюб"],
    "twitter": ["twitter", "твиттер", "x", "твитер"],
    "instagram": ["instagram", "инстаграм", "инста"],
    "tiktok": ["tiktok", "тикток", "тик ток", "тик-ток"],
    "spotify": ["spotify", "спотифай"],
    "facebook": ["facebook", "фейсбук", "fb"],
    "telegram": ["telegram", "телеграм", "телега"],
    "vk": ["vk", "вконтакте", "вк"],
    "linkedin": ["linkedin", "линкедин"],
    "reddit": ["reddit", "реддит"],
    "pinterest": ["pinterest", "пинтерест"],
    "twitch": ["twitch", "твич"],
    "discord": ["discord", "дискорд"],
    "clubhouse": ["clubhouse", "клабхаус"],
    "medium": ["medium", "медиум"],
    "soundcloud": ["soundcloud", "саундклауд"],
    "snapchat": ["snapchat", "снэпчат"]
  };
  
  for (const [platform, keywords] of Object.entries(platforms)) {
    if (keywords.some(keyword => lowercaseCommand.includes(keyword))) {
      targetPlatform = platform;
      break;
    }
  }
  
  if (!targetPlatform) return null;
  
  // Определяем тип действия
  let botType: BotType = "interaction";
  let targetAction = "";
  
  const actions = {
    "listen": ["слушать", "прослушива", "стрим", "воспроиз"],
    "view": ["просмотр", "смотреть", "view", "показ", "посещ"],
    "like": ["лайк", "нравится", "like"],
    "comment": ["коммент", "comment", "ответ", "отвеч", "написа"],
    "follow": ["подпис", "follow", "фоллов", "читать", "читаю"],
    "generate": ["создать", "создай", "сгенерировать", "генерировать", "написать"],
    "parse": ["собрать", "собери", "извлечь", "парси", "парсинг", "анализ"],
    "subscribe": ["подпишись", "subscribe", "записаться", "join", "присоедин"],
    "react": ["реагируй", "реакция", "голосуй", "голосование"]
  };
  
  // Находим действие в команде
  for (const [action, keywords] of Object.entries(actions)) {
    if (keywords.some(keyword => lowercaseCommand.includes(keyword))) {
      targetAction = action;
      
      // Определяем тип бота на основе действия
      if (["listen", "view"].includes(action)) {
        botType = "click";
      } else if (["like", "follow", "subscribe", "react"].includes(action)) {
        botType = "interaction";
      } else if (["comment", "generate"].includes(action)) {
        botType = "content";
      } else if (["parse"].includes(action)) {
        botType = "parser";
      }
      
      break;
    }
  }
  
  // Если не определили конкретное действие, пробуем угадать по контексту платформы
  if (!targetAction) {
    const defaultActions: Record<string, string> = {
      "spotify": "listen",
      "youtube": "view",
      "twitch": "view",
      "instagram": "like",
      "tiktok": "view",
      "telegram": "view"
    };
    
    targetAction = defaultActions[targetPlatform] || "view";
    botType = ["listen", "view"].includes(targetAction) ? "click" : "interaction";
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

// Создание ботов для задачи - обновленная версия
function setupBotsForTask(task: BotTask): { createdBots: number, botIds: string[] } {
  try {
    // Определяем оптимальное количество ботов для задачи
    const optimalBotCount = calculateOptimalBotCount(task);
    let createdBots = 0;
    const botIds: string[] = [];
    
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
        botIds.push(botId);
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
    
    return { createdBots, botIds };
  } catch (error) {
    console.error("Error setting up bots for task:", error);
    return { createdBots: 0, botIds: [] };
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
    
    // Дополнительные действия в зависимости от типа задачи
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
    'telegram': 'https://web.telegram.org',
    'vk': 'https://vk.com',
    'linkedin': 'https://www.linkedin.com',
    'reddit': 'https://www.reddit.com',
    'pinterest': 'https://www.pinterest.com',
    'twitch': 'https://www.twitch.tv',
    'discord': 'https://discord.com',
    'medium': 'https://medium.com',
    'clubhouse': 'https://www.clubhouse.com',
    'soundcloud': 'https://soundcloud.com',
    'snapchat': 'https://web.snapchat.com'
  };
  
  return platforms[platform.toLowerCase()] || 'https://www.google.com';
}

// Вспомогательные функции
function calculateOptimalBotCount(task: BotTask): number {
  // Упрощенная логика: 1 бот на каждые 100-200 действий
  // В реальном приложении здесь будет более сложная логика с учетом доступных ресурсов и ограничений
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
    "twitter": "Twitter/X",
    "telegram": "Telegram",
    "vk": "ВКонтакте",
    "linkedin": "LinkedIn",
    "reddit": "Reddit",
    "pinterest": "Pinterest",
    "twitch": "Twitch",
    "discord": "Discord",
    "medium": "Medium",
    "clubhouse": "Clubhouse",
    "soundcloud": "SoundCloud",
    "snapchat": "Snapchat"
  };
  
  const actionMap: Record<string, string> = {
    "listen": "Listener",
    "view": "Viewer",
    "like": "Liker",
    "comment": "Commenter",
    "follow": "Follower",
    "generate": "Generator",
    "subscribe": "Subscriber",
    "react": "Reactor",
    "parse": "Parser"
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
    "twitter": "Twitter/X",
    "telegram": "Telegram",
    "vk": "ВКонтакте",
    "linkedin": "LinkedIn",
    "reddit": "Reddit",
    "pinterest": "Pinterest",
    "twitch": "Twitch",
    "discord": "Discord",
    "medium": "Medium",
    "clubhouse": "Clubhouse",
    "soundcloud": "SoundCloud",
    "snapchat": "Snapchat"
  };
  
  const actionMap: Record<string, { verb: string, noun: string }> = {
    "listen": { verb: "прослушиваний", noun: "прослушиваний" },
    "view": { verb: "просмотров", noun: "просмотров" },
    "like": { verb: "лайков", noun: "лайков" },
    "comment": { verb: "комментариев", noun: "комментариев" },
    "follow": { verb: "подписок", noun: "подписчиков" },
    "generate": { verb: "контента", noun: "публикаций" },
    "subscribe": { verb: "подписок", noun: "подписчиков" },
    "react": { verb: "реакций", noun: "реакций" },
    "parse": { verb: "сбора данных", noun: "записей" }
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
    "twitter": "Twitter/X",
    "telegram": "Telegram",
    "vk": "ВКонтакте",
    "linkedin": "LinkedIn",
    "reddit": "Reddit",
    "pinterest": "Pinterest",
    "twitch": "Twitch",
    "discord": "Discord",
    "medium": "Medium",
    "clubhouse": "Clubhouse",
    "soundcloud": "SoundCloud",
    "snapchat": "Snapchat"
  };
  
  const actionMap: Record<string, { verb: string, noun: string }> = {
    "listen": { verb: "прослушиваний", noun: "прослушиваний" },
    "view": { verb: "просмотров", noun: "просмотров" },
    "like": { verb: "лайков", noun: "лайков" },
    "comment": { verb: "комментариев", noun: "комментариев" },
    "follow": { verb: "подписок", noun: "подписчиков" },
    "generate": { verb: "контента", noun: "публикаций" },
    "subscribe": { verb: "подписок", noun: "подписчиков" },
    "react": { verb: "реакций", noun: "реакций" },
    "parse": { verb: "сбора данных", noun: "записей" }
  };
  
  const platformName = platformMap[task.targetPlatform] || task.targetPlatform;
  const { verb, noun } = actionMap[task.targetAction] || { verb: "действий", noun: "действий" };
  
  if (botsCreated === 1) {
    return `Успешно создан 1 бот для набора ${task.targetCount} ${noun} на ${platformName}.`;
  } else {
    return `Успешно создано ${botsCreated} ботов для набора ${task.targetCount} ${noun} на ${platformName}.`;
  }
}

function estimateDuration(count: number, action: string): number {
  const baseDuration = 60; // minutes
  let duration = baseDuration;
  
  switch (action) {
    case "listen":
      duration = count / 2; // 2 listens per minute
      break;
    case "view":
      duration = count / 5; // 5 views per minute
      break;
    case "like":
      duration = count / 10; // 10 likes per minute
      break;
    case "comment":
      duration = count * 2; // 2 minutes per comment
      break;
    case "follow":
      duration = count / 5; // 5 follows per minute
      break;
    default:
      duration = baseDuration;
  }
  
  return duration / 60; // Convert to hours
}

function getActionName(action: string): string {
  const actionMap: Record<string, string> = {
    "listen": "прослушиваний",
    "view": "просмотров",
    "like": "лайков",
    "comment": "комментариев",
    "follow": "подписок",
    "generate": "публикаций",
    "subscribe": "подписок",
    "react": "реакций",
    "parse": "записей данных"
  };
  
  return actionMap[action] || "действий";
}

function generateBotConfig(task: BotTask): BotConfig {
  return {
    actionDelay: [1500, 3000], // min, max delay in ms
    mouseMovement: 'natural',
    scrollPattern: 'variable',
    randomnessFactor: 0.8,
    sessionVariability: 0.25,
    behaviorProfile: 'Gen-Z Content Consumer'
  };
}

function generateBotSchedule(task: BotTask): BotSchedule {
  return {
    active: true,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + (task.targetDuration || 24) * 60 * 60 * 1000).toISOString(),
    breakDuration: [15, 30], // min, max in minutes
    daysActive: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  };
}

function generateBotProxy(task: BotTask): BotProxy {
  return {
    useRotation: true,
    rotationFrequency: 60,
    provider: "luminati",
    regions: ["us", "ca", "uk", "au"]
  };
}
