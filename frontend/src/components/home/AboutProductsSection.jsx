import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../hooks/useApi';
import { getLocalizedData } from '../../lib/translator';
import ProductSchematic from './ProductSchematic';
import './AboutProductsSection.css';

/* ── Product lines (7 master product categories matching the catalog) ── */
const PRODUCT_LINES = [
  {
    id: 'automation',
    number: '01',
    schematicType: 'automation',
    categoryKey: 'automation',
    name_id: 'Automation & Mesin Jig Uji Presisi',
    name_en: 'Automation & Precision Test Jigs',
    sku: 'GPT-JIG4000 AUTO · GPT-WH-TESTER',
    spec_id: 'PLC + Pneumatik Servo · Siklus <8.5 detik · MES Cloud Logging',
    spec_en: 'Industrial PLC + Pneumatic Servo · <8.5s Cycle · Cloud MES Logging',
    detail_id: 'Mesin jig uji otomatis multi-stasiun ICT & FCT terintegrasi PLC, serta bangku pengujian kontinuitas wire harness 128-pin dengan pelacakan MES cloud.',
    detail_en: 'Automated multi-station ICT & FCT test fixtures with industrial PLC control, and precision 128-point wire harness test benches with cloud MES traceability.',
  },
  {
    id: 'mobile_intelligent_device',
    number: '02',
    schematicType: 'infotainment',
    categoryKey: 'mobile_intelligent_device',
    name_id: 'Mobile Intelligent Device & Smart AI Box',
    name_en: 'Mobile Intelligent Device & Smart AI Box',
    sku: 'GPT-CP1200 AI-BOX · GPT-BMS-48V ECU',
    spec_id: 'Android 13 · Qualcomm Octa-Core · 4G LTE SIM · GPS Mandiri',
    spec_en: 'Android 13 · Qualcomm Octa-Core · 4G LTE SIM · Autonomous GPS',
    detail_id: 'Modul AI Box pintar, telematics control unit (T-Box) 4G/IoT, serta PCBA modul manajemen baterai (BMS) untuk kendaraan nirkabel generasi baru.',
    detail_en: 'Smart AI Box modules, 4G/IoT telematics control units (T-Box), and automotive BMS battery management PCBA for modern connected mobility.',
  },
  {
    id: 'amplifier',
    number: '03',
    schematicType: 'amplifier',
    categoryKey: 'amplifier',
    name_id: 'Amplifier Otomotif Efisiensi Tinggi',
    name_en: 'High-Efficiency Automotive Power Amplifiers',
    sku: 'GPT-AMP4100 D-CLASS',
    spec_id: 'Class-D >88% Efisiensi · 4x100W RMS · Disipasi Sasis Aluminium',
    spec_en: 'Class-D >88% Efficiency · 4x100W RMS · Die-Cast Aluminum Heat-Sink',
    detail_id: 'Penguat daya audio mobil Class-D multi-kanal efisiensi tinggi dengan sasis aluminium die-cast dan proteksi sirkuit pintar terhadap kelebihan panas.',
    detail_en: 'High-efficiency multi-channel Class-D car audio amplifiers with die-cast aluminum heat dissipation and comprehensive automotive circuit protection.',
  },
  {
    id: 'subwoofer',
    number: '04',
    schematicType: 'amplifier',
    categoryKey: 'subwoofer',
    name_id: 'Subwoofer & Bass Management System',
    name_en: 'Subwoofer & Bass Management Systems',
    sku: 'GPT-AMP11000 MONO',
    spec_id: '1000W RMS @ 1Ω · Subsonic Filter · Remote Bass Control Knob',
    spec_en: '1000W RMS @ 1Ω · Subsonic Filter · Remote Bass Dashboard Knob',
    detail_id: 'Sistem subwoofer monoblock bertenaga tinggi, active underseat sub, dan bass driver kabin dengan respon frekuensi rendah akurat dan bertenaga.',
    detail_en: 'High-power monoblock subwoofer amplifiers, active underseat subs, and cabin bass drivers delivering deep, precise low-frequency acoustic response.',
  },
  {
    id: 'dsp',
    number: '05',
    schematicType: 'dsp',
    categoryKey: 'dsp',
    name_id: 'Digital Signal Processor (DSP) Akustik',
    name_en: 'Acoustic Digital Signal Processors (DSP)',
    sku: 'GPT-DSP8800 HD',
    spec_id: 'Dual 32-Bit Floating Point · 6 In / 8 Out · 192kHz · SNR >110dB',
    spec_en: 'Dual 32-Bit Floating Point · 6 In / 8 Out · 192kHz · SNR >110dB',
    detail_id: 'Prosesor sinyal digital 32-bit resolusi tinggi dengan equalizer parametrik 31-band, time alignment presisi, dan tuning via PC suite atau Bluetooth.',
    detail_en: 'High-resolution 32-bit floating-point digital signal processors featuring 31-band PEQ, microsecond time alignment, and wireless PC/app calibration.',
  },
  {
    id: 'android_headunit',
    number: '06',
    schematicType: 'infotainment',
    categoryKey: 'android_headunit',
    name_id: 'Android Headunit & Layar Sentuh Pintar',
    name_en: 'Android Headunit & Smart Touch Display',
    sku: 'GPT-HU9800 PRO · GPT-HU7200 SLIM',
    spec_id: 'QLED 10.1" Optical Bonding · Octa-Core · CAN-Bus · CarPlay & Auto',
    spec_en: 'QLED 10.1" Optical Bonding · Octa-Core · CAN-Bus · Wireless CarPlay',
    detail_id: 'Headunit pintar standar OEM dengan optical bonding layar sentuh QLED, prosesor Octa-core, integrasi CAN-Bus, dan wireless CarPlay & Android Auto.',
    detail_en: 'OEM-grade smart head units with optical-bonded QLED touchscreen, Octa-core processor, native CAN-Bus telemetry, and full wireless smartphone integration.',
  },
  {
    id: 'dash_camera_recorders',
    number: '07',
    schematicType: 'dashcam',
    categoryKey: 'dash_camera_recorders',
    name_id: 'Dash Camera Recorders & Sensor Keselamatan ADAS',
    name_en: 'Dash Camera Recorders & ADAS Safety Sensors',
    sku: 'GPT-DVR4K PRO · GPT-BSM240 RADAR',
    spec_id: 'Sony STARVIS 2 4K UHD · 77GHz Radar BSD · Superkapasitor Tahan Panas',
    spec_en: 'Sony STARVIS 2 4K UHD · 77GHz Millimeter Radar · Supercapacitor',
    detail_id: 'Kamera perekam perjalanan dual-channel 4K dengan sensor Sony STARVIS 2, sistem radar blind spot 77GHz, dan modul peringatan keselamatan ADAS terintegrasi.',
    detail_en: 'Dual-channel 4K driving dashcams with Sony STARVIS 2 sensor, 77GHz millimeter-wave blind-spot radar, and active ADAS collision warning sensors.',
  },
];

