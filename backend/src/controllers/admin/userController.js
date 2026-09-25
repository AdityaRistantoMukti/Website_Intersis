const bcrypt = require('bcrypt');
const pool = require('../../config/database');
const { success, paginated, error } = require('../../utils/response');
const { logActivity } = require('../../utils/activityLogger');

/**
 * GET /api/admin/users
 * Mendapatkan daftar pengguna internal HRD
 */
const getUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '10')));
    const offset = (page - 1) * limit;

    const [countRows] = await pool.execute('SELECT COUNT(*) AS total FROM users');
    const totalItems = countRows[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    const [users] = await pool.execute(
      'SELECT id, name, username, email, role, status, created_at, updated_at FROM users ORDER BY id DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    return paginated(res, 'Daftar pengguna berhasil diambil.', users, {
      page,
      limit,
      totalItems,
      totalPages,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/users/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT id, name, username, email, role, status, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return error(res, 'Pengguna tidak ditemukan.', 404);
    }

    return success(res, 'Detail pengguna berhasil diambil.', rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/users
 * Membuat pengguna baru
 */
const createUser = async (req, res, next) => {
  try {
    const { name, username, email, password, role, status } = req.body;

    // Cek hierarki role: HRD tidak boleh membuat akun administrator
    if (req.user.role === 'hrd' && role === 'administrator') {
      return error(res, 'Hanya Administrator yang diperbolehkan membuat akun Administrator.', 403);
    }

    // Cek keunikan username dan email
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1',
      [username, email]
    );

    if (existing.length > 0) {
      return error(res, 'Username atau email sudah digunakan oleh akun lain.', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userStatus = status || 'active';

    const [result] = await pool.execute(
      'INSERT INTO users (name, username, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, username, email, hashedPassword, role, userStatus]
    );

    const newUserId = result.insertId;

    await logActivity(
      req.user.id,
      'CREATE',
      'users',
      `Membuat akun pengguna baru '${username}' dengan role '${role}'`
    );

    return success(
      res,
      'Pengguna baru berhasil dibuat.',
      {
        id: newUserId,
        name,
        username,
        email,
        role,
        status: userStatus,
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/users/:id
 * Memperbarui data pengguna
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, username, email, password, role, status } = req.body;

    const [rows] = await pool.execute('SELECT id, role FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return error(res, 'Pengguna tidak ditemukan.', 404);
    }

    const targetUser = rows[0];

    // Cek hak akses
    if (req.user.role === 'hrd' && (targetUser.role === 'administrator' || role === 'administrator')) {
      return error(res, 'Anda tidak memiliki wewenang untuk mengubah akun Administrator.', 403);
    }

    // Cek keunikan jika username/email berubah
    if (username || email) {
      const [existing] = await pool.execute(
        'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ? LIMIT 1',
        [username || '', email || '', id]
      );
      if (existing.length > 0) {
        return error(res, 'Username atau email sudah digunakan oleh pengguna lain.', 400);
      }
    }

    let updateFields = [];
    let queryParams = [];

    if (name) { updateFields.push('name = ?'); queryParams.push(name); }
    if (username) { updateFields.push('username = ?'); queryParams.push(username); }
    if (email) { updateFields.push('email = ?'); queryParams.push(email); }
    if (role) { updateFields.push('role = ?'); queryParams.push(role); }
    if (status) { updateFields.push('status = ?'); queryParams.push(status); }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push('password = ?');
      queryParams.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return error(res, 'Tidak ada data yang diubah.', 400);
    }

    queryParams.push(id);
    await pool.execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      queryParams
    );

    await logActivity(
      req.user.id,
      'UPDATE',
      'users',
      `Memperbarui data pengguna ID: ${id}`
    );

    return success(res, 'Data pengguna berhasil diperbarui.');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return error(res, 'Anda tidak dapat menghapus akun Anda sendiri.', 400);
    }

    const [rows] = await pool.execute('SELECT id, role, username FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return error(res, 'Pengguna tidak ditemukan.', 404);
    }

    const targetUser = rows[0];

    if (req.user.role === 'hrd' && targetUser.role === 'administrator') {
      return error(res, 'Hanya Administrator yang dapat menghapus akun Administrator.', 403);
    }

    await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    await logActivity(
      req.user.id,
      'DELETE',
      'users',
      `Menghapus akun pengguna '${targetUser.username}' (ID: ${id})`
    );

    return success(res, 'Pengguna berhasil dihapus.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
