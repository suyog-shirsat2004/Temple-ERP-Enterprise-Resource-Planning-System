import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    api.get('/donations/all').then(res => setDonations(res.data.donations));
    api.get('/donations/total').then(res => setTotal(res.data.total));
  }, []);

  const handleComplete = async (id) => {
    try {
      await api.post(`/donations/${id}/complete`);
      setDonations(donations.map(d => d.id === id ? { ...d, payment_status: 'completed' } : d));
    } catch {}
  };

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Donation Management</h1>
        <div className="card" style={{ padding: '8px 16px', background: '#d1fae5' }}>
          <span style={{ fontWeight: 'bold', color: '#065f46' }}>Total: ₹{total}</span>
        </div>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Receipt</th><th>Name</th><th>Amount</th><th>Type</th><th>Method</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {donations.map(d => (
              <tr key={d.id}>
                <td>{d.receipt_no}</td>
                <td>{d.name || 'N/A'}</td>
                <td>₹{d.amount}</td>
                <td>{d.donation_type}</td>
                <td>{d.payment_method}</td>
                <td><span className={`badge badge-${d.payment_status === 'completed' ? 'success' : 'warning'}`}>{d.payment_status}</span></td>
                <td>
                  {d.payment_status === 'pending' && (
                    <button className="btn btn-success" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => handleComplete(d.id)}><i className="fa fa-check"></i> Complete</button>
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

export default AdminDonations;
