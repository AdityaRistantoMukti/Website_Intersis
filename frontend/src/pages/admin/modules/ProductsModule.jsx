import { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Package,
  Layers,
  Sliders,
  Send,
  FileCheck,
} from 'lucide-react';
import api, { extractErrorMessage } from '../../../lib/api';
import { translateContent } from '../../../lib/translator';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import LanguageTabControl from '../../../components/admin/LanguageTabControl';

export default function ProductsModule() {
  const { addToast } = useAdminAuth();
  const [activeSection, setActiveSection] = useState('header_chips');
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [translatingKey, setTranslatingKey] = useState(null);

  // Active language per section
  const [langMap, setLangMap] = useState({
    header_chips: 'id',
    categories: 'id',
    rfq_workflow: 'id',
  });

  const setSectionLang = (sec, lang) => {
    setLangMap((prev) => ({ ...prev, [sec]: lang }));
  };

  // ─── 1. HEADER & CAPABILITY CHIPS STATE ───
  const [headerData, setHeaderData] = useState({
    id: {
      title: 'Katalog Produk & Solusi Perakitan Elektronik Presisi',
      subtitle: 'Portofolio lengkap sistem audio otomotif pintar, prosesor suara DSP, modul SMT densitas tinggi, dan perangkat otomasi industri berstandar IATF 16949.',
      chips: [
        { value: '40+', label: 'SKU Siap Produksi', sub: 'Turnkey OEM / ODM' },
        { value: '80.000 CPH', label: 'Kecepatan Lini SMT', sub: 'Mounter Yamaha & Panasonic' },
        { value: 'IATF 16949', label: 'Standar Mutu Nol Cacat', sub: '& ISO 9001:2015' },
        { value: '45 Menit', label: 'Logistik Bebas Pajak', sub: 'Batam FTZ ke Singapura' },
      ],
    },
    en: {
      title: 'Precision Electronics Product Catalog & Manufacturing Solutions',
      subtitle: 'Complete portfolio of smart automotive headunits, DSP sound processors, high-density SMT modules, and industrial automation equipment certified to IATF 16949.',
      chips: [
        { value: '40+', label: 'Production-Ready SKUs', sub: 'Turnkey OEM / ODM' },
        { value: '80,000 CPH', label: 'SMT Line Capacity', sub: 'Yamaha & Panasonic Mounters' },
        { value: 'IATF 16949', label: 'Zero-Defect Quality Standard', sub: '& ISO 9001:2015' },
        { value: '45 Minutes', label: 'Duty-Free Logistics', sub: 'Batam FTZ to Singapore' },
      ],
    },
  });

  // ─── 2. PRODUCT CATEGORIES STATE ───
  const [categoryData, setCategoryData] = useState({
    id: [
      { key: 'headunit', name: 'Sistem Infotainment & Headunit Cerdas', desc: 'Layar sentuh QLED, CarPlay/Android Auto, dan integrasi CAN-Bus otomotif.' },
      { key: 'audio', name: 'Prosesor Audio DSP & Amplifier Kelas D', desc: 'Audio fidelitas tinggi 32-bit floating point dengan efisiensi daya maksimal.' },
      { key: 'dashcam', name: 'Kamera Dasbor & Sensor Keselamatan ADAS', desc: 'Perekam 4K Sony STARVIS 2 dengan peringatan tabrakan pintar dan superkapasitor.' },
      { key: 'automation', name: 'Jig Uji Fungsional (FCT) & Otomasi', desc: 'Mesin uji otomatis berkecepatan tinggi dengan integrasi barcode cloud MES.' },
      { key: 'ems', name: 'Manufaktur Kontrak EMS & Perakitan PCB', desc: 'Layanan terpadu SMT, through-hole, coating konformal, hingga box-build.' },
    ],
    en: [
      { key: 'headunit', name: 'Smart Infotainment & Head Unit Systems', desc: 'QLED touch display, CarPlay/Android Auto, and automotive CAN-Bus integration.' },
      { key: 'audio', name: 'DSP Audio Processors & Class-D Amplifiers', desc: '32-bit floating-point high-fidelity sound processing with supreme power efficiency.' },
      { key: 'dashcam', name: 'Dashcams & ADAS Vision Safety Systems', desc: '4K Sony STARVIS 2 recording with smart collision warnings and heat supercapacitors.' },
      { key: 'automation', name: 'Functional Test Jigs (FCT) & Automation', desc: 'High-speed automated testing machines with cloud-based MES barcode traceability.' },
      { key: 'ems', name: 'Contract EMS & Full Turnkey PCBA', desc: 'Turnkey SMT, through-hole soldering, conformal coating, to complete box-build.' },
    ],
  });

  // ─── 3. RFQ BANNER & WORKFLOW STEPS STATE ───
  const [rfqWorkflowData, setRfqWorkflowData] = useState({
    id: {
      rfqTitle: 'Konsultasikan Kebutuhan Perakitan Elektronik Anda',
      rfqSubtitle: 'Diskusikan kebutuhan spesifikasi teknis dan dapatkan evaluasi DFM serta kalkulasi penawaran resmi dari tim engineering kami di Batam FTZ.',
      rfqButton: 'Kirim Permintaan Penawaran (RFQ)',
      steps: [
        { step: '01', title: 'Analisis RFQ & Review BOM', desc: 'Evaluasi mendalam spesifikasi teknis, ketersediaan komponen, dan kalkulasi penawaran resmi dalam 24-48 jam.' },
        { step: '02', title: 'Rekayasa DFM & Rapid Prototyping', desc: 'Optimalisasi layout Design-for-Manufacturing (DFM) untuk menjamin yield SMT maksimal dan pembuatan sampel uji.' },
        { step: '03', title: 'Tooling, Stensil & Pilot Run', desc: 'Fabrikasi stensil laser elektropolis serta pengujian perakitan batch awal terkontrol untuk validasi toleransi.' },
        { step: '04', title: 'Validasi Kualitas 100% (SPI, AOI, ICT)', desc: 'Inspeksi pasta solder 3D, inspeksi optik otomatis AOI, validasi jalur kelistrikan ICT, dan uji termal ekstrem.' },
        { step: '05', title: 'Produksi Massal & Ekspor FTZ', desc: 'Perakitan massal berkecepatan 80.000 CPH, integrasi serialisasi barcode MES, dan pengiriman 45 menit ke Singapura.' },
      ],
    },
    en: {
      rfqTitle: 'Consult Your Electronics Manufacturing Project',
      rfqSubtitle: 'Discuss your technical specifications and receive DFM feasibility evaluation and formal quotations from our Batam FTZ engineering team.',
      rfqButton: 'Request an Engineering Quote (RFQ)',
      steps: [
        { step: '01', title: 'RFQ Analysis & BOM Review', desc: 'In-depth evaluation of technical specifications, component availability, and official cost calculation in 24-48 hours.' },
        { step: '02', title: 'DFM Engineering & Rapid Prototyping', desc: 'Design-for-Manufacturing layout optimization to ensure maximum SMT yield and functional prototype qualification.' },
        { step: '03', title: 'Tooling, Stencils & Pilot Run', desc: 'Electro-polished laser stencil fabrication and controlled pilot production batches to qualify machinery tolerances.' },
        { step: '04', title: '100% Quality Validation (SPI, AOI, ICT)', desc: '3D solder paste inspection, automated optical AOI, in-circuit electrical testing, and dynamic thermal burn-in.' },
        { step: '05', title: 'Mass Assembly & FTZ Logistics', desc: '80,000 CPH mass assembly lines, real-time MES barcode serialization, and 45-minute express transit to Singapore seaport.' },
      ],
    },
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchProductsData() {
      try {
        setLoading(true);
        const [headRes, catRes, rfqRes] = await Promise.allSettled([
          api.get('/public/site-settings/products_header'),
          api.get('/public/site-settings/products_categories'),
          api.get('/public/site-settings/products_rfq'),
        ]);

        if (isMounted) {
          const loadBilingual = (res, setter) => {
            if (res.status === 'fulfilled' && res.value.data?.data) {
              const d = res.value.data.data;
              if (d.id && d.en) {
                setter(d);
              } else if (d.id) {
                setter((prev) => ({ ...prev, id: d.id, en: d.en || prev.en }));
              }
            }
          };

          loadBilingual(headRes, setHeaderData);
          loadBilingual(catRes, setCategoryData);
          loadBilingual(rfqRes, setRfqWorkflowData);
        }
      } catch (err) {
        addToast(extractErrorMessage(err), 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchProductsData();
    return () => { isMounted = false; };
  }, [addToast]);

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
        <p style={{ color: '#94a3b8' }}>Memuat konfigurasi konten Produk & Solusi...</p>
      </div>
    );
  }

  const sectionsList = [
    { id: 'header_chips', label: '1. Header & 4 Chip Kapabilitas', icon: Sliders },
    { id: 'categories', label: '2. Kategori Produk', icon: Package },
    { id: 'rfq_workflow', label: '3. Banner RFQ & Siklus 5-Langkah', icon: FileCheck },
  ];

  const currentHeadLang = langMap.header_chips;
  const currentHead = headerData[currentHeadLang] || headerData.id;

  const currentCatLang = langMap.categories;
  const currentCat = categoryData[currentCatLang] || categoryData.id;

  const currentRfqLang = langMap.rfq_workflow;
  const currentRfq = rfqWorkflowData[currentRfqLang] || rfqWorkflowData.id;

  return (
    <div className="admin-module">
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
          Manajemen Konten Halaman Produk & Solusi
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          Kelola judul katalog produk, metrik kapabilitas chip, daftar kategori produk, dan alur permohonan penawaran rekayasa (RFQ) per section.
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

      {/* ── SECTION 1: HEADER & CHIPS ── */}
      {activeSection === 'header_chips' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 1: Header Halaman & 4 Chip Kapabilitas</h3>
              <p className="admin-card-subtitle">
                Atur judul halaman produk, deskripsi pengantar, dan 4 kartu badge statistik.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'products_header'}
              onClick={() => handleSaveSection('products_header', headerData, 'Header & Kapabilitas')}
            >
              <Save size={16} />
              <span>{savingKey === 'products_header' ? 'Menyimpan...' : 'Simpan Header'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentHeadLang}
            onSelectLang={(lang) => setSectionLang('header_chips', lang)}
            onTranslate={() => handleAutoTranslate('header_chips', headerData.id, setHeaderData)}
            isTranslating={translatingKey === 'header_chips'}
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

            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0', margin: '1.5rem 0 1rem' }}>
              4 Kartu Badge Kapabilitas
            </h4>
            <div className="admin-form-grid admin-form-grid-2">
              {currentHead.chips?.map((chip, idx) => (
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
                    <label className="admin-label">Nilai / Angka</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={chip.value || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHeaderData((prev) => {
                          const copyId = [...prev.id.chips];
                          const copyEn = [...prev.en.chips];
                          if (copyId[idx]) copyId[idx] = { ...copyId[idx], value: val };
                          if (copyEn[idx]) copyEn[idx] = { ...copyEn[idx], value: val };
                          return { ...prev, id: { ...prev.id, chips: copyId }, en: { ...prev.en, chips: copyEn } };
                        });
                      }}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-label">Label Utama ({currentHeadLang.toUpperCase()})</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={chip.label || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHeaderData((prev) => {
                          const lang = currentHeadLang;
                          const copy = [...prev[lang].chips];
                          copy[idx] = { ...copy[idx], label: val };
                          return { ...prev, [lang]: { ...prev[lang], chips: copy } };
                        });
                      }}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Sub Keterangan ({currentHeadLang.toUpperCase()})</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={chip.sub || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHeaderData((prev) => {
                          const lang = currentHeadLang;
                          const copy = [...prev[lang].chips];
                          copy[idx] = { ...copy[idx], sub: val };
                          return { ...prev, [lang]: { ...prev[lang], chips: copy } };
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

      {/* ── SECTION 2: CATEGORIES ── */}
      {activeSection === 'categories' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 2: Kategori Produk & Lini Manufaktur</h3>
              <p className="admin-card-subtitle">
                Atur nama kategori dan deskripsi singkat yang menjadi filter di halaman produk.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'products_categories'}
              onClick={() => handleSaveSection('products_categories', categoryData, 'Kategori Produk')}
            >
              <Save size={16} />
              <span>{savingKey === 'products_categories' ? 'Menyimpan...' : 'Simpan Kategori'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentCatLang}
            onSelectLang={(lang) => setSectionLang('categories', lang)}
            onTranslate={() => handleAutoTranslate('categories', categoryData.id, setCategoryData)}
            isTranslating={translatingKey === 'categories'}
          />

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-grid admin-form-grid-2">
              {currentCat.map((cat, idx) => (
                <div
                  key={cat.key || idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid #1e293b',
                    borderRadius: 8,
                    padding: '1.15rem',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2dd4bf', fontFamily: 'monospace' }}>
                    KEY: {cat.key}
                  </span>
                  <div className="admin-form-group" style={{ marginTop: '0.5rem' }}>
                    <label className="admin-label">Nama Kategori ({currentCatLang.toUpperCase()})</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={cat.name || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCategoryData((prev) => {
                          const lang = currentCatLang;
                          const copy = [...prev[lang]];
                          copy[idx] = { ...copy[idx], name: val };
                          return { ...prev, [lang]: copy };
                        });
                      }}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Deskripsi Singkat ({currentCatLang.toUpperCase()})</label>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={cat.desc || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCategoryData((prev) => {
                          const lang = currentCatLang;
                          const copy = [...prev[lang]];
                          copy[idx] = { ...copy[idx], desc: val };
                          return { ...prev, [lang]: copy };
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

      {/* ── SECTION 3: RFQ & 5-STAGE WORKFLOW ── */}
      {activeSection === 'rfq_workflow' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 3: Banner RFQ & Alur Proses 5-Langkah</h3>
              <p className="admin-card-subtitle">
                Atur banner ajakan penawaran RFQ dan 5 tahap alur rekayasa dari evaluasi DFM hingga ekspor FTZ.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'products_rfq'}
              onClick={() => handleSaveSection('products_rfq', rfqWorkflowData, 'Banner RFQ & Alur')}
            >
              <Save size={16} />
              <span>{savingKey === 'products_rfq' ? 'Menyimpan...' : 'Simpan Banner RFQ'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentRfqLang}
            onSelectLang={(lang) => setSectionLang('rfq_workflow', lang)}
            onTranslate={() => handleAutoTranslate('rfq_workflow', rfqWorkflowData.id, setRfqWorkflowData)}
            isTranslating={translatingKey === 'rfq_workflow'}
          />

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Judul Banner RFQ ({currentRfqLang.toUpperCase()})</label>
              <input
                type="text"
                className="admin-input"
                value={currentRfq.rfqTitle || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setRfqWorkflowData((prev) => ({
                    ...prev,
                    [currentRfqLang]: { ...prev[currentRfqLang], rfqTitle: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Subjudul Penjelasan ({currentRfqLang.toUpperCase()})</label>
              <textarea
                rows={2}
                className="admin-textarea"
                value={currentRfq.rfqSubtitle || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setRfqWorkflowData((prev) => ({
                    ...prev,
                    [currentRfqLang]: { ...prev[currentRfqLang], rfqSubtitle: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Teks Tombol Aksi ({currentRfqLang.toUpperCase()})</label>
              <input
                type="text"
                className="admin-input"
                value={currentRfq.rfqButton || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setRfqWorkflowData((prev) => ({
                    ...prev,
                    [currentRfqLang]: { ...prev[currentRfqLang], rfqButton: val },
                  }));
                }}
              />
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0', margin: '1.5rem 0 1rem' }}>
              5 Langkah Alur Proses Rekayasa & Manufaktur
            </h4>
            <div className="admin-form-grid admin-form-grid-2">
              {currentRfq.steps?.map((st, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.4)',
                    border: '1px solid #1e293b',
                    borderRadius: 8,
                    padding: '1.15rem',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2dd4bf', fontFamily: 'monospace' }}>
                    LANGKAH {st.step}
                  </span>
                  <div className="admin-form-group" style={{ marginTop: '0.5rem' }}>
                    <label className="admin-label">Judul Langkah ({currentRfqLang.toUpperCase()})</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={st.title || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRfqWorkflowData((prev) => {
                          const lang = currentRfqLang;
                          const copy = [...prev[lang].steps];
                          copy[idx] = { ...copy[idx], title: val };
                          return { ...prev, [lang]: { ...prev[lang], steps: copy } };
                        });
                      }}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Deskripsi Rinci ({currentRfqLang.toUpperCase()})</label>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={st.desc || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRfqWorkflowData((prev) => {
                          const lang = currentRfqLang;
                          const copy = [...prev[lang].steps];
                          copy[idx] = { ...copy[idx], desc: val };
                          return { ...prev, [lang]: { ...prev[lang], steps: copy } };
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
    </div>
  );
}
