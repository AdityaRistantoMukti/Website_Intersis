import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../hooks/useApi';
import { getLocalizedData } from '../../lib/translator';
import ProductSchematic from './ProductSchematic';
import './AboutProductsSection.css';

/* ── Product lines (master product categories with actual SKU examples) ── */
const PRODUCT_LINES = [
  {
    id: 'headunit',
    number: '01',
    schematicType: 'infotainment',
    categoryKey: 'headunit',
    name_id: 'Sistem Infotainment & Kokpit Kendaraan',
    name_en: 'Automotive Infotainment & Cockpit Systems',
    sku: 'GPT-HU9800 PRO',
    spec_id: 'Android QLED 10.1" · Octa-Core · CAN-Bus · CarPlay & Android Auto',
    spec_en: 'Android QLED 10.1" · Octa-Core · CAN-Bus · CarPlay & Android Auto',
    detail_id: 'Headunit standar OEM dengan optical bonding QLED, prosesor Octa-core, integrasi CAN-Bus, dan dukungan nirkabel penuh Apple CarPlay serta Android Auto.',
    detail_en: 'OEM-grade head units with optical bonding QLED panel, Octa-core SoC, native CAN-Bus integration, and full wireless CarPlay & Android Auto support.',
  },
  {
    id: 'audio',
    number: '02',
    schematicType: 'dsp',
    categoryKey: 'audio',
    name_id: 'Prosesor Audio DSP & Amplifier Otomotif',
    name_en: 'Automotive DSP Processors & Amplifiers',
    sku: 'GPT-DSP8800 HD · GPT-AMP4100 D-CLASS',
    spec_id: '32-Bit DSP · 8-Channel · SNR >110dB · Class-D >88% Efisiensi',
    spec_en: '32-Bit DSP · 8-Channel · SNR >110dB · Class-D >88% Efficiency',
    detail_id: 'Prosesor sinyal digital floating-point 32-bit dan amplifier Kelas-D efisiensi tinggi untuk sistem audio kendaraan berstandar Hi-Res Audio.',
    detail_en: '32-bit floating-point DSP processors and high-efficiency Class-D amplifiers for automotive-grade Hi-Res Audio systems.',
  },
  {
    id: 'ems',
    number: '03',
    schematicType: 'amplifier',
    categoryKey: 'ems',
    name_id: 'Manufaktur Elektronik Kontrak (EMS)',
    name_en: 'Contract Electronics Manufacturing (EMS)',
    sku: 'GPT-SMT-BOX TURNKEY',
    spec_id: '80K CPH · PCB 16 Layer · 01005 Micro · 3D AOI + X-Ray',
    spec_en: '80K CPH · 16-Layer PCB · 01005 Micro · 3D AOI + Inline X-Ray',
    detail_id: 'Perakitan PCB densitas tinggi turnkey di Batam FTZ: lini SMT Yamaha/Panasonic, inspeksi 3D AOI inline, pelapisan konformal otomatis, hingga perakitan produk akhir.',
    detail_en: 'High-density turnkey PCB assembly at Batam FTZ: Yamaha/Panasonic SMT lines, inline 3D AOI, automated conformal coating, and full box-build services.',
  },
  {
    id: 'automation',
    number: '04',
    schematicType: 'automation',
    categoryKey: 'automation',
    name_id: 'Jig Uji Otomatis & Wire Harness',
    name_en: 'Automated Test Jigs & Wire Harness',
    sku: 'GPT-JIG4000 AUTO',
    spec_id: 'PLC + Pneumatik Servo · Siklus <8.5 detik · MES Cloud Logging',
    spec_en: 'Industrial PLC + Pneumatic Servo · <8.5s Cycle · Cloud MES Logging',
    detail_id: 'Jig uji ICT & FCT otomatis dengan kontrol PLC, rakitan wire harness presisi otomotif, dan integrasi pelacakan produksi MES berbasis cloud.',
    detail_en: 'Automated ICT & FCT test jigs with PLC control, precision automotive wire harness assemblies, and cloud-based MES production traceability.',
  },
  {
    id: 'dashcam',
    number: '05',
    schematicType: 'infotainment',
    categoryKey: 'dashcam',
    name_id: 'Kamera Dasbor & Sistem Keselamatan ADAS',
    name_en: 'Dashcam & ADAS Safety Vision Systems',
    sku: 'GPT-DVR4K PRO ADAS',
    spec_id: 'Sony STARVIS 2 · 4K UHD · LDWS/FCWS · Superkapasitor Tahan Panas',
    spec_en: 'Sony STARVIS 2 · 4K UHD · LDWS/FCWS ADAS · Heat-Resilient Supercapacitor',
    detail_id: 'Kamera pengawas berkendara dual-channel 4K dengan sensor Sony STARVIS 2, peringatan keselamatan ADAS terintegrasi, dan superkapasitor untuk ketahanan suhu ekstrem.',
    detail_en: 'Dual-channel 4K UHD dashcam with Sony STARVIS 2 sensor, integrated ADAS safety alerts, and heat-resilient supercapacitor for extreme temperature environments.',
  },
];

const ABOUT_ID = `PT. Global Philsonic Technologies (GPT) adalah produsen perakitan audio dan video otomotif yang berlokasi di Kawasan Perdagangan Bebas Batam, Indonesia. Kami berkomitmen menghadirkan solusi inovatif, berkualitas tinggi, dan efisien biaya bagi setiap mitra bisnis kami.

Dengan mengadopsi teknologi mutakhir bertaraf internasional, kami menyediakan layanan menyeluruh mulai dari desain, rekayasa, manufaktur, pengujian fungsional, hingga perakitan produk akhir, semuanya berorientasi pada kebutuhan spesifik pelanggan. Jaringan pemasok global kami yang telah terjalin lama memungkinkan kami menawarkan harga pengadaan terbaik di setiap proyek.

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
