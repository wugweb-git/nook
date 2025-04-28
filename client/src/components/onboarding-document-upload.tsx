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
        className={`border rounded-md p-4 ${isUploaded ? 'border-green-500 bg-green-50' : ''}`}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium flex items-center">
              {document.name}
              {document.required && <span className="text-red-500 ml-1">*</span>}
              {isUploaded && <CheckCircleIcon className="h-4 w-4 text-green-500 ml-2" />}
            </h3>
            {document.description && (
              <p className="text-sm text-gray-500">{document.description}</p>
            )}
          </div>
        </div>
        
        <div className="mt-3">
          {!isUploaded ? (
            <div 
              className="border-2 border-dashed rounded-md p-4 mt-1 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => fileInputRefs.current[document.id]?.click()}
            >
              <UploadIcon className="h-6 w-6 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Click to select a file or drag and drop
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
            <div className="flex items-center justify-between">
              <div className="flex items-center text-green-600">
                <FileIcon className="h-5 w-5 mr-2" />
                <span className="text-sm truncate max-w-xs">{docStatus.filename}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleReplaceDocument(document.id)}
              >
                Replace
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
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Required Documents</CardTitle>
            <CardDescription>
              Please upload all the required documents for onboarding
            </CardDescription>
          </div>
          
          <div className="mt-4 md:mt-0 md:ml-4 flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="mr-2">
                    <HelpCircleIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
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
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  Complete
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                  <InfoIcon className="h-3 w-3 mr-1" />
                  In Progress
                </span>
              )}
            </div>
            <span className="text-sm font-medium">{uploadProgress}%</span>
          </div>
          <Progress 
            value={uploadProgress} 
            className="h-2" 
            color={uploadProgress === 100 ? "bg-green-500" : ""}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {uploadProgress === 100 ? (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">All required documents uploaded</AlertTitle>
            <AlertDescription className="text-green-700">
              Thank you for uploading all the required documents. You can proceed with the next steps of your onboarding process.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Document Upload Instructions</AlertTitle>
            <AlertDescription className="text-blue-700">
              Please upload all required documents marked with (*). Accepted file formats include JPG, PNG, PDF, DOC, and DOCX. Maximum file size is {getFileSizeLimit()} MB per document.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            {documentCategories.map(category => {
              const catProgress = getCategoryProgress(category.id);
              return (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2 relative"
                >
                  {category.icon}
                  <span className="hidden sm:inline">{category.name}</span>
                  {catProgress.total > 0 && catProgress.completed === catProgress.total && (
                    <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-3 h-3"></span>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          {documentCategories.map(category => {
            const catProgress = getCategoryProgress(category.id);
            const requiredDocs = category.documents.filter(doc => doc.required);
            
            return (
              <TabsContent key={category.id} value={category.id}>
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-medium flex items-center">
                        {category.name}
                        {requiredDocs.length > 0 && catProgress.completed === requiredDocs.length && (
                          <CheckCircleIcon className="ml-2 h-5 w-5 text-green-500" />
                        )}
                      </h3>
                      <p className="text-neutral-medium">{category.description}</p>
                    </div>
                    
                    {requiredDocs.length > 0 && (
                      <div className="mt-2 sm:mt-0 flex items-center">
                        <span className="text-sm mr-2">
                          {catProgress.completed}/{catProgress.total} Required
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          catProgress.completed === catProgress.total
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {catProgress.completed === catProgress.total ? 'Complete' : 'In Progress'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {requiredDocs.length > 0 && (
                    <Progress 
                      value={catProgress.percent} 
                      className="h-1 mt-2" 
                      color={catProgress.completed === catProgress.total ? "bg-green-500" : ""}
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