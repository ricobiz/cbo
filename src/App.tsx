import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Index from './pages/Index';
import ContentPage from './pages/ContentPage';
import CampaignsPage from './pages/CampaignsPage';
import BotsPage from "./pages/BotsPage";
import ScenariosPage from "./pages/ScenariosPage";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Главная</Link>
            </li>
            <li>
              <Link to="/content">Контент</Link>
            </li>
            <li>
              <Link to="/campaigns">Кампании</Link>
            </li>
             <li>
              <Link to="/bots">Боты</Link>
            </li>
            <li>
              <Link to="/scenarios">Сценарии</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/content" element={<ContentPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/bots" element={<BotsPage />} />
          <Route path="/scenarios" element={<ScenariosPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
