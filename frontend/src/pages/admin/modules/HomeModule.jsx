import { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Sliders,
  BarChart3,
  Building2,
  Layers,
  Globe2,
  Send,
  HelpCircle,
} from 'lucide-react';
import api, { extractErrorMessage } from '../../../lib/api';
import { translateContent } from '../../../lib/translator';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import LanguageTabControl from '../../../components/admin/LanguageTabControl';

export default function HomeModule() {
  const { addToast } = useAdminAuth();
  const [activeSection, setActiveSection] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [translatingKey, setTranslatingKey] = useState(null);

  // Active language per section ('id' or 'en')
  const [langMap, setLangMap] = useState({
    hero: 'id',
    stats: 'id',
    about_products: 'id',
    lifecycle: 'id',
    footprint: 'id',
    cta: 'id',
  });

  const setSectionLang = (sec, lang) => {
    setLangMap((prev) => ({ ...prev, [sec]: lang }));
  };

  // ─── 1. HERO CAROUSEL & KEYWORDS STATE ───
  const [heroData, setHeroData] = useState({
    id: {
      slides: [
        {
          title: 'Presisi Manufaktur Elektronik Otomotif Batam FTZ',
          subtitle: 'Perakitan SMT berkecepatan 80.000 CPH, modul smart headunit Tier-1, dan sistem DSP audio bersertifikasi IATF 16949 di Kawasan Bebas Batam.',
          actionText: 'Konsultasi Engineering RFQ',
          actionLink: '/contact',
          bgImage: '/images/hero-smt.jpg',
        },
        {
          title: 'Solusi Cerdas Headunit, Audio DSP & Otomasi Batam',
          subtitle: 'Fasilitas cleanroom Class 100K terintegrasi di Batam Free Trade Zone — mitra Tier-1 perakitan OEM/ODM global.',
          actionText: 'Lihat Produk & Spesifikasi',
          actionLink: '/products',
          bgImage: '/images/hero-wave.jpg',
        },
      ],
      keywords: ['Elektronik Otomotif', 'Perakitan SMT Presisi', 'Otomasi Industri', 'Partner OEM / ODM'],
    },
    en: {
      slides: [
        {
          title: 'Precision Automotive Electronics Manufacturing Batam FTZ',
          subtitle: 'High-speed 80,000 CPH SMT placement, Tier-1 automotive smart headunits, and IATF 16949 certified DSP audio systems in Batam Free Trade Zone.',
          actionText: 'Engineering RFQ Consultation',
          actionLink: '/contact',
          bgImage: '/images/hero-smt.jpg',
        },
        {
          title: 'Smart Automotive Headunits, DSP Audio & Automation Batam',
          subtitle: 'Integrated Class 100K cleanroom facility in Batam Free Trade Zone — trusted global Tier-1 OEM/ODM assembly partner.',
          actionText: 'Explore Products & Specs',
          actionLink: '/products',
          bgImage: '/images/hero-wave.jpg',
        },
      ],
      keywords: ['Automotive Electronics', 'Precision SMT Assembly', 'Industrial Automation', 'OEM / ODM Partner'],
    },
  });

  // ─── 2. STATS DECK STATE ───
  const [statsData, setStatsData] = useState({
    id: {
      experience: { value: 10, suffix: '+', label: 'Tahun Pengalaman', sublabel: 'Manufaktur Presisi Batam' },
      capacity: { value: 80, suffix: 'K CPH', label: 'Kapasitas Penempatan SMT', sublabel: 'Lini Berkecepatan Tinggi' },
      area: { value: 10000, suffix: 'm²', label: 'Luas Area Pabrik', sublabel: 'Fasilitas Cleanroom Terkontrol' },
      yieldRate: { value: 99.8, suffix: '%', label: 'Tingkat Yield Lolos Mutu', sublabel: 'Standar Nol-Cacat Otomotif' },
    },
    en: {
      experience: { value: 10, suffix: '+', label: 'Years of Experience', sublabel: 'Precision Manufacturing Batam' },
      capacity: { value: 80, suffix: 'K CPH', label: 'SMT Placement Capacity', sublabel: 'High-Speed Dual-Beam Line' },
      area: { value: 10000, suffix: 'm²', label: 'Factory Floor Area', sublabel: 'Controlled Cleanroom Facility' },
      yieldRate: { value: 99.8, suffix: '%', label: 'Quality First-Pass Yield', sublabel: 'Automotive Zero-Defect Standard' },
    },
  });

  // ─── 3. ABOUT & PRODUCTS HIGHLIGHT STATE ───
  const [aboutProdData, setAboutProdData] = useState({
    id: {
      tagline: 'TENTANG KAMI',
      title: 'Mitra Manufaktur Elektronik Otomotif di Batam Free Trade Zone',
      narrative: 'PT. Global Philsonic Technologies (GPT) adalah produsen perakitan audio dan video otomotif yang berlokasi di Kawasan Perdagangan Bebas Batam, Indonesia. Kami berkomitmen menghadirkan solusi inovatif, berkualitas tinggi, dan efisien biaya bagi setiap mitra bisnis kami.\n\nDengan mengadopsi teknologi mutakhir bertaraf internasional, kami menyediakan layanan menyeluruh mulai dari desain, rekayasa, manufaktur, pengujian fungsional, hingga perakitan produk akhir — semuanya berorientasi pada kebutuhan spesifik pelanggan.',
      highlights: [
        { title: 'Sistem Infotainment & Kokpit', desc: 'Headunit standar OEM dengan panel QLED, prosesor Octa-core, dan Apple CarPlay / Android Auto nirkabel.' },
        { title: 'Prosesor Audio DSP & Amplifier', desc: 'DSP floating-point 32-bit dan amplifier Kelas-D efisiensi tinggi standar Hi-Res Audio.' },
        { title: 'Perakitan SMT Presisi Turnkey', desc: 'Penempatan komponen mikro 01005, PCB hingga 16 layer, dan inspeksi 100% 3D AOI & X-Ray.' },
        { title: 'Jig Uji Fungsional & Otomasi', desc: 'Mesin jig uji otomatis berbasis PLC dan pneumatik servo dengan integrasi pelacakan cloud MES.' },
      ],
    },
    en: {
      tagline: 'ABOUT US',
      title: 'Automotive Electronics Manufacturing Partner in Batam Free Trade Zone',
      narrative: 'PT. Global Philsonic Technologies (GPT) is a dedicated automotive audio and video assembly manufacturer located in the Batam Free Trade Zone, Indonesia. We are committed to providing our customers with innovative, high-quality, and cost-effective solutions.\n\nWe focus on international advanced technologies and provide customer-oriented design, engineering, manufacturing, functional test, and finished product assembly services.',
      highlights: [
        { title: 'Infotainment & Cockpit Systems', desc: 'OEM-grade head units with QLED panels, Octa-core processors, and wireless Apple CarPlay / Android Auto.' },
        { title: 'DSP Audio Processors & Amplifiers', desc: '32-bit floating-point DSP and high-efficiency Class-D amplifiers meeting Hi-Res Audio standards.' },
        { title: 'Turnkey Precision SMT Assembly', desc: '01005 micro-component placement, up to 16-layer PCBs, and 100% inline 3D AOI & X-Ray inspection.' },
        { title: 'Automated Functional Test Jigs', desc: 'PLC-controlled automated test jigs and servo-pneumatic systems integrated with cloud MES tracking.' },
      ],
    },
  });

  // ─── 4. LIFECYCLE 4-STAGE STATE ───
  const [lifecycleData, setLifecycleData] = useState({
    id: {
      sectionTitle: 'Arsitektur Rekayasa & Siklus Manufaktur Terintegrasi',
      sectionSubtitle: 'Empat pilar keunggulan end-to-end yang menjamin kualitas tanpa kompromi dari desain skematik hingga logistik global.',
      stages: [
        { step: '01', title: 'Desain Skematik & Evaluasi DFM', desc: 'Optimasi routing PCB kecepatan tinggi, simulasi termal, dan analisis kelayakan produksi massal (DFM).' },
        { step: '02', title: 'Perakitan SMT Presisi Tinggi', desc: 'Lini mounter berkecepatan 80.000 CPH, solder reflow 10-zona N2 bebas timbal, dan cleanroom Class 100K.' },
        { step: '03', title: 'Otomasi Jig & Pengujian Fungsional', desc: 'Inspeksi 100% 3D SPI/AOI laser scan, uji in-circuit ICT, dan pengujian akustik otomatis <8.5 detik.' },
        { step: '04', title: 'Logistik Bebas Bea Batam FTZ', desc: 'Pengiriman bebas tarif ke pelabuhan Singapura hanya dalam 45 menit untuk konektivitas pasar global.' },
      ],
    },
    en: {
      sectionTitle: 'Integrated Engineering Architecture & Manufacturing Lifecycle',
      sectionSubtitle: 'Four end-to-end pillars guaranteeing uncompromising quality from schematic design to global logistics.',
      stages: [
        { step: '01', title: 'Schematic Design & DFM Evaluation', desc: 'High-speed PCB routing optimization, thermal simulation, and mass-production DFM feasibility analysis.' },
        { step: '02', title: 'High-Precision SMT Assembly', desc: '80,000 CPH high-speed mounter lines, 10-zone N2 lead-free reflow, and Class 100K cleanroom environment.' },
        { step: '03', title: 'Automated Jigs & Functional Testing', desc: '100% 3D SPI/AOI laser inspection, custom ICT test jigs, and automated acoustic functional test under 8.5s.' },
        { step: '04', title: 'Duty-Free Batam FTZ Logistics', desc: '0% tariff export hub with 45-minute direct transit to Singapore transshipment port for worldwide reach.' },
      ],
    },
  });

  // ─── 5. GLOBAL FOOTPRINT STATE ───
  const [footprintData, setFootprintData] = useState({
    id: {
      title: 'Jangkauan Ekspor & Jaringan Pasokan Global',
      subtitle: 'Beroperasi dari Batam Free Trade Zone dengan akses langsung ke pelabuhan internasional Singapura untuk distribusi ke seluruh dunia.',
      stat1: { value: '45 Min', label: 'Transit Kapal Cepat ke Singapura' },
      stat2: { value: '0%', label: 'Tarif Bea Masuk Kawasan FTZ' },
      stat3: { value: 'Global', label: 'Jaringan Ekspor OEM / ODM' },
    },
    en: {
      title: 'Global Export Reach & Supply Chain Network',
      subtitle: 'Operating from Batam Free Trade Zone with direct access to Singapore international port for worldwide customer distribution.',
      stat1: { value: '45 Min', label: 'Fast Sea Transit to Singapore' },
      stat2: { value: '0%', label: 'Customs Duty in Batam FTZ' },
      stat3: { value: 'Global', label: 'OEM / ODM Export Footprint' },
    },
  });

  // ─── 6. CTA BANNER STATE ───
  const [ctaData, setCtaData] = useState({
    id: {
      title: 'Siap Mewujudkan Proyek Elektronik Otomotif Anda?',
      subtitle: 'Diskusikan kebutuhan spesifikasi teknis, estimasi volume perakitan, dan penawaran biaya resmi bersama tim engineering kami di Batam FTZ.',
      buttonText: 'Kirim Permintaan Penawaran (RFQ)',
      buttonLink: '/contact',
    },
    en: {
      title: 'Ready to Accelerate Your Automotive Electronics Project?',
      subtitle: 'Consult your technical specifications, assembly volume projections, and formal quotation with our Batam FTZ engineering team.',
      buttonText: 'Request an Engineering Quote (RFQ)',
      buttonLink: '/contact',
    },
  });

  // Load all settings on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchHomeSettings() {
      try {
        setLoading(true);
        const [heroRes, statsRes, aboutRes, lifeRes, footRes, ctaRes] = await Promise.allSettled([
          api.get('/public/site-settings/home_hero'),
          api.get('/public/site-settings/home_stats'),
          api.get('/public/site-settings/home_about_products'),
          api.get('/public/site-settings/home_lifecycle'),
          api.get('/public/site-settings/home_footprint'),
          api.get('/public/site-settings/home_cta'),
        ]);

        if (isMounted) {
          const loadBilingual = (res, setter) => {
            if (res.status === 'fulfilled' && res.value.data?.data) {
              const d = res.value.data.data;
              if (d.id && d.en) {
                setter(d);
              } else if (d.id) {
                setter((prev) => ({ ...prev, id: d.id, en: d.en || prev.en }));
              } else {
                // Legacy unilingual object -> store under id
                setter((prev) => ({ ...prev, id: d, en: prev.en }));
              }
            }
          };

          loadBilingual(heroRes, setHeroData);
          loadBilingual(statsRes, setStatsData);
          loadBilingual(aboutRes, setAboutProdData);
          loadBilingual(lifeRes, setLifecycleData);
          loadBilingual(footRes, setFootprintData);
          loadBilingual(ctaRes, setCtaData);
        }
      } catch (err) {
        addToast(extractErrorMessage(err), 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchHomeSettings();
    return () => { isMounted = false; };
  }, [addToast]);

  // Generic Save Handler for any section
  const handleSaveSection = async (key, payload, name) => {
    setSavingKey(key);
    try {
      await api.put(`/admin/site-settings/${key}`, payload);
      addToast(`Bagian ${name} berhasil disimpan!`, 'success');
    } catch (err) {
      addToast(extractErrorMessage(err), 'error');
    } finally {
      setSavingKey(null);
    }
  };

  // Generic Auto-Translate Handler
  const handleAutoTranslate = async (sectionKey, sourceIdData, updateState) => {
    setTranslatingKey(sectionKey);
    try {
      addToast('Menerjemahkan teks dari Bahasa Indonesia ke English...', 'info');
      const translatedEn = await translateContent(sourceIdData);
      updateState((prev) => ({
        ...prev,
        en: translatedEn,
      }));
      setSectionLang(sectionKey, 'en');
      addToast('Terjemahan selesai! Teks Bahasa Inggris telah terisi dan dapat Anda edit langsung.', 'success');
    } catch (err) {
      addToast('Gagal menerjemahkan: ' + extractErrorMessage(err), 'error');
    } finally {
      setTranslatingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="admin-spinner" style={{ width: 28, height: 28, margin: '0 auto 1rem' }} />
        <p style={{ color: '#94a3b8' }}>Memuat konfigurasi konten Beranda...</p>
      </div>
    );
  }

  const sectionsList = [
    { id: 'hero', label: '1. Hero Carousel', icon: Sliders },
    { id: 'stats', label: '2. Telemetri Angka', icon: BarChart3 },
    { id: 'about_products', label: '3. Sorotan Produk & Pabrik', icon: Building2 },
    { id: 'lifecycle', label: '4. Siklus Rekayasa 4-Tahap', icon: Layers },
    { id: 'footprint', label: '5. Jaringan Global', icon: Globe2 },
    { id: 'cta', label: '6. Banner Call to Action', icon: Send },
  ];

  const currentHeroLang = langMap.hero;
  const currentHero = heroData[currentHeroLang] || heroData.id;

  const currentStatsLang = langMap.stats;
  const currentStats = statsData[currentStatsLang] || statsData.id;

  const currentAboutLang = langMap.about_products;
  const currentAbout = aboutProdData[currentAboutLang] || aboutProdData.id;

  const currentLifeLang = langMap.lifecycle;
  const currentLife = lifecycleData[currentLifeLang] || lifecycleData.id;

  const currentFootLang = langMap.footprint;
  const currentFoot = footprintData[currentFootLang] || footprintData.id;

  const currentCtaLang = langMap.cta;
  const currentCta = ctaData[currentCtaLang] || ctaData.id;

  return (
    <div className="admin-module">
      {/* Header Info */}
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: '0.35rem' }}>
          Manajemen Konten Halaman Beranda (Home)
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          Semua bagian di halaman utama landing page bisnis dibagi rapi per section di bawah ini.
          Setiap bagian mendukung bilingual (ID & EN) dengan fitur <strong>Terjemahkan Otomatis (ID ke EN)</strong> yang tetap dapat Anda edit kembali secara manual.
        </p>
      </div>

      {/* Divided Section Navigation Tabs */}
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

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 1: HERO CAROUSEL
         ════════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'hero' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 1: Hero Carousel & Keywords</h3>
              <p className="admin-card-subtitle">
                Atur judul slide, subjudul, tombol CTA, background image, dan teks efek mesin tik.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'home_hero'}
              onClick={() => handleSaveSection('home_hero', heroData, 'Hero Carousel')}
            >
              <Save size={16} />
              <span>{savingKey === 'home_hero' ? 'Menyimpan...' : 'Simpan Hero Section'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentHeroLang}
            onSelectLang={(lang) => setSectionLang('hero', lang)}
            onTranslate={() => handleAutoTranslate('hero', heroData.id, setHeroData)}
            isTranslating={translatingKey === 'hero'}
          />

          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--adm-text)' }}>
                Slide Hero ({currentHero.slides?.length || 0} slide aktif dalam {currentHeroLang.toUpperCase()})
              </h4>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8125rem' }}
                onClick={() => {
                  const newSlide = {
                    title: 'Judul Slide Baru',
                    subtitle: 'Deskripsi kapabilitas manufaktur...',
                    actionText: 'Konsultasi Sekarang',
                    actionLink: '/contact',
                    bgImage: '/images/hero-smt.jpg',
                  };
                  setHeroData((prev) => ({
                    ...prev,
                    id: { ...prev.id, slides: [...prev.id.slides, newSlide] },
                    en: { ...prev.en, slides: [...prev.en.slides, { ...newSlide, title: 'New Slide Title', subtitle: 'Manufacturing capability description...' }] },
                  }));
                }}
              >
                <Plus size={14} />
                <span>Tambah Slide</span>
              </button>
            </div>

            {currentHero.slides?.map((slide, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.4)',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  padding: '1.25rem',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--adm-text)' }}>
                    Slide #{idx + 1}
                  </span>
                  {currentHero.slides.length > 1 && (
                    <button
                      type="button"
                      className="admin-btn-action admin-btn-action-delete"
                      onClick={() => {
                        setHeroData((prev) => ({
                          ...prev,
                          id: { ...prev.id, slides: prev.id.slides.filter((_, i) => i !== idx) },
                          en: { ...prev.en, slides: prev.en.slides.filter((_, i) => i !== idx) },
                        }));
                      }}
                      title="Hapus Slide Ini"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Judul Slide ({currentHeroLang.toUpperCase()})</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={slide.title || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setHeroData((prev) => {
                        const targetLang = currentHeroLang;
                        const copy = [...prev[targetLang].slides];
                        copy[idx] = { ...copy[idx], title: val };
                        return { ...prev, [targetLang]: { ...prev[targetLang], slides: copy } };
                      });
                    }}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Subjudul Deskripsi ({currentHeroLang.toUpperCase()})</label>
                  <textarea
                    rows={2}
                    className="admin-textarea"
                    value={slide.subtitle || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setHeroData((prev) => {
                        const targetLang = currentHeroLang;
                        const copy = [...prev[targetLang].slides];
                        copy[idx] = { ...copy[idx], subtitle: val };
                        return { ...prev, [targetLang]: { ...prev[targetLang], slides: copy } };
                      });
                    }}
                  />
                </div>

                <div className="admin-form-grid admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">Teks Tombol Aksi ({currentHeroLang.toUpperCase()})</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={slide.actionText || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHeroData((prev) => {
                          const targetLang = currentHeroLang;
                          const copy = [...prev[targetLang].slides];
                          copy[idx] = { ...copy[idx], actionText: val };
                          return { ...prev, [targetLang]: { ...prev[targetLang], slides: copy } };
                        });
                      }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">URL / Link Tombol</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={slide.actionLink || '/contact'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHeroData((prev) => {
                          const copyId = [...prev.id.slides];
                          const copyEn = [...prev.en.slides];
                          if (copyId[idx]) copyId[idx] = { ...copyId[idx], actionLink: val };
                          if (copyEn[idx]) copyEn[idx] = { ...copyEn[idx], actionLink: val };
                          return { ...prev, id: { ...prev.id, slides: copyId }, en: { ...prev.en, slides: copyEn } };
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">URL Gambar Background (Opsional)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={slide.bgImage || ''}
                    placeholder="/images/hero-smt.jpg"
                    onChange={(e) => {
                      const val = e.target.value;
                      setHeroData((prev) => {
                        const copyId = [...prev.id.slides];
                        const copyEn = [...prev.en.slides];
                        if (copyId[idx]) copyId[idx] = { ...copyId[idx], bgImage: val };
                        if (copyEn[idx]) copyEn[idx] = { ...copyEn[idx], bgImage: val };
                        return { ...prev, id: { ...prev.id, slides: copyId }, en: { ...prev.en, slides: copyEn } };
                      });
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Typewriter Keywords */}
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #1e293b', paddingTop: '1.25rem' }}>
              <label className="admin-label">
                Kata Kunci Efek Mesin Tik (Pisahkan dengan tanda koma) ({currentHeroLang.toUpperCase()})
              </label>
              <input
                type="text"
                className="admin-input"
                value={(currentHero.keywords || []).join(', ')}
                onChange={(e) => {
                  const arr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                  setHeroData((prev) => ({
                    ...prev,
                    [currentHeroLang]: { ...prev[currentHeroLang], keywords: arr },
                  }));
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 2: TELEMETRI ANGKA
         ════════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'stats' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 2: Telemetri Statistik Utama</h3>
              <p className="admin-card-subtitle">
                Atur 4 metrik angka kunci yang muncul di deck statistik beranda.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'home_stats'}
              onClick={() => handleSaveSection('home_stats', statsData, 'Telemetri Angka')}
            >
              <Save size={16} />
              <span>{savingKey === 'home_stats' ? 'Menyimpan...' : 'Simpan Statistik'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentStatsLang}
            onSelectLang={(lang) => setSectionLang('stats', lang)}
            onTranslate={() => handleAutoTranslate('stats', statsData.id, setStatsData)}
            isTranslating={translatingKey === 'stats'}
          />

          <div className="admin-form-grid admin-form-grid-2" style={{ marginTop: '1.25rem' }}>
            {['experience', 'capacity', 'area', 'yieldRate'].map((key) => {
              const item = currentStats[key] || {};
              return (
                <div
                  key={key}
                  style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid #1e293b',
                    borderRadius: 8,
                    padding: '1.25rem',
                  }}
                >
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                    Metrik: {key}
                  </h4>
                  <div className="admin-form-grid admin-form-grid-2">
                    <div className="admin-form-group">
                      <label className="admin-label">Nilai Angka</label>
                      <input
                        type="number"
                        step="any"
                        className="admin-input"
                        value={item.value ?? ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setStatsData((prev) => ({
                            ...prev,
                            id: { ...prev.id, [key]: { ...prev.id[key], value: val } },
                            en: { ...prev.en, [key]: { ...prev.en[key], value: val } },
                          }));
                        }}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-label">Simbol / Suffix</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={item.suffix ?? ''}
                        placeholder="+ atau K CPH atau %"
                        onChange={(e) => {
                          const val = e.target.value;
                          setStatsData((prev) => ({
                            ...prev,
                            id: { ...prev.id, [key]: { ...prev.id[key], suffix: val } },
                            en: { ...prev.en, [key]: { ...prev.en[key], suffix: val } },
                          }));
                        }}
                      />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Label Utama ({currentStatsLang.toUpperCase()})</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={item.label || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStatsData((prev) => ({
                          ...prev,
                          [currentStatsLang]: {
                            ...prev[currentStatsLang],
                            [key]: { ...prev[currentStatsLang][key], label: val },
                          },
                        }));
                      }}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Sublabel Penjelasan ({currentStatsLang.toUpperCase()})</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={item.sublabel || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setStatsData((prev) => ({
                          ...prev,
                          [currentStatsLang]: {
                            ...prev[currentStatsLang],
                            [key]: { ...prev[currentStatsLang][key], sublabel: val },
                          },
                        }));
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 3: ABOUT & PRODUCTS HIGHLIGHT
         ════════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'about_products' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 3: Sorotan Produk & Perusahaan</h3>
              <p className="admin-card-subtitle">
                Atur pengantar ringkasan profil manufaktur dan 4 lini produk utama di beranda.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'home_about_products'}
              onClick={() => handleSaveSection('home_about_products', aboutProdData, 'Sorotan Produk & Perusahaan')}
            >
              <Save size={16} />
              <span>{savingKey === 'home_about_products' ? 'Menyimpan...' : 'Simpan Sorotan'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentAboutLang}
            onSelectLang={(lang) => setSectionLang('about_products', lang)}
            onTranslate={() => handleAutoTranslate('about_products', aboutProdData.id, setAboutProdData)}
            isTranslating={translatingKey === 'about_products'}
          />

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Tagline Overline ({currentAboutLang.toUpperCase()})</label>
              <input
                type="text"
                className="admin-input"
                value={currentAbout.tagline || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setAboutProdData((prev) => ({
                    ...prev,
                    [currentAboutLang]: { ...prev[currentAboutLang], tagline: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Judul Utama Heading ({currentAboutLang.toUpperCase()})</label>
              <input
                type="text"
                className="admin-input"
                value={currentAbout.title || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setAboutProdData((prev) => ({
                    ...prev,
                    [currentAboutLang]: { ...prev[currentAboutLang], title: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Narasi Pengantar Perusahaan ({currentAboutLang.toUpperCase()})</label>
              <textarea
                rows={4}
                className="admin-textarea"
                value={currentAbout.narrative || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setAboutProdData((prev) => ({
                    ...prev,
                    [currentAboutLang]: { ...prev[currentAboutLang], narrative: val },
                  }));
                }}
              />
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--adm-text)', margin: '1.5rem 0 1rem' }}>
              4 Poin Highlight Produk Unggulan
            </h4>
            <div className="admin-form-grid admin-form-grid-2">
              {currentAbout.highlights?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid #1e293b',
                    borderRadius: 8,
                    padding: '1.15rem',
                  }}
                >
                  <div className="admin-form-group">
                    <label className="admin-label">Judul Poin #{idx + 1} ({currentAboutLang.toUpperCase()})</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={item.title || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAboutProdData((prev) => {
                          const lang = currentAboutLang;
                          const copy = [...prev[lang].highlights];
                          copy[idx] = { ...copy[idx], title: val };
                          return { ...prev, [lang]: { ...prev[lang], highlights: copy } };
                        });
                      }}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Deskripsi Poin #{idx + 1} ({currentAboutLang.toUpperCase()})</label>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={item.desc || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAboutProdData((prev) => {
                          const lang = currentAboutLang;
                          const copy = [...prev[lang].highlights];
                          copy[idx] = { ...copy[idx], desc: val };
                          return { ...prev, [lang]: { ...prev[lang], highlights: copy } };
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 4: LIFECYCLE 4-STAGE
         ════════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'lifecycle' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 4: Siklus Rekayasa 4-Tahap</h3>
              <p className="admin-card-subtitle">
                Atur deskripsi 4 pilar manufaktur: DFM, Perakitan SMT, Otomasi Uji, dan Hub Batam FTZ.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'home_lifecycle'}
              onClick={() => handleSaveSection('home_lifecycle', lifecycleData, 'Siklus Rekayasa')}
            >
              <Save size={16} />
              <span>{savingKey === 'home_lifecycle' ? 'Menyimpan...' : 'Simpan Siklus Rekayasa'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentLifeLang}
            onSelectLang={(lang) => setSectionLang('lifecycle', lang)}
            onTranslate={() => handleAutoTranslate('lifecycle', lifecycleData.id, setLifecycleData)}
            isTranslating={translatingKey === 'lifecycle'}
          />

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Judul Bagian ({currentLifeLang.toUpperCase()})</label>
              <input
                type="text"
                className="admin-input"
                value={currentLife.sectionTitle || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setLifecycleData((prev) => ({
                    ...prev,
                    [currentLifeLang]: { ...prev[currentLifeLang], sectionTitle: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Subjudul Penjelasan ({currentLifeLang.toUpperCase()})</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={currentLife.sectionSubtitle || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setLifecycleData((prev) => ({
                    ...prev,
                    [currentLifeLang]: { ...prev[currentLifeLang], sectionSubtitle: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-grid admin-form-grid-2" style={{ marginTop: '1.25rem' }}>
              {currentLife.stages?.map((stage, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid #1e293b',
                    borderRadius: 8,
                    padding: '1.15rem',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--adm-text)', fontFamily: 'monospace' }}>
                    TAHAP {stage.step}
                  </span>
                  <div className="admin-form-group" style={{ marginTop: '0.5rem' }}>
                    <label className="admin-label">Judul Tahap ({currentLifeLang.toUpperCase()})</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={stage.title || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLifecycleData((prev) => {
                          const lang = currentLifeLang;
                          const copy = [...prev[lang].stages];
                          copy[idx] = { ...copy[idx], title: val };
                          return { ...prev, [lang]: { ...prev[lang], stages: copy } };
                        });
                      }}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Deskripsi Rinci ({currentLifeLang.toUpperCase()})</label>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={stage.desc || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLifecycleData((prev) => {
                          const lang = currentLifeLang;
                          const copy = [...prev[lang].stages];
                          copy[idx] = { ...copy[idx], desc: val };
                          return { ...prev, [lang]: { ...prev[lang], stages: copy } };
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 5: GLOBAL REACH & NETWORK
         ════════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'footprint' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 5: Jangkauan Ekspor & Jaringan Global</h3>
              <p className="admin-card-subtitle">
                Atur judul, pengantar, dan metrik jalur logistik ekspor Batam FTZ ke pelabuhan Singapura & dunia.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'home_footprint'}
              onClick={() => handleSaveSection('home_footprint', footprintData, 'Jaringan Global')}
            >
              <Save size={16} />
              <span>{savingKey === 'home_footprint' ? 'Menyimpan...' : 'Simpan Jaringan Global'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentFootLang}
            onSelectLang={(lang) => setSectionLang('footprint', lang)}
            onTranslate={() => handleAutoTranslate('footprint', footprintData.id, setFootprintData)}
            isTranslating={translatingKey === 'footprint'}
          />

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Judul Utama ({currentFootLang.toUpperCase()})</label>
              <input
                type="text"
                className="admin-input"
                value={currentFoot.title || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFootprintData((prev) => ({
                    ...prev,
                    [currentFootLang]: { ...prev[currentFootLang], title: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Subjudul ({currentFootLang.toUpperCase()})</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={currentFoot.subtitle || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFootprintData((prev) => ({
                    ...prev,
                    [currentFootLang]: { ...prev[currentFootLang], subtitle: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-grid admin-form-grid-3">
              {['stat1', 'stat2', 'stat3'].map((stKey) => {
                const s = currentFoot[stKey] || {};
                return (
                  <div
                    key={stKey}
                    style={{
                      background: 'rgba(15, 23, 42, 0.4)',
                      border: '1px solid #1e293b',
                      borderRadius: 8,
                      padding: '1.15rem',
                    }}
                  >
                    <div className="admin-form-group">
                      <label className="admin-label">Nilai / Badge</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={s.value || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFootprintData((prev) => ({
                            ...prev,
                            id: { ...prev.id, [stKey]: { ...prev.id[stKey], value: val } },
                            en: { ...prev.en, [stKey]: { ...prev.en[stKey], value: val } },
                          }));
                        }}
                      />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label className="admin-label">Label Keterangan ({currentFootLang.toUpperCase()})</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={s.label || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFootprintData((prev) => ({
                            ...prev,
                            [currentFootLang]: {
                              ...prev[currentFootLang],
                              [stKey]: { ...prev[currentFootLang][stKey], label: val },
                            },
                          }));
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION 6: CTA BANNER
         ════════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'cta' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 6: Banner Call to Action (CTA)</h3>
              <p className="admin-card-subtitle">
                Atur judul ajakan penawaran RFQ, deskripsi, dan teks tombol konsultasi di akhir halaman.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'home_cta'}
              onClick={() => handleSaveSection('home_cta', ctaData, 'Banner CTA')}
            >
              <Save size={16} />
              <span>{savingKey === 'home_cta' ? 'Menyimpan...' : 'Simpan Banner CTA'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentCtaLang}
            onSelectLang={(lang) => setSectionLang('cta', lang)}
            onTranslate={() => handleAutoTranslate('cta', ctaData.id, setCtaData)}
            isTranslating={translatingKey === 'cta'}
          />

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Judul Ajakan CTA ({currentCtaLang.toUpperCase()})</label>
              <input
                type="text"
                className="admin-input"
                value={currentCta.title || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setCtaData((prev) => ({
                    ...prev,
                    [currentCtaLang]: { ...prev[currentCtaLang], title: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Subjudul Penjelasan ({currentCtaLang.toUpperCase()})</label>
              <textarea
                rows={3}
                className="admin-textarea"
                value={currentCta.subtitle || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setCtaData((prev) => ({
                    ...prev,
                    [currentCtaLang]: { ...prev[currentCtaLang], subtitle: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-grid admin-form-grid-2">
              <div className="admin-form-group">
                <label className="admin-label">Teks Tombol Aksi ({currentCtaLang.toUpperCase()})</label>
                <input
                  type="text"
                  className="admin-input"
                  value={currentCta.buttonText || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCtaData((prev) => ({
                      ...prev,
                      [currentCtaLang]: { ...prev[currentCtaLang], buttonText: val },
                    }));
                  }}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">URL / Link Tombol</label>
                <input
                  type="text"
                  className="admin-input"
                  value={currentCta.buttonLink || '/contact'}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCtaData((prev) => ({
                      ...prev,
                      id: { ...prev.id, buttonLink: val },
                      en: { ...prev.en, buttonLink: val },
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
