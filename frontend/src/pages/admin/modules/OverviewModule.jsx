import { useState, useEffect } from 'react';
import { Briefcase, Image, Award, Users, ArrowUpRight, Server, HardDrive, ShieldCheck, Activity } from 'lucide-react';
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
      {/* Metrics Counter Cards */}
      <div className="admin-metrics-grid">
        <div className="admin-metric-card" onClick={() => onNavigateTab('jobs')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="admin-metric-val">{loading ? '...' : stats.jobsCount}</div>
            <div className="admin-metric-label">Lowongan Kerja Aktif</div>
          </div>
          <div className="admin-metric-icon">
            <Briefcase size={18} />
          </div>
        </div>

        <div className="admin-metric-card" onClick={() => onNavigateTab('gallery')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="admin-metric-val">{loading ? '...' : stats.galleryCount}</div>
            <div className="admin-metric-label">Foto Fasilitas & Produksi</div>
          </div>
          <div className="admin-metric-icon">
            <Image size={18} />
          </div>
        </div>

        <div className="admin-metric-card" onClick={() => onNavigateTab('core-values')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="admin-metric-val">{loading ? '...' : stats.coreValuesCount}</div>
            <div className="admin-metric-label">Nilai Inti Rekayasa</div>
          </div>
          <div className="admin-metric-icon">
            <Award size={18} />
          </div>
        </div>

        {(user?.role === 'administrator' || user?.role === 'hrd') && (
          <div className="admin-metric-card" onClick={() => onNavigateTab('users')} style={{ cursor: 'pointer' }}>
            <div>
              <div className="admin-metric-val">{loading ? '...' : stats.usersCount}</div>
              <div className="admin-metric-label">Pengguna Admin Terdaftar</div>
            </div>
            <div className="admin-metric-icon">
              <Users size={18} />
            </div>
          </div>
        )}
      </div>

      {/* 2-Column: Quick Shortcuts + System Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Quick Shortcuts */}
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Navigasi Manajemen Konten</h3>
              <p className="admin-card-desc">Pintas ke modul pengubahan konten website</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => onNavigateTab('home')}
              style={{ justifyContent: 'space-between', padding: '10px 12px' }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Beranda (Hero & Stats)</span>
              <ArrowUpRight size={14} color="#94a3b8" />
            </button>

            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => onNavigateTab('company')}
              style={{ justifyContent: 'space-between', padding: '10px 12px' }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Profil Perusahaan</span>
              <ArrowUpRight size={14} color="#94a3b8" />
            </button>

            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => onNavigateTab('contact')}
              style={{ justifyContent: 'space-between', padding: '10px 12px' }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Kontak & Google Maps</span>
              <ArrowUpRight size={14} color="#94a3b8" />
            </button>

            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => onNavigateTab('gallery')}
              style={{ justifyContent: 'space-between', padding: '10px 12px' }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Galeri Fasilitas SMT</span>
              <ArrowUpRight size={14} color="#94a3b8" />
            </button>

            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => onNavigateTab('jobs')}
              style={{ justifyContent: 'space-between', padding: '10px 12px' }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Lowongan Karir</span>
              <ArrowUpRight size={14} color="#94a3b8" />
            </button>

            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => onNavigateTab('core-values')}
              style={{ justifyContent: 'space-between', padding: '10px 12px' }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Nilai Inti Rekayasa</span>
              <ArrowUpRight size={14} color="#94a3b8" />
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Status Sistem & Basis Data</h3>
              <p className="admin-card-desc">Informasi lingkungan runtime backend</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.825rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--adm-input-bg)', borderRadius: '6px', border: '1px solid var(--adm-border)' }}>
              <span style={{ color: 'var(--adm-muted)' }}>REST API Server</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>Node.js / Express (Port 3000)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--adm-input-bg)', borderRadius: '6px', border: '1px solid var(--adm-border)' }}>
              <span style={{ color: 'var(--adm-muted)' }}>Database Engine</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>MySQL 3306 (isa_career_hrd)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--adm-input-bg)', borderRadius: '6px', border: '1px solid var(--adm-border)' }}>
              <span style={{ color: 'var(--adm-muted)' }}>Role Pengguna</span>
              <span className="admin-pill admin-pill--info">{user?.role?.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--adm-input-bg)', borderRadius: '6px', border: '1px solid var(--adm-border)' }}>
              <span style={{ color: 'var(--adm-muted)' }}>Lokasi Pabrik</span>
              <span style={{ fontWeight: 600 }}>Batam Free Trade Zone (FTZ)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Audit Trail */}
      {(user?.role === 'administrator' || user?.role === 'hrd') && (
        <div className="admin-card" style={{ marginTop: '1.25rem' }}>
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Aktivitas Terakhir (Audit Trail)</h3>
              <p className="admin-card-desc">Catatan perubahan data terakhir yang dilakukan personil</p>
            </div>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={() => onNavigateTab('logs')}
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              Lihat Semua Log
            </button>
          </div>

          {recentLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.85rem' }}>
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
                      <td style={{ whiteSpace: 'nowrap', fontSize: '0.78rem', color: 'var(--adm-muted)' }}>
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
                      <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{log.module}</td>
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
