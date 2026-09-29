import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ProductSchematic from './ProductSchematic';
import './SolutionsPillarsSection.css';

export default function SolutionsPillarsSection() {
  const { i18n } = useTranslation(['home', 'common']);
  const isId = i18n.language === 'id';

  const pillars = [
    {
      id: 'cockpit-ivi',
      categoryKey: 'headunit',
      number: '01',
      badge: isId ? 'Tier-1 Automotive / OEM' : 'Tier-1 Automotive / OEM',
      badgeColor: '#00897B',
      title: isId
        ? 'Automotive Cockpit & In-Vehicle Infotainment (IVI)'
        : 'Automotive Cockpit & In-Vehicle Infotainment (IVI)',
      desc: isId
        ? 'Pengembangan sistem infotainment terintegrasi layar sentuh optical bonding, digital instrument cluster, dan kompatibilitas CAN-Bus berstandar AEC-Q100.'
        : 'Integrated optical-bonded infotainment displays, digital cluster units, and AEC-Q100 compliant CAN-Bus automotive architectures.',
      tags: ['AEC-Q100 Grade', 'Optical Bonding Display', 'CAN-Bus Telemetry', 'Apple CarPlay & Android Auto'],
      schematicType: 'infotainment',
    },
    {
      id: 'audio-dsp',
      categoryKey: 'audio',
      number: '02',
      badge: isId ? 'Acoustic Engineering' : 'Acoustic Engineering',
      badgeColor: '#0284C7',
      title: isId
        ? 'Acoustic Engineering & Audio DSP Systems'
        : 'Acoustic Engineering & Audio DSP Systems',
      desc: isId
        ? 'Solusi pengolahan sinyal audio 32-bit floating-point, amplifier Kelas-D efisiensi tinggi, dan transduser akustik tuned kabin mobil.'
        : '32-bit floating-point audio DSP processing, high-efficiency Class-D power amplifiers, and cabin-calibrated acoustic transducers.',
      tags: ['32-Bit Floating Point DSP', 'Class-D >88% Efficiency', 'SNR > 110dB', 'Hi-Res Audio Tuning'],
      schematicType: 'dsp',
    },
    {
      id: 'smt-ems',
      categoryKey: 'ems',
      number: '03',
      badge: isId ? 'Cleanroom Class 10k / IPC-A-610' : 'Cleanroom Class 10k / IPC-A-610',
      badgeColor: '#D97706',
      title: isId
        ? 'High-Density SMT & Electronics Manufacturing (EMS)'
        : 'High-Density SMT & Electronics Manufacturing (EMS)',
      desc: isId
        ? 'Perakitan papan sirkuit multilayer presisi tinggi (hingga 16 layer), penempatan mikro-komponen 01005, serta inspeksi 3D AOI & X-Ray di Batam FTZ.'
        : 'High-density multilayer PCB assembly (up to 16 layers), 01005 micro-component placement, with automated 3D AOI & X-Ray quality verification.',
      tags: ['01005 Micro Placement', 'Multilayer up to 16 Layers', '3D AOI & X-Ray', '1.2M Parts/Day Capacity'],
      schematicType: 'amplifier',
    },
    {
      id: 'automation-harness',
      categoryKey: 'automation',
      number: '04',
      badge: isId ? 'Industrial Automation' : 'Industrial Automation',
      badgeColor: '#7C3AED',
      title: isId
        ? 'Industrial Automation & Wire Harness Systems'
        : 'Industrial Automation & Wire Harness Systems',
      desc: isId
        ? 'Rangkaian kabel otomotif presisi tinggi (Wiring Harness), mesin penguji otomatis (ATE), serta jig fixture cerdas terintegrasi cloud MES pabrik.'
        : 'Precision automotive wiring harness assemblies, Automated Test Equipment (ATE), and smart cloud MES-connected assembly test fixtures.',
      tags: ['Pull-Force Crimping Test', '100% Automated Continuity Check', 'MES Cloud Tracking', 'Custom Test Jig'],
      schematicType: 'automation',
    },
  ];

  return (
    <section className="section solutions-pillars-section" id="solutions-pillars">
      <div className="container">
        {/* Section Header */}
        <div className="section-header fade-up text-center">
          <div className="solutions-badge">
            <span className="solutions-badge__dot" />
            <span>
              {isId ? 'KAPABILITAS & PILAR MANUFAKTUR' : 'MANUFACTURING & ENGINEERING PILLARS'}
            </span>
          </div>
          <h2 className="section-title">
            {isId
              ? 'Pilar Solusi Rekayasa & Portofolio Teknologi'
              : 'Engineering Solutions & Technology Portfolio'}
          </h2>
          <div className="divider" />
          <p className="section-subtitle">
            {isId
              ? 'Dari kokpit infotainment hingga perakitan presisi tinggi SMT dan otomasi industri, kami menghadirkan ekosistem manufaktur terintegrasi berstandar global di Batam FTZ.'
              : 'From cockpit infotainment to high-precision SMT assembly and smart industrial automation, we deliver global-grade manufacturing ecosystems from Batam FTZ.'}
          </p>
        </div>

        {/* ── 4 PILLARS BENTO GRID ── */}
        <div className="solutions-bento-grid">
          {pillars.map((pillar, idx) => (
            <div
              key={pillar.id}
              className={`solution-pillar-card solution-pillar-card--${idx + 1} fade-up`}
              style={{ transitionDelay: `${idx * 0.08}s` }}
            >
              {/* Technical Schematic Graphic Header */}
              <div className="pillar-schematic-wrap">
                <ProductSchematic type={pillar.schematicType} />
                <span className="pillar-number">{pillar.number}</span>
              </div>

              {/* Card Body */}
              <div className="pillar-content">
                <div className="pillar-badge-wrap">
                  <span
                    className="pillar-badge"
                    style={{
                      color: pillar.badgeColor,
                      backgroundColor: `${pillar.badgeColor}15`,
                      borderColor: `${pillar.badgeColor}35`,
                    }}
                  >
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-desc">{pillar.desc}</p>

                {/* Capability Tag Pills */}
                <div className="pillar-tags">
                  {pillar.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="pillar-tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Card Action Link */}
                <div className="pillar-action">
                  <Link
                    to={`/products?category=${pillar.categoryKey}`}
                    className="pillar-link"
                    style={{ color: pillar.badgeColor }}
                  >
                    <span>{isId ? 'Eksplorasi Solusi Ini' : 'Explore This Solution'}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── BOTTOM DIRECTORY ACTION BANNER ── */}
        <div className="solutions-bottom-bar fade-up">
          <div className="bottom-bar-left">
            <div className="bottom-bar-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div>
              <strong className="bottom-bar-title">
                {isId ? 'Mencari Spesifikasi Produk & Datasheet Lengkap?' : 'Looking for Specific Product Datasheets?'}
              </strong>
              <p className="bottom-bar-desc">
                {isId
                  ? 'Jelajahi seluruh 40+ kode seri produk, sertifikasi kepatuhan, dan mintalah penawaran langsung melalui katalog interaktif kami.'
                  : 'Explore all 40+ product model codes, compliance certifications, and request RFQs via our interactive directory.'}
              </p>
            </div>
          </div>

          <div className="bottom-bar-right">
            <Link to="/products" className="btn btn--primary bottom-bar-btn">
              <span>{isId ? 'Buka Katalog Produk Lengkap' : 'Open Full Product Catalog'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
