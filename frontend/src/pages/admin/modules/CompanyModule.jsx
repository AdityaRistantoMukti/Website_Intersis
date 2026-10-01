import { useState, useEffect } from 'react';
import api, { getImageUrl, extractErrorMessage } from '../../../lib/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export default function CompanyModule() {
  const { addToast } = useAdminAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [vision, setVision] = useState('');
  const [mission, setMission] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Fetch current company profile
  useEffect(() => {
    let isMounted = true;
    async function fetchCompany() {
      try {
        setLoading(true);
        const res = await api.get('/public/company');
        const data = res.data?.data;
        if (data && isMounted) {
          setTitle(data.title || '');
          setDescription(data.description || '');
          setVision(data.vision || '');
          setMission(data.mission || '');
          setCurrentImage(data.about_image || '');
        }
      } catch (err) {
        addToast(extractErrorMessage(err), 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchCompany();
    return () => { isMounted = false; };
  }, [addToast]);

  // Handle local image file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('File harus berupa format gambar (JPG, PNG, WEBP).', 'error');
        return;
      }
      setNewImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (newImageFile) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('vision', vision);
        formData.append('mission', mission);
        formData.append('about_image', newImageFile);
        formData.append('folder', 'company');

        const res = await api.put('/admin/company', formData);
        addToast(res.data?.message || 'Profil perusahaan dan gambar berhasil diperbarui!', 'success');
      } else {
        const res = await api.put('/admin/company', {
          title,
          description,
          vision,
          mission,
          about_image: currentImage,
        });
        addToast(res.data?.message || 'Profil perusahaan berhasil diperbarui!', 'success');
      }

      // Re-fetch to sync
      const updated = await api.get('/public/company');
      if (updated.data?.data) {
        setCurrentImage(updated.data.data.about_image || '');
        setNewImageFile(null);
        setPreviewUrl('');
      }
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
        <div className="admin-spinner" style={{ margin: '0 auto 12px' }} />
        <span>Memuat data profil perusahaan...</span>
      </div>
    );
  }

  return (
    <div className="admin-company-module">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">🏢 Manajemen Profil & Hero Landing Page</h2>
            <p className="admin-card-desc">
              Atur nama entitas bisnis, ringkasan profil utama publik, visi, misi, dan banner gambar perusahaan.
            </p>
          </div>
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            Lihat di Halaman About ↗
          </a>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            {/* Entity Title */}
            <div className="admin-form-group admin-form-group--full">
              <label className="admin-label">
                <span>Nama Resmi Perusahaan</span>
                <span className="admin-label-hint">(Tampil pada footer dan meta branding)</span>
              </label>
              <input
                type="text"
                className="admin-text-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: PT. Intersis Sejahtera Abadi"
                required
              />
            </div>

            {/* Description */}
            <div className="admin-form-group admin-form-group--full">
              <label className="admin-label">
                <span>Deskripsi Perusahaan (Publik & Landing Page)</span>
                <span className="admin-label-hint">(Ditampilkan pada section About & beranda bisnis)</span>
              </label>
              <textarea
                className="admin-textarea"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan gambaran umum portofolio bisnis, sejarah, dan kapabilitas perakitan elektronik..."
                required
              />
            </div>

            {/* Vision */}
            <div className="admin-form-group">
              <label className="admin-label">
                <span>Visi Perusahaan</span>
              </label>
              <textarea
                className="admin-textarea"
                rows="4"
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                placeholder="Menjadi pemimpin pasar manufaktur & teknologi elektronik otomotif..."
              />
            </div>

            {/* Mission */}
            <div className="admin-form-group">
              <label className="admin-label">
                <span>Misi Perusahaan</span>
                <span className="admin-label-hint">(Dapat menggunakan nomor atau baris baru)</span>
              </label>
              <textarea
                className="admin-textarea"
                rows="4"
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="1. Mengembangkan produk teknologi bermutu tinggi...&#10;2. Menerapkan tata kelola berkelanjutan..."
              />
            </div>

            {/* Image Upload Zone */}
            <div className="admin-form-group admin-form-group--full">
              <label className="admin-label">
                <span>Gambar Utama / Banner Fasilitas Perusahaan</span>
                <span className="admin-label-hint">(Format: JPG, PNG, WEBP &bull; Max 5 MB)</span>
              </label>

              <div className="admin-image-upload-zone">
                <img
                  src={previewUrl || getImageUrl(currentImage) || '/images/hero-smt.jpg'}
                  alt="Preview Profil Perusahaan"
                  className="admin-image-preview-thumb"
                  onError={(e) => {
                    e.target.src = '/images/hero-smt.jpg';
                  }}
                />

                <div className="admin-upload-controls">
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '4px' }}>
                    {newImageFile ? newImageFile.name : (currentImage ? currentImage.split('/').pop() : 'Belum ada gambar custom')}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '10px' }}>
                    {newImageFile
                      ? `Siap diunggah (${(newImageFile.size / 1024 / 1024).toFixed(2)} MB)`
                      : 'Unggah file gambar baru untuk mengganti foto perusahaan di landing page public'}
                  </div>

                  <label className="admin-btn-file-select">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <span>📁 Pilih Foto Baru...</span>
                  </label>

                  {newImageFile && (
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => {
                        setNewImageFile(null);
                        setPreviewUrl('');
                      }}
                      style={{ marginLeft: '8px', fontSize: '0.8rem', padding: '6px 10px' }}
                    >
                      Batal Ganti
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--admin-card-border)' }}>
            <button
              type="submit"
              className="admin-btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="admin-spinner" />
                  <span>Menyimpan Perubahan...</span>
                </>
              ) : (
                <>
                  <span>Simpan Perubahan Konten</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
