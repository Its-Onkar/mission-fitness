import User from '../Schema/user.schema.js';
import Onboarding from '../Schema/onboarding.schema.js';

export const checkUserFlow = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.redirect('/login');
        }

        const userId = req.user._id;
        const user = await User.findById(userId);
        const currentPath = req.path;
        
        // Check email verification first
        if (!user.isVerified && currentPath !== '/verify-email' && currentPath !== '/verified-email') {
            return res.redirect('/verify-email');
        }
        
        const onboardingData = await Onboarding.findOne({ userId });

        // First time user - needs onboarding
        if (!onboardingData || !onboardingData.isComplete) {
            if (currentPath !== '/onboarding') {
                return res.redirect('/onboarding');
            }
        }
        // Onboarding complete but no AI plans generated yet
        else if (!user.onboardingCompleted) {
            if (currentPath !== '/ai-plans') {
                return res.redirect('/ai-plans');
            }
        }
        // Returning user - can access main dashboard
        else {
            if (currentPath === '/onboarding') {
                return res.redirect('/main-dashboard');
            }
        }

        next();
    } catch (error) {
        console.error('User flow check error:', error);
        res.redirect('/login');
    }
};