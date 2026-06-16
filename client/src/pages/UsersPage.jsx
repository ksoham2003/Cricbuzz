import { useEffect, useState } from 'react';
import { useAppStore } from '../context/appStore';

const emptyUser = {
  name: '',
  email: '',
  password: '',
  role: 'SCORER',
};

export const UsersPage = () => {
  const { users, fetchUsers, createUser, isLoading, error } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyUser);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createUser(formData);
      setFormData(emptyUser);
      setShowForm(false);
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Users Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create New User'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="card form-card">
          <h2>Create New User</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Name</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" minLength="6" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option>SCORER</option>
                  <option>ADMIN</option>
                  <option>SUPER_ADMIN</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-success" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-3">
        {isLoading ? (
          <p>Loading users...</p>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="card">
              <h3>{user.name}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Status:</strong> <span className="badge badge-primary">{user.status}</span></p>
            </div>
          ))
        ) : (
          <p>No users available. Create one to get started.</p>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
