import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useCompany } from '../../hooks/useApi';
import './AboutPage.css';

/* ── Interactive Facility Graphic Renderers ── */
function FacilityGraphicView({ zoneId }) {
  if (zoneId === 'cleanroom') {
    return (
      <div className="facility-graphic">
        <div className="facility-graphic__radar-grid" />
        <svg width="140" height="100" viewBox="0 0 140 100" fill="none" style={{ position: 'relative', zIndex: 2 }}>
          {/* Cleanroom Chamber & Airflow Arrows */}
          <rect x="15" y="15" width="110" height="70" rx="8" fill="#0B1320" stroke="#2DD4BF" strokeWidth="1.8" />
          <line x1="25" y1="28" x2="115" y2="28" stroke="rgba(45, 212, 191, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
          {/* HEPA filter vents */}
          <path d="M 35 15 L 35 25 M 70 15 L 70 25 M 105 15 L 105 25" stroke="#38BDF8" strokeWidth="2" />
          {/* ESD Ground Icon */}
          <circle cx="70" cy="55" r="14" fill="rgba(45, 212, 191, 0.15)" stroke="#2DD4BF" strokeWidth="1.5" />
          <path d="M 70 47 L 70 63 M 64 53 L 76 53 M 66 59 L 74 59" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="facility-graphic__badge">HEPA 99.97% · ESD PROTECTED</span>
      </div>
    );
  }

  if (zoneId === 'smt') {
    return (
      <div className="facility-graphic">
        <div className="facility-graphic__radar-grid" />
        <svg width="140" height="100" viewBox="0 0 140 100" fill="none" style={{ position: 'relative', zIndex: 2 }}>
          {/* SMT Feeder & Head */}
          <rect x="20" y="55" width="100" height="30" rx="4" fill="#0F172A" stroke="#2DD4BF" strokeWidth="1.5" />
          <path d="M 30 70 L 50 70 M 60 70 L 80 70 M 90 70 L 110 70" stroke="#38BDF8" strokeWidth="2.5" />
          {/* High-Speed Mounter Head Nozzles */}
          <rect x="50" y="20" width="40" height="18" rx="3" fill="#0B1320" stroke="#2DD4BF" strokeWidth="1.5" />
          <line x1="60" y1="38" x2="60" y2="52" stroke="#2DD4BF" strokeWidth="2" />
          <line x1="80" y1="38" x2="80" y2="52" stroke="#2DD4BF" strokeWidth="2" />
          <circle cx="60" cy="52" r="3" fill="#38BDF8" />
          <circle cx="80" cy="52" r="3" fill="#38BDF8" />
        </svg>
        <span className="facility-graphic__badge">DUAL-BEAM 80,000 CPH</span>
      </div>
    );
  }

  if (zoneId === 'inspection') {
    return (
      <div className="facility-graphic">
        <div className="facility-graphic__radar-grid" />
        <svg width="140" height="100" viewBox="0 0 140 100" fill="none" style={{ position: 'relative', zIndex: 2 }}>
          {/* 3D Optical Scanner Beam */}
          <polygon points="70,18 35,70 105,70" fill="rgba(45, 212, 191, 0.12)" stroke="rgba(45, 212, 191, 0.4)" strokeWidth="1" strokeDasharray="3 2" />
          <circle cx="70" cy="18" r="6" fill="#0B1320" stroke="#2DD4BF" strokeWidth="2" />
          {/* PCB Surface */}
          <rect x="25" y="70" width="90" height="12" rx="2" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="50" cy="76" r="2.5" fill="#2DD4BF" />
          <circle cx="70" cy="76" r="2.5" fill="#2DD4BF" />
          <circle cx="90" cy="76" r="2.5" fill="#2DD4BF" />
        </svg>
        <span className="facility-graphic__badge">3D AOI & INLINE X-RAY</span>
      </div>
    );
  }

  // Automation / Tooling
  return (
    <div className="facility-graphic">
      <div className="facility-graphic__radar-grid" />
      <svg width="140" height="100" viewBox="0 0 140 100" fill="none" style={{ position: 'relative', zIndex: 2 }}>
        {/* CNC / Jig Fixture */}
        <rect x="25" y="20" width="90" height="60" rx="6" fill="#0F172A" stroke="#2DD4BF" strokeWidth="1.5" />
        {/* Test probes */}
        <path d="M 45 40 L 45 60 M 60 35 L 60 60 M 75 40 L 75 60 M 90 35 L 90 60" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        <rect x="40" y="60" width="55" height="10" rx="2" fill="#0B1320" stroke="rgba(45, 212, 191, 0.6)" strokeWidth="1" />
      </svg>
      <span className="facility-graphic__badge">ICT / FCT TEST FIXTURES</span>
    </div>
  );
}

