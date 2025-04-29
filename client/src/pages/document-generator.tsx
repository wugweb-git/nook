import { useState } from "react";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentTemplate from "@/components/document-template";
import { FileTextIcon, DownloadIcon, MailIcon, EyeIcon, RefreshCwIcon } from "lucide-react";
import { format } from "date-fns";

const documentTypes = [
  { id: "offer_letter", name: "Offer Letter" },
  { id: "experience_letter", name: "Experience Letter" },
  { id: "internship_letter", name: "Internship Letter" },
  { id: "contract_agreement", name: "Contract Agreement" },
  { id: "relieving_letter", name: "Relieving Letter" },
  { id: "appraisal_letter", name: "Appraisal Letter" },
  { id: "bonafide_letter", name: "Bonafide Letter" },
  { id: "address_proof", name: "Address Proof" },
  { id: "appointment_letter", name: "Appointment Letter" },
  { id: "nda", name: "Non-Disclosure Agreement" }
];

// Sample employees for demonstration
const employees = [
  { id: "WWE20041201", name: "Vedanshu Kumar Srivastava" },
  { id: "WWW20041202", name: "Emily Smith" },
  { id: "WWW20041203", name: "Rajiv Kumar" },
  { id: "WWW20041204", name: "Priya Patel" },
  { id: "WWW20041205", name: "Ananya Chatterjee" }
];

