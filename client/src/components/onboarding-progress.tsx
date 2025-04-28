import { useOnboarding } from "@/hooks/useOnboarding";
import { CheckIcon, ClockIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface OnboardingProgressProps {
  minimal?: boolean;
}

export default function OnboardingProgress({ minimal = false }: OnboardingProgressProps) {
  const { onboardingSteps, progress, isLoading, updateStepStatus, isUpdating } = useOnboarding();
  
  const handleUpdateStatus = (id: number, currentStatus: string) => {
    let newStatus: string;
    
    if (currentStatus === "not_started") {
      newStatus = "in_progress";
    } else if (currentStatus === "in_progress") {
      newStatus = "completed";
    } else {
      return; // Already completed, do nothing
    }
    
    updateStepStatus({ id, status: newStatus });
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-24" />
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2.5 w-full" />
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start">
              <Skeleton className="w-6 h-6 rounded-full mr-3" />
              <div className="flex-1">
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-heading font-medium text-lg">Onboarding Progress</h4>
        {minimal && (
          <a href="/onboarding" className="text-primary text-sm font-medium hover:underline">View Details</a>
        )}
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Completion Status</span>
          <span className="text-sm font-medium text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="w-full h-2.5" />
      </div>
      
      <div className="space-y-4">
        {onboardingSteps.map((record) => (
          <div key={record.id} className="flex items-start">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
              record.status === "completed" 
                ? "bg-success text-white" 
                : record.status === "in_progress" 
                  ? "bg-warning text-white" 
                  : "bg-neutral-light text-neutral-medium"
            }`}>
              {record.status === "completed" ? (
                <CheckIcon className="w-4 h-4" />
              ) : record.status === "in_progress" ? (
                <ClockIcon className="w-4 h-4" />
              ) : (
                <span className="text-xs font-medium">{record.step.order}</span>
              )}
            </div>
            <div className="flex-1">
              <h5 className={`font-medium ${record.status === "not_started" ? "text-neutral-medium" : ""}`}>
                {record.step.name}
              </h5>
              <p className="text-sm text-neutral-medium">
                {record.status === "completed" && record.completedAt
                  ? `Completed on ${formatDate(record.completedAt)}`
                  : record.status === "in_progress"
                  ? "In progress"
                  : "Not started"}
              </p>
              
              {!minimal && (
                <div className="mt-2">
                  {record.status !== "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(record.id, record.status)}
                      disabled={isUpdating}
                    >
                      {record.status === "not_started" ? "Start" : "Complete"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
