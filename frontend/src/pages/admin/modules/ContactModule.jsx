import { useState, useEffect, useMemo } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Save,
  ExternalLink,
  Sliders,
  Send,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Search,
  X,
  ShieldCheck,
  Sparkles,
  Inbox,
  MessageSquareQuote,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  Zap,
  Key,
} from 'lucide-react';
import api, { extractErrorMessage } from '../../../lib/api';
import { translateContent } from '../../../lib/translator';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import LanguageTabControl from '../../../components/admin/LanguageTabControl';

const INQUIRY_LABELS = {
  'smt-pcba': 'Perakitan SMT & PCBA Presisi',
  'box-build': 'Box-Build & Turnkey Systems',
  'testing-fixtures': 'Jig Uji Otomatis ICT / FCT',
  'oem-odm': 'Layanan OEM / ODM Manufaktur',
  'factory-audit': 'Kunjungan & Audit Fasilitas Batam',
  'consultation': 'Konsultasi Engineering Umum',
};

const VOLUME_LABELS = {
  'pilot': 'Prototipe / Pilot Run (< 1.000 unit/bln)',
  'medium': 'Volume Menengah (1.000 - 10.000 unit/bln)',
  'mass': 'Produksi Massal (> 10.000 unit/bln)',
  'high': 'Volume Sangat Tinggi (> 50.000 unit/bln)',
  'tbd': 'Konsultasi / TBD',
};

