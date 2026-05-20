import React, { useEffect, useState } from 'react';
import api from '../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get('/restaurant').then(res => setOrders(res.data.orders)); }, []);

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <h1 style={{ marginBottom: 24 }}>Order History</h1>
      <div className="card">
        {orders.length > 0 ? (
          <table className="table">
            <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.order_id}</td>
                  <td>{o.order_date}</td>
                  <td>{typeof o.items === 'string' ? JSON.parse(o.items).length : o.items?.length || 0} items</td>
                  <td>₹{o.total_amount}</td>
                  <td><span className={`badge badge-${o.status === 'confirmed' ? 'success' : 'warning'}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>No orders found</p>}
      </div>
    </div>
  );
};

export default OrderHistory;
