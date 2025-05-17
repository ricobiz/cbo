
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { ApiSettings } from "@/components/settings/ApiSettings";
import { BotSettings } from "@/components/settings/BotSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { BillingSettings } from "@/components/settings/BillingSettings";

const SettingsPage = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 w-full md:w-[600px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="bots">Bot Config</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <GeneralSettings onSave={handleSave} />
        </TabsContent>

        <TabsContent value="api" className="space-y-6 mt-6">
          <ApiSettings onSave={handleSave} />
        </TabsContent>

        <TabsContent value="bots" className="space-y-6 mt-6">
          <BotSettings onSave={handleSave} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <SecuritySettings onSave={handleSave} />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 mt-6">
          <BillingSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
