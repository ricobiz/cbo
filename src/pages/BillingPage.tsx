import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionPlans } from "@/components/billing/SubscriptionPlans";
import { PaymentSettings } from "@/components/billing/PaymentSettings";
import { CreditCard, DollarSign, Settings } from "lucide-react";

const BillingPage = () => {
  const [activeTab, setActiveTab] = useState("plans");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Биллинг и подписки</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-[400px] grid-cols-3">
          <TabsTrigger value="plans" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>Планы</span>
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-1">
            <CreditCard className="h-4 w-4" />
            <span>Использование</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span>Настройки</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans" className="space-y-6 mt-6">
          <SubscriptionPlans />
        </TabsContent>
        
        <TabsContent value="usage" className="space-y-6 mt-6">
          <CostBreakdown />
          <QuotaSettings />
          <UsageChart />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6 mt-6">
          <PaymentSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingPage;
