import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('admin_token', 'mock_token');
    navigate('/admin');
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '80px auto' }}>
      <div className="card" style={{ padding: '30px' }}>
        <h2>Login Admin (Skeleton)</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" defaultValue="admin@gelora.go.id" required />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label>Password</label>
            <input type="password" className="form-control" defaultValue="password123" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Masuk</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
