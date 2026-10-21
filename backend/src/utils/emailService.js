const nodemailer = require('nodemailer');
const pool = require('../config/database');

/**
 * Fetch current email configuration from site_settings or fallback to process.env
 */
async function getEmailConfig() {
  try {
    const [rows] = await pool.query(
      "SELECT content_json FROM site_settings WHERE key_name = 'email_smtp_settings'"
    );

    let dbConfig = {};
    if (rows && rows.length > 0 && rows[0].content_json) {
      try {
        dbConfig = typeof rows[0].content_json === 'string'
          ? JSON.parse(rows[0].content_json)
          : rows[0].content_json;
      } catch (e) {
        console.warn('[EmailService] Failed to parse email_smtp_settings JSON:', e.message);
      }
    }

    return {
      enabled: dbConfig.enabled !== undefined ? !!dbConfig.enabled : true,
      provider: dbConfig.provider || process.env.EMAIL_PROVIDER || (dbConfig.resend_api_key ? 'resend' : 'smtp'),
      resend_api_key: dbConfig.resend_api_key || process.env.RESEND_API_KEY || '',
      resend_from: dbConfig.resend_from || process.env.RESEND_FROM || 'PT. Global Philsonic Technologies <onboarding@resend.dev>',
      smtp_host: dbConfig.smtp_host || process.env.SMTP_HOST || '',
      smtp_port: parseInt(dbConfig.smtp_port || process.env.SMTP_PORT || '587', 10),
      smtp_secure: dbConfig.smtp_secure !== undefined ? !!dbConfig.smtp_secure : (process.env.SMTP_SECURE === 'true'),
      smtp_user: dbConfig.smtp_user || process.env.SMTP_USER || '',
      smtp_pass: dbConfig.smtp_pass || process.env.SMTP_PASS || '',
      sender_name: dbConfig.sender_name || process.env.SMTP_SENDER_NAME || 'PT. Global Philsonic Technologies',
      sender_email: dbConfig.sender_email || process.env.SMTP_SENDER_EMAIL || process.env.SMTP_USER || 'noreply@globalphilsonic.com',
      notify_emails: dbConfig.notify_emails || process.env.NOTIFICATION_EMAILS || 'sales@globalphilsonic.com',
      auto_reply_enabled: dbConfig.auto_reply_enabled !== undefined ? !!dbConfig.auto_reply_enabled : true,
      auto_reply_subject: dbConfig.auto_reply_subject || 'Konfirmasi Penerimaan Permintaan Penawaran (RFQ) - PT. Global Philsonic Technologies',
      auto_reply_greeting: dbConfig.auto_reply_greeting || 'Terima kasih telah mengajukan permintaan penawaran harga (RFQ) melalui portal resmi PT. Global Philsonic Technologies. Permohonan Anda telah tercatat dalam sistem kami.',
      auto_reply_commitment: dbConfig.auto_reply_commitment || 'Komitmen Respons Cepat: Tim Engineering & B2B Sales kami saat ini sedang meninjau parameter teknis Anda dan akan menghubungi Anda kembali dalam waktu maksimal 1 x 24 jam kerja.',
      auto_reply_footer_note: dbConfig.auto_reply_footer_note || 'Jika Anda memiliki lampiran berkas teknis (Gerber Files, BOM, diagram 3D CAD), Anda dapat langsung membalas email ini dengan melampirkan dokumen terkait agar kami dapat mempercepat penyusunan estimasi biaya (Cost Estimation).',
    };
  } catch (err) {
    console.error('[EmailService] Error reading email config from DB:', err.message);
    return {
      enabled: false,
      provider: process.env.EMAIL_PROVIDER || 'smtp',
      resend_api_key: process.env.RESEND_API_KEY || '',
      resend_from: process.env.RESEND_FROM || 'PT. Global Philsonic Technologies <onboarding@resend.dev>',
      smtp_host: process.env.SMTP_HOST || '',
      smtp_port: parseInt(process.env.SMTP_PORT || '587', 10),
      smtp_secure: process.env.SMTP_SECURE === 'true',
      smtp_user: process.env.SMTP_USER || '',
      smtp_pass: process.env.SMTP_PASS || '',
      sender_name: 'PT. Global Philsonic Technologies',
      sender_email: 'noreply@globalphilsonic.com',
      notify_emails: 'sales@globalphilsonic.com',
      auto_reply_enabled: false,
      auto_reply_subject: 'Konfirmasi Penerimaan Permintaan Penawaran (RFQ) - PT. Global Philsonic Technologies',
      auto_reply_greeting: 'Terima kasih telah mengajukan permintaan penawaran harga (RFQ) melalui portal resmi PT. Global Philsonic Technologies. Permohonan Anda telah tercatat dalam sistem kami.',
      auto_reply_commitment: 'Komitmen Respons Cepat: Tim Engineering & B2B Sales kami saat ini sedang meninjau parameter teknis Anda dan akan menghubungi Anda kembali dalam waktu maksimal 1 x 24 jam kerja.',
      auto_reply_footer_note: 'Jika Anda memiliki lampiran berkas teknis (Gerber Files, BOM, diagram 3D CAD), Anda dapat langsung membalas email ini dengan melampirkan dokumen terkait agar kami dapat mempercepat penyusunan estimasi biaya (Cost Estimation).',
    };
  }
}