const ABOUT_ID = `PT. Global Philsonic Technologies (GPT) adalah produsen perakitan audio dan video otomotif yang berlokasi di Kawasan Perdagangan Bebas Batam, Indonesia. Kami berkomitmen menghadirkan solusi inovatif, berkualitas tinggi, dan efisien biaya bagi setiap mitra bisnis kami.

Dengan mengadopsi teknologi mutakhir bertaraf internasional, kami menyediakan layanan menyeluruh mulai dari desain, engineering, manufaktur, pengujian fungsional, hingga perakitan produk akhir, semuanya berorientasi pada kebutuhan spesifik pelanggan. Jaringan pemasok global kami yang telah terjalin lama memungkinkan kami menawarkan harga pengadaan terbaik di setiap proyek.

Kami adalah mitra terpercaya bagi perusahaan dari berbagai skala, dengan komitmen penuh untuk memberikan layanan, dukungan teknis, dan kualitas terbaik di setiap tahap kemitraan.`;

const ABOUT_EN = `PT. Global Philsonic Technologies (GPT) is a dedicated automotive audio and video assembly manufacturer located in the Batam Free Trade Zone, Indonesia. We are committed to providing our customers with innovative, high-quality, and cost-effective solutions.

We focus on international advanced technologies and provide customer-oriented design, engineering, manufacturing, functional test, and finished product assembly services. Our global network of long-term suppliers allows us to offer the best possible procurement prices on every project.

We are a trusted partner for companies of all sizes, committed to delivering the best possible service, technical support, and quality at every stage of the partnership.`;

const STATS = [
  { value: '10+', label_id: 'Tahun Pengalaman', label_en: 'Years Experience' },
  { value: '80K', label_id: 'CPH Kapasitas SMT', label_en: 'CPH SMT Capacity' },
  { value: '40+', label_id: 'Kode Produk', label_en: 'Product SKUs' },
  { value: 'FTZ', label_id: 'Kawasan Batam', label_en: 'Batam Free Zone' },
];

