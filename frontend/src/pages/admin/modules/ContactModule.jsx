import { useState, useEffect } from 'react';
import api, { extractErrorMessage } from '../../../lib/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export default function ContactModule() {
  const { addToast } = useAdminAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    instagram: '',
    linkedin: '',
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchContact() {
      try {
        setLoading(true);
        const res = await api.get('/public/contact');
        const data = res.data?.data;
        if (data && isMounted) {
          setFormData({
            email: data.email || '',
            phone: data.phone || '',
            whatsapp: data.whatsapp || '',
            address: data.address || '',
            instagram: data.instagram || '',
            linkedin: data.linkedin || '',
          });
        }
      } catch (err) {
        addToast(extractErrorMessage(err), 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchContact();
    return () => { isMounted = false; };
  }, [addToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/admin/contact', formData);
      addToast(res.data?.message || 'Informasi kontak berhasil diperbarui!', 'success');
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
        <span>Memuat data kontak perusahaan...</span>
      </div>
    );
  }

  return (
    <div className="admin-contact-module">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">📞 Manajemen Kontak, Alamat & Kanal Komunikasi</h2>
            <p className="admin-card-desc">
              Perbarui nomor WhatsApp sales / rekrutmen, email resmi, alamat pabrik / head office, dan tautan sosial media.
            </p>
          </div>
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            Lihat di Halaman Kontak ↗
          </a>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            {/* Email */}
            <div className="admin-form-group">
              <label className="admin-label">
                <span>Email Resmi Perusahaan / Karir</span>
              </label>
              <input
                type="email"
                name="email"
                className="admin-text-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="recruitment@isa.co.id"
                required
              />
            </div>

            {/* Phone */}
            <div className="admin-form-group">
              <label className="admin-label">
                <span>Nomor Telepon Kantor / Hunting</span>
              </label>
              <input
                type="text"
                name="phone"
                className="admin-text-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+62 21 5420 5555"
              />
            </div>

            {/* WhatsApp */}
            <div className="admin-form-group">
              <label className="admin-label">
                <span>Nomor WhatsApp Bisnis / B2B</span>
                <span className="admin-label-hint">(Format: +62 812 xxxx xxxx)</span>
              </label>
              <input
                type="text"
                name="whatsapp"
                className="admin-text-input"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+62 811 7700 888"
              />
            </div>

            {/* Physical Address */}
            <div className="admin-form-group admin-form-group--full">
              <label className="admin-label">
                <span>Alamat Kantor Pusat / Pabrik Manufaktur Batam</span>
                <span className="admin-label-hint">(Tampil pada footer dan halaman kontak)</span>
              </label>
              <textarea
                name="address"
                className="admin-textarea"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ruko Gading Boulevard Block 8B No. 12-15 / Kawasan Industri Batam Center..."
                required
              />
            </div>

            {/* LinkedIn */}
            <div className="admin-form-group">
              <label className="admin-label">
                <span>URL Profil LinkedIn Perusahaan</span>
              </label>
              <input
                type="url"
                name="linkedin"
                className="admin-text-input"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/pt-intersis-sejahtera-abadi"
              />
            </div>

            {/* Instagram */}
            <div className="admin-form-group">
              <label className="admin-label">
                <span>URL Profil Instagram Resmi</span>
              </label>
              <input
                type="url"
                name="instagram"
                className="admin-text-input"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/isa_career_official"
              />
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
                  <span>Simpan Perubahan Kontak</span>
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
