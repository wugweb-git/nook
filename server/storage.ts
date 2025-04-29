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
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
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
    // Create default admin user with complete profile data
    const adminUser: InsertUser = {
      username: "vedanshu",
      password: "WugWeb123@", // In a real app, this would be hashed
      firstName: "Vedanshu",
      lastName: "Srivastava",
      email: "vedanshu@wugweb.com",
      role: "admin",
      department: "HR",
      position: "HR Director",
      avatar: "/uploads/profile/vedanshu.jpg",
      gender: "male",
      jobArea: "Human Resources",
      
      // Social media
      linkedin: "linkedin.com/in/vedanshu",
      github: "github.com/vedanshu",
      twitter: "twitter.com/vedanshu",
      website: "vedanshu.dev",
      
      // Government IDs
      panNumber: "ABCDE1234F",
      aadhaarNumber: "1234-5678-9012",
      
      // Financial details
      pfNumber: "PF98765432",
      uanNumber: "UAN87654321",
      bankAccountNumber: "1234567890",
      bankName: "HDFC Bank",
      ifscCode: "HDFC0001234",
      
      // Contact details
      phoneNumber: "+91 98765 43210",
      emergencyContactName: "Rahul Srivastava",
      emergencyContactNumber: "+91 87654 32109",
      emergencyContactRelation: "Brother",
      
      // Address
      currentAddress: "123 Main Street, Koramangala",
      permanentAddress: "123 Main Street, Koramangala",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      pincode: "560034",
      
      // Employment details
      employeeId: "WUG0001",
      joiningDate: new Date("2020-01-15"),
      probationEndDate: new Date("2020-04-15"),
      employmentType: "full-time",
      workLocation: "hybrid",
    };
    
    const vedanshu = this.createUser(adminUser);
    
    // Create default onboarding steps
    const steps: InsertOnboardingStep[] = [
      { name: "Personal Information", description: "Complete your personal information", order: 1 },
      { name: "Employment Details", description: "Verify your employment details", order: 2 },
      { name: "Tax Information", description: "Provide your tax information", order: 3 },
      { name: "Company Policy Acknowledgement", description: "Read and acknowledge company policies", order: 4 },
      { name: "Equipment Setup", description: "Setup your company equipment", order: 5 },
    ];
    
    const createdSteps = steps.map(step => this.createOnboardingStep(step));
    
    // Mark all onboarding steps as completed for admin user
    if (vedanshu && createdSteps.length === 5) {
      // Set completion dates with appropriate spacing
      const now = new Date();
      
      for (let i = 0; i < 5; i++) {
        const completedDate = new Date(now);
        completedDate.setDate(completedDate.getDate() - (30 - i * 5)); // Completed over the last month
        
        const record = this.createEmployeeOnboardingRecord({
          userId: vedanshu.id,
          stepId: createdSteps[i].id,
          status: "completed"
        });
        
        this.updateEmployeeOnboardingStatus(record.id, "completed", completedDate);
      }
      
      // Create time off balance for Vedanshu
      this.createTimeOffBalance({
        userId: vedanshu.id,
        vacationTotal: 30,
        vacationUsed: 8,
        sickTotal: 15,
        sickUsed: 2,
        personalTotal: 10,
        personalUsed: 3
      });
      
      // Create default dashboard for Vedanshu
      this.createReportDashboard({
        userId: vedanshu.id,
        name: "HR Analytics Dashboard",
        layout: {
          charts: [
            { type: "employeeEngagement", title: "Employee Engagement", timeframe: "quarterly" },
            { type: "attrition", title: "Attrition Rate", timeframe: "annual" },
            { type: "recruitment", title: "Recruitment Metrics", timeframe: "monthly" }
          ]
        },
        isDefault: true
      });
      
      // Create document categories
      const categories: InsertDocumentCategory[] = [
        { name: "Salary Slips", description: "Monthly salary slips" },
        { name: "Contracts", description: "Employment contracts and agreements" },
        { name: "Policies", description: "Company policies and guidelines" },
        { name: "Tax Documents", description: "Tax-related documents" },
        { name: "Benefits", description: "Benefits and insurance information" },
      ];
      
      const createdCategories = categories.map(category => this.createDocumentCategory(category));
      
      // Create sample verified documents for Vedanshu
      if (createdCategories.length > 0) {
        const documents: InsertDocument[] = [
          {
            name: "Employment Contract",
            filename: "employment_contract_vedanshu.pdf",
            filesize: 578000,
            mimeType: "application/pdf",
            categoryId: createdCategories[1].id,
            uploadedBy: vedanshu.id,
            isPublic: false,
            isVerified: true,
            metadata: {}
          },
          {
            name: "PAN Card",
            filename: "pan_card_vedanshu.pdf",
            filesize: 125000,
            mimeType: "application/pdf",
            categoryId: createdCategories[3].id,
            uploadedBy: vedanshu.id,
            isPublic: false,
            isVerified: true,
            metadata: {}
          },
          {
            name: "Aadhaar Card",
            filename: "aadhaar_card_vedanshu.pdf",
            filesize: 230000,
            mimeType: "application/pdf",
            categoryId: createdCategories[3].id,
            uploadedBy: vedanshu.id,
            isPublic: false,
            isVerified: true,
            metadata: {}
          },
          {
            name: "Health Insurance Policy",
            filename: "health_insurance_vedanshu.pdf",
            filesize: 412000,
            mimeType: "application/pdf",
            categoryId: createdCategories[4].id,
            uploadedBy: vedanshu.id,
            isPublic: false,
            isVerified: true,
            metadata: {}
          },
          {
            name: "April 2025 Salary Slip",
            filename: "apr_2025_salary_slip.pdf",
            filesize: 271000,
            mimeType: "application/pdf",
            categoryId: createdCategories[0].id,
            uploadedBy: vedanshu.id,
            isPublic: false,
            isVerified: true,
            metadata: {}
          },
          {
            name: "March 2025 Salary Slip",
            filename: "mar_2025_salary_slip.pdf",
            filesize: 268000,
            mimeType: "application/pdf",
            categoryId: createdCategories[0].id,
            uploadedBy: vedanshu.id,
            isPublic: false,
            isVerified: true,
            metadata: {}
          }
        ];
        
        documents.forEach(doc => this.createDocument(doc));
      }
    }
    
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
    
    // Test user 1 - Fully onboarded
    const user1: InsertUser = {
      username: "user1",
      password: "wugweb", // In a real app, this would be hashed
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@example.com",
      role: "employee",
      department: "Marketing",
      position: "Marketing Manager",
      avatar: "",
      
      // Personal details
      gender: "female",
      dateOfBirth: new Date("1992-08-12"),
      maritalStatus: "married",
      bloodGroup: "B+",
      emergencyContactName: "David Johnson",
      emergencyContactRelation: "Spouse",
      emergencyContactNumber: "+919876543211",
      
      // Government IDs
      panNumber: "GXIPS1234F",
      aadhaarNumber: "8765-4321-0987",
      
      // Financial details
      pfNumber: "PF12345678",
      uanNumber: "UAN23456789",
      bankAccountNumber: "9876543210",
      bankName: "ICICI Bank",
      ifscCode: "ICIC0001234",
      
      // Address
      currentAddress: "45 Park Avenue, Indiranagar",
      permanentAddress: "45 Park Avenue, Indiranagar",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      pincode: "560038",
      
      // Employment details
      employeeId: "WUG0002",
      joiningDate: new Date("2021-03-10"),
      probationEndDate: new Date("2021-06-10"),
      employmentType: "full-time",
      workLocation: "remote",
    };
    
    // Test user 2 - Partially onboarded
    const user2: InsertUser = {
      username: "user2",
      password: "wugweb", // In a real app, this would be hashed
      firstName: "Michael",
      lastName: "Chen",
      email: "michael@example.com",
      role: "employee",
      department: "Product",
      position: "Product Designer",
      avatar: "",
      
      // Partial personal details
      gender: "male",
      dateOfBirth: new Date("1988-11-24"),
      maritalStatus: "single",
      
      // Minimal work details
      employeeId: "WUG0003",
      joiningDate: new Date("2023-01-05"),
      probationEndDate: new Date("2023-04-05"),
      employmentType: "full-time",
      workLocation: "hybrid",
    };
    
    // Test user 3 - Brand new user
    const user3: InsertUser = {
      username: "user3",
      password: "wugweb", // In a real app, this would be hashed
      firstName: "Priya",
      lastName: "Sharma",
      email: "priya@example.com",
      role: "employee",
      department: "Sales",
      position: "Sales Representative",
      avatar: "",
      
      // Minimal employment details
      employeeId: "WUG0004",
      joiningDate: new Date("2025-04-25"), // Just joined
    };
    
    const sarah = this.createUser(user1);
    const michael = this.createUser(user2);
    const priya = this.createUser(user3);
    
    // Configure onboarding status for test users
    if (createdSteps && createdSteps.length === 5) {
      // User 1 - Sarah - All steps completed (100%)
      for (let i = 0; i < 5; i++) {
        const completedDate = new Date();
        completedDate.setDate(completedDate.getDate() - (15 - i * 3));
        
        const record = this.createEmployeeOnboardingRecord({
          userId: sarah.id,
          stepId: createdSteps[i].id,
          status: "completed"
        });
        
        this.updateEmployeeOnboardingStatus(record.id, "completed", completedDate);
      }
      
      // User 2 - Michael - Partially completed (60%)
      // First three steps completed
      for (let i = 0; i < 3; i++) {
        const completedDate = new Date();
        completedDate.setDate(completedDate.getDate() - (7 - i));
        
        const record = this.createEmployeeOnboardingRecord({
          userId: michael.id,
          stepId: createdSteps[i].id,
          status: "completed"
        });
        
        this.updateEmployeeOnboardingStatus(record.id, "completed", completedDate);
      }
      
      // Steps 4 and 5 not started
      for (let i = 3; i < 5; i++) {
        this.createEmployeeOnboardingRecord({
          userId: michael.id,
          stepId: createdSteps[i].id,
          status: "not_started"
        });
      }
      
      // User 3 - Priya - Brand new (0%)
      // Create onboarding records but all are not_started
      for (let i = 0; i < 5; i++) {
        this.createEmployeeOnboardingRecord({
          userId: priya.id,
          stepId: createdSteps[i].id,
          status: "not_started"
        });
      }
    }
    
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
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
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
