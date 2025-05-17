
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Bot, Copy, Check, ExternalLink, Info } from "lucide-react";
import { externalAPIService } from "@/services/ExternalAPIService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Добавляем информацию о платформах
const platformInfo = {
  twitter: {
    name: "Twitter",
    description: "Короткие сообщения в 280 символов, хэштеги, ссылки, медиа-контент.",
    contentTypes: ["текст", "изображения", "видео", "опросы", "GIF"],
    bestPractices: "Краткость, актуальность, использование хэштегов, вовлекающие вопросы."
  },
  instagram: {
    name: "Instagram",
    description: "Визуально-ориентированная платформа для фото, видео и историй.",
    contentTypes: ["фото", "видео", "истории", "IGTV", "карусель"],
    bestPractices: "Качественные визуальные материалы, правильные хэштеги, вовлекающие подписи."
  },
  youtube: {
    name: "YouTube",
    description: "Видеохостинг для контента любой длительности и тематики.",
    contentTypes: ["видео", "shorts", "трансляции", "плейлисты"],
    bestPractices: "Привлекательные заголовки и миниатюры, качественный звук, оптимизация для поиска."
  },
  telegram: {
    name: "Telegram",
    description: "Мессенджер с возможностью создания каналов и чат-групп.",
    contentTypes: ["текст", "файлы", "опросы", "стикеры", "голосовые сообщения"],
    bestPractices: "Регулярные публикации, использование форматирования, интерактивность с аудиторией."
  },
  facebook: {
    name: "Facebook",
    description: "Многофункциональная социальная сеть для разных типов контента.",
    contentTypes: ["текст", "фото", "видео", "истории", "мероприятия"],
    bestPractices: "Вовлекающий контент, оптимальное время публикаций, частые взаимодействия."
  },
  vk: {
    name: "ВКонтакте",
    description: "Популярная российская социальная сеть с широким функционалом.",
    contentTypes: ["текст", "фото", "видео", "истории", "опросы"],
    bestPractices: "Регулярные публикации, использование хэштегов, акцент на визуальный контент."
  },
  linkedin: {
    name: "LinkedIn",
    description: "Профессиональная социальная сеть для бизнеса и карьеры.",
    contentTypes: ["статьи", "посты", "опросы", "документы"],
    bestPractices: "Профессиональный тон, акцент на экспертизе, деловая информация."
  },
  tiktok: {
    name: "TikTok",
    description: "Короткие вертикальные видео с музыкой и эффектами.",
    contentTypes: ["короткие видео", "прямые эфиры", "дуэты", "звуковые дорожки"],
    bestPractices: "Трендовые челленджи, использование популярных звуков, аутентичность."
  },
  reddit: {
    name: "Reddit",
    description: "Агрегатор контента с тематическими сообществами.",
    contentTypes: ["текстовые посты", "ссылки", "изображения", "обсуждения"],
    bestPractices: "Глубокие дискуссии, следование правилам сообщества, оригинальный контент."
  },
  pinterest: {
    name: "Pinterest",
    description: "Визуальная поисковая система для идей и вдохновения.",
    contentTypes: ["пины", "доски", "идеи", "товары", "руководства"],
    bestPractices: "Качественные изображения, вертикальный формат, детальные описания."
  },
  twitch: {
    name: "Twitch",
    description: "Стриминговая платформа для прямых трансляций.",
    contentTypes: ["живые трансляции", "клипы", "VOD", "чат"],
    bestPractices: "Регулярный график, взаимодействие с чатом, качественный звук и видео."
  },
  discord: {
    name: "Discord",
    description: "Платформа для общения с функциями голосовых и текстовых каналов.",
    contentTypes: ["текст", "медиа", "опросы", "голосовые сообщения"],
    bestPractices: "Организация каналов, модерация, регулярная активность."
  }
};

