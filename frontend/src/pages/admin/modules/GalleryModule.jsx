import { useState, useEffect } from 'react';
import { Image, Plus, Edit2, Trash2, Calendar, Upload, Sliders, Save } from 'lucide-react';
import api, { getImageUrl, extractErrorMessage } from '../../../lib/api';
import { translateContent } from '../../../lib/translator';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import LanguageTabControl from '../../../components/admin/LanguageTabControl';

export default function GalleryModule() {
  const { addToast, showConfirm } = useAdminAuth();

  const [activeSection, setActiveSection] = useState('photos');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  // Header State
  const [headerData, setHeaderData] = useState({
    id: {
      title: 'Dokumentasi Fasilitas Manufaktur & Ruang Produksi Bersih',
      subtitle: 'Telusuri fasilitas cleanroom Class 100K, lini penempatan SMT kecepatan tinggi 80.000 CPH, sistem inspeksi 3D SPI/AOI, dan laboratorium rekayasa jig otomatis kami di Batam Free Trade Zone.',
    },
    en: {
      title: 'Manufacturing Facilities Documentation & Clean Production Floor',
      subtitle: 'Explore our ESD Class 100K cleanroom, high-speed 80,000 CPH SMT placement lines, 3D SPI/AOI inspection stations, and automated test jig engineering lab in Batam Free Trade Zone.',
    },
  });
  const [activeHeadLang, setActiveHeadLang] = useState('id');
  const [savingHeader, setSavingHeader] = useState(false);
  const [translatingHeader, setTranslatingHeader] = useState(false);

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
      const [res, headRes] = await Promise.allSettled([
        api.get('/admin/gallery?limit=50'),
        api.get('/public/site-settings/gallery_header'),
      ]);
      if (res.status === 'fulfilled') {
        setItems(res.value.data?.data || []);
      }
      if (headRes.status === 'fulfilled' && headRes.value.data?.data) {
        const d = headRes.value.data.data;
        if (d.id && d.en) {
          setHeaderData(d);
        } else if (d.id) {
          setHeaderData((prev) => ({ ...prev, id: d.id, en: d.en || prev.en }));
        }
      }
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHeader = async () => {
    setSavingHeader(true);
    try {
      await api.put('/admin/site-settings/gallery_header', headerData);
      addToast('Header halaman galeri berhasil disimpan!', 'success');
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSavingHeader(false);
    }
  };

  const handleAutoTranslateHeader = async () => {
    setTranslatingHeader(true);
    try {
      addToast('Menerjemahkan header galeri ke English...', 'info');
      const translated = await translateContent(headerData.id);
      setHeaderData((prev) => ({ ...prev, en: translated }));
      setActiveHeadLang('en');
      addToast('Terjemahan selesai!', 'success');
    } catch (err) {
      addToast('Gagal menerjemahkan: ' + extractErrorMessage(err), 'error');
    } finally {
      setTranslatingHeader(false);
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
    const confirmed = await showConfirm({
      title: 'Hapus Foto Galeri?',
      text: `Yakin ingin menghapus foto galeri '${itemTitle}'?`,
      confirmText: 'Ya, Hapus Foto',
    });
    if (!confirmed) return;

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
        addToast('Foto fasilitas baru berhasil diunggah!', 'success');
      }

      setIsModalOpen(false);
      fetchGallery();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const categoriesList = ['all', ...new Set(items.map((i) => i.category).filter(Boolean))];
  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter((i) => i.category === activeCategory);

  const currentHead = headerData[activeHeadLang] || headerData.id;

  return (
    <div className="admin-gallery-module">
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: '0.35rem' }}>
          Manajemen Konten Halaman Galeri & Fasilitas
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          Kelola foto fasilitas manufaktur bersih, lini SMT, ruang pengujian, serta teks header pengantar galeri.
        </p>
      </div>

      {/* Divided Section Navigation Tabs */}
      <div className="admin-section-nav">
        <button
          type="button"
          className={`admin-section-nav-btn ${activeSection === 'photos' ? 'active' : ''}`}
          onClick={() => setActiveSection('photos')}
        >
          <Image size={16} />
          <span>1. Manajemen Foto Fasilitas ({items.length})</span>
        </button>
        <button
          type="button"
          className={`admin-section-nav-btn ${activeSection === 'header' ? 'active' : ''}`}
          onClick={() => setActiveSection('header')}
        >
          <Sliders size={16} />
          <span>2. Header Halaman Galeri</span>
        </button>
      </div>

      {activeSection === 'header' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 2: Header Halaman Galeri</h3>
              <p className="admin-card-subtitle">
                Atur judul sambutan dan narasi pengantar dokumentasi fasilitas produksi Batam FTZ.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingHeader}
              onClick={handleSaveHeader}
            >
              <Save size={16} />
              <span>{savingHeader ? 'Menyimpan...' : 'Simpan Header Galeri'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={activeHeadLang}
            onSelectLang={setActiveHeadLang}
            onTranslate={handleAutoTranslateHeader}
            isTranslating={translatingHeader}
          />

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Judul Utama Galeri ({activeHeadLang.toUpperCase()})</label>
              <input
                type="text"
                className="admin-input"
                value={currentHead.title || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setHeaderData((prev) => ({
                    ...prev,
                    [activeHeadLang]: { ...prev[activeHeadLang], title: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Subjudul Penjelasan ({activeHeadLang.toUpperCase()})</label>
              <textarea
                rows={3}
                className="admin-textarea"
                value={currentHead.subtitle || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setHeaderData((prev) => ({
                    ...prev,
                    [activeHeadLang]: { ...prev[activeHeadLang], subtitle: val },
                  }));
                }}
              />
            </div>
          </div>
        </div>
      )}

      {activeSection === 'photos' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">
                <Image size={18} />
                <span>Foto Fasilitas & Dokumentasi Produksi</span>
              </h2>
              <p className="admin-card-desc">
                Kelola dokumentasi visual lini SMT, cleanroom, workshop jig otomatis, dan lab pengujian.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={handleOpenAdd}
            >
              <Plus size={14} />
              <span>Unggah Foto Baru</span>
            </button>
          </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              type="button"
              className="admin-btn-secondary"
              style={{
                fontSize: '0.78rem',
                padding: '4px 10px',
                borderRadius: '4px',
                background: activeCategory === cat ? 'var(--adm-hover)' : 'transparent',
                borderColor: activeCategory === cat ? 'var(--adm-teal)' : 'var(--adm-border)',
                color: activeCategory === cat ? '#ffffff' : 'var(--adm-muted)',
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
            <span>Memuat foto fasilitas...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Belum ada foto dalam kategori ini.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'var(--adm-card)',
                  border: '1px solid var(--adm-border)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Thumbnail */}
                <div style={{ height: '160px', position: 'relative', overflow: 'hidden', background: '#000' }}>
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
                      top: '8px',
                      left: '8px',
                      background: 'rgba(9, 13, 22, 0.9)',
                      color: 'var(--adm-teal)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: '3px',
                      border: '1px solid var(--adm-border)',
                    }}
                  >
                    {item.category || 'Fasilitas'}
                  </span>
                </div>

                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--adm-subtle)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={11} />
                    <span>{item.event_date ? new Date(item.event_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}</span>
                  </div>
                  <h4 style={{ margin: '0 0 6px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--adm-text)' }}>
                    {item.title}
                  </h4>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: 'var(--adm-muted)', flex: 1, lineHeight: 1.4 }}>
                    {item.description || '—'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--adm-border)', paddingTop: '0.65rem' }}>
                    <span className={`admin-pill ${item.status === 'active' ? 'admin-pill--success' : 'admin-pill--danger'}`}>
                      {item.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>

                    <div style={{ display: 'flex', gap: '4px' }}>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingItem ? 'Edit Informasi Foto' : 'Unggah Foto Fasilitas Baru'}
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
                  <label className="admin-label">File Gambar</label>
                  <div className="admin-image-upload-zone">
                    <img
                      src={previewUrl || (existingImage ? getImageUrl(existingImage) : '/images/hero-smt.jpg')}
                      alt="Preview"
                      className="admin-image-preview-thumb"
                      onError={(e) => { e.target.src = '/images/hero-smt.jpg'; }}
                    />
                    <div style={{ flex: 1 }}>
                      <label className="admin-btn-file-select">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                        <Upload size={14} />
                        <span>{imageFile ? 'Ganti File Gambar' : 'Pilih Gambar'}</span>
                      </label>
                      <div style={{ fontSize: '0.72rem', color: 'var(--adm-muted)', marginTop: '4px' }}>
                        {imageFile ? imageFile.name : (existingImage ? 'Gambar saat ini digunakan' : 'Format JPG, PNG, WEBP')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Judul Foto / Fasilitas</label>
                  <input
                    type="text"
                    className="admin-text-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="High-Speed SMT Modular Placement Lines"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Kategori</label>
                    <select
                      className="admin-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="SMT Lines">SMT Lines</option>
                      <option value="Cleanroom Class 100K">Cleanroom Class 100K</option>
                      <option value="Workshop Otomasi">Workshop Otomasi & Jigs</option>
                      <option value="QA & Lab Testing">QA & Lab Testing</option>
                      <option value="Gedung & Logistik">Gedung & Logistik FTZ</option>
                      <option value="Exhibition">Exhibition</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Tanggal Pelaksanaan / Foto</label>
                    <input
                      type="date"
                      className="admin-text-input"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Keterangan Spesifikasi Teknis</label>
                  <textarea
                    className="admin-textarea"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Spesifikasi mesin atau detail kapasitas..."
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Status</label>
                  <select
                    className="admin-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="active">Aktif (Tampil di Website)</option>
                    <option value="inactive">Nonaktif</option>
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
                  {submitting ? 'Menyimpan...' : (editingItem ? 'Perbarui Foto' : 'Unggah Foto')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
