import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
      <h1>SIWARIS GELORA</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
        Sistem Informasi Pelayanan Surat Pernyataan Ahli Waris Berbasis Digital Terintegrasi Kelurahan Gelora
      </p>
      
      {/* Interactive Infographic Skeleton */}
      <div className="infographic" style={{ margin: '40px 0' }}>
        <div className="info-step active">
          <div className="info-icon">1</div>
          <div className="info-title">Daftar</div>
          <div className="info-desc">Isi form & upload berkas</div>
        </div>
        <div className="info-step">
          <div className="info-icon">2</div>
          <div className="info-title">Verifikasi</div>
          <div className="info-desc">Petugas memverifikasi berkas</div>
        </div>
        <div className="info-step">
          <div className="info-icon">3</div>
          <div className="info-title">Proses</div>
          <div className="info-desc">Tanda tangan Lurah</div>
        </div>
        <div className="info-step">
          <div className="info-icon">4</div>
          <div className="info-title">Selesai</div>
          <div className="info-desc">Ambil dokumen di kantor</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <Link to="/apply" className="btn btn-primary">Daftar Sekarang</Link>
        <Link to="/track" className="btn btn-outline">Cek Status</Link>
      </div>
    </div>
  );
};

export default LandingPage;
