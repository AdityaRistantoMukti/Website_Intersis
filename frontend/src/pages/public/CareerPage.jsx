import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import './CareerPage.css';

// ════════════════════════════════════════════════════════════════════════════
// DATA DEFAULT (FALLBACK JIKA OFFLINE)
// ════════════════════════════════════════════════════════════════════════════
const PERKS = [
  {
    titleId: 'Asuransi & Jaminan Kesehatan',
    titleEn: 'Comprehensive Healthcare',
    descId: 'BPJS lengkap ditambah asuransi swasta rawat inap karyawan.',
    descEn: 'Full BPJS social security plus corporate private inpatient insurance.',
  },
  {
    titleId: 'Sertifikasi IPC & IATF',
    titleEn: 'IPC & IATF Certification',
    descId: 'Pelatihan resmi IPC-A-610 dan Six Sigma berbayar perusahaan.',
    descEn: 'Company-sponsored IPC-A-610 and Six Sigma training programs.',
  },
  {
    titleId: 'Fasilitas Lab & Cleanroom',
    titleEn: 'Modern ESD Cleanroom',
    descId: 'Lingkungan kerja ber-AC dengan standar ESD ISO Class 8.',
    descEn: 'Climate-controlled ISO Class 8 ESD facilities.',
  },
  {
    titleId: 'Program Magang Bersertifikat',
    titleEn: 'Accredited Internship',
    descId: 'Uang saku, bimbingan engineer senior, dan peluang rekrutmen tetap.',
    descEn: 'Allowance, senior mentorship, and direct hire pathways.',
  },
];

