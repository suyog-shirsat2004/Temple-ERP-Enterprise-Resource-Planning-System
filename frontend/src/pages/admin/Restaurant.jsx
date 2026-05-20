import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const AdminRestaurant = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', category: '', is_available: true });

  useEffect(() => {
    loadOrders();
    loadMenu();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get('/restaurant/all');
      setOrders(res.data.orders);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const loadMenu = async () => {
    try {
      const res = await api.get('/restaurant/menu');
      setMenuItems(res.data.menu || res.data.menu_items || []);
    } catch {}
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/restaurant/${id}/status`, { status });
      setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMenuItem) {
        await api.put(`/restaurant/menu/${editingMenuItem._id}`, menuForm);
      } else {
        await api.post('/restaurant/menu', menuForm);
      }
      setShowMenuForm(false);
      setEditingMenuItem(null);
      setMenuForm({ name: '', description: '', price: '', category: '', is_available: true });
      loadMenu();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save menu item');
    }
  };

  const handleEditMenu = (item) => {
    setEditingMenuItem(item);
    setMenuForm({ name: item.name || '', description: item.description || '', price: item.price || '', category: item.category || '', is_available: item.is_available !== false });
    setShowMenuForm(true);
  };

  const handleDeleteMenu = async (id) => {
    if (!confirm('Delete this menu item?')) return;
    try {
      await api.delete(`/restaurant/menu/${id}`);
      loadMenu();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete menu item');
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'completed' || s === 'delivered') return { background: '#d1fae5', color: '#065f46' };
    if (s === 'pending') return { background: '#fef3c7', color: '#92400e' };
    if (s === 'confirmed' || s === 'preparing') return { background: '#e0e7ff', color: '#3730a3' };
    if (s === 'cancelled') return { background: '#fee2e2', color: '#991b1b' };
    return { background: '#f1f5f9', color: '#475569' };
  };

  if (loading) return <AdminLayout title="Restaurant"><div style={{ textAlign: 'center', padding: 100, color: '#64748b' }}>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Restaurant">
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[{ key: 'orders', label: 'Orders', icon: 'fas fa-receipt' }, { key: 'menu', label: 'Menu Items', icon: 'fas fa-book-open' }].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8,
            background: activeTab === tab.key ? '#6366f1' : '#fff', color: activeTab === tab.key ? '#fff' : '#475569',
            boxShadow: activeTab === tab.key ? '0 2px 4px rgba(99,102,241,0.3)' : '0 1px 2px rgba(0,0,0,0.06)'
          }}><i className={tab.icon}></i>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'orders' && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No orders found</td></tr>
              ) : orders.map(o => {
                const badge = getStatusBadge(o.status);
                return (
                  <tr key={o._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{o.order_id || 'N/A'}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{o.name || 'N/A'}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? 's' : ''}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#1e293b' }}>₹{(o.total_amount || 0).toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{o.payment_method || 'N/A'}</td>
                    <td style={{ padding: '14px 16px' }}><span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 12, fontWeight: 600, background: badge.background, color: badge.color }}>{o.status || 'N/A'}</span></td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {(o.status || '').toLowerCase() === 'confirmed' && (
                          <button onClick={() => updateOrderStatus(o._id, 'completed')} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#10b981', color: '#fff' }}>Complete</button>
                        )}
                        {(o.status || '').toLowerCase() === 'pending' && (
                          <button onClick={() => updateOrderStatus(o._id, 'confirmed')} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#6366f1', color: '#fff' }}>Confirm</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'menu' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: '#64748b' }}>{menuItems.length} item{menuItems.length !== 1 ? 's' : ''}</div>
            <button onClick={() => { setShowMenuForm(true); setEditingMenuItem(null); setMenuForm({ name: '', description: '', price: '', category: '', is_available: true }); }} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: '#6366f1', color: '#fff' }}>
              <i className="fas fa-plus" style={{ marginRight: 6 }}></i>Add Item
            </button>
          </div>

          {showMenuForm && (
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>{editingMenuItem ? 'Edit' : 'Add New'} Menu Item</h3>
              <form onSubmit={handleMenuSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Name</label>
                    <input value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Category</label>
                    <input value={menuForm.category} onChange={e => setMenuForm({ ...menuForm, category: e.target.value })} required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Price (₹)</label>
                    <input type="number" value={menuForm.price} onChange={e => setMenuForm({ ...menuForm, price: e.target.value })} required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Available</label>
                    <select value={menuForm.is_available} onChange={e => setMenuForm({ ...menuForm, is_available: e.target.value === 'true' })} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Description</label>
                  <textarea value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} rows={2} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" style={{ padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: '#10b981', color: '#fff' }}>{editingMenuItem ? 'Update' : 'Create'} Item</button>
                  <button type="button" onClick={() => { setShowMenuForm(false); setEditingMenuItem(null); }} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: '#fff', color: '#475569' }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Name', 'Category', 'Price', 'Available', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {menuItems.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>No menu items</td></tr>
                ) : menuItems.map(item => (
                  <tr key={item._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{item.name}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#475569' }}>{item.category || '-'}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#10b981' }}>₹{item.price}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 12, fontWeight: 600, background: item.is_available !== false ? '#d1fae5' : '#fee2e2', color: item.is_available !== false ? '#065f46' : '#991b1b' }}>{item.is_available !== false ? 'Available' : 'Unavailable'}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleEditMenu(item)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#6366f1', color: '#fff' }}>Edit</button>
                        <button onClick={() => handleDeleteMenu(item._id)} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#ef4444', color: '#fff' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminRestaurant;
