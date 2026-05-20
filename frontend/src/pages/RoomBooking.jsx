import React, { useEffect, useState } from 'react';
import api from '../services/api';

const RoomBooking = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    guest_name: '', phone: '', email: '', check_in: '', check_out: '', no_of_guests: 1
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalRoom, setModalRoom] = useState(null);
  const [modalTotal, setModalTotal] = useState(0);
  const [modalForm, setModalForm] = useState({
    guest_name: '', phone: '', email: '', check_in: '', check_out: '', no_of_guests: 1
  });

  const roomImages = ['r1.jpg', 'r2.jpg', 'r3.jpg', 'r4.jpg', 'r5.jpg', 'r6.jpg', 'r7.jpg', 'r8.jpg'];
  const roomDescriptions = {
    'standard': 'Comfortable room with basic amenities for a peaceful stay',
    'deluxe': 'Spacious room with premium furnishings and modern amenities',
    'suite': 'Luxurious suite with exclusive amenities and stunning views',
    'premium': 'Premium room with exclusive facilities and services',
    'ac': 'Air-conditioned room for ultimate comfort',
    'non-ac': 'Economical room with natural ventilation',
  };
  const roomFeatures = {
    'standard': ['Bathroom', 'Clean Linen', '24/7 Water'],
    'deluxe': ['Bathroom', 'Toiletries', 'Room Service'],
    'suite': ['Bathroom', 'Toiletries', 'Room Service', 'Butler'],
    'premium': ['Bathroom', 'Toiletries', 'Premium Service', 'Mini Bar'],
    'ac': ['Bathroom', 'Toiletries', 'Air Conditioning'],
    'non-ac': ['Shared Bathroom', 'Basic Amenities'],
  };

  const fallbackRooms = [
    { _id: 'demo1', room_name: 'Standard Room 101', room_type: 'standard', price_per_day: 1500, description: 'Comfortable room with basic amenities for a peaceful stay', status: 'available' },
    { _id: 'demo2', room_name: 'Deluxe Room 201', room_type: 'deluxe', price_per_day: 2500, description: 'Spacious room with premium furnishings and modern amenities', status: 'available' },
    { _id: 'demo3', room_name: 'Suite Room 301', room_type: 'suite', price_per_day: 4000, description: 'Luxurious suite with exclusive amenities and stunning views', status: 'available' },
    { _id: 'demo4', room_name: 'Premium Room 102', room_type: 'premium', price_per_day: 3000, description: 'Premium room with exclusive facilities and services', status: 'available' },
    { _id: 'demo5', room_name: 'AC Room 202', room_type: 'ac', price_per_day: 2000, description: 'Air-conditioned room for ultimate comfort', status: 'available' },
    { _id: 'demo6', room_name: 'Non-AC Room 103', room_type: 'non-ac', price_per_day: 1000, description: 'Economical room with natural ventilation', status: 'available' },
    { _id: 'demo7', room_name: 'Standard Room 104', room_type: 'standard', price_per_day: 1500, description: 'Clean and comfortable with temple views', status: 'available' },
    { _id: 'demo8', room_name: 'Deluxe Room 203', room_type: 'deluxe', price_per_day: 2500, description: 'Premium stay with all modern comforts', status: 'available' }
  ];

  useEffect(() => {
    api.get('/bookings/rooms').then(res => {
      const dbRooms = res.data.rooms || [];
      setRooms(dbRooms.length > 0 ? dbRooms : fallbackRooms);
    }).catch(() => {
      setRooms(fallbackRooms);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalChange = (e) => {
    setModalForm({ ...modalForm, [e.target.name]: e.target.value });
  };

  const selectRoom = (room, index) => {
    setSelectedRoom({ ...room, index });
    setFormData({ ...formData, room_id: room._id });
    calculateTotal(formData.check_in, formData.check_out, room.price_per_day);
  };

  const openModal = (room, index) => {
    setModalRoom({ ...room, index });
    setShowModal(true);
    setModalForm({ guest_name: '', phone: '', email: '', check_in: '', check_out: '', no_of_guests: 1 });
    setModalTotal(0);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalRoom(null);
  };

  const calculateTotal = (checkIn, checkOut, price) => {
    if (checkIn && checkOut && price) {
      const date1 = new Date(checkIn);
      const date2 = new Date(checkOut);
      const diffTime = Math.abs(date2 - date1);
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (nights > 0) {
        setTotalAmount(nights * price);
      }
    }
  };

  const calculateModalTotal = (checkIn, checkOut) => {
    if (checkIn && checkOut && modalRoom) {
      const date1 = new Date(checkIn);
      const date2 = new Date(checkOut);
      const diffTime = Math.abs(date2 - date1);
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (nights > 0) {
        setModalTotal(nights * modalRoom.price_per_day);
      }
    }
  };

  const handleModalFormChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...modalForm, [name]: value };
    setModalForm(updated);
    if (name === 'check_in' || name === 'check_out') {
      calculateModalTotal(updated.check_in, updated.check_out);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedRoom) {
      setMessage({ type: 'error', text: 'Please select a room first' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = { ...formData, room_id: selectedRoom._id };
      const res = await api.post('/bookings', payload);
      setMessage({ type: 'success', text: res.data.message || 'Booking successful!' });
      setFormData({ guest_name: '', phone: '', email: '', check_in: '', check_out: '', no_of_guests: 1 });
      setTotalAmount(0);
      setSelectedRoom(null);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Booking failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleModalBooking = async (e) => {
    e.preventDefault();
    if (!modalRoom) return;
    setLoading(true);
    try {
      const payload = { ...modalForm, room_id: modalRoom._id };
      const res = await api.post('/bookings', payload);
      setMessage({ type: 'success', text: res.data.message || 'Booking successful!' });
      closeModal();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Booking failed' });
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(217, 119, 6, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none', zIndex: 0
      }}></div>

      <div style={{ position: 'relative', zIndex: 1, padding: '40px 20px 60px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: 50, animation: 'fadeInDown 0.8s ease-out' }}>
          <div style={{
            width: 100, height: 100, margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
            borderRadius: 25, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 20px 40px rgba(245, 158, 11, 0.3)',
            animation: 'bounceIn 1s ease-out, gentlePulse 2s ease-in-out infinite'
          }}>
            <i className="fas fa-hotel" style={{ fontSize: 45, color: '#fff' }}></i>
          </div>
          <h1 style={{
            fontSize: '3rem', fontWeight: 800, color: '#fff', marginBottom: 15
          }}>
            Book Your <span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>Comfortable Stay</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)' }}>
            Temple Guest House - Peaceful Accommodation for Devotees
          </p>
          <p style={{
            marginTop: 15, fontSize: '1.3rem', color: '#fbbf24',
            animation: 'glowText 2s ease-in-out infinite alternate'
          }}>ॐ नमः शिवाय</p>
        </div>

        {message.text && (
          <div style={{
            background: message.type === 'success' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))' : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
            color: message.type === 'success' ? '#059669' : '#dc2626',
            borderLeft: `4px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
            borderRadius: 15, padding: '18px 22px', marginBottom: 25,
            display: 'flex', alignItems: 'center', gap: 12
          }}>
            <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`} style={{ fontSize: '1.2rem' }}></i>
            <span>{message.text}</span>
          </div>
        )}

        {/* Room Selection */}
        <div style={{ marginBottom: 50 }}>
          <div style={{ textAlign: 'center', marginBottom: 40, color: '#fff' }}>
            <h2 style={{ fontWeight: 700, marginBottom: 10 }}>
              <i className="fas fa-door-open" style={{ marginRight: 10 }}></i>Select Your Room
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>Choose from our comfortable rooms designed for your spiritual journey</p>
          </div>

          {rooms.length > 0 ? (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 30
            }}>
              {rooms.map((room, i) => {
                const img = roomImages[i % roomImages.length];
                const name = room.room_name || `Room ${i + 1}`;
                const roomTypeKey = (room.room_type || 'standard').toLowerCase();
                const desc = roomDescriptions[roomTypeKey] || 'Comfortable room for your spiritual journey';
                const features = roomFeatures[roomTypeKey] || ['Bathroom', 'Clean Linen'];
                const price = room.price_per_day || 1500;
                const roomType = room.room_type ? (room.room_type.charAt(0).toUpperCase() + room.room_type.slice(1)) : 'Standard';
                const isSelected = selectedRoom && selectedRoom.id === room.id;

                  return (
                    <div key={room._id} onClick={() => openModal(room, i)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)', borderRadius: 25, overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer',
                        border: '4px solid transparent',
                        transform: 'translateY(0)',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.25)';
                      }}
                    >
                    <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                      <img src={`/images/rooms/${img}`} alt={name} style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                      <div style={{
                        width: '100%', height: '100%', display: 'none', alignItems: 'center',
                        justifyContent: 'center', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'
                      }}>
                        <i className="fas fa-bed" style={{ fontSize: '4rem', color: 'rgba(245, 158, 11, 0.3)' }}></i>
                      </div>
                      <div style={{
                        position: 'absolute', top: 15, left: 15,
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
                        color: '#fff', padding: '6px 14px', borderRadius: 20,
                        fontWeight: 600, fontSize: '0.8rem'
                      }}>{roomType}</div>
                      <div style={{
                        position: 'absolute', bottom: 15, right: 15,
                        background: 'rgba(0,0,0,0.8)', color: '#fbbf24',
                        padding: '8px 16px', borderRadius: 20, fontWeight: 700,
                        fontSize: '1.1rem', backdropFilter: 'blur(10px)'
                      }}>₹{price.toLocaleString()}/night</div>
                    </div>
                    <div style={{ padding: 25 }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>{name}</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 15 }}>
                        {features.map((f, j) => (
                          <span key={j} style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: '#f1f5f9', color: '#64748b',
                            padding: '6px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 500
                          }}>
                            <i className="fas fa-check" style={{ color: '#f59e0b' }}></i>{f}
                          </span>
                        ))}
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 15 }}>{desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.7)' }}>
              <i className="fas fa-bed" style={{ fontSize: '4rem', color: '#f59e0b', marginBottom: 20, display: 'block' }}></i>
              <h3 style={{ marginBottom: 15, color: '#fff' }}>No Rooms Available</h3>
              <p>Currently all rooms are booked. Please check back later or contact temple administration.</p>
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {showModal && modalRoom && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
          }} onClick={closeModal}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.98)', borderRadius: 25, padding: 40,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              animation: 'fadeInUp 0.8s ease-out', maxWidth: 600, width: '100%',
              maxHeight: '90vh', overflow: 'auto', position: 'relative'
            }} onClick={(e) => e.stopPropagation()}>
              <button onClick={closeModal} style={{
                position: 'absolute', top: 20, right: 20, background: '#f1f5f9',
                border: 'none', width: 40, height: 40, borderRadius: '50%',
                cursor: 'pointer', fontSize: '1.2rem', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#64748b'
              }}>✕</button>
            <div style={{ textAlign: 'center', marginBottom: 35 }}>
              <img src={`/images/rooms/${roomImages[modalRoom.index % roomImages.length]}`} alt={modalRoom.room_name}
                style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 15, marginBottom: 20 }}
                onError={(e) => { e.target.style.display = 'none'; }} />
              <h3 style={{ fontWeight: 700, color: '#1e293b', marginBottom: 5 }}>
                <i className="fas fa-calendar-check" style={{ marginRight: 10, color: '#f59e0b' }}></i>
                Book: {modalRoom.room_name || `Room ${modalRoom.index + 1}`}
              </h3>
              <p style={{ color: '#64748b' }}>₹{modalRoom.price_per_day?.toLocaleString()}/night — Fill in your details to reserve</p>
            </div>

            {/* Info Cards */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 30
            }}>
              {[
                { icon: 'fa-clock', title: 'Check-in', value: '12:00 PM' },
                { icon: 'fa-clock', title: 'Check-out', value: '11:00 AM' },
                { icon: 'fa-calendar-times', title: 'Cancellation', value: '24hrs Before' },
                { icon: 'fa-phone', title: 'Support', value: '24/7 Available' }
              ].map((info, i) => (
                <div key={i} style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
                  borderRadius: 15, padding: 20, textAlign: 'center',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(245, 158, 11, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <i className={`fas ${info.icon}`} style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: 10, display: 'block' }}></i>
                  <h6 style={{ fontWeight: 600, color: '#1e293b', marginBottom: 5 }}>{info.title}</h6>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>{info.value}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleModalBooking}>
              <input type="hidden" name="room_id" value={modalRoom._id} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontWeight: 600, color: '#374151', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-user" style={{ color: '#f59e0b' }}></i> Guest Name
                  </label>
                  <input type="text" name="guest_name" value={modalForm.guest_name} onChange={handleModalFormChange}
                    placeholder="Enter guest name" required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, color: '#374151', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-phone" style={{ color: '#f59e0b' }}></i> Phone Number
                  </label>
                  <input type="tel" name="phone" value={modalForm.phone} onChange={handleModalFormChange}
                    placeholder="Enter phone number" required pattern="[0-9]{10}" style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 600, color: '#374151', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fas fa-envelope" style={{ color: '#f59e0b' }}></i> Email (Optional)
                </label>
                <input type="email" name="email" value={modalForm.email} onChange={handleModalFormChange}
                  placeholder="Enter email address" style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontWeight: 600, color: '#374151', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-calendar-alt" style={{ color: '#f59e0b' }}></i> Check-in Date
                  </label>
                  <input type="date" name="check_in" value={modalForm.check_in} onChange={handleModalFormChange}
                    min={getTodayDate()} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontWeight: 600, color: '#374151', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-calendar-alt" style={{ color: '#f59e0b' }}></i> Check-out Date
                  </label>
                  <input type="date" name="check_out" value={modalForm.check_out} onChange={handleModalFormChange}
                    min={getTomorrowDate()} required style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontWeight: 600, color: '#374151', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-users" style={{ color: '#f59e0b' }}></i> Number of Guests
                  </label>
                  <select name="no_of_guests" value={modalForm.no_of_guests} onChange={handleModalFormChange}
                    style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Guests</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontWeight: 600, color: '#374151', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-rupee-sign" style={{ color: '#f59e0b' }}></i> Total Amount
                  </label>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
                    border: '2px solid #f59e0b', borderRadius: 12, padding: '14px 18px',
                    fontWeight: 700, fontSize: '1.2rem', color: '#f59e0b', textAlign: 'center'
                  }}>
                    {modalTotal > 0 ? `₹${modalTotal.toLocaleString()} for ${Math.ceil((new Date(modalForm.check_out) - new Date(modalForm.check_in)) / (1000 * 60 * 60 * 24))} night(s)` : 'Select Dates'}
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '18px 30px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
                  color: '#fff', border: 'none', borderRadius: 15,
                  fontSize: '1.15rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  position: 'relative', overflow: 'hidden',
                  transition: 'all 0.3s ease', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 12,
                  boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-4px)';
                    e.target.style.boxShadow = '0 15px 40px rgba(245, 158, 11, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 30px rgba(245, 158, 11, 0.3)';
                }}
              >
                {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-hotel"></i>}
                {loading ? 'Processing Booking...' : `Book for ₹${modalTotal > 0 ? modalTotal.toLocaleString() : modalRoom.price_per_day?.toLocaleString()}`}
              </button>
            </form>

            {/* Quick Links */}
            <div style={{ display: 'flex', gap: 15, justifyContent: 'center', marginTop: 30, flexWrap: 'wrap' }}>
              <a href="/bookings/history" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', background: '#f1f5f9', color: '#64748b',
                borderRadius: 12, textDecoration: 'none', fontWeight: 500,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)';
                e.target.style.color = '#fff';
                e.target.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#f1f5f9';
                e.target.style.color = '#64748b';
                e.target.style.transform = 'translateY(0)';
              }}
              >
                <i className="fas fa-history"></i> View Booking History
              </a>
            </div>
          </div>
        </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.6)', position: 'relative', zIndex: 1
      }}>
        <img src="/images/temple/icon symbol.webp" alt="Temple" style={{
          width: 50, height: 50, marginBottom: 15, opacity: 0.7, transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => { e.target.style.opacity = 1; e.target.style.transform = 'scale(1.1)'; }}
        onMouseLeave={(e) => { e.target.style.opacity = 0.7; e.target.style.transform = 'scale(1)'; }}
        />
        <p style={{ color: '#fbbf24', fontWeight: 600, marginBottom: 10 }}>ॐ नमः शिवाय</p>
        <p style={{ margin: 0, fontSize: '0.95rem' }}>© 2024 Shri Trimbakeshwar Temple. All rights reserved.</p>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.15); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes gentlePulse {
          0%, 100% { box-shadow: 0 20px 40px rgba(245, 158, 11, 0.3); }
          50% { box-shadow: 0 20px 50px rgba(245, 158, 11, 0.5); }
        }
        @keyframes glowText {
          from { text-shadow: 0 0 10px rgba(251, 191, 36, 0.5); }
          to { text-shadow: 0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(251, 191, 36, 0.4); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '14px 18px', border: '2px solid #e5e7eb',
  borderRadius: 12, fontSize: '1rem', fontFamily: 'inherit', transition: 'all 0.3s ease'
};

export default RoomBooking;
