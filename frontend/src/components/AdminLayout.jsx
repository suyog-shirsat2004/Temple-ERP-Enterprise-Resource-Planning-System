import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuSections = [
    {
      title: 'Main',
      items: [
        { icon: 'fas fa-home', label: 'Dashboard', path: '/admin' }
      ]
    },
    {
      title: 'Services',
      items: [
        { icon: 'fas fa-ticket-alt', label: 'Darshan Passes', path: '/admin/passes' },
        { icon: 'fas fa-hotel', label: 'Room Bookings', path: '/admin/bookings' },
        { icon: 'fas fa-door-open', label: 'Room Management', path: '/admin/rooms' },
        { icon: 'fas fa-utensils', label: 'Restaurant', path: '/admin/restaurant' },
        { icon: 'fas fa-donate', label: 'Donations', path: '/admin/donations' }
      ]
    },
    {
      title: 'Content',
      items: [
        { icon: 'fas fa-calendar-star', label: 'Festivals', path: '/admin/festivals' },
        { icon: 'fas fa-calendar-alt', label: 'Events', path: '/admin/events' },
        { icon: 'fas fa-newspaper', label: 'News', path: '/admin/news' },
        { icon: 'fas fa-bullhorn', label: 'Temple Updates', path: '/admin/updates' }
      ]
    },
    {
      title: 'Users',
      items: [
        { icon: 'fas fa-users', label: 'Devotees', path: '/admin/devotees' },
        { icon: 'fas fa-user-shield', label: 'Admin Users', path: '/admin/users' }
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
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#f1f5f9', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, width: 260, height: '100vh',
        background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
        zIndex: 1000, transition: 'all 0.3s ease',
        overflowY: 'auto', transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
      }}>
        <Link to="/admin" style={{
          padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none'
        }}>
          <div style={{
            width: 40, height: 40, background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 20
          }}>
            <i className="fas fa-om"></i>
          </div>
          <div style={{ color: '#fff' }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Temple ERP</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Admin Panel</div>
          </div>
        </Link>

        <nav style={{ padding: '12px 10px' }}>
          {menuSections.map((section, si) => (
            <div key={si} style={{ marginBottom: 6 }}>
              <div style={{
                fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2,
                color: 'rgba(255,255,255,0.35)', padding: '10px 10px 6px', fontWeight: 600
              }}>{section.title}</div>
              {section.items.map((item, ii) => (
                <Link key={ii} to={item.path} style={{
                  display: 'flex', alignItems: 'center', padding: '10px 14px',
                  color: isActive(item.path) ? '#fff' : 'rgba(255,255,255,0.65)',
                  textDecoration: 'none', borderRadius: 8, marginBottom: 2,
                  background: isActive(item.path) ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                  borderLeft: isActive(item.path) ? '3px solid #f59e0b' : '3px solid transparent',
                  transition: 'all 0.2s ease'
                }}>
                  <i className={item.icon} style={{ width: 20, fontSize: 15, marginRight: 10 }}></i>
                  <span style={{ fontSize: 13.5, fontWeight: isActive(item.path) ? 600 : 400 }}>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', width: '100%', padding: '10px 14px',
              color: '#f87171', background: 'none', border: 'none', borderRadius: 8,
              cursor: 'pointer', fontSize: 13.5, fontWeight: 500
            }}>
              <i className="fas fa-sign-out-alt" style={{ width: 20, marginRight: 10 }}></i>
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
          background: '#fff', padding: '12px 24px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
              background: '#f8fafc', border: 'none', width: 36, height: 36,
              borderRadius: 8, cursor: 'pointer', color: '#475569', fontSize: 16
            }}>
              <i className="fas fa-bars"></i>
            </button>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0 }}>{title || 'Dashboard'}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 600, fontSize: 14
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>{user?.name || 'Admin'}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>Administrator</div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: 24 }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
