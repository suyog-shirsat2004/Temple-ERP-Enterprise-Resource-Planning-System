import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState({ room_number: '', room_name: '', room_type: '', price_per_day: '', description: '' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const res = await api.get('/bookings/rooms/all');
      setRooms(res.data.rooms || res.data.data || []);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await api.put(`/bookings/rooms/${editingRoom._id}`, form);
      } else {
        await api.post('/bookings/rooms', form);
      }
      setShowForm(false);
      setEditingRoom(null);
      setForm({ room_number: '', room_name: '', room_type: '', price_per_day: '', description: '' });
      loadRooms();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save room');
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setForm({
      room_number: room.room_number || '',
      room_name: room.room_name || '',
      room_type: room.room_type || '',
      price_per_day: room.price_per_day || '',
      description: room.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this room? This cannot be undone.')) return;
    try {
      await api.delete(`/bookings/rooms/${id}`);
      loadRooms();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete room');
    }
  };

  const filtered = filter === 'all' ? rooms : rooms.filter(r => (r.room_type || '').toLowerCase() === filter.toLowerCase());
  const roomTypes = ['all', ...new Set(rooms.map(r => r.room_type).filter(Boolean))];

  if (loading) return <AdminLayout title="Room Management"><div style={{ textAlign: 'center', padding: 100, color: '#64748b' }}>Loading rooms...</div></AdminLayout>;

  return (
    <AdminLayout title="Room Management">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #6366f1' }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Total Rooms</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#6366f1' }}>{rooms.length}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Available</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981' }}>{rooms.filter(r => r.is_available !== false).length}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Room Types</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b' }}>{new Set(rooms.map(r => r.room_type).filter(Boolean)).size}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {roomTypes.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              background: filter === f ? '#6366f1' : '#fff', color: filter === f ? '#fff' : '#475569',
              boxShadow: filter === f ? '0 2px 4px rgba(99,102,241,0.3)' : '0 1px 2px rgba(0,0,0,0.06)'
            }}>{f === 'all' ? 'All' : f}</button>
          ))}
        </div>
        <button onClick={() => { setShowForm(true); setEditingRoom(null); setForm({ room_number: '', room_name: '', room_type: '', price_per_day: '', description: '' }); }} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fas fa-plus"></i> Add Room
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>{editingRoom ? 'Edit' : 'Add New'} Room</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Room Number</label>
                <input value={form.room_number} onChange={e => setForm({ ...form, room_number: e.target.value })} required placeholder="e.g. 101" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Room Name</label>
                <input value={form.room_name} onChange={e => setForm({ ...form, room_name: e.target.value })} required placeholder="e.g. Deluxe Suite" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Room Type</label>
                <select value={form.room_type} onChange={e => setForm({ ...form, room_type: e.target.value })} required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                  <option value="">Select type</option>
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                  <option value="dormitory">Dormitory</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Price per Day (₹)</label>
                <input type="number" value={form.price_per_day} onChange={e => setForm({ ...form, price_per_day: e.target.value })} required placeholder="e.g. 500" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Room description..." style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: '#10b981', color: '#fff' }}>
                <i className="fas fa-save" style={{ marginRight: 6 }}></i>{editingRoom ? 'Update' : 'Create'} Room
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingRoom(null); }} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: '#fff', color: '#475569' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
              {['Room No', 'Name', 'Type', 'Price/Day', 'Description', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No rooms found. Add one to get started.</td></tr>
            ) : filtered.map(r => (
              <tr key={r._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#6366f1' }}>{r.room_number || 'N/A'}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{r.room_name || 'N/A'}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 12, fontWeight: 600, background: '#e0e7ff', color: '#3730a3' }}>{r.room_type || 'N/A'}</span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#10b981' }}>₹{r.price_per_day || 0}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.description || '-'}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 12, fontWeight: 600, background: r.is_available !== false ? '#d1fae5' : '#fee2e2', color: r.is_available !== false ? '#065f46' : '#991b1b' }}>{r.is_available !== false ? 'Available' : 'Unavailable'}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleEdit(r)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#6366f1', color: '#fff' }}>Edit</button>
                    <button onClick={() => handleDelete(r._id)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#ef4444', color: '#fff' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminRooms;
