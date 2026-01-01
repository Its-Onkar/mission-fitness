# Mission Fitness V2 - Detailed Task Checklist
> Python + FastAPI + PostgreSQL Architecture

---

## Phase 1: Project Setup & Infrastructure
**Estimated: 1 week**

### 1.1 Development Environment
- [ ] Install Python 3.11+
- [ ] Install PostgreSQL 15+
- [ ] Install Redis
- [ ] Set up virtual environment
- [ ] Create project structure
- [ ] Initialize Git repository

### 1.2 Backend Project Initialization
- [ ] Create FastAPI project skeleton
- [ ] Set up `app/main.py` with FastAPI app
- [ ] Create `app/config.py` with Pydantic Settings
- [ ] Set up environment variables (.env)
- [ ] Configure CORS middleware
- [ ] Add request logging middleware
- [ ] Create `requirements.txt` with dependencies:
  - fastapi, uvicorn, sqlalchemy, alembic
  - asyncpg, redis, celery
  - langchain, langchain-openai, langraph
  - passlib, python-jose, bcrypt
  - pydantic, python-multipart
  - pytest, httpx (testing)

### 1.3 Database Setup
- [ ] Configure SQLAlchemy async engine
- [ ] Create `app/database.py` session management
- [ ] Initialize Alembic for migrations
- [ ] Create initial migration with all tables
- [ ] Install pgvector extension
- [ ] Set up database indexes
- [ ] Create seed data script (achievements, etc.)

### 1.4 Docker Configuration
- [ ] Create `Dockerfile` for FastAPI
- [ ] Create `docker-compose.yml` with:
  - FastAPI app
  - PostgreSQL
  - Redis
  - Celery worker
- [ ] Add `.dockerignore`
- [ ] Test local Docker setup

---

## Phase 2: Core Backend - Authentication
**Estimated: 3-4 days**

### 2.1 User Model & Schema
- [ ] Create `app/models/user.py` SQLAlchemy model
- [ ] Create `app/schemas/user.py` Pydantic schemas
  - UserCreate, UserResponse, UserUpdate
- [ ] Create `app/schemas/auth.py`
  - LoginRequest, TokenResponse, TokenData

### 2.2 Authentication Service
- [ ] Create `app/services/auth_service.py`
- [ ] Implement password hashing (bcrypt)
- [ ] Implement JWT token creation
- [ ] Implement JWT token verification
- [ ] Create user registration logic
- [ ] Create login logic
- [ ] Create email verification token generation

### 2.3 Auth Routes
- [ ] Create `app/routers/auth.py`
- [ ] `POST /auth/register` - User registration
- [ ] `POST /auth/login` - User login
- [ ] `POST /auth/verify-email` - Email verification
- [ ] `POST /auth/forgot-password` - Password reset request
- [ ] `POST /auth/reset-password` - Password reset
- [ ] `POST /auth/refresh` - Token refresh

### 2.4 Auth Dependencies
- [ ] Create `app/dependencies.py`
- [ ] Implement `get_current_user` dependency
- [ ] Implement `get_current_active_user`
- [ ] Implement role-based access control

### 2.5 Email Service
- [ ] Create `app/utils/email.py`
- [ ] Configure SMTP settings
- [ ] Create email templates (verification, reset)
- [ ] Implement send_verification_email
- [ ] Implement send_reset_password_email

---

## Phase 3: Core Backend - User & Onboarding
**Estimated: 3-4 days**

### 3.1 Onboarding Model
- [ ] Create `app/models/onboarding.py`
- [ ] Create `app/schemas/onboarding.py`
  - OnboardingCreate, OnboardingUpdate, OnboardingResponse

### 3.2 Onboarding Service
- [ ] Create `app/services/onboarding_service.py`
- [ ] Implement save_onboarding_data
- [ ] Implement get_onboarding_by_user
- [ ] Implement update_onboarding
- [ ] Calculate BMI, TDEE from inputs

