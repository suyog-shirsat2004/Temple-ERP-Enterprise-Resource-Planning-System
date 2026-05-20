import React, { useEffect, useState } from 'react';
import api from '../services/api';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings').then(res => {
      setBookings(res.data.bookings);
      setLoading(false);
    });
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.post(`/bookings/${id}/cancel`);
      setBookings(bookings.map(b => b.id === id ? { ...b, booking_status: 'Cancelled' } : b));
    } catch {}
  };

  if (loading) return <div className="text-center" style={{ padding: 100 }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <h1 style={{ marginBottom: 24 }}>Booking History</h1>
      <div className="card">
        {bookings.length > 0 ? (
          <table className="table">
            <thead><tr><th>Booking ID</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.booking_id}</td>
                  <td>{b.room?.room_name || 'N/A'}</td>
                  <td>{b.check_in}</td>
                  <td>{b.check_out}</td>
                  <td>₹{b.total_amount}</td>
                  <td><span className={`badge badge-${b.booking_status === 'Confirmed' ? 'success' : b.booking_status === 'Pending' ? 'warning' : 'danger'}`}>{b.booking_status}</span></td>
                  <td>
                    {b.booking_status === 'Pending' && (
                      <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => handleCancel(b.id)}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>No bookings found</p>}
      </div>
    </div>
  );
};

export default BookingHistory;
