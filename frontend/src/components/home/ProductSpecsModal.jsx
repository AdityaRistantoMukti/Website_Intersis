import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../lib/api';
import ProductSchematic from './ProductSchematic';
import './ProductSpecsModal.css';

// Dictionary mapping technical specification keys to professional bilingual engineering terminology
const SPEC_LABELS = {
  operatingVoltage: { id: 'Tegangan Kerja', en: 'Operating Voltage' },
  operatingTemp: { id: 'Suhu Operasional', en: 'Operating Temperature' },
  memory: { id: 'Konfigurasi Memori', en: 'Memory & Storage' },
  audioDsp: { id: 'Arsitektur Audio DSP', en: 'Audio DSP Architecture' },
  radioTuner: { id: 'Modul Tuner Radio', en: 'Radio Tuner Module' },
  videoInput: { id: 'Input Kamera & Video', en: 'Video & Camera Input' },
  certifications: { id: 'Sertifikasi Standar Mutu', en: 'Quality & Regulatory Certifications' },
  usbPorts: { id: 'Antarmuka USB', en: 'USB Interface' },
  bluetooth: { id: 'Konektivitas Nirkabel / BT', en: 'Bluetooth Connectivity' },
  preouts: { id: 'Output Preout Audio', en: 'Preout Audio Outputs' },
  internalStorage: { id: 'Penyimpanan Internal', en: 'Internal Storage' },
  dimensions: { id: 'Dimensi Fisik (P x L x T)', en: 'Physical Dimensions (L x W x H)' },
  dynamicRange: { id: 'Rentang Dinamis (SNR)', en: 'Dynamic Range (SNR)' },
  thd: { id: 'Distorsi Harmonik (THD)', en: 'Harmonic Distortion (THD)' },
  opticalInput: { id: 'Input Digital SPDIF Optik', en: 'Optical SPDIF Digital In' },
  softwareSupport: { id: 'Dukungan Software / Tuning', en: 'Software Suite / Calibration' },
  dampingFactor: { id: 'Faktor Redaman (Damping)', en: 'Damping Factor' },
  protectionCircuit: { id: 'Sirkuit Proteksi', en: 'Circuit Protection' },
  signalToNoise: { id: 'Signal to Noise Ratio (SNR)', en: 'Signal-to-Noise Ratio (SNR)' },
  inputSensitivity: { id: 'Sensitivitas Input', en: 'Input Sensitivity' },
  harnessChannels: { id: 'Jumlah Jalur Harness', en: 'Harness Channels' },
  wireGauge: { id: 'Standar Kawat (AWG)', en: 'Wire Gauge Standard (AWG)' },
  connectorType: { id: 'Standar Konektor Otomotif', en: 'Automotive Connector Type' },
  insulation: { id: 'Ketahanan Isolasi & Termal', en: 'Insulation & Thermal Rating' },
  smtCapacity: { id: 'Kecepatan Penempatan SMT', en: 'SMT Placement Speed' },
  pcbLayers: { id: 'Dukungan Layer PCB', en: 'PCB Layer Capability' },
  componentRange: { id: 'Rentang Ukuran Komponen', en: 'Component Package Range' },
  qualityInspection: { id: 'Inspeksi Kualitas (AOI/AXI)', en: 'Quality Inspection (AOI/AXI)' },
  cycleTime: { id: 'Waktu Siklus Pengujian', en: 'Testing Cycle Time' },
  stationTesting: { id: 'Cakupan Uji Stasiun', en: 'Station Testing Scope' },
  traceability: { id: 'Sistem Pelacakan MES', en: 'MES Traceability System' },
  safetyStandards: { id: 'Standar Keamanan Industri', en: 'Industrial Safety Standards' },
  resolution: { id: 'Resolusi Sensor Video', en: 'Sensor Resolution' },
  viewAngle: { id: 'Sudut Pandang Lensa (FOV)', en: 'Field of View (FOV)' },
  nightVision: { id: 'Sensor Malam (Night Vision)', en: 'Night Vision Sensor' },
  gSensor: { id: 'Sensor Akselerasi G-Sensor', en: 'G-Sensor & Parking' },
  storageSupport: { id: 'Dukungan Kartu Memori', en: 'Storage Media Support' }
};

