# AfyaSmart - E-Clinic & Triage Platform

![AfyaSmart Logo](https://via.placeholder.com/150x150.png?text=AfyaSmart)

AfyaSmart is a comprehensive MERN stack healthcare platform that provides symptom-based triage assessments, appointment booking, medical records management, and real-time doctor-patient communication. This project aligns with **UN SDG 3: Good Health and Well-Being**.

##  Features

### For Patients
-  **Smart Triage System** - AI-powered symptom assessment with risk level analysis
-  **Appointment Booking** - Schedule consultations with verified doctors
-  **Medical Records** - Secure storage and access to health history
-  **Real-time Chat** - Direct messaging with healthcare professionals
-  **Profile Management** - Manage personal and medical information

### For Doctors
-  **Patient Management** - View and manage patient appointments
-  **Medical Records** - Add prescriptions, diagnoses, and lab results
-  **Triage Review** - Review and provide feedback on patient assessments
-  **Profile Management** - Manage professional credentials and availability

### For Admins
-  **Dashboard Analytics** - View platform statistics and metrics
-  **User Management** - Manage patients and doctors
-  **Doctor Verification** - Verify and approve doctor accounts
-  **System Management** - Monitor and maintain platform health

##  Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Zustand** - State management
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications
- **date-fns** - Date formatting

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Socket.io** - WebSocket communication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

##  Project Structure
```
afyasmart/
├── server/                 # Backend application
│   ├── models/            # Mongoose models
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── .env              # Environment variables
│   ├── package.json      # Backend dependencies
│   └── server.js         # Entry point
│
└── client/               # Frontend application
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── services/     # API services
    │   ├── store/        # State management
    │   ├── App.jsx       # Root component
    │   └── main.jsx      # Entry point
    ├── public/           # Static assets
    ├── .env              # Environment variables
    ├── package.json      # Frontend dependencies
    └── vite.config.js    # Vite configuration
```

##  Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (Local or MongoDB Atlas) - [Download](https://www.mongodb.com/)
- **npm** or **yarn** package manager

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/afyasmart.git
cd afyasmart
```

#### 2. Setup Backend
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
nano .env
```

**Backend .env Configuration:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/afyasmart
JWT_ACCESS_SECRET=your_super_secret_access_key_change_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_in_production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLIENT_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 3. Setup Frontend
```bash
# Navigate to client directory (from root)
cd ../client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
nano .env
```

**Frontend .env Configuration:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

#### 4. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```

#### 5. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **API Health Check:** http://localhost:5000/health

##  API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update user profile |
| PUT | `/api/auth/change-password` | Change password |

### Triage Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/triage` | Create triage assessment |
| GET | `/api/triage/my-triages` | Get user's triages |
| GET | `/api/triage/:id` | Get triage by ID |
| GET | `/api/triage/all` | Get all triages (doctor/admin) |
| PUT | `/api/triage/:id/review` | Review triage (doctor) |
| GET | `/api/triage/stats` | Get triage statistics |

### Appointment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments` | Create appointment |
| GET | `/api/appointments/my-appointments` | Get user's appointments |
| GET | `/api/appointments/doctors` | Get available doctors |
| PUT | `/api/appointments/:id/status` | Update appointment status |
| PUT | `/api/appointments/:id/prescription` | Add prescription (doctor) |

### Medical Records Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/records` | Create medical record (doctor) |
| GET | `/api/records/my-records` | Get user's records |
| GET | `/api/records/patient/:patientId` | Get patient records |
| GET | `/api/records/:id` | Get record by ID |
| PUT | `/api/records/:id` | Update record (doctor) |

### Chat Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/start` | Start new chat |
| GET | `/api/chat` | Get user's chats |
| GET | `/api/chat/:chatId/messages` | Get chat messages |
| POST | `/api/chat/:chatId/messages` | Send message |

##  Testing

### Test User Accounts

After initial setup, you can create test accounts:

**Patient Account:**
- Email: patient@test.com
- Password: password123
- Role: Patient

**Doctor Account:**
- Email: doctor@test.com
- Password: password123
- Role: Doctor

##  Security Features

- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ JWT-based authentication (Access + Refresh tokens)
- ✅ Rate limiting on API endpoints
- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ Input validation and sanitization
- ✅ MongoDB injection prevention
- ✅ XSS protection

##  Deployment

### Deploy to Render

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deployment commands:

**Backend:**
```bash
npm install
npm start
```

**Frontend:**
```bash
npm install
npm run build
```

##  Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Your Name** - Full Stack Developer - [GitHub](https://github.com/yourusername)

##  Acknowledgments

- Built as part of SDG 3: Good Health and Well-Being initiative
- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from modern healthcare platforms

##  Contact

For questions or support, please contact:
- Email: support@afyasmart.com
- Website: https://afyasmart.com
- GitHub Issues: https://github.com/yourusername/afyasmart/issues

##  Known Issues

- Real-time chat UI needs completion
- Email notifications not yet implemented
- Video consultation feature pending

##  Roadmap

- [ ] Complete real-time chat interface
- [ ] Add email notifications
- [ ] Implement payment gateway
- [ ] Add video consultation feature
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] AI-powered symptom checker improvements

##  Project Status

**Current Version:** 1.0.0  
**Status:** Active Development  
**Last Updated:** December 2024

---

Made with  for better healthcare accessibility