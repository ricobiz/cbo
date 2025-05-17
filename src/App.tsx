
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Index from "./pages/Index";
import BotsPage from "./pages/BotsPage";
import CampaignsPage from "./pages/CampaignsPage";
import ContentPage from "./pages/ContentPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import ScenariosPage from "./pages/ScenariosPage";
import NotFound from "./pages/NotFound";
import CommandPage from "./pages/CommandPage";
import EmailAccountsPage from "./pages/EmailAccountsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "bots",
        element: <BotsPage />,
      },
      {
        path: "campaigns",
        element: <CampaignsPage />,
      },
      {
        path: "content",
        element: <ContentPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "scenarios",
        element: <ScenariosPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "command",
        element: <CommandPage />,
      },
      {
        path: "email-accounts",
        element: <EmailAccountsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
