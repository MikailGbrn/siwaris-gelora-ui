import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, Calendar, Clock, AlertTriangle, CheckCircle2, Award } from 'lucide-react';

interface ApplicationData {
  id: number;
  registration_number: string;
  status: string;
  applicant_name: string;
  applicant_nik: string;
  heir_name: string;
  death_date: string;
  relationship: string;
  admin_notes: string;
  estimated_completion: string;
  created_at: string;
  updated_at: string;
}

const TrackPage: React.FC = () => {
  const [regNum, setRegNum] = useState('');
  const [nik, setNik] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApplicationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/track?reg_num=${encodeURIComponent(regNum)}&nik=${encodeURIComponent(nik)}`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Permohonan tidak ditemukan.');
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan sistem. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Menunggu Verifikasi': return 'badge-pending';
      case 'Sedang Diproses': return 'badge-processing';
      case 'Perlu Perbaikan': return 'badge-revision';
      case 'Menunggu TTD': return 'badge-ttd';
      case 'Selesai': return 'badge-success';
      default: return '';
    }
  };

  const getStatusPercentage = (status: string) => {
    switch (status) {
      case 'Menunggu Verifikasi': return 20;
      case 'Perlu Perbaikan': return 35;
      case 'Sedang Diproses': return 60;
      case 'Menunggu TTD': return 85;
      case 'Selesai': return 100;
      default: return 0;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Menunggu Verifikasi': return <Clock size={24} style={{ color: '#d97706' }} />;
      case 'Perlu Perbaikan': return <AlertTriangle size={24} style={{ color: 'var(--error)' }} />;
      case 'Sedang Diproses': return <Clock size={24} style={{ color: '#1e40af' }} />;
      case 'Menunggu TTD': return <Award size={24} style={{ color: '#6b21a8' }} />;
      case 'Selesai': return <CheckCircle2 size={24} style={{ color: 'var(--success)' }} />;
      default: return null;
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
          <ChevronLeft size={16} /> Kembali
        </Link>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div className="card" style={{ padding: '30px', marginBottom: '30px' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '20px', textAlign: 'center' }}>Cek Status Permohonan</h2>
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <label htmlFor="regNum">Nomor Registrasi</label>
              <input 
                type="text" 
                id="regNum" 
                className="form-control" 
                placeholder="Contoh: SWG-2026-0001" 
                required
                value={regNum}
                onChange={(e) => setRegNum(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="nik">NIK Pemohon</label>
              <input 
                type="text" 
                id="nik" 
                className="form-control" 
                placeholder="Masukkan 16 digit NIK Anda" 
                maxLength={16}
                required
                value={nik}
                onChange={(e) => setNik(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', display: 'inline-flex', justifyContent: 'center' }}
              disabled={loading}
            >
              <Search size={18} style={{ marginRight: '8px' }} />
              {loading ? 'Mencari...' : 'Cari Permohonan'}
            </button>
          </form>

          {error && (
            <div style={{ backgroundColor: '#fdf2f2', color: 'var(--error)', padding: '16px', borderRadius: 'var(--radius-sm)', marginTop: '20px', borderLeft: '4px solid var(--error)', textAlign: 'center' }}>
              {error}
            </div>
          )}
        </div>

        {result && (
          <div className="card" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '15px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nomor Registrasi</span>
                <h3 style={{ margin: '5px 0 0 0', color: 'var(--primary)' }}>{result.registration_number}</h3>
              </div>
              <span className={`badge ${getStatusBadgeClass(result.status)}`} style={{ fontSize: '0.95rem', padding: '6px 16px' }}>
                {result.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <span>Progres Pelayanan</span>
                <span style={{ fontWeight: 'bold' }}>{getStatusPercentage(result.status)}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${getStatusPercentage(result.status)}%`, 
                  height: '100%', 
                  backgroundColor: result.status === 'Perlu Perbaikan' ? 'var(--error)' : 'var(--secondary)', 
                  transition: 'width 0.4s ease' 
                }} />
              </div>
            </div>

            {/* Status Message Box */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              backgroundColor: result.status === 'Selesai' ? '#f0fdf4' : result.status === 'Perlu Perbaikan' ? '#fdf2f2' : '#f8fafc',
              border: `1px solid ${result.status === 'Selesai' ? '#bbf7d0' : result.status === 'Perlu Perbaikan' ? '#fecaca' : 'var(--border)'}`,
              padding: '20px', 
              borderRadius: 'var(--radius-md)', 
              marginBottom: '30px' 
            }}>
              <div style={{ marginTop: '2px' }}>
                {getStatusIcon(result.status)}
              </div>
              <div>
                <h4 style={{ margin: '0 0 6px 0', color: result.status === 'Selesai' ? '#166534' : result.status === 'Perlu Perbaikan' ? '#991b1b' : 'var(--text-primary)' }}>
                  {result.status === 'Selesai' && 'Surat Siap Diambil!'}
                  {result.status === 'Perlu Perbaikan' && 'Terdapat Perbaikan Berkas'}
                  {result.status === 'Menunggu Verifikasi' && 'Berkas Sedang Diverifikasi'}
                  {result.status === 'Sedang Diproses' && 'Berkas Sedang Diproses'}
                  {result.status === 'Menunggu TTD' && 'Menunggu Tanda Tangan Lurah'}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {result.status === 'Selesai' && (
                    <>Silakan datang ke <strong>Kantor Kelurahan Gelora</strong> untuk mengambil dokumen fisik asli. Jangan lupa membawa dokumen persyaratan asli Anda untuk verifikasi akhir.</>
                  )}
                  {result.status === 'Perlu Perbaikan' && (
                    <>Mohon hubungi pelayanan loket PTSP Kelurahan Gelora atau perbaiki dokumen Anda. Catatan petugas: <strong>{result.admin_notes || 'Tidak ada catatan spesifik.'}</strong></>
                  )}
                  {result.status === 'Menunggu Verifikasi' && 'Petugas loket sedang memeriksa kelengkapan berkas fisik yang Anda unggah. Mohon tunggu informasi selanjutnya.'}
                  {result.status === 'Sedang Diproses' && 'Berkas Anda sedang dalam proses penyusunan draf surat ahli waris.'}
                  {result.status === 'Menunggu TTD' && 'Draf surat sudah rampung dan saat ini sedang menunggu tanda tangan basah/elektronik dari Lurah.'}
                </p>
              </div>
            </div>

            {/* Application Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.95rem' }}>
              <div>
                <h5 style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Detail Pemohon</h5>
                <p style={{ margin: '4px 0' }}><strong>Nama:</strong> {result.applicant_name}</p>
                <p style={{ margin: '4px 0' }}><strong>NIK:</strong> {result.applicant_nik}</p>
              </div>
              <div>
                <h5 style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Data Pewaris</h5>
                <p style={{ margin: '4px 0' }}><strong>Nama Pewaris:</strong> {result.heir_name}</p>
                <p style={{ margin: '4px 0' }}><strong>Hubungan:</strong> {result.relationship}</p>
              </div>
            </div>

            {result.estimated_completion && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', paddingTop: '15px', borderTop: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Calendar size={16} />
                <span>Estimasi Selesai: <strong>{result.estimated_completion}</strong></span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackPage;
