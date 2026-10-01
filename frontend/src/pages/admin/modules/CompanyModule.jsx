import { useState, useEffect } from 'react';
import { Building2, Save, Upload, ExternalLink } from 'lucide-react';
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
        addToast(res.data?.message || 'Profil perusahaan dan foto berhasil disimpan!', 'success');
      } else {
        const res = await api.put('/admin/company', {
          title,
          description,
          vision,
          mission,
          about_image: currentImage,
        });
        addToast(res.data?.message || 'Profil perusahaan berhasil disimpan!', 'success');
      }

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
            <h2 className="admin-card-title">
              <Building2 size={18} />
              <span>Profil Perusahaan & Landing Page</span>
            </h2>
            <p className="admin-card-desc">
              Kelola nama resmi perusahaan, ringkasan profil manufaktur, visi, misi, dan foto fasilitas pabrik.
            </p>
          </div>
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn-secondary"
          >
            <span>Lihat Halaman About</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-form-group admin-form-group--full">
              <label className="admin-label">Nama Resmi Perusahaan</label>
              <input
                type="text"
                className="admin-text-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="PT. Global Philsonic Technologies"
                required
              />
            </div>

            <div className="admin-form-group admin-form-group--full">
              <label className="admin-label">Deskripsi Utama Manufaktur (Landing Page & About)</label>
              <textarea
                className="admin-textarea"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan deskripsi kapabilitas perakitan presisi, fasilitas Batam FTZ, dan standar mutu..."
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Visi Perusahaan</label>
              <textarea
                className="admin-textarea"
                rows="4"
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                placeholder="Visi jangka panjang manufaktur..."
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Misi Perusahaan</label>
              <textarea
                className="admin-textarea"
                rows="4"
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="1. Menghasilkan perakitan presisi...&#10;2. Menerapkan standar IATF 16949..."
              />
            </div>

            {/* Image upload */}
            <div className="admin-form-group admin-form-group--full">
              <label className="admin-label">Foto / Banner Fasilitas Pabrik</label>
              <div className="admin-image-upload-zone">
                <img
                  src={previewUrl || getImageUrl(currentImage) || '/images/hero-smt.jpg'}
                  alt="Preview"
                  className="admin-image-preview-thumb"
                  onError={(e) => { e.target.src = '/images/hero-smt.jpg'; }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '2px' }}>
                    {newImageFile ? newImageFile.name : (currentImage ? currentImage.split('/').pop() : 'Default Image')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--adm-muted)', marginBottom: '8px' }}>
                    Format yang didukung: JPG, PNG, WEBP (Maksimal 5 MB)
                  </div>

                  <label className="admin-btn-file-select">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <Upload size={14} />
                    <span>Pilih Foto Baru</span>
                  </label>

                  {newImageFile && (
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => {
                        setNewImageFile(null);
                        setPreviewUrl('');
                      }}
                      style={{ marginLeft: '8px', padding: '4px 8px', fontSize: '0.75rem' }}
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--adm-border)' }}>
            <button
              type="submit"
              className="admin-btn-primary"
              disabled={saving}
            >
              <Save size={14} />
              <span>{saving ? 'Menyimpan...' : 'Simpan Profil Perusahaan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
