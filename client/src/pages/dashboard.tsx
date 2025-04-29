import { useEffect } from "react";
import Layout from "@/components/layout";
import OnboardingProgress from "@/components/onboarding-progress";
import DocumentsWidget from "@/components/documents-widget";
import EventsWidget from "@/components/events-widget";
import TimeOffWidget from "@/components/time-off-widget";
import ProductivityChart from "@/components/charts/productivity-chart";
import ProjectCompletionChart from "@/components/charts/project-completion-chart";
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useRef } from "react";
import { formatDateTime } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ClipboardCheckIcon, 
  FileCheckIcon, 
  AlertCircleIcon, 
  InfoIcon, 
  BookmarkIcon,
  UserCheckIcon,
  LogOutIcon,
  HandshakeIcon,
  ArrowRightIcon,
  CheckIcon,
  UserCogIcon,
  UsersIcon,
  BarChart3Icon,
  BriefcaseIcon,
  Settings2Icon,
  FolderIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  SunIcon,
  MoonIcon,
  SunriseIcon
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { onboardingSteps, isLoading: isLoadingOnboarding } = useOnboarding();
  const [timePeriod, setTimePeriod] = useState("last-30-days");
  const [isAdminView, setIsAdminView] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentLocation, setCurrentLocation] = useState("Office");
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Determine employee status from user data
  // In a real application, this would be determined by various factors in the user profile
  // We'll simulate this by calculating status based on:
  // - joinDate: when they joined the company (if recent, they're a new employee)
  // - exitDate: if an exit date is set, they're an exiting employee
  // - default: they're a current employee
  
  // Helper function to check if the user is an admin
  const isUserAdmin = (): boolean => {
    if (!user) return false;
    
    // Example: If the user is "admin", they're an admin
    return user.username === 'admin' || user.role === 'admin';
  };
  
  // Handle admin view toggle
  useEffect(() => {
    if (isUserAdmin()) {
      // If user is admin, set admin view to true by default
      setIsAdminView(true);
    }
  }, [user]);
  
  // Get employee status based on user data
  const determineEmployeeStatus = (): 'new' | 'current' | 'exiting' => {
    if (!user) return 'current';
    
    // For demonstration, we'll use hardcoded logic
    // In a real app, this would come from the user's profile
    
    // Example: If the user is "emily", treat as new employee
    if (user.username === 'emily') return 'new';
    
    // All admins are also employees, but we'll default them to "current" status
    if (isUserAdmin()) return 'current';
    
    // Example: If certain properties exist (in a real app)
    // if (user.exitDate) return 'exiting';
    // if (daysSinceJoined < 30) return 'new';
    
    return 'current';
  };
  
  const employeeStatus = determineEmployeeStatus();

  if (!user) return null;

  const lastLoginTime = user.lastLogin ? formatDateTime(user.lastLogin) : "Unknown";

  // Render New Employee Dashboard
  const renderNewEmployeeDashboard = () => {
    return (
      <>
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Welcome to Staff Hub!</AlertTitle>
          <AlertDescription className="text-blue-700">
            We're excited to have you join our team. Please complete your onboarding tasks to get started.
          </AlertDescription>
        </Alert>
        
        {/* Onboarding Progress */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Onboarding Progress</CardTitle>
            <CardDescription>
              Complete these tasks to finish your onboarding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-medium text-sm">Overall Completion</span>
                  </div>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
              
              <div className="space-y-4">
                <OnboardingTask 
                  icon={<UserCheckIcon className="h-5 w-5" />}
                  title="Complete Your Profile" 
                  description="Fill in your personal and employment details"
                  status="completed"
                  link="/profile"
                />
                
                <OnboardingTask 
                  icon={<FileCheckIcon className="h-5 w-5" />}
                  title="Upload Required Documents" 
                  description="Submit identification and employment documents"
                  status="in-progress"
                  link="/onboarding"
                />
                
                <OnboardingTask 
                  icon={<ClipboardCheckIcon className="h-5 w-5" />}
                  title="Complete Training Modules" 
                  description="Review company policies and complete required training"
                  status="pending"
                  link="/knowledge-sharing"
                />
                
                <OnboardingTask 
                  icon={<BookmarkIcon className="h-5 w-5" />}
                  title="Set Up Benefits" 
                  description="Choose your health and retirement benefits"
                  status="pending"
                  link="/benefits-administration"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Company Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Company Events</CardTitle>
            <CardDescription>
              Join these events to get to know your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EventsWidget limit={3} />
          </CardContent>
        </Card>
      </>
    );
  };
  
  // Render Current Employee Dashboard
  const renderCurrentEmployeeDashboard = () => {
    return (
      <>
        {/* Widgets grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <DocumentsWidget />
          <EventsWidget />
          <TimeOffWidget />
        </div>
        
        {/* Customizable reporting dashboards */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Performance & Metrics</CardTitle>
                <CardDescription>Track your performance over time</CardDescription>
              </div>
              <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                <span className="text-sm text-neutral-medium">Time Period:</span>
                <Select value={timePeriod} onValueChange={setTimePeriod}>
                  <SelectTrigger className="text-sm border border-neutral-light rounded-md py-1 h-8 w-40">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="year-to-date">Year to Date</SelectItem>
                    <SelectItem value="custom-range">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProductivityChart 
                timeframe={
                  timePeriod === "last-30-days" ? "monthly" :
                  timePeriod === "last-quarter" ? "quarterly" :
                  timePeriod === "year-to-date" ? "yearly" : "monthly"
                }
              />
              <ProjectCompletionChart 
                timeframe={
                  timePeriod === "last-30-days" ? "monthly" :
                  timePeriod === "last-quarter" ? "quarterly" :
                  timePeriod === "year-to-date" ? "yearly" : "monthly"
                }
              />
            </div>
          </CardContent>
        </Card>
      </>
    );
  };
  
  // Render Admin Dashboard
  const renderAdminDashboard = () => {
    return (
      <>
        <Alert className="mb-6 bg-purple-50 border-purple-200">
          <UserCogIcon className="h-4 w-4 text-purple-600 mr-2" />
          <AlertTitle className="text-purple-800">Admin Dashboard</AlertTitle>
          <AlertDescription className="text-purple-700">
            Welcome to the admin dashboard. Manage users, monitor onboarding progress, and access reports.
          </AlertDescription>
        </Alert>
        
        {/* Admin Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <UsersIcon className="h-8 w-8 text-primary mr-4" />
                <div>
                  <p className="text-3xl font-bold">124</p>
                  <p className="text-xs text-neutral-medium">+3 this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Onboarding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <UserCheckIcon className="h-8 w-8 text-blue-500 mr-4" />
                <div>
                  <p className="text-3xl font-bold">12</p>
                  <p className="text-xs text-neutral-medium">Employees in progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BriefcaseIcon className="h-8 w-8 text-green-500 mr-4" />
                <div>
                  <p className="text-3xl font-bold">8</p>
                  <p className="text-xs text-neutral-medium">4 in final interviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Settings2Icon className="h-8 w-8 text-amber-500 mr-4" />
                <div>
                  <p className="text-3xl font-bold">5</p>
                  <p className="text-xs text-neutral-medium">2 require attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Onboarding Activity</CardTitle>
              <CardDescription>
                Monitor employee progress through the onboarding process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="font-medium">JS</span>
                    </div>
                    <div>
                      <h4 className="font-medium">John Smith</h4>
                      <p className="text-sm text-neutral-medium">Software Engineer</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">75% Complete</p>
                    <Progress value={75} className="h-2 w-24 mt-1" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="font-medium">AT</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Alicia Thomas</h4>
                      <p className="text-sm text-neutral-medium">Product Manager</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">40% Complete</p>
                    <Progress value={40} className="h-2 w-24 mt-1" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="font-medium">RJ</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Robert Johnson</h4>
                      <p className="text-sm text-neutral-medium">UX Designer</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">90% Complete</p>
                    <Progress value={90} className="h-2 w-24 mt-1" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Link href="/employee-directory">
                  <Button size="sm" className="flex items-center">
                    View All Employees
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Document Requests</CardTitle>
              <CardDescription>
                Recent document approval requests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-3 shadow-sm">
                <div className="flex items-center">
                  <FolderIcon className="h-5 w-5 text-amber-500 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium">Expense Policy Update</h4>
                    <p className="text-xs text-neutral-medium">Requires review and approval</p>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <Button size="sm" variant="outline" className="h-7 mr-2">Reject</Button>
                  <Button size="sm" className="h-7">Approve</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 shadow-sm">
                <div className="flex items-center">
                  <FolderIcon className="h-5 w-5 text-amber-500 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium">Benefits Update 2025</h4>
                    <p className="text-xs text-neutral-medium">Requires final approval</p>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <Button size="sm" variant="outline" className="h-7 mr-2">Reject</Button>
                  <Button size="sm" className="h-7">Approve</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-3 shadow-sm">
                <div className="flex items-center">
                  <FolderIcon className="h-5 w-5 text-amber-500 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium">New Employee Handbook</h4>
                    <p className="text-xs text-neutral-medium">Draft needs review</p>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <Button size="sm" variant="outline" className="h-7 mr-2">Reject</Button>
                  <Button size="sm" className="h-7">Approve</Button>
                </div>
              </div>
              
              <div className="mt-2 flex justify-end">
                <Link href="/documents">
                  <Button size="sm" variant="outline" className="flex items-center">
                    View All Requests
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  };
  
  // Render Exiting Employee Dashboard
  const renderExitingEmployeeDashboard = () => {
    return (
      <>
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <AlertCircleIcon className="h-4 w-4 text-amber-600 mr-2" />
          <AlertTitle className="text-amber-800">Exit Process In Progress</AlertTitle>
          <AlertDescription className="text-amber-700">
            Please complete your offboarding tasks before your last day on July 15, 2025.
          </AlertDescription>
        </Alert>
        
        {/* Exit Checklist */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Exit Checklist</CardTitle>
            <CardDescription>
              Complete these tasks before your last day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-medium text-sm">Offboarding Completion</span>
                  </div>
                  <span className="text-sm font-medium">33%</span>
                </div>
                <Progress value={33} className="h-2" />
              </div>
              
              <div className="space-y-4">
                <OnboardingTask 
                  icon={<HandshakeIcon className="h-5 w-5" />}
                  title="Complete Exit Interview" 
                  description="Schedule and complete your exit interview with HR"
                  status="completed"
                  link="#"
                />
                
                <OnboardingTask 
                  icon={<FileCheckIcon className="h-5 w-5" />}
                  title="Return Company Equipment" 
                  description="Return laptop, access cards, and other company property"
                  status="in-progress"
                  link="#"
                />
                
                <OnboardingTask 
                  icon={<ClipboardCheckIcon className="h-5 w-5" />}
                  title="Knowledge Transfer" 
                  description="Document your processes and train your replacement"
                  status="pending"
                  link="/knowledge-sharing"
                />
                
                <OnboardingTask 
                  icon={<LogOutIcon className="h-5 w-5" />}
                  title="Final Documentation" 
                  description="Sign final paperwork and receive information about benefits"
                  status="pending"
                  link="/documents"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Important Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Important Documents</CardTitle>
            <CardDescription>
              Documents you'll need after leaving
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentsWidget limit={5} />
          </CardContent>
        </Card>
      </>
    );
  };

  // Get day of the week
  const getDayOfWeek = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[currentTime.getDay()];
  };
  
  // Get time of day and appropriate icon
  const getTimeOfDay = () => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      return { greeting: 'Good morning', icon: <SunriseIcon className="h-4 w-4 text-amber-500" /> };
    } else if (hour < 18) {
      return { greeting: 'Good afternoon', icon: <SunIcon className="h-4 w-4 text-amber-500" /> };
    } else {
      return { greeting: 'Good evening', icon: <MoonIcon className="h-4 w-4 text-indigo-500" /> };
    }
  };
  
  // Get gender prefix
  const getGenderPrefix = () => {
    if (!user.gender) return '';
    
    switch(user.gender) {
      case 'male': return 'Mr.';
      case 'female': return 'Ms.';
      default: return '';
    }
  };
  
  const { greeting, icon } = getTimeOfDay();
  const prefix = getGenderPrefix();
  const dayOfWeek = getDayOfWeek();
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Layout title="Dashboard">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-heading font-medium flex items-center gap-2">
                {icon} {greeting}, {prefix ? `${prefix} ` : ''}{user.firstName}!
              </h3>
              <div className="flex items-center text-sm text-neutral-medium mt-1 gap-3">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5 opacity-70" /> 
                  <span>It's {dayOfWeek}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-3.5 w-3.5 opacity-70" /> 
                  <span>{formattedTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-3.5 w-3.5 opacity-70" /> 
                  <span>{currentLocation}</span>
                </div>
              </div>
            </div>
            <div className="mt-2 sm:mt-0">
              <span className="text-sm text-neutral-medium">Last login: {lastLoginTime}</span>
            </div>
          </div>
        </div>
        
        {/* Admin mode toggle - for admins only */}
        {isUserAdmin() && (
          <div className="mb-6 flex justify-end">
            <div className="inline-flex items-center bg-neutral-100 p-1 px-2 rounded-md">
              <Button 
                variant={!isAdminView ? "default" : "ghost"} 
                size="sm" 
                onClick={() => setIsAdminView(false)}
                className="text-sm h-8"
              >
                Employee View
              </Button>
              <Button 
                variant={isAdminView ? "default" : "ghost"} 
                size="sm" 
                onClick={() => setIsAdminView(true)}
                className="text-sm h-8"
              >
                Admin View
              </Button>
            </div>
          </div>
        )}
        
        {/* Status indicator - only show for employee view */}
        {!isAdminView && (
          <div className="mb-6">
            <Alert className={`
              ${employeeStatus === 'new' ? 'bg-blue-50 border-blue-200' : 
                employeeStatus === 'exiting' ? 'bg-amber-50 border-amber-200' : 
                'bg-green-50 border-green-200'}
            `}>
              <div className="flex items-center">
                {employeeStatus === 'new' ? (
                  <InfoIcon className="h-4 w-4 text-blue-600 mr-2" />
                ) : employeeStatus === 'exiting' ? (
                  <AlertCircleIcon className="h-4 w-4 text-amber-600 mr-2" />
                ) : (
                  <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                )}
                <AlertTitle className={`
                  ${employeeStatus === 'new' ? 'text-blue-800' : 
                    employeeStatus === 'exiting' ? 'text-amber-800' : 
                    'text-green-800'}
                `}>
                  {employeeStatus === 'new' ? 'New Employee' : 
                   employeeStatus === 'exiting' ? 'Exiting Employee' : 
                   'Current Employee'}
                </AlertTitle>
              </div>
            </Alert>
          </div>
        )}
        
        {/* Render dashboard based on admin/employee mode and status */}
        {isAdminView ? (
          renderAdminDashboard()
        ) : (
          <>
            {employeeStatus === 'new' && renderNewEmployeeDashboard()}
            {employeeStatus === 'current' && renderCurrentEmployeeDashboard()}
            {employeeStatus === 'exiting' && renderExitingEmployeeDashboard()}
          </>
        )}
      </div>
    </Layout>
  );
}

