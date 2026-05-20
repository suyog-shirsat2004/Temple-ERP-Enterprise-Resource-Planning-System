import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminPasses = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    api.get('/passes/all').then(res => {
      setPasses(res.data.passes);
      setLoading(false);
    });
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.post(`/passes/${id}/approve`);
      setPasses(passes.map(p => p._id === id ? { ...p, status: 'approved', payment_status: 'paid' } : p));
    } catch {}
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/passes/${id}/reject`);
      setPasses(passes.map(p => p._id === id ? { ...p, status: 'rejected' } : p));
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this pass?')) return;
    try {
      await api.delete(`/passes/${id}`);
      setPasses(passes.filter(p => p._id !== id));
    } catch {}
  };

  const handleDeleteMultiple = async () => {
    if (selectedIds.length === 0 || !confirm(`Delete ${selectedIds.length} passes?`)) return;
    try {
      await api.delete('/passes/multiple', { data: { ids: selectedIds } });
      setPasses(passes.filter(p => !selectedIds.includes(p._id)));
      setSelectedIds([]);
    } catch {}
  };

  const toggleSelect = (id) => {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id]);
  };

  if (loading) return <div className="text-center" style={{ padding: 100 }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Pass Management</h1>
        {selectedIds.length > 0 && (
          <button className="btn btn-danger" onClick={handleDeleteMultiple}>
            <i className="fa fa-trash"></i> Delete Selected ({selectedIds.length})
          </button>
        )}
      </div>

      <div className="card">
        <table className="table">
          <thead><tr><th><input type="checkbox" onChange={e => setSelectedIds(e.target.checked ? passes.map(p => p._id) : [])} /></th><th>Pass ID</th><th>Type</th><th>Devotee</th><th>Visit Date</th><th>Persons</th><th>Amount</th><th>Status</th><th>Payment</th><th>Actions</th></tr></thead>
          <tbody>
            {passes.map(p => (
              <tr key={p._id}>
                <td><input type="checkbox" checked={selectedIds.includes(p._id)} onChange={() => toggleSelect(p._id)} /></td>
                <td>{p.pass_id}</td>
                <td>{p.pass_type}</td>
                <td>{p.devotee_name}</td>
                <td>{p.visit_date}</td>
                <td>{p.no_of_persons}</td>
                <td>₹{p.total_amount}</td>
                <td><span className={`badge badge-${p.status === 'approved' || p.status === 'active' ? 'success' : p.status === 'pending' ? 'warning' : 'danger'}`}>{p.status}</span></td>
                <td><span className={`badge badge-${p.payment_status === 'paid' ? 'success' : 'warning'}`}>{p.payment_status}</span></td>
                <td>
                  {p.status === 'pending' && (
                    <>
                      <button className="btn btn-success" style={{ padding: '4px 8px', fontSize: 12, marginRight: 4 }} onClick={() => handleApprove(p._id)}><i className="fa fa-check"></i></button>
                      <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: 12, marginRight: 4 }} onClick={() => handleReject(p._id)}><i className="fa fa-times"></i></button>
                    </>
                  )}
                  <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => handleDelete(p._id)}><i className="fa fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPasses;
