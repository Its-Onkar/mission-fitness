# Mission Fitness API Documentation

## Overview

The Mission Fitness API provides endpoints for managing users, fitness profiles, AI-generated plans, and performance tracking. All endpoints require proper authentication unless specified otherwise.

## Base URL

```
Production: https://api.mission-fitness.com
Development: http://localhost:5000
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 5 requests per 15 minutes
- **AI endpoints**: 10 requests per hour

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  },
  "timestamp": "2024-11-28T10:00:00.000Z"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      // Error details
    }
  },
  "timestamp": "2024-11-28T10:00:00.000Z"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Endpoints

### Authentication
- [POST /auth/sign-up](./auth.md#sign-up) - User registration
- [POST /auth/log-in](./auth.md#log-in) - User login
- [GET /auth/verify-email](./auth.md#verify-email) - Email verification
- [POST /auth/forgot-password](./auth.md#forgot-password) - Password reset request
- [POST /auth/reset-password](./auth.md#reset-password) - Password reset

### User Management
- [GET /api/user/profile](./user.md#get-profile) - Get user profile
- [PUT /api/user/profile](./user.md#update-profile) - Update user profile
- [DELETE /api/user/account](./user.md#delete-account) - Delete user account

### Onboarding
- [POST /api/onboarding](./onboarding.md#create-profile) - Create fitness profile
- [GET /api/onboarding/:userId](./onboarding.md#get-profile) - Get fitness profile
- [PUT /api/onboarding/:userId](./onboarding.md#update-profile) - Update fitness profile

### AI Plans
- [POST /api/onboarding/ai-recommendations](./ai-plans.md#generate-plans) - Generate AI plans
- [GET /api/plans/workout](./ai-plans.md#get-workout-plan) - Get workout plan
- [GET /api/plans/diet](./ai-plans.md#get-diet-plan) - Get diet plan

### Performance Tracking
- [POST /api/performance/workout/complete](./performance.md#complete-workout) - Mark workout complete
- [POST /api/performance/diet/complete](./performance.md#complete-diet) - Mark diet complete
- [GET /api/performance/data](./performance.md#get-stats) - Get performance statistics
- [GET /api/performance/streaks](./performance.md#get-streaks) - Get streak information

### Analytics
- [GET /api/analytics/dashboard](./analytics.md#dashboard) - Dashboard analytics
- [GET /api/analytics/progress](./analytics.md#progress) - Progress analytics
- [GET /api/analytics/insights](./analytics.md#insights) - AI insights

## Data Models

### User
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "isVerified": "boolean",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Fitness Profile
```json
{
  "_id": "string",
  "userId": "string",
  "age": "number",
  "gender": "string",
  "height": "number",
  "weight": "number",
  "activityLevel": "string",
  "fitnessGoal": "string",
  "dietaryPreference": "string",
  "workoutPreference": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Workout Plan
```json
{
  "_id": "string",
  "userId": "string",
  "name": "string",
  "description": "string",
  "exercises": [
    {
      "name": "string",
      "sets": "number",
      "reps": "string",
      "duration": "string",
      "instructions": "string"
    }
  ],
  "difficulty": "string",
  "estimatedDuration": "number",
  "createdAt": "date"
}
```

### Diet Plan
```json
{
  "_id": "string",
  "userId": "string",
  "name": "string",
  "description": "string",
  "meals": [
    {
      "type": "string",
      "name": "string",
      "ingredients": ["string"],
      "instructions": "string",
      "calories": "number",
      "macros": {
        "protein": "number",
        "carbs": "number",
        "fat": "number"
      }
    }
  ],
  "totalCalories": "number",
  "createdAt": "date"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `AUTHENTICATION_ERROR` | Authentication failed |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE_ERROR` | Resource already exists |
| `RATE_LIMIT_ERROR` | Rate limit exceeded |
| `AI_SERVICE_ERROR` | AI service unavailable |
| `DATABASE_ERROR` | Database operation failed |
| `EMAIL_ERROR` | Email service error |
| `INTERNAL_ERROR` | Internal server error |

## SDKs and Libraries

### JavaScript/Node.js
```bash
npm install mission-fitness-sdk
```

### Python
```bash
pip install mission-fitness-sdk
```

### cURL Examples

See individual endpoint documentation for detailed cURL examples.

## Webhooks

Mission Fitness supports webhooks for real-time notifications:

- User registration
- Plan completion
- Streak achievements
- Goal milestones

## Changelog

See [API Changelog](./changelog.md) for version history and breaking changes.

## Support

For API support:
- Email: api-support@mission-fitness.com
- Documentation: https://docs.mission-fitness.com
- Status Page: https://status.mission-fitness.com