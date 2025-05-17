
import React from 'react';
import { Route, Routes } from "react-router-dom";
import BotsList from './Bots/BotsList';
import BotDetail from './Bots/BotDetail';
import CreateBot from './Bots/CreateBot';

const BotsPage = () => {
  return (
    <Routes>
      <Route index element={<BotsList />} />
      <Route path="create" element={<CreateBot />} />
      <Route path=":id" element={<BotDetail />} />
      <Route path=":id/edit" element={<CreateBot />} />
    </Routes>
  );
};

export default BotsPage;
