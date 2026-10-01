const pool = require('../../config/database');
const { success, paginated, error } = require('../../utils/response');
const { logActivity } = require('../../utils/activityLogger');

// ─── 1. CORE VALUES ─────────────────────────────────────────────────────────

const getAdminCoreValues = async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM core_values ORDER BY sort_order ASC, id ASC');
    return success(res, 'Daftar core values berhasil diambil.', rows);
  } catch (err) { next(err); }
};

const createCoreValue = async (req, res, next) => {
  try {
    const { title, title_en, description, description_en, icon, sort_order, status } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO core_values (title, title_en, description, description_en, icon, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, title_en || null, description || null, description_en || null, icon || null, sort_order || 0, status !== undefined ? status : 1]
    );
    await logActivity(req.user.id, 'CREATE', 'core_values', `Membuat core value baru '${title}'`);
    return success(res, 'Core value berhasil dibuat.', { id: result.insertId, title }, 201);
  } catch (err) { next(err); }
};

const updateCoreValue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, title_en, description, description_en, icon, sort_order, status } = req.body;
    await pool.execute(
      'UPDATE core_values SET title = ?, title_en = ?, description = ?, description_en = ?, icon = ?, sort_order = ?, status = ? WHERE id = ?',
      [title, title_en || null, description, description_en || null, icon, sort_order, status, id]
    );
    await logActivity(req.user.id, 'UPDATE', 'core_values', `Memperbarui core value ID: ${id}`);
    return success(res, 'Core value berhasil diperbarui.');
  } catch (err) { next(err); }
};

const deleteCoreValue = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM core_values WHERE id = ?', [id]);
    await logActivity(req.user.id, 'DELETE', 'core_values', `Menghapus core value ID: ${id}`);
    return success(res, 'Core value berhasil dihapus.');
  } catch (err) { next(err); }
};


// ─── 2. GALLERY ──────────────────────────────────────────────────────────────

const getAdminGallery = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '10')));
    const offset = (page - 1) * limit;

    const [countRows] = await pool.execute('SELECT COUNT(*) AS total FROM gallery');
    const totalItems = countRows[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    const [items] = await pool.execute(
      'SELECT g.*, u.name AS created_by_name FROM gallery g LEFT JOIN users u ON g.created_by = u.id ORDER BY g.id DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return paginated(res, 'Daftar galeri internal berhasil diambil.', items, { page, limit, totalItems, totalPages });
  } catch (err) { next(err); }
};

const createGalleryItem = async (req, res, next) => {
  try {
    const { title, description, category, event_date, status } = req.body;
    let image = req.body.image || '';

    if (req.file) {
      image = `/uploads/${req.body.folder || 'gallery'}/${req.file.filename}`;
    }

    if (!image) {
      return error(res, 'Gambar galeri wajib diunggah.', 400);
    }

    const [result] = await pool.execute(
      'INSERT INTO gallery (title, description, image, category, event_date, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description || null, image, category || null, event_date || null, status || 'active', req.user.id]
    );

    await logActivity(req.user.id, 'CREATE', 'gallery', `Mengunggah item galeri baru '${title}'`);
    return success(res, 'Item galeri berhasil dibuat.', { id: result.insertId, title, image }, 201);
  } catch (err) { next(err); }
};

const updateGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, category, event_date, status } = req.body;

    let imageUpdate = '';
    let params = [title, description, category, event_date, status];

    if (req.file) {
      const imagePath = `/uploads/${req.body.folder || 'gallery'}/${req.file.filename}`;
      imageUpdate = ', image = ?';
      params.push(imagePath);
    } else if (req.body.image) {
      imageUpdate = ', image = ?';
      params.push(req.body.image);
    }

    params.push(id);

    await pool.execute(
      `UPDATE gallery SET title = ?, description = ?, category = ?, event_date = ?, status = ? ${imageUpdate} WHERE id = ?`,
      params
    );

    await logActivity(req.user.id, 'UPDATE', 'gallery', `Memperbarui galeri ID: ${id}`);
    return success(res, 'Item galeri berhasil diperbarui.');
  } catch (err) { next(err); }
};

const deleteGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM gallery WHERE id = ?', [id]);
    await logActivity(req.user.id, 'DELETE', 'gallery', `Menghapus galeri ID: ${id}`);
    return success(res, 'Item galeri berhasil dihapus.');
  } catch (err) { next(err); }
};


