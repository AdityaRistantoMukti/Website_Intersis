const pool = require('../../config/database');
const { success, error } = require('../../utils/response');

/**
 * GET /api/public/company
 * Mendapatkan data profil perusahaan (singleton - baris pertama)
 */
const getCompanyProfile = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, title, description, vision, mission, about_image, updated_at FROM company_profile LIMIT 1'
    );
    if (rows.length === 0) {
      return success(res, 'Profil perusahaan belum diatur.', null);
    }
    return success(res, 'Data profil perusahaan berhasil diambil.', rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/public/core-values
 * Mendapatkan daftar core values yang aktif
 */
const getCoreValues = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, title, description, icon, sort_order FROM core_values WHERE status = 1 ORDER BY sort_order ASC, id ASC'
    );
    return success(res, 'Data core values berhasil diambil.', rows);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/public/contact
 * Mendapatkan informasi kontak dan lokasi Google Maps pabrik (singleton)
 */
const getContact = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT
        id, email, phone, address, instagram, linkedin, whatsapp,
        maps_latitude, maps_longitude, maps_place_name, maps_url, maps_embed_url, updated_at
       FROM contact_recruitment LIMIT 1`
    );
    if (rows.length === 0) {
      return success(res, 'Kontak belum diatur.', null);
    }
    return success(res, 'Data kontak berhasil diambil.', rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/public/site-settings (atau /:key)
 * Mengambil setting konten landing page
 */
const getSiteSettings = async (req, res, next) => {
  try {
    const { key } = req.params;
    if (key) {
      const [rows] = await pool.execute('SELECT * FROM site_settings WHERE key_name = ?', [key]);
      if (rows.length === 0) {
        return success(res, 'Setting tidak ditemukan.', null);
      }
      let content = rows[0].content_json;
      try { content = JSON.parse(content); } catch (e) {}
      return success(res, 'Setting berhasil diambil.', content);
    }

    const [rows] = await pool.execute('SELECT * FROM site_settings');
    const settingsMap = {};
    rows.forEach((r) => {
      try {
        settingsMap[r.key_name] = JSON.parse(r.content_json);
      } catch (e) {
        settingsMap[r.key_name] = r.content_json;
      }
    });
    return success(res, 'Daftar settings berhasil diambil.', settingsMap);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCompanyProfile, getCoreValues, getContact, getSiteSettings };

