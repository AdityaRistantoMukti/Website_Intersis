import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CareerPage.css';

const PERKS = [
  {
    icon: '🏥',
    titleId: 'Asuransi & Jaminan Penuh',
    titleEn: 'Comprehensive Healthcare',
    descId: 'BPJS Ketenagakerjaan & Kesehatan lengkap ditambah asuransi swasta rawat inap.',
    descEn: 'Full BPJS social security plus corporate private hospital inpatient insurance.'
  },
  {
    icon: '📜',
    titleId: 'Sertifikasi IPC & IATF',
    titleEn: 'IPC & IATF Certification',
    descId: 'Program pelatihan resmi IPC-A-610 Trainer/Specialist dan Six Sigma berbayar perusahaan.',
    descEn: 'Company-sponsored IPC-A-610 Trainer/Specialist and Six Sigma training tracks.'
  },
  {
    icon: '🏢',
    titleId: 'Fasilitas Lab & Cleanroom Ber-AC',
    titleEn: 'Modern ESD Cleanroom Facility',
    descId: 'Bekerja di lingkungan pabrik berteknologi tinggi dengan standar ESD terstandarisasi.',
    descEn: 'Work inside climate-controlled, state-of-the-art ISO Class 8 ESD facilities.'
  },
  {
    icon: '🎓',
    titleId: 'Magang Industri Bersertifikat',
    titleEn: 'Accredited Internship Program',
    descId: 'Uang saku kompetitif, bimbingan langsung engineer senior, dan peluang rekrutmen tetap.',
    descEn: 'Competitive allowance, direct senior engineer mentorship, and direct hire pathways.'
  }
];

const JOB_OPENINGS = [
  {
    id: 'smt-process-eng',
    dept: 'engineering',
    deptLabel: 'Engineering',
    title: 'Senior SMT Process Engineer',
    type: 'Full-time',
    location: 'Batam FTZ Plant',
    experience: 'Min 3-5 Years',
    desc: 'Lead solder paste printing optimization, reflow profile validation, and Yamaha YSM20R feeder setup to achieve zero-defect yields under IATF 16949 automotive standards.',
    requirements: [
      'Bachelor’s Degree in Electrical, Electronic, or Mechatronics Engineering.',
      'Minimum 3 years direct experience in high-speed SMT line process engineering.',
      'Proficiency in KIC thermal profiling, 3D SPI defect root-cause analysis, and IPC-A-610 Class 3 standards.',
      'Strong analytical mindset with Six Sigma Green Belt certification is an advantage.'
    ]
  },
  {
    id: 'automation-plc-eng',
    dept: 'automation',
    deptLabel: 'Automation & Jigs',
    title: 'Test Automation & PLC Programmer',
    type: 'Full-time',
    location: 'Batam FTZ Plant',
    experience: 'Min 2-4 Years',
    desc: 'Design, write firmware, and debug custom pneumatic test fixtures and functional test beds using Omron Sysmac, Mitsubishi PLC, and Python/LabVIEW instrumentation.',
    requirements: [
      'Diploma/Bachelor’s Degree in Mechatronics, Automation, or Computer Engineering.',
      'Proven experience in PLC ladder logic, ST programming, and pneumatic circuit schematics (Festo/SMC).',
      'Familiarity with Keysight / NI instrumentation and serial automotive buses (CAN, LIN, RS485).',
      'Demonstrated hands-on experience in assembling mechanical test nests and sensor integration.'
    ]
  },
  {
    id: 'qa-inspector-auto',
    dept: 'quality',
    deptLabel: 'Quality Assurance',
    title: 'Quality Assurance (QA) Engineer - Automotive',
    type: 'Full-time',
    location: 'Batam FTZ Plant',
    experience: 'Min 2 Years',
    desc: 'Oversee incoming, in-process, and outgoing PCBA quality gate inspections, X-ray BGA analysis, and manage non-conformance 8D corrective action reports for OEM clients.',
    requirements: [
      'Diploma or Bachelor’s in Industrial Engineering or Quality Management.',
      'Certified IPC-A-610 Specialist (CIS) strongly preferred.',
      'Experience handling 8D problem-solving reports and customer audit inspections.',
      'Fluency in English (written & spoken) for daily client reporting and documentation.'
    ]
  },
  {
    id: 'smt-shift-supervisor',
    dept: 'production',
    deptLabel: 'Production',
    title: 'SMT Production Shift Supervisor',
    type: 'Full-time',
    location: 'Batam FTZ Plant',
    experience: 'Min 3 Years',
    desc: 'Direct shift line operators, coordinate line changeovers, enforce 5S cleanroom disciplines, and ensure daily manufacturing targets and OEE KPIs are surpassed.',
    requirements: [
      'Minimum 3 years leadership experience in SMT or electronics manufacturing plant.',
      'Strong organizational leadership, shift scheduling, and ESD compliance enforcement.',
      'Willingness to work in rotating 3-shift schedules in Batam industrial zone.'
    ]
  },
  {
    id: 'cnc-tooling-tech',
    dept: 'automation',
    deptLabel: 'Tooling & Maintenance',
    title: 'CNC Tooling & Fixture Maintenance Technician',
    type: 'Full-time',
    location: 'Batam FTZ Plant',
    experience: 'Min 1-3 Years',
    desc: 'Operate Haas 4-axis CNC milling centers to fabricate custom Bakelite and POM-C test nests, perform preventative maintenance on pneumatic actuators and probe pins.',
    requirements: [
      'Vocational High School (SMK Mesin) or Diploma in Mechanical Machining / Tool & Die.',
      'Ability to read mechanical 2D/3D CAD drawings (SolidWorks / AutoCAD).',
      'Hands-on experience with CNC G-code programming and precision measurement tools (micrometer, calipers).'
    ]
  },
  {
    id: 'intern-eng-2026',
    dept: 'internship',
    deptLabel: 'Internship / Magang',
    title: 'Engineering & IoT Smart Factory Internship (Magang 6 Bulan)',
    type: 'Internship (Paid)',
    location: 'Batam FTZ Plant',
    experience: 'Mahasiswa Tingkat Akhir',
    desc: 'Program magang terstruktur 6 bulan untuk mahasiswa Politeknik / Universitas dalam bidang SMT Process, MES Industry 4.0 Telemetry, atau Embedded Firmware Testing.',
    requirements: [
      'Mahasiswa aktif semester 5-8 jurusan Teknik Elektro, Mekatronika, Teknik Mesin, atau Informatika.',
      'Memiliki motivasi tinggi untuk belajar langsung di lingkungan manufaktur otomotif kelas dunia.',
      'Diberikan uang saku bulanan, sertifikat resmi industri, dan prioritas rekrutmen karyawan tetap setelah lulus.'
    ]
  }
];

