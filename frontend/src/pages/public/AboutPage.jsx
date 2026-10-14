import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useCompany, useSiteSettings } from '../../hooks/useApi';
import { getLocalizedData } from '../../lib/translator';
import { getImageUrl } from '../../lib/api';
import './AboutPage.css';

/* ── Real High-Resolution Manufacturing Facility Photos ── */
const FACILITY_ZONE_IMAGES = {
  cleanroom: {
    src: '/images/about/facility-cleanroom.jpg',
    alt: 'Ruang Cleanroom Berstandar ESD Class 100K PT. Global Philsonic Technologies',
    badge: 'HEPA 99.97% · ESD PROTECTED',
  },
  smt: {
    src: '/images/about/facility-smt.jpg',
    alt: 'Lini Perakitan SMT Berkecepatan Tinggi 80.000 CPH',
    badge: 'DUAL-BEAM 80,000 CPH',
  },
  inspection: {
    src: '/images/about/facility-inspection.jpg',
    alt: 'Laboratorium Inspeksi Optik 3D AOI & Inline X-Ray',
    badge: '3D AOI & INLINE X-RAY',
  },
  tooling: {
    src: '/images/about/facility-tooling.jpg',
    alt: 'Workshop Otomasi & Jig Engineering ICT/FCT Test Fixtures',
    badge: 'ICT / FCT TEST FIXTURES',
  },
};

