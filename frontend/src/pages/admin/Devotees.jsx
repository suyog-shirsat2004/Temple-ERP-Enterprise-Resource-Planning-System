import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminDevotees = () => {
  const [devotees, setDevotees] = useState([]);
  useEffect(() => { api.get('/admin/devotees').then(res => setDevotees(res.data.devotees)); }, []);

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <h1 style={{ marginBottom: 24 }}>Devotee Management</h1>
      <div className="card">
        <table className="table">
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Mobile</th><th>Passes</th><th>Total Spent</th><th>Joined</th></tr></thead>
          <tbody>
            {devotees.map(d => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.name}</td>
                <td>{d.email}</td>
                <td>{d.mobile || '-'}</td>
                <td>{d.total_passes || 0}</td>
                <td>₹{d.total_spent || 0}</td>
                <td>{new Date(d.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDevotees;
