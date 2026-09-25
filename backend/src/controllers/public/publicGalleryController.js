const pool = require('../../config/database');
const { success, paginated } = require('../../utils/response');

/**
 * GET /api/public/gallery
 * Mendapatkan galeri kegiatan Life at ISA (status = 'active')
 * Mendukung filter: category, pagination (page, limit)
 */
const getGalleryItems = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '12')));
    const offset = (page - 1) * limit;

    const { category } = req.query;

    let whereConditions = ["status = 'active'"];
    let queryParams = [];

    if (category) {
      whereConditions.push('category = ?');
      queryParams.push(category);
    }

    const whereClause = whereConditions.join(' AND ');

    // Count
    const countSql = `SELECT COUNT(*) AS total FROM gallery WHERE ${whereClause}`;
    const [countRows] = await pool.execute(countSql, queryParams);
    const totalItems = countRows[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    // Query
    const dataSql = `
      SELECT id, title, description, image, category, event_date, created_at
      FROM gallery
      WHERE ${whereClause}
      ORDER BY event_date DESC, id DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(limit, offset);
    const [items] = await pool.execute(dataSql, queryParams);

    return paginated(res, 'Data galeri berhasil diambil.', items, {
      page,
      limit,
      totalItems,
      totalPages,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getGalleryItems };
