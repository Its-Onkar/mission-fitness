import connectDB from "../db/connection.js";
import app from "./app.js"
import { PORT } from "./config/variables.js";
import './config/variables.js';
import { startScheduler } from "./utils/scheduler.js";
import { scheduleDailyNotifications } from "./services/notification.service.js"; 

const startServer = async () => {
    await connectDB();
    startScheduler();
    scheduleDailyNotifications();
    app.listen(PORT, () => {
        console.log("Server is running on http://localhost:" + PORT);
    });
};

startServer().catch(err => {
    console.error('Server startup error:', err);
});
