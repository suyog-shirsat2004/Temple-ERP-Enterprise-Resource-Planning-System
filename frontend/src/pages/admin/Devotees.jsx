import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const AdminDevotees = () => {
  const [devotees, setDevotees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDevotee, setSelectedDevotee] = useState(null);

  useEffect(() => {
    api.get('/admin/devotees').then(res => {
      setDevotees(res.data.devotees);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleViewDetails = async (id) => {
    try {
      const res = await api.get(`/admin/devotees/${id}`);
      setSelectedDevotee(res.data.devotee);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load devotee details');
    }
  };

  const filtered = devotees.filter(d => {
    const term = search.toLowerCase();
    return (d.name || '').toLowerCase().includes(term) || (d.email || '').toLowerCase().includes(term) || (d.mobile || '').includes(term);
  });

  if (loading) return <AdminLayout title="Devotees"><div style={{ textAlign: 'center', padding: 100, color: '#64748b' }}>Loading devotees...</div></AdminLayout>;

  return (
    <AdminLayout title="Devotees">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }}></i>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search devotees..." style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ fontSize: 13, color: '#64748b' }}>{filtered.length} devotee{filtered.length !== 1 ? 's' : ''}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #6366f1' }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Total Devotees</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#6366f1' }}>{devotees.length}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Total Passes</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981' }}>{devotees.reduce((sum, d) => sum + (d.total_passes || 0), 0)}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Total Spent</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b' }}>₹{devotees.reduce((sum, d) => sum + (d.total_spent || 0), 0).toLocaleString()}</div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
              {['Name', 'Email', 'Mobile', 'Passes', 'Total Spent', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No devotees found</td></tr>
            ) : filtered.map(d => (
              <tr key={d._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', fontWeight: 700, fontSize: 13 }}>{(d.name || '?').charAt(0).toUpperCase()}</div>
                    {d.name || 'N/A'}
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{d.email || '-'}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{d.mobile || '-'}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{d.total_passes || 0}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#10b981' }}>₹{(d.total_spent || 0).toLocaleString()}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{d.created_at ? new Date(d.created_at).toLocaleDateString() : '-'}</td>
                <td style={{ padding: '14px 16px' }}>
                  <button onClick={() => handleViewDetails(d._id)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#6366f1', color: '#fff' }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDevotee && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }} onClick={() => setSelectedDevotee(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 500, width: '90%', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: 0 }}>Devotee Details</h3>
              <button onClick={() => setSelectedDevotee(null)} style={{ background: '#f1f5f9', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', color: '#475569' }}><i className="fas fa-times"></i></button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 22 }}>{(selectedDevotee.name || '?').charAt(0).toUpperCase()}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{selectedDevotee.name}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{selectedDevotee.email}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Mobile', value: selectedDevotee.mobile || '-' },
                { label: 'Joined', value: selectedDevotee.created_at ? new Date(selectedDevotee.created_at).toLocaleDateString() : '-' },
                { label: 'Total Passes', value: selectedDevotee.total_passes || 0 },
                { label: 'Total Spent', value: `₹${(selectedDevotee.total_spent || 0).toLocaleString()}` }
              ].map(item => (
                <div key={item.label} style={{ padding: 16, background: '#f8fafc', borderRadius: 10 }}>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDevotees;
