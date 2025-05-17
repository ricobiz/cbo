
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Edit, Trash, Check } from "lucide-react";

// Моковые данные для подписок
const initialPlans = [
  {
    id: "basic",
    name: "Базовый",
    monthlyPrice: 19,
    yearlyPrice: 190,
    features: [
      { id: "f1", name: "10 ботов", included: true },
      { id: "f2", name: "5 кампаний одновременно", included: true },
      { id: "f3", name: "Базовая генерация контента", included: true },
      { id: "f4", name: "Стандартные сценарии", included: true },
      { id: "f5", name: "Базовая поддержка", included: true },
      { id: "f6", name: "Продвинутая аналитика", included: false },
      { id: "f7", name: "Приоритетная поддержка", included: false },
      { id: "f8", name: "Расширенные сценарии", included: false },
    ]
  },
  {
    id: "professional",
    name: "Профессиональный",
    monthlyPrice: 49,
    yearlyPrice: 490,
    features: [
      { id: "f1", name: "25 ботов", included: true },
      { id: "f2", name: "15 кампаний одновременно", included: true },
      { id: "f3", name: "Продвинутая генерация контента", included: true },
      { id: "f4", name: "Расширенные сценарии", included: true },
      { id: "f5", name: "Базовая поддержка", included: true },
      { id: "f6", name: "Продвинутая аналитика", included: true },
      { id: "f7", name: "Приоритетная поддержка", included: false },
      { id: "f8", name: "Белый лейбл", included: false },
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Корпоративный",
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      { id: "f1", name: "Неограниченное число ботов", included: true },
      { id: "f2", name: "Неограниченное число кампаний", included: true },
      { id: "f3", name: "Премиум генерация контента", included: true },
      { id: "f4", name: "Расширенные сценарии", included: true },
      { id: "f5", name: "Базовая поддержка", included: true },
      { id: "f6", name: "Продвинутая аналитика", included: true },
      { id: "f7", name: "Приоритетная поддержка", included: true },
      { id: "f8", name: "Белый лейбл", included: true },
    ]
  }
];

