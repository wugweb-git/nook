import { useState } from "react";
import Layout from "@/components/layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  FileIcon, 
  FileTextIcon, 
  DownloadIcon, 
  CalendarIcon, 
  ArrowLeftIcon, 
  Calculator, 
  IndianRupee, 
  AlertCircle as AlertCircleIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { SalarySlipHolidays } from "@/components/salary-slip-holidays";

// Mock data for salary slips
const salarySlips = [
  {
    id: 1,
    period: "April 2025",
    date: new Date(2025, 3, 30),
    amount: "₹65,000",
    processed: true
  },
  {
    id: 2,
    period: "March 2025",
    date: new Date(2025, 2, 31),
    amount: "₹65,000",
    processed: true
  },
  {
    id: 3,
    period: "February 2025",
    date: new Date(2025, 1, 28),
    amount: "₹65,000",
    processed: true
  },
  {
    id: 4,
    period: "January 2025",
    date: new Date(2025, 0, 31),
    amount: "₹65,000",
    processed: true
  },
  {
    id: 5,
    period: "December 2024",
    date: new Date(2024, 11, 31),
    amount: "₹62,000",
    processed: true
  },
  {
    id: 6,
    period: "November 2024",
    date: new Date(2024, 10, 30),
    amount: "₹62,000",
    processed: true
  }
];

// Financial years for the dropdown
const financialYears = [
  "2025-2026",
  "2024-2025",
  "2023-2024"
];

// Salary components for preview
const salaryComponents = [
  { name: "Basic Salary", amount: 4167, type: "earning" },
  { name: "HRA", amount: 2083, type: "earning" },
  { name: "Special Allowance", amount: 1250, type: "earning" },
  { name: "Leave & Travel Allowance", amount: 833, type: "earning" }
];

const deductions = [
  { name: "TDS (estimate)*", amount: 0, type: "deduction" },
  { name: "PF Employee Contribution", amount: 750, type: "deduction" }
];

