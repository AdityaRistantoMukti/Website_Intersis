const fs = require('fs');
const path = require('path');
const pool = require('../../config/database');
const { success, paginated, error } = require('../../utils/response');
const { logActivity } = require('../../utils/activityLogger');

const deleteFileIfLocal = (filePath) => {
  if (!filePath || typeof filePath !== 'string') return;
  if (filePath.startsWith('/uploads/')) {
    const relativePart = filePath.replace(/^\/uploads\//, '');
    const absolutePath = path.join(__dirname, '../../../uploads', relativePart);
    if (fs.existsSync(absolutePath)) {
      try {
        fs.unlinkSync(absolutePath);
        console.log(`[FILE CLEANUP] Deleted local file: ${absolutePath}`);
      } catch (err) {
        console.error(`[FILE CLEANUP ERROR] Failed to delete file ${absolutePath}:`, err.message);
      }
    }
  }
};

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
    const [rows] = await pool.execute('SELECT image FROM gallery WHERE id = ?', [id]);
    if (rows.length > 0 && rows[0].image) {
      deleteFileIfLocal(rows[0].image);
    }
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
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '20')));
    const offset = (page - 1) * limit;

    const { q, action, startDate, endDate } = req.query;

    let whereConditions = ['1=1'];
    let queryParams = [];

    if (action) {
      whereConditions.push('l.action = ?');
      queryParams.push(action);
    }

    if (q) {
      whereConditions.push('(l.description LIKE ? OR l.module LIKE ? OR u.name LIKE ? OR u.username LIKE ?)');
      const search = `%${q}%`;
      queryParams.push(search, search, search, search);
    }

    if (startDate) {
      whereConditions.push('DATE(l.created_at) >= ?');
      queryParams.push(startDate);
    }

    if (endDate) {
      whereConditions.push('DATE(l.created_at) <= ?');
      queryParams.push(endDate);
    }

    const whereClause = whereConditions.join(' AND ');

    const countSql = `
      SELECT COUNT(*) AS total
      FROM activity_logs l
      LEFT JOIN users u ON l.user_id = u.id
      WHERE ${whereClause}
    `;
    const [countRows] = await pool.execute(countSql, queryParams);
    const totalItems = countRows[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    const dataSql = `
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
      WHERE ${whereClause}
      ORDER BY l.created_at DESC, l.id DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(limit, offset);
    const [logs] = await pool.execute(dataSql, queryParams);

    return paginated(res, 'Daftar activity log berhasil diambil.', logs, {
      page,
      limit,
      totalItems,
      totalPages,
    });
  } catch (err) { next(err); }
};


// ─── 8. PRODUCTS ──────────────────────────────────────────────────────────────

const getAdminProducts = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, model_code, category, badge, badge_color, image, gallery,
              title_id, title_en, short_desc_id, short_desc_en,
              specs, full_specs, diagram_type, status, sort_order
       FROM products ORDER BY sort_order ASC, id ASC`
    );
    const parsed = rows.map(row => ({
      ...row,
      specs:      row.specs      ? (typeof row.specs      === 'string' ? JSON.parse(row.specs)      : row.specs)      : [],
      full_specs: row.full_specs ? (typeof row.full_specs === 'string' ? JSON.parse(row.full_specs) : row.full_specs) : {},
      gallery:    row.gallery    ? (typeof row.gallery    === 'string' ? JSON.parse(row.gallery)    : row.gallery)    : [],
    }));
    return success(res, 'Daftar produk berhasil diambil.', parsed);
  } catch (err) { next(err); }
};

