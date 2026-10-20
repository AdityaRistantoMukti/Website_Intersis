import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FEATURED_PRODUCTS } from '../../data/featuredProducts';
import ProductSchematic from './ProductSchematic';
import ProductSpecsModal from './ProductSpecsModal';
import './ProductCatalogSection.css';

export default function ProductCatalogSection() {
  const { t, i18n } = useTranslation(['home', 'common']);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const isId = i18n.language === 'id';

  const categories = [
    { key: 'all',                       label: t('home:productsCatalog.categories.all') },
    { key: 'automation',                label: t('home:productsCatalog.categories.automation') || 'Automation' },
    { key: 'mobile_intelligent_device', label: t('home:productsCatalog.categories.mobile_intelligent_device') || 'Mobile Intelligent Device' },
    { key: 'amplifier',                 label: t('home:productsCatalog.categories.amplifier') || 'Amplifier' },
    { key: 'subwoofer',                 label: t('home:productsCatalog.categories.subwoofer') || 'Subwoofer' },
    { key: 'dsp',                       label: t('home:productsCatalog.categories.dsp') || 'DSP' },
    { key: 'android_headunit',          label: t('home:productsCatalog.categories.android_headunit') || 'Android Headunit' },
    { key: 'dash_camera_recorders',     label: t('home:productsCatalog.categories.dash_camera_recorders') || 'Dash Camera Recorders' },
  ];

  // Filter products based on active category and search query
  const filteredProducts = useMemo(() => {
    return FEATURED_PRODUCTS.filter((prod) => {
      const matchCategory = activeCategory === 'all' || prod.category === activeCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const title = (prod.title[isId ? 'id' : 'en'] || prod.title.en).toLowerCase();
      const code = prod.modelCode.toLowerCase();
      const desc = (prod.shortDesc[isId ? 'id' : 'en'] || prod.shortDesc.en).toLowerCase();
      const specsMatch = prod.specs.some(s => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q));

      return title.includes(q) || code.includes(q) || desc.includes(q) || specsMatch;
    });
  }, [activeCategory, searchQuery, isId]);

  return (
    <section className="section product-catalog-section" id="products-catalog">
      <div className="container">
        {/* Section Header  */}
        <div className="section-header fade-up">
          <h2 className="section-title">{t('home:productsCatalog.title')}</h2>
          <div className="divider" />
          <p className="section-subtitle">{t('home:productsCatalog.subtitle')}</p>
        </div>

        {/* Festo-Style Filter & Search Toolbar */}
        <div className="catalog-toolbar fade-up" style={{ marginBottom: '2rem' }}>
          {/* Search Input */}
          <div className="catalog-search">
            <span className="catalog-search__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder={t('home:productsCatalog.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="catalog-search__input"
              aria-label="Filter products"
            />
            {searchQuery && (
              <button
                type="button"
                className="catalog-search__clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs / Pills */}
          <div className="catalog-tabs" role="tablist">
            {categories.map(({ key, label }) => {
              const count = key === 'all'
                ? FEATURED_PRODUCTS.length
                : FEATURED_PRODUCTS.filter(p => p.category === key).length;

              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={activeCategory === key}
                  className={`catalog-tab${activeCategory === key ? ' catalog-tab--active' : ''}`}
                  onClick={() => setActiveCategory(key)}
                >
                  <span className="catalog-tab__label">{label}</span>
                  <span className="catalog-tab__count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid — Clean Minimalist Industrial Design */}
        {filteredProducts.length > 0 ? (
          <div className="catalog-grid">
            {filteredProducts.map((prod) => {
              const title = prod.title[isId ? 'id' : 'en'] || prod.title.en;
              const categoryLabel = categories.find(c => c.key === prod.category)?.label || prod.category;
              const firstSpec = prod.specs?.[0]?.value?.split(' ')?.[0] || 'OEM';

              const handleMouseMove = (e) => {
                const card = e.currentTarget;
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
              };

              return (
                <div
                  key={prod.id}
                  className="catalog-card"
                  onClick={() => setSelectedProduct(prod)}
                  onMouseMove={handleMouseMove}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') setSelectedProduct(prod); }}
                  aria-label={`${title} (${prod.modelCode})`}
                >
                  {/* Schematic / Engineering Visual */}
                  <div className="catalog-card__visual">
                    <ProductSchematic type={prod.diagramType} />
                    <div className="catalog-card__corner-marker catalog-card__corner-marker--tl" aria-hidden="true" />
                    <div className="catalog-card__corner-marker catalog-card__corner-marker--tr" aria-hidden="true" />
                    <div className="catalog-card__corner-marker catalog-card__corner-marker--bl" aria-hidden="true" />
                    <div className="catalog-card__corner-marker catalog-card__corner-marker--br" aria-hidden="true" />
                    <span className="catalog-card__cad-tag" aria-hidden="true">CAD/CAM SCHEMATIC</span>
                    {prod.badge && (
                      <span className="catalog-card__badge">
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  {/* Clean Minimalist Product Info */}
                  <div className="catalog-card__content">
                    <div className="catalog-card__top-meta">
                      <span className="catalog-card__category">{categoryLabel}</span>
                      <span className="catalog-card__spec-pill">{firstSpec}</span>
                    </div>
                    <h3 className="catalog-card__title">{title}</h3>
                    <div className="catalog-card__footer-meta">
                      <div className="catalog-card__code">
                        <span className="catalog-card__code-dot" />
                        <span>{prod.modelCode}</span>
                      </div>
                      <span className="catalog-card__hover-cue">
                        <span>{isId ? 'Lihat Spesifikasi' : 'View Specs'}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="catalog-empty fade-up">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p>{t('home:productsCatalog.noProductsFound')}</p>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Explore Full Catalog Link — Cleanly Spaced Container */}
        <div className="catalog-footer fade-up">
          <Link to="/products" className="btn btn--outline btn--lg catalog-footer__btn">
            {t('home:productsCatalog.exploreAll')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Technical Specs Modal */}
      {selectedProduct && (
        <ProductSpecsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
