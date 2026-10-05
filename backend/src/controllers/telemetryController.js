const pool = require('../config/database');
const { success, error } = require('../utils/response');

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

/**
 * POST /api/public/rfq
 * Submit B2B RFQ inquiry from Contact page
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
    } = req.body;

    if (!fullName || !corporateEmail || !companyName || !phone) {
      return error(res, 'Harap lengkapi semua kolom wajib formulir RFQ.', 400);
    }

    const rawIp =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '127.0.0.1';

    const countryCode = (
      req.headers['cf-ipcountry'] ||
      req.headers['x-vercel-ip-country'] ||
      'ID'
    ).toUpperCase();

    const countryName = COUNTRY_NAMES[countryCode] || countryCode;

    const [result] = await pool.execute(
      `INSERT INTO rfq_inquiries (
        full_name, corporate_email, company_name, phone,
        inquiry_type, volume, message, country_code, country_name, ip_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      ]
    );

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
      `SELECT id, full_name, corporate_email, company_name, phone, inquiry_type, volume, created_at 
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

module.exports = {
  recordVisit,
  submitRfq,
  getTelemetryStats,
};
