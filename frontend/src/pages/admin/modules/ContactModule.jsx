import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Globe, Save, ExternalLink, Sliders } from 'lucide-react';
import api, { extractErrorMessage } from '../../../lib/api';
import { translateContent } from '../../../lib/translator';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import LanguageTabControl from '../../../components/admin/LanguageTabControl';

export default function ContactModule() {
  const { addToast } = useAdminAuth();
  const [activeSection, setActiveSection] = useState('header');
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [translatingKey, setTranslatingKey] = useState(null);

  const [langMap, setLangMap] = useState({
    header: 'id',
    channels: 'id',
  });

  const setSectionLang = (sec, lang) => {
    setLangMap((prev) => ({ ...prev, [sec]: lang }));
  };

  // ─── 1. HEADER STATE ───
  const [headerData, setHeaderData] = useState({
    id: {
      title: 'Hubungi Sales Engineering & Konsultasi Manufaktur Batam',
      subtitle: 'Diskusikan kebutuhan proyek perakitan SMT, integrasi sistem otomasi, atau penjadwalan audit pabrik di Batam Free Trade Zone.',
      badgeText: 'Respons Cepat <24 Jam Kerja B2B',
    },
    en: {
      title: 'Contact Sales Engineering & Manufacturing Consultation Batam',
      subtitle: 'Discuss your SMT assembly project, factory automation integration, or schedule an on-site factory audit in Batam Free Trade Zone.',
      badgeText: 'Prompt B2B Response <24 Business Hours',
    },
  });

  // ─── 2. CONTACT DETAILS & SOCIALS STATE ───
  const [contactData, setContactData] = useState({
    email: 'sales@globalphilsonic.com',
    phone: '+62 778 408 8888',
    whatsapp: '+62 811 7700 888',
    address: 'Batam Industrial Park, Jl. Mukakuning No. 12, Kawasan Perdagangan Bebas Batam, Kepulauan Riau 29433, Indonesia',
    address_en: 'Batam Industrial Park, Mukakuning, Batam Free Trade Zone, Riau Islands 29433, Indonesia',
    instagram: 'https://instagram.com/globalphilsonic',
    linkedin: 'https://linkedin.com/company/global-philsonic-technologies',
    maps_latitude: '1.1368003',
    maps_longitude: '104.0452514',
    maps_place_name: 'GLOBAL PHILSONIC TECHNOLOGIES',
    maps_url: 'https://www.google.com/maps/place/GLOBAL+PHILSONIC+TECHNOLOGIES/@1.137263,104.045233,435m/data=!3m1!1e3!4m6!3m5!1s0x31d98900364038b5:0xf424af624a151322!8m2!3d1.1368003!4d104.0452514!16s%2Fg%2F11z007pkw1?hl=id',
    maps_embed_url: '',
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchContact() {
      try {
        setLoading(true);
        const [contactRes, headRes] = await Promise.allSettled([
          api.get('/public/contact'),
          api.get('/public/site-settings/contact_header'),
        ]);

        if (isMounted) {
          if (contactRes.status === 'fulfilled' && contactRes.value.data?.data) {
            const data = contactRes.value.data.data;
            setContactData((prev) => ({
              ...prev,
              email: data.email || prev.email,
              phone: data.phone || prev.phone,
              whatsapp: data.whatsapp || prev.whatsapp,
              address: data.address || prev.address,
              address_en: data.address_en || prev.address_en,
              instagram: data.instagram || prev.instagram,
              linkedin: data.linkedin || prev.linkedin,
              maps_latitude: data.maps_latitude || '1.1368003',
              maps_longitude: data.maps_longitude || '104.0452514',
              maps_place_name: data.maps_place_name || 'GLOBAL PHILSONIC TECHNOLOGIES',
              maps_url: data.maps_url || prev.maps_url,
              maps_embed_url: data.maps_embed_url || '',
            }));
          }

          if (headRes.status === 'fulfilled' && headRes.value.data?.data) {
            const d = headRes.value.data.data;
            if (d.id && d.en) {
              setHeaderData(d);
            } else if (d.id) {
              setHeaderData((prev) => ({ ...prev, id: d.id, en: d.en || prev.en }));
            }
          }
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

  const handleSaveHeader = async () => {
    setSavingKey('contact_header');
    try {
      await api.put('/admin/site-settings/contact_header', headerData);
      addToast('Header halaman kontak berhasil disimpan!', 'success');
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSavingKey(null);
    }
  };

  const handleSaveContactDetails = async () => {
    setSavingKey('contact_details');
    try {
      await api.put('/admin/contact', contactData);
      addToast('Informasi kontak dan Google Maps berhasil disimpan!', 'success');
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSavingKey(null);
    }
  };

  const handleAutoTranslateHeader = async () => {
    setTranslatingKey('header');
    try {
      addToast('Menerjemahkan teks dari Bahasa Indonesia ke English...', 'info');
      const translatedEn = await translateContent(headerData.id);
      setHeaderData((prev) => ({ ...prev, en: translatedEn }));
      setSectionLang('header', 'en');
      addToast('Terjemahan selesai! Teks Bahasa Inggris telah terisi dan dapat Anda edit langsung.', 'success');
    } catch (err) {
      addToast('Gagal menerjemahkan: ' + extractErrorMessage(err), 'error');
    } finally {
      setTranslatingKey(null);
    }
  };

  const handleAutoTranslateAddress = async () => {
    setTranslatingKey('channels');
    try {
      addToast('Menerjemahkan alamat pabrik ke English...', 'info');
      const translated = await translateContent(contactData.address);
      setContactData((prev) => ({ ...prev, address_en: translated }));
      setSectionLang('channels', 'en');
      addToast('Terjemahan alamat selesai!', 'success');
    } catch (err) {
      addToast('Gagal menerjemahkan alamat: ' + extractErrorMessage(err), 'error');
    } finally {
      setTranslatingKey(null);
    }
  };

  const handleUpdateCoordinates = (lat, lng) => {
    const embed = `https://maps.google.com/maps?q=${lat},${lng}+(${encodeURIComponent(
      contactData.maps_place_name || 'GLOBAL PHILSONIC TECHNOLOGIES'
    )})&t=m&z=17&ie=UTF8&iwloc=B&output=embed`;

    setContactData((prev) => ({
      ...prev,
      maps_latitude: lat,
      maps_longitude: lng,
      maps_embed_url: embed,
    }));
  };

  const currentEmbedUrl =
    contactData.maps_embed_url ||
    `https://maps.google.com/maps?q=${contactData.maps_latitude || '1.1368003'},${
      contactData.maps_longitude || '104.0452514'
    }+(${encodeURIComponent(contactData.maps_place_name || 'GLOBAL PHILSONIC TECHNOLOGIES')})&t=m&z=17&ie=UTF8&iwloc=B&output=embed`;

  if (loading) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="admin-spinner" style={{ width: 28, height: 28, margin: '0 auto 1rem' }} />
        <p style={{ color: '#94a3b8' }}>Memuat konfigurasi kontak & Google Maps...</p>
      </div>
    );
  }

  const sectionsList = [
    { id: 'header', label: '1. Header Halaman Kontak', icon: Sliders },
    { id: 'channels', label: '2. Saluran Kontak & Alamat', icon: Phone },
    { id: 'maps', label: '3. Lokasi Google Maps Batam', icon: MapPin },
  ];

  const currentHeadLang = langMap.header;
  const currentHead = headerData[currentHeadLang] || headerData.id;

  return (
    <div className="admin-module">
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: '0.35rem' }}>
          Manajemen Konten Halaman Kontak & Google Maps
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          Kelola judul halaman, nomor telepon B2B, WhatsApp sales engineering, alamat pabrik bilingual, dan titik koordinat peta lokasi Batam.
        </p>
      </div>

      <div className="admin-section-nav">
        {sectionsList.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              className={`admin-section-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveSection(sec.id)}
            >
              <Icon size={16} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── SECTION 1: HEADER ── */}
      {activeSection === 'header' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 1: Header Halaman Kontak</h3>
              <p className="admin-card-subtitle">
                Atur judul halaman, subjudul ajakan konsultasi, dan teks jaminan respons cepat.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'contact_header'}
              onClick={handleSaveHeader}
            >
              <Save size={16} />
              <span>{savingKey === 'contact_header' ? 'Menyimpan...' : 'Simpan Header'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentHeadLang}
            onSelectLang={(lang) => setSectionLang('header', lang)}
            onTranslate={handleAutoTranslateHeader}
            isTranslating={translatingKey === 'header'}
          />

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Judul Utama Halaman ({currentHeadLang.toUpperCase()})</label>
              <input
                type="text"
                className="admin-input"
                value={currentHead.title || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setHeaderData((prev) => ({
                    ...prev,
                    [currentHeadLang]: { ...prev[currentHeadLang], title: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Subjudul Penjelasan ({currentHeadLang.toUpperCase()})</label>
              <textarea
                rows={3}
                className="admin-textarea"
                value={currentHead.subtitle || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setHeaderData((prev) => ({
                    ...prev,
                    [currentHeadLang]: { ...prev[currentHeadLang], subtitle: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Teks Badge ({currentHeadLang.toUpperCase()})</label>
              <input
                type="text"
                className="admin-input"
                value={currentHead.badgeText || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setHeaderData((prev) => ({
                    ...prev,
                    [currentHeadLang]: { ...prev[currentHeadLang], badgeText: val },
                  }));
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 2: CHANNELS & ADDRESS ── */}
      {activeSection === 'channels' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 2: Informasi Kantor & Saluran Komunikasi</h3>
              <p className="admin-card-subtitle">
                Atur alamat fisik pabrik Batam FTZ, email resmi, sambungan telepon, WhatsApp, dan sosial media.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'contact_details'}
              onClick={handleSaveContactDetails}
            >
              <Save size={16} />
              <span>{savingKey === 'contact_details' ? 'Menyimpan...' : 'Simpan Informasi Kontak'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={langMap.channels}
            onSelectLang={(lang) => setSectionLang('channels', lang)}
            onTranslate={handleAutoTranslateAddress}
            isTranslating={translatingKey === 'channels'}
          />

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-grid admin-form-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Email Penawaran Resmi (RFQ)</label>
                <input
                  type="email"
                  className="admin-input"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Nomor Telepon Kantor / Hunting</label>
                <input
                  type="text"
                  className="admin-input"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-grid admin-form-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Nomor WhatsApp B2B Sales Engineering</label>
                <input
                  type="text"
                  className="admin-input"
                  value={contactData.whatsapp}
                  onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Akun LinkedIn Resmi</label>
                <input
                  type="url"
                  className="admin-input"
                  value={contactData.linkedin}
                  onChange={(e) => setContactData({ ...contactData, linkedin: e.target.value })}
                />
              </div>
            </div>

            {/* Address based on selected lang */}
            <div className="admin-form-group">
              <label className="admin-label">
                Alamat Lengkap Pabrik ({langMap.channels.toUpperCase()})
              </label>
              {langMap.channels === 'id' ? (
                <textarea
                  rows={3}
                  className="admin-textarea"
                  value={contactData.address}
                  onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
                  placeholder="Alamat dalam Bahasa Indonesia..."
                />
              ) : (
                <textarea
                  rows={3}
                  className="admin-textarea"
                  value={contactData.address_en}
                  onChange={(e) => setContactData({ ...contactData, address_en: e.target.value })}
                  placeholder="Address in English..."
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 3: GOOGLE MAPS ── */}
      {activeSection === 'maps' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 3: Titik Lokasi Google Maps Batam</h3>
              <p className="admin-card-subtitle">
                Atur koordinat GPS, nama lokasi, URL link Google Maps, dan pratinjau live embed iframe.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'contact_details'}
              onClick={handleSaveContactDetails}
            >
              <Save size={16} />
              <span>{savingKey === 'contact_details' ? 'Menyimpan...' : 'Simpan Koordinat Peta'}</span>
            </button>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Nama Tempat Google Maps</label>
              <input
                type="text"
                className="admin-input"
                value={contactData.maps_place_name}
                onChange={(e) => setContactData({ ...contactData, maps_place_name: e.target.value })}
              />
            </div>

            <div className="admin-form-grid admin-form-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Latitude GPS</label>
                <input
                  type="text"
                  className="admin-input"
                  value={contactData.maps_latitude}
                  onChange={(e) => {
                    const lat = e.target.value;
                    handleUpdateCoordinates(lat, contactData.maps_longitude);
                  }}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Longitude GPS</label>
                <input
                  type="text"
                  className="admin-input"
                  value={contactData.maps_longitude}
                  onChange={(e) => {
                    const lng = e.target.value;
                    handleUpdateCoordinates(contactData.maps_latitude, lng);
                  }}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Link Langsung Google Maps</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="url"
                  className="admin-input"
                  value={contactData.maps_url}
                  onChange={(e) => setContactData({ ...contactData, maps_url: e.target.value })}
                  style={{ flex: 1 }}
                />
                {contactData.maps_url && (
                  <a
                    href={contactData.maps_url}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-btn admin-btn-secondary"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <ExternalLink size={15} />
                    <span>Uji Buka</span>
                  </a>
                )}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <label className="admin-label" style={{ marginBottom: 8, display: 'block' }}>
                Pratinjau Peta Google Maps Live
              </label>
              <div
                style={{
                  height: 320,
                  width: '100%',
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid #1e293b',
                  background: '#0b111d',
                }}
              >
                <iframe
                  title="Google Maps Location Preview"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={currentEmbedUrl}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
