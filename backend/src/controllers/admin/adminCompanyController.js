const pool = require('../../config/database');
const { success, error } = require('../../utils/response');
const { logActivity } = require('../../utils/activityLogger');

/**
 * PUT /api/admin/company
 * Update Profil Perusahaan (Singleton)
 */
const updateCompanyProfile = async (req, res, next) => {
  try {
    const { title, description, vision, mission } = req.body;
    let about_image = req.body.about_image;

    if (req.file) {
      about_image = `/uploads/${req.body.folder || 'company'}/${req.file.filename}`;
    }

    const [rows] = await pool.execute('SELECT id FROM company_profile LIMIT 1');

    if (rows.length === 0) {
      await pool.execute(
        'INSERT INTO company_profile (title, description, vision, mission, about_image, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, vision, mission, about_image, req.user.id]
      );
    } else {
      const companyId = rows[0].id;
      let updateSql = 'UPDATE company_profile SET title = ?, description = ?, vision = ?, mission = ?, updated_by = ?';
      let params = [title, description, vision, mission, req.user.id];

      if (about_image) {
        updateSql += ', about_image = ?';
        params.push(about_image);
      }

      updateSql += ' WHERE id = ?';
      params.push(companyId);

      await pool.execute(updateSql, params);
    }

    await logActivity(req.user.id, 'UPDATE', 'company_profile', 'Memperbarui data profil, visi, dan misi perusahaan');

    return success(res, 'Profil perusahaan berhasil diperbarui.');
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/contact
 * Update Informasi Kontak Rekrutmen (Singleton)
 */
const updateContact = async (req, res, next) => {
  try {
    const { email, phone, address, instagram, linkedin, whatsapp } = req.body;

    const [rows] = await pool.execute('SELECT id FROM contact_recruitment LIMIT 1');

    if (rows.length === 0) {
      await pool.execute(
        'INSERT INTO contact_recruitment (email, phone, address, instagram, linkedin, whatsapp, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [email, phone, address, instagram, linkedin, whatsapp, req.user.id]
      );
    } else {
      const contactId = rows[0].id;
      await pool.execute(
        'UPDATE contact_recruitment SET email = ?, phone = ?, address = ?, instagram = ?, linkedin = ?, whatsapp = ?, updated_by = ? WHERE id = ?',
        [email, phone, address, instagram, linkedin, whatsapp, req.user.id, contactId]
      );
    }

    await logActivity(req.user.id, 'UPDATE', 'contact_recruitment', 'Memperbarui informasi kontak rekrutmen');

    return success(res, 'Kontak rekrutmen berhasil diperbarui.');
  } catch (err) {
    next(err);
  }
};

module.exports = { updateCompanyProfile, updateContact };
