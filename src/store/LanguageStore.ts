
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LanguageState = {
  language: string;
  setLanguage: (language: string) => void;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'ru',
      setLanguage: (language: string) => set({ language }),
    }),
    {
      name: 'language-storage',
    }
  )
);

// Dictionary of translations
export type TranslationDict = Record<string, Record<string, string>>;

// Simple translations object to be expanded
const translations: TranslationDict = {
  'dashboard': {
    'ru': 'Панель управления',
    'en': 'Dashboard',
    'de': 'Dashboard',
    'fr': 'Tableau de bord',
    'es': 'Panel de control',
    'zh': '仪表板',
  },
  'campaigns': {
    'ru': 'Кампании',
    'en': 'Campaigns',
    'de': 'Kampagnen',
    'fr': 'Campagnes',
    'es': 'Campañas',
    'zh': '广告系列',
  },
  'bots': {
    'ru': 'Управление ботами',
    'en': 'Bot Management',
    'de': 'Bot-Verwaltung',
    'fr': 'Gestion des bots',
    'es': 'Gestión de bots',
    'zh': '机器人管理',
  },
  'content': {
    'ru': 'Генератор контента',
    'en': 'Content Generator',
    'de': 'Inhaltsgenerator',
    'fr': 'Générateur de contenu',
    'es': 'Generador de contenido',
    'zh': '内容生成器',
  },
  'scenarios': {
    'ru': 'Сценарии',
    'en': 'Scenarios',
    'de': 'Szenarien',
    'fr': 'Scénarios',
    'es': 'Escenarios',
    'zh': '场景',
  },
  'analytics': {
    'ru': 'Аналитика',
    'en': 'Analytics',
    'de': 'Analytik',
    'fr': 'Analytique',
    'es': 'Analítica',
    'zh': '分析',
  },
  'settings': {
    'ru': 'Настройки',
    'en': 'Settings',
    'de': 'Einstellungen',
    'fr': 'Paramètres',
    'es': 'Configuración',
    'zh': '设置',
  },
  'command': {
    'ru': 'Центр управления ИИ',
    'en': 'AI Command Center',
    'de': 'KI-Kommandozentrale',
    'fr': 'Centre de commande IA',
    'es': 'Centro de comandos de IA',
    'zh': 'AI命令中心',
  },
};

// Helper function to get a translation
export const useTranslation = () => {
  const { language } = useLanguageStore();
  
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    // Fallback to English or the key itself
    return translations[key]?.['en'] || key;
  };
  
  return { t, language };
};
