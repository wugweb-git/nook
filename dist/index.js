// server/index.ts
import express3 from "express";

// server/routes.ts
import express from "express";
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  onboardingSteps;
  employeeOnboarding;
  documentCategories;
  documents;
  events;
  timeOffBalances;
  reportDashboards;
  currentIds;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.onboardingSteps = /* @__PURE__ */ new Map();
    this.employeeOnboarding = /* @__PURE__ */ new Map();
    this.documentCategories = /* @__PURE__ */ new Map();
    this.documents = /* @__PURE__ */ new Map();
    this.events = /* @__PURE__ */ new Map();
    this.timeOffBalances = /* @__PURE__ */ new Map();
    this.reportDashboards = /* @__PURE__ */ new Map();
    this.currentIds = {
      users: 1,
      onboardingSteps: 1,
      employeeOnboarding: 1,
      documentCategories: 1,
      documents: 1,
      events: 1,
      timeOffBalances: 1,
      reportDashboards: 1
    };
    this.initializeDefaultData();
  }
  initializeDefaultData() {
    const adminUser = {
      username: "vedanshu",
      password: "WugWeb123@",
      // In a real app, this would be hashed
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
      joiningDate: /* @__PURE__ */ new Date("2020-01-15"),
      probationEndDate: /* @__PURE__ */ new Date("2020-04-15"),
      employmentType: "full-time",
      workLocation: "hybrid"
    };
    const vedanshu = this.createUser(adminUser);
    const steps = [
      { name: "Personal Information", description: "Complete your personal information", order: 1 },
      { name: "Employment Details", description: "Verify your employment details", order: 2 },
      { name: "Tax Information", description: "Provide your tax information", order: 3 },
      { name: "Company Policy Acknowledgement", description: "Read and acknowledge company policies", order: 4 },
      { name: "Equipment Setup", description: "Setup your company equipment", order: 5 }
    ];
    const createdSteps = steps.map((step) => this.createOnboardingStep(step));
    if (vedanshu && createdSteps.length === 5) {
      const now = /* @__PURE__ */ new Date();
      for (let i = 0; i < 5; i++) {
        const completedDate = new Date(now);
        completedDate.setDate(completedDate.getDate() - (30 - i * 5));
        const record = this.createEmployeeOnboardingRecord({
          userId: vedanshu.id,
          stepId: createdSteps[i].id,
          status: "completed"
        });
        this.updateEmployeeOnboardingStatus(record.id, "completed", completedDate);
      }
      this.createTimeOffBalance({
        userId: vedanshu.id,
        vacationTotal: 30,
        vacationUsed: 8,
        sickTotal: 15,
        sickUsed: 2,
        personalTotal: 10,
        personalUsed: 3
      });
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
      const categories2 = [
        { name: "Salary Slips", description: "Monthly salary slips" },
        { name: "Contracts", description: "Employment contracts and agreements" },
        { name: "Policies", description: "Company policies and guidelines" },
        { name: "Tax Documents", description: "Tax-related documents" },
        { name: "Benefits", description: "Benefits and insurance information" }
      ];
      const createdCategories2 = categories2.map((category) => this.createDocumentCategory(category));
      if (createdCategories2.length > 0) {
        const documents2 = [
          {
            name: "Employment Contract",
            filename: "employment_contract_vedanshu.pdf",
            filesize: 578e3,
            mimeType: "application/pdf",
            categoryId: createdCategories2[1].id,
            uploadedBy: vedanshu.id,
            isPublic: false,
            isVerified: true,
            metadata: {}
          },
          {
            name: "PAN Card",
            filename: "pan_card_vedanshu.pdf",
            filesize: 125e3,
            mimeType: "application/pdf",
            categoryId: createdCategories2[3].id,
            uploadedBy: vedanshu.id,
            isPublic: false,
            isVerified: true,
            metadata: {}
          },
          {
            name: "Aadhaar Card",
            filename: "aadhaar_card_vedanshu.pdf",
            filesize: 23e4,
            mimeType: "application/pdf",
            categoryId: createdCategories2[3].id,
            uploadedBy: vedanshu.id,
            isPublic: false,
            isVerified: true,
            metadata: {}
          },
          {
            name: "Health Insurance Policy",
            filename: "health_insurance_vedanshu.pdf",
            filesize: 412e3,
            mimeType: "application/pdf",
            categoryId: createdCategories2[4].id,
            uploadedBy: vedanshu.id,
            isPublic: false,
            isVerified: true,
            metadata: {}
          },
          {
            name: "April 2025 Salary Slip",
            filename: "apr_2025_salary_slip.pdf",
            filesize: 271e3,
            mimeType: "application/pdf",
            categoryId: createdCategories2[0].id,
            uploadedBy: vedanshu.id,
            isPublic: false,
            isVerified: true,
            metadata: {}
          },
          {
            name: "March 2025 Salary Slip",
            filename: "mar_2025_salary_slip.pdf",
            filesize: 268e3,
            mimeType: "application/pdf",
            categoryId: createdCategories2[0].id,
            uploadedBy: vedanshu.id,
            isPublic: false,
            isVerified: true,
            metadata: {}
          }
        ];
        documents2.forEach((doc) => this.createDocument(doc));
      }
    }
    const employeeUser = {
      username: "emily",
      password: "emily123",
      // In a real app, this would be hashed
      firstName: "Emily",
      lastName: "Smith",
      email: "emily@example.com",
      role: "employee",
      department: "Marketing",
      position: "Marketing Specialist",
      avatar: ""
    };
    const emilyUser = this.createUser(employeeUser);
    const user1 = {
      username: "user1",
      password: "wugweb",
      // In a real app, this would be hashed
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@example.com",
      role: "employee",
      department: "Marketing",
      position: "Marketing Manager",
      avatar: "",
      // Personal details
      gender: "female",
      dateOfBirth: /* @__PURE__ */ new Date("1992-08-12"),
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
      joiningDate: /* @__PURE__ */ new Date("2021-03-10"),
      probationEndDate: /* @__PURE__ */ new Date("2021-06-10"),
      employmentType: "full-time",
      workLocation: "remote"
    };
    const user2 = {
      username: "user2",
      password: "wugweb",
      // In a real app, this would be hashed
      firstName: "Michael",
      lastName: "Chen",
      email: "michael@example.com",
      role: "employee",
      department: "Product",
      position: "Product Designer",
      avatar: "",
      // Partial personal details
      gender: "male",
      dateOfBirth: /* @__PURE__ */ new Date("1988-11-24"),
      maritalStatus: "single",
      // Minimal work details
      employeeId: "WUG0003",
      joiningDate: /* @__PURE__ */ new Date("2023-01-05"),
      probationEndDate: /* @__PURE__ */ new Date("2023-04-05"),
      employmentType: "full-time",
      workLocation: "hybrid"
    };
    const user3 = {
      username: "user3",
      password: "wugweb",
      // In a real app, this would be hashed
      firstName: "Priya",
      lastName: "Sharma",
      email: "priya@example.com",
      role: "employee",
      department: "Sales",
      position: "Sales Representative",
      avatar: "",
      // Minimal employment details
      employeeId: "WUG0004",
      joiningDate: /* @__PURE__ */ new Date("2025-04-25")
      // Just joined
    };
    const sarah = this.createUser(user1);
    const michael = this.createUser(user2);
    const priya = this.createUser(user3);
    if (createdSteps && createdSteps.length === 5) {
      for (let i = 0; i < 5; i++) {
        const completedDate = /* @__PURE__ */ new Date();
        completedDate.setDate(completedDate.getDate() - (15 - i * 3));
        const record = this.createEmployeeOnboardingRecord({
          userId: sarah.id,
          stepId: createdSteps[i].id,
          status: "completed"
        });
        this.updateEmployeeOnboardingStatus(record.id, "completed", completedDate);
      }
      for (let i = 0; i < 3; i++) {
        const completedDate = /* @__PURE__ */ new Date();
        completedDate.setDate(completedDate.getDate() - (7 - i));
        const record = this.createEmployeeOnboardingRecord({
          userId: michael.id,
          stepId: createdSteps[i].id,
          status: "completed"
        });
        this.updateEmployeeOnboardingStatus(record.id, "completed", completedDate);
      }
      for (let i = 3; i < 5; i++) {
        this.createEmployeeOnboardingRecord({
          userId: michael.id,
          stepId: createdSteps[i].id,
          status: "not_started"
        });
      }
      for (let i = 0; i < 5; i++) {
        this.createEmployeeOnboardingRecord({
          userId: priya.id,
          stepId: createdSteps[i].id,
          status: "not_started"
        });
      }
    }
    if (emilyUser && createdSteps.length === 5) {
      for (let i = 0; i < 3; i++) {
        const completedDate = /* @__PURE__ */ new Date();
        completedDate.setDate(completedDate.getDate() - (3 - i));
        this.createEmployeeOnboardingRecord({
          userId: emilyUser.id,
          stepId: createdSteps[i].id,
          status: "completed"
        });
        this.updateEmployeeOnboardingStatus(i + 1, "completed", completedDate);
      }
      this.createEmployeeOnboardingRecord({
        userId: emilyUser.id,
        stepId: createdSteps[3].id,
        status: "in_progress"
      });
      this.createEmployeeOnboardingRecord({
        userId: emilyUser.id,
        stepId: createdSteps[4].id,
        status: "not_started"
      });
    }
    const categories = [
      { name: "Salary Slips", description: "Monthly salary slips" },
      { name: "Contracts", description: "Employment contracts and agreements" },
      { name: "Policies", description: "Company policies and guidelines" },
      { name: "Tax Documents", description: "Tax-related documents" },
      { name: "Benefits", description: "Benefits and insurance information" }
    ];
    const createdCategories = categories.map((category) => this.createDocumentCategory(category));
    if (emilyUser && createdCategories.length > 0) {
      const now = /* @__PURE__ */ new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 31);
      const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 15);
      const documents2 = [
        {
          name: "May 2023 Salary Slip",
          filename: "may_2023_salary_slip.pdf",
          filesize: 257e3,
          mimeType: "application/pdf",
          categoryId: createdCategories[0].id,
          uploadedBy: 1,
          // Admin uploaded
          isPublic: false,
          metadata: {}
        },
        {
          name: "Employment Contract",
          filename: "employment_contract.pdf",
          filesize: 542e3,
          mimeType: "application/pdf",
          categoryId: createdCategories[1].id,
          uploadedBy: 1,
          // Admin uploaded
          isPublic: false,
          metadata: {}
        },
        {
          name: "Health Insurance Policy",
          filename: "health_insurance_policy.pdf",
          filesize: 385e3,
          mimeType: "application/pdf",
          categoryId: createdCategories[4].id,
          uploadedBy: 1,
          // Admin uploaded
          isPublic: true,
          metadata: {}
        }
      ];
      documents2.forEach((doc) => this.createDocument(doc));
    }
    if (emilyUser) {
      const now = /* @__PURE__ */ new Date();
      const events2 = [
        {
          title: "Team Meeting",
          description: "Regular team meeting to discuss ongoing projects",
          startDate: new Date(now.getFullYear(), now.getMonth(), 15, 10, 0),
          // June 15, 10:00 AM
          endDate: new Date(now.getFullYear(), now.getMonth(), 15, 11, 30),
          // June 15, 11:30 AM
          location: "Conference Room A",
          category: "Marketing Department",
          createdBy: 1
          // Admin created
        },
        {
          title: "Quarterly Review",
          description: "Quarterly performance review session",
          startDate: new Date(now.getFullYear(), now.getMonth(), 18, 14, 0),
          // June 18, 2:00 PM
          endDate: new Date(now.getFullYear(), now.getMonth(), 18, 15, 30),
          // June 18, 3:30 PM
          location: "HR Office",
          category: "Performance Review",
          createdBy: 1
          // Admin created
        },
        {
          title: "Company Town Hall",
          description: "Company-wide town hall meeting",
          startDate: new Date(now.getFullYear(), now.getMonth(), 22, 9, 0),
          // June 22, 9:00 AM
          endDate: new Date(now.getFullYear(), now.getMonth(), 22, 10, 30),
          // June 22, 10:30 AM
          location: "Main Auditorium",
          category: "All Employees",
          createdBy: 1
          // Admin created
        }
      ];
      events2.forEach((event) => this.createEvent(event));
      this.createTimeOffBalance({
        userId: emilyUser.id,
        vacationTotal: 20,
        vacationUsed: 5,
        sickTotal: 10,
        sickUsed: 4,
        personalTotal: 5,
        personalUsed: 3
      });
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
  async getUsers() {
    return Array.from(this.users.values());
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  async createUser(insertUser) {
    const id = this.currentIds.users++;
    const now = /* @__PURE__ */ new Date();
    const user = { ...insertUser, id, lastLogin: now };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, updates) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  // Onboarding steps operations
  async getOnboardingSteps() {
    return Array.from(this.onboardingSteps.values()).sort((a, b) => a.order - b.order);
  }
  async getOnboardingStep(id) {
    return this.onboardingSteps.get(id);
  }
  async createOnboardingStep(step) {
    const id = this.currentIds.onboardingSteps++;
    const newStep = { ...step, id };
    this.onboardingSteps.set(id, newStep);
    return newStep;
  }
  // Employee onboarding operations
  async getEmployeeOnboardingByUserId(userId) {
    const records = Array.from(this.employeeOnboarding.values()).filter((record) => record.userId === userId);
    return records.map((record) => {
      const step = this.onboardingSteps.get(record.stepId);
      if (!step) throw new Error(`Onboarding step not found: ${record.stepId}`);
      return { ...record, step };
    }).sort((a, b) => a.step.order - b.step.order);
  }
  async updateEmployeeOnboardingStatus(id, status, completedAt) {
    const record = this.employeeOnboarding.get(id);
    if (!record) return void 0;
    const updatedRecord = {
      ...record,
      status,
      completedAt: status === "completed" ? completedAt || /* @__PURE__ */ new Date() : record.completedAt
    };
    this.employeeOnboarding.set(id, updatedRecord);
    return updatedRecord;
  }
  async createEmployeeOnboardingRecord(record) {
    const id = this.currentIds.employeeOnboarding++;
    const newRecord = {
      ...record,
      id,
      completedAt: record.status === "completed" ? /* @__PURE__ */ new Date() : void 0
    };
    this.employeeOnboarding.set(id, newRecord);
    return newRecord;
  }
  // Document categories operations
  async getDocumentCategories() {
    return Array.from(this.documentCategories.values());
  }
  async getDocumentCategory(id) {
    return this.documentCategories.get(id);
  }
  async createDocumentCategory(category) {
    const id = this.currentIds.documentCategories++;
    const newCategory = { ...category, id };
    this.documentCategories.set(id, newCategory);
    return newCategory;
  }
  // Documents operations
  async getDocuments() {
    return Array.from(this.documents.values()).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }
  async getDocumentsByUserId(userId) {
    return Array.from(this.documents.values()).filter((doc) => doc.uploadedBy === userId || doc.isPublic).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }
  async getDocumentsByCategory(categoryId) {
    return Array.from(this.documents.values()).filter((doc) => doc.categoryId === categoryId).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }
  async getDocument(id) {
    return this.documents.get(id);
  }
  async createDocument(document) {
    const id = this.currentIds.documents++;
    const now = /* @__PURE__ */ new Date();
    const newDocument = { ...document, id, uploadedAt: now };
    this.documents.set(id, newDocument);
    return newDocument;
  }
  async deleteDocument(id) {
    return this.documents.delete(id);
  }
  // Events operations
  async getEvents() {
    return Array.from(this.events.values()).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }
  async getEventsByUserId(userId) {
    return this.getEvents();
  }
  async getEvent(id) {
    return this.events.get(id);
  }
  async createEvent(event) {
    const id = this.currentIds.events++;
    const newEvent = { ...event, id };
    this.events.set(id, newEvent);
    return newEvent;
  }
  // Time off balance operations
  async getTimeOffBalanceByUserId(userId) {
    return Array.from(this.timeOffBalances.values()).find((balance) => balance.userId === userId);
  }
  async createTimeOffBalance(timeOff) {
    const id = this.currentIds.timeOffBalances++;
    const newTimeOff = { ...timeOff, id };
    this.timeOffBalances.set(id, newTimeOff);
    return newTimeOff;
  }
  async updateTimeOffBalance(userId, updates) {
    const timeOff = Array.from(this.timeOffBalances.values()).find((balance) => balance.userId === userId);
    if (!timeOff) return void 0;
    const updatedTimeOff = { ...timeOff, ...updates };
    this.timeOffBalances.set(timeOff.id, updatedTimeOff);
    return updatedTimeOff;
  }
  // Report dashboard operations
  async getReportDashboardsByUserId(userId) {
    return Array.from(this.reportDashboards.values()).filter((dashboard) => dashboard.userId === userId);
  }
  async getReportDashboard(id) {
    return this.reportDashboards.get(id);
  }
  async getDefaultReportDashboardForUser(userId) {
    return Array.from(this.reportDashboards.values()).find((dashboard) => dashboard.userId === userId && dashboard.isDefault);
  }
  async createReportDashboard(dashboard) {
    const id = this.currentIds.reportDashboards++;
    const newDashboard = { ...dashboard, id };
    this.reportDashboards.set(id, newDashboard);
    return newDashboard;
  }
  async updateReportDashboard(id, updates) {
    const dashboard = this.reportDashboards.get(id);
    if (!dashboard) return void 0;
    const updatedDashboard = { ...dashboard, ...updates };
    this.reportDashboards.set(id, updatedDashboard);
    return updatedDashboard;
  }
  async deleteReportDashboard(id) {
    return this.reportDashboards.delete(id);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  companyEmail: text("company_email"),
  role: text("role").notNull().default("employee"),
  // "employee" or "admin"
  gender: text("gender"),
  // "male", "female", "other", "prefer_not_to_say"
  department: text("department"),
  position: text("position"),
  jobArea: text("job_area"),
  // "engineering", "design", "marketing", "product", "hr", etc.
  avatar: text("avatar"),
  lastLogin: timestamp("last_login"),
  // Social media
  linkedin: text("linkedin"),
  github: text("github"),
  behance: text("behance"),
  dribbble: text("dribbble"),
  twitter: text("twitter"),
  website: text("website"),
  // Government IDs
  panNumber: text("pan_number"),
  aadhaarNumber: text("aadhaar_number"),
  passportNumber: text("passport_number"),
  // Financial details
  pfNumber: text("pf_number"),
  uanNumber: text("uan_number"),
  bankAccountNumber: text("bank_account_number"),
  bankName: text("bank_name"),
  ifscCode: text("ifsc_code"),
  // Contact details
  phoneNumber: text("phone_number"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactNumber: text("emergency_contact_number"),
  emergencyContactRelation: text("emergency_contact_relation"),
  // Address
  currentAddress: text("current_address"),
  permanentAddress: text("permanent_address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  pincode: text("pincode"),
  // Employment details
  employeeId: text("employee_id"),
  joiningDate: timestamp("joining_date"),
  probationEndDate: timestamp("probation_end_date"),
  employmentType: text("employment_type"),
  // "full-time", "part-time", "contract", "intern"
  workLocation: text("work_location")
  // "remote", "office", "hybrid"
});
var onboardingSteps = pgTable("onboarding_steps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  order: integer("order").notNull()
});
var employeeOnboarding = pgTable("employee_onboarding", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  stepId: integer("step_id").notNull(),
  status: text("status").notNull().default("not_started"),
  // "not_started", "in_progress", "completed"
  completedAt: timestamp("completed_at")
});
var documentCategories = pgTable("document_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description")
});
var documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  filename: text("filename").notNull(),
  filesize: integer("filesize").notNull(),
  mimeType: text("mime_type").notNull(),
  categoryId: integer("category_id"),
  uploadedBy: integer("uploaded_by").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
  isPublic: boolean("is_public").notNull().default(false),
  isVerified: boolean("is_verified").notNull().default(false),
  metadata: json("metadata")
});
var events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location"),
  category: text("category"),
  createdBy: integer("created_by").notNull()
});
var timeOffBalances = pgTable("time_off_balances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  vacationTotal: integer("vacation_total").notNull().default(20),
  vacationUsed: integer("vacation_used").notNull().default(0),
  sickTotal: integer("sick_total").notNull().default(10),
  sickUsed: integer("sick_used").notNull().default(0),
  personalTotal: integer("personal_total").notNull().default(5),
  personalUsed: integer("personal_used").notNull().default(0)
});
var reportDashboards = pgTable("report_dashboards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  layout: json("layout").notNull(),
  isDefault: boolean("is_default").notNull().default(false)
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  lastLogin: true
});
var insertOnboardingStepSchema = createInsertSchema(onboardingSteps).omit({
  id: true
});
var insertEmployeeOnboardingSchema = createInsertSchema(employeeOnboarding).omit({
  id: true,
  completedAt: true
});
var insertDocumentCategorySchema = createInsertSchema(documentCategories).omit({
  id: true
});
var insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true
});
var insertEventSchema = createInsertSchema(events).omit({
  id: true
});
var insertTimeOffBalanceSchema = createInsertSchema(timeOffBalances).omit({
  id: true
});
var insertReportDashboardSchema = createInsertSchema(reportDashboards).omit({
  id: true
});
var loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required")
});

