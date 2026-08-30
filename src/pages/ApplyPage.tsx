import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { API_URL } from '../config';

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
    is_divorced: 'Tidak',
    agreement: false
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    file_permohonan: null,
    file_pengantar_rt_rw: null,
    file_pernyataan_kebenaran: null,
    file_sptjm: null,
    file_surat_kuasa: null,
    file_ktp_pewaris: null,
    file_ktp_ahli_waris: null,
    file_kematian_pewaris: null,
    file_kk_ahli_waris: null,
    file_akta_lahir_ahli_waris: null,
    file_ktp_saksi: null,
    file_kematian_ahli_waris_wafat_lebih_dulu: null,
    file_pendukung_lainnya: null,
    file_surat_nikah_pewaris: null,
    file_ktp_suami: null,
    file_ktp_istri: null,
    file_akta_cerai_pewaris: null
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

    // 1. Validate Global Mandatory Files
    const globalMandatoryKeys = [
      'file_permohonan', 'file_pengantar_rt_rw', 'file_pernyataan_kebenaran',
      'file_ktp_pewaris', 'file_ktp_ahli_waris', 'file_kematian_pewaris', 'file_kk_ahli_waris', 'file_akta_lahir_ahli_waris',
      'file_ktp_saksi'
    ];
    const missingGlobal = globalMandatoryKeys.filter(k => !files[k]);
    if (missingGlobal.length > 0) {
      const msg = 'Silakan unggah semua dokumen wajib yang diperlukan.';
      alert(msg);
      setError(msg);
      return;
    }

    // 2. Validate Relationship Conditional Files
    const hasRelDocs = formData.relationship === 'Orang Tua' || formData.relationship === 'Istri / Suami';
    if (hasRelDocs) {
      if (!files.file_surat_nikah_pewaris || !files.file_ktp_suami || !files.file_ktp_istri) {
        const msg = 'Dokumen hubungan pernikahan (Surat Nikah, KTP Suami & KTP Istri) wajib diunggah untuk hubungan Orang Tua atau Istri/Suami.';
        alert(msg);
        setError(msg);
        return;
      }

      if (formData.is_divorced === 'Ya' && !files.file_akta_cerai_pewaris) {
        const msg = 'Dokumen Akta Cerai wajib diunggah karena status pernikahan bercerai.';
        alert(msg);
        setError(msg);
        return;
      }
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
      const response = await fetch(`${API_URL}/api/apply`, {
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
      console.error("Detail Error:", err);
      const userFriendlyMsg = 'Gagal mengirimkan permohonan. Silakan periksa kembali berkas Anda atau coba beberapa saat lagi.';
      setError(userFriendlyMsg);
      alert(userFriendlyMsg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const showRelationshipDocs = formData.relationship === 'Orang Tua' || formData.relationship === 'Istri / Suami';

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
    <div className="container" style={{ paddingBottom: '60px' }}>
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
            I. DATA PEMOHON (ahli waris)
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
                <option value="Istri / Suami">Istri / Suami</option>
                <option value="Orang Tua">Orang Tua</option>
                <option value="Saudara Kandung">Saudara Kandung</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {showRelationshipDocs && (
            <div className="form-group" style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginTop: '10px' }}>
              <label htmlFor="is_divorced" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Apakah Pewaris Bercerai?</label>
              <select
                id="is_divorced"
                name="is_divorced"
                className="form-control"
                value={formData.is_divorced}
                onChange={handleInputChange}
              >
                <option value="Tidak">Tidak Bercerai</option>
                <option value="Ya">Bercerai (Cerai Hidup/Mati)</option>
              </select>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginTop: '6px' }}>
                * Jika bercerai, Anda wajib mengunggah Akta Cerai pada kolom unggah dokumen di bawah.
              </span>
            </div>
          )}

          {/* Bagian 3: Upload Berkas */}
          <h3 style={{ borderBottom: '2px solid var(--primary-light)', paddingBottom: '8px', color: 'var(--primary)', marginBottom: '20px', marginTop: '40px' }}>
            III. UNGGAH DOKUMEN PERSYARATAN (Maksimal 5MB, Format PDF/Gambar)
          </h3>

          {/* Sub-bagian A: Dokumen Wajib Global */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--secondary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              A. DOKUMEN WAJIB UTAMA (Semua Pemohon)
            </h4>

            <div className="form-group">
              <label>1. Surat Pengantar RT/RW <span style={{ color: 'var(--error)' }}>*</span></label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  required
                  onChange={(e) => handleFileChange(e, 'file_pengantar_rt_rw')}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {files.file_pengantar_rt_rw ? files.file_pengantar_rt_rw.name : "Pilih berkas Surat Pengantar RT/RW"}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>2. Surat Permohonan Ahli Waris <span style={{ color: 'var(--error)' }}>*</span></label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  required
                  onChange={(e) => handleFileChange(e, 'file_permohonan')}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {files.file_permohonan ? files.file_permohonan.name : "Pilih berkas Surat Permohonan"}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>3. Surat Pernyataan (Materai 10.000,-) <span style={{ color: 'var(--error)' }}>*</span></label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  required
                  onChange={(e) => handleFileChange(e, 'file_pernyataan_kebenaran')}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {files.file_pernyataan_kebenaran ? files.file_pernyataan_kebenaran.name : "Pilih berkas Surat Pernyataan"}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>4. Surat Kuasa Ahli Waris <span style={{ color: 'var(--error)' }}>*</span></label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange(e, 'file_surat_kuasa')}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {files.file_surat_kuasa ? files.file_surat_kuasa.name : "Pilih berkas Surat Kuasa Ahli Waris (jika ada)"}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>5. Fotocopy KTP Pewaris (Almarhum / Almarhumah) <span style={{ color: 'var(--error)' }}>*</span></label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  required
                  onChange={(e) => handleFileChange(e, 'file_ktp_pewaris')}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {files.file_ktp_pewaris ? files.file_ktp_pewaris.name : "Pilih berkas KTP Pewaris"}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>6. Fotocopy KTP Terbaru Para Ahli Waris <span style={{ color: 'var(--error)' }}>*</span></label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  required
                  onChange={(e) => handleFileChange(e, 'file_ktp_ahli_waris')}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {files.file_ktp_ahli_waris ? files.file_ktp_ahli_waris.name : "Pilih berkas KTP Ahli Waris"}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>7. Surat Kematian Pewaris <span style={{ color: 'var(--error)' }}>*</span></label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  required
                  onChange={(e) => handleFileChange(e, 'file_kematian_pewaris')}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {files.file_kematian_pewaris ? files.file_kematian_pewaris.name : "Pilih berkas Surat Kematian Pewaris"}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>8. Fotocopy KK Para Ahli Waris <span style={{ color: 'var(--error)' }}>*</span></label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  required
                  onChange={(e) => handleFileChange(e, 'file_kk_ahli_waris')}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {files.file_kk_ahli_waris ? files.file_kk_ahli_waris.name : "Pilih berkas KK Ahli Waris"}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>9. Fotocopy Akta Kelahiran Ahli Waris <span style={{ color: 'var(--error)' }}>*</span></label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  required
                  onChange={(e) => handleFileChange(e, 'file_akta_lahir_ahli_waris')}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {files.file_akta_lahir_ahli_waris ? files.file_akta_lahir_ahli_waris.name : "Pilih berkas Akta Kelahiran Ahli Waris"}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>10. Fotocopy KTP 2 Orang Saksi <span style={{ color: 'var(--error)' }}>*</span></label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  required
                  onChange={(e) => handleFileChange(e, 'file_ktp_saksi')}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {files.file_ktp_saksi ? files.file_ktp_saksi.name : "Pilih berkas KTP 2 Orang Saksi"}
                </span>
              </div>
            </div>
          </div>

          {/* Sub-bagian B: Dokumen Kondisional */}
          {showRelationshipDocs && (
            <div style={{ marginBottom: '20px', backgroundColor: '#f0fdf4', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                B. DOKUMEN KHUSUS (Hubungan: {formData.relationship})
              </h4>

              <div className="form-group">
                <label>11. Surat Nikah Pewaris <span style={{ color: 'var(--error)' }}>*</span></label>
                <div className="file-input-wrapper" style={{ backgroundColor: '#fff' }}>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    required={showRelationshipDocs}
                    onChange={(e) => handleFileChange(e, 'file_surat_nikah_pewaris')}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {files.file_surat_nikah_pewaris ? files.file_surat_nikah_pewaris.name : "Pilih berkas Surat Nikah Pewaris"}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>12. Fotocopy KTP Suami <span style={{ color: 'var(--error)' }}>*</span></label>
                <div className="file-input-wrapper" style={{ backgroundColor: '#fff' }}>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    required={showRelationshipDocs}
                    onChange={(e) => handleFileChange(e, 'file_ktp_suami')}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {files.file_ktp_suami ? files.file_ktp_suami.name : "Pilih berkas KTP Suami"}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>13. Fotocopy KTP Istri <span style={{ color: 'var(--error)' }}>*</span></label>
                <div className="file-input-wrapper" style={{ backgroundColor: '#fff' }}>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    required={showRelationshipDocs}
                    onChange={(e) => handleFileChange(e, 'file_ktp_istri')}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {files.file_ktp_istri ? files.file_ktp_istri.name : "Pilih berkas KTP Istri"}
                  </span>
                </div>
              </div>

              {formData.is_divorced === 'Ya' && (
                <div className="form-group">
                  <label>14. Fotocopy Akta Cerai Pewaris <span style={{ color: 'var(--error)' }}>*</span></label>
                  <div className="file-input-wrapper" style={{ backgroundColor: '#fff', border: '1px solid var(--error)' }}>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      required={formData.is_divorced === 'Ya'}
                      onChange={(e) => handleFileChange(e, 'file_akta_cerai_pewaris')}
                    />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {files.file_akta_cerai_pewaris ? files.file_akta_cerai_pewaris.name : "Pilih berkas Akta Cerai Pewaris"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sub-bagian C: Dokumen Opsional */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              C. DOKUMEN TAMBAHAN (Opsional / Jika Ada)
            </h4>

            <div className="form-group">
              <label>15. Fotocopy Surat/Akta Kematian Ahli Waris yang Wafat Lebih Dulu</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange(e, 'file_kematian_ahli_waris_wafat_lebih_dulu')}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {files.file_kematian_ahli_waris_wafat_lebih_dulu ? files.file_kematian_ahli_waris_wafat_lebih_dulu.name : "Pilih berkas Surat Kematian Ahli Waris (jika ada)"}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>16. Dokumen Pendukung Lainnya</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange(e, 'file_pendukung_lainnya')}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {files.file_pendukung_lainnya ? files.file_pendukung_lainnya.name : "Pilih berkas pendukung tambahan"}
                </span>
              </div>
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

      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999,
        }}>
          <style>{`
            @keyframes spin-overlay {
              to { transform: rotate(360deg); }
            }
            .spinner-overlay {
              width: 50px;
              height: 50px;
              border: 5px solid #e2e8f0;
              border-top-color: var(--primary);
              border-radius: 50%;
              animation: spin-overlay 1s linear infinite;
              margin-bottom: 20px;
            }
          `}</style>
          <div className="spinner-overlay" />
          <h3 style={{ color: 'var(--primary)', margin: 0, fontWeight: 'bold' }}>Mengirimkan Permohonan...</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.95rem' }}>
            Mohon tunggu, berkas Anda sedang diunggah ke sistem.
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplyPage;
