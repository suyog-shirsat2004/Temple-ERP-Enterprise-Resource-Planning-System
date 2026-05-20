import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import AdminLayout from '../../components/AdminLayout';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState({ passes: [], bookings: [], donations: [], orders: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(res => {
      setStats(res.data.stats);
      setRecent({
        passes: res.data.recent_passes || [],
        bookings: res.data.recent_bookings || [],
        donations: res.data.recent_donations || [],
        orders: res.data.recent_orders || []
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: 18 }}>Loading dashboard...</div>;

  const statCards = [
    { label: 'Total Devotees', value: stats?.total_visitors || 0, icon: 'fas fa-users', bg: '#ede9fe', color: '#6366f1', link: '/admin/devotees' },
    { label: 'Total Passes', value: stats?.total_passes || 0, icon: 'fas fa-ticket-alt', bg: '#fce7f3', color: '#ec4899', link: '/admin/passes', pending: stats?.pending_passes },
    { label: 'Room Bookings', value: stats?.total_bookings || 0, icon: 'fas fa-hotel', bg: '#d1fae5', color: '#10b981', link: '/admin/bookings' },
    { label: 'Donations', value: `₹${(stats?.total_donations_amount || 0).toLocaleString()}`, icon: 'fas fa-rupee-sign', bg: '#fef3c7', color: '#f59e0b', link: '/admin/donations' },
    { label: 'Restaurant Orders', value: stats?.total_restaurant_orders || 0, icon: 'fas fa-utensils', bg: '#ede9fe', color: '#8b5cf6', link: '/admin/restaurant' },
    { label: 'Total Pending', value: stats?.total_pending || 0, icon: 'fas fa-clock', bg: '#fee2e2', color: '#ef4444', link: '/admin/passes' }
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 14 }}>
        <Link to="/admin" style={{ color: '#6366f1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="fas fa-home"></i> Home
        </Link>
        <i className="fas fa-chevron-right" style={{ fontSize: 10, color: '#94a3b8' }}></i>
        <span style={{ color: '#94a3b8' }}>Dashboard</span>
      </div>

      {/* Welcome Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', margin: 0 }}>
          Welcome back, {user?.name || 'Admin'}!
        </h1>
        <p style={{ color: '#64748b', margin: '8px 0 0', fontSize: 15 }}>
          Here's what's happening with your temple today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 32 }}>
        {statCards.map((stat, i) => (
          <Link key={i} to={stat.link} style={{
            background: '#fff', borderRadius: 20, padding: 28, position: 'relative',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
          >
            {stat.pending > 0 && (
              <span style={{
                position: 'absolute', top: 20, right: 20, fontSize: 12, padding: '6px 14px',
                borderRadius: 20, fontWeight: 700, background: '#f59e0b', color: '#fff'
              }}>
                <i className="fas fa-clock" style={{ marginRight: 4 }}></i>{stat.pending} Pending
              </span>
            )}
            <div style={{
              width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, marginBottom: 18, background: stat.bg, color: stat.color
            }}>
              <i className={stat.icon}></i>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#1e293b', marginBottom: 6 }}>{stat.value}</div>
            <div style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fas fa-ticket-alt" style={{ color: '#ec4899' }}></i> Recent Passes
          </h3>
          {recent.passes.length > 0 ? recent.passes.map(p => (
            <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{p.pass_id}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{p.devotee_name}</div>
              </div>
              <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 12, fontWeight: 600, background: p.status === 'approved' ? '#d1fae5' : p.status === 'pending' ? '#fef3c7' : '#fee2e2', color: p.status === 'approved' ? '#065f46' : p.status === 'pending' ? '#92400e' : '#991b1b' }}>{p.status}</span>
            </div>
          )) : <p style={{ color: '#94a3b8', fontSize: 13 }}>No recent passes</p>}
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fas fa-hotel" style={{ color: '#10b981' }}></i> Recent Bookings
          </h3>
          {recent.bookings.length > 0 ? recent.bookings.map(b => (
            <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{b.booking_id}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{b.guest_name} — ₹{b.total_amount}</div>
              </div>
              <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 12, fontWeight: 600, background: b.booking_status === 'Confirmed' || b.booking_status === 'confirmed' ? '#d1fae5' : '#fef3c7', color: b.booking_status === 'Confirmed' || b.booking_status === 'confirmed' ? '#065f46' : '#92400e' }}>{b.booking_status}</span>
            </div>
          )) : <p style={{ color: '#94a3b8', fontSize: 13 }}>No recent bookings</p>}
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fas fa-donate" style={{ color: '#f59e0b' }}></i> Recent Donations
          </h3>
          {recent.donations.length > 0 ? recent.donations.map(d => (
            <div key={d._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{d.name || 'Anonymous'}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{d.receipt_no}</div>
              </div>
              <span style={{ fontWeight: 700, color: '#10b981' }}>₹{d.amount}</span>
            </div>
          )) : <p style={{ color: '#94a3b8', fontSize: 13 }}>No recent donations</p>}
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fas fa-utensils" style={{ color: '#8b5cf6' }}></i> Recent Orders
          </h3>
          {recent.orders.length > 0 ? recent.orders.map(o => (
            <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{o.order_id}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{o.name} — {o.items?.length || 0} items</div>
              </div>
              <span style={{ fontWeight: 700, color: '#8b5cf6' }}>₹{o.total_amount}</span>
            </div>
          )) : <p style={{ color: '#94a3b8', fontSize: 13 }}>No recent orders</p>}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