export function ContentGenerator() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("twitter");
  const [style, setStyle] = useState("informative");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(true);
  const { toast } = useToast();

  // Check current mode on component mount
  useEffect(() => {
    setIsOfflineMode(externalAPIService.isOfflineMode());
  }, []);

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Требуется тема",
        description: "Пожалуйста, введите тему для генерации контента.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Формируем запрос для генерации контента
      const prompt = `Создай контент на тему "${topic}" для платформы ${platform} в ${style === "informative" ? "информативном" : 
        style === "engaging" ? "вовлекающем" : "рекламном"} стиле. 
        Используй эмодзи и соответствующее форматирование для выбранной платформы.`;
      
      let content = "";
      
      // В автономном режиме используем заготовленные шаблоны
      if (isOfflineMode) {
        const platformContent = {
          twitter: {
            informative: `📊 ${topic}: Знаете ли вы? Автоматизация с ИИ может повысить эффективность до 80%! #ИИМаркетинг #ЦифроваяЭффективность`,
            engaging: `🤯 Я был ПОРАЖЕН, когда увидел результаты для "${topic}"! Повышение эффективности на 80% всего за ОДНУ неделю! Кто-нибудь еще пробовал? #ИИРеволюция`,
            promotional: `Готовы увеличить результаты для "${topic}" в 10 раз? Наша платформа обеспечивает на 80% большую эффективность при вдвое меньших усилиях. Ограниченное предложение: начните бесплатный пробный период сейчас! #ИИМаркетинг #РостБизнеса`
          },
          instagram: {
            informative: `${topic} — это не просто тренд, это будущее. Наше последнее исследование показывает, как бренды видят увеличение эффективности на 80%.\n\n#ИИМаркетинг #ЦифроваяТрансформация #СоветыПоМаркетингу`,
            engaging: `✨ Вопрос для моих подписчиков о "${topic}"! ✨\n\nВы уже изучали эту тему? Мы видим НЕВЕРОЯТНЫЕ результаты (увеличение эффективности на 80%!) с нашим новым подходом.\n\nПоставьте 🤖, если хотите, чтобы я поделился дополнительными идеями!\n\n#СоветыПоМаркетингу #ИИРеволюция`,
            promotional: `Преобразите свое понимание "${topic}" с нашим подходом\n\n✅ Увеличение эффективности на 80%\n✅ Персонализированный контент в больших масштабах\n✅ Стратегии на основе данных\n\nНажмите на ссылку в профиле, чтобы начать свой путь!\n\n#ТрансформацияМаркетинга #ИИТехнологии`
          },
          youtube: {
            informative: `${topic}: Эволюция в цифровом маркетинге 2024\n\nВ этом всестороннем анализе мы исследуем, как "${topic}" меняет ландшафт маркетинга, с примерами из практики, показывающими повышение эффективности до 80% в различных отраслях.`,
            engaging: `Я изучал "${topic}" 30 дней... Результаты вас ШОКИРУЮТ! 😱\n\nВ этом видео я документирую свой путь использования передовых инструментов для моей стратегии. От создания контента до таргетирования аудитории, узнайте, как я добился повышения эффективности на 80% и какие уроки я извлек.`,
            promotional: `РАСКРЫТО: Секрет "${topic}", который крупные агентства не хотят, чтобы вы знали\n\nУзнайте, как наша запатентованная система помогает бизнесу, такому как ваш, достичь на 80% большей эффективности при одновременном сокращении расходов вдвое. Доступно ограниченное количество мест в нашей эксклюзивной бета-программе!`
          },
          telegram: {
            informative: `📱 ${topic} | Актуальная информация\n\nЗнаете ли вы, что внедрение инновационных подходов к ${topic} может повысить эффективность на 80%?\n\nОсновные факты:\n• Автоматизация процессов снижает затраты времени на 60%\n• 75% компаний уже интегрировали эти методы\n• ROI в среднем составляет 250%\n\nПодписывайтесь, чтобы быть в курсе последних разработок в области ${topic}!`,
            engaging: `🔥 ОПРОС: Вы уже используете ${topic} в своей работе?\n\n👉 Да, и это круто!\n👉 Только начинаю\n👉 Нет, но хочу узнать больше\n👉 Что это вообще такое? 🤔\n\nПоделитесь своим опытом в комментариях! Самые интересные истории опубликуем в следующем посте.\n\nP.S. Присылайте ваши вопросы о ${topic} — ответим на самые популярные завтра в 19:00!`,
            promotional: `🚀 ЭКСКЛЮЗИВНЫЙ ДОСТУП: Революция в ${topic}!\n\nТолько для подписчиков нашего канала:\n\n✅ Бесплатный вебинар "Как увеличить эффективность с помощью ${topic} на 80%"\n✅ Электронное руководство с пошаговыми стратегиями\n✅ Индивидуальная консультация для первых 50 участников\n\n⏰ Предложение действует до конца недели!\n\nЧтобы получить доступ, нажмите на кнопку "Подробнее" ниже 👇`
          },
          facebook: {
            informative: `📘 ПОЛНЫЙ ГАЙД ПО ${topic.toUpperCase()}\n\nМы собрали всю необходимую информацию о том, как ${topic} меняет бизнес-ландшафт в 2024 году.\n\nКлючевые выводы исследования:\n• Компании, внедрившие ${topic}, показали рост прибыли на 35%\n• 80% клиентов предпочитают бренды, использующие инновации\n• Среднее время внедрения сократилось до 3 месяцев\n\nСкачайте полное исследование по ссылке в комментариях!\n\n#${topic.replace(/\s+/g, '')} #БизнесСоветы #ЦифроваяТрансформация`,
            engaging: `😮 ВОПРОС ДНЯ: Насколько хорошо вы разбираетесь в ${topic}?\n\nРасскажите в комментариях о своем опыте! Что работает лучше всего? С какими трудностями вы столкнулись?\n\nА еще у нас есть ПОДАРОК для самого развернутого комментария — бесплатный доступ к нашему новому онлайн-курсу по ${topic}!\n\nПоделитесь этим постом с коллегами, которым будет полезна эта дискуссия!\n\n#ПоделисьОпытом #${topic.replace(/\s+/g, '')}`,
            promotional: `🔥 ТОЛЬКО НА ЭТОЙ НЕДЕЛЕ! 🔥\n\nРеволюционный курс по ${topic} со скидкой 50%!\n\nЧто вас ждет:\n✅ 8 модулей практического контента\n✅ 12+ часов видеоматериалов\n✅ Шаблоны и готовые решения для бизнеса\n✅ Сертификат по окончанию\n✅ Поддержка экспертов 24/7\n\nОбычная цена: 19,900₽\nЦена до воскресенья: 9,950₽\n\n👉 Нажмите на ссылку, чтобы забронировать место: [ССЫЛКА]\n\n#Обучение #${topic.replace(/\s+/g, '')} #Скидки`
          },
          vk: {
            informative: `📊 ${topic.toUpperCase()} - полное руководство\n\nГотовы погрузиться в тему? В этом посте вы найдете:\n\n- Что такое ${topic} и почему это важно\n- 5 главных трендов в этой области на 2024 год\n- Как внедрение ${topic} может увеличить ваш доход на 40%\n\nСохраняйте пост в закладки, чтобы не потерять!\n\n#${topic.replace(/\s+/g, '')} #полезныйконтент`,
            engaging: `🔥 ЧЕЛЛЕНДЖ ПО ${topic.toUpperCase()}! 🔥\n\nПриглашаем всех принять участие в 7-дневном марафоне по освоению ${topic}!\n\nКаждый день новое задание и полезные советы в нашей группе.\n\nНапишите в комментариях «Я в деле!», чтобы присоединиться, и получите бонусные материалы!\n\nНачинаем уже завтра в 12:00! Будет интересно 😉\n\n#марафон #${topic.replace(/\s+/g, '')}`,
            promotional: `🎁 КОНКУРС + РОЗЫГРЫШ!\n\nХотите стать экспертом в ${topic}?\n\nМы разыгрываем 3 места на премиум-курс «${topic}: от новичка до профи»!\n\nУсловия простые:\n✅ Быть подписчиком группы\n✅ Сделать репост этой записи\n✅ Написать в комментариях, почему вы хотите изучить ${topic}\n\nИтоги 30 мая в 20:00 в прямом эфире!\n\n#конкурс #${topic.replace(/\s+/g, '')}`
          },
          linkedin: {
            informative: `📈 [ИССЛЕДОВАНИЕ]: Как ${topic} трансформирует бизнес-процессы в 2024 году\n\nНаша команда проанализировала данные 500+ компаний, внедривших ${topic} в свои рабочие процессы. Результаты впечатляют:\n\n• Увеличение продуктивности команд на 42%\n• Сокращение операционных расходов до 35%\n• Ускорение вывода продукта на рынок на 28%\n\nКлючевой вывод: компании, инвестирующие в ${topic}, опережают конкурентов по скорости роста в 2,7 раза.\n\nПолный отчет доступен по ссылке в комментариях.\n\n#БизнесАналитика #${topic} #ЦифроваяТрансформация`,
            engaging: `💡 Задумывались ли вы о том, как ${topic} меняет наш подход к работе?\n\nНа прошлой неделе я провел опрос среди 200+ руководителей высшего звена и получил неожиданные результаты:\n\n• 78% считают ${topic} критически важным для конкурентоспособности\n• Однако только 23% полностью понимают, как это внедрить\n• 64% планируют увеличить бюджет на ${topic} в следующем году\n\nА как в вашей компании обстоят дела с ${topic}?\n\nПоделитесь своим опытом в комментариях! Соберу самые интересные кейсы в следующей статье.\n\n#ДеловаяДискуссия #ПрофессиональныйРост`,
            promotional: `🚀 ПРИГЛАШЕНИЕ НА ЭКСКЛЮЗИВНЫЙ ВЕБИНАР: «${topic} как драйвер роста бизнеса»\n\nРад сообщить, что 15 июня я проведу 90-минутный мастер-класс для руководителей и специалистов, где раскрою:\n\n• Пошаговую стратегию внедрения ${topic} без увеличения бюджета\n• 5 малоизвестных инструментов для автоматизации процессов\n• Метрики оценки эффективности и ROI\n\nУчастие бесплатное, но количество мест ограничено до 100.\n\nЗарегистрируйтесь по ссылке в комментарии.\n\n#ПрофессиональноеРазвитие #Вебинар #Бизнес`
          },
          tiktok: {
            informative: `Вы знали, что ${topic} может изменить вашу жизнь? 🤯 #обучение #${topic.replace(/\s+/g, '')} #лайфхак`,
            engaging: `POV: Вы узнали секретный метод ${topic} и теперь ваш день стал продуктивнее на 80% 🚀 #челлендж #${topic.replace(/\s+/g, '')}`,
            promotional: `Не трать время зря! 3 шага к мастерству в ${topic} — ссылка в профиле 👆 #${topic.replace(/\s+/g, '')} #реклама`
          },
          reddit: {
            informative: `[Гайд] Полное руководство по ${topic} в 2024 году\n\nПривет, r/[подходящий_сабреддит]!\n\nЯ провел последние 6 месяцев, глубоко погружаясь в ${topic}, и хотел бы поделиться всем, что узнал. Это руководство охватывает все от базовых принципов до продвинутых стратегий.\n\n**Содержание:**\n\n1. Что такое ${topic} и почему это важно\n2. Основные концепции для начинающих\n3. Промежуточные стратегии\n4. Продвинутые техники\n5. Ресурсы для дальнейшего изучения\n\n**Первый раздел: Что такое ${topic}**\n\n${topic} — это методология, которая революционизирует способ [соответствующая область]. В отличие от традиционных подходов, она позволяет [преимущества].\n\n[...]\n\nЯ буду рад ответить на любые вопросы в комментариях!\n\nEdit: Спасибо за золото, добрый незнакомец!`,
            engaging: `Я применял ${topic} каждый день в течение месяца. Вот что произошло. [Длинный пост]\n\nПривет всем,\n\nМесяц назад я наткнулся на статью о ${topic} и решил провести эксперимент: применять эту технику каждый день в течение 30 дней и записывать результаты.\n\n**День 1-7: Начало**\nПервая неделя была сложной. [Описание трудностей и первых наблюдений]\n\n**День 8-14: Адаптация**\nВторая неделя принесла некоторые неожиданные открытия: [интересные наблюдения]\n\n**День 15-22: Прорыв**\nИменно здесь всё изменилось. [описание прорыва]\n\n**День 23-30: Мастерство**\n[Финальные результаты и выводы]\n\n**Заключение:**\nЭти 30 дней полностью изменили мой подход к [соответствующая область]. Если вы думаете о том, чтобы попробовать ${topic}, определенно рекомендую!\n\nКто-нибудь еще экспериментировал с ${topic}? Поделитесь своим опытом!`,
            promotional: `Я создал инструмент для ${topic}, который решил мою главную проблему с [конкретная задача]\n\nПривет, r/[соответствующий_сабреддит]!\n\nПосле многолетней борьбы с [проблема, связанная с ${topic}], я решил создать свое решение. Представляю [название продукта] — инструмент, который я разработал для решения этой конкретной проблемы.\n\n**Что умеет [название продукта]:**\n\n- [Ключевая функция 1]\n- [Ключевая функция 2]\n- [Ключевая функция 3]\n\n**Как это работает:**\n[Краткое объяснение]\n\nЯ выпустил бесплатную версию для сообщества. Если вам интересно попробовать, вот [ссылка].\n\nP.S. Это не реклама, просто хочу поделиться инструментом, который может быть полезен другим. Открыт для обратной связи и предложений по улучшению!`
          },
          pinterest: {
            informative: `5 основных принципов ${topic}, которые должен знать каждый | Полное руководство для начинающих | Советы экспертов по ${topic} | #${topic.replace(/\s+/g, '')} #руководство`,
            engaging: `Попробуйте этот 30-дневный челлендж по ${topic} и посмотрите, как изменится ваша жизнь! | Скачайте бесплатный трекер прогресса | #челлендж #${topic.replace(/\s+/g, '')}`,
            promotional: `✨ НОВЫЙ КУРС ✨ Освойте ${topic} за 21 день с нашим пошаговым руководством | Скидка 40% при раннем бронировании | Нажмите, чтобы узнать подробности | #онлайнкурс #${topic.replace(/\s+/g, '')}`
          },
          twitch: {
            informative: `[${topic} Мастер-класс] Сегодня разбираем основы и отвечаем на ваши вопросы! Присоединяйтесь к стриму и узнайте, как ${topic} может улучшить ваши навыки. !команды для полезных ресурсов`,
            engaging: `🔴 LIVE: ЧЕЛЛЕНДЖ ПО ${topic.toUpperCase()}! Сегодня пробуем новые техники и соревнуемся с чатом! За каждые 5 новых подписчиков - дополнительное испытание! Пишите в чате ваши идеи!`,
            promotional: `🎁 РОЗЫГРЫШ ПРЕМИУМ-КУРСА ПО ${topic.toUpperCase()} СЕГОДНЯ В КОНЦЕ СТРИМА! Чтобы участвовать: 1) Подпишитесь 2) Напишите в чат !участвую 3) Расскажите, почему вы хотите изучить ${topic}! Курс стоимостью 15000₽ достанется одному счастливчику!`
          },
          discord: {
            informative: `@everyone\n\n**РУКОВОДСТВО ПО ${topic.toUpperCase()}**\n\nДобрый день, участники сервера!\n\nМы подготовили комплексное руководство по ${topic}, которое теперь закреплено в канале #ресурсы.\n\nВ нем вы найдете:\n• Основные концепции и терминология\n• Пошаговые инструкции для начинающих\n• Продвинутые техники для опытных пользователей\n• Полезные ссылки и инструменты\n\nЕсли у вас возникнут вопросы, задавайте их в специальном треде под руководством.\n\nПриятного изучения!\n\n#${topic.replace(/\s+/g, '')}`,
            engaging: `@here\n\n**ЕЖЕНЕДЕЛЬНЫЙ ЧЕЛЛЕНДЖ: ${topic.toUpperCase()}**\n\nВсем привет! 👋\n\nОбъявляем новый недельный челлендж по ${topic}!\n\n**Как участвовать:**\n1. Выполните задание, описанное ниже\n2. Опубликуйте результат в канале #челленджи\n3. Получите отзывы от сообщества и менторов\n\n**Задание этой недели:**\n${Math.random() > 0.5 ? `Создайте [что-то связанное с ${topic}] и поделитесь процессом создания.` : `Примените технику ${topic} к реальной задаче и задокументируйте результаты.`}\n\n**Приз для победителя:**\nЭксклюзивная роль "Эксперт по ${topic}" и индивидуальная консультация с нашим специалистом.\n\nУ вас есть время до воскресенья, 23:59! Удачи всем участникам! 🚀\n\nРеакция 👍 если будете участвовать!`,
            promotional: `@everyone\n\n**СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ: КУРС ПО ${topic.toUpperCase()}**\n\nДорогие участники сервера!\n\nТолько для членов нашего сообщества:\n\n**Премиум-курс "${topic}: от основ до мастерства"** со скидкой 40%!\n\n✅ 8 модулей практического контента\n✅ 12+ часов видео-уроков\n✅ Еженедельные живые сессии вопросов и ответов\n✅ Доступ к закрытому каналу выпускников\n✅ Сертификат по окончании\n\n**Обычная цена:** ~~15000₽~~\n**Цена для участников сервера:** 9000₽\n\nПромокод: DISCORD40\n\n**Предложение активно до конца недели!**\n\nЧтобы узнать подробности, напишите в личные сообщения @Админ или перейдите по ссылке: [ССЫЛКА]\n\n#${topic.replace(/\s+/g, '')} #скидка`
          }
        };
        
        // Проверяем наличие контента для выбранной платформы, если нет - используем Twitter
        const platformData = platformContent[platform as keyof typeof platformContent] || platformContent.twitter;
        content = platformData[style as keyof typeof platformData] || platformData.informative;
        
        // Имитируем задержку API
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Используем реальный API в онлайн режиме
        if (!externalAPIService.hasOpenRouterApiKey()) {
          toast({
            title: "API ключ не настроен",
            description: "Для генерации контента с помощью AI необходимо добавить OpenRouter API ключ в настройках.",
            variant: "destructive",
          });
          setIsGenerating(false);
          return;
        }
        
        const response = await externalAPIService.sendToOpenRouter(prompt);
        if (response && response.choices && response.choices[0]?.message?.content) {
          content = response.choices[0].message.content;
        } else {
          throw new Error("Не удалось получить ответ от API");
        }
      }
      
      setGeneratedContent(content);
      
      toast({
        title: "Контент сгенерирован",
        description: "Ваш контент был успешно сгенерирован.",
      });
    } catch (error) {
      console.error("Ошибка при генерации контента:", error);
      toast({
        title: "Ошибка генерации",
        description: "Не удалось сгенерировать контент. Пожалуйста, попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast({
      title: "Контент скопирован",
      description: "Контент скопирован в буфер обмена.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedPlatformInfo = platformInfo[platform as keyof typeof platformInfo];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Генератор контента
          {isOfflineMode && (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
              Автономный режим
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isOfflineMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
            Приложение работает в автономном режиме. Генерируемый контент будет основан на шаблонах. 
            <Button 
              variant="link" 
              className="h-auto p-0 ml-1 text-yellow-800 underline" 
              onClick={() => window.location.href = '/command'}
            >
              Настроить API <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Тема</Label>
          <Input 
            placeholder="Введите тему или ключевое слово" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Платформа</Label>
              {selectedPlatformInfo && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="h-6 w-6 p-0 rounded-full">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Информация о платформе</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">{selectedPlatformInfo.name}</h4>
                      <p className="text-sm">{selectedPlatformInfo.description}</p>
                      <div className="mt-2">
                        <h5 className="text-xs font-medium text-muted-foreground">Типы контента:</h5>
                        <p className="text-sm">{selectedPlatformInfo.contentTypes.join(", ")}</p>
                      </div>
                      <div className="mt-1">
                        <h5 className="text-xs font-medium text-muted-foreground">Лучшие практики:</h5>
                        <p className="text-sm">{selectedPlatformInfo.bestPractices}</p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите платформу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="vk">ВКонтакте</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="reddit">Reddit</SelectItem>
                <SelectItem value="pinterest">Pinterest</SelectItem>
                <SelectItem value="twitch">Twitch</SelectItem>
                <SelectItem value="discord">Discord</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Стиль</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите стиль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="informative">Информативный</SelectItem>
                <SelectItem value="engaging">Вовлекающий</SelectItem>
                <SelectItem value="promotional">Рекламный</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleGenerate} 
          disabled={isGenerating || !topic}
        >
          {isGenerating ? "Генерация..." : "Сгенерировать контент"}
        </Button>
        
        {generatedContent && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Сгенерированный контент</label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Textarea 
              value={generatedContent} 
              readOnly 
              className="min-h-[120px] font-mono text-sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
