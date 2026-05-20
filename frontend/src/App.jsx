import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import PassHistory from './pages/PassHistory';
import PassDetail from './pages/PassDetail';
import NewPass from './pages/NewPass';
import Donations from './pages/Donations';
import RoomBooking from './pages/RoomBooking';
import BookingHistory from './pages/BookingHistory';
import Restaurant from './pages/Restaurant';
import OrderHistory from './pages/OrderHistory';
import Events from './pages/Events';
import Festivals from './pages/Festivals';
import News from './pages/News';

import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminPasses from './pages/admin/Passes';
import AdminBookings from './pages/admin/Bookings';
import AdminDonations from './pages/admin/Donations';
import AdminRestaurant from './pages/admin/Restaurant';
import AdminDevotees from './pages/admin/Devotees';
import AdminReports from './pages/admin/Reports';
import AdminFestivals from './pages/admin/Festivals';
import AdminEvents from './pages/admin/Events';
import AdminNews from './pages/admin/News';
import AdminRooms from './pages/admin/Rooms';
import PageWrapper from './components/PageWrapper';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div className="text-center" style={{ padding: '100px' }}>Loading...</div>;
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, token, loading } = useAuth();
  if (loading) return <div className="text-center" style={{ padding: '100px' }}>Loading...</div>;
  return token && (user?.role === 'admin' || user?.id === 'admin') ? children : <Navigate to="/admin/login" />;
};

const HomeRedirect = () => {
  const { user, token, loading } = useAuth();
  if (loading) return <div className="text-center" style={{ padding: '100px' }}>Loading...</div>;
  if (!token) return <Home />;
  if (user?.role === 'admin' || user?.id === 'admin') return <Navigate to="/admin" />;
  return <Navigate to="/dashboard" />;
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomeRedirect /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/admin/login" element={<PageWrapper><AdminLogin /></PageWrapper>} />

        <Route path="/dashboard" element={<PrivateRoute><PageWrapper><><Navbar /><Dashboard /></></PageWrapper></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><PageWrapper><><Navbar /><Profile /></></PageWrapper></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><PageWrapper><><Navbar /><Notifications /></></PageWrapper></PrivateRoute>} />
        <Route path="/passes" element={<PrivateRoute><PageWrapper><><Navbar /><PassHistory /></></PageWrapper></PrivateRoute>} />
        <Route path="/passes/new" element={<PrivateRoute><PageWrapper><><Navbar /><NewPass /></></PageWrapper></PrivateRoute>} />
        <Route path="/passes/:id" element={<PrivateRoute><PageWrapper><><Navbar /><PassDetail /></></PageWrapper></PrivateRoute>} />
        <Route path="/donations" element={<PrivateRoute><PageWrapper><><Navbar /><Donations /></></PageWrapper></PrivateRoute>} />
        <Route path="/bookings" element={<PrivateRoute><PageWrapper><><Navbar /><RoomBooking /></></PageWrapper></PrivateRoute>} />
        <Route path="/bookings/history" element={<PrivateRoute><PageWrapper><><Navbar /><BookingHistory /></></PageWrapper></PrivateRoute>} />
        <Route path="/restaurant" element={<PrivateRoute><PageWrapper><><Navbar /><Restaurant /></></PageWrapper></PrivateRoute>} />
        <Route path="/restaurant/orders" element={<PrivateRoute><PageWrapper><><Navbar /><OrderHistory /></></PageWrapper></PrivateRoute>} />
        <Route path="/events" element={<PrivateRoute><PageWrapper><><Navbar /><Events /></></PageWrapper></PrivateRoute>} />
        <Route path="/festivals" element={<PrivateRoute><PageWrapper><><Navbar /><Festivals /></></PageWrapper></PrivateRoute>} />
        <Route path="/news" element={<PrivateRoute><PageWrapper><><Navbar /><News /></></PageWrapper></PrivateRoute>} />

        <Route path="/admin" element={<AdminRoute><PageWrapper><AdminDashboard /></PageWrapper></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><PageWrapper><AdminUsers /></PageWrapper></AdminRoute>} />
        <Route path="/admin/passes" element={<AdminRoute><PageWrapper><AdminPasses /></PageWrapper></AdminRoute>} />
        <Route path="/admin/bookings" element={<AdminRoute><PageWrapper><AdminBookings /></PageWrapper></AdminRoute>} />
        <Route path="/admin/donations" element={<AdminRoute><PageWrapper><AdminDonations /></PageWrapper></AdminRoute>} />
        <Route path="/admin/restaurant" element={<AdminRoute><PageWrapper><AdminRestaurant /></PageWrapper></AdminRoute>} />
        <Route path="/admin/devotees" element={<AdminRoute><PageWrapper><AdminDevotees /></PageWrapper></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><PageWrapper><AdminReports /></PageWrapper></AdminRoute>} />
        <Route path="/admin/festivals" element={<AdminRoute><PageWrapper><AdminFestivals /></PageWrapper></AdminRoute>} />
        <Route path="/admin/events" element={<AdminRoute><PageWrapper><AdminEvents /></PageWrapper></AdminRoute>} />
        <Route path="/admin/news" element={<AdminRoute><PageWrapper><AdminNews /></PageWrapper></AdminRoute>} />
        <Route path="/admin/rooms" element={<AdminRoute><PageWrapper><AdminRooms /></PageWrapper></AdminRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
