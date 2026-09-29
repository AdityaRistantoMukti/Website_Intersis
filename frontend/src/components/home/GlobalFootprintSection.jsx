import { useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTradeDestinations } from '../../hooks/useApi';
import { defaultTradeDestinations } from '../../data/tradeDestinations';
import { worldMapDots } from '../../data/worldMapPoints';
import './GlobalFootprintSection.css';

// Coordinate projection helper: GPS Lat/Lng -> 1000x500 Flat Map Grid
function projectCoord(lat, lng) {
  const safeLat = parseFloat(lat) || 0;
  const safeLng = parseFloat(lng) || 0;
  return {
    x: Number((((safeLng + 180) / 360) * 1000).toFixed(1)),
    y: Number((((90 - safeLat) / 180) * 500).toFixed(1)),
  };
}

export default function GlobalFootprintSection() {
  const { i18n } = useTranslation(['home', 'common']);
  const canvasRef = useRef(null);
  const mapViewportRef = useRef(null);

  // Dynamic Destinations from Admin API with verified static fallback
  const { data: apiDestinations } = useTradeDestinations();
  const destinations = useMemo(() => {
    return apiDestinations && apiDestinations.length > 0
      ? apiDestinations
      : defaultTradeDestinations;
  }, [apiDestinations]);

  // Selected active destination node for interactive popover
  const [activeDestination, setActiveDestination] = useState(null);
  const [hoveredDestination, setHoveredDestination] = useState(null);

  // Calculate projected positions with robust fallback defaults and automatic collision resolution
  const projectedDestinations = useMemo(() => {
    const list = destinations.map((d, index) => {
      const pos = projectCoord(d.lat, d.lng);
      return {
        ...d,
        id: d.id || `hub-${index}`,
        name: d.name || 'Trade Hub',
        country: d.country || '',
        flag: d.flag || '🌐',
        badgeColor: d.badgeColor || '#00897B',
        role: d.role || 'Pusat Distribusi Otomotif',
        subrole: d.subrole || d.country || 'Ekspor Hub',
        posX: pos.x + (d.mapOffsetX || 0),
        posY: pos.y + (d.mapOffsetY || 0),
        labelPlacement: d.labelPlacement || (d.isOrigin ? 'bottom' : 'top'),
      };
    });

    // Automatic collision detection & separation if two hubs are too close (< 28px)
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        const dist = Math.hypot(a.posX - b.posX, a.posY - b.posY);
        if (dist < 28) {
          if (!b.mapOffsetX && !b.mapOffsetY) {
            b.posX -= 22;
            b.posY -= 16;
            b.labelPlacement = 'top';
            a.labelPlacement = 'bottom';
          }
        }
      }
    }

    return list;
  }, [destinations]);

  // Origin point (Batam FTZ HQ Plant)
  const originNode = useMemo(() => {
    return projectedDestinations.find((d) => d.isOrigin) || projectedDestinations[0];
  }, [projectedDestinations]);

  // Dynamically calculate curved trade paths from Batam FTZ to every export hub
  const tradeRoutes = useMemo(() => {
    if (!originNode) return [];
    return projectedDestinations
      .filter((d) => !d.isOrigin)
      .map((dest) => {
        const midX = (originNode.posX + dest.posX) / 2;
        const midY = (originNode.posY + dest.posY) / 2;
        const dist = Math.hypot(dest.posX - originNode.posX, dest.posY - originNode.posY);
        
        // Elevate curve upwards: special graceful arch for close feeder/shuttle hops (Batam to Singapore)
        let cy;
        if (dist < 60) {
          cy = Math.min(originNode.posY, dest.posY) - 14;
        } else {
          cy = Math.max(30, midY - Math.min(dist * 0.32, 125));
        }

        const pathData = `M ${originNode.posX} ${originNode.posY} Q ${midX.toFixed(1)} ${cy.toFixed(1)} ${dest.posX} ${dest.posY}`;

        return {
          id: `route-${dest.id}`,
          destination: dest,
          pathData,
          midX,
          cy,
          isFeeder: dist < 60,
        };
      });
  }, [originNode, projectedDestinations]);

  // Draw 2D World Map Continent Dot-Matrix ONCE onto high-resolution canvas (<1ms, 0% CPU loop)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 2;
    const width = 1000;
    const height = 500;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    // Draw continent dots
    ctx.fillStyle = '#94A3B8'; // crisp modern slate dot color

    for (let i = 0; i < worldMapDots.length; i++) {
      const [x, y] = worldMapDots[i];
      ctx.beginPath();
      ctx.arc(x, y, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const handleSelectNode = (dest) => {
    if (activeDestination?.id === dest.id) {
      setActiveDestination(null);
    } else {
      setActiveDestination(dest);
    }
  };

  // Click on background of map closes popover
  const handleMapBackgroundClick = (e) => {
    if (e.target === e.currentTarget || e.target.classList?.contains('map-cad-grid')) {
      setActiveDestination(null);
    }
  };

  return (
    <section className="section global-footprint-section" id="global-trade">
      <div className="container">
        {/* Section Header */}
        <div className="section-header fade-up text-center" style={{ marginTop: '30px' }}>          
          <h2 className="section-title">
            {i18n.language === 'id'
              ? 'Jangkauan Ekspor & Koridor Pasar Global'
              : 'Global Export Reach & International Trade Corridors'}
          </h2>
          <div className="divider" />
          <p className="section-subtitle">
            {i18n.language === 'id'
              ? 'Peta interaktif rute distribusi manufaktur PT. Global Philsonic Technologies dari Batam FTZ ke pusat perakitan otomotif dan rantai pasok Tier-1 di Asia, Amerika, dan Eropa.'
              : 'Interactive logistics map showing PT. Global Philsonic Technologies distribution routes from Batam FTZ to automotive OEM assembly centers across Asia, America, and Europe.'}
          </p>
        </div>

        {/* ── 2D INTERACTIVE VECTOR WORLD MAP ── */}
        <div className="world-map-card fade-up">
          {/* Executive Clean Map Control & Legend Bar */}
          <div className="world-map-legend-bar">
            <div className="legend-left">
              <span className="origin-ping-dot" />
              <div className="origin-label-block">
                <span className="origin-subtitle">
                  {i18n.language === 'id' ? 'PUSAT MANUFAKTUR & PERAKITAN' : 'MANUFACTURING & ASSEMBLY HQ'}
                </span>
                <strong className="origin-title">Batam Free Trade Zone (Indonesia)</strong>
              </div>
            </div>

            {/* <div className="legend-right">
              <span className="legend-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                {i18n.language === 'id'
                  ? 'Klik node atau koridor untuk melihat detail'
                  : 'Click any node or corridor to view details'}
              </span>
              <span className="active-hubs-badge">
                {projectedDestinations.length - 1} {i18n.language === 'id' ? 'Hub Internasional Aktif' : 'Active Global Hubs'}
              </span>
            </div> */}
          </div>

          {/* Interactive World Map Canvas & SVG Viewport */}
          <div
            ref={mapViewportRef}
            className="world-map-viewport"
            onClick={handleMapBackgroundClick}
          >
            {/* Background Canvas: 2,060 Precomputed Continent Dots (100% 60fps lightweight) */}
            <canvas ref={canvasRef} className="world-map-canvas" />

            {/* SVG Interactive Overlay Layer (Trade Arcs, Radar, Nodes) */}
            <svg
              viewBox="0 0 1000 500"
              className="world-map-svg"
              preserveAspectRatio="xMidYMid meet"
              aria-label="Global Trade Corridors Map"
              onClick={handleMapBackgroundClick}
            >
              <defs>
                {/* Gradient for Trade Arcs */}
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00897B" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#0D9488" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.8" />
                </linearGradient>

                <linearGradient id="activeRouteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00897B" stopOpacity="1" />
                  <stop offset="50%" stopColor="#14B8A6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="1" />
                </linearGradient>

                {/* Glow Filter */}
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Technical Precision Grid Guidelines */}
              <g className="map-cad-grid" stroke="rgba(148, 163, 184, 0.22)" strokeDasharray="3 4">
                {/* Equator (0° Lat) */}
                <line x1="0" y1="250" x2="1000" y2="250" />
                {/* Tropic of Cancer (23.5° N) */}
                <line x1="0" y1="185" x2="1000" y2="185" />
                {/* Tropic of Capricorn (23.5° S) */}
                <line x1="0" y1="315" x2="1000" y2="315" />
                {/* Prime Meridian (0° Lng) */}
                <line x1="500" y1="35" x2="500" y2="425" />
                {/* 90° W Meridian */}
                <line x1="250" y1="35" x2="250" y2="425" />
                {/* 90° E Meridian */}
                <line x1="750" y1="35" x2="750" y2="425" />
              </g>

              {/* Grid Reference Labels */}
              <g className="map-cad-labels" fill="#94A3B8" fontSize="9" fontFamily="monospace">
                <text x="12" y="247">EQUATOR 0°</text>
                <text x="12" y="182">23.5° N</text>
                <text x="12" y="312">23.5° S</text>
                <text x="495" y="440" textAnchor="middle">0° MERIDIAN</text>
                <text x="745" y="440" textAnchor="middle">90° E</text>
                <text x="245" y="440" textAnchor="middle">90° W</text>
              </g>

              {/* Trade Route Arcs */}
              <g className="map-trade-routes">
                {tradeRoutes.map((route) => {
                  const isCurrentActive =
                    activeDestination?.id === route.destination.id ||
                    hoveredDestination?.id === route.destination.id;

                  return (
                    <g key={route.id} className="trade-route-group">
                      {/* Base Track Line */}
                      <path
                        d={route.pathData}
                        fill="none"
                        stroke={isCurrentActive ? 'rgba(0, 137, 123, 0.45)' : 'rgba(148, 163, 184, 0.3)'}
                        strokeWidth={isCurrentActive ? 2.5 : 1.4}
                        strokeDasharray={isCurrentActive ? 'none' : '4 4'}
                        className="route-track"
                      />
                      {/* Animated Pulse Stream Path */}
                      <path
                        d={route.pathData}
                        fill="none"
                        stroke={isCurrentActive ? 'url(#activeRouteGradient)' : 'url(#routeGradient)'}
                        strokeWidth={isCurrentActive ? 3.2 : 2}
                        strokeDasharray="8 12"
                        className="route-stream"
                        filter={isCurrentActive ? 'url(#glowEffect)' : undefined}
                      />
                    </g>
                  );
                })}
              </g>

              {/* Destination Hub Nodes (GLITCH-FREE SVG RENDERING) */}
              <g className="map-destination-nodes">
                {projectedDestinations.map((d) => {
                  const isOrigin = d.isOrigin;
                  const isActive = activeDestination?.id === d.id;
                  const isHovered = hoveredDestination?.id === d.id;

                  return (
                    <g
                      key={d.id}
                      className={`map-node-element ${isOrigin ? 'map-node-origin' : ''} ${isActive ? 'map-node-active' : ''} ${isHovered ? 'map-node-hovered' : ''}`}
                      transform={`translate(${d.posX}, ${d.posY})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectNode(d);
                      }}
                      onMouseEnter={() => setHoveredDestination(d)}
                      onMouseLeave={() => setHoveredDestination(null)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${d.name}, ${d.country}`}
                    >
                      {/* Invisible stable circular hitbox to prevent any cursor dropouts */}
                      <circle r="22" fill="transparent" className="node-hitbox" />

                      {/* Batam FTZ Triple Concentric Radar Pulse Rings */}
                      {isOrigin && (
                        <g className="radar-pulse-group" aria-hidden="true">
                          <circle r="12" className="radar-ring-1" />
                          <circle r="20" className="radar-ring-2" />
                          <circle r="28" className="radar-ring-3" />
                        </g>
                      )}

                      {/* Selection or Hover Highlight Ring */}
                      {(isActive || isHovered) && (
                        <circle
                          r={isOrigin ? 16 : 13}
                          fill="none"
                          stroke={d.badgeColor || '#00897B'}
                          strokeWidth="2"
                          strokeOpacity={isActive ? '0.9' : '0.6'}
                          className="active-selection-ring"
                        />
                      )}

                      {/* Outer Marker Ring */}
                      <circle
                        r={isOrigin ? (isHovered ? 9 : 8) : (isHovered ? 7 : 6)}
                        fill="#FFFFFF"
                        stroke={d.badgeColor || '#00897B'}
                        strokeWidth={isOrigin ? 3 : 2}
                        className="node-outer-circle"
                      />

                      {/* Center Core Dot */}
                      <circle
                        r={isOrigin ? (isHovered ? 5 : 4) : (isHovered ? 4 : 3)}
                        fill={d.badgeColor || '#00897B'}
                        className="node-core-dot"
                      />

                      {/* Node Label Tag (Country Flag + City Name) */}
                      <g
                        className="node-label-group"
                        transform={`translate(${
                          d.labelPlacement === 'left' ? -42 : d.labelPlacement === 'right' ? 42 : 0
                        }, ${
                          d.labelPlacement === 'bottom' ? 19 : -15
                        })`}
                        pointerEvents="none"
                      >
                        <rect
                          x={-36}
                          y={-10}
                          width={72}
                          height={18}
                          rx={9}
                          fill="rgba(15, 23, 42, 0.88)"
                          stroke={isHovered || isActive ? d.badgeColor || '#00897B' : 'rgba(255, 255, 255, 0.2)'}
                          strokeWidth={isHovered || isActive ? '1.2' : '0.8'}
                          className="node-label-bg"
                        />
                        <text
                          x={0}
                          y={2.5}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="9.5"
                          fontWeight="700"
                          fontFamily="Inter, sans-serif"
                        >
                          {d.flag} {d.name}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* ── FLOATING DETAIL POPOVER CARD ── */}
            {activeDestination && (
              <div
                className={`map-floating-popover ${activeDestination.posX > 550 ? 'popover-left' : 'popover-right'}`}
                style={{
                  left: `${(activeDestination.posX / 1000) * 100}%`,
                  top: `${(activeDestination.posY / 500) * 100}%`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="map-popover__header">
                  <div className="map-popover__title">
                    <span className="map-popover__flag">{activeDestination.flag}</span>
                    <div>
                      <h4 className="map-popover__name">{activeDestination.name}</h4>
                      <span className="map-popover__country">{activeDestination.country}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="map-popover__close"
                    onClick={() => setActiveDestination(null)}
                    aria-label="Tutup detail"
                  >
                    ✕
                  </button>
                </div>

                <div className="map-popover__badge-row">
                  <span
                    className="map-popover__badge"
                    style={{
                      color: activeDestination.badgeColor || '#00897B',
                      backgroundColor: `${activeDestination.badgeColor || '#00897B'}18`,
                      borderColor: `${activeDestination.badgeColor || '#00897B'}40`,
                    }}
                  >
                    {activeDestination.subrole}
                  </span>
                  <span className="map-popover__coords">
                    {Math.abs(activeDestination.lat)}° {activeDestination.lat >= 0 ? 'N' : 'S'},{' '}
                    {Math.abs(activeDestination.lng)}° {activeDestination.lng >= 0 ? 'E' : 'W'}
                  </span>
                </div>

                <p className="map-popover__role">{activeDestination.role}</p>
                {activeDestination.details && (
                  <p className="map-popover__desc">{activeDestination.details}</p>
                )}

                <div className="map-popover__meta">
                  <div className="popover-meta-item">
                    <span className="meta-label">
                      {i18n.language === 'id' ? 'Status Rantai Pasok:' : 'Supply Chain Status:'}
                    </span>
                    <strong className="meta-val">Verified Direct Tier-1 Corridor</strong>
                  </div>
                  <div className="popover-meta-item">
                    <span className="meta-label">
                      {i18n.language === 'id' ? 'Standar Manufaktur:' : 'Quality Standards:'}
                    </span>
                    <strong className="meta-val">IATF 16949 / ISO 9001</strong>
                  </div>
                </div>

                {/* Arrow anchor */}
                <div className="map-popover__arrow" aria-hidden="true" />
              </div>
            )}
          </div>

          {/* Quick-Select Corridor Chips Bar */}
          <div className="world-map-corridors-bar">
            <span className="world-map-corridors-label">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              {i18n.language === 'id' ? 'Koridor:' : ' Corridor:'}
            </span>
            <div className="world-map-chips-list">
              {projectedDestinations.map((d) => {
                const isActive = activeDestination?.id === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    className={`world-map-chip ${isActive ? 'world-map-chip--active' : ''} ${d.isOrigin ? 'world-map-chip--origin' : ''}`}
                    onClick={() => handleSelectNode(d)}
                  >
                    <span className="chip-flag">{d.flag}</span>
                    <span className="chip-name">{d.name}</span>
                    {d.isOrigin && <span className="chip-hq-badge">HQ</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── LOGISTICS TELEMETRY METRIC STATS ── */}
        <div className="footprint-stats-grid fade-up" style={{ gap: 20 }}>
          <div className="footprint-stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(0, 137, 123, 0.1)', color: '#00897B' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="stat-card-content">
              <h3 className="stat-card-number">45 Mnt</h3>
              <p className="stat-card-title">Transit ke Pelabuhan PSA Singapore</p>
              <span className="stat-card-sub">Akses kargo maritim ekspres harian dari Batam</span>
            </div>
          </div>

          <div className="footprint-stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div className="stat-card-content">
              <h3 className="stat-card-number">100%</h3>
              <p className="stat-card-title">Ketepatan Pengiriman JIT (Just-In-Time)</p>
              <span className="stat-card-sub">Menjamin kelancaran lini perakitan OEM global</span>
            </div>
          </div>

          <div className="footprint-stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#D97706' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="stat-card-content">
              <h3 className="stat-card-number">IATF 16949</h3>
              <p className="stat-card-title">Sertifikasi Otomotif Internasional</p>
              <span className="stat-card-sub">Kualifikasi industri standar Uni Eropa, AS, & Jepang</span>
            </div>
          </div>

          <div className="footprint-stat-card">
            <div className="stat-card-icon" style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7C3AED' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div className="stat-card-content">
              <h3 className="stat-card-number">3 Benua</h3>
              <p className="stat-card-title">Jangkauan Ekspor Rantai Pasok</p>
              <span className="stat-card-sub">Koridor aktif Asia-Pasifik, Amerika Utara, & Eropa</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
