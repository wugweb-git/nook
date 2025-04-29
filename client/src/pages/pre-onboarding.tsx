import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import OnboardingDocumentUpload from "@/components/onboarding-document-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserIcon, FileTextIcon, LockIcon, MailIcon, AlertCircleIcon, CheckCircleIcon, InfoIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

// Schema for pre-onboarding form
const preOnboardingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number").optional(),
  accessCode: z.string().min(6, "Access code must be at least 6 characters"),
});

type PreOnboardingFormData = z.infer<typeof preOnboardingSchema>;

// Additional schema for account creation
const accountSetupSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type AccountSetupFormData = z.infer<typeof accountSetupSchema>;

export default function PreOnboarding() {
  const [location, setLocation] = useLocation();
  const [activeStep, setActiveStep] = useState("verify");
  const [verifiedUser, setVerifiedUser] = useState<{firstName: string, lastName: string, email: string} | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  // Pre-onboarding form
  const preOnboardingForm = useForm<PreOnboardingFormData>({
    resolver: zodResolver(preOnboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      accessCode: "",
    },
  });

  // Account setup form
  const accountSetupForm = useForm<AccountSetupFormData>({
    resolver: zodResolver(accountSetupSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle verification step
  const onVerify = (data: PreOnboardingFormData) => {
    setIsVerifying(true);
    
    // Simulate API call to verify access code
    setTimeout(() => {
      setIsVerifying(false);
      
      // For demonstration, we'll accept any input with the code "123456"
      if (data.accessCode === "123456") {
        setVerifiedUser({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        });
        setActiveStep("documents");
        
        toast({
          title: "Verification successful",
          description: "You can now proceed with document upload",
        });
      } else {
        toast({
          title: "Verification failed",
          description: "Invalid access code. Please check and try again.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  // Handle account setup
  const onAccountSetup = async () => {
    if (!verifiedUser) {
      toast({
        title: "Error",
        description: "User information is missing. Please restart onboarding.",
        variant: "destructive",
      });
      return;
    }

    try {
      // System will generate username, email, and password
      const response = await apiRequest("POST", "/api/users/register", {
        firstName: verifiedUser.firstName,
        lastName: verifiedUser.lastName,
      });

      const data = await response.json();
      
      // Show success info with generated credentials
      toast({
        title: "Account created successfully",
        description: "Your account has been created with system-generated credentials. Redirecting to login...",
      });
      
      // Display generated credentials in a more noticeable way
      toast({
        title: "Your Login Credentials",
        description: (
          <div className="space-y-1 mt-2">
            <div className="flex items-center text-sm">
              <UserIcon className="w-4 h-4 mr-2" />
              <span>Username: <strong>{data.generatedCredentials.username}</strong></span>
            </div>
            <div className="flex items-center text-sm">
              <MailIcon className="w-4 h-4 mr-2" />
              <span>Email: <strong>{data.generatedCredentials.email}</strong></span>
            </div>
            <div className="flex items-center text-sm">
              <LockIcon className="w-4 h-4 mr-2" />
              <span>Default Password: <strong>WugWeb123@</strong></span>
            </div>
            <p className="text-xs mt-1">Please save these credentials and use them to log in.</p>
          </div>
        ),
        duration: 10000,
      });
      
      // Redirect to login page after a delay
      setTimeout(() => {
        setLocation("/login");
      }, 5000);
    } catch (error) {
      console.error("Failed to create user", error);
      toast({
        title: "Registration failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle document completion
  const handleDocumentsCompleted = () => {
    setActiveStep("setup");
    
    toast({
      title: "Documents uploaded",
      description: "All required documents have been uploaded. Please set up your account.",
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Employee Onboarding Portal</h1>
          <p className="text-neutral-medium">Complete your onboarding process by verifying your identity, uploading required documents, and setting up your account.</p>
        </div>
        
        <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger 
              value="verify" 
              disabled={activeStep !== "verify"} 
              className="flex items-center gap-2"
            >
              <UserIcon className="w-4 h-4" />
              <span>Verify Identity</span>
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              disabled={!verifiedUser && activeStep !== "documents"} 
              className="flex items-center gap-2"
            >
              <FileTextIcon className="w-4 h-4" />
              <span>Upload Documents</span>
            </TabsTrigger>
            <TabsTrigger 
              value="setup" 
              disabled={activeStep !== "setup"} 
              className="flex items-center gap-2"
            >
              <LockIcon className="w-4 h-4" />
              <span>Account Setup</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="verify">
            <Card>
              <CardHeader>
                <CardTitle>Verify Your Identity</CardTitle>
                <CardDescription>
                  Please enter your information and the access code provided by your HR department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...preOnboardingForm}>
                  <form onSubmit={preOnboardingForm.handleSubmit(onVerify)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={preOnboardingForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="John" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={preOnboardingForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Doe" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={preOnboardingForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="john.doe@example.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={preOnboardingForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} type="tel" placeholder="+91 98765 43210" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={preOnboardingForm.control}
                      name="accessCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Access Code</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter your access code" />
                          </FormControl>
                          <FormDescription>
                            This code was sent to your personal email by the HR department
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isVerifying}>
                      {isVerifying ? "Verifying..." : "Verify & Continue"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col items-center justify-center border-t pt-4">
                <p className="text-sm text-neutral-medium mb-2">Already have an account?</p>
                <Link href="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            {verifiedUser ? (
              <div className="space-y-4">
                <div className="bg-primary text-white p-4 rounded-lg mb-4">
                  <div className="flex items-center">
                    <UserIcon className="w-5 h-5 mr-2" />
                    <span className="font-medium">Welcome, {verifiedUser.firstName} {verifiedUser.lastName}</span>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-white/80">
                    <MailIcon className="w-4 h-4 mr-2" />
                    <span>{verifiedUser.email}</span>
                  </div>
                </div>
                
                <OnboardingDocumentUpload />
                
                <div className="flex justify-between mt-4">
                  <Link href="/employee-onboarding">
                    <Button variant="outline">
                      Go to Detailed Onboarding
                    </Button>
                  </Link>
                  <Button onClick={handleDocumentsCompleted}>
                    Continue to Account Setup
                  </Button>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <UserIcon className="w-12 h-12 mx-auto text-neutral-light" />
                    <h3 className="mt-4 font-medium">Identity Verification Required</h3>
                    <p className="text-neutral-medium">Please verify your identity before uploading documents</p>
                    
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveStep("verify")}
                    >
                      Go to Verification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="setup">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Onboarding</CardTitle>
                <CardDescription>
                  Review your information and finish the onboarding process
                </CardDescription>
              </CardHeader>
              <CardContent>
                {verifiedUser && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <div className="flex items-start gap-3">
                        <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-blue-900">Account Creation Information</h3>
                          <p className="text-sm text-blue-700 mt-1">
                            The system will automatically generate your account with the following details:
                          </p>
                          <ul className="mt-2 space-y-1 text-sm text-blue-800">
                            <li className="flex items-center gap-2">
                              <UserIcon className="h-3.5 w-3.5" />
                              Username: <strong>{verifiedUser.firstName.toLowerCase()}.{verifiedUser.lastName.toLowerCase()}</strong>
                            </li>
                            <li className="flex items-center gap-2">
                              <MailIcon className="h-3.5 w-3.5" />
                              Email: <strong>{verifiedUser.firstName.toLowerCase()}.{verifiedUser.lastName.toLowerCase()}@wugweb.design</strong>
                            </li>
                            <li className="flex items-center gap-2">
                              <LockIcon className="h-3.5 w-3.5" />
                              Default Password: <strong>WugWeb123@</strong>
                            </li>
                            <li className="flex items-center gap-2 mt-2 text-xs">
                              <InfoIcon className="h-3 w-3" />
                              Access your email at: <a href="https://mail.hostinger.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">mail.hostinger.com</a>
                            </li>
                          </ul>
                          <p className="mt-2 text-xs text-blue-700">
                            You'll be able to change your password after logging in for the first time.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <label className="text-neutral-medium text-xs">First Name</label>
                          <p className="font-medium">{verifiedUser.firstName}</p>
                        </div>
                        <div>
                          <label className="text-neutral-medium text-xs">Last Name</label>
                          <p className="font-medium">{verifiedUser.lastName}</p>
                        </div>
                        <div className="col-span-2">
                          <label className="text-neutral-medium text-xs">Personal Email Address</label>
                          <p className="font-medium">{verifiedUser.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <Button onClick={onAccountSetup} className="w-full">
                        Complete Onboarding & Create Account
                      </Button>
                      <div className="flex justify-center mt-3">
                        <Link href="/employee-onboarding">
                          <Button variant="link" size="sm" className="text-black hover:text-yellow-600">
                            Go to Detailed Onboarding Form
                          </Button>
                        </Link>
                      </div>
                      <p className="text-xs text-center text-neutral-medium mt-1">
                        By clicking this button, you confirm that the information provided is correct.
                      </p>
                    </div>
                  </div>
                )}
                
                {!verifiedUser && (
                  <div className="text-center py-8">
                    <AlertCircleIcon className="w-12 h-12 mx-auto text-neutral-light" />
                    <h3 className="mt-4 font-medium">Identity Verification Required</h3>
                    <p className="text-neutral-medium">Please verify your identity before completing onboarding.</p>
                    
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveStep("verify")}
                    >
                      Go to Verification
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}