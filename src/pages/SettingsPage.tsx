
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { ApiSettings } from "@/components/settings/ApiSettings";
import { BotSettings } from "@/components/settings/BotSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { BillingSettings } from "@/components/settings/BillingSettings";
import { ProxySettings } from "@/components/settings/ProxySettings";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "@/store/LanguageStore";

const SettingsPage = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Get tab from URL query parameter
  const query = new URLSearchParams(location.search);
  const tabFromUrl = query.get("tab") || "general";
  
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/settings?tab=${value}`, { replace: true });
  };

  // Update tab when URL changes
  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [location.search, tabFromUrl]);

  const handleSave = () => {
    toast({
      title: t('settingsSaved') || "Settings saved",
      description: t('settingsSuccessfullySaved') || "Your changes have been saved successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('settings') || "Settings"}</h1>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-6 w-full md:w-[720px] mb-6">
          <TabsTrigger value="general">{t('general') || "General"}</TabsTrigger>
          <TabsTrigger value="api">{t('apiKeys') || "API Keys"}</TabsTrigger>
          <TabsTrigger value="bots">{t('botConfig') || "Bot Config"}</TabsTrigger>
          <TabsTrigger value="proxy">{t('proxies') || "Proxies"}</TabsTrigger>
          <TabsTrigger value="security">{t('security') || "Security"}</TabsTrigger>
          <TabsTrigger value="billing">{t('billing') || "Billing"}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <GeneralSettings onSave={handleSave} />
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <ApiSettings onSave={handleSave} />
        </TabsContent>

        <TabsContent value="bots" className="space-y-6">
          <BotSettings onSave={handleSave} />
        </TabsContent>
        
        <TabsContent value="proxy" className="space-y-6">
          <ProxySettings onSave={handleSave} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings onSave={handleSave} />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <BillingSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