export default function AboutPage() {
  const { t, i18n } = useTranslation(['about', 'common']);
  const { data: companyData } = useCompany();
  const isId = i18n.language === 'id';

  // Interactive state
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [activeZone, setActiveZone] = useState(0);
  const [selectedCert, setSelectedCert] = useState(null);

  const milestoneItems = t('about:milestones.items', { returnObjects: true }) || [];
  const certItems = t('about:certifications.items', { returnObjects: true }) || [];
  const facilityZones = t('about:facility.zones', { returnObjects: true }) || [];

  return (
    <>
      <Helmet>
        <title>
          {isId
            ? 'Tentang Kami — PT. Global Philsonic Technologies (GPT) Batam'
            : 'About Us — PT. Global Philsonic Technologies (GPT) Batam'}
        </title>
        <meta
          name="description"
          content={
            isId
              ? 'Profil lengkap PT. Global Philsonic Technologies: Manufaktur perakitan SMT presisi, elektronik otomotif, sertifikasi IATF 16949, dan keunggulan Batam Free Trade Zone.'
              : 'Complete profile of PT. Global Philsonic Technologies: Precision SMT assembly, automotive electronics, IATF 16949 certification, and Batam Free Trade Zone manufacturing hub.'
          }
        />
      </Helmet>

      {/* ── 1. HERO BANNER WITH INDUSTRIAL TELEMETRY DECK ── */}
      <section className="about-hero">
        <div className="about-hero__bg-grid" />
        <div className="about-hero__glow" />

        <div className="container about-hero__stage">
          {/* Breadcrumb Navigation */}
          <nav className="about-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{t('about:hero.breadcrumbHome')}</Link>
            <span className="about-breadcrumb__sep">/</span>
            <span className="about-breadcrumb__current">{t('about:hero.breadcrumbAbout')}</span>
          </nav>

          <div className="about-hero__kicker">
            <span className="about-hero__kicker-dot" />
            <span>{t('about:hero.badge')}</span>
          </div>

          <h1 className="about-hero__title">
            {t('about:hero.title')}
          </h1>

          <p className="about-hero__subtitle">
            {t('about:hero.subtitle')}
          </p>

          {/* Telemetry Stats Deck */}
          <div className="about-hero__deck">
            <div className="about-stat-card">
              <div className="about-stat-card__val">
                <span>10</span>
                <span className="about-stat-card__unit">+</span>
              </div>
              <div className="about-stat-card__label">{t('about:hero.statYears')}</div>
            </div>

            <div className="about-stat-card">
              <div className="about-stat-card__val">
                <span>80</span>
                <span className="about-stat-card__unit">K CPH</span>
              </div>
              <div className="about-stat-card__label">{t('about:hero.statCapacity')}</div>
            </div>

            <div className="about-stat-card">
              <div className="about-stat-card__val">
                <span>10,000</span>
                <span className="about-stat-card__unit">m²</span>
              </div>
              <div className="about-stat-card__label">{t('about:hero.statArea')}</div>
            </div>

            <div className="about-stat-card">
              <div className="about-stat-card__val">
                <span>99.8</span>
                <span className="about-stat-card__unit">%</span>
              </div>
              <div className="about-stat-card__label">{t('about:hero.statYield')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPANY NARRATIVE & BATAM FTZ STRATEGIC ADVANTAGE ── */}
      <section className="about-narrative">
        <div className="container about-narrative__grid">
          <div className="about-narrative__content">
            <span className="about-kicker">{t('about:narrative.kicker')}</span>
            <h2 className="about-heading">{t('about:narrative.title')}</h2>
            
            <p className="about-narrative__text">
              {companyData?.description || t('about:narrative.p1')}
            </p>
            <p className="about-narrative__text">
              {t('about:narrative.p2')}
            </p>
          </div>

          {/* Strategic Batam FTZ Advantage Box */}
          <div className="about-ftz-box">
            <div className="about-ftz-box__header">
              <h3 className="about-ftz-box__title">{t('about:narrative.ftzTitle')}</h3>
              <span className="about-ftz-box__badge">BATAM FTZ HUB</span>
            </div>

            <div className="about-ftz-list">
              <div className="about-ftz-item">
                <div className="about-ftz-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div className="about-ftz-item__content">
                  <h4>{t('about:narrative.ftz1Title')}</h4>
                  <p>{t('about:narrative.ftz1Desc')}</p>
                </div>
              </div>

              <div className="about-ftz-item">
                <div className="about-ftz-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <div className="about-ftz-item__content">
                  <h4>{t('about:narrative.ftz2Title')}</h4>
                  <p>{t('about:narrative.ftz2Desc')}</p>
                </div>
              </div>

              <div className="about-ftz-item">
                <div className="about-ftz-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="about-ftz-item__content">
                  <h4>{t('about:narrative.ftz3Title')}</h4>
                  <p>{t('about:narrative.ftz3Desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE MILESTONE TIMELINE (SEJARAH PERUSAHAAN) ── */}
      <section className="about-milestones">
        <div className="container">
          <div className="about-section-header">
            <span className="about-kicker">{t('about:milestones.kicker')}</span>
            <h2 className="about-heading">{t('about:milestones.title')}</h2>
            <p>{t('about:milestones.subtitle')}</p>
          </div>

          {/* Timeline Year Navigation Bar */}
          <div className="timeline-bar" role="tablist">
            {milestoneItems.map((item, idx) => (
              <button
                key={item.year}
                type="button"
                className={`timeline-btn${activeMilestone === idx ? ' timeline-btn--active' : ''}`}
                onClick={() => setActiveMilestone(idx)}
                role="tab"
                aria-selected={activeMilestone === idx}
              >
                <div className="timeline-btn__year">{item.year}</div>
                <span className="timeline-btn__badge">{item.badge}</span>
              </button>
            ))}
          </div>

          {/* Active Milestone Card */}
          {milestoneItems[activeMilestone] && (
            <div className="timeline-card">
              <div className="timeline-card__badge-wrap">
                <span className="timeline-card__badge-year">{milestoneItems[activeMilestone].year}</span>
                <span className="timeline-card__badge-sub">{milestoneItems[activeMilestone].badge}</span>
              </div>
              <div className="timeline-card__content">
                <h3>{milestoneItems[activeMilestone].title}</h3>
                <p>{milestoneItems[activeMilestone].desc}</p>
                <div className="timeline-card__tag">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>VERIFIED MILESTONE ACCOMPLISHMENT</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. VISION & MISSION CARDS ── */}
      <section className="about-vm">
        <div className="container about-vm__grid">
          {/* Vision */}
          <div className="vm-card vm-card--vision">
            <div className="vm-card__icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <span className="about-kicker">{t('about:visionMission.visionKicker')}</span>
            <h3 className="vm-card__title">{t('about:visionMission.visionTitle')}</h3>
            <p className="vm-card__desc">
              {companyData?.vision || t('about:visionMission.visionDesc')}
            </p>
          </div>

          {/* Mission */}
          <div className="vm-card vm-card--mission">
            <div className="vm-card__icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className="about-kicker">{t('about:visionMission.missionKicker')}</span>
            <h3 className="vm-card__title">{t('about:visionMission.missionTitle')}</h3>
            
            <div className="vm-mission-list">
              <div className="vm-mission-item">
                <span className="vm-mission-bullet">01</span>
                <span>{t('about:visionMission.mission1')}</span>
              </div>
              <div className="vm-mission-item">
                <span className="vm-mission-bullet">02</span>
                <span>{t('about:visionMission.mission2')}</span>
              </div>
              <div className="vm-mission-item">
                <span className="vm-mission-bullet">03</span>
                <span>{t('about:visionMission.mission3')}</span>
              </div>
              <div className="vm-mission-item">
                <span className="vm-mission-bullet">04</span>
                <span>{t('about:visionMission.mission4')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CERTIFICATIONS & REGULATORY COMPLIANCE ── */}
      <section className="about-certs">
        <div className="container">
          <div className="about-section-header">
            <span className="about-kicker">{t('about:certifications.kicker')}</span>
            <h2 className="about-heading" style={{ color: '#0B1320' }}>
              {t('about:certifications.title')}
            </h2>
            <p style={{ color: '#64748B' }}>{t('about:certifications.subtitle')}</p>
          </div>

          <div className="certs-grid">
            {certItems.map((cert) => (
              <div key={cert.code} className="cert-card">
                <div className="cert-card__top">
                  <span className="cert-card__badge">{cert.code}</span>
                  <h3 className="cert-card__name">{cert.name}</h3>
                  <p className="cert-card__desc">{cert.desc}</p>
                </div>
                <div className="cert-card__status">
                  <span className="cert-card__status-dot" />
                  <span>{cert.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FACTORY INFRASTRUCTURE & MACHINE SPECS TOUR ── */}
      <section className="about-facility">
        <div className="container">
          <div className="about-section-header">
            <span className="about-kicker">{t('about:facility.kicker')}</span>
            <h2 className="about-heading">{t('about:facility.title')}</h2>
            <p>{t('about:facility.subtitle')}</p>
          </div>

          {/* Facility Tab Buttons */}
          <div className="facility-nav" role="tablist">
            {facilityZones.map((zone, idx) => (
              <button
                key={zone.id}
                type="button"
                className={`facility-tab-btn${activeZone === idx ? ' facility-tab-btn--active' : ''}`}
                onClick={() => setActiveZone(idx)}
                role="tab"
                aria-selected={activeZone === idx}
              >
                {zone.title}
              </button>
            ))}
          </div>

          {/* Active Facility Zone Stage */}
          {facilityZones[activeZone] && (
            <div className="facility-stage">
              <div className="facility-stage__info">
                <h3>{facilityZones[activeZone].title}</h3>
                <div className="facility-stage__highlight">{facilityZones[activeZone].highlight}</div>
                <p className="facility-stage__desc">{facilityZones[activeZone].desc}</p>

                <div className="facility-specs-list">
                  {facilityZones[activeZone].specs?.map((spec, sIdx) => (
                    <div key={sIdx} className="facility-spec-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="facility-spec-icon">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphic Representation */}
              <FacilityGraphicView zoneId={facilityZones[activeZone].id} />
            </div>
          )}
        </div>
      </section>

      {/* ── 7. B2B CTA BANNER ── */}
      <section className="about-cta">
        <div className="container about-cta__inner">
          <div>
            <h2 className="about-cta__title">{t('about:cta.title')}</h2>
            <p className="about-cta__subtitle">{t('about:cta.subtitle')}</p>
          </div>
          <div className="about-cta__actions">
            <Link to="/contact" className="btn btn--primary btn--lg">
              {t('about:cta.btnSchedule')}
            </Link>
            <Link to="/contact" className="btn btn--outline btn--lg" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}>
              {t('about:cta.btnContact')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
