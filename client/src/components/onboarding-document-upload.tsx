import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  UploadIcon, 
  XIcon, 
  CheckCircleIcon, 
  FileIcon,
  FileTextIcon,
  IdCardIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  BanknoteIcon,
  AlertCircleIcon,
  InfoIcon,
  HelpCircleIcon
} from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DocumentStatus {
  [key: string]: {
    status: 'pending' | 'uploaded' | 'error';
    filename?: string;
  }
}

interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  documents: DocumentType[];
  icon: React.ReactNode;
}

interface DocumentType {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  acceptedTypes?: string;
}

// Document Categories
const documentCategories: DocumentCategory[] = [
  {
    id: "identity",
    name: "Identity Documents",
    description: "Personal identification documents",
    icon: <IdCardIcon className="w-5 h-5" />,
    documents: [
      {
        id: "passportPhoto",
        name: "Passport Size Photo",
        description: "Recent passport size photograph with white background",
        required: true,
        acceptedTypes: "image/jpeg,image/png"
      },
      {
        id: "aadhaarCardFront",
        name: "Aadhaar Card (Front)",
        required: true,
        acceptedTypes: "image/jpeg,image/png,application/pdf"
      },
      {
        id: "aadhaarCardBack",
        name: "Aadhaar Card (Back)",
        required: true,
        acceptedTypes: "image/jpeg,image/png,application/pdf"
      },
      {
        id: "panCardFront",
        name: "PAN Card (Front)",
        required: true,
        acceptedTypes: "image/jpeg,image/png,application/pdf"
      },
      {
        id: "passportFront",
        name: "Passport (First Page)",
        required: false,
        acceptedTypes: "image/jpeg,image/png,application/pdf"
      },
      {
        id: "passportBack",
        name: "Passport (Last Page)",
        required: false,
        acceptedTypes: "image/jpeg,image/png,application/pdf"
      }
    ]
  },
  {
    id: "education",
    name: "Education Documents",
    description: "Academic certificates and qualifications",
    icon: <GraduationCapIcon className="w-5 h-5" />,
    documents: [
      {
        id: "resume",
        name: "Latest Resume/CV",
        description: "Your most recent and updated resume",
        required: true,
        acceptedTypes: "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      },
      {
        id: "tenthAndTwelfthMarks",
        name: "10th & 12th Mark Sheets",
        description: "Certificates and mark sheets of secondary and higher secondary education",
        required: true,
        acceptedTypes: "image/jpeg,image/png,application/pdf"
      },
      {
        id: "graduationCertificate",
        name: "Graduation Certificate",
        description: "Degree certificate and mark sheets",
        required: true,
        acceptedTypes: "image/jpeg,image/png,application/pdf"
      },
      {
        id: "pgCertificate",
        name: "Post-Graduation Certificate",
        description: "PG degree certificate and mark sheets (if applicable)",
        required: false,
        acceptedTypes: "image/jpeg,image/png,application/pdf"
      }
    ]
  },
  {
    id: "employment",
    name: "Employment Documents",
    description: "Previous employment records and letters",
    icon: <BriefcaseIcon className="w-5 h-5" />,
    documents: [
      {
        id: "appointmentLetter",
        name: "Appointment Letter",
        description: "Appointment letter from previous employer",
        required: false,
        acceptedTypes: "image/jpeg,image/png,application/pdf"
      },
      {
        id: "relievingLetter",
        name: "Relieving Letter",
        description: "Relieving/experience letter from previous employer",
        required: false,
        acceptedTypes: "image/jpeg,image/png,application/pdf"
      },
      {
        id: "appraisalLetter",
        name: "Appraisal Letter",
        description: "Recent appraisal/promotion/increment letter",
        required: false,
        acceptedTypes: "image/jpeg,image/png,application/pdf"
      }
    ]
  },
  {
    id: "payment",
    name: "Payment & Financial",
    description: "Bank account and financial documents",
    icon: <BanknoteIcon className="w-5 h-5" />,
    documents: [
      {
        id: "cancelledCheque",
        name: "Cancelled Cheque/Bank Details",
        description: "Cancelled cheque leaf or bank account details",
        required: true,
        acceptedTypes: "image/jpeg,image/png,application/pdf"
      },
      {
        id: "lastThreePayslips",
        name: "Last 3 Months Payslips",
        description: "Payslips from previous employer (if applicable)",
        required: false,
        acceptedTypes: "image/jpeg,image/png,application/pdf"
      }
    ]
  }
];

export default function OnboardingDocumentUpload() {
  const [activeTab, setActiveTab] = useState("identity");
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});
  const { uploadDocument, isUploading } = useDocuments();
  const { toast } = useToast();
  
  // Calculate total documents and uploaded documents
  const calculateProgress = () => {
    const allRequiredDocs = documentCategories
      .flatMap(category => category.documents)
      .filter(doc => doc.required);
    
    const totalRequired = allRequiredDocs.length;
    const uploadedRequired = allRequiredDocs
      .filter(doc => documentStatus[doc.id]?.status === 'uploaded')
      .length;
    
    return Math.round((uploadedRequired / totalRequired) * 100);
  };

  // Handle file selection
  const handleFileChange = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileUpload(docId, file);
    }
  };
  
  // Handle file upload
  const handleFileUpload = (docId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", `${docId}_${file.name}`);
    
    // Find the category this document belongs to
    const category = documentCategories.find(cat => 
      cat.documents.some(doc => doc.id === docId)
    );
    
    if (category) {
      formData.append("categoryId", category.id);
    }
    
    // Update status to indicate uploading
    setDocumentStatus(prev => ({
      ...prev,
      [docId]: { status: 'pending' }
    }));
    
    uploadDocument(formData, {
      onSuccess: () => {
        // Update document status
        setDocumentStatus(prev => ({
          ...prev,
          [docId]: { 
            status: 'uploaded',
            filename: file.name
          }
        }));
        
        // Update progress
        const newProgress = calculateProgress();
        setUploadProgress(newProgress);
        
        toast({
          title: "Document uploaded",
          description: "Your document has been uploaded successfully",
          variant: "default",
        });
      },
      onError: () => {
        setDocumentStatus(prev => ({
          ...prev,
          [docId]: { status: 'error' }
        }));
        
        toast({
          title: "Upload failed",
          description: "There was an error uploading your document. Please try again.",
          variant: "destructive",
        });
      }
    });
  };
  
  // Replace a document
  const handleReplaceDocument = (docId: string) => {
    if (fileInputRefs.current[docId]) {
      fileInputRefs.current[docId]?.click();
    }
  };
  
  // Set ref for file input
  const setFileInputRef = (docId: string, ref: HTMLInputElement | null) => {
    fileInputRefs.current[docId] = ref;
  };
  
  // Render single document upload component
  const renderDocumentUpload = (document: DocumentType) => {
    const docStatus = documentStatus[document.id] || { status: 'pending' };
    const isUploaded = docStatus.status === 'uploaded';
    
    return (
      <div 
        key={document.id} 
        className={`border-2 rounded-lg p-5 shadow-sm transition-all ${
          isUploaded 
            ? 'border-black bg-gray-50' 
            : document.required 
              ? 'border-yellow-500 hover:border-yellow-600' 
              : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-medium flex items-center text-gray-900">
              {document.name}
              {document.required && <span className="text-yellow-500 ml-1 font-bold">*</span>}
              {isUploaded && <CheckCircleIcon className="h-5 w-5 text-black ml-2" />}
            </h3>
            {document.description && (
              <p className="text-sm text-gray-600 mt-1">{document.description}</p>
            )}
            <div className="mt-1 flex items-center">
              <span className="text-xs font-medium text-gray-500 flex items-center">
                Accepted formats: {formatAcceptedTypes(document.acceptedTypes)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          {!isUploaded ? (
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                document.required 
                  ? 'border-yellow-300 hover:bg-yellow-50' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => fileInputRefs.current[document.id]?.click()}
            >
              <UploadIcon className="h-10 w-10 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">
                Click to select a file or drag and drop
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Maximum file size: {getFileSizeLimit()}MB
              </p>
              <Input
                ref={(ref) => setFileInputRef(document.id, ref)}
                type="file"
                accept={document.acceptedTypes}
                className="hidden"
                onChange={(e) => handleFileChange(document.id, e)}
                disabled={isUploading}
              />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center text-black mb-3 sm:mb-0">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mr-3">
                  <FileTextIcon className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-sm font-medium block">{docStatus.filename}</span>
                  <span className="text-xs text-gray-500">Uploaded successfully</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-300 hover:border-black hover:bg-white text-gray-700 hover:text-black"
                onClick={() => handleReplaceDocument(document.id)}
              >
                Replace File
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Add useEffect to calculate initial progress
  useEffect(() => {
    const initialProgress = calculateProgress();
    setUploadProgress(initialProgress);
  }, []);
  
  // Calculate required documents for current category
  const getCategoryProgress = (categoryId: string) => {
    const category = documentCategories.find(cat => cat.id === categoryId);
    if (!category) return { completed: 0, total: 0, percent: 0 };
    
    const requiredDocs = category.documents.filter(doc => doc.required);
    const total = requiredDocs.length;
    const completed = requiredDocs.filter(doc => 
      documentStatus[doc.id]?.status === 'uploaded'
    ).length;
    
    return {
      completed,
      total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };
  
  const currentCategoryProgress = getCategoryProgress(activeTab);
  
  // Get document file size limit in MB
  const getFileSizeLimit = () => {
    return 10; // 10MB limit
  };
  
  // Format accepted file types for human reading
  const formatAcceptedTypes = (acceptedTypes?: string) => {
    if (!acceptedTypes) return "All files";
    
    const typeMap: {[key: string]: string} = {
      "image/jpeg": "JPEG",
      "image/png": "PNG",
      "application/pdf": "PDF",
      "application/msword": "DOC",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX"
    };
    
    return acceptedTypes.split(',')
      .map(type => typeMap[type] || type)
      .join(", ");
  };
  
  return (
    <Card className="border-black overflow-hidden">
      <div className="h-1 w-full bg-yellow-500"></div>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold">Required Documents</CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Please upload all the required documents for onboarding
            </CardDescription>
          </div>
          
          <div className="mt-4 md:mt-0 md:ml-4 flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="mr-2 rounded-full border-gray-300 hover:border-black hover:bg-gray-100">
                    <HelpCircleIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black text-white border-0 p-3 rounded-md">
                  <p className="max-w-xs">
                    Upload all required documents (*) to complete your onboarding. 
                    File size limit: {getFileSizeLimit()}MB per file.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Overall Completion</span>
              {uploadProgress === 100 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black text-white">
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  Complete
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                  <InfoIcon className="h-3 w-3 mr-1" />
                  In Progress
                </span>
              )}
            </div>
            <span className="text-sm font-bold text-gray-800">{uploadProgress}%</span>
          </div>
          <Progress 
            value={uploadProgress} 
            className="h-2 bg-gray-200" 
            style={{ 
              "--tw-bg-opacity": "1",
              backgroundColor: uploadProgress === 100 ? "black" : "rgba(var(--primary-yellow), var(--tw-bg-opacity))" 
            } as React.CSSProperties}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {uploadProgress === 100 ? (
          <Alert className="mb-6 border-2 border-black bg-gray-50">
            <CheckCircleIcon className="h-5 w-5 text-black" />
            <AlertTitle className="text-black font-semibold text-lg">All required documents uploaded</AlertTitle>
            <AlertDescription className="text-gray-700">
              Thank you for uploading all the required documents. You can proceed with the next steps of your onboarding process.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-6 border-2 border-yellow-500 bg-yellow-50">
            <InfoIcon className="h-5 w-5 text-yellow-600" />
            <AlertTitle className="text-gray-800 font-semibold text-lg">Document Upload Instructions</AlertTitle>
            <AlertDescription className="text-gray-700">
              Please upload all required documents marked with (*). Accepted file formats include JPG, PNG, PDF, DOC, and DOCX. Maximum file size is {getFileSizeLimit()} MB per document.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8 p-1 rounded-xl bg-gray-100">
            {documentCategories.map(category => {
              const catProgress = getCategoryProgress(category.id);
              return (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center justify-center gap-2 relative py-3 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-md data-[state=active]:rounded-lg data-[state=active]:font-medium transition-all duration-200"
                >
                  <div className="relative">
                    {category.icon}
                    {catProgress.total > 0 && catProgress.completed === catProgress.total && (
                      <span className="absolute -top-1 -right-1 bg-black rounded-full w-3 h-3 border border-white"></span>
                    )}
                  </div>
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          {documentCategories.map(category => {
            const catProgress = getCategoryProgress(category.id);
            const requiredDocs = category.documents.filter(doc => doc.required);
            
            return (
              <TabsContent key={category.id} value={category.id}>
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold flex items-center text-gray-900">
                        {category.name}
                        {requiredDocs.length > 0 && catProgress.completed === requiredDocs.length && (
                          <CheckCircleIcon className="ml-2 h-5 w-5 text-black" />
                        )}
                      </h3>
                      <p className="text-gray-600 mt-1">{category.description}</p>
                    </div>
                    
                    {requiredDocs.length > 0 && (
                      <div className="mt-3 sm:mt-0 flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">Required</span>
                          <span className="text-lg font-bold text-gray-900">
                            {catProgress.completed}/{catProgress.total}
                          </span>
                        </div>
                        <div className="ml-4 pl-4 border-l border-gray-300">
                          <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">Status</span>
                          <span className={`block text-sm font-medium ${
                            catProgress.completed === catProgress.total
                              ? 'text-black'
                              : 'text-yellow-600'
                          }`}>
                            {catProgress.completed === catProgress.total ? 'Complete' : 'In Progress'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {requiredDocs.length > 0 && (
                    <Progress 
                      value={catProgress.percent} 
                      className="h-2 mt-2 bg-gray-200" 
                      style={{ 
                        "--tw-bg-opacity": "1",
                        backgroundColor: catProgress.completed === catProgress.total 
                          ? "black" 
                          : "rgba(var(--primary-yellow), var(--tw-bg-opacity))" 
                      } as React.CSSProperties}
                    />
                  )}
                </div>
                
                <div className="space-y-4">
                  {category.documents.map(document => renderDocumentUpload(document))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}