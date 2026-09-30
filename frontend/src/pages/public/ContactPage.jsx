import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ContactPage.css';

export default function ContactPage() {
  const { i18n } = useTranslation();
  const isId = i18n.language === 'id';

  const [formData, setFormData] = useState({
    fullName: '',
    corporateEmail: '',
    companyName: '',
    phone: '',
    inquiryType: 'smt-pcba',
    volume: 'pilot',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      {/* ── HEADER / BREADCRUMB ── */}
      <header className="contact-page-header">
        <div className="container">
          <div className="prod-breadcrumb">
            <Link to="/">{isId ? 'Beranda' : 'Home'}</Link>
            <span>/</span>
            <span className="prod-breadcrumb--active">{isId ? 'Kontak' : 'Contact'}</span>
          </div>
          <div className="contact-header-intro">
            <h1 className="contact-header-title">
              {isId ? 'Hubungi PT. Global Philsonic Technologies' : 'Contact PT. Global Philsonic Technologies'}
            </h1>
            <p className="contact-header-sub">
              {isId
                ? 'Konsultasikan kebutuhan perakitan PCBA, pembuatan mesin uji otomatis (test jigs), atau jadwalkan factory audit di fasilitas manufaktur Batam FTZ kami.'
                : 'Connect with our engineering sales team for PCBA turnkey assembly, custom automated test jigs, or schedule a formal factory audit at our Batam FTZ manufacturing facility.'}
            </p>
          </div>
        </div>
      </header>

      {/* ── MAIN SECTION: 2-COLUMN LAYOUT ── */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-layout">

            {/* ── LEFT COLUMN: PLANT PRESENCE & DETAILS ── */}
            <div className="contact-info-card">
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-color, #0f172a)' }}>
                {isId ? 'Kantor Pabrik Batam FTZ' : 'Batam FTZ Plant Information'}
              </h2>

              <div className="contact-detail-block">
                <div className="contact-detail-icon">🏭</div>
                <div className="contact-detail-content">
                  <h4>{isId ? 'Alamat Fasilitas Pabrik' : 'Manufacturing Plant Address'}</h4>
                  <p>
                    PT. Global Philsonic Technologies<br />
                    Cammo Industrial Park Blok B No. 8-10, Batam Center<br />
                    Pulau Batam, Kepulauan Riau 29433, Indonesia
                  </p>
                </div>
              </div>

              <div className="contact-detail-block">
                <div className="contact-detail-icon">📞</div>
                <div className="contact-detail-content">
                  <h4>{isId ? 'Telepon & Direct WhatsApp' : 'Direct Phone & WhatsApp'}</h4>
                  <p>
                    <strong>Office:</strong> +62 778 468 899<br />
                    <strong>WhatsApp RFQ:</strong> <a href="https://wa.me/628117700899" target="_blank" rel="noreferrer">+62 811-7700-899</a>
                  </p>
                </div>
              </div>

              <div className="contact-detail-block">
                <div className="contact-detail-icon">✉️</div>
                <div className="contact-detail-content">
                  <h4>{isId ? 'Email Departemen' : 'Departmental Inboxes'}</h4>
                  <p>
                    <strong>Engineering & RFQ:</strong> <a href="mailto:rfq@philsonic.co.id">rfq@philsonic.co.id</a><br />
                    <strong>B2B Account Sales:</strong> <a href="mailto:sales@philsonic.co.id">sales@philsonic.co.id</a><br />
                    <strong>HR & Recruitment:</strong> <a href="mailto:hr@philsonic.co.id">hr@philsonic.co.id</a>
                  </p>
                </div>
              </div>

              <div className="contact-detail-block">
                <div className="contact-detail-icon">⏱️</div>
                <div className="contact-detail-content">
                  <h4>{isId ? 'Jam Kerja & Operasional' : 'Operating Hours'}</h4>
                  <p>
                    <strong>Engineering & Kantor:</strong> Senin - Jumat, 08:00 - 17:00 WIB<br />
                    <strong>Lini Produksi SMT:</strong> 24/7 (3 Shift Berkelanjutan)
                  </p>
                </div>
              </div>

              {/* Batam Logistics Strategic Map Box */}
              <div className="contact-map-box">
                <span className="contact-map-badge">🚢 Strategic Trade Route</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Batam Free Trade Zone (FTZ) Advantage
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 1rem' }}>
                  45 Menit perjalanan feri / kargo cepat ke Pelabuhan Internasional Singapura. Bebas bea masuk bahan baku (0% Import Duty) & Certificate of Origin (C/O) Indonesia.
                </p>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: '#2dd4bf' }}>
                  <span>✓ 0% Import Tariff</span>
                  <span>•</span>
                  <span>✓ Direct Singapore Feeder</span>
                  <span>•</span>
                  <span>✓ Bonded Warehouse</span>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: B2B RFQ / INQUIRY FORM ── */}
            <div className="contact-form-card">
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-color, #0f172a)' }}>
                {isId ? 'Formulir Permintaan Penawaran (RFQ)' : 'Request For Quotation (RFQ) Form'}
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                {isId
                  ? 'Kirimkan rincian spesifikasi teknis proyek Anda. Tim teknik kami akan merespons dalam waktu 1x24 jam kerja.'
                  : 'Submit your project requirements. Our application engineering team will review your specifications within 24 business hours.'}
              </p>

              {submitted ? (
                <div style={{
                  marginTop: '2rem',
                  padding: '2rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid #10b981',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', marginBottom: '0.5rem' }}>
                    {isId ? 'Permintaan Penawaran Terkirim!' : 'Inquiry Successfully Submitted!'}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {isId
                      ? `Terima kasih, Bapak/Ibu ${formData.fullName} dari ${formData.companyName || 'perusahaan Anda'}. Proposal teknis dan estimasi biaya awal akan segera kami proses.`
                      : `Thank you, ${formData.fullName} from ${formData.companyName || 'your company'}. Our engineering team is currently assessing your project parameters.`}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <a
                      href={`https://wa.me/628117700899?text=${encodeURIComponent(`Halo Sales PT. Global Philsonic Technologies, saya telah mengirimkan form RFQ di website atas nama ${formData.fullName} (${formData.companyName}). Mohon dapat ditindaklanjuti.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '10px 18px',
                        borderRadius: '8px',
                        background: '#25D366',
                        color: '#ffffff',
                        fontWeight: 700,
                        textDecoration: 'none',
                        fontSize: '0.875rem'
                      }}
                    >
                      💬 WhatsApp Fast-Track Follow Up
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '8px',
                        background: 'transparent',
                        border: '1px solid #cbd5e1',
                        color: 'inherit',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      {isId ? 'Kirim RFQ Lain' : 'Submit Another RFQ'}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form-grid">
                  <div>
                    <label className="contact-label">{isId ? 'Nama Lengkap *' : 'Full Name *'}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      className="contact-input"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="contact-label">{isId ? 'Email Korporat *' : 'Corporate Email *'}</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@automotive-client.com"
                      className="contact-input"
                      value={formData.corporateEmail}
                      onChange={e => setFormData({ ...formData, corporateEmail: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="contact-label">{isId ? 'Perusahaan / Organisasi *' : 'Company Name *'}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PT. Global Mobility Solutions"
                      className="contact-input"
                      value={formData.companyName}
                      onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="contact-label">{isId ? 'Nomor Telepon / WA *' : 'Phone / WhatsApp *'}</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +62 812-3456-7890"
                      className="contact-input"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="contact-label">{isId ? 'Kategori Kebutuhan' : 'Inquiry Scope'}</label>
                    <select
                      className="contact-select"
                      value={formData.inquiryType}
                      onChange={e => setFormData({ ...formData, inquiryType: e.target.value })}
                    >
                      <option value="smt-pcba">SMT PCBA High-Volume Assembly</option>
                      <option value="test-jigs">Custom ICT / FCT / EOL Test Jigs</option>
                      <option value="box-build">Turnkey Box-Build & Final Enclosure</option>
                      <option value="conformal-coating">Robotic Conformal Coating & Potting</option>
                      <option value="plant-audit">Factory Audit / Client Visit Request</option>
                      <option value="other">Other Technical Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="contact-label">{isId ? 'Estimasi Volume Batch' : 'Target Production Volume'}</label>
                    <select
                      className="contact-select"
                      value={formData.volume}
                      onChange={e => setFormData({ ...formData, volume: e.target.value })}
                    >
                      <option value="proto">Prototype / NPI (&lt; 500 pcs)</option>
                      <option value="pilot">Pilot Run (500 - 5,000 pcs)</option>
                      <option value="mass">Mass Production (&gt; 10,000 pcs / month)</option>
                      <option value="custom">Automation Machine / Custom Fixtures</option>
                    </select>
                  </div>

                  <div className="contact-field-full">
                    <label className="contact-label">{isId ? 'Ringkasan Kebutuhan Proyek' : 'Project Specifications / BOM Details'}</label>
                    <textarea
                      rows={4}
                      className="contact-textarea"
                      placeholder={isId ? 'Jelaskan jumlah layer PCB, standar sertifikasi yang dibutuhkan (IATF/ISO), lead time yang diharapkan, atau spesifikasi fixture uji...' : 'Describe board dimensions, layer count, component density (0201/BGA), target SOP date, or fixture test coverage...'}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className="contact-field-full">
                    <button type="submit" className="contact-submit-btn">
                      {isId ? 'Kirim Permintaan RFQ' : 'Submit Engineering RFQ'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
