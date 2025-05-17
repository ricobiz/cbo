
import { useEffect } from "react";
import { CommandCenter } from "@/components/command/CommandCenter";
import { CommandExamples } from "@/components/command/CommandExamples";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CommandPage = () => {
  useEffect(() => {
    document.title = "AI Command Center";
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Command Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <CommandCenter />
        </div>
        
        <div className="md:col-span-1 space-y-6">
          <CommandExamples />
        </div>
      </div>
    </div>
  );
};

export default CommandPage;
