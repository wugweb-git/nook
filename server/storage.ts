import {
  users,
  onboardingSteps,
  employeeOnboarding,
  documentCategories,
  documents,
  events,
  timeOffBalances,
  reportDashboards,
  type User,
  type InsertUser,
  type OnboardingStep,
  type InsertOnboardingStep,
  type EmployeeOnboarding,
  type InsertEmployeeOnboarding,
  type DocumentCategory,
  type InsertDocumentCategory,
  type Document,
  type InsertDocument,
  type Event,
  type InsertEvent,
  type TimeOffBalance,
  type InsertTimeOffBalance,
  type ReportDashboard,
  type InsertReportDashboard,
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Onboarding steps operations
  getOnboardingSteps(): Promise<OnboardingStep[]>;
  getOnboardingStep(id: number): Promise<OnboardingStep | undefined>;
  createOnboardingStep(step: InsertOnboardingStep): Promise<OnboardingStep>;
  
  // Employee onboarding operations
  getEmployeeOnboardingByUserId(userId: number): Promise<(EmployeeOnboarding & { step: OnboardingStep })[]>;
  updateEmployeeOnboardingStatus(id: number, status: string, completedAt?: Date): Promise<EmployeeOnboarding | undefined>;
  createEmployeeOnboardingRecord(record: InsertEmployeeOnboarding): Promise<EmployeeOnboarding>;
  
  // Document categories operations
  getDocumentCategories(): Promise<DocumentCategory[]>;
  getDocumentCategory(id: number): Promise<DocumentCategory | undefined>;
  createDocumentCategory(category: InsertDocumentCategory): Promise<DocumentCategory>;
  
  // Documents operations
  getDocuments(): Promise<Document[]>;
  getDocumentsByUserId(userId: number): Promise<Document[]>;
  getDocumentsByCategory(categoryId: number): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Events operations
  getEvents(): Promise<Event[]>;
  getEventsByUserId(userId: number): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Time off balance operations
  getTimeOffBalanceByUserId(userId: number): Promise<TimeOffBalance | undefined>;
  createTimeOffBalance(timeOff: InsertTimeOffBalance): Promise<TimeOffBalance>;
  updateTimeOffBalance(userId: number, updates: Partial<TimeOffBalance>): Promise<TimeOffBalance | undefined>;
  
  // Report dashboard operations
  getReportDashboardsByUserId(userId: number): Promise<ReportDashboard[]>;
  getReportDashboard(id: number): Promise<ReportDashboard | undefined>;
  getDefaultReportDashboardForUser(userId: number): Promise<ReportDashboard | undefined>;
  createReportDashboard(dashboard: InsertReportDashboard): Promise<ReportDashboard>;
  updateReportDashboard(id: number, updates: Partial<ReportDashboard>): Promise<ReportDashboard | undefined>;
  deleteReportDashboard(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private onboardingSteps: Map<number, OnboardingStep>;
  private employeeOnboarding: Map<number, EmployeeOnboarding>;
  private documentCategories: Map<number, DocumentCategory>;
  private documents: Map<number, Document>;
  private events: Map<number, Event>;
  private timeOffBalances: Map<number, TimeOffBalance>;
  private reportDashboards: Map<number, ReportDashboard>;
  
  private currentIds: {
    users: number;
    onboardingSteps: number;
    employeeOnboarding: number;
    documentCategories: number;
    documents: number;
    events: number;
    timeOffBalances: number;
    reportDashboards: number;
  };

  constructor() {
    this.users = new Map();
    this.onboardingSteps = new Map();
    this.employeeOnboarding = new Map();
    this.documentCategories = new Map();
    this.documents = new Map();
    this.events = new Map();
    this.timeOffBalances = new Map();
    this.reportDashboards = new Map();
    
    this.currentIds = {
      users: 1,
      onboardingSteps: 1,
      employeeOnboarding: 1,
      documentCategories: 1,
      documents: 1,
      events: 1,
      timeOffBalances: 1,
      reportDashboards: 1,
    };
    
    // Initialize with default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default admin user
    const adminUser: InsertUser = {
      username: "vedanshu",
      password: "WugWeb123@", // In a real app, this would be hashed
      firstName: "Vedanshu",
      lastName: "Srivastava",
      email: "vedanshu@wugweb.com",
      role: "admin",
      department: "HR",
      position: "HR Manager",
      avatar: "",
    };
    
    this.createUser(adminUser);
    
    // Create default employee user (Emily Smith from the design)
    const employeeUser: InsertUser = {
      username: "emily",
      password: "emily123", // In a real app, this would be hashed
      firstName: "Emily",
      lastName: "Smith",
      email: "emily@example.com",
      role: "employee",
      department: "Marketing",
      position: "Marketing Specialist",
      avatar: "",
    };
    
    const emilyUser = this.createUser(employeeUser);
    
    // Create default onboarding steps
    const steps: InsertOnboardingStep[] = [
      { name: "Personal Information", description: "Complete your personal information", order: 1 },
      { name: "Employment Details", description: "Verify your employment details", order: 2 },
      { name: "Tax Information", description: "Provide your tax information", order: 3 },
      { name: "Company Policy Acknowledgement", description: "Read and acknowledge company policies", order: 4 },
      { name: "Equipment Setup", description: "Setup your company equipment", order: 5 },
    ];
    
    const createdSteps = steps.map(step => this.createOnboardingStep(step));
    
    // Create employee onboarding records for Emily
    if (emilyUser && createdSteps.length === 5) {
      // First three steps are completed
      for (let i = 0; i < 3; i++) {
        const completedDate = new Date();
        completedDate.setDate(completedDate.getDate() - (3 - i)); // Completed over the last 3 days
        
        this.createEmployeeOnboardingRecord({
          userId: emilyUser.id,
          stepId: createdSteps[i].id,
          status: "completed"
        });
        
        this.updateEmployeeOnboardingStatus(i + 1, "completed", completedDate);
      }
      
      // Step 4 is in progress
      this.createEmployeeOnboardingRecord({
        userId: emilyUser.id,
        stepId: createdSteps[3].id,
        status: "in_progress"
      });
      
      // Step 5 is not started
      this.createEmployeeOnboardingRecord({
        userId: emilyUser.id,
        stepId: createdSteps[4].id,
        status: "not_started"
      });
    }
    
    // Create document categories
    const categories: InsertDocumentCategory[] = [
      { name: "Salary Slips", description: "Monthly salary slips" },
      { name: "Contracts", description: "Employment contracts and agreements" },
      { name: "Policies", description: "Company policies and guidelines" },
      { name: "Tax Documents", description: "Tax-related documents" },
      { name: "Benefits", description: "Benefits and insurance information" },
    ];
    
    const createdCategories = categories.map(category => this.createDocumentCategory(category));
    
    // Create some sample documents for Emily
    if (emilyUser && createdCategories.length > 0) {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 31);
      const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 15);
      
      const documents: InsertDocument[] = [
        {
          name: "May 2023 Salary Slip",
          filename: "may_2023_salary_slip.pdf",
          filesize: 257000,
          mimeType: "application/pdf",
          categoryId: createdCategories[0].id,
          uploadedBy: 1, // Admin uploaded
          isPublic: false,
          metadata: {}
        },
        {
          name: "Employment Contract",
          filename: "employment_contract.pdf",
          filesize: 542000,
          mimeType: "application/pdf",
          categoryId: createdCategories[1].id,
          uploadedBy: 1, // Admin uploaded
          isPublic: false,
          metadata: {}
        },
        {
          name: "Health Insurance Policy",
          filename: "health_insurance_policy.pdf",
          filesize: 385000,
          mimeType: "application/pdf",
          categoryId: createdCategories[4].id,
          uploadedBy: 1, // Admin uploaded
          isPublic: true,
          metadata: {}
        }
      ];
      
      documents.forEach(doc => this.createDocument(doc));
    }
    
    // Create events
    if (emilyUser) {
      const now = new Date();
      const events: InsertEvent[] = [
        {
          title: "Team Meeting",
          description: "Regular team meeting to discuss ongoing projects",
          startDate: new Date(now.getFullYear(), now.getMonth(), 15, 10, 0), // June 15, 10:00 AM
          endDate: new Date(now.getFullYear(), now.getMonth(), 15, 11, 30), // June 15, 11:30 AM
          location: "Conference Room A",
          category: "Marketing Department",
          createdBy: 1 // Admin created
        },
        {
          title: "Quarterly Review",
          description: "Quarterly performance review session",
          startDate: new Date(now.getFullYear(), now.getMonth(), 18, 14, 0), // June 18, 2:00 PM
          endDate: new Date(now.getFullYear(), now.getMonth(), 18, 15, 30), // June 18, 3:30 PM
          location: "HR Office",
          category: "Performance Review",
          createdBy: 1 // Admin created
        },
        {
          title: "Company Town Hall",
          description: "Company-wide town hall meeting",
          startDate: new Date(now.getFullYear(), now.getMonth(), 22, 9, 0), // June 22, 9:00 AM
          endDate: new Date(now.getFullYear(), now.getMonth(), 22, 10, 30), // June 22, 10:30 AM
          location: "Main Auditorium",
          category: "All Employees",
          createdBy: 1 // Admin created
        }
      ];
      
      events.forEach(event => this.createEvent(event));
      
      // Create time off balance for Emily
      this.createTimeOffBalance({
        userId: emilyUser.id,
        vacationTotal: 20,
        vacationUsed: 5,
        sickTotal: 10,
        sickUsed: 4,
        personalTotal: 5,
        personalUsed: 3
      });
      
      // Create default dashboard
      this.createReportDashboard({
        userId: emilyUser.id,
        name: "Default Dashboard",
        layout: {
          charts: [
            { type: "productivity", title: "Productivity Trends", timeframe: "monthly" },
            { type: "projectCompletion", title: "Project Completion", timeframe: "quarterly" }
          ]
        },
        isDefault: true
      });
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const now = new Date();
    const user: User = { ...insertUser, id, lastLogin: now };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Onboarding steps operations
  async getOnboardingSteps(): Promise<OnboardingStep[]> {
    return Array.from(this.onboardingSteps.values())
      .sort((a, b) => a.order - b.order);
  }
  
  async getOnboardingStep(id: number): Promise<OnboardingStep | undefined> {
    return this.onboardingSteps.get(id);
  }
  
  async createOnboardingStep(step: InsertOnboardingStep): Promise<OnboardingStep> {
    const id = this.currentIds.onboardingSteps++;
    const newStep: OnboardingStep = { ...step, id };
    this.onboardingSteps.set(id, newStep);
    return newStep;
  }

  // Employee onboarding operations
  async getEmployeeOnboardingByUserId(userId: number): Promise<(EmployeeOnboarding & { step: OnboardingStep })[]> {
    const records = Array.from(this.employeeOnboarding.values())
      .filter(record => record.userId === userId);
    
    return records.map(record => {
      const step = this.onboardingSteps.get(record.stepId);
      if (!step) throw new Error(`Onboarding step not found: ${record.stepId}`);
      return { ...record, step };
    }).sort((a, b) => a.step.order - b.step.order);
  }
  
  async updateEmployeeOnboardingStatus(id: number, status: string, completedAt?: Date): Promise<EmployeeOnboarding | undefined> {
    const record = this.employeeOnboarding.get(id);
    if (!record) return undefined;
    
    const updatedRecord: EmployeeOnboarding = {
      ...record,
      status,
      completedAt: status === "completed" ? completedAt || new Date() : record.completedAt
    };
    
    this.employeeOnboarding.set(id, updatedRecord);
    return updatedRecord;
  }
  
  async createEmployeeOnboardingRecord(record: InsertEmployeeOnboarding): Promise<EmployeeOnboarding> {
    const id = this.currentIds.employeeOnboarding++;
    const newRecord: EmployeeOnboarding = {
      ...record,
      id,
      completedAt: record.status === "completed" ? new Date() : undefined
    };
    this.employeeOnboarding.set(id, newRecord);
    return newRecord;
  }

  // Document categories operations
  async getDocumentCategories(): Promise<DocumentCategory[]> {
    return Array.from(this.documentCategories.values());
  }
  
  async getDocumentCategory(id: number): Promise<DocumentCategory | undefined> {
    return this.documentCategories.get(id);
  }
  
  async createDocumentCategory(category: InsertDocumentCategory): Promise<DocumentCategory> {
    const id = this.currentIds.documentCategories++;
    const newCategory: DocumentCategory = { ...category, id };
    this.documentCategories.set(id, newCategory);
    return newCategory;
  }

  // Documents operations
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values())
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }
  
  async getDocumentsByUserId(userId: number): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.uploadedBy === userId || doc.isPublic)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }
  
  async getDocumentsByCategory(categoryId: number): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.categoryId === categoryId)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }
  
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }
  
  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.currentIds.documents++;
    const now = new Date();
    const newDocument: Document = { ...document, id, uploadedAt: now };
    this.documents.set(id, newDocument);
    return newDocument;
  }
  
  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }

  // Events operations
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values())
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }
  
  async getEventsByUserId(userId: number): Promise<Event[]> {
    // In a real app, we'd have a many-to-many relationship for event participants
    // For simplicity, we'll return all events for now
    return this.getEvents();
  }
  
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.currentIds.events++;
    const newEvent: Event = { ...event, id };
    this.events.set(id, newEvent);
    return newEvent;
  }

  // Time off balance operations
  async getTimeOffBalanceByUserId(userId: number): Promise<TimeOffBalance | undefined> {
    return Array.from(this.timeOffBalances.values())
      .find(balance => balance.userId === userId);
  }
  
  async createTimeOffBalance(timeOff: InsertTimeOffBalance): Promise<TimeOffBalance> {
    const id = this.currentIds.timeOffBalances++;
    const newTimeOff: TimeOffBalance = { ...timeOff, id };
    this.timeOffBalances.set(id, newTimeOff);
    return newTimeOff;
  }
  
  async updateTimeOffBalance(userId: number, updates: Partial<TimeOffBalance>): Promise<TimeOffBalance | undefined> {
    const timeOff = Array.from(this.timeOffBalances.values())
      .find(balance => balance.userId === userId);
    
    if (!timeOff) return undefined;
    
    const updatedTimeOff: TimeOffBalance = { ...timeOff, ...updates };
    this.timeOffBalances.set(timeOff.id, updatedTimeOff);
    return updatedTimeOff;
  }

  // Report dashboard operations
  async getReportDashboardsByUserId(userId: number): Promise<ReportDashboard[]> {
    return Array.from(this.reportDashboards.values())
      .filter(dashboard => dashboard.userId === userId);
  }
  
  async getReportDashboard(id: number): Promise<ReportDashboard | undefined> {
    return this.reportDashboards.get(id);
  }
  
  async getDefaultReportDashboardForUser(userId: number): Promise<ReportDashboard | undefined> {
    return Array.from(this.reportDashboards.values())
      .find(dashboard => dashboard.userId === userId && dashboard.isDefault);
  }
  
  async createReportDashboard(dashboard: InsertReportDashboard): Promise<ReportDashboard> {
    const id = this.currentIds.reportDashboards++;
    const newDashboard: ReportDashboard = { ...dashboard, id };
    this.reportDashboards.set(id, newDashboard);
    return newDashboard;
  }
  
  async updateReportDashboard(id: number, updates: Partial<ReportDashboard>): Promise<ReportDashboard | undefined> {
    const dashboard = this.reportDashboards.get(id);
    if (!dashboard) return undefined;
    
    const updatedDashboard: ReportDashboard = { ...dashboard, ...updates };
    this.reportDashboards.set(id, updatedDashboard);
    return updatedDashboard;
  }
  
  async deleteReportDashboard(id: number): Promise<boolean> {
    return this.reportDashboards.delete(id);
  }
}

export const storage = new MemStorage();
