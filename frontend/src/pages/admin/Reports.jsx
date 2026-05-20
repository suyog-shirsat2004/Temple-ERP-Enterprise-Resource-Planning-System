import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(res => {
      setStats(res.data.stats);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout title="Reports & Analytics"><div style={{ textAlign: 'center', padding: 100, color: '#64748b' }}>Loading reports...</div></AdminLayout>;
  if (!stats) return <AdminLayout title="Reports & Analytics"><div style={{ textAlign: 'center', padding: 100, color: '#94a3b8' }}>No data available</div></AdminLayout>;

  const totalRevenue = (stats.total_donations_amount || 0) + (stats.restaurant_revenue || 0);
  const totalPending = (stats.pending_passes || 0) + (stats.pending_bookings || 0) + (stats.pending_donations || 0) + (stats.pending_restaurant_orders || 0);

  const revenueBreakdown = [
    { label: 'Donation Revenue', value: stats.total_donations_amount || 0, icon: 'fas fa-donate', color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Restaurant Revenue', value: stats.restaurant_revenue || 0, icon: 'fas fa-utensils', color: '#ec4899', bg: '#fce7f3' },
    { label: 'Room Booking Revenue', value: stats.booking_revenue || 0, icon: 'fas fa-hotel', color: '#10b981', bg: '#d1fae5' },
    { label: 'Pass Revenue', value: stats.pass_revenue || 0, icon: 'fas fa-ticket-alt', color: '#6366f1', bg: '#e0e7ff' }
  ];

  const activityCards = [
    { label: 'Total Devotees', value: stats.total_visitors || 0, icon: 'fas fa-users', color: '#6366f1' },
    { label: 'Total Passes', value: stats.total_passes || 0, icon: 'fas fa-ticket-alt', color: '#ec4899' },
    { label: 'Total Bookings', value: stats.total_bookings || 0, icon: 'fas fa-hotel', color: '#10b981' },
    { label: 'Total Donations', value: stats.total_donations || 0, icon: 'fas fa-donate', color: '#f59e0b' },
    { label: 'Restaurant Orders', value: stats.total_restaurant_orders || 0, icon: 'fas fa-utensils', color: '#8b5cf6' }
  ];

  const pendingItems = [
    { label: 'Pending Passes', value: stats.pending_passes || 0, bg: '#fef3c7', color: '#92400e', icon: 'fas fa-ticket-alt', link: '/admin/passes' },
    { label: 'Pending Bookings', value: stats.pending_bookings || 0, bg: '#e0e7ff', color: '#3730a3', icon: 'fas fa-hotel', link: '/admin/bookings' },
    { label: 'Pending Donations', value: stats.pending_donations || 0, bg: '#d1fae5', color: '#065f46', icon: 'fas fa-donate', link: '/admin/donations' },
    { label: 'Pending Orders', value: stats.pending_restaurant_orders || 0, bg: '#fce7f3', color: '#9d174d', icon: 'fas fa-utensils', link: '/admin/restaurant' }
  ];

  return (
    <AdminLayout title="Reports & Analytics">
      {/* Revenue Overview */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 }}>Revenue Overview</h3>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#6366f1' }}>Rs.{totalRevenue.toLocaleString()}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {revenueBreakdown.map((item, i) => (
            <div key={i} style={{ padding: 20, background: item.bg, borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}><i className={item.icon}></i></div>
                <div style={{ fontSize: 12, color: item.color, fontWeight: 500 }}>{item.label}</div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: item.color }}>Rs.{item.value.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Summary */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '0 0 20px' }}>Activity Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {activityCards.map((item, i) => (
            <div key={i} style={{ padding: 20, background: '#f8fafc', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: item.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, fontSize: 18, margin: '0 auto 12px' }}><i className={item.icon}></i></div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#1e293b' }}>{item.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Items */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0 }}>Pending Items</h3>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#ef4444' }}>{totalPending} total pending</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {pendingItems.map((item, i) => (
            <Link key={i} to={item.link} style={{ textDecoration: 'none', padding: 20, background: item.bg, borderRadius: 12, textAlign: 'center', transition: 'transform 0.2s ease' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, fontSize: 18, margin: '0 auto 12px' }}><i className={item.icon}></i></div>
              <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: 12, color: item.color, fontWeight: 600 }}>{item.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
