import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import './GalleryPage.css';

const GALLERY_DATA = [
  {
    id: 'smt-yamaha-line',
    category: 'smt',
    categoryLabel: 'SMT Production',
    title: 'High-Speed SMT Modular Placement Lines',
    desc: 'High-precision dual-beam Yamaha YSM20R mounters capable of 80,000 CPH, placing 0201 passives, fine-pitch BGA, and automotive microcontrollers with high accuracy.',
    location: 'Batam Plant 1, Bay A',
    spec: '80,000 CPH | 0201 to 55mm ICs | Dual Track Conveyor',
    img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'reflow-nitrogen-oven',
    category: 'smt',
    categoryLabel: 'SMT Production',
    title: '10-Zone Nitrogen Convection Reflow Oven',
    desc: 'Automotive grade reflow soldering with real-time KIC thermal profiling, O2 ppm control (<100 ppm), ensuring zero-voiding on critical power electronics.',
    location: 'Batam Plant 1, Bay B',
    spec: '10 Heated Zones | Dual Cooling | N2 Controlled Atmosphere',
    img: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'cleanroom-class100k',
    category: 'cleanroom',
    categoryLabel: 'Cleanroom Facility',
    title: 'ISO Class 8 (100K) Static-Controlled Cleanroom',
    desc: 'Dedicated dust-free environment with continuous ESD floor grounding, positive air pressure, HEPA filtration, and strict temperature/humidity stability for optical & ADAS assembly.',
    location: 'Batam Plant 2, Cleanroom Wing',
    spec: 'Class 100,000 (ISO 8) | Temp 22±2°C | Humidity 50±5% RH',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'spi-aoi-inspection',
    category: 'quality',
    categoryLabel: 'Quality & Reliability',
    title: '3D Solder Paste Inspection (SPI) & 3D AOI Station',
    desc: 'Inline 3D moiré fringe metrology measuring solder volume, height, and offset down to micron level before reflow, preventing downstream defects at the source.',
    location: 'Batam Plant 1, Quality Gate',
    spec: 'Dual Projector 3D SPI | 0.5 μm Z-resolution | 100% Inline',
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'jig-tooling-workshop',
    category: 'automation',
    categoryLabel: 'Automation Workshop',
    title: 'In-House CNC Mechanical Tooling & Jig Fabrication',
    desc: 'Haas 4-axis machining centers and precision drill presses crafting custom ESD-safe Bakelite and POM-C test fixtures, pneumatic vacuum chambers, and press-fit nests.',
    location: 'Batam Plant 1, Tooling Center',
    spec: 'Haas VF-2 CNC | ±0.01mm Tolerance | ESD Bakelite Milling',
    img: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'xray-inspection-bga',
    category: 'quality',
    categoryLabel: 'Quality & Reliability',
    title: 'High-Resolution 2D/3D X-Ray Non-Destructive Inspection',
    desc: '160 kV microfocus open-tube X-ray inspection for detecting solder voids under BGA balls, QFN pads, wire bond integrity, and internal barrel fill in multi-layer PCBAs.',
    location: 'Batam Plant 2, NDT Lab',
    spec: '160 kV Microfocus Tube | Geometric Magnification 2000x',
    img: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'thermal-shock-chamber',
    category: 'quality',
    categoryLabel: 'Quality & Reliability',
    title: 'Environmental Thermal Shock & Burn-In Chamber',
    desc: 'Rapid temperature cycling from -40°C to +125°C under continuous operational electrical load to stress-test solder joint durability and automotive electronics endurance.',
    location: 'Batam Plant 2, Reliability Wing',
    spec: '-50°C to +150°C | Transfer Time < 10s | 1,000 Cycle Testing',
    img: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'batam-ftz-logistics',
    category: 'facility',
    categoryLabel: 'Plant & Facilities',
    title: 'Batam Free Trade Zone Plant & Bonded Logistics Staging',
    desc: 'Strategic manufacturing hub situated 45 minutes by fast sea freight from Singapore global port, featuring temperature-controlled component storage and bonded customs clearance.',
    location: 'Batam FTZ, Batam Center',
    spec: '10,000 m² Facility | Bonded Customs Direct | 24/7 Operations',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80'
  }
];

