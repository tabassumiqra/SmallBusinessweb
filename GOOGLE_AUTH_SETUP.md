# Google Authentication Setup Guide

## Problem

Google Sign-In is not working because the Google OAuth credentials are not configured, and there was a race condition in the OAuth callback handling that prevented proper redirection to the add-business page.

## Root Causes

1. **Missing Google OAuth credentials** - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` not set
2. **Incorrect callback URL format** - Was using relative path instead of absolute URL
3. **Google Cloud Console not configured** - OAuth app not set up
4. **Race condition in AuthCallbackPage** - The page was checking authentication status before the token was fully processed, causing premature redirects

## Solution

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose "External" for testing
   - Fill in app name, user support email, and developer contact
   - Add scopes: `email` and `profile`
   - Add test users if needed
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `Small Business Web`
   - **Authorized redirect URIs**: 
     - Development: `http://localhost:5000/api/auth/google/callback`
     - Production: `https://yourdomain.com/api/auth/google/callback`
7. Copy the **Client ID** and **Client Secret**

### Step 2: Configure Environment Variables

Create or update your `server/.env` file with:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/smallbusinessweb

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-actual-google-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Important**: Replace the placeholder values with your actual Google OAuth credentials!

### Step 3: Restart Your Server

After updating the `.env` file, restart your server:

```bash
cd server
npm run dev
```

You should see a warning if Google credentials are missing:
```
⚠️  Google OAuth credentials not configured. Google login will not work.
```

If configured correctly, the warning won't appear.

### Step 4: Test Google Sign-In

1. Open your app in the browser: `http://localhost:5173`
2. Click on "Sign In" or "Continue with Google"
3. You should be redirected to Google's login page
4. After signing in with Google, you'll be redirected back to your app

## Troubleshooting

### Error: "redirect_uri_mismatch"

**Problem**: The redirect URI in your request doesn't match the ones configured in Google Cloud Console.

**Solution**: 
- Ensure the redirect URI in Google Cloud Console exactly matches: `http://localhost:5000/api/auth/google/callback`
- Check that `GOOGLE_CALLBACK_URL` in `.env` matches this URL
- No trailing slashes, exact protocol (http/https), and port number

### Error: "Access blocked: This app's request is invalid"

**Problem**: OAuth consent screen not configured or app not verified.

**Solution**:
- Configure the OAuth consent screen in Google Cloud Console
- Add your email as a test user
- For development, "External" user type is fine

### Error: "invalid_client"

**Problem**: Client ID or Client Secret is incorrect.

**Solution**:
- Double-check your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- Ensure there are no extra spaces or quotes
- Regenerate credentials in Google Cloud Console if needed

### Google login popup doesn't open

**Problem**: Browser blocking popups or incorrect API endpoint.

**Solution**:
- Check browser console for errors
- Ensure `VITE_API_URL` in client is set correctly
- Verify the API endpoint is `http://localhost:5000/api/auth/google`

### User redirected but not logged in

**Problem**: Token not being passed back correctly.

**Solution**:
- Check that `/auth/callback` route exists in your React app
- Verify `FRONTEND_URL` in server `.env` matches your client URL
- Check browser console for errors in `AuthContext.jsx`

## Files Modified

1. `server/config/passport.js` - Added warning for missing credentials, fixed callback URL default
2. `server/config/index.js` - Fixed callback URL default to use absolute URL
3. `client/src/pages/AuthCallbackPage.jsx` - **Fixed race condition** by properly waiting for token processing before checking authentication
4. `client/src/pages/HomePage.jsx` - Made `redirectPath` prop explicit
5. `client/src/pages/AddBusinessPage.jsx` - Made `redirectPath` prop explicit
6. `GOOGLE_AUTH_SETUP.md` - This setup guide

## How the Google OAuth Flow Works

1. User clicks "Continue with Google" button
2. `loginWithGoogle('/add-business')` is called, which:
   - Stores `'/add-business'` in localStorage as `'authRedirect'`
   - Redirects to `/api/auth/google` on the backend
3. Backend redirects to Google OAuth page
4. User authenticates with Google
5. Google redirects back to backend at `/api/auth/google/callback`
6. Backend generates JWT token and redirects to frontend: `http://localhost:5173/auth/callback?token=JWT_TOKEN`
7. `AuthCallbackPage` component:
   - Extracts token from URL
   - `AuthContext` saves token and fetches user data
   - Once authentication is complete, reads `'authRedirect'` from localStorage
   - Navigates to `/add-business`

## Production Deployment

For production, remember to:

1. Use HTTPS URLs for callback URL
2. Update `GOOGLE_CALLBACK_URL` to your production domain
3. Update `FRONTEND_URL` to your production frontend URL
4. Add production callback URL to Google Cloud Console authorized redirect URIs
5. Change `JWT_SECRET` to a strong, random value
6. Set `NODE_ENV=production`

Example production `.env`:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=super-secure-random-string-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
FRONTEND_URL=https://yourdomain.com
```

