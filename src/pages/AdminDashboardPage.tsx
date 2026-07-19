import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Dashboard Admin (Skeleton)</h2>
        <button onClick={handleLogout} className="btn btn-outline" style={{ color: 'var(--error)', borderColor: 'var(--error)' }}>Keluar</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <h3 className="stat-number">0</h3>
            <p className="stat-label">Total Permohonan</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '20px', marginTop: '20px' }}>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Belum ada data permohonan.</p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
