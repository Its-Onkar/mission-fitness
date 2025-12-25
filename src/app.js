import express from "express";
import helmet from "helmet";
import cors from "cors";
import chatRouter from "./routers/chat.route.js";
import userRouter from "./routers/user.route.js";
import authRouter from "./routers/auth.route.js";
import onboardingRouter from "./routers/onboarding.route.js";
import dietRouter from "./routers/dietplain.route.js";
import viewRouter from "./routers/view.route.js";
import updateRouter from "./routers/update.route.js";
import performanceRouter from "./routers/performance.route.js";
import testRouter from "./routers/test.route.js";
import workoutRouter from "./routers/workout.route.js";


import fitnessRouter from "./routers/fitness.route.js";
import analyticsRouter from "./routers/analytics.route.js";
import weightRouter from "./routers/weight.route.js";
import flowRouter from "./routers/flow.route.js";
import progressRouter from "./routers/progress.route.js";
import photoRouter from "./routers/photo.route.js";


import { create } from "express-handlebars";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { sanitizeInput } from "./middleware/security.js";
import logger from "./utils/logger.js";
import path from "path";
import { fileURLToPath } from "url";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security and rate limiting
app.use(sanitizeInput);
app.use(rateLimit(1000));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});



// Setup handlebars engine
const hbs = create({
  extname: ".hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "view", "layouts"),
  partialsDir: path.join(__dirname, "view", "partials"),
  helpers: {
    json: (context) => JSON.stringify(context),
    eq: (a, b) => a === b,
    ne: (a, b) => a !== b,
    gt: (a, b) => a > b,
    gte: (a, b) => a >= b,
    lt: (a, b) => a < b,
    lte: (a, b) => a <= b,
    or: (a, b) => a || b,
    and: (a, b) => a && b,
    not: (a) => !a,
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b,
    formatDate: (date) => new Date(date).toLocaleDateString(),
    formatTime: (date) => new Date(date).toLocaleTimeString(),
    capitalize: (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '',
    uppercase: (str) => str ? str.toUpperCase() : '',
    lowercase: (str) => str ? str.toLowerCase() : '',
    default: (value, defaultValue) => value != null ? value : defaultValue,
    length: (array) => array && array.length ? array.length : 0,
    isEmpty: (value) => !value || (Array.isArray(value) && value.length === 0),
    isNotEmpty: (value) => value && (!Array.isArray(value) || value.length > 0),
    toString: (value) => value != null ? String(value) : '',
    toNumber: (value) => {
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    },
    round: (value, decimals = 0) => {
      const num = Number(value);
      return isNaN(num) ? 0 : Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },
    substring: (str, start, end) => {
      return str ? str.substring(start, end) : '';
    },
    ifCond: function(v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    }
  }
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "view"));

app.use(express.static(path.join(__dirname, "public")));

// Health check endpoint
app.get('/health', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: process.memoryUsage(),
    cpu: process.cpuUsage()
  };
  
  try {
    res.status(200).json({
      success: true,
      data: healthCheck
    });
  } catch (error) {
    healthCheck.message = 'ERROR';
    res.status(503).json({
      success: false,
      error: healthCheck
    });
  }
});

// API Routes
app.use("/api/chat", chatRouter);
app.use("/api/users", userRouter);
app.use("/auth", authRouter);
app.use("/api/onboarding", onboardingRouter);
app.use("/api/fitness", fitnessRouter);
app.use("/api/diet", dietRouter);
app.use("/api/workout", workoutRouter);
app.use("/api/update", updateRouter);
app.use("/api/performance", performanceRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/weight", weightRouter);
app.use("/api/flow", flowRouter);
app.use("/api/progress", progressRouter);
app.use("/api/photos", photoRouter);
app.use("/api/test", testRouter);

// View routes (should come last)
app.use("/", viewRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);



export default app;

