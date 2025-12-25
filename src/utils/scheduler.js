import cron from 'node-cron';
import { checkMissedActivities } from '../services/performance.service.js';

// Run daily at 9 AM to check for missed activities from previous day
export const startScheduler = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily check for missed activities...');
    try {
      await checkMissedActivities();
      console.log('Daily check completed successfully');
    } catch (error) {
      console.error('Error in daily check:', error);
    }
  });
  
  console.log('Scheduler started - will check for missed activities daily at 9 AM');
};
