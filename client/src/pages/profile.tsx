import { useState } from "react";
import Layout from "@/components/layout";
import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInitials, formatDateTime, formatDate, getProgressColor } from "@/lib/utils";
import { 
  CameraIcon, 
  SaveIcon, 
  UserIcon, 
  MailIcon, 
  BuildingIcon, 
  BriefcaseIcon, 
  BadgeIcon, 
  CalendarIcon, 
  GraduationCapIcon, 
  PhoneIcon, 
  HomeIcon, 
  DollarSignIcon, 
  LandmarkIcon, 
  FileTextIcon, 
  FileIcon,
  DownloadIcon,
  CheckCircleIcon,
  CircleIcon,
  ClockIcon,
  AlertCircleIcon,
  HelpCircleIcon,
  LinkedinIcon,
  GithubIcon,
  TwitterIcon,
  Globe2Icon,
  LinkIcon,
  ExternalLinkIcon,
  YoutubeIcon
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import DocumentCard from "@/components/document-card";

export default function Profile() {
  const { user } = useAuth();
  const { 
    onboardingSteps, 
    progress, 
    isLoading: isLoadingOnboarding, 
    updateStepStatus, 
    isUpdating 
  } = useOnboarding();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    department: user?.department || "",
    position: user?.position || "",
    jobArea: user?.jobArea || "engineering",
    linkedin: user?.linkedin || "",
    github: user?.github || "",
    behance: user?.behance || "",
    dribbble: user?.dribbble || "",
    twitter: user?.twitter || "",
    youtube: user?.youtube || "",
    website: user?.website || ""
  });
  
  // Function to determine which social links to show based on job area
  const getSocialLinksForJobArea = (jobArea: string) => {
    const allLinks = [
      { id: 'linkedin', label: 'LinkedIn', icon: <LinkedinIcon className="w-4 h-4" />, show: true },
      { id: 'github', label: 'GitHub', icon: <GithubIcon className="w-4 h-4" />, show: jobArea === 'engineering' || jobArea === 'product' },
      { id: 'behance', label: 'Behance', icon: <LinkIcon className="w-4 h-4" />, show: jobArea === 'design' || jobArea === 'marketing' },
      { id: 'dribbble', label: 'Dribbble', icon: <LinkIcon className="w-4 h-4" />, show: jobArea === 'design' },
      { id: 'twitter', label: 'Twitter', icon: <TwitterIcon className="w-4 h-4" />, show: true },
      { id: 'youtube', label: 'YouTube', icon: <YoutubeIcon className="w-4 h-4" />, show: jobArea === 'marketing' || jobArea === 'creative' },
      { id: 'website', label: 'Personal Website', icon: <Globe2Icon className="w-4 h-4" />, show: true }
    ];
    
    return allLinks.filter(link => link.show);
  };
  
  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PUT", "/api/users/profile", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/session"], { user: data });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileData);
  };
  
  if (!user) return null;
  
  const initials = getInitials(user.firstName, user.lastName);
  const lastLoginTime = user.lastLogin ? formatDateTime(user.lastLogin) : "Unknown";
  
  return (
    <Layout title="Profile">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Profile Card */}
          <Card className="w-full md:w-96">
            <CardContent className="flex flex-col items-center text-center p-6">
              <div className="relative mb-4">
                <Avatar className="w-24 h-24">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                  ) : (
                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                  )}
                </Avatar>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8"
                >
                  <CameraIcon className="w-4 h-4" />
                  <span className="sr-only">Upload avatar</span>
                </Button>
              </div>
              
              <h3 className="text-xl font-medium">{`${user.firstName} ${user.lastName}`}</h3>
              <p className="text-neutral-medium">{user.position}</p>
              <p className="text-sm text-neutral-medium mt-1">{user.department}</p>
              
              <Separator className="my-4" />
              
              <div className="w-full">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-neutral-medium">Username</span>
                  <span className="text-sm">{user.username}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-neutral-medium">Role</span>
                  <span className="text-sm capitalize">{user.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-medium">Last Login</span>
                  <span className="text-sm">{lastLoginTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex-1 flex flex-col">
            <h2 className="text-3xl font-semibold mb-2">{`${user.firstName} ${user.lastName}`}</h2>
            <p className="text-xl text-neutral-medium">{user.position}</p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2">
                <BadgeIcon className="w-5 h-5 text-neutral-medium" />
                <span>Employee ID: {user.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="w-5 h-5 text-neutral-medium" />
                <span>{user.email}</span>
                <a 
                  href="https://mail.hostinger.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 underline text-sm ml-2 flex items-center"
                >
                  <ExternalLinkIcon className="h-3 w-3 mr-1" />
                  Check Email
                </a>
              </div>
              <div className="flex items-center gap-2">
                <BuildingIcon className="w-5 h-5 text-neutral-medium" />
                <span>{user.department}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="employment">Employment Information</TabsTrigger>
            <TabsTrigger value="contact">Contact Information</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="financial">Financial Information</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
            <TabsTrigger value="work">Work & Roles</TabsTrigger>
          </TabsList>
          
          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Your basic profile information</CardDescription>
                  </div>
                  <Button 
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isPending}
                  >
                    {isEditing ? "Cancel" : "Edit Information"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing || isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing || isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="flex items-center gap-2">
                        <BadgeIcon className="w-4 h-4" />
                        Username
                      </Label>
                      <Input
                        id="username"
                        name="username"
                        value={user.username}
                        disabled={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeId" className="flex items-center gap-2">
                        <BadgeIcon className="w-4 h-4" />
                        Employee ID
                      </Label>
                      <Input
                        id="employeeId"
                        name="employeeId"
                        value={user.id?.toString() || ""}
                        disabled={true}
                      />
                    </div>
                  </div>
                  
                  {isEditing && (
                    <Button 
                      type="submit" 
                      className="mt-6"
                      disabled={isPending}
                    >
                      {isPending ? "Saving..." : (
                        <>
                          <SaveIcon className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Employment Information Tab */}
          <TabsContent value="employment">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Employment Information</CardTitle>
                    <CardDescription>Your job and employment details</CardDescription>
                  </div>
                  <Button variant="outline">Edit Information</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-medium">Job Title</label>
                    <p>{user.position || "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-medium">Department</label>
                    <p>{user.department || "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-medium">Work Location</label>
                    <p>{user.workLocation || "Remote"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-medium">Employment Type</label>
                    <p>{user.employmentType || "Full Time"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-medium">Start Date</label>
                    <p>{user.joiningDate ? formatDate(user.joiningDate) : "Not specified"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-medium">Reports To</label>
                    <p>{user.manager || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Contact Information Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Your contact details and addresses</CardDescription>
                  </div>
                  <Button variant="outline">Edit Information</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-medium">Work Email</label>
                    <p className="flex items-center">
                      {user.companyEmail || user.email}
                      {user.companyEmail && (
                        <a 
                          href="https://mail.hostinger.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 text-primary text-sm hover:underline inline-flex items-center"
                        >
                          <ExternalLinkIcon className="h-3 w-3 mr-1" />
                          <span>Check Mail</span>
                        </a>
                      )}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-medium">Personal Email</label>
                    <p>{user.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-medium">Phone Number</label>
                    <p>{user.phoneNumber || "Not provided"}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-medium">Work Phone</label>
                    <p>{user.workPhone || "Not provided"}</p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-neutral-medium">Address</label>
                    <p>{user.address || "Not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Social Media Tab */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Social Media Profiles</CardTitle>
                    <CardDescription>Connect and manage your professional social profiles</CardDescription>
                  </div>
                  <Button 
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isPending}
                  >
                    {isEditing ? "Cancel" : "Edit Profiles"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-8">
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* LinkedIn */}
                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="flex items-center gap-2">
                          <LinkedinIcon className="w-4 h-4 text-[#0077B5]" />
                          LinkedIn
                        </Label>
                        <div className="relative">
                          <Input
                            id="linkedin"
                            name="linkedin"
                            value={profileData.linkedin || ""}
                            onChange={handleInputChange}
                            placeholder="linkedin.com/in/yourprofile"
                            disabled={!isEditing || isPending}
                            className="pl-10"
                          />
                          <LinkedinIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                          {profileData.linkedin && !isEditing && (
                            <a 
                              href={profileData.linkedin.startsWith('http') ? profileData.linkedin : `https://${profileData.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <ExternalLinkIcon className="w-4 h-4 text-primary" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {/* Twitter */}
                      <div className="space-y-2">
                        <Label htmlFor="twitter" className="flex items-center gap-2">
                          <TwitterIcon className="w-4 h-4 text-[#1DA1F2]" />
                          Twitter
                        </Label>
                        <div className="relative">
                          <Input
                            id="twitter"
                            name="twitter"
                            value={profileData.twitter || ""}
                            onChange={handleInputChange}
                            placeholder="twitter.com/yourusername"
                            disabled={!isEditing || isPending}
                            className="pl-10"
                          />
                          <TwitterIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                          {profileData.twitter && !isEditing && (
                            <a 
                              href={profileData.twitter.startsWith('http') ? profileData.twitter : `https://twitter.com/${profileData.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <ExternalLinkIcon className="w-4 h-4 text-primary" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {/* GitHub */}
                      <div className="space-y-2">
                        <Label htmlFor="github" className="flex items-center gap-2">
                          <GithubIcon className="w-4 h-4" />
                          GitHub
                        </Label>
                        <div className="relative">
                          <Input
                            id="github"
                            name="github"
                            value={profileData.github || ""}
                            onChange={handleInputChange}
                            placeholder="github.com/yourusername"
                            disabled={!isEditing || isPending}
                            className="pl-10"
                          />
                          <GithubIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                          {profileData.github && !isEditing && (
                            <a 
                              href={profileData.github.startsWith('http') ? profileData.github : `https://github.com/${profileData.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <ExternalLinkIcon className="w-4 h-4 text-primary" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {/* Behance */}
                      <div className="space-y-2">
                        <Label htmlFor="behance" className="flex items-center gap-2">
                          <Globe2Icon className="w-4 h-4 text-[#053eff]" />
                          Behance
                        </Label>
                        <div className="relative">
                          <Input
                            id="behance"
                            name="behance"
                            value={profileData.behance || ""}
                            onChange={handleInputChange}
                            placeholder="behance.net/yourusername"
                            disabled={!isEditing || isPending}
                            className="pl-10"
                          />
                          <Globe2Icon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                          {profileData.behance && !isEditing && (
                            <a 
                              href={profileData.behance.startsWith('http') ? profileData.behance : `https://behance.net/${profileData.behance}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <ExternalLinkIcon className="w-4 h-4 text-primary" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {/* Dribbble */}
                      <div className="space-y-2">
                        <Label htmlFor="dribbble" className="flex items-center gap-2">
                          <Globe2Icon className="w-4 h-4 text-[#ea4c89]" />
                          Dribbble
                        </Label>
                        <div className="relative">
                          <Input
                            id="dribbble"
                            name="dribbble"
                            value={profileData.dribbble || ""}
                            onChange={handleInputChange}
                            placeholder="dribbble.com/yourusername"
                            disabled={!isEditing || isPending}
                            className="pl-10"
                          />
                          <Globe2Icon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                          {profileData.dribbble && !isEditing && (
                            <a 
                              href={profileData.dribbble.startsWith('http') ? profileData.dribbble : `https://dribbble.com/${profileData.dribbble}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <ExternalLinkIcon className="w-4 h-4 text-primary" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {/* YouTube */}
                      <div className="space-y-2">
                        <Label htmlFor="youtube" className="flex items-center gap-2">
                          <Globe2Icon className="w-4 h-4 text-[#FF0000]" />
                          YouTube
                        </Label>
                        <div className="relative">
                          <Input
                            id="youtube"
                            name="youtube"
                            value={profileData.youtube || ""}
                            onChange={handleInputChange}
                            placeholder="youtube.com/c/yourchannel"
                            disabled={!isEditing || isPending}
                            className="pl-10"
                          />
                          <Globe2Icon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                          {profileData.youtube && !isEditing && (
                            <a 
                              href={profileData.youtube.startsWith('http') ? profileData.youtube : `https://youtube.com/c/${profileData.youtube}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <ExternalLinkIcon className="w-4 h-4 text-primary" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {/* Personal Website */}
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="website" className="flex items-center gap-2">
                          <Globe2Icon className="w-4 h-4" />
                          Personal Website
                        </Label>
                        <div className="relative">
                          <Input
                            id="website"
                            name="website"
                            value={profileData.website || ""}
                            onChange={handleInputChange}
                            placeholder="https://yourpersonalwebsite.com"
                            disabled={!isEditing || isPending}
                            className="pl-10"
                          />
                          <Globe2Icon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                          {profileData.website && !isEditing && (
                            <a 
                              href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <ExternalLinkIcon className="w-4 h-4 text-primary" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Social Media Sync Section */}
                    <div className="bg-gray-50 p-4 rounded-lg border mt-4">
                      <h3 className="text-lg font-medium mb-3">Sync with Accounts</h3>
                      <p className="text-sm text-neutral-medium mb-4">
                        Connect your social accounts to automatically sync profile information
                      </p>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex items-center justify-center gap-2"
                          disabled={!isEditing}
                        >
                          <LinkedinIcon className="w-4 h-4 text-[#0077B5]" />
                          Connect with LinkedIn
                        </Button>
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex items-center justify-center gap-2"
                          disabled={!isEditing}
                        >
                          <GithubIcon className="w-4 h-4" />
                          Connect with GitHub
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <Button 
                      type="submit" 
                      className="mt-6"
                      disabled={isPending}
                    >
                      {isPending ? "Saving..." : (
                        <>
                          <SaveIcon className="w-4 h-4 mr-2" />
                          Save Social Profiles
                        </>
                      )}
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your personal details and contact information</CardDescription>
                  </div>
                  <Button 
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={isPending}
                  >
                    {isEditing ? (
                      <>Cancel</>
                    ) : (
                      <>Edit Information</>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing || isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing || isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(XXX) XXX-XXXX"
                        disabled={!isEditing || isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthdate" className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        Date of Birth
                      </Label>
                      <Input
                        id="birthdate"
                        name="birthdate"
                        type="date"
                        disabled={!isEditing || isPending}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <MailIcon className="w-4 h-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing || isPending}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <HomeIcon className="w-4 h-4" />
                        Address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        disabled={!isEditing || isPending}
                      />
                    </div>
                    
                    {/* Job Area Field for Social Media Selection */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="jobArea" className="flex items-center gap-2">
                        <BriefcaseIcon className="w-4 h-4" />
                        Professional Area
                      </Label>
                      <Select
                        disabled={!isEditing || isPending}
                        value={profileData.jobArea}
                        onValueChange={(value) => 
                          setProfileData(prev => ({ ...prev, jobArea: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your professional area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="hr">HR</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* HR Contact Information */}
                    <div className="space-y-4 md:col-span-2 mt-4 p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-base font-medium flex items-center gap-2">
                        <BuildingIcon className="w-4 h-4 text-blue-600" />
                        HR Contact Information
                      </h3>
                      <p className="text-sm text-neutral-medium">
                        For general HR inquiries, please contact: <a href="mailto:hr@wugweb.design" className="text-blue-600 font-medium">hr@wugweb.design</a>
                      </p>
                      <p className="text-sm text-neutral-medium mt-2">
                        HR Manager: <span className="font-medium">Vedanshu Srivastava</span> (<a href="mailto:vedanshu@wugweb.com" className="text-blue-600">vedanshu@wugweb.com</a>)
                      </p>
                    </div>
                    
                    {/* Social Media Links */}
                    <div className="space-y-4 md:col-span-2 mt-4">
                      <h3 className="text-base font-medium">Social & Professional Links</h3>
                      <p className="text-sm text-neutral-medium mb-4">
                        {isEditing 
                          ? "Add your professional profiles. Links shown are based on your professional area." 
                          : "Your professional profiles and social media links."}
                      </p>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        {getSocialLinksForJobArea(profileData.jobArea).map(link => (
                          <div className="space-y-2" key={link.id}>
                            <Label htmlFor={link.id} className="flex items-center gap-2">
                              {link.icon}
                              {link.label}
                            </Label>
                            <Input
                              id={link.id}
                              name={link.id}
                              value={profileData[link.id as keyof typeof profileData] as string}
                              onChange={handleInputChange}
                              placeholder={`Your ${link.label} URL`}
                              disabled={!isEditing || isPending}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <Button 
                      type="submit" 
                      className="mt-6"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>Saving...</>
                      ) : (
                        <>
                          <SaveIcon className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Job Information Tab */}
          <TabsContent value="job">
            <Card>
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
                <CardDescription>Your employment and position details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-medium">Employee ID</label>
                    <p>{user.id}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-medium">Job Title</label>
                    <p>{user.position || "Software Developer"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-medium">Department</label>
                    <p>{user.department || "Engineering"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-medium">Location</label>
                    <p>New York Office</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-medium">Start Date</label>
                    <p>January 15, 2022</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-medium">Employment Type</label>
                    <p>Full Time</p>
                  </div>
                  
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-neutral-medium">Manager</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p>John Doe</p>
                        <p className="text-sm text-neutral-medium">Director of Engineering</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-medium text-neutral-medium">Education</label>
                    <div className="flex items-center gap-2 mt-1">
                      <GraduationCapIcon className="w-5 h-5 text-neutral-medium" />
                      <div>
                        <p>Bachelor of Science in Computer Science</p>
                        <p className="text-sm text-neutral-medium">University of Technology, 2018-2022</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Display Professional Links */}
                  <div className="space-y-3 md:col-span-2 mt-4">
                    <Separator />
                    <label className="text-lg font-medium">Professional Profiles</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {getSocialLinksForJobArea(profileData.jobArea || user.jobArea || "engineering")
                        .filter(link => {
                          const url = (user[link.id as keyof typeof user] as string) || 
                                     (profileData[link.id as keyof typeof profileData] as string);
                          return url && url.trim() !== '';
                        })
                        .map(link => {
                          const url = (user[link.id as keyof typeof user] as string) || 
                                     (profileData[link.id as keyof typeof profileData] as string);
                          return (
                            <a 
                              key={link.id}
                              href={url.startsWith('http') ? url : `https://${url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 rounded-md border hover:bg-neutral-lightest transition-colors"
                            >
                              <div className="p-2 bg-primary/10 rounded-md">
                                {link.icon}
                              </div>
                              <div>
                                <p className="font-medium">{link.label}</p>
                                <p className="text-xs text-neutral-medium truncate max-w-xs">
                                  {url}
                                </p>
                              </div>
                            </a>
                          );
                        })}
                        
                      {getSocialLinksForJobArea(profileData.jobArea || user.jobArea || "engineering")
                        .filter(link => {
                          const url = (user[link.id as keyof typeof user] as string) || 
                                     (profileData[link.id as keyof typeof profileData] as string);
                          return !url || url.trim() === '';
                        }).length > 0 && (
                        <div className="md:col-span-2 text-center p-4 border rounded-md border-dashed">
                          <p className="text-neutral-medium text-sm">
                            Add your professional profiles in the Personal Information tab to display them here.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Financial Information Tab */}
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Financial Information</CardTitle>
                    <CardDescription>Your salary and banking details</CardDescription>
                  </div>
                  <Button variant="outline">Edit Information</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-medium">Current Salary</label>
                    <p className="text-lg font-medium">$85,000 / year</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-neutral-medium">Last Increment</label>
                    <p>April 1, 2024 (5%)</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Separator className="my-4" />
                    <h3 className="text-lg font-medium mb-4">Banking Information</h3>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-neutral-medium">Bank Name</label>
                        <div className="flex items-center gap-2">
                          <LandmarkIcon className="w-4 h-4 text-neutral-medium" />
                          <p>First National Bank</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-neutral-medium">Account Type</label>
                        <p>Checking</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-neutral-medium">Account Number</label>
                        <p>XXXX-XXXX-XXXX-4321</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-neutral-medium">Routing Number</label>
                        <p>XXXXXXXXX</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Separator className="my-4" />
                    <h3 className="text-lg font-medium mb-4">Tax Information</h3>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-neutral-medium">Tax Status</label>
                        <p>Single</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-neutral-medium">Allowances</label>
                        <p>1</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-neutral-medium">Tax ID (SSN)</label>
                        <p>XXX-XX-9876</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payslips Tab */}
          <TabsContent value="payslips">
            <Card>
              <CardHeader>
                <CardTitle>Payslips</CardTitle>
                <CardDescription>View and download your payment statements</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>April 2025</TableCell>
                      <TableCell>April 25, 2025</TableCell>
                      <TableCell>$4,854.23</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>March 2025</TableCell>
                      <TableCell>March 25, 2025</TableCell>
                      <TableCell>$4,854.23</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>February 2025</TableCell>
                      <TableCell>February 25, 2025</TableCell>
                      <TableCell>$4,854.23</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>January 2025</TableCell>
                      <TableCell>January 25, 2025</TableCell>
                      <TableCell>$4,854.23</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>Access your important documents and files</CardDescription>
                  </div>
                  <Button>
                    <FileIcon className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Sample documents */}
                  <div className="border rounded-lg p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <FileTextIcon className="w-5 h-5 text-blue-500" />
                      <h3 className="font-medium">Employment Contract</h3>
                    </div>
                    <p className="text-sm text-neutral-medium mb-4">Signed on January 10, 2022</p>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-xs text-neutral-medium">PDF • 2.4 MB</span>
                      <Button size="sm" variant="ghost">
                        <DownloadIcon className="w-4 h-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <FileTextIcon className="w-5 h-5 text-blue-500" />
                      <h3 className="font-medium">Tax Form W-4</h3>
                    </div>
                    <p className="text-sm text-neutral-medium mb-4">Updated on February 15, 2024</p>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-xs text-neutral-medium">PDF • 1.2 MB</span>
                      <Button size="sm" variant="ghost">
                        <DownloadIcon className="w-4 h-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <FileTextIcon className="w-5 h-5 text-blue-500" />
                      <h3 className="font-medium">Health Insurance Policy</h3>
                    </div>
                    <p className="text-sm text-neutral-medium mb-4">Valid until December 31, 2025</p>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-xs text-neutral-medium">PDF • 3.1 MB</span>
                      <Button size="sm" variant="ghost">
                        <DownloadIcon className="w-4 h-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <FileTextIcon className="w-5 h-5 text-blue-500" />
                      <h3 className="font-medium">401(k) Plan Summary</h3>
                    </div>
                    <p className="text-sm text-neutral-medium mb-4">Updated on March 10, 2024</p>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-xs text-neutral-medium">PDF • 1.8 MB</span>
                      <Button size="sm" variant="ghost">
                        <DownloadIcon className="w-4 h-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <FileTextIcon className="w-5 h-5 text-blue-500" />
                      <h3 className="font-medium">Employee Handbook</h3>
                    </div>
                    <p className="text-sm text-neutral-medium mb-4">Version 2.3 - 2025 Edition</p>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-xs text-neutral-medium">PDF • 5.7 MB</span>
                      <Button size="sm" variant="ghost">
                        <DownloadIcon className="w-4 h-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onboarding Tab */}
          <TabsContent value="onboarding">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Onboarding Progress</CardTitle>
                    <CardDescription>Track your new employee onboarding journey</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingOnboarding ? (
                  <div className="space-y-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <div className="flex justify-between mb-2">
                        <h3 className="text-sm font-medium">Overall Progress</h3>
                        <span className="text-sm font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="space-y-4">
                      {onboardingSteps.map((stepItem) => (
                        <div 
                          key={stepItem.id} 
                          className="border rounded-lg p-4 transition-all hover:shadow-md"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-medium">{stepItem.step.name}</h3>
                              <p className="text-neutral-medium mt-1">{stepItem.step.description || 'No description available'}</p>
                              
                              <div className="mt-4 space-y-1">
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="w-4 h-4 text-neutral-medium" />
                                  <span className="text-sm">
                                    {stepItem.completedAt 
                                      ? `Completed on ${formatDate(stepItem.completedAt)}` 
                                      : `Due by: To be determined`}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <FileTextIcon className="w-4 h-4 text-neutral-medium" />
                                  <span className="text-sm">
                                    Step {stepItem.step.order}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-1.5 mb-2">
                                {stepItem.status === "completed" ? (
                                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                ) : stepItem.status === "in_progress" ? (
                                  <ClockIcon className="w-5 h-5 text-amber-500" />
                                ) : (
                                  <CircleIcon className="w-5 h-5 text-gray-300" />
                                )}
                                <span className="text-sm font-medium capitalize">
                                  {stepItem.status.replace("_", " ")}
                                </span>
                              </div>
                              
                              <div className="flex gap-2">
                                {stepItem.status !== "completed" && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    disabled={stepItem.status === "in_progress" || isUpdating}
                                    onClick={() => updateStepStatus({ 
                                      id: stepItem.id, 
                                      status: "in_progress" 
                                    })}
                                  >
                                    Start
                                  </Button>
                                )}
                                
                                {stepItem.status !== "not_started" && stepItem.status !== "completed" && (
                                  <Button 
                                    size="sm"
                                    disabled={isUpdating}
                                    onClick={() => updateStepStatus({ 
                                      id: stepItem.id, 
                                      status: "completed" 
                                    })}
                                  >
                                    Complete
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