const STATUS_CONFIG = {
  new: { label: 'Baru (New)', bg: 'rgba(45, 212, 191, 0.15)', color: '#0d9488', border: 'rgba(45, 212, 191, 0.4)' },
  contacted: { label: 'Dihubungi (Contacted)', bg: 'rgba(245, 158, 11, 0.15)', color: '#d97706', border: 'rgba(245, 158, 11, 0.4)' },
  quoted: { label: 'Penawaran Diberikan (Quoted)', bg: 'rgba(168, 85, 247, 0.15)', color: '#9333ea', border: 'rgba(168, 85, 247, 0.4)' },
  closed: { label: 'Selesai / Deal (Closed)', bg: 'rgba(34, 197, 94, 0.15)', color: '#16a34a', border: 'rgba(34, 197, 94, 0.4)' },
  spam: { label: 'Spam / Ditolak', bg: 'rgba(100, 116, 139, 0.15)', color: '#64748b', border: 'rgba(100, 116, 139, 0.4)' },
};

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

  // ─── 3. EMAIL NOTIFICATION & SMTP CONFIG STATE ───
  const [emailSettings, setEmailSettings] = useState({
    enabled: true,
    provider: 'resend',
    resend_api_key: '',
    resend_from: 'PT. Global Philsonic Technologies <onboarding@resend.dev>',
    smtp_host: '',
    smtp_port: 587,
    smtp_secure: false,
    smtp_user: '',
    smtp_pass: '',
    sender_name: 'PT. Global Philsonic Technologies',
    sender_email: 'noreply@globalphilsonic.com',
    notify_emails: 'sales@globalphilsonic.com',
    auto_reply_enabled: true,
    auto_reply_subject: 'Konfirmasi Penerimaan Permintaan Penawaran (RFQ) - PT. Global Philsonic Technologies',
    auto_reply_greeting: 'Terima kasih telah mengajukan permintaan penawaran harga (RFQ) melalui portal resmi PT. Global Philsonic Technologies. Permohonan Anda telah tercatat dalam sistem kami.',
    auto_reply_commitment: 'Komitmen Respons Cepat: Tim Engineering & B2B Sales kami saat ini sedang meninjau parameter teknis Anda dan akan menghubungi Anda kembali dalam waktu maksimal 1 x 24 jam kerja.',
    auto_reply_footer_note: 'Jika Anda memiliki lampiran berkas teknis (Gerber Files, BOM, diagram 3D CAD), Anda dapat langsung membalas email ini dengan melampirkan dokumen terkait agar kami dapat mempercepat penyusunan estimasi biaya (Cost Estimation).',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showResendApiKey, setShowResendApiKey] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // ─── 4. RFQ INQUIRIES & LEADS STATE ───
  const [rfqList, setRfqList] = useState([]);
  const [rfqLoading, setRfqLoading] = useState(false);
  const [rfqStatusFilter, setRfqStatusFilter] = useState('all');
  const [rfqSearch, setRfqSearch] = useState('');
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [rfqNoteInput, setRfqNoteInput] = useState('');
  const [updatingRfqId, setUpdatingRfqId] = useState(null);
  const [savingNote, setSavingNote] = useState(false);

  // ─── 5. CONFIRMATION MODAL DELETE STATE ───
  const [deleteConfirmRfq, setDeleteConfirmRfq] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  // ─── 6. SMTP SETUP GUIDE MODAL STATE ───
  const [showSmtpGuideModal, setShowSmtpGuideModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        setLoading(true);
        const [contactRes, headRes, emailRes, rfqRes] = await Promise.allSettled([
          api.get('/public/contact'),
          api.get('/public/site-settings/contact_header'),
          api.get('/public/site-settings/email_smtp_settings'),
          api.get('/admin/rfq'),
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

          if (emailRes.status === 'fulfilled' && emailRes.value.data?.data) {
            const es = emailRes.value.data.data;
            setEmailSettings((prev) => ({
              ...prev,
              ...es,
              provider: es.provider || (es.resend_api_key ? 'resend' : 'resend'),
            }));
            if (es.notify_emails && !testEmailAddress) {
              setTestEmailAddress(es.notify_emails.split(',')[0].trim());
            }
          }

          if (rfqRes.status === 'fulfilled' && rfqRes.value.data?.data) {
            setRfqList(rfqRes.value.data.data);
          }
        }
      } catch (err) {
        addToast(extractErrorMessage(err), 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
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

  const handleSaveEmailSettings = async () => {
    setSavingKey('email_smtp_settings');
    try {
      const sanitizedSettings = {
        ...emailSettings,
        provider: emailSettings.provider || 'resend',
        resend_api_key: (emailSettings.resend_api_key || '').trim(),
        resend_from: (emailSettings.resend_from || '').trim(),
        smtp_pass: (emailSettings.smtp_pass || '').replace(/\s+/g, ''),
        smtp_user: (emailSettings.smtp_user || '').trim(),
        smtp_host: (emailSettings.smtp_host || '').trim(),
      };
      await api.put('/admin/site-settings/email_smtp_settings', sanitizedSettings);
      setEmailSettings(sanitizedSettings);
      addToast('Pengaturan notifikasi email dan provider berhasil disimpan!', 'success');
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSavingKey(null);
    }
  };

  const handleTestEmail = async (e) => {
    e.preventDefault();
    if (!testEmailAddress.trim()) {
      addToast('Harap masukkan alamat email tujuan untuk uji coba.', 'error');
      return;
    }
    setTestingEmail(true);
    setTestResult(null);
    try {
      const sanitizedConfig = {
        ...emailSettings,
        provider: emailSettings.provider || 'resend',
        resend_api_key: (emailSettings.resend_api_key || '').trim(),
        resend_from: (emailSettings.resend_from || '').trim(),
        smtp_pass: (emailSettings.smtp_pass || '').replace(/\s+/g, ''),
        smtp_user: (emailSettings.smtp_user || '').trim(),
        smtp_host: (emailSettings.smtp_host || '').trim(),
      };
      const res = await api.post('/admin/email/test', {
        targetEmail: testEmailAddress.trim(),
        config: sanitizedConfig,
      }, { timeout: 25000 });
      setTestResult({
        success: true,
        message: res.data?.message || 'Email uji coba berhasil dikirimkan!',
      });
      addToast('Email uji coba berhasil dikirim! Silakan periksa kotak masuk/spam Anda.', 'success');
    } catch (err) {
      const errMsg = extractErrorMessage(err);
      setTestResult({
        success: false,
        message: errMsg,
      });
      addToast(`Gagal mengirim email: ${errMsg}`, 'error');
    } finally {
      setTestingEmail(false);
    }
  };

  const refreshRfqs = async () => {
    setRfqLoading(true);
    try {
      const res = await api.get('/admin/rfq');
      setRfqList(res.data?.data || []);
      addToast('Daftar permohonan RFQ diperbarui.', 'info');
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setRfqLoading(false);
    }
  };

  const handleUpdateRfqStatus = async (id, newStatus) => {
    setUpdatingRfqId(id);
    try {
      await api.patch(`/admin/rfq/${id}`, { status: newStatus });
      setRfqList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (selectedRfq && selectedRfq.id === id) {
        setSelectedRfq((prev) => ({ ...prev, status: newStatus }));
      }
      addToast(`Status RFQ #${id} berhasil diubah ke ${STATUS_CONFIG[newStatus]?.label || newStatus}.`, 'success');
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setUpdatingRfqId(null);
    }
  };

  const handleSaveRfqNote = async (id) => {
    setSavingNote(true);
    try {
      await api.patch(`/admin/rfq/${id}`, { notes: rfqNoteInput });
      setRfqList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, notes: rfqNoteInput } : item))
      );
      if (selectedRfq && selectedRfq.id === id) {
        setSelectedRfq((prev) => ({ ...prev, notes: rfqNoteInput }));
      }
      addToast('Catatan internal RFQ berhasil disimpan.', 'success');
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSavingNote(false);
    }
  };

  const handleExecuteDeleteRfq = async (id) => {
    setDeletingLoading(true);
    try {
      await api.delete(`/admin/rfq/${id}`);
      setRfqList((prev) => prev.filter((item) => item.id !== id));
      if (selectedRfq && selectedRfq.id === id) {
        setSelectedRfq(null);
      }
      setDeleteConfirmRfq(null);
      addToast(`Permohonan RFQ #${id} berhasil dihapus.`, 'success');
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setDeletingLoading(false);
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
    `https://maps.google.com/maps?q=${contactData.maps_latitude || '1.1368003'},${contactData.maps_longitude || '104.0452514'
    }+(${encodeURIComponent(contactData.maps_place_name || 'GLOBAL PHILSONIC TECHNOLOGIES')})&t=m&z=17&ie=UTF8&iwloc=B&output=embed`;

  // Filtered RFQs list
  const filteredRfqs = useMemo(() => {
    return rfqList.filter((item) => {
      const matchStatus = rfqStatusFilter === 'all' || (item.status || 'new') === rfqStatusFilter;
      const searchLower = rfqSearch.toLowerCase().trim();
      const matchSearch =
        !searchLower ||
        (item.full_name || '').toLowerCase().includes(searchLower) ||
        (item.company_name || '').toLowerCase().includes(searchLower) ||
        (item.corporate_email || '').toLowerCase().includes(searchLower) ||
        (item.phone || '').includes(searchLower);

      return matchStatus && matchSearch;
    });
  }, [rfqList, rfqStatusFilter, rfqSearch]);

  const rfqStats = useMemo(() => {
    const total = rfqList.length;
    const newCount = rfqList.filter((r) => (r.status || 'new') === 'new').length;
    const contactedCount = rfqList.filter((r) => r.status === 'contacted').length;
    const quotedCount = rfqList.filter((r) => r.status === 'quoted').length;
    const closedCount = rfqList.filter((r) => r.status === 'closed').length;
    const spamCount = rfqList.filter((r) => r.status === 'spam').length;
    return { total, newCount, contactedCount, quotedCount, closedCount, spamCount };
  }, [rfqList]);

  if (loading) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="admin-spinner" style={{ width: 28, height: 28, margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--adm-muted)' }}>Memuat konfigurasi kontak & Google Maps...</p>
      </div>
    );
  }

  const sectionsList = [
    { id: 'header', label: '1. Header Halaman Kontak', icon: Sliders },
    { id: 'channels', label: '2. Saluran Kontak & Alamat', icon: Phone },
    { id: 'maps', label: '3. Lokasi Google Maps Batam', icon: MapPin },
    { id: 'email_rfq', label: '4. Notifikasi Email & Kelola RFQ', icon: Mail, badge: rfqStats.newCount > 0 ? rfqStats.newCount : null },
  ];

  const currentHeadLang = langMap.header;
  const currentHead = headerData[currentHeadLang] || headerData.id;

  const filterTabs = [
    {
      id: 'all',
      label: 'Semua',
      count: rfqStats.total,
      activeBg: 'var(--adm-accent)',
      activeColor: 'var(--adm-accent-text)',
      activeBorder: 'var(--adm-accent)',
      inactiveBg: 'var(--adm-card-inner)',
      inactiveColor: 'var(--adm-text)',
      inactiveBorder: 'var(--adm-border-visible)',
      badgeBg: 'var(--adm-border)',
      badgeColor: 'var(--adm-text)',
    },
    {
      id: 'new',
      label: 'Baru (New)',
      count: rfqStats.newCount,
      activeBg: '#0d9488',
      activeColor: '#ffffff',
      activeBorder: '#0f766e',
      inactiveBg: 'rgba(13, 148, 136, 0.1)',
      inactiveColor: '#0d9488',
      inactiveBorder: 'rgba(13, 148, 136, 0.35)',
      badgeBg: 'rgba(13, 148, 136, 0.2)',
      badgeColor: '#0d9488',
    },
    {
      id: 'contacted',
      label: 'Dihubungi',
      count: rfqStats.contactedCount,
      activeBg: '#d97706',
      activeColor: '#ffffff',
      activeBorder: '#b45309',
      inactiveBg: 'rgba(217, 119, 6, 0.1)',
      inactiveColor: '#d97706',
      inactiveBorder: 'rgba(217, 119, 6, 0.35)',
      badgeBg: 'rgba(217, 119, 6, 0.2)',
      badgeColor: '#d97706',
    },
    {
      id: 'quoted',
      label: 'Penawaran Diberikan',
      count: rfqStats.quotedCount,
      activeBg: '#7c3aed',
      activeColor: '#ffffff',
      activeBorder: '#6d28d9',
      inactiveBg: 'rgba(124, 58, 237, 0.1)',
      inactiveColor: '#7c3aed',
      inactiveBorder: 'rgba(124, 58, 237, 0.35)',
      badgeBg: 'rgba(124, 58, 237, 0.2)',
      badgeColor: '#7c3aed',
    },
    {
      id: 'closed',
      label: 'Selesai / Deal',
      count: rfqStats.closedCount,
      activeBg: '#16a34a',
      activeColor: '#ffffff',
      activeBorder: '#15803d',
      inactiveBg: 'rgba(22, 163, 74, 0.1)',
      inactiveColor: '#16a34a',
      inactiveBorder: 'rgba(22, 163, 74, 0.35)',
      badgeBg: 'rgba(22, 163, 74, 0.2)',
      badgeColor: '#16a34a',
    },
    {
      id: 'spam',
      label: 'Spam / Ditolak',
      count: rfqStats.spamCount,
      activeBg: '#64748b',
      activeColor: '#ffffff',
      activeBorder: '#475569',
      inactiveBg: 'rgba(100, 116, 139, 0.1)',
      inactiveColor: '#64748b',
      inactiveBorder: 'rgba(100, 116, 139, 0.35)',
      badgeBg: 'rgba(100, 116, 139, 0.2)',
      badgeColor: '#64748b',
    },
  ];

  return (
    <div className="admin-module">
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: '0.35rem' }}>
          Manajemen Konten Halaman Kontak, Notifikasi Email & RFQ Leads
        </h2>
        <p style={{ color: 'var(--adm-muted)', fontSize: '0.875rem' }}>
          Kelola judul halaman, saluran komunikasi B2B, titik lokasi Google Maps, sistem notifikasi email otomatis ke tim sales, dan tindak lanjut permohonan penawaran harga (RFQ).
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
              style={{ position: 'relative' }}
            >
              <Icon size={16} />
              <span>{sec.label}</span>
              {sec.badge && (
                <span
                  style={{
                    marginLeft: 6,
                    background: 'rgba(13, 148, 136, 0.15)',
                    color: '#0d9488',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '1px 7px',
                    borderRadius: 10,
                  }}
                >
                  {sec.badge}
                </span>
              )}
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
              <label className="admin-label">Subjudul / Deskripsi Konsultasi ({currentHeadLang.toUpperCase()})</label>
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

            <div className="admin-form-group" style={{ marginBottom: 0 }}>
              <label className="admin-label">Badge Tag Jaminan Layanan ({currentHeadLang.toUpperCase()})</label>
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
              <h3 className="admin-card-title">Bagian 2: Saluran Kontak & Alamat Fisik</h3>
              <p className="admin-card-subtitle">
                Atur email resmi, telepon switchboard, nomor WhatsApp perwakilan, dan alamat pabrik Batam FTZ.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'contact_details'}
              onClick={handleSaveContactDetails}
            >
              <Save size={16} />
              <span>{savingKey === 'contact_details' ? 'Menyimpan...' : 'Simpan Kontak'}</span>
            </button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label">Email Komersial Resmi</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="admin-input"
                    value={contactData.email || ''}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    placeholder="sales@globalphilsonic.com"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Nomor Telepon Kantor / Hunting</label>
                <input
                  type="text"
                  className="admin-input"
                  value={contactData.phone || ''}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  placeholder="+62 778 408 8888"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Nomor WhatsApp B2B Sales (Format Internasional)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={contactData.whatsapp || ''}
                  onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value })}
                  placeholder="+62 811 7700 888"
                />
                <span style={{ fontSize: '0.73rem', color: 'var(--adm-muted)' }}>
                  Nomor ini digunakan saat tombol &quot;Kirim ke WhatsApp&quot; diklik di halaman kontak dan popup RFQ produk.
                </span>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--adm-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label className="admin-label" style={{ marginBottom: 0 }}>
                  Alamat Pabrik & Fasilitas Manufaktur (Bahasa Indonesia)
                </label>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  onClick={handleAutoTranslateAddress}
                  disabled={translatingKey === 'channels'}
                >
                  <Sparkles size={13} />
                  <span>{translatingKey === 'channels' ? 'Menerjemahkan...' : 'Terjemahkan Alamat ke English'}</span>
                </button>
              </div>
              <textarea
                rows={2}
                className="admin-textarea"
                value={contactData.address || ''}
                onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
              />

              <div style={{ marginTop: '1rem' }}>
                <label className="admin-label">Alamat Pabrik (English Version)</label>
                <textarea
                  rows={2}
                  className="admin-textarea"
                  value={contactData.address_en || ''}
                  onChange={(e) => setContactData({ ...contactData, address_en: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--adm-border)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--adm-text)', marginBottom: '0.75rem' }}>
                Tautan Media Sosial & Profil B2B
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label">URL Profil LinkedIn Perusahaan</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={contactData.linkedin || ''}
                    onChange={(e) => setContactData({ ...contactData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/company/global-philsonic-technologies"
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">URL Profil Instagram</label>
                  <input
                    type="url"
                    className="admin-input"
                    value={contactData.instagram || ''}
                    onChange={(e) => setContactData({ ...contactData, instagram: e.target.value })}
                    placeholder="https://instagram.com/globalphilsonic"
                  />
                </div>
              </div>
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
                Atur koordinat lintang & bujur (latitude & longitude) fasilitas pabrik Batam untuk visualisasi peta interaktif.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'contact_details'}
              onClick={handleSaveContactDetails}
            >
              <Save size={16} />
              <span>{savingKey === 'contact_details' ? 'Menyimpan...' : 'Simpan Koordinat'}</span>
            </button>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Nama Tempat / Pin Label di Peta</label>
              <input
                type="text"
                className="admin-input"
                value={contactData.maps_place_name || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setContactData((prev) => ({ ...prev, maps_place_name: val }));
                  handleUpdateCoordinates(contactData.maps_latitude, contactData.maps_longitude);
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label">Latitude (Garis Lintang)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={contactData.maps_latitude || ''}
                  onChange={(e) => handleUpdateCoordinates(e.target.value, contactData.maps_longitude)}
                  placeholder="1.1368003"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Longitude (Garis Bujur)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={contactData.maps_longitude || ''}
                  onChange={(e) => handleUpdateCoordinates(contactData.maps_latitude, e.target.value)}
                  placeholder="104.0452514"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Tautan Buka Langsung (Google Maps Full URL)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="url"
                  className="admin-input"
                  value={contactData.maps_url || ''}
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
                  border: '1.5px solid var(--adm-border-visible)',
                  background: 'var(--adm-card-inner)',
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

      {/* ── SECTION 4: EMAIL NOTIFICATION & RFQ INBOUND LEADS ── */}
      {activeSection === 'email_rfq' && (
        <div>
          {/* 4A: SMTP & EMAIL NOTIFICATION CONFIGURATION */}
          <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={20} />
                  <span>Pengaturan Notifikasi Email & SMTP Server</span>
                </h3>
                <p className="admin-card-subtitle">
                  Konfigurasikan sistem pengiriman email otomatis ke tim Sales Engineering dan balasan tanda terima resmi (auto-reply) ke klien.
                </p>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                disabled={savingKey === 'email_smtp_settings'}
                onClick={handleSaveEmailSettings}
              >
                <Save size={16} />
                <span>{savingKey === 'email_smtp_settings' ? 'Menyimpan...' : 'Simpan Pengaturan Email'}</span>
              </button>
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              {/* Toggle Switches */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    background: 'var(--adm-card-inner)',
                    border: '1.5px solid var(--adm-border-visible)',
                    borderRadius: 8,
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--adm-text)', fontSize: '0.9rem' }}>
                      Notifikasi Email Otomatis
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--adm-muted)', marginTop: 2 }}>
                      Kirim email peringatan ke tim Sales saat ada RFQ baru masuk
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailSettings.enabled}
                    onChange={(e) => setEmailSettings({ ...emailSettings, enabled: e.target.checked })}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                </div>

                <div
                  style={{
                    background: 'var(--adm-card-inner)',
                    border: '1.5px solid var(--adm-border-visible)',
                    borderRadius: 8,
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--adm-text)', fontSize: '0.9rem' }}>
                      Auto-Reply Konfirmasi ke Klien
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--adm-muted)', marginTop: 2 }}>
                      Kirim email balasan profesional bahwa permohonan RFQ telah diterima
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailSettings.auto_reply_enabled}
                    onChange={(e) => setEmailSettings({ ...emailSettings, auto_reply_enabled: e.target.checked })}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Notification Recipients */}
              <div className="admin-form-group">
                <label className="admin-label">
                  Email Tujuan Penerima Notifikasi (Internal Sales Team)
                </label>
                <input
                  type="text"
                  className="admin-input"
                  value={emailSettings.notify_emails || ''}
                  onChange={(e) => setEmailSettings({ ...emailSettings, notify_emails: e.target.value })}
                  placeholder="sales@globalphilsonic.com, engineering@globalphilsonic.com"
                />
                <span style={{ fontSize: '0.73rem', color: 'var(--adm-muted)' }}>
                  Bisa memasukkan lebih dari satu email dipisahkan dengan tanda koma (,).
                </span>
              </div>

              {/* Email Provider Selector & Credentials Form */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--adm-border)' }}>
                <label className="admin-label" style={{ marginBottom: 8, display: 'block' }}>
                  Penyedia Layanan Pengiriman Email (Provider Engine)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  {/* Resend HTTPS API Option */}
                  <div
                    onClick={() => setEmailSettings({ ...emailSettings, provider: 'resend' })}
                    style={{
                      border: emailSettings.provider === 'resend' ? '2px solid #0d9488' : '1.5px solid var(--adm-border-visible)',
                      background: emailSettings.provider === 'resend' ? 'rgba(13, 148, 136, 0.08)' : 'var(--adm-card-inner)',
                      borderRadius: 10,
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: '#0d9488',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Zap size={16} />
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--adm-text)', fontSize: '0.92rem' }}>
                          Resend HTTPS API
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          background: '#0d9488',
                          color: '#ffffff',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 12,
                        }}
                      >
                        Rekomendasi Cloud
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--adm-muted)', lineHeight: 1.4 }}>
                      Menggunakan REST API resmi (Port 443). Kebal blokir firewall Railway / Vercel, instan tanpa timeout. Kuota gratis 3.000 email/bulan.
                    </p>
                  </div>

                  {/* Traditional SMTP Option */}
                  <div
                    onClick={() => setEmailSettings({ ...emailSettings, provider: 'smtp' })}
                    style={{
                      border: emailSettings.provider === 'smtp' ? '2px solid #0d9488' : '1.5px solid var(--adm-border-visible)',
                      background: emailSettings.provider === 'smtp' ? 'rgba(13, 148, 136, 0.08)' : 'var(--adm-card-inner)',
                      borderRadius: 10,
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: '#64748b',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Mail size={16} />
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--adm-text)', fontSize: '0.92rem' }}>
                          SMTP Konvensional
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          background: 'rgba(100, 116, 139, 0.2)',
                          color: 'var(--adm-text)',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 12,
                        }}
                      >
                        Port 465 / 587
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--adm-muted)', lineHeight: 1.4 }}>
                      Koneksi soket TCP langsung (Google App Password / cPanel). Berisiko timeout jika port keluar diblokir hosting cloud.
                    </p>
                  </div>
                </div>

                {/* Sub-form 1: Resend HTTPS API Configuration */}
                {emailSettings.provider === 'resend' ? (
                  <div
                    style={{
                      background: 'var(--adm-card-inner)',
                      border: '1.5px solid var(--adm-border-visible)',
                      borderRadius: 10,
                      padding: '1.25rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: '1rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--adm-text)', margin: 0 }}>
                          Konfigurasi Kredensial Resend API
                        </h4>
                        <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: 'var(--adm-muted)' }}>
                          Pengiriman email dilakukan via HTTPS Port 443 sehingga 100% aman dan lancar di server Railway & Vercel.
                        </p>
                      </div>
                      <a
                        href="https://resend.com/api-keys"
                        target="_blank"
                        rel="noreferrer"
                        className="admin-btn admin-btn-secondary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: '0.8rem',
                          padding: '6px 12px',
                          textDecoration: 'none',
                          fontWeight: 600,
                        }}
                      >
                        <ExternalLink size={14} style={{ color: '#0d9488' }} />
                        <span>Dapatkan API Key di Resend.com</span>
                      </a>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      <div className="admin-form-group">
                        <label className="admin-label">
                          Resend API Key <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showResendApiKey ? 'text' : 'password'}
                            className="admin-input"
                            value={emailSettings.resend_api_key || ''}
                            onChange={(e) => setEmailSettings({ ...emailSettings, resend_api_key: e.target.value })}
                            placeholder="re_123456789_abcdefghijklmnopqrstuvwxyz"
                            style={{ paddingRight: 40, fontFamily: 'monospace' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowResendApiKey(!showResendApiKey)}
                            style={{
                              position: 'absolute',
                              right: 10,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: 'var(--adm-muted)',
                              cursor: 'pointer',
                            }}
                          >
                            {showResendApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <span style={{ fontSize: '0.73rem', color: 'var(--adm-muted)', marginTop: 4, display: 'block' }}>
                          Awali dengan <code>re_</code>. Buat API Key baru di dashboard Resend &amp; beri hak akses &apos;Full Access&apos;.
                        </span>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Email Pengirim (Sender From)</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={emailSettings.resend_from || 'PT. Global Philsonic Technologies <onboarding@resend.dev>'}
                          onChange={(e) => setEmailSettings({ ...emailSettings, resend_from: e.target.value })}
                          placeholder="PT. Global Philsonic Technologies <onboarding@resend.dev>"
                        />
                        <span style={{ fontSize: '0.73rem', color: 'var(--adm-muted)', marginTop: 4, display: 'block' }}>
                          Default akun baru: <code>PT. Global Philsonic Technologies &lt;onboarding@resend.dev&gt;</code>. Atau gunakan email domain Anda jika sudah diverifikasi di Resend.
                        </span>
                      </div>
                    </div>

                    <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label className="admin-label">Nama Pengirim Tampilan</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={emailSettings.sender_name || ''}
                          onChange={(e) => setEmailSettings({ ...emailSettings, sender_name: e.target.value })}
                          placeholder="PT. Global Philsonic Technologies"
                        />
                      </div>
                    </div>

                    {/* Panduan Ringkas Resend */}
                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '0.85rem 1rem',
                        background: 'rgba(13, 148, 136, 0.05)',
                        border: '1px solid rgba(13, 148, 136, 0.3)',
                        borderRadius: 8,
                        fontSize: '0.8rem',
                        color: 'var(--adm-text)',
                        lineHeight: 1.5,
                      }}
                    >
                      <strong>Tips Pengujian Cepat:</strong> Dengan domain gratis <code>onboarding@resend.dev</code>, Resend mengizinkan pengiriman email ke alamat email yang Anda pakai saat mendaftar akun di Resend. Masukkan email akun Resend Anda pada kolom uji coba di bawah untuk melakukan live test.
                    </div>
                  </div>
                ) : (
                  /* Sub-form 2: SMTP Configuration */
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--adm-text)', margin: 0 }}>
                        Konfigurasi Server SMTP Pengirim
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowSmtpGuideModal(true)}
                        className="admin-btn admin-btn-secondary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: '0.8rem',
                          padding: '5px 12px',
                          color: 'var(--adm-text)',
                          border: '1.5px solid var(--adm-border-visible)',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                        title="Buka panduan langkah demi langkah setup SMTP & tips pencegahan error"
                      >
                        <BookOpen size={15} style={{ color: '#0d9488' }} />
                        <span>Panduan Setup SMTP & Pencegahan Error</span>
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                      <div className="admin-form-group">
                        <label className="admin-label">Host SMTP</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={emailSettings.smtp_host || ''}
                          onChange={(e) => setEmailSettings({ ...emailSettings, smtp_host: e.target.value })}
                          placeholder="smtp.gmail.com atau mail.globalphilsonic.com"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Port SMTP</label>
                        <input
                          type="number"
                          className="admin-input"
                          value={emailSettings.smtp_port || 587}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 587;
                            setEmailSettings({
                              ...emailSettings,
                              smtp_port: val,
                              smtp_secure: val === 465 ? true : (val === 587 ? false : emailSettings.smtp_secure),
                            });
                          }}
                          placeholder="587 atau 465"
                        />
                        <span style={{ fontSize: '0.73rem', color: '#0d9488', marginTop: 3, display: 'block' }}>
                          Rekomendasi Vercel/Cloud: <strong>Port 465</strong> (SSL)
                        </span>
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Username / Akun Email SMTP</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={emailSettings.smtp_user || ''}
                          onChange={(e) => setEmailSettings({ ...emailSettings, smtp_user: e.target.value })}
                          placeholder="sales@globalphilsonic.com"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Password SMTP / App Password</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="admin-input"
                            value={emailSettings.smtp_pass || ''}
                            onChange={(e) => setEmailSettings({ ...emailSettings, smtp_pass: e.target.value })}
                            placeholder="••••••••••••"
                            style={{ paddingRight: 40 }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              position: 'absolute',
                              right: 10,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: 'var(--adm-muted)',
                              cursor: 'pointer',
                            }}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                      <div className="admin-form-group">
                        <label className="admin-label">Nama Pengirim Tampilan</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={emailSettings.sender_name || ''}
                          onChange={(e) => setEmailSettings({ ...emailSettings, sender_name: e.target.value })}
                          placeholder="PT. Global Philsonic Technologies"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Email Pengirim Tampilan</label>
                        <input
                          type="email"
                          className="admin-input"
                          value={emailSettings.sender_email || ''}
                          onChange={(e) => setEmailSettings({ ...emailSettings, sender_email: e.target.value })}
                          placeholder="noreply@globalphilsonic.com"
                        />
                      </div>

                      <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', marginTop: 24 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--adm-text)' }}>
                          <input
                            type="checkbox"
                            checked={emailSettings.smtp_secure}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setEmailSettings({
                                ...emailSettings,
                                smtp_secure: checked,
                                smtp_port: checked && emailSettings.smtp_port === 587 ? 465 : (!checked && emailSettings.smtp_port === 465 ? 587 : emailSettings.smtp_port),
                              });
                            }}
                            style={{ width: 16, height: 16 }}
                          />
                          <span>Gunakan SSL/TLS Secure (Port 465)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── KUSTOMISASI KATA-KATA AUTO-REPLY KE KLIEN ── */}
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '1.25rem',
                  background: 'var(--adm-card-inner)',
                  border: '1.5px solid var(--adm-border-visible)',
                  borderRadius: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <MessageSquareQuote size={18} style={{ color: 'var(--adm-text)' }} />
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--adm-text)' }}>
                    Kustomisasi Template Pesan Auto-Reply (Balasan Otomatis ke Klien)
                  </h4>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--adm-muted)', margin: '0 0 1rem' }}>
                  Atur kata-kata yang otomatis dikirimkan ke email pemohon saat mereka mengirimkan permohonan RFQ melalui website.
                </p>

                <div className="admin-form-group">
                  <label className="admin-label">Subjek Email Konfirmasi ke Klien</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={emailSettings.auto_reply_subject || ''}
                    onChange={(e) => setEmailSettings({ ...emailSettings, auto_reply_subject: e.target.value })}
                    placeholder="Konfirmasi Penerimaan Permintaan Penawaran (RFQ) - PT. Global Philsonic Technologies"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Pesan Pembuka / Ucapan Terima Kasih</label>
                  <textarea
                    rows={3}
                    className="admin-textarea"
                    value={emailSettings.auto_reply_greeting || ''}
                    onChange={(e) => setEmailSettings({ ...emailSettings, auto_reply_greeting: e.target.value })}
                    placeholder="Tuliskan ucapan terima kasih dan konfirmasi bahwa data telah dicatat..."
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Pernyataan Komitmen Waktu Respons Tim Sales</label>
                  <textarea
                    rows={2}
                    className="admin-textarea"
                    value={emailSettings.auto_reply_commitment || ''}
                    onChange={(e) => setEmailSettings({ ...emailSettings, auto_reply_commitment: e.target.value })}
                    placeholder="Komitmen Respons Cepat: Tim Engineering & B2B Sales kami saat ini sedang meninjau parameter teknis Anda dan akan menghubungi Anda kembali dalam waktu maksimal 1 x 24 jam kerja."
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label">Instruksi Penutup & Panduan Lampiran Teknis (Gerber, BOM, CAD)</label>
                  <textarea
                    rows={2}
                    className="admin-textarea"
                    value={emailSettings.auto_reply_footer_note || ''}
                    onChange={(e) => setEmailSettings({ ...emailSettings, auto_reply_footer_note: e.target.value })}
                    placeholder="Jika Anda memiliki lampiran berkas teknis, Anda dapat langsung membalas email ini..."
                  />
                </div>
              </div>

              {/* Test Email Panel */}
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '1rem 1.25rem',
                  background: 'var(--adm-card-inner)',
                  border: '1.5px solid var(--adm-border-visible)',
                  borderRadius: 8,
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--adm-text)', fontSize: '0.875rem', marginBottom: 4 }}>
                  Uji Coba Pengiriman Email (Live Test)
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--adm-muted)', margin: '0 0 10px' }}>
                  Kirim email uji coba untuk memverifikasi keabsahan kredensial SMTP dan kelancaran pengiriman ke inbox.
                </p>

                <form onSubmit={handleTestEmail} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    className="admin-input"
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="Masukkan email penerima uji coba..."
                    style={{ flex: 1, minWidth: 240 }}
                  />
                  <button
                    type="submit"
                    className="admin-btn admin-btn-secondary"
                    disabled={testingEmail}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <Send size={14} />
                    <span>{testingEmail ? 'Mengirim Uji Coba...' : 'Kirim Test Email'}</span>
                  </button>
                </form>

                {testResult && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: '8px 12px',
                      borderRadius: 6,
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: testResult.success ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      color: testResult.success ? '#16a34a' : '#dc2626',
                      border: `1px solid ${testResult.success ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    }}
                  >
                    {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4B: INBOUND RFQ LEADS TABLE & CRM */}
          <div className="admin-card">
            <div className="admin-card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Inbox size={20} />
                  <span>Daftar Permintaan Penawaran Masuk (Inbound RFQ Leads)</span>
                </h3>
                <p className="admin-card-subtitle">
                  Pantau, perbarui status tindak lanjut, dan kelola komunikasi proyek dengan calon mitra B2B.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={refreshRfqs}
                  disabled={rfqLoading}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: '0.8125rem' }}
                >
                  <RefreshCw size={14} className={rfqLoading ? 'spin' : ''} />
                  <span>Perbarui</span>
                </button>
              </div>
            </div>

            {/* Metrics Chips / Filters (Strictly High-Contrast & Legible in Light & Dark Mode) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '1rem 0' }}>
              {filterTabs.map((tab) => {
                const isSelected = rfqStatusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setRfqStatusFilter(tab.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 20,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: `1.5px solid ${isSelected ? tab.activeBorder : tab.inactiveBorder}`,
                      background: isSelected ? tab.activeBg : tab.inactiveBg,
                      color: isSelected ? tab.activeColor : tab.inactiveColor,
                      transition: 'all 0.15s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>{tab.label}</span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '1px 7px',
                        borderRadius: 10,
                        background: isSelected ? 'rgba(255, 255, 255, 0.25)' : tab.badgeBg,
                        color: isSelected ? '#ffffff' : tab.badgeColor,
                        fontWeight: 700,
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Box */}
            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--adm-muted)' }} />
              <input
                type="text"
                className="admin-input"
                placeholder="Cari berdasarkan nama pemohon, perusahaan, email korporat, atau no telepon..."
                value={rfqSearch}
                onChange={(e) => setRfqSearch(e.target.value)}
                style={{ paddingLeft: 38 }}
              />
            </div>

            {/* Leads Table */}
            {filteredRfqs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--adm-muted)' }}>
                <Inbox size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  {rfqList.length === 0
                    ? 'Belum ada permohonan RFQ yang masuk.'
                    : 'Tidak ada data RFQ yang cocok dengan filter atau kata kunci pencarian.'}
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid var(--adm-border-visible)', color: 'var(--adm-muted)' }}>
                      <th style={{ padding: '10px 12px', fontWeight: 600 }}>Tgl / Waktu</th>
                      <th style={{ padding: '10px 12px', fontWeight: 600 }}>Pemohon & Perusahaan</th>
                      <th style={{ padding: '10px 12px', fontWeight: 600 }}>Kontak (Email / Telp)</th>
                      <th style={{ padding: '10px 12px', fontWeight: 600 }}>Kategori & Target</th>
                      <th style={{ padding: '10px 12px', fontWeight: 600 }}>Status Tindak Lanjut</th>
                      <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRfqs.map((rfq) => {
                      const st = STATUS_CONFIG[rfq.status || 'new'] || STATUS_CONFIG.new;
                      const cleanPhone = (rfq.phone || '').replace(/[^0-9]/g, '');

                      return (
                        <tr
                          key={rfq.id}
                          style={{
                            borderBottom: '1px solid var(--adm-border)',
                            transition: 'background 0.2s',
                          }}
                        >
                          <td style={{ padding: '12px', verticalAlign: 'top', color: 'var(--adm-muted)', whiteSpace: 'nowrap' }}>
                            <div style={{ color: 'var(--adm-text)', fontWeight: 600 }}>
                              {new Date(rfq.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                            <div style={{ fontSize: '0.72rem' }}>
                              {new Date(rfq.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                            </div>
                            {rfq.country_name && (
                              <div style={{ fontSize: '0.7rem', color: 'var(--adm-muted)', fontWeight: 500, marginTop: 3 }}>
                                {rfq.country_name}
                              </div>
                            )}
                          </td>

                          <td style={{ padding: '12px', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 600, color: 'var(--adm-text)', fontSize: '0.9rem' }}>
                              {rfq.company_name}
                            </div>
                            <div style={{ color: 'var(--adm-muted)', fontSize: '0.78rem' }}>
                              {rfq.full_name}
                            </div>
                          </td>

                          <td style={{ padding: '12px', verticalAlign: 'top' }}>
                            <div>
                              <a href={`mailto:${rfq.corporate_email}`} style={{ color: 'var(--adm-text)', fontWeight: 500, textDecoration: 'underline' }}>
                                {rfq.corporate_email}
                              </a>
                            </div>
                            <div style={{ color: 'var(--adm-muted)', fontSize: '0.78rem', marginTop: 2 }}>
                              {rfq.phone}
                            </div>
                          </td>

                          <td style={{ padding: '12px', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 500, color: 'var(--adm-text)' }}>
                              {INQUIRY_LABELS[rfq.inquiry_type] || rfq.inquiry_type}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--adm-muted)', marginTop: 2 }}>
                              {VOLUME_LABELS[rfq.volume] || rfq.volume}
                            </div>
                          </td>

                          <td style={{ padding: '12px', verticalAlign: 'top' }}>
                            <select
                              value={rfq.status || 'new'}
                              disabled={updatingRfqId === rfq.id}
                              onChange={(e) => handleUpdateRfqStatus(rfq.id, e.target.value)}
                              style={{
                                background: 'var(--adm-card-inner)',
                                color: 'var(--adm-text)',
                                border: `1.5px solid var(--adm-border-visible)`,
                                borderRadius: 6,
                                padding: '4px 8px',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                outline: 'none',
                              }}
                            >
                              <option value="new">Baru (New)</option>
                              <option value="contacted">Dihubungi (Contacted)</option>
                              <option value="quoted">Penawaran Diberikan (Quoted)</option>
                              <option value="closed">Selesai / Deal (Closed)</option>
                              <option value="spam">Spam / Ditolak</option>
                            </select>
                            {rfq.spam_reason && (
                              <div
                                style={{
                                  fontSize: '0.7rem',
                                  color: '#ef4444',
                                  marginTop: 4,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  maxWidth: 190,
                                  lineHeight: 1.2,
                                }}
                                title={rfq.spam_reason}
                              >
                                <AlertTriangle size={11} style={{ flexShrink: 0 }} />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {rfq.spam_reason}
                                </span>
                              </div>
                            )}
                            {rfq.notes && (
                              <div style={{ fontSize: '0.72rem', color: 'var(--adm-muted)', fontStyle: 'italic', marginTop: 4, maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                Catatan: {rfq.notes}
                              </div>
                            )}
                          </td>

                          <td style={{ padding: '12px', verticalAlign: 'top', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                              <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                title="Lihat Detail & Catatan"
                                onClick={() => {
                                  setSelectedRfq(rfq);
                                  setRfqNoteInput(rfq.notes || '');
                                }}
                              >
                                Detail
                              </button>

                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="admin-btn"
                                  style={{
                                    padding: '4px 8px',
                                    fontSize: '0.75rem',
                                    background: 'var(--adm-card-inner)',
                                    color: '#16a34a',
                                    border: '1.5px solid var(--adm-border-visible)',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    fontWeight: 600,
                                  }}
                                  title="Hubungi via WhatsApp"
                                >
                                  WA
                                </a>
                              )}

                              <button
                                type="button"
                                className="admin-btn-action admin-btn-action-delete"
                                title="Hapus Permohonan"
                                onClick={() => setDeleteConfirmRfq(rfq)}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── DETAIL MODAL FOR SELECTED RFQ (PURE MONOCHROME ENTERPRISE DESIGN) ── */}
          {selectedRfq && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '1rem',
                backdropFilter: 'blur(6px)',
              }}
              onClick={() => setSelectedRfq(null)}
            >
              <div
                style={{
                  background: 'var(--adm-card)',
                  color: 'var(--adm-text)',
                  border: '1.5px solid var(--adm-border-visible)',
                  borderRadius: 12,
                  width: '100%',
                  maxWidth: 640,
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  padding: '1.75rem',
                  boxShadow: 'var(--adm-shadow)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div>
                    <span
                      style={{
                        display: 'inline-block',
                        background: 'var(--adm-card-inner)',
                        color: 'var(--adm-text)',
                        border: '1px solid var(--adm-border-visible)',
                        padding: '3px 8px',
                        borderRadius: 4,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: 6,
                      }}
                    >
                      Permintaan RFQ #{selectedRfq.id}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--adm-text)', fontWeight: 800 }}>
                      {selectedRfq.company_name}
                    </h3>
                    <p style={{ margin: '4px 0 0', color: 'var(--adm-muted)', fontSize: '0.85rem' }}>
                      Diajukan oleh: <strong>{selectedRfq.full_name}</strong> &bull; {new Date(selectedRfq.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedRfq(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--adm-muted)', cursor: 'pointer', padding: 4 }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {selectedRfq.spam_reason && (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1.5px solid rgba(239, 68, 68, 0.35)',
                      borderRadius: 8,
                      padding: '10px 14px',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <AlertTriangle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />
                    <div>
                      <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.85rem' }}>
                        Terdeteksi Auto-Flag Spam / Data Iseng (Skor Risiko: {selectedRfq.spam_score || 0}/100)
                      </div>
                      <div style={{ color: 'var(--adm-text)', fontSize: '0.8rem', marginTop: 2 }}>
                        Alasan: {selectedRfq.spam_reason}
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ background: 'var(--adm-card-inner)', border: '1px solid var(--adm-border)', padding: '10px 14px', borderRadius: 8 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--adm-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Email Korporat</div>
                    <a href={`mailto:${selectedRfq.corporate_email}`} style={{ color: 'var(--adm-text)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'underline' }}>
                      {selectedRfq.corporate_email}
                    </a>
                  </div>

                  <div style={{ background: 'var(--adm-card-inner)', border: '1px solid var(--adm-border)', padding: '10px 14px', borderRadius: 8 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--adm-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Nomor Telepon / WhatsApp</div>
                    <div style={{ color: 'var(--adm-text)', fontWeight: 600, fontSize: '0.9rem' }}>
                      {selectedRfq.phone}
                    </div>
                  </div>

                  <div style={{ background: 'var(--adm-card-inner)', border: '1px solid var(--adm-border)', padding: '10px 14px', borderRadius: 8 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--adm-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Kategori Kebutuhan</div>
                    <div style={{ color: 'var(--adm-text)', fontWeight: 600, fontSize: '0.9rem' }}>
                      {INQUIRY_LABELS[selectedRfq.inquiry_type] || selectedRfq.inquiry_type}
                    </div>
                  </div>

                  <div style={{ background: 'var(--adm-card-inner)', border: '1px solid var(--adm-border)', padding: '10px 14px', borderRadius: 8 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--adm-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Target Volume Produksi</div>
                    <div style={{ color: 'var(--adm-text)', fontWeight: 600, fontSize: '0.9rem' }}>
                      {VOLUME_LABELS[selectedRfq.volume] || selectedRfq.volume}
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="admin-label">Rincian Spesifikasi / Pesan dari Pemohon</label>
                  <div
                    style={{
                      background: 'var(--adm-card-inner)',
                      border: '1px solid var(--adm-border-visible)',
                      borderLeft: '4px solid var(--adm-text)',
                      padding: '1rem',
                      borderRadius: 6,
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: 'var(--adm-text)',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {selectedRfq.message || <em style={{ color: 'var(--adm-muted)' }}>Tidak ada pesan atau catatan tambahan.</em>}
                  </div>
                </div>

                {/* Internal Notes */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label className="admin-label">Catatan Internal Tim Engineering / Sales</label>
                  <textarea
                    rows={3}
                    className="admin-textarea"
                    value={rfqNoteInput}
                    onChange={(e) => setRfqNoteInput(e.target.value)}
                    placeholder="Tuliskan catatan internal, misal: 'Sudah dihubungi via WA tgl 12/10, menunggu kiriman file Gerber...'"
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <button
                      type="button"
                      className="admin-btn admin-btn-primary"
                      disabled={savingNote}
                      onClick={() => handleSaveRfqNote(selectedRfq.id)}
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      {savingNote ? 'Menyimpan...' : 'Simpan Catatan'}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--adm-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--adm-muted)' }}>Status:</span>
                    <select
                      value={selectedRfq.status || 'new'}
                      onChange={(e) => handleUpdateRfqStatus(selectedRfq.id, e.target.value)}
                      style={{
                        background: 'var(--adm-card-inner)',
                        color: 'var(--adm-text)',
                        border: '1.5px solid var(--adm-border-visible)',
                        borderRadius: 6,
                        padding: '4px 8px',
                        fontSize: '0.8rem',
                      }}
                    >
                      <option value="new">Baru (New)</option>
                      <option value="contacted">Dihubungi (Contacted)</option>
                      <option value="quoted">Penawaran Diberikan (Quoted)</option>
                      <option value="closed">Selesai / Deal (Closed)</option>
                      <option value="spam">Spam / Ditolak</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {selectedRfq.phone && (
                      <a
                        href={`https://wa.me/${selectedRfq.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-btn admin-btn-secondary"
                        style={{
                          textDecoration: 'none',
                          padding: '6px 14px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: '#16a34a',
                        }}
                      >
                        Hubungi WhatsApp
                      </a>
                    )}
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary"
                      onClick={() => setSelectedRfq(null)}
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── IN-APP DELETE CONFIRMATION MODAL ── */}
          {deleteConfirmRfq && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '1rem',
                backdropFilter: 'blur(5px)',
              }}
              onClick={() => !deletingLoading && setDeleteConfirmRfq(null)}
            >
              <div
                style={{
                  background: 'var(--adm-card)',
                  color: 'var(--adm-text)',
                  border: '1.5px solid var(--adm-border-visible)',
                  borderRadius: 12,
                  width: '100%',
                  maxWidth: 440,
                  padding: '1.75rem',
                  boxShadow: 'var(--adm-shadow)',
                  textAlign: 'center',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1.5px solid rgba(239, 68, 68, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    color: '#ef4444',
                  }}
                >
                  <Trash2 size={24} />
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '1.15rem', fontWeight: 700, color: 'var(--adm-text)' }}>
                  Hapus Permintaan RFQ Ini?
                </h3>
                <p style={{ margin: '0 0 1.5rem', fontSize: '0.85rem', color: 'var(--adm-muted)', lineHeight: 1.5 }}>
                  Apakah Anda yakin ingin menghapus data permohonan dari <strong>{deleteConfirmRfq.company_name}</strong> ({deleteConfirmRfq.full_name})? Data ini akan dihapus permanen dari sistem.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    disabled={deletingLoading}
                    onClick={() => setDeleteConfirmRfq(null)}
                    style={{ minWidth: 100 }}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={deletingLoading}
                    onClick={() => handleExecuteDeleteRfq(deleteConfirmRfq.id)}
                    style={{
                      background: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '8px 18px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      minWidth: 120,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    {deletingLoading ? 'Menghapus...' : 'Ya, Hapus Data'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. MODAL PANDUAN INTEGRASI SMTP & PENCEGAHAN ERROR (FOKUS 1 REKOMENDASI UTAMA: GMAIL / GOOGLE WORKSPACE) */}
          {showSmtpGuideModal && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10001,
                padding: '1rem',
                backdropFilter: 'blur(5px)',
              }}
              onClick={() => setShowSmtpGuideModal(false)}
            >
              <div
                style={{
                  background: 'var(--adm-card)',
                  color: 'var(--adm-text)',
                  border: '1.5px solid var(--adm-border-visible)',
                  borderRadius: 12,
                  width: '100%',
                  maxWidth: 820,
                  maxHeight: '90vh',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  boxShadow: 'var(--adm-shadow)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid var(--adm-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--adm-card-inner)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        background: 'rgba(13, 148, 136, 0.15)',
                        border: '1.5px solid rgba(13, 148, 136, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0d9488',
                      }}
                    >
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--adm-text)' }}>
                        Panduan Setup Email SMTP (Rekomendasi: Google / Gmail)
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--adm-muted)' }}>
                        Panduan langkah demi langkah dari awal sampai selesai agar website otomatis dapat mengirim email notifikasi & tanda terima RFQ ke klien
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSmtpGuideModal(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--adm-muted)',
                      padding: 6,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Tutup panduan"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Scrollable Body */}
                <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, fontSize: '0.86rem', lineHeight: 1.6 }}>
                  {/* Parameter Ringkas */}
                  <div
                    style={{
                      background: 'rgba(13, 148, 136, 0.08)',
                      border: '1.5px solid rgba(13, 148, 136, 0.35)',
                      borderRadius: 8,
                      padding: '1.1rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.5rem' }}>
                      <CheckCircle2 size={17} style={{ color: '#0d9488' }} />
                      <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#0d9488', fontWeight: 700 }}>
                        Data Konfigurasi yang Harus Diisi di Formulir Admin:
                      </h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', fontSize: '0.82rem' }}>
                      <div>
                        <div style={{ color: 'var(--adm-muted)', fontSize: '0.75rem' }}>Host SMTP</div>
                        <code style={{ fontSize: '0.85rem', fontWeight: 600 }}>smtp.gmail.com</code>
                      </div>
                      <div>
                        <div style={{ color: 'var(--adm-muted)', fontSize: '0.75rem' }}>Port SMTP</div>
                        <code style={{ fontSize: '0.85rem', fontWeight: 600 }}>587</code>
                      </div>
                      <div>
                        <div style={{ color: 'var(--adm-muted)', fontSize: '0.75rem' }}>Gunakan SSL / TLS</div>
                        <span style={{ fontWeight: 600, color: '#ef4444' }}>TIDAK DICENTANG</span> (Gunakan STARTTLS)
                      </div>
                      <div>
                        <div style={{ color: 'var(--adm-muted)', fontSize: '0.75rem' }}>Username / Akun Email</div>
                        <span style={{ fontWeight: 600 }}>Alamat email Google Anda</span>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ color: 'var(--adm-muted)', fontSize: '0.75rem' }}>Password SMTP</div>
                        <span style={{ fontWeight: 700, color: '#0d9488' }}>
                          16 Digit "Sandi Aplikasi" (App Password)
                        </span>{' '}
                        <span style={{ color: 'var(--adm-muted)', fontSize: '0.75rem' }}>
                          — Jangan gunakan password email biasa. Ikuti langkah pembuatan di bawah:
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Langkah demi Langkah Dari Awal Sampai Selesai */}
                  <h4 style={{ margin: '0 0 0.85rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--adm-text)' }}>
                    Langkah-Langkah Setup dari Awal sampai Selesai:
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                    {/* Step 1 */}
                    <div
                      style={{
                        display: 'flex',
                        gap: 12,
                        background: 'var(--adm-card-inner)',
                        border: '1px solid var(--adm-border)',
                        borderRadius: 8,
                        padding: '0.9rem',
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: '#0d9488',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        1
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: 'var(--adm-text)', fontSize: '0.88rem' }}>
                          Buka Halaman Keamanan Akun Google Anda
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--adm-muted)' }}>
                          Buka browser Anda dan kunjungi{' '}
                          <a
                            href="https://myaccount.google.com/security"
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#0ea5e9', textDecoration: 'underline', fontWeight: 600 }}
                          >
                            myaccount.google.com/security
                          </a>{' '}
                          menggunakan akun email Google / Google Workspace yang ingin digunakan sebagai pengirim resmi.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div
                      style={{
                        display: 'flex',
                        gap: 12,
                        background: 'var(--adm-card-inner)',
                        border: '1px solid var(--adm-border)',
                        borderRadius: 8,
                        padding: '0.9rem',
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: '#0d9488',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        2
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: 'var(--adm-text)', fontSize: '0.88rem' }}>
                          Pastikan "Verifikasi 2 Langkah" Berstatus AKTIF
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--adm-muted)' }}>
                          Pada bagian <em>"Cara Anda login ke Google"</em>, pastikan menu <strong>Verifikasi 2 Langkah (2-Step Verification)</strong> telah dalam kondisi <strong>Aktif</strong>. Google mewajibkan fitur keamanan ini aktif sebelum Anda dapat membuat Sandi Aplikasi.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div
                      style={{
                        display: 'flex',
                        gap: 12,
                        background: 'var(--adm-card-inner)',
                        border: '1px solid var(--adm-border)',
                        borderRadius: 8,
                        padding: '0.9rem',
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: '#0d9488',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        3
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: 'var(--adm-text)', fontSize: '0.88rem' }}>
                          Cari & Buka Menu "Sandi Aplikasi" (App Passwords)
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--adm-muted)' }}>
                          Pada kotak pencarian di bagian atas halaman Akun Google, ketik kata kunci <code>Sandi Aplikasi</code> (atau <code>App Passwords</code> jika akun dalam bahasa Inggris). Klik hasil pencarian tersebut.
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div
                      style={{
                        display: 'flex',
                        gap: 12,
                        background: 'var(--adm-card-inner)',
                        border: '1px solid var(--adm-border)',
                        borderRadius: 8,
                        padding: '0.9rem',
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: '#0d9488',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        4
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: 'var(--adm-text)', fontSize: '0.88rem' }}>
                          Beri Nama & Hasilkan 16 Karakter Sandi Khusus
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--adm-muted)' }}>
                          Ketik nama aplikasi pengingat, misalnya: <code>Website RFQ Intersis</code>, lalu klik tombol <strong>Buat (Create)</strong>. Google akan menampilkan jendela kuning berisi <strong>16 karakter huruf khusus</strong> (contoh: <code>abcd efgh ijkl mnop</code>).
                        </p>
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div
                      style={{
                        display: 'flex',
                        gap: 12,
                        background: 'var(--adm-card-inner)',
                        border: '1px solid var(--adm-border)',
                        borderRadius: 8,
                        padding: '0.9rem',
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: '#0d9488',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        5
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: 'var(--adm-text)', fontSize: '0.88rem' }}>
                          Salin & Tempel ke Formulir Admin Ini
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--adm-muted)' }}>
                          Salin ke-16 huruf tersebut <strong>tanpa tanda spasi</strong> (contoh: <code>abcdefghijklmnop</code>), lalu tempelkan ke kolom <strong>Password SMTP</strong> pada halaman admin ini. Setelah itu, klik tombol <strong>Simpan Pengaturan Email</strong>.
                        </p>
                      </div>
                    </div>

                    {/* Step 6 */}
                    <div
                      style={{
                        display: 'flex',
                        gap: 12,
                        background: 'rgba(13, 148, 136, 0.05)',
                        border: '1.5px solid rgba(13, 148, 136, 0.4)',
                        borderRadius: 8,
                        padding: '0.9rem',
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: '#0d9488',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        6
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#0d9488', fontSize: '0.88rem' }}>
                          Lakukan Uji Coba Pengiriman (Live Test Email)
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--adm-muted)' }}>
                          Di bagian bawah form terdapat kotak <em>"Uji Coba Pengiriman Email (Live Test)"</em>. Masukkan alamat email Anda, lalu klik tombol <strong>Kirim Test Email</strong>. Jika status hijau muncul dan email uji coba mendarat di inbox Anda, setup telah <strong>100% Selesai & Berhasil</strong>!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CATATAN PENTING & PENCEGAHAN ERROR MASA DEPAN */}
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.05)',
                      border: '1.5px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: 10,
                      padding: '1rem 1.25rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.65rem' }}>
                      <AlertTriangle size={18} style={{ color: '#ef4444' }} />
                      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#ef4444' }}>
                        Catatan Penting Pencegahan Masalah di Masa Depan:
                      </h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.8125rem', color: 'var(--adm-text)' }}>
                      <div>
                        <strong>1. Dilarang Memasukkan Password Login Email Biasa:</strong> Google telah menonaktifkan fitur <em>"Less Secure Apps"</em>. Jika Anda memasukkan password akun biasa, sistem akan selalu gagal dengan error <code>535 5.7.8 Authentication Failed</code>. Anda <strong>wajib</strong> membuat 16 digit Sandi Aplikasi (App Password).
                      </div>
                      <div>
                        <strong>2. Aturan Pasangan Port dan SSL:</strong> Gunakan Port <code>587</code> dengan SSL <strong>TIDAK DICENTANG</strong>. Kesalahan mencentang SSL pada Port 587 akan menyebabkan koneksi membeku (time-out) dengan pesan <code>ETIMEDOUT</code>.
                      </div>
                      <div>
                        <strong>3. Batasan Kuota Pengiriman:</strong> Akun Google gratis memiliki kuota pengiriman hingga 500 email per hari, sedangkan Google Workspace berbayar hingga 2.000 email per hari. Jangan gunakan sistem ini untuk broadcast promosi massal (spam blast) agar akun perusahaan Anda tidak disuspend oleh pihak Google.
                      </div>
                      <div>
                        <strong>4. Selalu Uji Coba Ulang jika Mengubah Password:</strong> Jika di kemudian hari akun Google Anda berganti password, Sandi Aplikasi mungkin perlu dibuat ulang. Selalu gunakan tombol <em>"Kirim Test Email"</em> untuk memastikan pengiriman tetap lancar.
                      </div>
                    </div>
                  </div>

                  {/* Catatan Tambahan cPanel (Sebagai alternatif jika klien punya webmail hosting) */}
                  <div
                    style={{
                      background: 'var(--adm-card-inner)',
                      border: '1px dashed var(--adm-border)',
                      borderRadius: 8,
                      padding: '0.75rem 1rem',
                      fontSize: '0.78rem',
                      color: 'var(--adm-muted)',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'var(--adm-text)' }}>
                      Punya email domain cPanel sendiri (bukan Google)?
                    </span>{' '}
                    Jika Anda lebih memilih menggunakan email domain hosting cPanel (contoh: <code>sales@globalphilsonic.com</code> langsung dari hosting): Isi Host: <code>mail.domainanda.com</code>, Port: <code>465</code> (Centang SSL), atau Port: <code>587</code> (SSL Tidak Dicentang), dan gunakan password akun email hosting Anda.
                  </div>
                </div>

                {/* Modal Footer */}
                <div
                  style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid var(--adm-border)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    background: 'var(--adm-card-inner)',
                  }}
                >
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary"
                    onClick={() => setShowSmtpGuideModal(false)}
                    style={{ minWidth: 120 }}
                  >
                    Saya Mengerti
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
