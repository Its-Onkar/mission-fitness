import express from "express";
import chatRouter from "./routers/chat.route.js";
import userRouter from "./routers/user.route.js";
import authRouter from "./routers/auth.route.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api",chatRouter);
app.use("/api",userRouter)
app.use("/",authRouter)

export default app;
