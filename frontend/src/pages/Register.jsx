import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', username: '', email: '', password: '', password2: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (formData.password !== formData.password2) {
      setError('Passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      await register(formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: p.left, top: p.top,
          width: p.size, height: p.size, background: p.color, borderRadius: '50%',
          animation: `float ${p.duration}s ${p.delay}s infinite ease-in-out`
        }} />
      ))}

      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '30px 20px', position: 'relative', zIndex: 1
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.98)', borderRadius: 24,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          overflow: 'hidden', width: '100%', maxWidth: 500,
          animation: 'slideUp 0.8s ease'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '35px 30px', textAlign: 'center', position: 'relative', overflow: 'hidden'
          }}>
            <h1 style={{
              color: 'white', fontWeight: 700, fontSize: 26, marginBottom: 5,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)', position: 'relative'
            }}>
              <i className="fas fa-user-plus me-2"></i>Create Account
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, position: 'relative' }}>
              Join Temple ERP - Start your spiritual journey
            </p>
          </div>

          <div style={{ padding: '35px 30px' }}>
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
            {success && (
              <div style={{
                background: 'rgba(72,187,120,0.15)', color: '#276749',
                border: '1px solid rgba(72,187,120,0.3)', borderRadius: 12,
                padding: '15px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12
              }}>
                <i className="fas fa-check-circle" style={{ fontSize: 20 }}></i>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>First Name</label>
                  <div style={{ position: 'relative' }}>
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First name" required style={inputStyle} />
                    <i className="fas fa-user" style={iconStyle}></i>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Last Name</label>
                  <div style={{ position: 'relative' }}>
                    <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last name" required style={inputStyle} />
                    <i className="fas fa-user" style={iconStyle}></i>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required style={inputStyle} />
                  <i className="fas fa-envelope" style={iconStyle}></i>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Username</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Choose a username" required style={inputStyle} />
                  <i className="fas fa-at" style={iconStyle}></i>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" required minLength="6" style={inputStyle} />
                  <i className="fas fa-lock" style={iconStyle}></i>
                </div>
              </div>

              <div style={{ marginBottom: 25 }}>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input type="password" name="password2" value={formData.password2} onChange={handleChange} placeholder="Confirm your password" required style={inputStyle} />
                  <i className="fas fa-lock" style={iconStyle}></i>
                </div>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: 16,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white', border: 'none', borderRadius: 12, fontSize: 16,
                fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'
              }}>
                {loading ? (
                  <><i className="fas fa-spinner fa-spin me-2"></i>Creating Account...</>
                ) : (
                  <><i className="fas fa-user-plus me-2"></i>Create Account</>
                )}
              </button>
            </form>

            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <p style={{ marginBottom: 0, color: '#64748b' }}>
                Already have an account? <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 500 }}>Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-100px) translateX(50px); opacity: 0.6; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const labelStyle = { color: '#4a5568', fontWeight: 500, marginBottom: 8, display: 'block' };
const inputStyle = {
  width: '100%', padding: '14px 15px 14px 48px',
  border: '2px solid #e2e8f0', borderRadius: 12, fontSize: 14,
  transition: 'all 0.3s ease', background: '#f8fafc'
};
const iconStyle = {
  position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)',
  color: '#667eea', fontSize: 16, pointerEvents: 'none'
};
const particles = Array.from({ length: 25 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 10 + 5,
  color: ['rgba(102,126,234,0.3)', 'rgba(118,75,162,0.3)', 'rgba(255,255,255,0.1)'][Math.floor(Math.random() * 3)],
  duration: Math.random() * 10 + 10,
  delay: Math.random() * 10
}));

export default Register;
