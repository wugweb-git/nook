import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CalendarIcon, Info } from "lucide-react";
import { format, getMonth, getYear, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getHolidaysForMonth, Holiday } from "@/data/holidays";

interface HolidayCalendarProps {
  className?: string;
}

export function HolidayCalendar({ className }: HolidayCalendarProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Get current month and year
  const month = getMonth(currentMonth);
  const year = getYear(currentMonth);
  
  // Get holidays for the current month
  const holidays = getHolidaysForMonth(year, month);
  
  // Function to highlight holiday dates
  const isHoliday = (date: Date): Holiday | undefined => {
    return holidays.find(holiday => isSameDay(holiday.date, date));
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };
  
  // Navigate to current month
  const goToToday = () => {
    const today = new Date();
    setDate(today);
    setCurrentMonth(today);
  };
  
  // Get all dates in the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
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

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Holiday Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              {format(currentMonth, "MMMM yyyy")}
            </div>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
          </div>
        </div>
        <CardDescription>
          View all North Indian holidays and plan your work schedule.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          <div className="md:col-span-5">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                if (newDate) setDate(newDate);
              }}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border"
              modifiersClassNames={{
                holiday: "bg-red-50 text-red-600 font-medium",
                national: "bg-red-50 text-red-600 font-medium",
                regional: "bg-amber-50 text-amber-600 font-medium",
                optional: "bg-blue-50 text-blue-600 font-medium",
              }}
              modifiers={{
                holiday: daysInMonth.filter(day => isHoliday(day) !== undefined),
                national: daysInMonth.filter(day => {
                  const holiday = isHoliday(day);
                  return holiday && holiday.type === 'national';
                }),
                regional: daysInMonth.filter(day => {
                  const holiday = isHoliday(day);
                  return holiday && holiday.type === 'regional';
                }),
                optional: daysInMonth.filter(day => {
                  const holiday = isHoliday(day);
                  return holiday && holiday.type === 'optional';
                }),
              }}
              componentProps={{
                day: (props) => {
                  const holiday = isHoliday(props.date);
                  return {
                    ...props,
                    title: holiday ? holiday.name : undefined,
                  };
                },
              }}
            />
          </div>
          <div className="md:col-span-2">
            <h3 className="font-medium text-lg mb-3 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Holidays This Month
            </h3>
            
            {holidays.length > 0 ? (
              <div className="space-y-3">
                {holidays.map((holiday) => (
                  <div key={holiday.id} className="rounded-md border p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{holiday.name}</h4>
                        <div className="text-sm text-neutral-medium">{format(holiday.date, "EEEE, MMMM d")}</div>
                      </div>
                      <Badge variant={getHolidayBadgeVariant(holiday.type)}>
                        {holiday.type}
                      </Badge>
                    </div>
                    {holiday.description && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="mt-2 h-8 p-0">
                              <Info className="h-4 w-4 mr-1" />
                              <span className="text-xs">Info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{holiday.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-neutral-medium">
                No holidays in {format(currentMonth, "MMMM yyyy")}
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Legend</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Badge variant="default">National</Badge>
                  <span className="ml-2 text-sm">Nationwide holidays</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="secondary">Regional</Badge>
                  <span className="ml-2 text-sm">North India specific</span>
                </div>
                <div className="flex items-center">
                  <Badge variant="outline">Optional</Badge>
                  <span className="ml-2 text-sm">Restricted holidays</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}