### 3.3 Onboarding Routes
- [ ] Create `app/routers/onboarding.py`
- [ ] `POST /api/onboarding` - Save onboarding
- [ ] `GET /api/onboarding` - Get current user's profile
- [ ] `PUT /api/onboarding` - Update profile
- [ ] `GET /api/onboarding/step/{step}` - Get step data

### 3.4 User Routes
- [ ] Create `app/routers/users.py`
- [ ] `GET /api/users/me` - Get current user
- [ ] `PUT /api/users/me` - Update user
- [ ] `DELETE /api/users/me` - Delete account
- [ ] `GET /api/users/{id}` - Get user by ID (admin)

---

## Phase 4: Core Backend - Workouts & Exercises
**Estimated: 4-5 days**

### 4.1 Workout Models
- [ ] Create `app/models/workout.py` (WorkoutPlan)
- [ ] Create `app/models/exercise.py`
- [ ] Create corresponding Pydantic schemas

### 4.2 AI Workout Generation
- [ ] Create `app/ai/workout_generator.py`
- [ ] Design workout generation prompt
- [ ] Implement generate_7_day_plan function
- [ ] Parse AI response to exercise objects
- [ ] Handle equipment preferences
- [ ] Handle medical conditions

### 4.3 Workout Service
- [ ] Create `app/services/workout_service.py`
- [ ] Implement create_workout_plan
- [ ] Implement get_workout_plan_by_user
- [ ] Implement get_todays_workout
- [ ] Implement update_exercise_status
- [ ] Implement log_exercise_feedback
- [ ] Implement regenerate_workout

### 4.4 Workout Routes
- [ ] Create `app/routers/workouts.py`
- [ ] `POST /api/workouts/generate` - Generate AI plan
- [ ] `GET /api/workouts` - Get user's plans
- [ ] `GET /api/workouts/today` - Get today's workout
- [ ] `GET /api/workouts/{id}` - Get specific plan
- [ ] `PUT /api/workouts/{id}` - Update plan
- [ ] `DELETE /api/workouts/{id}` - Delete plan
- [ ] `PUT /api/exercises/{id}/complete` - Mark complete
- [ ] `PUT /api/exercises/{id}/feedback` - Log feedback

---

## Phase 5: Core Backend - Diet
**Estimated: 3-4 days**

### 5.1 Diet Model
- [ ] Create `app/models/diet.py`
- [ ] Create Pydantic schemas

### 5.2 AI Diet Generation
- [ ] Create `app/ai/diet_generator.py`
- [ ] Design diet plan prompt
- [ ] Implement generate_meal_plan
- [ ] Handle dietary preferences
- [ ] Calculate macros

### 5.3 Diet Service & Routes
- [ ] Create `app/services/diet_service.py`
- [ ] Create `app/routers/diet.py`
- [ ] `POST /api/diet/generate` - Generate plan
- [ ] `GET /api/diet` - Get current plan
- [ ] `PUT /api/diet` - Update plan

---

## Phase 6: Gamification System
**Estimated: 4-5 days**

### 6.1 Gamification Models
- [ ] Create `app/models/gamification.py`
- [ ] Create `app/models/achievement.py`
- [ ] Create `app/models/user_achievement.py`
- [ ] Create Pydantic schemas

### 6.2 Gamification Service
- [ ] Create `app/services/gamification_service.py`
- [ ] Implement award_xp with level calculation
- [ ] Implement update_streak
- [ ] Implement check_achievements
- [ ] Implement unlock_achievement
- [ ] Implement get_leaderboard
- [ ] Implement reset_weekly_xp (scheduled)
- [ ] Implement reset_monthly_xp (scheduled)

### 6.3 Achievement Definitions
- [ ] Create achievement seed data
- [ ] Write migration to insert achievements
- [ ] Implement achievement checking logic for each type:
  - Streak achievements
  - Workout count achievements
  - Goal achievements
  - Level achievements
  - PR achievements

