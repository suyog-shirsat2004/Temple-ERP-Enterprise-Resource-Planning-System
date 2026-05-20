import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminFestivals = () => {
  const [data, setData] = useState({ upcoming_festivals: [], completed_festivals: [] });

  useEffect(() => { api.get('/content/festivals').then(res => setData(res.data)); }, []);

  const renderFestivals = (festivals, title) => (
    <div className="card" style={{ marginBottom: 24 }}>
      <h3 style={{ marginBottom: 16 }}>{title}</h3>
      {festivals.length > 0 ? (
        <table className="table">
          <thead><tr><th>Name</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
          <tbody>
            {festivals.map(f => (
              <tr key={f.id}>
                <td>{f.name}</td>
                <td>{f.event_date}</td>
                <td>{f.event_time || '-'}</td>
                <td><span className={`badge badge-${f.status === 'active' ? 'success' : 'danger'}`}>{f.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p style={{ color: '#64748b' }}>No {title.toLowerCase()}</p>}
    </div>
  );

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <h1 style={{ marginBottom: 24 }}>Festival Management</h1>
      {renderFestivals(data.upcoming_festivals, 'Upcoming Festivals')}
      {renderFestivals(data.completed_festivals, 'Past Festivals')}
    </div>
  );
};

export default AdminFestivals;
