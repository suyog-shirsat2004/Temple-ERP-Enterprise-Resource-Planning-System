import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => { api.get('/bookings/all').then(res => setBookings(res.data.bookings)); }, []);

  const handleConfirm = async (id) => {
    try {
      await api.post(`/bookings/${id}/confirm`);
      setBookings(bookings.map(b => b.id === id ? { ...b, booking_status: 'confirmed' } : b));
    } catch {}
  };

  const handleCancel = async (id) => {
    try {
      await api.post(`/bookings/${id}/cancel-admin`);
      setBookings(bookings.map(b => b.id === id ? { ...b, booking_status: 'cancelled' } : b));
    } catch {}
  };

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <h1 style={{ marginBottom: 24 }}>Room Bookings</h1>
      <div className="card">
        <table className="table">
          <thead><tr><th>Booking ID</th><th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.booking_id}</td>
                <td>{b.guest_name}</td>
                <td>{b.room?.room_name || 'N/A'}</td>
                <td>{b.check_in}</td>
                <td>{b.check_out}</td>
                <td>₹{b.total_amount}</td>
                <td><span className={`badge badge-${b.booking_status === 'Confirmed' || b.booking_status === 'confirmed' ? 'success' : b.booking_status === 'Pending' || b.booking_status === 'pending' ? 'warning' : 'danger'}`}>{b.booking_status}</span></td>
                <td>
                  {b.booking_status === 'Pending' && (
                    <>
                      <button className="btn btn-success" style={{ padding: '4px 8px', fontSize: 12, marginRight: 4 }} onClick={() => handleConfirm(b.id)}><i className="fa fa-check"></i></button>
                      <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => handleCancel(b.id)}><i className="fa fa-times"></i></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
