
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, AreaChart, PieChart, LineChart, Bar, Area, Pie, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Моковые данные для графиков
const revenueData = [
  { name: 'Янв', revenue: 4000, users: 24 },
  { name: 'Фев', revenue: 3000, users: 13 },
  { name: 'Мар', revenue: 2000, users: 8 },
  { name: 'Апр', revenue: 2780, users: 19 },
  { name: 'Май', revenue: 1890, users: 12 },
  { name: 'Июн', revenue: 2390, users: 15 },
  { name: 'Июл', revenue: 3490, users: 21 },
];

const planDistributionData = [
  { name: 'Базовый', value: 540 },
  { name: 'Профессиональный', value: 320 },
  { name: 'Корпоративный', value: 110 },
];

const apiUsageData = [
  { name: 'Пн', usage: 4000 },
  { name: 'Вт', usage: 3000 },
  { name: 'Ср', usage: 2000 },
  { name: 'Чт', usage: 2780 },
  { name: 'Пт', usage: 1890 },
  { name: 'Сб', usage: 2390 },
  { name: 'Вс', usage: 3490 },
];

export function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Аналитика</h2>
        <Select defaultValue="30days">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Период" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Последние 7 дней</SelectItem>
            <SelectItem value="30days">Последние 30 дней</SelectItem>
            <SelectItem value="3months">3 месяца</SelectItem>
            <SelectItem value="year">Год</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-4">
            <CardDescription>Общий доход</CardDescription>
            <CardTitle className="text-2xl">₽147,290</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-green-500 text-sm">+12.5% с прошлого месяца</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardDescription>Активные подписки</CardDescription>
            <CardTitle className="text-2xl">970</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-green-500 text-sm">+24 новых за месяц</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardDescription>Использование API</CardDescription>
            <CardTitle className="text-2xl">1.4M</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-amber-500 text-sm">+18.3% с прошлого месяца</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardDescription>Упущенная выручка</CardDescription>
            <CardTitle className="text-2xl">₽12,500</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-red-500 text-sm">Отмены подписок</span>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="revenue">
        <TabsList className="mb-4">
          <TabsTrigger value="revenue">Доход</TabsTrigger>
          <TabsTrigger value="subscription">Подписки</TabsTrigger>
          <TabsTrigger value="usage">Использование API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Доход и новые пользователи</CardTitle>
              <CardDescription>Динамика дохода и притока новых пользователей</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Доход (₽)" />
                  <Bar yAxisId="right" dataKey="users" fill="#82ca9d" name="Новые пользователи" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Распределение планов</CardTitle>
                <CardDescription>Количество пользователей по планам подписки</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {planDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Удержание подписок</CardTitle>
                <CardDescription>Процент сохранения подписок по месяцам</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: '1', retention: 100 },
                      { month: '2', retention: 85 },
                      { month: '3', retention: 76 },
                      { month: '4', retention: 70 },
                      { month: '5', retention: 65 },
                      { month: '6', retention: 62 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" label={{ value: 'Месяц', position: 'insideBottomRight', offset: -10 }} />
                    <YAxis label={{ value: 'Удержание %', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="retention" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Использование API</CardTitle>
              <CardDescription>Количество API-запросов в течение времени</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={apiUsageData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="usage" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
