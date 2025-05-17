
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export interface CampaignDetailsProps {
  campaign: any;
  onBack: () => void;
}

export const CampaignDetails = ({ campaign, onBack }: CampaignDetailsProps) => {
  if (!campaign) {
    return (
      <div className="text-center py-12">
        <p>Campaign not found</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>
      </div>
      <div className="grid gap-6">
        <h1 className="text-3xl font-bold">{campaign.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Campaign details would go here */}
            <p>{campaign.description}</p>
          </div>
          <div className="space-y-6">
            {/* Stats and secondary information */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Campaign Stats</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Platform</p>
                  <p className="font-medium">{campaign.platform}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{campaign.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">${campaign.budget}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Spent</p>
                  <p className="font-medium">${campaign.spent}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
