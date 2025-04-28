import { Document } from "@shared/schema";
import { 
  FileTextIcon, 
  DownloadIcon, 
  TrashIcon, 
  MoreHorizontalIcon, 
  UploadIcon, 
  CheckCircleIcon, 
  ClockIcon,
  RefreshCw
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

interface DocumentCardProps {
  document?: Document;
  category?: string;
  documentType: string;
  requiredDocument?: boolean;
  onUpload?: (file: File) => void;
}

export default function DocumentCard({ document, category, documentType, requiredDocument = false, onUpload }: DocumentCardProps) {
  const { downloadDocument, deleteDocument, uploadDocument } = useDocuments();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const canDelete = user?.role === "admin";
  const canVerify = user?.role === "admin";
  const hasDocument = !!document;

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);

      if (onUpload) {
        onUpload(file);
      } else if (uploadDocument) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', documentType);
        formData.append('categoryId', category || '1');

        uploadDocument(formData)
          .then(() => {
            setIsUploading(false);
          })
          .catch(() => {
            setIsUploading(false);
          });
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Empty document card (for documents that need to be uploaded)
  if (!hasDocument) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 transition-shadow hover:shadow-md border-2 border-dashed border-neutral-light">
        <div className="flex flex-col items-center justify-center text-center py-4">
          <div className="w-16 h-16 rounded-full bg-neutral-lightest text-neutral-medium flex items-center justify-center mb-3">
            <FileTextIcon className="w-8 h-8" />
          </div>
          <h3 className="font-medium">{documentType}</h3>
          <p className="text-sm text-neutral-medium mt-1 mb-4">
            {requiredDocument ? "Required document" : "Optional document"}
          </p>

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileInputChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />

          <Button 
            onClick={triggerFileInput}
            className="mt-2 relative"
            disabled={isUploading}
          >
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-md">
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
        </div>
      </div>
    );
  }

  // Document card for uploaded documents
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 transition-all hover:shadow-md hover:scale-[1.01] border border-neutral-100">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-lg bg-primary-light bg-opacity-10 text-primary flex items-center justify-center mr-3 flex-shrink-0">
            <FileTextIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="font-medium">{document.name}</h3>
              {document.isVerified && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CheckCircleIcon className="w-4 h-4 ml-2 text-green-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Verified by admin</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-sm text-neutral-medium mt-1">
              Uploaded on {formatDate(document.uploadedAt)}
            </p>
            <div className="flex items-center mt-2 space-x-2">
              {category && (
                <Badge variant="secondary" className="text-xs">
                  {category}
                </Badge>
              )}
              {document.isPublic && (
                <Badge variant="outline" className="text-xs">
                  Public
                </Badge>
              )}
              <span className="text-xs text-neutral-medium">
                {formatFileSize(document.filesize)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileInputChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />

          {!document.isVerified && (
            <Button 
              size="sm" 
              variant="outline" 
              className="mr-2" 
              onClick={triggerFileInput}
              disabled={isUploading}
            >
              <RefreshCw className="w-4 h-4" />
              <span className="sr-only">Re-upload</span>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-neutral-medium hover:text-primary">
                <MoreHorizontalIcon className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => downloadDocument(document.id, document.name)}
                className="cursor-pointer"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                <span>Download</span>
              </DropdownMenuItem>

              {canVerify && !document.isVerified && (
                <DropdownMenuItem 
                  className="cursor-pointer"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  <span>Mark as Verified</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              {canDelete && (
                <DropdownMenuItem 
                  onClick={() => deleteDocument(document.id)}
                  className="cursor-pointer text-red-500 focus:text-red-500"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}