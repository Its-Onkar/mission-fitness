import express from "express";
import chatRouter from "./routers/chat.route.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api",chatRouter);

export default app;
