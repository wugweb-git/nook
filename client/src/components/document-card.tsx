import { Document } from "@shared/schema";
import { 
  FileTextIcon, 
  DownloadIcon, 
  TrashIcon, 
  MoreHorizontalIcon, 
  UploadIcon, 
  CheckCircleIcon, 
  ClockIcon,
  RefreshCw,
  FileIcon,
  ShieldIcon,
  AlertCircleIcon,
  FileImageIcon,
  FileIcon as FilePdfIcon,
  FileTextIcon as FileTextIconOutline
} from "lucide-react";
import { formatDate, formatFileSize } from "@/lib/utils";
import { useDocuments } from "@/hooks/useDocuments";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useRef } from "react";
import DocumentTypeBadge from "./document-type-badge";

interface DocumentCardProps {
  document?: Document;
  category?: string;
  documentType: string;
  requiredDocument?: boolean;
  onUpload?: (file: File) => void;
  verificationStatus?: 'verified' | 'pending' | 'none';
  uploadContext?: string;
}

export default function DocumentCard({ 
  document, 
  category, 
  documentType, 
  requiredDocument = false, 
  onUpload,
  verificationStatus = 'none',
  uploadContext = ''
}: DocumentCardProps) {
  const { downloadDocument, deleteDocument, uploadDocument } = useDocuments();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const canDelete = user?.role === "admin" && verificationStatus !== 'verified';
  const canVerify = user?.role === "admin";
  const hasDocument = !!document;
  
  // If verification status is not provided but document has isVerified property
  const effectiveVerificationStatus = document?.isVerified 
    ? 'verified' 
    : (verificationStatus === 'pending')
      ? 'pending'
      : 'none';

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);

      if (onUpload) {
        // Use the provided upload handler if available
        onUpload(file);
        setIsUploading(false);
      } else if (uploadDocument) {
        // Otherwise use the default upload handler
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', documentType);
        formData.append('categoryId', category || '1');

        uploadDocument(formData);
        // Set isUploading to false after a short delay to simulate upload completion
        setTimeout(() => {
          setIsUploading(false);
        }, 1000);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  // Function to get the appropriate file icon
  const getFileIcon = () => {
    if (!document) return <FileTextIcon className="w-5 h-5" />;
    
    const fileName = document.filename || '';
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    
    switch (fileExtension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImageIcon className="w-5 h-5" />;
      case 'pdf':
        return <FilePdfIcon className="w-5 h-5" />;
      case 'doc':
      case 'docx':
        return <FileTextIconOutline className="w-5 h-5" />;
      default:
        return <FileIcon className="w-5 h-5" />;
    }
  };

  // Empty document card (for documents that need to be uploaded)
  if (!hasDocument) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md border border-dashed border-neutral-200 group">
        <div className="flex flex-col items-center justify-center text-center py-6">
          <div className="w-16 h-16 rounded-full bg-primary/5 text-primary/70 flex items-center justify-center mb-4 transform transition-transform group-hover:scale-110 duration-200">
            <FileTextIcon className="w-8 h-8" />
          </div>
          <h3 className="font-medium text-lg">{documentType}</h3>
          
          {requiredDocument ? (
            <div className="mt-2 mb-4">
              <Badge variant="destructive" className="rounded-md px-2 py-0.5 font-normal">Required</Badge>
            </div>
          ) : (
            <p className="text-sm text-neutral-medium mt-2 mb-4">
              Optional document
            </p>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileInputChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={triggerFileInput}
                  className="mt-2 relative hover:bg-primary/90 transition-all duration-200"
                  disabled={isUploading}
                  size="lg"
                >
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-md overflow-hidden">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {isUploading ? (
                    <>
                      <ClockIcon className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="w-4 h-4 mr-2" />
                      Upload Document
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 text-white">
                <p className="text-xs">Accepted formats: PDF, DOC, DOCX, JPG, PNG</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Optional drag-drop hint */}
          <p className="text-xs text-neutral-medium mt-4">
            or drag and drop file here
          </p>
        </div>
      </div>
    );
  }

  // Document card for uploaded documents - styled to match the empty document card
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md border border-neutral-100 transition-all duration-200 group">
      <div className="flex justify-between items-start">
        <div className="flex">
          <div className={`w-12 h-12 mr-4 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 duration-200 ${
            document.filename?.toLowerCase().endsWith('.pdf') 
              ? 'bg-blue-50 text-blue-600' 
              : document.filename?.match(/\.(jpg|jpeg|png|gif)$/i) 
                ? 'bg-green-50 text-green-600'
                : document.filename?.match(/\.(doc|docx)$/i)
                  ? 'bg-purple-50 text-purple-600'
                  : 'bg-primary/5 text-primary'
          }`}>
            {getFileIcon()}
          </div>
          
          <div>
            <h3 className="font-medium text-lg">{document.name}</h3>
            
            {uploadContext && (
              <p className="text-sm text-neutral-medium mt-1">
                {uploadContext}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2 mt-2">
              {/* Category badge */}
              {category && (
                <DocumentTypeBadge type={category} />
              )}
              
              {/* Verification status badges */}
              {effectiveVerificationStatus === 'verified' && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 px-2">
                  <ShieldIcon className="w-3 h-3" />
                  <span>Verified</span>
                </Badge>
              )}
              
              {effectiveVerificationStatus === 'pending' && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1 px-2">
                  <ClockIcon className="w-3 h-3" />
                  <span>Pending verification</span>
                </Badge>
              )}
            </div>
            
            {/* File details */}
            {document.filename && (
              <div className="text-xs text-neutral-medium mt-2 flex items-center gap-2">
                <span>{document.filename.split('.').pop()?.toUpperCase()}</span>
                {document.filesize && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{formatFileSize(document.filesize)}</span>
                  </>
                )}
                {document.uploadedAt && (
                  <>
                    <span className="mx-1">•</span>
                    <span>Uploaded {formatDate(document.uploadedAt)}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileInputChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => downloadDocument(document.id, document.name)}
                  className="mr-1 text-neutral-dark hover:text-primary hover:border-primary/20 transition-all"
                >
                  <DownloadIcon className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Download document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {effectiveVerificationStatus !== 'verified' && (
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="text-neutral-dark hover:text-primary hover:border-primary/20 transition-all">
                        <MoreHorizontalIcon className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">More options</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <DropdownMenuContent align="end" className="w-56">
                {canVerify && (
                  <DropdownMenuItem className="cursor-pointer">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-green-600" />
                    <span>Verify Document</span>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <RefreshCw className="w-4 h-4 mr-2 text-blue-600" />
                  <span>Replace Document</span>
                </DropdownMenuItem>
                
                {canDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => deleteDocument(document.id)}
                      className="cursor-pointer text-red-600 focus:text-red-500 focus:bg-red-50"
                    >
                      <TrashIcon className="w-4 h-4 mr-2" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}