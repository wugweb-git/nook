import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { PageTransition } from "@/components/ui/page-transition";

export function OnboardingProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: React.ComponentType<any>;
}) {
  const { user, loading } = useAuth();
  
  // Get the user's onboarding status
  const { data: onboardingStatus, isLoading: onboardingLoading } = useQuery({
    queryKey: ["/api/onboarding"],
    enabled: !!user,
  });

  // Check if user is still loading
  if (loading || onboardingLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        </div>
      </Route>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/login" />
      </Route>
    );
  }

  // Check if employee has completed onboarding or is a pre-boarded user
  const skipOnboarding = user.email === "vedanshu@wugweb.com";
  const onboardingComplete = skipOnboarding || (onboardingStatus && (onboardingStatus as any).progress === 100);
                          
  if (!onboardingComplete) {
    return (
      <Route path={path}>
        <Redirect to="/employee-onboarding" />
      </Route>
    );
  }

  // If passed all checks, render the component with page transition
  // This ensures the sidebar menu is preserved
  return (
    <Route path={path}>
      <PageTransition>
        <Component />
      </PageTransition>
    </Route>
  );
}