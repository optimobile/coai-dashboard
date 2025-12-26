import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import governmentRouter from "./api/government.js";
import enterpriseRouter from "./api/enterprise.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
  });

  // API Routes
  app.use("/api/government", governmentRouter);
  app.use("/api/v1", enterpriseRouter);

  // API Documentation
  app.get("/api/docs", (_req, res) => {
    res.json({
      version: "1.0.0",
      title: "CSOAI API",
      description: "Global AI Safety Governance Platform"
    });
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
