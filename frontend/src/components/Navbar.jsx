import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ isAdmin = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const close = () => { setServicesOpen(false); setProfileOpen(false); };
    if (servicesOpen || profileOpen) {
      window.addEventListener('click', close);
    }
    return () => window.removeEventListener('click', close);
  }, [servicesOpen, profileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{
        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff6b35 100%)',
        padding: '12px 0',
        boxShadow: '0 4px 20px rgba(255, 107, 53, 0.4)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/images/temple/icon symbol.webp" alt="Temple" style={{ width: 40, height: 40, animation: 'omPulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 22, fontWeight: 700, color: '#ffd700', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Temple ERP</span>
          </Link>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/login" style={{
              color: '#fff', textDecoration: 'none', padding: '8px 20px', borderRadius: 25,
              border: '2px solid rgba(255,255,255,0.3)', fontWeight: 500
            }}>
              <i className="fas fa-sign-in-alt me-2"></i>Login
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  const navLinkStyle = (active) => ({
    color: 'rgba(255,255,255,0.95)',
    fontWeight: 500,
    padding: '10px 18px',
    borderRadius: 25,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all 0.3s ease',
    background: active ? 'rgba(255,255,255,0.3)' : 'transparent',
    cursor: 'pointer',
    border: 'none',
    fontSize: 14
  });

  return (
    <>
      <nav style={{
        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff6b35 100%)',
        padding: '12px 0',
        boxShadow: '0 4px 20px rgba(255, 107, 53, 0.4)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link to={isAdmin ? "/admin" : "/dashboard"} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/images/temple/icon symbol.webp" alt="Temple" style={{ width: 40, height: 40 }} />
            <span style={{ fontSize: 22, fontWeight: 700, color: '#ffd700', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Temple ERP</span>
          </Link>

          <button onClick={() => setMobileOpen(!mobileOpen)} style={{
            display: 'none', background: 'transparent', border: '2px solid rgba(255,255,255,0.5)',
            borderRadius: 8, padding: 8, color: '#fff', fontSize: 18, cursor: 'pointer'
          }}>
            <i className="fas fa-bars"></i>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Link to="/dashboard" style={navLinkStyle(window.location.pathname === '/dashboard')}>
              <i className="fas fa-home"></i><span>Home</span>
            </Link>
            
            <div style={{ position: 'relative' }}>
              <button onClick={(e) => { e.stopPropagation(); setServicesOpen(!servicesOpen); }} style={navLinkStyle(false)}>
                <i className="fas fa-concierge-bell"></i><span>Services</span><i className="fas fa-caret-down" style={{ fontSize: 12 }}></i>
              </button>
              {servicesOpen && (
                <div onClick={(e) => e.stopPropagation()} style={{
                  position: 'absolute', top: '100%', left: 0, background: '#fff', borderRadius: 16,
                  boxShadow: '0 15px 40px rgba(0,0,0,0.2)', padding: 12, minWidth: 220, zIndex: 100
                }}>
                  <Link to="/dashboard" style={dropdownItemStyle}><i className="fas fa-th-large text-info me-2"></i>All Services</Link>
                  <div style={{ height: 1, background: '#eee', margin: '4px 8px' }} />
                  <Link to="/passes/new" style={dropdownItemStyle}><i className="fas fa-ticket-alt text-primary me-2"></i>Darshan Pass</Link>
                  <Link to="/bookings" style={dropdownItemStyle}><i className="fas fa-hotel text-warning me-2"></i>Room Booking</Link>
                  <Link to="/donations" style={dropdownItemStyle}><i className="fas fa-donate text-success me-2"></i>Donations</Link>
                  <Link to="/restaurant" style={dropdownItemStyle}><i className="fas fa-utensils text-danger me-2"></i>Restaurant</Link>
                </div>
              )}
            </div>

            <Link to="/news" style={navLinkStyle(window.location.pathname === '/news')}>
              <i className="fas fa-newspaper"></i><span>News</span>
            </Link>
            <Link to="/events" style={navLinkStyle(window.location.pathname === '/events')}>
              <i className="fas fa-calendar"></i><span>Events</span>
            </Link>
            <Link to="/festivals" style={navLinkStyle(window.location.pathname === '/festivals')}>
              <i className="fas fa-star"></i><span>Festivals</span>
            </Link>

            <Link to="/passes" style={{
              width: 38, height: 38, borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.2)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', color: '#fff', fontSize: 16,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            >
              <i className="fas fa-bell"></i>
            </Link>

            <div style={{ position: 'relative', marginLeft: 8 }}>
              <button onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); }} style={{
                width: 38, height: 38, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.2)', cursor: 'pointer', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <img src={user?.profile_pic ? `/uploads/profile/${user.profile_pic}` : '/images/default-avatar.svg'} alt="Profile"
                  onError={(e) => { e.target.src = '/images/default-avatar.svg'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
              {profileOpen && (
                <div onClick={(e) => e.stopPropagation()} style={{
                  position: 'absolute', top: '100%', right: 0, background: '#fff', borderRadius: 16,
                  boxShadow: '0 15px 40px rgba(0,0,0,0.2)', minWidth: 260, zIndex: 100, overflow: 'hidden'
                }}>
                  <div style={{
                    padding: 20, textAlign: 'center',
                    background: 'linear-gradient(135deg, #ff6b35, #f7931e)', color: '#fff'
                  }}>
                    <div style={{
                      width: 70, height: 70, borderRadius: '50%', border: '3px solid #ffd700',
                      margin: '0 auto 12px', overflow: 'hidden'
                    }}>
                      <img src={user?.profile_pic ? `/uploads/profile/${user.profile_pic}` : '/images/default-avatar.svg'} alt="Profile"
                        onError={(e) => { e.target.src = '/images/default-avatar.svg'; }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ fontWeight: 600 }}>{user.name || user.email}</div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>{user.email}</div>
                  </div>
                  <div style={{ padding: 8 }}>
                    <Link to="/profile" style={dropdownItemStyle} onClick={() => setProfileOpen(false)}>
                      <i className="fas fa-user-circle me-3 text-primary"></i>My Profile
                    </Link>
                    <Link to="/passes" style={dropdownItemStyle} onClick={() => setProfileOpen(false)}>
                      <i className="fas fa-receipt me-3 text-success"></i>My Receipts
                    </Link>
                    <Link to="/bookings" style={dropdownItemStyle} onClick={() => setProfileOpen(false)}>
                      <i className="fas fa-hotel me-3 text-warning"></i>My Bookings
                    </Link>
                    <Link to="/donations" style={dropdownItemStyle} onClick={() => setProfileOpen(false)}>
                      <i className="fas fa-donate me-3 text-danger"></i>My Donations
                    </Link>
                    <div style={{ height: 1, background: '#eee', margin: '4px 8px' }} />
                    <button onClick={() => { handleLogout(); setProfileOpen(false); }} style={{
                      ...dropdownItemStyle, color: '#dc2626', width: '100%', background: 'none', border: 'none', textAlign: 'left'
                    }}>
                      <i className="fas fa-sign-out-alt me-3"></i>Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        @keyframes omPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </>
  );
};

const dropdownItemStyle = {
  display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: 10,
  textDecoration: 'none', color: '#333', fontWeight: 500, transition: 'all 0.2s ease',
  marginBottom: 4
};

export default Navbar;