const createProduct = async (req, res, next) => {
  try {
    const {
      model_code, category, badge, badge_color,
      title_id, title_en, short_desc_id, short_desc_en,
      specs, full_specs, diagram_type, status, sort_order,
      existing_gallery,
    } = req.body;

    const coverFile = req.files?.image?.[0] || req.file;
    const galleryFiles = req.files?.gallery || [];

    // Parse existing gallery if passed as JSON string
    let parsedExistingGallery = [];
    if (existing_gallery) {
      try {
        parsedExistingGallery = typeof existing_gallery === 'string' ? JSON.parse(existing_gallery) : existing_gallery;
      } catch (e) {
        parsedExistingGallery = [];
      }
    }

    const newGalleryPaths = galleryFiles.map(f => `/uploads/${req.body.folder || 'products'}/${f.filename}`);
    const combinedGallery = [...parsedExistingGallery, ...newGalleryPaths];
    const galleryJson = combinedGallery.length > 0 ? JSON.stringify(combinedGallery) : null;

    let image = null;
    if (coverFile) {
      image = `/uploads/${req.body.folder || 'products'}/${coverFile.filename}`;
    } else if (req.body.image) {
      image = req.body.image;
    } else if (combinedGallery.length > 0) {
      image = combinedGallery[0];
    }

    let specsJson = null;
    if (specs) {
      specsJson = typeof specs === 'string' ? specs : JSON.stringify(specs);
    }
    let fullSpecsJson = null;
    if (full_specs) {
      fullSpecsJson = typeof full_specs === 'string' ? full_specs : JSON.stringify(full_specs);
    }

    const [result] = await pool.execute(
      `INSERT INTO products
         (model_code, category, badge, badge_color, image, gallery,
          title_id, title_en, short_desc_id, short_desc_en,
          specs, full_specs, diagram_type, status, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        model_code, category || 'headunit',
        badge || null, badge_color || null, image, galleryJson,
        title_id, title_en,
        short_desc_id || null, short_desc_en || null,
        specsJson, fullSpecsJson,
        diagram_type || 'infotainment',
        status !== undefined ? Number(status) : 1,
        sort_order || 0,
      ]
    );

    await logActivity(req.user.id, 'CREATE', 'products', `Membuat produk baru '${model_code}'`);
    return success(res, 'Produk berhasil dibuat.', { id: result.insertId, model_code, image, gallery: combinedGallery }, 201);
  } catch (err) { next(err); }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      model_code, category, badge, badge_color,
      title_id, title_en, short_desc_id, short_desc_en,
      specs, full_specs, diagram_type, status, sort_order,
      remove_image, existing_gallery,
    } = req.body;

    const coverFile = req.files?.image?.[0] || req.file;
    const galleryFiles = req.files?.gallery || [];

    let parsedExistingGallery = [];
    if (existing_gallery !== undefined) {
      try {
        parsedExistingGallery = typeof existing_gallery === 'string' ? JSON.parse(existing_gallery) : existing_gallery;
      } catch (e) {
        parsedExistingGallery = [];
      }
    }

    const newGalleryPaths = galleryFiles.map(f => `/uploads/${req.body.folder || 'products'}/${f.filename}`);
    const combinedGallery = [...parsedExistingGallery, ...newGalleryPaths];
    const galleryJson = (existing_gallery !== undefined || galleryFiles.length > 0)
      ? (combinedGallery.length > 0 ? JSON.stringify(combinedGallery) : null)
      : undefined;

    let specsJson = null;
    if (specs) {
      specsJson = typeof specs === 'string' ? specs : JSON.stringify(specs);
    }
    let fullSpecsJson = null;
    if (full_specs) {
      fullSpecsJson = typeof full_specs === 'string' ? full_specs : JSON.stringify(full_specs);
    }

    let extraUpdates = '';
    let params = [
      model_code, category || 'headunit',
      badge || null, badge_color || null,
      title_id, title_en,
      short_desc_id || null, short_desc_en || null,
      specsJson, fullSpecsJson,
      diagram_type || 'infotainment',
      status !== undefined ? Number(status) : 1,
      sort_order || 0,
    ];

    if (coverFile) {
      const imagePath = `/uploads/${req.body.folder || 'products'}/${coverFile.filename}`;
      extraUpdates += ', image = ?';
      params.push(imagePath);
    } else if (remove_image === 'true' || remove_image === '1') {
      extraUpdates += ', image = NULL';
    } else if (req.body.image !== undefined) {
      extraUpdates += ', image = ?';
      params.push(req.body.image || null);
    }

    if (galleryJson !== undefined) {
      extraUpdates += ', gallery = ?';
      params.push(galleryJson);
    }

    params.push(id);

    await pool.execute(
      `UPDATE products SET
         model_code = ?, category = ?, badge = ?, badge_color = ?,
         title_id = ?, title_en = ?,
         short_desc_id = ?, short_desc_en = ?,
         specs = ?, full_specs = ?,
         diagram_type = ?, status = ?, sort_order = ?
         ${extraUpdates}
       WHERE id = ?`,
      params
    );

    await logActivity(req.user.id, 'UPDATE', 'products', `Memperbarui produk ID: ${id} (${model_code})`);
    return success(res, 'Produk berhasil diperbarui.');
  } catch (err) { next(err); }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch product first to delete associated image files from disk
    const [rows] = await pool.execute('SELECT image, gallery FROM products WHERE id = ?', [id]);
    if (rows.length > 0) {
      const prod = rows[0];
      if (prod.image) {
        deleteFileIfLocal(prod.image);
      }
      if (prod.gallery) {
        try {
          const galleryArr = typeof prod.gallery === 'string' ? JSON.parse(prod.gallery) : prod.gallery;
          if (Array.isArray(galleryArr)) {
            galleryArr.forEach(imgPath => deleteFileIfLocal(imgPath));
          }
        } catch (e) {
          // ignore parse errors
        }
      }
    }

    await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    await logActivity(req.user.id, 'DELETE', 'products', `Menghapus produk ID: ${id}`);
    return success(res, 'Produk berhasil dihapus.');
  } catch (err) { next(err); }
};


module.exports = {
  getAdminCoreValues, createCoreValue, updateCoreValue, deleteCoreValue,
  getAdminGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem,
  getAdminJobCategories, createJobCategory, updateJobCategory, deleteJobCategory,
  getAdminBenefits, createBenefit, updateBenefit, deleteBenefit,
  getAdminPrograms, createProgram, updateProgram, deleteProgram,
  getAdminFaqs, createFaq, updateFaq, deleteFaq,
  getAdminProducts, createProduct, updateProduct, deleteProduct,
  getActivityLogs,
};
