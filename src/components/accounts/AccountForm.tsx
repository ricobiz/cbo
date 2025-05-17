
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Globe, Key, Lock, Plus, User } from "lucide-react";

const formSchema = z.object({
  platform: z.string({ required_error: "Платформа должна быть выбрана" }),
  username: z.string().min(2, { message: "Имя пользователя должно содержать минимум 2 символа" }),
  password: z.string().min(6, { message: "Пароль должен содержать минимум 6 символов" }),
  url: z.string().url({ message: "Введите корректный URL" }).optional().or(z.literal("")),
  apiKey: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface AccountFormProps {
  onAccountAdded?: (account: FormValues) => void;
  onCancel?: () => void;
  existingAccount?: FormValues;
}

export function AccountForm({ onAccountAdded, onCancel, existingAccount }: AccountFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: existingAccount || {
      platform: "",
      username: "",
      password: "",
      url: "",
      apiKey: "",
    },
  });
  
  const onSubmit = (values: FormValues) => {
    toast({
      title: existingAccount ? "Аккаунт обновлен" : "Аккаунт добавлен",
      description: `${values.platform}: ${values.username}`,
    });
    
    if (onAccountAdded) {
      onAccountAdded(values);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{existingAccount ? "Редактировать аккаунт" : "Добавить новый аккаунт"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Платформа</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите платформу" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="vk">ВКонтакте</SelectItem>
                      <SelectItem value="telegram">Telegram</SelectItem>
                      <SelectItem value="spotify">Spotify</SelectItem>
                      <SelectItem value="soundcloud">SoundCloud</SelectItem>
                      <SelectItem value="twitch">Twitch</SelectItem>
                      <SelectItem value="pinterest">Pinterest</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="other">Другая платформа</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логин / Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        <User className="h-4 w-4" />
                      </span>
                      <Input {...field} className="pl-10" placeholder="Введите логин или email" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </span>
                      <Input 
                        {...field} 
                        type={showPassword ? "text" : "password"} 
                        className="pl-10 pr-10" 
                        placeholder="Введите пароль" 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute inset-y-0 right-0 px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL аккаунта (опционально)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        <Globe className="h-4 w-4" />
                      </span>
                      <Input 
                        {...field} 
                        className="pl-10" 
                        placeholder="https://platform.com/account" 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Ссылка на страницу аккаунта для автоматического взаимодействия
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API ключ (опционально)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        <Key className="h-4 w-4" />
                      </span>
                      <Input 
                        {...field} 
                        className="pl-10" 
                        placeholder="Введите API ключ, если требуется" 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    API ключ для платформ, которые используют API для автоматизации
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Отмена
                </Button>
              )}
              <Button type="submit">
                {existingAccount ? "Сохранить" : "Добавить аккаунт"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
