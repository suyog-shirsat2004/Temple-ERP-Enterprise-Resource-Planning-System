import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/donations/all').then(res => {
      setDonations(res.data.donations);
      setLoading(false);
    }).catch(() => setLoading(false));
    api.get('/donations/total').then(res => setTotal(res.data.total || 0)).catch(() => {});
  }, []);

  const handleComplete = async (id) => {
    try {
      await api.post(`/donations/${id}/complete`);
      setDonations(donations.map(d => d._id === id ? { ...d, payment_status: 'completed' } : d));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark as complete');
    }
  };

  const filtered = filter === 'all' ? donations : donations.filter(d => (d.payment_status || '').toLowerCase() === filter);

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed' || s === 'paid') return { background: '#d1fae5', color: '#065f46' };
    if (s === 'pending') return { background: '#fef3c7', color: '#92400e' };
    if (s === 'failed') return { background: '#fee2e2', color: '#991b1b' };
    return { background: '#f1f5f9', color: '#475569' };
  };

  if (loading) return <AdminLayout title="Donations"><div style={{ textAlign: 'center', padding: 100, color: '#64748b' }}>Loading donations...</div></AdminLayout>;

  return (
    <AdminLayout title="Donations">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>Total Donations</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981' }}>₹{(total || 0).toLocaleString()}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #6366f1' }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>Total Count</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#6366f1' }}>{donations.length}</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>Pending</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b' }}>{donations.filter(d => (d.payment_status || '').toLowerCase() === 'pending').length}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'completed', 'pending'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              background: filter === f ? '#6366f1' : '#fff', color: filter === f ? '#fff' : '#475569',
              boxShadow: filter === f ? '0 2px 4px rgba(99,102,241,0.3)' : '0 1px 2px rgba(0,0,0,0.06)'
            }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: '#64748b' }}>{filtered.length} donation{filtered.length !== 1 ? 's' : ''}</div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
              {['Receipt No', 'Name', 'Amount', 'Type', 'Method', 'Date', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No donations found</td></tr>
            ) : filtered.map(d => {
              const badge = getStatusBadge(d.payment_status);
              return (
                <tr key={d._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{d.receipt_no || 'N/A'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{d.name || 'Anonymous'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#10b981' }}>₹{(d.amount || 0).toLocaleString()}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{d.donation_type || 'N/A'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{d.payment_method || 'N/A'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{d.donation_date ? new Date(d.donation_date).toLocaleDateString() : '-'}</td>
                  <td style={{ padding: '14px 16px' }}><span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 12, fontWeight: 600, background: badge.background, color: badge.color }}>{d.payment_status || 'N/A'}</span></td>
                  <td style={{ padding: '14px 16px' }}>
                    {(d.payment_status || '').toLowerCase() === 'pending' && (
                      <button onClick={() => handleComplete(d._id)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#10b981', color: '#fff' }}>Complete</button>
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

export default AdminDonations;
