
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/store/LanguageStore";

interface BillingSettingsProps {
  onSave?: () => void;
}

export const BillingSettings = ({ onSave }: BillingSettingsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const handleUpgradeToPro = () => {
    toast({
      title: t('proUpgradeInitiated') || "Upgrading to Pro",
      description: t('redirectingToPayment') || "Redirecting to payment page...",
    });
    navigate("/billing");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('billingInformation') || "Billing Information"}</CardTitle>
        <CardDescription>{t('manageSubscription') || "Manage your subscription and billing details"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{t('currentPlan') || "Current Plan"}: {t('freeTrial') || "Free Trial"}</h3>
              <p className="text-sm text-muted-foreground">{t('freeTrialFeatures') || "10 campaigns, 5 active bots, basic analytics"}</p>
            </div>
            <Button onClick={handleUpgradeToPro} className="bg-primary hover:bg-primary/90">
              {t('upgradeToPro') || "Upgrade to Pro"}
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>{t('paymentMethod') || "Payment Method"}</Label>
          <Card className="border">
            <CardContent className="p-4">
              <p className="text-center text-muted-foreground">{t('noPaymentMethod') || "No payment method on file"}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-2">
          <Label>{t('billingHistory') || "Billing History"}</Label>
          <div className="text-center p-4 border rounded-lg text-muted-foreground">
            {t('noBillingHistory') || "No billing history available"}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 flex justify-end pt-2">
        <Button variant="outline" onClick={() => toast({
          title: t('addingPaymentMethod') || "Adding Payment Method",
          description: t('featureComingSoon') || "This feature will be available soon."
        })}>
          {t('addPaymentMethod') || "Add Payment Method"}
        </Button>
      </CardFooter>
    </Card>
  );
};
