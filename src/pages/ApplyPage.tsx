import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Send, CheckCircle2, Loader2, Upload } from 'lucide-react';

const ApplyPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ registration_number: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_nik: '',
    applicant_kk: '',
    applicant_address: '',
    applicant_phone: '',
    applicant_email: '',
    heir_name: '',
    death_date: '',
    relationship: '',
    agreement: false
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    file_ktp: null,
    file_kk: null,
    file_death_cert: null,
    file_rt_rw: null,
    file_other: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal adalah 5MB.');
        e.target.value = '';
        return;
      }
      setFiles(prev => ({ ...prev, [key]: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.agreement) {
      alert('Anda harus menyetujui pernyataan kebenaran data.');
      setError('Anda harus menyetujui pernyataan kebenaran data.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (formData.death_date && formData.death_date > today) {
      alert('Tanggal meninggal dunia tidak boleh di masa depan.');
      setError('Tanggal meninggal dunia tidak boleh di masa depan.');
      return;
    }

    if (!files.file_ktp || !files.file_kk || !files.file_death_cert || !files.file_rt_rw) {
      setError('Semua dokumen wajib harus diunggah.');
      return;
    }

    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      data.append(key, val.toString());
    });

    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        data.append(key, file);
      }
    });

    try {
      const response = await fetch('http://localhost:8080/api/apply', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || 'Gagal mengirimkan permohonan.');
      }

      const result = await response.json();
      setSuccessData(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan sistem, silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="container" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <CheckCircle2 size={64} color="var(--success)" />
          </div>
          <h2 style={{ color: 'var(--primary)', marginBottom: '10px' }}>TERIMA KASIH</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Permohonan Anda berhasil diterima.
          </p>
          
          <div style={{ background: '#f8fafc', border: '1px dashed var(--border)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '30px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Nomor Registrasi Anda</span>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: '10px 0 0 0', fontWeight: '800' }}>
              {successData.registration_number}
            </h3>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Simpan nomor registrasi tersebut untuk mengecek status pelayanan secara berkala.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/track" className="btn btn-primary">Cek Status Sekarang</Link>
            <Link to="/" className="btn btn-outline">Kembali ke Beranda</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
          <ChevronLeft size={16} /> Kembali
        </Link>
      </div>

      <div className="form-container">
        <h2 style={{ color: 'var(--primary)', marginBottom: '10px', textAlign: 'center' }}>Formulir Permohonan</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', textAlign: 'center', fontSize: '0.95rem' }}>
          Lengkapi data pemohon dan data pewaris serta lampirkan berkas persyaratan dengan lengkap dan benar.
        </p>

        {error && (
          <div style={{ backgroundColor: '#fdf2f2', color: 'var(--error)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', borderLeft: '4px solid var(--error)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Bagian 1: Data Pemohon */}
          <h3 style={{ borderBottom: '2px solid var(--primary-light)', paddingBottom: '8px', color: 'var(--primary)', marginBottom: '20px' }}>
            I. DATA PEMOHON
          </h3>

          <div className="form-group">
            <label htmlFor="applicant_name">Nama Lengkap Pemohon</label>
            <input 
              type="text" 
              id="applicant_name" 
              name="applicant_name" 
              className="form-control" 
              required 
              value={formData.applicant_name} 
              onChange={handleInputChange} 
              placeholder="Masukkan nama lengkap Anda"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="applicant_nik">NIK (Nomor Induk Kependudukan)</label>
              <input 
                type="text" 
                id="applicant_nik" 
                name="applicant_nik" 
                className="form-control" 
                required 
                maxLength={16}
                value={formData.applicant_nik} 
                onChange={handleInputChange}
                placeholder="16 digit NIK"
              />
            </div>
            <div className="form-group">
              <label htmlFor="applicant_kk">Nomor KK (Kartu Keluarga)</label>
              <input 
                type="text" 
                id="applicant_kk" 
                name="applicant_kk" 
                className="form-control" 
                required 
                maxLength={16}
                value={formData.applicant_kk} 
                onChange={handleInputChange}
                placeholder="16 digit No. KK"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="applicant_address">Alamat Lengkap</label>
            <textarea 
              id="applicant_address" 
              name="applicant_address" 
              className="form-control" 
              required 
              rows={3}
              value={formData.applicant_address} 
              onChange={handleInputChange}
              placeholder="Tulis alamat lengkap sesuai KTP"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="applicant_phone">Nomor HP / WhatsApp</label>
              <input 
                type="tel" 
                id="applicant_phone" 
                name="applicant_phone" 
                className="form-control" 
                required 
                value={formData.applicant_phone} 
                onChange={handleInputChange}
                placeholder="Contoh: 08123456789"
              />
            </div>
            <div className="form-group">
              <label htmlFor="applicant_email">Alamat Email</label>
              <input 
                type="email" 
                id="applicant_email" 
                name="applicant_email" 
                className="form-control" 
                required 
                value={formData.applicant_email} 
                onChange={handleInputChange}
                placeholder="Contoh: nama@domain.com"
              />
            </div>
          </div>

          {/* Bagian 2: Data Pewaris */}
          <h3 style={{ borderBottom: '2px solid var(--primary-light)', paddingBottom: '8px', color: 'var(--primary)', marginBottom: '20px', marginTop: '40px' }}>
            II. DATA PEWARIS
          </h3>

          <div className="form-group">
            <label htmlFor="heir_name">Nama Pewaris (Almarhum / Almarhumah)</label>
            <input 
              type="text" 
              id="heir_name" 
              name="heir_name" 
              className="form-control" 
              required 
              value={formData.heir_name} 
              onChange={handleInputChange}
              placeholder="Masukkan nama pewaris"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="death_date">Tanggal Meninggal Dunia</label>
              <input 
                type="date" 
                id="death_date" 
                name="death_date" 
                className="form-control" 
                required 
                max={new Date().toISOString().split('T')[0]}
                value={formData.death_date} 
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="relationship">Hubungan Keluarga Ahli Waris</label>
              <select 
                id="relationship" 
                name="relationship" 
                className="form-control" 
                required 
                value={formData.relationship} 
                onChange={handleInputChange}
              >
                <option value="">-- Pilih Hubungan --</option>
                <option value="Anak Kandung">Anak Kandung</option>
                <option value="Istri / Suami">Istri / Suami</option>
                <option value="Orang Tua">Orang Tua</option>
                <option value="Saudara Kandung">Saudara Kandung</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Bagian 3: Upload Berkas */}
          <h3 style={{ borderBottom: '2px solid var(--primary-light)', paddingBottom: '8px', color: 'var(--primary)', marginBottom: '20px', marginTop: '40px' }}>
            III. UNGGAH DOKUMEN PERSYARATAN (Maksimal 5MB, Format PDF/Gambar)
          </h3>

          <div className="form-group">
            <label>Kartu Tanda Penduduk (KTP) Ahli Waris *</label>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                accept=".pdf,image/*" 
                required 
                onChange={(e) => handleFileChange(e, 'file_ktp')}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {files.file_ktp ? files.file_ktp.name : "Pilih file PDF atau Gambar KTP"}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Kartu Keluarga (KK) *</label>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                accept=".pdf,image/*" 
                required 
                onChange={(e) => handleFileChange(e, 'file_kk')}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {files.file_kk ? files.file_kk.name : "Pilih file PDF atau Gambar KK"}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Akta Kematian Pewaris *</label>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                accept=".pdf,image/*" 
                required 
                onChange={(e) => handleFileChange(e, 'file_death_cert')}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {files.file_death_cert ? files.file_death_cert.name : "Pilih file PDF/Gambar Akta Kematian"}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Surat Pengantar RT/RW *</label>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                accept=".pdf,image/*" 
                required 
                onChange={(e) => handleFileChange(e, 'file_rt_rw')}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {files.file_rt_rw ? files.file_rt_rw.name : "Pilih file PDF/Gambar Pengantar RT/RW"}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Dokumen Pendukung Lainnya (Opsional)</label>
            <div className="file-input-wrapper">
              <input 
                type="file" 
                accept=".pdf,image/*" 
                onChange={(e) => handleFileChange(e, 'file_other')}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {files.file_other ? files.file_other.name : "Pilih file pendukung tambahan"}
              </span>
            </div>
          </div>

          {/* Persetujuan */}
          <div style={{ margin: '30px 0', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <input 
              type="checkbox" 
              id="agreement" 
              name="agreement" 
              required
              style={{ marginTop: '4px', transform: 'scale(1.2)' }}
              checked={formData.agreement}
              onChange={handleInputChange}
            />
            <label htmlFor="agreement" style={{ fontWeight: 'normal', cursor: 'pointer', fontSize: '0.95rem' }}>
              Saya menyatakan bahwa data yang saya isi adalah benar dan dokumen yang saya unggah adalah sah serta sesuai dengan keadaan yang sebenarnya.
            </label>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', maxWidth: '300px', display: 'inline-flex', justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ marginRight: '8px' }} />
                  Mengirimkan...
                </>
              ) : (
                <>
                  <Send size={18} style={{ marginRight: '8px' }} />
                  Kirim Permohonan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyPage;
