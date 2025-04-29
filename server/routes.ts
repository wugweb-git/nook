import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertUserSchema, insertDocumentSchema } from "@shared/schema";
import fs from "fs";
import path from "path";
import multer from "multer";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import MemoryStore from "memorystore";

// Extend express-session with our custom properties
declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

// Configure multer storage
const uploadsDir = path.join(import.meta.dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage_config = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

import sharp from 'sharp';
const upload = multer({ storage: storage_config });

// Function to mask Aadhaar card image
async function maskAadhaarImage(inputPath: string): Promise<string> {
  const maskedPath = inputPath.replace('.', '_masked.');
  
  await sharp(inputPath)
    .composite([{
      input: Buffer.from(`<svg>
        <rect x="10%" y="45%" width="50%" height="15%" fill="black" opacity="0.95"/>
        <rect x="10%" y="30%" width="30%" height="10%" fill="black" opacity="0.95"/>
      </svg>`),
      blend: 'over'
    }])
    .toFile(maskedPath);
    
  return maskedPath;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();
  
  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.session && req.session.userId) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  };
  
  // Middleware to check if user is an admin
  const isAdmin = async (req: Request, res: Response, next: Function) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    return next();
  };
  
  // Session configuration
  const MemoryStoreSession = MemoryStore(session);
  app.use(session({
    secret: "hr-connect-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    },
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  }));
  
  // Authentication routes
  apiRouter.post("/auth/login", async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(credentials.email);
      
      if (!user || user.password !== credentials.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Update last login time
      await storage.updateUser(user.id, { lastLogin: new Date() });
      
      // Set user in session
      req.session.userId = user.id;
      
      // Save session explicitly
      req.session.save(err => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Failed to save session" });
        }
        
        // Return user without password
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
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const users = await Promise.all((await storage.getUsers()).map(user => storage.getUser(user.id)));
      const emailExists = users.some(user => user && user.email === userData.email);
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create new user
      const newUser = await storage.createUser(userData);
      
      // Set user in session to auto login after register
      req.session.userId = newUser.id;
      
      // Save session explicitly
      req.session.save(err => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Failed to save session" });
        }
        
        // Return user without password
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
  
  // User registration route (for onboarding)
  apiRouter.post("/users/register", async (req, res) => {
    try {
      const { firstName, lastName } = req.body;
      
      if (!firstName || !lastName) {
        return res.status(400).json({ message: "First name and last name are required" });
      }
      
      // Generate system username (firstname.lastname)
      const systemUsername = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
      
      // Generate system email (firstname.lastname@wugweb.design)
      const systemEmail = `${systemUsername}@wugweb.design`;
      
      // Set default password
      const defaultPassword = "WugWeb123@";
      
      // Prepare complete user data with generated fields
      const userData = {
        firstName,
        lastName,
        username: systemUsername,
        email: systemEmail,
        password: defaultPassword,
        role: "employee"
      };
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        // If username exists, add a number suffix
        let suffix = 1;
        let newUsername = `${systemUsername}${suffix}`;
        let newEmail = `${newUsername}@wugweb.design`;
        
        // Keep trying until we find an available username
        while (await storage.getUserByUsername(newUsername)) {
          suffix++;
          newUsername = `${systemUsername}${suffix}`;
          newEmail = `${newUsername}@wugweb.design`;
        }
        
        userData.username = newUsername;
        userData.email = newEmail;
      }
      
      // Create the user
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      
      // Create default onboarding records for the new user
      const steps = await storage.getOnboardingSteps();
      for (const step of steps) {
        await storage.createEmployeeOnboardingRecord({
          userId: user.id,
          stepId: step.id,
          status: "not_started"
        });
      }
      
      // Create default time off balance
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
  
  // User routes (admin only)
  apiRouter.post("/users", isAdmin, async (req, res) => {
    try {
      // Parse the basic user data
      const userDataInput = req.body;
      
      // Generate system username (firstname.lastname)
      const systemUsername = `${userDataInput.firstName.toLowerCase()}.${userDataInput.lastName.toLowerCase()}`;
      
      // Generate system email (firstname.lastname@wugweb.design)
      const systemEmail = `${systemUsername}@wugweb.design`;
      
      // Set default password
      const defaultPassword = "WugWeb123@";
      
      // Prepare complete user data with generated fields
      const userData = insertUserSchema.parse({
        ...userDataInput,
        username: systemUsername,
        email: systemEmail,
        password: defaultPassword
      });
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        // If username exists, add a number suffix
        let suffix = 1;
        let newUsername = `${systemUsername}${suffix}`;
        let newEmail = `${newUsername}@wugweb.design`;
        
        // Keep trying until we find an available username
        while (await storage.getUserByUsername(newUsername)) {
          suffix++;
          newUsername = `${systemUsername}${suffix}`;
          newEmail = `${newUsername}@wugweb.design`;
        }
        
        userData.username = newUsername;
        userData.email = newEmail;
      }
      
      // Create the user
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      
      // Create default onboarding records for the new user
      const steps = await storage.getOnboardingSteps();
      for (const step of steps) {
        await storage.createEmployeeOnboardingRecord({
          userId: user.id,
          stepId: step.id,
          status: "not_started"
        });
      }
      
      // Create default time off balance
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
    const user = await storage.getUser(req.session.userId!);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  });
  
  apiRouter.put("/users/profile", isAuthenticated, async (req, res) => {
    try {
      const updates = req.body;
      
      // Don't allow updating password through this endpoint
      if (updates.password) {
        delete updates.password;
      }
      
      // Don't allow updating role through this endpoint
      if (updates.role) {
        delete updates.role;
      }
      
      const updatedUser = await storage.updateUser(req.session.userId!, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = updatedUser;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Onboarding routes
  apiRouter.get("/onboarding", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      console.log("Getting onboarding data for userId:", userId);
      
      const records = await storage.getEmployeeOnboardingByUserId(userId);
      console.log("Retrieved onboarding records:", JSON.stringify(records));
      
      const completedSteps = records.filter(r => r.status === "completed").length;
      const totalSteps = records.length;
      const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
      
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
  
  // Document categories routes
  apiRouter.get("/document-categories", isAuthenticated, async (_req, res) => {
    try {
      let categories = await storage.getDocumentCategories();
      
      // If no categories exist, create default ones for onboarding
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
        
        // Get the newly created categories
        categories = await storage.getDocumentCategories();
      }
      
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Documents routes
  apiRouter.get("/documents", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      let documents;
      if (user && user.role === "admin") {
        documents = await storage.getDocuments();
      } else {
        documents = await storage.getDocumentsByUserId(userId);
      }
      
      return res.status(200).json(documents);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  apiRouter.get("/documents/category/:id", isAuthenticated, async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const documents = await storage.getDocumentsByCategory(categoryId);
      
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      // Filter documents based on user role and visibility
      const filteredDocuments = user && user.role === "admin"
        ? documents
        : documents.filter(doc => doc.uploadedBy === userId || doc.isPublic);
      
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
      
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      // Check if user has access to the document
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
        categoryId: req.body.categoryId ? parseInt(req.body.categoryId) : undefined,
        uploadedBy: req.session.userId!,
        isPublic: req.body.isPublic === "true",
        metadata: req.body.metadata ? JSON.parse(req.body.metadata) : {}
      });
      
      // If this is an Aadhaar card upload, create a masked version
      if (documentData.name.toLowerCase().includes('aadhaar')) {
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
      
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      // Check if user has permission to delete the document
      if (user && user.role !== "admin" && document.uploadedBy !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Delete the physical file
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
      
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      // Check if user has access to the document
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
  
  // Events routes
  apiRouter.get("/events", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const events = await storage.getEventsByUserId(userId);
      return res.status(200).json(events);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Time off balance routes
  apiRouter.get("/time-off", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const timeOff = await storage.getTimeOffBalanceByUserId(userId);
      
      if (!timeOff) {
        return res.status(404).json({ message: "Time off balance not found" });
      }
      
      return res.status(200).json(timeOff);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Report dashboard routes
  apiRouter.get("/dashboards", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const dashboards = await storage.getReportDashboardsByUserId(userId);
      return res.status(200).json(dashboards);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  apiRouter.get("/dashboards/default", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.userId!;
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
      const userId = req.session.userId!;
      
      const dashboard = await storage.createReportDashboard({
        userId,
        name: req.body.name,
        layout: req.body.layout,
        isDefault: req.body.isDefault || false
      });
      
      // If this dashboard is set as default, update any other dashboards
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
      const userId = req.session.userId!;
      
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
      
      // If this dashboard is set as default, update any other dashboards
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
      const userId = req.session.userId!;
      
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
  
  // Mount the API router
  app.use("/api", apiRouter);
  
  const httpServer = createServer(app);
  return httpServer;
}