/**
 * Send email via Resend HTTPS API (Port 443 — 100% cloud-safe, immune to Railway/Vercel SMTP port blocks)
 */
async function sendViaResend(cfg, to, subject, html) {
  const apiKey = (cfg.resend_api_key || process.env.RESEND_API_KEY || '').trim();
  if (!apiKey) {
    throw new Error('Resend API Key belum diisi. Masukkan API Key (re_...) pada pengaturan email.');
  }

  let from = (cfg.resend_from || 'PT. Global Philsonic Technologies <onboarding@resend.dev>').trim();
  if (!from.includes('<') && !from.includes('@resend.dev')) {
    from = `"${cfg.sender_name || 'PT. Global Philsonic Technologies'}" <${from}>`;
  }

  const recipients = Array.isArray(to)
    ? to.map(e => String(e).trim()).filter(Boolean)
    : String(to).split(',').map(e => e.trim()).filter(Boolean);

  if (recipients.length === 0) {
    throw new Error('Alamat email tujuan tidak boleh kosong.');
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: recipients,
      subject,
      html,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.message || (data.name ? `${data.name}: ${data.message}` : 'Gagal mengirim email via Resend API');
    throw new Error(errorMsg);
  }

  return { success: true, messageId: data.id };
}

/**
 * Create a Nodemailer transporter instance for traditional SMTP
 */
function createTransporter(cfg) {
  if (!cfg.smtp_host || !cfg.smtp_user) {
    return null;
  }

  const cleanPass = (cfg.smtp_pass || '').replace(/\s+/g, '');
  const port = parseInt(cfg.smtp_port, 10) || 587;
  const isSecure = cfg.smtp_secure !== undefined ? !!cfg.smtp_secure : (port === 465);
  const isGmail = (cfg.smtp_host && cfg.smtp_host.toLowerCase().includes('gmail')) ||
                  (cfg.smtp_user && cfg.smtp_user.toLowerCase().includes('@gmail.com'));

  const options = {
    host: cfg.smtp_host.trim(),
    port: port,
    secure: isSecure,
    auth: {
      user: cfg.smtp_user.trim(),
      pass: cleanPass,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false,
    },
  };

  if (isGmail && isSecure) {
    options.service = 'gmail';
  }

  return nodemailer.createTransport(options);
}

/**
 * Mapping labels for human-friendly display
 */
const INQUIRY_LABELS = {
  'smt-pcba': 'Perakitan SMT & PCBA Presisi Tinggi',
  'box-build': 'Box-Build & Turnkey System Integration',
  'testing-fixtures': 'Jig Uji Fungsional Otomatis (ICT/FCT)',
  'oem-odm': 'Layanan OEM / ODM Manufaktur Skala Penuh',
  'factory-audit': 'Kunjungan & Audit Fasilitas Batam FTZ',
  'consultation': 'Konsultasi Engineering Umum',
};

const VOLUME_LABELS = {
  'pilot': 'Prototipe / Pilot Run (< 1.000 unit/bln)',
  'medium': 'Volume Menengah (1.000 - 10.000 unit/bln)',
  'mass': 'Produksi Massal (> 10.000 unit/bln)',
  'high': 'Volume Sangat Tinggi (> 50.000 unit/bln)',
  'tbd': 'Belum Ditentukan / Konsultasi Dulu',
};

/**
 * Send internal notification email and customer confirmation email when an RFQ is submitted
 */