// Onboarding task component
interface OnboardingTaskProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  link: string;
}

function OnboardingTask({ icon, title, description, status, link }: OnboardingTaskProps) {
  return (
    <div className={`
      border rounded-lg p-4 
      ${status === 'completed' ? 'bg-green-50 border-green-200' : 
        status === 'in-progress' ? 'bg-blue-50 border-blue-200' : 
        'bg-white'}
    `}>
      <div className="flex items-start">
        <div className={`
          rounded-full p-2 mr-4
          ${status === 'completed' ? 'bg-green-100 text-green-700' : 
            status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 
            'bg-neutral-100 text-neutral-700'}
        `}>
          {icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{title}</h4>
            <span className={`
              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              ${status === 'completed' ? 'bg-green-100 text-green-800' : 
                status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                'bg-neutral-100 text-neutral-800'}
            `}>
              {status === 'completed' ? 'Completed' : 
                status === 'in-progress' ? 'In Progress' : 
                'Pending'}
            </span>
          </div>
          <p className="text-neutral-medium text-sm mt-1">{description}</p>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Link href={link}>
          <Button 
            variant={status === 'completed' ? 'outline' : 'default'} 
            size="sm"
            className="flex items-center"
          >
            {status === 'completed' ? 'View Details' : 'Continue'}
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
