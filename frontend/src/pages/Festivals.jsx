import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Festivals = () => {
  const [festivals, setFestivals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get('/festivals').then(res => {
      setFestivals(res.data.festivals || res.data || []);
    }).catch(() => setFestivals([]));
  }, []);

  const filteredFestivals = filter === 'all' ? festivals : festivals.filter(f => f.status === filter);

  const openModal = (festival) => {
    setSelectedFestival(festival);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFestival(null);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ongoing': return { background: 'linear-gradient(135deg, #22c55e, #16a34a)', text: 'Ongoing' };
      case 'upcoming': return { background: 'linear-gradient(135deg, #ec4899, #db2777)', text: 'Upcoming' };
      case 'completed': return { background: 'linear-gradient(135deg, #6b7280, #4b5563)', text: 'Completed' };
      default: return { background: 'linear-gradient(135deg, #ec4899, #db2777)', text: 'Upcoming' };
    }
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
        padding: '80px 0 120px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top:0, left:0, right:0, bottom:0,
          background: 'url(/images/temple/icon-symbol.webp) no-repeat center center',
          backgroundSize: 250, opacity: 0.1, animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            color: '#ffd700', fontSize: '3rem', fontWeight: 700,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)', marginBottom: 15,
            animation: 'slideInDown 0.8s ease-out'
          }}><i className="fas fa-star" style={{ marginRight: 20 }}></i>Festivals</h1>
          <p style={{
            color: 'rgba(255,255,255,0.95)', fontSize: '1.2rem',
            animation: 'slideInUp 0.8s ease-out'
          }}>Celebrate sacred festivals at Trimbakeshwar Temple</p>
        </div>
        <div style={{
          position: 'absolute', bottom: -50, left:0, right:0,
          height: 100, background: 'linear-gradient(to top, #f8fafc, transparent)'
        }}></div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, paddingBottom: 80 }}>
        {/* Filter Buttons */}
        <div style={{
          position: 'relative', zIndex: 10, marginTop: -50, marginBottom: 40, textAlign: 'center'
        }}>
          {[
            { key: 'all', label: 'All Festivals', icon: 'fa-globe' },
            { key: 'upcoming', label: 'Upcoming', icon: 'fa-clock' },
            { key: 'ongoing', label: 'Ongoing', icon: 'fa-play-circle' },
            { key: 'completed', label: 'Completed', icon: 'fa-check-circle' }
          ].map(btn => (
            <button key={btn.key} onClick={() => setFilter(btn.key)}
              style={{
                background: filter === btn.key ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' : '#fff',
                border: '2px solid transparent', color: filter === btn.key ? 'white' : '#1e3c72',
                padding: '12px 24px', borderRadius: 50, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                margin: 5
              }}
              onMouseEnter={(e) => {
                if (filter !== btn.key) {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              <i className={`fas ${btn.icon}`} style={{ marginRight: 8, transition: 'transform 0.3s ease' }}></i>
              {btn.label}
            </button>
          ))}
        </div>

        {filteredFestivals.length > 0 ? (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 30, padding: '0 20px'
          }}>
            {filteredFestivals.map((festival, index) => {
              const status = getStatusColor(festival.status);
              return (
                <div key={festival.id} onClick={() => openModal(festival)}
                  style={{
                    background: '#fff', borderRadius: 20, overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', height: '100%',
                    position: 'relative', cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 25px 60px rgba(139, 92, 246, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{ height: 220, position: 'relative', overflow: 'hidden' }}>
                    {festival.image ? (
                      <img src={`/${festival.image}`} alt={festival.name} style={{
                        width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.15) rotate(-2deg)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1) rotate(0deg)'}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      />
                    ) : null}
                    <div style={{
                      width: '100%', height: '100%', display: festival.image ? 'none' : 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
                    }}>
                      <i className="fas fa-star" style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.5)', animation: 'pulse-icon 2s infinite' }}></i>
                    </div>
                    <span style={{
                      position: 'absolute', top: 15, right: 15, padding: '8px 18px',
                      borderRadius: 25, fontSize: '0.8rem', fontWeight: 700,
                      textTransform: 'uppercase', animation: 'pulse 2s infinite',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)', color: 'white',
                      background: status.background
                    }}>
                      <i className="fas fa-star" style={{ marginRight: 6 }}></i>
                      {status.text}
                    </span>
                  </div>
                  <div style={{ padding: 25 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#8b5cf6', fontWeight: 600, fontSize: '0.9rem', marginBottom: 12 }}>
                      <i className="fas fa-calendar-day"></i>
                      {new Date(festival.festival_date || festival.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h3 style={{
                      color: '#1e3c72', fontSize: '1.4rem', fontWeight: 700, marginBottom: 12, lineHeight: 1.4,
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#8b5cf6'}
                    onMouseLeave={(e) => e.target.style.color = '#1e3c72'}
                    >{festival.name}</h3>
                    <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 20 }}>
                      {(festival.description || 'Celebrate this sacred festival...').substring(0, 100)}...
                    </p>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', paddingTop: 15, borderTop: '1px solid #eee' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#888', transition: 'all 0.3s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
                      >
                        <i className="fas fa-clock" style={{ color: '#8b5cf6' }}></i>
                        {festival.festival_time ? new Date('2024-01-01T' + festival.festival_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '6:00 AM'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#888', transition: 'all 0.3s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#8b5cf6'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
                      >
                        <i className="fas fa-map-marker-alt" style={{ color: '#8b5cf6' }}></i>
                        {festival.location || 'Temple Complex'}
                      </div>
                    </div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: 'white',
                      padding: '10px 20px', borderRadius: 25, fontWeight: 600,
                      textDecoration: 'none', transition: 'all 0.3s ease', marginTop: 15, cursor: 'pointer'
                    }}
                    onClick={(e) => { e.stopPropagation(); openModal(festival); }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                      View Details <i className="fas fa-arrow-right" style={{ transition: 'transform 0.3s ease' }}></i>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: 20,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)', transition: 'all 0.3s ease', margin: '0 20px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <i className="fas fa-star-times" style={{ fontSize: '5rem', color: '#ddd', marginBottom: 25, display: 'block', animation: 'float 3s ease-in-out infinite' }}></i>
            <h4 style={{ color: '#666', fontSize: '1.5rem', marginBottom: 10 }}>No Upcoming Festivals</h4>
            <p style={{ color: '#999' }}>Check back soon for upcoming festivals at Trimbakeshwar Temple</p>
            <a href="/events" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)', color: 'white',
              padding: '12px 28px', borderRadius: 25, fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.3s ease', marginTop: 20
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <i className="fas fa-calendar" style={{ marginRight: 8 }}></i>View Events
            </a>
          </div>
        )}
      </div>

      {/* Festival Modal */}
      {showModal && selectedFestival && (
        <div style={{
          position: 'fixed', top:0, left:0, right:0, bottom:0,
          background: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={closeModal}>
          <div style={{
            background: 'white', borderRadius: 20, border: 'none',
            width: '90%', maxWidth: 700, maxHeight: '80vh', overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
              color: 'white', padding: '20px 25px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <h5 style={{ margin:0, fontWeight: 700 }}>{selectedFestival.name}</h5>
              <button onClick={closeModal} style={{
                background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
                width: 35, height: 35, borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem'
              }}>×</button>
            </div>
            <div style={{ padding: 25 }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <span style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  color: 'white', padding: '8px 18px', borderRadius: 25, fontSize: '0.8rem', fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  <i className="fas fa-star" style={{ marginRight: 6 }}></i>
                  {selectedFestival.status ? selectedFestival.status.charAt(0).toUpperCase() + selectedFestival.status.slice(1) : 'Upcoming'}
                </span>
                <div style={{ color: '#666', marginTop: 10 }}>
                  <i className="fas fa-calendar-day" style={{ marginRight: 5 }}></i>
                  {new Date(selectedFestival.festival_date || selectedFestival.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              <div style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                <p><strong><i className="fas fa-info-circle" style={{ marginRight: 8, color: '#8b5cf6' }}></i>About this Festival:</strong></p>
                <p>{selectedFestival.description || 'Details coming soon...'}</p>
                <hr />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  <p><i className="fas fa-clock" style={{ marginRight: 8, color: '#f59e0b' }}></i><strong>Time:</strong> {selectedFestival.festival_time ? new Date('2024-01-01T' + selectedFestival.festival_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '6:00 AM'}</p>
                  <p><i className="fas fa-map-marker-alt" style={{ marginRight: 8, color: '#ef4444' }}></i><strong>Location:</strong> {selectedFestival.location || 'Temple Complex'}</p>
                </div>
                {selectedFestival.end_date && (
                  <div style={{ marginTop: 15 }}>
                    <p><i className="fas fa-calendar-check" style={{ marginRight: 8, color: '#22c55e' }}></i><strong>End Date:</strong> {new Date(selectedFestival.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                )}
              </div>
            </div>
            <div style={{ padding: '0 25px 25px', display: 'flex', gap: 15 }}>
              <button onClick={closeModal} style={{
                flex: 1, padding: '12px', background: '#f1f5f9', color: '#64748b', border: 'none',
                borderRadius: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >Close</button>
              <a href="#" style={{
                flex: 1, padding: '12px', background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: 'white',
                border: 'none', borderRadius: 12, fontWeight: 600, textAlign: 'center',
                textDecoration: 'none', transition: 'all 0.3s ease', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: 8
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <i className="fas fa-ticket-alt"></i> Book Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white', padding: 50, textAlign: 'center', position: 'relative'
      }}>
        <div style={{ position: 'absolute', top:0, left:0, right:0, height:5, background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }}></div>
        <img src="/images/temple/icon-symbol.webp" alt="Temple" style={{
          width: 60, height: 60, marginBottom: 20, borderRadius: '50%', transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'rotate(360deg) scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'rotate(0deg) scale(1)'}
        />
        <p style={{ color: '#ffd700', fontWeight: 700, fontSize: '1.3rem', marginBottom: 15 }}>ॐ नमः शिवाय</p>
        <p style={{ margin:0 }}>© 2024 Shri Trimbakeshwar Temple. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideInDown {
          from { opacity:0; transform: translateY(-50px); }
          to { opacity:1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity:0; transform: translateY(50px); }
          to { opacity:1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes pulse-icon {
          0%,100% { transform: scale(1); opacity:0.5; }
          50% { transform: scale(1.1); opacity:0.8; }
        }
      `}</style>
    </div>
  );
};

export default Festivals;
