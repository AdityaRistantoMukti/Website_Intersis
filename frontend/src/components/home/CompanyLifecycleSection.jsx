import { useState, useRef, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './CompanyLifecycleSection.css';

/* ── Interactive Animated Visual for each stage in the 3D Card ── */
function StageVisual({ stageIndex }) {
  if (stageIndex === 0) {
    // Stage 1: Design & Engineering (High-Density CAD / Multilayer Circuit Board)
    return (
      <div className="stage-canvas stage-canvas--design">
        <svg viewBox="0 0 400 240" className="stage-svg" aria-label="Circuit CAD Design Schematic">
          {/* Background Technical Grid */}
          <defs>
            <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="traceGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#cadGrid)" />

          {/* Circuit Traces */}
          <g className="cad-traces" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.8" fill="none">
            <path d="M 40 40 L 120 40 L 150 70 L 150 110" />
            <path d="M 40 80 L 100 80 L 130 110 L 150 110" />
            <path d="M 40 160 L 110 160 L 140 130 L 150 130" />
            <path d="M 40 200 L 130 200 L 150 180 L 150 140" />

            <path d="M 250 110 L 270 110 L 300 70 L 360 70" />
            <path d="M 250 130 L 270 130 L 290 150 L 360 150" />
            <path d="M 200 60 L 200 40 L 280 40 L 360 40" />
            <path d="M 200 180 L 200 200 L 280 200 L 360 200" />
          </g>

          {/* Animated Electron Energy Pulses */}
          <circle cx="120" cy="40" r="3" fill="#FFFFFF" className="cad-pulse cad-pulse--1" />
          <circle cx="100" cy="80" r="3" fill="#FFFFFF" className="cad-pulse cad-pulse--2" />
          <circle cx="280" cy="70" r="3" fill="#CBD5E1" className="cad-pulse cad-pulse--3" />
          <circle cx="290" cy="150" r="3" fill="#CBD5E1" className="cad-pulse cad-pulse--4" />

          {/* Central MCU Processor */}
          <g transform="translate(150, 70)">
            <rect x="0" y="0" width="100" height="100" rx="8" fill="#18181b" stroke="#FFFFFF" strokeWidth="2" />
            <rect x="12" y="12" width="76" height="76" rx="4" fill="#27272a" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
            <text x="50" y="44" fill="#FFFFFF" fontSize="11" fontWeight="800" textAnchor="middle" letterSpacing="0.08em">GPT-CORE</text>
            <text x="50" y="60" fill="#FFFFFF" fontSize="9" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">64-BIT DSP</text>
            <text x="50" y="74" fill="rgba(255,255,255,0.7)" fontSize="7" textAnchor="middle">AUTONOMOUS</text>

            {/* Micro Pins */}
            {[10, 25, 40, 55, 70, 85].map((pos) => (
              <g key={pos}>
                <rect x={pos - 3} y="-5" width="6" height="5" fill="#E4E4E7" />
                <rect x={pos - 3} y="100" width="6" height="5" fill="#E4E4E7" />
                <rect x="-5" y={pos - 3} width="5" height="6" fill="#E4E4E7" />
                <rect x="100" y={pos - 3} width="5" height="6" fill="#E4E4E7" />
              </g>
            ))}
          </g>

          {/* CAD Dimension Markers */}
          <line x1="140" y1="185" x2="260" y2="185" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3 3" />
          <text x="200" y="198" fill="rgba(45,212,191,0.8)" fontSize="8" textAnchor="middle" fontFamily="monospace">148.50 mm</text>
        </svg>

        {/* Live HUD Badges */}
        <div className="stage-canvas__tags">
          <span className="stage-tag">CAD MULTILAYER</span>
          <span className="stage-tag">SIGNAL INTEGRITY: 100%</span>
          <span className="stage-tag stage-tag--active">SCHEMATIC VERIFIED</span>
        </div>
      </div>
    );
  }

  if (stageIndex === 1) {
    // Stage 2: Quality & Reliability (3D Optical AOI & Solder Scanner Reticle)
    return (
      <div className="stage-canvas stage-canvas--quality">
        <svg viewBox="0 0 400 240" className="stage-svg" aria-label="3D Optical AOI Inspection Reticle">
          <defs>
            <linearGradient id="scanBeam" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0" />
              <stop offset="50%" stopColor="#22C55E" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Inspection Target Grid */}
          <rect x="40" y="30" width="320" height="180" rx="8" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* PCB Components Being Scanned */}
          <g fill="#1E293B" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
            <rect x="70" y="60" width="40" height="30" rx="3" />
            <rect x="130" y="60" width="60" height="40" rx="4" />
            <rect x="210" y="60" width="45" height="30" rx="3" />
            <rect x="275" y="60" width="55" height="50" rx="4" />

            <rect x="70" y="120" width="50" height="40" rx="4" />
            <rect x="140" y="125" width="80" height="50" rx="4" fill="#0B1320" stroke="#22C55E" strokeWidth="1.5" />
            <rect x="240" y="130" width="45" height="45" rx="3" />
          </g>

          {/* Animated Laser Scanning Line */}
          <g className="aoi-scanner">
            <line x1="30" y1="0" x2="370" y2="0" stroke="#22C55E" strokeWidth="2.5" />
            <rect x="30" y="-24" width="340" height="24" fill="url(#scanBeam)" />
          </g>

          {/* Target Reticle Crosshairs */}
          <circle cx="180" cy="150" r="26" fill="none" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="6 3" className="aoi-reticle" />
          <circle cx="180" cy="150" r="4" fill="#22C55E" />
          <line x1="180" y1="115" x2="180" y2="185" stroke="rgba(34, 197, 94, 0.6)" strokeWidth="1" />
          <line x1="145" y1="150" x2="215" y2="150" stroke="rgba(34, 197, 94, 0.6)" strokeWidth="1" />

          {/* Pass Inspection Tags */}
          <g transform="translate(230, 140)">
            <rect x="0" y="0" width="80" height="22" rx="4" fill="rgba(34, 197, 94, 0.15)" stroke="#22C55E" strokeWidth="1" />
            <text x="40" y="15" fill="#22C55E" fontSize="9" fontWeight="800" textAnchor="middle" letterSpacing="0.05em">AOI: 100% PASS</text>
          </g>
        </svg>

        <div className="stage-canvas__tags">
          <span className="stage-tag stage-tag--green">3D SPI SOLDER PASS</span>
          <span className="stage-tag stage-tag--green">ESD CLASS 100K</span>
          <span className="stage-tag">DEFECT RATE: &lt; 0.1%</span>
        </div>
      </div>
    );
  }

  if (stageIndex === 2) {
    // Stage 3: Manufacturing (High-Speed SMT Placement & Gantry)
    return (
      <div className="stage-canvas stage-canvas--mfg">
        <svg viewBox="0 0 400 240" className="stage-svg" aria-label="High-Speed SMT Gantry System">
          {/* SMT Feeder Rails */}
          <line x1="30" y1="50" x2="370" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
          <line x1="30" y1="190" x2="370" y2="190" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />

          {/* Feeder Tape Reels */}
          {[60, 95, 130, 165, 200, 235, 270, 305, 340].map((x) => (
            <circle key={x} cx={x} cy="50" r="9" fill="#18181b" stroke="#CBD5E1" strokeWidth="1.2" />
          ))}

          {/* PCB Panel in Staging */}
          <rect x="80" y="90" width="240" height="80" rx="4" fill="#18181b" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Array of placed components */}
          {[100, 130, 160, 190, 220, 250, 280].map((x) => (
            <g key={x}>
              <rect x={x} y="105" width="16" height="12" rx="1.5" fill="#27272a" stroke="#FFFFFF" strokeWidth="1" />
              <rect x={x} y="130" width="16" height="18" rx="2" fill="#27272a" stroke="#94A3B8" strokeWidth="1" />
            </g>
          ))}

          {/* SMT Placement Head Gantry (Moving Assembly) */}
          <g className="smt-head">
            <line x1="175" y1="20" x2="175" y2="120" stroke="#CBD5E1" strokeWidth="2.5" />
            <rect x="155" y="65" width="40" height="30" rx="4" fill="#18181b" stroke="#CBD5E1" strokeWidth="2" />
            <polygon points="170,95 180,95 175,115" fill="#CBD5E1" />
            <circle cx="175" cy="115" r="4" fill="#F8FAFC" className="smt-sparkle" />
          </g>

          {/* Telemetry Gauge Display */}
          <g transform="translate(45, 110)">
            <rect x="0" y="0" width="85" height="34" rx="4" fill="#0B1320" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" />
            <text x="8" y="16" fill="#94A3B8" fontSize="8" fontWeight="600">SMT SPEED</text>
            <text x="8" y="28" fill="#38BDF8" fontSize="11" fontWeight="800" fontFamily="monospace">80K CPH</text>
          </g>
        </svg>

        <div className="stage-canvas__tags">
          <span className="stage-tag stage-tag--cyan">PANASONIC HIGH-SPEED</span>
          <span className="stage-tag">01005 / FINE BGA</span>
          <span className="stage-tag stage-tag--active">80,000 CPH</span>
        </div>
      </div>
    );
  }

  // Stage 4: Supply Chain & Logistics (Batam FTZ to Singapore Trade Corridor Radar)
  return (
    <div className="stage-canvas stage-canvas--logistics">
      <svg viewBox="0 0 400 240" className="stage-svg" aria-label="Batam to Singapore Maritime Corridor">
        <defs>
          <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Radar Rings */}
        <circle cx="200" cy="120" r="100" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
        <circle cx="200" cy="120" r="65" fill="none" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1" />
        <circle cx="200" cy="120" r="30" fill="none" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />
        <line x1="200" y1="10" x2="200" y2="230" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
        <line x1="90" y1="120" x2="310" y2="120" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />

        {/* Trade Route Vector (Batam -> Singapore) */}
        <path d="M 120 160 Q 180 110 270 70" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="5 4" className="radar-route" />

        {/* Batam FTZ Node */}
        <g transform="translate(120, 160)">
          <circle cx="0" cy="0" r="8" fill="#18181b" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="0" cy="0" r="4" fill="#FFFFFF" className="radar-ping" />
          <text x="-12" y="22" fill="#F8FAFC" fontSize="10" fontWeight="800">BATAM FTZ</text>
          <text x="-12" y="33" fill="#E4E4E7" fontSize="7.5" fontWeight="600" fontFamily="monospace">1.12° N, 104.05° E</text>
        </g>

        {/* Singapore Transshipment Port Node */}
        <g transform="translate(270, 70)">
          <circle cx="0" cy="0" r="8" fill="#18181b" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="0" cy="0" r="4" fill="#CBD5E1" />
          <text x="12" y="3" fill="#F8FAFC" fontSize="10" fontWeight="800">SINGAPORE PORT</text>
          <text x="12" y="14" fill="#CBD5E1" fontSize="7.5" fontWeight="600" fontFamily="monospace">45-MIN TRANSIT</text>
        </g>

        {/* Fast Cargo Ship Icon */}
        <g className="radar-vessel">
          <polygon points="190,110 206,105 200,116" fill="#FFFFFF" />
        </g>

        {/* C/O Indonesia Seal Stamp */}
        <g transform="translate(280, 140)">
          <circle cx="35" cy="35" r="32" fill="rgba(255, 255, 255, 0.1)" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="35" cy="35" r="27" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="3 2" />
          <text x="35" y="30" fill="#F8FAFC" fontSize="8" fontWeight="800" textAnchor="middle">C/O INDONESIA</text>
          <text x="35" y="42" fill="#FFFFFF" fontSize="7" fontWeight="700" textAnchor="middle">0% TARIFF HUB</text>
        </g>
      </svg>

      <div className="stage-canvas__tags">
        <span className="stage-tag stage-tag--teal">BATAM FTZ 0% TARIFF</span>
        <span className="stage-tag stage-tag--teal">45-MIN SG SEA CARGO</span>
        <span className="stage-tag">C/O CERTIFIED</span>
      </div>
    </div>
  );
}