export default function CareerPage() {
  const { i18n } = useTranslation();
  const isId = i18n.language === 'id';
  const [activeDept, setActiveDept] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);

  const deptFilters = [
    { key: 'all', label: isId ? 'Semua Posisi' : 'All Roles' },
    { key: 'engineering', label: 'Engineering' },
    { key: 'automation', label: isId ? 'Otomasi & Tooling' : 'Automation & Tooling' },
    { key: 'quality', label: 'QA / QC' },
    { key: 'production', label: isId ? 'Produksi' : 'Production' },
    { key: 'internship', label: isId ? 'Program Magang' : 'Internship (OJT)' }
  ];

  const filteredJobs = activeDept === 'all'
    ? JOB_OPENINGS
    : JOB_OPENINGS.filter(j => j.dept === activeDept);

  return (
    <div className="career-page">
      {/* ── HEADER / BREADCRUMB ── */}
      <header className="career-page-header">
        <div className="container">
          <div className="prod-breadcrumb">
            <Link to="/">{isId ? 'Beranda' : 'Home'}</Link>
            <span>/</span>
            <span className="prod-breadcrumb--active">{isId ? 'Karir' : 'Career'}</span>
          </div>
          <div className="career-header-intro">
            <h1 className="career-header-title">
              {isId ? 'Bergabung & Berkembang Bersama PT. Global Philsonic Technologies' : 'Build Your Career at PT. Global Philsonic Technologies'}
            </h1>
            <p className="career-header-sub">
              {isId
                ? 'Kami membuka kesempatan bagi talenta rekayasa, profesional manufaktur, dan mahasiswa berbakat di Batam untuk berkarir di industri manufaktur elektronik otomotif dan otomasi berstandar global.'
                : 'Join our world-class engineering team in Batam Free Trade Zone. We are actively hiring engineers, technicians, and enthusiastic interns passionate about precision electronics and industrial automation.'}
            </p>
          </div>
        </div>
      </header>

      {/* ── PERKS / WHY JOIN US ── */}
      <section className="career-perks-section">
        <div className="container">
          <div className="career-perks-grid">
            {PERKS.map((perk, i) => (
              <div key={i} className="career-perk-card">
                <div className="career-perk-icon">{perk.icon}</div>
                <h4>{isId ? perk.titleId : perk.titleEn}</h4>
                <p>{isId ? perk.descId : perk.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOB BOARD SECTION ── */}
      <section className="career-jobs-section">
        <div className="container">
          <div className="career-toolbar">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {isId ? 'Lowongan Tersedia di Batam Plant' : 'Current Job Openings at Batam Plant'}
            </h2>
            <div className="career-filter-bar">
              {deptFilters.map(tab => (
                <button
                  key={tab.key}
                  className={`career-filter-pill ${activeDept === tab.key ? 'career-filter-pill--active' : ''}`}
                  onClick={() => setActiveDept(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Job List */}
          <div className="career-jobs-list">
            {filteredJobs.map(job => (
              <div key={job.id} className="career-job-card">
                <div className="career-job-info">
                  <span className="career-job-dept">{job.deptLabel}</span>
                  <h3 className="career-job-title">{job.title}</h3>
                  <p className="career-job-desc">{job.desc}</p>
                  <div className="career-job-tags">
                    <span className="career-job-tag">📍 {job.location}</span>
                    <span className="career-job-tag">💼 {job.type}</span>
                    <span className="career-job-tag">⏳ {job.experience}</span>
                  </div>
                </div>
                <div className="career-job-action">
                  <button
                    className="career-apply-btn"
                    onClick={() => setSelectedJob(job)}
                  >
                    {isId ? 'Lihat & Lamar' : 'View & Apply'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOB DETAIL & APPLY MODAL ── */}
      {selectedJob && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setSelectedJob(null)}
        >
          <div
            style={{
              background: 'var(--navy-card, #0f172a)',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: '16px',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--teal, #00897b)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {selectedJob.deptLabel}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>{selectedJob.title}</h3>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '0.8rem', color: '#94a3b8' }}>
                  <span>📍 {selectedJob.location}</span>
                  <span>•</span>
                  <span>💼 {selectedJob.type}</span>
                  <span>•</span>
                  <span>⏳ {selectedJob.experience}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {selectedJob.desc}
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                {isId ? 'Kualifikasi & Persyaratan:' : 'Key Qualifications & Requirements:'}
              </h4>
              <ul style={{ paddingLeft: '1.25rem', color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.7 }}>
                {selectedJob.requirements.map((req, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{req}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: '#0b1320', padding: '1.25rem', borderRadius: '10px', border: '1px solid #1e293b', marginBottom: '1.5rem' }}>
              <h5 style={{ fontSize: '0.85rem', color: '#ffffff', marginBottom: '0.4rem' }}>
                {isId ? 'Cara Melamar:' : 'How to Apply:'}
              </h5>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                {isId
                  ? 'Kirimkan CV terbaru dan portofolio Anda ke email HRD kami di bawah dengan subjek format: [LAMARAN] - ' + selectedJob.title
                  : 'Submit your updated resume and credentials to our HR recruitment inbox with subject: [APPLICATION] - ' + selectedJob.title}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href={`mailto:hr@philsonic.co.id?subject=${encodeURIComponent(`[APPLICATION] - ${selectedJob.title}`)}&body=${encodeURIComponent(`Halo Tim HR PT. Global Philsonic Technologies,\n\nSaya ingin melamar posisi ${selectedJob.title} di Batam Plant.\nTerlampir resume/CV saya.\n\nTerima kasih.`)}`}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'var(--teal, #00897b)',
                  color: '#ffffff',
                  textAlign: 'center',
                  fontWeight: 700,
                  textDecoration: 'none',
                  fontSize: '0.9rem'
                }}
              >
                ✉️ {isId ? 'Kirim Lamaran via Email HR' : 'Send Application via Email'}
              </a>
              <button
                onClick={() => setSelectedJob(null)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '8px',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  border: '1px solid #334155',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {isId ? 'Tutup' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
