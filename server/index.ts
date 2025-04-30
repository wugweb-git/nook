import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: ['http://localhost:8888', 'http://localhost:5173', 'https://nook-wugweb.netlify.app'],
  credentials: true
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Function to try binding to a port
  const tryPort = async (port: number): Promise<number> => {
    try {
      await new Promise((resolve, reject) => {
        server.listen(port, () => resolve(port))
          .on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
              resolve(tryPort(port + 1));
            } else {
              reject(err);
            }
          });
      });
      return port;
    } catch (error) {
      console.error(`Failed to bind to port ${port}:`, error);
      throw error;
    }
  };

  // Start with preferred port and try alternatives if busy
  const startPort = parseInt(process.env.PORT || '5173', 10);
  const actualPort = await tryPort(startPort);
  
  if (actualPort !== startPort) {
    console.log(`Port ${startPort} was in use, using port ${actualPort} instead`);
  }
  
  log(`serving on port ${actualPort}`);
})();
