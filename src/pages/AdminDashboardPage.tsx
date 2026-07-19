import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, CheckCircle, Clock, AlertTriangle, FileSpreadsheet, 
  Search, Eye, LogOut, Loader2, Download, FileText, Calendar, Edit3 
} from 'lucide-react';

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
  file_ktp: string;
  file_kk: string;
  file_death_cert: string;
  file_rt_rw: string;
  file_other: string;
  admin_notes: string;
  estimated_completion: string;
  created_at: string;
  updated_at: string;
}

const AdminDashboardPage: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [filteredApps, setFilteredApps] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selectedApp, setSelectedApp] = useState<ApplicationData | null>(null);
  
  // Form edit states
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editDate, setEditDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchApplications();
  }, [token, navigate]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/admin/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/login');
        return;
      }
      if (!response.ok) {
        throw new Error('Gagal mengambil data permohonan.');
      }
      const data = await response.json();
      setApplications(data);
      setFilteredApps(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat memuat data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = applications;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(app => 
        app.applicant_name.toLowerCase().includes(term) ||
        app.registration_number.toLowerCase().includes(term) ||
        app.applicant_nik.includes(term)
      );
    }

    if (statusFilter !== 'Semua') {
      result = result.filter(app => app.status === statusFilter);
    }

    setFilteredApps(result);
  }, [searchTerm, statusFilter, applications]);

  const handleSelectApp = (app: ApplicationData) => {
    setSelectedApp(app);
    setEditStatus(app.status);
    setEditNotes(app.admin_notes || '');
    setEditDate(app.estimated_completion || '');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    const today = new Date().toISOString().split('T')[0];
    if (editDate && editDate < today) {
      alert('Tanggal estimasi selesai tidak boleh sebelum hari ini.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`http://localhost:8080/api/admin/applications/${selectedApp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: editStatus,
          admin_notes: editNotes,
          estimated_completion: editDate
        })
      });

      if (!response.ok) {
        throw new Error('Gagal memperbarui status.');
      }

      // Update local state
      const updatedList = applications.map(app => {
        if (app.id === selectedApp.id) {
          return {
            ...app,
            status: editStatus,
            admin_notes: editNotes,
            estimated_completion: editDate
          };
        }
        return app;
      });

      setApplications(updatedList);
      setSelectedApp(prev => prev ? {
        ...prev,
        status: editStatus,
        admin_notes: editNotes,
        estimated_completion: editDate
      } : null);

      alert('Status permohonan berhasil diperbarui!');
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan perubahan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async (appId: number, regNum: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/applications/${appId}/pdf`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Gagal generate PDF.');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Dossier_${regNum}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Gagal mengunduh dokumen PDF.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  // Stats Calculations
  const totalSubmissions = applications.length;
  const pendingCount = applications.filter(a => a.status === 'Menunggu Verifikasi').length;
  const processingCount = applications.filter(a => a.status === 'Sedang Diproses' || a.status === 'Menunggu TTD').length;
  const revisionCount = applications.filter(a => a.status === 'Perlu Perbaikan').length;
  const doneCount = applications.filter(a => a.status === 'Selesai').length;

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

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: '16px' }} />
        <p>Memuat Data Permohonan...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Header Admin */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', borderBottom: '2px solid var(--border)', paddingBottom: '15px' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--primary)' }}>Dashboard Petugan Kelurahan</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Kelola berkas permohonan ahli waris warga</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'inline-flex', gap: '8px', color: 'var(--error)', borderColor: 'var(--error)' }}>
          <LogOut size={16} /> Keluar
        </button>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#e2f0fe', color: '#1e40af' }}>
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h3 className="stat-number">{totalSubmissions}</h3>
            <p className="stat-label">Total Permohonan</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef9c3', color: '#854d0e' }}>
            <Clock size={24} />
          </div>
          <div>
            <h3 className="stat-number">{pendingCount}</h3>
            <p className="stat-label">Menunggu Verifikasi</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
            <Clock size={24} />
          </div>
          <div>
            <h3 className="stat-number">{processingCount}</h3>
            <p className="stat-label">Sedang Diproses</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="stat-number">{revisionCount}</h3>
            <p className="stat-label">Perlu Perbaikan</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <h3 className="stat-number">{doneCount}</h3>
            <p className="stat-label">Selesai</p>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedApp ? '3fr 2fr' : '1fr', gap: '30px', transition: 'all 0.3s ease' }}>
        
        {/* Table/Data Sheet List */}
        <div>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ paddingLeft: '35px' }}
                  placeholder="Cari nama, NIK, atau nomor registrasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-secondary)' }} />
              </div>
              
              {/* Status Filter */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Semua', 'Menunggu Verifikasi', 'Sedang Diproses', 'Perlu Perbaikan', 'Menunggu TTD', 'Selesai'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className="btn"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.85rem',
                      backgroundColor: statusFilter === status ? 'var(--primary)' : '#e2e8f0',
                      color: statusFilter === status ? '#fff' : 'var(--text-primary)',
                      borderRadius: '20px'
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>No. Registrasi</th>
                    <th>Nama Pemohon</th>
                    <th>Nama Pewaris</th>
                    <th>Hubungan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '30px' }}>
                        Tidak ada data permohonan ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => (
                      <tr key={app.id} style={{ cursor: 'pointer', backgroundColor: selectedApp?.id === app.id ? '#f0fdf4' : '' }} onClick={() => handleSelectApp(app)}>
                        <td style={{ fontWeight: 'bold' }}>{app.registration_number}</td>
                        <td>{app.applicant_name}</td>
                        <td>{app.heir_name}</td>
                        <td>{app.relationship}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(app.status)}`}>{app.status}</span>
                        </td>
                        <td>
                          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={(e) => {
                            e.stopPropagation();
                            handleSelectApp(app);
                          }}>
                            <Eye size={14} /> Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Details and Update Panel */}
        {selectedApp && (
          <div>
            <div className="card" style={{ padding: '25px', position: 'sticky', top: '90px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: 'var(--primary)' }}>Detail Permohonan</h3>
                <button 
                  onClick={() => setSelectedApp(null)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.25rem', fontWeight: 'bold' }}
                >
                  &times;
                </button>
              </div>

              {/* Action: Download PDF */}
              <div style={{ marginBottom: '20px' }}>
                <button 
                  onClick={() => handleDownloadPDF(selectedApp.id, selectedApp.registration_number)} 
                  className="btn btn-primary"
                  style={{ width: '100%', backgroundColor: 'var(--primary)' }}
                >
                  <Download size={16} /> Unduh Berkas PDF
                </button>
              </div>

              {/* Informational details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', marginBottom: '25px' }}>
                <div>
                  <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Nomor Registrasi / Tanggal</strong>
                  <span>{selectedApp.registration_number} / {new Date(selectedApp.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Nama Pemohon (NIK)</strong>
                  <span>{selectedApp.applicant_name} ({selectedApp.applicant_nik})</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Nomor KK / Alamat</strong>
                  <span>{selectedApp.applicant_kk} - {selectedApp.applicant_address}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Kontak / Email</strong>
                  <span>{selectedApp.applicant_phone} | {selectedApp.applicant_email}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Data Pewaris</strong>
                  <span>{selectedApp.heir_name} (Wafat: {selectedApp.death_date}) - Hubungan: {selectedApp.relationship}</span>
                </div>

                {/* Uploaded Documents List */}
                <div style={{ marginTop: '10px' }}>
                  <strong style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '6px' }}>Dokumen Terunggah</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <a href={`http://localhost:8080${selectedApp.file_ktp}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '0.85rem' }}>
                      <FileText size={14} /> KTP Ahli Waris
                    </a>
                    <a href={`http://localhost:8080${selectedApp.file_kk}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '0.85rem' }}>
                      <FileText size={14} /> Kartu Keluarga
                    </a>
                    <a href={`http://localhost:8080${selectedApp.file_death_cert}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '0.85rem' }}>
                      <FileText size={14} /> Akta Kematian
                    </a>
                    <a href={`http://localhost:8080${selectedApp.file_rt_rw}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '0.85rem' }}>
                      <FileText size={14} /> Pengantar RT/RW
                    </a>
                    {selectedApp.file_other && (
                      <a href={`http://localhost:8080${selectedApp.file_other}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '0.85rem' }}>
                        <FileText size={14} /> Dokumen Pendukung Lain
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Update Form */}
              <form onSubmit={handleSaveStatus} style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: 'var(--primary)' }}>Update Status Pelayanan</h4>
                
                <div className="form-group">
                  <label htmlFor="statusSelect">Ubah Status</label>
                  <select 
                    id="statusSelect" 
                    className="form-control"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                    <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                    <option value="Sedang Diproses">Sedang Diproses</option>
                    <option value="Menunggu TTD">Menunggu TTD</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="editDate">Estimasi Selesai</label>
                  <input 
                    type="date" 
                    id="editDate" 
                    className="form-control"
                    min={new Date().toISOString().split('T')[0]}
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="editNotes">Catatan / Keterangan Tambahan</label>
                  <textarea 
                    id="editNotes" 
                    className="form-control"
                    rows={3}
                    placeholder="Tulis alasan jika butuh revisi, atau instruksi pengambilan jika sudah selesai."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', display: 'inline-flex', justifyContent: 'center' }}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Edit3 size={16} style={{ marginRight: '8px' }} />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
