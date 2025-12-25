import DailyProgress from '../Schema/dailyprogress.schema.js';

export const saveDailyProgress = async (req, res) => {
    try {
        const user = req.user;
        const { date, water, sleep, energy, mood } = req.body;
        
        if (!user || !user._id) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        const userId = user._id;
        const progressDate = new Date(date);
        progressDate.setHours(0, 0, 0, 0);
        
        // Find existing progress or create new
        let progress = await DailyProgress.findOne({ 
            user: userId, 
            date: progressDate 
        });
        
        if (!progress) {
            progress = new DailyProgress({
                user: userId,
                date: progressDate
            });
        }
        
        // Update progress data
        if (water !== undefined) progress.water = water;
        if (sleep !== undefined) progress.sleep = sleep;
        if (energy !== undefined) progress.energy = energy;
        if (mood !== undefined) progress.mood = mood;
        
        await progress.save();
        
        res.status(200).json({
            message: 'Daily progress saved successfully',
            progress
        });
        
    } catch (error) {
        console.error('Error saving daily progress:', error);
        res.status(500).json({ message: 'Failed to save daily progress' });
    }
};

export const getDailyProgress = async (req, res) => {
    try {
        const user = req.user;
        const { date } = req.query;
        
        if (!user || !user._id) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        const userId = user._id;
        const progressDate = new Date(date || new Date());
        progressDate.setHours(0, 0, 0, 0);
        
        const progress = await DailyProgress.findOne({ 
            user: userId, 
            date: progressDate 
        });
        
        res.status(200).json({
            data: progress || {
                water: 0,
                sleep: 0,
                energy: 0,
                mood: ''
            }
        });
        
    } catch (error) {
        console.error('Error getting daily progress:', error);
        res.status(500).json({ message: 'Failed to get daily progress' });
    }
};

export const getProgressHistory = async (req, res) => {
    try {
        const user = req.user;
        const { days = 7 } = req.query;
        
        if (!user || !user._id) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        const userId = user._id;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        
        const progressHistory = await DailyProgress.find({
            user: userId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: -1 });
        
        res.status(200).json({
            history: progressHistory
        });
        
    } catch (error) {
        console.error('Error getting progress history:', error);
        res.status(500).json({ message: 'Failed to get progress history' });
    }
};