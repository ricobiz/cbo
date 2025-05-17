
import React from 'react';
import { Route, Routes } from "react-router-dom";
import CampaignsList from './Campaigns/CampaignsList';
import CampaignDetail from './Campaigns/CampaignDetail';

const CampaignsPage = () => {
  return (
    <Routes>
      <Route index element={<CampaignsList />} />
      <Route path=":id" element={<CampaignDetail />} />
    </Routes>
  );
};

export default CampaignsPage;