// ─── 3. JOB CATEGORIES ───────────────────────────────────────────────────────

const getAdminJobCategories = async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM job_categories ORDER BY id ASC');
    return success(res, 'Daftar kategori lowongan berhasil diambil.', rows);
  } catch (err) { next(err); }
};

const createJobCategory = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO job_categories (name, description, status) VALUES (?, ?, ?)',
      [name, description || null, status !== undefined ? status : 1]
    );
    await logActivity(req.user.id, 'CREATE', 'job_categories', `Membuat kategori lowongan '${name}'`);
    return success(res, 'Kategori lowongan berhasil dibuat.', { id: result.insertId, name }, 201);
  } catch (err) { next(err); }
};

const updateJobCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    await pool.execute(
      'UPDATE job_categories SET name = ?, description = ?, status = ? WHERE id = ?',
      [name, description, status, id]
    );
    await logActivity(req.user.id, 'UPDATE', 'job_categories', `Memperbarui kategori lowongan ID: ${id}`);
    return success(res, 'Kategori lowongan berhasil diperbarui.');
  } catch (err) { next(err); }
};

const deleteJobCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM job_categories WHERE id = ?', [id]);
    await logActivity(req.user.id, 'DELETE', 'job_categories', `Menghapus kategori lowongan ID: ${id}`);
    return success(res, 'Kategori lowongan berhasil dihapus.');
  } catch (err) { next(err); }
};


// ─── 4. BENEFITS ─────────────────────────────────────────────────────────────

const getAdminBenefits = async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM benefits ORDER BY sort_order ASC, id ASC');
    return success(res, 'Daftar benefits berhasil diambil.', rows);
  } catch (err) { next(err); }
};

const createBenefit = async (req, res, next) => {
  try {
    const { title, description, icon, sort_order, status } = req.body;
    let image = req.body.image || null;

    if (req.file) {
      image = `/uploads/${req.body.folder || 'benefits'}/${req.file.filename}`;
    }

    const [result] = await pool.execute(
      'INSERT INTO benefits (title, description, icon, image, sort_order, status) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description || null, icon || null, image, sort_order || 0, status !== undefined ? status : 1]
    );

    await logActivity(req.user.id, 'CREATE', 'benefits', `Membuat benefit baru '${title}'`);
    return success(res, 'Benefit berhasil dibuat.', { id: result.insertId, title }, 201);
  } catch (err) { next(err); }
};

const updateBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, icon, sort_order, status } = req.body;

    let imageUpdate = '';
    let params = [title, description, icon, sort_order, status];

    if (req.file) {
      const imagePath = `/uploads/${req.body.folder || 'benefits'}/${req.file.filename}`;
      imageUpdate = ', image = ?';
      params.push(imagePath);
    } else if (req.body.image) {
      imageUpdate = ', image = ?';
      params.push(req.body.image);
    }

    params.push(id);

    await pool.execute(
      `UPDATE benefits SET title = ?, description = ?, icon = ?, sort_order = ?, status = ? ${imageUpdate} WHERE id = ?`,
      params
    );

    await logActivity(req.user.id, 'UPDATE', 'benefits', `Memperbarui benefit ID: ${id}`);
    return success(res, 'Benefit berhasil diperbarui.');
  } catch (err) { next(err); }
};

const deleteBenefit = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM benefits WHERE id = ?', [id]);
    await logActivity(req.user.id, 'DELETE', 'benefits', `Menghapus benefit ID: ${id}`);
    return success(res, 'Benefit berhasil dihapus.');
  } catch (err) { next(err); }
};


// ─── 5. PROGRAMS ─────────────────────────────────────────────────────────────

const getAdminPrograms = async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM programs ORDER BY id ASC');
    return success(res, 'Daftar program khusus berhasil diambil.', rows);
  } catch (err) { next(err); }
};

const createProgram = async (req, res, next) => {
  try {
    const { title, slug, description, requirements, registration_url, status } = req.body;
    let image = req.body.image || null;

    if (req.file) {
      image = `/uploads/${req.body.folder || 'programs'}/${req.file.filename}`;
    }

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const [result] = await pool.execute(
      'INSERT INTO programs (title, slug, description, requirements, image, registration_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, generatedSlug, description || null, requirements || null, image, registration_url || null, status || 'active']
    );

    await logActivity(req.user.id, 'CREATE', 'programs', `Membuat program khusus '${title}'`);
    return success(res, 'Program khusus berhasil dibuat.', { id: result.insertId, title, slug: generatedSlug }, 201);
  } catch (err) { next(err); }
};

