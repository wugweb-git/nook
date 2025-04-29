import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Onboarding from "@/pages/onboarding";
import EmployeeOnboarding from "@/pages/employee-onboarding";
import Documents from "@/pages/documents";
import Reports from "@/pages/reports";
import Profile from "@/pages/profile";
import SalarySlips from "@/pages/salary-slips";
import EmployeeDirectory from "@/pages/employee-directory";
import KnowledgeSharing from "@/pages/knowledge-sharing";
import BenefitsAdministration from "@/pages/benefits-administration";
import PreOnboarding from "@/pages/pre-onboarding";
import DocumentGenerator from "@/pages/document-generator";
import DesignTokens from "@/pages/design-tokens";
import HolidaysDemo from "@/pages/holidays-demo";
import EmployeeProfile from "@/pages/employee-profile";
import CompanyProfile from "@/pages/company-profile";
import KeyTasks from "@/pages/key-tasks";
import SettingsModern from "@/pages/settings-modern";
import DesignSystemDemo from "@/pages/design-system-demo";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { OnboardingProtectedRoute } from "@/lib/onboarding-protected-route";

function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType<any>, [x: string]: any }) {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!loading && !user) {
      setIsTransitioning(true);
      
      // Short delay before redirect for smoother transition
      const redirectTimer = setTimeout(() => {
        setLocation("/login");
      }, 150);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, loading, setLocation]);
  
  // Show loading spinner while checking authentication
  if (loading || isTransitioning) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <LoadingSpinner 
          size="xl" 
          color="yellow"
          className="mb-2"
        />
        <p className="text-sm text-neutral-600">
          {isTransitioning ? "Redirecting to login..." : "Loading your profile..."}
        </p>
      </div>
    );
  }
  
  // If we have a user, render the component with page transition
  return user ? (
    <PageTransition>
      <Component {...rest} />
    </PageTransition>
  ) : null;
}

function Router() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Switch>
          <Route path="/login">
            <PageTransition>
              <Login />
            </PageTransition>
          </Route>
          <Route path="/pre-onboarding">
            <PageTransition>
              <PreOnboarding />
            </PageTransition>
          </Route>
          <Route path="/design-tokens">
            <PageTransition>
              <DesignTokens />
            </PageTransition>
          </Route>
          <Route path="/holidays-demo">
            <PageTransition>
              <HolidaysDemo />
            </PageTransition>
          </Route>
          <Route path="/design-system-demo">
            <PageTransition>
              <DesignSystemDemo />
            </PageTransition>
          </Route>
          
          {/* Dashboard route - requires onboarding completion */}
          <Route path="/">
            {window.location.pathname === '/' && <OnboardingProtectedRoute path="/" component={Dashboard} />}
          </Route>
          <Route path="/dashboard">
            <OnboardingProtectedRoute path="/dashboard" component={Dashboard} />
          </Route>
          
          {/* User profile */}
          <Route path="/profile">
            <ProtectedRoute component={Profile} />
          </Route>
          
          {/* Employee profile with complete information */}
          <Route path="/employee-profile">
            <ProtectedRoute component={EmployeeProfile} />
          </Route>
          
          {/* Salary slips */}
          <Route path="/salary-slips">
            <ProtectedRoute component={SalarySlips} />
          </Route>
          
          {/* Document management routes */}
          <Route path="/documents">
            {window.location.pathname === '/documents' && <ProtectedRoute component={Documents} />}
          </Route>
          <Route path="/documents/id">
            <ProtectedRoute component={Documents} />
          </Route>
          <Route path="/documents/docs">
            <ProtectedRoute component={Documents} />
          </Route>
          <Route path="/documents/misc">
            <ProtectedRoute component={Documents} />
          </Route>
          
          {/* Document Generator */}
          <Route path="/document-generator">
            <ProtectedRoute component={DocumentGenerator} />
          </Route>
          
          {/* Employee directory */}
          <Route path="/employee-directory">
            <ProtectedRoute component={EmployeeDirectory} />
          </Route>
          
          {/* Knowledge sharing */}
          <Route path="/knowledge-sharing">
            <ProtectedRoute component={KnowledgeSharing} />
          </Route>
          
          {/* Benefits administration */}
          <Route path="/benefits-administration">
            <ProtectedRoute component={BenefitsAdministration} />
          </Route>
          
          {/* Company Profile */}
          <Route path="/company-profile">
            <ProtectedRoute component={CompanyProfile} />
          </Route>
          
          {/* Key Tasks */}
          <Route path="/key-tasks">
            <ProtectedRoute component={KeyTasks} />
          </Route>
          
          {/* Settings Pages */}
          <Route path="/settings">
            <ProtectedRoute component={SettingsModern} />
          </Route>
          
          {/* Self Service - Main page and Document Generator */}
          <Route path="/self-service">
            {window.location.pathname === '/self-service' && <ProtectedRoute component={DocumentGenerator} />}
          </Route>
          <Route path="/self-service/document-generator">
            <ProtectedRoute component={DocumentGenerator} />
          </Route>
          
          {/* Onboarding */}
          <Route path="/onboarding">
            <ProtectedRoute component={Onboarding} />
          </Route>

          {/* Employee Onboarding */}
          <Route path="/employee-onboarding">
            <PageTransition>
              <EmployeeOnboarding />
            </PageTransition>
          </Route>
          
          {/* Legacy routes */}
          <Route path="/reports">
            <ProtectedRoute component={Reports} />
          </Route>
          
          {/* 404 route */}
          <Route path="*">
            <PageTransition>
              <NotFound />
            </PageTransition>
          </Route>
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="app-container relative h-screen">
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
