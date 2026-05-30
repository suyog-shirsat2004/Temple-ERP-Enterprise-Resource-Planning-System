import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { asset } from '../utils/paths';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passCounts, setPassCounts] = useState({ passes: 0, bookings: 0, donations: 0 });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    api.get('/auth/profile').then(res => {
      setFormData(res.data.user);
    });
    api.get('/dashboard').then(res => {
      setPassCounts({
        passes: res.data.total_passes,
        bookings: res.data.total_bookings,
        donations: res.data.total_donations
      });
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', formData);
      updateUser(res.data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await api.post('/auth/change-password', {
        current_password: formData.get('current_password'),
        new_password: formData.get('new_password'),
        confirm_password: formData.get('confirm_password')
      });
      setMessage({ type: 'success', text: 'Password changed successfully' });
      e.target.reset();
    } catch {
      setMessage({ type: 'error', text: 'Failed to change password' });
    }
  };

  const previewImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewUrl(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const profilePicSrc = previewUrl || (user?.profile_pic ? `/uploads/profile/${user.profile_pic}` : asset('/images/default-avatar.svg'));

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      height: '100vh',
      paddingTop: 80,
      overflowY: 'auto'
    }}>
      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 20,
        padding: 40,
        color: 'white',
        marginBottom: 30,
        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
        textAlign: 'center',
        maxWidth: 1200,
        margin: '0 auto 30px',
        paddingLeft: 24,
        paddingRight: 24
      }}>
        <div style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          border: '5px solid white',
          margin: '0 auto 20px',
          overflow: 'hidden',
          boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
        }}>
          <img 
            src={profilePicSrc}
            alt="Profile"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.src = asset('/images/default-avatar.svg'); }}
          />
        </div>
        <h2 style={{ marginBottom: 5 }}>{user?.name || 'User'}</h2>
        <p style={{ margin: 0, opacity: 0.9 }}>{user?.email || ''}</p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 40,
          marginTop: 20
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{passCounts.passes}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Passes</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{passCounts.bookings}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Bookings</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{passCounts.donations}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Donations</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 60px' }}>
        {message.text && (
          <div style={{
            background: message.type === 'success' ? 'rgba(72, 187, 120, 0.15)' : 'rgba(252, 129, 129, 0.15)',
            color: message.type === 'success' ? '#276749' : '#c53030',
            border: `1px solid ${message.type === 'success' ? 'rgba(72, 187, 120, 0.3)' : 'rgba(252, 129, 129, 0.3)'}`,
            borderRadius: 12,
            padding: '15px 20px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`} style={{ fontSize: 20 }}></i>
            <span>{message.text}</span>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: 24
        }}>
          {/* Profile Information */}
          <div style={{
            background: 'white',
            borderRadius: 20,
            padding: 30,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
            <h5 style={{
              fontSize: '1.3rem',
              fontWeight: 600,
              color: '#333',
              marginBottom: 25,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <i className="fas fa-user-circle" style={{ color: '#667eea' }}></i>
              Profile Information
            </h5>

            {editing ? (
              <form onSubmit={handleUpdate}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    fontWeight: 600,
                    color: '#555',
                    marginBottom: 8,
                    display: 'block'
                  }}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid #e0e0e0',
                      borderRadius: 10,
                      fontSize: 14
                    }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    fontWeight: 600,
                    color: '#555',
                    marginBottom: 8,
                    display: 'block'
                  }}>Email Address</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid #e0e0e0',
                      borderRadius: 10,
                      fontSize: 14,
                      background: '#f8f9fa',
                      color: '#777'
                    }}
                  />
                  <small style={{ color: '#94a3b8', fontSize: 12 }}>Email cannot be changed</small>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    fontWeight: 600,
                    color: '#555',
                    marginBottom: 8,
                    display: 'block'
                  }}>Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile || ''}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid #e0e0e0',
                      borderRadius: 10,
                      fontSize: 14
                    }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    fontWeight: 600,
                    color: '#555',
                    marginBottom: 8,
                    display: 'block'
                  }}>Address</label>
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '2px solid #e0e0e0',
                      borderRadius: 10,
                      fontSize: 14,
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  ></textarea>
                </div>

                <button type="submit" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <i className="fas fa-save" style={{ marginRight: 8 }}></i>
                  Update Profile
                </button>
              </form>
            ) : (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px',
                  borderRadius: 10,
                  background: '#f8f9fa',
                  marginBottom: 10,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f2ff';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8f9fa';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 15
                  }}>
                    <i className="fas fa-user"></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#333' }}>Name</div>
                    <div style={{ fontSize: '0.9rem', color: '#777' }}>{formData.name || 'Not set'}</div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px',
                  borderRadius: 10,
                  background: '#f8f9fa',
                  marginBottom: 10
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 15
                  }}>
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#333' }}>Email</div>
                    <div style={{ fontSize: '0.9rem', color: '#777' }}>{formData.email || 'Not set'}</div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px',
                  borderRadius: 10,
                  background: '#f8f9fa',
                  marginBottom: 10
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 15
                  }}>
                    <i className="fas fa-phone"></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#333' }}>Mobile</div>
                    <div style={{ fontSize: '0.9rem', color: '#777' }}>{formData.mobile || 'Not set'}</div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px',
                  borderRadius: 10,
                  background: '#f8f9fa',
                  marginBottom: 10
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 15
                  }}>
                    <i className="fas fa-home"></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#333' }}>Address</div>
                    <div style={{ fontSize: '0.9rem', color: '#777' }}>{formData.address || 'Not set'}</div>
                  </div>
                </div>

                <button onClick={() => setEditing(true)} style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  marginTop: 10
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <i className="fas fa-edit" style={{ marginRight: 8 }}></i>
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Profile Picture & Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Profile Picture */}
            <div style={{
              background: 'white',
              borderRadius: 20,
              padding: 30,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
              <h5 style={{
                fontSize: '1.3rem',
                fontWeight: 600,
                color: '#333',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <i className="fas fa-camera" style={{ color: '#667eea' }}></i>
                Profile Picture
              </h5>

              <div style={{
                textAlign: 'center',
                marginBottom: 20
              }}>
                <div style={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  margin: '0 auto 15px',
                  overflow: 'hidden',
                  border: '4px solid #667eea'
                }}>
                  <img 
                    src={profilePicSrc}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = asset('/images/default-avatar.svg'); }}
                  />
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!selectedFile) return;
                  const fd = new FormData();
                  fd.append('profile_pic', selectedFile);
                  try {
                    const res = await api.put('/auth/profile', fd, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    updateUser(res.data.user);
                    setMessage({ type: 'success', text: 'Profile picture updated!' });
                    setSelectedFile(null);
                  } catch {
                    setMessage({ type: 'error', text: 'Failed to upload picture' });
                  }
                }}>
                  <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }}>
                    <button type="button" style={{
                      background: '#f1f5f9',
                      color: '#64748b',
                      border: 'none',
                      padding: '10px 25px',
                      borderRadius: 10,
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}>
                      <i className="fas fa-upload" style={{ marginRight: 8 }}></i>
                      Choose Photo
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        previewImage(e);
                        setSelectedFile(e.target.files[0]);
                      }}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                  <br />
                  <small style={{ color: '#94a3b8' }}>JPG, PNG only. Max 2MB</small>
                  <br />
                  <button type="submit" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 30px',
                    borderRadius: 10,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginTop: 10
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <i className="fas fa-save" style={{ marginRight: 8 }}></i>
                    Upload Photo
                  </button>
                </form>
              </div>
            </div>

            {/* Change Password */}
            <div style={{
              background: 'white',
              borderRadius: 20,
              padding: 30,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
              <h5 style={{
                fontSize: '1.3rem',
                fontWeight: 600,
                color: '#333',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}>
                <i className="fas fa-key" style={{ color: '#667eea' }}></i>
                Change Password
              </h5>

              <form onSubmit={handlePasswordChange}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    fontWeight: 600,
                    color: '#555',
                    marginBottom: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <i className="fas fa-lock" style={{ color: '#667eea' }}></i>
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid #e2e8f0',
                      borderRadius: 12,
                      fontSize: 14,
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    fontWeight: 600,
                    color: '#555',
                    marginBottom: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <i className="fas fa-lock" style={{ color: '#667eea' }}></i>
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    required
                    minLength={6}
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid #e2e8f0',
                      borderRadius: 12,
                      fontSize: 14,
                      fontFamily: 'inherit'
                    }}
                  />
                  <small style={{ color: '#94a3b8', fontSize: 12 }}>Minimum 6 characters</small>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    fontWeight: 600,
                    color: '#555',
                    marginBottom: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <i className="fas fa-lock" style={{ color: '#667eea' }}></i>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    required
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      border: '2px solid #e2e8f0',
                      borderRadius: 12,
                      fontSize: 14,
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <button type="submit" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <i className="fas fa-key"></i>
                  Change Password
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div style={{
          background: 'white',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          maxWidth: 1200,
          margin: '0 auto 60px',
          paddingLeft: 24,
          paddingRight: 24
        }}>
          <div style={{
            padding: 30,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 20
          }}>
            {[
              { icon: 'fa-user', label: 'Username', value: user?.username || 'N/A' },
              { icon: 'fa-calendar', label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A' },
              { icon: 'fa-check-circle', label: 'Account Status', value: 'Active', color: '#10b981' },
              { icon: 'fa-ticket-alt', label: 'Last Login', value: user?.updated_at ? new Date(user.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A' }
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 15,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16
                }}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#777', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontWeight: 600, color: item.color || '#333' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
