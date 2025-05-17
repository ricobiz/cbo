
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface BillingSettingsProps {
  onSave?: () => void;
}

export const BillingSettings = ({ onSave }: BillingSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Information</CardTitle>
        <CardDescription>Manage your subscription and billing details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Current Plan: Free Trial</h3>
              <p className="text-sm text-muted-foreground">10 campaigns, 5 active bots, basic analytics</p>
            </div>
            <Button>Upgrade to Pro</Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Card className="border">
            <CardContent className="p-4">
              <p className="text-center text-muted-foreground">No payment method on file</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-2">
          <Label>Billing History</Label>
          <div className="text-center p-4 border rounded-lg text-muted-foreground">
            No billing history available
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 flex justify-end pt-2">
        <Button variant="outline">Add Payment Method</Button>
      </CardFooter>
    </Card>
  );
};
