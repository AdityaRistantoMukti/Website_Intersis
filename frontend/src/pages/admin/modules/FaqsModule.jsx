import { useState, useEffect } from 'react';
import api, { extractErrorMessage } from '../../../lib/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import {
  HelpCircle,
  Plus,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';

export default function FaqsModule() {
  const { addToast } = useAdminAuth();

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sortOrder, setSortOrder] = useState(1);
  const [status, setStatus] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/faqs');
      setFaqs(res.data?.data || []);
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setQuestion('');
    setAnswer('');
    setSortOrder((faqs.length + 1) * 10);
    setStatus(1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (f) => {
    setEditingItem(f);
    setQuestion(f.question || '');
    setAnswer(f.answer || '');
    setSortOrder(f.sort_order ?? 0);
    setStatus(f.status ?? 1);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, qText) => {
    if (!window.confirm(`Yakin ingin menghapus pertanyaan FAQ '${qText}'?`)) return;
    try {
      await api.delete(`/admin/faqs/${id}`);
      addToast('Pertanyaan FAQ berhasil dihapus.', 'success');
      fetchFaqs();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { question, answer, sort_order: sortOrder, status };
      if (editingItem) {
        await api.put(`/admin/faqs/${editingItem.id}`, payload);
        addToast('FAQ berhasil diperbarui!', 'success');
      } else {
        await api.post('/admin/faqs', payload);
        addToast('FAQ baru berhasil ditambahkan!', 'success');
      }
      setIsModalOpen(false);
      fetchFaqs();
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-faqs-module">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={20} strokeWidth={2} />
              <span>Tanya Jawab Umum (FAQ Management)</span>
            </h2>
            <p className="admin-card-desc">
              Kelola daftar tanya jawab yang sering diajukan calon pelamar atau calon mitra bisnis di halaman publik.
            </p>
          </div>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenAdd}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} strokeWidth={2} />
            <span>Tambah FAQ Baru</span>
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div className="admin-spinner" style={{ margin: '0 auto 12px' }} />
            <span>Memuat data FAQ...</span>
          </div>
        ) : faqs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            Belum ada data FAQ.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Urutan</th>
                  <th>Pertanyaan (Question)</th>
                  <th>Jawaban (Answer)</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', width: '130px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((f) => (
                  <tr key={f.id}>
                    <td style={{ color: '#2dd4bf', fontWeight: 700 }}>#{f.sort_order}</td>
                    <td style={{ fontWeight: 600, color: 'var(--admin-text-main)', maxWidth: '300px' }}>
                      {f.question}
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: '400px' }}>
                      {f.answer}
                    </td>
                    <td>
                      <span className={`admin-pill ${f.status ? 'admin-pill--success' : 'admin-pill--danger'}`}>
                        {f.status ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="admin-btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => handleOpenEdit(f)}
                        >
                          <Pencil size={12} strokeWidth={2} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="admin-btn-danger"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => handleDelete(f.id, f.question)}
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
                {editingItem ? 'Edit FAQ' : 'Tambah FAQ Baru'}
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
                  <label className="admin-label">Pertanyaan (Question)</label>
                  <input
                    type="text"
                    className="admin-text-input"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Contoh: Berapa lama estimasi lead time proses seleksi?"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Jawaban (Answer)</label>
                  <textarea
                    className="admin-textarea"
                    rows="4"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Tuliskan jawaban yang jelas dan informatif..."
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Urutan Tampil (Sort)</label>
                    <input
                      type="number"
                      className="admin-text-input"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Status Tampil</label>
                    <select
                      className="admin-select"
                      value={status}
                      onChange={(e) => setStatus(parseInt(e.target.value))}
                    >
                      <option value={1}>Aktif (Tampil)</option>
                      <option value={0}>Nonaktif (Disembunyikan)</option>
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
                  {submitting ? 'Menyimpan...' : (editingItem ? 'Perbarui FAQ' : 'Simpan FAQ')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
