import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(formData);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0c1929 0%, #1e3c72 50%, #162447 100%)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: p.left, top: p.top,
          width: p.size, height: p.size,
          background: p.color, borderRadius: '50%',
          animation: `float ${p.duration}s ${p.delay}s infinite ease-in-out`
        }} />
      ))}

      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, position: 'relative', zIndex: 1
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.98)', borderRadius: 24,
          boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,215,0,0.1)',
          overflow: 'hidden', width: '100%', maxWidth: 480,
          animation: 'slideUp 0.8s ease'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            padding: '50px 30px', textAlign: 'center', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,215,0,0.2)', color: '#ffd700',
              padding: '6px 14px', borderRadius: 20, fontSize: 12,
              fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1,
              marginBottom: 10, position: 'relative'
            }}>
              <i className="fas fa-shield-alt"></i> Secure Admin
            </div>
            <div style={{
              width: 90, height: 90, background: 'rgba(255,215,0,0.2)',
              border: '3px solid #ffd700', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', animation: 'glow 2s ease-in-out infinite',
              position: 'relative'
            }}>
              <i className="fas fa-user-shield" style={{ fontSize: 40, color: '#ffd700' }}></i>
            </div>
            <h1 style={{
              color: 'white', fontWeight: 700, fontSize: 28, marginBottom: 5,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)', position: 'relative'
            }}>Admin Portal</h1>
            <p style={{
              color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 300,
              position: 'relative'
            }}>Shri Trimbakeshwar Temple Management</p>
          </div>

          <div style={{ padding: '40px 35px' }}>
            {error && (
              <div style={{
                background: 'rgba(220,53,69,0.1)', color: '#dc3545',
                border: '1px solid rgba(220,53,69,0.2)', borderRadius: 14,
                padding: '16px 20px', marginBottom: 25, display: 'flex',
                alignItems: 'center', gap: 12, fontSize: 14
              }}>
                <i className="fas fa-exclamation-circle" style={{ fontSize: 20 }}></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 25 }}>
                <label style={{ color: '#4a5568', fontWeight: 500, marginBottom: 8, display: 'block', fontSize: 14 }}>
                  <i className="fas fa-user me-1"></i> Username / Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input type="text" name="username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Enter admin username or email" required style={{
                    width: '100%', padding: '16px 18px 16px 55px', border: '2px solid #e2e8f0',
                    borderRadius: 14, fontSize: 15, transition: 'all 0.3s ease', background: '#f8fafc'
                  }} />
                  <i className="fas fa-user" style={{
                    position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
                    color: '#1e3c72', fontSize: 18, pointerEvents: 'none'
                  }}></i>
                </div>
              </div>

              <div style={{ marginBottom: 25 }}>
                <label style={{ color: '#4a5568', fontWeight: 500, marginBottom: 8, display: 'block', fontSize: 14 }}>
                  <i className="fas fa-lock me-1"></i> Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password" required style={{
                    width: '100%', padding: '16px 18px 16px 55px', border: '2px solid #e2e8f0',
                    borderRadius: 14, fontSize: 15, transition: 'all 0.3s ease', background: '#f8fafc'
                  }} />
                  <i className="fas fa-lock" style={{
                    position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
                    color: '#1e3c72', fontSize: 18, pointerEvents: 'none'
                  }}></i>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                    position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer',
                    zIndex: 3, padding: 5, fontSize: 16
                  }}>
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: 18,
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                color: 'white', border: 'none', borderRadius: 14, fontSize: 16,
                fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
                textTransform: 'uppercase', letterSpacing: 1
              }}>
                {loading ? (
                  <><i className="fas fa-spinner fa-spin me-2"></i>Authenticating...</>
                ) : (
                  <><i className="fas fa-sign-in-alt me-2"></i>Admin Login</>
                )}
              </button>

              <div style={{
                background: 'linear-gradient(135deg, rgba(30,60,114,0.05), rgba(42,82,152,0.08))',
                border: '1px solid rgba(30,60,114,0.1)', borderRadius: 12,
                padding: 15, marginTop: 20, textAlign: 'center'
              }}>
                <p style={{ color: '#64748b', fontSize: 12, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <i className="fas fa-lock" style={{ color: '#28a745' }}></i>
                  This is a secure admin area. All actions are logged.
                </p>
              </div>
            </form>

            <div style={{ marginTop: 25, paddingTop: 25, borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
              <Link to="/login" style={{
                color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 500,
                display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.3s ease'
              }}>
                <i className="fas fa-arrow-left"></i> Back to User Login
              </Link>
            </div>

            <div style={{ marginTop: 10, textAlign: 'center' }}>
              <Link to="/" style={{
                color: '#ffd700', textDecoration: 'none', fontSize: 14, fontWeight: 500,
                display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.3s ease'
              }}>
                <i className="fas fa-home"></i> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.3; }
          25% { transform: translateY(-100px) translateX(50px) rotate(90deg); opacity: 0.6; }
          50% { transform: translateY(-200px) translateX(-30px) rotate(180deg); opacity: 0.4; }
          75% { transform: translateY(-150px) translateX(80px) rotate(270deg); opacity: 0.5; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.3); }
          50% { box-shadow: 0 0 40px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.3); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(60px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

const particles = Array.from({ length: 25 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 15 + 8,
  color: ['rgba(255,215,0,0.15)', 'rgba(30,60,114,0.2)', 'rgba(42,82,152,0.15)'][Math.floor(Math.random() * 3)],
  duration: Math.random() * 15 + 15,
  delay: Math.random() * 10
}));

export default AdminLogin;
