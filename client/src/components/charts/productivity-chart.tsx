import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductivityDataPoint {
  name: string;
  productivity: number;
  average: number;
}

const mockData: ProductivityDataPoint[] = [
  { name: "Jan", productivity: 78, average: 70 },
  { name: "Feb", productivity: 75, average: 71 },
  { name: "Mar", productivity: 82, average: 72 },
  { name: "Apr", productivity: 85, average: 73 },
  { name: "May", productivity: 80, average: 74 },
  { name: "Jun", productivity: 87, average: 75 },
];

interface ProductivityChartProps {
  title?: string;
  timeframe?: "weekly" | "monthly" | "quarterly" | "yearly";
}

export default function ProductivityChart({ 
  title = "Productivity Trends", 
  timeframe = "monthly"
}: ProductivityChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  
  // In a real app, this would fetch different data based on the timeframe
  const chartData = mockData;
  
  return (
    <div className="bg-neutral-lightest p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h5 className="font-medium">{title}</h5>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-neutral-medium hover:text-primary focus:outline-none">
              <MoreVerticalIcon className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Chart Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSelectedTimeframe("weekly")}>
              Weekly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedTimeframe("monthly")}>
              Monthly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedTimeframe("quarterly")}>
              Quarterly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedTimeframe("yearly")}>
              Yearly
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Download Chart</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="productivity"
              stroke="hsl(var(--primary))"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="average" stroke="hsl(var(--muted-foreground))" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
