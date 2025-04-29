import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Document, DocumentCategory } from "@shared/schema";

export function useDocuments() {
  const { toast } = useToast();
  
  // Get all documents
  const { data: documents, isLoading: isLoadingDocuments, isError: isErrorDocuments } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });
  
  // Get document categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery<DocumentCategory[]>({
    queryKey: ["/api/document-categories"],
  });
  
  // Upload document
  const { mutate: uploadDocumentMutation, isPending: isUploading } = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to upload document");
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Upload successful",
        description: `${data.name} has been uploaded successfully`,
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    },
  });
  
  // Upload document with callbacks
  const uploadDocument = (
    formData: FormData, 
    options?: { 
      onSuccess?: () => void,
      onError?: (error: any) => void 
    }
  ) => {
    uploadDocumentMutation(formData, {
      onSuccess: () => {
        if (options?.onSuccess) {
          options.onSuccess();
        }
      },
      onError: (error) => {
        if (options?.onError) {
          options.onError(error);
        }
      }
    });
  };
  
  // Delete document
  const { mutate: deleteDocument, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/documents/${id}`, undefined);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document deleted",
        description: "Document has been deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    },
  });
  
  // Download document
  const downloadDocument = async (id: number, name: string) => {
    try {
      const response = await fetch(`/api/documents/download/${id}`, {
        method: "GET",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to download document");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: `Downloading ${name}`,
      });
    } catch (error: any) {
      toast({
        title: "Download failed",
        description: error.message || "Failed to download document",
        variant: "destructive",
      });
    }
  };
  
  // Get documents by category
  const getDocumentsByCategory = (categoryId: number | null) => {
    if (!documents) return [];
    if (categoryId === null) return documents;
    return documents.filter(doc => doc.categoryId === categoryId);
  };
  
  return {
    documents,
    categories,
    isLoadingDocuments,
    isLoadingCategories,
    isErrorDocuments,
    uploadDocument,
    deleteDocument,
    downloadDocument,
    isUploading,
    isDeleting,
    getDocumentsByCategory,
  };
}
