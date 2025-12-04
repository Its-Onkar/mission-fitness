import User from "../Schema/user.schema.js";

const checkOnboarding = async (req, res, next) => {
  try {
    // Handle optionalAuth routes - if no auth, allow access
    if (!req.auth || !req.auth._id) {
      return next();
    }

    const userId = req.auth._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.onboardingCompleted) {
      return next();
    }

    
    if (req.path.includes("/api")) {
      return res.status(401).json({
        requireOnboarding: true,
        message: "Complete onboarding first",
      });
    } else {
      return res.redirect("/onboarding"); 
    }

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export default checkOnboarding;
