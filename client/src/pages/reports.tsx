import { useState, useRef } from "react";
import Layout from "@/components/layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ReportDashboard } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductivityChart from "@/components/charts/productivity-chart";
import ProjectCompletionChart from "@/components/charts/project-completion-chart";
import { 
  PlusIcon, 
  SaveIcon, 
  TrashIcon, 
  EditIcon, 
  FilterIcon, 
  DownloadIcon, 
  ShareIcon,
  TableIcon,
  FileIcon,
  FileText as FileTextIcon, 
  FileSpreadsheet as FileSpreadsheetIcon,
  FilePdf as FilePdfIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const dashboardSchema = z.object({
  name: z.string().min(1, "Dashboard name is required"),
  isDefault: z.boolean().default(false),
  charts: z.array(z.object({
    type: z.string(),
    title: z.string(),
    timeframe: z.string()
  })).default([]),
});

export default function Reports() {
  const { toast } = useToast();
  const [activeDashboard, setActiveDashboard] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [exportRange, setExportRange] = useState<'all' | 'current'>('current');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
    to: new Date()
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedChartTypes, setSelectedChartTypes] = useState<string[]>(['productivity', 'projectCompletion']);
  const [isTableView, setIsTableView] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Get all dashboards
  const { data: dashboards, isLoading } = useQuery<ReportDashboard[]>({
    queryKey: ["/api/dashboards"],
    onSuccess: (data) => {
      if (data.length > 0 && !activeDashboard) {
        // Set default dashboard as active if it exists, otherwise use the first one
        const defaultDashboard = data.find(d => d.isDefault);
        setActiveDashboard(defaultDashboard ? defaultDashboard.id.toString() : data[0].id.toString());
      }
    }
  });
  
  // Create dashboard mutation
  const { mutate: createDashboard, isPending: isCreating } = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/dashboards", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboards"] });
      setCreateDialogOpen(false);
      setActiveDashboard(data.id.toString());
      toast({
        title: "Dashboard created",
        description: "Your dashboard has been created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create dashboard",
        variant: "destructive",
      });
    }
  });
  
  // Update dashboard mutation
  const { mutate: updateDashboard, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const res = await apiRequest("PUT", `/api/dashboards/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboards"] });
      setIsEditing(false);
      toast({
        title: "Dashboard updated",
        description: "Your dashboard has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update dashboard",
        variant: "destructive",
      });
    }
  });
  
  // Delete dashboard mutation
  const { mutate: deleteDashboard, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/dashboards/${id}`, undefined);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboards"] });
      // Set another dashboard as active
      if (dashboards && dashboards.length > 1) {
        const newActiveDashboard = dashboards.find(d => d.id.toString() !== activeDashboard);
        if (newActiveDashboard) {
          setActiveDashboard(newActiveDashboard.id.toString());
        }
      } else {
        setActiveDashboard(null);
      }
      toast({
        title: "Dashboard deleted",
        description: "Your dashboard has been deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete dashboard",
        variant: "destructive",
      });
    }
  });
  
  // Get the currently active dashboard
  const currentDashboard = dashboards?.find(d => d.id.toString() === activeDashboard);
  
  const form = useForm<z.infer<typeof dashboardSchema>>({
    resolver: zodResolver(dashboardSchema),
    defaultValues: {
      name: "",
      isDefault: false,
      charts: [
        {
          type: "productivity",
          title: "Productivity Trends",
          timeframe: "monthly"
        },
        {
          type: "projectCompletion",
          title: "Project Completion",
          timeframe: "quarterly"
        }
      ]
    }
  });

  const onSubmit = (values: z.infer<typeof dashboardSchema>) => {
    createDashboard({
      name: values.name,
      isDefault: values.isDefault,
      layout: {
        charts: values.charts
      }
    });
  };
  
  const handleSaveEdits = () => {
    if (!currentDashboard) return;
    
    // In a real application, you would have proper state management for the chart configurations
    // For this demo, we'll just save the current dashboard with a timestamp to show the update worked
    updateDashboard({
      id: currentDashboard.id,
      data: {
        name: currentDashboard.name,
        isDefault: currentDashboard.isDefault,
        layout: {
          ...currentDashboard.layout,
          lastUpdated: new Date().toISOString()
        }
      }
    });
  };
  
  const handleDeleteDashboard = () => {
    if (!currentDashboard || !window.confirm("Are you sure you want to delete this dashboard?")) return;
    deleteDashboard(currentDashboard.id);
  };

  return (
    <Layout title="Reports">
      <div className="p-4 sm:p-6 lg:p-8">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Reporting Dashboards</CardTitle>
                <CardDescription>Customize your reporting dashboards to track key metrics</CardDescription>
              </div>
              <div className="mt-4 sm:mt-0">
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Create Dashboard
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Dashboard</DialogTitle>
                      <DialogDescription>
                        Configure your new reporting dashboard
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dashboard Name</FormLabel>
                              <FormControl>
                                <Input placeholder="My Custom Dashboard" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="isDefault"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Set as Default</FormLabel>
                                <FormDescription>
                                  Make this your default dashboard
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button type="submit" disabled={isCreating}>
                            {isCreating ? "Creating..." : "Create Dashboard"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            ) : dashboards && dashboards.length > 0 ? (
              <>
                <Tabs
                  value={activeDashboard || undefined}
                  onValueChange={setActiveDashboard}
                  className="w-full"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <TabsList>
                      {dashboards.map(dashboard => (
                        <TabsTrigger key={dashboard.id} value={dashboard.id.toString()}>
                          {dashboard.name}
                          {dashboard.isDefault && (
                            <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">Default</span>
                          )}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {currentDashboard && (
                      <div className="flex items-center space-x-2">
                        {isEditing ? (
                          <Button 
                            onClick={handleSaveEdits} 
                            size="sm"
                            disabled={isUpdating}
                          >
                            <SaveIcon className="w-4 h-4 mr-2" />
                            {isUpdating ? "Saving..." : "Save Changes"}
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => setIsEditing(true)} 
                            variant="outline" 
                            size="sm"
                          >
                            <EditIcon className="w-4 h-4 mr-2" />
                            Edit Dashboard
                          </Button>
                        )}
                        
                        <Button 
                          onClick={handleDeleteDashboard} 
                          variant="outline" 
                          size="sm"
                          disabled={isDeleting || dashboards.length <= 1}
                        >
                          <TrashIcon className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {dashboards.map(dashboard => (
                    <TabsContent key={dashboard.id} value={dashboard.id.toString()}>
                      {isEditing && (
                        <div className="mb-6 p-4 border rounded-lg bg-neutral-lightest">
                          <h3 className="text-sm font-medium mb-2">Dashboard Configuration</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label htmlFor="dashboard-name" className="text-sm font-medium block mb-1">Dashboard Name</label>
                              <Input 
                                id="dashboard-name" 
                                value={dashboard.name} 
                                onChange={(e) => {
                                  // In a real app, you would update the dashboard state properly
                                  // For this demo, we're just showing the UI elements
                                }}
                              />
                            </div>
                            <div className="flex items-center space-x-2 self-end">
                              <Switch 
                                id="default-dashboard" 
                                checked={dashboard.isDefault} 
                                onCheckedChange={(checked) => {
                                  // In a real app, you would update the dashboard state properly
                                }}
                              />
                              <label htmlFor="default-dashboard" className="text-sm">Set as default dashboard</label>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {dashboard.layout.charts.map((chart: any, index: number) => {
                          if (chart.type === "productivity") {
                            return (
                              <ProductivityChart 
                                key={index}
                                title={chart.title}
                                timeframe={chart.timeframe}
                              />
                            );
                          } else if (chart.type === "projectCompletion") {
                            return (
                              <ProjectCompletionChart 
                                key={index}
                                title={chart.title}
                                timeframe={chart.timeframe}
                              />
                            );
                          }
                          return null;
                        })}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-light/30 flex items-center justify-center">
                  <PlusIcon className="w-8 h-8 text-neutral-medium" />
                </div>
                <h3 className="text-lg font-medium mb-2">No dashboards yet</h3>
                <p className="text-neutral-medium mb-6">Create your first dashboard to track key metrics</p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
