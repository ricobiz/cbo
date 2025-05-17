
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PlanProps {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: "month" | "year";
  features: PlanFeature[];
  popular?: boolean;
  onSelectPlan: (planId: string) => void;
}

function PlanCard({ id, name, description, price, billingPeriod, features, popular, onSelectPlan }: PlanProps) {
  return (
    <Card className={popular ? "border-primary" : ""}>
      {popular && (
        <div className="absolute top-0 right-0 -mt-2 -mr-2">
          <Badge variant="default">Популярный</Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-muted-foreground">/{billingPeriod === "month" ? "мес" : "год"}</span>
        </div>
        
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              {feature.included ? (
                <Check className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground mr-2" />
              )}
              <span className={feature.included ? "" : "text-muted-foreground"}>{feature.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={popular ? "default" : "outline"}
          onClick={() => onSelectPlan(id)}
        >
          Выбрать план
        </Button>
      </CardFooter>
    </Card>
  );
}

export function SubscriptionPlans() {
  const { toast } = useToast();
  const [billingPeriod, setBillingPeriod] = React.useState<"month" | "year">("month");
  
  const handleSelectPlan = (planId: string) => {
    toast({
      title: "План выбран",
      description: `Вы выбрали план ${planId}. Переход к оплате...`,
    });
    
    // Here you would redirect to checkout or payment page
    // window.location.href = `/checkout?plan=${planId}`;
  };
  
  const plans = [
    {
      id: "basic",
      name: "Базовый",
      description: "Для начинающих пользователей",
      price: billingPeriod === "month" ? 19 : 190,
      features: [
        { name: "10 ботов", included: true },
        { name: "5 кампаний одновременно", included: true },
        { name: "Базовая генерация контента", included: true },
        { name: "Стандартные сценарии", included: true },
        { name: "Базовая поддержка", included: true },
        { name: "Продвинутая аналитика", included: false },
        { name: "Приоритетная поддержка", included: false },
        { name: "Расширенные сценарии", included: false },
      ]
    },
    {
      id: "professional",
      name: "Профессиональный",
      description: "Для бизнес-пользователей",
      price: billingPeriod === "month" ? 49 : 490,
      features: [
        { name: "25 ботов", included: true },
        { name: "15 кампаний одновременно", included: true },
        { name: "Продвинутая генерация контента", included: true },
        { name: "Расширенные сценарии", included: true },
        { name: "Базовая поддержка", included: true },
        { name: "Продвинутая аналитика", included: true },
        { name: "Приоритетная поддержка", included: false },
        { name: "Белый лейбл", included: false },
      ],
      popular: true
    },
    {
      id: "enterprise",
      name: "Корпоративный",
      description: "Для крупных организаций",
      price: billingPeriod === "month" ? 99 : 990,
      features: [
        { name: "Неограниченное число ботов", included: true },
        { name: "Неограниченное число кампаний", included: true },
        { name: "Премиум генерация контента", included: true },
        { name: "Расширенные сценарии", included: true },
        { name: "Базовая поддержка", included: true },
        { name: "Продвинутая аналитика", included: true },
        { name: "Приоритетная поддержка", included: true },
        { name: "Белый лейбл", included: true },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="inline-flex rounded-md border p-1">
          <Button
            variant={billingPeriod === "month" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBillingPeriod("month")}
          >
            Ежемесячно
          </Button>
          <Button
            variant={billingPeriod === "year" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBillingPeriod("year")}
          >
            Ежегодно <Badge variant="outline" className="ml-2">-17%</Badge>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            {...plan}
            billingPeriod={billingPeriod}
            onSelectPlan={handleSelectPlan}
          />
        ))}
      </div>
    </div>
  );
}
