
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Check, Settings } from "lucide-react";

interface BotSettingsProps {
  onSave: () => void;
}

export const BotSettings = ({ onSave }: BotSettingsProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  
  // Новые состояния для параметров монетизации
  const [maxBotCount, setMaxBotCount] = useState<number>(100);
  const [costPerBot, setCostPerBot] = useState<number>(10);
  const [markupPercentage, setMarkupPercentage] = useState<number>(30);
  
  const handleSave = () => {
    toast({
      title: "Настройки сохранены",
      description: "Конфигурация ботов была успешно обновлена.",
    });
    onSave();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Конфигурация ботов</CardTitle>
        <CardDescription>Настройте поведение и ограничения ботов</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general">Основные настройки</TabsTrigger>
            <TabsTrigger value="email">Email конфигурация</TabsTrigger>
            <TabsTrigger value="monetization">Монетизация</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="concurrency">Макс. одновременных операций ботов</Label>
              <Select defaultValue="10">
                <SelectTrigger id="concurrency">
                  <SelectValue placeholder="Выберите максимум" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 операций</SelectItem>
                  <SelectItem value="10">10 операций</SelectItem>
                  <SelectItem value="25">25 операций</SelectItem>
                  <SelectItem value="50">50 операций</SelectItem>
                  <SelectItem value="100">100 операций</SelectItem>
                  <SelectItem value="unlimited">Без ограничений</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-bots">Максимальное количество ботов</Label>
              <Input 
                id="max-bots" 
                type="number" 
                value={maxBotCount}
                onChange={(e) => setMaxBotCount(parseInt(e.target.value))}
                min={1}
              />
              <p className="text-sm text-muted-foreground">Установите 0 для неограниченного количества</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delay">Задержка между действиями (мс)</Label>
              <Input id="delay" type="number" defaultValue="2000" />
              <p className="text-sm text-muted-foreground">Задержка между действиями для имитации человеческого поведения</p>
            </div>
            
            <div className="space-y-3">
              <Label>Интенсивность человекоподобного поведения</Label>
              <Slider defaultValue={[75]} max={100} step={1} className="py-4" />
              <div className="text-sm text-muted-foreground">Более высокие значения увеличивают случайность времени, движений мыши и паттернов прокрутки</div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rotation">Частота смены IP</Label>
              <Select defaultValue="60">
                <SelectTrigger id="rotation">
                  <SelectValue placeholder="Выберите частоту" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">Каждые 15 минут</SelectItem>
                  <SelectItem value="30">Каждые 30 минут</SelectItem>
                  <SelectItem value="60">Каждые 60 минут</SelectItem>
                  <SelectItem value="120">Каждые 2 часа</SelectItem>
                  <SelectItem value="240">Каждые 4 часа</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Как часто нужно менять IP-адреса для избежания обнаружения</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="proxy">Использовать ротацию прокси</Label>
                <div className="text-sm text-muted-foreground">Маршрутизировать трафик ботов через разные IP-адреса</div>
              </div>
              <Switch id="proxy" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="antiban">Защита от бана</Label>
                <div className="text-sm text-muted-foreground">Применять продвинутые техники обхода обнаружения</div>
              </div>
              <Switch id="antiban" defaultChecked />
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email-allocation">Распределение учетных записей email</Label>
              <Select defaultValue="dedicated">
                <SelectTrigger id="email-allocation">
                  <SelectValue placeholder="Выберите метод распределения" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dedicated">Выделенные для каждого бота</SelectItem>
                  <SelectItem value="shared">Общий пул</SelectItem>
                  <SelectItem value="rotating">Ротация аккаунтов</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Как учетные записи email назначаются ботам</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-actions">Частота действий по email</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="email-actions">
                  <SelectValue placeholder="Выберите частоту" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Низкая (мало действий в день)</SelectItem>
                  <SelectItem value="medium">Средняя (несколько действий в день)</SelectItem>
                  <SelectItem value="high">Высокая (много действий в день)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Как часто бот выполняет действия, используя учетные записи email</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-alerts">Оповещения о проблемах по email</Label>
                <div className="text-sm text-muted-foreground">Получать уведомления о блокировке аккаунтов или запросах верификации</div>
              </div>
              <Switch id="email-alerts" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-verification">Автоматическая обработка верификаций</Label>
                <div className="text-sm text-muted-foreground">Пытаться автоматически обрабатывать запросы на верификацию</div>
              </div>
              <Switch id="auto-verification" defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-rotation">Стратегия ротации email</Label>
              <Select defaultValue="periodic">
                <SelectTrigger id="email-rotation">
                  <SelectValue placeholder="Выберите стратегию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="periodic">Периодическая ротация</SelectItem>
                  <SelectItem value="activity">На основе уровня активности</SelectItem>
                  <SelectItem value="risk">Ротация на основе рисков</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Когда и как ротировать между доступными учетными записями email</p>
            </div>
          </TabsContent>
          
          <TabsContent value="monetization" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cost-per-bot">Базовая стоимость за бота ($/месяц)</Label>
              <Input 
                id="cost-per-bot" 
                type="number" 
                value={costPerBot}
                onChange={(e) => setCostPerBot(parseFloat(e.target.value))}
                min={0}
                step={0.01}
              />
              <p className="text-sm text-muted-foreground">Ваши затраты на поддержку одного бота</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="markup">Наценка для клиентов (%)</Label>
              <Input 
                id="markup" 
                type="number" 
                value={markupPercentage}
                onChange={(e) => setMarkupPercentage(parseFloat(e.target.value))}
                min={0}
                max={1000}
              />
              <p className="text-sm text-muted-foreground">Процент надбавки к базовой стоимости для клиентов</p>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Расчет стоимости для клиентов</h3>
              <div className="flex justify-between text-sm">
                <span>Базовая стоимость:</span>
                <span>${costPerBot.toFixed(2)}/месяц за бота</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Наценка ({markupPercentage}%):</span>
                <span>${(costPerBot * markupPercentage / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                <span>Итоговая стоимость для клиента:</span>
                <span>${(costPerBot + (costPerBot * markupPercentage / 100)).toFixed(2)}/месяц за бота</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Тарифные планы</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">Базовый</h4>
                  <p className="text-sm text-muted-foreground">До 5 ботов</p>
                  <div className="mt-2 text-sm">Множитель цены: 1x</div>
                </div>
                <div className="border rounded-lg p-4 bg-primary/5">
                  <h4 className="font-medium">Бизнес</h4>
                  <p className="text-sm text-muted-foreground">До 20 ботов</p>
                  <div className="mt-2 text-sm">Множитель цены: 0.9x</div>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">Корпоративный</h4>
                  <p className="text-sm text-muted-foreground">Неограниченное количество</p>
                  <div className="mt-2 text-sm">Множитель цены: 0.8x</div>
                </div>
              </div>
              <div className="flex justify-end mt-1">
                <Button variant="link" className="h-auto p-0" size="sm">
                  <Settings className="h-3.5 w-3.5 mr-1" />
                  Настроить тарифы
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 flex justify-end pt-2">
        <Button onClick={handleSave}>
          <Check className="mr-2 h-4 w-4" />
          Сохранить конфигурацию
        </Button>
      </CardFooter>
    </Card>
  );
};
