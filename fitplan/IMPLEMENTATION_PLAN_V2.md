# 🏋️ Mission Fitness V2 - Python Architecture Implementation Plan

> **Vision**: A production-grade, AI-powered fitness companion built with industry-standard Python/FastAPI stack for optimal AI agent development

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 14)                         │
│              TypeScript + Tailwind + shadcn/ui                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ REST API + WebSocket
┌──────────────────────────▼──────────────────────────────────────┐
│                    BACKEND (FastAPI)                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Auth │ Workouts │ Diet │ Gamification │ Analytics │ Goals │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │           AI Agent Layer (LangChain + LangGraph)            │ │
│  │    Memory │ Tools │ Reasoning │ Voice │ Proactive Coach    │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                      DATA LAYER                                  │
│  PostgreSQL (primary) │ pgvector (embeddings) │ Redis (cache)   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14, TypeScript, Tailwind, shadcn/ui, Framer Motion | Modern React UI |
| Backend | FastAPI (Python 3.11+) | Async API, auto-docs |
| ORM | SQLAlchemy 2.0 + Alembic | Type-safe DB, migrations |
| Database | PostgreSQL 15+ | Primary data store |
| Vector DB | pgvector extension | AI embeddings, semantic search |
| Cache | Redis | Sessions, leaderboards, real-time |
| AI Framework | LangChain, LangGraph | Agents, memory, tools |
| LLM | OpenAI GPT-4o, Ollama (local) | AI completions |
| Voice | Whisper (STT), OpenAI TTS | Voice interaction |
| Task Queue | Celery + Redis | Background jobs |
| Deploy | Railway/Render, Vercel | Cloud hosting |

---

## Phase 1: Project Setup & Infrastructure

### 1.1 Backend Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application
│   ├── config.py               # Settings (Pydantic)
│   ├── database.py             # DB session management
│   ├── dependencies.py         # Dependency injection
│   │
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── workout.py
│   │   ├── exercise.py
│   │   ├── diet.py
│   │   ├── onboarding.py
│   │   ├── gamification.py
│   │   ├── achievement.py
│   │   ├── goal.py
│   │   ├── progress.py
│   │   ├── analytics.py
│   │   ├── conversation.py
│   │   └── personal_record.py
│   │
│   ├── schemas/                # Pydantic schemas (request/response)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── workout.py
│   │   ├── auth.py
│   │   └── ...
│   │
│   ├── routers/                # API endpoints
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── workouts.py
│   │   ├── diet.py
│   │   ├── onboarding.py
│   │   ├── gamification.py
│   │   ├── analytics.py
│   │   ├── goals.py
│   │   ├── agent.py
│   │   └── voice.py
│   │
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── workout_service.py
│   │   ├── gamification_service.py
│   │   ├── analytics_service.py
│   │   └── ...
│   │
│   ├── ai/                     # AI Agent components
│   │   ├── __init__.py
│   │   ├── agent.py            # Main agent orchestrator
│   │   ├── tools.py            # Agent tools (functions)
│   │   ├── prompts.py          # System prompts
│   │   ├── memory.py           # Conversation memory
│   │   ├── llm.py              # LLM provider abstraction
│   │   └── voice.py            # STT/TTS processing
│   │
│   ├── tasks/                  # Celery background tasks
│   │   ├── __init__.py
│   │   ├── reports.py          # Weekly/monthly report generation
│   │   ├── notifications.py    # Push notifications
│   │   └── analytics.py        # Analytics aggregation
│   │
│   └── utils/
│       ├── __init__.py
│       ├── security.py         # Password hashing, JWT
│       ├── email.py            # Email sending
│       └── helpers.py
│
├── alembic/                    # Database migrations
│   ├── versions/
│   └── env.py
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_workouts.py
│   └── ...
│
├── requirements.txt
├── requirements-dev.txt
├── alembic.ini
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

### 1.2 Database Schema (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Onboarding Profile
CREATE TABLE onboarding_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    gender VARCHAR(20),
    age INTEGER,
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    fitness_goal VARCHAR(50),
    fitness_level VARCHAR(30),
    activity_level VARCHAR(30),
    medical_conditions TEXT[],
    diet_preference VARCHAR(30),
    workout_preference VARCHAR(30),
    available_equipment TEXT[],
    workout_time VARCHAR(20),
    exercise_frequency_per_week INTEGER,
    preferred_days TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Workout Plans
