const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/database');
const { success, error } = require('../../utils/response');
const { logActivity } = require('../../utils/activityLogger');

/**
 * POST /api/admin/auth/login
 * Authenticate HRD / Admin user & return JWT Token
 */
const login = async (req, res, next) => {
  try {
    const { identity, password } = req.body;

    const [rows] = await pool.execute(
      'SELECT id, name, username, email, password, role, status FROM users WHERE username = ? OR email = ? LIMIT 1',
      [identity, identity]
    );

    if (rows.length === 0) {
      return error(res, 'Kredensial login tidak ditemukan (Username/Email salah).', 401);
    }

    const user = rows[0];

    if (user.status !== 'active') {
      return error(res, 'Akun Anda dalam status nonaktif. Silakan hubungi Administrator.', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, 'Password yang Anda masukkan salah.', 401);
    }

    // Generate JWT Token
    const payload = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    // Catat log aktivitas
    await logActivity(user.id, 'LOGIN', 'auth', `User '${user.username}' berhasil login ke sistem`);

    return success(res, 'Login berhasil.', {
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/auth/me
 * Mendapatkan profil pengguna yang sedang login
 */
const getProfile = async (req, res, next) => {
  try {
    return success(res, 'Profil pengguna berhasil diambil.', { user: req.user });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/auth/change-password
 * Mengubah password pengguna yang sedang login
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const [rows] = await pool.execute('SELECT password FROM users WHERE id = ?', [userId]);
    const currentHash = rows[0].password;

    const isMatch = await bcrypt.compare(currentPassword, currentHash);
    if (!isMatch) {
      return error(res, 'Password saat ini yang Anda masukkan salah.', 400);
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.execute('UPDATE users SET password = ? WHERE id = ?', [newHash, userId]);

    await logActivity(userId, 'UPDATE', 'auth', 'Mengubah password pribadi');

    return success(res, 'Password berhasil diperbarui.');
  } catch (err) {
    next(err);
  }
};

module.exports = { login, getProfile, changePassword };
