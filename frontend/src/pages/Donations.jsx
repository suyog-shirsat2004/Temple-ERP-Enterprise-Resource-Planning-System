import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { asset } from '../utils/paths';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [totalDonated, setTotalDonated] = useState(0);
  const [donationTypes, setDonationTypes] = useState([]);
  const [formData, setFormData] = useState({ 
    amount: 101, donation_type: 'General Donation', payment_method: 'UPI', message: '' 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedType, setSelectedType] = useState('General Donation');
  const [selectedAmount, setSelectedAmount] = useState(101);

  useEffect(() => {
    api.get('/donations').then(res => {
      setDonations(res.data.donations || []);
      setTotalDonated(res.data.total_donated || 0);
    });
    api.get('/donations/types').then(res => {
      setDonationTypes(res.data.donation_types || []);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectDonationType = (type) => {
    setSelectedType(type);
    setFormData({ ...formData, donation_type: type });
  };

  const selectAmount = (amount) => {
    setSelectedAmount(amount);
    setFormData({ ...formData, amount: amount });
  };

  const selectPaymentMethod = (method) => {
    setFormData({ ...formData, payment_method: method });
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.post('/donations', formData);
      setMessage({ type: 'success', text: res.data.message || 'Donation successful!' });
      setFormData({ amount: 101, donation_type: 'General Donation', payment_method: 'UPI', message: '' });
      setSelectedType('General Donation');
      setSelectedAmount(101);
      const updated = await api.get('/donations');
      setDonations(updated.data.donations || []);
      setTotalDonated(updated.data.total_donated || 0);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Donation failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh',
      paddingTop: 80
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 60px' }}>
        {/* Page Header */}
        <div style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
          padding: '80px 0 120px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: -50
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: `url(${asset('/images/temple/icon-symbol.webp')}) no-repeat center center`,
            backgroundSize: 250, opacity: 0.1,
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'relative', zIndex: 1
          }}>
            <h1 style={{
              color: '#ffd700', fontSize: '3rem', fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)', marginBottom: 15,
              animation: 'slideInDown 0.8s ease-out'
            }}><i className="fas fa-heart" style={{ marginRight: 15 }}></i>Donate</h1>
            <p style={{
              color: 'rgba(255,255,255,0.95)', fontSize: '1.2rem',
              animation: 'slideInUp 0.8s ease-out'
            }}>Support our temple and community with your generous contribution</p>
          </div>
          <div style={{
            position: 'absolute', bottom: -50, left: 0, right: 0,
            height: 100, background: 'linear-gradient(to top, #f8fafc, transparent)'
          }}></div>
        </div>

        {/* Donation Card */}
        <div style={{ position: 'relative', zIndex: 10, marginBottom: 50 }}>
          {message.text && (
            <div style={{
              background: message.type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
              color: message.type === 'success' ? '#166534' : '#991b1b',
              border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: 16, padding: '16px 20px', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`} style={{ fontSize: 20 }}></i>
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleDonate}>
            {/* Donation Type Selection */}
            <div style={{
              fontSize: '1.3rem', fontWeight: 600, color: '#1e3c72', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <i className="fas fa-tag" style={{ color: '#ec4899' }}></i>
              Select Donation Type
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15, marginBottom: 30
            }}>
              {donationTypes.length > 0 ? donationTypes.map((dt, i) => {
                const typeKey = dt.type_name?.toLowerCase().replace(/\s/g, '');
                const icons = {
                  'general': 'fa-hand-holding-heart',
                  'seva': 'fa-hands-helping',
                  'annadan': 'fa-utensils',
                  'temple': 'fa-gopuram',
                  'puja': 'fa-praying-hands',
                  'festival': 'fa-star',
                  'charity': 'fa-heart',
                  'development': 'fa-building'
                };
                const icon = icons[typeKey] || 'fa-hand-holding-heart';
                return (
                  <div key={i}
                    onClick={() => selectDonationType(dt.type_name)}
                    style={{
                      background: selectedType === dt.type_name ? 'rgba(236,72,153,0.1)' : '#f8fafc',
                      border: `2px solid ${selectedType === dt.type_name ? '#ec4899' : 'transparent'}`,
                      borderRadius: 16, padding: '20px 15px', textAlign: 'center',
                      cursor: 'pointer', transition: 'all 0.4s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(236,72,153,0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      width: 55, height: 55, borderRadius: 14, margin: '0 auto 12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22, background: selectedType === dt.type_name ? 'rgba(236,72,153,0.15)' : 'rgba(236,72,153,0.15)',
                      color: '#ec4899'
                    }}>
                      <i className={`fas ${icon}`}></i>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1e3c72', marginBottom: 4 }}>{dt.type_name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{dt.description || 'Support the Temple'}</div>
                  </div>
                );
              }) : (
                <div style={{
                  background: '#f8fafc', border: '2px solid transparent',
                  borderRadius: 16, padding: '20px 15px', textAlign: 'center', cursor: 'pointer'
                }}>
                  <div style={{
                    width: 55, height: 55, borderRadius: 14, margin: '0 auto 12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, background: 'rgba(236,72,153,0.15)', color: '#ec4899'
                  }}>
                    <i className="fas fa-hand-holding-heart"></i>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1e3c72', marginBottom: 4 }}>General</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>Temple Support</div>
                </div>
              )}
            </div>

            <input type="hidden" name="donation_type" value={formData.donation_type} />

            {/* Amount Selection */}
            <div style={{
              fontSize: '1.3rem', fontWeight: 600, color: '#1e3c72', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <i className="fas fa-coins" style={{ color: '#ec4899' }}></i>
              Select Amount
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20
            }}>
              {[101, 501, 1001, 5001, 10001].map((amt) => (
                <button key={amt} type="button"
                  onClick={() => selectAmount(amt)}
                  style={{
                    padding: '16px 12px', border: `2px solid ${selectedAmount === amt ? '#ec4899' : '#e2e8f0'}`,
                    borderRadius: 12, background: selectedAmount === amt ? 'rgba(236,72,153,0.1)' : 'white',
                    fontSize: 16, fontWeight: 600, color: '#1e3c72', cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#ec4899';
                    e.target.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = selectedAmount === amt ? '#ec4899' : '#e2e8f0';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', marginBottom: 20 }}>
              <div style={{
                position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
                fontSize: 18, fontWeight: 600, color: '#1e3c72', zIndex: 2
              }}>₹</div>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange}
                min="1" placeholder="Enter custom amount"
                style={{
                  width: '100%', padding: '16px 20px 16px 45', border: '2px solid #e2e8f0',
                  borderRadius: 12, fontSize: 18, fontWeight: 600, transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ec4899';
                  e.target.style.boxShadow = '0 0 0 4px rgba(236,72,153,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Your Details */}
            <div style={{
              fontSize: '1.3rem', fontWeight: 600, color: '#1e3c72', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <i className="fas fa-user" style={{ color: '#ec4899' }}></i>
              Your Details
            </div>

            <div className="grid grid-2" style={{ gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ fontWeight: 500, color: '#374151', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fas fa-user" style={{ color: '#ec4899' }}></i> Full Name
                </label>
                <input type="text" name="name" onChange={handleChange}
                  placeholder="Enter your name"
                  style={inputStyle} />
              </div>
              <div>
                <label style={{ fontWeight: 500, color: '#374151', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fas fa-phone" style={{ color: '#ec4899' }}></i> Phone
                </label>
                <input type="tel" name="phone" onChange={handleChange}
                  placeholder="Enter phone number"
                  style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 500, color: '#374151', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fas fa-envelope" style={{ color: '#ec4899' }}></i> Email
              </label>
              <input type="email" name="email" onChange={handleChange}
                placeholder="Enter email address"
                style={inputStyle} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontWeight: 500, color: '#374151', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fas fa-comment" style={{ color: '#ec4899' }}></i> Message (Optional)
              </label>
              <select name="message" value={formData.message} onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Select an option</option>
                <option value="For Temple Development">For Temple Development</option>
                <option value="For Annadan Seva">For Annadan Seva</option>
                <option value="For Festival Celebration">For Festival Celebration</option>
                <option value="For Daily Puja">For Daily Puja</option>
                <option value="For Poor People">For Poor People</option>
              </select>
            </div>

            {/* Payment Method */}
            <div style={{
              fontSize: '1.3rem', fontWeight: 600, color: '#1e3c72', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <i className="fas fa-credit-card" style={{ color: '#ec4899' }}></i>
              Payment Method
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24
            }}>
              {[
                { method: 'UPI', icon: 'fa-mobile-alt', color: '#22c55e' },
                { method: 'Card', icon: 'fa-credit-card', color: '#3b82f6' },
                { method: 'Net Banking', icon: 'fa-university', color: '#f59e0b' },
                { method: 'Cash', icon: 'fa-money-bill-wave', color: '#ef4444' }
              ].map((pm) => (
                <div key={pm.method}
                  onClick={() => selectPaymentMethod(pm.method)}
                  style={{
                    border: `2px solid ${formData.payment_method === pm.method ? '#ec4899' : '#e2e8f0'}`,
                    borderRadius: 12, padding: 16, textAlign: 'center', cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: formData.payment_method === pm.method ? 'rgba(236,72,153,0.1)' : 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ec4899';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = formData.payment_method === pm.method ? '#ec4899' : '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <i className={`fas ${pm.icon}`} style={{ fontSize: 24, marginBottom: 8, color: pm.color }}></i>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>{pm.method}</div>
                </div>
              ))}
            </div>

            <input type="hidden" name="payment_method" value={formData.payment_method} />

            {formData.payment_method === 'UPI' && (
              <div style={{
                textAlign: 'center', marginTop: 20, padding: 20,
                background: 'white', borderRadius: 15, border: '2px dashed #22c55e',
                animation: 'fadeInUp 0.5s ease'
              }}>
                <div style={{ display: 'inline-block', padding: 20, background: '#f8fafc', borderRadius: 10 }}>
                  <img src={asset('/images/pay/QR.jpeg')} alt="Payment QR" style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 8 }} />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e', margin: '10px 0' }}>Amount: ₹{formData.amount}</div>
                <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Scan with any UPI App</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '18px 32px',
                background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
                color: 'white', border: 'none', borderRadius: 16,
                fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.4s ease', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 10, marginTop: 20
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 10px 30px rgba(236,72,153,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-heart"></i>}
              {loading ? 'Processing...' : 'Donate Now'}
            </button>
          </form>
        </div>

        {/* Donation History */}
        <div style={{ marginTop: 40 }}>
          <div style={{
            fontSize: '1.8rem', fontWeight: 700, color: '#1e3c72', marginBottom: 35,
            display: 'flex', alignItems: 'center', gap: 15
          }}>
            <i className="fas fa-history" style={{ color: '#3b82f6', animation: 'bounce 1s infinite' }}></i>
            Donation History
            <div style={{ flex: 1, height: 3, background: 'linear-gradient(135deg, #ec4899, #f43f5e)', borderRadius: 2 }}></div>
          </div>

          {donations.length > 0 ? (
            <div style={{
              background: 'white', borderRadius: 20, overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', margin: 0 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: 15, textAlign: 'left', fontWeight: 600, color: '#333', border: 'none' }}>Receipt No</th>
                    <th style={{ padding: 15, textAlign: 'left', fontWeight: 600, color: '#333', border: 'none' }}>Amount</th>
                    <th style={{ padding: 15, textAlign: 'left', fontWeight: 600, color: '#333', border: 'none' }}>Type</th>
                    <th style={{ padding: 15, textAlign: 'left', fontWeight: 600, color: '#333', border: 'none' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d, i) => (
                    <tr key={d.id} style={{
                      borderBottom: i < donations.length - 1 ? '1px solid #eee' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(236,72,153,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: 15 }}>{d.receipt_no}</td>
                      <td style={{ padding: 15 }}>₹{d.amount}</td>
                      <td style={{ padding: 15 }}>{d.donation_type}</td>
                      <td style={{ padding: 15 }}>
                        <span style={{
                          padding: '5px 15px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600,
                          background: d.payment_status === 'Completed' ? '#d4edda' : '#fff3cd',
                          color: d.payment_status === 'Completed' ? '#155724' : '#856404'
                        }}>{d.payment_status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: 80, background: 'white', borderRadius: 20,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)', transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <i className="fas fa-hand-holding-heart" style={{ fontSize: 80, color: '#ddd', marginBottom: 25, animation: 'float 3s ease-in-out infinite' }}></i>
              <h4 style={{ color: '#666', fontSize: '1.5rem', marginBottom: 10 }}>No Donations Yet</h4>
              <p style={{ color: '#adb5bd' }}>Make your first donation to support the temple!</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white', padding: 50, textAlign: 'center', marginTop: 80, position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}></div>
        <img src={asset('/images/temple/icon-symbol.webp')} alt="Temple" style={{
          width: 60, height: 60, marginBottom: 20, borderRadius: '50%',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'rotate(360deg) scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'rotate(0deg) scale(1)'}
        />
        <p style={{ color: '#ffd700', fontWeight: 700, fontSize: '1.3rem', marginBottom: 15 }}>ॐ नमः शिवाय</p>
        <p style={{ margin: 0, opacity: 0.9 }}>© 2024 Shri Trimbakeshwar Temple. All rights reserved.</p>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
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
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '14px 18px', border: '2px solid #e2e8f0',
  borderRadius: 12, fontSize: 14, fontFamily: 'inherit', transition: 'all 0.3s ease'
};

export default Donations;
