import { useDocuments } from "@/hooks/useDocuments";
import { FileTextIcon, DownloadIcon } from "lucide-react";
import { formatDate, truncateText } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentsWidgetProps {
  limit?: number;
}

export default function DocumentsWidget({ limit = 3 }: DocumentsWidgetProps) {
  const { documents, isLoadingDocuments, downloadDocument } = useDocuments();
  
  const recentDocuments = documents 
    ? documents.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      ).slice(0, limit)
    : [];
  
  if (isLoadingDocuments) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-24" />
        </div>
        
        <div className="space-y-3">
          {Array(limit).fill(0).map((_, i) => (
            <div key={i} className="flex items-center p-2">
              <Skeleton className="w-9 h-9 rounded mr-3" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="w-5 h-5 ml-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-heading font-medium">Recent Documents</h4>
        <a href="/documents" className="text-primary text-sm font-medium hover:underline">View All</a>
      </div>
      
      {recentDocuments.length > 0 ? (
        <div className="space-y-3">
          {recentDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center p-2 hover:bg-neutral-lightest rounded-md transition-colors">
              <div className="w-9 h-9 rounded bg-primary-light bg-opacity-10 text-primary flex items-center justify-center mr-3">
                <FileTextIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-medium truncate" title={doc.name}>
                  {truncateText(doc.name, 30)}
                </h5>
                <p className="text-xs text-neutral-medium">
                  Added on {formatDate(doc.uploadedAt)}
                </p>
              </div>
              <button 
                className="ml-2 text-neutral-medium hover:text-primary focus:outline-none"
                onClick={() => downloadDocument(doc.id, doc.name)}
                title="Download document"
                aria-label={`Download ${doc.name}`}
              >
                <DownloadIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-neutral-medium">
          <FileTextIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No documents available</p>
        </div>
      )}
    </div>
  );
}
