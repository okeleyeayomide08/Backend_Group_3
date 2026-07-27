import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import supplierRoutes from "./routes/supplierRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// ─── Security Middleware ───────────────────────────────
app.use(helmet());

// ─── CORS Configuration ────────────────────────────────
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ─── Rate Limiting ─────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 mins
  message: {
    status: "error",
    message: "Too many requests, please try again later",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // only 10 login attempts
  message: {
    status: "error",
    message: "Too many login attempts, please try again later",
  },
});

app.use(globalLimiter);

// ─── Request Logging ───────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Body Parsers ──────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Swagger Documentation ─────────────────────────────
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true }),
);

// ─── Health Check ──────────────────────────────────────
app.get("/", (req, res) => {
  const host = req.get("host") || `localhost:${process.env.PORT || 5000}`;
  const protocol = req.protocol;

  res.json({
    status: "success",
    message: "Eventory API is running",
    version: "1.0.0",
    docs: `${protocol}://${host}/api-docs`,
  });
});

// ─── Routes ────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api", reportRoutes);
// More routes will be added here as we build them

// ─── Handle Undefined Routes (404) ────────────────────
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler (must be last) ──────────────
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Enventory server running on port ${PORT}`);
      console.log(`API Docs → http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
