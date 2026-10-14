import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useCompany, useSiteSettings } from '../../hooks/useApi';
import { getLocalizedData } from '../../lib/translator';
import { getImageUrl } from '../../lib/api';
import './AboutPage.css';

/* ── Real High-Resolution Manufacturing Facility Photos (Offline Local Root Assets) ── */
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
            e.target.src = fallback.src || '/images/hero-smt.jpg';
          }}
        />
        <div className="facility-photo-overlay" />
        {imageBadge && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            zIndex: 3,
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(13, 148, 136, 0.4)',
            color: '#2dd4bf',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            backdropFilter: 'blur(6px)'
          }}>
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

      {/* ── 1. HERO BANNER WITH INDUSTRIAL TELEMETRY DECK ── */}
      <section
        className="about-hero"
        style={headerSettings?.bg_image ? {
          backgroundImage: `linear-gradient(rgba(10, 15, 30, 0.88), rgba(10, 15, 30, 0.94)), url(${getImageUrl(headerSettings.bg_image)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        <div className="about-hero__bg-grid" />

        <div className="container about-hero__stage">
          <h1 className="about-hero__title">
            {headerSettings?.title || t('about:hero.title')}
          </h1>

          <p className="about-hero__subtitle">
            {headerSettings?.subtitle || t('about:hero.subtitle')}
          </p>

          {/* Telemetry Stats Deck */}
          <div className="about-hero__deck">
            <div className="about-stat-card">
              <div className="about-stat-card__val">
                <span>{headerSettings?.statYears?.value || '10'}</span>
                {!headerSettings?.statYears?.value && <span className="about-stat-card__unit">+</span>}
              </div>
              <div className="about-stat-card__label">{headerSettings?.statYears?.label || t('about:hero.statYears')}</div>
            </div>

            <div className="about-stat-card">
              <div className="about-stat-card__val">
                <span>{headerSettings?.statCapacity?.value || '80'}</span>
                {!headerSettings?.statCapacity?.value && <span className="about-stat-card__unit">K CPH</span>}
              </div>
              <div className="about-stat-card__label">{headerSettings?.statCapacity?.label || t('about:hero.statCapacity')}</div>
            </div>

            <div className="about-stat-card">
              <div className="about-stat-card__val">
                <span>{headerSettings?.statArea?.value || '10,000'}</span>
                {!headerSettings?.statArea?.value && <span className="about-stat-card__unit">m²</span>}
              </div>
              <div className="about-stat-card__label">{headerSettings?.statArea?.label || t('about:hero.statArea')}</div>
            </div>

            <div className="about-stat-card">
              <div className="about-stat-card__val">
                <span>{headerSettings?.statYield?.value || '99.8'}</span>
                {!headerSettings?.statYield?.value && <span className="about-stat-card__unit">%</span>}
              </div>
              <div className="about-stat-card__label">{headerSettings?.statYield?.label || t('about:hero.statYield')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. COMPANY NARRATIVE & BATAM FTZ STRATEGIC ADVANTAGE ── */}
      <section className="about-narrative">
        <div className="container about-narrative__grid">
          <div className="about-narrative__content">
            <span className="about-kicker">{t('about:narrative.kicker')}</span>
            <h2 className="about-heading">{narrativeSettings?.title || t('about:narrative.title')}</h2>
            
            <p className="about-narrative__text">
              {activeDescription}
            </p>
            <p className="about-narrative__text">
              {narrativeSettings?.p2 || t('about:narrative.p2')}
            </p>
          </div>

          {/* Company Facility Showcase Photo */}
          <div className="about-company-photo-card">
            <div className="about-company-photo-wrap">
              <img
                src={narrativeSettings?.image
                  ? getImageUrl(narrativeSettings.image)
                  : (companyData?.about_image || companyData?.image
                    ? getImageUrl(companyData.about_image || companyData.image)
                    : "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80")}
                alt={narrativeSettings?.photoTitle || "Fasilitas Manufaktur PT. Global Philsonic Technologies Batam"}
                className="about-company-photo"
                onError={(e) => {
                  e.target.src = '/images/hero-smt.jpg';
                }}
              />
              <div className="about-company-photo-overlay" />
              <div className="about-company-photo-caption">
                {narrativeSettings?.photoTag && (
                  <span className="about-company-photo-tag">{narrativeSettings.photoTag}</span>
                )}
                <h3 className="about-company-photo-title">
                  {narrativeSettings?.photoTitle || companyData?.title || "PT. Global Philsonic Technologies"}
                </h3>
                <p className="about-company-photo-sub">
                  {narrativeSettings?.photoSub || (isId ? "Pusat Manufaktur Elektronik Otomotif & Perakitan SMT Presisi" : "Automotive Electronics & Precision SMT Assembly Hub")}
                </p>
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
                {(() => {
                  const m = milestoneItems[activeMilestone];
                  const mImg = m?.image || `/images/about/milestone-${m?.year || (activeMilestone === 0 ? '2014' : activeMilestone === 1 ? '2017' : activeMilestone === 2 ? '2020' : activeMilestone === 3 ? '2023' : '2026')}.jpg`;
                  return (
                    <div className="timeline-card__image-wrap" style={{ marginTop: '1.25rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '500px' }}>
                      <img 
                        src={getImageUrl(mImg)} 
                        alt={m.title}
                        style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', display: 'block' }}
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

      {/* ── 4. VISION & MISSION CARDS ── */}
      <section className="about-vm">
        <div className="container">
          {vmSettings?.image && (
            <div style={{ marginBottom: '2.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '340px' }}>
              <img 
                src={getImageUrl(vmSettings.image)} 
                alt="Visi & Misi PT. Global Philsonic Technologies" 
                style={{ width: '100%', maxHeight: '340px', objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
              />
            </div>
          )}
          <div className="about-vm__grid">
            {/* Vision */}
            <div className="vm-card vm-card--vision">
              <h3 className="vm-card__title">{t('about:visionMission.visionTitle')}</h3>
              <p className="vm-card__desc">
                {activeVision}
              </p>
            </div>

            {/* Mission */}
            <div className="vm-card vm-card--mission">     
              <h3 className="vm-card__title">{t('about:visionMission.missionTitle')}</h3>
              
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
                    <div className="cert-card__image-wrap" style={{ marginBottom: '1.25rem', borderRadius: '8px', overflow: 'hidden', background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem' }}>
                      <img 
                        src={certImg} 
                        alt={cert.name || cert.title}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                        onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <div className="cert-card__top">
                    <h3 className="cert-card__name">{cert.name || cert.title}</h3>
                    <p className="cert-card__desc">{cert.desc}</p>
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
                {/* <div className="facility-stage__highlight">{facilityZones[activeZone].highlight}</div> */}
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
