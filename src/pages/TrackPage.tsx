import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, Clock, AlertTriangle, CheckCircle2, Award, Loader2, Send } from 'lucide-react';
import { API_URL } from '../config';

interface ApplicationData {
  id: number;
  registration_number: string;
  status: string;
  applicant_name: string;
  applicant_nik: string;
  applicant_kk: string;
  applicant_address: string;
  applicant_phone: string;
  applicant_email: string;
  heir_name: string;
  death_date: string;
  relationship: string;
  is_divorced: string;
  file_permohonan: string;
  file_pengantar_rt_rw: string;
  file_pernyataan_kebenaran: string;
  file_sptjm: string;
  file_ktp_pewaris: string;
  file_ktp_ahli_waris: string;
  file_kematian_pewaris: string;
  file_kk_ahli_waris: string;
  file_akta_lahir_ahli_waris: string;
  file_ktp_saksi: string;
  file_kematian_ahli_waris_wafat_lebih_dulu: string;
  file_pendukung_lainnya: string;
  file_surat_nikah_pewaris: string;
  file_ktp_suami: string;
  file_ktp_istri: string;
  file_akta_cerai_pewaris: string;
  file_surat_kuasa: string;
  rejected_files: string;
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

  // Revision Form States
  const [revisionFiles, setRevisionFiles] = useState<{ [key: string]: File | null }>({});
  const [submittingRevision, setSubmittingRevision] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/track?reg_num=${encodeURIComponent(regNum)}&nik=${encodeURIComponent(nik)}`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Permohonan tidak ditemukan.');
      }
      const data = await response.json();
      setResult(data);
      // Reset revision files state
      setRevisionFiles({});
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan sistem. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const normalizeStatus = (status: string = '') => {
    return status.trim().toLowerCase();
  };

  const getStatusBadgeClass = (status: string) => {
    const s = normalizeStatus(status);
    if (s.includes('verifikasi')) return 'badge-pending';
    if (s.includes('perbaikan') || s.includes('revisi')) return 'badge-revision';
    if (s.includes('diproses')) return 'badge-processing';
    if (s.includes('draft') || s.includes('ttd')) return 'badge-ttd';
    if (s.includes('selesai') || s.includes('disetujui')) return 'badge-success';
    return 'badge-pending';
  };

  const getStatusPercentage = (status: string) => {
    const s = normalizeStatus(status);
    if (s.includes('verifikasi')) return 20;
    if (s.includes('perbaikan') || s.includes('revisi')) return 35;
    if (s.includes('diproses')) return 60;
    if (s.includes('draft') || s.includes('ttd')) return 85;
    if (s.includes('selesai') || s.includes('disetujui')) return 100;
    return 20;
  };

  const getStatusIcon = (status: string) => {
    const s = normalizeStatus(status);
    if (s.includes('verifikasi')) return <Clock size={24} style={{ color: '#d97706' }} />;
    if (s.includes('perbaikan') || s.includes('revisi')) return <AlertTriangle size={24} style={{ color: 'var(--error)' }} />;
    if (s.includes('diproses')) return <Clock size={24} style={{ color: '#1e40af' }} />;
    if (s.includes('draft') || s.includes('ttd')) return <Award size={24} style={{ color: '#0284c7' }} />;
    if (s.includes('selesai') || s.includes('disetujui')) return <CheckCircle2 size={24} style={{ color: 'var(--success)' }} />;
    return <Clock size={24} style={{ color: '#d97706' }} />;
  };

  const isSelesai = (status: string) => {
    const s = normalizeStatus(status);
    return s.includes('selesai') || s.includes('disetujui');
  };

  const isPerbaikan = (status: string) => {
    const s = normalizeStatus(status);
    return s.includes('perbaikan') || s.includes('revisi');
  };

  const isVerifikasi = (status: string) => {
    const s = normalizeStatus(status);
    return s.includes('verifikasi');
  };

  const isDiproses = (status: string) => {
    const s = normalizeStatus(status);
    return s.includes('diproses');
  };

  const isDraft = (status: string) => {
    const s = normalizeStatus(status);
    return s.includes('draft') || s.includes('ttd');
  };

  // Human-readable labels for files
  const getFileLabel = (key: string) => {
    switch (key) {
      case 'file_permohonan': return 'Surat Permohonan Ahli Waris';
      case 'file_pengantar_rt_rw': return 'Surat Pengantar RT/RW';
      case 'file_pernyataan_kebenaran': return 'Surat Pernyataan (Materai 10.000,-)';
      case 'file_sptjm': return 'Surat Pernyataan Tanggung Jawab Mutlak (2 Saksi & Materai)';
      case 'file_surat_kuasa': return 'Surat Kuasa Ahli Waris';
      case 'file_ktp_pewaris': return 'KTP Pewaris (Almarhum)';
      case 'file_ktp_ahli_waris': return 'KTP Ahli Waris';
      case 'file_kematian_pewaris': return 'Surat Kematian Pewaris';
      case 'file_kk_ahli_waris': return 'KK Ahli Waris';
      case 'file_akta_lahir_ahli_waris': return 'Akta Kelahiran Ahli Waris';
      case 'file_ktp_saksi': return 'KTP 2 Orang Saksi';
      case 'file_surat_nikah_pewaris': return 'Surat Nikah Pewaris';
      case 'file_ktp_suami': return 'KTP Suami / Ayah';
      case 'file_ktp_istri': return 'KTP Istri / Ibu';
      case 'file_akta_cerai_pewaris': return 'Akta Cerai Pewaris';
      case 'file_kematian_ahli_waris_wafat_lebih_dulu': return 'Surat Kematian Ahli Waris Wafat Lebih Dulu';
      case 'file_pendukung_lainnya': return 'Dokumen Pendukung Lain';
      default: return key;
    }
  };

  const handleRevisionFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran berkas maksimal 5MB.');
        e.target.value = '';
        return;
      }
      setRevisionFiles(prev => ({ ...prev, [key]: file }));
    }
  };

  const handleRevisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;

    // Check if at least one file has been selected
    const uploadedCount = Object.values(revisionFiles).filter(f => f !== null).length;
    if (uploadedCount === 0) {
      alert('Silakan pilih setidaknya satu berkas untuk diunggah ulang.');
      return;
    }

    setSubmittingRevision(true);
    const data = new FormData();
    data.append('id', result.id.toString());
    
    Object.entries(revisionFiles).forEach(([key, file]) => {
      if (file) {
        data.append(key, file);
      }
    });

    try {
      const response = await fetch(`${API_URL}/api/apply/revision`, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Gagal mengirim perbaikan.');
      }

      alert('Berkas perbaikan berhasil dikirim! Status permohonan Anda kembali ke Menunggu Verifikasi.');
      
      // Update local state results directly
      setResult(prev => prev ? {
        ...prev,
        status: 'Menunggu Verifikasi',
        rejected_files: '[]',
        admin_notes: 'Revisi berkas telah diunggah oleh pemohon.'
      } : null);
      
      setRevisionFiles({});
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan sistem saat mengirim berkas.');
    } finally {
      setSubmittingRevision(false);
    }
  };

  // Parse rejected files keys array
  let rejectedKeys: string[] = [];
  if (result && result.rejected_files) {
    try {
      rejectedKeys = JSON.parse(result.rejected_files);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Status Card */}
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
                    backgroundColor: isPerbaikan(result.status) ? 'var(--error)' : 'var(--secondary)', 
                    transition: 'width 0.4s ease' 
                  }} />
                </div>
              </div>

              {/* Status Message Box */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                backgroundColor: isSelesai(result.status) ? '#f0fdf4' : isPerbaikan(result.status) ? '#fdf2f2' : '#f8fafc',
                border: `1px solid ${isSelesai(result.status) ? '#bbf7d0' : isPerbaikan(result.status) ? '#fecaca' : 'var(--border)'}`,
                padding: '20px', 
                borderRadius: 'var(--radius-md)', 
                marginBottom: '30px' 
              }}>
                <div style={{ marginTop: '2px' }}>
                  {getStatusIcon(result.status)}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 6px 0', color: isSelesai(result.status) ? '#166534' : isPerbaikan(result.status) ? '#991b1b' : 'var(--text-primary)' }}>
                    {isSelesai(result.status) && 'Surat Siap Diambil!'}
                    {isPerbaikan(result.status) && 'Terdapat Perbaikan Berkas'}
                    {isVerifikasi(result.status) && 'Berkas Sedang Diverifikasi'}
                    {isDiproses(result.status) && 'Berkas Sedang Diproses'}
                    {isDraft(result.status) && 'Draft Surat Sudah Terbuat'}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {isSelesai(result.status) && (
                      <>Silakan datang ke <strong>Kantor Kelurahan Gelora</strong> untuk mengambil dokumen fisik asli. Jangan lupa membawa dokumen persyaratan asli Anda untuk verifikasi akhir.</>
                    )}
                    {isPerbaikan(result.status) && (
                      <>Mohon perbaiki berkas yang ditandai di bawah. Catatan petugas: <strong>{result.admin_notes || 'Silakan unggah berkas yang benar.'}</strong></>
                    )}
                    {isVerifikasi(result.status) && 'Petugas loket sedang memeriksa kelengkapan berkas fisik yang Anda unggah. Mohon tunggu informasi selanjutnya.'}
                    {isDiproses(result.status) && 'Berkas Anda sedang dalam proses penyusunan draf surat ahli waris.'}
                    {isDraft(result.status) && 'Draft Surat Pernyataan Ahli Waris Anda telah selesai dibuat dan dikirimkan ke email Anda. Silakan periksa inbox email Anda untuk mengunduh dan memeriksa berkas draft tersebut.'}
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

            </div>

            {/* Dynamic Revision Form */}
            {isPerbaikan(result.status) && rejectedKeys.length > 0 && (
              <div className="card" style={{ padding: '30px', border: '1px solid var(--error)', backgroundColor: '#fff8f8' }}>
                <h3 style={{ color: 'var(--error)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={20} /> Unggah Ulang Berkas Perbaikan
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Petugas meminta Anda untuk mengunggah ulang dokumen-dokumen berikut. Silakan pilih berkas baru dan klik <strong>Kirim Perbaikan</strong>.
                </p>

                <form onSubmit={handleRevisionSubmit}>
                  {rejectedKeys.map((key) => (
                    <div className="form-group" key={key} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '16px' }}>
                      <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                        {getFileLabel(key)} *
                      </label>
                      <div className="file-input-wrapper" style={{ backgroundColor: '#fafafa' }}>
                        <input 
                          type="file" 
                          accept=".pdf,image/*" 
                          required
                          onChange={(e) => handleRevisionFileChange(e, key)}
                        />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {revisionFiles[key] ? revisionFiles[key]!.name : "Klik untuk memilih file baru"}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ width: '100%', maxWidth: '250px', backgroundColor: 'var(--error)', borderColor: 'var(--error)', display: 'inline-flex', justifyContent: 'center' }}
                      disabled={submittingRevision}
                    >
                      {submittingRevision ? (
                        <>
                          <Loader2 size={18} className="animate-spin" style={{ marginRight: '8px' }} />
                          Mengirimkan...
                        </>
                      ) : (
                        <>
                          <Send size={18} style={{ marginRight: '8px' }} />
                          Kirim Perbaikan
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackPage;
