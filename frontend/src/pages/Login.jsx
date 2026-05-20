import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ ...formData, remember });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: p.left,
          top: p.top,
          width: p.size,
          height: p.size,
          background: p.color,
          borderRadius: '50%',
          animation: `float ${p.duration}s ${p.delay}s infinite ease-in-out`
        }} />
      ))}

      {/* Admin Login Link */}
      <Link to="/admin/login" style={{
        position: 'fixed', top: 20, right: 20, zIndex: 10,
        background: 'rgba(255,255,255,0.1)', border: 'none',
        color: 'rgba(255,255,255,0.7)', width: 40, height: 40,
        borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', textDecoration: 'none', fontSize: 16
      }} title="Admin Login">
        <i className="fas fa-user-shield"></i>
      </Link>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 24,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          width: '100%',
          maxWidth: 450,
          animation: 'slideUp 0.8s ease'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 30px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <i className="fas fa-om" style={{
              fontSize: 60,
              color: '#ffd700',
              textShadow: '0 0 30px rgba(255,215,0,0.5)',
              animation: 'glow 2s ease-in-out infinite',
              display: 'block',
              marginBottom: 10
            }}></i>
            <h1 style={{
              color: 'white', fontWeight: 700, fontSize: 28, marginBottom: 5,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)', position: 'relative'
            }}>Temple ERP</h1>
            <p style={{
              color: 'rgba(255,255,255,0.9)', fontSize: 14, position: 'relative'
            }}>Welcome back! Login to continue</p>
          </div>

          {/* Body */}
          <div style={{ padding: '40px 35px' }}>
            {error && (
              <div style={{
                background: 'rgba(252,129,129,0.15)', color: '#c53030',
                border: '1px solid rgba(252,129,129,0.3)', borderRadius: 12,
                padding: '15px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12
              }}>
                <i className="fas fa-exclamation-circle" style={{ fontSize: 20 }}></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 25 }}>
                <label style={{ color: '#4a5568', fontWeight: 500, marginBottom: 8, display: 'block' }}>
                  Username / Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text" name="username" value={formData.username} onChange={handleChange}
                    placeholder="Enter your username or email" required
                    style={inputStyle}
                  />
                  <i className="fas fa-user" style={{
                    position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)',
                    color: '#667eea', fontSize: 18, pointerEvents: 'none'
                  }}></i>
                </div>
              </div>

              <div style={{ marginBottom: 25 }}>
                <label style={{ color: '#4a5568', fontWeight: 500, marginBottom: 8, display: 'block' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                    placeholder="Enter your password" required
                    style={{ ...inputStyle, paddingRight: 50 }}
                  />
                  <i className="fas fa-lock" style={{
                    position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)',
                    color: '#667eea', fontSize: 18, pointerEvents: 'none'
                  }}></i>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                    position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 16
                  }}>
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
                <label style={{ color: '#64748b', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setRemember(!remember)}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 20, height: 20, border: `2px solid ${remember ? '#667eea' : '#667eea'}`,
                    borderRadius: 4, marginRight: 8, transition: 'all 0.3s ease',
                    background: remember ? '#667eea' : 'transparent'
                  }}>
                    {remember && <i className="fas fa-check" style={{ fontSize: 12, color: 'white' }}></i>}
                  </span>
                  Remember me
                </label>
                <Link to="/forgot-password" style={{
                  color: '#667eea', textDecoration: 'none', fontSize: 14, fontWeight: 500
                }}>Forgot Password?</Link>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: 16,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white', border: 'none', borderRadius: 12, fontSize: 16,
                fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'
              }}>
                {loading ? (
                  <><i className="fas fa-spinner fa-spin me-2"></i>Logging in...</>
                ) : (
                  <><i className="fas fa-sign-in-alt me-2"></i>Login</>
                )}
              </button>
            </form>

            <div style={{
              display: 'flex', alignItems: 'center', margin: '30px 0'
            }}>
              <div style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }}></div>
              <span style={{ padding: '0 15px', color: '#94a3b8', fontSize: 13 }}>OR</span>
              <div style={{ flex: 1, borderBottom: '1px solid #e2e8f0' }}></div>
            </div>

            <Link to="/register" style={{
              width: '100%', padding: 16, background: 'white',
              color: '#667eea', border: '2px solid #667eea', borderRadius: 12,
              fontSize: 16, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              textDecoration: 'none', transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-user-plus"></i>
              Create New Account
            </Link>

            <div style={{ marginTop: 25, textAlign: 'center' }}>
              <Link to="/" style={{
                color: '#667eea', display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', border: '2px solid #667eea', borderRadius: 25,
                textDecoration: 'none', fontWeight: 500, transition: 'all 0.3s ease'
              }}>
                <i className="fas fa-home"></i>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-100px) translateX(50px); opacity: 0.6; }
          50% { transform: translateY(-50px) translateX(-30px); opacity: 0.4; }
          75% { transform: translateY(-150px) translateX(20px); opacity: 0.5; }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 20px rgba(255,215,0,0.5); }
          50% { text-shadow: 0 0 40px rgba(255,215,0,0.8), 0 0 60px rgba(255,215,0,0.4); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '14px 15px 14px 50px',
  border: '2px solid #e2e8f0', borderRadius: 12, fontSize: 15,
  transition: 'all 0.3s ease', background: '#f8fafc'
};

const particles = Array.from({ length: 30 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 10 + 5,
  color: ['rgba(102,126,234,0.3)', 'rgba(118,75,162,0.3)', 'rgba(255,255,255,0.1)'][Math.floor(Math.random() * 3)],
  duration: Math.random() * 10 + 10,
  delay: Math.random() * 10
}));

export default Login;
