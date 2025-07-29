import express from "express";
import chatRouter from "./routers/chat.route.js";
import userRouter from "./routers/user.route.js";
import authRouter from "./routers/auth.route.js";
import onboardingRouter from "./routers/onboarding.route.js"
import { create } from "express-handlebars";
import path from "path";
import viewRouter from "./routers/view.route.js";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hbs = create({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "view", "layouts"),
    partialsDir: path.join(__dirname, "view", "partials"),
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "view"));

console.log("Views directory:", path.join(__dirname, "view"));
app.use("/api", chatRouter);
app.use("/api", userRouter)
app.use("/auth", authRouter)
app.use("/", viewRouter)
app.use("/api", onboardingRouter);



export default app;
