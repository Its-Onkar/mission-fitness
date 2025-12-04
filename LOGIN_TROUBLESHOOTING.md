# Login Troubleshooting Guide

## Common Issues and Solutions

### 1. "Invalid username or password" Error

**Possible Causes:**
- No users exist in the database
- Incorrect username/password combination
- Database connection issues
- Password hashing mismatch

**Solutions:**

#### Step 1: Check Database Connection
```bash
# Make sure MongoDB is running
mongod --version
# or
mongo --eval "db.runCommand('ping')"
```

#### Step 2: Run Debug Script
```bash
node debug-login.js
```

#### Step 3: Create Test User (if needed)
```bash
node fix-login.js
```

#### Step 4: Test with Default Credentials
- Username: `testuser`
- Password: `password123`

### 2. Database Issues

**Check MongoDB Connection:**
```javascript
// In your .env file, ensure:
MONGO_URI=mongodb://localhost:27017/mission-fitness
```

**Verify Database Exists:**
```bash
mongo
use mission-fitness
db.users.find()
```

### 3. Password Hashing Issues

The system now uses:
- `bcrypt.hash()` for creating passwords (async)
- `bcrypt.compare()` for verifying passwords (async)
- Case-insensitive username lookup

### 4. Frontend Issues

**Check Browser Console:**
- Open Developer Tools (F12)
- Look for network errors in the Console tab
- Check if the login request is being sent properly

**Verify Token Storage:**
- Check localStorage/sessionStorage for tokens
- Clear browser cache if needed

### 5. Server Issues

**Check Server Logs:**
```bash
npm run dev
# Look for error messages in the console
```

**Common Server Errors:**
- JWT_SECRET not set in environment variables
- MongoDB connection timeout
- Missing dependencies

## Fixed Issues

✅ **Password Comparison**: Changed from sync to async bcrypt.compare()
✅ **Case Sensitivity**: Username lookup is now case-insensitive  
✅ **Error Handling**: Better error messages and status codes
✅ **Input Validation**: Added proper validation for username/password
✅ **User Status Check**: Verify user account is active

## Testing Steps

1. **Run the debug script:**
   ```bash
   node debug-login.js
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```

3. **Test login with:**
   - Username: `testuser`
   - Password: `password123`

4. **Check server logs** for any error messages

5. **Verify in browser** that the login form submits correctly

## Environment Variables Required

```env
MONGO_URI=mongodb://localhost:27017/mission-fitness
JWT_SECRET=your-jwt-secret-key
PORT=5000
```

## Contact Support

If issues persist after following this guide:
1. Check the server console for detailed error logs
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Try creating a new user account through the signup process