import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const AdminPasses = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/passes/all').then(res => {
      setPasses(res.data.passes);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.post(`/passes/${id}/approve`);
      setPasses(passes.map(p => p._id === id ? { ...p, status: 'approved', payment_status: 'paid' } : p));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve pass');
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to reject this pass?')) return;
    try {
      await api.post(`/passes/${id}/reject`);
      setPasses(passes.map(p => p._id === id ? { ...p, status: 'rejected' } : p));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject pass');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this pass? This action cannot be undone.')) return;
    try {
      await api.delete(`/passes/${id}`);
      setPasses(passes.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete pass');
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedIds.length === 0 || !confirm(`Delete ${selectedIds.length} selected passes? This cannot be undone.`)) return;
    try {
      await api.delete('/passes/multiple', { data: { ids: selectedIds } });
      setPasses(passes.filter(p => !selectedIds.includes(p._id)));
      setSelectedIds([]);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete passes');
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id]);
  };

  const toggleSelectAll = (checked) => {
    setSelectedIds(checked ? passes.map(p => p._id) : []);
  };

  const filtered = filter === 'all' ? passes : passes.filter(p => (p.status || '').toLowerCase() === filter);

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'approved' || s === 'active') return { background: '#d1fae5', color: '#065f46', label: status };
    if (s === 'pending') return { background: '#fef3c7', color: '#92400e', label: status };
    if (s === 'rejected') return { background: '#fee2e2', color: '#991b1b', label: status };
    return { background: '#f1f5f9', color: '#475569', label: status };
  };

  const getPaymentBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'paid') return { background: '#d1fae5', color: '#065f46' };
    if (s === 'pending') return { background: '#fef3c7', color: '#92400e' };
    return { background: '#f1f5f9', color: '#475569' };
  };

  if (loading) return <AdminLayout title="Darshan Passes"><div style={{ textAlign: 'center', padding: 100, color: '#64748b' }}>Loading passes...</div></AdminLayout>;

  return (
    <AdminLayout title="Darshan Passes">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              background: filter === f ? '#6366f1' : '#fff', color: filter === f ? '#fff' : '#475569',
              boxShadow: filter === f ? '0 2px 4px rgba(99,102,241,0.3)' : '0 1px 2px rgba(0,0,0,0.06)'
            }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {selectedIds.length > 0 && (
            <button onClick={handleDeleteMultiple} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: '#ef4444', color: '#fff' }}>
              <i className="fas fa-trash" style={{ marginRight: 6 }}></i>Delete Selected ({selectedIds.length})
            </button>
          )}
          <div style={{ fontSize: 13, color: '#64748b' }}>{filtered.length} pass{filtered.length !== 1 ? 'es' : ''}</div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
              <th style={{ padding: '12px 16px', width: 40 }}><input type="checkbox" checked={selectedIds.length === passes.length && passes.length > 0} onChange={e => toggleSelectAll(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer' }} /></th>
              {['Pass ID', 'Type', 'Devotee', 'Visit Date', 'Persons', 'Amount', 'Status', 'Payment', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="10" style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No passes found</td></tr>
            ) : filtered.map(p => {
              const statusBadge = getStatusBadge(p.status);
              const payBadge = getPaymentBadge(p.payment_status);
              return (
                <tr key={p._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '14px 16px' }}><input type="checkbox" checked={selectedIds.includes(p._id)} onChange={() => toggleSelect(p._id)} style={{ width: 16, height: 16, cursor: 'pointer' }} /></td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.pass_id || 'N/A'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{p.pass_type || 'N/A'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{p.devotee_name || 'N/A'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{p.visit_date ? new Date(p.visit_date).toLocaleDateString() : '-'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{p.no_of_persons || 0}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>₹{p.total_amount || 0}</td>
                  <td style={{ padding: '14px 16px' }}><span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 12, fontWeight: 600, background: statusBadge.background, color: statusBadge.color }}>{statusBadge.label}</span></td>
                  <td style={{ padding: '14px 16px' }}><span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 12, fontWeight: 600, background: payBadge.background, color: payBadge.color }}>{p.payment_status || 'N/A'}</span></td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {(p.status || '').toLowerCase() === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(p._id)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#10b981', color: '#fff' }}>Approve</button>
                          <button onClick={() => handleReject(p._id)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#f59e0b', color: '#fff' }}>Reject</button>
                        </>
                      )}
                      <button onClick={() => handleDelete(p._id)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#ef4444', color: '#fff' }}>Delete</button>
                    </div>
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

export default AdminPasses;
