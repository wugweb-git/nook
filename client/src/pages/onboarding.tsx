import Layout from "@/components/layout";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, ClockIcon, AlertCircleIcon, FileTextIcon, ArrowRightIcon, CheckCircleIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import OnboardingDocumentUpload from "@/components/onboarding-document-upload";

// Import Modern UI Components
import { 
  ModernButton,
  IconContainer
} from "@/components/ui/design-system";

export default function Onboarding() {
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

  return (
    <Layout title="Onboarding">
      <div className="p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="steps" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="steps" className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              <span>Onboarding Steps</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileTextIcon className="w-4 h-4" />
              <span>Document Upload</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="steps">
            <Card className="mb-6 overflow-hidden border-black">
              <div className="h-1 bg-yellow-500"></div>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Employee Onboarding</CardTitle>
                    <CardDescription>Complete your onboarding steps to get started</CardDescription>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <Badge variant="outline" className="text-lg font-medium">
                      Progress: {progress}%
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="h-2 mb-6 bg-gray-200" 
                  style={{ 
                    "--tw-bg-opacity": "1",
                    backgroundColor: "rgba(var(--primary-yellow), var(--tw-bg-opacity))" 
                  } as React.CSSProperties} />
                
                {isLoading ? (
                  <div className="space-y-6">
                    {Array(5).fill(null).map((_, index) => (
                      <div key={index} className="flex">
                        <Skeleton className="w-10 h-10 rounded-full mr-4 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-1/3" />
                          <Skeleton className="h-4 w-2/3" />
                          <Skeleton className="h-10 w-24 mt-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All Steps</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="space-y-6">
                      {onboardingSteps.map((step) => (
                        <StepCard 
                          key={step.id}
                          step={step}
                          onUpdateStatus={handleUpdateStatus}
                          isUpdating={isUpdating}
                        />
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="pending" className="space-y-6">
                      {onboardingSteps.filter(s => s.status !== "completed").map((step) => (
                        <StepCard 
                          key={step.id}
                          step={step}
                          onUpdateStatus={handleUpdateStatus}
                          isUpdating={isUpdating}
                        />
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="completed" className="space-y-6">
                      {onboardingSteps.filter(s => s.status === "completed").map((step) => (
                        <StepCard 
                          key={step.id}
                          step={step}
                          onUpdateStatus={handleUpdateStatus}
                          isUpdating={isUpdating}
                        />
                      ))}
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <OnboardingDocumentUpload />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

interface StepCardProps {
  step: any; // Using any here since we're combining types from the backend
  onUpdateStatus: (id: number, status: string) => void;
  isUpdating: boolean;
}

function StepCard({ step, onUpdateStatus, isUpdating }: StepCardProps) {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${
      step.status === 'completed' ? 'border-black' :
      step.status === 'in_progress' ? 'border-yellow-500' : 'border-gray-200'
    }`}>
      <div className={`h-1 ${
        step.status === 'completed' ? 'bg-black' :
        step.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-200'
      }`}></div>
      <CardContent className="pt-6 pb-4">
        <div className="flex items-start">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
            step.status === 'completed' ? 'bg-black text-white' : 
            step.status === 'in_progress' ? 'bg-yellow-500 text-white' :
            'bg-gray-100 text-gray-700'
          }`}>
            {step.status === 'completed' ? (
              <CheckCircleIcon className="w-6 h-6" />
            ) : step.status === 'in_progress' ? (
              <ClockIcon className="w-6 h-6" />
            ) : (
              <span className="font-bold text-lg">{step.step.order}</span>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-medium mb-1">{step.step.name}</h3>
            <p className="text-gray-600 mb-4">{step.step.description}</p>
            
            {step.status === 'completed' ? (
              <div className="flex items-center text-green-600">
                <CheckCircleIcon className="w-5 h-5 mr-1" />
                <span className="text-sm font-medium">
                  Completed on {formatDate(step.completedAt)}
                </span>
              </div>
            ) : (
              <ModernButton
                onClick={() => onUpdateStatus(step.id, step.status)}
                disabled={isUpdating}
                variant={step.status === 'in_progress' ? 'black' : 'outline'}
                size="sm"
                rightIcon={<ArrowRightIcon className="h-4 w-4" />}
              >
                {step.status === 'not_started' ? 'Start Step' : 'Mark as Completed'}
              </ModernButton>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
