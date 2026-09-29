import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './EngineeringBlueprintSection.css';

/* ── Hotspot data: product areas on the automotive dashboard blueprint ── */
const HOTSPOTS_ID = [
  {
    id: 'ivi',
    cx: 200, cy: 108,
    label: 'Head Unit & Infotainment',
    categoryKey: 'headunit',
    color: '#00BFA5',
    badge: 'Tier-1 Automotive',
    title: 'Sistem Kokpit & Hiburan Kendaraan',
    desc: 'Pengembangan sistem layar sentuh terintegrasi, instrumen cluster digital, dan arsitektur CAN-Bus berstandar AEC-Q100. Kompatibel penuh dengan Apple CarPlay dan Android Auto.',
    specs: ['Layar QLED Optical Bonding', 'Standar AEC-Q100', 'Integrasi CAN-Bus', 'CarPlay & Android Auto'],
    stat: '40+ Varian Produk',
  },
  {
    id: 'audio',
    cx: 108, cy: 155,
    label: 'Sistem Audio DSP',
    categoryKey: 'audio',
    color: '#0288D1',
    badge: 'Acoustic Engineering',
    title: 'Rekayasa Audio & Pemrosesan DSP',
    desc: 'Pemrosesan sinyal audio 32-bit floating-point, amplifier Kelas-D efisiensi tinggi, dan transduser akustik yang dikalibrasi khusus untuk kabin kendaraan.',
    specs: ['DSP 32-Bit Floating Point', 'Efisiensi Class-D >88%', 'SNR >110dB', 'Kalibrasi Akustik Kabin'],
    stat: 'SNR >110dB',
  },
  {
    id: 'smt',
    cx: 292, cy: 155,
    label: 'Perakitan SMT & PCB',
    categoryKey: 'ems',
    color: '#F59E0B',
    badge: 'Cleanroom Class 10k',
    title: 'Manufaktur Elektronik Presisi Tinggi',
    desc: 'Perakitan papan sirkuit multilayer densitas tinggi (hingga 16 lapisan), penempatan komponen mikro 01005, serta inspeksi kualitas 3D AOI & X-Ray di kawasan Batam FTZ.',
    specs: ['Penempatan 01005 Micro', 'PCB hingga 16 Lapisan', 'Inspeksi 3D AOI & X-Ray', 'Kapasitas 1,2 Juta Komponen/Hari'],
    stat: 'IPC-A-610 Certified',
  },
  {
    id: 'harness',
    cx: 200, cy: 200,
    label: 'Wire Harness & Kabel Otomotif',
    categoryKey: 'automation',
    color: '#8B5CF6',
    badge: 'Industrial Automation',
    title: 'Kabel & Sistem Otomasi Pabrik',
    desc: 'Rakitan kabel otomotif presisi (Wire Harness), peralatan pengujian otomatis (ATE), serta jig fixture cerdas yang terhubung ke sistem MES berbasis cloud.',
    specs: ['Uji Crimping Pull-Force', 'Pemeriksaan Kontinuitas 100%', 'Pelacakan MES Cloud', 'Jig Pengujian Custom'],
    stat: '100% In-Line Testing',
  },
];

