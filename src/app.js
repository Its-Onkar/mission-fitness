import express from "express";
import chatRouter from "./routers/chatRouter.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api",chatRouter);

export default app;
