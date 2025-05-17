
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Моковые данные пользователей
const initialUsers = [
  { id: "u1", name: "Александр Петров", email: "alex@example.com", plan: "professional", status: "active", joined: "2025-04-10" },
  { id: "u2", name: "Елена Смирнова", email: "elena@example.com", plan: "basic", status: "active", joined: "2025-04-12" },
  { id: "u3", name: "Иван Соколов", email: "ivan@example.com", plan: "enterprise", status: "active", joined: "2025-04-15" },
  { id: "u4", name: "Мария Иванова", email: "maria@example.com", plan: "basic", status: "suspended", joined: "2025-04-05" },
  { id: "u5", name: "Сергей Козлов", email: "sergey@example.com", plan: "professional", status: "active", joined: "2025-04-18" }
];

export function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Фильтрация пользователей
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlan = planFilter === "all" || user.plan === planFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesPlan && matchesStatus;
  });
  
  const handleChangeStatus = (userId: string, newStatus: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus as any } : user
    ));
    
    toast({
      title: "Статус изменен",
      description: `Статус пользователя изменен на "${newStatus}".`
    });
  };
  
  const handleChangePlan = (userId: string, newPlan: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, plan: newPlan } : user
    ));
    
    toast({
      title: "План изменен",
      description: `План пользователя изменен на "${newPlan}".`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Управление пользователями</CardTitle>
          <CardDescription>Просмотр и управление аккаунтами пользователей</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input 
              placeholder="Поиск по имени или email" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-1/3"
            />
            
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="Фильтр по плану" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все планы</SelectItem>
                <SelectItem value="basic">Базовый</SelectItem>
                <SelectItem value="professional">Профессиональный</SelectItem>
                <SelectItem value="enterprise">Корпоративный</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="Фильтр по статусу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="active">Активные</SelectItem>
                <SelectItem value="suspended">Приостановлены</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y">
              <thead className="bg-muted">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    План
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Статус
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Дата регистрации
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y">
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Select 
                        defaultValue={user.plan} 
                        onValueChange={(value) => handleChangePlan(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Базовый</SelectItem>
                          <SelectItem value="professional">Профессиональный</SelectItem>
                          <SelectItem value="enterprise">Корпоративный</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Select 
                        defaultValue={user.status} 
                        onValueChange={(value) => handleChangeStatus(user.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Активный</SelectItem>
                          <SelectItem value="suspended">Приостановлен</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(user.joined).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button variant="ghost" size="sm">Подробнее</Button>
                    </td>
                  </tr>
                ))}
                
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                      Пользователи не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Всего пользователей: {users.length}, отображено: {filteredUsers.length}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
