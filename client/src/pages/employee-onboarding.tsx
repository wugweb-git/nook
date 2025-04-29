import { useState } from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { CheckCircleIcon, UserIcon, FileTextIcon, BriefcaseIcon, MapPinIcon, PhoneIcon, MailIcon, CalendarIcon, ArrowRightIcon } from "lucide-react";
import OnboardingDocumentUpload from "@/components/onboarding-document-upload";

// Import Modern UI Components
import { 
  ModernButton,
  IconContainer
} from "@/components/ui/design-system";

// Define form schema
const employeeInfoSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().refine(value => !isNaN(Date.parse(value)), "Please enter a valid date"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed", "other"]),
  
  // Address Information
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  
  // Employment Information
  designation: z.string().min(2, "Designation must be at least 2 characters"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  joiningDate: z.string().refine(value => !isNaN(Date.parse(value)), "Please enter a valid date"),
  employeeType: z.enum(["full_time", "part_time", "contract", "intern"]),
  
  // Emergency Contact Information
  emergencyContactName: z.string().min(2, "Emergency contact name must be at least 2 characters"),
  emergencyContactPhone: z.string().min(10, "Emergency contact phone must be at least 10 digits"),
  emergencyContactRelation: z.string().min(2, "Relation must be at least 2 characters"),
  
  // Bank Information
  bankName: z.string().min(2, "Bank name must be at least 2 characters"),
  accountNumber: z.string().min(5, "Account number must be at least 5 characters"),
  ifscCode: z.string().min(5, "IFSC code must be at least 5 characters"),
  panNumber: z.string().min(10, "PAN number must be at least 10 characters"),
});

type EmployeeInfoForm = z.infer<typeof employeeInfoSchema>;

// Mock departments data
const departments = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Human Resources" },
  { id: 3, name: "Finance" },
  { id: 4, name: "Marketing" },
  { id: 5, name: "Operations" },
  { id: 6, name: "Sales" },
  { id: 7, name: "Customer Support" },
];

// Mock designations data
const designations = [
  { id: 1, name: "Software Engineer" },
  { id: 2, name: "HR Manager" },
  { id: 3, name: "Financial Analyst" },
  { id: 4, name: "Marketing Specialist" },
  { id: 5, name: "Operations Manager" },
  { id: 6, name: "Sales Representative" },
  { id: 7, name: "Customer Support Specialist" },
];

