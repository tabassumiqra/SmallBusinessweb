# Small Business Web

A modern web application for discovering and connecting with local businesses.

## Project Structure

```
SmallBusinessweb/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── AddBusiness.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── index.js       # Component exports
│   │   ├── config/            # Configuration files
│   │   │   └── api.config.js  # API endpoints & config
│   │   ├── constants/         # Constants & enums
│   │   │   └── index.js       # Categories, validation rules
│   │   ├── context/           # React Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useForm.js
│   │   │   ├── usePhotoUpload.js
│   │   │   ├── useBusinesses.js
│   │   │   └── index.js
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   │   ├── api.service.js
│   │   │   ├── auth.service.js
│   │   │   ├── business.service.js
│   │   │   └── index.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server/                    # Express backend
    ├── config/                # Configuration
    │   ├── db.js              # MongoDB connection
    │   ├── multer.js          # File upload config
    │   ├── passport.js        # Auth strategies
    │   └── index.js           # App config
    ├── controllers/           # Route handlers
    │   ├── authController.js
    │   ├── businessController.js
    │   ├── uploadController.js
    │   ├── exampleController.js
    │   └── index.js
    ├── middleware/            # Express middleware
    │   └── auth.js            # JWT authentication
    ├── models/                # Mongoose models
    │   ├── Business.js
    │   ├── User.js
    │   └── Example.js
    ├── routes/                # API routes
    │   ├── authRoutes.js
    │   ├── businessRoutes.js
    │   ├── uploadRoutes.js
    │   ├── exampleRoutes.js
    │   └── index.js
    ├── utils/                 # Utility functions
    │   ├── jwt.js             # Token generation
    │   ├── formatters.js      # Response formatters
    │   └── index.js
    ├── uploads/               # Uploaded files
    ├── server.js              # Entry point
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SmallBusinessweb
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Create `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/smallbusinessweb
   JWT_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   FRONTEND_URL=http://localhost:5173
   ```

   Create `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### Running the Application

1. **Start the server**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/auth/google` - Google OAuth

### Businesses
- `GET /api/businesses` - Get all businesses
- `GET /api/businesses/:id` - Get business by ID
- `GET /api/businesses/search` - Search businesses
- `POST /api/businesses` - Create business (protected)
- `PUT /api/businesses/:id` - Update business (protected)
- `DELETE /api/businesses/:id` - Delete business (protected)

### Upload
- `POST /api/upload` - Upload single file
- `POST /api/upload/multiple` - Upload multiple files

## Architecture

### Frontend Architecture

- **Services Layer**: Centralized API calls (`services/`)
- **Custom Hooks**: Reusable logic (`hooks/`)
- **Constants**: Shared configuration (`constants/`)
- **Context**: Global state management (`context/`)

### Backend Architecture

- **Controllers**: Business logic separated from routes
- **Routes**: Clean route definitions
- **Middleware**: Reusable middleware (auth, etc.)
- **Utils**: Helper functions (JWT, formatters)
- **Config**: Centralized configuration

## Contributing

1. Follow the existing code structure
2. Add new features in appropriate directories
3. Use the service layer for API calls
4. Create custom hooks for reusable logic
5. Keep components small and focused

## License

MIT
