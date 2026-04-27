# JWT Authentication Setup Guide

## Backend Setup

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Create .env File
Copy `.env.example` to `.env` and fill in your database URL:

```env
DATABASE_URL=postgresql://username:password@host:port/database
PORT=5000
JWT_SECRET=your_super_secret_key_here_change_in_production
NODE_ENV=development
```

**For Neon Database**, your URL will look like:
```
postgresql://user:password@ep-xxxx.region.neon.tech/dbname?sslmode=require
```

### 3. Start the Backend
```bash
npm run dev
```

Expected output:
```
✅ Connected to Neon database successfully
✅ Users table ready
✅ Jobs table ready
✅ Candidates table ready
✅ CandidateStatus table ready
✅ Interviews table ready
✅ Demo users initialized
🚀 Server is running on port 5000
```

### 4. Create Demo Users (Optional)
If you want to manually create demo users:
```bash
npm run seed
```

This will create the following demo accounts:
- **Admin**: admin@nexhire.com / nexhire123
- **HR**: hr@nexhire.com / nexhire123
- **Vendor**: vendor@nexhire.com / nexhire123
- **Manager**: manager@nexhire.com / nexhire123

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd Frontend
npm install
```

### 2. Start the Frontend
```bash
npm run dev
```

Expected output:
```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:5173/
```

---

## Login Flow

### 1. Open Login Page
- Navigate to: **http://localhost:5173**

### 2. Two Ways to Login

#### Method 1: Direct Login
1. Enter email and password
2. Click "Sign in" button

#### Method 2: Demo Button
1. Click one of the demo buttons (Admin, HR, Vendor, Manager)
2. This fills in the form automatically
3. Click "Sign in" button

### 3. What Happens Behind the Scenes

1. **Frontend sends**:
   ```json
   {
     "email": "admin@nexhire.com",
     "password": "nexhire123"
   }
   ```

2. **Backend responds** (if successful):
   ```json
   {
     "success": true,
     "message": "Login successful",
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": 1,
       "full_name": "Sahil Dobaria",
       "email": "admin@nexhire.com",
       "role": "admin",
       "phone": "+91 9876543210",
       "is_active": true
     }
   }
   ```

3. **Frontend saves to localStorage**:
   - `authToken`: JWT token for API calls
   - `user`: User object as JSON
   - `demoUser`: User's full name
   - `demoRole`: User's role
   - `email`: User's email

4. **Frontend redirects** based on role:
   - Admin → `/dashboard`
   - HR → `/hr-dashboard`
   - Vendor → `/vendor-dashboard`
   - Manager → `/manager-dashboard`

---

## API Testing

### Test Login via cURL

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@nexhire.com",
    "password": "nexhire123"
  }'
```

### Test Protected Route (Get Current User)

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with the actual token from login response.

---

## Troubleshooting

### Error: "Connection error. Please check if the backend is running..."
- ✅ Ensure backend is running: `npm run dev` in Backend folder
- ✅ Check backend is on port 5000
- ✅ Verify CORS is enabled
- ✅ Check browser console for exact error

### Error: "Invalid email or password"
- ✅ Verify email exists in database
- ✅ Check password is correct (default: "nexhire123")
- ✅ Verify user is active (is_active = true)

### Error: "Table doesn't exist"
- ✅ Backend will auto-create tables on startup
- ✅ Check database connection in .env
- ✅ Verify DATABASE_URL is correct

### Demo users not created
- ✅ Run: `npm run seed` in Backend folder
- ✅ Check for errors in console
- ✅ Verify database connection

---

## File Changes Made

### Backend
- ✅ Created: `controllers/authController.js` - Login/Register logic
- ✅ Created: `routes/authRoutes.js` - Auth endpoints
- ✅ Created: `middleware/authMiddleware.js` - JWT verification
- ✅ Created: `seed.js` - Demo user initialization
- ✅ Updated: `app.js` - Added auth routes and table creation
- ✅ Updated: `package.json` - Added seed script

### Frontend
- ✅ Updated: `pages/common/Login.jsx` - Real API integration
- ✅ localStorage keys: `authToken`, `user`, `demoUser`, `demoRole`, `email`

---

## Next Steps

1. **Test All Roles**
   - Login as each role
   - Verify dashboard loads
   - Check localStorage has token and user data

2. **Update Other Pages**
   - Use `authToken` from localStorage for API calls
   - Add header: `Authorization: Bearer {authToken}`
   - Fetch real data from backend

3. **Production**
   - Change `JWT_SECRET` to a strong random value
   - Update API_BASE_URL to production backend
   - Set `NODE_ENV=production`
   - Use HTTPS

---

## Security Notes

- Never commit `.env` file with real secrets
- Change JWT_SECRET in production
- Tokens expire in 7 days
- Always use HTTPS in production
- Validate input on frontend and backend
- Hash passwords with bcryptjs (10 salt rounds)

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nexhire.com | nexhire123 |
| HR | hr@nexhire.com | nexhire123 |
| Vendor | vendor@nexhire.com | nexhire123 |
| Manager | manager@nexhire.com | nexhire123 |

> ⚠️ Change these passwords in production!

---

For questions or issues, refer to the console logs for detailed error messages.
