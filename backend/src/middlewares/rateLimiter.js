const rateLimit = require('express-rate-limit');

/**
 * Rate Limiter untuk Endpoint Publik
 * Membatasi maksimal 150 request per 15 menit per IP.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: process.env.NODE_ENV === 'production' ? 150 : 1000, // lebih longgar saat development
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan dari IP ini. Silakan coba lagi setelah 15 menit.',
  },
});

/**
 * Rate Limiter Ketat untuk Endpoint Login (Brute-Force Protection)
 * Membatasi maksimal 10 percobaan login per 15 menit.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login gagal. Demi keamanan, silakan coba lagi setelah 15 menit.',
  },
});

/**
 * Rate Limiter Ketat untuk Pengiriman Formulir RFQ / Kontak (Anti-Flood Protection)
 * Membatasi maksimal 5 permohonan per 15 menit per IP (mencegah spam flooding & beban database berlebih).
 */
const rfqSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: process.env.NODE_ENV === 'production' ? 5 : (parseInt(process.env.RFQ_RATE_LIMIT_MAX) || 15),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan penawaran dalam waktu singkat dari perangkat Anda. Mohon tunggu beberapa saat sebelum mencoba kembali.',
  },
});

module.exports = { apiLimiter, authLimiter, rfqSubmissionLimiter };
