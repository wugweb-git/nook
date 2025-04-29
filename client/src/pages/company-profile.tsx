import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Building2Icon, 
  MapPinIcon, 
  GlobeIcon, 
  PhoneIcon, 
  MailIcon, 
  UsersIcon, 
  TrendingUpIcon,
  CalendarIcon,
  BriefcaseIcon,
  AwardIcon,
  HeartIcon,
  Target
} from "lucide-react";

// Import Wugweb logo
import wugwebLogo from "@assets/Wugweb Logo.png";

export default function CompanyProfile() {
  const companyData = {
    name: "Wugweb",
    logo: wugwebLogo,
    tagline: "Transforming Digital Experiences",
    foundedYear: 2018,
    headquarters: "Mumbai, India",
    otherLocations: ["Bangalore", "Delhi", "Pune"],
    website: "https://www.wugweb.com",
    phone: "+91 22 1234 5678",
    email: "info@wugweb.com",
    employeeCount: 250,
    industries: ["Technology", "Software Development", "Digital Marketing", "UX/UI Design"],
    overview: `Wugweb is a leading digital transformation company specializing in web development, mobile applications, and innovative technology solutions. Since our founding in 2018, we have been committed to helping businesses achieve their digital goals through cutting-edge technology and exceptional user experiences.
    
    Our team of talented developers, designers, and strategists work collaboratively to deliver solutions that drive business growth and enhance customer engagement. We pride ourselves on our ability to understand our clients' unique challenges and create tailored solutions that exceed expectations.`,
    mission: "To empower businesses with transformative digital solutions that drive growth and innovation.",
    vision: "To be the global leader in digital transformation, known for our innovative approaches and exceptional client outcomes.",
    values: [
      {
        name: "Innovation",
        description: "We constantly push boundaries and explore new technologies to deliver cutting-edge solutions."
      },
      {
        name: "Excellence",
        description: "We are committed to delivering the highest quality work in everything we do."
      },
      {
        name: "Collaboration",
        description: "We believe in the power of teamwork and partnership to achieve extraordinary results."
      },
      {
        name: "Integrity",
        description: "We conduct business with honesty, transparency, and ethical standards."
      },
      {
        name: "Client Focus",
        description: "We prioritize our clients' success and build long-term relationships based on trust."
      }
    ],
    services: [
      "Web Development",
      "Mobile App Development",
      "UX/UI Design",
      "E-commerce Solutions",
      "Digital Marketing",
      "Cloud Services",
      "AI & Machine Learning Solutions",
      "IT Consulting"
    ],
    leadership: [
      {
        name: "Vikram Mehta",
        title: "CEO & Founder",
        bio: "With over 15 years of experience in technology and business leadership, Vikram founded Wugweb with a vision to transform how businesses leverage digital technology."
      },
      {
        name: "Ananya Sharma",
        title: "CTO",
        bio: "A technology innovator with extensive experience in software architecture and emerging technologies, Ananya leads our technical strategy and implementation."
      },
      {
        name: "Rahul Kapoor",
        title: "COO",
        bio: "Rahul brings operational excellence to Wugweb, ensuring our processes and delivery systems consistently exceed client expectations."
      }
    ],
    clientsCount: 150,
    successfulProjects: 500,
    awards: [
      "Best Tech Startup 2020 - TechIndia Awards",
      "Innovation Excellence Award 2021 - Digital Business Awards",
      "Top Web Development Company 2022 - Clutch",
      "Great Place to Work Certified 2023"
    ],
    benefits: [
      "Comprehensive health insurance",
      "Flexible work arrangements",
      "Professional development opportunities",
      "Competitive compensation",
      "Regular team building events",
      "Mental health support",
      "Paid parental leave",
      "Annual performance bonuses"
    ],
    socialResponsibility: [
      "Digital Literacy Program for underprivileged communities",
      "Annual tree planting initiatives",
      "Pro-bono services for select non-profit organizations",
      "Sustainable office practices and carbon footprint reduction"
    ]
  };

  return (
    <Layout title="Company Profile">
      <div className="container mx-auto p-6">
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              <div className="w-32 h-32 rounded-lg overflow-hidden flex items-center justify-center bg-black p-4">
                <img 
                  src={companyData.logo} 
                  alt="Wugweb Logo" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl font-bold mb-2">{companyData.name}</h1>
                <p className="text-neutral-medium text-lg mb-4">{companyData.tagline}</p>
                
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
                  {companyData.industries.map((industry, index) => (
                    <Badge key={index} variant="secondary">{industry}</Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="flex items-center">
                    <Building2Icon className="h-5 w-5 mr-2 text-neutral-medium" />
                    <div>
                      <span className="text-sm text-neutral-medium">Founded</span>
                      <p>{companyData.foundedYear}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2 text-neutral-medium" />
                    <div>
                      <span className="text-sm text-neutral-medium">Headquarters</span>
                      <p>{companyData.headquarters}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 mr-2 text-neutral-medium" />
                    <div>
                      <span className="text-sm text-neutral-medium">Employees</span>
                      <p>{companyData.employeeCount}+</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <GlobeIcon className="h-5 w-5 mr-2 text-neutral-medium" />
                    <div>
                      <span className="text-sm text-neutral-medium">Website</span>
                      <p className="truncate max-w-[180px]">{companyData.website}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leadership">Leadership</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="values">Our Values</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>About Wugweb</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-neutral-dark whitespace-pre-line">{companyData.overview}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <TrendingUpIcon className="h-5 w-5 mr-2 text-primary" /> 
                          Our Mission
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{companyData.mission}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Target className="h-5 w-5 mr-2 text-primary" /> 
                          Our Vision
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{companyData.vision}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <MailIcon className="h-5 w-5 mr-3 text-neutral-medium" />
                        <span>{companyData.email}</span>
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="h-5 w-5 mr-3 text-neutral-medium" />
                        <span>{companyData.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 mr-3 text-neutral-medium" />
                        <span>{companyData.headquarters}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-4">Other Locations</h3>
                    <div className="flex flex-wrap gap-2">
                      {companyData.otherLocations.map((location, index) => (
                        <Badge key={index} variant="outline" className="flex items-center">
                          <MapPinIcon className="h-3 w-3 mr-1" />
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leadership">
            <Card>
              <CardHeader>
                <CardTitle>Leadership Team</CardTitle>
                <CardDescription>Meet the people who lead Wugweb's vision and strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {companyData.leadership.map((leader, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="bg-neutral-50 dark:bg-neutral-900">
                        <CardTitle className="text-xl">{leader.name}</CardTitle>
                        <CardDescription>{leader.title}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p>{leader.bio}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Our Services</CardTitle>
                <CardDescription>Comprehensive digital solutions to meet your business needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {companyData.services.map((service, index) => (
                    <Card key={index} className="flex flex-col justify-between">
                      <CardHeader className="pb-2">
                        <BriefcaseIcon className="h-8 w-8 text-primary mb-2" />
                        <CardTitle className="text-lg">{service}</CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="values">
            <Card>
              <CardHeader>
                <CardTitle>Our Core Values</CardTitle>
                <CardDescription>The principles that guide everything we do</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {companyData.values.map((value, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{value.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{value.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Corporate Social Responsibility</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {companyData.socialResponsibility.map((initiative, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <HeartIcon className="h-5 w-5 text-red-500 mt-0.5" />
                        <span>{initiative}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Company Achievements</CardTitle>
                <CardDescription>Our journey of growth and excellence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">{companyData.successfulProjects}+</div>
                        <p className="text-neutral-medium">Successful Projects</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">{companyData.clientsCount}+</div>
                        <p className="text-neutral-medium">Satisfied Clients</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">{new Date().getFullYear() - companyData.foundedYear}</div>
                        <p className="text-neutral-medium">Years of Excellence</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <h3 className="text-xl font-medium mb-4 flex items-center">
                  <AwardIcon className="h-5 w-5 mr-2 text-primary" />
                  Awards & Recognition
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companyData.awards.map((award, index) => (
                    <div key={index} className="flex items-center p-4 border rounded-lg">
                      <AwardIcon className="h-6 w-6 mr-3 text-yellow-500" />
                      <span>{award}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="benefits">
            <Card>
              <CardHeader>
                <CardTitle>Employee Benefits</CardTitle>
                <CardDescription>Why Wugweb is a great place to work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companyData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center p-4 border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                      </div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}