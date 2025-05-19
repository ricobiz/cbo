
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { CampaignIntegrator } from "../integration/CampaignIntegrator";
import { TextGeneratorForm } from "./text-generator/TextGeneratorForm";
import { ApiStatusAlert } from "./text-generator/ApiStatusAlert";
import { GenerationHistory } from "./text-generator/GenerationHistory";
import { useTextGenerator } from "./text-generator/useTextGenerator";

export function TextGenerator() {
  const {
    platform,
    setPlatform,
    topic,
    setTopic,
    content,
    setContent,
    contentType,
    setContentType,
    tone,
    setTone,
    isLoading,
    generationHistory,
    apiStatus,
    isIntegratorOpen,
    setIsIntegratorOpen,
    generateContent,
    loadFromHistory
  } = useTextGenerator();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-secondary" />
              Генератор текстового контента ИИ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ApiStatusAlert apiStatus={apiStatus} />
            
            <TextGeneratorForm 
              platform={platform}
              setPlatform={setPlatform}
              topic={topic}
              setTopic={setTopic}
              content={content}
              setContent={setContent}
              contentType={contentType}
              setContentType={setContentType}
              tone={tone}
              setTone={setTone}
              generateContent={generateContent}
              isLoading={isLoading}
              apiStatus={apiStatus}
              onIntegrateContent={() => setIsIntegratorOpen(true)}
            />
          </CardContent>
          <CardFooter>
            {/* CardFooter is now empty as buttons moved to TextGeneratorForm */}
          </CardFooter>
        </Card>
      </div>
      
      <div>
        <GenerationHistory 
          history={generationHistory}
          onSelectItem={loadFromHistory}
        />
      </div>

      {/* Campaign Integration Dialog */}
      <CampaignIntegrator
        contentType="text"
        content={content}
        platform={platform}
        isOpen={isIntegratorOpen}
        onClose={() => setIsIntegratorOpen(false)}
      />
    </div>
  );
}
