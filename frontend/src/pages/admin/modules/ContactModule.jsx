import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Globe, Save, ExternalLink } from 'lucide-react';
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
    maps_latitude: '1.1368003',
    maps_longitude: '104.0452514',
    maps_place_name: 'GLOBAL PHILSONIC TECHNOLOGIES',
    maps_url: '',
    maps_embed_url: '',
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
            maps_latitude: data.maps_latitude || '1.1368003',
            maps_longitude: data.maps_longitude || '104.0452514',
            maps_place_name: data.maps_place_name || 'GLOBAL PHILSONIC TECHNOLOGIES',
            maps_url: data.maps_url || '',
            maps_embed_url: data.maps_embed_url || '',
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

  const handleUpdateCoordinates = (lat, lng) => {
    const embed = `https://maps.google.com/maps?q=${lat},${lng}+(${encodeURIComponent(
      formData.maps_place_name || 'GLOBAL PHILSONIC TECHNOLOGIES'
    )})&t=m&z=17&ie=UTF8&iwloc=B&output=embed`;

    setFormData((prev) => ({
      ...prev,
      maps_latitude: lat,
      maps_longitude: lng,
      maps_embed_url: embed,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/admin/contact', formData);
      addToast(res.data?.message || 'Informasi kontak dan peta Google Maps berhasil disimpan!', 'success');
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  const currentEmbedUrl =
    formData.maps_embed_url ||
    `https://maps.google.com/maps?q=${formData.maps_latitude || '1.1368003'},${
      formData.maps_longitude || '104.0452514'
    }+(${encodeURIComponent(formData.maps_place_name || 'GLOBAL PHILSONIC TECHNOLOGIES')})&t=m&z=17&ie=UTF8&iwloc=B&output=embed`;

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
        <div className="admin-spinner" style={{ margin: '0 auto 12px' }} />
        <span>Memuat data kontak dan peta lokasi...</span>
      </div>
    );
  }

  return (
    <div className="admin-contact-module">
      <form onSubmit={handleSubmit}>
        {/* ── 1. INFORMASI KONTAK RESMI ── */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">
                <Phone size={18} />
                <span>Kontak & Saluran Komunikasi</span>
              </h2>
              <p className="admin-card-desc">
                Kelola nomor WhatsApp B2B, email resmi, telepon kantor, dan akun media sosial.
              </p>
            </div>
            <a
              href="/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn-secondary"
            >
              <span>Lihat Halaman Kontak</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-label">Email Resmi Sales & Engineering</label>
              <input
                type="email"
                name="email"
                className="admin-text-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@philsonic.co.id"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Nomor Telepon Kantor (Hunting)</label>
              <input
                type="text"
                name="phone"
                className="admin-text-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+62 778 480 8888"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Nomor WhatsApp Bisnis / B2B</label>
              <input
                type="text"
                name="whatsapp"
                className="admin-text-input"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="+62 811 7700 888"
              />
            </div>

            <div className="admin-form-group admin-form-group--full">
              <label className="admin-label">Alamat Fisik Pabrik Batam (FTZ)</label>
              <textarea
                name="address"
                className="admin-textarea"
                rows="2"
                value={formData.address}
                onChange={handleChange}
                placeholder="Cammo Industrial Park Blok B No. 8-10, Batam Center, Batam, Kepulauan Riau 29461 (Batam FTZ)"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">URL LinkedIn Perusahaan</label>
              <input
                type="url"
                name="linkedin"
                className="admin-text-input"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/pt-global-philsonic-technologies"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">URL Instagram Resmi</label>
              <input
                type="url"
                name="instagram"
                className="admin-text-input"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/philsonic.technologies"
              />
            </div>
          </div>
        </div>

        {/* ── 2. PETA LOKASI GOOGLE MAPS ── */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">
                <MapPin size={18} />
                <span>Pengaturan & Koordinat Google Maps</span>
              </h2>
              <p className="admin-card-desc">
                Konfigurasi titik koordinat GPS, nama penanda peta, dan URL sematan Google Maps yang tampil di halaman kontak.
              </p>
            </div>
          </div>

          <div className="admin-form-grid" style={{ marginBottom: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Nama Tempat / Pin Label</label>
              <input
                type="text"
                name="maps_place_name"
                className="admin-text-input"
                value={formData.maps_place_name}
                onChange={handleChange}
                placeholder="GLOBAL PHILSONIC TECHNOLOGIES"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Latitude (Garis Lintang)</label>
              <input
                type="text"
                name="maps_latitude"
                className="admin-text-input"
                value={formData.maps_latitude}
                onChange={(e) => handleUpdateCoordinates(e.target.value, formData.maps_longitude)}
                placeholder="1.1368003"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Longitude (Garis Bujur)</label>
              <input
                type="text"
                name="maps_longitude"
                className="admin-text-input"
                value={formData.maps_longitude}
                onChange={(e) => handleUpdateCoordinates(formData.maps_latitude, e.target.value)}
                placeholder="104.0452514"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Tautan Buka di Google Maps</label>
              <input
                type="url"
                name="maps_url"
                className="admin-text-input"
                value={formData.maps_url}
                onChange={handleChange}
                placeholder="https://www.google.com/maps/place/..."
              />
            </div>

            <div className="admin-form-group admin-form-group--full">
              <label className="admin-label">
                <span>URL Embed Iframe Google Maps (Opsional / Override)</span>
                <span className="admin-label-hint">(Otomatis digenerate bila dibiarkan kosong)</span>
              </label>
              <input
                type="text"
                name="maps_embed_url"
                className="admin-text-input"
                value={formData.maps_embed_url}
                onChange={handleChange}
                placeholder="https://maps.google.com/maps?q=...&output=embed"
              />
            </div>
          </div>

          {/* Interactive Map Live Preview */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--adm-muted)', marginBottom: '8px' }}>
              Pratinjau Langsung Peta Google Maps:
            </div>
            <div
              style={{
                width: '100%',
                height: '280px',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid var(--adm-border)',
                background: '#070d18',
              }}
            >
              <iframe
                title="Google Maps Preview"
                src={currentEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--adm-border)' }}>
            <button
              type="submit"
              className="admin-btn-primary"
              disabled={saving}
            >
              <Save size={14} />
              <span>{saving ? 'Menyimpan...' : 'Simpan Kontak & Peta'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
