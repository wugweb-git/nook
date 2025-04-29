import { useState } from "react";
import Layout from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, PhoneIcon, MailIcon, MapPinIcon, UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

// Mock data for employee directory
const employees = [
  {
    id: 1,
    name: "Emily Smith",
    role: "Marketing Manager",
    department: "Marketing",
    email: "emily.smith@wugweb.com",
    phone: "+91 98765 43210",
    location: "Mumbai",
    avatar: null,
    skills: ["Marketing Strategy", "Content Creation", "Social Media", "SEO"],
    projects: ["Website Redesign", "Social Media Campaign"],
  },
  {
    id: 2,
    name: "Rajiv Kumar",
    role: "Senior Developer",
    department: "Technology",
    email: "rajiv.kumar@wugweb.com",
    phone: "+91 87654 32109",
    location: "Bangalore",
    avatar: null,
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    projects: ["Mobile App", "Dashboard Enhancements"],
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "HR Specialist",
    department: "Human Resources",
    email: "priya.patel@wugweb.com",
    phone: "+91 76543 21098",
    location: "Delhi",
    avatar: null,
    skills: ["Recruitment", "Employee Relations", "Training", "Compensation"],
    projects: ["Employee Onboarding", "Culture Building"],
  },
  {
    id: 4,
    name: "Ananya Chatterjee",
    role: "UX Designer",
    department: "Design",
    email: "ananya.c@wugweb.com",
    phone: "+91 65432 10987",
    location: "Pune",
    avatar: null,
    skills: ["UI/UX Design", "Wireframing", "Prototyping", "User Research"],
    projects: ["Mobile App UI", "Design System"],
  },
  {
    id: 5,
    name: "Suresh Venkat",
    role: "Finance Director",
    department: "Finance",
    email: "suresh.v@wugweb.com",
    phone: "+91 54321 09876",
    location: "Chennai",
    avatar: null,
    skills: ["Financial Planning", "Budgeting", "Analysis", "Reporting"],
    projects: ["Annual Budget", "Cost Optimization"],
  },
  {
    id: 6,
    name: "Neha Sharma",
    role: "Product Manager",
    department: "Product",
    email: "neha.s@wugweb.com",
    phone: "+91 87654 32109",
    location: "Hyderabad",
    avatar: null,
    skills: ["Product Strategy", "Roadmapping", "User Stories", "Market Research"],
    projects: ["Product Launch", "Feature Development"],
  },
];

export default function EmployeeDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  
  // Get unique departments for filtering
  const departments = Array.from(new Set(employees.map(emp => emp.department)));
  
  // Filter employees based on search query and department filter
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = departmentFilter ? employee.department === departmentFilter : true;
    
    return matchesSearch && matchesDepartment;
  });

  // Function to get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Layout title="Employee Directory">
      <div className="container mx-auto p-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-96">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-medium h-4 w-4" />
            <Input
              type="text"
              placeholder="Search employees by name, role, or department..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4 items-center">
            <Tabs defaultValue="all" className="w-auto">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setDepartmentFilter(null)}>
                  All
                </TabsTrigger>
                {departments.map(dept => (
                  <TabsTrigger 
                    key={dept} 
                    value={dept}
                    onClick={() => setDepartmentFilter(dept)}
                  >
                    {dept}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <div className="flex gap-2">
              <Button 
                variant={viewMode === "grid" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Grid
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>
          </div>
        </div>
        
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map(employee => (
              <Link key={employee.id} href={`/employee-profile/${employee.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        {employee.avatar && <AvatarImage src={employee.avatar} alt={employee.name} />}
                        <AvatarFallback className="text-lg">{getInitials(employee.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-medium">{employee.name}</h3>
                        <p className="text-neutral-medium">{employee.role}</p>
                        <Badge variant="outline" className="mt-1">{employee.department}</Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <MailIcon className="h-4 w-4 mr-2 text-neutral-medium" />
                        <span className="text-neutral-dark">{employee.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <PhoneIcon className="h-4 w-4 mr-2 text-neutral-medium" />
                        <span className="text-neutral-dark">{employee.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPinIcon className="h-4 w-4 mr-2 text-neutral-medium" />
                        <span className="text-neutral-dark">{employee.location}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1 mt-2">
                        {employee.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {employee.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{employee.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEmployees.map(employee => (
              <Link key={employee.id} href={`/employee-profile/${employee.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          {employee.avatar && <AvatarImage src={employee.avatar} alt={employee.name} />}
                          <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{employee.name}</h3>
                          <div className="flex items-center text-sm text-neutral-medium">
                            <span>{employee.role}</span>
                            <span className="mx-2">•</span>
                            <span>{employee.department}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="hidden md:flex items-center text-sm">
                          <MailIcon className="h-4 w-4 mr-2 text-neutral-medium" />
                          <span className="text-neutral-dark">{employee.email}</span>
                        </div>
                        <div className="hidden md:flex items-center text-sm">
                          <PhoneIcon className="h-4 w-4 mr-2 text-neutral-medium" />
                          <span className="text-neutral-dark">{employee.phone}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPinIcon className="h-4 w-4 mr-2 text-neutral-medium" />
                          <span className="text-neutral-dark">{employee.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
        
        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-light/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="h-8 w-8 text-neutral-medium" />
            </div>
            <h3 className="text-lg font-medium mb-2">No employees found</h3>
            <p className="text-neutral-medium mb-4">
              Try adjusting your search or filter to find what you're looking for
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setDepartmentFilter(null);
            }}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}