async function sendRfqNotification(rfq) {
  try {
    const cfg = await getEmailConfig();

    if (!cfg.enabled) {
      console.log('[EmailService] Email notification is disabled in settings.');
      return;
    }

    const scopeLabel = INQUIRY_LABELS[rfq.inquiryType] || rfq.inquiryType || 'Umum';
    const volLabel = VOLUME_LABELS[rfq.volume] || rfq.volume || 'Belum Ditentukan';
    const fromAddress = `"${cfg.sender_name}" <${cfg.sender_email}>`;
    const cleanPhone = (rfq.phone || '').replace(/[^0-9]/g, '');

    // ── 1. INTERNAL NOTIFICATION TEMPLATE ──
    const internalSubject = `[RFQ Inbound] ${rfq.companyName} - ${rfq.fullName} (${scopeLabel})`;
    const internalHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 28px 32px; color: #ffffff; }
          .badge { display: inline-block; background: #0d9488; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; }
          .header p { margin: 6px 0 0; font-size: 13px; color: #94a3b8; }
          .content { padding: 32px; }
          .field-group { margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
          .field-label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #64748b; letter-spacing: 0.04em; margin-bottom: 4px; }
          .field-value { font-size: 15px; font-weight: 500; color: #0f172a; word-break: break-word; }
          .message-box { background: #f8fafc; border-left: 4px solid #0d9488; padding: 16px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-line; margin-top: 8px; }
          .actions { margin-top: 28px; display: flex; gap: 12px; }
          .btn-action { display: inline-block; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 600; text-decoration: none; text-align: center; }
          .btn-primary { background: #0d9488; color: #ffffff !important; }
          .btn-wa { background: #25d366; color: #ffffff !important; }
          .footer { background: #f8fafc; padding: 20px 32px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">Permintaan RFQ Baru</span>
            <h1>Notifikasi Permintaan Penawaran Masuk</h1>
            <p>Diterima melalui formulir resmi website PT. Global Philsonic Technologies</p>
          </div>
          <div class="content">
            <div class="field-group">
              <div class="field-label">Perusahaan / Organisasi</div>
              <div class="field-value" style="font-size: 17px; font-weight: 700; color: #0f172a;">${rfq.companyName}</div>
            </div>
            <div class="field-group">
              <div class="field-label">Nama Kontak</div>
              <div class="field-value">${rfq.fullName}</div>
            </div>
            <div class="field-group">
              <div class="field-label">Email Korporat</div>
              <div class="field-value"><a href="mailto:${rfq.corporateEmail}" style="color: #0d9488; text-decoration: none;">${rfq.corporateEmail}</a></div>
            </div>
            <div class="field-group">
              <div class="field-label">Nomor Telepon / WhatsApp</div>
              <div class="field-value"><a href="tel:${rfq.phone}" style="color: #0f172a; text-decoration: none;">${rfq.phone}</a></div>
            </div>
            <div class="field-group">
              <div class="field-label">Kategori Kebutuhan Proyek</div>
              <div class="field-value" style="color: #0d9488; font-weight: 600;">${scopeLabel}</div>
            </div>
            <div class="field-group">
              <div class="field-label">Estimasi Target Volume</div>
              <div class="field-value">${volLabel}</div>
            </div>
            <div class="field-group">
              <div class="field-label">Lokasi / IP Pengirim</div>
              <div class="field-value">${rfq.countryName || 'Indonesia'} (${rfq.countryCode || 'ID'}) &bull; IP: ${rfq.rawIp || '-'}</div>
            </div>
            <div class="field-group" style="border-bottom: none;">
              <div class="field-label">Rincian Spesifikasi & Pesan</div>
              <div class="message-box">${rfq.message ? rfq.message : '<i>(Tidak ada catatan tambahan)</i>'}</div>
            </div>

            <div class="actions">
              <a href="mailto:${rfq.corporateEmail}?subject=Re:%20Penawaran%20RFQ%20PT.%20Global%20Philsonic%20Technologies" class="btn-action btn-primary">Balas via Email</a>
              ${cleanPhone ? `<a href="https://wa.me/${cleanPhone}" class="btn-action btn-wa" style="margin-left: 10px;">Hubungi via WhatsApp</a>` : ''}
            </div>
          </div>
          <div class="footer">
            PT. Global Philsonic Technologies &bull; Batam Free Trade Zone, Kepulauan Riau &bull; Sistem Otomasi RFQ
          </div>
        </div>
      </body>
      </html>
    `;

    // ── 2. AUTO-REPLY TEMPLATE FOR CLIENT ──
    const clientSubject = cfg.auto_reply_subject || `Konfirmasi Penerimaan Permintaan Penawaran (RFQ) - PT. Global Philsonic Technologies`;
    const greetingText = (cfg.auto_reply_greeting || 'Terima kasih telah mengajukan permintaan penawaran harga (RFQ) melalui portal resmi PT. Global Philsonic Technologies. Permohonan Anda telah tercatat dalam sistem kami.').replace(/\n/g, '<br>');
    const commitText = (cfg.auto_reply_commitment || 'Komitmen Respons Cepat: Tim Engineering & B2B Sales kami saat ini sedang meninjau parameter teknis Anda dan akan menghubungi Anda kembali dalam waktu maksimal 1 x 24 jam kerja.').replace(/\n/g, '<br>');
    const footerNoteText = (cfg.auto_reply_footer_note || 'Jika Anda memiliki lampiran berkas teknis (Gerber Files, BOM, diagram 3D CAD), Anda dapat langsung membalas email ini dengan melampirkan dokumen terkait agar kami dapat mempercepat penyusunan estimasi biaya (Cost Estimation).').replace(/\n/g, '<br>');

    const clientHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; color: #ffffff; text-align: center; }
          .header h1 { margin: 0; font-size: 21px; font-weight: 700; color: #ffffff; }
          .header p { margin: 8px 0 0; font-size: 13px; color: #94a3b8; }
          .content { padding: 32px; }
          .lead-text { font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 24px; }
          .summary-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
          .summary-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #edf2f7; font-size: 14px; }
          .summary-row:last-child { border-bottom: none; }
          .summary-label { color: #64748b; font-weight: 500; }
          .summary-val { color: #0f172a; font-weight: 600; }
          .commit-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
          .commit-box p { margin: 0; font-size: 13px; color: #166534; line-height: 1.5; }
          .footer { background: #0f172a; padding: 24px 32px; font-size: 12px; color: #94a3b8; text-align: center; }
          .footer a { color: #2dd4bf; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>PT. Global Philsonic Technologies</h1>
            <p>Batam Free Trade Zone &bull; Pusat Manufaktur Elektronik Presisi & Otomasi</p>
          </div>
          <div class="content">
            <p class="lead-text">
              Halo <strong>${rfq.fullName}</strong> (${rfq.companyName}),<br><br>
              ${greetingText}
            </p>

            <div class="commit-box">
              <p><strong>${commitText}</strong></p>
            </div>

            <div class="summary-box">
              <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #475569; margin-bottom: 10px;">Ringkasan Data Pengajuan:</div>
              <div class="summary-row">
                <span class="summary-label">Kategori Proyek:</span>
                <span class="summary-val">${scopeLabel}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Target Volume:</span>
                <span class="summary-val">${volLabel}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Perusahaan:</span>
                <span class="summary-val">${rfq.companyName}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Telepon / Kontak:</span>
                <span class="summary-val">${rfq.phone}</span>
              </div>
            </div>

            <p style="font-size: 13px; line-height: 1.6; color: #64748b;">
              ${footerNoteText}
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 6px; color: #ffffff; font-weight: 600;">PT. Global Philsonic Technologies</p>
            <p style="margin: 0; font-size: 11px;">Batam Industrial Park, Kawasan Bebas Batam (Free Trade Zone), Kepulauan Riau, Indonesia</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // ── DISPATCH LOGIC (RESEND HTTPS vs SMTP) ──
    if (cfg.provider === 'resend') {
      if (cfg.notify_emails) {
        await sendViaResend(cfg, cfg.notify_emails, internalSubject, internalHtml);
        console.log(`[EmailService/Resend] Internal notification sent to: ${cfg.notify_emails}`);
      }
      if (cfg.auto_reply_enabled && rfq.corporateEmail) {
        await sendViaResend(cfg, rfq.corporateEmail, clientSubject, clientHtml);
        console.log(`[EmailService/Resend] Auto-reply confirmation sent to: ${rfq.corporateEmail}`);
      }
      return;
    }

    // Traditional SMTP Transporter
    if (!cfg.smtp_host || !cfg.smtp_user) {
      console.log('[EmailService] SMTP host or user not configured yet. Skipping email dispatch.');
      return;
    }

    const transporter = createTransporter(cfg);
    if (!transporter) {
      console.log('[EmailService] Could not initialize SMTP transporter.');
      return;
    }

    if (cfg.notify_emails) {
      await transporter.sendMail({
        from: fromAddress,
        to: cfg.notify_emails,
        subject: internalSubject,
        html: internalHtml,
      });
      console.log(`[EmailService/SMTP] Internal RFQ notification sent to: ${cfg.notify_emails}`);
    }

    if (cfg.auto_reply_enabled && rfq.corporateEmail) {
      await transporter.sendMail({
        from: fromAddress,
        to: rfq.corporateEmail,
        subject: clientSubject,
        html: clientHtml,
      });
      console.log(`[EmailService/SMTP] Customer RFQ confirmation email sent to: ${rfq.corporateEmail}`);
    }
  } catch (err) {
    console.error('[EmailService] Failed to send RFQ notification email:', err.message);
  }
}

/**
 * Send a quick test email to verify credentials (supports both Resend HTTPS & SMTP)
 */
async function sendTestEmail(targetEmail, customConfig = null) {
  const cfg = customConfig ? { ...(await getEmailConfig()), ...customConfig } : await getEmailConfig();

  const testSubject = `[Test Email] Verifikasi Sistem Notifikasi PT. Global Philsonic Technologies`;
  const testHtml = `
    <div style="font-family: sans-serif; padding: 20px; background: #f8fafc; color: #0f172a;">
      <div style="max-width: 500px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <h2 style="color: #0d9488; margin-top: 0;">Koneksi Email Berhasil Terhubung!</h2>
        <p>Email ini adalah pesan pengujian dari Dashboard Admin <strong>PT. Global Philsonic Technologies</strong>.</p>
        <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 13px; font-family: monospace;">
          Penyedia: ${cfg.provider === 'resend' ? 'Resend HTTPS API (Port 443 — Bebas Blokir Cloud)' : `SMTP (${cfg.smtp_host}:${cfg.smtp_port})`}<br>
          Waktu Pengujian: ${new Date().toLocaleString('id-ID')}
        </div>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 0; margin-top: 16px;">Sistem notifikasi siap digunakan untuk menerima permintaan RFQ.</p>
      </div>
    </div>
  `;

  // 1. Resend HTTPS API branch
  if (cfg.provider === 'resend') {
    return await sendViaResend(cfg, targetEmail, testSubject, testHtml);
  }

  // 2. Traditional SMTP branch
  if (!cfg.smtp_host) {
    throw new Error('Alamat host SMTP belum diisi.');
  }
  if (!cfg.smtp_user) {
    throw new Error('Username / akun email SMTP belum diisi.');
  }

  const transporter = createTransporter(cfg);
  if (!transporter) {
    throw new Error('Gagal menginisialisasi koneksi transporter SMTP.');
  }

  try {
    await transporter.verify();
  } catch (verifyErr) {
    const errText = verifyErr.message || '';
    if (errText.includes('timeout') || verifyErr.code === 'ETIMEDOUT' || verifyErr.code === 'ESOCKETTIMEDOUT') {
      throw new Error(`Koneksi SMTP timeout ke ${cfg.smtp_host}:${cfg.smtp_port}. Port ${cfg.smtp_port} kemungkinan diblokir oleh cloud/hosting firewall (seperti Railway/Render). Silakan beralih ke penyedia Resend HTTPS API.`);
    }
    if (errText.includes('535') || errText.includes('BadCredentials') || errText.includes('Username and Password not accepted')) {
      throw new Error('Autentikasi ditolak oleh Google. Pastikan Anda menggunakan Sandi Aplikasi (App Password 16 huruf tanpa spasi) dari Google Account Security, dan Verifikasi 2 Langkah sudah aktif.');
    }
    throw verifyErr;
  }

  const fromAddress = `"${cfg.sender_name || 'PT. Global Philsonic Technologies'}" <${cfg.sender_email || cfg.smtp_user}>`;

  const info = await transporter.sendMail({
    from: fromAddress,
    to: targetEmail,
    subject: testSubject,
    html: testHtml,
  });

  return { success: true, messageId: info.messageId };
}

module.exports = {
  getEmailConfig,
  sendRfqNotification,
  sendTestEmail,
};
