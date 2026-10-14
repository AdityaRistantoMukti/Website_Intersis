import { useState, useEffect } from 'react';
import {
  Globe,
  Upload,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Info,
  Lock,
  Search,
  Eye,
} from 'lucide-react';
import api, { getImageUrl, extractErrorMessage } from '../../../lib/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { useBranding, DEFAULT_BRANDING } from '../../../context/BrandingContext';
import './BrandingModule.css';

export default function BrandingModule() {
  const { addToast } = useAdminAuth();
  const { branding, refreshBranding, applyFavicon } = useBranding();

  const [siteName, setSiteName] = useState(DEFAULT_BRANDING.site_name);
  const [tagline, setTagline] = useState(DEFAULT_BRANDING.tagline);
  const [logoUrl, setLogoUrl] = useState(DEFAULT_BRANDING.logo_url);
  const [faviconUrl, setFaviconUrl] = useState(DEFAULT_BRANDING.favicon_url);
  const [metaSeparator, setMetaSeparator] = useState(DEFAULT_BRANDING.meta_title_separator);
  const [titleFormat, setTitleFormat] = useState(DEFAULT_BRANDING.title_format);

  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [faviconPreview, setFaviconPreview] = useState('');

  const [saving, setSaving] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Tab preview simulation selector
  const [previewPage, setPreviewPage] = useState('home');

  useEffect(() => {
    if (branding) {
      setSiteName(branding.site_name || DEFAULT_BRANDING.site_name);
      setTagline(branding.tagline || DEFAULT_BRANDING.tagline);
      setLogoUrl(branding.logo_url || DEFAULT_BRANDING.logo_url);
      setFaviconUrl(branding.favicon_url || DEFAULT_BRANDING.favicon_url);
      setMetaSeparator(branding.meta_title_separator || DEFAULT_BRANDING.meta_title_separator);
      setTitleFormat(branding.title_format || DEFAULT_BRANDING.title_format);
    }
  }, [branding]);

  // Handle Favicon File Selection & Auto-Upload
  const handleFaviconFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.ico', '.png', '.svg', '.jpg', '.jpeg', '.webp'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(ext)) {
      addToast('Format favicon harus berupa .ICO, .PNG, .SVG, .JPG, atau .WEBP.', 'error');
      return;
    }

    setFaviconFile(file);
    const localUrl = URL.createObjectURL(file);
    setFaviconPreview(localUrl);

    // Upload directly with previous file cleanup
    setUploadingFavicon(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'branding');
      if (faviconUrl && faviconUrl.startsWith('/uploads/')) {
        formData.append('previous_url', faviconUrl);
      }

      const res = await api.post('/admin/upload', formData);
      if (res.data?.data?.url) {
        const uploadedPath = res.data.data.url;
        setFaviconUrl(uploadedPath);
        applyFavicon(uploadedPath);
        addToast('File Favicon berhasil diunggah (file lama dibersihkan)! Klik "Simpan Pengaturan" untuk menetapkan.', 'success');
      }
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setUploadingFavicon(false);
    }
  };

  // Handle Logo File Selection & Auto-Upload with previous file cleanup
  const handleLogoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('File logo harus berupa gambar (JPG, PNG, WEBP, SVG).', 'error');
      return;
    }

    setLogoFile(file);
    const localUrl = URL.createObjectURL(file);
    setLogoPreview(localUrl);

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'branding');
      if (logoUrl && logoUrl.startsWith('/uploads/')) {
        formData.append('previous_url', logoUrl);
      }

      const res = await api.post('/admin/upload', formData);
      if (res.data?.data?.url) {
        const uploadedPath = res.data.data.url;
        setLogoUrl(uploadedPath);
        addToast('File Logo Perusahaan berhasil diunggah (file lama dibersihkan)!', 'success');
      }
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Live Test Favicon on Current Browser Tab
  const handleTestFavicon = () => {
    const currentFav = faviconPreview || faviconUrl;
    applyFavicon(currentFav);
    addToast('Favicon diterapkan secara instan ke tab browser aktif ini!', 'info');
  };

  // Reset to Defaults (with cleanup of uploaded files)
  const handleResetDefaults = () => {
    if (faviconUrl && faviconUrl.startsWith('/uploads/')) {
      api.delete('/admin/upload', { data: { file_url: faviconUrl } }).catch(() => {});
    }
    if (logoUrl && logoUrl.startsWith('/uploads/')) {
      api.delete('/admin/upload', { data: { file_url: logoUrl } }).catch(() => {});
    }
    setFaviconUrl(DEFAULT_BRANDING.favicon_url);
    setLogoUrl(DEFAULT_BRANDING.logo_url);
    setFaviconPreview('');
    setLogoPreview('');
    applyFavicon(DEFAULT_BRANDING.favicon_url);
    addToast('Logo dan Favicon dikembalikan ke default & file upload server dibersihkan.', 'info');
  };

  // Save Settings
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        site_name: siteName.trim(),
        tagline: tagline.trim(),
        logo_url: logoUrl,
        favicon_url: faviconUrl,
        meta_title_separator: metaSeparator,
        title_format: titleFormat,
      };

      const res = await api.put('/admin/site-settings/site_branding', payload);
      addToast(res.data?.message || 'Identitas website & logo URL berhasil disimpan!', 'success');

      // Refresh application branding context
      await refreshBranding();
      applyFavicon(faviconUrl);
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  // Simulated browser tab titles based on best practice
  const getSimulatedTitle = () => {
    if (titleFormat === 'brand_only') {
      return siteName;
    }
    switch (previewPage) {
      case 'home':
        return `${siteName} ${metaSeparator} ${tagline}`;
      case 'about':
        return `Tentang Kami ${metaSeparator} ${siteName}`;
      case 'products':
        return `Produk & Solusi Engineering ${metaSeparator} ${siteName}`;
      case 'automation':
        return `Otomasi Industri & Robotik ${metaSeparator} ${siteName}`;
      case 'career':
        return `Karir & Rekrutmen ${metaSeparator} ${siteName}`;
      case 'contact':
        return `Hubungi Kami ${metaSeparator} ${siteName}`;
      default:
        return `${siteName} ${metaSeparator} ${tagline}`;
    }
  };

  const getSimulatedUrl = () => {
    const base = 'https://globalphilsonic.com';
    switch (previewPage) {
      case 'home': return base;
      case 'about': return `${base}/about`;
      case 'products': return `${base}/products`;
      case 'automation': return `${base}/automation`;
      case 'career': return `${base}/career`;
      case 'contact': return `${base}/contact`;
      default: return base;
    }
  };

  const resolvedFavicon = faviconPreview || getImageUrl(faviconUrl) || '/images/logo_company.jpg';
  const resolvedLogo = logoPreview || getImageUrl(logoUrl) || '/images/logo_company.jpg';

  return (
    <div className="admin-branding-module">
      {/* ── HEADER ── */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">
              <Globe size={18} />
              <span>Logo & Identitas Website (Favicon Tab URL & Brand)</span>
            </h2>
            <p className="admin-card-desc">
              Kelola logo browser tab (Favicon pada URL bar peramban), logo resmi perusahaan pada Navbar & Footer, serta konfigurasi format judul halaman.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={handleTestFavicon}
              title="Coba pasang favicon ke tab browser ini sekarang juga"
            >
              <Eye size={14} />
              <span>Uji Favicon di Tab Ini</span>
            </button>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={handleResetDefaults}
              title="Kembalikan ke logo awal"
            >
              <RotateCcw size={14} />
              <span>Reset Default</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="branding-grid">
            {/* ── CARD 1: FAVICON (LOGO TAB URL BROWSER) ── */}
            <div className="branding-upload-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="admin-label" style={{ margin: 0, fontWeight: 700 }}>
                  1. Logo Tab Browser / URL (Favicon)
                </label>
                <span className="admin-tag">Tampil di Tab URL</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--adm-muted)', margin: 0 }}>
                Ikon resmi yang tampil di sebelah kiri judul tab peramban (Chrome, Edge, Safari, Firefox) dan pada daftar bookmark.
              </p>

              <div className="branding-preview-container">
                <div className="branding-favicon-preview">
                  <img
                    src={resolvedFavicon}
                    alt="Favicon Preview"
                    onError={(e) => { e.target.src = '/images/logo_company.jpg'; }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--adm-text)', marginBottom: '3px' }}>
                    Ukuran Optimal: 32x32 atau 64x64 px
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--adm-muted)', marginBottom: '10px' }}>
                    Format: .ICO, .PNG, .SVG, atau .WEBP (Maks 2MB)
                  </div>

                  <label className="admin-btn-file-select" style={{ display: 'inline-flex' }}>
                    <input
                      type="file"
                      accept=".ico,image/png,image/svg+xml,image/jpeg,image/webp"
                      onChange={handleFaviconFileChange}
                      style={{ display: 'none' }}
                      disabled={uploadingFavicon}
                    />
                    <Upload size={14} />
                    <span>{uploadingFavicon ? 'Mengunggah...' : 'Pilih File Favicon'}</span>
                  </label>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label" style={{ fontSize: '0.8rem' }}>Atau Masukkan URL Path Favicon Langsung</label>
                <input
                  type="text"
                  className="admin-text-input"
                  value={faviconUrl}
                  onChange={(e) => {
                    setFaviconUrl(e.target.value);
                    setFaviconPreview('');
                  }}
                  placeholder="/images/logo_company.jpg atau https://..."
                />
              </div>
            </div>

            {/* ── CARD 2: LOGO RESMI WEBSITE (NAVBAR & FOOTER) ── */}
            <div className="branding-upload-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="admin-label" style={{ margin: 0, fontWeight: 700 }}>
                  2. Logo Utama Website (Navbar & Footer)
                </label>
                <span className="admin-tag">Header & Brand</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--adm-muted)', margin: 0 }}>
                Logo identitas perusahaan yang tampil di sudut kiri atas navigasi, footer halaman, dan portal login admin.
              </p>

              <div className="branding-preview-container">
                <div className="branding-logo-preview">
                  <img
                    src={resolvedLogo}
                    alt="Logo Preview"
                    onError={(e) => { e.target.src = '/images/logo_company.jpg'; }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--adm-text)', marginBottom: '3px' }}>
                    Rekomendasi: Background Transparan (PNG/SVG)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--adm-muted)', marginBottom: '10px' }}>
                    Rasio lebar/persegi, format JPG, PNG, SVG, WEBP
                  </div>

                  <label className="admin-btn-file-select" style={{ display: 'inline-flex' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileChange}
                      style={{ display: 'none' }}
                      disabled={uploadingLogo}
                    />
                    <Upload size={14} />
                    <span>{uploadingLogo ? 'Mengunggah...' : 'Pilih File Logo'}</span>
                  </label>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label" style={{ fontSize: '0.8rem' }}>Atau Masukkan URL Path Logo Utama</label>
                <input
                  type="text"
                  className="admin-text-input"
                  value={logoUrl}
                  onChange={(e) => {
                    setLogoUrl(e.target.value);
                    setLogoPreview('');
                  }}
                  placeholder="/images/logo_company.jpg atau https://..."
                />
              </div>
            </div>
          </div>

          {/* ── CARD 3: IDENTITAS NAMA & FORMAT TITLE URL ── */}
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0.5rem 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} />
              <span>Identitas Resmi & Aturan Penamaan Judul (Title Tag)</span>
            </h3>

            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-label">Nama Resmi Perusahaan / Website</label>
                <input
                  type="text"
                  className="admin-text-input"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="PT. Global Philsonic Technologies"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Slogan Utama / Value Proposition (Untuk Beranda)</label>
                <input
                  type="text"
                  className="admin-text-input"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Automotive Electronics & Industrial Automation"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Karakter Pemisah Judul (Separator)</label>
                <select
                  className="admin-select"
                  value={metaSeparator}
                  onChange={(e) => setMetaSeparator(e.target.value)}
                >
                  <option value="|">Garis Vertikal (|) — Standar Industri</option>
                  <option value="—">Em Dash (—)</option>
                  <option value="-">Hyphen (-)</option>
                  <option value="•">Bullet Point (•)</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Format Penamaan Judul Website</label>
                <select
                  className="admin-select"
                  value={titleFormat}
                  onChange={(e) => setTitleFormat(e.target.value)}
                >
                  <option value="per_page">
                    Dinamis Per-Halaman: [Nama Halaman] | [Nama Brand] (Direkomendasikan SEO & UX)
                  </option>
                  <option value="brand_only">
                    Seragam: [Hanya Nama Brand Saja di Semua Halaman] (Kurang Dianjurkan)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* ── ACTION SAVE BUTTON ── */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--adm-border)' }}>
            <button
              type="submit"
              className="admin-btn-primary"
              disabled={saving || uploadingFavicon || uploadingLogo}
            >
              <Save size={14} />
              <span>{saving ? 'Menyimpan Konfigurasi...' : 'Simpan Pengaturan Branding & Logo'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── LIVE INTERACTIVE BROWSER TAB PREVIEW ── */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">
              <Eye size={18} />
              <span>Simulasi Tampilan Tab Browser & URL (Live Interactive Preview)</span>
            </h3>
            <p className="admin-card-desc">
              Lihat langsung bagaimana favicon logo dan judul halaman muncul di tab peramban Google Chrome / Microsoft Edge.
            </p>
          </div>

          {/* Preview Page Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--adm-muted)' }}>Simulasikan Halaman:</span>
            <select
              className="admin-select"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}
              value={previewPage}
              onChange={(e) => setPreviewPage(e.target.value)}
            >
              <option value="home">Beranda (Home)</option>
              <option value="about">Tentang Kami (About)</option>
              <option value="products">Katalog Produk (Products)</option>
              <option value="automation">Otomasi (Automation)</option>
              <option value="career">Karir & Rekrutmen</option>
              <option value="contact">Kontak (Contact)</option>
            </select>
          </div>
        </div>

        {/* Browser Mockup Window */}
        <div className="browser-mockup">
          <div className="browser-mockup__header">
            <div className="browser-mockup__top">
              <div className="browser-mockup__traffic-lights">
                <span className="browser-mockup__dot browser-mockup__dot--red" />
                <span className="browser-mockup__dot browser-mockup__dot--yellow" />
                <span className="browser-mockup__dot browser-mockup__dot--green" />
              </div>

              {/* Tabs */}
              <div className="browser-mockup__tabs">
                <div className="browser-mockup__tab">
                  <img
                    src={resolvedFavicon}
                    alt="Tab Favicon"
                    className="browser-mockup__tab-favicon"
                    onError={(e) => { e.target.src = '/images/logo_company.jpg'; }}
                  />
                  <span className="browser-mockup__tab-title">
                    {getSimulatedTitle()}
                  </span>
                  <span className="browser-mockup__tab-close">✕</span>
                </div>
              </div>
            </div>

            {/* Address Bar */}
            <div className="browser-mockup__address-bar">
              <Lock size={12} color="#22c55e" />
              <span className="browser-mockup__address-url">
                {getSimulatedUrl()}
              </span>
            </div>
          </div>

          <div className="browser-mockup__body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img
                src={resolvedLogo}
                alt="Brand Logo"
                style={{ height: '36px', objectFit: 'contain' }}
                onError={(e) => { e.target.src = '/images/logo_company.jpg'; }}
              />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--adm-text)' }}>
                  {siteName}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--adm-muted)' }}>
                  {tagline}
                </div>
              </div>
            </div>
            <span className="admin-tag" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', border: '1px solid #22c55e' }}>
              ● Tab Icon & Title Synchronized
            </span>
          </div>
        </div>
      </div>

      {/* ── GOOGLE SEARCH RESULT (SERP) PREVIEW ── */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">
              <Search size={18} />
              <span>Pratinjau Hasil Pencarian Google (SERP Preview)</span>
            </h3>
            <p className="admin-card-desc">
              Bagaimana mesin pencari Google menampilkan nama brand, logo favicon, dan judul halaman website Anda.
            </p>
          </div>
        </div>

        <div className="serp-mockup">
          <div className="serp-mockup__meta">
            <img
              src={resolvedFavicon}
              alt="Favicon SERP"
              className="serp-mockup__favicon"
              onError={(e) => { e.target.src = '/images/logo_company.jpg'; }}
            />
            <span className="serp-mockup__site-name">{siteName}</span>
            <span className="serp-mockup__url">{getSimulatedUrl()}</span>
          </div>

          <a href="#" onClick={(e) => e.preventDefault()} className="serp-mockup__title">
            {getSimulatedTitle()}
          </a>

          <div className="serp-mockup__desc">
            Manufaktur OEM/ODM terkemuka di Kawasan Bebas Batam (FTZ). Fasilitas perakitan SMT presisi berkecepatan tinggi, sistem audio otomotif canggih, dan otomasi industri berstandar mutu IATF 16949...
          </div>
        </div>
      </div>

      {/* ── BEST PRACTICE PANDUAN PENAMAAN JUDUL BROWSER ── */}
      <div className="best-practice-box">
        <div className="best-practice-box__title">
          <Info size={18} />
          <span>Panduan Best Practice: Apakah Nama Judul Tab Disamakan Saja atau Per-Halaman?</span>
        </div>

        <div className="best-practice-box__content">
          <p style={{ margin: '0 0 8px' }}>
            <strong>Jawaban Standar Industri: Sangat Dianjurkan Menggunakan Nama Dinamis Per-Halaman!</strong>
          </p>
          <p style={{ margin: '0 0 8px' }}>
            Pola penamaan yang direkomendasikan adalah: <code style={{ background: 'var(--adm-bg)', padding: '2px 6px', borderRadius: '4px' }}>[Nama Halaman] | [Nama Resmi Website]</code>
          </p>

          <ul className="best-practice-list">
            <li>
              <strong>1. Pengalaman Pengguna (Multi-Tab Navigation / UX):</strong> Calon klien bisnis (B2B), auditor, atau pelamar kerja sering membuka beberapa tab sekaligus (misal: membuka tab "Produk", tab "Karir", dan tab "Tentang Kami"). Jika semua tab hanya tertulis <em>"PT. Global Philsonic Technologies"</em>, mereka tidak bisa membedakan isi masing-masing tab tanpa mengkliknya satu per satu.
            </li>
            <li>
              <strong>2. Optimalisasi Mesin Pencari (SEO Google):</strong> Google mewajibkan tag <code>&lt;title&gt;</code> yang unik dan deskriptif untuk setiap URL. Jika semua halaman memiliki title yang identik, Google akan mengidentifikasinya sebagai <em>Duplicate Title Tags</em> yang dapat menurunkan peringkat pencarian dan CTR (Click-Through Rate).
            </li>
            <li>
              <strong>3. Kemudahan Riwayat Peramban & Bookmark:</strong> Saat pengunjung mencari halaman di histori browser mereka (Ctrl+H) atau menandai bookmark (Ctrl+D), nama spesifik per-halaman memudahkan mereka menemukan kembali halaman yang dicari.
            </li>
            <li>
              <strong>4. Aturan Khusus Beranda (Homepage):</strong> Khusus halaman utama (Home), gunakan format: <code>[Nama Brand] | [Slogan Utama / Value Proposition]</code> agar reputasi brand tampil maksimal di Google.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
