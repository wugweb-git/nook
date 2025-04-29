import { Badge } from "@/components/ui/badge";

interface DocumentTypeBadgeProps {
  type: string;
  className?: string;
}

export default function DocumentTypeBadge({ type, className = "" }: DocumentTypeBadgeProps) {
  // Determine badge style based on document type
  let badgeStyle = "bg-gray-100 text-gray-800"; // Default style
  
  const lowerType = type.toLowerCase();
  
  if (lowerType === "employment" || lowerType.includes("employment")) {
    badgeStyle = "bg-blue-50 text-blue-700";
  } else if (lowerType === "legal" || lowerType.includes("nda") || lowerType.includes("agreement")) {
    badgeStyle = "bg-purple-50 text-purple-700";
  } else if (lowerType === "policies" || lowerType.includes("policy") || lowerType.includes("handbook")) {
    badgeStyle = "bg-teal-50 text-teal-700";
  } else if (lowerType === "finance" || lowerType.includes("salary") || lowerType.includes("payment")) {
    badgeStyle = "bg-green-50 text-green-700";
  } else if (lowerType === "id" || lowerType.includes("identity") || lowerType.includes("passport")) {
    badgeStyle = "bg-amber-50 text-amber-700";
  } else if (lowerType === "health" || lowerType.includes("medical") || lowerType.includes("insurance")) {
    badgeStyle = "bg-red-50 text-red-700";
  } else if (lowerType === "education" || lowerType.includes("certificate") || lowerType.includes("degree")) {
    badgeStyle = "bg-indigo-50 text-indigo-700";
  }
  
  return (
    <Badge 
      variant="outline" 
      className={`${badgeStyle} border-0 rounded-full text-xs font-medium px-3 py-1 ${className}`}
    >
      {type}
    </Badge>
  );
}