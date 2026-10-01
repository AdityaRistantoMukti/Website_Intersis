import { useState, useEffect } from 'react';
import api, { getImageUrl, extractErrorMessage } from '../../../lib/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export default function BenefitsModule() {
  const { addToast } = useAdminAuth();

  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('gift');
  const [sortOrder, setSortOrder] = useState(1);
  const [status, setStatus] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [existingImage, setExistingImage] = useState('');

  const fetchBenefits = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/benefits');
      setBenefits(res.data?.data || []);
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenefits();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setIcon('award');
    setSortOrder((benefits.length + 1) * 10);
    setStatus(1);
    setImageFile(null);
    setPreviewUrl('');
    setExistingImage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingItem(b);
    setTitle(b.title || '');
    setDescription(b.description || '');
    setIcon(b.icon || 'star');
    setSortOrder(b.sort_order ?? 0);
    setStatus(b.status ?? 1);
    setImageFile(null);
    setPreviewUrl('');
    setExistingImage(b.image || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id, bTitle) => {
    if (!window.confirm(`Yakin ingin menghapus benefit '${bTitle}'?`)) return;
    try {
      await api.delete(`/admin/benefits/${id}`);
      addToast(`Benefit '${bTitle}' berhasil dihapus.`, 'success');
      fetchBenefits();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('icon', icon);
      formData.append('sort_order', sortOrder);
      formData.append('status', status);
      formData.append('folder', 'benefits');

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (existingImage) {
        formData.append('image', existingImage);
      }

      if (editingItem) {
        await api.put(`/admin/benefits/${editingItem.id}`, formData);
        addToast('Benefit berhasil diperbarui!', 'success');
      } else {
        await api.post('/admin/benefits', formData);
        addToast('Benefit baru berhasil ditambahkan!', 'success');
      }
      setIsModalOpen(false);
      fetchBenefits();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-benefits-module">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">🎁 Fasilitas & Keuntungan Karyawan (Benefits & Perks)</h2>
            <p className="admin-card-desc">
              Kelola daftar benefit kesehatan, asuransi, tunjangan, dan pengembangan karir yang tampil di halaman karir.
            </p>
          </div>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenAdd}
          >
            <span>+ Tambah Benefit Baru</span>
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div className="admin-spinner" style={{ margin: '0 auto 12px' }} />
            <span>Memuat data benefit...</span>
          </div>
        ) : benefits.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Belum ada data benefit karyawan.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Icon</th>
                  <th>Nama Benefit</th>
                  <th>Deskripsi Fasilitas</th>
                  <th>Gambar / Ilustrasi</th>
                  <th>Urutan</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', width: '130px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {benefits.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span style={{ fontSize: '1.25rem' }}>🌟</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{b.title}</td>
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: '350px' }}>
                      {b.description || '—'}
                    </td>
                    <td>
                      {b.image ? (
                        <img
                          src={getImageUrl(b.image)}
                          alt={b.title}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Tanpa foto</span>
                      )}
                    </td>
                    <td>{b.sort_order}</td>
                    <td>
                      <span className={`admin-pill ${b.status ? 'admin-pill--success' : 'admin-pill--danger'}`}>
                        {b.status ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="admin-btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          onClick={() => handleOpenEdit(b)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="admin-btn-danger"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          onClick={() => handleDelete(b.id, b.title)}
                        >
                          Hapus
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
                {editingItem ? 'Edit Benefit Karyawan' : 'Tambah Benefit Baru'}
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
                  <label className="admin-label">Nama Fasilitas / Benefit</label>
                  <input
                    type="text"
                    className="admin-text-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Asuransi Swasta Komprehensif / Sertifikasi IPC Berbayar"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Deskripsi Fasilitas</label>
                  <textarea
                    className="admin-textarea"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Penjelasan benefit yang diperoleh staf..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Icon Identifier</label>
                    <input
                      type="text"
                      className="admin-text-input"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      placeholder="award / shield / heart"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Urutan Tampil</label>
                    <input
                      type="number"
                      className="admin-text-input"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Status</label>
                    <select
                      className="admin-select"
                      value={status}
                      onChange={(e) => setStatus(parseInt(e.target.value))}
                    >
                      <option value={1}>Aktif (Tampil)</option>
                      <option value={0}>Nonaktif</option>
                    </select>
                  </div>
                </div>

                {/* Optional Image */}
                <div className="admin-form-group">
                  <label className="admin-label">Gambar Ilustrasi (Opsional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        setImageFile(f);
                        setPreviewUrl(URL.createObjectURL(f));
                      }
                    }}
                  />
                  {(previewUrl || existingImage) && (
                    <div style={{ marginTop: '8px' }}>
                      <img
                        src={previewUrl || getImageUrl(existingImage)}
                        alt="Preview"
                        style={{ height: '60px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
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
                  {submitting ? 'Menyimpan...' : (editingItem ? 'Perbarui Benefit' : 'Simpan Benefit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
