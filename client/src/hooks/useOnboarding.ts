import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { EmployeeOnboarding, OnboardingStep } from "@shared/schema";

interface OnboardingResponse {
  steps: (EmployeeOnboarding & { step: OnboardingStep })[];
  progress: number;
}

export function useOnboarding() {
  const { toast } = useToast();
  
  // Get onboarding steps and progress
  const { data, isLoading, isError } = useQuery<OnboardingResponse>({
    queryKey: ["/api/onboarding"],
  });
  
  // Update onboarding step status
  const { mutate: updateStepStatus, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await apiRequest("PUT", `/api/onboarding/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding"] });
      toast({
        title: "Progress updated",
        description: "Your onboarding progress has been updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update onboarding progress",
        variant: "destructive",
      });
    },
  });
  
  return {
    onboardingSteps: data?.steps || [],
    progress: data?.progress || 0,
    isLoading,
    isError,
    updateStepStatus,
    isUpdating,
  };
}
