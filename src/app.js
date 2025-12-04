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
<<<<<<< Updated upstream
=======
import fitnessRouter from "./routers/fitness.route.js";
import analyticsRouter from "./routers/analytics.route.js";
import weightRouter from "./routers/weight.route.js";


import { create } from "express-handlebars";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { sanitizeInput } from "./middleware/security.js";
import logger from "./utils/logger.js";
import path from "path";
import { fileURLToPath } from "url";
>>>>>>> Stashed changes

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
app.use(rateLimit());

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
    formatDate: (date) => new Date(date).toLocaleDateString(),
    formatTime: (date) => new Date(date).toLocaleTimeString()
  }
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "view"));

app.use(express.static(path.join(__dirname, "public")));

<<<<<<< Updated upstream
// Routes
app.use("/api", chatRouter);
app.use("/api", userRouter);
app.use("/auth", authRouter);
app.use("/api", onboardingRouter);
app.use("/api",dietRouter)
app.use("/api", workoutRouter);
app.use("/", viewRouter); // should come last for general rendering
=======


// API Routes
app.use("/api/chat", chatRouter);
app.use("/api/users", userRouter);
app.use("/api", userRouter);
app.use("/auth", authRouter);
app.use("/api/onboarding", onboardingRouter);
app.use("/api/fitness", fitnessRouter);
app.use("/api/diet", dietRouter);
app.use("/api/workout", workoutRouter);
app.use("/api/update", updateRouter);
app.use("/api/performance", performanceRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/weight", weightRouter);
>>>>>>> Stashed changes

app.use("/api/test", testRouter);

// View routes (should come last)
app.use("/", viewRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);



export default app;