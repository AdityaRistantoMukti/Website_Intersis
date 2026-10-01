import { useState, useEffect } from 'react';
import { Award, Plus, Edit2, Trash2 } from 'lucide-react';
import api, { extractErrorMessage } from '../../../lib/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export default function CoreValuesModule() {
  const { addToast, showConfirm } = useAdminAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'award',
    sort_order: 10,
    status: 1,
  });

  const fetchCoreValues = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/core-values');
      setItems(res.data?.data || []);
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoreValues();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      icon: 'award',
      sort_order: (items.length + 1) * 10,
      status: 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      icon: item.icon || 'award',
      sort_order: item.sort_order ?? 0,
      status: item.status ?? 1,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    const confirmed = await showConfirm({
      title: 'Hapus Nilai Inti?',
      text: `Yakin ingin menghapus nilai inti '${title}'?`,
      confirmText: 'Ya, Hapus',
    });
    if (!confirmed) return;

    try {
      await api.delete(`/admin/core-values/${id}`);
      addToast(`Nilai inti '${title}' berhasil dihapus.`, 'success');
      fetchCoreValues();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingItem) {
        await api.put(`/admin/core-values/${editingItem.id}`, formData);
        addToast('Nilai inti berhasil diperbarui!', 'success');
      } else {
        await api.post('/admin/core-values', formData);
        addToast('Nilai inti baru berhasil ditambahkan!', 'success');
      }
      setIsModalOpen(false);
      fetchCoreValues();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-corevalues-module">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">
              <Award size={18} />
              <span>Nilai Inti Rekayasa (Core Engineering Values)</span>
            </h2>
            <p className="admin-card-desc">
              Kelola 6 pilar mutu dan standar nol-cacat yang tampil di section Core Values landing page.
            </p>
          </div>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenAdd}
          >
            <Plus size={14} />
            <span>Tambah Nilai Inti</span>
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div className="admin-spinner" style={{ margin: '0 auto 12px' }} />
            <span>Memuat nilai inti...</span>
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Belum ada data nilai inti.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>No</th>
                  <th>Judul Nilai Inti</th>
                  <th>Deskripsi Kualitatif</th>
                  <th>Icon Key</th>
                  <th>Urutan</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', width: '110px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600, color: 'var(--adm-muted)' }}>0{idx + 1}</td>
                    <td style={{ fontWeight: 600 }}>{item.title}</td>
                    <td style={{ maxWidth: '420px', color: 'var(--adm-muted)', fontSize: '0.825rem' }}>
                      {item.description || '—'}
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', background: 'var(--adm-input-bg)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--adm-border)' }}>
                        {item.icon || 'default'}
                      </span>
                    </td>
                    <td>{item.sort_order}</td>
                    <td>
                      <span className={`admin-pill ${item.status ? 'admin-pill--success' : 'admin-pill--danger'}`}>
                        {item.status ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '4px' }}>
                        <button
                          type="button"
                          className="admin-btn-secondary"
                          style={{ padding: '4px 6px' }}
                          onClick={() => handleOpenEdit(item)}
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          className="admin-btn-danger"
                          style={{ padding: '4px 6px' }}
                          onClick={() => handleDelete(item.id, item.title)}
                          title="Hapus"
                        >
                          <Trash2 size={13} />
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
                {editingItem ? 'Edit Nilai Inti' : 'Tambah Nilai Inti Baru'}
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
                  <label className="admin-label">Judul Nilai Inti</label>
                  <input
                    type="text"
                    className="admin-text-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Zero-Defect Quality Culture"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Deskripsi Nilai</label>
                  <textarea
                    className="admin-textarea"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Kepatuhan standar mutu IATF 16949..."
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Icon Ref</label>
                    <input
                      type="text"
                      className="admin-text-input"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="award / cpu / scan / wrench"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Urutan</label>
                    <input
                      type="number"
                      className="admin-text-input"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Status</label>
                    <select
                      className="admin-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                    >
                      <option value={1}>Aktif</option>
                      <option value={0}>Nonaktif</option>
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
                  {submitting ? 'Menyimpan...' : (editingItem ? 'Perbarui Nilai' : 'Simpan Nilai')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