### 6.4 Gamification Routes
- [ ] Create `app/routers/gamification.py`
- [ ] `GET /api/gamification/stats` - Get XP, level, streak
- [ ] `GET /api/gamification/achievements` - Get all achievements
- [ ] `GET /api/gamification/achievements/unlocked` - User's unlocked
- [ ] `GET /api/gamification/leaderboard` - Weekly leaderboard
- [ ] `GET /api/gamification/leaderboard/monthly` - Monthly

---

## Phase 7: AI Agent System
**Estimated: 5-6 days**

### 7.1 LLM Abstraction Layer
- [ ] Create `app/ai/llm.py`
- [ ] Implement OpenAI provider
- [ ] Implement Ollama provider (local)
- [ ] Create provider selector based on config
- [ ] Add fallback logic

### 7.2 Conversation Memory
- [ ] Create `app/models/conversation.py`
- [ ] Create `app/models/message.py`
- [ ] Create `app/ai/memory.py`
- [ ] Implement get_conversation_history
- [ ] Implement add_message
- [ ] Implement generate_summary (compress old messages)
- [ ] Implement semantic search with pgvector

### 7.3 Agent Tools
- [ ] Create `app/ai/tools.py`
- [ ] Implement get_user_profile tool
- [ ] Implement get_workout_plan tool
- [ ] Implement log_exercise tool
- [ ] Implement update_difficulty tool
- [ ] Implement get_progress_stats tool
- [ ] Implement award_xp tool
- [ ] Implement get_streak_info tool
- [ ] Implement modify_workout tool
- [ ] Implement get_diet_plan tool
- [ ] Implement set_goal tool

### 7.4 Agent Core
- [ ] Create `app/ai/agent.py`
- [ ] Create `app/ai/prompts.py` with system prompt
- [ ] Implement FitnessAgent class
- [ ] Configure LangChain agent with tools
- [ ] Implement chat method
- [ ] Implement proactive suggestions
- [ ] Add error handling and fallbacks

### 7.5 Agent Routes
- [ ] Create `app/routers/agent.py`
- [ ] `POST /api/agent/chat` - Send message
- [ ] `GET /api/agent/history` - Get conversation history
- [ ] `DELETE /api/agent/history` - Clear history
- [ ] `GET /api/agent/suggestions` - Get proactive tips

---

## Phase 8: Analytics & Insights
**Estimated: 5-6 days**

### 8.1 Analytics Models
- [ ] Create `app/models/analytics.py`
- [ ] Create `app/models/goal.py`
- [ ] Create `app/models/progress.py`
- [ ] Create `app/models/personal_record.py`
- [ ] Create Pydantic schemas

### 8.2 Progress Tracking Service
- [ ] Create `app/services/progress_service.py`
- [ ] Implement log_daily_progress
- [ ] Implement get_progress_history
- [ ] Implement calculate_trends
- [ ] Implement detect_personal_records
- [ ] Implement save_personal_record

### 8.3 Goals Service
- [ ] Create `app/services/goals_service.py`
- [ ] Implement create_goal
- [ ] Implement update_goal_progress
- [ ] Implement check_milestones
- [ ] Implement calculate_ai_prediction
- [ ] Implement get_daily_target

### 8.4 Analytics Service
- [ ] Create `app/services/analytics_service.py`
- [ ] Implement generate_weekly_report
- [ ] Implement generate_monthly_report
- [ ] Implement get_workout_heatmap
- [ ] Implement compare_periods
- [ ] Implement get_muscle_distribution
- [ ] Implement generate_ai_insights

### 8.5 Analytics Routes
- [ ] Create `app/routers/analytics.py`
- [ ] `GET /api/analytics/weekly` - Weekly report
- [ ] `GET /api/analytics/monthly` - Monthly report
- [ ] `GET /api/analytics/heatmap` - Workout heatmap
- [ ] `GET /api/analytics/body-metrics` - Body trends
- [ ] `GET /api/analytics/personal-records` - PRs

