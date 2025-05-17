
import { create } from "zustand";

interface TranslationState {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    content: "Content",
    campaigns: "Campaigns",
    bots: "Bots",
    scenarios: "Scenarios",
    analytics: "Analytics",
    command: "Command",
    settings: "Settings",
    collapse: "Collapse",
    details: "View details",
    generateContent: "Generate content",
    campaignAnalytics: "Campaign Analytics",
    campaignAnalyticsDesc: "Overview of your marketing campaign effectiveness",
    noInteractions: "No interactions in the last 30 days",
    activeBots: "Active Bots",
    activeBotsDesc: "Manage and monitor your active bots",
    noBotsRunning: "No bots currently running",
    manageBots: "Manage bots",
    recentScenarios: "Recent Scenarios",
    recentScenariosDesc: "Quick access to your latest scenarios",
    noScenarios: "No scenarios launched this week",
    manageScenarios: "Manage scenarios",
    campaignActivity: "Campaign Activity",
    noActivityYet: "No activity recorded yet",
    timeRange: "Time range",
    last24Hours: "Last 24 hours",
    last7Days: "Last 7 days",
    last30Days: "Last 30 days",
    last90Days: "Last 90 days",
    views: "Views",
    engagements: "Engagements",
    clicks: "Clicks",
  },
  ru: {
    dashboard: "Панель управления",
    content: "Контент",
    campaigns: "Кампании",
    bots: "Боты",
    scenarios: "Сценарии",
    analytics: "Аналитика",
    command: "Команды",
    settings: "Настройки",
    collapse: "Свернуть",
    details: "Подробнее",
    generateContent: "Сгенерировать контент",
    campaignAnalytics: "Аналитика кампаний",
    campaignAnalyticsDesc: "Обзор эффективности ваших маркетинговых кампаний",
    noInteractions: "Нет взаимодействий за последние 30 дней",
    activeBots: "Активные боты",
    activeBotsDesc: "Управление и мониторинг ваших активных ботов",
    noBotsRunning: "Сейчас нет запущенных ботов",
    manageBots: "Управление ботами",
    recentScenarios: "Последние сценарии",
    recentScenariosDesc: "Быстрый доступ к вашим последним сценариям",
    noScenarios: "Нет запущенных сценариев на этой неделе",
    manageScenarios: "Управление сценариями",
    campaignActivity: "Активность кампаний",
    noActivityYet: "Активность пока не зафиксирована",
    timeRange: "Период времени",
    last24Hours: "Последние 24 часа",
    last7Days: "Последние 7 дней",
    last30Days: "Последние 30 дней",
    last90Days: "Последние 90 дней",
    views: "Просмотры",
    engagements: "Взаимодействия",
    clicks: "Клики",
  }
};

export const useTranslation = create<TranslationState>((set, get) => ({
  language: "ru", // Default language
  setLanguage: (language: string) => set({ language }),
  t: (key: string) => {
    const { language } = get();
    return translations[language]?.[key] || key;
  },
}));
