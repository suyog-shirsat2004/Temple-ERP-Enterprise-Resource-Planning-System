import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { asset } from '../utils/paths';

const Notifications = () => {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/notifications').then(res => {
      setMessages(res.data.messages || res.data || []);
    }).catch(() => setMessages([]));
  }, []);

  const filterMessages = (type) => {
    setFilter(type);
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await api.post('/notifications/mark_all_read');
      setMessages(messages.map(m => ({ ...m, is_unread: false })));
    } catch (err) {
      console.error('Error marking messages as read:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = filter === 'all' ? messages : messages.filter(m => (m.message_type || 'pass') === filter);

  const unreadCount = messages.filter(m => m.is_unread).length;
  const passCount = messages.filter(m => (m.message_type || 'pass') === 'pass').length;
  const donationCount = messages.filter(m => (m.message_type || '') === 'donation').length;
  const bookingCount = messages.filter(m => (m.message_type || '') === 'booking').length;
  const restaurantCount = messages.filter(m => (m.message_type || '') === 'restaurant').length;
  
  const getPendingCount = () => {
    return messages.filter(m => {
      const type = m.message_type || 'pass';
      if (type === 'pass') return ['pending', ''].includes(m.status || '');
      if (type === 'donation') return (m.payment_status || '') === 'pending';
      if (type === 'booking') return (m.booking_status || '') === 'pending';
      if (type === 'restaurant') return (m.status || '') === 'pending' || (m.payment_status || '') === 'pending';
      return false;
    }).length;
  };

  const pendingCount = getPendingCount();

  const getIcon = (type) => {
    switch(type) {
      case 'pass': return 'fa-ticket-alt';
      case 'donation': return 'fa-donate';
      case 'booking': return 'fa-hotel';
      case 'restaurant': return 'fa-utensils';
      default: return 'fa-bell';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return { background: '#fef3c7', color: '#92400e' };
      case 'confirmed':
      case 'approved':
      case 'paid':
      case 'active': return { background: '#d1fae5', color: '#065f46' };
      case 'cancelled':
      case 'rejected': return { background: '#fee2e2', color: '#991b1b' };
      case 'completed': return { background: '#e0e7ff', color: '#3730a3' };
      default: return { background: '#f3f4f6', color: '#374151' };
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      fontFamily: "'Poppins', sans-serif"
    }}>
      {/* Navigation */}
      <nav style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '12px 0',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        position: 'sticky', top: 0, zIndex: 1000
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/home" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src={asset('/images/temple/icon symbol.webp')} alt="Temple" style={{ width: 40, height: 40, borderRadius: 10, marginRight: 8 }} />
            <span style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, fontSize: '1.4rem' }}>Temple ERP</span>
          </a>
          <div style={{ display: 'flex', gap: 5 }}>
            {[
              { href: '/home', icon: 'fa-home', label: 'Home' },
              { href: '/services', icon: 'fa-th-large', label: 'Services' },
              { href: '/darshan_pass/new', icon: 'fa-ticket-alt', label: 'Darshan Pass' },
              { href: '/room_booking', icon: 'fa-hotel', label: 'Room Booking' },
              { href: '/donations', icon: 'fa-donate', label: 'Donations' },
              { href: '/restaurant', icon: 'fa-utensils', label: 'Restaurant' },
              { href: '/notifications', icon: 'fa-bell', label: 'Notifications', active: true }
            ].map((link, i) => (
              <a key={i} href={link.href} style={{
                color: link.active ? '#ffd700' : 'rgba(255,255,255,0.9)',
                background: link.active ? 'rgba(255,255,255,0.1)' : 'transparent',
                padding: '8px 15px', borderRadius: 8, fontWeight: 500,
                textDecoration: 'none', transition: 'all 0.3s ease', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#fff'; e.target.style.background = 'rgba(255,255,255,0.15)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = link.active ? '#ffd700' : 'rgba(255,255,255,0.9)';
                e.target.style.background = link.active ? 'rgba(255,255,255,0.1)' : 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
              >
                <i className={`fas ${link.icon}`} style={{ marginRight: 4 }}></i> {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', color: 'white', marginBottom: 40, animation: 'slideDown 0.6s ease-out' }}>
          <img src={asset('/images/temple/icon symbol.webp')} alt="Temple" style={{ width: 100, height: 100, margin: '0 auto 15px', transition: 'transform 0.3s ease', cursor: 'pointer' }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1) rotate(5deg)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1) rotate(0deg)'}
          />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 10 }}><i className="fas fa-bell" style={{ marginRight: 15 }}></i>My Notifications</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Track all your bookings, donations, and updates in one place</p>

          <div style={{ display: 'flex', gap: 15, marginTop: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: 'fa-ticket-alt', label: 'Passes', count: passCount, onClick: () => filterMessages('pass') },
              { icon: 'fa-donate', label: 'Donations', count: donationCount, onClick: () => filterMessages('donation') },
              { icon: 'fa-hotel', label: 'Rooms', count: bookingCount, onClick: () => filterMessages('booking') },
              { icon: 'fa-utensils', label: 'Orders', count: restaurantCount, onClick: () => filterMessages('restaurant') },
              { icon: 'fa-clock', label: 'Pending', count: pendingCount, onClick: () => filterMessages('pending'), bg: 'rgba(239, 68, 68, 0.3)' }
            ].map((stat, i) => (
              <a key={i} onClick={stat.onClick} style={{
                background: stat.bg || 'rgba(255,255,255,0.2)', padding: '8px 16px',
                borderRadius: 20, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8,
                textDecoration: 'none', color: 'white', cursor: 'pointer', transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <i className={`fas ${stat.icon}`}></i> {stat.label}: {stat.count}
              </a>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          background: 'white', borderRadius: 15, padding: '15px 20px', marginBottom: 25,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)', display: 'flex', flexWrap: 'wrap', gap: 5
        }}>
          {[
            { key: 'all', label: 'All', icon: 'fa-list', count: messages.length },
            { key: 'pass', label: 'Darshan Passes', icon: 'fa-ticket-alt', count: passCount },
            { key: 'donation', label: 'Donations', icon: 'fa-donate', count: donationCount },
            { key: 'booking', label: 'Room Bookings', icon: 'fa-hotel', count: bookingCount },
            { key: 'restaurant', label: 'Restaurant', icon: 'fa-utensils', count: restaurantCount }
          ].map(btn => (
            <button key={btn.key} onClick={() => filterMessages(btn.key)}
              style={{
                padding: '10px 20px', borderRadius: 25, border: '2px solid #e0e0e0',
                background: filter === btn.key ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                color: filter === btn.key ? 'white' : '#666', fontWeight: 500,
                transition: 'all 0.3s ease', cursor: 'pointer', margin: 5
              }}
              onMouseEnter={(e) => {
                if (filter !== btn.key) {
                  e.target.style.borderColor = '#667eea'; e.target.style.color = '#667eea';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = filter === btn.key ? 'transparent' : '#e0e0e0';
                e.target.style.color = filter === btn.key ? 'white' : '#666';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <i className={`fas ${btn.icon}`} style={{ marginRight: 8 }}></i>{btn.label}
              <span style={{
                background: filter === btn.key ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)',
                padding: '2px 8px', borderRadius: 10, fontSize: '0.75rem', marginLeft: 8
              }}>{btn.count}</span>
            </button>
          ))}
        </div>

        {/* Messages */}
        {filteredMessages.length > 0 ? (
          <div>
            {filteredMessages.map((msg, index) => {
              const type = msg.message_type || 'pass';
              const isUnread = msg.is_unread !== false;
              const status = msg.status || msg.payment_status || msg.booking_status || '';
              const statusStyle = getStatusColor(status);
              const icon = getIcon(type);
              
              // Process steps logic
              const isPending = ['pending', ''].includes(msg.status || '') || (msg.payment_status || '') === 'pending';
              const isPaid = (msg.payment_status || '') === 'paid';
              const isApproved = (msg.status || '') === 'approved';
              const isRejected = (msg.status || '') === 'rejected';

              return (
                <div key={msg.id} className={`message-card ${type} ${isUnread ? 'unread' : 'read'}`}
                  style={{
                    background: isUnread ? 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)' : 'white',
                    borderRadius: 16, padding: 25, marginBottom: 15,
                    border: `2px solid ${isUnread ? 'rgba(102, 126, 234, 0.3)' : '#e2e8f0'}`,
                    boxShadow: '0 5px 20px rgba(0,0,0,0.08)', position: 'relative', overflow: 'hidden',
                    transition: 'all 0.3s ease', animation: 'fadeInUp 0.5s ease-out',
                    opacity: 0, transform: 'translateY(20px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px) scale(1.01)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
                  }}
                >
                  {/* Left border color */}
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
                    background: type === 'pass' ? '#667eea' : type === 'donation' ? '#10b981' : type === 'booking' ? '#f59e0b' : '#ec4899'
                  }}></div>

                  {isUnread && (
                    <div style={{
                      position: 'absolute', top: 15, right: 15, width: 10, height: 10,
                      background: 'linear-gradient(135deg, #ef4444, #f97316)', borderRadius: '50%',
                      animation: 'pulse-dot 2s infinite'
                    }}></div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div className={`message-icon ${type}`} style={{
                        width: 55, height: 55, borderRadius: 14, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
                        background: type === 'pass' ? 'rgba(102, 126, 234, 0.12)' : type === 'donation' ? 'rgba(16, 185, 129, 0.12)' : type === 'booking' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(236, 72, 153, 0.12)',
                        color: type === 'pass' ? '#667eea' : type === 'donation' ? '#10b981' : type === 'booking' ? '#f59e0b' : '#ec4899'
                      }}>
                        <i className={`fas ${icon}`}></i>
                      </div>
                      <div style={{ marginLeft: 15, flex: 1 }}>
                        <div className="message-title" style={{
                          fontWeight: isUnread ? 700 : 500, color: isUnread ? '#1a1a2e' : '#64748b',
                          fontSize: '1.1rem', marginBottom: 5
                        }}>{msg.title || 'Notification'}</div>
                        <div className="message-subtitle" style={{
                          color: isUnread ? '#475569' : '#94a3b8', fontSize: '0.9rem', marginBottom: 12
                        }}>
                          {type === 'pass' && (
                            <>Visit: {msg.visit_date ? new Date(msg.visit_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'} | {msg.pass_type || 'General'} Pass</>
                          )}
                          {type === 'donation' && (
                            <>{msg.donation_type || 'General'} Donation</>
                          )}
                          {type === 'booking' && (
                            <>{msg.room_name || 'Room'}</>
                          )}
                          {type === 'restaurant' && (
                            <>{msg.order_id || 'Order'}</>
                          )}
                        </div>
                        <div className="message-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: 15, fontSize: '0.85rem', color: '#94a3b8' }}>
                          <span><i className="fas fa-clock" style={{ marginRight: 5 }}></i>
                            {msg.created_date ? new Date(msg.created_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {status && (
                      <span className={`status-badge status-${status}`} style={{
                        padding: '6px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
                        background: statusStyle.background, color: statusStyle.color, whiteSpace: 'nowrap'
                      }}>
                        {status === 'active' ? 'Approved' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    )}
                  </div>

                  {/* Process Steps */}
                  <div className="process-steps" style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '15px 0', flexWrap: 'wrap' }}>
                    <div className={`process-step ${isPending || isPaid || isApproved ? 'completed' : ''}`} style={{
                      display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem',
                      color: isPending || isPaid || isApproved ? '#22c55e' : '#94a3b8'
                    }}>
                      <i className="fas fa-shopping-cart"></i> Booked
                    </div>
                    <i className="fas fa-chevron-right process-arrow" style={{ color: '#d1d5db' }}></i>
                    <div className={`process-step ${isPaid || isApproved ? 'completed' : isPending ? 'active' : ''}`} style={{
                      display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem',
                      color: isPaid || isApproved ? '#22c55e' : isPending ? '#3b82f6' : '#94a3b8',
                      fontWeight: isPending ? 600 : 400
                    }}>
                      <i className="fas fa-credit-card"></i> Payment
                    </div>
                    <i className="fas fa-chevron-right process-arrow" style={{ color: '#d1d5db' }}></i>
                    <div className={`process-step ${isApproved ? 'completed' : isPaid ? 'active' : ''}`} style={{
                      display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem',
                      color: isApproved ? '#22c55e' : isPaid ? '#3b82f6' : '#94a3b8',
                      fontWeight: isPaid ? 600 : 400
                    }}>
                      <i className="fas fa-check-circle"></i> Approval
                    </div>
                    {isApproved && (
                      <>
                        <i className="fas fa-chevron-right process-arrow" style={{ color: '#d1d5db' }}></i>
                        <div className="process-step completed" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#22c55e' }}>
                          <i className="fas fa-ticket-alt"></i> Ready
                        </div>
                      </>
                    )}
                    {isRejected && (
                      <>
                        <i className="fas fa-chevron-right process-arrow" style={{ color: '#d1d5db' }}></i>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: '#ef4444' }}>
                          <i className="fas fa-times-circle"></i> Rejected
                        </div>
                      </>
                    )}
                  </div>

                  {/* Message Details */}
                  <div className="message-details" style={{ background: '#f8fafc', borderRadius: 12, padding: 15, marginTop: 15 }}>
                    {type === 'pass' && (
                      <>
                        <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span className="detail-label" style={{ color: '#6b7280', fontSize: '0.9rem' }}><i className="fas fa-user" style={{ marginRight: 8 }}></i>Devotee</span>
                          <span className="detail-value" style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{msg.devotee_name || 'N/A'}</span>
                        </div>
                        <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span className="detail-label" style={{ color: '#6b7280', fontSize: '0.9rem' }}><i className="fas fa-calendar" style={{ marginRight: 8 }}></i>Visit Date</span>
                          <span className="detail-value" style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{msg.visit_date ? new Date(msg.visit_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                        </div>
                        <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span className="detail-label" style={{ color: '#6b7280', fontSize: '0.9rem' }}><i className="fas fa-users" style={{ marginRight: 8 }}></i>Persons</span>
                          <span className="detail-value" style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{msg.no_of_persons || 1}</span>
                        </div>
                        {msg.pass_id && (
                          <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                            <span className="detail-label" style={{ color: '#6b7280', fontSize: '0.9rem' }}><i className="fas fa-id-card" style={{ marginRight: 8 }}></i>Pass ID</span>
                            <span className="detail-value" style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{msg.pass_id}</span>
                          </div>
                        )}
                      </>
                    )}
                    {type === 'donation' && (
                      <>
                        <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span className="detail-label" style={{ color: '#6b7280', fontSize: '0.9rem' }}><i className="fas fa-rupee-sign" style={{ marginRight: 8 }}></i>Amount</span>
                          <span className="detail-value" style={{ fontWeight: 600, color: '#10b981', fontSize: '0.9rem' }}>₹{(msg.amount || 0).toLocaleString()}</span>
                        </div>
                        <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span className="detail-label" style={{ color: '#6b7280', fontSize: '0.9rem' }}><i className="fas fa-credit-card" style={{ marginRight: 8 }}></i>Payment Method</span>
                          <span className="detail-value" style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{(msg.payment_method || 'N/A').charAt(0).toUpperCase() + (msg.payment_method || 'na').slice(1)}</span>
                        </div>
                        {msg.receipt_no && (
                          <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                            <span className="detail-label" style={{ color: '#6b7280', fontSize: '0.9rem' }}><i className="fas fa-receipt" style={{ marginRight: 8 }}></i>Receipt No.</span>
                            <span className="detail-value" style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{msg.receipt_no}</span>
                          </div>
                        )}
                      </>
                    )}
                    {type === 'booking' && (
                      <>
                        <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span className="detail-label" style={{ color: '#6b7280', fontSize: '0.9rem' }}><i className="fas fa-sign-in-alt" style={{ marginRight: 8 }}></i>Check-in</span>
                          <span className="detail-value" style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{msg.check_in ? new Date(msg.check_in).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                        </div>
                        <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span className="detail-label" style={{ color: '#6b7280', fontSize: '0.9rem' }}><i className="fas fa-sign-out-alt" style={{ marginRight: 8 }}></i>Check-out</span>
                          <span className="detail-value" style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{msg.check_out ? new Date(msg.check_out).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                        </div>
                        <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                          <span className="detail-label" style={{ color: '#6b7280', fontSize: '0.9rem' }}><i className="fas fa-rupee-sign" style={{ marginRight: 8 }}></i>Total</span>
                          <span className="detail-value" style={{ fontWeight: 600, color: '#f59e0b', fontSize: '0.9rem' }}>₹{(msg.total_amount || 0).toLocaleString()}</span>
                        </div>
                      </>
                    )}
                    {type === 'restaurant' && (
                      <>
                        <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span className="detail-label" style={{ color: '#6b7280', fontSize: '0.9rem' }}><i className="fas fa-utensils" style={{ marginRight: 8 }}></i>Order ID</span>
                          <span className="detail-value" style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{msg.order_id || 'N/A'}</span>
                        </div>
                        <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span className="detail-label" style={{ color: '#6b7280', fontSize: '0.9rem' }}><i className="fas fa-calendar" style={{ marginRight: 8 }}></i>Order Date</span>
                          <span className="detail-value" style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{msg.order_date ? new Date(msg.order_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                        </div>
                        <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <span className="detail-label" style={{ color: '#6b7280', fontSize: '0.9rem' }}><i className="fas fa-clock" style={{ marginRight: 8 }}></i>Time Slot</span>
                          <span className="detail-value" style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{msg.order_time || 'N/A'}</span>
                        </div>
                        <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                          <span className="detail-label" style={{ color: '#6b7280', fontSize: '0.9rem' }}><i className="fas fa-rupee-sign" style={{ marginRight: 8 }}></i>Total Amount</span>
                          <span className="detail-value" style={{ fontWeight: 600, color: '#ec4899', fontSize: '0.9rem' }}>₹{(msg.total_amount || 0).toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ marginTop: 15, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {type === 'pass' && (
                      <>
                        {(msg.status === 'pending' || msg.status === '') && (msg.pass_type === 'special' || msg.pass_type === 'vip') && (
                          <a href={`/payment/index/${msg.pass_id || ''}`} className="action-btn" style={{
                            padding: '8px 16px', borderRadius: 8, border: 'none', fontWeight: 500,
                            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white',
                            transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'
                          }}
                          onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)'; }}
                          onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
                          >
                            <i className="fas fa-credit-card"></i> Pay Now
                          </a>
                        )}
                        <a href={`/darshan_pass/view_pass/${msg.pass_id || ''}`} className="action-btn" style={{
                          padding: '8px 16px', borderRadius: 8, border: 'none', fontWeight: 500,
                          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)'; }}
                        onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
                        >
                          <i className="fas fa-eye"></i> View Pass
                        </a>
                        {msg.status === 'approved' && (
                          <a href={`/darshan_pass/view_pass/${msg.pass_id || ''}`} className="action-btn" style={{
                            padding: '8px 16px', borderRadius: 8, border: 'none', fontWeight: 500,
                            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.4)'; }}
                          onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
                          >
                            <i className="fas fa-download"></i> Download Pass
                          </a>
                        )}
                      </>
                    )}
                    {type === 'donation' && (
                      <>
                        {msg.payment_status === 'pending' ? (
                          <a href={`/payment/donation/${msg.receipt_no || ''}`} className="action-btn" style={{
                            padding: '8px 16px', borderRadius: 8, border: 'none', fontWeight: 500,
                            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)'; }}
                          onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
                          >
                            <i className="fas fa-credit-card"></i> Pay Now
                          </a>
                        ) : (
                          <a href={`/donations/receipt/${msg.receipt_no || ''}`} className="action-btn" style={{
                            padding: '8px 16px', borderRadius: 8, border: 'none', fontWeight: 500,
                            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.4)'; }}
                          onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
                          >
                            <i className="fas fa-receipt"></i> View Receipt
                          </a>
                        )}
                      </>
                    )}
                    {type === 'booking' && (
                      <>
                        {msg.payment_status === 'pending' ? (
                          <a href={`/room_booking/payment/${msg.booking_id || ''}`} className="action-btn" style={{
                            padding: '8px 16px', borderRadius: 8, border: 'none', fontWeight: 500,
                            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)'; }}
                          onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
                          >
                            <i className="fas fa-credit-card"></i> Pay Now
                          </a>
                        ) : (
                          <a href={`/room_booking/view/${msg.id || ''}`} className="action-btn" style={{
                            padding: '8px 16px', borderRadius: 8, border: 'none', fontWeight: 500,
                            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.4)'; }}
                          onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
                          >
                            <i className="fas fa-file-alt"></i> View Booking
                          </a>
                        )}
                      </>
                    )}
                    {type === 'restaurant' && (
                      <>
                        {msg.payment_status === 'pending' ? (
                          <a href="/restaurant" className="action-btn" style={{
                            padding: '8px 16px', borderRadius: 8, border: 'none', fontWeight: 500,
                            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)'; }}
                          onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
                          >
                            <i className="fas fa-credit-card"></i> Pay Now
                          </a>
                        ) : (
                          <a href={`/restaurant/order/${msg.order_id || ''}`} className="action-btn" style={{
                            padding: '8px 16px', borderRadius: 8, border: 'none', fontWeight: 500,
                            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', color: 'white',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 8px 20px rgba(236, 72, 153, 0.4)'; }}
                          onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
                          >
                            <i className="fas fa-receipt"></i> View Receipt
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center', padding: 80, background: 'white', borderRadius: 20,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
            <i className="fas fa-inbox" style={{ fontSize: 80, color: '#dee2e6', marginBottom: 20, display: 'block' }}></i>
            <h3 style={{ color: '#374151', marginBottom: 10 }}>No Messages Yet</h3>
            <p style={{ color: '#6b7280' }}>Start by booking a darshan pass, donating, or reserving a room.</p>
            <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/darshan_pass/new" className="action-btn" style={{
                padding: '12px 24px', borderRadius: 12, border: 'none', fontWeight: 600,
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)'; }}
              onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
              >
                <i className="fas fa-ticket-alt"></i> Book Pass
              </a>
              <a href="/donations" className="action-btn" style={{
                padding: '12px 24px', borderRadius: 12, border: 'none', fontWeight: 600,
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)'; }}
              onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
              >
                <i className="fas fa-donate"></i> Donate
              </a>
              <a href="/room_booking" className="action-btn" style={{
                padding: '12px 24px', borderRadius: 12, border: 'none', fontWeight: 600,
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)'; }}
              onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
              >
                <i className="fas fa-hotel"></i> Book Room
              </a>
              <a href="/restaurant" className="action-btn" style={{
                padding: '12px 24px', borderRadius: 12, border: 'none', fontWeight: 600,
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => { e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)'; }}
              onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
              >
                <i className="fas fa-utensils"></i> Order Food
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        background: 'rgba(0,0,0,0.2)', color: 'white', padding: 25, textAlign: 'center', marginTop: 50
      }}>
        <img src={asset('/images/temple/icon symbol.webp')} alt="Temple" style={{ width: 50, height: 50, transition: 'transform 0.3s ease' }}
          onMouseEnter={(e) => e.target.style.transform = 'rotate(360deg) scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'rotate(0deg) scale(1)'}
        />
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>ॐ नमः शिवाय</p>
        <p style={{ margin: 0, opacity: 0.9 }}>© 2024 Shri Trimbakeshwar Temple. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default Notifications;
