const pool = require('../../config/database');
const { success } = require('../../utils/response');

/**
 * GET /api/public/faqs
 * Mendapatkan daftar pertanyaan & jawaban FAQ (status = 1)
 */
const getFaqs = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, question, answer, sort_order FROM faqs WHERE status = 1 ORDER BY sort_order ASC, id ASC'
    );
    return success(res, 'Daftar FAQ berhasil diambil.', rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getFaqs };
