import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', email: '', password: '', mobile: '' });

  useEffect(() => {
    api.get('/admin/users').then(res => {
      setUsers(res.data.users);
      setLoading(false);
    });
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', newUser);
      setShowForm(false);
      setNewUser({ name: '', username: '', email: '', password: '', mobile: '' });
      const res = await api.get('/admin/users');
      setUsers(res.data.users);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch {}
  };

  if (loading) return <div className="text-center" style={{ padding: 100 }}>Loading...</div>;

  return (
    <div className="container" style={{ padding: '24px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>User Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <i className={`fa fa-${showForm ? 'times' : 'plus'}`}></i> {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Add New User</h3>
          <form onSubmit={handleCreate}>
            <div className="grid grid-2" style={{ gap: 16 }}>
              <div className="form-group"><label>Name</label><input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required /></div>
              <div className="form-group"><label>Username</label><input value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} required /></div>
              <div className="form-group"><label>Email</label><input type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required /></div>
              <div className="form-group"><label>Password</label><input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required /></div>
              <div className="form-group"><label>Mobile</label><input value={newUser.mobile} onChange={e => setNewUser({ ...newUser, mobile: e.target.value })} /></div>
            </div>
            <button type="submit" className="btn btn-success"><i className="fa fa-save"></i> Create User</button>
          </form>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Username</th><th>Mobile</th><th>Created</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.username || '-'}</td>
                <td>{u.mobile || '-'}</td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => handleDelete(u.id)}>
                    <i className="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