export default function AboutProductsSection() {
  const { i18n } = useTranslation(['home', 'common']);
  const isId = i18n.language === 'id';
  const [activeId, setActiveId] = useState(null);

  // Dynamic CMS Settings
  const { data: dynamicSettings } = useSiteSettings('home_about_products');
  const localized = getLocalizedData(dynamicSettings, isId ? 'id' : 'en');

  const tagline = localized?.tagline || (isId ? 'TENTANG KAMI' : 'ABOUT US');
  const heading = localized?.title || (isId
    ? 'Mitra Manufaktur Elektronik Otomotif di Batam Free Trade Zone'
    : 'Automotive Electronics Manufacturing Partner in Batam Free Trade Zone');
  const narrative = localized?.narrative || (isId ? ABOUT_ID : ABOUT_EN);

  const activeLine = PRODUCT_LINES.find(l => l.id === activeId);

  return (
    <section className="section aps-section" id="about-products">
      <div className="aps-inner">

        {/* ── LEFT: About Column ── */}
        <div className="aps-about fade-up">

          {/* Overline */}
          <div className="aps-overline">
            <span className="aps-overline__dash" />
            <span>{tagline}</span>
          </div>

          {/* Heading */}
          <h2 className="aps-heading">
            {heading}
          </h2>

          {/* About paragraphs */}
          <div className="aps-body-text">
            {narrative.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Stats row : inline, no cards */}
          <div className="aps-stats">
            {STATS.map((s, i) => (
              <div key={i} className="aps-stat">
                <span className="aps-stat__value">{s.value}</span>
                <span className="aps-stat__label">
                  {isId ? s.label_id : s.label_en}
                </span>
              </div>
            ))}
          </div>

          {/* About link */}
          <Link to="/about" className="aps-about-link">
            <span>{isId ? 'Pelajari Lebih Lanjut tentang GPT' : 'Learn More About GPT'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        {/* ── DIVIDER ── */}
        <div className="aps-divider" />

        {/* ── RIGHT: Product Lines Column ── */}
        <div className="aps-products fade-up" style={{ transitionDelay: '0.08s' }}>
          <div className="aps-overline">
            <span className="aps-overline__dash" />
            <span>{isId ? 'LINI PRODUK UNGGULAN' : 'PRODUCT LINES'}</span>
          </div>

          {/* Heading for Product Lines */}
          <h2 className="aps-heading">
            {isId
              ? <>Lini Perakitan Presisi &<br /><em>Katalog Solusi OEM/ODM</em></>
              : <>Precision Assembly Lines &<br /><em>OEM/ODM Solutions</em></>
            }
          </h2>

          {/* Product line list */}
          <ul className="aps-product-list">
            {PRODUCT_LINES.map((line) => {
              const isActive = activeId === line.id;
              return (
                <li
                  key={line.id}
                  className={`aps-product-item ${isActive ? 'aps-product-item--active' : ''}`}
                  onMouseEnter={() => setActiveId(line.id)}
                  onMouseLeave={() => setActiveId(null)}
                >
                  <button
                    className="aps-product-btn"
                    onClick={() => setActiveId(isActive ? null : line.id)}
                    aria-expanded={isActive}
                  >
                    <span className="aps-product-num">{line.number}</span>
                    <span className="aps-product-name">
                      {isId ? line.name_id : line.name_en}
                    </span>
                    <svg
                      className="aps-product-arrow"
                      width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>

                  {/* Expanded detail */}
                  <div className={`aps-product-detail ${isActive ? 'aps-product-detail--open' : ''}`}>
                    <div className="aps-product-detail-inner">
                      {/* Schematic */}
                      <div className="aps-product-schematic">
                        <ProductSchematic type={line.schematicType} />
                      </div>
                      {/* Info */}
                      <div className="aps-product-info">
                        <p className="aps-product-spec">
                          {isId ? line.spec_id : line.spec_en}
                        </p>
                        <p className="aps-product-desc">
                          {isId ? line.detail_id : line.detail_en}
                        </p>
                        <Link
                          to={`/products?category=${line.categoryKey}`}
                          className="aps-product-link"
                        >
                          {isId ? 'Lihat Produk →' : 'View Products →'}
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Catalog link */}
          <div className="aps-catalog-row">
            <span className="aps-catalog-count">
              {isId ? '40+ kode seri produk tersedia' : '40+ product SKUs available'}
            </span>
            <Link to="/products" className="aps-catalog-link">
              {isId ? 'Katalog Lengkap' : 'Full Catalog'}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
