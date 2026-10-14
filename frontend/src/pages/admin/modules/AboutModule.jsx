import { useState, useEffect, useRef } from 'react';
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
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import api, { extractErrorMessage, getImageUrl } from '../../../lib/api';
import { translateContent } from '../../../lib/translator';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import LanguageTabControl from '../../../components/admin/LanguageTabControl';

/**
 * Reusable Image Upload & Preview Component for About Section
 */
function SectionImageUploader({
  label = 'Foto Bagian',
  value = '',
  fallbackSrc = '',
  onChange,
  placeholder = 'Belum ada file dipilih',
  folder = 'about',
  helperText,
}) {
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef(null);

  const activeImage = value || fallbackSrc || '';
  const previewSrc = activeImage ? getImageUrl(activeImage) : '';
  const isFallback = !value && !!fallbackSrc;

  useEffect(() => {
    setImgError(false);
  }, [previewSrc]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar (JPG, PNG, WEBP, SVG, ICO).');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      // Sertakan parameter folder sebelum file agar terbaca oleh middleware multer
      formData.append('folder', folder);
      if (value && typeof value === 'string' && value.startsWith('/uploads/')) {
        formData.append('previous_url', value);
      }
      formData.append('file', file);

      const res = await api.post('/admin/upload', formData);
      const uploadedUrl = res.data?.data?.url || res.data?.data?.file_url;
      if (uploadedUrl) {
        onChange(uploadedUrl);
      }
    } catch (err) {
      alert('Gagal mengunggah foto: ' + extractErrorMessage(err));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Teks path yang ditampilkan di input (readOnly)
  const displayPath = value ? value : (fallbackSrc ? `${fallbackSrc} (Default)` : '');

  return (
    <div className="admin-form-group" style={{ marginBottom: '1.25rem' }}>
      <label className="admin-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{label}</span>
        {uploading && <span style={{ color: '#0d9488', fontSize: '0.75rem', fontWeight: 600 }}>Mengunggah foto...</span>}
      </label>

      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        {/* Thumbnail Preview */}
        <div
          style={{
            width: 110,
            height: 75,
            borderRadius: 8,
            border: '1.5px solid var(--adm-border, #334155)',
            background: 'var(--adm-card-inner, #161619)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative',
          }}
          title={isFallback ? 'Menampilkan foto default website' : (value ? 'Foto kustom tersimpan' : 'Belum ada foto')}
        >
          {previewSrc && !imgError ? (
            <>
              <img
                src={previewSrc}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => {
                  setImgError(true);
                }}
              />
              {isFallback && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0, 0, 0, 0.75)',
                    color: '#94a3b8',
                    fontSize: '0.62rem',
                    textAlign: 'center',
                    padding: '2px 0',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Default
                </div>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: 4 }}>
              <ImageIcon size={20} style={{ color: 'var(--adm-muted, #71717a)' }} />
              {imgError && (
                <span style={{ fontSize: '0.6rem', color: '#ef4444', textAlign: 'center', lineHeight: 1.1 }}>
                  Foto 404
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Controls - Ditata 2 baris agar tombol dan path nama file tidak terhimpit */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Baris 1: Teks Root File / Path Foto - READONLY tidak bisa diketik manual */}
          <div style={{ width: '100%' }}>
            <input
              type="text"
              readOnly
              className="admin-input"
              style={{
                width: '100%',
                cursor: 'default',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderColor: value ? 'var(--adm-border, #475569)' : 'var(--adm-border-subtle, #334155)',
                color: value ? 'var(--adm-text, #fafafa)' : 'var(--adm-muted, #94a3b8)',
                fontSize: '0.8125rem',
                fontFamily: 'monospace',
                userSelect: 'all',
              }}
              placeholder={placeholder || 'Belum ada file dipilih (klik Pilih File)...'}
              value={displayPath}
              title={displayPath || 'File gambar dikelola melalui tombol Pilih File'}
            />
          </div>

          {/* Baris 2: Tombol Aksi Lengkap & Lega */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <label
              className={`admin-btn ${uploading ? 'admin-btn-disabled' : 'admin-btn-secondary'}`}
              style={{
                cursor: uploading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                fontSize: '0.8125rem',
                whiteSpace: 'nowrap',
              }}
            >
              <Upload size={14} />
              <span>{uploading ? 'Mengunggah...' : 'Pilih File'}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                disabled={uploading}
                onChange={handleFileChange}
              />
            </label>

            {fallbackSrc && !value && (
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8125rem',
                  whiteSpace: 'nowrap',
                  background: 'rgba(13, 148, 136, 0.12)',
                  borderColor: 'rgba(13, 148, 136, 0.35)',
                  color: '#2dd4bf',
                }}
                onClick={() => onChange(fallbackSrc)}
                title="Gunakan path foto default ini secara eksplisit"
              >
                Pakai Default
              </button>
            )}

            {value && (
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8125rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
                onClick={() => onChange('')}
                title="Hapus / Reset Foto"
              >
                <Trash2 size={13} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {helperText && (
            <span style={{ fontSize: '0.73rem', color: '#94a3b8', lineHeight: 1.35 }}>
              {helperText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

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
    bg_image: '',
    id: {
      title: 'Solusi Manufaktur Elektronik Otomotif Terdepan di Kawasan Bebas Batam',
      subtitle: 'Didukung fasilitas perakitan SMT berkecepatan 80.000 CPH, cleanroom Class 100K, dan standar mutu IATF 16949 untuk melayani OEM & ODM global.',
      statYears: { value: '10+', label: 'Tahun Pengalaman Engineering' },
      statCapacity: { value: '80K', label: 'CPH Kapasitas Penempatan SMT' },
      statArea: { value: '10,000', label: 'm² Area Pabrik & Cleanroom' },
      statYield: { value: '99.8%', label: 'Tingkat Yield Lolos Mutu' },
      bg_image: '',
    },
    en: {
      title: 'Premier Automotive Electronics Manufacturing Solutions in Batam Free Trade Zone',
      subtitle: 'Powered by 80,000 CPH high-speed SMT assembly lines, Class 100K cleanroom, and IATF 16949 quality discipline for global OEM & ODM partners.',
      statYears: { value: '10+', label: 'Years Engineering Experience' },
      statCapacity: { value: '80K', label: 'CPH SMT Placement Capacity' },
      statArea: { value: '10,000', label: 'm² Facility & Cleanroom Area' },
      statYield: { value: '99.8%', label: 'Quality First-Pass Yield' },
      bg_image: '',
    },
  });

  // ─── 2. NARRATIVE & BATAM FTZ STRATEGIC ADVANTAGE ───
  const [narrativeData, setNarrativeData] = useState({
    image: '',
    photoTag: 'BATAM FTZ PLANT',
    photoTitle: 'PT. Global Philsonic Technologies',
    photoSub: 'Pusat Manufaktur Elektronik Otomotif & Perakitan SMT Presisi',
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
      image: '',
      photoTag: 'BATAM FTZ PLANT',
      photoTitle: 'PT. Global Philsonic Technologies',
      photoSub: 'Pusat Manufaktur Elektronik Otomotif & Perakitan SMT Presisi',
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
      image: '',
      photoTag: 'BATAM FTZ PLANT',
      photoTitle: 'PT. Global Philsonic Technologies',
      photoSub: 'Automotive Electronics & Precision SMT Assembly Hub',
    },
  });

  // ─── 3. VISION & MISSION STATE ───
  const [visionMissionData, setVisionMissionData] = useState({
    image: '',
    id: {
      vision: 'Menjadi mitra manufaktur Tier-1 elektronik otomotif dan engineering otomasi terpercaya di Asia Tenggara dengan standar mutu nol-cacat (Zero-Defect) serta efisiensi logistik bebas bea global.',
      mission: '1. Menghasilkan perakitan SMT presisi tinggi dengan toleransi mikron sesuai standar otomotif internasional IATF 16949.\n2. Memberikan layanan OEM/ODM terintegrasi mulai dari DFM, prototyping kilat, hingga produksi massal dan box-build turnkey.\n3. Mengembangkan solusi engineering otomasi dan mesin jig uji pintar untuk memaksimalkan yield industri 4.0.\n4. Memanfaatkan keunggulan strategis Batam Free Trade Zone untuk menyediakan rantai pasok dan pengiriman bebas pajak 45 menit ke Singapura.',
      image: '',
    },
    en: {
      vision: 'To be the trusted Tier-1 automotive electronics and automation engineering manufacturing partner in Southeast Asia with zero-defect quality standards and global duty-free logistics efficiency.',
      mission: '1. Deliver high-precision SMT assembly with micron tolerance meeting international IATF 16949 automotive standards.\n2. Provide end-to-end OEM/ODM services from DFM, rapid prototyping, to mass production and turnkey box-build.\n3. Develop automation engineering solutions and smart test jigs to maximize Industry 4.0 yield.\n4. Leverage Batam Free Trade Zone strategic advantages to deliver duty-free supply chain and 45-minute freight to Singapore.',
      image: '',
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
        image: '',
        imageBadge: 'HEPA 99.97% · ESD PROTECTED',
        imageAlt: 'Ruang Cleanroom Berstandar ESD Class 100K PT. Global Philsonic Technologies',
      },
      {
        id: 'smt',
        name: 'Lini Perakitan SMT Otomatis Berkecepatan Tinggi',
        specs: '80.000 CPH · Komponen 01005 Mikro · 10-Zona Nitrogen N2 Reflow · PCB 16 Layer',
        description: 'Mesin mounter otomatis mutakhir untuk perakitan modul PCB densitas tinggi dengan jaminan akurasi mikron.',
        image: '',
        imageBadge: 'DUAL-BEAM 80,000 CPH',
        imageAlt: 'Lini Perakitan SMT Berkecepatan Tinggi 80.000 CPH',
      },
      {
        id: 'inspection',
        name: 'Sistem Inspeksi Optik 3D SPI, Inline AOI & X-Ray',
        specs: '100% Solder Paste Inspection · Resolusi Mikron · Deteksi Void BGA Bawah Komponen',
        description: 'Inspeksi otomatis tiga tahap tanpa kompromi untuk memastikan tidak ada celah cacat sambungan solder.',
        image: '',
        imageBadge: '3D AOI & INLINE X-RAY',
        imageAlt: 'Laboratorium Inspeksi Optik 3D AOI & Inline X-Ray',
      },
      {
        id: 'tooling',
        name: 'Laboratorium Engineering Otomasi & Test Jig FCT',
        specs: 'CNC Milling Presisi · Kontrol PLC Omron/Mitsubishi · Waktu Siklus <8.5 Detik',
        description: 'Perancangan dan pembuatan jig uji fungsional elektronik kustom yang terhubung langsung ke sistem database MES pabrik.',
        image: '',
        imageBadge: 'ICT / FCT TEST FIXTURES',
        imageAlt: 'Workshop Otomasi & Jig Engineering ICT/FCT Test Fixtures',
      },
    ],
    en: [
      {
        id: 'cleanroom',
        name: 'ESD-Protected Class 100K Cleanroom',
        specs: 'ISO 14644-1 · Temperature 22±2°C · Humidity 45-65% RH · Conductive Flooring',
        description: 'Positive pressure clean environment with 99.97% HEPA filtration for ESD-sensitive electronic assemblies.',
        image: '',
        imageBadge: 'HEPA 99.97% · ESD PROTECTED',
        imageAlt: 'Cleanroom Class 100K PT. Global Philsonic Technologies',
      },
      {
        id: 'smt',
        name: 'High-Speed Automated SMT Assembly Lines',
        specs: '80,000 CPH · 01005 Micro Placement · 10-Zone Nitrogen Reflow · Up to 16 Layers',
        description: 'Advanced automated chip mounters engineered for high-density PCBA with tight micron tolerances.',
        image: '',
        imageBadge: 'DUAL-BEAM 80,000 CPH',
        imageAlt: 'High-Speed SMT Assembly Lines 80,000 CPH',
      },
      {
        id: 'inspection',
        name: '3D SPI, Inline AOI & X-Ray Inspection Suite',
        specs: '100% Solder Paste Volume · Micron Resolution · Sub-component BGA Void Analysis',
        description: 'Comprehensive 3-stage automated optical and radiographic testing to ensure zero defect rates.',
        image: '',
        imageBadge: '3D AOI & INLINE X-RAY',
        imageAlt: '3D AOI & Inline X-Ray Inspection Suite',
      },
      {
        id: 'tooling',
        name: 'Automation Engineering Lab & Custom Test Jigs',
        specs: 'Precision CNC Machining · Omron/Mitsubishi PLC · Cycle Time <8.5 Seconds',
        description: 'Custom automated ICT and functional test fixtures with real-time traceability into plant MES software.',
        image: '',
        imageBadge: 'ICT / FCT TEST FIXTURES',
        imageAlt: 'Automation Engineering Lab & Custom Test Jigs',
      },
    ],
  });

  // ─── 5. TIMELINE / MILESTONES STATE ───
  const [timelineData, setTimelineData] = useState({
    id: [
      { year: '2014', title: 'Pendirian Pabrik di Batam FTZ', desc: 'Memulai operasi perakitan audio elektronik presisi di Batam Free Trade Zone.', image: '' },
      { year: '2017', title: 'Sertifikasi Mutu ISO 9001', desc: 'Mencapai sertifikasi sistem manajemen mutu internasional untuk manufaktur kontrak.', image: '' },
      { year: '2020', title: 'Ekspansi Lini SMT 80.000 CPH', desc: 'Penambahan mesin penempatan SMT kecepatan tinggi dan cleanroom Class 100K.', image: '' },
      { year: '2023', title: 'Kepatuhan Otomotif IATF 16949', desc: 'Resmi menjadi mitra manufaktur Tier-1 untuk perangkat kokpit dan headunit cerdas.', image: '' },
      { year: '2026', title: 'Transformasi Industri 4.0 & Otomasi', desc: 'Integrasi mesin jig uji otomatis dengan pelacakan MES berbasis cloud dan AI inspect.', image: '' },
    ],
    en: [
      { year: '2014', title: 'Factory Establishment in Batam FTZ', desc: 'Commenced precision audio assembly operations in Batam Free Trade Zone.', image: '' },
      { year: '2017', title: 'ISO 9001 Quality Certification', desc: 'Achieved international quality management certification for contract manufacturing.', image: '' },
      { year: '2020', title: '80,000 CPH SMT Line Expansion', desc: 'Added high-speed chip mounter lines and expanded Class 100K cleanroom floor.', image: '' },
      { year: '2023', title: 'IATF 16949 Automotive Compliance', desc: 'Certified as Tier-1 automotive manufacturing partner for smart cockpit systems.', image: '' },
      { year: '2026', title: 'Industry 4.0 & Automation Integration', desc: 'Integrated automated test jigs with cloud MES tracking and automated optical AI.', image: '' },
    ],
  });

  // ─── 6. CERTIFICATIONS STATE ───
  const [certData, setCertData] = useState({
    id: [
      { code: 'IATF 16949', title: 'Manajemen Mutu Otomotif Global', issuer: 'Automotive Quality Task Force', desc: 'Standar kualitas manufaktur suku cadang dan sistem elektronik otomotif dunia.', image: '' },
      { code: 'ISO 9001:2015', title: 'Sistem Manajemen Mutu', issuer: 'International Organization for Standardization', desc: 'Jaminan konsistensi mutu proses perakitan dan kepuasan pelanggan internasional.', image: '' },
      { code: 'ISO 14001:2015', title: 'Sistem Manajemen Lingkungan', issuer: 'International Organization for Standardization', desc: 'Kepatuhan penuh terhadap standar ramah lingkungan dan pengurangan limbah.', image: '' },
      { code: 'ANSI/ESD S20.20', title: 'Program Perlindungan Elektrostatik', issuer: 'ESD Association', desc: 'Prosedur pencegahan kerusakan elektrostatik pada komponen mikro presisi.', image: '' },
    ],
    en: [
      { code: 'IATF 16949', title: 'Global Automotive Quality Management', issuer: 'Automotive Quality Task Force', desc: 'World standard for automotive electronic parts and system manufacturing.', image: '' },
      { code: 'ISO 9001:2015', title: 'Quality Management Systems', issuer: 'International Organization for Standardization', desc: 'Guarantee of consistent assembly quality and international customer satisfaction.', image: '' },
      { code: 'ISO 14001:2015', title: 'Environmental Management Systems', issuer: 'International Organization for Standardization', desc: 'Full compliance with environmental standards and sustainable waste reduction.', image: '' },
      { code: 'ANSI/ESD S20.20', title: 'Electrostatic Discharge Control', issuer: 'ESD Association', desc: 'Rigorous ESD protection procedures for sensitive micro-electronic assemblies.', image: '' },
    ],
  });

  // Load from DB & site_settings
  useEffect(() => {
    let isMounted = true;
    async function fetchAboutData() {
      try {
        setLoading(true);
        const [compRes, headRes, narrRes, vmRes, facRes, timeRes, certRes] = await Promise.allSettled([
          api.get('/public/company'),
          api.get('/public/site-settings/about_header'),
          api.get('/public/site-settings/about_narrative'),
          api.get('/public/site-settings/about_vision_mission'),
          api.get('/public/site-settings/about_facilities'),
          api.get('/public/site-settings/about_timeline'),
          api.get('/public/site-settings/about_certifications'),
        ]);

        if (isMounted) {
          // Company profile DB row
          if (compRes.status === 'fulfilled' && compRes.value.data?.data) {
            const comp = compRes.value.data.data;
            const companyImg = comp.about_image || comp.image || '';

            setVisionMissionData((prev) => ({
              ...prev,
              id: {
                ...prev.id,
                vision: comp.vision || prev.id.vision || '',
                mission: comp.mission || prev.id.mission || '',
              },
              en: {
                ...prev.en,
                vision: comp.vision_en || comp.vision || prev.en.vision || '',
                mission: comp.mission_en || comp.mission || prev.en.mission || '',
              },
            }));

            setNarrativeData((prev) => ({
              ...prev,
              image: prev.image || companyImg,
              id: { ...prev.id, p1: comp.description || prev.id.p1, image: prev.id.image || companyImg },
              en: { ...prev.en, p1: comp.description_en || comp.description || prev.en.p1, image: prev.en.image || companyImg },
            }));
          }

          const loadBilingual = (res, setter) => {
            if (res.status === 'fulfilled' && res.value.data?.data) {
              const d = res.value.data.data;
              if (d && typeof d === 'object') {
                setter((prev) => {
                  if (Array.isArray(d)) return d;
                  return { ...prev, ...d };
                });
              }
            }
          };

          loadBilingual(headRes, setHeaderData);
          loadBilingual(narrRes, setNarrativeData);
          loadBilingual(vmRes, setVisionMissionData);
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
      // Ensure top-level and bilingual image fields are preserved
      let finalPayload = payload;
      if (key === 'about_narrative') {
        finalPayload = {
          ...payload,
          image: narrativeData.image || '',
          photoTag: narrativeData.photoTag || '',
          photoTitle: narrativeData.photoTitle || '',
          photoSub: narrativeData.photoSub || '',
          id: {
            ...payload.id,
            image: narrativeData.image || '',
            photoTag: payload.id?.photoTag || narrativeData.photoTag || '',
            photoTitle: payload.id?.photoTitle || narrativeData.photoTitle || '',
            photoSub: payload.id?.photoSub || narrativeData.photoSub || '',
          },
          en: {
            ...payload.en,
            image: narrativeData.image || '',
            photoTag: payload.en?.photoTag || narrativeData.photoTag || '',
            photoTitle: payload.en?.photoTitle || narrativeData.photoTitle || '',
            photoSub: payload.en?.photoSub || narrativeData.photoSub || '',
          },
        };
      } else if (key === 'about_header') {
        finalPayload = {
          ...payload,
          bg_image: headerData.bg_image || '',
          id: { ...payload.id, bg_image: headerData.bg_image || '' },
          en: { ...payload.en, bg_image: headerData.bg_image || '' },
        };
      } else if (key === 'about_vision_mission') {
        finalPayload = {
          ...payload,
          image: visionMissionData.image || '',
          id: { ...payload.id, image: visionMissionData.image || '' },
          en: { ...payload.en, image: visionMissionData.image || '' },
        };
      }

      await api.put(`/admin/site-settings/${key}`, finalPayload);

      // If saving vision & mission or narrative, also sync to company_profile table
      if (key === 'about_vision_mission' || key === 'about_narrative') {
        await api.put('/admin/company', {
          title: 'PT. Global Philsonic Technologies',
          title_en: 'PT. Global Philsonic Technologies',
          description: narrativeData.id?.p1 || '',
          description_en: narrativeData.en?.p1 || '',
          vision: visionMissionData.id?.vision || '',
          vision_en: visionMissionData.en?.vision || '',
          mission: visionMissionData.id?.mission || '',
          mission_en: visionMissionData.en?.mission || '',
          about_image: narrativeData.image || '',
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
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: '0.35rem' }}>
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

            <SectionImageUploader
              label="Foto Latar Belakang / Banner Hero (Opsional)"
              value={headerData.bg_image || currentHead.bg_image || ''}
              fallbackSrc="/images/about/about-hero.jpg"
              onChange={(val) => {
                setHeaderData((prev) => ({
                  ...prev,
                  bg_image: val,
                  id: { ...prev.id, bg_image: val },
                  en: { ...prev.en, bg_image: val },
                }));
              }}
              placeholder="/images/about/about-hero.jpg"
              helperText="Foto beresolusi tinggi (min 1920x800px). Tampil dengan dark gradient overlay di belakang metrik telemetri."
            />

            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--adm-text)', margin: '1.5rem 0 1rem' }}>
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
                Atur narasi profil pabrik, foto showcase fasilitas, dan poin keunggulan Kawasan Bebas Batam (Free Trade Zone).
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
            {/* Foto Showcase Fasilitas Perusahaan */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.4)',
                border: '1px solid #1e293b',
                borderRadius: 8,
                padding: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--adm-text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={16} />
                <span>Foto Showcase Fasilitas Pabrik Batam FTZ</span>
              </h4>

              <SectionImageUploader
                label="File Foto Showcase Utama"
                value={narrativeData.image || ''}
                fallbackSrc="/images/about/about-showcase.jpg"
                onChange={(val) => {
                  setNarrativeData((prev) => ({
                    ...prev,
                    image: val,
                    id: { ...prev.id, image: val },
                    en: { ...prev.en, image: val },
                  }));
                }}
                placeholder="/images/about/about-showcase.jpg"
                helperText="Foto ini tampil di sebelah teks narasi profil pabrik (rasio 16:11). Tersinkronisasi juga ke Profil Perusahaan."
              />

              <div className="admin-form-grid admin-form-grid-3" style={{ marginTop: '0.5rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label">Badge Tag Foto (mis: BATAM FTZ PLANT)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={currentNarr.photoTag ?? (narrativeData.photoTag || '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNarrativeData((prev) => ({
                        ...prev,
                        photoTag: val,
                        [currentNarrLang]: { ...prev[currentNarrLang], photoTag: val },
                      }));
                    }}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Judul Caption Foto</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={currentNarr.photoTitle ?? (narrativeData.photoTitle || '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNarrativeData((prev) => ({
                        ...prev,
                        photoTitle: val,
                        [currentNarrLang]: { ...prev[currentNarrLang], photoTitle: val },
                      }));
                    }}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Subjudul Caption Foto</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={currentNarr.photoSub ?? (narrativeData.photoSub || '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNarrativeData((prev) => ({
                        ...prev,
                        photoSub: val,
                        [currentNarrLang]: { ...prev[currentNarrLang], photoSub: val },
                      }));
                    }}
                  />
                </div>
              </div>
            </div>

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
            <SectionImageUploader
              label="Foto Ilustrasi / Banner Visi Misi (Opsional)"
              value={visionMissionData.image || ''}
              fallbackSrc="/images/about/about-vision.jpg"
              onChange={(val) => {
                setVisionMissionData((prev) => ({
                  ...prev,
                  image: val,
                  id: { ...prev.id, image: val },
                  en: { ...prev.en, image: val },
                }));
              }}
              placeholder="/images/about/about-vision.jpg"
              helperText="Banner ilustrasi komitmen mutu atau riset & engineering di atas kartu Visi dan Misi."
            />

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
                Atur 4 fasilitas kunci: Cleanroom Class 100K, Lini SMT, Sistem 3D AOI & Lab Otomasi beserta foto masing-masing.
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

                <SectionImageUploader
                  label={`Foto Fasilitas #${idx + 1}`}
                  value={fac.image || ''}
                  fallbackSrc={`/images/about/facility-${fac.id || (idx === 0 ? 'cleanroom' : idx === 1 ? 'smt' : idx === 2 ? 'inspection' : 'tooling')}.jpg`}
                  onChange={(val) => {
                    setFacilitiesData((prev) => {
                      const copyId = [...prev.id];
                      const copyEn = [...prev.en];
                      if (copyId[idx]) copyId[idx] = { ...copyId[idx], image: val };
                      if (copyEn[idx]) copyEn[idx] = { ...copyEn[idx], image: val };
                      return { id: copyId, en: copyEn };
                    });
                  }}
                  placeholder="Pilih file atau masukkan URL foto fasilitas..."
                  helperText="Tampil saat tab fasilitas ini dipilih di halaman Tentang Kami."
                />

                <div className="admin-form-group">
                  <label className="admin-label">Badge Tag Foto (mis: DUAL-BEAM 80,000 CPH)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={fac.imageBadge || ''}
                    placeholder="misal: DUAL-BEAM 80,000 CPH"
                    onChange={(e) => {
                      const val = e.target.value;
                      setFacilitiesData((prev) => {
                        const copyId = [...prev.id];
                        const copyEn = [...prev.en];
                        if (copyId[idx]) copyId[idx] = { ...copyId[idx], imageBadge: val };
                        if (copyEn[idx]) copyEn[idx] = { ...copyEn[idx], imageBadge: val };
                        return { id: copyId, en: copyEn };
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

                  <div style={{ marginTop: '0.75rem' }}>
                    <SectionImageUploader
                      label={`Foto Dokumentasi Milestone (${item.year}) (Opsional)`}
                      value={item.image || ''}
                      fallbackSrc={`/images/about/milestone-${item.year || (idx === 0 ? '2014' : idx === 1 ? '2017' : idx === 2 ? '2020' : idx === 3 ? '2023' : '2026')}.jpg`}
                      onChange={(val) => {
                        setTimelineData((prev) => {
                          const copyId = Array.isArray(prev?.id) ? [...prev.id] : [];
                          const copyEn = Array.isArray(prev?.en) ? [...prev.en] : [];
                          if (copyId[idx]) copyId[idx] = { ...copyId[idx], image: val };
                          if (copyEn[idx]) copyEn[idx] = { ...copyEn[idx], image: val };
                          return { ...prev, id: copyId, en: copyEn };
                        });
                      }}
                      placeholder="Pilih file foto milestone..."
                      helperText="Foto ini tampil di kartu milestone linimasa sejarah."
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
                Atur daftar sertifikasi mutu seperti IATF 16949, ISO 9001, ISO 14001, dan ANSI/ESD beserta logo/foto dokumennya.
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

                <SectionImageUploader
                  label={`Foto / Logo Dokumen Sertifikat (${cert.code || `#${idx + 1}`}) (Opsional)`}
                  value={cert.image || ''}
                  fallbackSrc={
                    cert.code?.includes('16949') ? '/images/about/cert-iatf-16949.svg'
                    : cert.code?.includes('9001') ? '/images/about/cert-iso-9001.svg'
                    : cert.code?.includes('14001') ? '/images/about/cert-iso-14001.svg'
                    : '/images/about/cert-ansi-esd.svg'
                  }
                  onChange={(val) => {
                    setCertData((prev) => {
                      const copyId = Array.isArray(prev?.id) ? [...prev.id] : [];
                      const copyEn = Array.isArray(prev?.en) ? [...prev.en] : [];
                      if (copyId[idx]) copyId[idx] = { ...copyId[idx], image: val };
                      if (copyEn[idx]) copyEn[idx] = { ...copyEn[idx], image: val };
                      return { ...prev, id: copyId, en: copyEn };
                    });
                  }}
                  placeholder="Pilih file logo/sertifikat..."
                  helperText="Tampil di bagian atas kartu sertifikasi mutu."
                />

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
