import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/admin/dashboard').then(res => setStats(res.data.stats)); }, []);

  if (!stats) return <div className="text-center" style={{ padding: 100 }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <h1 style={{ marginBottom: 24 }}>Reports & Analytics</h1>

      <div className="grid grid-2" style={{ marginBottom: 32 }}>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Revenue Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: '#f8fafc', borderRadius: 8 }}>
              <span>Donation Revenue</span>
              <span style={{ fontWeight: 'bold', color: '#10b981' }}>₹{stats.total_donations_amount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: '#f8fafc', borderRadius: 8 }}>
              <span>Restaurant Revenue</span>
              <span style={{ fontWeight: 'bold', color: '#ec4899' }}>₹{stats.restaurant_revenue}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: '#f8fafc', borderRadius: 8, borderTop: '2px solid #e2e8f0' }}>
              <span style={{ fontWeight: 'bold' }}>Total Revenue</span>
              <span style={{ fontWeight: 'bold', color: '#6366f1', fontSize: 18 }}>₹{stats.total_donations_amount + stats.restaurant_revenue}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Activity Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Users</span><span style={{ fontWeight: 'bold' }}>{stats.total_visitors}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Passes</span><span style={{ fontWeight: 'bold' }}>{stats.total_passes}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Bookings</span><span style={{ fontWeight: 'bold' }}>{stats.total_bookings}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Donations</span><span style={{ fontWeight: 'bold' }}>{stats.total_donations}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Restaurant Orders</span><span style={{ fontWeight: 'bold' }}>{stats.total_restaurant_orders}</span></div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Pending Items</h3>
        <div className="grid grid-4" style={{ gap: 16 }}>
          <div style={{ padding: 16, background: '#fef3c7', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#92400e' }}>{stats.pending_passes}</div>
            <div style={{ fontSize: 12, color: '#92400e' }}>Pending Passes</div>
          </div>
          <div style={{ padding: 16, background: '#e0e7ff', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#3730a3' }}>{stats.pending_bookings}</div>
            <div style={{ fontSize: 12, color: '#3730a3' }}>Pending Bookings</div>
          </div>
          <div style={{ padding: 16, background: '#d1fae5', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#065f46' }}>{stats.pending_donations}</div>
            <div style={{ fontSize: 12, color: '#065f46' }}>Pending Donations</div>
          </div>
          <div style={{ padding: 16, background: '#fce7f3', borderRadius: 8, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#9d174d' }}>{stats.pending_restaurant_orders}</div>
            <div style={{ fontSize: 12, color: '#9d174d' }}>Pending Orders</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
