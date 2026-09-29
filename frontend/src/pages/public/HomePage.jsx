import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { useCompany, useCoreValues } from '../../hooks/useApi';
import { useCountUp } from '../../hooks/useScrollAnimation';
import ProductCatalogSection from '../../components/home/ProductCatalogSection';
import ProductSchematic from '../../components/home/ProductSchematic';
import CompanyLifecycleSection from '../../components/home/CompanyLifecycleSection';
import GlobalFootprintSection from '../../components/home/GlobalFootprintSection';
import InteractiveHoverButton from '../../components/ui/InteractiveHoverButton';
import './HomePage.css';

/* ── Modern Industrial Telemetry Stat Item ── */
function StatTile({ value, suffix = '', label, sublabel, icon }) {
  const ref = useCountUp(value);
  return (
    <div className="stats-deck__item">
      <div className="stats-deck__icon-wrap">
        {icon}
      </div>
      <div className="stats-deck__data">
        <div className="stats-deck__number">
          <span ref={ref}>0</span>
          <span className="stats-deck__suffix">{suffix}</span>
        </div>
        <div className="stats-deck__label">{label}</div>
        {sublabel && <div className="stats-deck__sublabel">{sublabel}</div>}
      </div>
    </div>
  );
}

/* ── Main Home Page ── */
export default function HomePage() {
  const { t, i18n } = useTranslation(['common', 'home']);
  const { data: company } = useCompany();
  const { data: coreValues } = useCoreValues();

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.fade-up, .fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [company, coreValues]);

  // Typewriter effect for hero
  const typeRef = useRef(null);
  useEffect(() => {
    const texts = i18n.language === 'id'
      ? ['Elektronik Otomotif', 'Perakitan SMT Presisi', 'Otomasi Industri', 'Partner OEM / ODM']
      : ['Automotive Electronics', 'Precision SMT Assembly', 'Industrial Automation', 'OEM / ODM Partner'];

    let idx = 0, charIdx = 0, deleting = false, timer;

    const type = () => {
      const current = texts[idx];
      if (typeRef.current) {
        typeRef.current.textContent = deleting
          ? current.slice(0, charIdx--)
          : current.slice(0, charIdx++);
      }

      let delay = deleting ? 50 : 80;
      if (!deleting && charIdx === current.length + 1) { delay = 2200; deleting = true; }
      if (deleting && charIdx === 0) { deleting = false; idx = (idx + 1) % texts.length; delay = 350; }

      timer = setTimeout(type, delay);
    };

    timer = setTimeout(type, 400);
    return () => clearTimeout(timer);
  }, [i18n.language]);


  // Multi-Slide Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroSlides = t('home:hero.slides', { returnObjects: true }) || [];
  const slideImages = [
    '/images/hero-smt.jpg',
    '/images/hero-wave.jpg'
  ];

  // Auto slide interval
  useEffect(() => {
    if (isPaused || heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused, heroSlides.length]);

  return (
    <>
      <Helmet>
        <title>PT. Global Philsonic Technologies — Automotive Electronics & Industrial Automation</title>
        <meta name="description" content="Leading OEM/ODM manufacturer in Batam Free Trade Zone. High-speed SMT assembly, automotive smart headunits, digital sound processors, dashcams, and automated testing jigs." />
      </Helmet>

      {/* ── HERO SECTION (100vh Fullscreen) ── */}
      <section
        className="hero"
        id="hero"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Full-Bleed Atmospheric Background Visuals */}
        <div className="hero__bg" aria-hidden="true">
          {slideImages.map((img, idx) => (
            <div
              key={idx}
              className={`hero__bg-slide${currentSlide === idx ? ' hero__bg-slide--active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          {/* Subtle Technical Grid */}
          <div className="hero__grid-overlay" />
          {/* Directional Vignette for Text Contrast */}
          <div className="hero__vignette" />
        </div>

        {/* Hero Content Stage */}
        <div className="container hero__stage">
          <div className="hero__content">
            {/* Top Slider Progress Controls */}
            <div className="hero__controls fade-in">
              <div className="hero__dashes">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`hero__dash${currentSlide === idx ? ' hero__dash--active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Slide ${idx + 1}`}
                  >
                    <span className="hero__dash-bar" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="hero__pause-btn"
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? 'Resume slide rotation' : 'Pause slide rotation'}
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Active Slide Text */}
            {heroSlides.map((slide, idx) => {
              if (idx !== currentSlide) return null;
              return (
                <div key={idx} className="hero__slide-body">                 

                  <h1 className="hero__title">
                    {slide.title}
                  </h1>

                  <p className="hero__subtitle">
                    {slide.subtitle}
                  </p>

                  <div className="hero__actions">
                    <a href="#products-catalog" className="btn btn--hero-primary btn--lg">
                      {slide.ctaPrimary}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </a>
                    <Link to="/contact" className="btn btn--hero-secondary btn--lg">
                      {slide.ctaSecondary}
                    </Link>
                  </div>

                  {slide.tag && (
                    <div className="hero__tagline">
                      <span className="hero__tag-check">✓</span>
                      <span>{slide.tag}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll mouse indicator */}
        <a href="#stats" className="hero__scroll" aria-label={t('home:hero.scrollDown')}>
          <div className="hero__scroll-mouse">
            <div className="hero__scroll-wheel" />
          </div>
        </a>
      </section>

      {/* ── STATS SECTION (Unified Enterprise Telemetry Deck) ── */}
      <section className="stats-section" id="stats">
        <div className="container">
          <div className="stats-deck fade-up">
            <StatTile
              value={10}
              suffix="+"
              label={t('home:stats.experience')}
              sublabel={t('home:stats.experienceSub')}
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
            />
            <StatTile
              value={80}
              suffix="K CPH"
              label={t('home:stats.capacity')}
              sublabel={t('home:stats.capacitySub')}
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="2" y="2" width="20" height="20" rx="4" />
                  <path d="M7 10h10M7 14h10" />
                </svg>
              }
            />
            <StatTile
              value={24}
              suffix="/7"
              label={t('home:stats.support')}
              sublabel={t('home:stats.supportSub')}
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              }
            />
            <StatTile
              value={100}
              suffix="%"
              label={t('home:stats.quality')}
              sublabel={t('home:stats.qualitySub')}
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* ── FESTO-STYLE PRODUCT CATALOG SECTION ── */}
      <ProductCatalogSection />

      {/* ── MITRA MANUFAKTUR AUDIO & INFOTAINMENT OTOMOTIF GLOBAL (INTERACTIVE 4-STAGE LIFECYCLE & 3D HUD) ── */}
      <CompanyLifecycleSection />

      {/* ── GLOBAL MARKET REACH & 3D MAGICUI GLOBE (INTERACTIVE WEBGL GLOBE + VERIFIED TELEMETRY) ── */}
      <GlobalFootprintSection />


      {/* ── CORE VALUES (from API - No AI Slop Badge) ── */}
      {coreValues && coreValues.length > 0 && (
        <section className="section core-values-section section--dark" id="values">
          <div className="container">
            <div className="section-header fade-up">
              <h2 className="section-title" style={{ color: 'var(--white)' }}>
                {i18n.language === 'id' ? 'Nilai Inti Rekayasa GPT' : 'GPT Core Engineering Values'}
              </h2>
              <div className="divider" />
            </div>
            <div className="grid-3">
              {coreValues.slice(0, 6).map((cv, i) => (
                <div className="core-value-card card card--dark fade-up" key={cv.id} style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="core-value-card__num">0{i + 1}</div>
                  <h3 className="core-value-card__title">{cv.title}</h3>
                  <p className="core-value-card__desc">{cv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── B2B ENTERPRISE CTA SECTION ── */}
      <section className="cta-banner" id="cta">
        <div className="container">
          <div className="cta-banner__card fade-up">
            {/* Ambient Background Radial Glows & Circuit Watermark */}
            <div className="cta-banner__glow" aria-hidden="true" />
            <div className="cta-banner__circuit-pattern" aria-hidden="true" />

            <div className="cta-banner__body">
              {/* Badge */}
              <div className="cta-banner__badge">
                <span className="cta-banner__badge-dot" />
                <span>
                  {i18n.language === 'id'
                    ? 'KEMITRAAN B2B & REKAYASA PRODUKSI ELEKTRONIK'
                    : 'B2B PARTNERSHIP & ELECTRONICS MANUFACTURING'}
                </span>
              </div>

              {/* Headline & Subtitle */}
              <h2 className="cta-banner__title">{t('home:cta.title')}</h2>
              <p className="cta-banner__subtitle">{t('home:cta.subtitle')}</p>

              {/* 3 Core Trust Signals / Decision Pillars */}
              <div className="cta-banner__pillars">
                <div className="cta-pillar-item">
                  <div className="cta-pillar-icon" style={{ background: 'rgba(20, 184, 166, 0.15)', color: '#2DD4BF' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <div className="cta-pillar-text">
                    <strong className="cta-pillar-title">
                      {i18n.language === 'id' ? 'Respon RFP < 24 Jam' : 'RFP Response < 24h'}
                    </strong>
                    <span className="cta-pillar-desc">
                      {i18n.language === 'id'
                        ? 'Tim teknik siap meninjau BOM & estimasi perakitan'
                        : 'Engineering team reviews your BOM & assembly needs'}
                    </span>
                  </div>
                </div>

                <div className="cta-pillar-item">
                  <div className="cta-pillar-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="cta-pillar-text">
                    <strong className="cta-pillar-title">
                      {i18n.language === 'id' ? 'Kerahasiaan Desain & NDA' : 'IP & NDA Protection'}
                    </strong>
                    <span className="cta-pillar-desc">
                      {i18n.language === 'id'
                        ? 'Perlindungan paten & arsitektur sirkuit hak milik'
                        : 'Full non-disclosure & intellectual property safety'}
                    </span>
                  </div>
                </div>

                <div className="cta-pillar-item">
                  <div className="cta-pillar-icon" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#FBBF24' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <div className="cta-pillar-text">
                    <strong className="cta-pillar-title">
                      {i18n.language === 'id' ? 'Lini SMT Batam FTZ' : 'Batam FTZ SMT Plant'}
                    </strong>
                    <span className="cta-pillar-desc">
                      {i18n.language === 'id'
                        ? 'Cleanroom ISO 9001 & standar mutu ekspor dunia'
                        : 'ISO 9001 cleanroom & export-grade production'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions: Magic UI Interactive Hover Button + Secondary Action */}
              <div className="cta-banner__actions">
                <InteractiveHoverButton
                  to="/contact"
                  variant="light"
                  className="cta-magic-button"
                >
                  {t('home:cta.btnPartner')}
                </InteractiveHoverButton>

                <Link to="/products" className="cta-secondary-link">
                  <span>{i18n.language === 'id' ? 'Lihat Portofolio Produk' : 'View Product Catalog'}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </div>

              {/* Direct Instant Contact Bar */}
              <div className="cta-banner__contact-bar">
                <span className="contact-bar-label">
                  {i18n.language === 'id' ? 'Saluran Langsung Tim Penjualan:' : 'Direct Sales Channels:'}
                </span>
                <div className="contact-bar-links">
                  <a href="mailto:sales@intersis.co.id" className="contact-pill-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>sales@intersis.co.id</span>
                  </a>
                  <span className="contact-pill-sep" aria-hidden="true">•</span>
                  <a href="tel:+62778462888" className="contact-pill-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>+62 (778) 462-888</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
