import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Onboarding from "@/pages/onboarding";
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
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "wouter";

function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType<any>, [x: string]: any }) {
  const { user, loading } = useAuth();
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);
  
  // Show nothing while checking authentication
  if (loading) return null;
  
  // If we have a user, render the component
  return user ? <Component {...rest} /> : null;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/pre-onboarding" component={PreOnboarding} />
      <Route path="/design-tokens" component={DesignTokens} />
      <Route path="/holidays-demo" component={HolidaysDemo} />
      
      {/* Dashboard route */}
      <Route path="/">
        {window.location.pathname === '/' && <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
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
      
      {/* Onboarding */}
      <Route path="/onboarding">
        <ProtectedRoute component={Onboarding} />
      </Route>
      
      {/* Legacy routes */}
      <Route path="/reports">
        <ProtectedRoute component={Reports} />
      </Route>
      
      {/* 404 route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