/* ── Varied Content Presentation per Stage (No repetitive points) ── */
function StageDetailContent({ stageIndex, lang }) {
  if (stageIndex === 0) {
    // Stage 1: Design & Engineering -> 4 R&D Capability Disciplines
    const disciplines = lang === 'id' ? [
      { code: 'HW-01', title: 'Sirkuit & PCB Multilayer', desc: 'Desain skematik, routing kecepatan tinggi & kontrol impedansi RF.' },
      { code: 'ME-02', title: 'Tooling & Mold Mekanikal', desc: 'Perancangan 3D CAD casing, cetakan injeksi presisi & heat sink.' },
      { code: 'SW-03', title: 'Firmware & Android OS', desc: 'Kernel real-time audio, Android head unit & tuning DSP akustik.' },
      { code: 'QA-04', title: 'Standar Mutu ISO 9001', desc: 'Validasi kelayakan DFM untuk mempercepat siklus peluncuran produk.' }
    ] : [
      { code: 'HW-01', title: 'Circuit & Multilayer PCB', desc: 'Schematic capture, high-speed routing & RF impedance control.' },
      { code: 'ME-02', title: 'Mechanical Tooling & Mold', desc: '3D structural CAD, precision injection molds & thermal heat sinks.' },
      { code: 'SW-03', title: 'Firmware & Android OS', desc: 'Real-time audio kernel, Android OS & acoustic DSP tuning.' },
      { code: 'QA-04', title: 'ISO 9001 Standards', desc: 'DFM validation accelerating time-to-market and mass-production.' }
    ];

    return (
      <div className="stage-variant stage-variant--disciplines">
        {disciplines.map((d) => (
          <div key={d.code} className="discipline-item">
            {/* <span className="discipline-item__code">{d.code}</span> */}
            <div className="discipline-item__body">
              <strong className="discipline-item__title">{d.title}</strong>
              <p className="discipline-item__desc">{d.desc}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (stageIndex === 1) {
    // Stage 2: Quality & Reliability -> Verification Test Pipeline
    const pipeline = lang === 'id' ? [
      {
        step: 'TEST 01',
        title: 'Inline 3D SPI & AOI Laser Scan',
        detail: 'Inspeksi 100% volume pasta solder dan akurasi posisi komponen mikro 01005 secara otomatis.',
        badge: '100% Optical Scan'
      },
      {
        step: 'TEST 02',
        title: 'Custom In-Circuit (ICT) & Functional (FCT)',
        detail: 'Pengujian sinyal elektrik dan performa audio otomatis dalam <8.5 detik per unit.',
        badge: 'Automated FCT'
      },
      {
        step: 'TEST 03',
        title: 'Thermal Chamber & Vibration Stress',
        detail: 'Uji keandalan ketahanan suhu ekstrem (-40°C ~ +85°C) & drop-vibration standar otomotif.',
        badge: 'Zero-Defect Standard'
      }
    ] : [
      {
        step: 'TEST 01',
        title: 'Inline 3D SPI & AOI Laser Scan',
        detail: '100% solder paste volume inspection & 01005 micro-component placement verification.',
        badge: '100% Optical Scan'
      },
      {
        step: 'TEST 02',
        title: 'Custom In-Circuit (ICT) & Functional (FCT)',
        detail: 'Automated electrical signal & audio acoustic test completed under 8.5s per unit.',
        badge: 'Automated FCT'
      },
      {
        step: 'TEST 03',
        title: 'Thermal Chamber & Stress Aging',
        detail: 'Extreme temperature endurance testing (-40°C to +85°C) & automotive vibration standards.',
        badge: 'Zero-Defect Standard'
      }
    ];

    return (
      <div className="stage-variant stage-variant--pipeline">
        {pipeline.map((item) => (
          <div key={item.step} className="quality-station">
            {/* <div className="quality-station__badge">{item.step}</div> */}
            <div className="quality-station__content">
              <div className="quality-station__header">
                <span className="quality-station__title">{item.title}</span>
                {/* <span className="quality-station__tag">{item.badge}</span> */}
              </div>
              <p className="quality-station__desc">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (stageIndex === 2) {
    // Stage 3: Manufacturing -> Production Specs & Capacity Grid
    const specs = lang === 'id' ? [
      { value: '80,000 CPH', label: 'Kecepatan Penempatan SMT', sub: 'High-speed dual-beam chip mounter' },
      { value: 'Class 100K', label: 'Cleanroom Anti-Statis', sub: 'ESD-controlled manufacturing' },
      { value: '10-Zone Reflow', label: 'Solder Bebas Timbal', sub: 'Nitrogen N2 thermal profiling' },
      { value: 'MES Barcode', label: 'Serialisasi Real-Time', sub: '100% unit-level component tracking' }
    ] : [
      { value: '80,000 CPH', label: 'SMT Placement Speed', sub: 'High-speed dual-beam chip mounters' },
      { value: 'Class 100K', label: 'Anti-Static Cleanroom', sub: 'ESD-controlled manufacturing' },
      { value: '10-Zone Reflow', label: 'Lead-Free Soldering', sub: 'Nitrogen N2 thermal profiling' },
      { value: 'MES Barcode', label: 'Real-Time Serialization', sub: '100% unit-level component tracking' }
    ];

    return (
      <div className="stage-variant stage-variant--manufacturing">
        {specs.map((s, i) => (
          <div key={i} className="mfg-spec-block">
            <div className="mfg-spec-block__val">{s.value}</div>
            <div className="mfg-spec-block__label">{s.label}</div>
            <div className="mfg-spec-block__sub">{s.sub}</div>
          </div>
        ))}
      </div>
    );
  }

  // Stage 4: Supply Chain -> FTZ & Global Trade Corridor Advantage Box
  const advantages = lang === 'id' ? [
    {
      title: 'Batam Free Trade Zone (FTZ)',
      desc: 'Pembebasan bea masuk (0% import duty) untuk seluruh bahan baku komponen elektronik dan mesin modal.'
    },
    {
      title: 'Akses Maritim 45 Menit ke Singapura',
      desc: 'Koneksi tongkang reguler langsung ke pelabuhan transshipment global PSA Singapura untuk ekspor kilat.'
    },
    {
      title: 'Certificate of Origin (C/O) Made in Indonesia',
      desc: 'Sertifikasi asal resmi yang memberikan kepatuhan regulasi dan mitigasi tarif ekspor untuk pasar AS & global.'
    }
  ] : [
    {
      title: 'Batam Free Trade Zone (FTZ)',
      desc: '0% import duty exemption for electronic raw materials and capital manufacturing equipment.'
    },
    {
      title: '45-Min Direct Maritime Transit to Singapore',
      desc: 'Regular direct feeder connection to Singapore PSA global international transshipment hub.'
    },
    {
      title: 'Official C/O Made in Indonesia',
      desc: 'Preferential origin certification mitigating tariff burdens for US and European export markets.'
    }
  ];

  return (
    <div className="stage-variant stage-variant--supply">
      {advantages.map((adv, i) => (
        <div key={i} className="supply-advantage-item">
          <span className="supply-advantage-item__num">0{i + 1}</span>
          <div>
            <strong className="supply-advantage-item__title">{adv.title}</strong>
            <p className="supply-advantage-item__desc">{adv.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main Interactive Section Component ── */
export default function CompanyLifecycleSection() {
  const { t, i18n } = useTranslation(['home', 'common']);
  const [activeStep, setActiveStep] = useState(0);
  const card3DRef = useRef(null);

  const rawSteps = t('home:about.lifecycle', { returnObjects: true });
  const steps = Array.isArray(rawSteps) ? rawSteps : [];
  const activeData = steps[activeStep] || steps[0] || {};

  const stepCategories = i18n.language === 'id'
    ? ['Engineering R&D & Desain', 'Kendali Mutu Presisi', 'Fasilitas Manufaktur SMT', 'Logistik & Regulasi Ekspor']
    : ['R&D & Engineering', 'Precision Quality Control', 'SMT Manufacturing Plant', 'Logistics & Export Trade'];

  // Interactive 3D Card Parallax Tilt on Mouse Move
  const handleMouseMove = (e) => {
    const card = card3DRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.setProperty('--sheen-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--sheen-y', `${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = () => {
    const card = card3DRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <section
      className="section about-interactive-section"
      id="about"
      onMouseLeave={handleMouseLeave}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header fade-up text-center">
          
          <h2 className="section-title section-title--light">{t('home:about.title')}</h2>
          <div className="divider" />
          <p className="section-subtitle section-subtitle--light">{t('home:about.subtitle')}</p>
        </div>

        {/* ── 4-STEP PIPELINE STEPPER (Exact match to reference site) ── */}
        <div className="lifecycle-stepper fade-up">
          <div className="lifecycle-stepper__bar">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              const isPassed = activeStep > idx;

              return (
                <Fragment key={step.id || idx}>
                  <button
                    type="button"
                    className={`lifecycle-node${isActive ? ' lifecycle-node--active' : ''}${isPassed ? ' lifecycle-node--passed' : ''}`}
                    onClick={() => setActiveStep(idx)}
                    aria-label={`Go to ${step.navLabel}`}
                  >
                    <div className="lifecycle-node__circle">
                      <span className="lifecycle-node__number">{idx + 1}</span>
                      {isActive && <span className="lifecycle-node__ping" />}
                    </div>
                    <span className="lifecycle-node__label">{step.navLabel}</span>
                  </button>

                  {/* Connected Progress Line between this node and next node */}
                  {idx < steps.length - 1 && (
                    <div className="lifecycle-connector" aria-hidden="true">
                      <div
                        className="lifecycle-connector__fill"
                        style={{
                          width: activeStep > idx ? '100%' : '0%'
                        }}
                      />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>

        {/* ── TWO-COLUMN INTERACTIVE STAGE ── */}
        <div className="lifecycle-stage fade-up">
          {/* Left Column: Dynamic Technical Description */}
          <div className="lifecycle-stage__content">
            <div className="lifecycle-stage__top">
              {/* <div className="lifecycle-stage__phase-header">
                <span className="lifecycle-stage__phase-badge">Phase 0{activeStep + 1}</span>
                <span className="lifecycle-stage__phase-sep">•</span>
                <span className="lifecycle-stage__phase-category">{stepCategories[activeStep]}</span>
              </div> */}

              <h3 className="lifecycle-stage__title">{activeData.title}</h3>
              <p className="lifecycle-stage__lead">{activeData.lead}</p>
            </div>

            {/* Varied stage content deck */}
            <div className="lifecycle-stage__details-deck">
              <StageDetailContent stageIndex={activeStep} lang={i18n.language} />
            </div>            
          </div>            
          {/* Right Column: 3D-Tilt Interactive Engineering HUD Terminal */}
          <div className="lifecycle-stage__visual-wrap">
            <div
              className="lifecycle-3d-card"
              ref={card3DRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Dynamic mouse sheen reflection */}
              <div className="lifecycle-3d-card__sheen" aria-hidden="true" />

              {/* Top HUD Terminal Header */}
              {/* <div className="lifecycle-3d-card__hud-header">
                <div className="hud-status">
                  <span className="hud-status__dot" />
                  <span className="hud-status__text">CAD / TELEMETRY HUD // STAGE 0{activeStep + 1}</span>
                </div>
                <span className="hud-coord">BTM 1.12° N, 104.05° E</span>
              </div> */}

              {/* Interactive Animated Canvas */}
              <div className="lifecycle-3d-card__viewport">
                <StageVisual stageIndex={activeStep} />
              </div>

              {/* Bottom Blueprint Telemetry Grid */}
              <div className="lifecycle-3d-card__telemetry">
                <div className="telemetry-stat">
                  <span className="telemetry-stat__value">Tanah Mas</span>
                  <span className="telemetry-stat__label">Blok L No.2, Batam City</span>
                </div>
                <div className="telemetry-stat">
                  <span className="telemetry-stat__value">80,000</span>
                  <span className="telemetry-stat__label">CPH SMT Line Placement</span>
                </div>
                <div className="telemetry-stat">
                  <span className="telemetry-stat__value">0% Duty</span>
                  <span className="telemetry-stat__label">Batam FTZ Raw Material Import</span>
                </div>
                <div className="telemetry-stat">
                  <span className="telemetry-stat__value">45 Min</span>
                  <span className="telemetry-stat__label">Direct Transit to Singapore Port</span>
                </div>
              </div>

              {/* Card Footer Technical Meta (Sleek design, no generic AI badges) */}
              <div className="lifecycle-3d-card__footer">
                <div className="card-footer-company">
                  <span className="card-footer-dot" />
                  <span className="card-footer-name">PT Global Philsonic Technologies</span>
                </div>
                <span className="card-footer-loc">Batam, Kepulauan Riau, Indonesia</span>
              </div>
            </div>
          </div>
        </div>
        {/* Actions */}
            {/* <div className="lifecycle-stage__actions" style={{marginTop: '3rem', justifyContent: 'center', display: 'flex'}}>
              <Link to="/about" className="btn btn--primary btn--md" >
                {t('home:about.cta')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link to="/contact" className="btn btn--outline-light btn--md">
                {i18n.language === 'id' ? 'Konsultasi R&D OEM' : 'Consult OEM R&D'}
              </Link>
            </div> */}
      </div>
    </section>
  );
}
