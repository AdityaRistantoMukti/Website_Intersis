import { useState, useEffect } from 'react';
import {
  Briefcase,
  Image,
  Package,
  Users,
  ArrowUpRight,
  Activity,
  Globe,
  Send,
} from 'lucide-react';
import api from '../../../lib/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export default function OverviewModule({ onNavigateTab }) {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState({
    jobsCount: 0,
    galleryCount: 0,
    productsCount: 0,
    usersCount: 0,
  });
  const [telemetry, setTelemetry] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    activeNow: 0,
    countryStats: [],
    totalRfqs: 0,
    recentRfqs: [],
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardStats() {
      setLoading(true);
      try {
        const [jobsRes, galleryRes, productsRes] = await Promise.allSettled([
          api.get('/public/jobs'),
          api.get('/public/gallery'),
          api.get('/public/products'),
        ]);

        let uCount = 0;
        let logsData = [];
        let telemetryData = null;

        if (user?.role === 'administrator' || user?.role === 'hrd' || user?.role === 'staff') {
          const [usersRes, logsRes, telRes] = await Promise.allSettled([
            api.get('/admin/users'),
            api.get('/admin/logs?limit=5'),
            api.get('/admin/telemetry'),
          ]);
          if (usersRes.status === 'fulfilled') {
            uCount = usersRes.value.data?.data?.length || 0;
          }
          if (logsRes.status === 'fulfilled') {
            logsData = logsRes.value.data?.data || [];
          }
          if (telRes.status === 'fulfilled') {
            telemetryData = telRes.value.data?.data;
          }
        }

        if (isMounted) {
          setStats({
            jobsCount: jobsRes.status === 'fulfilled' ? (jobsRes.value.data?.pagination?.totalItems || jobsRes.value.data?.data?.length || 0) : 0,
            galleryCount: galleryRes.status === 'fulfilled' ? (galleryRes.value.data?.pagination?.totalItems || galleryRes.value.data?.data?.length || 0) : 0,
            productsCount: productsRes.status === 'fulfilled' ? (productsRes.value.data?.data?.length || 0) : 0,
            usersCount: uCount,
          });
          if (telemetryData) {
            setTelemetry(telemetryData);
          }
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

        <div className="admin-metric-card" onClick={() => onNavigateTab('products')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="admin-metric-val">{loading ? '...' : stats.productsCount}</div>
            <div className="admin-metric-label">Total Produk Terdaftar</div>
          </div>
          <div className="admin-metric-icon">
            <Package size={18} />
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
              onClick={() => onNavigateTab('products')}
              style={{ justifyContent: 'space-between', padding: '10px 12px' }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Katalog Produk SKU</span>
              <ArrowUpRight size={14} color="#94a3b8" />
            </button>
          </div>
        </div>

        {/* Visitor Telemetry & RFQ Inquiries */}
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} />
                <span>Statistik Pengunjung & Formulir RFQ</span>
              </h3>
              <p className="admin-card-desc">Monitoring kunjungan website dan permintaan penawaran B2B</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '14px' }}>
            {/* Total Visitors */}
            <div style={{ padding: '10px 12px', background: 'var(--adm-card-inner)', borderRadius: '8px', border: '1px solid var(--adm-border-visible)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--adm-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Kunjungan</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--adm-text)', marginTop: '2px' }}>
                {telemetry.totalVisits || 0}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--adm-muted)', marginTop: '2px' }}>
                {telemetry.uniqueVisitors || 0} pengguna unik
              </div>
            </div>

            {/* Live Active Now */}
            <div style={{ padding: '10px 12px', background: 'var(--adm-card-inner)', borderRadius: '8px', border: '1px solid var(--adm-border-visible)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--adm-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Sedang Online</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--adm-text)', marginTop: '2px' }}>
                {telemetry.activeNow || 1}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--adm-muted)', marginTop: '2px' }}>
                Sesi aktif (5 mnt)
              </div>
            </div>

            {/* Total RFQ Inquiries */}
            <div style={{ padding: '10px 12px', background: 'var(--adm-card-inner)', borderRadius: '8px', border: '1px solid var(--adm-border-visible)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--adm-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Form RFQ Kontak</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--adm-text)', marginTop: '2px' }}>
                {telemetry.totalRfqs || 0}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--adm-muted)', marginTop: '2px' }}>
                leads masuk
              </div>
            </div>
          </div>

          {/* Country Breakdown */}
          {telemetry.countryStats && telemetry.countryStats.length > 0 ? (
            <div style={{ padding: '12px', background: 'var(--adm-card-inner)', borderRadius: '8px', border: '1px solid var(--adm-border)' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--adm-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={13} />
                <span>Pengunjung Berdasarkan Negara:</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {telemetry.countryStats.map((cs) => (
                  <span
                    key={cs.country_code}
                    style={{
                      fontSize: '0.75rem',
                      padding: '4px 9px',
                      background: 'var(--adm-card)',
                      border: '1px solid var(--adm-border-visible)',
                      borderRadius: '6px',
                      color: 'var(--adm-text)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <strong>{cs.country_code}</strong> {cs.country_name} : <span style={{ fontWeight: 700, color: 'var(--adm-text)' }}>{cs.visit_count}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.78rem', color: 'var(--adm-muted)', fontStyle: 'italic', padding: '6px 0' }}>
              Belum ada data geolokasi negara yang tercatat.
            </div>
          )}

          {/* Recent RFQ Inquiries Preview */}
          {telemetry.recentRfqs && telemetry.recentRfqs.length > 0 && (
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--adm-border)' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--adm-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Send size={12} />
                <span>Permintaan RFQ Kontak Terbaru:</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {telemetry.recentRfqs.slice(0, 2).map((rfq) => (
                  <div
                    key={rfq.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.78rem',
                      padding: '8px 10px',
                      background: 'var(--adm-card-inner)',
                      borderRadius: '6px',
                      border: '1px solid var(--adm-border)',
                    }}
                  >
                    <div>
                      <strong style={{ color: 'var(--adm-text)' }}>{rfq.full_name}</strong> <span style={{ color: 'var(--adm-muted)' }}>({rfq.company_name})</span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--adm-muted)', marginTop: '2px' }}>{rfq.corporate_email} &bull; {rfq.inquiry_type}</div>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--adm-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(rfq.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
