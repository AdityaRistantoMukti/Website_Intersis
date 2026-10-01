import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CareerPage.css';

// ════════════════════════════════════════════════════════════════════════════
// DATA
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

const JOB_OPENINGS = [
  {
    id: 'smt-process-eng',
    dept: 'engineering',
    deptLabel: 'Engineering',
    title: 'Senior SMT Process Engineer',
    type: 'Full-time',
    location: 'Batam FTZ Plant',
    experience: '3-5 Years',
    desc: 'Lead solder paste printing optimization, reflow profile validation, and Yamaha YSM20R feeder setup to achieve zero-defect yields under IATF 16949 automotive standards.',
    requirements: [
      'Bachelor\'s Degree in Electrical, Electronic, or Mechatronics Engineering.',
      'Minimum 3 years direct experience in high-speed SMT line process engineering.',
      'Proficiency in KIC thermal profiling, 3D SPI defect root-cause analysis, and IPC-A-610 Class 3 standards.',
      'Strong analytical mindset with Six Sigma Green Belt certification is an advantage.',
    ],
  },
  {
    id: 'automation-plc-eng',
    dept: 'automation',
    deptLabel: 'Automation & Jigs',
    title: 'Test Automation & PLC Programmer',
    type: 'Full-time',
    location: 'Batam FTZ Plant',
    experience: '2-4 Years',
    desc: 'Design, write firmware, and debug custom pneumatic test fixtures and functional test beds using Omron Sysmac, Mitsubishi PLC, and Python/LabVIEW instrumentation.',
    requirements: [
      'Diploma/Bachelor\'s Degree in Mechatronics, Automation, or Computer Engineering.',
      'Proven experience in PLC ladder logic, ST programming, and pneumatic circuit schematics (Festo/SMC).',
      'Familiarity with Keysight / NI instrumentation and serial automotive buses (CAN, LIN, RS485).',
      'Demonstrated hands-on experience in assembling mechanical test nests and sensor integration.',
    ],
  },
  {
    id: 'qa-inspector-auto',
    dept: 'quality',
    deptLabel: 'Quality Assurance',
    title: 'QA Engineer - Automotive',
    type: 'Full-time',
    location: 'Batam FTZ Plant',
    experience: '2+ Years',
    desc: 'Oversee incoming, in-process, and outgoing PCBA quality gate inspections, X-ray BGA analysis, and manage non-conformance 8D corrective action reports for OEM clients.',
    requirements: [
      'Diploma or Bachelor\'s in Industrial Engineering or Quality Management.',
      'Certified IPC-A-610 Specialist (CIS) strongly preferred.',
      'Experience handling 8D problem-solving reports and customer audit inspections.',
      'Fluency in English (written & spoken) for daily client reporting.',
    ],
  },
  {
    id: 'smt-shift-supervisor',
    dept: 'production',
    deptLabel: 'Production',
    title: 'SMT Production Shift Supervisor',
    type: 'Full-time',
    location: 'Batam FTZ Plant',
    experience: '3+ Years',
    desc: 'Direct shift line operators, coordinate line changeovers, enforce 5S cleanroom disciplines, and ensure daily manufacturing targets and OEE KPIs are surpassed.',
    requirements: [
      'Minimum 3 years leadership experience in SMT or electronics manufacturing plant.',
      'Strong organizational leadership, shift scheduling, and ESD compliance enforcement.',
      'Willingness to work in rotating 3-shift schedules in Batam industrial zone.',
    ],
  },
  {
    id: 'cnc-tooling-tech',
    dept: 'automation',
    deptLabel: 'Tooling & Maintenance',
    title: 'CNC Tooling & Fixture Technician',
    type: 'Full-time',
    location: 'Batam FTZ Plant',
    experience: '1-3 Years',
    desc: 'Operate Haas 4-axis CNC milling centers to fabricate custom Bakelite and POM-C test nests, perform preventative maintenance on pneumatic actuators and probe pins.',
    requirements: [
      'Vocational High School (SMK Mesin) or Diploma in Mechanical Machining / Tool & Die.',
      'Ability to read mechanical 2D/3D CAD drawings (SolidWorks / AutoCAD).',
      'Hands-on experience with CNC G-code programming and precision measurement tools.',
    ],
  },
  {
    id: 'intern-eng-2026',
    dept: 'internship',
    deptLabel: 'Internship',
    title: 'Engineering & IoT Smart Factory Internship (6 Bulan)',
    type: 'Internship (Paid)',
    location: 'Batam FTZ Plant',
    experience: 'Mahasiswa Tingkat Akhir',
    desc: 'Program magang terstruktur 6 bulan untuk mahasiswa Politeknik / Universitas dalam bidang SMT Process, MES Industry 4.0 Telemetry, atau Embedded Firmware Testing.',
    requirements: [
      'Mahasiswa aktif semester 5-8 jurusan Teknik Elektro, Mekatronika, Teknik Mesin, atau Informatika.',
      'Memiliki motivasi tinggi untuk belajar di lingkungan manufaktur otomotif kelas dunia.',
      'Diberikan uang saku bulanan, sertifikat industri, dan prioritas rekrutmen karyawan tetap.',
    ],
  },
];

