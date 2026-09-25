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
 * Mendapatkan informasi kontak tim rekrutmen (singleton)
 */
const getContact = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, email, phone, address, instagram, linkedin, whatsapp, updated_at FROM contact_recruitment LIMIT 1'
    );
    if (rows.length === 0) {
      return success(res, 'Kontak rekrutmen belum diatur.', null);
    }
    return success(res, 'Data kontak rekrutmen berhasil diambil.', rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCompanyProfile, getCoreValues, getContact };
