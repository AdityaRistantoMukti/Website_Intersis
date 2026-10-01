import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export default function OverviewModule({ onNavigateTab }) {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState({
    jobsCount: 0,
    galleryCount: 0,
    coreValuesCount: 0,
    benefitsCount: 0,
    usersCount: 0,
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardStats() {
      setLoading(true);
      try {
        const [jobsRes, galleryRes, coreRes, benefitsRes] = await Promise.allSettled([
          api.get('/public/jobs'),
          api.get('/public/gallery'),
          api.get('/public/core-values'),
          api.get('/public/benefits'),
        ]);

        let uCount = 0;
        let logsData = [];

        if (user?.role === 'administrator' || user?.role === 'hrd') {
          const [usersRes, logsRes] = await Promise.allSettled([
            api.get('/admin/users'),
            api.get('/admin/logs?limit=5'),
          ]);
          if (usersRes.status === 'fulfilled') {
            uCount = usersRes.value.data?.data?.length || 0;
          }
          if (logsRes.status === 'fulfilled') {
            logsData = logsRes.value.data?.data || [];
          }
        }

        if (isMounted) {
          setStats({
            jobsCount: jobsRes.status === 'fulfilled' ? (jobsRes.value.data?.pagination?.totalItems || jobsRes.value.data?.data?.length || 0) : 0,
            galleryCount: galleryRes.status === 'fulfilled' ? (galleryRes.value.data?.pagination?.totalItems || galleryRes.value.data?.data?.length || 0) : 0,
            coreValuesCount: coreRes.status === 'fulfilled' ? (coreRes.value.data?.data?.length || 0) : 0,
            benefitsCount: benefitsRes.status === 'fulfilled' ? (benefitsRes.value.data?.data?.length || 0) : 0,
            usersCount: uCount,
          });
          setRecentLogs(logsData);
        }
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDashboardStats();
    return () => { isMounted = false; };
  }, [user]);

  return (
    <div className="admin-overview-module">
      {/* Welcome Banner */}
      <div className="admin-card" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(13,148,136,0.18) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2dd4bf', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <span>🚀 PUSAT KONTROL CMS INTERNAL</span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              Selamat Bekerja, {user?.name || 'Administrator'}!
            </h2>
            <p style={{ margin: '0.35rem 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
              Kelola dan perbarui konten landing page bisnis, informasi kontak, dokumentasi galeri, serta lowongan karir secara tersinkronisasi.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="admin-btn-primary"
              onClick={() => onNavigateTab('company')}
            >
              <span>🏢 Edit Profil Perusahaan</span>
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn-secondary"
            >
              <span>Lihat Website Publik ↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Metrics Counter Cards */}
      <div className="admin-metrics-grid">
        <div className="admin-metric-card" onClick={() => onNavigateTab('jobs')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="admin-metric-val">{loading ? '...' : stats.jobsCount}</div>
            <div className="admin-metric-label">Lowongan Kerja Aktif</div>
          </div>
          <div className="admin-metric-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            💼
          </div>
        </div>

        <div className="admin-metric-card" onClick={() => onNavigateTab('gallery')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="admin-metric-val">{loading ? '...' : stats.galleryCount}</div>
            <div className="admin-metric-label">Foto Fasilitas & Galeri</div>
          </div>
          <div className="admin-metric-icon" style={{ background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf' }}>
            🖼️
          </div>
        </div>

        <div className="admin-metric-card" onClick={() => onNavigateTab('core-values')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="admin-metric-val">{loading ? '...' : stats.coreValuesCount}</div>
            <div className="admin-metric-label">Nilai Inti Rekayasa</div>
          </div>
          <div className="admin-metric-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            💎
          </div>
        </div>

        {(user?.role === 'administrator' || user?.role === 'hrd') && (
          <div className="admin-metric-card" onClick={() => onNavigateTab('users')} style={{ cursor: 'pointer' }}>
            <div>
              <div className="admin-metric-val">{loading ? '...' : stats.usersCount}</div>
              <div className="admin-metric-label">Pengguna Admin & Staf</div>
            </div>
            <div className="admin-metric-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              👥
            </div>
          </div>
        )}
      </div>

      {/* 2-Column: Quick Shortcuts + System Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Quick Shortcuts */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">⚡ Aksi Cepat Manajemen Konten</h3>
              <p className="admin-card-desc">Pintas ke modul pengubahan yang paling sering diakses</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              className="admin-quick-chip"
              onClick={() => onNavigateTab('company')}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Profil & Visi Misi</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Update narasi & foto hero</div>
              </div>
              <span>→</span>
            </button>

            <button
              type="button"
              className="admin-quick-chip"
              onClick={() => onNavigateTab('contact')}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Kontak & WhatsApp</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Nomor sales & rekrutmen</div>
              </div>
              <span>→</span>
            </button>

            <button
              type="button"
              className="admin-quick-chip"
              onClick={() => onNavigateTab('gallery')}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Unggah Galeri Foto</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Dokumentasi pabrik & SMT</div>
              </div>
              <span>→</span>
            </button>

            <button
              type="button"
              className="admin-quick-chip"
              onClick={() => onNavigateTab('jobs')}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Kelola Lowongan</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Tambah posisi & form pendaftaran</div>
              </div>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* System Health / Status */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">🛡️ Status Sistem & Basis Data</h3>
              <p className="admin-card-desc">Koneksi backend dan lingkungan runtime server</p>
            </div>
            <span className="admin-status-indicator">
              <span className="admin-status-dot" />
              <span>LIVE</span>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px' }}>
              <span style={{ color: '#94a3b8' }}>REST API Server</span>
              <span style={{ fontFamily: 'monospace', color: '#2dd4bf', fontWeight: 600 }}>Express 5 (Port 3000)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px' }}>
              <span style={{ color: '#94a3b8' }}>Database Engine</span>
              <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontWeight: 600 }}>MySQL 3306 (isa_career_hrd)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px' }}>
              <span style={{ color: '#94a3b8' }}>Role Akun Aktif</span>
              <span className="admin-pill admin-pill--info">{user?.role?.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '8px' }}>
              <span style={{ color: '#94a3b8' }}>Storage Uploads</span>
              <span style={{ fontFamily: 'monospace', color: '#f1f5f9' }}>/uploads (Static Served)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Audit Trail (if Administrator or HRD) */}
      {(user?.role === 'administrator' || user?.role === 'hrd') && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">📜 Log Aktivitas Terbaru (Audit Trail)</h3>
              <p className="admin-card-desc">Riwayat perubahan data konten dan akun pengguna oleh admin</p>
            </div>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => onNavigateTab('logs')}
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              Lihat Semua Log →
            </button>
          </div>

          {recentLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              Belum ada log aktivitas tercatat.
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Waktu</th>
                    <th>Pengguna</th>
                    <th>Aksi</th>
                    <th>Modul</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', color: '#94a3b8' }}>
                        {new Date(log.created_at).toLocaleString('id-ID')}
                      </td>
                      <td style={{ fontWeight: 600 }}>{log.user_name || 'System'}</td>
                      <td>
                        <span className={`admin-pill ${
                          log.action === 'CREATE' ? 'admin-pill--success' :
                          log.action === 'UPDATE' ? 'admin-pill--info' :
                          log.action === 'DELETE' ? 'admin-pill--danger' : 'admin-pill--warning'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.module}</td>
                      <td>{log.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