// server/routes.ts
import fs from "fs";
import path from "path";
import multer from "multer";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import MemoryStore from "memorystore";
import sharp from "sharp";
var uploadsDir = path.join(import.meta.dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
var storage_config = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});
var upload = multer({ storage: storage_config });
async function maskAadhaarImage(inputPath) {
  const maskedPath = inputPath.replace(".", "_masked.");
  await sharp(inputPath).composite([{
    input: Buffer.from(`<svg>
        <rect x="10%" y="45%" width="50%" height="15%" fill="black" opacity="0.95"/>
        <rect x="10%" y="30%" width="30%" height="10%" fill="black" opacity="0.95"/>
      </svg>`),
    blend: "over"
  }]).toFile(maskedPath);
  return maskedPath;
}
async function registerRoutes(app2) {
  const apiRouter = express.Router();
  const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  };
  const isAdmin = async (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };
  const MemoryStoreSession = MemoryStore(session);
  app2.use(session({
    secret: "hr-connect-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1e3,
      // 24 hours
      sameSite: "lax"
    },
    store: new MemoryStoreSession({
      checkPeriod: 864e5
      // prune expired entries every 24h
    })
  }));
  apiRouter.post("/auth/login", async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(credentials.email);
      if (!user || user.password !== credentials.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      await storage.updateUser(user.id, { lastLogin: /* @__PURE__ */ new Date() });
      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Failed to save session" });
        }
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json({
          user: userWithoutPassword,
          message: "Login successful"
        });
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.post("/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.status(200).json({ message: "Logout successful" });
    });
  });
  apiRouter.post("/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const users2 = await Promise.all((await storage.getUsers()).map((user) => storage.getUser(user.id)));
      const emailExists = users2.some((user) => user && user.email === userData.email);
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const newUser = await storage.createUser(userData);
      req.session.userId = newUser.id;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Failed to save session" });
        }
        const { password, ...userWithoutPassword } = newUser;
        return res.status(201).json({
          user: userWithoutPassword,
          message: "Registration successful"
        });
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.get("/auth/session", async (req, res) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json({
      user: userWithoutPassword
    });
  });
  apiRouter.post("/users/register", async (req, res) => {
    try {
      const { firstName, lastName } = req.body;
      if (!firstName || !lastName) {
        return res.status(400).json({ message: "First name and last name are required" });
      }
      const systemUsername = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
      const systemEmail = `${systemUsername}@wugweb.design`;
      const defaultPassword = "WugWeb123@";
      const userData = {
        firstName,
        lastName,
        username: systemUsername,
        email: systemEmail,
        password: defaultPassword,
        role: "employee"
      };
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        let suffix = 1;
        let newUsername = `${systemUsername}${suffix}`;
        let newEmail = `${newUsername}@wugweb.design`;
        while (await storage.getUserByUsername(newUsername)) {
          suffix++;
          newUsername = `${systemUsername}${suffix}`;
          newEmail = `${newUsername}@wugweb.design`;
        }
        userData.username = newUsername;
        userData.email = newEmail;
      }
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      const steps = await storage.getOnboardingSteps();
      for (const step of steps) {
        await storage.createEmployeeOnboardingRecord({
          userId: user.id,
          stepId: step.id,
          status: "not_started"
        });
      }
      await storage.createTimeOffBalance({
        userId: user.id,
        vacationTotal: 20,
        vacationUsed: 0,
        sickTotal: 10,
        sickUsed: 0,
        personalTotal: 5,
        personalUsed: 0
      });
      return res.status(201).json({
        ...userWithoutPassword,
        generatedCredentials: {
          username: userData.username,
          email: userData.email,
          defaultPassword: "WugWeb123@"
        }
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.post("/users", isAdmin, async (req, res) => {
    try {
      const userDataInput = req.body;
      const systemUsername = `${userDataInput.firstName.toLowerCase()}.${userDataInput.lastName.toLowerCase()}`;
      const systemEmail = `${systemUsername}@wugweb.design`;
      const defaultPassword = "WugWeb123@";
      const userData = insertUserSchema.parse({
        ...userDataInput,
        username: systemUsername,
        email: systemEmail,
        password: defaultPassword
      });
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        let suffix = 1;
        let newUsername = `${systemUsername}${suffix}`;
        let newEmail = `${newUsername}@wugweb.design`;
        while (await storage.getUserByUsername(newUsername)) {
          suffix++;
          newUsername = `${systemUsername}${suffix}`;
          newEmail = `${newUsername}@wugweb.design`;
        }
        userData.username = newUsername;
        userData.email = newEmail;
      }
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      const steps = await storage.getOnboardingSteps();
      for (const step of steps) {
        await storage.createEmployeeOnboardingRecord({
          userId: user.id,
          stepId: step.id,
          status: "not_started"
        });
      }
      await storage.createTimeOffBalance({
        userId: user.id,
        vacationTotal: 20,
        vacationUsed: 0,
        sickTotal: 10,
        sickUsed: 0,
        personalTotal: 5,
        personalUsed: 0
      });
      return res.status(201).json({
        ...userWithoutPassword,
        generatedCredentials: {
          username: userData.username,
          email: userData.email,
          defaultPassword: "WugWeb123@"
        }
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.get("/users/profile", isAuthenticated, async (req, res) => {
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  });
  apiRouter.put("/users/profile", isAuthenticated, async (req, res) => {
    try {
      const updates = req.body;
      if (updates.password) {
        delete updates.password;
      }
      if (updates.role) {
        delete updates.role;
      }
      const updatedUser = await storage.updateUser(req.session.userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = updatedUser;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.get("/onboarding", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      console.log("Getting onboarding data for userId:", userId);
      const records = await storage.getEmployeeOnboardingByUserId(userId);
      console.log("Retrieved onboarding records:", JSON.stringify(records));
      const completedSteps = records.filter((r) => r.status === "completed").length;
      const totalSteps = records.length;
      const progressPercentage = totalSteps > 0 ? Math.round(completedSteps / totalSteps * 100) : 0;
      console.log(`Onboarding progress: ${completedSteps}/${totalSteps} (${progressPercentage}%)`);
      return res.status(200).json({
        steps: records,
        progress: progressPercentage
      });
    } catch (error) {
      console.error("Error in onboarding API:", error);
      return res.status(500).json({ message: "Internal server error", error: String(error) });
    }
  });
  apiRouter.put("/onboarding/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      if (!["not_started", "in_progress", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      const record = await storage.updateEmployeeOnboardingStatus(id, status);
      if (!record) {
        return res.status(404).json({ message: "Onboarding record not found" });
      }
      return res.status(200).json(record);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.get("/document-categories", isAuthenticated, async (_req, res) => {
    try {
      let categories = await storage.getDocumentCategories();
      if (categories.length === 0) {
        const defaultCategories = [
          { name: "Identity", description: "Personal identification documents" },
          { name: "Education", description: "Academic certificates and qualifications" },
          { name: "Employment", description: "Previous employment records and letters" },
          { name: "Payment", description: "Financial and payment-related documents" }
        ];
        for (const category of defaultCategories) {
          await storage.createDocumentCategory(category);
        }
        categories = await storage.getDocumentCategories();
      }
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.get("/documents", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      let documents2;
      if (user && user.role === "admin") {
        documents2 = await storage.getDocuments();
      } else {
        documents2 = await storage.getDocumentsByUserId(userId);
      }
      return res.status(200).json(documents2);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.get("/documents/category/:id", isAuthenticated, async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const documents2 = await storage.getDocumentsByCategory(categoryId);
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      const filteredDocuments = user && user.role === "admin" ? documents2 : documents2.filter((doc) => doc.uploadedBy === userId || doc.isPublic);
      return res.status(200).json(filteredDocuments);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.get("/documents/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (user && user.role !== "admin" && document.uploadedBy !== userId && !document.isPublic) {
        return res.status(403).json({ message: "Forbidden" });
      }
      return res.status(200).json(document);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.post("/documents", isAuthenticated, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const documentData = insertDocumentSchema.parse({
        name: req.body.name,
        filename: req.file.filename,
        filesize: req.file.size,
        mimeType: req.file.mimetype,
        categoryId: req.body.categoryId ? parseInt(req.body.categoryId) : void 0,
        uploadedBy: req.session.userId,
        isPublic: req.body.isPublic === "true",
        metadata: req.body.metadata ? JSON.parse(req.body.metadata) : {}
      });
      if (documentData.name.toLowerCase().includes("aadhaar")) {
        const filePath = path.join(uploadsDir, documentData.filename);
        const maskedPath = await maskAadhaarImage(filePath);
        documentData.metadata = {
          ...documentData.metadata,
          maskedVersion: path.basename(maskedPath)
        };
      }
      const document = await storage.createDocument(documentData);
      return res.status(201).json(document);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.delete("/documents/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (user && user.role !== "admin" && document.uploadedBy !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const filePath = path.join(uploadsDir, document.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await storage.deleteDocument(id);
      return res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.get("/documents/download/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      if (user && user.role !== "admin" && document.uploadedBy !== userId && !document.isPublic) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const filePath = path.join(uploadsDir, document.filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }
      res.download(filePath, document.name);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.get("/events", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const events2 = await storage.getEventsByUserId(userId);
      return res.status(200).json(events2);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.get("/time-off", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const timeOff = await storage.getTimeOffBalanceByUserId(userId);
      if (!timeOff) {
        return res.status(404).json({ message: "Time off balance not found" });
      }
      return res.status(200).json(timeOff);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.get("/dashboards", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const dashboards = await storage.getReportDashboardsByUserId(userId);
      return res.status(200).json(dashboards);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.get("/dashboards/default", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const dashboard = await storage.getDefaultReportDashboardForUser(userId);
      if (!dashboard) {
        return res.status(404).json({ message: "Default dashboard not found" });
      }
      return res.status(200).json(dashboard);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.post("/dashboards", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId;
      const dashboard = await storage.createReportDashboard({
        userId,
        name: req.body.name,
        layout: req.body.layout,
        isDefault: req.body.isDefault || false
      });
      if (dashboard.isDefault) {
        const existingDashboards = await storage.getReportDashboardsByUserId(userId);
        for (const existing of existingDashboards) {
          if (existing.id !== dashboard.id && existing.isDefault) {
            await storage.updateReportDashboard(existing.id, { isDefault: false });
          }
        }
      }
      return res.status(201).json(dashboard);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.put("/dashboards/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.session.userId;
      const existingDashboard = await storage.getReportDashboard(id);
      if (!existingDashboard) {
        return res.status(404).json({ message: "Dashboard not found" });
      }
      if (existingDashboard.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const updatedDashboard = await storage.updateReportDashboard(id, {
        name: req.body.name,
        layout: req.body.layout,
        isDefault: req.body.isDefault
      });
      if (updatedDashboard && updatedDashboard.isDefault) {
        const existingDashboards = await storage.getReportDashboardsByUserId(userId);
        for (const existing of existingDashboards) {
          if (existing.id !== id && existing.isDefault) {
            await storage.updateReportDashboard(existing.id, { isDefault: false });
          }
        }
      }
      return res.status(200).json(updatedDashboard);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  apiRouter.delete("/dashboards/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.session.userId;
      const existingDashboard = await storage.getReportDashboard(id);
      if (!existingDashboard) {
        return res.status(404).json({ message: "Dashboard not found" });
      }
      if (existingDashboard.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      await storage.deleteReportDashboard(id);
      return res.status(200).json({ message: "Dashboard deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.use("/api", apiRouter);
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    console.error("Error:", err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port: 5e3,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
