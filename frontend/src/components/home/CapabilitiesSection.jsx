import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ProductSchematic from './ProductSchematic';
import './CapabilitiesSection.css';

const CAPABILITIES_ID = [
  {
    id: 'ivi',
    number: '01',
    categoryKey: 'headunit',
    schematicType: 'infotainment',
    badge: 'Tier-1 Automotive / OEM',
    badgeColor: '#00897B',
    title: 'Sistem Kokpit & Hiburan Kendaraan',
    subtitle: 'In-Vehicle Infotainment (IVI)',
    desc: 'Kami merancang dan memproduksi sistem layar sentuh kokpit terintegrasi dengan optical bonding, instrumen cluster digital, dan arsitektur CAN-Bus berstandar AEC-Q100. Kompatibel penuh dengan ekosistem Apple CarPlay dan Android Auto.',
    highlights: [
      { label: 'Standar Komponen', value: 'AEC-Q100 Grade 2' },
      { label: 'Teknologi Layar', value: 'Optical Bonding QLED' },
      { label: 'Konektivitas', value: 'CAN-Bus / LIN / LVDS' },
      { label: 'Sertifikasi', value: 'IATF 16949 Compliant' },
    ],
  },
  {
    id: 'audio',
    number: '02',
    categoryKey: 'audio',
    schematicType: 'dsp',
    badge: 'Acoustic Engineering',
    badgeColor: '#0284C7',
    title: 'Rekayasa Audio & Pemrosesan DSP',
    subtitle: 'Digital Signal Processing (DSP) Systems',
    desc: 'Dari amplifier Kelas-D efisiensi tinggi hingga sistem DSP 32-bit floating-point, kami merancang solusi audio kendaraan yang dikalibrasi langsung untuk karakteristik akustik kabin — bukan sekadar spesifikasi di atas kertas.',
    highlights: [
      { label: 'Pemrosesan DSP', value: '32-Bit Floating Point' },
      { label: 'Efisiensi Amplifier', value: 'Class-D >88%' },
      { label: 'Rasio Sinyal-Noise', value: 'SNR >110dB' },
      { label: 'Format Audio', value: 'Hi-Res / Dolby / DTS' },
    ],
  },
  {
    id: 'smt',
    number: '03',
    categoryKey: 'ems',
    schematicType: 'amplifier',
    badge: 'EMS / IPC-A-610',
    badgeColor: '#D97706',
    title: 'Manufaktur Elektronik Presisi Tinggi',
    subtitle: 'SMT & Electronics Manufacturing Services (EMS)',
    desc: 'Fasilitas perakitan PCB densitas tinggi di Batam FTZ kami mampu menangani papan multilayer hingga 16 lapisan, penempatan komponen mikro 01005, serta verifikasi kualitas melalui inspeksi 3D AOI dan X-Ray inline.',
    highlights: [
      { label: 'Resolusi Penempatan', value: '01005 Micro Component' },
      { label: 'Kapasitas', value: '1,2 Juta Komponen/Hari' },
      { label: 'Lapisan PCB', value: 'Hingga 16 Lapisan' },
      { label: 'Inspeksi', value: '3D AOI + In-line X-Ray' },
    ],
  },
  {
    id: 'harness',
    number: '04',
    categoryKey: 'automation',
    schematicType: 'automation',
    badge: 'Industrial Automation',
    badgeColor: '#7C3AED',
    title: 'Kabel & Sistem Otomasi Pabrik',
    subtitle: 'Wire Harness & Automated Test Equipment (ATE)',
    desc: 'Rakitan kabel otomotif presisi (Wire Harness) dengan pengujian pull-force krimping otomatis, peralatan uji akhir produksi (ATE), dan sistem jig fixture cerdas yang terintegrasi dengan cloud MES untuk penelusuran produksi real-time.',
    highlights: [
      { label: 'Pengujian', value: '100% Automated In-Line' },
      { label: 'Standar Krimping', value: 'Pull-Force Certified' },
      { label: 'Traceability', value: 'Cloud MES Tracking' },
      { label: 'Jig Fixture', value: 'Custom-Built per Project' },
    ],
  },
];

