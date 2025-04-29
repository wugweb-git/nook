import Layout from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeartIcon, HeartPulseIcon, UmbrellaIcon, CalendarIcon, CheckIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Mock benefits data
const healthBenefits = [
  {
    id: 1,
    name: "Group Health Insurance",
    description: "Comprehensive health coverage for you and your family",
    status: "Enrolled",
    details: "Premium Plan - Family Coverage",
    endDate: "December 31, 2025"
  },
  {
    id: 2,
    name: "Dental Insurance",
    description: "Coverage for dental procedures and checkups",
    status: "Enrolled",
    details: "Standard Plan",
    endDate: "December 31, 2025"
  },
  {
    id: 3,
    name: "Vision Insurance",
    description: "Coverage for eye examinations and eyewear",
    status: "Not Enrolled",
    details: null,
    endDate: null
  }
];

const wellnessBenefits = [
  {
    id: 1,
    name: "Gym Membership",
    description: "Subsidized membership to partner gyms",
    status: "Enrolled",
    details: "Premium Access",
    endDate: "December 31, 2025"
  },
  {
    id: 2,
    name: "Mental Health Support",
    description: "Access to counseling and mental health services",
    status: "Enrolled",
    details: "Unlimited Sessions",
    endDate: "December 31, 2025"
  },
  {
    id: 3,
    name: "Wellness Allowance",
    description: "Annual allowance for wellness activities",
    status: "Enrolled",
    details: "₹15,000 Annual Allowance",
    endDate: "December 31, 2025",
    used: 5000,
    total: 15000
  }
];

const financialBenefits = [
  {
    id: 1,
    name: "Retirement Plan",
    description: "Company-matched retirement savings plan",
    status: "Enrolled",
    details: "8% contribution with company match",
    endDate: null
  },
  {
    id: 2,
    name: "Life Insurance",
    description: "Term life insurance coverage",
    status: "Enrolled",
    details: "3x Annual Salary Coverage",
    endDate: "December 31, 2025"
  },
  {
    id: 3,
    name: "Employee Stock Purchase Plan",
    description: "Opportunity to purchase company stock at a discount",
    status: "Not Enrolled",
    details: null,
    endDate: null
  }
];

export default function BenefitsAdministration() {
  return (
    <Layout title="Benefits Administration">
      <div className="p-4 sm:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Benefits Administration</CardTitle>
            <CardDescription>
              Manage your employee benefits and enrollments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="health">
              <TabsList className="mb-6">
                <TabsTrigger value="health" className="flex items-center gap-2">
                  <HeartPulseIcon className="w-4 h-4" />
                  <span>Health Benefits</span>
                </TabsTrigger>
                <TabsTrigger value="wellness" className="flex items-center gap-2">
                  <HeartIcon className="w-4 h-4" />
                  <span>Wellness Benefits</span>
                </TabsTrigger>
                <TabsTrigger value="financial" className="flex items-center gap-2">
                  <UmbrellaIcon className="w-4 h-4" />
                  <span>Financial Benefits</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="health">
                <div className="space-y-6">
                  {healthBenefits.map(benefit => (
                    <BenefitCard key={benefit.id} benefit={benefit} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="wellness">
                <div className="space-y-6">
                  {wellnessBenefits.map(benefit => (
                    <BenefitCard key={benefit.id} benefit={benefit} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="financial">
                <div className="space-y-6">
                  {financialBenefits.map(benefit => (
                    <BenefitCard key={benefit.id} benefit={benefit} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

// Benefit card component
function BenefitCard({ benefit }: { benefit: any }) {
  const isEnrolled = benefit.status === "Enrolled";
  
  return (
    <div className={`border rounded-lg overflow-hidden ${isEnrolled ? 'border-green-200' : ''}`}>
      <div className={`h-1 ${isEnrolled ? 'bg-green-500' : 'bg-neutral-light'}`}></div>
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-medium flex items-center">
              {benefit.name}
              {isEnrolled && <CheckIcon className="w-4 h-4 text-green-500 ml-2" />}
            </h3>
            <p className="text-neutral-medium text-sm mb-2">{benefit.description}</p>
            
            {isEnrolled && benefit.details && (
              <div className="bg-neutral-light bg-opacity-20 text-neutral-dark text-sm px-3 py-1 rounded inline-block">
                {benefit.details}
              </div>
            )}
            
            {isEnrolled && benefit.endDate && (
              <div className="flex items-center mt-2 text-sm text-neutral-medium">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span>Valid until {benefit.endDate}</span>
              </div>
            )}
            
            {benefit.used !== undefined && benefit.total !== undefined && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Utilization</span>
                  <span>₹{benefit.used.toLocaleString()} / ₹{benefit.total.toLocaleString()}</span>
                </div>
                <Progress value={(benefit.used / benefit.total) * 100} className="h-2" />
              </div>
            )}
          </div>
          
          <div className="mt-4 sm:mt-0">
            {isEnrolled ? (
              <Button variant="outline" size="sm">
                View Details
              </Button>
            ) : (
              <Button size="sm" className="flex items-center">
                <PlusIcon className="w-4 h-4 mr-1" />
                Enroll Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}