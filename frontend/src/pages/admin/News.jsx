import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => { loadNews(); }, []);

  const loadNews = async () => {
    try {
      const res = await api.get('/content/news');
      setNews(res.data.news || []);
      setLoading(false);
    } catch { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/content/news/${editingItem._id}`, form);
      } else {
        const formData = new FormData();
        Object.keys(form).forEach(key => formData.append(key, form[key]));
        if (imageFile) formData.append('image', imageFile);
        await api.post('/content/news', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowForm(false); setEditingItem(null);
      setForm({ title: '', content: '' });
      setImageFile(null);
      loadNews();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleEdit = (n) => {
    setEditingItem(n); setForm({ title: n.title, content: n.content });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this news?')) return;
    try { await api.delete(`/content/news/${id}`); loadNews(); } catch { alert('Failed'); }
  };

  const handleCancel = () => { setShowForm(false); setEditingItem(null); setForm({ title: '', content: '' }); setImageFile(null); };

  if (loading) return <AdminLayout title="News"><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout title="News Management">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <p style={{ color: '#64748b' }}>{news.length} news articles</p>
        <button onClick={() => { handleCancel(); setShowForm(true); }} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
          <i className="fas fa-plus" style={{ marginRight: 8 }}></i>Add News
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 24 }}>
          <h3 style={{ marginBottom: 20 }}>{editingItem ? 'Edit News' : 'Add News Article'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6, display: 'block' }}>Title</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6, display: 'block' }}>Image (optional)</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: 13, color: '#374151', marginBottom: 6, display: 'block' }}>Content</label>
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={6} required style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: 10, fontSize: 14, resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>{editingItem ? 'Update' : 'Publish'} News</button>
              <button type="button" onClick={handleCancel} style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
        {news.length > 0 ? news.map(n => (
          <div key={n._id} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {n.image && <img src={`/uploads/${n.image}`} alt="" style={{ width: '100%', height: 180, objectFit: 'cover' }} onError={e => e.target.style.display='none'} />}
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: n.status === 'active' ? '#d1fae5' : '#fee2e2', color: n.status === 'active' ? '#065f46' : '#991b1b' }}>{n.status}</span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{new Date(n.published_at).toLocaleDateString()}</span>
              </div>
              <h4 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{n.title}</h4>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 16, maxHeight: 60, overflow: 'hidden' }}>{n.content}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleEdit(n)} style={{ flex: 1, background: '#6366f1', color: '#fff', border: 'none', padding: '8px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><i className="fas fa-edit" style={{ marginRight: 6 }}></i>Edit</button>
                <button onClick={() => handleDelete(n._id)} style={{ flex: 1, background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><i className="fas fa-trash" style={{ marginRight: 6 }}></i>Delete</button>
              </div>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60, color: '#94a3b8' }}>
            <i className="fas fa-newspaper" style={{ fontSize: '3rem', marginBottom: 16, display: 'block', opacity: 0.3 }}></i>
            <p>No news articles yet</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminNews;