export default function GalleryPage() {
  const { i18n } = useTranslation();
  const isId = i18n.language === 'id';
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeModalItem, setActiveModalItem] = useState(null);

  const filterTabs = [
    { key: 'all', label: isId ? 'Semua Fasilitas' : 'All Facilities' },
    { key: 'smt', label: 'SMT Lines' },
    { key: 'cleanroom', label: 'Cleanroom Class 100K' },
    { key: 'automation', label: isId ? 'Workshop Otomasi' : 'Automation Workshop' },
    { key: 'quality', label: 'QA & Lab Testing' },
    { key: 'facility', label: isId ? 'Gedung & Logistik' : 'Plant & Logistics' },
  ];

  const filteredItems = activeFilter === 'all'
    ? GALLERY_DATA
    : GALLERY_DATA.filter(item => item.category === activeFilter);

  return (
    <div className="gallery-page">
      <Helmet>
        <title>
          {isId
            ? 'Galeri Fasilitas & Lini Produksi SMT | PT. Global Philsonic Technologies'
            : 'Facilities & SMT Production Gallery | PT. Global Philsonic Technologies'}
        </title>
        <meta
          name="description"
          content={
            isId
              ? 'Dokumentasi visual fasilitas manufaktur canggih PT. GPT Batam: lini SMT Yamaha, Cleanroom Class 100K, workshop otomasi, dan laboratorium pengujian mutu.'
              : 'Visual tour of PT. GPT Batam advanced facilities: Yamaha SMT lines, Class 100K Cleanroom, automation workshop, and QA testing laboratories.'
          }
        />
      </Helmet>

      {/* ═══════ PAGE HEADER : Consistent Industrial Theme ═══════ */}
      <header className="gallery-page-header">
        <div className="gallery-page-header__grid-bg" aria-hidden="true" />

        <div className="container gallery-page-header__content">
          <h1 className="gallery-page-header__title">
            {isId ? 'Galeri Fasilitas Manufaktur & Ruang Produksi' : 'Manufacturing Facilities & Production Gallery'}
          </h1>
          <p className="gallery-page-header__subtitle">
            {isId
              ? 'Jelajahi lini perakitan SMT berkecepatan tinggi, ruang bersih berstandar ESD, bengkel fabrikasi jig mekanik, dan laboratorium uji reliabilitas PT. Global Philsonic Technologies di Batam Free Trade Zone.'
              : 'Explore high-speed SMT assembly lines, ESD-controlled cleanrooms, in-house mechanical jig tooling centers, and advanced reliability laboratories at PT. Global Philsonic Technologies Batam Free Trade Zone.'}
          </p>
        </div>
      </header>

      {/* ── GALLERY GRID SECTION ── */}
      <section className="gallery-section">
        <div className="container">
          {/* Filter Pills */}
          <div className="gallery-filter-bar">
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                className={`gallery-filter-pill ${activeFilter === tab.key ? 'gallery-filter-pill--active' : ''}`}
                onClick={() => setActiveFilter(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="gallery-grid">
            {filteredItems.map(item => (
              <article
                key={item.id}
                className="gallery-card"
                onClick={() => setActiveModalItem(item)}
              >
                <div className="gallery-card__thumb">
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => {
                      // Fallback visual if external image fails
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="gallery-card__zoom-hint">🔍</div>
                </div>
                <div className="gallery-card__content">
                  <h3 className="gallery-card__title">{item.title}</h3>
                  <p className="gallery-card__desc">{item.desc}</p>
                  <div className="gallery-card__meta">
                    <span style={{ fontSize: '0.75rem', color: 'var(--teal, #00897b)', fontWeight: 600 }}>
                      {isId ? 'Klik untuk detail spesifikasi →' : 'Click for technical specs →'}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX SPECIFICATION MODAL ── */}
      {activeModalItem && (
        <div
          className="gallery-modal-overlay"
          onClick={() => setActiveModalItem(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-modal-title"
        >
          <div className="gallery-modal-content" onClick={e => e.stopPropagation()}>
            <div className="gallery-modal-img-wrap">
              <img
                src={activeModalItem.img}
                alt={activeModalItem.title}
                className="gallery-modal-img"
              />
              <button
                type="button"
                className="gallery-modal-close"
                onClick={() => setActiveModalItem(null)}
                aria-label={isId ? 'Tutup detail' : 'Close detail'}
              >
                ✕
              </button>
            </div>
            <div className="gallery-modal-body">
              <div className="gallery-modal-meta">
                <span className="gallery-modal-category">
                  {activeModalItem.categoryLabel}
                </span>
                {activeModalItem.location && (
                  <span className="gallery-modal-location">
                    📍 {activeModalItem.location}
                  </span>
                )}
              </div>
              <h2 id="gallery-modal-title" className="gallery-modal-title">
                {activeModalItem.title}
              </h2>
              <p className="gallery-modal-desc">
                {activeModalItem.desc}
              </p>
              <div className="gallery-modal-spec-card">
                <div className="gallery-modal-spec-label">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                  <span>{isId ? 'Spesifikasi & Parameter Inti:' : 'Key Technical Specs & Parameters:'}</span>
                </div>
                <div className="gallery-modal-spec-value">
                  {activeModalItem.spec}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
