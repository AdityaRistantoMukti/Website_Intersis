import { useState, useEffect } from 'react';
import api, { getImageUrl, extractErrorMessage } from '../../../lib/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export default function GalleryModule() {
  const { addToast } = useAdminAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('SMT Lines');
  const [eventDate, setEventDate] = useState('');
  const [status, setStatus] = useState('active');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [existingImage, setExistingImage] = useState('');

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/gallery?limit=50');
      setItems(res.data?.data || []);
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setCategory('SMT Lines');
    setEventDate(new Date().toISOString().split('T')[0]);
    setStatus('active');
    setImageFile(null);
    setPreviewUrl('');
    setExistingImage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setTitle(item.title || '');
    setDescription(item.description || '');
    setCategory(item.category || 'SMT Lines');
    setEventDate(item.event_date ? item.event_date.split('T')[0] : '');
    setStatus(item.status || 'active');
    setImageFile(null);
    setPreviewUrl('');
    setExistingImage(item.image || '');
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('File harus berupa gambar.', 'error');
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDelete = async (id, itemTitle) => {
    if (!window.confirm(`Yakin ingin menghapus foto galeri '${itemTitle}'?`)) return;

    try {
      await api.delete(`/admin/gallery/${id}`);
      addToast(`Foto '${itemTitle}' berhasil dihapus.`, 'success');
      fetchGallery();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem && !imageFile) {
      addToast('File gambar galeri wajib dipilih.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('event_date', eventDate);
      formData.append('status', status);
      formData.append('folder', 'gallery');

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (existingImage) {
        formData.append('image', existingImage);
      }

      if (editingItem) {
        await api.put(`/admin/gallery/${editingItem.id}`, formData);
        addToast('Item galeri berhasil diperbarui!', 'success');
      } else {
        await api.post('/admin/gallery', formData);
        addToast('Item galeri baru berhasil diunggah!', 'success');
      }

      setIsModalOpen(false);
      fetchGallery();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Distinct categories
  const categoriesList = ['all', ...new Set(items.map((i) => i.category).filter(Boolean))];
  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter((i) => i.category === activeCategory);

  return (
    <div className="admin-gallery-module">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">🖼️ Galeri Foto Fasilitas & Dokumentasi Pabrik</h2>
            <p className="admin-card-desc">
              Unggah dan kelola foto lini perakitan SMT, cleanroom, workshop jig otomatis, serta kegiatan perusahaan.
            </p>
          </div>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenAdd}
          >
            <span>+ Unggah Foto Baru</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`admin-btn-secondary ${activeCategory === cat ? 'admin-nav-item-btn--active' : ''}`}
              style={{
                fontSize: '0.8rem',
                padding: '5px 12px',
                borderRadius: '9999px',
                border: activeCategory === cat ? '1px solid #2dd4bf' : '1px solid var(--admin-input-border)',
                background: activeCategory === cat ? 'rgba(45,212,191,0.15)' : 'transparent',
                color: activeCategory === cat ? '#2dd4bf' : 'var(--admin-text-main)',
              }}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div className="admin-spinner" style={{ margin: '0 auto 12px' }} />
            <span>Memuat foto galeri...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Belum ada foto dalam kategori ini.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'var(--admin-card-bg)',
                  border: '1px solid var(--admin-card-border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s',
                }}
              >
                {/* Thumbnail Image */}
                <div style={{ height: '170px', position: 'relative', overflow: 'hidden', background: '#000' }}>
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(7, 13, 24, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#2dd4bf',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(45, 212, 191, 0.3)',
                    }}
                  >
                    {item.category || 'Galeri'}
                  </span>
                </div>

                {/* Details */}
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
                    📅 {item.event_date ? new Date(item.event_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Tanggal -'}
                  </div>
                  <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>
                    {item.title}
                  </h4>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.825rem', color: 'var(--admin-text-muted)', flex: 1, lineHeight: 1.4 }}>
                    {item.description || 'Tidak ada deskripsi tambahan.'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--admin-card-border)', paddingTop: '0.75rem' }}>
                    <span className={`admin-pill ${item.status === 'active' ? 'admin-pill--success' : 'admin-pill--danger'}`}>
                      {item.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="admin-btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        onClick={() => handleOpenEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn-danger"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        onClick={() => handleDelete(item.id, item.title)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Upload / Edit */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingItem ? 'Edit Informasi Galeri' : 'Unggah Foto Galeri Baru'}
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
                {/* File Upload Preview */}
                <div className="admin-form-group">
                  <label className="admin-label">
                    <span>File Gambar</span>
                    <span className="admin-label-hint">(JPG, PNG, WEBP &bull; Max 5 MB)</span>
                  </label>
                  <div className="admin-image-upload-zone">
                    <img
                      src={previewUrl || (existingImage ? getImageUrl(existingImage) : '/images/hero-smt.jpg')}
                      alt="Preview"
                      className="admin-image-preview-thumb"
                      onError={(e) => {
                        e.target.src = '/images/hero-smt.jpg';
                      }}
                    />
                    <div className="admin-upload-controls">
                      <label className="admin-btn-file-select">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                        <span>📁 {imageFile ? 'Ganti File Gambar' : 'Pilih File Gambar...'}</span>
                      </label>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                        {imageFile ? imageFile.name : (existingImage ? 'Menggunakan gambar saat ini' : 'Pilih gambar dari komputer')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="admin-form-group">
                  <label className="admin-label">Judul Foto / Fasilitas</label>
                  <input
                    type="text"
                    className="admin-text-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Lini SMT Dual-Beam Yamaha YSM20R"
                    required
                  />
                </div>

                {/* Category & Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Kategori</label>
                    <select
                      className="admin-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="SMT Lines">SMT Lines (Perakitan)</option>
                      <option value="Cleanroom Class 100K">Cleanroom Class 100K</option>
                      <option value="Workshop Otomasi">Workshop Otomasi & Jigs</option>
                      <option value="QA & Lab Testing">QA & Lab Testing</option>
                      <option value="Gedung & Logistik">Gedung & Logistik FTZ</option>
                      <option value="Exhibition">Exhibition & Pameran</option>
                      <option value="Team Building">Team Building & Internal</option>
                      <option value="CSR">CSR & Sosial</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Tanggal Pelaksanaan / Dokumentasi</label>
                    <input
                      type="date"
                      className="admin-text-input"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="admin-form-group">
                  <label className="admin-label">Keterangan / Spesifikasi</label>
                  <textarea
                    className="admin-textarea"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Deskripsi peralatan mesin, toleransi presisi, atau catatan kegiatan..."
                  />
                </div>

                {/* Status */}
                <div className="admin-form-group">
                  <label className="admin-label">Status Tampil</label>
                  <select
                    className="admin-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="active">Aktif (Tampil di Website Publik)</option>
                    <option value="inactive">Nonaktif (Disembunyikan)</option>
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
                  {submitting ? 'Menyimpan...' : (editingItem ? 'Perbarui Galeri' : 'Unggah Sekarang')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
