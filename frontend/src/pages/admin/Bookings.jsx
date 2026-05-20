import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/bookings/all').then(res => {
      setBookings(res.data.bookings);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleConfirm = async (id) => {
    try {
      await api.post(`/bookings/${id}/confirm`);
      setBookings(bookings.map(b => b._id === id ? { ...b, booking_status: 'confirmed' } : b));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm booking');
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.post(`/bookings/${id}/cancel-admin`);
      setBookings(bookings.map(b => b._id === id ? { ...b, booking_status: 'cancelled' } : b));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => (b.booking_status || '').toLowerCase() === filter);

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'confirmed') return { background: '#d1fae5', color: '#065f46', label: 'Confirmed' };
    if (s === 'pending') return { background: '#fef3c7', color: '#92400e', label: 'Pending' };
    if (s === 'cancelled') return { background: '#fee2e2', color: '#991b1b', label: 'Cancelled' };
    return { background: '#f1f5f9', color: '#475569', label: status };
  };

  if (loading) return <AdminLayout title="Room Bookings"><div style={{ textAlign: 'center', padding: 100, color: '#64748b' }}>Loading bookings...</div></AdminLayout>;

  return (
    <AdminLayout title="Room Bookings">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              background: filter === f ? '#6366f1' : '#fff', color: filter === f ? '#fff' : '#475569',
              boxShadow: filter === f ? '0 2px 4px rgba(99,102,241,0.3)' : '0 1px 2px rgba(0,0,0,0.06)'
            }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: '#64748b' }}>{filtered.length} booking{filtered.length !== 1 ? 's' : ''}</div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
              {['Booking ID', 'Guest', 'Room', 'Check-in', 'Check-out', 'Amount', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No bookings found</td></tr>
            ) : filtered.map(b => {
              const badge = getStatusBadge(b.booking_status);
              return (
                <tr key={b._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{b.booking_id || 'N/A'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{b.guest_name || 'N/A'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{b.room?.room_name || b.room_name || 'N/A'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{b.check_in ? new Date(b.check_in).toLocaleDateString() : '-'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{b.check_out ? new Date(b.check_out).toLocaleDateString() : '-'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>₹{b.total_amount || 0}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 12, fontWeight: 600, background: badge.background, color: badge.color }}>{badge.label}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {(b.booking_status || '').toLowerCase() === 'pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleConfirm(b._id)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#10b981', color: '#fff' }}>Confirm</button>
                        <button onClick={() => handleCancel(b._id)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#ef4444', color: '#fff' }}>Cancel</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
