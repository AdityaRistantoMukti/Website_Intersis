const { body } = require('express-validator');

// Company Profile Rules
const companyProfileRules = [
  body('title')
    .notEmpty()
    .withMessage('Judul profil perusahaan wajib diisi.')
    .isLength({ max: 150 })
    .withMessage('Judul maksimal 150 karakter.')
    .trim(),
  body('description').optional().trim(),
  body('vision').optional().trim(),
  body('mission').optional().trim(),
];

// Core Value Rules
const coreValueRules = [
  body('title')
    .notEmpty()
    .withMessage('Judul core value wajib diisi.')
    .isLength({ max: 100 })
    .withMessage('Judul maksimal 100 karakter.')
    .trim(),
  body('description').optional().trim(),
  body('icon').optional().trim(),
  body('sort_order').optional().isInt({ min: 0 }).withMessage('Sort order harus angka positif.'),
  body('status').optional().isIn([0, 1, '0', '1']).withMessage('Status harus 1 (aktif) atau 0 (nonaktif).'),
];

// Gallery Rules
const galleryRules = [
  body('title')
    .notEmpty()
    .withMessage('Judul galeri foto wajib diisi.')
    .isLength({ max: 150 })
    .withMessage('Judul maksimal 150 karakter.')
    .trim(),
  body('description').optional().trim(),
  body('category').optional().isLength({ max: 100 }).trim(),
  body('event_date').optional().isISO8601().withMessage('Format tanggal tidak valid (YYYY-MM-DD).'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status harus active atau inactive.'),
];

// Job Category Rules
const jobCategoryRules = [
  body('name')
    .notEmpty()
    .withMessage('Nama kategori wajib diisi.')
    .isLength({ max: 100 })
    .withMessage('Nama kategori maksimal 100 karakter.')
    .trim(),
  body('description').optional().trim(),
  body('status').optional().isIn([0, 1, '0', '1']).withMessage('Status harus 1 (aktif) atau 0 (nonaktif).'),
];

// Benefit Rules
const benefitRules = [
  body('title')
    .notEmpty()
    .withMessage('Judul benefit wajib diisi.')
    .isLength({ max: 150 })
    .withMessage('Judul maksimal 150 karakter.')
    .trim(),
  body('description').optional().trim(),
  body('icon').optional().trim(),
  body('sort_order').optional().isInt({ min: 0 }).withMessage('Sort order harus angka positif.'),
  body('status').optional().isIn([0, 1, '0', '1']).withMessage('Status harus 1 (aktif) atau 0 (nonaktif).'),
];

// Program Rules
const programRules = [
  body('title')
    .notEmpty()
    .withMessage('Nama program wajib diisi.')
    .isLength({ max: 150 })
    .withMessage('Nama program maksimal 150 karakter.')
    .trim(),
  body('slug')
    .optional()
    .isSlug()
    .withMessage('Slug harus berupa format URL friendly (misal: management-trainee-2026).'),
  body('description').optional().trim(),
  body('requirements').optional().trim(),
  body('registration_url').optional().isURL().withMessage('URL pendaftaran tidak valid.'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status harus active atau inactive.'),
];

// FAQ Rules
const faqRules = [
  body('question')
    .notEmpty()
    .withMessage('Pertanyaan FAQ wajib diisi.')
    .isLength({ max: 255 })
    .withMessage('Pertanyaan maksimal 255 karakter.')
    .trim(),
  body('answer')
    .notEmpty()
    .withMessage('Jawaban FAQ wajib diisi.')
    .trim(),
  body('sort_order').optional().isInt({ min: 0 }).withMessage('Sort order harus angka positif.'),
  body('status').optional().isIn([0, 1, '0', '1']).withMessage('Status harus 1 (aktif) atau 0 (nonaktif).'),
];

// Contact Recruitment Rules
const contactRules = [
  body('email').optional().isEmail().withMessage('Format email tidak valid.').normalizeEmail(),
  body('phone').optional().trim(),
  body('address').optional().trim(),
  body('instagram').optional().trim(),
  body('linkedin').optional().trim(),
  body('whatsapp').optional().trim(),
];

module.exports = {
  companyProfileRules,
  coreValueRules,
  galleryRules,
  jobCategoryRules,
  benefitRules,
  programRules,
  faqRules,
  contactRules,
};
