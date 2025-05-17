
import { DollarSign, BarChart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CostBreakdownProps {
  period?: "day" | "week" | "month" | "quarter";
}

export function CostBreakdown({ period = "month" }: CostBreakdownProps) {
  // Cost breakdown by service
  const serviceCostData = [
    { name: "OpenRouter API", value: 24.45, color: "#4f46e5" },
    { name: "Browser Use API", value: 17.73, color: "#10b981" },
  ];

  // Cost breakdown by action type
  const actionCostData = [
    { name: "Content Generation", value: 11.82, color: "#f59e0b" },
    { name: "Bot Deployment", value: 16.34, color: "#3b82f6" },
    { name: "Verification", value: 8.72, color: "#ec4899" },
    { name: "Other", value: 5.3, color: "#8b5cf6" },
  ];

  // Cost breakdown by campaign
  const campaignCostData = [
    { name: "Spotify Summer Track", value: 18.36, color: "#1DB954", id: "1" },
    { name: "YouTube Product Review", value: 15.83, color: "#FF0000", id: "2" },
    { name: "Twitter Growth Campaign", value: 7.99, color: "#1DA1F2", id: "3" },
  ];

  // Transaction history
  const transactions = [
    { date: "2025-05-17", description: "OpenRouter API - Content Generation", amount: -3.42 },
    { date: "2025-05-16", description: "Browser Use API - Bot Deployment (3 sessions)", amount: -4.85 },
    { date: "2025-05-15", description: "OpenRouter API - Command Analysis", amount: -2.15 },
    { date: "2025-05-14", description: "Browser Use API - Verification", amount: -3.20 },
    { date: "2025-05-13", description: "OpenRouter API - Content Generation", amount: -2.98 },
    { date: "2025-05-10", description: "Monthly Service Fee", amount: -9.99 },
    { date: "2025-05-01", description: "Account Credit", amount: 50.00 },
  ];

  // Calculate totals
  const totalCost = serviceCostData.reduce((sum, item) => sum + item.value, 0);
  
  // COLORS
  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6"];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cost By Service</CardTitle>
          <CardDescription>Breakdown of costs by API service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceCostData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceCostData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <div className="text-3xl font-bold flex items-center">
                <DollarSign className="h-6 w-6 text-muted-foreground mr-1" />
                {totalCost.toFixed(2)}
              </div>
              <p className="text-muted-foreground">Total estimated cost for {period}</p>
              
              <div className="space-y-2">
                {serviceCostData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                      <span>{item.name}</span>
                    </div>
                    <div className="font-medium">${item.value.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cost By Action Type</CardTitle>
            <CardDescription>Breakdown of costs by operation type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={actionCostData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {actionCostData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Cost By Campaign</CardTitle>
            <CardDescription>Breakdown of costs by campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={campaignCostData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {campaignCostData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent charges and credits to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={`text-right ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    ${Math.abs(transaction.amount).toFixed(2)} {transaction.amount < 0 ? '' : 'CR'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