CREATE TABLE workout_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    goal VARCHAR(100),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by_ai BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Exercises
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES workout_plans(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    difficulty VARCHAR(20),
    muscles_targeted TEXT[],
    equipment VARCHAR(100),
    sets INTEGER,
    reps VARCHAR(20),
    rest_seconds INTEGER,
    duration_minutes INTEGER,
    estimated_calories INTEGER,
    day_of_week VARCHAR(20),
    status VARCHAR(30) DEFAULT 'not_started',
    user_feedback VARCHAR(30),
    performed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Gamification
CREATE TABLE gamification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    title VARCHAR(50) DEFAULT 'Rookie',
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    weekly_xp INTEGER DEFAULT 0,
    monthly_xp INTEGER DEFAULT 0,
    show_on_leaderboard BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Achievements (definitions)
CREATE TABLE achievement_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    achievement_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    description TEXT,
    icon VARCHAR(50),
    xp_reward INTEGER,
    rarity VARCHAR(20),
    condition_type VARCHAR(50),
    condition_value INTEGER
);

-- User Achievements
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(50) REFERENCES achievement_definitions(achievement_id),
    unlocked_at TIMESTAMP DEFAULT NOW(),
    notified BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, achievement_id)
);

-- Goals
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(30),
    target_type VARCHAR(30),
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(30),
    start_date DATE,
    target_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    completed_at TIMESTAMP,
    ai_predicted_completion DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Progress Logs
CREATE TABLE progress_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    weight_kg DECIMAL(5,2),
    body_fat_percent DECIMAL(4,2),
    workouts_completed INTEGER DEFAULT 0,
    total_minutes INTEGER DEFAULT 0,
    calories_burned INTEGER DEFAULT 0,
    mood VARCHAR(20),
    energy_level INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, log_date)
);

-- Conversations (AI Agent Memory)
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    summary TEXT,
    last_active TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),  -- pgvector for semantic search
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Personal Records
CREATE TABLE personal_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    exercise_name VARCHAR(255),
    category VARCHAR(50),
    record_type VARCHAR(30),
    value DECIMAL(10,2),
    unit VARCHAR(30),
    previous_record DECIMAL(10,2),
    improvement_percent DECIMAL(5,2),
    achieved_at TIMESTAMP DEFAULT NOW(),
    workout_id UUID REFERENCES workout_plans(id),
    celebration_shown BOOLEAN DEFAULT FALSE
);

-- Analytics Reports
CREATE TABLE analytics_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    period_type VARCHAR(20),
    period_start DATE,
    period_end DATE,
    report_data JSONB,
    ai_insights JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_exercises_user_id ON exercises(user_id);
CREATE INDEX idx_exercises_plan_id ON exercises(plan_id);
CREATE INDEX idx_progress_user_date ON progress_logs(user_id, log_date);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_embedding ON messages USING ivfflat (embedding vector_cosine_ops);
```

---

## Phase 2: Core Backend Implementation

### 2.1 Authentication System

```python
# app/services/auth_service.py
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import settings
from app.models.user import User
from app.schemas.auth import TokenData, UserCreate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain: str, hashed: str) -> bool:
        return pwd_context.verify(plain, hashed)
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: timedelta = None):
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(hours=24))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    
    async def register(self, db: AsyncSession, user_data: UserCreate) -> User:
        # Validate, hash password, create user
        pass
    
    async def login(self, db: AsyncSession, email: str, password: str):
        # Verify credentials, return token
        pass
    
    async def verify_email(self, db: AsyncSession, token: str):
        pass
```

### 2.2 AI Agent System (LangChain + LangGraph)

```python
# app/ai/agent.py
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from app.ai.tools import get_agent_tools
from app.ai.prompts import SYSTEM_PROMPT
from app.ai.memory import ConversationMemory

class FitnessAgent:
    def __init__(self, user_id: str, db_session):
        self.user_id = user_id
        self.db = db_session
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0.7)
        self.memory = ConversationMemory(user_id, db_session)
        self.tools = get_agent_tools(user_id, db_session)
        
    async def create_agent(self):
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ])
        
        agent = create_openai_tools_agent(self.llm, self.tools, prompt)
        return AgentExecutor(agent=agent, tools=self.tools, verbose=True)
    
    async def chat(self, message: str) -> str:
        # Load conversation history
        history = await self.memory.get_history()
        
        # Create and run agent
        agent_executor = await self.create_agent()
        result = await agent_executor.ainvoke({
            "input": message,
            "chat_history": history
        })
        
        # Save to memory
        await self.memory.add_message("user", message)
        await self.memory.add_message("assistant", result["output"])
        
        return result["output"]
```

### 2.3 Agent Tools

```python
# app/ai/tools.py
from langchain.tools import tool
from langchain_core.tools import StructuredTool

