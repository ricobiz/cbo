
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ContentIntegrationService } from "@/services/ContentIntegrationService";

interface CampaignIntegratorProps {
  contentType: 'text' | 'image' | 'audio';
  content: string;
  mediaUrl?: string;
  platform: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CampaignIntegrator({
  contentType,
  content,
  mediaUrl,
  platform,
  isOpen,
  onClose
}: CampaignIntegratorProps) {
  const [campaigns, setCampaigns] = useState<Array<{
    id: string;
    name: string;
    platform: string;
    type: string;
  }>>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load campaigns on component mount
  useEffect(() => {
    if (isOpen) {
      loadCampaigns();
    }
  }, [isOpen]);

  const loadCampaigns = () => {
    try {
      const activeCampaigns = ContentIntegrationService.getActiveCampaignsForContent();
      setCampaigns(activeCampaigns);
      
      if (activeCampaigns.length > 0) {
        setSelectedCampaignId(activeCampaigns[0].id);
      }
    } catch (error) {
      console.error("Error loading campaigns:", error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить список кампаний.",
        variant: "destructive"
      });
    }
  };

  const handleAddToCompaign = () => {
    if (!selectedCampaignId) {
      toast({
        title: "Выберите кампанию",
        description: "Пожалуйста, выберите кампанию для добавления контента.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      let result;
      
      if (contentType === 'text') {
        result = ContentIntegrationService.addTextContentToCampaign(
          selectedCampaignId,
          content,
          platform,
          "post"
        );
      } else if (contentType === 'image' && mediaUrl) {
        result = ContentIntegrationService.addImageContentToCampaign(
          selectedCampaignId,
          mediaUrl,
          platform,
          content
        );
      } else if (contentType === 'audio' && mediaUrl) {
        result = ContentIntegrationService.addAudioContentToCampaign(
          selectedCampaignId,
          mediaUrl,
          platform,
          content
        );
      }
      
      if (result) {
        toast({
          title: "Контент добавлен",
          description: `${contentType === 'text' ? 'Текст' : contentType === 'image' ? 'Изображение' : 'Аудио'} успешно добавлен в кампанию.`
        });
        onClose();
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось добавить контент в кампанию.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error adding content to campaign:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при добавлении контента в кампанию.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить в кампанию</DialogTitle>
          <DialogDescription>
            Выберите активную кампанию для добавления {contentType === 'text' ? 'текста' : contentType === 'image' ? 'изображения' : 'аудио'}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {campaigns.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Нет активных кампаний</p>
              <p className="text-sm text-muted-foreground mt-1">
                Создайте новую кампанию в разделе "Кампании"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="campaign" className="text-right">
                Кампания
              </Label>
              <div className="col-span-3">
                <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
                  <SelectTrigger id="campaign">
                    <SelectValue placeholder="Выберите кампанию" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map(campaign => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {contentType === 'text' && (
            <div className="border rounded-md p-3 mt-2">
              <div className="text-sm font-medium mb-1">Предпросмотр контента:</div>
              <p className="text-sm text-muted-foreground max-h-24 overflow-y-auto">
                {content.length > 200 ? content.substring(0, 200) + '...' : content}
              </p>
            </div>
          )}
          
          {contentType === 'image' && mediaUrl && (
            <div className="border rounded-md p-3 mt-2">
              <div className="text-sm font-medium mb-1">Предпросмотр изображения:</div>
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                <img src={mediaUrl} alt="Preview" className="w-full h-full object-contain" />
              </div>
            </div>
          )}
          
          {contentType === 'audio' && mediaUrl && (
            <div className="border rounded-md p-3 mt-2">
              <div className="text-sm font-medium mb-1">Предпросмотр аудио:</div>
              <audio controls className="w-full">
                <source src={mediaUrl} type="audio/mpeg" />
                Ваш браузер не поддерживает аудио элемент.
              </audio>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleAddToCompaign} disabled={isLoading || campaigns.length === 0}>
            {isLoading ? "Добавление..." : "Добавить в кампанию"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