### 8.6 Goals Routes
- [ ] Create `app/routers/goals.py`
- [ ] `POST /api/goals` - Create goal
- [ ] `GET /api/goals` - List goals
- [ ] `GET /api/goals/{id}` - Get goal
- [ ] `PUT /api/goals/{id}` - Update goal
- [ ] `PUT /api/goals/{id}/progress` - Update progress
- [ ] `DELETE /api/goals/{id}` - Delete goal

### 8.7 Progress Routes
- [ ] Create `app/routers/progress.py`
- [ ] `POST /api/progress` - Log daily progress
- [ ] `GET /api/progress` - Get progress history
- [ ] `GET /api/progress/today` - Today's log

---

## Phase 9: Voice Integration
**Estimated: 3-4 days**

### 9.1 Voice Service
- [ ] Create `app/ai/voice.py`
- [ ] Implement speech_to_text (Whisper)
- [ ] Implement text_to_speech (OpenAI TTS)
- [ ] Add audio format handling
- [ ] Add streaming support

### 9.2 Voice Routes
- [ ] Create `app/routers/voice.py`
- [ ] `POST /api/voice/transcribe` - Convert speech to text
- [ ] `POST /api/voice/synthesize` - Convert text to speech
- [ ] `POST /api/voice/chat` - Voice-based chat with agent

### 9.3 Voice Commands
- [ ] Define voice command patterns
- [ ] Implement command parser
- [ ] Map commands to actions:
  - "Start workout" → begin workout
  - "Next exercise" → advance
  - "Complete" → mark done
  - "Too easy/hard" → feedback

---

## Phase 10: Background Tasks
**Estimated: 2-3 days**

### 10.1 Celery Setup
- [ ] Configure Celery with Redis
- [ ] Create `app/tasks/__init__.py`
- [ ] Set up task scheduling (Celery Beat)

### 10.2 Scheduled Tasks
- [ ] Create `app/tasks/reports.py`
  - Weekly report generation (Sunday)
  - Monthly report generation (1st of month)
- [ ] Create `app/tasks/notifications.py`
  - Streak reminder
  - Workout reminder
  - Goal deadline reminder
- [ ] Create `app/tasks/analytics.py`
  - Weekly XP reset
  - Monthly XP reset
  - Analytics aggregation

---

## Phase 11: Frontend Development
**Estimated: 2 weeks**

### 11.1 Project Setup
- [ ] Initialize Next.js 14 project
- [ ] Configure TypeScript
- [ ] Install and configure Tailwind CSS
- [ ] Set up shadcn/ui
- [ ] Install Framer Motion
- [ ] Configure API client (axios/fetch)
- [ ] Set up authentication context

### 11.2 Landing Page
- [ ] Design hero section
- [ ] Add feature highlights
- [ ] Add testimonials section
- [ ] Add call-to-action
- [ ] Add footer
- [ ] Implement animations

### 11.3 Authentication Pages
- [ ] Create login page
- [ ] Create signup page
- [ ] Create email verification page
- [ ] Create forgot password page
- [ ] Create reset password page
- [ ] Add form validation
- [ ] Add loading states

### 11.4 Onboarding Flow
- [ ] Create multi-step form
- [ ] Step 1: Basic info (gender, age, height, weight)
- [ ] Step 2: Fitness goals
- [ ] Step 3: Preferences (equipment, location)
- [ ] Step 4: Schedule
- [ ] Step 5: Medical conditions
- [ ] Step 6: Summary & confirm
- [ ] Add progress indicator
- [ ] Add step navigation

### 11.5 Dashboard
- [ ] Create dashboard layout with sidebar
- [ ] Implement responsive sidebar
- [ ] Create dashboard home page
  - Welcome message with streak
  - XP bar and level
  - Today's workout summary
  - Quick stats cards
  - Recent achievements
- [ ] Add navigation

### 11.6 Workout Pages
- [ ] Create workout list page
- [ ] Create today's workout page
- [ ] Create active workout tracker
  - Exercise display
  - Timer/rest countdown
  - Set/rep tracking
  - Prev/Next navigation
  - Complete button
  - Feedback buttons
