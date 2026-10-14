import { useState, useEffect, useRef } from 'react';
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

  // Scroll reveal observer for narrative section
  const narrativeSectionRef = useRef(null);
  const [isNarrativeVisible, setIsNarrativeVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNarrativeVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (narrativeSectionRef.current) {
      observer.observe(narrativeSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Lightweight 3D perspective tilt on showcase photo card
  const [cardTilt, setCardTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setCardTilt({ rotateX, rotateY, glareX, glareY });
  };
  const handleCardMouseLeave = () => {
    setCardTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

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
      
      <section className="about-hero">
        <div className="container about-hero__inner">
          {/* Top: Centered Header Typography (No breadcrumb, no button) */}
          <div className="about-hero__header">
            {/* Major Headline */}
            <h1 className="about-hero__title">
              {headerSettings?.title || (isId
                ? 'Membangun Keunggulan Elektronik Otomotif & Manufaktur Presisi Global'
                : 'Engineering Automotive Electronics & Global Precision Manufacturing')}
            </h1>

            {/* Subtitle */}
            <p className="about-hero__lead">
              {headerSettings?.subtitle || t('about:hero.subtitle')}
            </p>
          </div>

          {/* Bottom: 5-Column Staggered Bento Mosaic with Entrance Animation */}
          <div className="about-bento-grid">
            {/* Column 1: Stack of 2 Rounded Cards */}
            <div className="about-bento-col about-bento-col--1">
              {/* Card 1A: SMT Photo */}
              <div className="about-bento-card about-bento-card--photo-sm">
                <img
                  src="/images/about/facility-smt.jpg"
                  alt="Lini Perakitan SMT Presisi"
                  className="about-bento-card__bg-img"
                  loading="lazy"
                />
                <div className="about-bento-card__overlay" />
                <div className="about-bento-card__caption">
                  <h4 className="about-bento-card__caption-title">
                    {t('about:hero.bento.card1Title')}
                  </h4>
                  <p className="about-bento-card__caption-sub">
                    {t('about:hero.bento.card1Sub')}
                  </p>
                </div>
              </div>

              {/* Card 1B: Stat 99.8% */}
              <div className="about-bento-card about-bento-card--stat">
                <div className="about-bento-stat__num">
                  {t('about:hero.bento.card2Val')}
                </div>
                <div className="about-bento-stat__label">
                  {t('about:hero.bento.card2Label')}
                </div>
              </div>
            </div>

            {/* Column 2: Extra Tall Cleanroom Card */}
            <div className="about-bento-col about-bento-col--2">
              <div className="about-bento-card about-bento-card--photo-tall">
                <img
                  src="/images/about/facility-cleanroom.jpg"
                  alt="Fasilitas Cleanroom ESD Class 100K"
                  className="about-bento-card__bg-img"
                  loading="lazy"
                />
                <div className="about-bento-card__overlay about-bento-card__overlay--gradient" />
                <div className="about-bento-card__caption about-bento-card__caption--bottom">
                  <div className="about-bento-stat__num about-bento-stat__num--white">
                    {t('about:hero.bento.card3Val')}
                  </div>
                  <p className="about-bento-card__caption-desc">
                    {t('about:hero.bento.card3Label')}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Center Focal Card */}
            <div className="about-bento-col about-bento-col--3">
              <div className="about-bento-card about-bento-card--focal">
                <div className="about-bento-focal__content">
                  <div className="about-bento-focal__badge">Batam FTZ 0% Tariff</div>
                  <h3 className="about-bento-focal__title">
                    {t('about:hero.bento.card4Title')}
                  </h3>
                  <p className="about-bento-focal__desc">
                    {t('about:hero.bento.card4Desc')}
                  </p>
                  <div className="about-bento-focal__tagline">
                    <span className="about-bento-focal__dot" />
                    <span>IATF 16949 & ISO Certified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 4: Extra Tall 3D AOI & X-Ray Lab Card */}
            <div className="about-bento-col about-bento-col--4">
              <div className="about-bento-card about-bento-card--photo-tall">
                <img
                  src="/images/about/facility-inspection.jpg"
                  alt="Laboratorium Inspeksi Mutu 3D AOI"
                  className="about-bento-card__bg-img"
                  loading="lazy"
                />
                <div className="about-bento-card__overlay about-bento-card__overlay--gradient" />
                <div className="about-bento-card__caption about-bento-card__caption--bottom">
                  <div className="about-bento-stat__num about-bento-stat__num--white">
                    {t('about:hero.bento.card5Val')}
                  </div>
                  <p className="about-bento-card__caption-desc">
                    {t('about:hero.bento.card5Label')}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 5: Stack of 2 Rounded Cards */}
            <div className="about-bento-col about-bento-col--5">
              {/* Card 5A: IATF Typography Badge Card */}
              <div className="about-bento-card about-bento-card--badge">
                <div className="about-bento-badge__decor">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <div className="about-bento-badge__title">
                  {t('about:hero.bento.card6Title')}
                </div>
                <div className="about-bento-badge__sub">
                  {t('about:hero.bento.card6Sub')}
                </div>
              </div>

              {/* Card 5B: Team Engineering Photo */}
              <div className="about-bento-card about-bento-card--photo-sm">
                <img
                  src="/images/about/about-team.jpg"
                  alt="Tim Engineering PT. Global Philsonic Technologies"
                  className="about-bento-card__bg-img"
                  loading="lazy"
                />
                <div className="about-bento-card__overlay" />
                <div className="about-bento-card__caption">
                  <h4 className="about-bento-card__caption-title">
                    {t('about:hero.bento.card7Title')}
                  </h4>
                  <p className="about-bento-card__caption-sub">
                    {t('about:hero.bento.card7Sub')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPANY PROFILE & STRATEGIC BATAM ADVANTAGES ── */}
      <section
        id="profile-section"
        ref={narrativeSectionRef}
        className={`about-narrative ${isNarrativeVisible ? 'about-narrative--revealed' : ''}`}
      >
        {/* Subtle Technical Blueprint & Coordinates Watermark Background */}
        <div className="about-narrative__tech-bg" aria-hidden="true">
          <svg className="about-narrative__tech-svg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="techGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.07" />
                <circle cx="60" cy="0" r="1.5" fill="currentColor" fillOpacity="0.12" />
                <circle cx="0" cy="60" r="1.5" fill="currentColor" fillOpacity="0.12" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#techGrid)" />
          </svg>
          <div className="about-narrative__tech-watermark">
            <span className="about-narrative__tech-coords">LAT 1°07'49.4"N · LNG 104°03'10.4"E</span>
            <span className="about-narrative__tech-code">PRECISION SMT MANUFACTURING · BATAM FTZ</span>
          </div>
        </div>

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
          </div>

          {/* Company Leadership Showcase Photo with 3D Tilt */}
          <div className="about-showcase-column">
            <div
              className="about-company-photo-card"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg)`,
              }}
            >
              <div
                className="about-company-card__glare"
                style={{
                  background: `radial-gradient(circle at ${cardTilt.glareX}% ${cardTilt.glareY}%, rgba(255,255,255,0.16) 0%, transparent 65%)`,
                }}
              />
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
                
                {/* Subtle manufacturing status indicator */}
                <div className="about-company-status-badge">
                  <span className="about-company-status-dot" />
                  <span>{isId ? 'PUSAT MANUFAKTUR BATAM FTZ' : 'BATAM FTZ MANUFACTURING HUB'}</span>
                </div>

                <div className="about-company-photo-caption">
                  <h3 className="about-company-photo-title">
                    {narrativeSettings?.photoTitle || "PT. Global Philsonic Technologies"}
                  </h3>
                  <p className="about-company-photo-sub">
                    {narrativeSettings?.photoSub || (isId ? "Pusat Rekayasa Manufaktur Elektronik Otomotif & Perakitan SMT Presisi" : "Automotive Electronics Engineering & Precision SMT Assembly Hub")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Operational & Telemetry Metrics Strip (Clean Typography, No Boxes) ── */}
        <div className="container about-narrative__stats-strip">
          <div className="about-narrative__stats-row">
            <div className="about-stat-item">
              <div className="about-stat-item__val">
                <span>{headerSettings?.statYears?.value || '10'}</span>
                <span className="about-stat-item__unit">+</span>
              </div>
              <div className="about-stat-item__label">{headerSettings?.statYears?.label || t('about:hero.statYears')}</div>
            </div>

            <div className="about-stat-divider" />

            <div className="about-stat-item">
              <div className="about-stat-item__val">
                <span>{headerSettings?.statCapacity?.value || '80'}</span>
                <span className="about-stat-item__unit">K CPH</span>
              </div>
              <div className="about-stat-item__label">{headerSettings?.statCapacity?.label || t('about:hero.statCapacity')}</div>
            </div>

            <div className="about-stat-divider" />

            <div className="about-stat-item">
              <div className="about-stat-item__val">
                <span>{headerSettings?.statArea?.value || '10,000'}</span>
                <span className="about-stat-item__unit">m²</span>
              </div>
              <div className="about-stat-item__label">{headerSettings?.statArea?.label || t('about:hero.statArea')}</div>
            </div>

            <div className="about-stat-divider" />

            <div className="about-stat-item">
              <div className="about-stat-item__val">
                <span>{headerSettings?.statYield?.value || '99.8'}</span>
                <span className="about-stat-item__unit">%</span>
              </div>
              <div className="about-stat-item__label">{headerSettings?.statYield?.label || t('about:hero.statYield')}</div>
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