const updateProgram = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, slug, description, requirements, registration_url, status } = req.body;

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    let imageUpdate = '';
    let params = [title, generatedSlug, description, requirements, registration_url, status];

    if (req.file) {
      const imagePath = `/uploads/${req.body.folder || 'programs'}/${req.file.filename}`;
      imageUpdate = ', image = ?';
      params.push(imagePath);
    } else if (req.body.image) {
      imageUpdate = ', image = ?';
      params.push(req.body.image);
    }

    params.push(id);

    await pool.execute(
      `UPDATE programs SET title = ?, slug = ?, description = ?, requirements = ?, registration_url = ?, status = ? ${imageUpdate} WHERE id = ?`,
      params
    );

    await logActivity(req.user.id, 'UPDATE', 'programs', `Memperbarui program khusus ID: ${id}`);
    return success(res, 'Program khusus berhasil diperbarui.');
  } catch (err) { next(err); }
};

const deleteProgram = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM programs WHERE id = ?', [id]);
    await logActivity(req.user.id, 'DELETE', 'programs', `Menghapus program khusus ID: ${id}`);
    return success(res, 'Program khusus berhasil dihapus.');
  } catch (err) { next(err); }
};


// ─── 6. FAQS ─────────────────────────────────────────────────────────────────

const getAdminFaqs = async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM faqs ORDER BY sort_order ASC, id ASC');
    return success(res, 'Daftar FAQ berhasil diambil.', rows);
  } catch (err) { next(err); }
};

const createFaq = async (req, res, next) => {
  try {
    const { question, answer, sort_order, status } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO faqs (question, answer, sort_order, status) VALUES (?, ?, ?, ?)',
      [question, answer, sort_order || 0, status !== undefined ? status : 1]
    );

    await logActivity(req.user.id, 'CREATE', 'faqs', `Membuat FAQ baru '${question}'`);
    return success(res, 'FAQ berhasil dibuat.', { id: result.insertId, question }, 201);
  } catch (err) { next(err); }
};

const updateFaq = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question, answer, sort_order, status } = req.body;
    await pool.execute(
      'UPDATE faqs SET question = ?, answer = ?, sort_order = ?, status = ? WHERE id = ?',
      [question, answer, sort_order, status, id]
    );

    await logActivity(req.user.id, 'UPDATE', 'faqs', `Memperbarui FAQ ID: ${id}`);
    return success(res, 'FAQ berhasil diperbarui.');
  } catch (err) { next(err); }
};

const deleteFaq = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM faqs WHERE id = ?', [id]);
    await logActivity(req.user.id, 'DELETE', 'faqs', `Menghapus FAQ ID: ${id}`);
    return success(res, 'FAQ berhasil dihapus.');
  } catch (err) { next(err); }
};


// ─── 7. ACTIVITY LOGS (AUDIT TRAIL) ─────────────────────────────────────────

const getActivityLogs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '15')));
    const offset = (page - 1) * limit;

    const [countRows] = await pool.execute('SELECT COUNT(*) AS total FROM activity_logs');
    const totalItems = countRows[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    const [logs] = await pool.execute(
      `
      SELECT 
        l.id,
        l.user_id,
        u.name AS user_name,
        u.username AS user_username,
        u.role AS user_role,
        l.action,
        l.module,
        l.description,
        l.created_at
      FROM activity_logs l
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.created_at DESC, l.id DESC
      LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    return paginated(res, 'Daftar activity log berhasil diambil.', logs, {
      page,
      limit,
      totalItems,
      totalPages,
    });
  } catch (err) { next(err); }
};

module.exports = {
  getAdminCoreValues, createCoreValue, updateCoreValue, deleteCoreValue,
  getAdminGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem,
  getAdminJobCategories, createJobCategory, updateJobCategory, deleteJobCategory,
  getAdminBenefits, createBenefit, updateBenefit, deleteBenefit,
  getAdminPrograms, createProgram, updateProgram, deleteProgram,
  getAdminFaqs, createFaq, updateFaq, deleteFaq,
  getActivityLogs,
};