const HOTSPOTS_EN = [
  {
    id: 'ivi',
    cx: 200, cy: 108,
    label: 'Head Unit & Infotainment',
    categoryKey: 'headunit',
    color: '#00BFA5',
    badge: 'Tier-1 Automotive',
    title: 'Automotive Cockpit & In-Vehicle Infotainment',
    desc: 'Integrated optical-bonded touchscreen systems, digital instrument clusters, and AEC-Q100 compliant CAN-Bus automotive architectures. Full Apple CarPlay & Android Auto compatibility.',
    specs: ['QLED Optical Bonding Display', 'AEC-Q100 Standard', 'CAN-Bus Integration', 'CarPlay & Android Auto'],
    stat: '40+ Product Variants',
  },
  {
    id: 'audio',
    cx: 108, cy: 155,
    label: 'Audio DSP Systems',
    categoryKey: 'audio',
    color: '#0288D1',
    badge: 'Acoustic Engineering',
    title: 'Acoustic Engineering & Audio DSP',
    desc: '32-bit floating-point audio DSP processing, high-efficiency Class-D power amplifiers, and cabin-calibrated acoustic transducers for premium in-vehicle audio experience.',
    specs: ['32-Bit Floating Point DSP', 'Class-D >88% Efficiency', 'SNR >110dB', 'Cabin Acoustic Calibration'],
    stat: 'SNR >110dB',
  },
  {
    id: 'smt',
    cx: 292, cy: 155,
    label: 'SMT Assembly & PCB',
    categoryKey: 'ems',
    color: '#F59E0B',
    badge: 'Cleanroom Class 10k',
    title: 'High-Precision Electronics Manufacturing',
    desc: 'High-density multilayer PCB assembly (up to 16 layers), 01005 micro-component placement, with automated 3D AOI & X-Ray quality verification at Batam FTZ.',
    specs: ['01005 Micro Placement', 'Multilayer up to 16 Layers', '3D AOI & X-Ray QC', '1.2M Parts/Day Capacity'],
    stat: 'IPC-A-610 Certified',
  },
  {
    id: 'harness',
    cx: 200, cy: 200,
    label: 'Wire Harness & Automation',
    categoryKey: 'automation',
    color: '#8B5CF6',
    badge: 'Industrial Automation',
    title: 'Wire Harness & Factory Automation',
    desc: 'Precision automotive wiring harness assemblies, Automated Test Equipment (ATE), and smart cloud MES-connected assembly test jigs for end-of-line quality assurance.',
    specs: ['Pull-Force Crimping Test', '100% Continuity Check', 'Cloud MES Tracking', 'Custom Test Jig'],
    stat: '100% In-Line Testing',
  },
];

/* ── Connector lines from center chip to hotspots ── */
function ConnectorLine({ x1, y1, x2, y2, color, active }) {
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color}
      strokeWidth={active ? 1.5 : 0.8}
      strokeDasharray={active ? 'none' : '4 3'}
      opacity={active ? 0.9 : 0.3}
      style={{ transition: 'all 0.3s ease' }}
    />
  );
}

