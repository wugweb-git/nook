import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDocuments } from "@/hooks/useDocuments";
import { 
  UploadIcon, 
  FileIcon, 
  IdCardIcon, 
  GraduationCapIcon, 
  BriefcaseIcon, 
  BanknoteIcon, 
  FolderIcon 
} from "lucide-react";
import { formatFileSize } from "@/lib/utils";

export default function FileUpload() {
  const { categories, uploadDocument, isUploading } = useDocuments();
  
  // Define document categories
  const documentCategories = [
    { id: "identity", name: "Identity", icon: <IdCardIcon className="w-4 h-4 mr-2" /> },
    { id: "education", name: "Education", icon: <GraduationCapIcon className="w-4 h-4 mr-2" /> },
    { id: "experience", name: "Experience", icon: <BriefcaseIcon className="w-4 h-4 mr-2" /> },
    { id: "financial", name: "Financial", icon: <BanknoteIcon className="w-4 h-4 mr-2" /> },
    { id: "misc", name: "Miscellaneous", icon: <FolderIcon className="w-4 h-4 mr-2" /> }
  ];
  
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [documentCategory, setDocumentCategory] = useState<string>("misc");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Default the name to the file name without extension
      const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
      setName(fileName);
    }
  };
  
  const handleUpload = () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name || file.name);
    
    // Add document category as metadata
    formData.append("documentType", documentCategory);
    if (categoryId) {
      formData.append("categoryId", categoryId);
    }
    formData.append("isPublic", isPublic.toString());
    
    uploadDocument(formData);
    
    // Reset form
    setFile(null);
    setName("");
    setDocumentCategory("misc");
    setCategoryId(null);
    setIsPublic(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <h4 className="font-heading font-medium text-lg mb-4">Upload Document</h4>
      
      <div className="space-y-4">
        {!file ? (
          <div 
            className="border-2 border-dashed border-neutral-light rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon className="w-12 h-12 mx-auto mb-2 text-neutral-medium" />
            <p className="text-neutral-dark mb-2">Click to upload or drag and drop</p>
            <p className="text-xs text-neutral-medium">PDF, DOC, XLS, JPG, PNG (max. 10MB)</p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            />
          </div>
        ) : (
          <div className="border border-neutral-light rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded bg-primary-light bg-opacity-10 text-primary flex items-center justify-center mr-3">
                <FileIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-neutral-medium">{formatFileSize(file.size)}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        )}
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Document Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter document name"
              disabled={isUploading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="documentCategory">Document Type</Label>
            <Select value={documentCategory} onValueChange={setDocumentCategory}>
              <SelectTrigger id="documentCategory" disabled={isUploading}>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="flex items-center">
                    <div className="flex items-center">
                      {category.icon}
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs text-neutral-medium mt-1">
              {documentCategory === "identity" && "For ID cards, passports, PAN cards, etc."}
              {documentCategory === "education" && "For degree certificates, transcripts, etc."}
              {documentCategory === "experience" && "For resume, CV, recommendation letters, etc."}
              {documentCategory === "financial" && "For salary slips, tax documents, etc."}
              {documentCategory === "misc" && "For any other documents"}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              disabled={isUploading}
            />
            <Label htmlFor="public">Make document visible to all employees</Label>
          </div>
          
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </div>
    </div>
  );
}