const DEFAULT_JOB_OPENINGS = [
  {
    id: 1,
    dept: 'engineering',
    category_name: 'Engineering',
    title: 'Senior SMT Process Engineer',
    type: 'Full-time',
    employment_type: 'Full Time',
    location: 'Batam FTZ Plant',
    experience: '3-5 Years',
    desc: 'Lead solder paste printing optimization, reflow profile validation, and Yamaha YSM20R feeder setup to achieve zero-defect yields under IATF 16949 automotive standards.',
    requirements: [
      "Bachelor's Degree in Electrical, Electronic, or Mechatronics Engineering.",
      'Minimum 3 years direct experience in high-speed SMT line process engineering.',
      'Proficiency in KIC thermal profiling, 3D SPI defect root-cause analysis, and IPC-A-610 Class 3 standards.',
      'Strong analytical mindset with Six Sigma Green Belt certification is an advantage.',
    ],
    form_url: 'https://docs.google.com/forms/d/e/1FAIpQLScN_engineering_recruitment_sample/viewform?usp=sf_link',
  },
  {
    id: 2,
    dept: 'automation',
    category_name: 'Otomasi & Tooling',
    title: 'Test Automation & PLC Programmer',
    type: 'Full-time',
    employment_type: 'Full Time',
    location: 'Batam FTZ Plant',
    experience: '2-4 Years',
    desc: 'Design, write firmware, and debug custom pneumatic test fixtures and functional test beds using Omron Sysmac, Mitsubishi PLC, and Python/LabVIEW instrumentation.',
    requirements: [
      "Diploma/Bachelor's Degree in Mechatronics, Automation, or Computer Engineering.",
      'Proven experience in PLC ladder logic, ST programming, and pneumatic circuit schematics (Festo/SMC).',
      'Familiarity with Keysight / NI instrumentation and serial automotive buses (CAN, LIN, RS485).',
      'Demonstrated hands-on experience in assembling mechanical test nests and sensor integration.',
    ],
    form_url: 'https://docs.google.com/forms/d/e/1FAIpQLScN_automation_recruitment_sample/viewform?usp=sf_link',
  },
  {
    id: 3,
    dept: 'quality',
    category_name: 'QA / QC',
    title: 'QA Engineer - Automotive',
    type: 'Full-time',
    employment_type: 'Full Time',
    location: 'Batam FTZ Plant',
    experience: '2+ Years',
    desc: 'Oversee incoming, in-process, and outgoing PCBA quality gate inspections, X-ray BGA analysis, and manage non-conformance 8D corrective action reports for OEM clients.',
    requirements: [
      "Diploma or Bachelor's in Industrial Engineering or Quality Management.",
      'Certified IPC-A-610 Specialist (CIS) strongly preferred.',
      'Experience handling 8D problem-solving reports and customer audit inspections.',
      'Fluency in English (written & spoken) for daily client reporting.',
    ],
    form_url: 'https://docs.google.com/forms/d/e/1FAIpQLScN_qa_recruitment_sample/viewform?usp=sf_link',
  },
  {
    id: 4,
    dept: 'production',
    category_name: 'Produksi',
    title: 'SMT Production Shift Supervisor',
    type: 'Full-time',
    employment_type: 'Full Time',
    location: 'Batam FTZ Plant',
    experience: '3+ Years',
    desc: 'Direct shift line operators, coordinate line changeovers, enforce 5S cleanroom disciplines, and ensure daily manufacturing targets and OEE KPIs are surpassed.',
    requirements: [
      'Minimum 3 years leadership experience in SMT or electronics manufacturing plant.',
      'Strong organizational leadership, shift scheduling, and ESD compliance enforcement.',
      'Willingness to work in rotating 3-shift schedules in Batam industrial zone.',
    ],
    form_url: 'https://docs.google.com/forms/d/e/1FAIpQLScN_production_recruitment_sample/viewform?usp=sf_link',
  },
  {
    id: 5,
    dept: 'automation',
    category_name: 'Otomasi & Tooling',
    title: 'CNC Tooling & Fixture Technician',
    type: 'Full-time',
    employment_type: 'Full Time',
    location: 'Batam FTZ Plant',
    experience: '1-3 Years',
    desc: 'Operate Haas 4-axis CNC milling centers to fabricate custom Bakelite and POM-C test nests, perform preventative maintenance on pneumatic actuators and probe pins.',
    requirements: [
      'Vocational High School (SMK Mesin) or Diploma in Mechanical Machining / Tool & Die.',
      'Ability to read mechanical 2D/3D CAD drawings (SolidWorks / AutoCAD).',
      'Hands-on experience with CNC G-code programming and precision measurement tools.',
    ],
    form_url: 'https://docs.google.com/forms/d/e/1FAIpQLScN_automation_recruitment_sample/viewform?usp=sf_link',
  },
  {
    id: 6,
    dept: 'internship',
    category_name: 'Magang (Internship)',
    title: 'Engineering & IoT Smart Factory Internship (6 Bulan)',
    type: 'Internship (Paid)',
    employment_type: 'Internship',
    location: 'Batam FTZ Plant',
    experience: 'Mahasiswa Tingkat Akhir',
    desc: 'Program magang terstruktur 6 bulan untuk mahasiswa Politeknik / Universitas dalam bidang SMT Process, MES Industry 4.0 Telemetry, atau Embedded Firmware Testing.',
    requirements: [
      'Mahasiswa aktif semester 5-8 jurusan Teknik Elektro, Mekatronika, Teknik Mesin, atau Informatika.',
      'Memiliki motivasi tinggi untuk belajar di lingkungan manufaktur otomotif kelas dunia.',
      'Diberikan uang saku bulanan, sertifikat industri, dan prioritas rekrutmen karyawan tetap.',
    ],
    form_url: 'https://docs.google.com/forms/d/e/1FAIpQLScN_internship_recruitment_sample/viewform?usp=sf_link',
  },
];

// Helper to convert Google Form URL to embed iframe URL
function getGoogleFormEmbedUrl(url) {
  if (!url) return '';
  let cleanUrl = url.trim();
  cleanUrl = cleanUrl.replace(/\/edit(\?.*)?$/, '/viewform');
  if (cleanUrl.includes('docs.google.com/forms')) {
    if (cleanUrl.includes('embedded=true')) return cleanUrl;
    return cleanUrl.includes('?') ? `${cleanUrl}&embedded=true` : `${cleanUrl}?embedded=true`;
  }
  return cleanUrl;
}

