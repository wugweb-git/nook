import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockData = [
  { name: "Completed", value: 65 },
  { name: "In Progress", value: 25 },
  { name: "Not Started", value: 10 },
];

const COLORS = ["hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--muted))"];

interface ProjectCompletionChartProps {
  title?: string;
  timeframe?: "weekly" | "monthly" | "quarterly" | "yearly";
}

export default function ProjectCompletionChart({ 
  title = "Project Completion", 
  timeframe = "quarterly"
}: ProjectCompletionChartProps) {
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
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