const DEPT_FILTERS = [
  { key: 'all', labelId: 'Semua', labelEn: 'All' },
  { key: 'engineering', labelId: 'Engineering', labelEn: 'Engineering' },
  { key: 'automation', labelId: 'Otomasi & Tooling', labelEn: 'Automation & Tooling' },
  { key: 'quality', labelId: 'QA / QC', labelEn: 'QA / QC' },
  { key: 'production', labelId: 'Produksi', labelEn: 'Production' },
  { key: 'internship', labelId: 'Magang', labelEn: 'Internship' },
];

// ════════════════════════════════════════════════════════════════════════════
// JOB CARD COMPONENT — Expandable Accordion
// ════════════════════════════════════════════════════════════════════════════
function JobCard({ job, isId, isExpanded, onToggle }) {
  const emailSubject = encodeURIComponent(`[APPLICATION] - ${job.title}`);
  const emailBody = encodeURIComponent(
    `Halo Tim HR PT. Global Philsonic Technologies,\n\nSaya ingin melamar posisi ${job.title} di Batam Plant.\nTerlampir resume/CV saya.\n\nTerima kasih.`
  );

  return (
    <div className={`career-job ${isExpanded ? 'career-job--expanded' : ''}`}>
      {/* Main row — clickable to expand */}
      <div className="career-job__main" onClick={onToggle}>
        <div className="career-job__left">
          <div className="career-job__dept">{job.deptLabel}</div>
          <h3 className="career-job__title">{job.title}</h3>
          <div className="career-job__meta">
            <span>{job.location}</span>
            <span>{job.type}</span>
            <span>{job.experience}</span>
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
          <p className="career-job__desc">{job.desc}</p>

          <h4 className="career-job__reqs-title">
            {isId ? 'Kualifikasi & Persyaratan' : 'Qualifications & Requirements'}
          </h4>
          <ul className="career-job__reqs">
            {job.requirements.map((req, idx) => (
              <li key={idx} className="career-job__req">{req}</li>
            ))}
          </ul>

          {/* Apply bar */}
          <div className="career-job__apply-bar">
            <div className="career-job__apply-info">
              <p>
                <strong>{isId ? 'Cara Melamar:' : 'How to Apply:'}</strong>{' '}
                {isId
                  ? `Kirimkan CV terbaru ke email HRD dengan subjek: [LAMARAN] - ${job.title}`
                  : `Send your updated resume with subject: [APPLICATION] - ${job.title}`}
              </p>
            </div>
            <a
              href={`mailto:hr@philsonic.co.id?subject=${emailSubject}&body=${emailBody}`}
              className="career-btn career-btn--primary"
            >
              {isId ? 'Kirim Lamaran' : 'Apply Now'}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════
export default function CareerPage() {
  const { i18n } = useTranslation();
  const isId = i18n.language === 'id';
  const [activeDept, setActiveDept] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filteredJobs =
    activeDept === 'all'
      ? JOB_OPENINGS
      : JOB_OPENINGS.filter((j) => j.dept === activeDept);

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
          <nav className="career-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{isId ? 'Beranda' : 'Home'}</Link>
            <span className="career-breadcrumb__sep">/</span>
            <span className="career-breadcrumb__current">{isId ? 'Karir' : 'Career'}</span>
          </nav>

          <h1 className="career-header__title">
            {isId
              ? 'Bergabung & Berkembang Bersama Kami'
              : 'Build Your Career With Us'}
          </h1>
          <p className="career-header__subtitle">
            {isId
              ? 'Kami membuka kesempatan bagi talenta engineering, profesional manufaktur, dan mahasiswa berbakat di Batam untuk berkarir di industri elektronik otomotif dan otomasi berstandar global.'
              : 'We\'re hiring engineers, technicians, and interns passionate about precision electronics and industrial automation at our Batam FTZ plant.'}
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
              {DEPT_FILTERS.map((f) => (
                <button
                  key={f.key}
                  className={`career-filter-btn ${activeDept === f.key ? 'career-filter-btn--active' : ''}`}
                  onClick={() => { setActiveDept(f.key); setExpandedId(null); }}
                >
                  {isId ? f.labelId : f.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Job List */}
          {filteredJobs.length > 0 ? (
            <div className="career-jobs">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isId={isId}
                  isExpanded={expandedId === job.id}
                  onToggle={() => handleToggle(job.id)}
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
                <h3>{isId ? 'Tidak menemukan posisi yang cocok?' : 'Don\'t see the right role?'}</h3>
                <p>
                  {isId
                    ? 'Kirimkan CV spekulatif Anda ke tim HR kami — kami selalu mencari talenta terbaik.'
                    : 'Send a speculative CV to our HR team — we\'re always looking for great talent.'}
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

    </div>
  );
}
