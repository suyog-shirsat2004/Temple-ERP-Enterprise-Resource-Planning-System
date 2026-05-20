import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '../animations/material-wave-loading.json';
import api from '../services/api';

const PAYMENT_METHODS = [
  { id: 'UPI', label: 'UPI', icon: 'fa-mobile-alt', color: '#6366f1' },
  { id: 'Credit Card', label: 'Credit Card', icon: 'fa-credit-card', color: '#10b981' },
  { id: 'Debit Card', label: 'Debit Card', icon: 'fa-credit-card', color: '#f59e0b' },
  { id: 'Net Banking', label: 'Net Banking', icon: 'fa-university', color: '#ec4899' },
  { id: 'Cash', label: 'Cash', icon: 'fa-money-bill-wave', color: '#14b8a6' },
];

const NewPass = () => {
  const navigate = useNavigate();
  const [passTypes, setPassTypes] = useState([]);
  const [formData, setFormData] = useState({
    devotee_name: '', phone: '', email: '', gender: '', address: '',
    visit_date: '', visit_time: '', no_of_persons: 1, pass_type: 'general',
    payment_method: 'UPI', transaction_id: '', aadhar_number: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('general');
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [aadharFile, setAadharFile] = useState(null);

  useEffect(() => {
    api.get('/passes/types').then(res => {
      setPassTypes(res.data.passTypes || []);
    });
    setSelectedAmount(50);
    setFormData(prev => ({ ...prev, pass_type: 'general' }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectPassType = (type, price) => {
    setSelectedType(type);
    setFormData({ ...formData, pass_type: type });
    setSelectedAmount(price || 0);
    setShowPayment(price > 0);
    if (price === 0) setFormData(prev => ({ ...prev, payment_method: 'UPI' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setShowPaymentModal(true);
  };

  const handlePayNow = async () => {
    setShowPaymentModal(false);
    setLoading(true);
    const txnId = 'TXN' + Date.now();
    const fd = new FormData();
    Object.entries({ ...formData, transaction_id: txnId }).forEach(([k, v]) => fd.append(k, v));
    if (aadharFile) fd.append('aadhar_card', aadharFile);
    try {
      await api.post('/passes', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/passes');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book pass');
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      minHeight: '100vh'
    }}>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(26, 26, 46, 0.95) !important',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: 12,
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between'
        }}>
          <a href="/" style={{
            display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none'
          }}>
            <img src="/images/temple/icon-symbol.webp" alt="Temple" style={{
              width: 45, height: 45, borderRadius: 12,
              transition: 'transform 0.3s ease',
              animation: 'gentleFloat 3s ease-in-out infinite'
            }} />
            <span style={{
              color: '#fbbf24', fontWeight: 800, fontSize: '1.4rem',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Temple ERP</span>
          </a>
          <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
            <a href="/" style={navLinkStyle}><i className="fas fa-home" style={{ marginRight: 6 }}></i>Home</a>
            <a href="/services" style={navLinkStyle}><i className="fas fa-th-large" style={{ marginRight: 6 }}></i>Services</a>
            <a href="/passes/new" style={{ ...navLinkStyle, background: 'rgba(99, 102, 241, 0.15)' }}><i className="fas fa-ticket-alt" style={{ marginRight: 6 }}></i>Darshan Pass</a>
            <a href="/room_booking" style={navLinkStyle}><i className="fas fa-hotel" style={{ marginRight: 6 }}></i>Room Booking</a>
            <a href="/donations" style={navLinkStyle}><i className="fas fa-donate" style={{ marginRight: 6 }}></i>Donations</a>
            <a href="/notifications" style={navLinkStyle}><i className="fas fa-bell" style={{ marginRight: 6 }}></i>Notifications</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        textAlign: 'center', marginBottom: 40, paddingTop: 40,
        animation: 'fadeInDown 0.8s ease-out'
      }}>
        <div style={{
          width: 100, height: 100, margin: '0 auto 20px',
          background: 'linear-gradient(135deg, #6366f1, #ec4899)',
          borderRadius: 25, display: 'flex', alignItems: 'center',
          justifyContent: 'center', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
          animation: 'bounceIn 1s ease-out, gentlePulse 2s ease-in-out infinite'
        }}>
          <i className="fas fa-ticket-alt" style={{ fontSize: 45, color: '#fff' }}></i>
        </div>
        <h1 style={{
          fontSize: '3rem', fontWeight: 700, color: '#fff', marginBottom: 15,
          animation: 'slideInDown 0.8s ease-out'
        }}>Book Your <span style={{
          background: 'linear-gradient(135deg, #6366f1, #ec4899)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>Darshan Pass</span></h1>
        <p style={{
          fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)',
          animation: 'slideInUp 0.8s ease-out'
        }}>Experience the divine blessings</p>
      </div>

      <div style={{ maxWidth: 550, margin: '0 auto', padding: '0 20px 60px' }}>
        {error && (
          <div style={{
            background: 'rgba(252, 129, 129, 0.15)', color: '#c53030',
            border: '1px solid rgba(252, 129, 129, 0.3)', borderRadius: 16,
            padding: '16px 20px', marginBottom: 20, display: 'flex',
            alignItems: 'center', gap: 12
          }}>
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <div style={{
          background: 'rgba(255, 255, 255, 0.98)', borderRadius: 30,
          padding: 40, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          animation: 'fadeInUp 0.6s ease-out 0.2s both'
        }}>
          <div style={{
            fontSize: '1.3rem', fontWeight: 600, color: '#1e293b',
            marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12
          }}>
            <i className="fas fa-tag" style={{ color: '#6366f1' }}></i>
            Select Pass Type
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15, marginBottom: 30
          }}>
            {[
              { type: 'general', icon: 'fa-ticket-alt', label: 'General', price: '₹50', color: '#6366f1' },
              { type: 'special', icon: 'fa-star', label: 'Special', price: '₹100', color: '#f59e0b' },
              { type: 'vip', icon: 'fa-crown', label: 'VIP', price: '₹500', color: '#ec4899' }
            ].map((pt) => (
              <div key={pt.type}
                onClick={() => selectPassType(pt.type, pt.type === 'general' ? 50 : pt.type === 'special' ? 100 : 500)}
                style={{
                  background: selectedType === pt.type ? 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.05))' : '#f8fafc',
                  border: `2px solid ${selectedType === pt.type ? '#6366f1' : 'transparent'}`,
                  borderRadius: 16, padding: '20px 15px', textAlign: 'center',
                  cursor: 'pointer', transition: 'all 0.4s ease', position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(99,102,241,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {selectedType === pt.type && (
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 24, height: 24, background: '#6366f1',
                    color: 'white', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, zIndex: 2
                  }}><i className="fas fa-check"></i></div>
                )}
                <div style={{
                  width: 55, height: 55, borderRadius: 14, margin: '0 auto 12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, transition: 'all 0.3s ease',
                  background: selectedType === pt.type ? `rgba(${pt.color === '#6366f1' ? '99,102,241' : pt.color === '#f59e0b' ? '245,158,11' : '236,72,153'}, 0.15)` : '#f1f5f9',
                  color: pt.color
                }}>
                  <i className={`fas ${pt.icon}`}></i>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>{pt.label}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{pt.price}</div>
              </div>
            ))}
          </div>

          {/* Payment Method Section */}
          <div style={{
            maxHeight: showPayment ? 400 : 0, overflow: 'hidden',
            transition: 'max-height 0.6s ease, opacity 0.5s ease, margin 0.5s ease',
            opacity: showPayment ? 1 : 0,
            marginBottom: showPayment ? 30 : 0
          }}>
            <div style={{
              fontSize: '1.3rem', fontWeight: 600, color: '#1e293b',
              marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12,
              animation: showPayment ? 'fadeInUp 0.5s ease-out' : 'none'
            }}>
              <i className="fas fa-credit-card" style={{ color: '#10b981' }}></i>
              Payment Method
              <span style={{
                fontSize: 13, fontWeight: 500, color: '#64748b',
                background: '#f1f5f9', padding: '4px 12px', borderRadius: 20,
                marginLeft: 'auto'
              }}>
                ₹{selectedAmount} / person
              </span>
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 12, animation: 'slideInUp 0.5s ease-out'
            }}>
              {PAYMENT_METHODS.map((pm, idx) => (
                <div key={pm.id}
                  onClick={() => setFormData({ ...formData, payment_method: pm.id })}
                  style={{
                    background: formData.payment_method === pm.id
                      ? `linear-gradient(135deg, ${pm.color}15, ${pm.color}08)`
                      : '#f8fafc',
                    border: `2px solid ${formData.payment_method === pm.id ? pm.color : 'transparent'}`,
                    borderRadius: 16, padding: '18px 12px', textAlign: 'center',
                    cursor: 'pointer', transition: 'all 0.4s ease', position: 'relative',
                    animation: `fadeInUp 0.5s ease-out ${idx * 0.08}s both`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = `0 12px 30px ${pm.color}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {formData.payment_method === pm.id && (
                    <div style={{
                      position: 'absolute', top: 6, right: 6, width: 20, height: 20,
                      background: pm.color, color: 'white', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, zIndex: 2
                    }}>
                      <i className="fas fa-check"></i>
                    </div>
                  )}
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, margin: '0 auto 10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20,
                    background: formData.payment_method === pm.id
                      ? `rgba(${pm.color === '#6366f1' ? '99,102,241' : pm.color === '#10b981' ? '16,185,129' : pm.color === '#f59e0b' ? '245,158,11' : pm.color === '#ec4899' ? '236,72,153' : '20,184,166'}, 0.15)`
                      : '#f1f5f9',
                    color: pm.color
                  }}>
                    <i className={`fas ${pm.icon}`}></i>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#1e293b' }}>{pm.label}</div>
                </div>
              ))}
            </div>

            {formData.payment_method === 'UPI' && (
              <div style={{
                marginTop: 16, padding: '14px 18px', background: '#f0f4ff',
                borderRadius: 12, border: '1px dashed #6366f1',
                animation: 'fadeInUp 0.4s ease-out', display: 'flex',
                alignItems: 'center', gap: 12
              }}>
                <i className="fas fa-mobile-alt" style={{ color: '#6366f1', fontSize: 18 }}></i>
                <span style={{ fontSize: 13, color: '#1e293b' }}>
                  Enter UPI ID:
                </span>
                <input type="text" name="transaction_id" value={formData.transaction_id}
                  onChange={handleChange} placeholder="example@upi"
                  style={{
                    flex: 1, padding: '8px 14px', border: '1px solid #c7d2fe',
                    borderRadius: 8, fontSize: 13, fontFamily: 'inherit',
                    outline: 'none', background: 'white'
                  }}
                />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1e293b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fas fa-user" style={{ color: '#6366f1' }}></i> Devotee Name
              </div>
              <input type="text" name="devotee_name" value={formData.devotee_name} onChange={handleChange}
                placeholder="Enter devotee name" required
                style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1e293b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fas fa-phone" style={{ color: '#6366f1' }}></i> Phone Number
                </div>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="Enter phone number" required
                  style={inputStyle} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1e293b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fas fa-envelope" style={{ color: '#6366f1' }}></i> Email (Optional)
                </div>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="Enter email address"
                  style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1e293b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fas fa-calendar-alt" style={{ color: '#6366f1' }}></i> Visit Date
                </div>
                <input type="date" name="visit_date" value={formData.visit_date} onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]} required
                  style={inputStyle} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#1e293b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fas fa-clock" style={{ color: '#6366f1' }}></i> Visit Time
                </div>
                <select name="visit_time" value={formData.visit_time} onChange={handleChange} required
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Select Time</option>
                  <option value="morning">Morning (5-12 PM)</option>
                  <option value="afternoon">Afternoon (12-5 PM)</option>
                  <option value="evening">Evening (5-9 PM)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1e293b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fas fa-id-card" style={{ color: '#6366f1' }}></i> Aadhar Number
              </div>
              <input type="text" name="aadhar_number" value={formData.aadhar_number}
                onChange={handleChange} placeholder="Enter 12-digit Aadhar number"
                pattern="[0-9]{12}" maxLength={12} required
                style={inputStyle} />
            </div>

            <div style={{ marginBottom: 30 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1e293b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fas fa-upload" style={{ color: '#6366f1' }}></i> Upload Aadhar Card
              </div>
              <div style={{
                border: '2px dashed #6366f1', borderRadius: 12, padding: 20,
                textAlign: 'center', background: '#f0f4ff', cursor: 'pointer'
              }}>
                <input type="file" accept="image/*" required
                  onChange={(e) => setAadharFile(e.target.files[0])}
                  style={{ display: 'none' }} id="aadhar-upload" />
                <label htmlFor="aadhar-upload" style={{ cursor: 'pointer', display: 'block' }}>
                  <i className="fas fa-cloud-upload-alt" style={{ fontSize: 32, color: '#6366f1', display: 'block', marginBottom: 8 }}></i>
                  <span style={{ color: '#6366f1', fontWeight: 500, fontSize: 14 }}>
                    {aadharFile ? aadharFile.name : 'Click to upload Aadhar card image'}
                  </span>
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '18px 32px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white', border: 'none', borderRadius: 16,
              fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.4s ease', position: 'relative', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 15px 35px rgba(16,185,129,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
            >
              {loading ? (
                <><i className="fas fa-spinner fa-spin"></i> Booking Pass...</>
              ) : (
                <>
                  <i className="fas fa-lock"></i>
                  Pay ₹{selectedAmount * (parseInt(formData.no_of_persons) || 1)} & Book
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {showPaymentModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999
        }} onClick={() => setShowPaymentModal(false)}>
          <div style={{
            background: '#fff', borderRadius: 24, padding: 35,
            maxWidth: 420, width: '90%', boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 15px', fontSize: 24, color: '#fff'
            }}>
              <i className="fas fa-credit-card"></i>
            </div>
            <h3 style={{
              textAlign: 'center', color: '#1e293b', fontSize: '1.3rem',
              fontWeight: 700, marginBottom: 5
            }}>Complete Payment</h3>
            <p style={{
              textAlign: 'center', color: '#64748b', fontSize: '0.9rem',
              marginBottom: 20
            }}>Review your booking details</p>

            <div style={{
              background: '#f8fafc', borderRadius: 16, padding: 20,
              marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12
            }}>
              {[
                { label: 'Pass Type', value: selectedType.toUpperCase() },
                { label: 'Persons', value: formData.no_of_persons },
                { label: 'Amount', value: `₹${selectedAmount} / person` },
                { label: 'Payment Method', value: formData.payment_method }
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  borderBottom: i < 3 ? '1px solid #e2e8f0' : 'none',
                  paddingBottom: i < 3 ? 8 : 0
                }}>
                  <span style={{ color: '#64748b', fontSize: 14 }}>{item.label}</span>
                  <span style={{ color: '#1e293b', fontWeight: 600, fontSize: 14 }}>{item.value}</span>
                </div>
              ))}
              <div style={{
                borderTop: '2px dashed #6366f1', paddingTop: 12, marginTop: 4,
                display: 'flex', justifyContent: 'space-between'
              }}>
                <span style={{ color: '#1e293b', fontWeight: 700, fontSize: 16 }}>Total</span>
                <span style={{
                  color: '#6366f1', fontWeight: 800, fontSize: 20
                }}>₹{selectedAmount * (parseInt(formData.no_of_persons) || 1)}</span>
              </div>
            </div>

            <button onClick={handlePayNow} style={{
              width: '100%', padding: '16px', border: 'none', borderRadius: 14,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 0.3s ease', marginBottom: 10
            }}
            onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 10px 25px rgba(16,185,129,0.4)' }}
            onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none' }}
            >
              <i className="fas fa-lock"></i>
              Pay ₹{selectedAmount * (parseInt(formData.no_of_persons) || 1)}
            </button>

            <button onClick={() => setShowPaymentModal(false)} style={{
              width: '100%', padding: '12px', border: 'none', borderRadius: 14,
              background: 'transparent', color: '#64748b', fontSize: 14,
              cursor: 'pointer', fontWeight: 500
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', zIndex: 9999
        }}>
          <Lottie animationData={animationData} style={{ width: 200, height: 200 }} loop />
          <div style={{
            marginTop: 20, color: '#fff', fontSize: 18, fontWeight: 600,
            fontFamily: "'Poppins', sans-serif"
          }}>Booking Pass...</div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes gentlePulse {
          0%, 100% { box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 20px 50px rgba(99, 102, 241, 0.5); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const navLinkStyle = {
  color: 'rgba(255,255,255,0.95)', fontWeight: 500,
  padding: '10px 18px', borderRadius: 12, transition: 'all 0.3s ease',
  textDecoration: 'none', display: 'flex', alignItems: 'center'
};

const inputStyle = {
  width: '100%', padding: '14px 18px',
  border: '2px solid #e2e8f0', borderRadius: 12,
  fontSize: 14, fontFamily: 'inherit', transition: 'all 0.3s ease'
};

export default NewPass;
