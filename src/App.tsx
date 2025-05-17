
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Index";
import CampaignsPage from "./pages/CampaignsPage";
import BotsPage from "./pages/BotsPage";
import ContentPage from "./pages/ContentPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ScenariosPage from "./pages/ScenariosPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={
                <ErrorBoundary componentName="Dashboard">
                  <Dashboard />
                </ErrorBoundary>
              } />
              <Route path="/campaigns" element={
                <ErrorBoundary componentName="Campaigns">
                  <CampaignsPage />
                </ErrorBoundary>
              } />
              <Route path="/bots" element={
                <ErrorBoundary componentName="Bots">
                  <BotsPage />
                </ErrorBoundary>
              } />
              <Route path="/content" element={
                <ErrorBoundary componentName="Content">
                  <ContentPage />
                </ErrorBoundary>
              } />
              <Route path="/analytics" element={
                <ErrorBoundary componentName="Analytics">
                  <AnalyticsPage />
                </ErrorBoundary>
              } />
              <Route path="/scenarios" element={
                <ErrorBoundary componentName="Scenarios">
                  <ScenariosPage />
                </ErrorBoundary>
              } />
              <Route path="/settings" element={
                <ErrorBoundary componentName="Settings">
                  <SettingsPage />
                </ErrorBoundary>
              } />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
