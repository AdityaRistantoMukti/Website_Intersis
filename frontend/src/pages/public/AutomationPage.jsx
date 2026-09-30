import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './AutomationPage.css';

const AUTOMATION_ITEMS = [
  {
    id: 'gpt-ict-4000',
    category: 'ict',
    categoryLabel: 'In-Circuit Test (ICT)',
    badge: 'High-Precision Vacuum',
    name: 'GPT-ICT-4000 Dual-Chamber Vacuum Pneumatic ICT Jig',
    desc: 'Automated bed-of-nails fixture engineered for high-density automotive PCBA with Kelvin 4-wire resistance measurement and vacuum sealing chamber.',
    cycleTime: '< 8.5 seconds',
    capacity: '1,024 test probe points',
    plc: 'Omron Sysmac NJ-Series (EtherCAT)',
    pneumatics: 'Festo DNC Pneumatic Cylinders',
    mesSupport: 'SECS/GEM & OPC-UA Realtime Telemetry',
    accentColor: '#00897b',
    svgIcon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="6" y="10" width="52" height="44" rx="4" stroke="#00897b" strokeWidth="2" strokeDasharray="4 2" />
        <line x1="6" y1="26" x2="58" y2="26" stroke="#00897b" strokeWidth="1.5" />
        <circle cx="16" cy="18" r="3" fill="#2dd4bf" />
        <circle cx="26" cy="18" r="3" fill="#2dd4bf" />
        <circle cx="36" cy="18" r="3" fill="#2dd4bf" />
        <circle cx="48" cy="18" r="4" stroke="#f59e0b" strokeWidth="1.5" />
        {/* Test probes */}
        <line x1="16" y1="26" x2="16" y2="44" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="26" x2="24" y2="40" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="26" x2="32" y2="46" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        <line x1="40" y1="26" x2="40" y2="42" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        <line x1="48" y1="26" x2="48" y2="45" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
        {/* DUT PCB */}
        <rect x="12" y="44" width="40" height="6" rx="2" fill="#10b981" />
      </svg>
    )
  },
  {
    id: 'gpt-fct-900',
    category: 'fct',
    categoryLabel: 'Functional Circuit Test (FCT)',
    badge: 'Automotive Cockpit',
    name: 'GPT-FCT-900 High-Speed Infotainment & Display FCT Station',
    desc: 'Full-functional verification platform featuring automated HDMI 2.1 4K pattern generation, CAN-FD/LIN vehicle bus emulation, and optical touch response benchmarking.',
    cycleTime: '< 14.0 seconds',
    capacity: 'Dual-DUT parallel testing',
    plc: 'Mitsubishi iQ-R Series PLC',
    pneumatics: 'SMC Compact Guided Actuators',
    mesSupport: 'Custom MQTT + JSON Cloud MES Bridge',
    accentColor: '#3b82f6',
    svgIcon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="12" width="48" height="34" rx="4" stroke="#3b82f6" strokeWidth="2" />
        <rect x="14" y="18" width="36" height="22" rx="2" fill="#1e293b" />
        <path d="M18 32 L26 24 L32 30 L42 20" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="24" y1="46" x2="40" y2="46" stroke="#3b82f6" strokeWidth="3" />
        <line x1="32" y1="46" x2="32" y2="54" stroke="#3b82f6" strokeWidth="3" />
        <rect x="20" y="54" width="24" height="4" rx="2" fill="#3b82f6" />
      </svg>
    )
  },
  {
    id: 'gpt-eol-8200',
    category: 'eol',
    categoryLabel: 'End-of-Line (EOL)',
    badge: 'EV & High-Voltage',
    name: 'GPT-EOL-8200 Smart BMS & Power Electronics EOL Station',
    desc: 'High-voltage insulation and safety testing station for Battery Management Systems (BMS), including thermal sensor simulation, cell balancing validation, and laser barcode logging.',
    cycleTime: '< 18.5 seconds',
    capacity: 'Up to 96-channel voltage cell simulation',
    plc: 'Beckhoff TwinCAT 3 Industrial PC',
    pneumatics: 'Festo Servopneumatic Positioning',
    mesSupport: 'IATF 16949 Full Traceability Database',
    accentColor: '#f59e0b',
    svgIcon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="8" width="48" height="48" rx="6" stroke="#f59e0b" strokeWidth="2" />
        <circle cx="32" cy="32" r="16" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M30 18 L24 34 H34 L28 48" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="16" r="3" fill="#10b981" />
        <circle cx="48" cy="16" r="3" fill="#ef4444" />
      </svg>
    )
  },
  {
    id: 'gpt-disp-600',
    category: 'dispensing',
    categoryLabel: 'Robotic Dispensing',
    badge: '6-Axis Conformal',
    name: 'GPT-DISP-600 Automated Dual-Head Selective Conformal Coating Robot',
    desc: 'Precision selective spray and needle dispensing machine for silicone/acrylic potting with UV cure inspection and laser surface height compensation.',
    cycleTime: '< 22.0 seconds',
    capacity: '±0.015 mm dispensing repeatability',
    plc: 'Panasonic FP7 Modular Controller',
    pneumatics: 'Nordson EFD Precision Fluid Valves',
    mesSupport: 'Real-time Fluid Weight & Flow Telemetry',
    accentColor: '#8b5cf6',
    svgIcon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <line x1="8" y1="16" x2="56" y2="16" stroke="#8b5cf6" strokeWidth="3" />
        <rect x="26" y="10" width="12" height="14" rx="2" fill="#8b5cf6" />
        <line x1="32" y1="24" x2="32" y2="40" stroke="#a78bfa" strokeWidth="2.5" />
        <circle cx="32" cy="42" r="3" fill="#ec4899" />
        {/* Dispense drop */}
        <path d="M32 46 C32 46 28 52 28 54 A4 4 0 0 0 36 54 C36 52 32 46 32 46 Z" fill="#ec4899" />
        <rect x="14" y="54" width="36" height="4" rx="2" fill="#475569" />
      </svg>
    )
  },
  {
    id: 'gpt-opt-300',
    category: 'fct',
    categoryLabel: 'Optical & Metrology',
    badge: '3D Laser AOI',
    name: 'GPT-OPT-300 Multi-Angle Solder Joint Metrology & Vision Jig',
    desc: 'High-speed inline optical verification with 4-way telecentric lenses and coaxial lighting, detecting 0201 solder bridge, polarity, coplanarity, and tombstoning.',
    cycleTime: '< 7.2 seconds / board',
    capacity: 'Resolution 10 μm / pixel',
    plc: 'Keyence KV-8000 Ultra High-Speed PLC',
    pneumatics: 'SMC Anti-Static ESD Cylinders',
    mesSupport: 'Hikvision / Cognex Vision MES Log',
    accentColor: '#06b6d4',
    svgIcon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="22" stroke="#06b6d4" strokeWidth="2" />
        <circle cx="32" cy="32" r="14" stroke="#22d3ee" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="4" fill="#06b6d4" />
        <line x1="32" y1="4" x2="32" y2="12" stroke="#06b6d4" strokeWidth="2" />
        <line x1="32" y1="52" x2="32" y2="60" stroke="#06b6d4" strokeWidth="2" />
        <line x1="4" y1="32" x2="12" y2="32" stroke="#06b6d4" strokeWidth="2" />
        <line x1="52" y1="32" x2="60" y2="32" stroke="#06b6d4" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: 'gpt-harn-150',
    category: 'wireharness',
    categoryLabel: 'Wire Harness',
    badge: '1500VDC Hipot',
    name: 'GPT-HARN-150 Automated Wire Harness Continuity & Hipot Rig',
    desc: 'Pneumatic clamping test console with 4-wire resistance, dielectric withstand voltage (Hipot), insulation resistance up to 10 GΩ, and automated connector lock check.',
    cycleTime: '< 9.0 seconds',
    capacity: '256 test pins / 128 wire pairs',
    plc: 'Mitsubishi FX5U Compact PLC',
    pneumatics: 'Festo Compact Clamping Cylinders',
    mesSupport: 'Barcode Scan & Pass/Fail Direct Label Print',
    accentColor: '#10b981',
    svgIcon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path d="M12 16 C24 16 24 48 36 48 C48 48 48 20 56 20" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
        <path d="M12 28 C22 28 26 40 36 40 C44 40 48 32 56 32" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
        <rect x="6" y="10" width="8" height="24" rx="2" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
        <rect x="52" y="14" width="8" height="24" rx="2" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
      </svg>
    )
  }
];

