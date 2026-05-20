import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', event_date: '', event_time: '' });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    try {
      const res = await api.get('/content/events');
      const all = [...(res.data.upcoming_events || []), ...(res.data.ongoing_events || []), ...(res.data.completed_events || [])];
      setEvents(all);
      setLoading(false);
    } catch { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/content/events/${editingItem._id}`, form);
      } else {
        const formData = new FormData();
        Object.keys(form).forEach(key => formData.append(key, form[key]));
        if (imageFile) formData.append('image', imageFile);
        await api.post('/content/events', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowForm(false); setEditingItem(null);
      setForm({ title: '', description: '', event_date: '', event_time: '' });
      setImageFile(null);
      loadEvents();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (ev) => {
    setEditingItem(ev); setForm({ title: ev.title, description: ev.description, event_date: ev.event_date?.split('T')[0] || '', event_time: ev.event_time || '' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try { await api.delete(`/content/events/${id}`); loadEvents(); } catch { alert('Failed'); }
  };

  const handleCancel = () => { setShowForm(false); setEditingItem(null); setForm({ title: '', description: '', event_date: '', event_time: '' }); setImageFile(null); };

  if (loading) return <AdminLayout title="Events"><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout title="Event Management">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <p style={{ color: '#64748b' }}>{events.length} events total</p>
        <button onClick={() => { handleCancel(); setShowForm(true); }} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
          <i className="fas fa-plus" style={{ marginRight: 8 }}></i>Add Event
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 24 }}>
          <h3 style={{ marginBottom: 20 }}>{editingItem ? 'Edit Event' : 'Add New Event'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6, display: 'block' }}>Event Title</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6, display: 'block' }}>Date</label>
                <input type="date" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} required style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6, display: 'block' }}>Time</label>
                <input type="time" value={form.event_time} onChange={e => setForm({...form, event_time: e.target.value})} style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6, display: 'block' }}>Image</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: 14 }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6, display: 'block' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: 14, resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>{editingItem ? 'Update' : 'Create'} Event</button>
              <button type="button" onClick={handleCancel} style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ padding: 14, textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Title</th>
              <th style={{ padding: 14, textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Date</th>
              <th style={{ padding: 14, textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Time</th>
              <th style={{ padding: 14, textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Status</th>
              <th style={{ padding: 14, textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? events.map(ev => (
              <tr key={ev._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: 14, fontWeight: 600, fontSize: 14 }}>{ev.title}</td>
                <td style={{ padding: 14, fontSize: 13, color: '#64748b' }}>{new Date(ev.event_date).toLocaleDateString()}</td>
                <td style={{ padding: 14, fontSize: 13, color: '#64748b' }}>{ev.event_time || '-'}</td>
                <td style={{ padding: 14 }}>
                  <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: ev.status === 'upcoming' ? '#dbeafe' : ev.status === 'completed' ? '#d1fae5' : '#fef3c7', color: ev.status === 'upcoming' ? '#1e40af' : ev.status === 'completed' ? '#065f46' : '#92400e' }}>{ev.status}</span>
                </td>
                <td style={{ padding: 14, textAlign: 'right' }}>
                  <button onClick={() => handleEdit(ev)} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', marginRight: 8 }}><i className="fas fa-edit"></i></button>
                  <button onClick={() => handleDelete(ev._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>No events found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
