import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const PassHistory = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/passes').then(res => {
      setPasses(res.data.passes || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this pass?')) return;
    try {
      await api.post(`/passes/${id}/cancel`);
      setPasses(passes.map(p => p.id === id ? { ...p, status: 'cancelled' } : p));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel pass');
    }
  };

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <i className="fa fa-spinner fa-spin" style={{ fontSize: 32, color: '#667eea' }}></i>
    </div>
  );

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      paddingTop: 80
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 30
        }}>
          <h1 style={{
            color: '#1e3c72',
            fontSize: '2rem',
            fontWeight: 700,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <i className="fas fa-ticket-alt" style={{ color: '#667eea' }}></i>
            My Darshan Passes
          </h1>
          <Link to="/passes/new" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '12px 28px',
            borderRadius: 25,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.3s ease',
            border: 'none'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <i className="fas fa-plus"></i>
            Book New Pass
          </Link>
        </div>

        <div style={{
          background: 'white',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px 30px',
            fontWeight: 600,
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <i className="fas fa-list" style={{ marginRight: 8 }}></i>
            All Passes ({passes.length})
          </div>

          <div style={{ padding: 0 }}>
            {passes.length > 0 ? (
              passes.map((pass, index) => (
                <div key={pass.id} style={{
                  padding: 25,
                  borderBottom: index < passes.length - 1 ? '1px solid #eee' : 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(102,126,234,0.05)';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 20
                  }}>
                    <div>
                      <span style={{
                        display: 'inline-block',
                        padding: '5px 15px',
                        borderRadius: 20,
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        background: pass.pass_type === 'general' ? '#e3f2fd' : pass.pass_type === 'special' ? '#fff3e0' : '#f3e5f5',
                        color: pass.pass_type === 'general' ? '#1976d2' : pass.pass_type === 'special' ? '#f57c00' : '#7b1fa2'
                      }}>
                        {pass.pass_type}
                      </span>
                      <h5 style={{
                        color: '#1e3c72',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        margin: '10px 0 5px'
                      }}>{pass.devotee_name}</h5>
                      <div style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: '#667eea',
                        background: '#f0f2ff',
                        padding: '8px 15px',
                        borderRadius: 8,
                        display: 'inline-block'
                      }}>
                        {pass.confirmation_code}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '5px 15px',
                        borderRadius: 20,
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: pass.status === 'approved' || pass.status === 'active' ? '#d4edda' : pass.status === 'pending' ? '#fff3cd' : pass.status === 'rejected' ? '#f8d7da' : '#f8d7da',
                        color: pass.status === 'approved' || pass.status === 'active' ? '#155724' : pass.status === 'pending' ? '#856404' : '#721c24'
                      }}>
                        {pass.status === 'approved' || pass.status === 'active' ? 'Approved' : pass.status === 'pending' ? 'Pending' : pass.status === 'rejected' ? 'Rejected' : 'Cancelled'}
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 20
                  }}>
                    {[
                      { icon: 'fa-calendar', label: 'Visit Date', value: pass.visit_date ? new Date(pass.visit_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A' },
                      { icon: 'fa-clock', label: 'Time Slot', value: pass.visit_time || 'N/A' },
                      { icon: 'fa-users', label: 'Persons', value: pass.no_of_persons || 'N/A' },
                      { icon: 'fa-phone', label: 'Contact', value: pass.phone || 'N/A' },
                      { icon: 'fa-credit-card', label: 'Payment', value: pass.payment_method || 'N/A' },
                      { icon: 'fa-money-bill-wave', label: 'Amount', value: pass.total_amount ? `₹${pass.total_amount}` : 'N/A' },
                      { icon: 'fa-receipt', label: 'Transaction ID', value: pass.transaction_id && pass.transaction_id !== '' ? pass.transaction_id : 'N/A' },
                      { icon: 'fa-id-card', label: 'Aadhar Number', value: pass.aadhar_number || 'N/A' }
                    ].map((item, i) => {
                      if (item.icon === 'fa-id-card' && pass.aadhar_card) {
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 40, height: 40,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white', borderRadius: '50%',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
                            }}>
                              <i className="fas fa-id-card"></i>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.85rem', color: '#777', marginBottom: 2 }}>Aadhar Card</div>
                              <a href={`/uploads/passes/${pass.aadhar_card}`} target="_blank"
                                style={{ color: '#667eea', fontWeight: 600, fontSize: 14, textDecoration: 'underline' }}>
                                View Card
                              </a>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 40, height: 40,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
                          }}>
                            <i className={`fas ${item.icon}`}></i>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.85rem', color: '#777', marginBottom: 2 }}>{item.label}</div>
                            <div style={{ fontWeight: 600, color: '#333' }}>{item.value}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{
                    marginTop: 20,
                    paddingTop: 20,
                    borderTop: '1px solid #eee',
                    display: 'flex',
                    gap: 10,
                    flexWrap: 'wrap'
                  }}>
                    <Link to={`/passes/${pass.pass_id}`} style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: 10,
                      textDecoration: 'none',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.3s ease',
                      border: 'none'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      <i className="fas fa-eye"></i>
                      View Details
                    </Link>

                    {(pass.status === 'approved' || pass.status === 'active') && (
                      <a href={`/passes/${pass.pass_id}/print`} target="_blank" style={{
                        background: '#28a745',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: 10,
                        textDecoration: 'none',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'all 0.3s ease',
                        border: 'none'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        <i className="fas fa-print"></i>
                        Print Pass
                      </a>
                    )}

                    {pass.status !== 'cancelled' && pass.status !== 'rejected' && pass.status !== 'approved' && pass.status !== 'active' && (
                      <button onClick={() => handleCancel(pass.id)} style={{
                        background: '#dc3545',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: 10,
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        <i className="fas fa-times"></i>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: 60, textAlign: 'center' }}>
                <i className="fas fa-ticket-alt" style={{ fontSize: 80, color: '#dee2e6', marginBottom: 20, display: 'block' }}></i>
                <h3 style={{ color: '#6c757d', marginBottom: 10 }}>No Passes Found</h3>
                <p style={{ color: '#adb5bd' }}>You haven't booked any darshan passes yet.</p>
                <Link to="/passes/new" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '12px 30px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 15,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <i className="fas fa-plus"></i>
                  Book Your First Pass
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassHistory;
