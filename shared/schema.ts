import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  companyEmail: text("company_email"),
  role: text("role").notNull().default("employee"), // "employee" or "admin"
  gender: text("gender"), // "male", "female", "other", "prefer_not_to_say"
  department: text("department"),
  position: text("position"),
  jobArea: text("job_area"), // "engineering", "design", "marketing", "product", "hr", etc.
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
  employmentType: text("employment_type"), // "full-time", "part-time", "contract", "intern"
  workLocation: text("work_location"), // "remote", "office", "hybrid"
});

export const onboardingSteps = pgTable("onboarding_steps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
});

export const employeeOnboarding = pgTable("employee_onboarding", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  stepId: integer("step_id").notNull(),
  status: text("status").notNull().default("not_started"), // "not_started", "in_progress", "completed"
  completedAt: timestamp("completed_at"),
});

export const documentCategories = pgTable("document_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export const documents = pgTable("documents", {
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
  metadata: json("metadata"),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location"),
  category: text("category"),
  createdBy: integer("created_by").notNull(),
});

export const timeOffBalances = pgTable("time_off_balances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  vacationTotal: integer("vacation_total").notNull().default(20),
  vacationUsed: integer("vacation_used").notNull().default(0),
  sickTotal: integer("sick_total").notNull().default(10),
  sickUsed: integer("sick_used").notNull().default(0),
  personalTotal: integer("personal_total").notNull().default(5),
  personalUsed: integer("personal_used").notNull().default(0),
});

export const reportDashboards = pgTable("report_dashboards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  layout: json("layout").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
});

// Insert schemas

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  lastLogin: true,
});

export const insertOnboardingStepSchema = createInsertSchema(onboardingSteps).omit({
  id: true,
});

export const insertEmployeeOnboardingSchema = createInsertSchema(employeeOnboarding).omit({
  id: true,
  completedAt: true,
});

export const insertDocumentCategorySchema = createInsertSchema(documentCategories).omit({
  id: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export const insertTimeOffBalanceSchema = createInsertSchema(timeOffBalances).omit({
  id: true,
});

export const insertReportDashboardSchema = createInsertSchema(reportDashboards).omit({
  id: true,
});

// Types

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type OnboardingStep = typeof onboardingSteps.$inferSelect;
export type InsertOnboardingStep = z.infer<typeof insertOnboardingStepSchema>;

export type EmployeeOnboarding = typeof employeeOnboarding.$inferSelect;
export type InsertEmployeeOnboarding = z.infer<typeof insertEmployeeOnboardingSchema>;

export type DocumentCategory = typeof documentCategories.$inferSelect;
export type InsertDocumentCategory = z.infer<typeof insertDocumentCategorySchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type TimeOffBalance = typeof timeOffBalances.$inferSelect;
export type InsertTimeOffBalance = z.infer<typeof insertTimeOffBalanceSchema>;

export type ReportDashboard = typeof reportDashboards.$inferSelect;
export type InsertReportDashboard = z.infer<typeof insertReportDashboardSchema>;

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

// Authentication response
export interface AuthResponse {
  user: User;
  message: string;
}
