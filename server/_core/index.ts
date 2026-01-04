import "dotenv/config";
import * as Sentry from "@sentry/node";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { handleStripeWebhook } from "../stripe/webhookHandler";
import { generatePDCATemplate } from "../utils/pdcaTemplateGenerator";
import watchdogApiRouter from "../routes/watchdog-api";
import coursesRouter from "../routers/courses";
import couponsRouter from "../routers/coupons";
import enrollmentRouter from "../routers/enrollment";
import { startHealthMonitoring } from "../services/healthMonitoring";

// Initialize Sentry for backend error tracking
const SENTRY_DSN = process.env.SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    // Filter out common non-actionable errors
    beforeSend(event, hint) {
      const error = hint.originalException;
      
      // Ignore connection reset errors
      if (error instanceof Error && error.message.includes('ECONNRESET')) {
        return null;
      }
      
      return event;
    },
  });
  
  console.log('[Sentry] Backend error tracking initialized');
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Sentry request handler - must be first middleware
  if (SENTRY_DSN) {
    Sentry.setupExpressErrorHandler(app);
  }
  
  // Stripe webhook needs raw body - MUST be before express.json()
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // CORS headers for OAuth routes - MUST be before registerOAuthRoutes
  app.use((req, res, next) => {
    const origin = req.get('origin') || req.get('referer')?.split('/').slice(0, 3).join('/');
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });
  
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // Public Watchdog API
  app.use("/api/watchdog", watchdogApiRouter);
  
  // Courses API
  app.use("/api", coursesRouter);
  
  // Coupons API
  app.use("/api", couponsRouter);
  
  // Enrollment API
  app.use("/api", enrollmentRouter);
  
  // PDF template download endpoint
  app.get("/api/download-template/:templateId", (req, res) => {
    const { templateId } = req.params;
    generatePDCATemplate(templateId, res);
  });
  
  // tRPC API with CORS
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  
  // Error handling middleware with Sentry
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    
    // Report to Sentry
    if (SENTRY_DSN) {
      Sentry.captureException(err, {
        tags: {
          url: req.url,
          method: req.method,
        },
        extra: {
          body: req.body,
          query: req.query,
          params: req.params,
        },
      });
    }
    
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
      status: err.status || 500
    });
  });
  
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    
    // Start automated health monitoring
    startHealthMonitoring();
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  if (SENTRY_DSN) {
    Sentry.captureException(err);
  }
  process.exit(1);
});