const CAPABILITIES_EN = [
  {
    id: 'ivi',
    number: '01',
    categoryKey: 'headunit',
    schematicType: 'infotainment',
    badge: 'Tier-1 Automotive / OEM',
    badgeColor: '#00897B',
    title: 'Automotive Cockpit & In-Vehicle Infotainment',
    subtitle: 'IVI System Design & Manufacturing',
    desc: 'We design and manufacture fully integrated cockpit touchscreen systems with optical bonding, digital instrument clusters, and AEC-Q100 certified CAN-Bus automotive architecture — fully compatible with Apple CarPlay and Android Auto ecosystems.',
    highlights: [
      { label: 'Component Standard', value: 'AEC-Q100 Grade 2' },
      { label: 'Display Technology', value: 'Optical Bonding QLED' },
      { label: 'Connectivity', value: 'CAN-Bus / LIN / LVDS' },
      { label: 'Certification', value: 'IATF 16949 Compliant' },
    ],
  },
  {
    id: 'audio',
    number: '02',
    categoryKey: 'audio',
    schematicType: 'dsp',
    badge: 'Acoustic Engineering',
    badgeColor: '#0284C7',
    title: 'Acoustic Engineering & Audio DSP Systems',
    subtitle: 'Digital Signal Processing (DSP) Systems',
    desc: 'From high-efficiency Class-D amplifiers to 32-bit floating-point DSP systems, we engineer in-vehicle audio solutions calibrated to the real cabin acoustic signature — not just on-paper specifications.',
    highlights: [
      { label: 'DSP Processing', value: '32-Bit Floating Point' },
      { label: 'Amplifier Efficiency', value: 'Class-D >88%' },
      { label: 'Signal-to-Noise', value: 'SNR >110dB' },
      { label: 'Audio Format', value: 'Hi-Res / Dolby / DTS' },
    ],
  },
  {
    id: 'smt',
    number: '03',
    categoryKey: 'ems',
    schematicType: 'amplifier',
    badge: 'EMS / IPC-A-610',
    badgeColor: '#D97706',
    title: 'High-Precision Electronics Manufacturing',
    subtitle: 'SMT & Electronics Manufacturing Services (EMS)',
    desc: 'Our high-density PCB assembly facility in Batam FTZ handles multilayer boards up to 16 layers, 01005 micro-component placement, and quality verification through inline 3D AOI and X-Ray inspection systems.',
    highlights: [
      { label: 'Placement Resolution', value: '01005 Micro Component' },
      { label: 'Daily Capacity', value: '1.2M Components/Day' },
      { label: 'PCB Layers', value: 'Up to 16 Layers' },
      { label: 'Inspection', value: '3D AOI + Inline X-Ray' },
    ],
  },
  {
    id: 'harness',
    number: '04',
    categoryKey: 'automation',
    schematicType: 'automation',
    badge: 'Industrial Automation',
    badgeColor: '#7C3AED',
    title: 'Wire Harness & Factory Automation',
    subtitle: 'Automated Test Equipment (ATE) & Cloud MES',
    desc: 'Precision automotive wiring harness assemblies with automated crimping pull-force testing, end-of-line ATE systems, and smart custom test jigs integrated with cloud MES for real-time production traceability.',
    highlights: [
      { label: 'Testing', value: '100% Automated In-Line' },
      { label: 'Crimping Standard', value: 'Pull-Force Certified' },
      { label: 'Traceability', value: 'Cloud MES Tracking' },
      { label: 'Test Jig', value: 'Custom-Built per Project' },
    ],
  },
];