// ════════════════════════════════════════════════════════════════════════════
// GOOGLE FORM EMBED MODAL COMPONENT
// ════════════════════════════════════════════════════════════════════════════
function GoogleFormModal({ job, isId, onClose }) {
  const [iframeLoading, setIframeLoading] = useState(true);

  if (!job) return null;

  const embedUrl = getGoogleFormEmbedUrl(job.form_url);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="career-modal-backdrop" onClick={onClose}>
      <div className="career-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="career-modal-header">
          <div className="career-modal-header__info">
            <div className="career-modal-header__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div>
              <h3 className="career-modal-header__title">{job.title}</h3>
              <span className="career-modal-header__badge">
                {job.category_name || job.deptLabel || 'Career'} • {job.location || 'Batam FTZ Plant'}
              </span>
            </div>
          </div>
          <div className="career-modal-header__actions">
            <a
              href={job.form_url}
              target="_blank"
              rel="noreferrer"
              className="career-modal-btn-link"
              title={isId ? 'Buka formulir di tab baru' : 'Open form in new tab'}
            >
              <span className="career-modal-btn-link-text">{isId ? 'Tab Baru' : 'New Tab'}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
            <button className="career-modal-close-btn" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        {/* <div className="career-modal-banner">
          <span>
            📋 <strong>{isId ? 'Formulir Calon Pekerja Online' : 'Online Candidate Form'}:</strong>{' '}
            {isId
              ? 'Lengkapi pendataan calon pekerja di bawah ini. Formulir ini terhubung langsung ke sistem HRD PT Global Philsonic Technologies.'
              : 'Complete your information below. This form connects directly to PT Global Philsonic Technologies HR system.'}
          </span>
        </div> */}

        {/* Body / Iframe */}
        <div className="career-modal-body">
          {iframeLoading && (
            <div className="career-modal-loader">
              <div className="career-modal-spinner" />
              <span>{isId ? 'Memuat Formulir Google Form...' : 'Loading Google Form...'}</span>
            </div>
          )}
          <iframe
            src={embedUrl}
            title={`Application Form - ${job.title}`}
            className="career-modal-iframe"
            onLoad={() => setIframeLoading(false)}
            loading="lazy"
          >
            {isId ? 'Memuat formulir pendaftaran...' : 'Loading application form...'}
          </iframe>
        </div>

        {/* Footer */}
        <div className="career-modal-footer">
          <div className="career-modal-footer-note">
            {isId
              ? 'Formulir Google Form tidak muncul sempurna?'
              : 'Google Form not displaying properly?'}{' '}
            <a href={job.form_url} target="_blank" rel="noreferrer">
              {isId ? 'Buka langsung di Google Form' : 'Open directly in Google Form'}
            </a>
          </div>
          <button className="career-modal-close-action" onClick={onClose}>
            {isId ? 'Tutup' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// JOB CARD COMPONENT : Expandable Accordion
// ════════════════════════════════════════════════════════════════════════════
function JobCard({ job, isId, isExpanded, onToggle, onApply }) {
  const emailSubject = encodeURIComponent(`[APPLICATION] - ${job.title}`);
  const emailBody = encodeURIComponent(
    `Halo Tim HR PT. Global Philsonic Technologies,\n\nSaya ingin melamar posisi ${job.title} di Batam Plant.\nTerlampir resume/CV saya.\n\nTerima kasih.`
  );

  // Helper to clean bullet points or mojibake (like ÔÇó)
  const sanitizeListItem = (text) => {
    if (!text) return '';
    return text
      .replace(/^(\s*ÔÇó|\s*•|\s*[\-\*])\s*/i, '')
      .replace(/ÔÇó/g, '')
      .replace(/•/g, '')
      .trim();
  };

  const displayTitle = !isId && job.title_en ? job.title_en : job.title;
  const displayDesc = !isId && job.description_en ? job.description_en : (job.description || job.desc);
  const rawRequirements = !isId && job.requirements_en ? job.requirements_en : job.requirements;
  const rawResponsibilities = !isId && job.responsibilities_en ? job.responsibilities_en : job.responsibilities;

  // Parse requirements to array
  const parsedRequirements = Array.isArray(rawRequirements)
    ? rawRequirements.map(sanitizeListItem).filter(Boolean)
    : typeof rawRequirements === 'string'
    ? rawRequirements
        .split('\n')
        .map(sanitizeListItem)
        .filter(Boolean)
    : [];

  // Parse responsibilities to array
  const parsedResponsibilities = Array.isArray(rawResponsibilities)
    ? rawResponsibilities.map(sanitizeListItem).filter(Boolean)
    : typeof rawResponsibilities === 'string'
    ? rawResponsibilities
        .split('\n')
        .map(sanitizeListItem)
        .filter(Boolean)
    : [];

  const hasGoogleForm =
    job.form_url &&
    (job.form_url.includes('docs.google.com/forms') || job.form_url.includes('forms.gle'));

  return (
    <div className={`career-job ${isExpanded ? 'career-job--expanded' : ''}`}>
      {/* Main row : clickable to expand */}
      <div className="career-job__main" onClick={onToggle}>
        <div className="career-job__left">
          <div className="career-job__dept">{job.category_name || job.deptLabel || 'Career'}</div>
          <h3 className="career-job__title">{displayTitle}</h3>
          <div className="career-job__meta">
            <span>{job.location || 'Batam FTZ Plant'}</span>
            <span>{job.employment_type || job.type || 'Full-time'}</span>
            <span>{job.experience || 'Sesuai Kualifikasi'}</span>
          </div>
        </div>
        <div className="career-job__right">
          <div className="career-job__expand-icon">
            <svg viewBox="0 0 16 16">
              <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="career-job__detail">
          <p className="career-job__desc">{displayDesc}</p>

          {parsedResponsibilities.length > 0 && (
            <>
              <h4 className="career-job__reqs-title">
                {isId ? 'Tanggung Jawab Utama' : 'Key Responsibilities'}
              </h4>
              <ul className="career-job__reqs">
                {parsedResponsibilities.map((resp, idx) => (
                  <li key={idx} className="career-job__req">{resp}</li>
                ))}
              </ul>
            </>
          )}

          {parsedRequirements.length > 0 && (
            <>
              <h4 className="career-job__reqs-title">
                {isId ? 'Kualifikasi & Persyaratan' : 'Qualifications & Requirements'}
              </h4>
              <ul className="career-job__reqs">
                {parsedRequirements.map((req, idx) => (
                  <li key={idx} className="career-job__req">{req}</li>
                ))}
              </ul>
            </>
          )}

          {/* Apply bar */}
          <div className="career-job__apply-bar">
            <div className="career-job__apply-info">
              <p>
                <strong>{isId ? 'Cara Melamar:' : 'How to Apply:'}</strong>{' '}
                {hasGoogleForm
                  ? isId
                    ? 'Klik tombol di samping untuk mengisi Formulir Pendaftaran Google Form resmi.'
                    : 'Click the button to fill out our official Google Form application.'
                  : job.form_url
                  ? isId
                    ? 'Pendaftaran dibuka secara daring via tautan formulir eksternal.'
                    : 'Apply online via external application link.'
                  : isId
                  ? `Kirimkan CV terbaru ke email HRD dengan subjek: [LAMARAN] - ${job.title}`
                  : `Send your updated resume with subject: [APPLICATION] - ${job.title}`}
              </p>
            </div>

            {hasGoogleForm ? (
              <button
                type="button"
                onClick={() => onApply(job)}
                className="career-btn career-btn--primary"
                title={isId ? 'Lamar Sekarang' : 'Apply Now'}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                {isId ? 'Lamar Sekarang' : 'Apply Now'}
              </button>
            ) : job.form_url ? (
              <a
                href={job.form_url}
                target="_blank"
                rel="noreferrer"
                className="career-btn career-btn--primary"
              >
                {isId ? 'Lamar Sekarang' : 'Apply Now'}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ) : (
              <a
                href={`mailto:hr@philsonic.co.id?subject=${emailSubject}&body=${emailBody}`}
                className="career-btn career-btn--primary"
              >
                {isId ? 'Lamar Sekarang' : 'Apply Now'}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN CAREER PAGE COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export default function CareerPage() {
  const { i18n } = useTranslation();
  const isId = i18n.language === 'id';

  const [jobs, setJobs] = useState(DEFAULT_JOB_OPENINGS);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch jobs & categories from database
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [jobsRes, catRes] = await Promise.allSettled([
          api.get('/public/jobs?limit=100'),
          api.get('/public/job-categories'),
        ]);

        if (isMounted) {
          if (jobsRes.status === 'fulfilled' && jobsRes.value?.data?.data) {
            const apiJobs = jobsRes.value.data.data;
            if (apiJobs.length > 0) {
              setJobs(apiJobs);
            }
          }

          if (catRes.status === 'fulfilled' && catRes.value?.data?.data) {
            setCategories(catRes.value.data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load career data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter category list
  const filterOptions = [
    { key: 'all', label: isId ? 'Semua Posisi' : 'All Positions' },
    ...categories.map((c) => ({
      key: String(c.id),
      label: c.name,
    })),
  ];

  // Filter jobs based on active tab
  const filteredJobs = jobs.filter((job) => {
    if (activeCategory === 'all') return true;
    // Match either by category_id or string category/dept
    if (job.category_id && String(job.category_id) === String(activeCategory)) return true;
    if (job.dept && job.dept === activeCategory) return true;
    return false;
  });

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="career-page">
      {/* ═══════ PAGE HEADER ═══════ */}
      <header className="career-header">
        <div className="career-header__grid-bg" aria-hidden="true" />
        <div className="career-header__glow" aria-hidden="true" />

        <div className="container career-header__content">
          <div className="career-breadcrumb">
            <Link to="/">{isId ? 'Beranda' : 'Home'}</Link>
            <span className="career-breadcrumb__sep">/</span>
            <span className="career-breadcrumb__current">{isId ? 'Karir' : 'Careers'}</span>
          </div>

          <h1 className="career-header__title">
            {isId
              ? 'Bergabung & Berkembang Bersama Kami'
              : 'Build Your Career With Us'}
          </h1>
          <p className="career-header__subtitle">
            {isId
              ? 'Kami membuka kesempatan bagi talenta engineering, profesional manufaktur, dan mahasiswa berbakat di Batam untuk berkarir di industri elektronik otomotif dan otomasi berstandar global.'
              : "We're hiring engineers, technicians, and interns passionate about precision electronics and industrial automation at our Batam FTZ plant."}
          </p>
        </div>
      </header>

      {/* ═══════ PERKS STRIP ═══════ */}
      <section className="career-perks">
        <div className="container">
          <div className="career-perks__grid">
            {PERKS.map((perk, i) => (
              <div key={i} className="career-perk">
                <div className="career-perk__title">{isId ? perk.titleId : perk.titleEn}</div>
                <p className="career-perk__desc">{isId ? perk.descId : perk.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ JOB BOARD ═══════ */}
      <section className="career-board">
        <div className="container">
          {/* Toolbar */}
          <div className="career-toolbar">
            <div className="career-toolbar__title">
              {isId ? 'Lowongan Tersedia' : 'Open Positions'}
              <span className="career-toolbar__count">{filteredJobs.length}</span>
            </div>
            <div className="career-filters">
              {filterOptions.map((f) => (
                <button
                  key={f.key}
                  className={`career-filter-btn ${activeCategory === f.key ? 'career-filter-btn--active' : ''}`}
                  onClick={() => {
                    setActiveCategory(f.key);
                    setExpandedId(null);
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Job List */}
          {isLoading ? (
            <div style={{ padding: '3rem 0', textAlign: 'center', color: '#94a3b8' }}>
              <div className="career-modal-spinner" style={{ margin: '0 auto 1rem' }} />
              <p>{isId ? 'Memuat daftar lowongan pekerjaan...' : 'Loading job vacancies...'}</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="career-jobs">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isId={isId}
                  isExpanded={expandedId === job.id}
                  onToggle={() => handleToggle(job.id)}
                  onApply={(selectedJob) => setApplyModalJob(selectedJob)}
                />
              ))}
            </div>
          ) : (
            <div className="career-empty">
              <div className="career-empty__title">
                {isId ? 'Belum ada lowongan untuk kategori ini' : 'No openings in this category'}
              </div>
              <p className="career-empty__desc">
                {isId
                  ? 'Coba pilih kategori lain atau kirim CV spekulatif ke email HR kami.'
                  : 'Try another category or send a speculative CV to our HR email.'}
              </p>
            </div>
          )}

          {/* ═══════ BOTTOM CTA ═══════ */}
          <div className="career-cta-bar">
            <div className="career-cta-bar__inner">
              <div className="career-cta-bar__text">
                <h3>{isId ? 'Tidak menemukan posisi yang cocok?' : "Don't see the right role?"}</h3>
                <p>
                  {isId
                    ? 'Kirimkan CV spekulatif Anda ke tim HR kami, kami selalu mencari talenta terbaik.'
                    : "Send a speculative CV to our HR team, we're always looking for great talent."}
                </p>
              </div>
              <div className="career-cta-bar__actions">
                <a
                  href="mailto:hr@philsonic.co.id?subject=[SPECULATIVE] - Open Application"
                  className="career-btn career-btn--primary"
                >
                  {isId ? 'Kirim CV' : 'Send CV'}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <Link to="/contact" className="career-btn career-btn--ghost">
                  {isId ? 'Hubungi Kami' : 'Contact Us'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ POPUP / MODAL GOOGLE FORM EMBED ═══════ */}
      {applyModalJob && (
        <GoogleFormModal
          job={applyModalJob}
          isId={isId}
          onClose={() => setApplyModalJob(null)}
        />
      )}
    </div>
  );
}
