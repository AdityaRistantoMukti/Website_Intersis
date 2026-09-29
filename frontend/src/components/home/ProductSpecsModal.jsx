import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './ProductSpecsModal.css';

export default function ProductSpecsModal({ product, onClose }) {
  const { t, i18n } = useTranslation('home');
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
        {/* Modal Header */}
        <div className="specs-modal__header">
          <div className="specs-modal__header-left">
            <span className={`specs-modal__badge badge badge--${product.badgeColor || 'teal'}`}>
              {product.badge}
            </span>
            <div className="specs-modal__code-row">
              <span className="specs-modal__code">{product.modelCode}</span>
              <button
                type="button"
                className="specs-modal__copy-btn"
                onClick={copyCode}
                title="Copy Model Code"
              >
                {copied ? '✓ Copied' : 'Copy Code'}
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

          {/* Quick Specs Grid */}
          <div className="specs-modal__section">
            <h3 className="specs-modal__section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              {t('specsModal.technicalSpecs')}
            </h3>

            <div className="specs-modal__table">
              {Object.entries(product.fullSpecs || {}).map(([key, val]) => (
                <div className="specs-modal__row" key={key}>
                  <span className="specs-modal__row-key">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <span className="specs-modal__row-val">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Feature Highlights */}
          <div className="specs-modal__section">
            <h3 className="specs-modal__section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              {t('specsModal.keyFeatures')}
            </h3>
            <div className="specs-modal__highlights">
              {product.specs.map((item, idx) => (
                <div className="specs-modal__pill" key={idx}>
                  <strong>{item.label}:</strong> {item.value}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="specs-modal__footer">
          <button type="button" className="btn btn--outline" onClick={onClose}>
            {t('specsModal.close')}
          </button>
          <Link
            to={`/contact?subject=OEM+Inquiry+${encodeURIComponent(product.modelCode)}`}
            className="btn btn--primary"
            onClick={onClose}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            {t('specsModal.requestDatasheet')}
          </Link>
        </div>
      </div>
    </div>
  );
}
