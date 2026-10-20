const pool = require('../../config/database');
const { success } = require('../../utils/response');

const normalizeCategory = (cat) => {
  if (!cat) return 'automation';
  const legacyMap = {
    headunit: 'android_headunit',
    infotainment: 'android_headunit',
    audio: 'amplifier',
    dashcam: 'dash_camera_recorders',
    ems: 'automation',
  };
  return legacyMap[cat] || cat;
};

/**
 * GET /api/public/products
 * Mendapatkan daftar produk aktif untuk halaman publik
 */
const getProducts = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, model_code, category, badge, badge_color, image, gallery,
              title_id, title_en, short_desc_id, short_desc_en,
              specs, full_specs, diagram_type, sort_order
       FROM products
       WHERE status = 1
       ORDER BY sort_order ASC, id ASC`
    );

    // Parse LONGTEXT JSON strings → JS objects (MariaDB 10.1 compat)
    const parsed = rows.map(row => ({
      ...row,
      category:   normalizeCategory(row.category),
      specs:      row.specs      ? (typeof row.specs      === 'string' ? JSON.parse(row.specs)      : row.specs)      : [],
      full_specs: row.full_specs ? (typeof row.full_specs === 'string' ? JSON.parse(row.full_specs) : row.full_specs) : {},
      gallery:    row.gallery    ? (typeof row.gallery    === 'string' ? JSON.parse(row.gallery)    : row.gallery)    : [],
    }));

    return success(res, 'Daftar produk berhasil diambil.', parsed);
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts };
