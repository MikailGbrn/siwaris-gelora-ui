import React, { useState } from 'react';

const TrackPage: React.FC = () => {
  const [regNum, setRegNum] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setResult("Status: Menunggu Verifikasi");
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2>Cek Status Permohonan (Skeleton)</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <div className="form-group">
          <label>Nomor Registrasi</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="SWG-2026-XXXX" 
            required 
            value={regNum}
            onChange={(e) => setRegNum(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Cari</button>
      </form>

      {result && (
        <div className="card">
          <h3>Hasil Pencarian</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default TrackPage;
