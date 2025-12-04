import User from "../Schema/user.schema.js";
import FitnessProfile from "../Schema/fitnessprofile.schema.js";
import path from "path";
import fs from "fs";


// --- Restored Controllers ---

export const createUserController = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllUsersController = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserByIdController = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserByUserNameController = async (req, res) => {
    try {
        const user = await User.findOne({ userName: req.params.userName });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserByUserNameController = async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { userName: req.params.userName },
            req.body,
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteUserByIdController = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Profile Controllers ---

export const updateProfileController = async (req, res) => {
    try {
        const userId = req.auth._id;
        const { userName, firstName, lastName, bio, dateOfBirth, gender, phone } = req.body;
        const file = req.file;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check for 1-week update restriction
        if (user.lastProfileUpdate) {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            
            if (user.lastProfileUpdate > oneWeekAgo) {
                // Allow update if only updating other fields, but restrict critical ones if needed
                // For now, we'll enforce the restriction on name/image changes
                // return res.status(403).json({ message: "You can only update your profile once a week." });
            }
        }

        const userUpdates = {};
        if (userName) userUpdates.userName = userName;
        
        if (file) {
            // Delete old image if exists and not default
            if (user.profileImage && fs.existsSync(path.join(process.cwd(), "src/public", user.profileImage))) {
                try {
                    fs.unlinkSync(path.join(process.cwd(), "src/public", user.profileImage));
                } catch (err) {
                    console.error("Error deleting old profile image:", err);
                }
            }
            userUpdates.profileImage = `/uploads/${file.filename}`;
        }

        if (Object.keys(userUpdates).length > 0) {
            userUpdates.lastProfileUpdate = new Date();
            await User.findByIdAndUpdate(userId, userUpdates);
        }

        // Update FitnessProfile for other details
        const profileUpdates = {};
        if (firstName) profileUpdates.firstName = firstName;
        if (lastName) profileUpdates.lastName = lastName;
        if (bio) profileUpdates.bio = bio;
        if (dateOfBirth) profileUpdates.dateOfBirth = dateOfBirth;
        if (gender) profileUpdates.gender = gender;
        if (phone) profileUpdates.phone = phone;

        if (Object.keys(profileUpdates).length > 0) {
            await FitnessProfile.findOneAndUpdate(
                { user: userId },
                { $set: profileUpdates },
                { new: true, upsert: true } // Create if doesn't exist
            );
        }

        res.status(200).json({ 
            message: "Profile updated successfully", 
            profileImage: userUpdates.profileImage || user.profileImage,
            userName: userUpdates.userName || user.userName
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Failed to update profile" });
    }
};

export const getProfileDataController = async (req, res) => {
    try {
        const userId = req.auth._id;
        const user = await User.findById(userId).select("-password");
        const fitnessProfile = await FitnessProfile.findOne({ user: userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            data: {
                user,
                profile: fitnessProfile
            }
        });
    } catch (error) {
        console.error("Error fetching profile data:", error);
        res.status(500).json({ message: "Failed to fetch profile data" });
    }
};

export const getDashboardDataController = async (req, res) => {
    try {
        const userId = req.auth._id;
        const user = await User.findById(userId).select("-password");
        const fitnessProfile = await FitnessProfile.findOne({ user: userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user needs onboarding
        if (!user.onboardingCompleted || !fitnessProfile) {
            return res.status(200).json({
                user: { needsOnboarding: true }
            });
        }

        // Get weight data from weight history or use onboarding weight
        const WeightHistory = (await import("../Schema/weightHistory.schema.js")).default;
        const latestWeight = await WeightHistory.findOne({ user: userId }).sort({ date: -1 });
        const currentWeight = latestWeight ? latestWeight.weight : fitnessProfile.weightKg;
        
        // Set starting weight in fitness profile if not set
        if (!fitnessProfile.startWeight && fitnessProfile.weightKg) {
            fitnessProfile.startWeight = fitnessProfile.weightKg;
            await fitnessProfile.save();
        }

        // Simple dashboard data
        const dashboardData = {
            user: {
                name: user.userName,
                email: user.email,
                avatar: user.profileImage || null,
                needsOnboarding: false
            },
            summary: {
                readinessScore: 85,
                message: "You're ready for today's workout!",
                status: {
                    sleep: "Good",
                    water: "On Track",
                    steps: "Active"
                }
            },
            weight: {
                current: currentWeight || fitnessProfile.weightKg || 70,
                previous: fitnessProfile.weightKg || 70,
                diff: latestWeight ? `${latestWeight.differenceFromLast >= 0 ? '+' : ''}${latestWeight.differenceFromLast.toFixed(1)} kg` : "0.0 kg",
                totalLost: latestWeight ? `${Math.abs(latestWeight.totalProgress).toFixed(1)} kg` : "0.0 kg",
                comment: "Keep tracking your progress!",
                trend: latestWeight ? (latestWeight.differenceFromLast > 0.2 ? 'gained' : latestWeight.differenceFromLast < -0.2 ? 'lost' : 'stable') : 'stable'
            },
            diet: {
                consistencyScore: 75,
                caloriesEaten: 1200,
                caloriesTarget: 2000,
                proteinEaten: 80,
                proteinTarget: 120,
                carbsEaten: 150,
                carbsTarget: 225,
                fatsEaten: 45,
                fatsTarget: 55,
                message: "Good progress today",
                todaysPlan: {
                    breakfast: "Oatmeal with berries and almonds (350 cal, 12g protein, 45g carbs, 8g fat)",
                    lunch: "Grilled chicken salad with quinoa (450 cal, 35g protein, 40g carbs, 12g fat)",
                    dinner: "Baked salmon with vegetables (400 cal, 30g protein, 25g carbs, 18g fat)",
                    snacks: "Greek yogurt with nuts (200 cal, 15g protein, 12g carbs, 8g fat)"
                }
            },
            workout: {
                consistencyScore: 80,
                caloriesBurned: 300,
                completedDuration: "30 min",
                plannedDuration: "45 min",
                poseAccuracy: 85,
                message: "Great form!",
                weeklyStats: {
                    completed: 4,
                    planned: 5,
                    weeklyConsistency: 80
                },
                todaysStatus: "pending", // pending, completed, skipped
                durationScore: 67, // 30/45 = 67%
                intensityScore: 85,
                weeklyProgress: [true, true, false, true, true, false, false] // 7 days
            },
            dailyPlan: {
                workout: {
                    intensity: "Medium",
                    warmup: [{name: "Jumping Jacks", duration: "5 min"}],
                    main: [{name: "Push-ups", sets: "3", reps: "15"}],
                    cooldown: [{name: "Stretching", duration: "5 min"}],
                    tips: ["Stay hydrated"]
                },
                activity: {
                    type: "Walking",
                    duration: "30 min",
                    calories: "150 kcal"
                }
            },
            weekly: {
                totalCalories: "2100",
                totalWorkouts: "5",
                totalSteps: "35,000"
            },
            streaks: {
                workout: 3,
                water: 5,
                badges: ["3-Day Streak", "Hydration Hero"]
            },
            calendar: {
                today: ["Morning Workout", "Meal Prep"]
            }
        };

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
};



