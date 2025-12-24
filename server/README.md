# Backend Server

Node.js/Express backend server for Small Business Web.

## Dependencies

- **express** - Web framework
- **multer** - File upload middleware
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing
- **mongoose** - MongoDB object modeling
- **jsonwebtoken** - JWT token generation
- **bcryptjs** - Password hashing
- **passport** - Authentication middleware
- **passport-google-oauth20** - Google OAuth strategy
- **passport-jwt** - JWT strategy for Passport

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### General
- `GET /` - Server status
- `GET /api/health` - Health check

### File Upload
- `POST /api/upload` - Single file upload
- `POST /api/upload/multiple` - Multiple file upload

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user (Protected)

### Business (Protected)
- `POST /api/businesses` - Create business with photos (requires authentication)
- `GET /api/businesses` - Get all businesses
- `GET /api/businesses/:id` - Get business by ID

### Example CRUD (Mongoose)
- `POST /api/examples` - Create example
- `GET /api/examples` - Get all examples
- `GET /api/examples/:id` - Get example by ID
- `PUT /api/examples/:id` - Update example
- `DELETE /api/examples/:id` - Delete example

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string (default: mongodb://localhost:27017/smallbusinessweb)
- `JWT_SECRET` - Secret key for JWT tokens (required for production)
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `GOOGLE_CALLBACK_URL` - Google OAuth callback URL (default: /api/auth/google/callback)
- `FRONTEND_URL` - Frontend URL for OAuth redirects (default: http://localhost:5173)

