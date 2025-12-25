// Production-ready server startup script
import connectDB from "./db/connection.js";
import app from "./src/app.js";
import { PORT } from "./src/config/variables.js";
import './src/config/variables.js';
import { startScheduler } from "./src/utils/scheduler.js";

const startServer = async () => {
    try {
        console.log('🚀 Starting Mission Fitness Server...');
        
        // Connect to database
        console.log('📊 Connecting to database...');
        await connectDB();
        console.log('✅ Database connected successfully');
        
        // Start scheduler for background tasks
        console.log('⏰ Starting scheduler...');
        startScheduler();
        console.log('✅ Scheduler started');
        
        // Start the server
        const server = app.listen(PORT, () => {
            console.log(`🎉 Mission Fitness Server is running!`);
            console.log(`🌐 Server URL: http://localhost:${PORT}`);
            console.log(`📱 Dashboard: http://localhost:${PORT}/main-dashboard`);
            console.log(`🔐 Login: http://localhost:${PORT}/login`);
            console.log(`📝 Signup: http://localhost:${PORT}/signup`);
            console.log('');
            console.log('🏋️‍♂️ Ready to help users achieve their fitness goals!');
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('🛑 SIGTERM received, shutting down gracefully');
            server.close(() => {
                console.log('✅ Server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('🛑 SIGINT received, shutting down gracefully');
            server.close(() => {
                console.log('✅ Server closed');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
};

startServer();