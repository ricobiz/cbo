
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/store/LanguageStore";
import { Check, Globe } from "lucide-react";
import { toast } from "sonner";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  
  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];
  
  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    
    const selectedLang = languages.find(lang => lang.code === langCode);
    if (selectedLang) {
      toast.success(`Язык изменен на ${selectedLang.name}`, {
        position: "bottom-right",
        duration: 2000,
      });
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8 px-2">
          <span className="text-base">{currentLanguage.flag}</span>
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className="cursor-pointer flex items-center justify-between transition-all duration-200"
            onClick={() => handleLanguageChange(lang.code)}
          >
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {language === lang.code && <Check className="h-4 w-4 text-green-500" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
