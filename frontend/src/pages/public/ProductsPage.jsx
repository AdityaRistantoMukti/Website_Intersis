import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { FEATURED_PRODUCTS } from '../../data/featuredProducts';
import ProductSchematic from '../../components/home/ProductSchematic';
import ProductSpecsModal from '../../components/home/ProductSpecsModal';
import './ProductsPage.css';

/* ── Interactive RFQ Quotation Modal ── */
function RfqModal({ product, onClose, isId }) {
  const [scale, setScale] = useState('Prototipe / Sampel Uji (10 - 50 Unit)');
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  if (!product) return null;

  const productTitle = product.title[isId ? 'id' : 'en'] || product.title.en;

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    const message = `Halo Sales & Engineering PT. Global Philsonic Technologies,%0A%0ASaya tertarik meminta penawaran (RFQ) resmi untuk:%0A• SKU Model: ${product.modelCode}%0A• Produk: ${productTitle}%0A• Skala Kebutuhan: ${scale}%0A• Perusahaan: ${company || '-'}%0A• Kontak: ${name || '-'}%0A• Email: ${email || '-'}%0A• Catatan Spesifikasi: ${notes || '-'}`;
    
    // Direct WhatsApp B2B Sales
    window.open(`https://wa.me/628117700888?text=${message}`, '_blank');
    onClose();
  };

  return (
    <div className="rfq-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="rfq-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rfq-modal__header">
          <div>
            <span className="rfq-modal__model-code">
              {product.modelCode}
            </span>
            <h3 className="rfq-modal__title">
              {productTitle}
            </h3>
            <p className="rfq-modal__subtitle">
              {isId ? 'Permintaan Penawaran Resmi & Evaluasi Teknis' : 'Official Request for Quotation & Technical Evaluation'}
            </p>
          </div>
          <button type="button" className="rfq-modal__close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <form onSubmit={handleWhatsAppSubmit}>
          <div className="rfq-modal__body">
            <div className="rfq-field">
              <label>{isId ? 'Estimasi Volume Kebutuhan' : 'Estimated Production Scale'}</label>
              <select value={scale} onChange={(e) => setScale(e.target.value)}>
                <option value="Prototipe / Sampel Uji (10 - 50 Unit)">
                  {isId ? 'Prototipe / Evaluasi Lab (10 - 50 Unit)' : 'Prototype / Lab Evaluation (10 - 50 Units)'}
                </option>
                <option value="Pilot Run / Uji Coba Batch (500 - 1.000 Unit)">
                  {isId ? 'Pilot Run / Batch Awal (500 - 1.000 Unit)' : 'Pilot Run / Initial Batch (500 - 1,000 Units)'}
                </option>
                <option value="Produksi Massal Kontrak (5.000+ Unit / Bulan)">
                  {isId ? 'Produksi Massal OEM/ODM (5.000+ Unit / Bulan)' : 'Mass OEM/ODM Production (5,000+ Units / Month)'}
                </option>
                <option value="Kustomisasi Rekayasa Khusus / Tooling Baru">
                  {isId ? 'Kustomisasi Desain Baru / Tooling Khusus' : 'Custom Engineering & New Tooling'}
                </option>
              </select>
            </div>

            <div className="rfq-field">
              <label>{isId ? 'Nama Perusahaan / Organisasi' : 'Company Name'}</label>
              <input
                type="text"
                placeholder={isId ? 'mis: PT. Automotive Partner Indonesia' : 'e.g. Continental Tier-1 Corp'}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="rfq-field">
                <label>{isId ? 'Nama Narahubung' : 'Contact Person'}</label>
                <input
                  type="text"
                  placeholder={isId ? 'Nama lengkap' : 'Full name'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="rfq-field">
                <label>{isId ? 'Email Bisnis' : 'Business Email'}</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="rfq-field">
              <label>{isId ? 'Catatan Kebutuhan Teknis (Opsional)' : 'Technical Specifications (Optional)'}</label>
              <textarea
                rows="3"
                placeholder={isId ? 'misal: Penyesuaian protokol CAN-Bus, modifikasi konektor harness, atau private labeling...' : 'e.g. Custom firmware, specific CAN-Bus ID, custom harness pinout, or private labeling...'}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="rfq-modal__footer">
            <button type="button" className="rfq-btn-cancel" onClick={onClose}>
              {isId ? 'Batal' : 'Cancel'}
            </button>
            <div className="rfq-modal__actions-group">
              <Link
                to={`/contact?sku=${encodeURIComponent(product.modelCode)}`}
                className="rfq-btn-secondary"
                onClick={onClose}
              >
                {isId ? 'Formulir Kontak' : 'Contact Form'}
              </Link>
              <button type="submit" className="rfq-btn-whatsapp">
                {isId ? 'Kirim via WhatsApp B2B' : 'Send via WhatsApp'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main Products Page Component ── */
export default function ProductsPage() {
  const { t, i18n } = useTranslation(['products', 'common']);
  const isId = i18n.language === 'id';

  // Filters & View State
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [copiedId, setCopiedId] = useState(null);

  // Modals
  const [selectedSpecsProduct, setSelectedSpecsProduct] = useState(null);
  const [selectedRfqProduct, setSelectedRfqProduct] = useState(null);

  const categories = [
    { key: 'all',        label: t('products:catalog.categories.all') },
    { key: 'headunit',   label: t('products:catalog.categories.headunit') },
    { key: 'audio',      label: t('products:catalog.categories.audio') },
    { key: 'dashcam',    label: t('products:catalog.categories.dashcam') },
    { key: 'automation', label: t('products:catalog.categories.automation') },
    { key: 'ems',        label: t('products:catalog.categories.ems') },
  ];

  // Quick SKU copy
  const handleCopySku = (e, code, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
  };

  // Filtered products logic
  const filteredProducts = useMemo(() => {
    return FEATURED_PRODUCTS.filter((prod) => {
      const matchCat = activeCategory === 'all' || prod.category === activeCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const title = (prod.title[isId ? 'id' : 'en'] || prod.title.en).toLowerCase();
      const code = prod.modelCode.toLowerCase();
      const desc = (prod.shortDesc[isId ? 'id' : 'en'] || prod.shortDesc.en).toLowerCase();
      const specsMatch = prod.specs.some(
        (s) => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
      );

      return title.includes(q) || code.includes(q) || desc.includes(q) || specsMatch;
    });
  }, [activeCategory, searchQuery, isId]);

  // Stat chips data
  const heroStats = [
    {
      value: '12+ Model',
      label: isId ? 'SKU Siap Produksi' : 'Production-Ready SKUs',
      sub: isId ? 'Turnkey OEM / ODM' : 'Turnkey OEM / ODM'
    },
    {
      value: '80.000 CPH',
      label: isId ? 'Kecepatan Lini SMT' : 'SMT Line Capacity',
      sub: isId ? 'Yamaha & Panasonic Lines' : 'Yamaha & Panasonic Lines'
    },
    {
      value: 'IATF 16949',
      label: isId ? 'Standar Mutu Nol Cacat' : 'Zero-Defect Standard',
      sub: isId ? '& ISO 9001:2015' : '& ISO 9001:2015'
    },
    {
      value: '45 Menit',
      label: isId ? 'Logistik Bebas Pajak' : 'Duty-Free Logistics',
      sub: isId ? 'Batam FTZ ke Singapura' : 'Batam FTZ to Singapore'
    }
  ];

  // Process workflow steps
  const processSteps = [
    {
      step: '01',
      title: isId ? 'Analisis RFQ & Review BOM' : 'RFQ & BOM Review',
      desc: isId
        ? 'Evaluasi mendalam spesifikasi teknis, ketersediaan komponen, dan kalkulasi penawaran biaya resmi dalam 24-48 jam.'
        : 'Technical specification review, component sourcing validation, and cost quotation within 24-48 business hours.',
    },
    {
      step: '02',
      title: isId ? 'Rekayasa DFM & Rapid Prototyping' : 'DFM Engineering & Prototyping',
      desc: isId
        ? 'Optimalisasi layout Design-for-Manufacturing (DFM) untuk menjamin yield SMT maksimal dan pembuatan sampel uji fungsional.'
        : 'Design-for-Manufacturing optimization ensuring optimal SMT placement yields and functional engineering prototypes.',
    },
    {
      step: '03',
      title: isId ? 'Tooling, Stensil & Pilot Run' : 'Tooling, Stencils & Pilot Run',
      desc: isId
        ? 'Fabrikasi stensil laser elektropolis serta pengujian perakitan batch awal terkontrol untuk memvalidasi toleransi mesin.'
        : 'Electro-polished laser stencil fabrication and controlled pilot production batches to qualify machinery tolerances.',
    },
    {
      step: '04',
      title: isId ? 'Validasi Kualitas 100% (SPI, AOI, ICT)' : '100% Quality Validation (SPI, AOI, ICT)',
      desc: isId
        ? 'Inspeksi pasta solder 3D, inspeksi optik otomatis AOI, validasi jalur kelistrikan ICT, dan uji ketahanan termal ekstrem.'
        : '3D solder paste inspection, automated optical inspection, in-circuit testing, and dynamic thermal burn-in validation.',
    },
    {
      step: '05',
      title: isId ? 'Produksi Massal & Ekspor FTZ' : 'Mass Assembly & FTZ Logistics',
      desc: isId
        ? 'Perakitan massal berkecepatan 80.000 CPH, integrasi serialisasi barcode MES, dan pengiriman kilat 45 menit ke pelabuhan Singapura.'
        : 'High-speed 80K CPH assembly, real-time MES barcode serialization, and 45-minute express transit to Singapore seaport.',
    }
  ];

  return (
    <div className="products-page-container">
      <Helmet>
        <title>
          {isId
            ? 'Produk & Solusi Rekayasa Manufaktur — PT. Global Philsonic Technologies'
            : 'Products & Manufacturing Solutions — PT. Global Philsonic Technologies'}
        </title>
        <meta
          name="description"
          content={
            isId
              ? 'Daftar lengkap produk elektronik otomotif, modul smart headunit QLED, sistem DSP audio, mesin jig uji otomatis, dan layanan kontrak perakitan SMT Batam FTZ.'
              : 'Complete catalog of automotive electronics, QLED smart headunits, DSP audio systems, automated test jigs, and turnkey contract SMT assembly at Batam FTZ.'
          }
        />
      </Helmet>

      {/* ── 1. ELEGAN MANUFACTURING HERO SECTION ── */}
      <section className="prod-hero">
        <div className="prod-hero__grid-bg" aria-hidden="true" />
        <div className="prod-hero__glow" aria-hidden="true" />

        <div className="container prod-hero__content">
          {/* Breadcrumb Navigation */}
          <nav className="prod-hero__breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{isId ? 'Beranda' : 'Home'}</Link>
            <span className="prod-hero__breadcrumb-sep">/</span>
            <span className="prod-hero__breadcrumb-current">{isId ? 'Katalog Produk' : 'Products Catalog'}</span>
          </nav>          

          {/* Main Title & Concise Explanation (Fokus 1 Konteks: Produk & Manufaktur) */}
          <h1 className="prod-hero__title">
            {isId
              ? 'Solusi Manufaktur Elektronik Otomotif & Otomasi Presisi'
              : 'Automotive Electronics & Precision Manufacturing Catalog'}
          </h1>
          <p className="prod-hero__subtitle">
            {isId
              ? 'Katalog resmi produk siap OEM/ODM standar Tier-1, prosesor audio DSP, perangkat keselamatan berkendara, mesin jig uji otomatis, dan layanan kontrak perakitan SMT berkecepatan tinggi di Kawasan Bebas Batam (FTZ).'
              : 'Official engineering catalog of Tier-1 standard OEM/ODM products, DSP audio processors, in-vehicle safety sensors, automated test fixtures, and high-speed turnkey SMT assembly at Batam Free Trade Zone.'}
          </p>

          {/* 4 Industrial Highlights / Capability Stat Chips */}
          <div className="prod-hero__stats">
            {heroStats.map((st, idx) => (
              <div key={idx} className="prod-hero__stat-card">
                <span className="prod-hero__stat-val">{st.value}</span>
                <span className="prod-hero__stat-label">{st.label}</span>
                <span className="prod-hero__stat-sub">{st.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. STICKY INDUSTRIAL EXPLORER TOOLBAR ── */}
      <section className="catalog-toolbar-wrapper">
        <div className="container">
          <div className="catalog-toolbar-main">
            {/* Search Box with Realtime Clear */}
            <div className="catalog-search-box">
              <span className="catalog-search-box__icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                className="catalog-search-box__input"
                placeholder={t('products:catalog.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Filter products"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="catalog-search-box__clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Toggle (Grid vs Table) */}
            <div className="view-mode-toggle" role="group" aria-label="View format">
              <button
                type="button"
                className={`view-mode-btn${viewMode === 'grid' ? ' view-mode-btn--active' : ''}`}
                onClick={() => setViewMode('grid')}
                title={t('products:catalog.viewGrid')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                <span>{t('products:catalog.viewGrid')}</span>
              </button>

              <button
                type="button"
                className={`view-mode-btn${viewMode === 'table' ? ' view-mode-btn--active' : ''}`}
                onClick={() => setViewMode('table')}
                title={t('products:catalog.viewTable')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                <span>{t('products:catalog.viewTable')}</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills (Clean text tabs, no unnecessary icons) */}
          <div className="catalog-pills" role="tablist">
            {categories.map(({ key, label }) => {
              const count = key === 'all'
                ? FEATURED_PRODUCTS.length
                : FEATURED_PRODUCTS.filter(p => p.category === key).length;

              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === key}
                  className={`catalog-pill${activeCategory === key ? ' catalog-pill--active' : ''}`}
                  onClick={() => setActiveCategory(key)}
                >
                  <span className="catalog-pill__text">{label}</span>
                  <span className="catalog-pill__count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Active Filter Helper Bar (Provides clarity to the user) */}
          <div className="catalog-active-bar">
            <div className="catalog-active-bar__info">
              <span className="catalog-active-bar__count">
                {isId
                  ? `Menampilkan ${filteredProducts.length} dari ${FEATURED_PRODUCTS.length} produk`
                  : `Showing ${filteredProducts.length} of ${FEATURED_PRODUCTS.length} products`}
              </span>
              {activeCategory !== 'all' && (
                <span className="catalog-active-bar__tag">
                  {categories.find(c => c.key === activeCategory)?.label}
                </span>
              )}
              {searchQuery && (
                <span className="catalog-active-bar__tag catalog-active-bar__tag--query">
                  &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </div>

            {(activeCategory !== 'all' || searchQuery) && (
              <button
                type="button"
                className="catalog-active-bar__reset"
                onClick={handleResetFilters}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                <span>{isId ? 'Reset Filter' : 'Reset Filters'}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── 3. PRODUCT CATALOG (GRID OR TABLE VIEW) ── */}
      <section className="prod-catalog-section">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="prod-empty-state">
              <h3 className="prod-empty-state__title">
                {isId ? 'Produk Tidak Ditemukan' : 'No Products Found'}
              </h3>
              <p className="prod-empty-state__text">
                {t('products:catalog.noResults')}
              </p>
              <button
                type="button"
                className="btn btn--outline prod-empty-state__btn"
                onClick={handleResetFilters}
              >
                {isId ? 'Tampilkan Semua Produk' : 'Show All Products'}
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* ── VIEW 1: INTERACTIVE CARD GRID ── */
            <div className="products-grid">
              {filteredProducts.map((prod) => {
                const title = prod.title[isId ? 'id' : 'en'] || prod.title.en;
                const desc = prod.shortDesc[isId ? 'id' : 'en'] || prod.shortDesc.en;
                const isCopied = copiedId === prod.id;

                return (
                  <div key={prod.id} className="product-card">
                    {/* Visual Schematic Diagram with CAD Corner Crosshairs */}
                    <div className="product-card__schematic">
                      <div className="schematic-corner tl" aria-hidden="true">+</div>
                      <div className="schematic-corner tr" aria-hidden="true">+</div>
                      <div className="schematic-corner bl" aria-hidden="true">+</div>
                      <div className="schematic-corner br" aria-hidden="true">+</div>
                      <ProductSchematic type={prod.diagramType} />
                    </div>

                    {/* Card Header: Gray SKU + Text Copy Button (No Category Badge) */}
                    <div className="product-card__header">
                      <span className="product-card__code">{prod.modelCode}</span>
                      <button
                        type="button"
                        className="product-card__copy-btn"
                        onClick={(e) => handleCopySku(e, prod.modelCode, prod.id)}
                        title={isId ? 'Salin Kode SKU' : 'Copy SKU Code'}
                        aria-label={`Copy ${prod.modelCode}`}
                      >
                        {isCopied ? (isId ? '✓ Tersalin' : '✓ Copied') : (isId ? 'Salin' : 'Copy')}
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="product-card__body">
                      <h3 className="product-card__title" title={title}>{title}</h3>
                      <p className="product-card__desc">{desc}</p>

                      {/* Quick Specs 2x2 Matrix */}
                      <div className="product-card__specs">
                        {prod.specs.map((item, i) => (
                          <div key={i} className="product-spec-item">
                            <span className="product-spec-item__label">{item.label}</span>
                            <span className="product-spec-item__val" title={item.value}>{item.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Card Actions (No Icons) */}
                      <div className="product-card__actions">
                        <button
                          type="button"
                          className="btn-card-specs"
                          onClick={() => setSelectedSpecsProduct(prod)}
                        >
                          {t('products:catalog.btnSpecs')}
                        </button>
                        <button
                          type="button"
                          className="btn-card-rfq"
                          onClick={() => setSelectedRfqProduct(prod)}
                        >
                          {t('products:catalog.btnRfq')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── VIEW 2: TECHNICAL SPECIFICATIONS COMPARISON TABLE ── */
            <div className="products-table-wrap">
              <div className="products-table-scroll">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th className="th-sku">{t('products:table.modelCode')}</th>
                      <th className="th-name">{t('products:table.productName')}</th>
                      <th className="th-category">{t('products:table.category')}</th>
                      <th className="th-specs">{t('products:table.keySpecs')}</th>
                      <th className="th-voltage">{t('products:table.voltage')}</th>
                      <th className="th-temp">{t('products:table.operatingTemp')}</th>
                      <th className="th-actions">{t('products:table.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((prod) => {
                      const title = prod.title[isId ? 'id' : 'en'] || prod.title.en;
                      const catObj = categories.find(c => c.key === prod.category);
                      const isCopied = copiedId === prod.id;

                      return (
                        <tr key={prod.id}>
                          <td className="td-sku">
                            <div className="table-sku-cell">
                              <span className="table-sku">{prod.modelCode}</span>
                              <button
                                type="button"
                                className="table-copy-btn"
                                onClick={(e) => handleCopySku(e, prod.modelCode, prod.id)}
                                title={isId ? 'Salin Kode Model' : 'Copy Model Code'}
                              >
                                {isCopied ? (isId ? 'Tersalin' : 'Copied') : (isId ? 'Salin' : 'Copy')}
                              </button>
                            </div>
                          </td>
                          <td className="td-name">
                            <strong className="table-product-title">{title}</strong>
                          </td>
                          <td className="td-category">
                            <span className="table-category-tag">
                              {catObj ? catObj.label : prod.category}
                            </span>
                          </td>
                          <td className="td-specs">
                            <div className="table-specs-compact">
                              {prod.specs.slice(0, 2).map((s, idx) => (
                                <div key={idx} className="table-spec-item">
                                  <span className="table-spec-item__lbl">{s.label}:</span>{' '}
                                  <span className="table-spec-item__val">{s.value}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="td-voltage">
                            <span className="table-metric-badge">
                              {prod.fullSpecs?.operatingVoltage || '—'}
                            </span>
                          </td>
                          <td className="td-temp">
                            <span className="table-metric-badge">
                              {prod.fullSpecs?.operatingTemp || '—'}
                            </span>
                          </td>
                          <td className="td-actions">
                            <div className="table-actions">
                              <button
                                type="button"
                                className="btn-table-specs"
                                onClick={() => setSelectedSpecsProduct(prod)}
                                title={isId ? 'Lihat Spesifikasi & Skematik' : 'View Specifications & Schematics'}
                              >
                                {isId ? 'Spesifikasi' : 'Specs'}
                              </button>
                              <button
                                type="button"
                                className="btn-table-rfq"
                                onClick={() => setSelectedRfqProduct(prod)}
                                title={isId ? 'Minta Penawaran B2B' : 'Request RFQ'}
                              >
                                {isId ? 'Minta RFQ' : 'Request RFQ'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. CUSTOM MANUFACTURING WORKFLOW (OEM / ODM JOURNEY) ── */}
      <section className="prod-workflow-section">
        <div className="container">
          <div className="prod-workflow-header">
            <h2 className="prod-workflow-title">
              {isId
                ? 'Dari Desain Konsep Hingga Produksi Massal (OEM / ODM Journey)'
                : 'From Concept Design to Mass Production (OEM / ODM Journey)'}
            </h2>
            <p className="prod-workflow-subtitle">
              {isId
                ? 'Metodologi rekayasa terstruktur kami menjamin kualitas bebas cacat (Zero-Defect), kepatuhan regulasi otomotif, dan efisiensi biaya manufaktur.'
                : 'Our structured engineering methodology guarantees zero-defect quality, automotive regulatory compliance, and maximum cost efficiency.'}
            </p>
          </div>

          <div className="prod-workflow-grid">
            {processSteps.map((st, idx) => (
              <div key={idx} className="prod-workflow-card">
                <div className="prod-workflow-card__top">
                  <span className="prod-workflow-card__step">{st.step}</span>
                </div>
                <h3 className="prod-workflow-card__title">{st.title}</h3>
                <p className="prod-workflow-card__desc">{st.desc}</p>
                {idx < processSteps.length - 1 && (
                  <div className="prod-workflow-card__connector" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. B2B FAST ACTION STRIP (MANUFACTURING CTA) ── */}
      <section className="prod-cta-section">
        <div className="container">
          <div className="prod-cta-card">
            <div className="prod-cta-card__bg-grid" aria-hidden="true" />
            <div className="prod-cta-card__content">
              <h2 className="prod-cta-title">
                {isId
                  ? 'Membutuhkan Kustomisasi Khusus atau Tooling Baru?'
                  : 'Need Custom Engineering or New Product Tooling?'}
              </h2>
              <p className="prod-cta-desc">
                {isId
                  ? 'Tim R&D dan engineering kami di Batam FTZ siap berkolaborasi untuk perancangan skematik PCB, penyesuaian firmware CAN-Bus, hingga perakitan turnkey box-build standar ekspor global.'
                  : 'Our engineering & R&D team at Batam FTZ is ready to collaborate on schematic design, CAN-Bus firmware customization, and turnkey box-build assembly for global export.'}
              </p>

              <div className="prod-cta-actions">
                <a
                  href="https://wa.me/628117700888?text=Halo%20Engineering%20PT.%20Global%20Philsonic%20Technologies,%20saya%20ingin%20berkonsultasi%20mengenai%20kebutuhan%20OEM/ODM."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn prod-cta-btn-wa"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
                  </svg>
                  <span>{isId ? 'Konsultasi Cepat via WhatsApp B2B' : 'Direct B2B WhatsApp Consultation'}</span>
                </a>

                <Link to="/contact" className="btn prod-cta-btn-form">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>{isId ? 'Ajukan Kebutuhan Teknis (Formulir)' : 'Submit Technical Inquiry Form'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODALS ── */}
      {/* 1. Full Specifications Modal */}
      {selectedSpecsProduct && (
        <ProductSpecsModal
          product={selectedSpecsProduct}
          onClose={() => setSelectedSpecsProduct(null)}
        />
      )}

      {/* 2. Interactive B2B RFQ Quotation Modal */}
      {selectedRfqProduct && (
        <RfqModal
          product={selectedRfqProduct}
          onClose={() => setSelectedRfqProduct(null)}
          isId={isId}
        />
      )}
    </div>
  );
}
