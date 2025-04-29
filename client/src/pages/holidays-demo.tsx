import { useState } from "react";
import Layout from "@/components/layout";
import { HolidayCalendar } from "@/components/holiday-calendar";
import SalarySlip from "@/components/salary-slip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, FileText } from "lucide-react";

export default function HolidaysDemo() {
  const [activeTab, setActiveTab] = useState("calendar");
  
  // Sample salary slip data
  const sampleSalaryData = {
    employeeId: "EMP-2025-001",
    employeeName: "John Doe",
    designation: "Senior Developer",
    department: "Engineering",
    salaryMonth: new Date(2025, 3, 1), // April 2025
    bankAccount: "XXXX XXXX XXXX 5678",
    panNumber: "ABCDE1234F",
    joiningDate: new Date(2023, 6, 15),
    basicSalary: 75000,
    components: [
      { name: "Basic Salary", amount: 75000, type: "earning" },
      { name: "House Rent Allowance", amount: 30000, type: "earning" },
      { name: "Conveyance Allowance", amount: 8000, type: "earning" },
      { name: "Medical Allowance", amount: 5000, type: "earning" },
      { name: "Special Allowance", amount: 12000, type: "earning" },
      { name: "Income Tax", amount: 18500, type: "deduction" },
      { name: "Provident Fund", amount: 9000, type: "deduction" },
      { name: "Professional Tax", amount: 2500, type: "deduction" },
    ],
    workingDays: {
      total: 30,
      present: 22,
      absent: 1,
      leaves: 2,
      holidays: 5,
    },
  };
  
  return (
    <Layout title="Holidays & Salary Slip Demo">
      <div className="container mx-auto py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>North Indian Holidays Integration</CardTitle>
            <CardDescription>
              View holidays in the calendar and see how they're integrated in salary slips
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calendar" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="calendar">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Holiday Calendar
                </TabsTrigger>
                <TabsTrigger value="salary">
                  <FileText className="h-4 w-4 mr-2" />
                  Sample Salary Slip
                </TabsTrigger>
              </TabsList>
              <TabsContent value="calendar">
                <HolidayCalendar />
              </TabsContent>
              <TabsContent value="salary">
                <SalarySlip {...sampleSalaryData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}