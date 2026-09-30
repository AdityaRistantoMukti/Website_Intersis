import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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

          {/* Schematic Diagram Preview */}
          <div className="specs-modal__section">
            <h3 className="specs-modal__section-title">
              {isId ? 'Diagram Skematik & Arsitektur Perangkat' : 'Device Architecture & Schematic Diagram'}
            </h3>
            <div className="specs-modal__schematic-box">
              <ProductSchematic type={product.diagramType} />
            </div>
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
                      {isId ? 'Nilai / Standar Rekayasa' : 'Engineering Standard / Value'}
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
