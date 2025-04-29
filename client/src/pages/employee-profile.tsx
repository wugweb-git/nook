import { useState } from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { SalarySlipHolidays } from "@/components/salary-slip-holidays";
import { format } from "date-fns";
import {
  User,
  Mail,
  Briefcase,
  Phone,
  MapPin,
  FileText,
  Shield,
  CreditCard,
  Calendar,
  Clock,
  Building,
  Download,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function EmployeeProfile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal-info");
  
  // Calculate initials for avatar fallback
  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };
  
  // Format data fields with fallback for empty values
  const formatField = (value: any, prefix = "") => {
    if (!value) return "Not provided";
    if (prefix) return `${prefix}${value}`;
    return value;
  };
  
  if (!user) {
    return (
      <Layout title="Employee Profile">
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="py-10 text-center">
              <p>Loading user information...</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Employee Profile">
      <div className="container mx-auto py-6">
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar || ""} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                  <div className="flex items-center gap-1 text-neutral-medium">
                    <Briefcase className="h-4 w-4" />
                    <span>{formatField(user.position)}</span>
                    {user.department && (
                      <>
                        <span>•</span>
                        <span>{user.department}</span>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">{formatField(user.employmentType, "")}</Badge>
                    <Badge variant="outline">{formatField(user.workLocation, "")}</Badge>
                    {user.role === "admin" && <Badge>Admin</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Export Information</span>
                </Button>
                {user.companyEmail && (
                  <a 
                    href="https://mail.hostinger.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Check Company Email</span>
                  </a>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal-info" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-5 gap-2">
                <TabsTrigger value="personal-info">
                  <User className="h-4 w-4 mr-2" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="job-info">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Job
                </TabsTrigger>
                <TabsTrigger value="government-id">
                  <Shield className="h-4 w-4 mr-2" />
                  Government IDs
                </TabsTrigger>
                <TabsTrigger value="financial">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Financial
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
              </TabsList>
              
              {/* Personal Information Tab */}
              <TabsContent value="personal-info">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Basic Information
                    </h3>
                    <dl className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Full Name</dt>
                        <dd className="mt-1">{user.firstName} {user.lastName}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Employee ID</dt>
                        <dd className="mt-1">{formatField(user.employeeId)}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Gender</dt>
                        <dd className="mt-1">{formatField(user.gender)}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Username</dt>
                        <dd className="mt-1">{user.username}</dd>
                      </div>
                    </dl>
                    
                    <h3 className="text-lg font-semibold mt-8 mb-4 flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      Contact Information
                    </h3>
                    <dl className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Personal Email</dt>
                        <dd className="mt-1">{user.email}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Company Email</dt>
                        <dd className="mt-1 flex items-center gap-2">
                          {formatField(user.companyEmail)}
                          {user.companyEmail && (
                            <a 
                              href="https://mail.hostinger.com" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-primary hover:underline"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              <span>Open</span>
                            </a>
                          )}
                        </dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Phone Number</dt>
                        <dd className="mt-1">{formatField(user.phoneNumber)}</dd>
                      </div>
                    </dl>
                    
                    <h3 className="text-lg font-semibold mt-8 mb-4 flex items-center gap-2">
                      <ExternalLink className="h-5 w-5 text-primary" />
                      Social & Professional Links
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {user.linkedin && (
                        <a
                          href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-neutral-medium hover:text-primary transition-colors p-2 rounded-md border hover:border-primary"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                          <span>LinkedIn</span>
                        </a>
                      )}
                      
                      {user.github && (
                        <a
                          href={user.github.startsWith('http') ? user.github : `https://github.com/${user.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-neutral-medium hover:text-primary transition-colors p-2 rounded-md border hover:border-primary"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          <span>GitHub</span>
                        </a>
                      )}
                      
                      {user.behance && (
                        <a
                          href={user.behance.startsWith('http') ? user.behance : `https://behance.net/${user.behance}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-neutral-medium hover:text-primary transition-colors p-2 rounded-md border hover:border-primary"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
                          </svg>
                          <span>Behance</span>
                        </a>
                      )}
                      
                      {user.dribbble && (
                        <a
                          href={user.dribbble.startsWith('http') ? user.dribbble : `https://dribbble.com/${user.dribbble}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-neutral-medium hover:text-primary transition-colors p-2 rounded-md border hover:border-primary"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.628 0-12 5.373-12 12s5.372 12 12 12 12-5.373 12-12-5.372-12-12-12zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1 4.165-2.358 5.548-4.082 1.35 1.594 2.197 3.619 2.322 5.835zm-3.842-7.282c-1.205 1.554-2.868 2.783-4.986 3.68-1.016-1.861-2.178-3.676-3.488-5.438.779-.197 1.591-.314 2.431-.314 2.275 0 4.368.779 6.043 2.072zm-10.516-.993c1.331 1.742 2.511 3.538 3.537 5.381-2.43.715-5.331 1.082-8.684 1.105.692-2.835 2.601-5.193 5.147-6.486zm-5.44 8.834l.013-.256c3.849-.005 7.169-.448 9.95-1.322.233.475.456.952.67 1.432-3.38 1.057-6.165 3.222-8.337 6.48-1.432-1.719-2.296-3.927-2.296-6.334zm3.829 7.81c1.969-3.088 4.482-5.098 7.598-6.027.928 2.42 1.609 4.91 2.043 7.46-3.349 1.291-6.953.666-9.641-1.433zm11.586.43c-.438-2.353-1.08-4.653-1.92-6.897 1.876-.265 3.94-.196 6.199.196-.437 2.786-2.028 5.192-4.279 6.701z" />
                          </svg>
                          <span>Dribbble</span>
                        </a>
                      )}
                      
                      {user.twitter && (
                        <a
                          href={user.twitter.startsWith('http') ? user.twitter : `https://twitter.com/${user.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-neutral-medium hover:text-primary transition-colors p-2 rounded-md border hover:border-primary"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                          </svg>
                          <span>Twitter</span>
                        </a>
                      )}
                      
                      {user.website && (
                        <a
                          href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-neutral-medium hover:text-primary transition-colors p-2 rounded-md border hover:border-primary"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                          </svg>
                          <span>Personal Website</span>
                        </a>
                      )}
                      
                      {!user.linkedin && !user.github && !user.behance && !user.dribbble && !user.twitter && !user.website && (
                        <div className="text-neutral-medium text-sm p-4 bg-neutral-50 rounded-md border border-dashed">
                          No social or professional links have been added yet.
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Address Information
                    </h3>
                    <dl className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Current Address</dt>
                        <dd className="mt-1">{formatField(user.currentAddress)}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">City</dt>
                        <dd className="mt-1">{formatField(user.city)}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">State</dt>
                        <dd className="mt-1">{formatField(user.state)}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Pincode</dt>
                        <dd className="mt-1">{formatField(user.pincode)}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Country</dt>
                        <dd className="mt-1">{formatField(user.country)}</dd>
                      </div>
                    </dl>
                    
                    <h3 className="text-lg font-semibold mt-8 mb-4 flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      Emergency Contact
                    </h3>
                    <dl className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Name</dt>
                        <dd className="mt-1">{formatField(user.emergencyContactName)}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Relationship</dt>
                        <dd className="mt-1">{formatField(user.emergencyContactRelation)}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Phone Number</dt>
                        <dd className="mt-1">{formatField(user.emergencyContactNumber)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </TabsContent>
              
              {/* Job Information Tab */}
              <TabsContent value="job-info">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Job Details
                    </h3>
                    <dl className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Designation</dt>
                        <dd className="mt-1">{formatField(user.position)}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Department</dt>
                        <dd className="mt-1">{formatField(user.department)}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Job Area</dt>
                        <dd className="mt-1">{formatField(user.jobArea)}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Employment Type</dt>
                        <dd className="mt-1">{formatField(user.employmentType)}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Work Location</dt>
                        <dd className="mt-1">{formatField(user.workLocation)}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Employment Timeline
                    </h3>
                    <dl className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Joining Date</dt>
                        <dd className="mt-1">
                          {user.joiningDate ? format(new Date(user.joiningDate), "dd MMM yyyy") : "Not provided"}
                        </dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Probation End Date</dt>
                        <dd className="mt-1">
                          {user.probationEndDate ? format(new Date(user.probationEndDate), "dd MMM yyyy") : "Not provided"}
                        </dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Employment Status</dt>
                        <dd className="mt-1">
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                            Active
                          </Badge>
                        </dd>
                      </div>
                    </dl>
                    
                    <h3 className="text-lg font-semibold mt-8 mb-4 flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary" />
                      Office Information
                    </h3>
                    <dl className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Office Address</dt>
                        <dd className="mt-1">WeWork Berger Delhi One, Floor 19,<br />C-001/A2, Sector 16B, Noida, UP-201301, IN</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">HR Contact</dt>
                        <dd className="mt-1">
                          <a href="mailto:hr@wugweb.design" className="text-primary hover:underline">hr@wugweb.design</a>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                <Separator className="my-8" />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Holidays
                  </h3>
                  <SalarySlipHolidays year={new Date().getFullYear()} month={new Date().getMonth()} />
                </div>
              </TabsContent>
              
              {/* Government IDs Tab */}
              <TabsContent value="government-id">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Government Issued Identification
                    </h3>
                    <div className="space-y-6">
                      <Card className="border-dashed">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">PAN Card</CardTitle>
                          <CardDescription>Permanent Account Number</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="font-mono text-lg">{formatField(user.panNumber)}</div>
                          <div className="mt-4 flex items-center text-sm text-neutral-medium">
                            <span className="flex items-center gap-1">
                              <Shield className="h-3.5 w-3.5 text-green-600" />
                              <span className="text-green-600">Verified</span>
                            </span>
                            <ChevronRight className="h-4 w-4 mx-2" />
                            <span>Document on file</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-dashed">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Aadhaar Card</CardTitle>
                          <CardDescription>Unique Identification Number</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="font-mono text-lg">{formatField(user.aadhaarNumber)}</div>
                          <div className="mt-4 flex items-center text-sm text-neutral-medium">
                            <span className="flex items-center gap-1">
                              <Shield className="h-3.5 w-3.5 text-green-600" />
                              <span className="text-green-600">Verified</span>
                            </span>
                            <ChevronRight className="h-4 w-4 mx-2" />
                            <span>Document on file</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-dashed">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Passport</CardTitle>
                          <CardDescription>International Travel Document</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="font-mono text-lg">{formatField(user.passportNumber)}</div>
                          <div className="mt-4 flex items-center text-sm text-neutral-medium">
                            <span className="flex items-center gap-1">
                              <Shield className="h-3.5 w-3.5 text-amber-600" />
                              <span className="text-amber-600">Pending Verification</span>
                            </span>
                            <ChevronRight className="h-4 w-4 mx-2" />
                            <span>Document on file</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Information Privacy Policy</h3>
                    <p className="text-neutral-medium mb-4">
                      Your identification documents are stored securely and only accessed by authorized HR personnel 
                      for verification purposes, legal compliance, and as required by Indian labor laws.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Usage of Information</h4>
                        <p className="text-sm text-neutral-medium">
                          Your ID details are used for employment verification, tax compliance, 
                          statutory contributions, and other legal requirements.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Security Measures</h4>
                        <p className="text-sm text-neutral-medium">
                          Documents are stored with encryption and access controls in place. Regular 
                          security audits ensure your data is protected at all times.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">Data Retention</h4>
                        <p className="text-sm text-neutral-medium">
                          Information is retained for the duration of your employment plus any legally 
                          mandated retention periods, after which it is securely deleted.
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="mt-6">View Full Privacy Policy</Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Financial Tab */}
              <TabsContent value="financial">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Salary & Bank Information
                    </h3>
                    <dl className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Bank Name</dt>
                        <dd className="mt-1">{formatField(user.bankName)}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">Account Number</dt>
                        <dd className="mt-1">{formatField(user.bankAccountNumber)}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">IFSC Code</dt>
                        <dd className="mt-1">{formatField(user.ifscCode)}</dd>
                      </div>
                    </dl>
                    
                    <h3 className="text-lg font-semibold mt-8 mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      PF Information
                    </h3>
                    <dl className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">PF Number</dt>
                        <dd className="mt-1">{formatField(user.pfNumber)}</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-neutral-medium">UAN Number</dt>
                        <dd className="mt-1">{formatField(user.uanNumber)}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div className="bg-neutral-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Salary Information</h3>
                    <p className="text-neutral-medium mb-4">
                      Your detailed salary information can be accessed through your monthly salary slips.
                      The latest salary slips are available in the documents section.
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-4 bg-white rounded border">
                        <h4 className="font-medium">April 2025</h4>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-neutral-medium">Latest salary slip</span>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 bg-white rounded border">
                        <h4 className="font-medium">March 2025</h4>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-neutral-medium">Previous month</span>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 bg-white rounded border">
                        <h4 className="font-medium">February 2025</h4>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-neutral-medium">Previous month</span>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        View All Salary Slips
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Documents Tab */}
              <TabsContent value="documents">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Employment Documents
                    </h3>
                    
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-4">
                              <div className="p-2 bg-primary/10 rounded text-primary">
                                <FileText className="h-8 w-8" />
                              </div>
                              <div>
                                <h4 className="font-medium">Employment Contract</h4>
                                <p className="text-sm text-neutral-medium">Signed on joining date</p>
                                <Badge variant="outline" className="mt-2">Employment</Badge>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-4">
                              <div className="p-2 bg-primary/10 rounded text-primary">
                                <FileText className="h-8 w-8" />
                              </div>
                              <div>
                                <h4 className="font-medium">Non-Disclosure Agreement</h4>
                                <p className="text-sm text-neutral-medium">Signed on joining date</p>
                                <Badge variant="outline" className="mt-2">Legal</Badge>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-4">
                              <div className="p-2 bg-primary/10 rounded text-primary">
                                <FileText className="h-8 w-8" />
                              </div>
                              <div>
                                <h4 className="font-medium">Employee Handbook</h4>
                                <p className="text-sm text-neutral-medium">Company policies and guidelines</p>
                                <Badge variant="outline" className="mt-2">Policies</Badge>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Uploaded Identity Documents
                    </h3>
                    
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-4">
                              <div className="p-2 bg-green-50 rounded text-green-600">
                                <FileText className="h-8 w-8" />
                              </div>
                              <div>
                                <h4 className="font-medium">PAN Card</h4>
                                <p className="text-sm text-neutral-medium">Uploaded during onboarding</p>
                                <div className="flex items-center mt-2 text-green-600 text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  <span>Verified</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-4">
                              <div className="p-2 bg-green-50 rounded text-green-600">
                                <FileText className="h-8 w-8" />
                              </div>
                              <div>
                                <h4 className="font-medium">Aadhaar Card</h4>
                                <p className="text-sm text-neutral-medium">Uploaded during onboarding</p>
                                <div className="flex items-center mt-2 text-green-600 text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  <span>Verified</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-4">
                              <div className="p-2 bg-amber-50 rounded text-amber-600">
                                <FileText className="h-8 w-8" />
                              </div>
                              <div>
                                <h4 className="font-medium">Passport</h4>
                                <p className="text-sm text-neutral-medium">Uploaded during onboarding</p>
                                <div className="flex items-center mt-2 text-amber-600 text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>Verification pending</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
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