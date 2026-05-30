import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { asset } from '../utils/paths';

const News = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedNews, setSelectedNews] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get('/news').then(res => {
      setNewsItems(res.data.news_items || res.data || []);
    }).catch(() => setNewsItems([]));
  }, []);

  const filteredNews = filter === 'all' ? newsItems : newsItems.filter(n => (n.category || 'events') === filter);

  const openModal = (news) => {
    setSelectedNews(news);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNews(null);
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
        background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
        padding: '80px 0 120px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top:0, left:0, right:0, bottom:0,
          background: `url(${asset('/images/temple/icon-symbol.webp')}) no-repeat center center`,
          backgroundSize: 250, opacity: 0.1, animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            color: '#ffd700', fontSize: '3rem', fontWeight: 700,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)', marginBottom: 15,
            animation: 'slideInDown 0.8s ease-out'
          }}><i className="fas fa-newspaper" style={{ marginRight: 20 }}></i>Temple News</h1>
          <p style={{
            color: 'rgba(255,255,255,0.95)', fontSize: '1.2rem',
            animation: 'slideInUp 0.8s ease-out'
          }}>Latest updates and announcements from Trimbakeshwar Temple</p>
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
            { key: 'all', label: 'All News', icon: 'fa-globe' },
            { key: 'events', label: 'Events', icon: 'fa-calendar-alt' },
            { key: 'announcements', label: 'Announcements', icon: 'fa-bullhorn' },
            { key: 'donations', label: 'Donations', icon: 'fa-donate' }
          ].map(btn => (
            <button key={btn.key} onClick={() => setFilter(btn.key)}
              style={{
                background: filter === btn.key ? 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)' : '#fff',
                border: '2px solid transparent', color: filter === btn.key ? 'white' : '#1e3c72',
                padding: '12px 24px', borderRadius: 50, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                margin: 5
              }}
              onMouseEnter={(e) => {
                if (filter !== btn.key) {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.3)';
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

        {filteredNews.length > 0 ? (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 15, marginBottom: 35, padding: '0 20px'
            }}>
              <h2 style={{
                color: '#1e3c72', fontSize: '1.8rem', fontWeight: 700, margin: 0,
                display: 'flex', alignItems: 'center', gap: 12
              }}>
                <i className="fas fa-bullhorn" style={{ color: '#ff6b35', animation: 'bounce 1s infinite' }}></i>
                Latest News
              </h2>
              <div style={{ flex: 1, height: 3, background: 'linear-gradient(135deg, #ff6b35, #f7931e)', borderRadius: 2 }}></div>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 30, padding: '0 20px'
            }}>
              {filteredNews.map((news, index) => (
                <div key={news.id} onClick={() => openModal(news)}
                  style={{
                    background: '#fff', borderRadius: 20, overflow: 'hidden',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', height: '100%',
                    position: 'relative', cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 25px 60px rgba(255, 107, 53, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{
                    height: 220, position: 'relative', overflow: 'hidden'
                  }}>
                    {news.image ? (
                      <img src={`/${news.image}`} alt={news.headline} style={{
                        width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.15) rotate(2deg)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1) rotate(0deg)'}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      />
                    ) : null}
                    <div style={{
                      width: '100%', height: '100%', display: news.image ? 'none' : 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}>
                      <i className="fas fa-newspaper" style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.5)', animation: 'pulse-icon 2s infinite' }}></i>
                    </div>
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                      opacity: 0, transition: 'opacity 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                    >
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(255,255,255,0.95)', color: '#ff6b35',
                        padding: '8px 16px', borderRadius: 25, fontWeight: 600, fontSize: '0.85rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                      }}>
                        <i className="fas fa-calendar-day"></i>
                        {news.published_at ? new Date(news.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: 25, position: 'relative', zIndex: 2 }}>
                    <span style={{
                      display: 'inline-block', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white', padding: '5px 15px', borderRadius: 20,
                      fontSize: '0.75rem', fontWeight: 600, marginBottom: 12,
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateX(5px)';
                      e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateX(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                    >
                      <i className="fas fa-tag" style={{ marginRight: 6 }}></i> News
                    </span>
                    <h3 style={{
                      color: '#1e3c72', fontSize: '1.3rem', fontWeight: 700,
                      marginBottom: 12, lineHeight: 1.4, transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#ff6b35'}
                    onMouseLeave={(e) => e.target.style.color = '#1e3c72'}
                    >{news.headline}</h3>
                    <p style={{
                      color: '#666', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 20
                    }}>{(news.content || 'Latest temple news...').substring(0, 120)}...</p>
                    <a style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      color: '#ff6b35', textDecoration: 'none', fontWeight: 600,
                      transition: 'all 0.3s ease'
                    }}
                    onClick={(e) => { e.stopPropagation(); openModal(news); }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#f7931e';
                      e.currentTarget.style.gap = '15px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#ff6b35';
                      e.currentTarget.style.gap = '8px';
                    }}
                    >
                      Read More <i className="fas fa-arrow-right" style={{ transition: 'transform 0.3s ease' }}></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{
            textAlign: 'center', padding: '80px 20px', background: '#fff',
            borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease', margin: '0 20px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <i className="fas fa-newspaper" style={{ fontSize: '5rem', color: '#ddd', marginBottom: 25, display: 'block', animation: 'float 3s ease-in-out infinite' }}></i>
            <h4 style={{ color: '#666', fontSize: '1.5rem', marginBottom: 10 }}>No News Available</h4>
            <p style={{ color: '#999' }}>Latest updates and announcements will appear here.</p>
            <a href="/home" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)', color: 'white',
              padding: '12px 28px', borderRadius: 25, fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.3s ease', marginTop: 20
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
            >
              <i className="fas fa-home" style={{ marginRight: 8 }}></i>Go to Home
            </a>
          </div>
        )}
      </div>

      {/* News Modal */}
      {showModal && selectedNews && (
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
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
              color: 'white', padding: '20px 25px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <h5 style={{ margin:0, fontWeight: 700 }}>{selectedNews.headline}</h5>
              <button onClick={closeModal} style={{
                background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
                width: 35, height: 35, borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem'
              }}>×</button>
            </div>
            <div style={{ padding: 25 }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <small style={{ color: '#666' }}>
                  <i className="fas fa-calendar-day" style={{ marginRight: 6 }}></i>
                  {selectedNews.published_at ? new Date(selectedNews.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent'}
                </small>
              </div>
              <div style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                <div dangerouslySetInnerHTML={{ __html: selectedNews.content || 'Details coming soon...' }} />
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
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white', padding: 50, textAlign: 'center', position: 'relative'
      }}>
        <div style={{ position: 'absolute', top:0, left:0, right:0, height:5, background: 'linear-gradient(135deg, #ff6b35, #f7931e)' }}></div>
        <img src={asset('/images/temple/icon-symbol.webp')} alt="Temple" style={{
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
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse-icon {
          0%,100% { transform: scale(1); opacity:0.5; }
          50% { transform: scale(1.1); opacity:0.8; }
        }
      `}</style>
    </div>
  );
};

export default News;
