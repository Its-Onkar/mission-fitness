import { chatService } from "../services/chat.service.js";
import { getFitnessResponse } from "../utils/prompt.utils.js";
import FitnessProfile from "../Schema/fitnessprofile.schema.js";


export const chatController = async (req, res) => {
  try {
<<<<<<< Updated upstream
    const { message } = req.body;
    const userData = req.auth
    console.log(userData)

=======
    const data = req.body;
    const userData = req.auth;
    const { message } = data;
>>>>>>> Stashed changes

    if (!message || !userData) {
      return res
        .status(400)
        .json({ error: error.message || "Message and user data are required" });
    }

<<<<<<< Updated upstream
    const response = await chatService(userData, message);
    if (!response) {
      return res.status(404).json({ error: "No response from chat service" });
    }
    if (response.error) {
      return res.status(400).json({ error: response.error });
=======
    // Check if user is requesting plan modifications
    const planKeywords = [
      'change diet', 'modify diet', 'update diet', 'new diet',
      'change workout', 'modify workout', 'update workout', 'new workout',
      'change schedule', 'modify schedule', 'update schedule',
      'different plan', 'adjust plan', 'customize plan'
    ];
    
    const isPlanRequest = planKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
   
    let response;

    if (isPlanRequest) {
      // Handle fitness plan modifications
      response = await handlePlanModification(message, userData);
      res.status(200).json({ reply: response });
    } else {
      // Handle general chat - always return simple text
      response = await chatService(data, message);
      if (!response) {
        return res.status(404).json({ error: "No response from chat service" });
      }
      if (response.error) {
        return res.status(400).json({ error: response.error });
      }
      
      // Extract text from response object
      let replyText = '';
      if (typeof response === 'string') {
        replyText = response;
      } else if (response.rawText) {
        replyText = response.rawText;
      } else if (response.text || response.message || response.content) {
        replyText = response.text || response.message || response.content;
      } else {
        replyText = JSON.stringify(response);
      }
      
      res.status(200).json({ reply: replyText });
>>>>>>> Stashed changes
    }
    
  } catch (error) {
    console.error("Error in chatController:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
};

// Handle fitness plan modification requests
async function handlePlanModification(message, userData) {
  try {
    // Get user's fitness profile
    let userProfile = {};
    const profile = await FitnessProfile.findOne({ user: userData._id });
    if (profile) {
      userProfile = profile.toObject();
    }

    // Create modification prompt
    const modificationPrompt = `
User Request: ${message}

Current Profile:
- Goal: ${userProfile.goal || 'Not set'}
- Fitness Level: ${userProfile.fitnessLevel || 'Not set'}
- Activity Level: ${userProfile.activityLevel || 'Not set'}
- Workout Preference: ${userProfile.workoutPreference || 'Not set'}
- Diet Preference: ${userProfile.dietPreference || 'Not set'}

Provide specific recommendations to modify their fitness plan based on their request. Include:
1. Updated workout suggestions (if requested)
2. Diet modifications (if requested)
3. Schedule changes (if requested)
4. Implementation tips

Make it actionable and personalized.`;

    const aiResponse = await getFitnessResponse(userProfile, modificationPrompt);
    
    if (aiResponse.rawText) {
      return aiResponse.rawText;
    }
    
    // Format structured response
    let formattedResponse = "Here are your personalized modifications:\n\n";
    
    if (aiResponse.weeklyWorkoutPlan) {
      formattedResponse += "🏋️ **Updated Workout Plan:**\n";
      Object.entries(aiResponse.weeklyWorkoutPlan).forEach(([day, exercises]) => {
        if (exercises && exercises.length > 0) {
          formattedResponse += `**${day}:** ${exercises.join(', ')}\n`;
        }
      });
      formattedResponse += "\n";
    }
    
    if (aiResponse.nutritionTips) {
      formattedResponse += "🥗 **Nutrition Updates:**\n";
      aiResponse.nutritionTips.forEach(tip => {
        formattedResponse += `• ${tip}\n`;
      });
    }
    
    return formattedResponse;
    
  } catch (error) {
    console.error('Plan modification error:', error);
    return "I can help you modify your fitness plan! Please be more specific about what you'd like to change:\n\n• 'Change my diet to vegetarian'\n• 'I want more cardio workouts'\n• 'Switch to morning exercise schedule'\n• 'Need home workouts without equipment'";
  }
}
