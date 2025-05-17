
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from './layouts/MainLayout';
import Index from './pages/Index';
import ContentPage from './pages/ContentPage';
import CampaignsPage from './pages/CampaignsPage';
import BotsPage from "./pages/BotsPage";
import BotsList from './pages/Bots/BotsList';
import BotDetail from './pages/Bots/BotDetail';
import CreateBot from './pages/Bots/CreateBot';
import CampaignsList from './pages/Campaigns/CampaignsList';
import CampaignDetail from './pages/Campaigns/CampaignDetail';
import ScenariosPage from "./pages/ScenariosPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import CommandPage from "./pages/CommandPage";
import NotFound from "./pages/NotFound";
import BillingPage from "./pages/BillingPage";
import AdminPage from "./pages/AdminPage";
import { Toaster } from "sonner";

// Создаем экземпляр QueryClient с настройками
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Уменьшаем количество повторных запросов при ошибке
      retryDelay: 1000, // Задержка между повторами (1 секунда)
      staleTime: 60000, // Данные считаются актуальными в течение 1 минуты
      refetchOnWindowFocus: false, // Отключаем автоматический рефетч при фокусе окна
      refetchOnMount: true, // Включаем рефетч при монтировании компонента
      refetchOnReconnect: true, // Включаем рефетч при восстановлении соединения
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors />
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/bots" element={<BotsList />} />
            <Route path="/bots/:id" element={<BotDetail />} />
            <Route path="/bots/create" element={<CreateBot />} />
            <Route path="/bots/:id/edit" element={<CreateBot />} />
            <Route path="/scenarios" element={<ScenariosPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/command" element={<CommandPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
