import { useState } from "react";
import Layout from "@/components/layout";
import { useDocuments } from "@/hooks/useDocuments";
import DocumentCard from "@/components/document-card";
import FileUpload from "@/components/file-upload";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  SearchIcon, 
  FileUpIcon, 
  FileTextIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  BanknoteIcon,
  IdCardIcon,
  FolderIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Document } from "@shared/schema";

export default function Documents() {
  const { documents, categories, isLoadingDocuments, isLoadingCategories } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Define types for document categories and documents
  type DocumentType = {
    id: string;
    name: string;
    description: string;
    required: boolean;
    needsNumber?: boolean;
    multipleFiles?: boolean;
    allowMultiple?: boolean;
  };
  
  type DocumentCategory = {
    id: string;
    name: string;
    icon: React.ReactNode;
    documents: DocumentType[];
  };
  
  // Define document categories and their specific document types
  const documentCategories: DocumentCategory[] = [
    { 
      id: "identity", 
      name: "Identity", 
      icon: <IdCardIcon className="w-4 h-4 mr-2" />,
      documents: [
        { id: "aadhar", name: "Aadhaar Card", description: "12-digit unique identity number", required: true, needsNumber: true, multipleFiles: true },
        { id: "pan", name: "PAN Card", description: "Permanent Account Number", required: true, needsNumber: true, multipleFiles: true },
        { id: "passport", name: "Passport", description: "International travel document", required: false, needsNumber: true, multipleFiles: true },
        { id: "resume", name: "Latest Resume", description: "Current resume/CV", required: true }
      ]
    },
    { 
      id: "education", 
      name: "Education", 
      icon: <GraduationCapIcon className="w-4 h-4 mr-2" />,
      documents: [
        { id: "10th", name: "10th Degree", description: "Secondary education certificate", required: true },
        { id: "12th", name: "12th Degree", description: "Higher secondary certificate", required: true },
        { id: "ug", name: "UG Degree", description: "Undergraduate degree", required: false },
        { id: "pg", name: "PG Degree", description: "Postgraduate degree", required: false },
        { id: "certificate", name: "Certificates", description: "Additional certifications", required: false, allowMultiple: true }
      ]
    },
    { 
      id: "experience", 
      name: "Experience", 
      icon: <BriefcaseIcon className="w-4 h-4 mr-2" />,
      documents: [
        { id: "appraisal", name: "Appraisal/Promotion Letter", description: "Previous company evaluation", required: false },
        { id: "appointment", name: "Appointment Letter", description: "Previous company offer", required: false },
        { id: "relieving", name: "Relieving Letter", description: "Previous company exit document", required: false },
        { id: "increment", name: "Increment Letter", description: "Salary increase notification", required: false }
      ]
    },
    { 
      id: "financial", 
      name: "Financial", 
      icon: <BanknoteIcon className="w-4 h-4 mr-2" />,
      documents: [
        { id: "cheque", name: "Cancelled Cheque", description: "Bank account verification", required: false },
        { id: "payslips", name: "Last 3 Months Payslips", description: "Recent salary statements", required: false, allowMultiple: true },
        { id: "bank", name: "Bank Statement", description: "Recent account activity", required: false },
        { id: "tax", name: "ITR / Form 16", description: "Income tax documentation", required: false }
      ]
    },
    { 
      id: "misc", 
      name: "Miscellaneous", 
      icon: <FolderIcon className="w-4 h-4 mr-2" />,
      documents: [
        { id: "other", name: "Other Documents", description: "Additional files", required: false, allowMultiple: true }
      ]
    }
  ];
  
  // Map document to category based on document properties or tags
  const getDocumentCategory = (doc: Document) => {
    // This is a simple implementation. In a real app, you might have a category field or use document tags
    const docName = doc.name.toLowerCase();
    
    if (docName.includes("id") || docName.includes("passport") || docName.includes("aadhar") || docName.includes("pan")) {
      return "identity";
    } else if (docName.includes("degree") || docName.includes("certificate") || docName.includes("education")) {
      return "education";
    } else if (docName.includes("resume") || docName.includes("cv") || docName.includes("experience") || docName.includes("recommendation")) {
      return "experience";
    } else if (docName.includes("salary") || docName.includes("tax") || docName.includes("bank") || docName.includes("financial")) {
      return "financial";
    } else {
      return "misc";
    }
  };
  
  // Filter documents based on search query and selected category
  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const docCategory = getDocumentCategory(doc);
    const matchesCategory = selectedCategoryId === "all" || docCategory === selectedCategoryId;
    return matchesSearch && matchesCategory;
  });

  // Group documents by category for category counts
  const documentsByCategory = documents ? documents.reduce((acc, doc) => {
    const category = getDocumentCategory(doc);
    if (!acc[category]) acc[category] = [];
    acc[category].push(doc);
    return acc;
  }, {} as Record<string, Document[]>) : {};

  // Get category name by id
  const getCategoryName = (categoryId: number | null | undefined) => {
    if (!categoryId) return null;
    return categories?.find(cat => cat.id === categoryId)?.name || null;
  };

  return (
    <Layout title="Documents">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-medium" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FileUpIcon className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a new document to your repository
                </DialogDescription>
              </DialogHeader>
              <FileUpload />
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategoryId}>
          <div className="overflow-x-auto">
            <TabsList className="mb-6">
              <TabsTrigger value="all" className="flex items-center">
                <FileTextIcon className="w-4 h-4 mr-2" />
                All Documents
                {documents && <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">{documents.length}</span>}
              </TabsTrigger>
              
              {documentCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center">
                  {category.icon}
                  {category.name}
                  {documentsByCategory[category.id] && (
                    <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                      {documentsByCategory[category.id]?.length || 0}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <TabsContent value={selectedCategoryId} className="pt-2">
            {isLoadingDocuments || isLoadingCategories ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6).fill(null).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <Skeleton className="w-10 h-10 rounded mr-3 flex-shrink-0" />
                        <div>
                          <Skeleton className="h-5 w-40 mb-2" />
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-6 w-24" />
                        </div>
                      </div>
                      <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedCategoryId !== "all" ? (
              // Show document types for the selected category
              <div>
                <h2 className="text-lg font-medium mb-4">
                  {documentCategories.find(cat => cat.id === selectedCategoryId)?.name} Documents
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {documentCategories
                    .find(category => category.id === selectedCategoryId)
                    ?.documents.map(docType => {
                      // Find any existing uploaded documents for this type
                      const existingDocuments = filteredDocuments?.filter(
                        doc => doc.name.toLowerCase().includes(docType.name.toLowerCase())
                      ) || [];
                      
                      return (
                        <div key={docType.id} className="bg-white rounded-lg shadow-sm p-5 border border-neutral-100">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-medium text-lg">{docType.name}</h3>
                            {docType.required && (
                              <span className="text-xs bg-red-100 text-red-700 rounded-full px-2 py-0.5">
                                Required
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-neutral-medium mb-4">
                            {docType.description}
                          </p>
                          
                          {/* Document number input (for specific document types) */}
                          {('needsNumber' in docType && docType.needsNumber) && (
                            <div className="mb-4">
                              <label className="text-sm font-medium mb-1 block">Document Number</label>
                              <Input placeholder={`Enter your ${docType.name} number`} className="text-sm" />
                            </div>
                          )}
                          
                          {/* Show existing documents if any */}
                          {existingDocuments.length > 0 ? (
                            <div className="mb-4">
                              <p className="text-sm font-medium mb-2">Uploaded Documents</p>
                              <div className="space-y-3">
                                {existingDocuments.map(doc => (
                                  <DocumentCard 
                                    key={doc.id} 
                                    document={doc}
                                    category={selectedCategoryId}
                                    documentType={docType.name}
                                    uploadContext={`${docType.name} upload`}
                                  />
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="mb-4 p-3 bg-neutral-50 rounded-md border border-dashed border-neutral-200 text-center">
                              <p className="text-sm text-neutral-medium">No documents uploaded yet</p>
                            </div>
                          )}
                          
                          {/* Document upload section */}
                          <div className="mt-4">
                            {('multipleFiles' in docType && docType.multipleFiles) ? (
                              <div className="grid grid-cols-2 gap-2">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setUploadDialogOpen(true)}
                                  className="w-full"
                                >
                                  <FileUpIcon className="w-4 h-4 mr-2" />
                                  Upload Front
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => setUploadDialogOpen(true)}
                                  className="w-full"
                                >
                                  <FileUpIcon className="w-4 h-4 mr-2" />
                                  Upload Back
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                variant="outline" 
                                onClick={() => setUploadDialogOpen(true)}
                                className="w-full"
                              >
                                <FileUpIcon className="w-4 h-4 mr-2" />
                                Upload Document
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : filteredDocuments && filteredDocuments.length > 0 ? (
              // All documents view
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocuments.map((document) => (
                    <DocumentCard 
                      key={document.id} 
                      document={document}
                      category={getDocumentCategory(document)}
                      documentType={documentCategories.find(cat => cat.id === getDocumentCategory(document))?.name || ""}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-light/30 flex items-center justify-center">
                  <FileUpIcon className="w-8 h-8 text-neutral-medium" />
                </div>
                <h3 className="text-lg font-medium mb-2">No documents found</h3>
                <p className="text-neutral-medium mb-6">
                  {searchQuery 
                    ? "Try a different search term or category" 
                    : "Upload your first document to get started"}
                </p>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <FileUpIcon className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
