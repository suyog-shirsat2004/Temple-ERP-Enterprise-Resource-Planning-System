import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api';

const AdminLayout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(res => {
      setStats(res.data.stats);
    }).catch(() => {});
  }, []);

  const menuSections = [
    {
      title: 'Main',
      items: [
        { icon: 'fas fa-home', label: 'Dashboard', path: '/admin' }
      ]
    },
    {
      title: 'Management',
      items: [
        { icon: 'fas fa-ticket-alt', label: 'Darshan Passes', path: '/admin/passes', badge: stats?.pending_passes || 0 },
        { icon: 'fas fa-hotel', label: 'Room Bookings', path: '/admin/bookings' },
        { icon: 'fas fa-credit-card', label: 'Transactions', path: '/admin/donations' },
        { icon: 'fas fa-donate', label: 'Donations', path: '/admin/donations', badge: stats?.pending_donations || 0 },
        { icon: 'fas fa-users', label: 'Devotees', path: '/admin/devotees' },
        { icon: 'fas fa-utensils', label: 'Restaurant', path: '/admin/restaurant' }
      ]
    },
    {
      title: 'Content',
      items: [
        { icon: 'fas fa-star', label: 'Festivals', path: '/admin/festivals' },
        { icon: 'fas fa-calendar-alt', label: 'Events', path: '/admin/events' },
        { icon: 'fas fa-newspaper', label: 'News', path: '/admin/news' }
      ]
    },
    {
      title: 'Reports',
      items: [
        { icon: 'fas fa-chart-bar', label: 'Analytics', path: '/admin/reports' }
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, width: 260, height: '100vh',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        zIndex: 1000, transition: 'all 0.3s ease',
        overflowY: 'auto', overflowX: 'hidden', transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
      }}>
        <Link to="/admin" style={{
          padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none'
        }}>
          <div style={{
            width: 48, height: 48, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 24
          }}>
            <i className="fas fa-om"></i>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>Temple ERP</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Admin Panel</div>
          </div>
        </Link>

        <nav style={{ padding: '16px 12px' }}>
          {menuSections.map((section, si) => (
            <div key={si} style={{ marginBottom: 8 }}>
              <div style={{
                fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5,
                color: 'rgba(255,255,255,0.3)', padding: '8px 14px 8px', fontWeight: 600
              }}>{section.title}</div>
              {section.items.map((item, ii) => (
                <Link key={ii} to={item.path} style={{
                  display: 'flex', alignItems: 'center', padding: '12px 14px',
                  color: isActive(item.path) ? '#fff' : 'rgba(255,255,255,0.6)',
                  textDecoration: 'none', borderRadius: 10, marginBottom: 4,
                  background: isActive(item.path) ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { if (!isActive(item.path)) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { if (!isActive(item.path)) e.currentTarget.style.background = 'transparent'; }}
                >
                  <i className={item.icon} style={{ width: 22, fontSize: 16, marginRight: 12, textAlign: 'center' }}></i>
                  <span style={{ fontSize: 14, fontWeight: isActive(item.path) ? 600 : 400, flex: 1 }}>{item.label}</span>
                  {item.badge > 0 && (
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 10, fontWeight: 600,
                      background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)'
                    }}>{item.badge}</span>
                  )}
                </Link>
              ))}
            </div>
          ))}

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', width: '100%', padding: '12px 14px',
              color: '#f87171', background: 'none', border: 'none', borderRadius: 10,
              cursor: 'pointer', fontSize: 14, fontWeight: 500
            }}>
              <i className="fas fa-sign-out-alt" style={{ width: 22, marginRight: 12 }}></i>
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 999, display: 'none'
        }} />
      )}

      {/* Main Content */}
      <main style={{
        marginLeft: sidebarOpen ? 260 : 0, minHeight: '100vh', transition: 'margin-left 0.3s ease'
      }}>
        {/* Topbar */}
        <div style={{
          background: '#fff', padding: '16px 32px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
              background: '#f8fafc', border: '1px solid #e2e8f0', width: 40, height: 40,
              borderRadius: 10, cursor: 'pointer', color: '#475569', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 15 }}>{user?.name || 'Admin'}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{user?.email || 'admin@temple.com'}</div>
            </div>
            <div style={{
              width: 44, height: 44, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 16
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: '24px 32px' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
