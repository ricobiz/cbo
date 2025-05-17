
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SecuritySettingsProps {
  onSave: () => void;
}

export const SecuritySettings = ({ onSave }: SecuritySettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage security preferences for your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="2fa">Two-Factor Authentication</Label>
          <div className="flex items-center gap-4">
            <Switch id="2fa" />
            <span className="text-sm text-muted-foreground">Status: Disabled</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Change Password</Label>
          <Button variant="outline" className="w-full" id="password">
            Change Password
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sessions">Active Sessions</Label>
          <Card className="border">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Current Session</p>
                  <p className="text-sm text-muted-foreground">Chrome • Windows • Last active now</p>
                </div>
                <Badge variant="outline">Current</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 flex justify-end pt-2">
        <Button onClick={onSave}>Save Security Settings</Button>
      </CardFooter>
    </Card>
  );
};