function FacilityPhotoView({ zoneId, zone }) {
  const fallback = FACILITY_ZONE_IMAGES[zoneId] || FACILITY_ZONE_IMAGES.cleanroom;
  const imageSrc = zone?.image ? getImageUrl(zone.image) : fallback.src;
  const imageAlt = zone?.imageAlt || zone?.name || fallback.alt;
  const imageBadge = zone?.imageBadge || fallback.badge;

  return (
    <div className="facility-photo-card">
      <div className="facility-photo-wrap">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="facility-photo"
          loading="lazy"
          onError={(e) => {
            e.target.src = fallback.src || '/images/about/facility-cleanroom.jpg';
          }}
        />
        <div className="facility-photo-overlay" />
        {imageBadge && (
          <div className="facility-photo-badge">
            {imageBadge}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AboutPage() {
  const { t, i18n } = useTranslation(['about', 'common']);
  const isId = i18n.language === 'id';
  const lang = isId ? 'id' : 'en';

  const { data: companyData } = useCompany();

  // Dynamic Site Settings from Admin Portal
  const { data: rawHeaderSettings } = useSiteSettings('about_header');
  const { data: rawNarrativeSettings } = useSiteSettings('about_narrative');
  const { data: rawVmSettings } = useSiteSettings('about_vision_mission');
  const { data: rawFacilitiesSettings } = useSiteSettings('about_facilities');
  const { data: rawTimelineSettings } = useSiteSettings('about_timeline');
  const { data: rawCertSettings } = useSiteSettings('about_certifications');

  const headerSettings = {
    ...(rawHeaderSettings && typeof rawHeaderSettings === 'object' ? rawHeaderSettings : {}),
    ...getLocalizedData(rawHeaderSettings, lang),
  };
  const narrativeSettings = {
    ...(rawNarrativeSettings && typeof rawNarrativeSettings === 'object' ? rawNarrativeSettings : {}),
    ...getLocalizedData(rawNarrativeSettings, lang),
  };
  const vmSettings = {
    ...(rawVmSettings && typeof rawVmSettings === 'object' ? rawVmSettings : {}),
    ...getLocalizedData(rawVmSettings, lang),
  };
  const facilitiesSettings = getLocalizedData(rawFacilitiesSettings, lang);
  const timelineSettings = getLocalizedData(rawTimelineSettings, lang);
  const certSettings = getLocalizedData(rawCertSettings, lang);

  // Interactive state
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [activeZone, setActiveZone] = useState(0);

  const fallbackMilestones = t('about:milestones.items', { returnObjects: true }) || [];
  const milestoneItems = (Array.isArray(timelineSettings) && timelineSettings.length > 0)
    ? timelineSettings
    : fallbackMilestones;

  const fallbackCerts = t('about:certifications.items', { returnObjects: true }) || [];
  const certItems = (Array.isArray(certSettings) && certSettings.length > 0)
    ? certSettings
    : fallbackCerts;

  const fallbackZones = t('about:facility.zones', { returnObjects: true }) || [];
  const facilityZones = (Array.isArray(facilitiesSettings) && facilitiesSettings.length > 0)
    ? facilitiesSettings
    : fallbackZones;

  const activeDescription = isId
    ? (companyData?.description || narrativeSettings?.p1 || t('about:narrative.p1'))
    : (companyData?.description_en || narrativeSettings?.p1 || companyData?.description || t('about:narrative.p1'));

  const activeVision = isId
    ? (companyData?.vision || t('about:visionMission.visionDesc'))
    : (companyData?.vision_en || companyData?.vision || t('about:visionMission.visionDesc'));

  const activeMission = isId
    ? (companyData?.mission || '')
    : (companyData?.mission_en || companyData?.mission || '');

  // Hero background image: priority from headerSettings -> fallback to building hero photo
  const heroBgImage = headerSettings?.bg_image
    ? getImageUrl(headerSettings.bg_image)
    : '/images/about/about-building-hero.jpg';

  const scrollToProfile = () => {
    const el = document.getElementById('profile-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {isId
            ? 'Tentang Kami | PT. Global Philsonic Technologies (GPT) Batam'
            : 'About Us | PT. Global Philsonic Technologies (GPT) Batam'}
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

      {/* ── 1. HERO SECTION: LARGE BUILDING BACKGROUND WITH BALANCED LIGHTER OVERLAY ── */}
      <section
        className="about-hero"
        style={{
          backgroundImage: `url(${heroBgImage})`,
        }}
      >
        {/* Balanced translucent overlay for clear building visibility */}
        <div className="about-hero__overlay" />
        <div className="about-hero__grid-pattern" />

        <div className="container about-hero__content-wrap">
          {/* Breadcrumb Navigation - Centered */}
          <nav aria-label="Breadcrumb" className="about-hero__breadcrumb">
            <Link to="/">{t('about:hero.breadcrumbHome')}</Link>
            <span className="about-hero__breadcrumb-sep">/</span>
            <span className="about-hero__breadcrumb-current">{t('about:hero.breadcrumbAbout')}</span>
          </nav>

          {/* Major Title - Centered & Clean without badges */}
          <h1 className="about-hero__title">
            {headerSettings?.title || t('about:hero.title')}
          </h1>

          {/* Subtitle - Centered */}
          <p className="about-hero__lead">
            {headerSettings?.subtitle || t('about:hero.subtitle')}
          </p>
        </div>
      </section>

      {/* ── 2. COMPANY PROFILE & STRATEGIC BATAM ADVANTAGES ── */}
      <section id="profile-section" className="about-narrative">
        <div className="container about-narrative__grid">
          <div className="about-narrative__content">
            <span className="about-kicker">{t('about:narrative.kicker')}</span>
            <h2 className="about-heading">{narrativeSettings?.title || t('about:narrative.title')}</h2>
            
            {/* Corporate Manifesto Highlight */}
            <div className="about-narrative__manifesto">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="about-narrative__quote-icon">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p>
                {isId
                  ? 'Mendedikasikan kapabilitas engineering presisi tinggi dan infrastruktur cerdas kelas dunia untuk mempercepat rantai pasok elektronik otomotif global dari Batam FTZ.'
                  : 'Dedicated to delivering high-precision engineering and world-class intelligent infrastructure to accelerate the global automotive electronics supply chain from Batam FTZ.'}
              </p>
            </div>

            <p className="about-narrative__text">
              {activeDescription}
            </p>
            <p className="about-narrative__text">
              {narrativeSettings?.p2 || t('about:narrative.p2')}
            </p>

            {/* Strategic Pillars in FTZ */}
            <div className="about-ftz-pillars">
              <div className="about-ftz-pillar">
                <div className="about-ftz-pillar__num">01</div>
                <div>
                  <h4 className="about-ftz-pillar__title">{t('about:narrative.ftz1Title')}</h4>
                  <p className="about-ftz-pillar__desc">{t('about:narrative.ftz1Desc')}</p>
                </div>
              </div>

              <div className="about-ftz-pillar">
                <div className="about-ftz-pillar__num">02</div>
                <div>
                  <h4 className="about-ftz-pillar__title">{t('about:narrative.ftz2Title')}</h4>
                  <p className="about-ftz-pillar__desc">{t('about:narrative.ftz2Desc')}</p>
                </div>
              </div>

              <div className="about-ftz-pillar">
                <div className="about-ftz-pillar__num">03</div>
                <div>
                  <h4 className="about-ftz-pillar__title">{t('about:narrative.ftz3Title')}</h4>
                  <p className="about-ftz-pillar__desc">{t('about:narrative.ftz3Desc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Leadership Showcase Photo */}
          <div className="about-showcase-column">
            <div className="about-company-photo-card">
              <div className="about-company-photo-wrap">
                <img
                  src={narrativeSettings?.image
                    ? getImageUrl(narrativeSettings.image)
                    : '/images/about/about-team.jpg'}
                  alt={narrativeSettings?.photoTitle || "Dewan Direksi & Tim Engineering PT. Global Philsonic Technologies"}
                  className="about-company-photo"
                  onError={(e) => {
                    e.target.src = '/images/about/about-showcase.jpg';
                  }}
                />
                <div className="about-company-photo-overlay" />
                <div className="about-company-photo-caption">
                  <span className="about-company-photo-tag">
                    {narrativeSettings?.photoTag || (isId ? 'MANAJEMEN & ENGINEERING EKSEKUTIF' : 'EXECUTIVE MANAGEMENT & ENGINEERING')}
                  </span>
                  <h3 className="about-company-photo-title">
                    {narrativeSettings?.photoTitle || "PT. Global Philsonic Technologies"}
                  </h3>
                  <p className="about-company-photo-sub">
                    {narrativeSettings?.photoSub || (isId ? "Pusat Rekayasa Manufaktur Elektronik Otomotif & Perakitan SMT Presisi" : "Automotive Electronics Engineering & Precision SMT Assembly Hub")}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Trust Badges Strip */}
            <div className="about-trust-strip">
              <div className="about-trust-badge">
                <span className="about-trust-badge__dot" />
                <span>IATF 16949:2016</span>
              </div>
              <div className="about-trust-badge">
                <span className="about-trust-badge__dot" />
                <span>ISO 9001:2015</span>
              </div>
              <div className="about-trust-badge">
                <span className="about-trust-badge__dot" />
                <span>IPC-A-610 CLASS 3</span>
              </div>
              <div className="about-trust-badge">
                <span className="about-trust-badge__dot" />
                <span>BATAM FTZ 0% TARIFF</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Merged Operational & Telemetry Metrics Deck ── */}
        <div className="container about-narrative__stats-container">
          <div className="about-narrative__stats-grid">
            <div className="about-narrative__stat-card">
              <div className="about-narrative__stat-val">
                <span>{headerSettings?.statYears?.value || '10'}</span>
                <span className="about-narrative__stat-unit">+</span>
              </div>
              <div className="about-narrative__stat-label">{headerSettings?.statYears?.label || t('about:hero.statYears')}</div>
            </div>

            <div className="about-narrative__stat-card">
              <div className="about-narrative__stat-val">
                <span>{headerSettings?.statCapacity?.value || '80'}</span>
                <span className="about-narrative__stat-unit">K CPH</span>
              </div>
              <div className="about-narrative__stat-label">{headerSettings?.statCapacity?.label || t('about:hero.statCapacity')}</div>
            </div>

            <div className="about-narrative__stat-card">
              <div className="about-narrative__stat-val">
                <span>{headerSettings?.statArea?.value || '10,000'}</span>
                <span className="about-narrative__stat-unit">m²</span>
              </div>
              <div className="about-narrative__stat-label">{headerSettings?.statArea?.label || t('about:hero.statArea')}</div>
            </div>

            <div className="about-narrative__stat-card">
              <div className="about-narrative__stat-val">
                <span>{headerSettings?.statYield?.value || '99.8'}</span>
                <span className="about-narrative__stat-unit">%</span>
              </div>
              <div className="about-narrative__stat-label">{headerSettings?.statYield?.label || t('about:hero.statYield')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. VISION, MISSION & CORE CORPORATE VALUES ── */}
      <section className="about-vm">
        <div className="container">
          {/* Lab & R&D Feature Panorama */}
          <div className="about-vm__panorama">
            <img 
              src={vmSettings?.image ? getImageUrl(vmSettings.image) : '/images/about/about-vision.jpg'} 
              alt="Laboratorium R&D dan Fasilitas Cleanroom PT. Global Philsonic Technologies" 
              className="about-vm__panorama-img"
              onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
            />
            <div className="about-vm__panorama-overlay" />
            <div className="about-vm__panorama-caption">
              <span className="about-vm__panorama-kicker">
                {isId ? 'FASILITAS RISET & TEKNOLOGI PERAKITAN MIKRON' : 'R&D FACILITIES & MICRON PRECISION ASSEMBLY'}
              </span>
              <h3 className="about-vm__panorama-title">
                {isId
                  ? 'Standar Mutu Nol-Cacat (Zero-Defect) & Presisi Mikron Berkelanjutan'
                  : 'Zero-Defect Quality Standards & Continuous Micron Precision'}
              </h3>
            </div>
          </div>

          <div className="about-vm__grid">
            {/* Vision */}
            <div className="vm-card vm-card--vision">
              <div className="vm-card__header">
                <span className="vm-card__kicker">{t('about:visionMission.visionKicker') || (isId ? 'ARAH MASA DEPAN' : 'FUTURE DIRECTION')}</span>
                <h3 className="vm-card__title">{t('about:visionMission.visionTitle')}</h3>
              </div>
              <p className="vm-card__desc">
                {activeVision}
              </p>
            </div>

            {/* Mission */}
            <div className="vm-card vm-card--mission">     
              <div className="vm-card__header">
                <span className="vm-card__kicker">{t('about:visionMission.missionKicker') || (isId ? 'TANGGUNG JAWAB & KOMITMEN' : 'COMMITMENT & RESPONSIBILITY')}</span>
                <h3 className="vm-card__title">{t('about:visionMission.missionTitle')}</h3>
              </div>
              
              <div className="vm-mission-list">
                {(activeMission ? activeMission.split('\n').filter(Boolean) : [
                  t('about:visionMission.mission1'),
                  t('about:visionMission.mission2'),
                  t('about:visionMission.mission3'),
                  t('about:visionMission.mission4')
                ]).map((m, idx) => (
                  <div key={idx} className="vm-mission-item">
                    <span className="vm-mission-bullet">0{idx + 1}</span>
                    <span>{m.replace(/^[0-9]+[.)]\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Core Values Strip */}
          <div className="about-values-deck">
            <div className="about-value-card">
              <div className="about-value-card__idx">01</div>
              <h4 className="about-value-card__title">{isId ? 'Presisi Mikron' : 'Micron Precision'}</h4>
              <p className="about-value-card__desc">
                {isId
                  ? 'Penempatan komponen mikro hingga 01005 dengan toleransi akurasi tinggi dan pengawasan pasta solder 3D SPI.'
                  : 'Placement of micro components down to 01005 with high accuracy tolerances and 3D SPI solder paste monitoring.'}
              </p>
            </div>

            <div className="about-value-card">
              <div className="about-value-card__idx">02</div>
              <h4 className="about-value-card__title">{isId ? 'Kepatuhan Nol-Cacat' : 'Zero-Defect Quality'}</h4>
              <p className="about-value-card__desc">
                {isId
                  ? 'Audit berkala dan kepatuhan sistem mutu IATF 16949, ISO 9001, serta standar inspeksi IPC-A-610 Class 3.'
                  : 'Continuous audit compliance with IATF 16949, ISO 9001, and IPC-A-610 Class 3 optical verification.'}
              </p>
            </div>

            <div className="about-value-card">
              <div className="about-value-card__idx">03</div>
              <h4 className="about-value-card__title">{isId ? 'Kecepatan & Efisiensi' : 'Velocity & Agility'}</h4>
              <p className="about-value-card__desc">
                {isId
                  ? 'Didukung pembebasan bea masuk Batam FTZ dan jalur pengiriman ekspres harian 45 menit ke pelabuhan Singapura.'
                  : 'Backed by Batam FTZ tariff exemptions and daily 45-minute express transit to Singapore seaport hubs.'}
              </p>
            </div>

            <div className="about-value-card">
              <div className="about-value-card__idx">04</div>
              <h4 className="about-value-card__title">{isId ? 'Integritas Kemitraan' : 'Partnership Trust'}</h4>
              <p className="about-value-card__desc">
                {isId
                  ? 'Perlindungan ketat terhadap hak kekayaan intelektual (IP), transparansi sistem MES, dan kemitraan jangka panjang.'
                  : 'Strict intellectual property (IP) protection, real-time MES traceability, and lasting B2B partnerships.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. INTERACTIVE MILESTONE TIMELINE (SEJARAH PERUSAHAAN) ── */}
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
                {(() => {
                  const m = milestoneItems[activeMilestone];
                  const mImg = m?.image || `/images/about/milestone-${m?.year || (activeMilestone === 0 ? '2014' : activeMilestone === 1 ? '2017' : activeMilestone === 2 ? '2020' : activeMilestone === 3 ? '2023' : '2026')}.jpg`;
                  return (
                    <div className="timeline-card__image-wrap">
                      <img 
                        src={getImageUrl(mImg)} 
                        alt={m.title}
                        className="timeline-card__img"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 5. CERTIFICATIONS & REGULATORY COMPLIANCE ── */}
      <section className="about-certs">
        <div className="container">
          <div className="about-section-header">
            <span className="about-kicker">{t('about:certifications.kicker')}</span>
            <h2 className="about-heading">
              {t('about:certifications.title')}
            </h2>
            <p className="about-subtitle">{t('about:certifications.subtitle')}</p>
          </div>

          <div className="certs-grid">
            {certItems.map((cert, idx) => {
              const defaultCert = cert.code?.includes('16949') ? '/images/about/cert-iatf-16949.svg'
                : cert.code?.includes('9001') ? '/images/about/cert-iso-9001.svg'
                : cert.code?.includes('14001') ? '/images/about/cert-iso-14001.svg'
                : '/images/about/cert-ansi-esd.svg';
              const certImg = cert.image ? getImageUrl(cert.image) : defaultCert;

              return (
                <div key={cert.code || idx} className="cert-card">
                  {certImg && (
                    <div className="cert-card__image-wrap">
                      <img 
                        src={certImg} 
                        alt={cert.name || cert.title}
                        className="cert-card__icon-img"
                        onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <div className="cert-card__top">
                    <div className="cert-card__code-badge">{cert.code}</div>
                    <h3 className="cert-card__name">{cert.name || cert.title}</h3>
                    <p className="cert-card__desc">{cert.desc}</p>
                  </div>
                  <div className="cert-card__status">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{cert.status || (isId ? 'Tersertifikasi Penuh' : 'Fully Certified')}</span>
                  </div>
                </div>
              );
            })}
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

              {/* Real Facility Photo View */}
              <FacilityPhotoView zoneId={facilityZones[activeZone].id} zone={facilityZones[activeZone]} />
            </div>
          )}
        </div>
      </section>

      {/* ── 7. CORPORATE CTA BANNER ── */}
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
            <Link to="/contact" className="btn btn--outline btn--lg">
              {t('about:cta.btnContact')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
