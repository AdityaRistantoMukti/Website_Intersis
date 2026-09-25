const rateLimit = require('express-rate-limit');

/**
 * Rate Limiter untuk Endpoint Publik
 * Membatasi maksimal 150 request per 15 menit per IP.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 150,
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

module.exports = { apiLimiter, authLimiter };
