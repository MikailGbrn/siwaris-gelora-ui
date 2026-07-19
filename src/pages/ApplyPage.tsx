import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ApplyPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <h2>Pendaftaran Berhasil</h2>
        <p>Nomor Registrasi Anda: <strong>SWG-2026-0001</strong></p>
        <Link to="/track" className="btn btn-primary" style={{ marginTop: '20px' }}>Cek Status</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2>Formulir Permohonan (Skeleton)</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nama Pemohon</label>
          <input type="text" className="form-control" required placeholder="Masukkan nama" />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Kirim</button>
      </form>
    </div>
  );
};

export default ApplyPage;
