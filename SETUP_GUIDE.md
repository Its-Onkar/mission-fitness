# Mission Fitness - Setup Guide 🏋️♂️

## ✅ Project Status
Your Mission Fitness project has been successfully restored and is ready to run!

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Your `.env` file is already configured with:
- MongoDB connection
- OpenAI API key
- JWT secret
- Email configuration
- USDA API key

### 3. Start the Application

#### Development Mode (with auto-restart)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

#### Test Server (quick verification)
```bash
npm run test-modules
```

## 🌐 Access Your Application

Once started, your application will be available at:

- **Main Dashboard**: http://localhost:6001/main-dashboard
- **Login Page**: http://localhost:6001/login  
- **Signup Page**: http://localhost:6001/signup
- **Home Page**: http://localhost:6001/

## 🔧 Fixed Issues

The following syntax errors have been resolved:

1. ✅ **HTML Entities**: Fixed `&#39;` and `&gt;` in enum values
2. ✅ **Duplicate Imports**: Removed duplicate import statements
3. ✅ **Missing Middleware**: Fixed undefined `performAuthorization`
4. ✅ **Import Order**: Moved imports to top of files
5. ✅ **Syntax Errors**: Fixed all JavaScript syntax issues
6. ✅ **Missing Exports**: Added missing function exports

## 📁 Project Structure

```
mission-fitness/
├── src/
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Authentication, validation, security
│   ├── routers/         # API route definitions
│   ├── services/        # Business logic
│   ├── Schema/          # MongoDB models
│   ├── utils/           # Helper functions
│   ├── view/            # Handlebars templates
│   ├── public/          # Static assets
│   └── config/          # Configuration files
├── db/                  # Database connection
├── logs/                # Application logs
├── .env                 # Environment variables
└── package.json         # Dependencies and scripts
```

## 🎯 Key Features Working

- ✅ **AI-Powered Plans**: OpenAI integration for workout/diet plans
- ✅ **User Authentication**: JWT-based login/signup
- ✅ **Performance Tracking**: Workout and diet completion tracking
- ✅ **Email Notifications**: Automated emails via Nodemailer
- ✅ **Responsive Dashboard**: Modern UI with Handlebars
- ✅ **Security**: Rate limiting, validation, CORS protection
- ✅ **Logging**: Comprehensive logging system

## 🔐 API Endpoints

### Authentication
- `POST /auth/sign-up` - User registration
- `POST /auth/log-in` - User login
- `GET /auth/verify-email` - Email verification

### Fitness & Diet
- `POST /api/onboarding` - Create fitness profile
- `POST /api/fitness` - Generate fitness plans
- `POST /api/chat` - AI fitness assistant

### Performance
- `POST /api/performance/workout/complete` - Mark workout complete
- `POST /api/performance/diet/complete` - Mark diet complete

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Test module loading
npm run test-modules

# Create test user (if needed)
npm run create-user
```

## 🔍 Troubleshooting

### If the server won't start:
1. Check MongoDB is running on `localhost:27017`
2. Verify all environment variables in `.env`
3. Run `npm run test-modules` to check for syntax errors

### If database connection fails:
1. Ensure MongoDB is installed and running
2. Check the `MONGO_URI` in `.env` file
3. Create the database: `mission-fitness`

### If OpenAI features don't work:
1. Verify `OPENAI_API_KEY` in `.env`
2. Check API quota and billing status
3. Test with a simple chat request

## 📊 Database Collections

The application uses these MongoDB collections:
- `users` - User accounts and authentication
- `fitnessprofiles` - User fitness data and preferences  
- `dailyplans` - AI-generated daily workout/diet plans
- `performances` - User activity tracking and streaks
- `workouts` - Workout plan templates
- `diets` - Diet plan templates

## 🎉 Success!

Your Mission Fitness application is now fully functional and ready to help users achieve their fitness goals with AI-powered personalized plans!

## 📞 Support

If you encounter any issues:
1. Check the logs in the `logs/` directory
2. Verify all dependencies are installed
3. Ensure environment variables are correctly set
4. Check MongoDB connection status

Happy coding! 💪