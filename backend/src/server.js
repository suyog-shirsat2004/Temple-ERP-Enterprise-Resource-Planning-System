const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const passRoutes = require('./routes/passes');
const donationRoutes = require('./routes/donations');
const bookingRoutes = require('./routes/bookings');
const restaurantRoutes = require('./routes/restaurant');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');
const contentRoutes = require('./routes/content');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/passes', passRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/content', contentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Temple ERP MERN API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message === 'Only image files (jpg, jpeg, png, gif, webp) are allowed') {
    return res.status(400).json({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