/* ── Main Component ── */
export default function EngineeringBlueprintSection() {
  const { i18n } = useTranslation(['home', 'common']);
  const isId = i18n.language === 'id';
  const hotspots = isId ? HOTSPOTS_ID : HOTSPOTS_EN;

  const [activeId, setActiveId] = useState('ivi');
  const [hovered, setHovered] = useState(null);

  const activeHotspot = hotspots.find(h => h.id === activeId);
  const displayId = hovered || activeId;
  const displayHotspot = hotspots.find(h => h.id === displayId);

  const handleSelect = useCallback((id) => {
    setActiveId(id);
    setHovered(null);
  }, []);

  return (
    <section className="section engineering-blueprint-section" id="engineering-blueprint">
      <div className="container">

        {/* ── Section Header ── */}
        <div className="section-header fade-up text-center">
          <div className="blueprint-badge">
            <span className="blueprint-badge__dot" />
            <span>
              {isId ? 'ARSITEKTUR PRODUK & KAPABILITAS' : 'PRODUCT ARCHITECTURE & CAPABILITIES'}
            </span>
          </div>
          <h2 className="section-title">
            {isId
              ? 'Teknologi di Balik Setiap Produk Kami'
              : 'The Technology Behind Every Product'}
          </h2>
          <div className="divider" />
          <p className="section-subtitle">
            {isId
              ? 'Klik atau arahkan kursor ke area pada blueprint untuk menjelajahi kapabilitas teknis kami di bidang infotainment, audio, manufaktur elektronik, dan otomasi kabel otomotif.'
              : 'Click or hover any area on the blueprint to explore our technical capabilities across infotainment, audio DSP, electronics manufacturing, and automotive wire harness automation.'}
          </p>
        </div>

        {/* ── Blueprint + Detail Panel ── */}
        <div className="blueprint-layout fade-up">

          {/* LEFT: SVG Blueprint */}
          <div className="blueprint-canvas-wrap">
            {/* Grid overlay label */}
            <div className="blueprint-grid-label">
              {isId ? 'Klik area untuk detail →' : 'Click area for details →'}
            </div>

            <svg
              viewBox="0 0 400 280"
              className="blueprint-svg"
              aria-label="Automotive Product Engineering Blueprint"
            >
              <defs>
                {/* Blueprint grid pattern */}
                <pattern id="bpGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,191,165,0.07)" strokeWidth="0.6" />
                </pattern>
                <pattern id="bpGridLarge" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(0,191,165,0.12)" strokeWidth="1" />
                </pattern>
                {/* Glow filter */}
                <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Radial gradient for center chip */}
                <radialGradient id="chipGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00BFA5" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#004D40" stopOpacity="0.05" />
                </radialGradient>
                {/* Active node gradient */}
                {hotspots.map(h => (
                  <radialGradient key={h.id} id={`nodeGrad-${h.id}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={h.color} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={h.color} stopOpacity="0" />
                  </radialGradient>
                ))}
              </defs>

              {/* Background grid */}
              <rect width="400" height="280" fill="#080E19" />
              <rect width="400" height="280" fill="url(#bpGrid)" />
              <rect width="400" height="280" fill="url(#bpGridLarge)" />

              {/* ── Dashboard silhouette / car cockpit blueprint ── */}
              {/* Dashboard outer frame */}
              <rect x="30" y="40" width="340" height="200" rx="14" fill="none"
                stroke="rgba(0,191,165,0.2)" strokeWidth="1" strokeDasharray="6 4" />

              {/* Dashboard top arch */}
              <path d="M 60 100 Q 200 52 340 100" fill="none"
                stroke="rgba(0,191,165,0.25)" strokeWidth="1.5" />

              {/* Center console body */}
              <rect x="145" y="76" width="110" height="72" rx="8" fill="#0C1520"
                stroke="rgba(0,191,165,0.35)" strokeWidth="1.2" />
              {/* Center console screen detail */}
              <rect x="153" y="83" width="94" height="52" rx="4" fill="#0A0F18"
                stroke="rgba(0,191,165,0.5)" strokeWidth="0.8" />
              {/* Screen UI lines */}
              <rect x="160" y="91" width="50" height="4" rx="2" fill="#00BFA5" opacity="0.6" />
              <rect x="160" y="99" width="70" height="2.5" rx="1.5" fill="#1E3040" />
              <rect x="160" y="105" width="60" height="2.5" rx="1.5" fill="#1E3040" />
              {/* Waveform in center screen */}
              <path d="M160 122 Q170 112 180 122 T200 122 T220 115 T238 122"
                stroke="#00BFA5" strokeWidth="1.5" fill="none" opacity="0.8" />

              {/* Steering wheel */}
              <circle cx="110" cy="185" r="38" fill="none"
                stroke="rgba(0,191,165,0.2)" strokeWidth="1.5" />
              <circle cx="110" cy="185" r="28" fill="none"
                stroke="rgba(0,191,165,0.15)" strokeWidth="1" />
              <circle cx="110" cy="185" r="10" fill="#0C1520"
                stroke="rgba(0,191,165,0.3)" strokeWidth="1" />
              {/* Steering spokes */}
              <line x1="110" y1="157" x2="110" y2="175" stroke="rgba(0,191,165,0.25)" strokeWidth="2" />
              <line x1="85" y1="200" x2="102" y2="191" stroke="rgba(0,191,165,0.25)" strokeWidth="2" />
              <line x1="135" y1="200" x2="118" y2="191" stroke="rgba(0,191,165,0.25)" strokeWidth="2" />

              {/* Left speaker grille */}
              <rect x="45" y="130" width="52" height="36" rx="6" fill="#0C1520"
                stroke="rgba(2,136,209,0.4)" strokeWidth="1" />
              {[0,1,2,3,4].map(i => (
                <line key={i} x1={50} y1={136 + i * 6} x2={92} y2={136 + i * 6}
                  stroke="rgba(2,136,209,0.3)" strokeWidth="0.8" />
              ))}
              <circle cx="71" cy="148" r="10" fill="none"
                stroke="rgba(2,136,209,0.5)" strokeWidth="1" strokeDasharray="3 2" />

              {/* Right speaker grille */}
              <rect x="303" y="130" width="52" height="36" rx="6" fill="#0C1520"
                stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
              {[0,1,2,3,4].map(i => (
                <line key={i} x1={308} y1={136 + i * 6} x2={350} y2={136 + i * 6}
                  stroke="rgba(245,158,11,0.3)" strokeWidth="0.8" />
              ))}
              <circle cx="329" cy="148" r="10" fill="none"
                stroke="rgba(245,158,11,0.5)" strokeWidth="1" strokeDasharray="3 2" />

              {/* Wire harness routing lines (bottom) */}
              <path d="M 80 225 Q 140 240 200 238 Q 260 240 320 225"
                stroke="rgba(139,92,246,0.35)" strokeWidth="2" fill="none" strokeDasharray="5 3" />
              <path d="M 120 230 L 120 250 Q 140 255 200 255 Q 260 255 280 250 L 280 230"
                stroke="rgba(139,92,246,0.2)" strokeWidth="1.5" fill="none" />
              {/* PCB module right side */}
              <rect x="300" y="195" width="62" height="42" rx="4" fill="#0C1520"
                stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
              {[0,1,2].map(i => (
                <rect key={i} x={306} y={204 + i * 10} width={30} height={5} rx={2}
                  fill="rgba(245,158,11,0.2)" />
              ))}
              {[0,1,2,3].map(i => (
                <circle key={i} cx={346 + 0} cy={204 + i * 8} r={2}
                  fill="rgba(245,158,11,0.5)" />
              ))}

              {/* Connector lines from hotspots to edges */}
              {/* IVI → center console */}
              <ConnectorLine x1={200} y1={108} x2={200} y2={148} color="#00BFA5"
                active={displayId === 'ivi'} />
              {/* Audio → left speaker */}
              <ConnectorLine x1={108} y1={155} x2={97} y2={148} color="#0288D1"
                active={displayId === 'audio'} />
              {/* SMT → right PCB */}
              <ConnectorLine x1={292} y1={155} x2={303} y2={148} color="#F59E0B"
                active={displayId === 'smt'} />
              {/* Harness → bottom routing */}
              <ConnectorLine x1={200} y1={200} x2={200} y2={238} color="#8B5CF6"
                active={displayId === 'harness'} />

              {/* ── Hotspot Nodes ── */}
              {hotspots.map((h) => {
                const isActive = displayId === h.id;
                return (
                  <g
                    key={h.id}
                    onClick={() => handleSelect(h.id)}
                    onMouseEnter={() => setHovered(h.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    aria-label={h.label}
                    aria-pressed={activeId === h.id}
                  >
                    {/* Outer pulse ring */}
                    <circle
                      cx={h.cx} cy={h.cy} r={isActive ? 26 : 20}
                      fill={`url(#nodeGrad-${h.id})`}
                      className={isActive ? 'bp-node-pulse' : ''}
                      style={{ transition: 'r 0.3s ease' }}
                    />
                    {/* Node circle */}
                    <circle
                      cx={h.cx} cy={h.cy} r={isActive ? 13 : 10}
                      fill={isActive ? h.color : '#0C1520'}
                      stroke={h.color}
                      strokeWidth={isActive ? 2 : 1.5}
                      filter={isActive ? 'url(#softGlow)' : 'none'}
                      style={{ transition: 'all 0.3s ease' }}
                    />
                    {/* Inner dot */}
                    <circle
                      cx={h.cx} cy={h.cy} r={isActive ? 4 : 3}
                      fill={isActive ? '#fff' : h.color}
                      opacity={isActive ? 1 : 0.7}
                      style={{ transition: 'all 0.3s ease' }}
                    />
                    {/* Label */}
                    <text
                      x={h.id === 'audio' ? h.cx - 16 : h.id === 'smt' ? h.cx + 16 : h.cx}
                      y={h.id === 'ivi' ? h.cy - 18 : h.id === 'harness' ? h.cy + 20 : h.cy - 16}
                      fill={isActive ? h.color : 'rgba(255,255,255,0.5)'}
                      fontSize="8"
                      fontFamily="'JetBrains Mono', 'Consolas', monospace"
                      fontWeight={isActive ? '700' : '400'}
                      textAnchor={h.id === 'audio' ? 'end' : h.id === 'smt' ? 'start' : 'middle'}
                      style={{ transition: 'all 0.3s ease', pointerEvents: 'none' }}
                    >
                      {h.label}
                    </text>
                  </g>
                );
              })}

              {/* Corner rulers */}
              <text x="36" y="55" fill="rgba(0,191,165,0.3)" fontSize="7" fontFamily="monospace">GPT-BLUEPRINT</text>
              <text x="340" y="55" fill="rgba(0,191,165,0.3)" fontSize="7" fontFamily="monospace" textAnchor="end">REV.4</text>
              <text x="36" y="270" fill="rgba(0,191,165,0.2)" fontSize="6" fontFamily="monospace">AUTOMOTIVE ELECTRONICS / IVI / AUDIO / SMT / EMS</text>
            </svg>
          </div>

          {/* RIGHT: Detail Panel */}
          <div
            className="blueprint-detail-panel"
            key={displayId}
            style={{ '--accent': displayHotspot?.color }}
          >
            {/* Panel header */}
            <div className="bdp-header">
              <span
                className="bdp-badge"
                style={{ color: displayHotspot?.color, borderColor: `${displayHotspot?.color}40`, background: `${displayHotspot?.color}12` }}
              >
                {displayHotspot?.badge}
              </span>
              <span className="bdp-stat">{displayHotspot?.stat}</span>
            </div>

            <h3 className="bdp-title">{displayHotspot?.title}</h3>
            <p className="bdp-desc">{displayHotspot?.desc}</p>

            {/* Specs list */}
            <ul className="bdp-specs">
              {displayHotspot?.specs.map((s, i) => (
                <li key={i} className="bdp-spec-item">
                  <span className="bdp-spec-dot" style={{ background: displayHotspot?.color }} />
                  {s}
                </li>
              ))}
            </ul>

            {/* Navigation dots */}
            <div className="bdp-nav-dots">
              {hotspots.map(h => (
                <button
                  key={h.id}
                  className={`bdp-dot ${activeId === h.id ? 'bdp-dot--active' : ''}`}
                  style={activeId === h.id ? { background: h.color } : {}}
                  onClick={() => handleSelect(h.id)}
                  aria-label={h.label}
                  title={h.label}
                />
              ))}
            </div>

            {/* CTA */}
            <Link
              to={`/products?category=${displayHotspot?.categoryKey}`}
              className="bdp-cta"
              style={{ '--accent': displayHotspot?.color }}
            >
              <span>{isId ? 'Lihat Produk & Spesifikasi' : 'View Products & Specs'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Bottom action bar ── */}
        <div className="blueprint-bottom-bar fade-up">
          <div className="bbb-left">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="bbb-icon">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <div>
              <strong className="bbb-title">
                {isId ? 'Butuh Spesifikasi Teknis atau Datasheet?' : 'Need Technical Specs or Datasheets?'}
              </strong>
              <p className="bbb-desc">
                {isId
                  ? 'Katalog interaktif kami memuat 40+ kode produk lengkap dengan sertifikasi dan form RFQ langsung.'
                  : 'Our interactive catalog covers 40+ product codes with full certifications and direct RFQ forms.'}
              </p>
            </div>
          </div>
          <Link to="/products" className="btn btn--primary bbb-btn">
            <span>{isId ? 'Buka Katalog Produk' : 'Open Product Catalog'}</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
