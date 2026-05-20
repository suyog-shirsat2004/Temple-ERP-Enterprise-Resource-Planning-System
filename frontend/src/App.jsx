import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/dashboard" element={<PrivateRoute><><Navbar /><Dashboard /></></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><><Navbar /><Profile /></></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><><Navbar /><Notifications /></></PrivateRoute>} />
        <Route path="/passes" element={<PrivateRoute><><Navbar /><PassHistory /></></PrivateRoute>} />
        <Route path="/passes/new" element={<PrivateRoute><><Navbar /><NewPass /></></PrivateRoute>} />
        <Route path="/passes/:id" element={<PrivateRoute><><Navbar /><PassDetail /></></PrivateRoute>} />
        <Route path="/donations" element={<PrivateRoute><><Navbar /><Donations /></></PrivateRoute>} />
        <Route path="/bookings" element={<PrivateRoute><><Navbar /><RoomBooking /></></PrivateRoute>} />
        <Route path="/bookings/history" element={<PrivateRoute><><Navbar /><BookingHistory /></></PrivateRoute>} />
        <Route path="/restaurant" element={<PrivateRoute><><Navbar /><Restaurant /></></PrivateRoute>} />
        <Route path="/restaurant/orders" element={<PrivateRoute><><Navbar /><OrderHistory /></></PrivateRoute>} />
        <Route path="/events" element={<PrivateRoute><><Navbar /><Events /></></PrivateRoute>} />
        <Route path="/festivals" element={<PrivateRoute><><Navbar /><Festivals /></></PrivateRoute>} />
        <Route path="/news" element={<PrivateRoute><><Navbar /><News /></></PrivateRoute>} />

        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/passes" element={<AdminRoute><AdminPasses /></AdminRoute>} />
        <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
        <Route path="/admin/donations" element={<AdminRoute><AdminDonations /></AdminRoute>} />
        <Route path="/admin/restaurant" element={<AdminRoute><AdminRestaurant /></AdminRoute>} />
        <Route path="/admin/devotees" element={<AdminRoute><AdminDevotees /></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
        <Route path="/admin/festivals" element={<AdminRoute><AdminFestivals /></AdminRoute>} />
        <Route path="/admin/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
        <Route path="/admin/news" element={<AdminRoute><AdminNews /></AdminRoute>} />
        <Route path="/admin/rooms" element={<AdminRoute><AdminRooms /></AdminRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
