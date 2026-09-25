const pool = require('../../config/database');
const { success, paginated, error } = require('../../utils/response');
const { logActivity } = require('../../utils/activityLogger');

/**
 * GET /api/admin/jobs
 * Mendapatkan daftar seluruh lowongan kerja (draft, published, closed) untuk HRD Admin
 */
const getAdminJobs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '10')));
    const offset = (page - 1) * limit;

    const { status, category_id, q } = req.query;

    let whereConditions = ['1=1'];
    let queryParams = [];

    if (status) {
      whereConditions.push('v.status = ?');
      queryParams.push(status);
    }

    if (category_id) {
      whereConditions.push('v.category_id = ?');
      queryParams.push(parseInt(category_id));
    }

    if (q) {
      whereConditions.push('(v.title LIKE ? OR v.description LIKE ?)');
      const search = `%${q}%`;
      queryParams.push(search, search);
    }

    const whereClause = whereConditions.join(' AND ');

    // Count
    const countSql = `SELECT COUNT(*) AS total FROM job_vacancies v WHERE ${whereClause}`;
    const [countRows] = await pool.execute(countSql, queryParams);
    const totalItems = countRows[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    // Query
    const dataSql = `
      SELECT 
        v.id,
        v.category_id,
        c.name AS category_name,
        v.title,
        v.location,
        v.employment_type,
        v.form_url,
        v.status,
        v.published_at,
        v.closed_at,
        u.name AS created_by_name,
        v.created_at,
        v.updated_at
      FROM job_vacancies v
      LEFT JOIN job_categories c ON v.category_id = c.id
      LEFT JOIN users u ON v.created_by = u.id
      WHERE ${whereClause}
      ORDER BY v.id DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(limit, offset);
    const [jobs] = await pool.execute(dataSql, queryParams);

    return paginated(res, 'Daftar lowongan kerja internal berhasil diambil.', jobs, {
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
 * GET /api/admin/jobs/:id
 */
const getAdminJobById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `
      SELECT 
        v.*,
        c.name AS category_name,
        u.name AS created_by_name
      FROM job_vacancies v
      LEFT JOIN job_categories c ON v.category_id = c.id
      LEFT JOIN users u ON v.created_by = u.id
      WHERE v.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return error(res, 'Lowongan kerja tidak ditemukan.', 404);
    }

    return success(res, 'Detail lowongan kerja internal berhasil diambil.', rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/jobs
 * Membuat lowongan kerja baru
 */
const createJob = async (req, res, next) => {
  try {
    const {
      category_id,
      title,
      location,
      employment_type,
      description,
      responsibilities,
      requirements,
      form_url,
      status,
    } = req.body;

    const jobStatus = status || 'draft';
    const publishedAt = jobStatus === 'published' ? new Date() : null;

    const [result] = await pool.execute(
      `
      INSERT INTO job_vacancies (
        category_id, title, location, employment_type,
        description, responsibilities, requirements, form_url,
        status, published_at, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        category_id,
        title,
        location || null,
        employment_type,
        description || null,
        responsibilities || null,
        requirements || null,
        form_url || null,
        jobStatus,
        publishedAt,
        req.user.id,
      ]
    );

    const jobId = result.insertId;

    await logActivity(
      req.user.id,
      'CREATE',
      'job_vacancies',
      `Membuat lowongan kerja baru '${title}' (Status: ${jobStatus})`
    );

    return success(res, 'Lowongan kerja berhasil dibuat.', { id: jobId, title, status: jobStatus }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/jobs/:id
 * Memperbarui data lowongan kerja
 */
const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      category_id,
      title,
      location,
      employment_type,
      description,
      responsibilities,
      requirements,
      form_url,
      status,
    } = req.body;

    const [existing] = await pool.execute('SELECT status FROM job_vacancies WHERE id = ?', [id]);
    if (existing.length === 0) {
      return error(res, 'Lowongan kerja tidak ditemukan.', 404);
    }

    const currentStatus = existing[0].status;

    let publishedAtUpdate = '';
    let closedAtUpdate = '';
    let extraParams = [];

    // Kelola perubahan status publikasi
    if (status && status !== currentStatus) {
      if (status === 'published' && currentStatus !== 'published') {
        publishedAtUpdate = ', published_at = CURRENT_TIMESTAMP';
      } else if (status === 'closed' && currentStatus !== 'closed') {
        closedAtUpdate = ', closed_at = CURRENT_TIMESTAMP';
      }
    }

    const [result] = await pool.execute(
      `
      UPDATE job_vacancies SET
        category_id = ?,
        title = ?,
        location = ?,
        employment_type = ?,
        description = ?,
        responsibilities = ?,
        requirements = ?,
        form_url = ?,
        status = ?
        ${publishedAtUpdate}
        ${closedAtUpdate}
      WHERE id = ?
      `,
      [
        category_id,
        title,
        location,
        employment_type,
        description,
        responsibilities,
        requirements,
        form_url,
        status,
        id,
      ]
    );

    await logActivity(
      req.user.id,
      'UPDATE',
      'job_vacancies',
      `Memperbarui lowongan kerja '${title}' (ID: ${id})`
    );

    return success(res, 'Lowongan kerja berhasil diperbarui.');
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/jobs/:id
 */
const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute('SELECT title FROM job_vacancies WHERE id = ?', [id]);
    if (existing.length === 0) {
      return error(res, 'Lowongan kerja tidak ditemukan.', 404);
    }

    const jobTitle = existing[0].title;
    await pool.execute('DELETE FROM job_vacancies WHERE id = ?', [id]);

    await logActivity(
      req.user.id,
      'DELETE',
      'job_vacancies',
      `Menghapus lowongan kerja '${jobTitle}' (ID: ${id})`
    );

    return success(res, 'Lowongan kerja berhasil dihapus.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getAdminJobs, getAdminJobById, createJob, updateJob, deleteJob };
