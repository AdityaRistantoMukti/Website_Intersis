const pool = require('../../config/database');
const { success } = require('../../utils/response');

/**
 * GET /api/public/benefits
 * Mendapatkan daftar manfaat & fasilitas perusahaan (status = 1)
 */
const getBenefits = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, title, description, icon, image, sort_order FROM benefits WHERE status = 1 ORDER BY sort_order ASC, id ASC'
    );
    return success(res, 'Daftar benefits berhasil diambil.', rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { getBenefits };
