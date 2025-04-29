import { format } from "date-fns";
import DocumentTemplate from "@/components/document-template";
import { SalarySlipHolidays } from "@/components/salary-slip-holidays";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableFooter, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { 
  Printer, 
  Download, 
  CalendarDays, 
  CircleDollarSign, 
  BriefcaseBusiness, 
  User 
} from "lucide-react";
import { useRef } from "react";

interface SalaryComponent {
  name: string;
  amount: number;
  type: "earning" | "deduction";
}

interface SalarySlipProps {
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  salaryMonth: Date;
  bankAccount: string;
  panNumber: string;
  joiningDate: Date;
  basicSalary: number;
  components: SalaryComponent[];
  workingDays: {
    total: number;
    present: number;
    absent: number;
    leaves: number;
    holidays: number;
  };
}

export default function SalarySlip({
  employeeId,
  employeeName,
  designation,
  department,
  salaryMonth,
  bankAccount,
  panNumber,
  joiningDate,
  basicSalary,
  components,
  workingDays,
}: SalarySlipProps) {
  const printRef = useRef<HTMLDivElement>(null);
  
  // Calculate totals
  const totalEarnings = components
    .filter(comp => comp.type === "earning")
    .reduce((sum, comp) => sum + comp.amount, 0);
  
  const totalDeductions = components
    .filter(comp => comp.type === "deduction")
    .reduce((sum, comp) => sum + comp.amount, 0);
  
  const netPayable = totalEarnings - totalDeductions;
  
  // Handle printing
  const handlePrint = () => {
    window.print();
  };
  
  // Handle download
  const handleDownload = () => {
    alert("Downloading PDF...");
    // In a real implementation, this would generate a PDF and trigger download
  };
  
  // Get the month and year from salaryMonth
  const month = salaryMonth.getMonth();
  const year = salaryMonth.getFullYear();
  
  return (
    <div className="relative" ref={printRef}>
      <div className="print:hidden flex justify-end gap-2 mb-4">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>
      
      <DocumentTemplate
        title="Salary Slip"
        date={salaryMonth}
        recipientName={employeeName}
        documentType="Salary Slip"
      >
        {/* Employee Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Employee Information
            </h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Employee ID</TableCell>
                  <TableCell>{employeeId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell>{employeeName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Designation</TableCell>
                  <TableCell>{designation}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Department</TableCell>
                  <TableCell>{department}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">PAN Number</TableCell>
                  <TableCell>{panNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Date of Joining</TableCell>
                  <TableCell>{format(joiningDate, "dd MMM, yyyy")}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <CircleDollarSign className="h-5 w-5 mr-2 text-primary" />
              Salary Information
            </h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Salary Month</TableCell>
                  <TableCell>{format(salaryMonth, "MMMM yyyy")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bank Account</TableCell>
                  <TableCell>{bankAccount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Basic Salary</TableCell>
                  <TableCell>₹ {basicSalary.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Earnings</TableCell>
                  <TableCell className="text-green-600 font-medium">
                    ₹ {totalEarnings.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Deductions</TableCell>
                  <TableCell className="text-red-600 font-medium">
                    ₹ {totalDeductions.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Net Payable</TableCell>
                  <TableCell className="font-bold text-primary">
                    ₹ {netPayable.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Attendance Section */}
        <div className="mb-6 pb-6 border-b">
          <h3 className="font-semibold text-lg mb-3 flex items-center">
            <BriefcaseBusiness className="h-5 w-5 mr-2 text-primary" />
            Attendance Summary
          </h3>
          <div className="grid grid-cols-5 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{workingDays.total}</div>
              <div className="text-sm text-neutral-medium">Total Days</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{workingDays.present}</div>
              <div className="text-sm text-neutral-medium">Present</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{workingDays.absent}</div>
              <div className="text-sm text-neutral-medium">Absent</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{workingDays.leaves}</div>
              <div className="text-sm text-neutral-medium">Leaves</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{workingDays.holidays}</div>
              <div className="text-sm text-neutral-medium">Holidays</div>
            </div>
          </div>
        </div>
        
        {/* Salary Details Section */}
        <div className="mb-6 pb-6 border-b">
          <h3 className="font-semibold text-lg mb-3">Salary Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-green-600">Earnings</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead className="text-right">Amount (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {components
                    .filter(comp => comp.type === "earning")
                    .map((comp, idx) => (
                      <TableRow key={`earning-${idx}`}>
                        <TableCell>{comp.name}</TableCell>
                        <TableCell className="text-right">
                          {comp.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>Total Earnings</TableCell>
                    <TableCell className="text-right">
                      {totalEarnings.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
            
            <div>
              <h4 className="font-medium mb-2 text-red-600">Deductions</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead className="text-right">Amount (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {components
                    .filter(comp => comp.type === "deduction")
                    .map((comp, idx) => (
                      <TableRow key={`deduction-${idx}`}>
                        <TableCell>{comp.name}</TableCell>
                        <TableCell className="text-right">
                          {comp.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>Total Deductions</TableCell>
                    <TableCell className="text-right">
                      {totalDeductions.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        </div>
        
        {/* Net Payable Section */}
        <div className="mb-6 pb-6 border-b">
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">Net Salary Payable</div>
            <div className="text-xl font-bold text-primary">
              ₹ {netPayable.toLocaleString()}
            </div>
          </div>
          <Separator className="my-4" />
          <div className="text-sm text-neutral-medium italic">
            Amount in words: <span className="font-medium not-italic">Indian Rupees {amountInWords(netPayable)} Only</span>
          </div>
        </div>
        
        {/* Holidays Section */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3 flex items-center">
            <CalendarDays className="h-5 w-5 mr-2 text-primary" />
            Monthly Holidays
          </h3>
          <SalarySlipHolidays year={year} month={month} variant="embedded" />
        </div>
        
        {/* Note Section */}
        <div className="mt-8 text-sm text-neutral-medium border-t pt-4">
          <p className="mb-2">This is a computer generated salary slip and does not require a signature.</p>
          <p>For any queries regarding this salary slip, please contact the HR department at hr@wugweb.design.</p>
        </div>
      </DocumentTemplate>
    </div>
  );
}

// Utility function to convert number to words
function amountInWords(amount: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (amount === 0) return 'Zero';
  
  function numToWords(num: number): string {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + numToWords(num % 100) : '');
    if (num < 100000) return numToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numToWords(num % 1000) : '');
    if (num < 10000000) return numToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numToWords(num % 100000) : '');
    return numToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numToWords(num % 10000000) : '');
  }
  
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  
  let result = numToWords(rupees);
  if (paise) {
    result += ' and ' + numToWords(paise) + ' Paise';
  }
  
  return result;
}