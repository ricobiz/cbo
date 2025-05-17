
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/store/LanguageStore";

interface GeneralSettingsProps {
  onSave: () => void;
}

export const GeneralSettings = ({ onSave }: GeneralSettingsProps) => {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('general')}</CardTitle>
        <CardDescription>Управление настройками учетной записи и предпочтениями</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Отображаемое имя</Label>
          <Input id="name" defaultValue="Admin User" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue="admin@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">Часовой пояс</Label>
          <Select defaultValue="utc">
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Выберите часовой пояс" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utc">UTC (Всемирное координированное время)</SelectItem>
              <SelectItem value="est">EST (Восточное стандартное время)</SelectItem>
              <SelectItem value="pst">PST (Тихоокеанское стандартное время)</SelectItem>
              <SelectItem value="cet">CET (Центрально-европейское время)</SelectItem>
              <SelectItem value="msk">MSK (Московское время)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Email-уведомления</Label>
            <div className="text-sm text-muted-foreground">Получать email-обновления о ваших кампаниях</div>
          </div>
          <Switch id="notifications" />
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 flex justify-end pt-2">
        <Button onClick={onSave}>{t('settingsSaved')}</Button>
      </CardFooter>
    </Card>
  );
};
