import { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Building2,
  Sliders,
  FileText,
  Target,
  Wrench,
  Clock,
  Award,
} from 'lucide-react';
import api, { extractErrorMessage } from '../../../lib/api';
import { translateContent } from '../../../lib/translator';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import LanguageTabControl from '../../../components/admin/LanguageTabControl';

export default function AboutModule() {
  const { addToast } = useAdminAuth();
  const [activeSection, setActiveSection] = useState('header_stats');
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);
  const [translatingKey, setTranslatingKey] = useState(null);

  // Active language per section
  const [langMap, setLangMap] = useState({
    header_stats: 'id',
    narrative_ftz: 'id',
    vision_mission: 'id',
    facilities: 'id',
    timeline: 'id',
    certifications: 'id',
  });

  const setSectionLang = (sec, lang) => {
    setLangMap((prev) => ({ ...prev, [sec]: lang }));
  };

  // ─── 1. HEADER & TELEMETRY STATS ───
  const [headerData, setHeaderData] = useState({
    id: {
      title: 'Solusi Manufaktur Elektronik Otomotif Terdepan di Kawasan Bebas Batam',
      subtitle: 'Didukung fasilitas perakitan SMT berkecepatan 80.000 CPH, cleanroom Class 100K, dan standar mutu IATF 16949 untuk melayani OEM & ODM global.',
      statYears: { value: '10+', label: 'Tahun Pengalaman Rekayasa' },
      statCapacity: { value: '80K', label: 'CPH Kapasitas Penempatan SMT' },
      statArea: { value: '10,000', label: 'm² Area Pabrik & Cleanroom' },
      statYield: { value: '99.8%', label: 'Tingkat Yield Lolos Mutu' },
    },
    en: {
      title: 'Premier Automotive Electronics Manufacturing Solutions in Batam Free Trade Zone',
      subtitle: 'Powered by 80,000 CPH high-speed SMT assembly lines, Class 100K cleanroom, and IATF 16949 quality discipline for global OEM & ODM partners.',
      statYears: { value: '10+', label: 'Years Engineering Experience' },
      statCapacity: { value: '80K', label: 'CPH SMT Placement Capacity' },
      statArea: { value: '10,000', label: 'm² Facility & Cleanroom Area' },
      statYield: { value: '99.8%', label: 'Quality First-Pass Yield' },
    },
  });

  // ─── 2. NARRATIVE & BATAM FTZ STRATEGIC ADVANTAGE ───
  const [narrativeData, setNarrativeData] = useState({
    id: {
      title: 'PT. Global Philsonic Technologies',
      p1: 'PT. Global Philsonic Technologies (GPT) adalah manufaktur perakitan elektronik presisi tinggi dan solusi otomasi industri terdepan yang beroperasi di Kawasan Bebas Batam (Free Trade Zone). Dengan fasilitas seluas 10.000 m² berstandar IATF 16949, kami memproduksi modul elektronik otomotif, headunit QLED pintar, sistem prosesor audio DSP, perangkat sensor keselamatan berkendara, dan jig uji fungsional otomatis berkecepatan 80.000 CPH.',
      p2: 'Berbekal sertifikasi ISO 9001:2015 dan IATF 16949, kami menjalin kemitraan erat dengan klien Tier-1 internasional untuk memberikan efisiensi biaya, reliabilitas tanpa cela, dan kepatuhan standar industri otomotif global.',
      ftzTitle: 'Keunggulan Strategis Batam Free Trade Zone (FTZ)',
      ftzPoints: [
        { title: '0% Bea Masuk & Pajak Impor', desc: 'Bebas bea masuk bahan baku komponen elektronik dan mesin manufaktur canggih.' },
        { title: '45 Menit Pengiriman ke Singapura', desc: 'Akses logistik kapal laut harian langsung ke pelabuhan transshipment internasional Singapura.' },
        { title: 'Sertifikasi Asal Barang (COO Indonesia)', desc: 'Memenuhi persyaratan aturan asal barang internasional untuk kemudahan ekspor ke Amerika Serikat dan Uni Eropa.' },
      ],
    },
    en: {
      title: 'PT. Global Philsonic Technologies',
      p1: 'PT. Global Philsonic Technologies (GPT) is a premier high-precision electronics manufacturing and industrial automation solutions provider operating in the Batam Free Trade Zone (FTZ). With a 10,000 m² IATF 16949-certified facility, we manufacture automotive electronic modules, smart QLED head units, DSP audio processor systems, driving safety sensor devices, and high-speed automated functional test fixtures at 80,000 CPH.',
      p2: 'Backed by ISO 9001:2015 and IATF 16949 certifications, we partner closely with international Tier-1 clients to deliver cost efficiency, flawless reliability, and strict compliance with global automotive standards.',
      ftzTitle: 'Strategic Advantages of Batam Free Trade Zone (FTZ)',
      ftzPoints: [
        { title: '0% Tariff & Duty-Free Raw Materials', desc: 'Zero import duties on incoming electronic components, raw materials, and precision production equipment.' },
        { title: '45-Minute Daily Sea Cargo to Singapore', desc: 'Direct daily sea freight access to Singapore global transshipment hub for prompt international delivery.' },
        { title: 'Certificate of Origin (COO Indonesia)', desc: 'Compliant with international rules of origin for smooth, preferential tariff export to USA and EU markets.' },
      ],
    },
  });

  // ─── 3. VISION & MISSION STATE ───
  const [visionMissionData, setVisionMissionData] = useState({
    id: {
      vision: 'Menjadi mitra manufaktur Tier-1 elektronik otomotif dan rekayasa otomasi terpercaya di Asia Tenggara dengan standar mutu nol-cacat (Zero-Defect) serta efisiensi logistik bebas bea global.',
      mission: '1. Menghasilkan perakitan SMT presisi tinggi dengan toleransi mikron sesuai standar otomotif internasional IATF 16949.\n2. Memberikan layanan OEM/ODM terintegrasi mulai dari DFM, prototyping kilat, hingga produksi massal dan box-build turnkey.\n3. Mengembangkan solusi rekayasa otomasi dan mesin jig uji pintar untuk memaksimalkan yield industri 4.0.\n4. Memanfaatkan keunggulan strategis Batam Free Trade Zone untuk menyediakan rantai pasok dan pengiriman bebas pajak 45 menit ke Singapura.',
    },
    en: {
      vision: 'To be the trusted Tier-1 automotive electronics and automation engineering manufacturing partner in Southeast Asia with zero-defect quality standards and global duty-free logistics efficiency.',
      mission: '1. Deliver high-precision SMT assembly with micron tolerance meeting international IATF 16949 automotive standards.\n2. Provide end-to-end OEM/ODM services from DFM, rapid prototyping, to mass production and turnkey box-build.\n3. Develop automation engineering solutions and smart test jigs to maximize Industry 4.0 yield.\n4. Leverage Batam Free Trade Zone strategic advantages to deliver duty-free supply chain and 45-minute freight to Singapore.',
    },
  });

  // ─── 4. FACILITIES STATE ───
  const [facilitiesData, setFacilitiesData] = useState({
    id: [
      {
        id: 'cleanroom',
        name: 'Cleanroom Class 100K Berstandar ESD',
        specs: 'ISO 14644-1 · Kontrol Suhu 22±2°C · Kelembaban 45-65% RH · Lantai Konduktif',
        description: 'Ruang produksi bertekanan positif dengan filtrasi HEPA 99.97% untuk perakitan komponen sensitif elektrostatik.',
      },
      {
        id: 'smt',
        name: 'Lini Perakitan SMT Otomatis Berkecepatan Tinggi',
        specs: '80.000 CPH · Komponen 01005 Mikro · 10-Zona Nitrogen N2 Reflow · PCB 16 Layer',
        description: 'Mesin mounter otomatis mutakhir untuk perakitan modul PCB densitas tinggi dengan jaminan akurasi mikron.',
      },
      {
        id: 'inspection',
        name: 'Sistem Inspeksi Optik 3D SPI, Inline AOI & X-Ray',
        specs: '100% Solder Paste Inspection · Resolusi Mikron · Deteksi Void BGA Bawah Komponen',
        description: 'Inspeksi otomatis tiga tahap tanpa kompromi untuk memastikan tidak ada celah cacat sambungan solder.',
      },
      {
        id: 'tooling',
        name: 'Laboratorium Rekayasa Otomasi & Test Jig FCT',
        specs: 'CNC Milling Presisi · Kontrol PLC Omron/Mitsubishi · Waktu Siklus <8.5 Detik',
        description: 'Perancangan dan pembuatan jig uji fungsional elektronik kustom yang terhubung langsung ke sistem database MES pabrik.',
      },
    ],
    en: [
      {
        id: 'cleanroom',
        name: 'ESD-Protected Class 100K Cleanroom',
        specs: 'ISO 14644-1 · Temperature 22±2°C · Humidity 45-65% RH · Conductive Flooring',
        description: 'Positive pressure clean environment with 99.97% HEPA filtration for ESD-sensitive electronic assemblies.',
      },
      {
        id: 'smt',
        name: 'High-Speed Automated SMT Assembly Lines',
        specs: '80,000 CPH · 01005 Micro Placement · 10-Zone Nitrogen Reflow · Up to 16 Layers',
        description: 'Advanced automated chip mounters engineered for high-density PCBA with tight micron tolerances.',
      },
      {
        id: 'inspection',
        name: '3D SPI, Inline AOI & X-Ray Inspection Suite',
        specs: '100% Solder Paste Volume · Micron Resolution · Sub-component BGA Void Analysis',
        description: 'Comprehensive 3-stage automated optical and radiographic testing to ensure zero defect rates.',
      },
      {
        id: 'tooling',
        name: 'Automation Engineering Lab & Custom Test Jigs',
        specs: 'Precision CNC Machining · Omron/Mitsubishi PLC · Cycle Time <8.5 Seconds',
        description: 'Custom automated ICT and functional test fixtures with real-time traceability into plant MES software.',
      },
    ],
  });

  // ─── 5. TIMELINE / MILESTONES STATE ───
  const [timelineData, setTimelineData] = useState({
    id: [
      { year: '2014', title: 'Pendirian Pabrik di Batam FTZ', desc: 'Memulai operasi perakitan audio elektronik presisi di Batam Free Trade Zone.' },
      { year: '2017', title: 'Sertifikasi Mutu ISO 9001', desc: 'Mencapai sertifikasi sistem manajemen mutu internasional untuk manufaktur kontrak.' },
      { year: '2020', title: 'Ekspansi Lini SMT 80.000 CPH', desc: 'Penambahan mesin penempatan SMT kecepatan tinggi dan cleanroom Class 100K.' },
      { year: '2023', title: 'Kepatuhan Otomotif IATF 16949', desc: 'Resmi menjadi mitra manufaktur Tier-1 untuk perangkat kokpit dan headunit cerdas.' },
      { year: '2026', title: 'Transformasi Industri 4.0 & Otomasi', desc: 'Integrasi mesin jig uji otomatis dengan pelacakan MES berbasis cloud dan AI inspect.' },
    ],
    en: [
      { year: '2014', title: 'Factory Establishment in Batam FTZ', desc: 'Commenced precision audio assembly operations in Batam Free Trade Zone.' },
      { year: '2017', title: 'ISO 9001 Quality Certification', desc: 'Achieved international quality management certification for contract manufacturing.' },
      { year: '2020', title: '80,000 CPH SMT Line Expansion', desc: 'Added high-speed chip mounter lines and expanded Class 100K cleanroom floor.' },
      { year: '2023', title: 'IATF 16949 Automotive Compliance', desc: 'Certified as Tier-1 automotive manufacturing partner for smart cockpit systems.' },
      { year: '2026', title: 'Industry 4.0 & Automation Integration', desc: 'Integrated automated test jigs with cloud MES tracking and automated optical AI.' },
    ],
  });

  // ─── 6. CERTIFICATIONS STATE ───
  const [certData, setCertData] = useState({
    id: [
      { code: 'IATF 16949', title: 'Manajemen Mutu Otomotif Global', issuer: 'Automotive Quality Task Force', desc: 'Standar kualitas manufaktur suku cadang dan sistem elektronik otomotif dunia.' },
      { code: 'ISO 9001:2015', title: 'Sistem Manajemen Mutu', issuer: 'International Organization for Standardization', desc: 'Jaminan konsistensi mutu proses perakitan dan kepuasan pelanggan internasional.' },
      { code: 'ISO 14001:2015', title: 'Sistem Manajemen Lingkungan', issuer: 'International Organization for Standardization', desc: 'Kepatuhan penuh terhadap standar ramah lingkungan dan pengurangan limbah.' },
      { code: 'ANSI/ESD S20.20', title: 'Program Perlindungan Elektrostatik', issuer: 'ESD Association', desc: 'Prosedur pencegahan kerusakan elektrostatik pada komponen mikro presisi.' },
    ],
    en: [
      { code: 'IATF 16949', title: 'Global Automotive Quality Management', issuer: 'Automotive Quality Task Force', desc: 'World standard for automotive electronic parts and system manufacturing.' },
      { code: 'ISO 9001:2015', title: 'Quality Management Systems', issuer: 'International Organization for Standardization', desc: 'Guarantee of consistent assembly quality and international customer satisfaction.' },
      { code: 'ISO 14001:2015', title: 'Environmental Management Systems', issuer: 'International Organization for Standardization', desc: 'Full compliance with environmental standards and sustainable waste reduction.' },
      { code: 'ANSI/ESD S20.20', title: 'Electrostatic Discharge Control', issuer: 'ESD Association', desc: 'Rigorous ESD protection procedures for sensitive micro-electronic assemblies.' },
    ],
  });

  // Load from DB & site_settings
  useEffect(() => {
    let isMounted = true;
    async function fetchAboutData() {
      try {
        setLoading(true);
        const [compRes, headRes, narrRes, facRes, timeRes, certRes] = await Promise.allSettled([
          api.get('/public/company'),
          api.get('/public/site-settings/about_header'),
          api.get('/public/site-settings/about_narrative'),
          api.get('/public/site-settings/about_facilities'),
          api.get('/public/site-settings/about_timeline'),
          api.get('/public/site-settings/about_certifications'),
        ]);

        if (isMounted) {
          // Company profile DB row
          if (compRes.status === 'fulfilled' && compRes.value.data?.data) {
            const comp = compRes.value.data.data;
            setVisionMissionData({
              id: {
                vision: comp.vision || '',
                mission: comp.mission || '',
              },
              en: {
                vision: comp.vision_en || comp.vision || '',
                mission: comp.mission_en || comp.mission || '',
              },
            });
            if (comp.description) {
              setNarrativeData((prev) => ({
                id: { ...prev.id, p1: comp.description },
                en: { ...prev.en, p1: comp.description_en || prev.en.p1 },
              }));
            }
          }

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
          loadBilingual(narrRes, setNarrativeData);
          loadBilingual(facRes, setFacilitiesData);
          loadBilingual(timeRes, setTimelineData);
          loadBilingual(certRes, setCertData);
        }
      } catch (err) {
        addToast(extractErrorMessage(err), 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchAboutData();
    return () => { isMounted = false; };
  }, [addToast]);

  const handleSaveSection = async (key, payload, name) => {
    setSavingKey(key);
    try {
      await api.put(`/admin/site-settings/${key}`, payload);

      // If saving vision & mission or narrative, also sync to company_profile table
      if (key === 'about_vision_mission' || key === 'about_narrative') {
        await api.put('/admin/company', {
          title: 'PT. Global Philsonic Technologies',
          title_en: 'PT. Global Philsonic Technologies',
          description: narrativeData.id.p1,
          description_en: narrativeData.en.p1,
          vision: visionMissionData.id.vision,
          vision_en: visionMissionData.en.vision,
          mission: visionMissionData.id.mission,
          mission_en: visionMissionData.en.mission,
        });
      }

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
        <p style={{ color: '#94a3b8' }}>Memuat konfigurasi konten Tentang Kami...</p>
      </div>
    );
  }

  const sectionsList = [
    { id: 'header_stats', label: '1. Header & Statistik Pabrik', icon: Sliders },
    { id: 'narrative_ftz', label: '2. Narasi & Batam FTZ', icon: Building2 },
    { id: 'vision_mission', label: '3. Visi & Misi', icon: Target },
    { id: 'facilities', label: '4. Fasilitas Manufaktur', icon: Wrench },
    { id: 'timeline', label: '5. Linimasa Sejarah', icon: Clock },
    { id: 'certifications', label: '6. Sertifikasi Mutu', icon: Award },
  ];

  const currentHeadLang = langMap.header_stats;
  const currentHead = headerData[currentHeadLang] || headerData.id;

  const currentNarrLang = langMap.narrative_ftz;
  const currentNarr = narrativeData[currentNarrLang] || narrativeData.id;

  const currentVmLang = langMap.vision_mission;
  const currentVm = visionMissionData[currentVmLang] || visionMissionData.id;

  const currentFacLang = langMap.facilities;
  const currentFac = facilitiesData[currentFacLang] || facilitiesData.id;

  const currentTimeLang = langMap.timeline;
  const currentTime = timelineData[currentTimeLang] || timelineData.id;

  const currentCertLang = langMap.certifications;
  const currentCert = certData[currentCertLang] || certData.id;

  return (
    <div className="admin-module">
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
          Manajemen Konten Halaman Tentang Kami (About Us)
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          Kelola profil lengkap perusahaan, fasilitas cleanroom/SMT, visi misi, linimasa sejarah, dan sertifikasi mutu secara terstruktur per section.
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

      {/* ── SECTION 1: HEADER & STATS ── */}
      {activeSection === 'header_stats' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 1: Header Halaman & Statistik Kapasitas</h3>
              <p className="admin-card-subtitle">
                Atur judul header, subjudul, dan 4 kartu telemetri angka pabrik.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'about_header'}
              onClick={() => handleSaveSection('about_header', headerData, 'Header & Statistik')}
            >
              <Save size={16} />
              <span>{savingKey === 'about_header' ? 'Menyimpan...' : 'Simpan Header & Statistik'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentHeadLang}
            onSelectLang={(lang) => setSectionLang('header_stats', lang)}
            onTranslate={() => handleAutoTranslate('header_stats', headerData.id, setHeaderData)}
            isTranslating={translatingKey === 'header_stats'}
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
              4 Metrik Telemetri Pabrik
            </h4>
            <div className="admin-form-grid admin-form-grid-2">
              {['statYears', 'statCapacity', 'statArea', 'statYield'].map((stKey) => {
                const item = currentHead[stKey] || {};
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
                      <label className="admin-label">Nilai Angka / Satuan</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={item.value || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHeaderData((prev) => ({
                            ...prev,
                            id: { ...prev.id, [stKey]: { ...prev.id[stKey], value: val } },
                            en: { ...prev.en, [stKey]: { ...prev.en[stKey], value: val } },
                          }));
                        }}
                      />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label className="admin-label">Label Keterangan ({currentHeadLang.toUpperCase()})</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={item.label || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHeaderData((prev) => ({
                            ...prev,
                            [currentHeadLang]: {
                              ...prev[currentHeadLang],
                              [stKey]: { ...prev[currentHeadLang][stKey], label: val },
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

      {/* ── SECTION 2: NARRATIVE & BATAM FTZ ── */}
      {activeSection === 'narrative_ftz' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 2: Narasi Perusahaan & Keunggulan Batam FTZ</h3>
              <p className="admin-card-subtitle">
                Atur narasi profil pabrik dan poin keunggulan Kawasan Bebas Batam (Free Trade Zone).
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'about_narrative'}
              onClick={() => handleSaveSection('about_narrative', narrativeData, 'Narasi & Batam FTZ')}
            >
              <Save size={16} />
              <span>{savingKey === 'about_narrative' ? 'Menyimpan...' : 'Simpan Narasi & FTZ'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentNarrLang}
            onSelectLang={(lang) => setSectionLang('narrative_ftz', lang)}
            onTranslate={() => handleAutoTranslate('narrative_ftz', narrativeData.id, setNarrativeData)}
            isTranslating={translatingKey === 'narrative_ftz'}
          />

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Paragraf 1 (Profil Manufaktur Utama) ({currentNarrLang.toUpperCase()})</label>
              <textarea
                rows={4}
                className="admin-textarea"
                value={currentNarr.p1 || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setNarrativeData((prev) => ({
                    ...prev,
                    [currentNarrLang]: { ...prev[currentNarrLang], p1: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Paragraf 2 (Kemitraan & Standar Mutu) ({currentNarrLang.toUpperCase()})</label>
              <textarea
                rows={3}
                className="admin-textarea"
                value={currentNarr.p2 || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setNarrativeData((prev) => ({
                    ...prev,
                    [currentNarrLang]: { ...prev[currentNarrLang], p2: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Judul Box Keunggulan FTZ ({currentNarrLang.toUpperCase()})</label>
              <input
                type="text"
                className="admin-input"
                value={currentNarr.ftzTitle || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setNarrativeData((prev) => ({
                    ...prev,
                    [currentNarrLang]: { ...prev[currentNarrLang], ftzTitle: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-grid admin-form-grid-3">
              {currentNarr.ftzPoints?.map((pt, idx) => (
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
                    <label className="admin-label">Poin #{idx + 1} Judul ({currentNarrLang.toUpperCase()})</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={pt.title || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNarrativeData((prev) => {
                          const lang = currentNarrLang;
                          const copy = [...prev[lang].ftzPoints];
                          copy[idx] = { ...copy[idx], title: val };
                          return { ...prev, [lang]: { ...prev[lang], ftzPoints: copy } };
                        });
                      }}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Deskripsi Poin ({currentNarrLang.toUpperCase()})</label>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={pt.desc || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNarrativeData((prev) => {
                          const lang = currentNarrLang;
                          const copy = [...prev[lang].ftzPoints];
                          copy[idx] = { ...copy[idx], desc: val };
                          return { ...prev, [lang]: { ...prev[lang], ftzPoints: copy } };
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

      {/* ── SECTION 3: VISION & MISSION ── */}
      {activeSection === 'vision_mission' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 3: Visi & Misi Perusahaan</h3>
              <p className="admin-card-subtitle">
                Atur rumusan visi strategis dan butir-butir misi perusahaan.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'about_vision_mission'}
              onClick={() => handleSaveSection('about_vision_mission', visionMissionData, 'Visi & Misi')}
            >
              <Save size={16} />
              <span>{savingKey === 'about_vision_mission' ? 'Menyimpan...' : 'Simpan Visi & Misi'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentVmLang}
            onSelectLang={(lang) => setSectionLang('vision_mission', lang)}
            onTranslate={() => handleAutoTranslate('vision_mission', visionMissionData.id, setVisionMissionData)}
            isTranslating={translatingKey === 'vision_mission'}
          />

          <div style={{ marginTop: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Visi Perusahaan ({currentVmLang.toUpperCase()})</label>
              <textarea
                rows={3}
                className="admin-textarea"
                value={currentVm.vision || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setVisionMissionData((prev) => ({
                    ...prev,
                    [currentVmLang]: { ...prev[currentVmLang], vision: val },
                  }));
                }}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Misi Perusahaan (Dapat berupa poin per baris) ({currentVmLang.toUpperCase()})</label>
              <textarea
                rows={6}
                className="admin-textarea"
                value={currentVm.mission || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setVisionMissionData((prev) => ({
                    ...prev,
                    [currentVmLang]: { ...prev[currentVmLang], mission: val },
                  }));
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION 4: FACILITIES ── */}
      {activeSection === 'facilities' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 4: Fasilitas Manufaktur Utama</h3>
              <p className="admin-card-subtitle">
                Atur 4 fasilitas kunci: Cleanroom Class 100K, Lini SMT, Sistem 3D AOI & Lab Otomasi.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'about_facilities'}
              onClick={() => handleSaveSection('about_facilities', facilitiesData, 'Fasilitas Manufaktur')}
            >
              <Save size={16} />
              <span>{savingKey === 'about_facilities' ? 'Menyimpan...' : 'Simpan Fasilitas'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentFacLang}
            onSelectLang={(lang) => setSectionLang('facilities', lang)}
            onTranslate={() => handleAutoTranslate('facilities', facilitiesData.id, setFacilitiesData)}
            isTranslating={translatingKey === 'facilities'}
          />

          <div className="admin-form-grid admin-form-grid-2" style={{ marginTop: '1.25rem' }}>
            {currentFac.map((fac, idx) => (
              <div
                key={fac.id || idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.4)',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  padding: '1.25rem',
                }}
              >
                <div className="admin-form-group">
                  <label className="admin-label">Nama Fasilitas ({currentFacLang.toUpperCase()})</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={fac.name || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFacilitiesData((prev) => {
                        const lang = currentFacLang;
                        const copy = [...prev[lang]];
                        copy[idx] = { ...copy[idx], name: val };
                        return { ...prev, [lang]: copy };
                      });
                    }}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Spesifikasi Kunci ({currentFacLang.toUpperCase()})</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={fac.specs || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFacilitiesData((prev) => {
                        const lang = currentFacLang;
                        const copy = [...prev[lang]];
                        copy[idx] = { ...copy[idx], specs: val };
                        return { ...prev, [lang]: copy };
                      });
                    }}
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label">Deskripsi Fasilitas ({currentFacLang.toUpperCase()})</label>
                  <textarea
                    rows={2}
                    className="admin-textarea"
                    value={fac.description || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFacilitiesData((prev) => {
                        const lang = currentFacLang;
                        const copy = [...prev[lang]];
                        copy[idx] = { ...copy[idx], description: val };
                        return { ...prev, [lang]: copy };
                      });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION 5: TIMELINE / MILESTONES ── */}
      {activeSection === 'timeline' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 5: Linimasa Sejarah & Milestone</h3>
              <p className="admin-card-subtitle">
                Atur jejak langkah perjalanan perusahaan dari tahun pendirian hingga inovasi masa kini.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'about_timeline'}
              onClick={() => handleSaveSection('about_timeline', timelineData, 'Linimasa Sejarah')}
            >
              <Save size={16} />
              <span>{savingKey === 'about_timeline' ? 'Menyimpan...' : 'Simpan Linimasa'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentTimeLang}
            onSelectLang={(lang) => setSectionLang('timeline', lang)}
            onTranslate={() => handleAutoTranslate('timeline', timelineData.id, setTimelineData)}
            isTranslating={translatingKey === 'timeline'}
          />

          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8125rem' }}
                onClick={() => {
                  const newItem = { year: '2027', title: 'Milestone Baru', desc: 'Deskripsi pencapaian...' };
                  setTimelineData((prev) => ({
                    id: [...prev.id, newItem],
                    en: [...prev.en, { ...newItem, title: 'New Milestone', desc: 'Achievement description...' }],
                  }));
                }}
              >
                <Plus size={14} />
                <span>Tambah Milestone</span>
              </button>
            </div>

            {currentTime.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.4)',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  padding: '1.15rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ width: 100, flexShrink: 0 }}>
                  <label className="admin-label">Tahun</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={item.year || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTimelineData((prev) => {
                        const copyId = [...prev.id];
                        const copyEn = [...prev.en];
                        if (copyId[idx]) copyId[idx] = { ...copyId[idx], year: val };
                        if (copyEn[idx]) copyEn[idx] = { ...copyEn[idx], year: val };
                        return { id: copyId, en: copyEn };
                      });
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Judul Pencapaian ({currentTimeLang.toUpperCase()})</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={item.title || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTimelineData((prev) => {
                          const lang = currentTimeLang;
                          const copy = [...prev[lang]];
                          copy[idx] = { ...copy[idx], title: val };
                          return { ...prev, [lang]: copy };
                        });
                      }}
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-label">Keterangan Ringkas ({currentTimeLang.toUpperCase()})</label>
                    <textarea
                      rows={2}
                      className="admin-textarea"
                      value={item.desc || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTimelineData((prev) => {
                          const lang = currentTimeLang;
                          const copy = [...prev[lang]];
                          copy[idx] = { ...copy[idx], desc: val };
                          return { ...prev, [lang]: copy };
                        });
                      }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="admin-btn-action admin-btn-action-delete"
                  style={{ marginTop: 24 }}
                  onClick={() => {
                    setTimelineData((prev) => ({
                      id: prev.id.filter((_, i) => i !== idx),
                      en: prev.en.filter((_, i) => i !== idx),
                    }));
                  }}
                  title="Hapus Milestone"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION 6: CERTIFICATIONS ── */}
      {activeSection === 'certifications' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Bagian 6: Sertifikasi Mutu & Standar Internasional</h3>
              <p className="admin-card-subtitle">
                Atur daftar sertifikasi mutu seperti IATF 16949, ISO 9001, ISO 14001, dan ANSI/ESD.
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              disabled={savingKey === 'about_certifications'}
              onClick={() => handleSaveSection('about_certifications', certData, 'Sertifikasi Mutu')}
            >
              <Save size={16} />
              <span>{savingKey === 'about_certifications' ? 'Menyimpan...' : 'Simpan Sertifikasi'}</span>
            </button>
          </div>

          <LanguageTabControl
            activeLang={currentCertLang}
            onSelectLang={(lang) => setSectionLang('certifications', lang)}
            onTranslate={() => handleAutoTranslate('certifications', certData.id, setCertData)}
            isTranslating={translatingKey === 'certifications'}
          />

          <div className="admin-form-grid admin-form-grid-2" style={{ marginTop: '1.25rem' }}>
            {currentCert.map((cert, idx) => (
              <div
                key={cert.code || idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.4)',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  padding: '1.25rem',
                }}
              >
                <div className="admin-form-group">
                  <label className="admin-label">Kode Standar (Contoh: IATF 16949)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={cert.code || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCertData((prev) => {
                        const copyId = [...prev.id];
                        const copyEn = [...prev.en];
                        if (copyId[idx]) copyId[idx] = { ...copyId[idx], code: val };
                        if (copyEn[idx]) copyEn[idx] = { ...copyEn[idx], code: val };
                        return { id: copyId, en: copyEn };
                      });
                    }}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Judul Sertifikasi ({currentCertLang.toUpperCase()})</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={cert.title || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCertData((prev) => {
                        const lang = currentCertLang;
                        const copy = [...prev[lang]];
                        copy[idx] = { ...copy[idx], title: val };
                        return { ...prev, [lang]: copy };
                      });
                    }}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Lembaga Penerbit ({currentCertLang.toUpperCase()})</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={cert.issuer || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCertData((prev) => {
                        const lang = currentCertLang;
                        const copy = [...prev[lang]];
                        copy[idx] = { ...copy[idx], issuer: val };
                        return { ...prev, [lang]: copy };
                      });
                    }}
                  />
                </div>
                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-label">Deskripsi Ruang Lingkup ({currentCertLang.toUpperCase()})</label>
                  <textarea
                    rows={2}
                    className="admin-textarea"
                    value={cert.desc || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCertData((prev) => {
                        const lang = currentCertLang;
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
      )}
    </div>
  );
}
