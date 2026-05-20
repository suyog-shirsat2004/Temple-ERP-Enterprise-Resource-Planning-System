import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminRestaurant = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get('/restaurant/all').then(res => setOrders(res.data.orders)); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/restaurant/${id}/status`, { status });
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } catch {}
  };

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <h1 style={{ marginBottom: 24 }}>Restaurant Orders</h1>
      <div className="card">
        <table className="table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.order_id}</td>
                <td>{o.name}</td>
                <td>₹{o.total_amount}</td>
                <td>{o.payment_method}</td>
                <td><span className={`badge badge-${o.status === 'confirmed' ? 'success' : o.status === 'pending' ? 'warning' : 'primary'}`}>{o.status}</span></td>
                <td>
                  {o.status === 'confirmed' && (
                    <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => updateStatus(o.id, 'completed')}>Complete</button>
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

export default AdminRestaurant;
