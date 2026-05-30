import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { asset } from '../utils/paths';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [galleryModal, setGalleryModal] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

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

  const link = (path) => user ? path : '/login';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f9fa' }}>
      {/* Navbar */}
      <nav style={{
        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff6b35 100%)',
        padding: '12px 0',
        boxShadow: '0 4px 20px rgba(255, 107, 53, 0.4)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src={asset('/images/temple/icon symbol.webp')} alt="Temple" style={{ width: 40, height: 40 }} />
            <span style={{ fontSize: 22, fontWeight: 700, color: '#ffd700', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Temple ERP</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Link to="/" style={navLink(true)}>
              <i className="fas fa-home"></i><span>Home</span>
            </Link>

            <div style={{ position: 'relative' }}>
              <button onClick={(e) => { e.stopPropagation(); setServicesOpen(!servicesOpen); }} style={navLink(false)}>
                <i className="fas fa-concierge-bell"></i><span>Services</span>
                <i className="fas fa-caret-down" style={{ fontSize: 12 }}></i>
              </button>
              {servicesOpen && (
                <div style={dropdownMenu} onClick={(e) => e.stopPropagation()}>
                  <Link to={link('/dashboard')} style={dropdownItem}><i className="fas fa-th-large text-info me-2"></i>All Services</Link>
                  <div style={divider} />
                  <Link to={link('/passes/new')} style={dropdownItem}><i className="fas fa-ticket-alt text-primary me-2"></i>Darshan Pass</Link>
                  <Link to={link('/bookings')} style={dropdownItem}><i className="fas fa-hotel text-warning me-2"></i>Room Booking</Link>
                  <Link to={link('/donations')} style={dropdownItem}><i className="fas fa-donate text-success me-2"></i>Donations</Link>
                  <Link to={link('/restaurant')} style={dropdownItem}><i className="fas fa-utensils text-danger me-2"></i>Restaurant</Link>
                </div>
              )}
            </div>

            <Link to="/news" style={navLink(false)}>
              <i className="fas fa-newspaper"></i><span>News</span>
            </Link>
            <Link to="/events" style={navLink(false)}>
              <i className="fas fa-calendar"></i><span>Events</span>
            </Link>
            <Link to="/festivals" style={navLink(false)}>
              <i className="fas fa-star"></i><span>Festivals</span>
            </Link>
            <button onClick={() => setGuidelinesOpen(true)} style={navLink(false)}>
              <i className="fas fa-info-circle"></i><span>Guidelines</span>
            </button>

            {user ? (
              <div style={{ position: 'relative', marginLeft: 8 }}>
                <button onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); }} style={{
                  width: 38, height: 38, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.2)', cursor: 'pointer', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <img src={user?.profile_pic ? `/uploads/profile/${user.profile_pic}` : '/images/default-avatar.svg'} alt="Profile"
                    onError={(e) => { e.target.src = asset('/images/default-avatar.svg'); }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
                {profileOpen && (
                  <div onClick={(e) => e.stopPropagation()} style={{ ...dropdownMenu, minWidth: 260 }}>
                    <div style={{ padding: 20, textAlign: 'center', background: 'linear-gradient(135deg, #ff6b35, #f7931e)', color: '#fff' }}>
                      <div style={{ width: 70, height: 70, borderRadius: '50%', border: '3px solid #ffd700', margin: '0 auto 12px', overflow: 'hidden' }}>
                        <img src={user?.profile_pic ? `/uploads/profile/${user.profile_pic}` : asset('/images/default-avatar.svg')} alt="Profile"
                          onError={(e) => { e.target.src = asset('/images/default-avatar.svg'); }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ fontWeight: 600 }}>{user.name || user.email}</div>
                      <div style={{ fontSize: 12, opacity: 0.8 }}>{user.email}</div>
                    </div>
                    <div style={{ padding: 8 }}>
                      <Link to="/profile" style={dropdownItem} onClick={() => setProfileOpen(false)}>
                        <i className="fas fa-user-circle me-3 text-primary"></i>My Profile
                      </Link>
                      <Link to="/passes" style={dropdownItem} onClick={() => setProfileOpen(false)}>
                        <i className="fas fa-receipt me-3 text-success"></i>My Receipts
                      </Link>
                      <div style={divider} />
                      <button onClick={() => { logout(); setProfileOpen(false); navigate('/'); }} style={{
                        ...dropdownItem, color: '#dc2626', width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer'
                      }}>
                        <i className="fas fa-sign-out-alt me-3"></i>Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" style={{
                color: '#fff', textDecoration: 'none', padding: '8px 20px', borderRadius: 25,
                border: '2px solid rgba(255,255,255,0.3)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8
              }}>
                <i className="fas fa-sign-in-alt"></i><span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        backgroundImage: `url(${asset('/assets/images/temple.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          padding: 50,
          borderRadius: 15,
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            color: '#ffd700',
            textShadow: '0 0 20px rgba(255,215,0,0.5)',
            animation: 'glowPulse 2s infinite alternate, fadeInUp 1s ease-out',
            margin: 0
          }}>
            Welcome to Trimbakeshwar Temple
          </h1>
        </div>
      </div>

      {/* Services Section */}
      <div style={{
        padding: '60px 0',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 40, color: '#1e3c72', fontSize: '2rem', fontWeight: 'bold' }}>
            Our Services
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {services.map((s, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 15, padding: 30, textAlign: 'center',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)', transition: 'all 0.3s',
                border: '2px solid transparent', cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.borderColor = '#ffd700';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
              }}
              >
                <div style={{
                  width: 80, height: 80,
                  background: s.isPink ? 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', fontSize: 32, color: '#ffd700'
                }}>
                  <i className={`fas ${s.icon}`}></i>
                </div>
                <h4 style={{ color: '#1e3c72', marginBottom: 15, fontWeight: 600 }}>{s.title}</h4>
                <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: 20 }}>{s.desc}</p>
                <Link to={link(s.link)} style={{
                  display: 'inline-block', padding: '8px 20px', borderRadius: 25,
                  background: s.isPink ? 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' : 'linear-gradient(135deg, #ff6b35, #f7931e)',
                  color: '#fff', textDecoration: 'none', fontWeight: 500, border: 'none', cursor: 'pointer'
                }}>{s.btn}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Temple Timings */}
      <div style={{
        padding: '60px 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 40, color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>
            Temple Timings
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 800, margin: '0 auto' }}>
            <div style={{
              background: 'rgba(255,255,255,0.15)', borderRadius: 15, padding: 30,
              textAlign: 'center', backdropFilter: 'blur(10px)'
            }}>
              <h4 style={{ color: '#ffd700', marginBottom: 15, fontWeight: 600 }}>
                <i className="fas fa-sun"></i> Morning Darshan
              </h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>5:00 AM - 12:00 PM</div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.15)', borderRadius: 15, padding: 30,
              textAlign: 'center', backdropFilter: 'blur(10px)'
            }}>
              <h4 style={{ color: '#ffd700', marginBottom: 15, fontWeight: 600 }}>
                <i className="fas fa-moon"></i> Evening Darshan
              </h4>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>4:00 PM - 8:00 PM</div>
            </div>
          </div>
        </div>
      </div>

      {/* About Temple */}
      <div style={{ padding: '60px 0', background: 'linear-gradient(135deg, #f5f7fa 0%, #e8e8e8 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 40, color: '#1e3c72', fontSize: '2rem', fontWeight: 'bold' }}>
            About Trimbakeshwar Temple
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {aboutCards.map((a, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 15, padding: 30, textAlign: 'center',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)', transition: 'all 0.3s',
                border: '2px solid transparent', cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
              }}
              >
                <div style={{
                  width: 70, height: 70,
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', fontSize: 28, color: '#fff'
                }}>
                  <i className={`fas ${a.icon}`}></i>
                </div>
                <h4 style={{ color: '#1e3c72', marginBottom: 15, fontWeight: 600 }}>{a.title}</h4>
                <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: 0 }}>{a.desc}</p>
                <span onClick={(e) => { e.stopPropagation(); setExpandedCard(a); }} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, color: '#ff6b35',
                  fontWeight: 600, fontSize: '0.9rem', marginTop: 10, cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.gap = '12px'}
                onMouseLeave={(e) => e.currentTarget.style.gap = '8px'}
                >
                  <i className="fas fa-arrow-right"></i> Click to read more
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Temple Gallery */}
      <div style={{ padding: '60px 0', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 40, color: '#1e3c72', fontSize: '2rem', fontWeight: 'bold' }}>
            Temple Gallery
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {galleryImages.map((img, i) => (
              <div key={i} style={{
                position: 'relative', overflow: 'hidden', borderRadius: 15,
                boxShadow: '0 5px 15px rgba(0,0,0,0.2)', cursor: 'pointer'
              }}
              onClick={() => setGalleryModal(img.src)}
              onMouseEnter={(e) => {
                const overlay = e.currentTarget.querySelector('.gallery-overlay');
                if (overlay) overlay.style.opacity = '1';
                const image = e.currentTarget.querySelector('img');
                if (image) image.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                const overlay = e.currentTarget.querySelector('.gallery-overlay');
                if (overlay) overlay.style.opacity = '0';
                const image = e.currentTarget.querySelector('img');
                if (image) image.style.transform = 'scale(1)';
              }}
              >
                <img src={img.src} alt={img.alt} style={{
                  width: '100%', height: 250, objectFit: 'cover', transition: 'transform 0.3s'
                }} />
                <div className="gallery-overlay" style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.3s'
                }}>
                  <i className="fas fa-camera" style={{ color: '#ffd700', fontSize: '2rem' }}></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Lightbox Modal */}
      {galleryModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setGalleryModal(null)}>
          <span style={{
            position: 'absolute', top: 30, right: 40, color: '#fff', fontSize: 40,
            fontWeight: 'bold', cursor: 'pointer', zIndex: 10000
          }} onClick={() => setGalleryModal(null)}>&times;</span>
          <img src={galleryModal} alt="Gallery" style={{
            maxWidth: '90%', maxHeight: '90%', borderRadius: 10,
            boxShadow: '0 10px 50px rgba(0,0,0,0.5)', animation: 'zoomIn 0.4s ease'
          }} />
        </div>
      )}

      {/* Guidelines Modal */}
      {guidelinesOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setGuidelinesOpen(false)}>
          <div style={{
            background: '#fff', borderRadius: 16, maxWidth: 800, width: '90%', maxHeight: '85vh',
            overflow: 'auto', padding: 0
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              background: '#28a745', color: '#fff',
              padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderRadius: '16px 16px 0 0'
            }}>
              <h5 style={{ margin: 0 }}><i className="fas fa-info-circle me-2"></i>Temple Guidelines & Visitor Information</h5>
              <button onClick={() => setGuidelinesOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div style={{ padding: 24 }}>
              <h6 style={{ color: '#28a745', fontWeight: 'bold', marginBottom: 12 }}><i className="fas fa-clock me-2"></i>Temple Timings</h6>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, border: '1px solid #dee2e6' }}>
                <tbody>
                  {timingsData.map((t, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #dee2e6', background: i % 2 === 0 ? '#f8f9fa' : '#fff' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 600 }}>{t.activity}</td>
                      <td style={{ padding: '8px 12px', color: '#666' }}>{t.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h6 style={{ color: '#28a745', fontWeight: 'bold', marginTop: 20, marginBottom: 12 }}><i className="fas fa-tshirt me-2"></i>Dress Code</h6>
              <div style={{ background: '#d1ecf1', border: '1px solid #bee5eb', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}><i className="fas fa-male me-2"></i>Men</div>
                    <ul style={{ paddingLeft: 20, margin: 0, fontSize: 14 }}>
                      <li>Dhoti, Kurta-Pajama</li>
                      <li>Full pants with shirt</li>
                      <li>White dhoti for puja</li>
                    </ul>
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}><i className="fas fa-female me-2"></i>Women</div>
                    <ul style={{ paddingLeft: 20, margin: 0, fontSize: 14 }}>
                      <li>Saree, Salwar Kameez</li>
                      <li>Long skirt with dupatta</li>
                      <li>Traditional dress</li>
                    </ul>
                  </div>
                </div>
                <div style={{ color: '#dc2626', fontSize: 12, marginTop: 12 }}><strong>Not allowed:</strong> Jeans, shorts, sleeveless tops, western outfits</div>
              </div>

              <h6 style={{ color: '#28a745', fontWeight: 'bold', marginBottom: 12 }}><i className="fas fa-list-check me-2"></i>Do's and Don'ts</h6>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div style={{ border: '1px solid #28a745', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ background: '#28a745', color: '#fff', padding: '8px 12px', fontWeight: 600, fontSize: 14 }}>
                    <i className="fas fa-check me-2"></i>Do's
                  </div>
                  {dos.map((d, i) => (
                    <div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid #eee', fontSize: 13 }}>{d}</div>
                  ))}
                </div>
                <div style={{ border: '1px solid #dc3545', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ background: '#dc3545', color: '#fff', padding: '8px 12px', fontWeight: 600, fontSize: 14 }}>
                    <i className="fas fa-times me-2"></i>Don'ts
                  </div>
                  {donts.map((d, i) => (
                    <div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid #eee', fontSize: 13 }}>{d}</div>
                  ))}
                </div>
              </div>

              <h6 style={{ color: '#28a745', fontWeight: 'bold', marginBottom: 12 }}><i className="fas fa-lightbulb me-2"></i>Visitor Tips</h6>
              <div style={{ background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: 10, padding: 16 }}>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14 }}>
                  <li><strong>Best time:</strong> Weekdays, before 8 AM</li>
                  <li><strong>Avoid:</strong> Mondays, Shravan month, festivals</li>
                  <li><strong>VIP Pass:</strong> Book online to skip queues</li>
                  <li><strong>Cash:</strong> Carry cash - many don't accept digital payments</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: '#fff',
        padding: '60px 0 0',
        marginTop: 60
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 40 }}>
            {/* About */}
            <div>
              <h4 style={{
                color: '#ffd700', fontSize: '1.2rem', fontWeight: 600, marginBottom: 20,
                paddingBottom: 10, position: 'relative'
              }}>
                Trimbakeshwar Temple
                <span style={{
                  position: 'absolute', bottom: 0, left: 0, width: 50, height: 3,
                  background: 'linear-gradient(90deg, #ffd700, #ff6b35)', borderRadius: 2
                }}></span>
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 20 }}>
                Experience the divine aura of Lord Shiva at Trimbakeshwar, one of the most sacred temples in India. Book darshan passes, room bookings, and donations online.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                {['fa-facebook-f', 'fa-instagram', 'fa-youtube', 'fa-twitter'].map((icon, i) => (
                  <span key={i} style={{
                    width: 40, height: 40, background: 'rgba(255,255,255,0.1)', borderRadius: '50%',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                    textDecoration: 'none', transition: 'all 0.3s ease', fontSize: 14, cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ff6b35, #f7931e)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                    <i className={`fab ${icon}`}></i>
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{
                color: '#ffd700', fontSize: '1.2rem', fontWeight: 600, marginBottom: 20,
                paddingBottom: 10, position: 'relative'
              }}>
                Quick Links
                <span style={{
                  position: 'absolute', bottom: 0, left: 0, width: 50, height: 3,
                  background: 'linear-gradient(90deg, #ffd700, #ff6b35)', borderRadius: 2
                }}></span>
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { icon: 'fa-chevron-right', label: 'Home', path: '/' },
                  { icon: 'fa-chevron-right', label: 'Services', path: '/dashboard' },
                  { icon: 'fa-chevron-right', label: 'News', path: '/news' },
                  { icon: 'fa-chevron-right', label: 'Events', path: '/events' },
                  { icon: 'fa-chevron-right', label: 'Festivals', path: '/festivals' },
                ].map((item, i) => (
                  <li key={i} style={{ marginBottom: 12 }}>
                    <Link to={item.path} style={{
                      color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex',
                      alignItems: 'center', gap: 10, fontSize: '0.95rem', transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffd700';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                    >
                      <i className={`fas ${item.icon}`} style={{ fontSize: '0.7rem', color: '#ff6b35' }}></i>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 style={{
                color: '#ffd700', fontSize: '1.2rem', fontWeight: 600, marginBottom: 20,
                paddingBottom: 10, position: 'relative'
              }}>
                Services
                <span style={{
                  position: 'absolute', bottom: 0, left: 0, width: 50, height: 3,
                  background: 'linear-gradient(90deg, #ffd700, #ff6b35)', borderRadius: 2
                }}></span>
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { icon: 'fa-ticket-alt', label: 'Darshan Pass', path: '/passes/new' },
                  { icon: 'fa-hotel', label: 'Room Booking', path: '/bookings' },
                  { icon: 'fa-donate', label: 'Donations', path: '/donations' },
                  { icon: 'fa-utensils', label: 'Restaurant', path: '/restaurant' },
                  { icon: 'fa-concierge-bell', label: 'All Services', path: '/dashboard' },
                ].map((item, i) => (
                  <li key={i} style={{ marginBottom: 12 }}>
                    <Link to={link(item.path)} style={{
                      color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex',
                      alignItems: 'center', gap: 10, fontSize: '0.95rem', transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffd700';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                    >
                      <i className={`fas ${item.icon}`} style={{ fontSize: '0.7rem', color: '#ff6b35' }}></i>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{
                color: '#ffd700', fontSize: '1.2rem', fontWeight: 600, marginBottom: 20,
                paddingBottom: 10, position: 'relative'
              }}>
                Contact Us
                <span style={{
                  position: 'absolute', bottom: 0, left: 0, width: 50, height: 3,
                  background: 'linear-gradient(90deg, #ffd700, #ff6b35)', borderRadius: 2
                }}></span>
              </h4>
              {[
                { icon: 'fa-map-marker-alt', text: 'Trimbakeshwar Temple, Nashik, Maharashtra - 422212' },
                { icon: 'fa-phone', text: '+91 12345 67890' },
                { icon: 'fa-envelope', text: 'info@trimbakeshtemple.com' },
                { icon: 'fa-clock', text: 'Morning: 5:00 AM - 12:00 PM\nEvening: 4:00 PM - 8:00 PM' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 15, color: 'rgba(255,255,255,0.7)' }}>
                  <i className={`fas ${item.icon}`} style={{ color: '#ffd700', marginTop: 4 }}></i>
                  <span style={{ fontSize: '0.95rem', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={{
          background: 'rgba(0,0,0,0.3)', padding: '20px 0', marginTop: 40,
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: 0 }}>
              © 2025 Trimbakeshwar Temple. All Rights Reserved.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: 0 }}>
              Powered by <span style={{ color: '#ffd700', textDecoration: 'none', fontWeight: 600 }}>Temple ERP</span>
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes omPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes glowPulse {
          from { text-shadow: 0 0 10px #ffd700, 0 0 20px #ff9900, 0 0 30px #ff6600; }
          to { text-shadow: 0 0 20px #ffff66, 0 0 30px #ffd700, 0 0 40px #ff9900; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoomIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

const navLink = (active) => ({
  color: active ? '#fff' : 'rgba(255,255,255,0.95)',
  fontWeight: 500, padding: '10px 18px', borderRadius: 25, textDecoration: 'none',
  display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.3s ease',
  background: active ? 'rgba(255,255,255,0.3)' : 'transparent',
  cursor: 'pointer', border: 'none', fontSize: 14
});

const dropdownMenu = {
  position: 'absolute', top: '100%', left: 0, background: '#fff', borderRadius: 16,
  boxShadow: '0 15px 40px rgba(0,0,0,0.2)', padding: 12, minWidth: 220, zIndex: 100
};

const dropdownItem = {
  display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: 10,
  textDecoration: 'none', color: '#333', fontWeight: 500, transition: 'all 0.2s ease', marginBottom: 4
};

const divider = { height: 1, background: '#eee', margin: '4px 8px' };

const services = [
  { icon: 'fa-ticket-alt', title: 'Darshan Pass', desc: 'Book your darshan pass online and skip the queue. Get instant QR code for temple entry.', btn: 'Book Now', link: '/passes/new' },
  { icon: 'fa-hotel', title: 'Room Booking', desc: 'Stay at temple guest house during your visit. Comfortable rooms at affordable rates.', btn: 'Book Now', link: '/bookings' },
  { icon: 'fa-donate', title: 'Donations', desc: 'Contribute to temple development and charity. Your donation makes a difference.', btn: 'Donate Now', link: '/donations' },
  { icon: 'fa-utensils', title: 'Restaurant', desc: 'Enjoy delicious vegetarian meals and prasad at our temple restaurant.', btn: 'Order Now', link: '/restaurant', isPink: true },
];

const aboutCards = [
  {
    icon: 'fa-history', title: 'Temple History',
    desc: 'Trimbakeshwar is one of the most sacred temples in India, dedicated to Lord Shiva. The temple is believed to be built by Rajarshi Shrimant Sadashivrao Bhau Saheb in 1750-1800 AD.',
    longDesc: 'Trimbakeshwar Temple, located in the Nashik district of Maharashtra, is one of the twelve Jyotirlingas in India. The temple was constructed by Rajarshi Shrimant Sadashivrao Bhau Saheb between 1750 and 1800 AD. The temple architecture reflects the Hemadpanti style with intricate carvings and stone work. The temple complex houses three lingas representing Lord Brahma, Lord Vishnu, and Lord Shiva. The sacred river Godavari originates from the Brahmagiri hills near the temple. The temple holds immense religious significance and attracts millions of pilgrims every year.'
  },
  {
    icon: 'fa-pray', title: 'Sacred Deity',
    desc: 'The presiding deity is Lord Trimbakeshwar (Lord Shiva). The lingam is believed to represent the cosmic pillar (Stambha) that supports the universe.',
    longDesc: 'Lord Trimbakeshwar is a manifestation of Lord Shiva as the cosmic pillar. Unlike other Jyotirlingas, Trimbakeshwar has three lingas (Trinity) representing Brahma, Vishnu, and Shiva, all housed in a single temple. The lingam is believed to be self-manifested (Swayambhu) and is one of the most revered Shiva temples in India. The temple also houses idols of Goddess Parvati, Lord Ganesha, and Nandi. The unique feature of this Jyotirlinga is that it has three faces representing the Trimurti.'
  },
  {
    icon: 'fa-calendar-alt', title: 'Major Festivals',
    desc: 'Mahashivratri is the biggest festival celebrated with great enthusiasm. Other festivals include Shravan month, Navratri, and Kartik Poornima.',
    longDesc: 'Mahashivratri is the most significant festival at Trimbakeshwar, celebrated with grand processions, all-night vigils, and special poojas. The Shravan month (July-August) sees a huge influx of devotees performing Rudrabhishek and Jalabhishek. Navratri is celebrated with Durga pooja and special decorations. Kartik Poornima attracts thousands for the holy dip in Kushavart Kund. Somvati Amavasya and Pradosh are other important observances. The annual fair during Mahashivratri draws millions of pilgrims from across India.'
  },
  {
    icon: 'fa-hands-praying', title: 'Pooja Services',
    desc: 'Various poojas like Rudrabhishek, Mahashivratri Pooja, and Laghu Rudra can be booked online. Special sevas are conducted daily.',
    longDesc: 'The temple offers a wide range of pooja services that can be booked online. Rudrabhishek involves chanting of Rudra Mantras while offering milk, curd, honey, and sacred leaves to the Shiva lingam. Laghu Rudra is a shorter version of the Rudra Path. Atirudra Mahayajna is performed on special occasions. Daily sevas include Kakad Aarti, Madhyan Pooja, and Shej Aarti. Special arrangements can be made for Satyanarayan Pooja, Griha Pravesh, and other ceremonies. All poojas are conducted by experienced Vedic priests following traditional rituals.'
  },
];

const galleryImages = [
  { src: asset('/assets/images/Trimbakeshwar-Jyotirling.jpg'), alt: 'Trimbakeshwar Temple' },
  { src: asset('/assets/images/temple.jpg'), alt: 'Temple View' },
  { src: asset('/assets/images/Brahmagiri.jpg'), alt: 'Braghmagiri Hills' },
  { src: asset('/assets/images/Tryambakeshvara1.jpg'), alt: 'Lord Shiva' },
  { src: asset('/assets/images/kushavart1.jpg'), alt: 'Kushavart' },
  { src: asset('/assets/images/trimbak.jpg'), alt: 'Trimbak' },
];

const timingsData = [
  { activity: 'Temple Opening', time: '5:30 AM' },
  { activity: 'Kakad Aarti (Morning)', time: '5:30 AM - 6:00 AM' },
  { activity: 'General Darshan', time: '5:30 AM - 9:00 PM' },
  { activity: 'Madhyan Pooja', time: '1:00 PM - 1:30 PM' },
  { activity: 'Evening Aarti', time: '7:00 PM - 8:00 PM' },
  { activity: 'Temple Closing', time: '9:00 PM' },
  { activity: 'Rudrabhishek', time: '6:00 AM - 7:00 AM' },
  { activity: 'Golden Mukut Darshan', time: 'Every Monday 4:30 PM' },
];

const dos = [
  'Remove footwear before entering',
  'Dress modestly',
  'Follow temple timings',
  'Respect priests and staff',
  'Carry valid ID proof',
  'Use cloakroom for phones',
  'Take dip in Kushavarta Kund',
];

const donts = [
  'No mobile phones inside',
  'No photography',
  'No leather items',
  'No alcohol',
  'No loud noises',
  "Don't touch lingam",
  "Don't litter",
];

export default Home;
