import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ApplyPage from './pages/ApplyPage';
import TrackPage from './pages/TrackPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const Navigation: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo-section">
          {/* Logo DKI placeholder or design */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}>
            JAYA
          </div>
          <div>
            <span className="logo-text">SIWARIS GELORA</span>
            <span className="logo-subtext">Kelurahan Gelora - Jakarta Pusat</span>
          </div>
        </Link>
        
        {!isAdminPath && (
          <div className="nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Beranda</Link>
            <Link to="/apply" className={`nav-link ${location.pathname === '/apply' ? 'active' : ''}`}>Daftar Online</Link>
            <Link to="/track" className={`nav-link ${location.pathname === '/track' ? 'active' : ''}`}>Cek Status</Link>
          </div>
        )}

        {isAdminPath && (
          <div className="nav-links">
            <Link to="/" className="nav-link">Ke Beranda</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">
          <p>© 2026 Pemerintah Provinsi DKI Jakarta | Kelurahan Gelora, Kecamatan Tanah Abang</p>
          <p style={{ fontSize: '0.75rem', marginTop: '5px', opacity: 0.7 }}>Sistem Informasi Pelayanan Surat Pernyataan Ahli Waris Berbasis Digital Terintegrasi</p>
        </div>
      </footer>
    </Router>
  );
};

export default App;
