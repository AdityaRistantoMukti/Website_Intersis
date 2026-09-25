const pool = require('../config/database');

/**
 * Mencatat aktivitas pengguna ke tabel activity_logs.
 * Dipanggil dari controller setelah aksi berhasil dilakukan.
 *
 * @param {number} userId   - ID user yang melakukan aksi
 * @param {string} action   - CREATE | UPDATE | DELETE | LOGIN | LOGOUT
 * @param {string} module   - Nama tabel/modul (job_vacancies, gallery, dll.)
 * @param {string} description - Keterangan detail aksi
 */
const logActivity = async (userId, action, module, description) => {
  try {
    await pool.execute(
      'INSERT INTO activity_logs (user_id, action, module, description) VALUES (?, ?, ?, ?)',
      [userId, action, module, description]
    );
  } catch (err) {
    // Log error ke console tapi jangan sampai menghentikan request utama
    console.error('[ActivityLogger] Failed to write log:', err.message);
  }
};

module.exports = { logActivity };
