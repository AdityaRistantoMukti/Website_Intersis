import { useState, useEffect } from 'react';
import api, { extractErrorMessage } from '../../../lib/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { translateContent } from '../../../lib/translator';
import {
  Briefcase,
  Plus,
  Search,
  Pencil,
  Trash2,
  MapPin,
  ExternalLink,
  X,
  Sparkles,
  Globe,
  Languages,
} from 'lucide-react';

export default function JobsModule() {
  const { addToast, showConfirm } = useAdminAuth();

  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalLangTab, setModalLangTab] = useState('id');
  const [translating, setTranslating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    title_en: '',
    category_id: '',
    employment_type: 'Full Time',
    location: 'Batam FTZ Plant',
    status: 'published',
    description: '',
    description_en: '',
    responsibilities: '',
    responsibilities_en: '',
    requirements: '',
    requirements_en: '',
    form_url: '',
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category_id = categoryFilter;
      if (searchQuery.trim()) params.q = searchQuery.trim();

      const [jobsRes, catsRes] = await Promise.all([
        api.get('/admin/jobs?limit=50', { params }),
        api.get('/admin/job-categories'),
      ]);

      setJobs(jobsRes.data?.data || []);
      setCategories(catsRes.data?.data || []);
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleOpenAdd = () => {
    setEditingJob(null);
    setModalLangTab('id');
    setFormData({
      title: '',
      title_en: '',
      category_id: categories[0]?.id || '',
      employment_type: 'Full Time',
      location: 'Batam FTZ Plant',
      status: 'published',
      description: '',
      description_en: '',
      responsibilities: '',
      responsibilities_en: '',
      requirements: '',
      requirements_en: '',
      form_url: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (job) => {
    try {
      const res = await api.get(`/admin/jobs/${job.id}`);
      const full = res.data?.data || job;
      setEditingJob(full);
      setModalLangTab('id');
      setFormData({
        title: full.title || '',
        title_en: full.title_en || '',
        category_id: full.category_id || '',
        employment_type: full.employment_type || 'Full Time',
        location: full.location || '',
        status: full.status || 'published',
        description: full.description || '',
        description_en: full.description_en || '',
        responsibilities: full.responsibilities || '',
        responsibilities_en: full.responsibilities_en || '',
        requirements: full.requirements || '',
        requirements_en: full.requirements_en || '',
        form_url: full.form_url || '',
      });
      setIsModalOpen(true);
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    }
  };

  const handleAutoTranslate = async () => {
    if (!formData.title && !formData.description && !formData.requirements) {
      addToast('Silakan isi informasi dalam Bahasa Indonesia terlebih dahulu sebelum menerjemahkan.', 'warning');
      return;
    }

    try {
      setTranslating(true);
      const res = await translateContent({
        title: formData.title,
        description: formData.description,
        responsibilities: formData.responsibilities,
        requirements: formData.requirements,
      });

      setFormData((prev) => ({
        ...prev,
        title_en: res.title || prev.title_en,
        description_en: res.description || prev.description_en,
        responsibilities_en: res.responsibilities || prev.responsibilities_en,
        requirements_en: res.requirements || prev.requirements_en,
      }));
      setModalLangTab('en');
      addToast('Konten lowongan berhasil diterjemahkan otomatis ke Bahasa Inggris!', 'success');
    } catch (err) {
      addToast('Gagal menerjemahkan: ' + extractErrorMessage(err), 'error');
    } finally {
      setTranslating(false);
    }
  };

  const handleDelete = async (id, title) => {
    const confirmed = await showConfirm({
      title: 'Hapus Lowongan Karir?',
      text: `Yakin ingin menghapus lowongan '${title}'?`,
      confirmText: 'Ya, Hapus Lowongan',
    });
    if (!confirmed) return;

    try {
      await api.delete(`/admin/jobs/${id}`);
      addToast(`Lowongan '${title}' berhasil dihapus.`, 'success');
      fetchJobs();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingJob) {
        await api.put(`/admin/jobs/${editingJob.id}`, formData);
        addToast('Data lowongan berhasil diperbarui!', 'success');
      } else {
        await api.post('/admin/jobs', formData);
        addToast('Lowongan baru berhasil dibuat!', 'success');
      }
      setIsModalOpen(false);
      fetchJobs();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-jobs-module">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={20} strokeWidth={2} />
              <span>Lowongan Kerja & Rekrutmen Karir</span>
            </h2>
            <p className="admin-card-desc">
              Kelola posisi rekrutmen, kualifikasi teknis, departemen kerja, dan status publikasi di website.
            </p>
          </div>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenAdd}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} strokeWidth={2} />
            <span>Buat Lowongan Baru</span>
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '6px', flex: '1', minWidth: '240px' }}>
            <input
              type="text"
              className="admin-text-input"
              placeholder="Cari judul atau kata kunci lowongan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="admin-btn-secondary" style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Search size={14} />
              <span>Cari</span>
            </button>
          </form>

          {/* Status filter */}
          <select
            className="admin-select"
            style={{ width: 'auto', minWidth: '150px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="published">Tayang (Published)</option>
            <option value="draft">Draf (Draft)</option>
            <option value="closed">Ditutup (Closed)</option>
          </select>

          {/* Category filter */}
          <select
            className="admin-select"
            style={{ width: 'auto', minWidth: '160px' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Semua Departemen</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div className="admin-spinner" style={{ margin: '0 auto 12px' }} />
            <span>Memuat data lowongan kerja...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Belum ada data lowongan yang sesuai kriteria pencarian.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Posisi Lowongan</th>
                  <th>Departemen</th>
                  <th>Tipe Kerja</th>
                  <th>Lokasi</th>
                  <th>Status</th>
                  <th>Dibuat Oleh</th>
                  <th style={{ textAlign: 'right', width: '130px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--admin-text-main)' }}>{job.title}</div>
                      {job.form_url && (
                        <a
                          href={job.form_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '0.72rem', color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}
                        >
                          <ExternalLink size={11} strokeWidth={2} />
                          <span>Form Pendaftaran Eksternal</span>
                        </a>
                      )}
                    </td>
                    <td>
                      <span className="admin-pill admin-pill--info">{job.category_name || 'Umum'}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{job.employment_type}</td>
                    <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} strokeWidth={2} />
                        {job.location || 'Batam'}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-pill ${
                        job.status === 'published' ? 'admin-pill--success' :
                        job.status === 'draft' ? 'admin-pill--warning' : 'admin-pill--danger'
                      }`}>
                        {job.status === 'published' ? 'Tayang' : job.status === 'draft' ? 'Draf' : 'Tutup'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{job.created_by_name || 'HRD'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="admin-btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => handleOpenEdit(job)}
                        >
                          <Pencil size={12} strokeWidth={2} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="admin-btn-danger"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => handleDelete(job.id, job.title)}
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

      {/* Modal Buat / Edit Lowongan */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-box" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingJob ? 'Edit Informasi Lowongan' : 'Buat Lowongan Pekerjaan Baru'}
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
                {/* Title */}
                <div className="admin-form-group">
                  <label className="admin-label">Judul Posisi Lowongan</label>
                  <input
                    type="text"
                    className="admin-text-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Senior SMT Process Engineer / QA Inspector"
                    required
                  />
                </div>

                {/* Category & Employment Type & Status */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Kategori Departemen</label>
                    <select
                      className="admin-select"
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      required
                    >
                      <option value="">Pilih Departemen...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Tipe Pekerjaan</label>
                    <select
                      className="admin-select"
                      value={formData.employment_type}
                      onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Internship">Internship (Magang)</option>
                      <option value="Contract">Kontrak</option>
                      <option value="OJT">On-the-Job Training (OJT)</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Status Publikasi</label>
                    <select
                      className="admin-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="published">Tayang (Published)</option>
                      <option value="draft">Draf (Disimpan Dulu)</option>
                      <option value="closed">Ditutup (Closed)</option>
                    </select>
                  </div>
                </div>

                {/* Location & Form URL */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Lokasi Penempatan</label>
                    <input
                      type="text"
                      className="admin-text-input"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Contoh: Batam FTZ Plant / Jakarta Office"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">URL Formulir Lamaran (Opsional)</label>
                    <input
                      type="url"
                      className="admin-text-input"
                      value={formData.form_url}
                      onChange={(e) => setFormData({ ...formData, form_url: e.target.value })}
                      placeholder="https://forms.gle/xxxx (Google Form)"
                    />
                  </div>
                </div>

                {/* Language Switcher Tabs & Auto Translate Button */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--admin-card-bg, #111827)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--admin-border-color, #1e293b)',
                    margin: '16px 0 14px',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setModalLangTab('id')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        border: '1px solid',
                        cursor: 'pointer',
                        background: modalLangTab === 'id' ? '#000000' : 'transparent',
                        color: modalLangTab === 'id' ? '#ffffff' : '#94a3b8',
                        borderColor: modalLangTab === 'id' ? '#000000' : 'var(--admin-border-color, #334155)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      🇮🇩 Bahasa Indonesia (Utama)
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalLangTab('en')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        border: '1px solid',
                        cursor: 'pointer',
                        background: modalLangTab === 'en' ? '#000000' : 'transparent',
                        color: modalLangTab === 'en' ? '#ffffff' : '#94a3b8',
                        borderColor: modalLangTab === 'en' ? '#000000' : 'var(--admin-border-color, #334155)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      🇬🇧 English (Situs Global)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoTranslate}
                    disabled={translating}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      background: 'rgba(56, 189, 248, 0.12)',
                      color: '#38bdf8',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      cursor: translating ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Sparkles size={14} />
                    <span>{translating ? 'Menerjemahkan...' : 'Otomatis Translate ke English'}</span>
                  </button>
                </div>

                {modalLangTab === 'id' ? (
                  <>
                    {/* Title ID */}
                    <div className="admin-form-group">
                      <label className="admin-label">
                        Judul Posisi Lowongan (ID) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="admin-text-input"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Contoh: Senior SMT Process Engineer / QA Inspector"
                        required
                      />
                    </div>

                    {/* Description ID */}
                    <div className="admin-form-group">
                      <label className="admin-label">Ringkasan Pekerjaan (Overview - ID)</label>
                      <textarea
                        className="admin-textarea"
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Gambaran umum tanggung jawab posisi..."
                      />
                    </div>

                    {/* Responsibilities ID */}
                    <div className="admin-form-group">
                      <label className="admin-label">Tanggung Jawab Utama (Responsibilities - ID)</label>
                      <textarea
                        className="admin-textarea"
                        rows="3"
                        value={formData.responsibilities}
                        onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                        placeholder="• Mengoperasikan lini SMT Yamaha&#10;• Melakukan kalibrasi feeder..."
                      />
                    </div>

                    {/* Requirements ID */}
                    <div className="admin-form-group">
                      <label className="admin-label">Kualifikasi & Persyaratan (Requirements - ID)</label>
                      <textarea
                        className="admin-textarea"
                        rows="3"
                        value={formData.requirements}
                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                        placeholder="• Pendidikan min. D3/S1 Teknik Elektro&#10;• Pengalaman 2 tahun di industri manufaktur..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Title EN */}
                    <div className="admin-form-group">
                      <label className="admin-label">
                        Job Position Title (EN) <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>(Ditampilkan saat pengunjung memilih bahasa English)</span>
                      </label>
                      <input
                        type="text"
                        className="admin-text-input"
                        value={formData.title_en}
                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                        placeholder="e.g. Senior SMT Process Engineer / QA Inspector"
                      />
                    </div>

                    {/* Description EN */}
                    <div className="admin-form-group">
                      <label className="admin-label">Job Overview (EN)</label>
                      <textarea
                        className="admin-textarea"
                        rows="3"
                        value={formData.description_en}
                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                        placeholder="General overview of the position responsibilities..."
                      />
                    </div>

                    {/* Responsibilities EN */}
                    <div className="admin-form-group">
                      <label className="admin-label">Key Responsibilities (EN)</label>
                      <textarea
                        className="admin-textarea"
                        rows="3"
                        value={formData.responsibilities_en}
                        onChange={(e) => setFormData({ ...formData, responsibilities_en: e.target.value })}
                        placeholder="• Operate Yamaha SMT high-speed lines&#10;• Perform feeder calibration..."
                      />
                    </div>

                    {/* Requirements EN */}
                    <div className="admin-form-group">
                      <label className="admin-label">Qualifications & Requirements (EN)</label>
                      <textarea
                        className="admin-textarea"
                        rows="3"
                        value={formData.requirements_en}
                        onChange={(e) => setFormData({ ...formData, requirements_en: e.target.value })}
                        placeholder="• Min. Diploma / Bachelor's in Electrical Engineering&#10;• 2 years experience in manufacturing..."
                      />
                    </div>
                  </>
                )}
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
                  {submitting ? 'Menyimpan...' : (editingJob ? 'Perbarui Lowongan' : 'Publikasikan Lowongan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
