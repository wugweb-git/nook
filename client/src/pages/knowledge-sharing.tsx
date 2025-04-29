import Layout from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookIcon, FileTextIcon, SearchIcon, BookOpenIcon, FileIcon, DownloadIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

// Mock knowledge base data
const documents = [
  {
    id: 1,
    title: "Employee Handbook",
    description: "Comprehensive guide to company policies, benefits, and procedures",
    category: "policies",
    date: new Date(2024, 10, 15),
    type: "PDF"
  },
  {
    id: 2,
    title: "Code of Conduct",
    description: "Guidelines for professional behavior and ethics",
    category: "policies",
    date: new Date(2024, 9, 20),
    type: "PDF"
  },
  {
    id: 3,
    title: "Health Insurance Benefits",
    description: "Details of the company health insurance plan and coverage",
    category: "benefits",
    date: new Date(2024, 8, 5),
    type: "DOCX"
  },
  {
    id: 4,
    title: "Retirement Benefits Plan",
    description: "Information about 401(k) and retirement options",
    category: "benefits",
    date: new Date(2024, 7, 12),
    type: "PDF"
  },
  {
    id: 5,
    title: "Expense Reimbursement Process",
    description: "Step-by-step guide to submitting and processing expense reports",
    category: "procedures",
    date: new Date(2024, 6, 30),
    type: "PDF"
  },
  {
    id: 6,
    title: "Leave Policy",
    description: "Vacation, sick leave, and other time-off policies",
    category: "policies",
    date: new Date(2024, 6, 15),
    type: "PDF"
  },
  {
    id: 7,
    title: "Travel Policy",
    description: "Guidelines for business travel arrangements and expenses",
    category: "procedures",
    date: new Date(2024, 5, 22),
    type: "DOCX"
  },
  {
    id: 8,
    title: "Performance Review Process",
    description: "Annual performance evaluation guidelines and timeline",
    category: "procedures",
    date: new Date(2024, 4, 10),
    type: "PDF"
  }
];

export default function KnowledgeSharing() {
  return (
    <Layout title="Knowledge Sharing">
      <div className="p-4 sm:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Knowledge Sharing</CardTitle>
                <CardDescription>
                  Access company policies, handbooks and resources
                </CardDescription>
              </div>
              <div className="mt-4 sm:mt-0 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-medium" />
                <Input className="pl-10" placeholder="Search documents..." />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <BookOpenIcon className="w-4 h-4" />
                  <span>All Documents</span>
                </TabsTrigger>
                <TabsTrigger value="policies" className="flex items-center gap-2">
                  <BookIcon className="w-4 h-4" />
                  <span>Policies</span>
                </TabsTrigger>
                <TabsTrigger value="benefits" className="flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4" />
                  <span>Benefits</span>
                </TabsTrigger>
                <TabsTrigger value="procedures" className="flex items-center gap-2">
                  <FileIcon className="w-4 h-4" />
                  <span>Procedures</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="space-y-4">
                  {documents.map(doc => (
                    <DocumentItem key={doc.id} document={doc} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="policies">
                <div className="space-y-4">
                  {documents
                    .filter(doc => doc.category === 'policies')
                    .map(doc => (
                      <DocumentItem key={doc.id} document={doc} />
                    ))
                  }
                </div>
              </TabsContent>
              
              <TabsContent value="benefits">
                <div className="space-y-4">
                  {documents
                    .filter(doc => doc.category === 'benefits')
                    .map(doc => (
                      <DocumentItem key={doc.id} document={doc} />
                    ))
                  }
                </div>
              </TabsContent>
              
              <TabsContent value="procedures">
                <div className="space-y-4">
                  {documents
                    .filter(doc => doc.category === 'procedures')
                    .map(doc => (
                      <DocumentItem key={doc.id} document={doc} />
                    ))
                  }
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

// Document item component
function DocumentItem({ document }: { document: any }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary mr-4">
          <FileTextIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-medium">{document.title}</h3>
          <p className="text-neutral-medium text-sm mb-1">{document.description}</p>
          <div className="flex items-center text-xs text-neutral-medium">
            <span className="bg-primary-light bg-opacity-20 text-primary px-2 py-0.5 rounded">
              {document.type}
            </span>
            <span className="mx-2">•</span>
            <span>Updated {formatDate(document.date)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="flex items-center">
          <ExternalLinkIcon className="w-4 h-4 mr-1" />
          View
        </Button>
        <Button variant="outline" size="sm" className="flex items-center">
          <DownloadIcon className="w-4 h-4 mr-1" />
          Download
        </Button>
      </div>
    </div>
  );
}