
import React from "react";
import { ProxySettings } from "@/components/settings/ProxySettings";
import { useToast } from "@/components/ui/use-toast";

const ProxyPage = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Proxy settings saved",
      description: "Your proxy settings have been updated successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Proxy Management</h1>
      </div>

      <ProxySettings onSave={handleSave} />
    </div>
  );
};

export default ProxyPage;