export default function EmployeeOnboarding() {
  const [activeTab, setActiveTab] = useState("personal-info");
  const [formProgress, setFormProgress] = useState({
    "personal-info": 0,
    "employment-info": 0,
    "emergency-contact": 0,
    "documents": 0
  });
  const { toast } = useToast();

  // Calculate overall progress
  const overallProgress = Object.values(formProgress).reduce((sum, value) => sum + value, 0) / Object.keys(formProgress).length;

  // Create form
  const form = useForm<EmployeeInfoForm>({
    resolver: zodResolver(employeeInfoSchema),
    defaultValues: {
      // Personal Information
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "prefer_not_to_say",
      maritalStatus: "single",
      
      // Address Information
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "India",
      
      // Employment Information
      designation: "",
      department: "",
      joiningDate: new Date().toISOString().split('T')[0],
      employeeType: "full_time",
      
      // Emergency Contact Information
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
      
      // Bank Information
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      panNumber: "",
    },
  });

  // Handle form submission
  const onSubmit = (data: EmployeeInfoForm) => {
    console.log(data);
    toast({
      title: "Information saved",
      description: "Your information has been saved successfully",
    });
  };

  // Update progress on form field changes
  const updateFormProgress = (currentTab: string) => {
    if (currentTab === "personal-info") {
      const personalFields = [
        "firstName", "lastName", "email", "phone", "dateOfBirth", "gender", "maritalStatus", 
        "address", "city", "state", "zipCode", "country"
      ];
      const filledFields = personalFields.filter(field => !!form.getValues(field as any)).length;
      setFormProgress(prev => ({ ...prev, "personal-info": Math.round((filledFields / personalFields.length) * 100) }));
    } else if (currentTab === "employment-info") {
      const employmentFields = ["designation", "department", "joiningDate", "employeeType", "bankName", "accountNumber", "ifscCode", "panNumber"];
      const filledFields = employmentFields.filter(field => !!form.getValues(field as any)).length;
      setFormProgress(prev => ({ ...prev, "employment-info": Math.round((filledFields / employmentFields.length) * 100) }));
    } else if (currentTab === "emergency-contact") {
      const emergencyFields = ["emergencyContactName", "emergencyContactPhone", "emergencyContactRelation"];
      const filledFields = emergencyFields.filter(field => !!form.getValues(field as any)).length;
      setFormProgress(prev => ({ ...prev, "emergency-contact": Math.round((filledFields / emergencyFields.length) * 100) }));
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    updateFormProgress(activeTab);
  };

  // Navigate to next tab
  const handleNextTab = () => {
    updateFormProgress(activeTab);
    if (activeTab === "personal-info") {
      setActiveTab("employment-info");
    } else if (activeTab === "employment-info") {
      setActiveTab("emergency-contact");
    } else if (activeTab === "emergency-contact") {
      setActiveTab("documents");
    }
  };

  // Navigate to previous tab
  const handlePreviousTab = () => {
    if (activeTab === "employment-info") {
      setActiveTab("personal-info");
    } else if (activeTab === "emergency-contact") {
      setActiveTab("employment-info");
    } else if (activeTab === "documents") {
      setActiveTab("emergency-contact");
    }
  };

  // Update progress when a field changes
  const handleFieldChange = () => {
    updateFormProgress(activeTab);
  };

  return (
    <Layout title="Employee Onboarding">
      <div className="p-4 sm:p-6 lg:p-8">
        <Card className="border-black overflow-hidden">
          <div className="h-1 w-full bg-yellow-500"></div>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Employee Onboarding</CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Complete your onboarding process by providing all required information and documents
            </CardDescription>

            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">Overall Completion</span>
                  {overallProgress === 100 ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black text-white">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Complete
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                      <span className="h-3 w-3 mr-1">•</span>
                      In Progress
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-gray-800">{Math.round(overallProgress)}%</span>
              </div>
              <Progress 
                value={overallProgress} 
                className="h-2 bg-gray-200" 
                style={{ 
                  "--tw-bg-opacity": "1",
                  backgroundColor: overallProgress === 100 ? "black" : "rgba(var(--primary-yellow), var(--tw-bg-opacity))" 
                } as React.CSSProperties}
              />
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8 p-1 rounded-xl bg-gray-100">
                <TabsTrigger 
                  value="personal-info"
                  className="flex items-center justify-center gap-2 relative py-3 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md data-[state=active]:rounded-lg data-[state=active]:font-medium transition-all duration-200"
                >
                  <div className="relative">
                    <UserIcon className="w-4 h-4" />
                    {formProgress["personal-info"] === 100 && (
                      <span className="absolute -top-1 -right-1 bg-black rounded-full w-3 h-3 border border-white"></span>
                    )}
                  </div>
                  <span className="hidden sm:inline">Personal Info</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="employment-info"
                  className="flex items-center justify-center gap-2 relative py-3 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md data-[state=active]:rounded-lg data-[state=active]:font-medium transition-all duration-200"
                >
                  <div className="relative">
                    <BriefcaseIcon className="w-4 h-4" />
                    {formProgress["employment-info"] === 100 && (
                      <span className="absolute -top-1 -right-1 bg-black rounded-full w-3 h-3 border border-white"></span>
                    )}
                  </div>
                  <span className="hidden sm:inline">Employment</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="emergency-contact"
                  className="flex items-center justify-center gap-2 relative py-3 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md data-[state=active]:rounded-lg data-[state=active]:font-medium transition-all duration-200"
                >
                  <div className="relative">
                    <PhoneIcon className="w-4 h-4" />
                    {formProgress["emergency-contact"] === 100 && (
                      <span className="absolute -top-1 -right-1 bg-black rounded-full w-3 h-3 border border-white"></span>
                    )}
                  </div>
                  <span className="hidden sm:inline">Emergency</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="documents"
                  className="flex items-center justify-center gap-2 relative py-3 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md data-[state=active]:rounded-lg data-[state=active]:font-medium transition-all duration-200"
                >
                  <div className="relative">
                    <FileTextIcon className="w-4 h-4" />
                    {formProgress["documents"] === 100 && (
                      <span className="absolute -top-1 -right-1 bg-black rounded-full w-3 h-3 border border-white"></span>
                    )}
                  </div>
                  <span className="hidden sm:inline">Documents</span>
                </TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} onChange={handleFieldChange}>
                  <TabsContent value="personal-info">
                    <div className="space-y-6">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mr-4">
                          <UserIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">Personal Information</h3>
                          <p className="text-gray-600">Enter your personal details</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your first name" 
                                  {...field} 
                                  className="border-gray-300 focus:border-black"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your last name" 
                                  {...field} 
                                  className="border-gray-300 focus:border-black"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input 
                                    placeholder="you@example.com" 
                                    {...field} 
                                    className="pl-10 border-gray-300 focus:border-black"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input 
                                    placeholder="(123) 456-7890" 
                                    {...field} 
                                    className="pl-10 border-gray-300 focus:border-black"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input 
                                    type="date" 
                                    {...field} 
                                    className="pl-10 border-gray-300 focus:border-black"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-gray-300 focus:border-black">
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="maritalStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Marital Status</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-gray-300 focus:border-black">
                                    <SelectValue placeholder="Select marital status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="single">Single</SelectItem>
                                  <SelectItem value="married">Married</SelectItem>
                                  <SelectItem value="divorced">Divorced</SelectItem>
                                  <SelectItem value="widowed">Widowed</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <MapPinIcon className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                  <Textarea 
                                    placeholder="Enter your street address" 
                                    {...field} 
                                    className="pl-10 min-h-[80px] border-gray-300 focus:border-black"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="City" 
                                    {...field} 
                                    className="border-gray-300 focus:border-black"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="State" 
                                    {...field} 
                                    className="border-gray-300 focus:border-black"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Zip Code *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Zip Code" 
                                    {...field} 
                                    className="border-gray-300 focus:border-black"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Country" 
                                    {...field} 
                                    className="border-gray-300 focus:border-black"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end mt-8">
                        <ModernButton
                          type="button"
                          onClick={handleNextTab}
                          variant="black"
                          rightIcon={<ArrowRightIcon className="h-4 w-4" />}
                        >
                          Continue to Employment
                        </ModernButton>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="employment-info">
                    <div className="space-y-6">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mr-4">
                          <BriefcaseIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">Employment Information</h3>
                          <p className="text-gray-600">Enter your job details</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <FormField
                          control={form.control}
                          name="designation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Designation *</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-gray-300 focus:border-black">
                                    <SelectValue placeholder="Select your designation" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {designations.map((designation) => (
                                    <SelectItem key={designation.id} value={designation.name}>
                                      {designation.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Department *</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-gray-300 focus:border-black">
                                    <SelectValue placeholder="Select your department" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {departments.map((department) => (
                                    <SelectItem key={department.id} value={department.name}>
                                      {department.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="joiningDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Joining Date *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input 
                                    type="date" 
                                    {...field} 
                                    className="pl-10 border-gray-300 focus:border-black"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="employeeType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Employment Type *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-gray-300 focus:border-black">
                                    <SelectValue placeholder="Select employment type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="full_time">Full Time</SelectItem>
                                  <SelectItem value="part_time">Part Time</SelectItem>
                                  <SelectItem value="contract">Contract</SelectItem>
                                  <SelectItem value="intern">Intern</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-4 mb-4">
                        <h4 className="text-md font-medium text-gray-800">Banking Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="bankName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bank Name *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter bank name" 
                                    {...field} 
                                    className="border-gray-300 focus:border-black"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="accountNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Account Number *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter account number" 
                                    {...field} 
                                    className="border-gray-300 focus:border-black"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="ifscCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>IFSC Code *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter IFSC code" 
                                    {...field} 
                                    className="border-gray-300 focus:border-black"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="panNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>PAN Number *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter PAN number" 
                                    {...field} 
                                    className="border-gray-300 focus:border-black"
                                    autoComplete="off"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between mt-8">
                        <Button
                          type="button"
                          onClick={handlePreviousTab}
                          variant="outline"
                          className="border-gray-300 hover:border-black hover:bg-white text-gray-700 hover:text-black"
                        >
                          Back to Personal Info
                        </Button>
                        <ModernButton
                          type="button"
                          onClick={handleNextTab}
                          variant="black"
                          rightIcon={<ArrowRightIcon className="h-4 w-4" />}
                        >
                          Continue to Emergency Contacts
                        </ModernButton>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="emergency-contact">
                    <div className="space-y-6">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mr-4">
                          <PhoneIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">Emergency Contact</h3>
                          <p className="text-gray-600">Provide emergency contact information</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="emergencyContactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Name *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Full name" 
                                  {...field} 
                                  className="border-gray-300 focus:border-black"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="emergencyContactRelation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Relationship *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g. Spouse, Parent, Sibling" 
                                  {...field} 
                                  className="border-gray-300 focus:border-black"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="emergencyContactPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Phone *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input 
                                    placeholder="(123) 456-7890" 
                                    {...field} 
                                    className="pl-10 border-gray-300 focus:border-black"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-between mt-8">
                        <Button
                          type="button"
                          onClick={handlePreviousTab}
                          variant="outline"
                          className="border-gray-300 hover:border-black hover:bg-white text-gray-700 hover:text-black"
                        >
                          Back to Employment
                        </Button>
                        <div className="flex space-x-3">
                          <Button
                            type="submit"
                            variant="outline"
                            className="border-gray-300 hover:border-black hover:bg-white text-gray-700 hover:text-black"
                          >
                            Save Information
                          </Button>
                          <ModernButton
                            type="button"
                            onClick={handleNextTab}
                            variant="black"
                            rightIcon={<ArrowRightIcon className="h-4 w-4" />}
                          >
                            Continue to Documents
                          </ModernButton>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </form>
              </Form>

              <TabsContent value="documents">
                <div className="space-y-6">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mr-4">
                      <FileTextIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Document Upload</h3>
                      <p className="text-gray-600">Upload all required documents for onboarding</p>
                    </div>
                  </div>

                  <OnboardingDocumentUpload />

                  <div className="flex justify-between mt-8">
                    <Button
                      type="button"
                      onClick={handlePreviousTab}
                      variant="outline"
                      className="border-gray-300 hover:border-black hover:bg-white text-gray-700 hover:text-black"
                    >
                      Back to Emergency Contact
                    </Button>
                    <ModernButton
                      type="button"
                      variant="black"
                    >
                      Complete Onboarding
                    </ModernButton>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}