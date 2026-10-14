import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useContact, useSiteSettings } from '../../hooks/useApi';
import { getLocalizedData } from '../../lib/translator';
import api from '../../lib/api';
import ContactGoogleMap from '../../components/contact/ContactGoogleMap';
import { CheckCircle2, MessageCircle, Building2, Phone, Mail, Clock } from 'lucide-react';
import './ContactPage.css';

const INQUIRY_OPTIONS = {
  'smt-pcba': { id: 'SMT PCBA High-Volume Assembly', en: 'SMT PCBA High-Volume Assembly' },
  'test-jigs': { id: 'Custom ICT / FCT / EOL Test Jigs', en: 'Custom ICT / FCT / EOL Test Jigs' },
  'box-build': { id: 'Turnkey Box-Build & Final Enclosure', en: 'Turnkey Box-Build & Final Enclosure' },
  'conformal-coating': { id: 'Robotic Conformal Coating & Potting', en: 'Robotic Conformal Coating & Potting' },
  'plant-audit': { id: 'Factory Audit / Client Visit Request', en: 'Factory Audit / Client Visit Request' },
  'other': { id: 'Kebutuhan Teknis Lainnya', en: 'Other Technical Inquiry' },
};

const VOLUME_OPTIONS = {
  proto: { id: 'Prototype / NPI (< 500 pcs)', en: 'Prototype / NPI (< 500 pcs)' },
  pilot: { id: 'Pilot Run (500 - 5.000 pcs)', en: 'Pilot Run (500 - 5,000 pcs)' },
  mass: { id: 'Produksi Massal (> 10.000 pcs / bulan)', en: 'Mass Production (> 10,000 pcs / month)' },
  custom: { id: 'Mesin Otomasi / Fixture Khusus', en: 'Automation Machine / Custom Fixtures' },
};

