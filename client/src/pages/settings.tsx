import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import {
  ModernCard,
  ModernCardHeader,
  ModernCardTitle,
  ModernCardDescription,
  ModernCardContent,
  ModernCardFooter,
} from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernSwitch } from "@/components/ui/modern-switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Import animations
import "@/styles/animations.css";
import "@/styles/theme.css";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  BellRing,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MessageSquare,
  User,
  UserCog,
  Trash2,
  CircleSlash,
  Check,
  ShieldCheck,
  AlertTriangle,
  Smartphone as MobileIcon,
  Globe,
  LogOut,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

// Schema for profile settings
const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
});

// Schema for password reset
const passwordSchema = z.object({
  currentPassword: z.string().min(8, "Password must be at least 8 characters"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Schema for notification settings
const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  emailUpdates: z.boolean(),
  emailMarketing: z.boolean(),
  smsNotifications: z.boolean(),
  smsUpdates: z.boolean(),
  webNotifications: z.boolean(),
  payrollAlerts: z.boolean(),
  documentUpdates: z.boolean(),
  holidayReminders: z.boolean(),
  eventReminders: z.boolean(),
});

// Common timezones
const timezones = [
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Singapore", label: "Singapore Time (SGT)" },
];

// Languages
const languages = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese" },
  { value: "ar", label: "Arabic" },
];

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionLength, setSessionLength] = useState("4hrs");

  // Initialize profile form with user data
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      language: "en",
      timezone: "Asia/Kolkata",
    },
  });

  // Initialize password form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Initialize notification settings form
  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      emailUpdates: true,
      emailMarketing: false,
      smsNotifications: false,
      smsUpdates: false,
      webNotifications: true,
      payrollAlerts: true,
      documentUpdates: true,
      holidayReminders: true,
      eventReminders: true,
    },
  });

  // Handle profile form submission
  const onProfileSubmit = (data: z.infer<typeof profileSchema>) => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    
    console.log("Profile data:", data);
    // In a real application, you would use updateUser(data) here
  };

  // Handle password form submission
  const onPasswordSubmit = (data: z.infer<typeof passwordSchema>) => {
    // Check if current password is correct (would be done server-side in real app)
    if (data.currentPassword !== "password123") {
      toast({
        title: "Error",
        description: "Current password is incorrect.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
    
    console.log("Password data:", data);
    passwordForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Handle notification settings form submission
  const onNotificationSubmit = (data: z.infer<typeof notificationSchema>) => {
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
    
    console.log("Notification data:", data);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Layout title="Settings">
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-full sm:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
                <CardDescription>
                  Manage your account settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs
                  orientation="vertical"
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="flex flex-col h-auto bg-transparent space-y-1 border-r-0">
                    <TabsTrigger 
                      value="profile" 
                      className="justify-start w-full h-10 px-3 text-left"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile Information
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="justify-start w-full h-10 px-3 text-left"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Password & Security
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="justify-start w-full h-10 px-3 text-left"
                    >
                      <BellRing className="h-4 w-4 mr-2" />
                      Notifications
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
              <CardFooter className="border-t px-6 py-4 mt-4">
                <Button 
                  variant="outline" 
                  className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center justify-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="w-full sm:w-3/4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="profile" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserCog className="h-5 w-5 mr-2" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                        <div className="grid gap-6">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your first name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your last name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                                    <Input placeholder="Enter your email" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  This email will be used for account notifications.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <MobileIcon className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                                    <Input placeholder="Enter your phone number" className="pl-10" {...field} />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  Used for SMS notifications and account recovery.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid sm:grid-cols-2 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="language"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Preferred Language</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <div className="flex items-center">
                                          <Globe className="h-4 w-4 mr-2 text-neutral-500" />
                                          <SelectValue placeholder="Select your language" />
                                        </div>
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {languages.map(language => (
                                        <SelectItem key={language.value} value={language.value}>
                                          {language.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={profileForm.control}
                              name="timezone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Timezone</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select your timezone" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {timezones.map(timezone => (
                                        <SelectItem key={timezone.value} value={timezone.value}>
                                          {timezone.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="flex justify-end">
                            <Button type="submit" className="flex items-center">
                              <Check className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShieldCheck className="h-5 w-5 mr-2" />
                      Password & Security
                    </CardTitle>
                    <CardDescription>
                      Manage your password and security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                        <h3 className="text-lg font-medium">Change Password</h3>
                        <div className="space-y-4">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                                    <Input 
                                      type={showPassword.current ? "text" : "password"} 
                                      placeholder="Enter current password" 
                                      className="pl-10" 
                                      {...field} 
                                    />
                                    <button 
                                      type="button"
                                      onClick={() => togglePasswordVisibility('current')}
                                      className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-700"
                                    >
                                      {showPassword.current ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                                    <Input 
                                      type={showPassword.new ? "text" : "password"} 
                                      placeholder="Enter new password" 
                                      className="pl-10" 
                                      {...field} 
                                    />
                                    <button 
                                      type="button"
                                      onClick={() => togglePasswordVisibility('new')}
                                      className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-700"
                                    >
                                      {showPassword.new ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                                    <Input 
                                      type={showPassword.confirm ? "text" : "password"} 
                                      placeholder="Confirm new password" 
                                      className="pl-10" 
                                      {...field} 
                                    />
                                    <button 
                                      type="button"
                                      onClick={() => togglePasswordVisibility('confirm')}
                                      className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-700"
                                    >
                                      {showPassword.confirm ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button type="submit" className="flex items-center">
                            <Check className="h-4 w-4 mr-2" />
                            Update Password
                          </Button>
                        </div>
                      </form>
                    </Form>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Enhance your account security</AlertTitle>
                        <AlertDescription>
                          Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to sign in.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-neutral-500">
                            {twoFactorEnabled
                              ? "Your account is protected with an authentication app"
                              : "Protect your account with an authentication app"}
                          </p>
                        </div>
                        <Switch
                          checked={twoFactorEnabled}
                          onCheckedChange={setTwoFactorEnabled}
                        />
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Session Management</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <h4 className="text-sm font-medium">Session Timeout</h4>
                              <p className="text-sm text-neutral-500">
                                Choose how long you can be inactive before being logged out
                              </p>
                            </div>
                            <Select
                              value={sessionLength}
                              onValueChange={setSessionLength}
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30min">30 minutes</SelectItem>
                                <SelectItem value="1hr">1 hour</SelectItem>
                                <SelectItem value="4hrs">4 hours</SelectItem>
                                <SelectItem value="8hrs">8 hours</SelectItem>
                                <SelectItem value="24hrs">24 hours</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="pt-2">
                            <Button 
                              variant="outline" 
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center"
                            >
                              <CircleSlash className="h-4 w-4 mr-2" />
                              Sign out from all devices
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BellRing className="h-5 w-5 mr-2" />
                      Notification Settings
                    </CardTitle>
                    <CardDescription>
                      Control how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...notificationForm}>
                      <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}>
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Delivery Methods</h3>
                            
                            <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-950">
                              <FormField
                                control={notificationForm.control}
                                name="emailNotifications"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Email Notifications</FormLabel>
                                      <FormDescription>
                                        Receive notifications via email
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={notificationForm.control}
                                name="emailUpdates"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Email Updates</FormLabel>
                                      <FormDescription>
                                        Receive product updates via email
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={notificationForm.control}
                                name="emailMarketing"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Marketing Emails</FormLabel>
                                      <FormDescription>
                                        Receive marketing and promotional emails
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-950">
                              <FormField
                                control={notificationForm.control}
                                name="smsNotifications"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">SMS Notifications</FormLabel>
                                      <FormDescription>
                                        Receive notifications via SMS
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={notificationForm.control}
                                name="smsUpdates"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">SMS Updates</FormLabel>
                                      <FormDescription>
                                        Receive important updates via SMS
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="space-y-4 border rounded-lg p-4 bg-gray-50 dark:bg-gray-950">
                              <FormField
                                control={notificationForm.control}
                                name="webNotifications"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Browser Notifications</FormLabel>
                                      <FormDescription>
                                        Receive notifications in your web browser
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Notification Types</h3>
                            
                            <div className="space-y-4">
                              <FormField
                                control={notificationForm.control}
                                name="payrollAlerts"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-950">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Payroll Alerts</FormLabel>
                                      <FormDescription>
                                        Get notified when your salary slip is available
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={notificationForm.control}
                                name="documentUpdates"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-950">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Document Updates</FormLabel>
                                      <FormDescription>
                                        Get notified about document verification status changes
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={notificationForm.control}
                                name="holidayReminders"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-950">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Holiday Reminders</FormLabel>
                                      <FormDescription>
                                        Get reminded about upcoming holidays
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={notificationForm.control}
                                name="eventReminders"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-950">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-base">Event Reminders</FormLabel>
                                      <FormDescription>
                                        Get reminded about upcoming company events
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end pt-4">
                            <Button type="submit" className="flex items-center">
                              <Check className="h-4 w-4 mr-2" />
                              Save Preferences
                            </Button>
                          </div>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}