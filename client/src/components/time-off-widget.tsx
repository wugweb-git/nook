import { useQuery } from "@tanstack/react-query";
import { TimeOffBalance } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { calculatePercentage } from "@/lib/utils";

export default function TimeOffWidget() {
  const { data: timeOff, isLoading } = useQuery<TimeOffBalance>({
    queryKey: ["/api/time-off"],
  });
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-36" />
        </div>
        
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-2 w-full mb-1" />
              <div className="flex justify-between mt-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!timeOff) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h4 className="font-heading font-medium mb-4">Time Off Balance</h4>
        <div className="text-center py-6 text-neutral-medium">
          <p>No time off data available</p>
        </div>
      </div>
    );
  }
  
  const vacationRemaining = timeOff.vacationTotal - timeOff.vacationUsed;
  const sickRemaining = timeOff.sickTotal - timeOff.sickUsed;
  const personalRemaining = timeOff.personalTotal - timeOff.personalUsed;
  
  const vacationPercentage = calculatePercentage(vacationRemaining, timeOff.vacationTotal);
  const sickPercentage = calculatePercentage(sickRemaining, timeOff.sickTotal);
  const personalPercentage = calculatePercentage(personalRemaining, timeOff.personalTotal);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-heading font-medium">Time Off Balance</h4>
        <Button variant="ghost" size="sm" className="text-primary text-sm font-medium hover:underline">
          Request Time Off
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Vacation Days</span>
            <span className="text-sm font-medium">{vacationRemaining} days</span>
          </div>
          <Progress 
            value={vacationPercentage} 
            className="w-full h-2 bg-neutral-light"
            indicatorClassName="bg-success" 
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-neutral-medium">Used: {timeOff.vacationUsed} days</span>
            <span className="text-xs text-neutral-medium">Total: {timeOff.vacationTotal} days</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Sick Leave</span>
            <span className="text-sm font-medium">{sickRemaining} days</span>
          </div>
          <Progress 
            value={sickPercentage} 
            className="w-full h-2 bg-neutral-light"
            indicatorClassName="bg-primary" 
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-neutral-medium">Used: {timeOff.sickUsed} days</span>
            <span className="text-xs text-neutral-medium">Total: {timeOff.sickTotal} days</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Personal Days</span>
            <span className="text-sm font-medium">{personalRemaining} days</span>
          </div>
          <Progress 
            value={personalPercentage} 
            className="w-full h-2 bg-neutral-light"
            indicatorClassName="bg-warning" 
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-neutral-medium">Used: {timeOff.personalUsed} days</span>
            <span className="text-xs text-neutral-medium">Total: {timeOff.personalTotal} days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
