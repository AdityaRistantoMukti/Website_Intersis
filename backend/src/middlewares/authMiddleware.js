const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { error } = require('../utils/response');

/**
 * Middleware untuk verifikasi JWT Token pada header Authorization
 * Header format: Authorization: Bearer <token>
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Akses ditolak. Token autentikasi tidak ditemukan.', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return error(res, 'Token tidak valid.', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_change_in_production');

    // Verifikasi ketersediaan user di database
    const [rows] = await pool.execute(
      'SELECT id, name, username, email, role, status FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return error(res, 'User pemilik token tidak lagi ditemukan.', 401);
    }

    const user = rows[0];
    if (user.status !== 'active') {
      return error(res, 'Akun Anda dalam status nonaktif. Hubungi Administrator.', 403);
    }

    // Attach user payload ke request object
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Sesi login telah kadaluarsa. Silakan login kembali.', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return error(res, 'Token autentikasi tidak valid atau telah dirusak.', 401);
    }
    return error(res, 'Gagal memverifikasi token autentikasi.', 500);
  }
};

/**
 * Middleware untuk mengecek Role/Hak Akses Pengguna (RBAC)
 * Contoh: restrictTo('administrator', 'hrd')
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return error(
        res,
        'Anda tidak memiliki izin (hak akses) untuk melakukan tindakan ini.',
        403
      );
    }
    next();
  };
};

module.exports = { verifyToken, restrictTo };
