# Backend Server

Node.js/Express backend server for Small Business Web.

## Dependencies

- **express** - Web framework
- **multer** - File upload middleware
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing
- **mongoose** - MongoDB object modeling

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