def get_agent_tools(user_id: str, db):
    
    @tool
    async def get_user_profile() -> dict:
        """Get the user's fitness profile including goals, level, and preferences."""
        # Fetch from database
        pass
    
    @tool
    async def get_todays_workout() -> dict:
        """Get the user's workout plan for today."""
        pass
    
    @tool
    async def log_exercise_completion(exercise_id: str, feedback: str) -> str:
        """Log that an exercise was completed and record user feedback (too-easy, just-right, too-hard)."""
        pass
    
    @tool
    async def update_exercise_difficulty(exercise_name: str, adjustment: str) -> str:
        """Adjust exercise difficulty based on user feedback. Adjustment: 'increase' or 'decrease'."""
        pass
    
    @tool
    async def get_progress_stats(period: str = "week") -> dict:
        """Get user's progress statistics for the specified period (week, month, all-time)."""
        pass
    
    @tool
    async def award_xp(amount: int, reason: str) -> str:
        """Award XP points to the user for completing actions."""
        pass
    
    @tool
    async def get_streak_info() -> dict:
        """Get the user's current streak and streak history."""
        pass
    
    @tool
    async def modify_workout_plan(modifications: dict) -> str:
        """Modify the user's workout plan based on feedback or conditions."""
        pass
    
    return [
        get_user_profile,
        get_todays_workout,
        log_exercise_completion,
        update_exercise_difficulty,
        get_progress_stats,
        award_xp,
        get_streak_info,
        modify_workout_plan
    ]
```

---

## Phase 3: Gamification System

### 3.1 XP & Leveling Service

```python
# app/services/gamification_service.py
from datetime import date, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.gamification import Gamification, UserAchievement

# Level thresholds
LEVEL_THRESHOLDS = {
    1: 0, 2: 100, 3: 250, 4: 450, 5: 700,
    6: 1000, 7: 1400, 8: 1900, 9: 2500, 10: 3200,
    # ... continues
}

TITLES = {
    (1, 5): "Rookie",
    (6, 10): "Warrior", 
    (11, 20): "Champion",
    (21, 30): "Elite",
    (31, 100): "Legend"
}

XP_REWARDS = {
    "exercise_complete": 10,
    "workout_complete": 50,
    "daily_checkin": 20,
    "streak_7": 100,
    "streak_30": 500,
    "first_workout": 100,
    "goal_milestone_25": 50,
    "goal_milestone_50": 100,
    "goal_complete": 200,
    "personal_record": 75
}

class GamificationService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def award_xp(self, user_id: str, action: str, multiplier: float = 1.0):
        """Award XP and check for level up."""
        base_xp = XP_REWARDS.get(action, 0)
        xp_to_add = int(base_xp * multiplier)
        
        gami = await self.get_or_create(user_id)
        old_level = gami.level
        gami.xp += xp_to_add
        gami.weekly_xp += xp_to_add
        gami.monthly_xp += xp_to_add
        
        # Check level up
        new_level = self.calculate_level(gami.xp)
        if new_level > old_level:
            gami.level = new_level
            gami.title = self.get_title(new_level)
            await self.check_level_achievements(user_id, new_level)
        
        await self.db.commit()
        return {"xp_added": xp_to_add, "new_total": gami.xp, "level_up": new_level > old_level}
    
    async def update_streak(self, user_id: str):
        """Update daily streak."""
        gami = await self.get_or_create(user_id)
        today = date.today()
        
        if gami.last_activity_date == today:
            return  # Already active today
        
        yesterday = today - timedelta(days=1)
        if gami.last_activity_date == yesterday:
            gami.current_streak += 1
            gami.longest_streak = max(gami.current_streak, gami.longest_streak)
        else:
            gami.current_streak = 1
        
        gami.last_activity_date = today
        
        # Check streak achievements
        await self.check_streak_achievements(user_id, gami.current_streak)
        await self.db.commit()