export default function ContactPage() {
  const { i18n } = useTranslation();
  const isId = i18n.language === 'id';
  const lang = isId ? 'id' : 'en';

  const [searchParams] = useSearchParams();
  const skuParam = searchParams.get('sku');

  const { data: contact } = useContact();
  const { data: rawHeaderSettings } = useSiteSettings('contact_header');
  const headerSettings = getLocalizedData(rawHeaderSettings, lang);

  const [formData, setFormData] = useState({
    fullName: '',
    corporateEmail: '',
    companyName: '',
    phone: '',
    inquiryType: 'smt-pcba',
    volume: 'pilot',
    fax_number: '', // Honeypot field for bot detection
    message: skuParam
      ? (isId ? `Permintaan penawaran spesifikasi untuk model produk: ${skuParam}` : `Inquiry for product model SKU: ${skuParam}`)
      : ''
  });

  useEffect(() => {
    if (skuParam && !formData.message) {
      setFormData(prev => ({
        ...prev,
        message: isId ? `Permintaan penawaran spesifikasi untuk model produk: ${skuParam}` : `Inquiry for product model SKU: ${skuParam}`
      }));
    }
  }, [skuParam, isId]);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);

  const cleanPhone = (contact?.whatsapp || contact?.whatsapp_number || '+628117700888').replace(/[^0-9]/g, '');

  const buildWhatsAppMessage = () => {
    const compName = contact?.company_name || 'PT. Global Philsonic Technologies';
    const inquiryLabel = INQUIRY_OPTIONS[formData.inquiryType]?.[lang] || formData.inquiryType;
    const volumeLabel = VOLUME_OPTIONS[formData.volume]?.[lang] || formData.volume;
    const msgDetails = formData.message?.trim() || '-';

    const textLines = isId ? [
      `Halo Tim Sales & Engineering ${compName},`,
      '',
      `Saya telah mengisi formulir Permintaan Penawaran (RFQ) melalui website:`,
      `• Nama Lengkap: ${formData.fullName.trim() || '-'}`,
      `• Perusahaan: ${formData.companyName.trim() || '-'}`,
      `• Email Korporat: ${formData.corporateEmail.trim() || '-'}`,
      `• Nomor Telepon / WA: ${formData.phone.trim() || '-'}`,
      `• Kategori Kebutuhan: ${inquiryLabel}`,
      `• Estimasi Volume: ${volumeLabel}`,
      `• Rincian Kebutuhan / Pesan:`,
      `${msgDetails}`,
      '',
      `Mohon informasi penawaran dan tindak lanjut dari tim Engineering. Terima kasih.`
    ] : [
      `Hello Sales & Engineering Team ${compName},`,
      '',
      `I have submitted an official RFQ inquiry through the website:`,
      `• Full Name: ${formData.fullName.trim() || '-'}`,
      `• Company: ${formData.companyName.trim() || '-'}`,
      `• Corporate Email: ${formData.corporateEmail.trim() || '-'}`,
      `• Phone / WhatsApp: ${formData.phone.trim() || '-'}`,
      `• Inquiry Scope: ${inquiryLabel}`,
      `• Target Volume: ${volumeLabel}`,
      `• Project Specifications / Message:`,
      `${msgDetails}`,
      '',
      `Please review and follow up with our technical inquiry. Thank you.`
    ];

    return textLines.join('\n');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validate phone number digits length
    const phoneDigits = (formData.phone || '').replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 16) {
      setFormError(
        isId
          ? 'Mohon masukkan nomor telepon atau WhatsApp yang valid (minimal 9 digit angka).'
          : 'Please provide a valid phone or WhatsApp number (minimum 9 digits).'
      );
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/public/rfq', formData);
    } catch (err) {
      console.warn('Could not record RFQ to database:', err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
      // Direct redirect / open WhatsApp with all filled details included
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
      window.open(waUrl, '_blank');
    }
  };

  const displayAddress = !isId ? (contact?.address_en || contact?.address) : contact?.address;

  return (
    <div className="contact-page">
      <Helmet>
        <title>
          {isId
            ? 'Kontak & Permintaan RFQ | PT. Global Philsonic Technologies'
            : 'Contact & RFQ Inquiries | PT. Global Philsonic Technologies'}
        </title>
        <meta
          name="description"
          content={
            isId
              ? 'Hubungi tim engineering sales PT. Global Philsonic Technologies untuk konsultasi perakitan PCBA, otomasi manufaktur, atau jadwalkan audit fasilitas Batam FTZ.'
              : 'Contact PT. Global Philsonic Technologies engineering team for turnkey PCBA assembly, automation manufacturing, or schedule a Batam FTZ audit.'
          }
        />
      </Helmet>

      {/* ═══════ PAGE HEADER : Clean Minimalist Theme ═══════ */}
      <header className="contact-page-header">
        <div className="contact-page-header__grid-bg" aria-hidden="true" />

        <div className="container contact-page-header__content">
          <h1 className="contact-page-header__title">
            {headerSettings?.title || (isId ? `Hubungi ${contact?.company_name || 'PT. Global Philsonic Technologies'}` : `Contact ${contact?.company_name || 'PT. Global Philsonic Technologies'}`)}
          </h1>
          <p className="contact-page-header__subtitle">
            {headerSettings?.subtitle || (isId
              ? 'Konsultasikan kebutuhan perakitan PCBA, pembuatan mesin uji otomatis (test jigs), atau jadwalkan factory audit di fasilitas manufaktur Batam FTZ kami.'
              : 'Connect with our engineering sales team for PCBA turnkey assembly, custom automated test jigs, or schedule a formal factory audit at our Batam FTZ manufacturing facility.')}
          </p>
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
                <div className="contact-detail-icon">
                  <Building2 size={18} strokeWidth={2} />
                </div>
                <div className="contact-detail-content">
                  <h4>{isId ? 'Alamat Fasilitas Pabrik' : 'Manufacturing Plant Address'}</h4>
                  <p style={{ whiteSpace: 'pre-line' }}>
                    <strong>{contact?.company_name || 'PT. Global Philsonic Technologies'}</strong><br />
                    {displayAddress || 'Batam Industrial Park, Mukakuning, Batam Free Trade Zone, Kepulauan Riau 29433, Indonesia'}
                  </p>
                </div>
              </div>

              <div className="contact-detail-block">
                <div className="contact-detail-icon">
                  <Phone size={18} strokeWidth={2} />
                </div>
                <div className="contact-detail-content">
                  <h4>{isId ? 'Telepon & Direct WhatsApp' : 'Direct Phone & WhatsApp'}</h4>
                  <p>
                    <strong>Office:</strong> {contact?.phone || '+62 778 468 899'}<br />
                    <strong>WhatsApp RFQ:</strong>{' '}
                    <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noreferrer">
                      {contact?.whatsapp || contact?.whatsapp_number || '+62 811-7700-888'}
                    </a>
                  </p>
                </div>
              </div>

              <div className="contact-detail-block">
                <div className="contact-detail-icon">
                  <Mail size={18} strokeWidth={2} />
                </div>
                <div className="contact-detail-content">
                  <h4>{isId ? 'Email Departemen' : 'Departmental Inboxes'}</h4>
                  <p>
                    <strong>Corporate & Sales:</strong>{' '}
                    <a href={`mailto:${contact?.email || 'sales@philsonic.co.id'}`}>{contact?.email || 'sales@philsonic.co.id'}</a><br />
                    <strong>HR & Recruitment:</strong>{' '}
                    <a href={`mailto:${contact?.recruitment_email || 'hr@philsonic.co.id'}`}>{contact?.recruitment_email || 'hr@philsonic.co.id'}</a>
                  </p>
                </div>
              </div>

              <div className="contact-detail-block">
                <div className="contact-detail-icon">
                  <Clock size={18} strokeWidth={2} />
                </div>
                <div className="contact-detail-content">
                  <h4>{isId ? 'Jam Kerja & Operasional' : 'Operating Hours'}</h4>
                  <p>
                    <strong>Engineering & Kantor:</strong> {contact?.operating_hours || 'Senin - Jumat, 08:00 - 17:00 WIB'}<br />
                    <strong>Lini Produksi SMT:</strong> 24/7 (3 Shift Berkelanjutan)
                  </p>
                </div>
              </div>

              {/* Interactive Functional Google Map of PT. Global Philsonic Technologies */}
              <ContactGoogleMap contact={contact} isId={isId} />
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
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid #10b981',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem', color: '#10b981' }}>
                    <CheckCircle2 size={44} strokeWidth={2} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', marginBottom: '0.5rem' }}>
                    {isId ? 'Permintaan Penawaran Terkirim!' : 'Inquiry Successfully Submitted!'}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {isId
                      ? `Terima kasih, Bapak/Ibu ${formData.fullName} dari ${formData.companyName || 'perusahaan Anda'}. Proposal teknis dan estimasi biaya awal akan segera kami proses.`
                      : `Thank you, ${formData.fullName} from ${formData.companyName || 'your company'}. Our engineering team is currently assessing your project parameters.`}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a
                      href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(buildWhatsAppMessage())}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '10px 18px',
                        borderRadius: '8px',
                        background: '#0d9488',
                        color: '#ffffff',
                        fontWeight: 700,
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <MessageCircle size={16} strokeWidth={2} />
                      <span>{isId ? 'Buka Kembali di WhatsApp' : 'Open in WhatsApp'}</span>
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
                  {/* Invisible honeypot field to trap bots */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <label htmlFor="fax_number">Fax Number</label>
                    <input
                      id="fax_number"
                      type="text"
                      name="fax_number"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.fax_number || ''}
                      onChange={e => setFormData({ ...formData, fax_number: e.target.value })}
                    />
                  </div>

                  {formError && (
                    <div
                      className="contact-field-full"
                      style={{
                        padding: '10px 14px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1.5px solid #ef4444',
                        borderRadius: 8,
                        color: '#ef4444',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        marginBottom: 10,
                      }}
                    >
                      {formError}
                    </div>
                  )}

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
                    <button type="submit" className="contact-submit-btn" disabled={submitting}>
                      {submitting
                        ? (isId ? 'Mengirim Data...' : 'Submitting Data...')
                        : (isId ? 'Kirim Permintaan RFQ & Hubungkan ke WhatsApp' : 'Submit Engineering RFQ & Proceed to WhatsApp')}
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
