# 🛕 Temple ERP - Enterprise Resource Planning System

A comprehensive full-stack web application for managing temple operations, built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [License](#license)

## ✨ Features

### 👤 Devotee (User) Features
- **Authentication** - Register, login, and profile management with profile picture upload
- **Darshan Passes** - Book darshan passes with Aadhar card verification and QR code generation
- **Room Bookings** - Book temple accommodation rooms with date selection
- **Donations** - Make online donations to the temple
- **Restaurant Orders** - Order food from temple restaurant/annakshetra
- **Events & Festivals** - View upcoming temple events and festivals
- **News & Updates** - Stay informed with latest temple news
- **Notifications** - Receive booking confirmations and temple announcements
- **Dashboard** - Personal dashboard with pass, booking, and donation history
- **Profile Management** - Update personal details and profile picture

### 🔧 Admin Features
- **Admin Dashboard** - Overview with statistics and analytics
- **User Management** - Manage devotee accounts and admin users
- **Pass Management** - View and manage all darshan passes
- **Booking Management** - Manage room bookings and reservations
- **Donation Tracking** - View and manage all donations
- **Restaurant Management** - Manage menu items and orders
- **Devotee Management** - View and manage devotee database
- **Festival Management** - Create and manage festival information
- **Reports** - Generate financial and operational reports
- **Content Management** - Manage news, events, and notifications

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **Lottie React** - Animations
- **CSS** - Custom styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Validator** - Input validation

## 📁 Project Structure

```
Temple ERP System/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/             # Route controllers
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── bookingController.js
│   │   │   ├── contentController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── donationController.js
│   │   │   ├── passController.js
│   │   │   └── restaurantController.js
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT authentication
│   │   │   └── upload.js            # Multer file upload
│   │   ├── models/                  # MongoDB schemas
│   │   │   ├── User.js
│   │   │   ├── DarshanPass.js
│   │   │   ├── Donation.js
│   │   │   ├── Room.js
│   │   │   ├── RoomBooking.js
│   │   │   ├── RestaurantMenu.js
│   │   │   ├── RestaurantOrder.js
│   │   │   ├── Festival.js
│   │   │   ├── Event.js
│   │   │   ├── News.js
│   │   │   ├── Notification.js
│   │   │   ├── PassType.js
│   │   │   ├── TempleUpdate.js
│   │   │   └── index.js
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.js
│   │   │   ├── passes.js
│   │   │   ├── donations.js
│   │   │   ├── bookings.js
│   │   │   ├── restaurant.js
│   │   │   ├── admin.js
│   │   │   ├── dashboard.js
│   │   │   └── content.js
│   │   ├── uploads/                 # Uploaded files
│   │   │   ├── passes/              # Aadhar cards
│   │   │   └── profile/             # Profile pictures
│   │   └── server.js                # Entry point
│   ├── .env                         # Environment variables
│   └── package.json
│
├── frontend/
│   ├── public/                      # Static assets
│   │   ├── assets/images/           # Temple images
│   │   ├── images/                  # Default avatars
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   └── Navbar.jsx
│   │   ├── context/                 # React context
│   │   │   └── AuthContext.jsx      # Authentication state
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── PassHistory.jsx
│   │   │   ├── PassDetail.jsx
│   │   │   ├── NewPass.jsx
│   │   │   ├── Donations.jsx
│   │   │   ├── RoomBooking.jsx
│   │   │   ├── BookingHistory.jsx
│   │   │   ├── Restaurant.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Festivals.jsx
│   │   │   ├── News.jsx
│   │   │   └── admin/               # Admin pages
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Users.jsx
│   │   │       ├── Passes.jsx
│   │   │       ├── Bookings.jsx
│   │   │       ├── Donations.jsx
│   │   │       ├── Restaurant.jsx
│   │   │       ├── Devotees.jsx
│   │   │       ├── Reports.jsx
│   │   │       └── Festivals.jsx
│   │   ├── services/
│   │   │   └── api.js               # Axios API calls
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── .env                         # Environment variables
│   ├── vite.config.js
│   └── package.json
│
├── HOW_TO_RUN.txt
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/suyog-shirsat2004/Temple-ERP-Enterprise-Resource-Planning-System.git
   cd Temple-ERP-Enterprise-Resource-Planning-System
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables**

   Create `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/temple_erp
   JWT_SECRET=your_super_secret_jwt_key_here
   FRONTEND_URL=http://localhost:5173
   ```

   Create `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB**
   - Local: Start MongoDB service
   - Atlas: Use your MongoDB Atlas connection string in `MONGODB_URI`

6. **Run the Application**

   **Terminal 1 (Backend):**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

   **Terminal 2 (Frontend):**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

7. **Access the Application**
   - Open browser: `http://localhost:5173`
   - **Admin Login:**
     - Email: `suyogshirsat2004@gmail.com`
     - Password: `suyog2004`

### Build for Production

```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd backend
npm start
```

## 🔑 Environment Variables

### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/temple_erp` |
| `JWT_SECRET` | Secret key for JWT tokens | - |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get current user

### Darshan Passes
- `GET /api/passes` - Get user's passes
- `POST /api/passes` - Create new pass
- `GET /api/passes/:id` - Get pass details
- `POST /api/passes/:id/cancel` - Cancel pass

### Donations
- `GET /api/donations` - Get user's donations
- `POST /api/donations` - Create donation

### Bookings
- `GET /api/bookings/rooms` - Get available rooms
- `POST /api/bookings` - Create room booking
- `GET /api/bookings/history` - Get booking history

### Restaurant
- `GET /api/restaurant/menu` - Get menu items
- `POST /api/restaurant/orders` - Create order
- `GET /api/restaurant/orders` - Get user's orders

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/passes` - Get all passes
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/donations` - Get all donations
- `GET /api/admin/devotees` - Get devotee list
- `POST /api/admin/users` - Create admin user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Content
- `GET /api/content/festivals` - Get festivals
- `GET /api/content/events` - Get events
- `GET /api/content/news` - Get news
- `GET /api/content/notifications` - Get notifications

## 👥 User Roles

### Devotee (User)
- Book darshan passes
- Make donations
- Book rooms
- Order food
- View events and festivals
- Manage profile

### Admin
- All user features
- Manage users and devotees
- Manage passes and bookings
- View donations and reports
- Manage restaurant menu
- Manage festivals and content
- View analytics dashboard

## 📸 Screenshots

_Add screenshots of your application here_

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

**Suyog Shirsat** - suyogshirsat2004@gmail.com

Project Link: https://github.com/suyog-shirsat2004/Temple-ERP-Enterprise-Resource-Planning-System
