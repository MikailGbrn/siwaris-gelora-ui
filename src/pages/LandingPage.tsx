import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div style={{ 
      margin: '-40px 0', 
      width: '100%', 
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 1. Hero Section (Deep Navy Blue) */}
      <section style={{ 
        backgroundColor: 'var(--primary)', 
        color: '#fff', 
        padding: '60px 20px', 
        textAlign: 'center' 
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ color: '#fff', fontSize: '2.5rem', marginBottom: '12px', fontWeight: 'bold' }}>
            SIWARIS GELORA
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.85)', 
            marginBottom: '40px', 
            fontSize: '1.1rem',
            lineHeight: '1.6',
            maxWidth: '750px',
            margin: '0 auto 40px'
          }}>
            Sistem Informasi Pelayanan Surat Pernyataan Ahli Waris Berbasis Digital Terintegrasi Kelurahan Gelora
          </p>

          {/* Interactive Infographic / Progress Timeline */}
          <div className="infographic" style={{ margin: '40px 0' }}>
            {/* Step 1 (Active) */}
            <div className="info-step active">
              <div className="info-icon" style={{ 
                backgroundColor: 'var(--secondary)', 
                borderColor: 'var(--secondary)', 
                color: 'var(--primary)',
                transform: 'scale(1.1)',
                fontWeight: 'bold'
              }}>1</div>
              <div className="info-title" style={{ color: '#fff', fontWeight: 'bold' }}>Daftar</div>
              <div className="info-desc" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Isi form & upload berkas</div>
            </div>

            {/* Step 2 */}
            <div className="info-step">
              <div className="info-icon" style={{ 
                backgroundColor: '#fff', 
                borderColor: '#fff', 
                color: 'var(--primary)' 
              }}>2</div>
              <div className="info-title" style={{ color: '#fff' }}>Verifikasi</div>
              <div className="info-desc" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Petugas memverifikasi berkas</div>
            </div>

            {/* Step 3 */}
            <div className="info-step">
              <div className="info-icon" style={{ 
                backgroundColor: '#fff', 
                borderColor: '#fff', 
                color: 'var(--primary)' 
              }}>3</div>
              <div className="info-title" style={{ color: '#fff' }}>Proses</div>
              <div className="info-desc" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Tanda tangan Lurah</div>
            </div>

            {/* Step 4 */}
            <div className="info-step">
              <div className="info-icon" style={{ 
                backgroundColor: '#fff', 
                borderColor: '#fff', 
                color: 'var(--primary)' 
              }}>4</div>
              <div className="info-title" style={{ color: '#fff' }}>Selesai</div>
              <div className="info-desc" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Ambil dokumen di kantor</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '40px' }}>
            <Link to="/apply" className="btn btn-primary" style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)', fontWeight: 'bold', border: 'none' }}>
              Daftar Sekarang
            </Link>
            <Link to="/track" className="btn btn-outline" style={{ color: '#fff', borderColor: '#fff', backgroundColor: 'transparent' }}>
              Cek Status
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Requirements Section (Soft Light Blue Background + Clean White Card) */}
      <section style={{ 
        backgroundColor: '#eef4fc', // var(--primary-light)
        padding: '60px 20px' 
      }}>
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          backgroundColor: '#fff', 
          padding: '40px', 
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #cbd5e1'
        }}>
          <h2 style={{ 
            color: 'var(--primary)', 
            borderBottom: '2px solid var(--secondary)', 
            paddingBottom: '12px', 
            marginBottom: '24px', 
            fontSize: '1.6rem', 
            fontWeight: 'bold',
            marginTop: 0
          }}>
            Informasi & Persyaratan Pelayanan
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Dasar Hukum
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
              Keputusan Walikota Administrasi Jakarta Pusat Provinsi DKI Jakarta Nomor e-0054 Tahun 2026 Tentang Pedoman Standar Pelayanan Administrasi Kecamatan Kelurahan Kota Administrasi Jakarta Pusat (<a href="/sk-wjp-54-2026.pdf" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}>lihat selengkapnya</a>).
            </p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '12px' }}>
              Persyaratan Dokumen
            </h3>
            <ol style={{ paddingLeft: '20px', margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              <li style={{ marginBottom: '8px' }}>Surat Pengantar RT/RW</li>
              <li style={{ marginBottom: '8px' }}>
                Mengisi Surat Permohonan untuk register (<a href="/format-surat-permohonan.pdf" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}>link format</a>)
              </li>
              <li style={{ marginBottom: '8px' }}>
                Mengisi Surat Pernyataan (<a href="/format-surat-pernyataan.pdf" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}>link format</a>)
              </li>
              <li style={{ marginBottom: '8px' }}>
                Mengisi Surat Pernyataan Tanggung Jawab Mutlak (<a href="/format-surat-pernyataan-tanggung-jawab-mutlak.pdf" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}>link format</a>)
              </li>
              <li style={{ marginBottom: '8px' }}>
                Mengisi Surat Kuasa (<a href="/format-surat-kuasa.pdf" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer' }}>link format</a>)
              </li>
              <li style={{ marginBottom: '8px' }}>Foto Copy KTP dan KK Pewaris (warga Kelurahan Gelora)</li>
              <li style={{ marginBottom: '8px' }}>Foto Copy Surat Kematian Pewaris</li>
              <li style={{ marginBottom: '8px' }}>Foto Copy Surat Nikah Pewaris (bila belum menikah diganti dengan akte lahir almarhum)</li>
              <li style={{ marginBottom: '8px' }}>Foto Copy Akta Cerai Pewaris (bila bercerai)</li>
              <li style={{ marginBottom: '8px' }}>Foto Copy Akte Kelahiran, KTP dan KK Para Ahli Waris</li>
              <li style={{ marginBottom: '8px' }}>Foto Copy Surat Nikah (bila ada)</li>
              <li style={{ marginBottom: '8px' }}>Foto Copy Surat Kematian Ahli Waris (apabila Ahli Waris telah meninggal)</li>
              <li style={{ marginBottom: '8px' }}>Foto Copy KTP, KK, Surat Nikah (bila ada) dan Akta Kelahiran anak kandung dari ahli waris yang telah meninggal</li>
              <li style={{ marginBottom: '8px' }}>Surat Pernyataan Belum Menikah dan/atau Tidak Memiliki Anak (bila pewaris belum menikah dan/atau tidak mempunyai anak)</li>
              <li style={{ marginBottom: '8px' }}>Bila berkaitan dengan pendaftaran tanah di BPN, atau pembagian warisan, disarankan untuk mengajukan permohonan fatwa waris ke pengadilan agama setempat bagi yang beragama Islam, atau ke pengadilan negeri setempat atau notaris</li>
              <li style={{ marginBottom: '8px' }}>Berkas yang sudah lengkap selanjutnya akan diverifikasi oleh petugas. Pemohon bisa memantau status melalui menu <strong>Cek Status</strong>.</li>
            </ol>
          </div>

          <div style={{ 
            borderTop: '1px solid #cbd5e1', 
            paddingTop: '20px', 
            fontSize: '0.95rem', 
            color: 'var(--text-primary)', 
            lineHeight: '1.6' 
          }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
              Pengambilan Dokumen:
            </p>
            <p style={{ margin: '0 0 10px 0' }}>
              Jika status permohonan telah ditandatangani Lurah, silakan mengambil dokumen fisik Surat Pernyataan Ahli Waris di:
            </p>
            <div style={{ 
              paddingLeft: '14px', 
              borderLeft: '4px solid var(--secondary)', 
              margin: '12px 0',
              fontWeight: '500'
            }}>
              Loket PTSP Kelurahan Gelora (Lantai 1)<br />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                Jalan Gerbang Pemuda Nomor 1, RT.1/RW.3, Gelora, Kecamatan Tanah Abang, Kota Jakarta Pusat, DKI Jakarta 10270
              </span>
            </div>
            <p style={{ margin: '12px 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              📅 Buka setiap hari kerja (Senin-Jumat), pukul 07.30 s/d 16.00 WIB.<br />
              💰 Pelayanan ini <strong>tidak dipungut biaya (Gratis)</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
