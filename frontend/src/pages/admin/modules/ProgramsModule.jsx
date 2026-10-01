import { useState, useEffect } from 'react';
import api, { getImageUrl, extractErrorMessage } from '../../../lib/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import {
  GraduationCap,
  Plus,
  ExternalLink,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';

export default function ProgramsModule() {
  const { addToast, showConfirm } = useAdminAuth();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [status, setStatus] = useState('active');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [existingImage, setExistingImage] = useState('');

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/programs');
      setPrograms(res.data?.data || []);
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setRequirements('');
    setRegistrationUrl('');
    setStatus('active');
    setImageFile(null);
    setPreviewUrl('');
    setExistingImage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingItem(p);
    setTitle(p.title || '');
    setSlug(p.slug || '');
    setDescription(p.description || '');
    setRequirements(p.requirements || '');
    setRegistrationUrl(p.registration_url || '');
    setStatus(p.status || 'active');
    setImageFile(null);
    setPreviewUrl('');
    setExistingImage(p.image || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id, pTitle) => {
    const confirmed = await showConfirm({
      title: 'Hapus Program?',
      text: `Yakin ingin menghapus program '${pTitle}'?`,
      confirmText: 'Ya, Hapus Program',
    });
    if (!confirmed) return;
    try {
      await api.delete(`/admin/programs/${id}`);
      addToast(`Program '${pTitle}' berhasil dihapus.`, 'success');
      fetchPrograms();
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
      formData.append('slug', slug);
      formData.append('description', description);
      formData.append('requirements', requirements);
      formData.append('registration_url', registrationUrl);
      formData.append('status', status);
      formData.append('folder', 'programs');

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (existingImage) {
        formData.append('image', existingImage);
      }

      if (editingItem) {
        await api.put(`/admin/programs/${editingItem.id}`, formData);
        addToast('Program berhasil diperbarui!', 'success');
      } else {
        await api.post('/admin/programs', formData);
        addToast('Program baru berhasil dibuat!', 'success');
      }
      setIsModalOpen(false);
      fetchPrograms();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-programs-module">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={20} strokeWidth={2} />
              <span>Program Magang & Pelatihan Khusus (Internship / MT)</span>
            </h2>
            <p className="admin-card-desc">
              Kelola inisiatif program vokasi, magang bersertifikat, dan program percepatan karir bagi talenta muda.
            </p>
          </div>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenAdd}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} strokeWidth={2} />
            <span>Tambah Program Baru</span>
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div className="admin-spinner" style={{ margin: '0 auto 12px' }} />
            <span>Memuat program...</span>
          </div>
        ) : programs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Belum ada program yang dibuat.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Judul Program</th>
                  <th>Slug URL</th>
                  <th>Poster / Gambar</th>
                  <th>Tautan Pendaftaran</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', width: '130px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong style={{ color: 'var(--admin-text-main)' }}>{p.title}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.description}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#38bdf8' }}>
                        /{p.slug}
                      </span>
                    </td>
                    <td>
                      {p.image ? (
                        <img
                          src={getImageUrl(p.image)}
                          alt={p.title}
                          style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Tanpa poster</span>
                      )}
                    </td>
                    <td>
                      {p.registration_url ? (
                        <a
                          href={p.registration_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'var(--adm-text)', textDecoration: 'underline', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <ExternalLink size={12} strokeWidth={2} />
                          <span>Form Pendaftaran</span>
                        </a>
                      ) : '—'}
                    </td>
                    <td>
                      <span className={`admin-pill ${p.status === 'active' ? 'admin-pill--success' : 'admin-pill--danger'}`}>
                        {p.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="admin-btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => handleOpenEdit(p)}
                        >
                          <Pencil size={12} strokeWidth={2} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="admin-btn-danger"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => handleDelete(p.id, p.title)}
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
                {editingItem ? 'Edit Program Khusus' : 'Tambah Program Baru'}
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
                  <label className="admin-label">Judul Program</label>
                  <input
                    type="text"
                    className="admin-text-input"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingItem) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                      }
                    }}
                    placeholder="Contoh: Certified SMT Assembly Internship 2026"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Slug URL</label>
                    <input
                      type="text"
                      className="admin-text-input"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="magang-smt-2026"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Status Program</label>
                    <select
                      className="admin-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="active">Aktif (Buka Pendaftaran)</option>
                      <option value="inactive">Nonaktif (Ditutup)</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">URL Link Pendaftaran</label>
                  <input
                    type="url"
                    className="admin-text-input"
                    value={registrationUrl}
                    onChange={(e) => setRegistrationUrl(e.target.value)}
                    placeholder="https://forms.gle/xxxx (Google Form / Portal Registrasi)"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Deskripsi Program</label>
                  <textarea
                    className="admin-textarea"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Uraian manfaat, kurikulum, dan lama masa program..."
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Persyaratan Peserta (Requirements)</label>
                  <textarea
                    className="admin-textarea"
                    rows="3"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Kriteria mahasiswa/lulusan yang dapat mendaftar..."
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Poster / Foto Banner Program</label>
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
                        style={{ height: '70px', borderRadius: '6px', objectFit: 'cover' }}
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
                  {submitting ? 'Menyimpan...' : (editingItem ? 'Perbarui Program' : 'Simpan Program')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
