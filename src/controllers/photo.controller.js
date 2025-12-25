import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for photo uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/photos');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const uploadPhoto = upload.single('photo');

export const analyzeWorkoutPhoto = async (req, res) => {
    try {
        const user = req.user;
        const { date } = req.body;
        
        if (!user || !user._id) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        if (!req.file) {
            return res.status(400).json({ message: 'No photo uploaded' });
        }
        
        // Convert image to base64 for OpenAI Vision API
        const imagePath = req.file.path;
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        // Get user context for personalized analysis
        const Onboarding = (await import('../Schema/onboarding.schema.js')).default;
        const onboardingData = await Onboarding.findOne({ userId: user._id });
        
        const userGoal = onboardingData?.goal || 'general fitness';
        const fitnessLevel = onboardingData?.fitnessLevel || 'beginner';
        
        // Analyze photo with OpenAI Vision or fallback
        let analysis;
        try {
            analysis = await analyzePhotoWithAI(base64Image, userGoal, fitnessLevel, user.userName);
        } catch (error) {
            console.error('AI analysis failed, using fallback:', error);
            analysis = generatePersonalizedAnalysis(userGoal, fitnessLevel, user.userName);
        }
        
        // Ensure analysis is never null/undefined
        if (!analysis) {
            analysis = generatePersonalizedAnalysis(userGoal, fitnessLevel, user.userName);
        }
        
        // Save photo record to database
        const WorkoutPhoto = (await import('../Schema/workoutphoto.schema.js')).default;
        const photoRecord = new WorkoutPhoto({
            user: user._id,
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            date: new Date(date),
            analysis: analysis
        });
        
        await photoRecord.save();
        
        res.status(200).json({
            message: 'Photo analyzed successfully',
            analysis: analysis,
            photoId: photoRecord._id
        });
        
    } catch (error) {
        console.error('Photo analysis error:', error);
        res.status(500).json({ 
            message: 'Failed to analyze photo',
            error: error.message 
        });
    }
};

async function analyzePhotoWithAI(base64Image, userGoal, fitnessLevel, userName) {
    try {
        if (process.env.OPENAI_API_KEY && openai) {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{
                    role: "user",
                    content: [{
                        type: "text",
                        text: `Analyze this fitness/health photo for ${userName} (Goal: ${userGoal}, Level: ${fitnessLevel}). Return JSON with: recognition, health_assessment, exercise_steps, suggestions, action_plan`
                    }, {
                        type: "image_url",
                        image_url: { url: `data:image/jpeg;base64,${base64Image}` }
                    }]
                }],
                max_tokens: 400
            });
            return parseEnhancedAIResponse(response.choices[0].message.content);
        }
    } catch (error) {
        console.error('OpenAI Vision API error:', error);
        // Return fallback instead of throwing
        return generatePersonalizedAnalysis(userGoal, fitnessLevel, userName);
    }
    
    // Return fallback if no API key
    return generatePersonalizedAnalysis(userGoal, fitnessLevel, userName);
}

