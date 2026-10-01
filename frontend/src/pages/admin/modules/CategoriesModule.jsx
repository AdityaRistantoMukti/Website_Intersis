import { useState, useEffect } from 'react';
import api, { extractErrorMessage } from '../../../lib/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import {
  FolderKanban,
  Plus,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';

export default function CategoriesModule() {
  const { addToast } = useAdminAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/job-categories');
      setCategories(res.data?.data || []);
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCat(null);
    setName('');
    setDescription('');
    setStatus(1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCat(c);
    setName(c.name || '');
    setDescription(c.description || '');
    setStatus(c.status ?? 1);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Yakin ingin menghapus kategori '${catName}'?`)) return;
    try {
      await api.delete(`/admin/job-categories/${id}`);
      addToast(`Kategori '${catName}' berhasil dihapus.`, 'success');
      fetchCategories();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCat) {
        await api.put(`/admin/job-categories/${editingCat.id}`, { name, description, status });
        addToast('Kategori berhasil diperbarui!', 'success');
      } else {
        await api.post('/admin/job-categories', { name, description, status });
        addToast('Kategori baru berhasil ditambahkan!', 'success');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-categories-module">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FolderKanban size={20} strokeWidth={2} />
              <span>Kategori Departemen Karir</span>
            </h2>
            <p className="admin-card-desc">
              Kelola divisi dan departemen kerja untuk pengelompokan lowongan pekerjaan (Engineering, QA, Produksi, dsb).
            </p>
          </div>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenAdd}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} strokeWidth={2} />
            <span>Tambah Kategori</span>
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div className="admin-spinner" style={{ margin: '0 auto 12px' }} />
            <span>Memuat data kategori...</span>
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Belum ada kategori yang dibuat.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Nama Departemen / Kategori</th>
                  <th>Deskripsi Kategori</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', width: '130px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td style={{ color: '#64748b', fontFamily: 'monospace' }}>#{c.id}</td>
                    <td style={{ fontWeight: 700 }}>{c.name}</td>
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{c.description || '—'}</td>
                    <td>
                      <span className={`admin-pill ${c.status ? 'admin-pill--success' : 'admin-pill--danger'}`}>
                        {c.status ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="admin-btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => handleOpenEdit(c)}
                        >
                          <Pencil size={12} strokeWidth={2} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="admin-btn-danger"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => handleDelete(c.id, c.name)}
                        >
                          <Trash2 size={12} strokeWidth={2} />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                {editingCat ? 'Edit Kategori Departemen' : 'Tambah Kategori Departemen'}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-label">Nama Departemen</label>
                  <input
                    type="text"
                    className="admin-text-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: SMT Process Engineering / Information Technology"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Deskripsi Departemen</label>
                  <textarea
                    className="admin-textarea"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tugas dan fokus divisi..."
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Status Kategori</label>
                  <select
                    className="admin-select"
                    value={status}
                    onChange={(e) => setStatus(parseInt(e.target.value))}
                  >
                    <option value={1}>Aktif (Bisa Dipilih)</option>
                    <option value={0}>Nonaktif (Disembunyikan)</option>
                  </select>
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
                  {submitting ? 'Menyimpan...' : (editingCat ? 'Perbarui Kategori' : 'Simpan Kategori')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