export default function SalarySlips() {
  const [activeTab, setActiveTab] = useState("pay-slips");
  const [selectedYear, setSelectedYear] = useState("2025-2026");
  const [monthlyInHandSalary, setMonthlyInHandSalary] = useState<string>("100000");
  const [isPFEnabled, setIsPFEnabled] = useState(true);
  const [ctcResult, setCTCResult] = useState<{ monthly: number; annual: number } | null>(null);
  
  // Function to handle CTC calculation
  const calculateCTC = () => {
    if (!monthlyInHandSalary) return;
    
    const inHandSalary = parseFloat(monthlyInHandSalary);
    
    // Basic CTC calculation (simplified for demo)
    const monthlyCTC = isPFEnabled 
      ? inHandSalary * 1.25  // 25% more for PF contributors
      : inHandSalary * 1.15; // 15% more for non-PF contributors
    
    const annualCTC = monthlyCTC * 12;
    
    setCTCResult({
      monthly: Math.round(monthlyCTC),
      annual: Math.round(annualCTC)
    });
  };
  
  // Calculate the totals for salary preview
  const earningsTotal = salaryComponents.reduce((total, component) => total + component.amount, 0);
  const deductionsTotal = deductions.reduce((total, deduction) => total + deduction.amount, 0);
  const inHandSalary = earningsTotal - deductionsTotal;
  const estimatedTaxableIncome = inHandSalary * 4; // Just for demo
  
  return (
    <Layout title="Salary & CTC">
      <div className="p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="pay-slips" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pay-slips">Pay Slips</TabsTrigger>
            <TabsTrigger value="salary-preview">Salary Preview</TabsTrigger>
            <TabsTrigger value="ctc-calculator">CTC Calculator</TabsTrigger>
          </TabsList>
          
          {/* Pay Slips Tab */}
          <TabsContent value="pay-slips" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Pay Slips</CardTitle>
                    <CardDescription>
                      View and download your pay slips
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-[200px]">
                      <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select financial year" />
                        </SelectTrigger>
                        <SelectContent>
                          {financialYears.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button className="flex items-center">
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Download Payslips
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {salarySlips.length > 0 ? (
                  <div className="grid gap-4">
                    {salarySlips.map((slip) => (
                      <div 
                        key={slip.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary mr-4">
                            <FileIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{slip.period} Pay Slip</h3>
                            <div className="flex items-center mt-1 text-neutral-medium text-sm">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              <span>{formatDate(slip.date)}</span>
                              <span className="mx-2">•</span>
                              <span>{slip.amount}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <DownloadIcon className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-light/30 flex items-center justify-center">
                      <FileIcon className="w-8 h-8 text-neutral-medium" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No pay slips found</h3>
                    <p className="text-neutral-medium mb-6">
                      Oops, looks like we have not processed a payroll for you.
                    </p>
                    <Button onClick={() => setActiveTab("pay-slips")} variant="outline">
                      Return to dashboard
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Salary Preview Tab */}
          <TabsContent value="salary-preview">
            <Card className="bg-background">
              <CardHeader className="border-b">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    className="mr-3" 
                    onClick={() => setActiveTab("pay-slips")}
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle>Salary Preview</CardTitle>
                    <CardDescription>
                      Breakdown of your salary components
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Salary Breakdown */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Salary breakup</h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Salary Component</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salaryComponents.map((component) => (
                          <TableRow key={component.name} className="hover:bg-transparent">
                            <TableCell>{component.name}</TableCell>
                            <TableCell className="text-right">{component.amount.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t-2 font-medium hover:bg-transparent">
                          <TableCell>Total</TableCell>
                          <TableCell className="text-right">{earningsTotal.toLocaleString()}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Deductions */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Deductions</h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Deduction</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deductions.map((deduction) => (
                          <TableRow key={deduction.name} className="hover:bg-transparent">
                            <TableCell>{deduction.name}</TableCell>
                            <TableCell className="text-right">{deduction.amount.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t-2 font-medium hover:bg-transparent">
                          <TableCell>Total</TableCell>
                          <TableCell className="text-right">{deductionsTotal.toLocaleString()}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                {/* Includes government holidays */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Holidays this month</h3>
                  <SalarySlipHolidays 
                    year={new Date().getFullYear()} 
                    month={new Date().getMonth()}
                    variant="embedded"
                  />
                </div>
                
                {/* Summary */}
                <div className="mt-8 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Estimated taxable income at the end of FY:</span>
                      <span>{estimatedTaxableIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Estimated monthly in-hand salary:</span>
                      <span>{inHandSalary.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    * Estimated tax, assuming 01/04/2025 as the hiring date, and zero past income. Actual TDS might be different, depending on employee's joining date, past income, tax declaration etc. This calculation assumes the old tax regime.
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-start border-t pt-6">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("pay-slips")}
                >
                  Go Back
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* CTC Calculator Tab */}
          <TabsContent value="ctc-calculator">
            <Card className="bg-background">
              <CardHeader className="border-b">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    className="mr-3" 
                    onClick={() => setActiveTab("pay-slips")}
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle>CTC Calculator</CardTitle>
                    <CardDescription>
                      Calculate Cost to Company from in-hand salary
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="max-w-3xl">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                        <h3 className="text-md font-medium mb-2 flex items-center text-primary">
                          <Calculator className="w-4 h-4 mr-2" />
                          CTC Calculator
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Calculate the CTC for employees with ESI and PF, from in-hand salary. This tool applies standard deductions and allowances based on Indian salary structures.
                        </p>
                        
                        <div className="space-y-5">
                          <div>
                            <Label htmlFor="in-hand-salary" className="block mb-2 text-sm font-medium">
                              Required in-hand monthly salary
                            </Label>
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-medium" />
                              <Input
                                id="in-hand-salary"
                                type="number"
                                className="pl-10"
                                value={monthlyInHandSalary}
                                onChange={(e) => setMonthlyInHandSalary(e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <Label className="block text-sm font-medium">Contribution Options</Label>
                            <div className="flex items-center space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                              <Checkbox 
                                id="pf-contribution" 
                                checked={isPFEnabled}
                                onCheckedChange={(checked) => setIsPFEnabled(checked === true)}
                              />
                              <div>
                                <Label htmlFor="pf-contribution" className="font-medium">
                                  Employee contributes to PF
                                </Label>
                                <p className="text-xs text-gray-500">
                                  Employee and employer both contribute 12% of basic salary
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full flex items-center justify-center" 
                            onClick={calculateCTC}
                            size="lg"
                          >
                            <Calculator className="w-4 h-4 mr-2" />
                            Calculate CTC
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-yellow-800 flex items-center mb-2">
                          <AlertCircleIcon className="w-4 h-4 mr-2" />
                          Important Notes
                        </h4>
                        <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-5">
                          <li>This is an estimate based on standard components.</li>
                          <li>ESI is only applicable if the monthly salary is below ₹21,000.</li>
                          <li>Tax calculations may vary based on individual declarations.</li>
                          <li>Actual CTC structure may be adjusted as per company policy.</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      {ctcResult ? (
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-primary text-white p-4">
                            <h3 className="font-medium text-lg mb-1">CTC Calculation Results</h3>
                            <p className="text-primary-foreground/80 text-sm">
                              Based on ₹{parseInt(monthlyInHandSalary).toLocaleString()} in-hand salary
                            </p>
                          </div>
                          
                          <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                                <p className="text-sm text-gray-500 mb-1">Monthly CTC</p>
                                <p className="text-2xl font-semibold text-primary">
                                  ₹{ctcResult.monthly.toLocaleString()}
                                </p>
                              </div>
                              
                              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                                <p className="text-sm text-gray-500 mb-1">Annual CTC</p>
                                <p className="text-2xl font-semibold text-primary">
                                  ₹{ctcResult.annual.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2 text-sm">Estimated Breakdown (Monthly)</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm p-2 border-b">
                                  <span>Basic Salary</span>
                                  <span>₹{Math.round(ctcResult.monthly * 0.4).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm p-2 border-b">
                                  <span>HRA</span>
                                  <span>₹{Math.round(ctcResult.monthly * 0.2).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm p-2 border-b">
                                  <span>Special Allowance</span>
                                  <span>₹{Math.round(ctcResult.monthly * 0.25).toLocaleString()}</span>
                                </div>
                                {isPFEnabled && (
                                  <div className="flex justify-between text-sm p-2 border-b">
                                    <span>Employer PF Contribution</span>
                                    <span>₹{Math.round(ctcResult.monthly * 0.12).toLocaleString()}</span>
                                  </div>
                                )}
                                <div className="flex justify-between text-sm p-2 border-b">
                                  <span>Other Benefits</span>
                                  <span>₹{Math.round(ctcResult.monthly * 0.03).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-center">
                              <Button
                                variant="outline"
                                className="flex items-center"
                                onClick={() => setActiveTab("salary-preview")}
                              >
                                <FileTextIcon className="w-4 h-4 mr-2" />
                                View Detailed Salary Preview
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center border rounded-lg border-dashed">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Calculator className="w-8 h-8 text-primary" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">No calculations yet</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Enter your desired in-hand salary and click "Calculate CTC" to see the results here.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}