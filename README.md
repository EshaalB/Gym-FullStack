# 🏋️ Gym Management System

A comprehensive full-stack gym management application built with React, Node.js, and SQL Server.

## ✨ Features

### 🔐 Authentication & Authorization

- **JWT-based authentication** with bcrypt password hashing
- **Role-based access control** (Admin, Trainer, Member)
- **Protected routes** with middleware authentication

### 👥 User Management

- **Member registration** and profile management
- **Trainer profiles** with specializations
- **Admin dashboard** with comprehensive user analytics

### 🏃‍♂️ Class Management

- **Class scheduling** and capacity management
- **Trainer assignment** to classes with workload constraints
- **Member enrollment** with automatic conflict checking
- **Attendance tracking** with digital marking system

### 📊 Analytics & Reporting

- **Real-time dashboard** with member analytics
- **Attendance reports** and participation tracking
- **Revenue analytics** and payment processing
- **Class performance** metrics

### 💰 Membership & Payments

- **Flexible membership plans** with different durations
- **Payment processing** and transaction history
- **Automated renewals** and expiration notifications

### 🍽️ Additional Features

- **Meal plan management** for nutritional guidance
- **Support system** with ticketing
- **Message center** for communication
- **BMI calculator** for health tracking

## 🚀 Recent Updates

### New Features Added:

1. **✅ Trainer Assignment to Classes**

   - Admin can assign trainers to classes with workload management
   - Automatic validation of trainer availability
   - Real-time updates in class listings

2. **✅ Enhanced JWT Authentication**

   - Proper password hashing with bcrypt
   - Secure token-based authentication
   - Session management with expiration

3. **✅ Comprehensive Logging System**

   - Structured logging with file output
   - API request/response tracking
   - Error monitoring and debugging
   - Performance metrics

4. **✅ Improved UI/UX Consistency**
   - Full-screen dashboards with consistent layouts
   - Standardized button sizes and interactions
   - Neutral footer colors for better balance
   - Mobile-responsive design improvements

## 🛠️ Tech Stack

### Frontend

- **React 18** with Hooks and Context API
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hot Toast** for notifications

### Backend

- **Node.js** with Express framework
- **SQL Server** with stored procedures
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **SQL Server** (2019 or higher)
- **npm** or **yarn**

## ⚙️ Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd gym-management-system
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd backend
npm install
\`\`\`

### 3. Database Configuration

Create a \`.env\` file in the backend directory:

\`\`\`env

# Database Configuration

DB_SERVER=localhost
DB_DATABASE=GymManagement
DB_USER=your_username
DB_PASSWORD=your_password
DB_PORT=1433
DB_INSTANCE=

# JWT Configuration

JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRES_IN=7d

# Server Configuration

PORT=3500
NODE_ENV=development
LOG_LEVEL=INFO

# CORS Configuration

FRONTEND_URL=http://localhost:5173
\`\`\`

### 4. Database Setup

\`\`\`bash

# Run the schema creation script

sqlcmd -S localhost -d GymManagement -i schema.sql

# Run the stored procedures

sqlcmd -S localhost -d GymManagement -i schemaQueries.sql

# Populate with sample data

node populateData.js

# Hash existing passwords for security

node updatePasswords.js
\`\`\`

### 5. Frontend Setup

\`\`\`bash
cd ../frontend
npm install
\`\`\`

## 🚀 Running the Application

### Start Backend Server

\`\`\`bash
cd backend
npm start
\`\`\`
Server will run on: \`http://localhost:3500\`

### Start Frontend Development Server

\`\`\`bash
cd frontend
npm run dev
\`\`\`
Frontend will run on: \`http://localhost:5173\`

## 👤 Default Login Credentials

### Admin Account

- **Email:** admin@gym.com
- **Password:** adminpass

### Trainer Accounts

- **Email:** trainer1@gym.com | **Password:** trainerpass1
- **Email:** trainer2@gym.com | **Password:** trainerpass2

### Member Accounts

- Multiple member accounts are available with emails following the pattern: \`member{X}@gym.com\`
- **Password:** memberpass{X} (where X is the member number)

## 📁 Project Structure

\`\`\`
gym-management-system/
├── backend/ # Node.js backend
│ ├── controllers/ # Business logic controllers
│ ├── middleware/ # Authentication & logging middleware
│ ├── routes/ # API route definitions  
│ ├── utils/ # Database & utility functions
│ ├── logs/ # Application logs (auto-generated)
│ ├── schema.sql # Database schema
│ ├── schemaQueries.sql # Stored procedures
│ └── server.js # Main server file
├── frontend/ # React frontend
│ ├── src/
│ │ ├── components/ # Reusable React components
│ │ ├── pages/ # Page components
│ │ ├── store/ # Redux store configuration
│ │ └── utils/ # Frontend utilities
│ └── public/ # Static assets
└── README.md # Project documentation
\`\`\`

## 🔧 API Endpoints

### Authentication

- \`POST /api/auth/login\` - User login
- \`POST /api/auth/signup\` - User registration

### Users

- \`GET /api/users\` - Get all users (Admin only)
- \`GET /api/users/dashboard-analytics\` - Dashboard analytics

### Classes

- \`GET /api/classes\` - Get all classes
- \`POST /api/classes\` - Create new class (Admin only)
- \`POST /api/classes/assign-member\` - Assign member to class
- \`POST /api/classes/assign-trainer\` - Assign trainer to class (Admin only)

### Attendance

- \`POST /api/attendance/mark\` - Mark attendance
- \`GET /api/attendance/calendar/:userId\` - Get attendance calendar

## 🔒 Security Features

- **Password Hashing:** bcrypt with salt rounds
- **JWT Tokens:** Secure authentication with expiration
- **Role-based Access:** Different permissions for Admin/Trainer/Member
- **Request Validation:** Input sanitization and validation
- **Rate Limiting:** Protection against brute force attacks
- **CORS Configuration:** Controlled cross-origin requests

## 📊 Logging & Monitoring

The application includes comprehensive logging:

- **API Requests/Responses:** All HTTP traffic logged
- **Authentication Events:** Login/logout tracking
- **Database Operations:** Query performance monitoring
- **Error Tracking:** Detailed error logs with stack traces
- **Business Logic:** Important business operations logged

Logs are stored in \`backend/logs/\` directory:

- \`error.log\` - Error-level messages
- \`general.log\` - All application logs
- \`debug.log\` - Debug-level information

## 🧪 Testing

\`\`\`bash

# Run frontend tests

cd frontend
npm test

# Run backend tests

cd backend
npm test
\`\`\`

## 🚀 Deployment

### Production Environment Variables

Ensure these are set in production:

- \`NODE_ENV=production\`
- \`LOG_LEVEL=WARN\`
- Strong \`JWT_SECRET\`
- Proper database credentials

### Build for Production

\`\`\`bash
cd frontend
npm run build
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ by the Gym Management System Team**
