
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminSubscriptionPlans } from "@/components/admin/AdminSubscriptionPlans";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminUsersWrapper } from "@/components/admin/AdminUsersWrapper";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";
import { Shield, Users, BarChart, Settings, ServerCrash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiStatusSummary } from "@/components/api/ApiStatusSummary";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("plans");
  const { toast } = useToast();
  
  // В реальном приложении здесь была бы проверка прав администратора
  // const { user, isAdmin } = useAuth();
  // if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Панель администратора</h1>
      </div>
      
      <ApiStatusSummary />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl mb-6">
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Подписки</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Пользователи</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Аналитика</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Настройки</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans" className="space-y-6 mt-6">
          <AdminSubscriptionPlans />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6 mt-6">
          <AdminUsersWrapper />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <AdminAnalytics />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6 mt-6">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