export default function CapabilitiesSection() {
  const { i18n } = useTranslation(['home', 'common']);
  const isId = i18n.language === 'id';
  const capabilities = isId ? CAPABILITIES_ID : CAPABILITIES_EN;

  return (
    <section className="section capabilities-section" id="capabilities">
      <div className="container">

        {/* ── Section Header ── */}
        <div className="section-header fade-up text-center">
          <div className="cap-eyebrow">
            <span className="cap-eyebrow__line" />
            <span className="cap-eyebrow__text">
              {isId ? 'KAPABILITAS TEKNIS' : 'TECHNICAL CAPABILITIES'}
            </span>
            <span className="cap-eyebrow__line" />
          </div>
          <h2 className="section-title">
            {isId
              ? 'Keunggulan Teknologi di Setiap Lini Produk'
              : 'Engineering Excellence Across Every Product Line'}
          </h2>
          <div className="divider" />
          <p className="section-subtitle">
            {isId
              ? 'Dari desain sistem infotainment kokpit hingga manufaktur elektronik presisi dan otomasi kabel otomotif — semua dikerjakan di bawah satu atap dengan standar global.'
              : 'From cockpit infotainment system design to precision electronics manufacturing and automotive harness automation — all under one roof to global standards.'}
          </p>
        </div>

        {/* ── Feature Rows ── */}
        <div className="cap-rows">
          {capabilities.map((cap, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div
                key={cap.id}
                className={`cap-row fade-up ${isEven ? 'cap-row--reverse' : ''}`}
                style={{ transitionDelay: `${idx * 0.07}s` }}
              >
                {/* Schematic side */}
                <div className="cap-row__visual">
                  <div className="cap-schematic-frame" style={{ '--accent': cap.badgeColor }}>
                    <div className="cap-schematic-frame__corner cap-schematic-frame__corner--tl" />
                    <div className="cap-schematic-frame__corner cap-schematic-frame__corner--tr" />
                    <div className="cap-schematic-frame__corner cap-schematic-frame__corner--bl" />
                    <div className="cap-schematic-frame__corner cap-schematic-frame__corner--br" />
                    <ProductSchematic type={cap.schematicType} />
                    <div className="cap-schematic-num" style={{ color: cap.badgeColor }}>
                      {cap.number}
                    </div>
                  </div>
                </div>

                {/* Content side */}
                <div className="cap-row__content">
                  <span
                    className="cap-badge"
                    style={{
                      color: cap.badgeColor,
                      background: `${cap.badgeColor}12`,
                      borderColor: `${cap.badgeColor}30`,
                    }}
                  >
                    {cap.badge}
                  </span>

                  <h3 className="cap-title">{cap.title}</h3>
                  <p className="cap-subtitle-line">{cap.subtitle}</p>
                  <p className="cap-desc">{cap.desc}</p>

                  {/* Highlight grid */}
                  <div className="cap-highlights">
                    {cap.highlights.map((h, i) => (
                      <div key={i} className="cap-highlight-item">
                        <span className="cap-highlight-label">{h.label}</span>
                        <span className="cap-highlight-value" style={{ color: cap.badgeColor }}>
                          {h.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/products?category=${cap.categoryKey}`}
                    className="cap-link"
                    style={{ '--accent': cap.badgeColor }}
                  >
                    <span>{isId ? 'Lihat Produk & Spesifikasi' : 'View Products & Specs'}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom CTA Strip ── */}
        <div className="cap-bottom-strip fade-up">
          <div className="cap-bottom-strip__text">
            <span className="cap-bottom-strip__pre">
              {isId ? 'Butuh datasheet atau pengajuan RFQ?' : 'Need datasheets or want to submit an RFQ?'}
            </span>
            <strong className="cap-bottom-strip__main">
              {isId ? '40+ kode produk tersedia di katalog interaktif kami.' : '40+ product codes available in our interactive catalog.'}
            </strong>
          </div>
          <Link to="/products" className="btn btn--primary cap-catalog-btn">
            <span>{isId ? 'Buka Katalog Produk' : 'Open Product Catalog'}</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