export function AdminSubscriptionPlans() {
  const { toast } = useToast();
  const [plans, setPlans] = useState(initialPlans);
  const [activeTab, setActiveTab] = useState("plans");
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [newFeature, setNewFeature] = useState("");
  
  // Управление планами
  const handleSavePlan = () => {
    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? editingPlan : p));
      setEditingPlan(null);
      toast({
        title: "План обновлен",
        description: `План "${editingPlan.name}" успешно обновлен.`
      });
    }
  };
  
  const handleAddPlan = () => {
    const newPlan = {
      id: `plan-${Date.now()}`,
      name: "Новый план",
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        { id: `f-${Date.now()}-1`, name: "Базовый функционал", included: true },
      ]
    };
    setPlans([...plans, newPlan]);
    setEditingPlan(newPlan);
    toast({
      title: "План добавлен",
      description: "Новый план подписки добавлен. Настройте его параметры."
    });
  };
  
  const handleDeletePlan = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
    if (editingPlan?.id === id) setEditingPlan(null);
    toast({
      title: "План удален",
      description: "План подписки был успешно удален."
    });
  };
  
  const handleAddFeature = () => {
    if (!newFeature || !editingPlan) return;
    
    const feature = {
      id: `f-${Date.now()}`,
      name: newFeature,
      included: false
    };
    
    setEditingPlan({
      ...editingPlan,
      features: [...editingPlan.features, feature]
    });
    
    setNewFeature("");
  };
  
  const handleToggleFeature = (featureId: string) => {
    setEditingPlan({
      ...editingPlan,
      features: editingPlan.features.map((f: any) => 
        f.id === featureId ? { ...f, included: !f.included } : f
      )
    });
  };
  
  const handleChangeFeatureName = (featureId: string, name: string) => {
    setEditingPlan({
      ...editingPlan,
      features: editingPlan.features.map((f: any) => 
        f.id === featureId ? { ...f, name } : f
      )
    });
  };
  
  const handleDeleteFeature = (featureId: string) => {
    setEditingPlan({
      ...editingPlan,
      features: editingPlan.features.filter((f: any) => f.id !== featureId)
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="plans">Управление планами</TabsTrigger>
          <TabsTrigger value="features">Настройка функций</TabsTrigger>
          <TabsTrigger value="pricing">Ценообразование</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Планы подписок</h2>
            <Button onClick={handleAddPlan}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Добавить план
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map(plan => (
              <Card key={plan.id} className={plan.popular ? "border-primary" : ""}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.monthlyPrice}₽/мес или {plan.yearlyPrice}₽/год
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.slice(0, 4).map(feature => (
                      <li key={feature.id} className="flex items-center">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <Trash className="h-4 w-4 text-muted-foreground mr-2" />
                        )}
                        <span>{feature.name}</span>
                      </li>
                    ))}
                    {plan.features.length > 4 && <li>...еще {plan.features.length - 4}</li>}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingPlan(plan)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Изменить
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeletePlan(plan.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Удалить
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <h2 className="text-2xl font-bold">Управление функциями в подписках</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Выберите план</CardTitle>
                  <CardDescription>Выберите план для редактирования его функций</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {plans.map(plan => (
                    <Button 
                      key={plan.id} 
                      variant={editingPlan?.id === plan.id ? "default" : "outline"}
                      className="w-full justify-start mb-2"
                      onClick={() => setEditingPlan(plan)}
                    >
                      {plan.name}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              {editingPlan ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Редактирование плана: {editingPlan.name}</CardTitle>
                    <CardDescription>Настройте функции и цены для этого плана</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="plan-name">Название плана</Label>
                        <Input 
                          id="plan-name" 
                          value={editingPlan.name} 
                          onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="plan-popular">Популярный план</Label>
                        <div className="flex items-center pt-2">
                          <Switch 
                            id="plan-popular" 
                            checked={editingPlan.popular || false} 
                            onCheckedChange={(checked) => setEditingPlan({...editingPlan, popular: checked})} 
                          />
                          <span className="ml-2">
                            {editingPlan.popular ? "Да" : "Нет"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="monthly-price">Ежемесячная цена (₽)</Label>
                        <Input 
                          id="monthly-price" 
                          type="number" 
                          value={editingPlan.monthlyPrice} 
                          onChange={(e) => setEditingPlan({...editingPlan, monthlyPrice: Number(e.target.value)})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearly-price">Годовая цена (₽)</Label>
                        <Input 
                          id="yearly-price" 
                          type="number" 
                          value={editingPlan.yearlyPrice} 
                          onChange={(e) => setEditingPlan({...editingPlan, yearlyPrice: Number(e.target.value)})} 
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Label className="mb-2 block">Функции плана</Label>
                      
                      <div className="space-y-4">
                        {editingPlan.features.map((feature: any) => (
                          <div key={feature.id} className="flex items-center justify-between border p-3 rounded-md">
                            <div className="flex items-center space-x-4 flex-grow">
                              <Switch 
                                checked={feature.included} 
                                onCheckedChange={() => handleToggleFeature(feature.id)} 
                              />
                              <Input 
                                value={feature.name} 
                                onChange={(e) => handleChangeFeatureName(feature.id, e.target.value)} 
                              />
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteFeature(feature.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-4">
                        <Input 
                          placeholder="Новая функция..." 
                          value={newFeature} 
                          onChange={(e) => setNewFeature(e.target.value)} 
                          onKeyDown={(e) => e.key === "Enter" && handleAddFeature()}
                        />
                        <Button onClick={handleAddFeature}>Добавить</Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSavePlan}>Сохранить изменения</Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-10 text-center text-muted-foreground">
                    Выберите план для редактирования его функций
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pricing" className="space-y-6">
          <h2 className="text-2xl font-bold">Настройки ценообразования</h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Глобальные правила ценообразования</CardTitle>
              <CardDescription>Настройте правила для всех планов</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearly-discount">Скидка за годовую подписку (%)</Label>
                  <Input id="yearly-discount" type="number" defaultValue="17" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="trial-days">Дней пробного периода</Label>
                  <Input id="trial-days" type="number" defaultValue="14" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Дополнительные настройки</Label>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="trial-cc-required" />
                    <Label htmlFor="trial-cc-required">Требовать карту для пробного периода</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="allow-coupon" defaultChecked />
                    <Label htmlFor="allow-coupon">Разрешить промокоды</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-invoice" defaultChecked />
                    <Label htmlFor="auto-invoice">Автоматическая генерация счетов</Label>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-medium mb-4">Расценки за использование API</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-base-price">Базовая цена (за 1000 запросов)</Label>
                      <Input id="api-base-price" type="number" defaultValue="10" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="api-enterprise-price">Корпоративная цена (за 1000)</Label>
                      <Input id="api-enterprise-price" type="number" defaultValue="8" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="api-volume-discount">Скидка за объем (%)</Label>
                      <Input id="api-volume-discount" type="number" defaultValue="5" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-limit-basic">Лимит API для Базового плана</Label>
                      <Input id="api-limit-basic" type="number" defaultValue="10000" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="api-limit-premium">Лимит API для Профессионального</Label>
                      <Input id="api-limit-premium" type="number" defaultValue="25000" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast({
                title: "Настройки сохранены",
                description: "Глобальные настройки ценообразования обновлены."
              })}>
                Сохранить настройки
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
