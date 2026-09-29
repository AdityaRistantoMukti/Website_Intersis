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

      {/* ── B2B CTA BANNER (Clean Full-Width 2-Column Banner) ── */}
      <section className="cta-banner" id="cta">
        <div className="container cta-banner__inner">
          <div className="cta-banner__content fade-up">
            <h2 className="cta-banner__title">{t('home:cta.title')}</h2>
            <p className="cta-banner__subtitle">{t('home:cta.subtitle')}</p>
          </div>
          <div className="cta-banner__actions fade-up">
            <InteractiveHoverButton
              to="/contact"
              variant="light"
              className="cta-magic-button"
            >
              {t('home:cta.btnPartner')}
            </InteractiveHoverButton>
          </div>
        </div>
      </section>
    </>
  );
}