const formatSpecKey = (key, isId) => {
  if (SPEC_LABELS[key]) {
    return isId ? SPEC_LABELS[key].id : SPEC_LABELS[key].en;
  }
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

export default function ProductSpecsModal({ product, onClose }) {
  const { t, i18n } = useTranslation(['home', 'common']);
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const copyCode = () => {
    navigator.clipboard.writeText(product.modelCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isId = i18n.language === 'id';
  const title = product.title[isId ? 'id' : 'en'] || product.title.en;
  const desc = product.shortDesc[isId ? 'id' : 'en'] || product.shortDesc.en;

  // Collect all photos: cover first, then gallery items
  const allImages = useMemo(() => {
    const list = [];
    if (product.image) list.push(product.image);
    if (Array.isArray(product.gallery)) {
      product.gallery.forEach(img => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list;
  }, [product.image, product.gallery]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="specs-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="specs-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header — Clean Datasheet Style */}
        <div className="specs-modal__header">
          <div className="specs-modal__header-info">
            <div className="specs-modal__code-row">
              <span className="specs-modal__code">{product.modelCode}</span>
              <button
                type="button"
                className="specs-modal__copy-btn"
                onClick={copyCode}
                title={isId ? 'Salin Kode Model' : 'Copy Model Code'}
              >
                {copied ? (isId ? '✓ Tersalin' : '✓ Copied') : (isId ? 'Salin Kode' : 'Copy')}
              </button>
            </div>
            <h2 className="specs-modal__title">{title}</h2>
          </div>

          <button
            type="button"
            className="specs-modal__close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="specs-modal__body">
          <p className="specs-modal__desc">{desc}</p>

          {/* Schematic Diagram or Physical Photo Gallery Preview */}
          <div className="specs-modal__section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 className="specs-modal__section-title" style={{ margin: 0 }}>
                {allImages.length > 0
                  ? (isId ? 'Galeri Foto & Tampilan Produk' : 'Product Photo Gallery & Views')
                  : (isId ? 'Diagram Skematik & Arsitektur Perangkat' : 'Device Architecture & Schematic Diagram')}
              </h3>
              {allImages.length > 1 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary, #14b8a6)', fontWeight: 600 }}>
                  {activeImageIndex + 1} / {allImages.length} {isId ? 'Sudut Foto' : 'Views'}
                </span>
              )}
            </div>

            <div className="specs-modal__schematic-box" style={{ position: 'relative', overflow: 'hidden' }}>
              {allImages.length > 0 ? (
                <img
                  src={getImageUrl(allImages[activeImageIndex] || allImages[0])}
                  alt={`${title} - View ${activeImageIndex + 1}`}
                  style={{
                    maxHeight: '230px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    margin: '0 auto',
                    display: 'block',
                    borderRadius: '8px',
                    transition: 'all 0.25s ease'
                  }}
                />
              ) : (
                <ProductSchematic type={product.diagramType} />
              )}
            </div>

            {/* Interactive Thumbnail Carousel Strip */}
            {allImages.length > 1 && (
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '10px',
                overflowX: 'auto',
                paddingBottom: '4px'
              }}>
                {allImages.map((img, idx) => {
                  const isActive = idx === activeImageIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      style={{
                        position: 'relative',
                        width: '64px',
                        height: '52px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        padding: 0,
                        cursor: 'pointer',
                        background: '#090d16',
                        border: isActive ? '2px solid var(--color-primary, #14b8a6)' : '1px solid rgba(255,255,255,0.12)',
                        boxShadow: isActive ? '0 0 10px rgba(20, 184, 166, 0.4)' : 'none',
                        transition: 'all 0.2s ease',
                        flexShrink: 0
                      }}
                      title={`${isId ? 'Lihat foto' : 'View photo'} #${idx + 1}`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`Thumb #${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                      {idx === 0 && (
                        <span style={{
                          position: 'absolute', top: 2, left: 2,
                          fontSize: '0.55rem', fontWeight: 700,
                          background: '#eab308', color: '#000',
                          padding: '1px 3px', borderRadius: 2
                        }}>
                          MAIN
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Technical Specifications Table */}
          <div className="specs-modal__section">
            <div className="specs-modal__section-header">
              <h3 className="specs-modal__section-title">
                {t('home:specsModal.technicalSpecs')}
              </h3>
              <span className="specs-modal__table-hint">
                {isId ? 'Standar Pengujian Lab GPT Batam' : 'GPT Batam Lab Testing Standard'}
              </span>
            </div>

            <div className="specs-modal__table-container">
              <table className="specs-modal__table">
                <thead>
                  <tr>
                    <th className="specs-modal__th-param">
                      {isId ? 'Parameter Spesifikasi' : 'Specification Parameter'}
                    </th>
                    <th className="specs-modal__th-val">
                      {isId ? 'Nilai / Standar Engineering' : 'Engineering Standard / Value'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(product.fullSpecs || {}).map(([key, val]) => (
                    <tr className="specs-modal__table-tr" key={key}>
                      <td className="specs-modal__td-key">
                        <span className="specs-modal__key-text">
                          {formatSpecKey(key, isId)}
                        </span>
                      </td>
                      <td className="specs-modal__td-val">
                        {key === 'certifications' ? (
                          <div className="specs-modal__cert-chips">
                            {val.split(',').map((cert, cIdx) => (
                              <span key={cIdx} className="specs-modal__cert-chip">
                                {cert.trim()}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="specs-modal__val-text">{val}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Feature Highlights — Clean Grid */}
          <div className="specs-modal__section">
            <h3 className="specs-modal__section-title">
              {t('home:specsModal.keyFeatures')}
            </h3>
            <div className="specs-modal__specs-grid">
              {product.specs.map((item, idx) => (
                <div className="specs-modal__spec-card" key={idx}>
                  <span className="specs-modal__spec-label">{item.label}</span>
                  <span className="specs-modal__spec-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="specs-modal__footer">
          <button type="button" className="specs-modal__btn-secondary" onClick={onClose}>
            {t('home:specsModal.close')}
          </button>
          <Link
            to={`/contact?subject=OEM+Inquiry+${encodeURIComponent(product.modelCode)}`}
            className="specs-modal__btn-primary"
            onClick={onClose}
          >
            {t('home:specsModal.requestDatasheet')}
          </Link>
        </div>
      </div>
    </div>
  );
}