- [ ] Add exercise demo images/GIFs
- [ ] Implement voice controls

### 11.7 AI Chat Interface
- [ ] Create chat page
- [ ] Build message list component
- [ ] Build input component
- [ ] Add voice input button
- [ ] Add voice output toggle
- [ ] Implement streaming responses
- [ ] Add typing indicator
- [ ] Add message history

### 11.8 Progress & Analytics
- [ ] Create progress page
- [ ] Build weight/body fat chart
- [ ] Build workout heatmap
- [ ] Build weekly stats cards
- [ ] Build comparison view
- [ ] Create personal records page
- [ ] Add PR celebration animations

### 11.9 Goals Page
- [ ] Create goals list page
- [ ] Create add goal modal
- [ ] Build goal progress cards
- [ ] Add milestone indicators
- [ ] Show AI predictions

### 11.10 Gamification UI
- [ ] Build XP bar component
- [ ] Build level badge component
- [ ] Build streak counter
- [ ] Build achievement grid
- [ ] Build achievement popup
- [ ] Create leaderboard page
- [ ] Add celebration animations

### 11.11 Profile Page
- [ ] Create profile page
- [ ] Show user info
- [ ] Show stats summary
- [ ] Add edit profile
- [ ] Add settings
- [ ] Add logout

---

## Phase 12: Testing
**Estimated: 1 week**

### 12.1 Backend Tests
- [ ] Set up pytest with async support
- [ ] Create test database fixtures
- [ ] Write auth tests
- [ ] Write user tests
- [ ] Write workout tests
- [ ] Write gamification tests
- [ ] Write agent tests
- [ ] Write analytics tests
- [ ] Achieve 80%+ code coverage

### 12.2 Frontend Tests
- [ ] Set up Vitest + Testing Library
- [ ] Write component tests
- [ ] Write hook tests
- [ ] Write integration tests

### 12.3 E2E Tests
- [ ] Set up Playwright
- [ ] Write auth flow tests
- [ ] Write onboarding flow tests
- [ ] Write workout flow tests
- [ ] Write chat flow tests

---

## Phase 13: Deployment
**Estimated: 1 week**

### 13.1 Backend Deployment
- [ ] Create production Dockerfile
- [ ] Set up Railway/Render project
- [ ] Configure environment variables
- [ ] Set up PostgreSQL (Neon/Supabase)
- [ ] Set up Redis (Upstash)
- [ ] Deploy FastAPI app
- [ ] Deploy Celery workers
- [ ] Set up health checks
- [ ] Configure auto-scaling

### 13.2 Frontend Deployment
- [ ] Configure Vercel project
- [ ] Set up environment variables
- [ ] Deploy Next.js app
- [ ] Configure custom domain (optional)
- [ ] Set up preview deployments

### 13.3 Monitoring & Logging
- [ ] Set up error tracking (Sentry)
- [ ] Set up logging (structured logs)
- [ ] Set up uptime monitoring
- [ ] Configure alerts

### 13.4 Documentation
- [ ] Write API documentation
- [ ] Write setup guide
- [ ] Write deployment guide
- [ ] Create README
- [ ] Add code comments

---

## Summary

| Phase | Tasks | Est. Duration |
|-------|-------|---------------|
| 1. Setup | 20+ | 1 week |
| 2. Auth | 15+ | 3-4 days |
| 3. User/Onboarding | 12+ | 3-4 days |
| 4. Workouts | 18+ | 4-5 days |
| 5. Diet | 10+ | 3-4 days |
| 6. Gamification | 18+ | 4-5 days |
| 7. AI Agent | 22+ | 5-6 days |
| 8. Analytics | 24+ | 5-6 days |
| 9. Voice | 10+ | 3-4 days |
| 10. Background Tasks | 8+ | 2-3 days |
| 11. Frontend | 50+ | 2 weeks |
| 12. Testing | 15+ | 1 week |
| 13. Deployment | 15+ | 1 week |

**Total: ~200+ tasks over ~11 weeks**
