import React, { useState } from 'react';

const DEFAULT_LAT = 1.1368003;
const DEFAULT_LNG = 104.0452514;
const DEFAULT_PLACE = 'GLOBAL PHILSONIC TECHNOLOGIES';
const DEFAULT_GMAPS_URL =
  'https://www.google.com/maps/place/GLOBAL+PHILSONIC+TECHNOLOGIES/@1.137263,104.045233,435m/data=!3m1!1e3!4m6!3m5!1s0x31d98900364038b5:0xf424af624a151322!8m2!3d1.1368003!4d104.0452514!16s%2Fg%2F11z007pkw1?hl=id';

export default function ContactGoogleMap({ contact, isId = true }) {
  // 'm' = Roadmap, 'k' = Satellite / Hybrid
  const [mapType, setMapType] = useState('m');
  const [zoom, setZoom] = useState(17);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const lat = contact?.maps_latitude ? parseFloat(contact.maps_latitude) : DEFAULT_LAT;
  const lng = contact?.maps_longitude ? parseFloat(contact.maps_longitude) : DEFAULT_LNG;
  const placeName = contact?.maps_place_name || contact?.company_name || DEFAULT_PLACE;
  const gmapsUrl = contact?.maps_url || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const handleCopyCoords = async () => {
    try {
      await navigator.clipboard.writeText(`${lat}, ${lng}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 13));
  };

  // Google Maps standard embed query
  const embedUrl = contact?.maps_embed_url && !contact.maps_embed_url.includes('example')
    ? contact.maps_embed_url
    : `https://maps.google.com/maps?q=${lat},${lng}+(${encodeURIComponent(placeName)})&t=${mapType}&z=${zoom}&ie=UTF8&iwloc=B&output=embed`;

  return (
    <div className="contact-gmap-card">
      {/* ── HEADER & MAP VIEW CONTROLS ── */}
      <div className="contact-gmap-header">
        <div className="contact-gmap-header__info">
          <div className="contact-gmap-title">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="contact-gmap-title__icon"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{placeName}</span>
          </div>
          <p className="contact-gmap-address">
            {contact?.address || 'Cammo Industrial Park Blok B No. 8-10, Batam Center (FTZ)'}
          </p>
        </div>

        {/* View mode toggle (Map vs Satellite) & Zoom Controls */}
        <div className="contact-gmap-controls">
          <div className="contact-gmap-type-toggle" role="group" aria-label="Map style">
            <button
              type="button"
              className={`contact-gmap-type-btn ${mapType === 'm' ? 'contact-gmap-type-btn--active' : ''}`}
              onClick={() => setMapType('m')}
              title={isId ? 'Tampilan Peta Jalan' : 'Roadmap View'}
            >
              {isId ? 'Peta' : 'Map'}
            </button>
            <button
              type="button"
              className={`contact-gmap-type-btn ${mapType === 'k' ? 'contact-gmap-type-btn--active' : ''}`}
              onClick={() => setMapType('k')}
              title={isId ? 'Tampilan Citra Satelit' : 'Satellite View'}
            >
              {isId ? 'Satelit' : 'Satellite'}
            </button>
          </div>

          <div className="contact-gmap-zoom-group">
            <button
              type="button"
              className="contact-gmap-zoom-btn"
              onClick={handleZoomIn}
              disabled={zoom >= 20}
              title={isId ? 'Perbesar Peta' : 'Zoom In'}
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              className="contact-gmap-zoom-btn"
              onClick={handleZoomOut}
              disabled={zoom <= 13}
              title={isId ? 'Perkecil Peta' : 'Zoom Out'}
              aria-label="Zoom out"
            >
              −
            </button>
          </div>
        </div>
      </div>

      {/* ── MAP VIEWPORT IFRAME CONTAINER ── */}
      <div className="contact-gmap-viewport">
        {isLoading && (
          <div className="contact-gmap-skeleton" aria-hidden="true">
            <div className="contact-gmap-skeleton__spinner" />
            <span>{isId ? 'Memuat Google Maps...' : 'Loading Google Maps...'}</span>
          </div>
        )}

        <iframe
          key={`${mapType}-${zoom}`}
          title="Lokasi PT. Global Philsonic Technologies di Google Maps"
          src={embedUrl}
          className={`contact-gmap-iframe ${isLoading ? 'contact-gmap-iframe--loading' : ''}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* ── QUICK ACTION TOOLBAR ── */}
      <div className="contact-gmap-actions">
        <a
          href={gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-gmap-btn contact-gmap-btn--primary"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <span>{isId ? 'Buka di Google Maps' : 'Open in Google Maps'}</span>
        </a>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-gmap-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          <span>{isId ? 'Petunjuk Arah' : 'Directions'}</span>
        </a>

        <button
          type="button"
          className={`contact-gmap-btn ${copied ? 'contact-gmap-btn--copied' : ''}`}
          onClick={handleCopyCoords}
          title={isId ? 'Salin koordinat GPS' : 'Copy GPS coordinates'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>{copied ? (isId ? 'Koordinat Tersalin!' : 'Copied!') : (isId ? 'Salin Koordinat' : 'Copy Coords')}</span>
        </button>
      </div>

      {/* ── LOGISTICAL CONNECTIVITY STRIP ── */}
      <div className="contact-gmap-meta">
        <div className="contact-gmap-meta-item">
          <span className="contact-gmap-meta-label">Batam FTZ:</span>
          <span className="contact-gmap-meta-val">{isId ? '0% Bea Masuk' : '0% Import Duty'}</span>
        </div>
        <div className="contact-gmap-meta-sep">•</div>
        <div className="contact-gmap-meta-item">
          <span className="contact-gmap-meta-label">Ferry Port:</span>
          <span className="contact-gmap-meta-val">~10 min (Singapore Link)</span>
        </div>
        <div className="contact-gmap-meta-sep">•</div>
        <div className="contact-gmap-meta-item">
          <span className="contact-gmap-meta-label">Airport (BTH):</span>
          <span className="contact-gmap-meta-val">~15 min</span>
        </div>
      </div>
    </div>
  );
}
