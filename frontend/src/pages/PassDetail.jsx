import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const PassDetail = () => {
  const { id } = useParams();
  const [pass, setPass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/passes/${id}`).then(res => {
      setPass(res.data.pass);
      setLoading(false);
    }).catch(err => {
      setError(err.response?.data?.message || 'Failed to load pass');
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa' }}>
      <i className="fa fa-spinner fa-spin" style={{ fontSize: 32, color: '#667eea' }}></i>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa', gap: 16 }}>
      <i className="fas fa-exclamation-circle" style={{ fontSize: 48, color: '#dc3545' }}></i>
      <h3 style={{ color: '#333' }}>{error}</h3>
      <Link to="/passes" style={{ color: '#667eea', textDecoration: 'underline' }}>Back to Passes</Link>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: '#f5f7fa', minHeight: '100vh', paddingTop: 80 }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px 60px' }}>
        <Link to="/passes" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#667eea', textDecoration: 'none', marginBottom: 20, fontWeight: 500 }}>
          <i className="fas fa-arrow-left"></i> Back to Passes
        </Link>

        <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', padding: '30px', textAlign: 'center' }}>
            <i className="fas fa-ticket-alt" style={{ fontSize: 40, marginBottom: 10 }}></i>
            <h2 style={{ margin: '0 0 5px' }}>Darshan Pass</h2>
            <div style={{ fontFamily: "'Courier New', monospace", fontSize: '1.3rem', fontWeight: 700, letterSpacing: 2 }}>{pass.pass_id}</div>
          </div>

          <div style={{ padding: 30 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ display: 'inline-block', padding: '5px 15px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', background: pass.pass_type === 'general' ? '#e3f2fd' : pass.pass_type === 'special' ? '#fff3e0' : '#f3e5f5', color: pass.pass_type === 'general' ? '#1976d2' : pass.pass_type === 'special' ? '#f57c00' : '#7b1fa2' }}>{pass.pass_type}</span>
              <span style={{ display: 'inline-block', padding: '5px 15px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600, background: pass.status === 'approved' || pass.status === 'active' ? '#d4edda' : pass.status === 'pending' ? '#fff3cd' : '#f8d7da', color: pass.status === 'approved' || pass.status === 'active' ? '#155724' : pass.status === 'pending' ? '#856404' : '#721c24' }}>{pass.status === 'approved' || pass.status === 'active' ? 'Approved' : pass.status === 'pending' ? 'Pending' : pass.status === 'rejected' ? 'Rejected' : 'Cancelled'}</span>
            </div>

            {pass.user_id && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 15, padding: '15px', background: '#f0f2ff', borderRadius: 12, marginBottom: 15 }}>
                <img src={pass.user_id.profile_pic ? `/uploads/profile/${pass.user_id.profile_pic}` : '/images/default-avatar.svg'}
                  alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #667eea' }}
                  onError={(e) => { e.target.src = '/images/default-avatar.svg'; }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 15 }}>{pass.user_id.name || 'User'}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{pass.user_id.email || ''}</div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              {[
                { icon: 'fa-user', label: 'Devotee', value: pass.devotee_name },
                { icon: 'fa-calendar', label: 'Visit Date', value: pass.visit_date ? new Date(pass.visit_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A' },
                { icon: 'fa-clock', label: 'Time Slot', value: pass.visit_time || 'N/A' },
                { icon: 'fa-users', label: 'Persons', value: pass.no_of_persons },
                { icon: 'fa-phone', label: 'Phone', value: pass.phone || 'N/A' },
                { icon: 'fa-envelope', label: 'Email', value: pass.email || 'N/A' },
                { icon: 'fa-credit-card', label: 'Payment', value: pass.payment_method || 'N/A' },
                { icon: 'fa-money-bill-wave', label: 'Amount', value: pass.total_amount ? `₹${pass.total_amount}` : 'N/A' },
                { icon: 'fa-receipt', label: 'Transaction ID', value: pass.transaction_id || 'N/A' },
                { icon: 'fa-id-card', label: 'Aadhar Number', value: pass.aadhar_number || 'N/A' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 15px', background: '#f8f9fa', borderRadius: 10 }}>
                  <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: '#777', marginBottom: 1 }}>{item.label}</div>
                    <div style={{ fontWeight: 600, color: '#333', fontSize: 14 }}>{item.value}</div>
                  </div>
                </div>
              ))}

              {pass.aadhar_card && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 15px', background: '#f8f9fa', borderRadius: 10 }}>
                  <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                    <i className="fas fa-image"></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: '#777', marginBottom: 1 }}>Aadhar Card</div>
                    <a href={`/uploads/passes/${pass.aadhar_card}`} target="_blank" style={{ color: '#667eea', fontWeight: 600, fontSize: 14, textDecoration: 'underline' }}>View Uploaded Card</a>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 25, display: 'flex', gap: 12 }}>
              <Link to="/passes" style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: 12, textDecoration: 'none', fontWeight: 600, textAlign: 'center', fontSize: 14 }}>Back to All Passes</Link>
              {(pass.status === 'approved' || pass.status === 'active') && (
                <a href={`/passes/${pass.pass_id}/print`} target="_blank" style={{ flex: 1, padding: '14px', background: '#28a745', color: 'white', borderRadius: 12, textDecoration: 'none', fontWeight: 600, textAlign: 'center', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <i className="fas fa-print"></i> Print
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassDetail;
