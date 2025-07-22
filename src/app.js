import express from "express";
import chatRouter from "./routers/chat.route.js";
import userRouter from "./routers/user.route.js";
import authRouter from "./routers/auth.route.js";
import onboardingRouter from "./routers/onboarding.route.js";
import { create } from "handlebars";
const app = express();


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
app.use("/",viewRouter)



export default app;
