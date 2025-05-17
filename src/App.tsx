
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Index";
import ContentPage from "./pages/ContentPage";
import SettingsPage from "./pages/SettingsPage";
import AccountsPage from "./pages/AccountsPage";
import BotsPage from "./pages/BotsPage";
import CampaignsPage from "./pages/CampaignsPage";
import CommandPage from "./pages/CommandPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BillingPage from "./pages/BillingPage";
import EmailAccountsPage from "./pages/EmailAccountsPage";
import ProxyPage from "./pages/ProxyPage";
import ScenariosPage from "./pages/ScenariosPage";
import NotFound from "./pages/NotFound";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme/ThemeToggle";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="content" element={<ContentPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="bots" element={<BotsPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="command" element={<CommandPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="email-accounts" element={<EmailAccountsPage />} />
            <Route path="proxy" element={<ProxyPage />} />
            <Route path="scenarios" element={<ScenariosPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
