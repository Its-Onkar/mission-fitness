import express from "express";
import chatRouter from "./routers/chat.route.js";
import userRouter from "./routers/user.route.js";
import authRouter from "./routers/auth.route.js";
import onboardingRouter from "./routers/onboarding.route.js";
import dietRouter from "./routers/dietplain.route.js";
import viewRouter from "./routers/view.route.js";

import { create } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import workoutRouter from "./routers/workout.route.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup handlebars engine
const hbs = create({
  extname: ".hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "view", "layouts"),
  partialsDir: path.join(__dirname, "view", "partials"),
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "view"));

// Static files (if needed)
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api", chatRouter);
app.use("/api", userRouter);
app.use("/auth", authRouter);
app.use("/api", onboardingRouter);
app.use("/api",dietRouter)
app.use("/api", workoutRouter);
app.use("/", viewRouter); // should come last for general rendering

export default app;