```

### 3.2 Achievement System

```python
# Achievement definitions
ACHIEVEMENTS = [
    {"id": "first_steps", "name": "First Steps", "desc": "Complete your first workout", 
     "icon": "🏃", "xp": 100, "rarity": "common", "type": "workout_count", "value": 1},
    {"id": "on_fire", "name": "On Fire", "desc": "7-day workout streak",
     "icon": "🔥", "xp": 100, "rarity": "rare", "type": "streak", "value": 7},
    {"id": "iron_will", "name": "Iron Will", "desc": "30-day workout streak",
     "icon": "💪", "xp": 500, "rarity": "epic", "type": "streak", "value": 30},
    {"id": "century_club", "name": "Century Club", "desc": "Complete 100 workouts",
     "icon": "🏆", "xp": 300, "rarity": "epic", "type": "workout_count", "value": 100},
    {"id": "early_bird", "name": "Early Bird", "desc": "10 morning workouts",
     "icon": "⚡", "xp": 75, "rarity": "rare", "type": "morning_workouts", "value": 10},
    {"id": "goal_getter", "name": "Goal Getter", "desc": "Complete a goal",
     "icon": "🎯", "xp": 150, "rarity": "rare", "type": "goals_completed", "value": 1},
    {"id": "level_10", "name": "Rising Star", "desc": "Reach level 10",
     "icon": "⭐", "xp": 200, "rarity": "rare", "type": "level", "value": 10},
    {"id": "pr_breaker", "name": "Record Breaker", "desc": "Set 10 personal records",
     "icon": "🥇", "xp": 150, "rarity": "rare", "type": "pr_count", "value": 10},
]
```

---

## Phase 4: Analytics & Insights

### 4.1 Weekly Report Generation

```python
# app/services/analytics_service.py
from datetime import date, timedelta
from sqlalchemy import select, func
from app.ai.llm import get_llm

class AnalyticsService:
    async def generate_weekly_report(self, user_id: str) -> dict:
        week_start = date.today() - timedelta(days=7)
        
        # Gather stats
        stats = {
            "workouts": await self.get_workout_stats(user_id, week_start),
            "calories": await self.get_calorie_stats(user_id, week_start),
            "streak": await self.get_streak_info(user_id),
            "goals": await self.get_goals_progress(user_id),
            "prs": await self.get_new_prs(user_id, week_start),
            "muscle_groups": await self.get_muscle_distribution(user_id, week_start),
            "comparison": await self.compare_to_previous(user_id, "week")
        }
        
        # Generate AI insights
        llm = get_llm()
        insights = await llm.generate_weekly_summary(stats)
        
        return {
            "period": {"start": week_start, "end": date.today()},
            "stats": stats,
            "ai_insights": insights,
            "recommendations": insights.get("recommendations", [])
        }
```

---

## Phase 5: Voice Integration

### 5.1 Voice Processing

```python
# app/ai/voice.py
import openai
from openai import OpenAI

class VoiceService:
    def __init__(self):
        self.client = OpenAI()
    
    async def speech_to_text(self, audio_file) -> str:
        """Convert speech to text using Whisper."""
        transcript = self.client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language="en"
        )
        return transcript.text
    
    async def text_to_speech(self, text: str) -> bytes:
        """Convert text to speech using OpenAI TTS."""
        response = self.client.audio.speech.create(
            model="tts-1",
            voice="nova",  # Options: alloy, echo, fable, onyx, nova, shimmer
            input=text
        )
        return response.content
```

---

## Phase 6: Frontend (Next.js)

### 6.1 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Landing page
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── verify/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Dashboard shell
│   │   ├── page.tsx                # Dashboard home
│   │   ├── workout/
│   │   │   ├── page.tsx            # Today's workout
│   │   │   └── [id]/page.tsx       # Active workout
│   │   ├── diet/page.tsx
│   │   ├── progress/page.tsx
│   │   ├── goals/page.tsx
│   │   ├── chat/page.tsx           # AI Coach
│   │   ├── profile/page.tsx
│   │   └── leaderboard/page.tsx
│   └── onboarding/page.tsx
├── components/
│   ├── ui/                         # shadcn components
│   ├── workout/
│   ├── gamification/
│   ├── chat/
│   └── charts/
├── hooks/
│   ├── useAuth.ts
│   ├── useVoice.ts
│   └── useGamification.ts
├── lib/
│   ├── api.ts
│   └── utils.ts
└── styles/globals.css
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL                                │
│                    Frontend (Next.js)                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    RAILWAY / RENDER                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              FastAPI Application                        │ │
│  │         (Uvicorn + Gunicorn workers)                   │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Celery Workers                             │ │
│  │         (Background job processing)                    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                     MANAGED SERVICES                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  PostgreSQL  │  │    Redis     │  │   Cloudinary     │  │
│  │  (Supabase/  │  │   (Upstash)  │  │  (Media storage) │  │
│  │   Neon)      │  │              │  │                  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Timeline Estimate

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | 1 week | Project setup, DB schema, basic FastAPI structure |
| Phase 2 | 2 weeks | Core backend (auth, workouts, diet, onboarding) |
| Phase 3 | 1 week | Gamification system |
| Phase 4 | 1 week | AI Agent with LangChain |
| Phase 5 | 1 week | Analytics & reports |
| Phase 6 | 1 week | Voice integration |
| Phase 7 | 2 weeks | Frontend development |
| Phase 8 | 1 week | Testing & polish |
| Phase 9 | 1 week | Deployment |

**Total: ~11 weeks** for a production-ready application
