import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(res => {
      setStats(res.data.stats);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuSections = [
    {
      title: 'Main',
      items: [
        { icon: 'fas fa-home', label: 'Dashboard', path: '/admin', active: true }
      ]
    },
    {
      title: 'Management',
      items: [
        { icon: 'fas fa-ticket-alt', label: 'Darshan Passes', path: '/admin/passes', count: stats?.total_passes },
        { icon: 'fas fa-hotel', label: 'Room Bookings', path: '/admin/bookings', count: stats?.total_bookings },
        { icon: 'fas fa-money-bill-wave', label: 'Transactions', path: '/admin/transactions' },
        { icon: 'fas fa-donate', label: 'Donations', path: '/admin/donations', count: stats?.total_donations },
        { icon: 'fas fa-users', label: 'Devotees', path: '/admin/devotees', count: stats?.total_visitors },
        { icon: 'fas fa-utensils', label: 'Restaurant', path: '/admin/restaurant', count: stats?.total_restaurant_orders }
      ]
    },
    {
      title: 'Updates',
      items: [
        { icon: 'fas fa-bullhorn', label: 'Temple Updates', path: '/admin/updates' },
        { icon: 'fas fa-calendar-star', label: 'Festivals', path: '/admin/festivals' },
        { icon: 'fas fa-calendar-alt', label: 'Events', path: '/admin/events' },
        { icon: 'fas fa-newspaper', label: 'News', path: '/admin/news' }
      ]
    },
    {
      title: 'Settings',
      items: [
        { icon: 'fas fa-tags', label: 'Pass Pricing', path: '/admin/pricing' }
      ]
    }
  ];

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</div>;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: 'linear-gradient(135deg, #f0f2f5 0%, #e2e8f0 100%)', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <div className="floating-shapes" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: '#6366f1', opacity: 0.03, top: -100, right: -100 }}></div>
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: '#ec4899', opacity: 0.03, bottom: -50, left: -50 }}></div>
      </div>

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, width: 260, height: '100vh',
        background: '#1e1e2d', zIndex: 1000, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowY: 'auto', transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
      }}>
        <Link to="/admin" style={{
          padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none'
        }}>
          <div style={{
            width: 45, height: 45, background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 20
          }}>
            <i className="fas fa-om"></i>
          </div>
          <div style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>
            Temple ERP
            <span style={{ display: 'block', fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>Admin Panel</span>
          </div>
        </Link>

        <nav style={{ padding: '16px 12px' }}>
          {menuSections.map((section, si) => (
            <div key={si} style={{ marginBottom: 8 }}>
              <div style={{
                fontSize: 11, textTransform: 'uppercase', letterSpacing: 1,
                color: 'rgba(255,255,255,0.3)', padding: '12px 12px 8px', fontWeight: 600
              }}>{section.title}</div>
              {section.items.map((item, ii) => (
                <Link key={ii} to={item.path} style={{
                  display: 'flex', alignItems: 'center', padding: '12px 16px',
                  color: item.active ? 'white' : 'rgba(255,255,255,0.7)',
                  textDecoration: 'none', borderRadius: 10, marginBottom: 4,
                  background: item.active ? '#2d2d3f' : 'transparent',
                  transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'
                }}>
                  <i className={item.icon} style={{ width: 22, fontSize: 18, marginRight: 12 }}></i>
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                  {item.count !== undefined && (
                    <span style={{
                      fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)',
                      marginLeft: 'auto', marginRight: 8, background: 'rgba(255,255,255,0.1)',
                      padding: '2px 8px', borderRadius: 10
                    }}>{item.count}</span>
                  )}
                </Link>
              ))}
            </div>
          ))}

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', width: '100%', padding: '12px 16px',
              color: '#ef4444', background: 'none', border: 'none', borderRadius: 10,
              cursor: 'pointer', fontSize: 14, fontWeight: 500, transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-sign-out-alt" style={{ width: 22, fontSize: 18, marginRight: 12 }}></i>
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: sidebarOpen ? 260 : 0, minHeight: '100vh',
        transition: 'margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Topbar */}
        <div style={{
          background: 'white', padding: '16px 30px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100
        }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: '#f8fafc', border: 'none', width: 40, height: 40,
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#1e293b', fontSize: 16
          }}>
            <i className="fas fa-bars"></i>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 45, height: 45, background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 600, fontSize: 16
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: '#1e293b' }}>{user?.name || 'Admin'}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{user?.email || 'admin@temple.com'}</div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: 30 }}>
          <div style={{ marginBottom: 30 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>
              <Link to="/admin" style={{ color: '#6366f1', textDecoration: 'none' }}><i className="fas fa-home"></i> Home</Link>
              <i className="fas fa-chevron-right" style={{ fontSize: 10 }}></i>
              <span>Dashboard</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Welcome back, Admin!</h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>Here's what's happening with your temple today.</p>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24, marginBottom: 30
          }}>
            {[
              { label: 'Total Devotees', value: stats?.total_visitors || 0, icon: 'fas fa-users', color: '#6366f1', link: '/admin/devotees' },
              { label: 'Total Passes', value: stats?.total_passes || 0, icon: 'fas fa-ticket-alt', color: '#ec4899', link: '/admin/passes', pending: stats?.pending_passes },
              { label: 'Room Bookings', value: stats?.total_bookings || 0, icon: 'fas fa-hotel', color: '#10b981', link: '/admin/bookings', pending: stats?.pending_bookings },
              { label: 'Total Donations', value: `₹${(stats?.total_donations_amount || 0).toLocaleString()}`, icon: 'fas fa-rupee-sign', color: '#f59e0b', link: '/admin/donations', pending: stats?.pending_donations },
              { label: 'Restaurant Orders', value: stats?.total_restaurant_orders || 0, icon: 'fas fa-utensils', color: '#8b5cf6', link: '/admin/restaurant', pending: stats?.pending_restaurant_orders, gradient: true }
            ].map((stat, i) => (
              <Link key={i} to={stat.link} style={{
                background: stat.gradient ? 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' : 'white',
                borderRadius: 24, padding: 28, position: 'relative', overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', textDecoration: 'none',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer',
                display: 'block'
              }}>
                {stat.pending > 0 && (
                  <div style={{
                    position: 'absolute', top: 28, right: 28, fontSize: 12, padding: '6px 12px',
                    borderRadius: 20, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
                    background: stat.gradient ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: stat.gradient ? 'white' : 'white'
                  }}>
                    <i className="fas fa-clock"></i> {stat.pending} Pending
                  </div>
                )}
                <div style={{
                  width: 64, height: 64, borderRadius: 18, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 26, marginBottom: 20,
                  background: stat.gradient ? 'rgba(255,255,255,0.2)' : `${stat.color}15`,
                  color: stat.gradient ? 'white' : stat.color
                }}>
                  <i className={stat.icon}></i>
                </div>
                <h3 style={{ fontSize: 36, fontWeight: 800, color: stat.gradient ? 'white' : '#1e293b', marginBottom: 4 }}>{stat.value}</h3>
                <h4 style={{ fontSize: 14, color: stat.gradient ? 'rgba(255,255,255,0.9)' : '#64748b', fontWeight: 500 }}>{stat.label}</h4>
              </Link>
            ))}
          </div>

          {/* Action Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24, marginBottom: 30
          }}>
            {[
              { title: 'Create Pass', desc: 'Manually create a new Darshan pass for a devotee.', icon: 'fas fa-plus-circle', bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', action: 'Create New Pass' },
              { title: 'Payment Methods', desc: 'Manage and configure payment gateways and methods.', icon: 'fas fa-credit-card', bg: 'linear-gradient(135deg, #10b981, #059669)', action: 'Manage Payments' },
              { title: 'Quick Report', desc: 'Generate instant reports for passes, donations, and bookings.', icon: 'fas fa-file-alt', bg: 'linear-gradient(135deg, #f59e0b, #d97706)', action: 'Generate Report' }
            ].map((card, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                cursor: 'pointer', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative',
                overflow: 'hidden', border: '2px solid transparent'
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 20, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 30, marginBottom: 20, background: card.bg, color: 'white'
                }}>
                  <i className={card.icon}></i>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>{card.desc}</p>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px',
                  borderRadius: 12, fontWeight: 600, fontSize: 14, background: card.bg, color: 'white',
                  cursor: 'pointer', border: 'none'
                }}>
                  {card.action} <i className="fas fa-arrow-right"></i>
                </span>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{
            background: 'white', borderRadius: 24, padding: 28, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1e293b', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <i className="fas fa-bolt" style={{ color: '#6366f1' }}></i> Quick Actions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16 }}>
              {[
                { icon: 'fas fa-ticket-alt', label: 'Manage Passes', path: '/admin/passes' },
                { icon: 'fas fa-hotel', label: 'Room Bookings', path: '/admin/bookings' },
                { icon: 'fas fa-money-bill-wave', label: 'Transactions', path: '/admin/transactions' },
                { icon: 'fas fa-donate', label: 'Donations', path: '/admin/donations' },
                { icon: 'fas fa-users', label: 'Devotees', path: '/admin/devotees' },
                { icon: 'fas fa-tags', label: 'Pass Pricing', path: '/admin/pricing' }
              ].map((action, i) => (
                <Link key={i} to={action.path} style={{
                  textAlign: 'center', padding: '24px 16px', borderRadius: 18, background: '#f8fafc',
                  textDecoration: 'none', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  <i className={action.icon} style={{ fontSize: 32, color: '#6366f1', marginBottom: 12, display: 'block' }}></i>
                  <span style={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
