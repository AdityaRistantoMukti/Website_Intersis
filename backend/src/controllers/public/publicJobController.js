const pool = require('../../config/database');
const { success, paginated, error } = require('../../utils/response');

/**
 * GET /api/public/job-categories
 * Mendapatkan daftar kategori lowongan yang aktif
 */
const getJobCategories = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, description FROM job_categories WHERE status = 1 ORDER BY name ASC'
    );
    return success(res, 'Daftar kategori lowongan berhasil diambil.', rows);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/public/jobs
 * Mendapatkan daftar lowongan kerja publik (status = 'published')
 * Mendukung filter: category_id, employment_type, location, search (q), pagination (page, limit)
 */
const getJobVacancies = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '10')));
    const offset = (page - 1) * limit;

    const { category_id, type, location, q } = req.query;

    let whereConditions = ["v.status = 'published'"];
    let queryParams = [];

    if (category_id) {
      whereConditions.push('v.category_id = ?');
      queryParams.push(parseInt(category_id));
    }

    if (type) {
      whereConditions.push('v.employment_type = ?');
      queryParams.push(type);
    }

    if (location) {
      whereConditions.push('v.location LIKE ?');
      queryParams.push(`%${location}%`);
    }

    if (q) {
      whereConditions.push('(v.title LIKE ? OR v.description LIKE ? OR v.requirements LIKE ?)');
      const searchTerm = `%${q}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    const whereClause = whereConditions.join(' AND ');

    // Count total data
    const countSql = `SELECT COUNT(*) AS total FROM job_vacancies v WHERE ${whereClause}`;
    const [countRows] = await pool.execute(countSql, queryParams);
    const totalItems = countRows[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    // Get paginated data
    const dataSql = `
      SELECT 
        v.id,
        v.category_id,
        c.name AS category_name,
        v.title,
        v.title_en,
        v.location,
        v.employment_type,
        v.description,
        v.description_en,
        v.responsibilities,
        v.responsibilities_en,
        v.requirements,
        v.requirements_en,
        v.form_url,
        v.published_at,
        v.created_at
      FROM job_vacancies v
      LEFT JOIN job_categories c ON v.category_id = c.id
      WHERE ${whereClause}
      ORDER BY v.published_at DESC, v.id DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(limit, offset);
    const [jobs] = await pool.execute(dataSql, queryParams);

    return paginated(res, 'Daftar lowongan kerja berhasil diambil.', jobs, {
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
 * GET /api/public/jobs/:id
 * Mendapatkan detail satu lowongan kerja publik
 */
const getJobVacancyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `
      SELECT 
        v.id,
        v.category_id,
        c.name AS category_name,
        v.title,
        v.title_en,
        v.location,
        v.employment_type,
        v.description,
        v.description_en,
        v.responsibilities,
        v.responsibilities_en,
        v.requirements,
        v.requirements_en,
        v.form_url,
        v.published_at,
        v.created_at
      FROM job_vacancies v
      LEFT JOIN job_categories c ON v.category_id = c.id
      WHERE v.id = ? AND v.status = 'published'
      `,
      [id]
    );

    if (rows.length === 0) {
      return error(res, 'Lowongan kerja tidak ditemukan atau telah ditutup.', 404);
    }

    return success(res, 'Detail lowongan kerja berhasil diambil.', rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = { getJobCategories, getJobVacancies, getJobVacancyById };
