import { useState, useEffect } from 'react';
import api, { extractErrorMessage } from '../../../lib/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import {
  FileText,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function LogsModule() {
  const { addToast } = useAdminAuth();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, totalItems: 0, totalPages: 1 });

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/logs?page=${page}&limit=20`);
      setLogs(res.data?.data || []);
      if (res.data?.pagination) {
        setPagination(res.data.pagination);
      }
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(pagination.page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  return (
    <div className="admin-logs-module">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} strokeWidth={2} />
              <span>Audit Trail & Log Aktivitas Sistem</span>
            </h2>
            <p className="admin-card-desc">
              Pencatatan riwayat setiap aksi tambah, ubah, dan hapus konten oleh personil admin untuk keamanan dan transparansi.
            </p>
          </div>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => fetchLogs(pagination.page)}
            style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} strokeWidth={2} />
            <span>Segarkan Log</span>
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div className="admin-spinner" style={{ margin: '0 auto 12px' }} />
            <span>Memuat rekaman log aktivitas...</span>
          </div>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Belum ada riwayat aktivitas yang tercatat di database.
          </div>
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '160px' }}>Waktu Kejadian</th>
                    <th>Nama Pengguna</th>
                    <th>Role</th>
                    <th>Aksi</th>
                    <th>Modul Sistem</th>
                    <th>Deskripsi Aktivitas</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', color: '#94a3b8' }}>
                        {new Date(log.created_at).toLocaleString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td>
                        <strong style={{ color: 'var(--admin-text-main)' }}>{log.user_name || 'System'}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>@{log.user_username || '-'}</div>
                      </td>
                      <td>
                        <span className="admin-pill admin-pill--info">{log.user_role || 'staff'}</span>
                      </td>
                      <td>
                        <span className={`admin-pill ${
                          log.action === 'CREATE' ? 'admin-pill--success' :
                          log.action === 'UPDATE' ? 'admin-pill--info' :
                          log.action === 'DELETE' ? 'admin-pill--danger' : 'admin-pill--warning'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: 'rgba(51,65,85,0.4)', padding: '2px 6px', borderRadius: '4px' }}>
                          {log.module}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{log.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--admin-card-border)', fontSize: '0.85rem' }}>
              <span style={{ color: '#94a3b8' }}>
                Halaman {pagination.page} dari {pagination.totalPages} (Total {pagination.totalItems} aktivitas)
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  style={{ padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <ChevronLeft size={14} />
                  <span>Sebelumnya</span>
                </button>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  style={{ padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>Selanjutnya</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
