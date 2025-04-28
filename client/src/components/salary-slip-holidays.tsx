import { format } from "date-fns";
import { getSalarySlipHolidays } from "@/data/holidays";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";

interface SalarySlipHolidaysProps {
  year: number;
  month: number; // 0-indexed (January = 0)
  className?: string;
  variant?: "standalone" | "embedded";
}

export function SalarySlipHolidays({ year, month, className, variant = "standalone" }: SalarySlipHolidaysProps) {
  const holidays = getSalarySlipHolidays(year, month);
  
  // Get badge variant based on holiday type
  const getHolidayBadgeVariant = (type: 'national' | 'regional' | 'optional') => {
    switch (type) {
      case 'national':
        return 'default';
      case 'regional':
        return 'secondary';
      case 'optional':
        return 'outline';
      default:
        return 'default';
    }
  };
  
  const content = (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Holiday</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holidays.length > 0 ? (
          holidays.map((holiday) => (
            <TableRow key={holiday.id}>
              <TableCell className="font-medium">
                {format(holiday.date, "MMM d, yyyy")}
              </TableCell>
              <TableCell>{holiday.name}</TableCell>
              <TableCell>
                <Badge variant={getHolidayBadgeVariant(holiday.type)}>
                  {holiday.type}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-4 text-neutral-medium">
              No holidays for {format(new Date(year, month), "MMMM yyyy")}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
  
  if (variant === "embedded") {
    return (
      <div className={className}>
        <div className="font-medium text-md mb-2 flex items-center">
          <CalendarIcon className="h-4 w-4 mr-1" />
          Holidays - {format(new Date(year, month), "MMMM yyyy")}
        </div>
        {content}
      </div>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Holidays - {format(new Date(year, month), "MMMM yyyy")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}