export default function DocumentGenerator() {
  const [documentType, setDocumentType] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({
    Company_Name: "Wug Web Services Pvt Ltd",
    Company_Address: "FLOOR-14 TH, SECTOR 16-B, C 001-A2, Noida, Gautam Buddha Nagar, Noida, Gautambuddh Nagar, Uttar Pradesh 201301",
    Current_Date: format(new Date(), "dd/MM/yyyy"),
    Annual_CTC: "",
    Manager_Name: "",
    Employee_Joining_Date: "",
    Acceptance_Last_Date: "",
    HR_Name: "",
    Job_Title: "",
    Employee_Name: "",
    Employee_Address: "",
    Start_Date: "",
    End_Date: "",
    Department: "",
    Last_Working_Day: "",
    Notice_Period: "30 days",
    Last_Salary: "",
    Current_Salary: "",
    New_Salary: "",
    Increment_Percentage: "",
    Effective_Date: "",
    Reason: ""
  });
  
  const [previewMode, setPreviewMode] = useState(false);
  const [includeXPayroll, setIncludeXPayroll] = useState(false);
  
  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    
    // Find the selected employee
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (employee) {
      setFormValues(prev => ({
        ...prev,
        Employee_Name: employee.name
      }));
    }
  };
  
  const handleInputChange = (field: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const getFieldsForDocumentType = () => {
    const commonFields = [
      { id: "Company_Name", label: "Company Name" },
      { id: "Company_Address", label: "Company Address" },
      { id: "Current_Date", label: "Current Date" },
      { id: "Employee_Name", label: "Employee Name" }
    ];
    
    switch (documentType) {
      case "offer_letter":
        return [
          ...commonFields,
          { id: "Job_Title", label: "Job Title" },
          { id: "Annual_CTC", label: "Annual CTC" },
          { id: "Manager_Name", label: "Manager Name" },
          { id: "Employee_Joining_Date", label: "Joining Date" },
          { id: "Acceptance_Last_Date", label: "Acceptance Deadline" },
          { id: "HR_Name", label: "HR Name" }
        ];
      case "experience_letter":
        return [
          ...commonFields,
          { id: "Employee_Joining_Date", label: "Joining Date" },
          { id: "End_Date", label: "End Date" },
          { id: "Job_Title", label: "Job Title" },
          { id: "Department", label: "Department" },
          { id: "HR_Name", label: "HR Name" }
        ];
      case "internship_letter":
        return [
          ...commonFields,
          { id: "Start_Date", label: "Start Date" },
          { id: "End_Date", label: "End Date" },
          { id: "Department", label: "Department" },
          { id: "Manager_Name", label: "Supervisor Name" },
          { id: "HR_Name", label: "HR Name" }
        ];
      case "relieving_letter":
        return [
          ...commonFields,
          { id: "Job_Title", label: "Job Title" },
          { id: "Department", label: "Department" },
          { id: "Employee_Joining_Date", label: "Joining Date" },
          { id: "Last_Working_Day", label: "Last Working Day" },
          { id: "HR_Name", label: "HR Name" }
        ];
      case "appraisal_letter":
        return [
          ...commonFields,
          { id: "Job_Title", label: "Job Title" },
          { id: "Department", label: "Department" },
          { id: "Current_Salary", label: "Current Salary" },
          { id: "New_Salary", label: "New Salary" },
          { id: "Increment_Percentage", label: "Increment Percentage" },
          { id: "Effective_Date", label: "Effective Date" },
          { id: "Manager_Name", label: "Manager Name" }
        ];
      case "address_proof":
        return [
          ...commonFields,
          { id: "Employee_Address", label: "Employee Address" },
          { id: "Employee_Joining_Date", label: "Joining Date" },
          { id: "Job_Title", label: "Job Title" },
          { id: "HR_Name", label: "HR Name" }
        ];
      case "appointment_letter":
        return [
          ...commonFields,
          { id: "Job_Title", label: "Job Title" },
          { id: "Department", label: "Department" },
          { id: "Annual_CTC", label: "Annual CTC" },
          { id: "Employee_Joining_Date", label: "Joining Date" },
          { id: "Notice_Period", label: "Notice Period" },
          { id: "HR_Name", label: "HR Name" }
        ];
      default:
        return commonFields;
    }
  };
  
  const renderDocumentPreview = () => {
    let title = "";
    let content: React.ReactNode = null;
    
    switch(documentType) {
      case "offer_letter":
        title = "Offer Letter";
        content = (
          <div className="space-y-4">
            <p>Dear {formValues.Employee_Name},</p>
            
            <p>We are pleased to offer you the position of <strong>{formValues.Job_Title}</strong> at {formValues.Company_Name}. Following our recent discussions, we are excited about the possibility of you joining our team.</p>
            
            <p>Your annual compensation will be Rs. {formValues.Annual_CTC}/- (Rupees {numberToWords(parseInt(formValues.Annual_CTC))} Only) CTC. The detailed salary structure is provided in the attached annexure.</p>
            
            <p>Your tentative joining date will be {formValues.Employee_Joining_Date}. On your joining date, please report to {formValues.HR_Name} at our office located at {formValues.Company_Address}.</p>
            
            <p>This offer is valid until {formValues.Acceptance_Last_Date}. To confirm your acceptance, please sign and return a copy of this letter.</p>
            
            <div className="mt-8">
              <p>Sincerely,</p>
              <p className="mt-4 font-medium">{formValues.HR_Name}</p>
              <p>Human Resources</p>
              <p>{formValues.Company_Name}</p>
            </div>
            
            {includeXPayroll && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium mb-2">Salary Structure</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Component</th>
                      <th className="text-right py-2">Monthly</th>
                      <th className="text-right py-2">Annual</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Basic Salary</td>
                      <td className="text-right py-2">₹{Math.round(parseInt(formValues.Annual_CTC || "0") * 0.5 / 12).toLocaleString()}</td>
                      <td className="text-right py-2">₹{Math.round(parseInt(formValues.Annual_CTC || "0") * 0.5).toLocaleString()}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">HRA</td>
                      <td className="text-right py-2">₹{Math.round(parseInt(formValues.Annual_CTC || "0") * 0.2 / 12).toLocaleString()}</td>
                      <td className="text-right py-2">₹{Math.round(parseInt(formValues.Annual_CTC || "0") * 0.2).toLocaleString()}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Special Allowance</td>
                      <td className="text-right py-2">₹{Math.round(parseInt(formValues.Annual_CTC || "0") * 0.15 / 12).toLocaleString()}</td>
                      <td className="text-right py-2">₹{Math.round(parseInt(formValues.Annual_CTC || "0") * 0.15).toLocaleString()}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Transport Allowance</td>
                      <td className="text-right py-2">₹{Math.round(parseInt(formValues.Annual_CTC || "0") * 0.05 / 12).toLocaleString()}</td>
                      <td className="text-right py-2">₹{Math.round(parseInt(formValues.Annual_CTC || "0") * 0.05).toLocaleString()}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Medical Allowance</td>
                      <td className="text-right py-2">₹{Math.round(parseInt(formValues.Annual_CTC || "0") * 0.05 / 12).toLocaleString()}</td>
                      <td className="text-right py-2">₹{Math.round(parseInt(formValues.Annual_CTC || "0") * 0.05).toLocaleString()}</td>
                    </tr>
                    <tr className="border-b font-medium">
                      <td className="py-2">Gross Salary</td>
                      <td className="text-right py-2">₹{Math.round(parseInt(formValues.Annual_CTC || "0") * 0.95 / 12).toLocaleString()}</td>
                      <td className="text-right py-2">₹{Math.round(parseInt(formValues.Annual_CTC || "0") * 0.95).toLocaleString()}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Employer PF Contribution</td>
                      <td className="text-right py-2">₹{Math.round(parseInt(formValues.Annual_CTC || "0") * 0.05 / 12).toLocaleString()}</td>
                      <td className="text-right py-2">₹{Math.round(parseInt(formValues.Annual_CTC || "0") * 0.05).toLocaleString()}</td>
                    </tr>
                    <tr className="border-b font-medium">
                      <td className="py-2">CTC</td>
                      <td className="text-right py-2">₹{Math.round(parseInt(formValues.Annual_CTC || "0") / 12).toLocaleString()}</td>
                      <td className="text-right py-2">₹{parseInt(formValues.Annual_CTC || "0").toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
        break;
        
      case "experience_letter":
        title = "Experience Letter";
        content = (
          <div className="space-y-4">
            <p>TO WHOMSOEVER IT MAY CONCERN</p>
            
            <p>This is to certify that <strong>{formValues.Employee_Name}</strong> was employed with {formValues.Company_Name} from {formValues.Employee_Joining_Date} to {formValues.End_Date} as <strong>{formValues.Job_Title}</strong> in the {formValues.Department} department.</p>
            
            <p>During {formValues.Employee_Name}'s tenure with us, we found him/her to be hardworking, sincere, and dedicated. {formValues.Employee_Name} has executed all assigned responsibilities with utmost sincerity and has been an asset to the organization.</p>
            
            <p>We wish {formValues.Employee_Name} all the best for future endeavors.</p>
            
            <div className="mt-8">
              <p>For {formValues.Company_Name}</p>
              <p className="mt-4 font-medium">{formValues.HR_Name}</p>
              <p>Human Resources</p>
            </div>
          </div>
        );
        break;
        
      case "internship_letter":
        title = "Internship Letter";
        content = (
          <div className="space-y-4">
            <p>Dear {formValues.Employee_Name},</p>
            
            <p>We are pleased to offer you an internship opportunity at {formValues.Company_Name} in the {formValues.Department} department. This internship will commence on {formValues.Start_Date} and continue until {formValues.End_Date}.</p>
            
            <p>During your internship, you will report to {formValues.Manager_Name}, who will provide guidance and evaluate your performance. This internship will give you practical exposure to the work environment and help you develop professional skills.</p>
            
            <p>Please note that this is a learning opportunity and not an employment offer. Upon successful completion of the internship, you will receive an internship completion certificate from {formValues.Company_Name}.</p>
            
            <p>To confirm your acceptance, please sign and return a copy of this letter.</p>
            
            <div className="mt-8">
              <p>Sincerely,</p>
              <p className="mt-4 font-medium">{formValues.HR_Name}</p>
              <p>Human Resources</p>
              <p>{formValues.Company_Name}</p>
            </div>
          </div>
        );
        break;
        
      case "relieving_letter":
        title = "Relieving Letter";
        content = (
          <div className="space-y-4">
            <p>TO WHOMSOEVER IT MAY CONCERN</p>
            
            <p>This is to certify that <strong>{formValues.Employee_Name}</strong> was employed with {formValues.Company_Name} as <strong>{formValues.Job_Title}</strong> in the {formValues.Department} department from {formValues.Employee_Joining_Date} to {formValues.Last_Working_Day}.</p>
            
            <p>{formValues.Employee_Name} has been relieved of all duties and responsibilities at {formValues.Company_Name} effective {formValues.Last_Working_Day}. All dues and obligations to {formValues.Employee_Name} have been settled.</p>
            
            <p>During {formValues.Employee_Name}'s tenure with us, we found him/her to be sincere and dedicated. We wish {formValues.Employee_Name} success in all future endeavors.</p>
            
            <div className="mt-8">
              <p>For {formValues.Company_Name}</p>
              <p className="mt-4 font-medium">{formValues.HR_Name}</p>
              <p>Human Resources</p>
            </div>
          </div>
        );
        break;
        
      case "appraisal_letter":
        title = "Appraisal Letter";
        content = (
          <div className="space-y-4">
            <p>Dear {formValues.Employee_Name},</p>
            
            <p>We are pleased to inform you that following your performance review, your contribution to {formValues.Company_Name} has been recognized and appreciated.</p>
            
            <p>Effective {formValues.Effective_Date}, your annual compensation will be revised from Rs. {formValues.Current_Salary}/- to Rs. {formValues.New_Salary}/- per annum, representing an increase of {formValues.Increment_Percentage}%.</p>
            
            <p>Your dedication and commitment have been invaluable to the organization. We look forward to your continued excellence and contribution to the growth of {formValues.Company_Name}.</p>
            
            <div className="mt-8">
              <p>Sincerely,</p>
              <div className="grid grid-cols-2 gap-8 mt-4">
                <div>
                  <p className="font-medium">{formValues.Manager_Name}</p>
                  <p>Manager</p>
                </div>
                <div>
                  <p className="font-medium">{formValues.HR_Name}</p>
                  <p>Human Resources</p>
                </div>
              </div>
            </div>
          </div>
        );
        break;
        
      case "bonafide_letter":
        title = "Bonafide Letter";
        content = (
          <div className="space-y-4">
            <p>TO WHOMSOEVER IT MAY CONCERN</p>
            
            <p>This is to certify that <strong>{formValues.Employee_Name}</strong> is a bonafide employee of {formValues.Company_Name} working as <strong>{formValues.Job_Title}</strong> since {formValues.Employee_Joining_Date}.</p>
            
            <p>This certificate is issued upon the request of {formValues.Employee_Name} for the purpose of general identification and verification.</p>
            
            <div className="mt-8">
              <p>For {formValues.Company_Name}</p>
              <p className="mt-4 font-medium">{formValues.HR_Name}</p>
              <p>Human Resources</p>
            </div>
          </div>
        );
        break;
        
      case "address_proof":
        title = "Address Proof Letter";
        content = (
          <div className="space-y-4">
            <p>TO WHOMSOEVER IT MAY CONCERN</p>
            
            <p>This is to certify that <strong>{formValues.Employee_Name}</strong> is a permanent employee of {formValues.Company_Name} working as <strong>{formValues.Job_Title}</strong> since {formValues.Employee_Joining_Date}.</p>
            
            <p>As per our records, {formValues.Employee_Name}'s current residential address is:</p>
            
            <p className="font-medium">{formValues.Employee_Address}</p>
            
            <p>This letter is issued upon the request of the employee for address verification purposes.</p>
            
            <div className="mt-8">
              <p>For {formValues.Company_Name}</p>
              <p className="mt-4 font-medium">{formValues.HR_Name}</p>
              <p>Human Resources</p>
            </div>
          </div>
        );
        break;
        
      case "appointment_letter":
        title = "Appointment Letter";
        content = (
          <div className="space-y-4">
            <p>Dear {formValues.Employee_Name},</p>
            
            <p>We are pleased to confirm your appointment as <strong>{formValues.Job_Title}</strong> in the {formValues.Department} department at {formValues.Company_Name} effective {formValues.Employee_Joining_Date}.</p>
            
            <p>Your annual compensation will be Rs. {formValues.Annual_CTC}/- (Rupees {numberToWords(parseInt(formValues.Annual_CTC))} Only) CTC. The detailed salary structure will be provided separately.</p>
            
            <p>Your employment will be governed by the company's policies, procedures, and terms of employment, which may be amended from time to time. The notice period applicable for your position is {formValues.Notice_Period}.</p>
            
            <p>Please sign and return a copy of this letter as acknowledgment of your acceptance.</p>
            
            <div className="mt-8">
              <p>Sincerely,</p>
              <p className="mt-4 font-medium">{formValues.HR_Name}</p>
              <p>Human Resources</p>
              <p>{formValues.Company_Name}</p>
            </div>
          </div>
        );
        break;
        
      case "nda":
        title = "Non-Disclosure Agreement";
        content = (
          <div className="space-y-4">
            <p>THIS NON-DISCLOSURE AGREEMENT ("Agreement") is made and entered into as of {formValues.Current_Date} by and between:</p>
            
            <p><strong>{formValues.Company_Name}</strong>, having its registered office at {formValues.Company_Address} (hereinafter referred to as the "Company")</p>
            
            <p>AND</p>
            
            <p><strong>{formValues.Employee_Name}</strong>, (hereinafter referred to as the "Recipient")</p>
            
            <p className="font-medium">1. Purpose</p>
            <p>The Recipient acknowledges that in the course of their employment with the Company, they will have access to and become acquainted with various trade secrets and confidential information owned by or related to the Company.</p>
            
            <p className="font-medium">2. Confidential Information</p>
            <p>"Confidential Information" includes but is not limited to technical, financial, business information, know-how, trade secrets, business plans, operations, client lists, project information, pricing, and any other information that is marked confidential or by its nature is confidential.</p>
            
            <p className="font-medium">3. Non-Disclosure Obligations</p>
            <p>The Recipient agrees not to use the Confidential Information for any purpose other than for the benefit of the Company. The Recipient will not disclose the Confidential Information to any third party without prior written consent from the Company.</p>
            
            <p className="font-medium">4. Return of Materials</p>
            <p>Upon termination of employment or upon request by the Company, the Recipient will promptly return all physical and electronic documents and materials containing Confidential Information.</p>
            
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <p>For {formValues.Company_Name}</p>
                <p className="mt-4 font-medium">{formValues.HR_Name}</p>
                <p>Human Resources</p>
              </div>
              <div>
                <p>Accepted and Agreed by:</p>
                <p className="mt-4 font-medium">{formValues.Employee_Name}</p>
                <p>Date: {formValues.Current_Date}</p>
              </div>
            </div>
          </div>
        );
        break;
        
      case "contract_agreement":
        title = "Contract Agreement";
        content = (
          <div className="space-y-4">
            <p>THIS CONTRACT AGREEMENT ("Agreement") is made and entered into as of {formValues.Current_Date} by and between:</p>
            
            <p><strong>{formValues.Company_Name}</strong>, having its registered office at {formValues.Company_Address} (hereinafter referred to as the "Company")</p>
            
            <p>AND</p>
            
            <p><strong>{formValues.Employee_Name}</strong>, (hereinafter referred to as the "Contractor")</p>
            
            <p className="font-medium">1. Engagement and Services</p>
            <p>The Company hereby engages the Contractor to provide services as {formValues.Job_Title} for the period commencing on {formValues.Start_Date} and ending on {formValues.End_Date}, unless terminated earlier in accordance with this Agreement.</p>
            
            <p className="font-medium">2. Compensation</p>
            <p>For the services rendered, the Contractor shall be paid Rs. {formValues.Annual_CTC}/- for the term of this Agreement, payable in equal monthly installments.</p>
            
            <p className="font-medium">3. Independent Contractor Relationship</p>
            <p>The Contractor is engaged as an independent contractor and not as an employee of the Company. The Contractor is not eligible for any employee benefits and is responsible for all taxes related to the compensation received.</p>
            
            <p className="font-medium">4. Confidentiality</p>
            <p>The Contractor agrees to maintain the confidentiality of all proprietary information of the Company during and after the term of this Agreement.</p>
            
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <p>For {formValues.Company_Name}</p>
                <p className="mt-4 font-medium">{formValues.HR_Name}</p>
                <p>Human Resources</p>
              </div>
              <div>
                <p>Accepted and Agreed by:</p>
                <p className="mt-4 font-medium">{formValues.Employee_Name}</p>
                <p>Date: {formValues.Current_Date}</p>
              </div>
            </div>
          </div>
        );
        break;
        
      default:
        return (
          <div className="text-center py-10">
            <FileTextIcon className="mx-auto h-12 w-12 text-neutral-medium mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a document type</h3>
            <p className="text-neutral-medium">Choose a document type to generate the preview</p>
          </div>
        );
    }
    
    return (
      <DocumentTemplate
        title={title}
        date={new Date()}
        documentType={documentType}
        recipientName={formValues.Employee_Name}
        showFooter={true}
        printable={true}
      >
        {content}
      </DocumentTemplate>
    );
  };

  // Helper function to convert numbers to words for salary
  function numberToWords(num: number): string {
    if (isNaN(num)) return "";
    
    const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const formatTenth = (n: number) => {
      return n < 10 ? single[n] : double[n - 10];
    };
    
    if (num === 0) return 'Zero';
    
    const convertLessThanOneThousand = (n: number): string => {
      let result = '';
      
      if (n >= 100) {
        result = single[Math.floor(n / 100)] + ' Hundred';
        n %= 100;
        if (n !== 0) result += ' and ';
      }
      
      if (n >= 10 && n < 20) {
        result += double[n - 10];
      } else if (n >= 20) {
        result += tens[Math.floor(n / 10)];
        if (n % 10 !== 0) result += ' ' + single[n % 10];
      } else if (n > 0) {
        result += single[n];
      }
      
      return result;
    };
    
    let result = '';
    let divisor = 1;
    let chunk = 0;
    
    if (num >= 10000000) { // Crore
      divisor = 10000000;
      chunk = Math.floor(num / divisor);
      num %= divisor;
      if (chunk > 0) {
        result += convertLessThanOneThousand(chunk) + ' Crore';
        if (num > 0) result += ' ';
      }
    }
    
    if (num >= 100000) { // Lakh
      divisor = 100000;
      chunk = Math.floor(num / divisor);
      num %= divisor;
      if (chunk > 0) {
        result += convertLessThanOneThousand(chunk) + ' Lakh';
        if (num > 0) result += ' ';
      }
    }
    
    if (num >= 1000) { // Thousand
      divisor = 1000;
      chunk = Math.floor(num / divisor);
      num %= divisor;
      if (chunk > 0) {
        result += convertLessThanOneThousand(chunk) + ' Thousand';
        if (num > 0) result += ' ';
      }
    }
    
    if (num > 0) {
      result += convertLessThanOneThousand(num);
    }
    
    return result;
  }

  return (
    <Layout title="Generate Documents">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Type</CardTitle>
                <CardDescription>
                  Select the type of document you want to generate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            
            {documentType && (
              <Card>
                <CardHeader>
                  <CardTitle>Employee Selection</CardTitle>
                  <CardDescription>
                    If you are generating a letter for an employee, please select them
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedEmployee} onValueChange={handleEmployeeSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} ({employee.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}
            
            {documentType && (
              <Card>
                <CardHeader>
                  <CardTitle>Document Details</CardTitle>
                  <CardDescription>
                    Enter the required information to generate your document
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getFieldsForDocumentType().map(field => (
                      <div key={field.id} className="grid gap-2">
                        <Label htmlFor={field.id}>{field.label}</Label>
                        <Input
                          id={field.id}
                          value={formValues[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                        />
                      </div>
                    ))}
                    
                    {documentType === "offer_letter" && (
                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox 
                          id="include-xpayroll" 
                          checked={includeXPayroll}
                          onCheckedChange={(checked) => setIncludeXPayroll(Boolean(checked))}
                        />
                        <Label htmlFor="include-xpayroll">Include XPayroll generated salary structure from annual CTC</Label>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setFormValues({
                    Company_Name: "Wug Web Services Pvt Ltd",
                    Company_Address: "FLOOR-14 TH, SECTOR 16-B, C 001-A2, Noida, Gautam Buddha Nagar, Noida, Gautambuddh Nagar, Uttar Pradesh 201301",
                    Current_Date: format(new Date(), "dd/MM/yyyy"),
                  })}>
                    <RefreshCwIcon className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button onClick={() => setPreviewMode(true)}>
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
          
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Document Preview</span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm">
                      <MailIcon className="h-4 w-4 mr-2" />
                      Send via Email
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-120px)] overflow-auto">
                <div className="bg-neutral-50 rounded-lg min-h-[800px] border p-8">
                  {renderDocumentPreview()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}