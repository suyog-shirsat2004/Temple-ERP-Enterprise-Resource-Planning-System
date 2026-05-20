import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDarshanModal, setShowDarshanModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);

  useEffect(() => {
    api.get('/dashboard').then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <i className="fa fa-spinner fa-spin" style={{ fontSize: 32, color: '#ff6600' }}></i>
    </div>
  );

  if (!data) return <div style={{ padding: 24 }}>Failed to load dashboard</div>;

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      minHeight: '100vh',
      paddingTop: 80
    }}>
      {/* Main Content */}
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '30px 24px',
        position: 'relative', zIndex: 1
      }}>
        {/* Welcome Card */}
        <div style={{
          background: 'linear-gradient(135deg, #ff6600 0%, #ff9900 100%)',
          borderRadius: 20,
          padding: 30,
          color: 'white',
          marginBottom: 30,
          boxShadow: '0 10px 30px rgba(255,102,0,0.3)'
        }}>
          <h2 style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 40, verticalAlign: 'middle', marginRight: 10 }}>🕉️</span>
            Welcome, {data.user_data?.name || user?.name || 'Devotee'}!
          </h2>
          <p style={{ margin: 0 }}>Book darshan passes, donate online, and stay updated with temple events.</p>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          marginBottom: 30
        }}>
          {[
            { icon: 'fa-ticket-alt', title: 'Book Darshan', desc: 'Book your darshan pass online', action: () => setShowDarshanModal(true) },
            { icon: 'fa-donate', title: 'Donate', desc: 'Contribute to temple development', action: () => setShowDonationModal(true) },
            { icon: 'fa-calendar-alt', title: 'Events', desc: 'View upcoming temple events', link: '/events' }
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.98)',
              borderRadius: 20,
              padding: 30,
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              transition: '0.3s',
              textAlign: 'center',
              height: '100%',
              border: '2px solid transparent',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.borderColor = '#ff6600';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(255,102,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
            }}
            >
              <div style={{
                width: 70,
                height: 70,
                background: 'linear-gradient(135deg, #ff6600, #ff9900)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: 28,
                color: 'white'
              }}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              <h4 style={{ color: '#333', marginBottom: 10 }}>{item.title}</h4>
              <p style={{ color: '#666', marginBottom: 20 }}>{item.desc}</p>
              {item.link ? (
                <Link to={item.link} style={{
                  background: 'linear-gradient(135deg, #ff6600, #ff9900)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: 20,
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  border: 'none'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  View Events
                </Link>
              ) : (
                <button onClick={item.action} style={{
                  background: 'linear-gradient(135deg, #ff6600, #ff9900)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: 20,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <i className="fas fa-plus" style={{ marginRight: 8 }}></i>
                  {item.title === 'Book Darshan' ? 'Book Now' : 'Donate Now'}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* My Darshan Bookings */}
        <div style={{
          background: 'rgba(255,255,255,0.98)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          marginBottom: 30
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ff6600, #ff9900)',
            color: 'white',
            padding: '20px 30px',
            fontWeight: 600,
            fontSize: 16
          }}>
            <i className="fas fa-ticket-alt" style={{ marginRight: 8 }}></i>
            My Darshan Bookings
          </div>
          <div style={{ padding: 0 }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              margin: 0
            }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: 15, textAlign: 'left', fontWeight: 600, color: '#333', border: 'none' }}>Booking ID</th>
                  <th style={{ padding: 15, textAlign: 'left', fontWeight: 600, color: '#333', border: 'none' }}>Date</th>
                  <th style={{ padding: 15, textAlign: 'left', fontWeight: 600, color: '#333', border: 'none' }}>Time</th>
                  <th style={{ padding: 15, textAlign: 'left', fontWeight: 600, color: '#333', border: 'none' }}>Persons</th>
                  <th style={{ padding: 15, textAlign: 'left', fontWeight: 600, color: '#333', border: 'none' }}>Status</th>
                  <th style={{ padding: 15, textAlign: 'left', fontWeight: 600, color: '#333', border: 'none' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.passes?.length > 0 ? data.passes.map((booking, idx) => (
                  <tr key={booking.id} style={{
                    borderBottom: idx < data.passes.length - 1 ? '1px solid #eee' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,102,0,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: 15 }}>{booking.pass_id || booking.id}</td>
                    <td style={{ padding: 15 }}>{booking.visit_date || booking.booking_date}</td>
                    <td style={{ padding: 15 }}>{booking.time_slot || booking.booking_time}</td>
                    <td style={{ padding: 15 }}>{booking.num_persons || booking.no_of_persons}</td>
                    <td style={{ padding: 15 }}>
                      <span style={{
                        padding: '5px 15px',
                        borderRadius: 20,
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: booking.status === 'approved' ? '#d4edda' : booking.status === 'pending' ? '#fff3cd' : '#f8d7da',
                        color: booking.status === 'approved' ? '#155724' : booking.status === 'pending' ? '#856404' : '#721c24'
                      }}>
                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: 15 }}>
                      {booking.status !== 'cancelled' && booking.status !== 'rejected' && (
                        <button style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: 14
                        }}>
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                      No bookings yet. <Link to="/passes/new" style={{ color: '#ff6600' }}>Book your darshan pass now!</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Events */}
        <div style={{
          background: 'rgba(255,255,255,0.98)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
        }} id="events">
          <div style={{
            background: 'linear-gradient(135deg, #ff6600, #ff9900)',
            color: 'white',
            padding: '20px 30px',
            fontWeight: 600,
            fontSize: 16
          }}>
            <i className="fas fa-calendar-alt" style={{ marginRight: 8 }}></i>
            Upcoming Temple Events
          </div>
          <div style={{ padding: 0 }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              margin: 0
            }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: 15, textAlign: 'left', fontWeight: 600, color: '#333', border: 'none' }}>Event</th>
                  <th style={{ padding: 15, textAlign: 'left', fontWeight: 600, color: '#333', border: 'none' }}>Date</th>
                  <th style={{ padding: 15, textAlign: 'left', fontWeight: 600, color: '#333', border: 'none' }}>Time</th>
                  <th style={{ padding: 15, textAlign: 'left', fontWeight: 600, color: '#333', border: 'none' }}>Location</th>
                  <th style={{ padding: 15, textAlign: 'left', fontWeight: 600, color: '#333', border: 'none' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {data.events?.length > 0 ? data.events.map((event, idx) => (
                  <tr key={event.id} style={{
                    borderBottom: idx < data.events.length - 1 ? '1px solid #eee' : 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,102,0,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: 15, fontWeight: 600 }}>{event.name}</td>
                    <td style={{ padding: 15 }}>{event.event_date ? new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</td>
                    <td style={{ padding: 15 }}>{event.event_time || 'N/A'}</td>
                    <td style={{ padding: 15 }}>{event.location || 'Temple Premises'}</td>
                    <td style={{ padding: 15 }}>{event.description?.substring(0, 50)}...</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No upcoming events</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Darshan Booking Modal */}
      {showDarshanModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: 'white',
            borderRadius: 15,
            width: '100%',
            maxWidth: 500,
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #ff6600, #ff9900)',
              color: 'white',
              padding: '20px 30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h5 style={{ margin: 0, fontWeight: 600 }}>Book Darshan Pass</h5>
              <button onClick={() => setShowDarshanModal(false)} style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: 24,
                cursor: 'pointer'
              }}>×</button>
            </div>
            <div style={{ padding: 30 }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontWeight: 500, color: '#333', marginBottom: 8, display: 'block' }}>Booking Date</label>
                <input type="date" min={new Date().toISOString().split('T')[0]} style={{
                  width: '100%',
                  padding: 14,
                  border: '2px solid #e5e7eb',
                  borderRadius: 12,
                  fontSize: 14
                }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontWeight: 500, color: '#333', marginBottom: 8, display: 'block' }}>Preferred Time</label>
                <select style={{
                  width: '100%',
                  padding: 14,
                  border: '2px solid #e5e7eb',
                  borderRadius: 12,
                  fontSize: 14
                }}>
                  <option value="06:00:00">6:00 AM - Morning</option>
                  <option value="12:00:00">12:00 PM - Afternoon</option>
                  <option value="18:00:00">6:00 PM - Evening</option>
                </select>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontWeight: 500, color: '#333', marginBottom: 8, display: 'block' }}>Number of Persons</label>
                <input type="number" min="1" max="10" defaultValue="1" style={{
                  width: '100%',
                  padding: 14,
                  border: '2px solid #e5e7eb',
                  borderRadius: 12,
                  fontSize: 14
                }} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setShowDarshanModal(false)} style={{
                  flex: 1,
                  padding: 14,
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontWeight: 500
                }}>Cancel</button>
                <button style={{
                  flex: 1,
                  padding: 14,
                  background: 'linear-gradient(135deg, #ff6600, #ff9900)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontWeight: 500
                }}>Book Now</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Donation Modal */}
      {showDonationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: 'white',
            borderRadius: 15,
            width: '100%',
            maxWidth: 500,
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #ff6600, #ff9900)',
              color: 'white',
              padding: '20px 30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h5 style={{ margin: 0, fontWeight: 600 }}>Make a Donation</h5>
              <button onClick={() => setShowDonationModal(false)} style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: 24,
                cursor: 'pointer'
              }}>×</button>
            </div>
            <div style={{ padding: 30 }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontWeight: 500, color: '#333', marginBottom: 8, display: 'block' }}>Donation Amount (₹)</label>
                <input type="number" placeholder="Enter amount" min="10" style={{
                  width: '100%',
                  padding: 14,
                  border: '2px solid #e5e7eb',
                  borderRadius: 12,
                  fontSize: 14
                }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontWeight: 500, color: '#333', marginBottom: 8, display: 'block' }}>Payment Method</label>
                <select style={{
                  width: '100%',
                  padding: 14,
                  border: '2px solid #e5e7eb',
                  borderRadius: 12,
                  fontSize: 14
                }}>
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash">Cash at Temple</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setShowDonationModal(false)} style={{
                  flex: 1,
                  padding: 14,
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontWeight: 500
                }}>Cancel</button>
                <button style={{
                  flex: 1,
                  padding: 14,
                  background: 'linear-gradient(135deg, #ff6600, #ff9900)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  cursor: 'pointer',
                  fontWeight: 500
                }}>Donate Now</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-100px) translateX(50px); opacity: 0.6; }
          50% { transform: translateY(-50px) translateX(-30px); opacity: 0.4; }
          75% { transform: translateY(-150px) translateX(20px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
