import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:8888', 'http://localhost:5173', 'https://nook-wugweb.netlify.app'],
  credentials: true
}));

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Login schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

// Handle both /auth/login and /api/auth/login
app.post(['/auth/login', '/api/auth/login', '/.netlify/functions/api/auth/login'], async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const credentials = loginSchema.parse(req.body);
    console.log('Parsed credentials:', credentials);
    
    // This is a mock implementation - replace with your actual user storage
    const mockUsers = [
      {
        id: 1,
        email: "vedanshu@wugweb.com",
        password: "wugweb",
        firstName: "Vedanshu",
        lastName: "Kumar",
        role: "admin"
      },
      {
        id: 2,
        email: "sarah@example.com",
        password: "wugweb",
        firstName: "Sarah",
        lastName: "Johnson",
        role: "employee"
      },
      {
        id: 3,
        email: "michael@example.com",
        password: "wugweb",
        firstName: "Michael",
        lastName: "Chen",
        role: "employee"
      },
      {
        id: 4,
        email: "priya@example.com",
        password: "wugweb",
        firstName: "Priya",
        lastName: "Sharma",
        role: "employee"
      },
      {
        id: 5,
        email: "emily@example.com",
        password: "emily123",
        firstName: "Emily",
        lastName: "Smith",
        role: "employee"
      }
    ];

    const user = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    console.log('Found user:', user);
    
    if (!user) {
      console.log('No user found with these credentials');
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    // Return the exact format expected by the frontend
    return res.status(200).json({
      user: userWithoutPassword,
      message: "Login successful"
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ error: validationError.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle both /auth/register and /api/auth/register
app.post(['/auth/register', '/api/auth/register', '/.netlify/functions/api/auth/register'], async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = "employee" } = req.body;
    
    // This is a mock implementation - replace with your actual user storage
    const newUser = {
      id: Date.now(), // Temporary ID
      email,
      password,
      firstName,
      lastName,
      role,
      lastLogin: new Date()
    };

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    // Return the exact format expected by the frontend
    return res.status(201).json({
      user: userWithoutPassword,
      message: "Registration successful"
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a health check endpoint
app.get(['/health', '/api/health', '/.netlify/functions/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug endpoint to echo request details
app.all('*', (req, res) => {
  console.log('Catch-all route hit:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  });
  res.status(404).json({
    error: 'Not Found',
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  });
});

export const handler = serverless(app); 