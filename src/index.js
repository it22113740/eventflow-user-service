require("dotenv").config();

const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const connectDB = require("./config/db");
const swaggerSpec = require("./config/swagger");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

process.env.SERVICE_NAME = process.env.SERVICE_NAME || "eventflow-user-service";

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── API Docs ──────────────────────────────────────────────────────────────────
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.redirect("/api/health"));
app.use(healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Bootstrap ─────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT || 3001);

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`[${process.env.SERVICE_NAME}] listening on port ${PORT}`);
    logger.info(`Swagger docs available at http://localhost:${PORT}/api/docs`);
  });
})();
