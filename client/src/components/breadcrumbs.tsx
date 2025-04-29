import { Link, useLocation } from "wouter";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const [currentPath] = useLocation();

  // If no items are provided, generate them from the current path
  const breadcrumbItems = items || generateBreadcrumbsFromPath(currentPath);

  return (
    <nav className={`flex items-center text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-3 h-3 mx-2 text-neutral-medium" />
              )}
              
              {!isLast && item.href ? (
                <Link 
                  href={item.href}
                  className="text-neutral-medium hover:text-primary transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-neutral-dark font-medium">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Helper function to generate breadcrumbs from the current path
function generateBreadcrumbsFromPath(path: string): BreadcrumbItem[] {
  if (path === "/") {
    return [{ label: "Home", href: "/" }];
  }

  // Remove leading and trailing slashes, then split by slash
  const segments = path.replace(/^\/|\/$/g, "").split("/");
  
  // Create breadcrumb items
  const items = [{ label: "Home", href: "/" }];
  
  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Convert segment to a readable label (capitalize, replace hyphens with spaces)
    const label = segment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    
    // All items need an href (use current path for last item too)
    items.push({ 
      label, 
      href: currentPath 
    });
  });
  
  return items;
}