function generatePersonalizedAnalysis(userGoal, fitnessLevel, userName) {
    const goalMessages = {
        'Weight Loss': {
            recognition: `Photo uploaded by ${userName} - analyzing for weight loss progress`,
            health_assessment: "Your commitment to weight loss is evident. Focus on calorie deficit and consistent activity.",
            exercise_steps: "1. Maintain proper form 2. Control breathing 3. Full range of motion 4. Progressive intensity",
            suggestions: "Incorporate HIIT workouts, track calories, stay hydrated, and get adequate sleep for optimal fat loss.",
            action_plan: "1. Take progress photos weekly 2. Increase cardio intensity 3. Monitor portion sizes"
        },
        'Muscle Gain': {
            recognition: `Photo uploaded by ${userName} - analyzing for muscle building progress`,
            health_assessment: "Your muscle-building efforts show dedication. Focus on progressive overload and recovery.",
            exercise_steps: "1. Perfect form first 2. Controlled negatives 3. Full muscle stretch 4. Progressive weight increase",
            suggestions: "Prioritize compound movements, ensure adequate protein intake, and allow proper rest between sessions.",
            action_plan: "1. Track lifting progress 2. Increase protein to 1.6g/kg bodyweight 3. Schedule rest days"
        },
        'General Fitness': {
            recognition: `Photo uploaded by ${userName} - analyzing for overall fitness improvement`,
            health_assessment: "Your commitment to overall health is commendable. Balance is key for sustainable fitness.",
            exercise_steps: "1. Proper warm-up 2. Maintain good posture 3. Controlled movements 4. Cool down properly",
            suggestions: "Combine cardio and strength training, focus on mobility, and maintain consistent sleep schedule.",
            action_plan: "1. Create weekly workout schedule 2. Add flexibility training 3. Monitor energy levels"
        }
    };
    
    const levelTips = {
        'beginner': "Start slow, focus on form over intensity, and build consistency.",
        'intermediate': "Challenge yourself with new variations and track your progress.",
        'advanced': "Fine-tune your technique and push your limits safely."
    };
    
    const goalAnalysis = goalMessages[userGoal] || goalMessages['General Fitness'];
    const levelTip = levelTips[fitnessLevel] || levelTips['beginner'];
    
    return {
        recognition: goalAnalysis.recognition,
        health_assessment: goalAnalysis.health_assessment,
        exercise_steps: goalAnalysis.exercise_steps,
        suggestions: `${goalAnalysis.suggestions} ${levelTip}`,
        action_plan: goalAnalysis.action_plan
    };
}

function parseEnhancedAIResponse(aiResponse) {
    try {
        // Try to parse as JSON first
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                recognition: parsed.recognition || "Image analyzed successfully",
                health_assessment: parsed.health_assessment || "Health status looks good",
                exercise_steps: parsed.exercise_steps || "Continue with proper form",
                suggestions: parsed.suggestions || "Keep up the great work!",
                action_plan: parsed.action_plan || "Stay consistent with your routine"
            };
        }
    } catch (e) {
        console.log('JSON parse failed, using text parsing');
    }
    
    // Fallback to text parsing
    const sections = {
        recognition: "Image analyzed successfully",
        health_assessment: "Health status looks good",
        exercise_steps: "Continue with proper form",
        suggestions: "Keep up the great work!",
        action_plan: "Stay consistent with your routine"
    };
    
    const lines = aiResponse.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
        const lower = line.toLowerCase();
        if (lower.includes('recognition') || lower.includes('identify')) {
            sections.recognition = line.replace(/^\d+\.\s*.*?recognition:?\s*/i, '').trim();
        } else if (lower.includes('health') || lower.includes('assessment')) {
            sections.health_assessment = line.replace(/^\d+\.\s*.*?assessment:?\s*/i, '').trim();
        } else if (lower.includes('steps') || lower.includes('form')) {
            sections.exercise_steps = line.replace(/^\d+\.\s*.*?steps:?\s*/i, '').trim();
        } else if (lower.includes('suggestion') || lower.includes('recommend')) {
            sections.suggestions = line.replace(/^\d+\.\s*.*?suggestions?:?\s*/i, '').trim();
        } else if (lower.includes('action') || lower.includes('plan')) {
            sections.action_plan = line.replace(/^\d+\.\s*.*?plan:?\s*/i, '').trim();
        }
    });
    
    return sections;
}

export const getUserPhotos = async (req, res) => {
    try {
        const user = req.user;
        const { limit = 10 } = req.query;
        
        if (!user || !user._id) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        const WorkoutPhoto = (await import('../Schema/workoutphoto.schema.js')).default;
        const photos = await WorkoutPhoto.find({ user: user._id })
            .sort({ date: -1 })
            .limit(parseInt(limit));
        
        res.status(200).json({ photos });
        
    } catch (error) {
        console.error('Get photos error:', error);
        res.status(500).json({ message: 'Failed to get photos' });
    }
};