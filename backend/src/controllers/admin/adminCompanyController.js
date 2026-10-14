const pool = require('../../config/database');
const { success, error } = require('../../utils/response');
const { logActivity } = require('../../utils/activityLogger');
const { deleteFileIfLocal } = require('../../utils/fileCleanup');

/**
 * PUT /api/admin/company
 * Update Profil Perusahaan (Singleton)
 */
const updateCompanyProfile = async (req, res, next) => {
  try {
    const { title, description, vision, mission, title_en, description_en, vision_en, mission_en } = req.body;
    let about_image = req.body.about_image;

    if (req.file) {
      about_image = `/uploads/${req.body.folder || 'company'}/${req.file.filename}`;
    }

    const [rows] = await pool.execute('SELECT id, about_image FROM company_profile LIMIT 1');

    if (req.file && rows.length > 0 && rows[0].about_image) {
      deleteFileIfLocal(rows[0].about_image);
    }

    if (rows.length === 0) {
      await pool.execute(
        'INSERT INTO company_profile (title, title_en, description, description_en, vision, vision_en, mission, mission_en, about_image, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [title, title_en || null, description, description_en || null, vision, vision_en || null, mission, mission_en || null, about_image, req.user.id]
      );
    } else {
      const companyId = rows[0].id;
      let updateSql = 'UPDATE company_profile SET title = ?, title_en = ?, description = ?, description_en = ?, vision = ?, vision_en = ?, mission = ?, mission_en = ?, updated_by = ?';
      let params = [title, title_en || null, description, description_en || null, vision, vision_en || null, mission, mission_en || null, req.user.id];

      if (about_image) {
        updateSql += ', about_image = ?';
        params.push(about_image);
      }

      updateSql += ' WHERE id = ?';
      params.push(companyId);

      await pool.execute(updateSql, params);
    }

    await logActivity(req.user.id, 'UPDATE', 'company_profile', 'Memperbarui data profil, visi, dan misi perusahaan (ID & EN)');

    return success(res, 'Profil perusahaan berhasil diperbarui.');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/contact
 * Update Informasi Kontak & Google Maps (Singleton)
 */
const updateContact = async (req, res, next) => {
  try {
    const {
      email,
      phone,
      address,
      address_en,
      instagram,
      linkedin,
      whatsapp,
      maps_latitude,
      maps_longitude,
      maps_place_name,
      maps_url,
      maps_embed_url,
    } = req.body;

    const [rows] = await pool.execute('SELECT id FROM contact_recruitment LIMIT 1');

    if (rows.length === 0) {
      await pool.execute(
        `INSERT INTO contact_recruitment (
          email, phone, address, address_en, instagram, linkedin, whatsapp,
          maps_latitude, maps_longitude, maps_place_name, maps_url, maps_embed_url, updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          email, phone, address, address_en || null, instagram, linkedin, whatsapp,
          maps_latitude || '1.1368003',
          maps_longitude || '104.0452514',
          maps_place_name || 'GLOBAL PHILSONIC TECHNOLOGIES',
          maps_url || null,
          maps_embed_url || null,
          req.user.id,
        ]
      );
    } else {
      const contactId = rows[0].id;
      await pool.execute(
        `UPDATE contact_recruitment SET
          email = ?, phone = ?, address = ?, address_en = ?, instagram = ?, linkedin = ?, whatsapp = ?,
          maps_latitude = ?, maps_longitude = ?, maps_place_name = ?, maps_url = ?, maps_embed_url = ?,
          updated_by = ?
        WHERE id = ?`,
        [
          email, phone, address, address_en || null, instagram, linkedin, whatsapp,
          maps_latitude || '1.1368003',
          maps_longitude || '104.0452514',
          maps_place_name || 'GLOBAL PHILSONIC TECHNOLOGIES',
          maps_url || null,
          maps_embed_url || null,
          req.user.id,
          contactId,
        ]
      );
    }

    await logActivity(req.user.id, 'UPDATE', 'contact_recruitment', 'Memperbarui informasi kontak dan peta lokasi Batam');

    return success(res, 'Kontak dan peta lokasi berhasil diperbarui.');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/site-settings/:key
 * Menyimpan konfigurasi konten halaman (Home hero, stats, CTA, dll)
 */
const updateSiteSettings = async (req, res, next) => {
  try {
    const { key } = req.params;
    const content = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    // Best Practice Asset Cleanup: If updating site_branding, check if old files need to be deleted
    if (key === 'site_branding') {
      try {
        const [oldRows] = await pool.execute('SELECT content_json FROM site_settings WHERE key_name = ?', [key]);
        if (oldRows.length > 0 && oldRows[0].content_json) {
          const oldData = typeof oldRows[0].content_json === 'string' ? JSON.parse(oldRows[0].content_json) : oldRows[0].content_json;
          const newData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

          // If new logo is different and old logo was an uploaded file, delete old file
          if (oldData.logo_url && newData.logo_url && oldData.logo_url !== newData.logo_url && oldData.logo_url.startsWith('/uploads/')) {
            deleteFileIfLocal(oldData.logo_url);
          }

          // If new favicon is different and old favicon was an uploaded file, delete old file
          if (oldData.favicon_url && newData.favicon_url && oldData.favicon_url !== newData.favicon_url && oldData.favicon_url.startsWith('/uploads/')) {
            deleteFileIfLocal(oldData.favicon_url);
          }
        }
      } catch (err) {
        console.error('[SITE BRANDING CLEANUP ERROR]', err.message);
      }
    }

    await pool.execute(
      `INSERT INTO site_settings (key_name, content_json, updated_by)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE content_json = ?, updated_by = ?`,
      [key, content, req.user.id, content, req.user.id]
    );

    await logActivity(req.user.id, 'UPDATE', 'site_settings', `Memperbarui konfigurasi konten '${key}'`);

    return success(res, `Pengaturan '${key}' berhasil disimpan.`);
  } catch (err) {
    next(err);
  }
};

module.exports = { updateCompanyProfile, updateContact, updateSiteSettings };

