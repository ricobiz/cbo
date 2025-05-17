
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { getActivePlatforms } from "@/constants/platforms";

// Схема валидации для формы создания кампании
const campaignSchema = z.object({
  title: z.string().min(3, { message: "Название должно содержать минимум 3 символа" }),
  platform: z.string({ required_error: "Выберите платформу" }),
  type: z.string({ required_error: "Выберите тип кампании" }),
  startDate: z.string({ required_error: "Выберите дату начала" }),
  endDate: z.string({ required_error: "Выберите дату окончания" }),
});

// Типы для формы создания кампании
type CampaignFormValues = z.infer<typeof campaignSchema>;

interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCampaign: (campaign: CampaignFormValues) => void;
}

export function CreateCampaignDialog({
  open,
  onOpenChange,
  onCreateCampaign
}: CreateCampaignDialogProps) {
  const { toast } = useToast();
  const activePlatforms = getActivePlatforms();
  
  // Настройка формы с использованием react-hook-form и zod для валидации
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: "",
      platform: "",
      type: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    },
  });

  // Обработчик отправки формы
  const onSubmit = (data: CampaignFormValues) => {
    onCreateCampaign(data);
    form.reset();
    onOpenChange(false);
    toast({
      title: "Кампания создана",
      description: `Кампания "${data.title}" успешно создана.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создание новой кампании</DialogTitle>
          <DialogDescription>
            Заполните информацию о новой кампании. Все поля обязательны для заполнения.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название кампании</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите название кампании" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Платформа</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите платформу" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activePlatforms.map(platform => (
                          <SelectItem key={platform.id} value={platform.id}>
                            <div className="flex items-center gap-2">
                              <platform.icon className="h-4 w-4" />
                              <span>{platform.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип кампании</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="promotion">Продвижение</SelectItem>
                        <SelectItem value="growth">Рост аудитории</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дата начала</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дата окончания</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type="submit">Создать кампанию</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
