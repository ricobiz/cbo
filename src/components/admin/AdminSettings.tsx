
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AdminSettings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  const handleSaveSettings = () => {
    toast({
      title: "Настройки сохранены",
      description: "Изменения успешно применены."
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="payment">Платежи</TabsTrigger>
          <TabsTrigger value="email">Уведомления</TabsTrigger>
          <TabsTrigger value="api">API и интеграции</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Общие настройки</CardTitle>
              <CardDescription>
                Основная конфигурация платформы
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Название платформы</Label>
                <Input id="platform-name" defaultValue="AI Bot Manager" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="support-email">Email поддержки</Label>
                <Input id="support-email" type="email" defaultValue="support@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="homepage-text">Текст для главной страницы</Label>
                <Textarea 
                  id="homepage-text"
                  rows={4}
                  defaultValue="Добро пожаловать в систему управления ботами и кампаниями. Создавайте, управляйте и анализируйте ваши кампании в одном месте."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Часовой пояс по умолчанию</Label>
                  <Select defaultValue="europe-moscow">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Выберите часовой пояс" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe-moscow">Москва (UTC+3)</SelectItem>
                      <SelectItem value="europe-london">Лондон (UTC+0)</SelectItem>
                      <SelectItem value="america-new_york">Нью-Йорк (UTC-5)</SelectItem>
                      <SelectItem value="asia-tokyo">Токио (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Язык по умолчанию</Label>
                  <Select defaultValue="ru">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Выберите язык" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Включить функции</Label>
                
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-analytics">Аналитика</Label>
                    <Switch id="enable-analytics" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-bots">Боты</Label>
                    <Switch id="enable-bots" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-scenarios">Сценарии</Label>
                    <Switch id="enable-scenarios" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-content-gen">Генерация контента</Label>
                    <Switch id="enable-content-gen" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Сохранить настройки</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Настройки платежей и подписок</CardTitle>
              <CardDescription>
                Конфигурация платежных шлюзов и правил подписок
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Активные платежные шлюзы</Label>
                
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-stripe">Stripe</Label>
                    <Switch id="enable-stripe" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-paypal">PayPal</Label>
                    <Switch id="enable-paypal" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-crypto">Криптовалюты</Label>
                    <Switch id="enable-crypto" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Настройки подписок</Label>
                
                <div className="space-y-4 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trial-period">Период пробной версии (дней)</Label>
                      <Input id="trial-period" type="number" defaultValue="14" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="grace-period">Льготный период (дней)</Label>
                      <Input id="grace-period" type="number" defaultValue="3" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-renew">Автоматическое продление подписок</Label>
                      <Switch id="auto-renew" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="downgrade-immediate">Немедленное понижение тарифа</Label>
                      <Switch id="downgrade-immediate" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="prorate-upgrades">Пропорциональный расчет при повышении</Label>
                      <Switch id="prorate-upgrades" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Валюты</Label>
                
                <div className="space-y-2 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-currency">Основная валюта</Label>
                      <Select defaultValue="rub">
                        <SelectTrigger id="default-currency">
                          <SelectValue placeholder="Выберите валюту" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rub">Российский рубль (₽)</SelectItem>
                          <SelectItem value="usd">US Dollar ($)</SelectItem>
                          <SelectItem value="eur">Euro (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="additional-currencies">Дополнительные валюты</Label>
                      <Input id="additional-currencies" placeholder="USD, EUR" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Сохранить настройки</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Настройки уведомлений</CardTitle>
              <CardDescription>
                Конфигурация уведомлений для пользователей и администраторов
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Шаблоны email-уведомлений</Label>
                
                <div className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="welcome-email">Приветственное письмо</Label>
                    <Textarea 
                      id="welcome-email"
                      rows={4}
                      defaultValue="Добро пожаловать в наш сервис, {{user_name}}! Мы рады, что вы присоединились к нам."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payment-success">Успешная оплата</Label>
                    <Textarea 
                      id="payment-success"
                      rows={4}
                      defaultValue="Спасибо за оплату, {{user_name}}! Ваш платеж на сумму {{amount}} {{currency}} успешно обработан."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subscription-reminder">Напоминание о подписке</Label>
                    <Textarea 
                      id="subscription-reminder"
                      rows={4}
                      defaultValue="{{user_name}}, ваша подписка {{plan_name}} истекает через {{days_left}} дней. Не забудьте продлить ее, чтобы сохранить доступ ко всем функциям."
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Настройки отправки</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="email-from">Email отправителя</Label>
                    <Input id="email-from" defaultValue="no-reply@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-name">Имя отправителя</Label>
                    <Input id="email-name" defaultValue="AI Bot Manager" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Уведомления для администраторов</Label>
                
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="admin-new-user">Новая регистрация</Label>
                    <Switch id="admin-new-user" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="admin-new-payment">Новый платеж</Label>
                    <Switch id="admin-new-payment" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="admin-subscription-cancel">Отмена подписки</Label>
                    <Switch id="admin-subscription-cancel" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="admin-api-limits">Превышение лимитов API</Label>
                    <Switch id="admin-api-limits" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Сохранить настройки</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>Настройки API и интеграций</CardTitle>
              <CardDescription>
                Управление внешними API и интеграциями сервисов
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Настройки API</Label>
                
                <div className="space-y-4 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-rate-limit">Ограничение запросов (в минуту)</Label>
                      <Input id="api-rate-limit" type="number" defaultValue="60" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="api-timeout">Тайм-аут (секунды)</Label>
                      <Input id="api-timeout" type="number" defaultValue="30" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="api-cache">Кэширование API-ответов</Label>
                      <Switch id="api-cache" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="api-logs">Расширенное логирование API</Label>
                      <Switch id="api-logs" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Интеграции</Label>
                
                <div className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
                    <Input id="openrouter-key" type="password" defaultValue="sk_1234567890" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="browseruse-key">BrowserUse API Key</Label>
                    <Input id="browseruse-key" type="password" defaultValue="bru_1234567890" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="verification-key">Verification Service API Key</Label>
                    <Input id="verification-key" type="password" defaultValue="vs_1234567890" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Внешние сервисы</Label>
                
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-google">Google Analytics</Label>
                    <Switch id="enable-google" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-sentry">Sentry Error Tracking</Label>
                    <Switch id="enable-sentry" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-intercom">Intercom Customer Chat</Label>
                    <Switch id="enable-intercom" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Сохранить настройки</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
