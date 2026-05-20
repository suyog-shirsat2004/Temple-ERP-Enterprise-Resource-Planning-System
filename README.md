# 🛕 Temple ERP - Enterprise Resource Planning System

> A comprehensive full-stack MERN application for complete temple management — from darshan passes and room bookings to donations, restaurant orders, and admin analytics.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![MongoDB](https://img.shields.io/badge/DB-MongoDB-47A248?logo=mongodb)
![Express](https://img.shields.io/badge/Backend-Express.js-000000?logo=express)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Runtime-Node.js-339933?logo=node.js)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [How It Works](#how-it-works)
4. [Features](#features)
5. [Tech Stack](#tech-stack)
6. [Database Schema](#database-schema)
7. [API Reference](#api-reference)
8. [Authentication & Security](#authentication--security)
9. [Project Structure](#project-structure)
10. [Getting Started](#getting-started)
11. [Deployment](#deployment)
12. [Screenshots](#screenshots)
13. [Contributing](#contributing)
14. [License](#license)

---

## 🎯 Overview

Temple ERP is a modern, scalable enterprise resource planning system designed specifically for temple management. It digitizes and automates key temple operations including:

- **Devotee Management** — Registration, profiles, activity tracking
- **Darshan Pass System** — Online pass booking with Aadhar verification and QR codes
- **Accommodation Booking** — Room reservation and management
- **Donation Processing** — Online donations with receipt generation
- **Restaurant/Annakshetra** — Menu management and food ordering
- **Events & Festivals** — Calendar management and public display
- **Admin Dashboard** — Real-time analytics, reports, and CRUD operations

The system follows a **client-server architecture** with RESTful API design, JWT-based authentication, and role-based access control.

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │
│  │  Pages   │  │Components│  │  Context │  │   Services   │    │
│  │  (24+)   │  │ (Navbar) │  │ (Auth)   │  │ (api.js)     │    │
│  └────┬─────┘  └──────────┘  └────┬─────┘  └──────┬───────┘    │
│       │                           │               │             │
│       └───────────────────────────┴───────────────┘             │
│                          Axios HTTP                             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                    POST / GET / PUT / DELETE
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                       BACKEND (Express)                          │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Routes  │  │ Controllers  │  │Middleware│  │   Models   │  │
│  │   (8)    │  │     (8)      │  │ (2)      │  │    (13)    │  │
│  └────┬─────┘  └──────┬───────┘  └────┬─────┘  └─────┬──────┘  │
│       │               │               │              │          │
│       └───────────────┴───────────────┴──────────────┘          │
│                    Mongoose ODM                                  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (MongoDB)                          │
│  Collections: Users, DarshanPasses, Donations, Rooms,            │
│  RoomBookings, RestaurantMenu, RestaurantOrders, Festivals,      │
│  Events, News, Notifications, PassTypes, TempleUpdates           │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Action** → React component triggers API call via `api.js` service
2. **HTTP Request** → Axios sends request to Express backend with JWT token
3. **Middleware** → `auth.js` validates token, extracts `userId`
4. **Controller** → Business logic processes request using Mongoose models
5. **Database** → MongoDB performs CRUD operations
6. **Response** → JSON response sent back to frontend
7. **UI Update** → React re-renders with new data

---

## ⚙ How It Works

### 1. Authentication Flow

```
User Registration:
POST /api/auth/register
  → Validates input (name, email, password match)
  → Checks for existing username/email
  → Hashes password with bcrypt (10 rounds)
  → Creates User in MongoDB
  → Returns success with user data

User Login:
POST /api/auth/login
  → Accepts email/username + password
  → Finds user by email OR username
  → Compares password with bcrypt hash
  → Generates JWT token (30 days if remember, else default)
  → Returns token + user profile

JWT Verification (on every protected route):
  → Extracts token from Authorization header
  → Verifies token with JWT_SECRET
  → Attaches userId to req object
  → Proceeds to controller
```

### 2. Darshan Pass Booking Flow

```
1. Devotee selects pass type (General/Special/VIP)
   → GET /api/passes/types → Fetches active pass types with prices

2. Devotee fills booking form:
   → Personal details (name, phone, email, gender, address)
   → Visit details (date, time, number of persons)
   → Uploads Aadhar card (Multer handles file upload)
   → Selects payment method (UPI/Cash)
   → POST /api/passes → Creates pass with:
      - Unique pass_id: DSP + timestamp + random
      - Status: pending
      - Payment: pending (UPI) or paid (Cash)
      - Auto-calculates total = price × persons

3. Admin reviews pass request:
   → GET /api/passes/all → Lists all passes with user details
   → POST /api/passes/:id/approve → Sets status to approved
   → POST /api/passes/:id/reject → Sets status to rejected
   → POST /api/passes/:id/payment-paid → Marks payment received

4. Notification system:
   → Creates notification on pass creation (admin alert)
   → Creates notification on approval/rejection (devotee alert)

5. Devotee views pass:
   → GET /api/passes → Lists user's passes
   → GET /api/passes/:id → View pass details with QR code
   → POST /api/passes/:id/cancel → Cancel pass
```

### 3. Room Booking Flow

```
1. Devotee browses available rooms:
   → GET /api/bookings/rooms → Fetches rooms with status 'available'

2. Devotee books room:
   → Selects room, check-in/check-out dates
   → POST /api/bookings → Creates booking with:
      - Unique booking_id: RMB + timestamp + random
      - Calculates nights = (checkout - checkin) / 24hrs
      - Calculates total = price_per_day × nights
      - Status: Pending

3. Devotee completes payment:
   → POST /api/bookings/payment → Updates:
      - payment_status: Paid
      - booking_status: Confirmed
      - Creates notification

4. Admin manages bookings:
   → GET /api/bookings/all → All bookings with user + room details
   → POST /api/bookings/:id/confirm → Confirm booking
   → POST /api/bookings/:id/cancel-admin → Cancel booking
```

### 4. Donation Processing Flow

```
1. Devotee makes donation:
   → POST /api/donations → Creates donation with:
      - Unique receipt_no: DON + timestamp + random
      - Amount, type (General/Special/etc)
      - Payment method (UPI/Cash/Other)
      - Status: completed
      - Optional message/notes

2. View donation history:
   → GET /api/donations → User's donations + total donated
   → GET /api/donations/receipt/:receiptNo → Specific receipt

3. Admin views all donations:
   → GET /api/donations/all → All donations
   → GET /api/donations/total → Aggregated total (paid only)
```

### 5. Restaurant Order Flow

```
1. Devotee browses menu:
   → GET /api/restaurant/menu → Available items + categories

2. Devotee places order:
   → Selects items with quantities
   → POST /api/restaurant → Creates order with:
      - Unique order_id: ORD + timestamp + random
      - Items array: [{name, price, qty}]
      - total_amount = Σ(price × qty)
      - Status: confirmed, Payment: paid

3. Devotee tracks orders:
   → GET /api/restaurant → User's orders
   → GET /api/restaurant/:orderId → Specific order details

4. Admin manages orders:
   → GET /api/restaurant/all → All orders with user details
   → PUT /api/restaurant/:id/status → Update order status
```

### 6. Admin Dashboard & Analytics

```
GET /api/admin/dashboard → Aggregates:
  - Total counts: users, passes, bookings, donations, orders
  - Pending counts by category
  - Revenue: restaurant revenue + donation amounts
  - Monthly donation trends (MongoDB aggregation)
  - Recent activity (last 5 of each type)

Devotee Management:
  GET /api/admin/devotees → Users with pass count + total spent
  GET /api/admin/devotees/:id → Full profile with all activity

Reports generated via MongoDB aggregation pipelines:
  - Revenue calculations
  - Monthly trends
  - Per-devotee analytics
```

### 7. Content Management (Events, Festivals, News)

```
Public Access:
  GET /api/content/festivals → Upcoming, ongoing, completed
  GET /api/content/events → Categorized by date
  GET /api/content/news → Active news articles

Admin Management:
  POST /api/content/temple-updates → Create update with image upload
  PUT /api/content/temple-updates/:id → Edit update
  DELETE /api/content/temple-updates/:id → Remove update
  PUT /api/content/temple-updates/:id/toggle-status → Activate/deactivate
```

---

## ✨ Features

### 👤 Devotee (User) Portal

| Feature | Description |
|---------|-------------|
| **Registration & Login** | Register with name, email, username. Login with email or username. Remember me option (30-day token). |
| **Password Management** | Reset password via email. Change password with current password verification. |
| **Profile Management** | Update name, email, mobile, address. Upload profile picture (Multer). |
| **Darshan Pass Booking** | Book General/Special/VIP passes. Upload Aadhar card. Select visit date/time. Multiple persons. Payment via UPI or cash. |
| **Room Booking** | Browse available rooms. Select check-in/out dates. Auto-calculate cost. UPI payment. |
| **Donations** | Donate with custom amount. Choose donation type. Receive receipt number. View donation history. |
| **Restaurant Orders** | Browse menu by category. Add items to cart. Place order with UPI payment. Track order status. |
| **Dashboard** | Personal overview: passes, donations, bookings, orders. Activity timeline. Total donation amount. Unread notification count. |
| **Notifications** | Real-time alerts for pass approval, booking confirmation, etc. Mark all as read. Unread count badge. |
| **Events & Festivals** | View upcoming temple events. Festival calendar with images. |
| **News** | Latest temple announcements and updates. |

### 🔧 Admin Panel

| Feature | Description |
|---------|-------------|
| **Admin Login** | Dedicated admin authentication with hardcoded credentials. |
| **Dashboard Analytics** | Total users, passes, bookings, donations, orders. Pending requests. Revenue metrics. Monthly donation trends. Recent activity feeds. |
| **User Management** | View all users. Create new admin users. Update user details (name, email, mobile, status, password). Delete users. |
| **Devotee Management** | Devotee list with pass count and total spent. Detailed devotee profile with complete activity history (passes, bookings, donations, orders). |
| **Pass Management** | View all darshan passes. Approve/reject passes. Mark payments received. Update pass status. Delete single/multiple passes. |
| **Booking Management** | View all room bookings. Confirm or cancel bookings. Room inventory management. |
| **Donation Tracking** | View all donations with donor details. Filter by payment status. Total donation aggregation. |
| **Restaurant Management** | View all orders. Update order status (pending → confirmed → completed). |
| **Festival Management** | Create and manage festival information. |
| **Content Management** | Manage temple updates with image uploads. Toggle active/inactive status. Feature important updates. |
| **Reports** | Revenue breakdown. Monthly donation analytics. Devotee spending reports. |

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.2.0 | UI component library |
| **React Router DOM** | 6.21.1 | Client-side routing with protected routes |
| **Axios** | 1.6.5 | HTTP client for API calls with interceptors |
| **Vite** | 5.0.8 | Build tool, dev server, HMR |
| **Lottie React** | 2.4.1 | JSON-based animations (loading states) |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | Runtime | JavaScript runtime environment |
| **Express.js** | 4.18.2 | Web framework, routing, middleware |
| **MongoDB** | Database | NoSQL document database |
| **Mongoose** | 8.0.3 | ODM, schema validation, queries |
| **JWT** | 9.0.2 | Token-based authentication |
| **bcryptjs** | 2.4.3 | Password hashing (10 salt rounds) |
| **Multer** | 1.4.5 | File upload handling (images) |
| **Helmet** | 7.1.0 | Security headers (XSS, clickjacking, etc) |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **dotenv** | 16.3.1 | Environment variable management |
| **express-validator** | 7.0.1 | Input validation |
| **nodemon** | 3.0.2 | Auto-restart on file changes (dev) |
| **mongodb-memory-server** | 11.1.0 | In-memory MongoDB for testing |

---

## 🗄 Database Schema

### 1. Users
```javascript
{
  name: String (required),
  username: String (unique, sparse),
  email: String (unique, sparse),
  password: String (hashed, required),
  mobile: String,
  address: String,
  gender: String,
  profile_pic: String (filename),
  status: String (default: 'active'),
  role: String (default: 'user'),
  created_at: Date,
  updated_at: Date
}
```

### 2. DarshanPass
```javascript
{
  pass_id: String (unique, format: DSP + timestamp + random),
  user_id: ObjectId → User,
  devotee_name: String (required),
  phone: String,
  email: String,
  gender: String,
  address: String,
  visit_date: Date,
  visit_time: String,
  no_of_persons: Number (default: 1),
  pass_type: String (General/Special/VIP),
  amount: Number (per person),
  total_amount: Number (amount × persons),
  payment_method: String (UPI/Cash),
  transaction_id: String,
  payment_status: String (pending/paid),
  payment_date: Date,
  status: String (pending/approved/rejected/cancelled),
  aadhar_number: String,
  aadhar_card: String (filename),
  special_requests: String,
  created_by: ObjectId → User,
  created_at: Date
}
```

### 3. Donation
```javascript
{
  user_id: ObjectId → User,
  receipt_no: String (unique, format: DON + timestamp + random),
  name: String,
  email: String,
  phone: String,
  amount: Number (required),
  donation_type: String (default: 'General Donation'),
  payment_method: String (default: 'UPI'),
  payment_status: String (default: 'completed'),
  notes: String,
  donation_date: Date,
  created_at: Date
}
```

### 4. Room
```javascript
{
  room_number: String,
  room_name: String,
  room_type: String,
  price_per_day: Number,
  status: String (default: 'available'),
  amenities: String,
  description: String,
  created_at: Date
}
```

### 5. RoomBooking
```javascript
{
  booking_id: String (unique, format: RMB + timestamp + random),
  user_id: ObjectId → User,
  room_id: ObjectId → Room,
  guest_name: String,
  phone: String,
  email: String,
  check_in: Date,
  check_out: Date,
  room_type: String,
  no_of_rooms: Number (default: 1),
  no_of_guests: Number,
  total_amount: Number (price × nights),
  payment_status: String (Pending/Paid),
  booking_status: String (Pending/Confirmed/Cancelled),
  payment_method: String,
  payment_date: Date,
  created_at: Date
}
```

### 6. RestaurantMenu
```javascript
{
  name: String,
  category: String,
  price: Number,
  description: String,
  available: Boolean (default: true),
  created_at: Date
}
```

### 7. RestaurantOrder
```javascript
{
  order_id: String (unique, format: ORD + timestamp + random),
  user_id: ObjectId → User,
  items: [{
    name: String,
    price: Number,
    qty: Number
  }],
  total_amount: Number (Σ price × qty),
  name: String,
  phone: String,
  order_date: Date,
  order_time: String,
  payment_status: String (default: 'paid'),
  payment_method: String (default: 'UPI'),
  status: String (default: 'confirmed'),
  payment_date: Date,
  created_at: Date
}
```

### 8. Festival
```javascript
{
  name: String,
  description: String,
  event_date: Date,
  event_time: String,
  image: String,
  status: String (default: 'active'),
  created_at: Date
}
```

### 9. Event
```javascript
{
  title: String,
  description: String,
  event_date: Date,
  event_time: String,
  image: String,
  status: String (default: 'upcoming'),
  created_at: Date
}
```

### 10. News
```javascript
{
  title: String,
  content: String,
  image: String,
  published_at: Date (default: now),
  status: String (default: 'active'),
  created_at: Date
}
```

### 11. Notification
```javascript
{
  user_id: ObjectId → User,
  title: String,
  message: String,
  type: String (pass/booking/donation/restaurant),
  is_read: Boolean (default: false),
  created_at: Date
}
```

### 12. PassType
```javascript
{
  pass_type: String,
  price: Number (default: 0),
  description: String,
  is_active: Boolean (default: true),
  created_at: Date
}
```

### 13. TempleUpdate
```javascript
{
  title: String,
  description: String,
  short_description: String,
  update_type: String,
  event_date: Date,
  event_end_date: Date,
  image: String (filename),
  is_featured: Boolean (default: false),
  status: String (default: 'active'),
  created_by: ObjectId → User,
  updated_by: ObjectId → User,
  created_at: Date,
  updated_at: Date
}
```

---

## 📡 API Reference

### Base URL
- Development: `http://localhost:5000/api`
- Health Check: `GET /api/health`

### Authentication Endpoints

| Method | Endpoint | Access | Description | Request Body | Response |
|--------|----------|--------|-------------|--------------|----------|
| POST | `/auth/register` | Public | Register new devotee | `{first_name, last_name, username, email, password, password2}` | `{success, message, user}` |
| POST | `/auth/login` | Public | Devotee login | `{username/email, password, remember?}` | `{success, message, token, user}` |
| POST | `/auth/admin/login` | Public | Admin login | `{username, password}` | `{success, message, token, user}` |
| POST | `/auth/reset-password` | Public | Reset password via email | `{email, new_password, confirm_password}` | `{success, message}` |
| POST | `/auth/change-password` | Auth | Change password | `{current_password, new_password, confirm_password}` | `{success, message}` |
| GET | `/auth/profile` | Auth | Get user profile | — | `{success, user}` |
| PUT | `/auth/profile` | Auth | Update profile + upload pic | Multipart: `{name, email, mobile, address, profile_pic}` | `{success, message, user}` |

### Darshan Pass Endpoints

| Method | Endpoint | Access | Description | Request | Response |
|--------|----------|--------|-------------|---------|----------|
| GET | `/passes/types` | Public | Get active pass types | — | `{success, passTypes}` |
| GET | `/passes` | Auth | Get user's passes | — | `{success, passes}` |
| GET | `/passes/all` | Admin | Get all passes | — | `{success, passes}` |
| GET | `/passes/:id` | Public | Get pass by ID | — | `{success, pass}` |
| POST | `/passes` | Auth | Create new pass | Multipart: `{pass_type, payment_method, devotee_name, phone, email, gender, address, visit_date, visit_time, no_of_persons, transaction_id?, aadhar_number?}` + `aadhar_card` file | `{success, message, pass}` |
| POST | `/passes/confirm-payment` | Auth | Confirm UPI payment | `{pass_id}` | `{success, message, transaction_id}` |
| POST | `/passes/:id/cancel` | Auth | Cancel user's pass | — | `{success, message}` |
| POST | `/passes/:id/approve` | Admin | Approve pass | — | `{success, message, pass}` |
| POST | `/passes/:id/reject` | Admin | Reject pass | — | `{success, message}` |
| POST | `/passes/:id/payment-paid` | Admin | Mark payment received | — | `{success, message}` |
| PUT | `/passes/:id/status/:status` | Admin | Update pass status | — | `{success, message, pass}` |
| DELETE | `/passes/:id` | Admin | Delete pass | — | `{success, message}` |
| DELETE | `/passes/multiple` | Admin | Delete multiple passes | `{ids: []}` | `{success, message}` |

### Booking Endpoints

| Method | Endpoint | Access | Description | Request | Response |
|--------|----------|--------|-------------|---------|----------|
| GET | `/bookings/rooms` | Public | Get available rooms | — | `{success, rooms}` |
| GET | `/bookings/rooms/all` | Admin | Get all rooms | — | `{success, rooms}` |
| GET | `/bookings` | Auth | Get user's bookings | — | `{success, bookings}` |
| GET | `/bookings/all` | Admin | Get all bookings | — | `{success, bookings}` |
| GET | `/bookings/:id` | Auth | Get booking by ID | — | `{success, booking}` |
| POST | `/bookings` | Auth | Create booking | `{room_id, check_in, check_out, guest_name, phone, email, no_of_guests}` | `{success, message, booking, amount}` |
| POST | `/bookings/payment` | Auth | Process payment | `{booking_id, payment_method}` | `{success, message}` |
| POST | `/bookings/:id/cancel` | Auth | Cancel booking | — | `{success, message}` |
| POST | `/bookings/:id/confirm` | Admin | Confirm booking | — | `{success, message}` |
| POST | `/bookings/:id/cancel-admin` | Admin | Cancel booking | — | `{success, message}` |

### Donation Endpoints

| Method | Endpoint | Access | Description | Request | Response |
|--------|----------|--------|-------------|---------|----------|
| GET | `/donations` | Auth | Get user's donations | — | `{success, donations, total_donated}` |
| GET | `/donations/all` | Admin | Get all donations | — | `{success, donations}` |
| GET | `/donations/total` | Public | Get total donation amount | — | `{success, total}` |
| GET | `/donations/receipt/:receiptNo` | Auth | Get donation receipt | — | `{success, donation}` |
| POST | `/donations` | Auth | Create donation | `{amount, name?, email?, phone?, donation_type?, payment_method?, message?}` | `{success, message, donation}` |
| POST | `/donations/:id/complete` | Admin | Mark donation complete | — | `{success, message}` |

### Restaurant Endpoints

| Method | Endpoint | Access | Description | Request | Response |
|--------|----------|--------|-------------|---------|----------|
| GET | `/restaurant/menu` | Public | Get menu items | — | `{success, menu_items, categories}` |
| GET | `/restaurant` | Auth | Get user's orders | — | `{success, orders}` |
| GET | `/restaurant/all` | Admin | Get all orders | — | `{success, orders}` |
| GET | `/restaurant/:orderId` | Auth | Get order by ID | — | `{success, order, items}` |
| POST | `/restaurant` | Auth | Place order | `{items: [{name, price, qty}], payment_method?, name?}` | `{success, message, order}` |
| PUT | `/restaurant/:id/status` | Admin | Update order status | `{status}` | `{success, message}` |

### Dashboard Endpoints

| Method | Endpoint | Access | Description | Response |
|--------|----------|--------|-------------|----------|
| GET | `/dashboard` | Auth | Get user dashboard | `{success, user_data, passes, donations, bookings, orders, totals, all_messages, unread_count}` |
| GET | `/dashboard/notifications` | Auth | Get notifications | `{success, notifications}` |
| GET | `/dashboard/notifications/unread` | Auth | Get unread count | `{success, count}` |
| POST | `/dashboard/notifications/read` | Auth | Mark all read | `{success, message}` |

### Admin Endpoints

| Method | Endpoint | Access | Description | Response |
|--------|----------|--------|-------------|----------|
| GET | `/admin/dashboard` | Admin | Admin analytics | `{success, stats, recent_passes, recent_bookings, recent_donations, recent_orders, monthly_donations}` |
| GET | `/admin/users` | Admin | Get all users | `{success, users}` |
| POST | `/admin/users` | Admin | Create user | `{name, username, email, password, mobile}` → `{success, message, user}` |
| PUT | `/admin/users/:id` | Admin | Update user | `{name?, email?, mobile?, status?, password?}` → `{success, message}` |
| DELETE | `/admin/users/:id` | Admin | Delete user | — → `{success, message}` |
| GET | `/admin/devotees` | Admin | Get devotees with stats | `{success, devotees: [{...user, total_passes, total_spent}]}` |
| GET | `/admin/devotees/:id` | Admin | Get devotee details | `{success, user, passes, bookings, donations, orders, total_spent}` |

### Content Endpoints

| Method | Endpoint | Access | Description | Request | Response |
|--------|----------|--------|-------------|---------|----------|
| GET | `/content/festivals` | Public | Get festivals | — | `{success, upcoming_festivals, ongoing_festivals, completed_festivals}` |
| GET | `/content/events` | Public | Get events | — | `{success, upcoming_events, ongoing_events, completed_events}` |
| GET | `/content/news` | Public | Get news | — | `{success, news}` |
| GET | `/content/temple-updates` | Public | Get temple updates | Query: `{status?, type?}` | `{success, data}` |
| POST | `/content/temple-updates` | Admin | Create update | Multipart: `{title, description, update_type, event_date?, event_end_date?, is_featured?, status?}` + `image` file | `{success, message, update}` |
| PUT | `/content/temple-updates/:id` | Admin | Update | Same as create + `id` | `{success, message}` |
| DELETE | `/content/temple-updates/:id` | Admin | Delete update | — | `{success, message}` |
| PUT | `/content/temple-updates/:id/toggle-status` | Admin | Toggle active/inactive | — | `{success, new_status}` |

---

## 🔐 Authentication & Security

### JWT Authentication

```
Token Generation:
  - Secret: process.env.JWT_SECRET
  - Payload: { id: user._id }
  - Expiry: 30 days (remember) or process.env.JWT_EXPIRE
  - Algorithm: HS256 (default)

Token Verification (middleware/auth.js):
  - Extracts from: req.headers.authorization (Bearer token)
  - Verifies signature with JWT_SECRET
  - Attaches: req.userId = decoded.id
  - For admin routes: checks isAdmin flag or role

Admin Hardcoded Login:
  - Email: suyogshirsat2004@gmail.com
  - Password: suyog2004
  - Token payload: { id: 'admin', isAdmin: true }
  - Note: Should be replaced with database-stored admin in production
```

### Security Measures

| Layer | Implementation |
|-------|----------------|
| **Password Hashing** | bcryptjs with 10 salt rounds, pre-save hook |
| **JWT Tokens** | Signed tokens, expiry, Bearer auth |
| **Helmet** | Security headers (XSS-Filter, No-Sniff, Frameguard, etc) |
| **CORS** | Configured origin (frontend URL), credentials enabled |
| **File Upload** | Multer with image-only filter (jpg, jpeg, png, gif, webp) |
| **Error Handling** | Global error middleware, prevents stack trace leaks |
| **Input Validation** | express-validator for request body validation |

### File Upload Structure

```
backend/src/uploads/
├── passes/           # Aadhar card images
│   └── aadhar_card_<timestamp>.<ext>
└── profile/          # Profile pictures
    └── profile_pic_<timestamp>.<ext>
```

Static serving: `/uploads` → `backend/src/uploads/`

---

## 📁 Project Structure

```
Temple ERP System/
│
├── backend/                              # Express.js API server
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js               # MongoDB connection with error handling
│   │   │
│   │   ├── controllers/                  # Request handlers (business logic)
│   │   │   ├── adminController.js        # Admin dashboard, users, devotees, reports
│   │   │   ├── authController.js         # Register, login, profile, password
│   │   │   ├── bookingController.js      # Room booking CRUD, payment, cancellation
│   │   │   ├── contentController.js      # Festivals, events, news, temple updates
│   │   │   ├── dashboardController.js    # User dashboard, notifications
│   │   │   ├── donationController.js     # Donation processing, receipts, totals
│   │   │   ├── passController.js         # Darshan pass booking, approval, QR
│   │   │   └── restaurantController.js   # Menu, orders, status updates
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js                   # JWT verification, admin guard
│   │   │   └── upload.js                 # Multer config for image uploads
│   │   │
│   │   ├── models/                       # Mongoose schemas
│   │   │   ├── DarshanPass.js            # Pass bookings with Aadhar
│   │   │   ├── Donation.js               # Donation records
│   │   │   ├── Event.js                  # Temple events
│   │   │   ├── Festival.js               # Festival information
│   │   │   ├── News.js                   # News articles
│   │   │   ├── Notification.js           # User notifications
│   │   │   ├── PassType.js               # Pass types (General/Special/VIP)
│   │   │   ├── RestaurantMenu.js         # Menu items
│   │   │   ├── RestaurantOrder.js        # Food orders
│   │   │   ├── Room.js                   # Room inventory
│   │   │   ├── RoomBooking.js            # Room reservations
│   │   │   ├── TempleUpdate.js           # Temple announcements
│   │   │   ├── User.js                   # User accounts with bcrypt
│   │   │   └── index.js                  # Model exports
│   │   │
│   │   ├── routes/                       # API route definitions
│   │   │   ├── admin.js                  # /api/admin/*
│   │   │   ├── auth.js                   # /api/auth/*
│   │   │   ├── bookings.js               # /api/bookings/*
│   │   │   ├── content.js                # /api/content/*
│   │   │   ├── dashboard.js              # /api/dashboard/*
│   │   │   ├── donations.js              # /api/donations/*
│   │   │   ├── passes.js                 # /api/passes/*
│   │   │   └── restaurant.js             # /api/restaurant/*
│   │   │
│   │   └── uploads/                      # Uploaded files (gitignored in prod)
│   │       ├── passes/                   # Aadhar card uploads
│   │       └── profile/                  # Profile pictures
│   │
│   ├── .env                              # Environment variables
│   ├── package.json                      # Dependencies and scripts
│   └── src/server.js                     # Express app entry point
│
├── frontend/                             # React + Vite application
│   ├── public/                           # Static assets
│   │   ├── assets/images/                # Temple photos, QR codes
│   │   ├── images/                       # Default avatars
│   │   └── favicon.svg
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx                # Navigation bar with auth state
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Global auth state (token, user, login, logout)
│   │   │
│   │   ├── pages/                        # Route-level components
│   │   │   ├── Home.jsx                  # Landing page (redirects based on auth)
│   │   │   ├── Login.jsx                 # Devotee login
│   │   │   ├── Register.jsx              # Devotee registration
│   │   │   ├── AdminLogin.jsx            # Admin login
│   │   │   ├── Dashboard.jsx             # User dashboard with activity feed
│   │   │   ├── Profile.jsx               # Profile editing
│   │   │   ├── Notifications.jsx         # Notification list
│   │   │   ├── PassHistory.jsx           # Pass list
│   │   │   ├── PassDetail.jsx            # Single pass view
│   │   │   ├── NewPass.jsx               # Pass booking form
│   │   │   ├── Donations.jsx             # Donation form + history
│   │   │   ├── RoomBooking.jsx           # Room booking form
│   │   │   ├── BookingHistory.jsx        # Booking list
│   │   │   ├── Restaurant.jsx            # Menu + order placement
│   │   │   ├── OrderHistory.jsx          # Order history
│   │   │   ├── Events.jsx                # Event listings
│   │   │   ├── Festivals.jsx             # Festival calendar
│   │   │   ├── News.jsx                  # News articles
│   │   │   │
│   │   │   └── admin/                    # Admin-only pages
│   │   │       ├── Dashboard.jsx         # Analytics dashboard
│   │   │       ├── Users.jsx             # User management
│   │   │       ├── Passes.jsx            # Pass management
│   │   │       ├── Bookings.jsx          # Booking management
│   │   │       ├── Donations.jsx         # Donation management
│   │   │       ├── Restaurant.jsx        # Order management
│   │   │       ├── Devotees.jsx          # Devotee database
│   │   │       ├── Reports.jsx           # Financial reports
│   │   │       └── Festivals.jsx         # Festival management
│   │   │
│   │   ├── services/
│   │   │   └── api.js                    # Axios instance with base URL and interceptors
│   │   │
│   │   ├── App.jsx                       # Main app with routes and auth guards
│   │   ├── main.jsx                      # React entry point
│   │   └── index.css                     # Global styles
│   │
│   ├── .env                              # Frontend env vars (VITE_*)
│   ├── vite.config.js                    # Vite configuration
│   ├── index.html                        # HTML entry point
│   └── package.json                      # Dependencies and scripts
│
├── .gitignore                            # Git ignore rules
├── HOW_TO_RUN.txt                        # Quick start guide
├── LICENSE                               # MIT License
└── README.md                             # This file
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | ≥ 16.x |
| npm | ≥ 8.x |
| MongoDB | ≥ 5.x (local or Atlas) |

### Installation

```bash
# Clone repository
git clone https://github.com/suyog-shirsat2004/Temple-ERP-Enterprise-Resource-Planning-System.git
cd Temple-ERP-Enterprise-Resource-Planning-System

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Configuration

**backend/.env**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/temple_erp
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

```bash
# Terminal 1 - Backend (runs on port 5000)
cd backend
npm run dev

# Terminal 2 - Frontend (runs on port 5173)
cd frontend
npm run dev
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Health Check | http://localhost:5000/api/health |
| Uploads | http://localhost:5000/uploads/ |

### Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | suyogshirsat2004@gmail.com |
| Password | suyog2004 |

⚠ **Important**: Change admin credentials in production. Update `adminLogin` in `authController.js`.

### Available Scripts

**Backend**
```bash
npm run dev     # Start with nodemon (auto-restart)
npm start       # Start production server
```

**Frontend**
```bash
npm run dev     # Start Vite dev server with HMR
npm run build   # Build for production (outputs to dist/)
npm run preview # Preview production build
```

---

## 🌐 Deployment

### Backend (Node.js/Express)

**Environment Variables for Production**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/temple_erp
JWT_SECRET=<strong-random-string>
JWT_EXPIRE=30d
FRONTEND_URL=https://your-domain.com
```

**Platform Options**
- **Render** — Auto-deploys from GitHub, free tier available
- **Railway** — One-click MongoDB + Node.js deployment
- **Heroku** — Add MongoDB Atlas addon
- **AWS EC2** — Full control, run with PM2

**PM2 Process Manager**
```bash
npm install -g pm2
pm2 start src/server.js --name temple-erp-api
pm2 save
pm2 startup
```

### Frontend (React/Vite)

**Build**
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

**Platform Options**
- **Vercel** — Zero-config React deployment
- **Netlify** — Drag & drop `dist/` folder
- **GitHub Pages** — Free hosting from repository
- **AWS S3 + CloudFront** — Scalable CDN

**Vercel Deployment**
```bash
npm i -g vercel
cd frontend
vercel
```

### Database

**MongoDB Atlas** (Recommended)
1. Create cluster at https://mongodb.com/cloud/atlas
2. Create database user
3. Whitelist IP (0.0.0.0/0 for all)
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/temple_erp`

---

## 📸 Screenshots

<div align="center">

| | |
|:---:|:---:|
| **🏠 Home Page** | **👤 Devotee Dashboard** |
| ![Home](Screenshots/Home.png) | ![Dashboard](Screenshots/Devotee%20dashboard.png) |
| **🎫 Pass Booking Form** | **📊 Admin Analytics** |
| ![Pass Booking](Screenshots/Pass%20booking%20form.png) | ![Admin](Screenshots/Admin%20analytics.png) |
| **🏨 Room Booking** | **🍽️ Restaurant Ordering** |
| ![Room Booking](Screenshots/Room%20booking.png) | ![Restaurant](Screenshots/Restaurant%20ordering.png) |
| **🧾 Donation Receipt** | |
| ![Donation](Screenshots/Donation%20receipt.png) | |

</div>

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 📞 Contact

**Suyog Shirsat**  
📧 suyogshirsat2004@gmail.com  
🔗 [GitHub Profile](https://github.com/suyog-shirsat2004)

Project: https://github.com/suyog-shirsat2004/Temple-ERP-Enterprise-Resource-Planning-System
