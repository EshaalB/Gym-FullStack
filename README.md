# Gym Management System - Backend API

A secure, scalable backend API for the Gym Management System with JWT authentication, role-based access control, and organized route structure.

## 🚀 Features

- **JWT Authentication** with access and refresh tokens
- **Role-based Access Control** (Admin, Trainer, Member)
- **Input Validation** and sanitization
- **Rate Limiting** and security headers
- **Organized Route Structure** with modular design
- **Database Utilities** with connection pooling
- **Error Handling** with global error middleware
- **API Documentation** with comprehensive endpoints

## 📋 Prerequisites

- Node.js (>= 14.0.0)
- SQL Server database
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository and navigate to backend:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp env.example .env
   ```

   Edit `.env` file with your database and JWT configuration:

   ```env
   # Database Configuration
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_SERVER=your_db_server
   DB_DATABASE=your_db_name
   DB_INSTANCE=your_db_instance
   DB_PORT=1433

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_make_it_long_and_random

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server:**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management routes
│   ├── attendance.js        # Attendance management routes
│   └── payments.js          # Payment processing routes
├── utils/
│   ├── database.js          # Database utilities
│   └── validation.js        # Input validation utilities
├── server.js                # Main server file
├── package.json
└── README.md
```

## 🔐 Authentication

### JWT Token Structure

- **Access Token**: 15 minutes expiry
- **Refresh Token**: 7 days expiry
- **Token Payload**: `{ userId, email, userRole }`

### Authentication Flow

1. **Login**: POST `/api/auth/login`
2. **Token Refresh**: POST `/api/auth/refresh`
3. **Logout**: POST `/api/auth/logout`

### Protected Routes

All protected routes require the `Authorization` header:

```
Authorization: Bearer <access_token>
```

## 📚 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint           | Description          | Access        |
| ------ | ------------------ | -------------------- | ------------- |
| POST   | `/login`           | User login           | Public        |
| POST   | `/signup`          | User registration    | Public        |
| POST   | `/refresh`         | Refresh access token | Public        |
| POST   | `/logout`          | User logout          | Authenticated |
| GET    | `/profile`         | Get user profile     | Authenticated |
| PUT    | `/change-password` | Change password      | Authenticated |

### User Management Routes (`/api/users`)

| Method | Endpoint          | Description              | Access    |
| ------ | ----------------- | ------------------------ | --------- |
| GET    | `/`               | Get all users            | Admin     |
| GET    | `/:userId`        | Get user by ID           | Admin/Own |
| PUT    | `/:userId`        | Update user profile      | Admin/Own |
| PATCH  | `/:userId/status` | Activate/deactivate user | Admin     |
| GET    | `/stats/overview` | User statistics          | Admin     |
| GET    | `/search`         | Search users             | Admin     |

### Attendance Routes (`/api/attendance`)

| Method | Endpoint            | Description           | Access            |
| ------ | ------------------- | --------------------- | ----------------- |
| POST   | `/mark`             | Mark attendance       | Trainer/Admin     |
| GET    | `/class/:classId`   | Get class attendance  | Trainer/Admin     |
| GET    | `/member/:memberId` | Get member attendance | Admin/Trainer/Own |
| GET    | `/stats/overview`   | Attendance statistics | Admin             |
| PUT    | `/:attendanceId`    | Update attendance     | Trainer/Admin     |
| GET    | `/report`           | Attendance report     | Admin             |

### Payment Routes (`/api/payments`)

| Method | Endpoint             | Description           | Access        |
| ------ | -------------------- | --------------------- | ------------- |
| GET    | `/revenue-by-type`   | Revenue by type       | Admin         |
| GET    | `/monthly-revenue`   | Monthly revenue       | Admin         |
| POST   | `/process`           | Process payment       | Admin/Trainer |
| GET    | `/pending`           | Get pending payments  | Admin         |
| GET    | `/user/:userId`      | Get user payments     | Admin/Own     |
| PATCH  | `/:paymentId/status` | Update payment status | Admin         |
| GET    | `/stats/overview`    | Payment statistics    | Admin         |

## 🔒 Security Features

- **Helmet.js**: Security headers
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend origin
- **Input Validation**: Express-validator middleware
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Token Rotation**: Refresh token mechanism
- **SQL Injection Prevention**: Parameterized queries

## 🎯 Role-Based Access Control

### Admin

- Full access to all endpoints
- User management
- System statistics
- Payment processing

### Trainer

- Attendance management
- Payment processing
- View assigned classes
- Member progress tracking

### Member

- View own profile
- View own attendance
- View own payments
- Limited access to personal data

## 🚨 Error Handling

The API uses standardized error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

Common HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## 🔧 Development

### Running in Development Mode

```bash
npm run dev
```

### Environment Variables

- `NODE_ENV`: Set to `development` for detailed logging
- `PORT`: Server port (default: 3000)
- `FRONTEND_URL`: Frontend URL for CORS

### Database Connection

The system uses connection pooling for optimal performance. Database utilities are centralized in `utils/database.js`.

## 📊 Health Check

Check server status:

```bash
GET /health
```

Response:

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Update documentation
5. Test thoroughly

## 📝 License

This project is licensed under the ISC License.
