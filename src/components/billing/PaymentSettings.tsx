
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Wallet, DollarSign } from "lucide-react";

export function PaymentSettings() {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("gateways");
  const [stripeEnabled, setStripeEnabled] = useState(true);
  const [paypalEnabled, setPaypalEnabled] = useState(true);
  const [cryptoEnabled, setCryptoEnabled] = useState(false);
  
  const [stripeKey, setStripeKey] = useState("sk_test_**********************");
  const [stripePublishableKey, setStripePublishableKey] = useState("pk_test_**********************");
  const [paypalClientId, setPaypalClientId] = useState("AXj2h7Z2sJ7F2_XvjJ7sHC***************");
  const [paypalSecret, setPaypalSecret] = useState("EF5HFv_C9MNf***************");

  const handleSaveGateways = () => {
    toast({
      title: "Настройки сохранены",
      description: "Шлюзы оплаты успешно настроены."
    });
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="gateways">Платежные шлюзы</TabsTrigger>
        <TabsTrigger value="subscriptions">Подписки</TabsTrigger>
        <TabsTrigger value="transactions">Транзакции</TabsTrigger>
      </TabsList>
      
      <TabsContent value="gateways">
        <Card>
          <CardHeader>
            <CardTitle>Настройка платежных шлюзов</CardTitle>
            <CardDescription>
              Настройте платежные шлюзы для приема оплат от пользователей
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Stripe</h3>
                </div>
                <Switch 
                  checked={stripeEnabled} 
                  onCheckedChange={setStripeEnabled} 
                />
              </div>
              
              {stripeEnabled && (
                <div className="grid grid-cols-1 gap-4 pl-7">
                  <div className="space-y-2">
                    <Label htmlFor="stripe-key">Secret Key</Label>
                    <Input 
                      id="stripe-key" 
                      type="password" 
                      value={stripeKey} 
                      onChange={(e) => setStripeKey(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stripe-publishable-key">Publishable Key</Label>
                    <Input 
                      id="stripe-publishable-key" 
                      value={stripePublishableKey} 
                      onChange={(e) => setStripePublishableKey(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stripe-mode">Режим</Label>
                    <Select defaultValue="test">
                      <SelectTrigger id="stripe-mode">
                        <SelectValue placeholder="Выберите режим" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="test">Тестовый (Sandbox)</SelectItem>
                        <SelectItem value="live">Рабочий (Production)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">PayPal</h3>
                </div>
                <Switch 
                  checked={paypalEnabled} 
                  onCheckedChange={setPaypalEnabled} 
                />
              </div>
              
              {paypalEnabled && (
                <div className="grid grid-cols-1 gap-4 pl-7">
                  <div className="space-y-2">
                    <Label htmlFor="paypal-client-id">Client ID</Label>
                    <Input 
                      id="paypal-client-id" 
                      value={paypalClientId} 
                      onChange={(e) => setPaypalClientId(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paypal-secret">Client Secret</Label>
                    <Input 
                      id="paypal-secret" 
                      type="password" 
                      value={paypalSecret} 
                      onChange={(e) => setPaypalSecret(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paypal-mode">Режим</Label>
                    <Select defaultValue="sandbox">
                      <SelectTrigger id="paypal-mode">
                        <SelectValue placeholder="Выберите режим" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandbox">Тестовый (Sandbox)</SelectItem>
                        <SelectItem value="live">Рабочий (Production)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Криптовалюты</h3>
                </div>
                <Switch 
                  checked={cryptoEnabled} 
                  onCheckedChange={setCryptoEnabled} 
                />
              </div>
              
              {cryptoEnabled && (
                <div className="grid grid-cols-1 gap-4 pl-7">
                  <div className="space-y-2">
                    <Label htmlFor="crypto-provider">Провайдер</Label>
                    <Select defaultValue="coinbase">
                      <SelectTrigger id="crypto-provider">
                        <SelectValue placeholder="Выберите провайдера" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coinbase">Coinbase Commerce</SelectItem>
                        <SelectItem value="coinpayments">CoinPayments</SelectItem>
                        <SelectItem value="custom">Пользовательский</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="crypto-api-key">API Key</Label>
                    <Input 
                      id="crypto-api-key" 
                      type="password" 
                      placeholder="Введите API ключ" 
                    />
                  </div>
                  
                  <div className="space-y-2 flex items-center">
                    <Switch id="allow-btc" defaultChecked />
                    <Label htmlFor="allow-btc" className="ml-2">Bitcoin (BTC)</Label>
                  </div>
                  
                  <div className="space-y-2 flex items-center">
                    <Switch id="allow-eth" defaultChecked />
                    <Label htmlFor="allow-eth" className="ml-2">Ethereum (ETH)</Label>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveGateways} className="ml-auto">Сохранить настройки</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="subscriptions">
        <Card>
          <CardHeader>
            <CardTitle>Управление подписками</CardTitle>
            <CardDescription>
              Создавайте и управляйте подписками для пользователей
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-end">
              <Button>
                + Добавить план подписки
              </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y">
                <thead className="bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Название
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Цена
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Период
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Статус
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">Базовый план</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      $19.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Ежемесячно
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Активен
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm">Редактировать</Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">Профессиональный план</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      $49.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Ежемесячно
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Активен
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm">Редактировать</Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">Корпоративный план</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      $99.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Ежемесячно
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Активен
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm">Редактировать</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="transactions">
        <Card>
          <CardHeader>
            <CardTitle>История транзакций</CardTitle>
            <CardDescription>
              Просмотр всех транзакций и платежей
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y">
                <thead className="bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Пользователь
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Сумма
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Дата
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Статус
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      TX-12345
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      user@example.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      $49.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      2025-05-15 14:32
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Успешно
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm">Детали</Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      TX-12344
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      client@example.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      $99.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      2025-05-10 09:15
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Успешно
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm">Детали</Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      TX-12343
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      test@example.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      $19.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      2025-05-05 17:22
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Отклонено
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm">Детали</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
