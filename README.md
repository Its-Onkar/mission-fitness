# Mission Fitness 🏋️‍♂️

A professional AI-powered fitness platform that provides personalized workout and diet plans based on user preferences and goals.

## 🚀 Features

- **AI-Powered Plans**: Personalized workout and diet plans using OpenAI
- **User Authentication**: Secure registration, login, and email verification
- **Performance Tracking**: Track workout and diet completion with streak system
- **Multiple Diet Preferences**: Support for vegetarian, vegan, keto, paleo, and gluten-free diets
- **Responsive Design**: Modern, mobile-friendly interface
- **Email Notifications**: Automated completion and reminder emails
- **Professional Architecture**: Rate limiting, validation, logging, and error handling

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **AI**: OpenAI GPT-4
- **Authentication**: JWT tokens
- **Email**: Nodemailer
- **Frontend**: Handlebars templating
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Yup schema validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB
- OpenAI API key
- Gmail account for email notifications

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Its-Onkar/mission-fitness.git
   cd mission-fitness
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/mission-fitness
   PORT=5000
   JWT_SECRET=your-jwt-secret
   OPENAI_API_KEY=your-openai-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start the application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📁 Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── routers/         # Route definitions
├── services/        # Business logic
├── utils/           # Utility functions
├── Schema/          # Database models
├── view/            # Handlebars templates
└── public/          # Static assets
```

## 🔐 API Endpoints

### Authentication
- `POST /auth/sign-up` - User registration
- `POST /auth/log-in` - User login
- `GET /auth/verify-email` - Email verification
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset

### Onboarding
- `POST /api/onboarding` - Create fitness profile
- `GET /api/onboarding/:userId` - Get user profile
- `PUT /api/onboarding/:userId` - Update profile

### Performance
- `POST /api/performance/workout/complete` - Mark workout complete
- `POST /api/performance/diet/complete` - Mark diet complete
- `GET /api/performance/data` - Get performance statistics

### AI Plans
- `POST /api/onboarding/ai-recommendations` - Generate AI plans

## 🎯 Key Features

### AI Plan Generation
- Personalized workout plans based on fitness level and goals
- Custom diet plans respecting dietary preferences
- Calorie calculations based on user metrics
- Daily plan variations for consistency

### Performance Tracking
- Streak tracking for consecutive days of activity
- Score system with bonus points
- Email notifications for completions and reminders
- Dashboard with performance statistics

### Security & Validation
- Rate limiting on all routes
- Input validation with Yup schemas
- JWT token authentication
- Helmet security headers
- CORS protection

## 🔄 Scheduled Tasks

- Daily check for missed activities at 9 AM
- Automated warning emails for inactive users
- Performance data cleanup

## 📊 Logging

- Comprehensive logging system
- Daily log files with rotation
- Error tracking and debugging
- Request/response logging

## 🚀 Deployment

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Configure production database
   - Set secure JWT secrets

2. **Build & Start**
   ```bash
   npm start
   ```

3. **Health Check**
   - Visit `/health` endpoint for server status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Team

- **Mission Fitness Team** - Development and Maintenance

## 🐛 Bug Reports

Please report bugs through the [GitHub Issues](https://github.com/Its-Onkar/mission-fitness/issues) page.

## 📞 Support

For support and questions, please contact the development team or create an issue on GitHub.

---

**Mission Fitness** - Your AI-powered fitness companion 💪