const CAPABILITIES = [
  {
    title: 'In-House Precision Tooling',
    desc: 'Haas 4-Axis CNC machining center for rapid milling of ESD Bakelite, POM-C, and acrylic test nests with ±0.01mm tolerance.',
    icon: '⚙️'
  },
  {
    title: 'Multi-Brand PLC & Robotics',
    desc: 'Certified firmware engineering across Omron Sysmac, Mitsubishi iQ, Siemens S7-1500, and Beckhoff TwinCAT architectures.',
    icon: '⚡'
  },
  {
    title: 'Industry 4.0 & MES Telemetry',
    desc: 'Direct OPC-UA, MQTT, and SECS/GEM connectivity providing real-time yield rate, CPK data, and parametric waveform logging.',
    icon: '📊'
  },
  {
    title: '7-Day Rapid Prototyping',
    desc: 'Fast-track engineering design to commissioning pipeline for custom pneumatic test fixtures and functional test beds.',
    icon: '⏱️'
  }
];

export default function AutomationPage() {
  const { i18n } = useTranslation();
  const isId = i18n.language === 'id';
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedMachine, setSelectedMachine] = useState(null);

  const filterTabs = [
    { key: 'all', label: isId ? 'Semua Mesin' : 'All Machines' },
    { key: 'ict', label: 'In-Circuit Test (ICT)' },
    { key: 'fct', label: 'Functional Test (FCT)' },
    { key: 'eol', label: 'End-of-Line (EOL)' },
    { key: 'dispensing', label: isId ? 'Otomasi Dispensing' : 'Robotic Dispensing' },
    { key: 'wireharness', label: 'Wire Harness' }
  ];

  const filteredMachines = activeFilter === 'all'
    ? AUTOMATION_ITEMS
    : AUTOMATION_ITEMS.filter(item => item.category === activeFilter);

  return (
    <div className="automation-page">
      {/* ── HEADER / BREADCRUMB ── */}
      <header className="auto-page-header">
        <div className="container">
          <div className="prod-breadcrumb">
            <Link to="/">{isId ? 'Beranda' : 'Home'}</Link>
            <span>/</span>
            <span className="prod-breadcrumb--active">{isId ? 'Otomasi' : 'Automation'}</span>
          </div>
          <div className="auto-header-intro">
            <h1 className="auto-header-title">
              {isId ? 'Rekayasa Mesin Otomasi & Test Jigs Presisi' : 'Industrial Automation & Custom Test Jigs'}
            </h1>
            <p className="auto-header-sub">
              {isId
                ? 'Divisi rekayasa otomasi in-house PT. Global Philsonic Technologies di Batam FTZ merancang dan memproduksi fixture uji ICT, FCT, EOL, serta robotika dispensing berstandar otomotif IATF 16949.'
                : 'PT. Global Philsonic Technologies in-house automation engineering division designs and manufactures turn-key ICT, FCT, EOL test fixtures, and dispensing robotics built to stringent IATF 16949 automotive standards.'}
            </p>
          </div>
        </div>
      </header>

      {/* ── PORTFOLIO SECTION ── */}
      <section className="auto-section">
        <div className="container">
          {/* Filter Pills */}
          <div className="auto-filter-bar">
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                className={`auto-filter-pill ${activeFilter === tab.key ? 'auto-filter-pill--active' : ''}`}
                onClick={() => setActiveFilter(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Machine Grid */}
          <div className="auto-grid">
            {filteredMachines.map(machine => (
              <article key={machine.id} className="auto-card">
                <div className="auto-card__visual">
                  {machine.svgIcon}
                </div>
                <div className="auto-card__body">
                  <span
                    className="auto-card__badge"
                    style={{
                      background: `${machine.accentColor}18`,
                      color: machine.accentColor,
                      border: `1px solid ${machine.accentColor}33`
                    }}
                  >
                    {machine.badge}
                  </span>
                  <h3 className="auto-card__title">{machine.name}</h3>
                  <p className="auto-card__desc">{machine.desc}</p>

                  <div className="auto-card__specs-list">
                    <div className="auto-spec-row">
                      <span className="auto-spec-row__k">{isId ? 'Waktu Siklus' : 'Cycle Time'}</span>
                      <span className="auto-spec-row__v" style={{ color: '#10b981' }}>{machine.cycleTime}</span>
                    </div>
                    <div className="auto-spec-row">
                      <span className="auto-spec-row__k">{isId ? 'Kapasitas Uji' : 'Test Capacity'}</span>
                      <span className="auto-spec-row__v">{machine.capacity}</span>
                    </div>
                    <div className="auto-spec-row">
                      <span className="auto-spec-row__k">{isId ? 'Kontroler PLC' : 'PLC Controller'}</span>
                      <span className="auto-spec-row__v">{machine.plc}</span>
                    </div>
                    <div className="auto-spec-row">
                      <span className="auto-spec-row__k">{isId ? 'Sistem Pneumatik' : 'Pneumatics'}</span>
                      <span className="auto-spec-row__v">{machine.pneumatics}</span>
                    </div>
                    <div className="auto-spec-row">
                      <span className="auto-spec-row__k">{isId ? 'Protokol MES' : 'MES Protocol'}</span>
                      <span className="auto-spec-row__v">{machine.mesSupport}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.25rem', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedMachine(machine)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: 'transparent',
                        border: '1px solid var(--teal, #00897b)',
                        color: 'var(--teal, #00897b)',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {isId ? 'Detail Teknis' : 'Technical Details'}
                    </button>
                    <Link
                      to="/contact"
                      style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        background: 'var(--teal, #00897b)',
                        color: '#ffffff',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {isId ? 'RFQ Fixture' : 'RFQ Fixture'}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── ENGINEERING CAPABILITIES HIGHLIGHTS ── */}
      <section className="auto-caps-section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {isId ? 'Kapabilitas Rekayasa Otomasi In-House' : 'In-House Automation & Tooling Capabilities'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              {isId
                ? 'Didukung fasilitas workshop mekanik mandiri di Batam untuk memastikan kecepatan turnaround dan akurasi jig tertinggi.'
                : 'Backed by dedicated CNC mechanical tooling workshops in Batam ensuring rapid turnaround and superior fixture accuracy.'}
            </p>
          </div>

          <div className="auto-caps-grid">
            {CAPABILITIES.map((cap, i) => (
              <div key={i} className="auto-cap-item">
                <div className="auto-cap-item__icon">{cap.icon}</div>
                <h4>{cap.title}</h4>
                <p>{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DETAIL MODAL ── */}
      {selectedMachine && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setSelectedMachine(null)}
        >
          <div
            style={{
              background: 'var(--navy-card, #0f172a)',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: '14px',
              maxWidth: '600px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: selectedMachine.accentColor, fontWeight: 700, textTransform: 'uppercase' }}>
                  {selectedMachine.categoryLabel}
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px' }}>{selectedMachine.name}</h3>
              </div>
              <button
                onClick={() => setSelectedMachine(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {selectedMachine.desc}
            </p>

            <div style={{ background: '#0b1320', padding: '1rem', borderRadius: '8px', border: '1px solid #1e293b', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: '#38bdf8', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isId ? 'Parameter Rekayasa Sistem' : 'System Engineering Parameters'}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.825rem' }}>
                <div><span style={{ color: '#64748b' }}>Cycle Time:</span> <strong style={{ color: '#10b981' }}>{selectedMachine.cycleTime}</strong></div>
                <div><span style={{ color: '#64748b' }}>Capacity:</span> <strong>{selectedMachine.capacity}</strong></div>
                <div><span style={{ color: '#64748b' }}>PLC Architecture:</span> <strong>{selectedMachine.plc}</strong></div>
                <div><span style={{ color: '#64748b' }}>Pneumatic System:</span> <strong>{selectedMachine.pneumatics}</strong></div>
                <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>MES Telemetry:</span> <strong>{selectedMachine.mesSupport}</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link
                to="/contact"
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'var(--teal, #00897b)',
                  color: '#ffffff',
                  textAlign: 'center',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                {isId ? 'Hubungi Engineering Team' : 'Contact Engineering Team'}
              </Link>
              <button
                onClick={() => setSelectedMachine(null)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  border: '1px solid #334155',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {isId ? 'Tutup' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
