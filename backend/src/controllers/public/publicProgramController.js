const pool = require('../../config/database');
const { success, error } = require('../../utils/response');

/**
 * GET /api/public/programs
 * Mendapatkan daftar program khusus (Internship, MT, OJT - status = 'active')
 */
const getPrograms = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, title, slug, description, requirements, image, registration_url, created_at FROM programs WHERE status = 'active' ORDER BY id ASC"
    );
    return success(res, 'Daftar program khusus berhasil diambil.', rows);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/public/programs/:slugOrId
 * Mendapatkan detail program khusus berdasarkan slug atau ID
 */
const getProgramBySlug = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    const isNumeric = /^\d+$/.test(slugOrId);

    const query = isNumeric
      ? "SELECT * FROM programs WHERE id = ? AND status = 'active'"
      : "SELECT * FROM programs WHERE slug = ? AND status = 'active'";

    const [rows] = await pool.execute(query, [slugOrId]);

    if (rows.length === 0) {
      return error(res, 'Program khusus tidak ditemukan.', 404);
    }

    return success(res, 'Detail program khusus berhasil diambil.', rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = { getPrograms, getProgramBySlug };
