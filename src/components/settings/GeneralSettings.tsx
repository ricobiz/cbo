
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface GeneralSettingsProps {
  onSave: () => void;
}

export const GeneralSettings = ({ onSave }: GeneralSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Manage your account settings and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Display Name</Label>
          <Input id="name" defaultValue="Admin User" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" defaultValue="admin@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">Time Zone</Label>
          <Select defaultValue="utc">
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Select a timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
              <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
              <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
              <SelectItem value="cet">CET (Central European Time)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Email Notifications</Label>
            <div className="text-sm text-muted-foreground">Receive email updates about your campaigns</div>
          </div>
          <Switch id="notifications" />
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 flex justify-end pt-2">
        <Button onClick={onSave}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};
