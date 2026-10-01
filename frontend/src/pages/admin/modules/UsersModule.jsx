import { useState, useEffect } from 'react';
import api, { extractErrorMessage } from '../../../lib/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export default function UsersModule() {
  const { user: currentUser, addToast } = useAdminAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'staff',
    status: 'active',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data?.data || []);
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'staff',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setFormData({
      name: u.name || '',
      username: u.username || '',
      email: u.email || '',
      password: '',
      role: u.role || 'staff',
      status: u.status || 'active',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, userName) => {
    if (id === currentUser.id) {
      addToast('Anda tidak dapat menghapus akun Anda sendiri saat sedang login.', 'warning');
      return;
    }
    if (!window.confirm(`Yakin ingin menghapus pengguna '${userName}'? Tindakan ini tidak dapat dibatalkan.`)) return;

    try {
      await api.delete(`/admin/users/${id}`);
      addToast(`Pengguna '${userName}' berhasil dihapus.`, 'success');
      fetchUsers();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingUser) {
        const payload = {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          role: formData.role,
          status: formData.status,
        };
        if (formData.password.trim()) {
          payload.password = formData.password.trim();
        }
        await api.put(`/admin/users/${editingUser.id}`, payload);
        addToast('Data pengguna berhasil diperbarui!', 'success');
      } else {
        if (!formData.password || formData.password.length < 6) {
          addToast('Password wajib diisi minimal 6 karakter untuk user baru.', 'error');
          setSubmitting(false);
          return;
        }
        await api.post('/admin/users', formData);
        addToast('Pengguna admin baru berhasil ditambahkan!', 'success');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-users-module">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">👥 Manajemen Pengguna & Hak Akses Portal</h2>
            <p className="admin-card-desc">
              Khusus Administrator & HRD Manager: Atur akun personil internal, perizinan role, dan status akun.
            </p>
          </div>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenAdd}
          >
            <span>+ Tambah Akun Baru</span>
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div className="admin-spinner" style={{ margin: '0 auto 12px' }} />
            <span>Memuat data pengguna...</span>
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Belum ada data pengguna.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nama Lengkap</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role Perizinan</th>
                  <th>Status Akun</th>
                  <th style={{ textAlign: 'right', width: '130px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u.id === currentUser.id;
                  return (
                    <tr key={u.id} style={{ background: isSelf ? 'rgba(45,212,191,0.05)' : undefined }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="admin-user-avatar" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span style={{ fontWeight: 600 }}>{u.name}</span>
                            {isSelf && (
                              <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: '#2dd4bf', fontWeight: 700 }}>
                                (Anda)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'monospace', color: '#94a3b8' }}>@{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`admin-pill ${
                          u.role === 'administrator' ? 'admin-pill--danger' :
                          u.role === 'hrd' ? 'admin-pill--warning' : 'admin-pill--info'
                        }`}>
                          {u.role?.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-pill ${u.status === 'active' ? 'admin-pill--success' : 'admin-pill--danger'}`}>
                          {u.status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="admin-btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            onClick={() => handleOpenEdit(u)}
                          >
                            Edit
                          </button>
                          {!isSelf && (
                            <button
                              type="button"
                              className="admin-btn-danger"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              onClick={() => handleDelete(u.id, u.name)}
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingUser ? 'Edit Pengguna Admin' : 'Tambah Pengguna Baru'}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-label">Nama Lengkap Personil</label>
                  <input
                    type="text"
                    className="admin-text-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Aditya Ristanto Mukti"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Username</label>
                    <input
                      type="text"
                      className="admin-text-input"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '') })}
                      placeholder="aditya_admin"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Email Resmi</label>
                    <input
                      type="email"
                      className="admin-text-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="aditya@isa.co.id"
                      required
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">
                    <span>Password</span>
                    {editingUser && <span className="admin-label-hint">(Kosongkan bila tidak ingin mengganti)</span>}
                  </label>
                  <input
                    type="password"
                    className="admin-text-input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingUser ? '•••••••• (Biarkan kosong jika tidak diubah)' : 'Minimal 6 karakter'}
                    autoComplete="new-password"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Role Perizinan</label>
                    <select
                      className="admin-select"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="administrator">Administrator (Semua Modul & User)</option>
                      <option value="hrd">HRD Manager (Konten & Lowongan & User)</option>
                      <option value="staff">Staff Konten (Hanya Konten Website)</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Status Akun</label>
                    <select
                      className="admin-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">Aktif (Dapat Login)</option>
                      <option value="inactive">Nonaktif (Diblokir)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Menyimpan...' : (editingUser ? 'Perbarui Akun' : 'Buat Akun')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
