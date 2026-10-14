const pool = require('../config/database');
const { success, error } = require('../utils/response');
const { sendRfqNotification, sendTestEmail } = require('../utils/emailService');

const COUNTRY_NAMES = {
  ID: 'Indonesia',
  SG: 'Singapura',
  MY: 'Malaysia',
  TH: 'Thailand',
  VN: 'Vietnam',
  PH: 'Filipina',
  JP: 'Jepang',
  KR: 'Korea Selatan',
  CN: 'Tiongkok',
  US: 'Amerika Serikat',
  DE: 'Jerman',
  AU: 'Australia',
  GB: 'Inggris Raya',
  IN: 'India',
};

/**
 * POST /api/public/telemetry/visit
 * Record or ping visitor presence
 */
const recordVisit = async (req, res, next) => {
  try {
    const { sessionId, pageUrl } = req.body;
    if (!sessionId) {
      return success(res, 'No session id provided', { recorded: false });
    }

    const rawIp =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    const countryCode = (
      req.headers['cf-ipcountry'] ||
      req.headers['x-vercel-ip-country'] ||
      'ID'
    ).toUpperCase();

    const countryName = COUNTRY_NAMES[countryCode] || countryCode;
    const userAgent = req.headers['user-agent'] || '';

    // Check if session exists today
    const [existing] = await pool.execute(
      `SELECT id FROM visitor_telemetry 
       WHERE session_id = ? AND created_at >= CURDATE()
       LIMIT 1`,
      [sessionId]
    );

    if (existing.length > 0) {
      await pool.execute(
        `UPDATE visitor_telemetry 
         SET last_active = CURRENT_TIMESTAMP, page_url = ?
         WHERE id = ?`,
        [pageUrl || '/', existing[0].id]
      );
    } else {
      await pool.execute(
        `INSERT INTO visitor_telemetry (session_id, ip_address, country_code, country_name, user_agent, page_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [sessionId, rawIp, countryCode, countryName, userAgent, pageUrl || '/']
      );
    }

    return success(res, 'Visit recorded', { recorded: true });
  } catch (err) {
    next(err);
  }
};

const { evaluateRfqSpam } = require('../utils/spamDetector');

/**
 * POST /api/public/rfq
 * Submit B2B RFQ inquiry from Contact page or Products page
 */
const submitRfq = async (req, res, next) => {
  try {
    const {
      fullName,
      corporateEmail,
      companyName,
      phone,
      inquiryType,
      volume,
      message,
      fax_number, // Honeypot field
      website_url, // Alternative honeypot field
    } = req.body;

    if (!fullName || !corporateEmail || !companyName || !phone) {
      return error(res, 'Harap lengkapi semua kolom wajib formulir RFQ.', 400);
    }

    const rawIp =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    // Silent Drop for Automated Bot Crawlers (Honeypot Triggered)
    // Instantly return HTTP 201 without running MySQL queries or SMTP connections to protect DB pool
    if ((fax_number && String(fax_number).trim().length > 0) || (website_url && String(website_url).trim().length > 0)) {
      console.warn(`[Anti-Spam Security] Honeypot triggered by bot from IP ${rawIp}. Silently dropped to conserve DB pool.`);
      return success(
        res,
        'Permintaan penawaran RFQ berhasil dikirimkan.',
        { id: 0 },
        201
      );
    }

    // Evaluate submission quality and bot traps
    const spamAssessment = evaluateRfqSpam({
      fullName,
      corporateEmail,
      companyName,
      phone,
      message,
      honeypot: fax_number || website_url || '',
    });

    const finalStatus = spamAssessment.isSpam ? 'spam' : 'new';
    const spamScore = spamAssessment.spamScore;
    const spamReason = spamAssessment.primaryReason || null;

    const countryCode = (
      req.headers['cf-ipcountry'] ||
      req.headers['x-vercel-ip-country'] ||
      'ID'
    ).toUpperCase();

    const countryName = COUNTRY_NAMES[countryCode] || countryCode;

    const [result] = await pool.execute(
      `INSERT INTO rfq_inquiries (
        full_name, corporate_email, company_name, phone,
        inquiry_type, volume, message, country_code, country_name, ip_address, status, spam_score, spam_reason
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullName,
        corporateEmail,
        companyName,
        phone,
        inquiryType || 'smt-pcba',
        volume || 'pilot',
        message || '',
        countryCode,
        countryName,
        rawIp,
        finalStatus,
        spamScore,
        spamReason,
      ]
    );

    // Only send notification & auto-reply if verified legitimate (NOT spam)
    if (!spamAssessment.isSpam) {
      sendRfqNotification({
        id: result.insertId,
        fullName,
        corporateEmail,
        companyName,
        phone,
        inquiryType,
        volume,
        message,
        countryCode,
        countryName,
        rawIp,
      }).catch((emailErr) => {
        console.warn('[Telemetry] Asynchronous email alert warning:', emailErr.message);
      });
    } else {
      console.log(`[RFQ Anti-Spam] Auto-flagged inquiry #${result.insertId} as '${finalStatus}' (Score: ${spamScore}, Reason: ${spamReason})`);
    }

    return success(
      res,
      'Permintaan penawaran RFQ berhasil dikirimkan.',
      { id: result.insertId },
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/telemetry
 * Get real visitor statistics, country breakdown, and RFQ inquiries count
 */
const getTelemetryStats = async (req, res, next) => {
  try {
    // 1. Total lifetime visits (or unique sessions)
    const [totalVisitsRows] = await pool.execute(
      'SELECT COUNT(*) AS total, COUNT(DISTINCT session_id) AS unique_visitors FROM visitor_telemetry'
    );
    const totalVisits = totalVisitsRows[0].total || 0;
    const uniqueVisitors = totalVisitsRows[0].unique_visitors || 0;

    // 2. Active now (last 5 minutes)
    const [activeRows] = await pool.execute(
      `SELECT COUNT(DISTINCT session_id) AS active_now 
       FROM visitor_telemetry 
       WHERE last_active >= NOW() - INTERVAL 5 MINUTE`
    );
    const activeNow = activeRows[0].active_now || 0;

    // 3. Country breakdown
    const [countryRows] = await pool.execute(
      `SELECT 
         country_code, 
         country_name, 
         COUNT(*) AS visit_count 
       FROM visitor_telemetry 
       GROUP BY country_code, country_name 
       ORDER BY visit_count DESC 
       LIMIT 6`
    );

    // 4. RFQ Inquiries
    const [rfqCountRows] = await pool.execute(
      'SELECT COUNT(*) AS total_rfqs FROM rfq_inquiries'
    );
    const totalRfqs = rfqCountRows[0].total_rfqs || 0;

    const [recentRfqs] = await pool.execute(
      `SELECT id, full_name, corporate_email, company_name, phone, inquiry_type, volume, status, created_at 
       FROM rfq_inquiries 
       ORDER BY created_at DESC 
       LIMIT 5`
    );

    return success(res, 'Telemetry data retrieved successfully', {
      totalVisits,
      uniqueVisitors,
      activeNow,
      countryStats: countryRows,
      totalRfqs,
      recentRfqs,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/rfq
 * List all RFQ inquiries with optional status filtering
 */
const getAdminRfqs = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    let query = `SELECT * FROM rfq_inquiries WHERE 1=1`;
    const params = [];

    if (status && status !== 'all') {
      query += ` AND status = ?`;
      params.push(status);
    }

    if (search) {
      query += ` AND (full_name LIKE ? OR company_name LIKE ? OR corporate_email LIKE ? OR phone LIKE ?)`;
      const searchWild = `%${search}%`;
      params.push(searchWild, searchWild, searchWild, searchWild);
    }

    query += ` ORDER BY created_at DESC LIMIT 100`;

    const [rows] = await pool.execute(query, params);
    return success(res, 'RFQ inquiries retrieved', rows);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/rfq/:id
 * Update status or notes of an RFQ inquiry
 */
const updateAdminRfq = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updates = [];
    const params = [];

    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }

    if (notes !== undefined) {
      updates.push('notes = ?');
      params.push(notes);
    }

    if (updates.length === 0) {
      return error(res, 'Tidak ada data untuk diperbarui.', 400);
    }

    params.push(id);
    await pool.execute(
      `UPDATE rfq_inquiries SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    return success(res, 'Status RFQ berhasil diperbarui');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/rfq/:id
 * Delete an RFQ inquiry
 */
const deleteAdminRfq = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM rfq_inquiries WHERE id = ?', [id]);
    return success(res, 'Data RFQ berhasil dihapus');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/email/test
 * Test SMTP server credentials and connectivity
 */
const testEmailDelivery = async (req, res, next) => {
  try {
    const { targetEmail, config } = req.body;
    if (!targetEmail) {
      return error(res, 'Alamat email tujuan uji coba wajib diisi.', 400);
    }

    const result = await sendTestEmail(targetEmail, config);
    return success(res, 'Email uji coba berhasil dikirimkan!', result);
  } catch (err) {
    return error(res, `Gagal mengirim email uji coba: ${err.message}`, 400);
  }
};

module.exports = {
  recordVisit,
  submitRfq,
  getTelemetryStats,
  getAdminRfqs,
  updateAdminRfq,
  deleteAdminRfq,
  testEmailDelivery,
};
