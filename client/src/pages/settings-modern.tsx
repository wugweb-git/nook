import { useState } from "react";
import Layout from "@/components/layout";
import { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardDescription, ModernCardContent, ModernCardFooter } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernSwitch } from "@/components/ui/modern-switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, BellRing, Check, Eye, EyeOff, Globe, Lock, LogOut, Mail, Smartphone, User, UserCog } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Import animations and theme
import "@/styles/animations.css";
import "@/styles/theme.css";

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    language: "en",
    timezone: "Asia/Kolkata",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    emailUpdates: true,
    emailMarketing: false,
    smsNotifications: false,
    webNotifications: true,
    payrollAlerts: true,
    documentUpdates: true,
    holidayReminders: true,
  });

  // Security settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionLength, setSessionLength] = useState("4hrs");

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle notification toggle
  const handleNotificationToggle = (name: string, checked: boolean) => {
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully",
    });
  };

  // Handle password form submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully",
    });
    
    setFormData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  // Handle notification settings submission
  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved",
    });
  };

  return (
    <Layout title="Settings">
      <div className="container mx-auto py-6 md:py-10 px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            <ModernCard className="overflow-hidden">
              <ModernCardHeader>
                <ModernCardTitle>Settings</ModernCardTitle>
                <ModernCardDescription>
                  Manage your account settings and preferences
                </ModernCardDescription>
              </ModernCardHeader>
              
              <Tabs
                orientation="vertical"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="flex flex-col h-auto bg-transparent space-y-1 border-r-0 px-3 py-2">
                  <TabsTrigger 
                    value="profile" 
                    className="justify-start w-full px-3 py-2 text-left rounded-md"
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span>Profile</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="justify-start w-full px-3 py-2 text-left rounded-md"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    <span>Security</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="justify-start w-full px-3 py-2 text-left rounded-md"
                  >
                    <BellRing className="h-4 w-4 mr-2" />
                    <span>Notifications</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <ModernCardFooter className="border-t p-4 mt-auto">
                <ModernButton
                  variant="outline"
                  className="w-full text-red-500 hover:bg-red-50 group"
                  leftIcon={<LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />}
                >
                  Sign out
                </ModernButton>
              </ModernCardFooter>
            </ModernCard>
          </div>
          
          {/* Main content */}
          <div className="flex-1 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6 fade-in">
                <ModernCard>
                  <ModernCardHeader className="space-y-1.5">
                    <div className="flex items-center">
                      <UserCog className="h-5 w-5 mr-2 text-primary" />
                      <ModernCardTitle>Profile Information</ModernCardTitle>
                    </div>
                    <ModernCardDescription>
                      Update your personal details and preferences
                    </ModernCardDescription>
                  </ModernCardHeader>
                  
                  <ModernCardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="modern-input"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="modern-input"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                          <Input 
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="modern-input pl-10"
                          />
                        </div>
                        <p className="text-sm text-neutral-500">
                          This email will be used for account notifications
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                          <Input 
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="modern-input pl-10"
                            placeholder="+91 9876543210"
                          />
                        </div>
                        <p className="text-sm text-neutral-500">
                          Used for SMS notifications and account recovery
                        </p>
                      </div>
                      
                      <div className="flex justify-end">
                        <ModernButton 
                          type="submit"
                          animation="lift"
                          rightIcon={<Check className="h-4 w-4" />}
                        >
                          Save Changes
                        </ModernButton>
                      </div>
                    </form>
                  </ModernCardContent>
                </ModernCard>
                
                <ModernCard>
                  <ModernCardHeader>
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-primary" />
                      <ModernCardTitle>Preferences</ModernCardTitle>
                    </div>
                    <ModernCardDescription>
                      Customize your experience
                    </ModernCardDescription>
                  </ModernCardHeader>
                  
                  <ModernCardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <select
                            id="language"
                            name="language"
                            value={formData.language}
                            onChange={(e) => handleSelectChange("language", e.target.value)}
                            className="modern-input w-full"
                          >
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <select
                            id="timezone"
                            name="timezone"
                            value={formData.timezone}
                            onChange={(e) => handleSelectChange("timezone", e.target.value)}
                            className="modern-input w-full"
                          >
                            <option value="Asia/Kolkata">India Standard Time (IST)</option>
                            <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </ModernCardContent>
                </ModernCard>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6 fade-in">
                <ModernCard>
                  <ModernCardHeader>
                    <div className="flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-primary" />
                      <ModernCardTitle>Change Password</ModernCardTitle>
                    </div>
                    <ModernCardDescription>
                      Manage your password and account security
                    </ModernCardDescription>
                  </ModernCardHeader>
                  
                  <ModernCardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                          <Input 
                            id="currentPassword"
                            name="currentPassword"
                            type={showPassword.current ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            className="modern-input pl-10"
                          />
                          <button 
                            type="button"
                            onClick={() => togglePasswordVisibility("current")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800 focus:outline-none"
                          >
                            {showPassword.current ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                          <Input 
                            id="newPassword"
                            name="newPassword"
                            type={showPassword.new ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="modern-input pl-10"
                          />
                          <button 
                            type="button"
                            onClick={() => togglePasswordVisibility("new")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800 focus:outline-none"
                          >
                            {showPassword.new ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-neutral-500">
                          Password must be at least 8 characters with a mix of letters, numbers, and symbols
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                          <Input 
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword.confirm ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="modern-input pl-10"
                          />
                          <button 
                            type="button"
                            onClick={() => togglePasswordVisibility("confirm")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800 focus:outline-none"
                          >
                            {showPassword.confirm ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <ModernButton 
                          type="submit"
                          animation="lift"
                          variant="default"
                          rightIcon={<Check className="h-4 w-4" />}
                        >
                          Update Password
                        </ModernButton>
                      </div>
                    </form>
                  </ModernCardContent>
                </ModernCard>
                
                <ModernCard>
                  <ModernCardHeader>
                    <ModernCardTitle>Security Settings</ModernCardTitle>
                    <ModernCardDescription>
                      Additional security measures for your account
                    </ModernCardDescription>
                  </ModernCardHeader>
                  
                  <ModernCardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-neutral-500">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <ModernSwitch
                          checked={twoFactorEnabled}
                          onCheckedChange={setTwoFactorEnabled}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Session Timeout</h4>
                        <p className="text-sm text-neutral-500">
                          Choose how long you can be inactive before being logged out
                        </p>
                        <select
                          value={sessionLength}
                          onChange={(e) => setSessionLength(e.target.value)}
                          className="modern-input mt-2"
                        >
                          <option value="30min">30 minutes</option>
                          <option value="1hr">1 hour</option>
                          <option value="4hrs">4 hours</option>
                          <option value="8hrs">8 hours</option>
                          <option value="24hrs">24 hours</option>
                        </select>
                      </div>
                    </div>
                  </ModernCardContent>
                </ModernCard>
              </TabsContent>
              
              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6 fade-in">
                <ModernCard>
                  <ModernCardHeader>
                    <div className="flex items-center">
                      <BellRing className="h-5 w-5 mr-2 text-primary" />
                      <ModernCardTitle>Notification Preferences</ModernCardTitle>
                    </div>
                    <ModernCardDescription>
                      Control how and when you receive notifications
                    </ModernCardDescription>
                  </ModernCardHeader>
                  
                  <ModernCardContent>
                    <form onSubmit={handleNotificationSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Delivery Methods</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                            <div>
                              <div className="font-medium flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-neutral-600" />
                                Email Notifications
                              </div>
                              <p className="text-sm text-neutral-500 mt-1">
                                Receive notifications via email
                              </p>
                            </div>
                            <ModernSwitch
                              checked={notifications.emailNotifications}
                              onCheckedChange={(checked) => handleNotificationToggle("emailNotifications", checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                            <div>
                              <div className="font-medium flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-neutral-600" />
                                Email Updates
                              </div>
                              <p className="text-sm text-neutral-500 mt-1">
                                Receive product updates via email
                              </p>
                            </div>
                            <ModernSwitch
                              checked={notifications.emailUpdates}
                              onCheckedChange={(checked) => handleNotificationToggle("emailUpdates", checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                            <div>
                              <div className="font-medium flex items-center">
                                <Smartphone className="h-4 w-4 mr-2 text-neutral-600" />
                                SMS Notifications
                              </div>
                              <p className="text-sm text-neutral-500 mt-1">
                                Receive notifications via SMS
                              </p>
                            </div>
                            <ModernSwitch
                              checked={notifications.smsNotifications}
                              onCheckedChange={(checked) => handleNotificationToggle("smsNotifications", checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                            <div>
                              <div className="font-medium flex items-center">
                                <BellRing className="h-4 w-4 mr-2 text-neutral-600" />
                                Browser Notifications
                              </div>
                              <p className="text-sm text-neutral-500 mt-1">
                                Receive notifications in your web browser
                              </p>
                            </div>
                            <ModernSwitch
                              checked={notifications.webNotifications}
                              onCheckedChange={(checked) => handleNotificationToggle("webNotifications", checked)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Notification Types</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                            <div>
                              <div className="font-medium">Payroll Alerts</div>
                              <p className="text-sm text-neutral-500 mt-1">
                                Get notified when your salary slip is available
                              </p>
                            </div>
                            <ModernSwitch
                              checked={notifications.payrollAlerts}
                              onCheckedChange={(checked) => handleNotificationToggle("payrollAlerts", checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                            <div>
                              <div className="font-medium">Document Updates</div>
                              <p className="text-sm text-neutral-500 mt-1">
                                Get notified about document verification status changes
                              </p>
                            </div>
                            <ModernSwitch
                              checked={notifications.documentUpdates}
                              onCheckedChange={(checked) => handleNotificationToggle("documentUpdates", checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                            <div>
                              <div className="font-medium">Holiday Reminders</div>
                              <p className="text-sm text-neutral-500 mt-1">
                                Get reminded about upcoming holidays
                              </p>
                            </div>
                            <ModernSwitch
                              checked={notifications.holidayReminders}
                              onCheckedChange={(checked) => handleNotificationToggle("holidayReminders", checked)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <ModernButton 
                          type="submit"
                          animation="lift"
                          rightIcon={<Check className="h-4 w-4" />}
                        >
                          Save Preferences
                        </ModernButton>
                      </div>
                    </form>
                  </ModernCardContent>
                </ModernCard>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;