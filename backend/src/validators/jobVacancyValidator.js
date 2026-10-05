const { body } = require('express-validator');

const jobVacancyRules = [
  body('category_id')
    .notEmpty()
    .withMessage('Kategori lowongan wajib dipilih.')
    .isInt()
    .withMessage('ID Kategori harus berupa angka integer.'),
  body('title')
    .notEmpty()
    .withMessage('Judul posisi lowongan wajib diisi.')
    .isLength({ max: 150 })
    .withMessage('Judul posisi maksimal 150 karakter.')
    .trim(),
  body('location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Lokasi penempatan maksimal 100 karakter.')
    .trim(),
  body('employment_type')
    .notEmpty()
    .withMessage('Tipe pekerjaan (Employment Type) wajib diisi.')
    .customSanitizer((val) => {
      if (!val) return val;
      if (val === 'FullTime') return 'Full Time';
      if (val === 'PartTime') return 'Part Time';
      return val;
    })
    .isIn(['Full Time', 'Part Time', 'Internship', 'Contract', 'OJT'])
    .withMessage('Tipe pekerjaan harus salah satu dari: Full Time, Part Time, Internship, Contract, OJT.'),
  body('description')
    .optional()
    .trim(),
  body('responsibilities')
    .optional()
    .trim(),
  body('requirements')
    .optional()
    .trim(),
  body('form_url')
    .optional()
    .isURL()
    .withMessage('URL Google Form (Apply Now) tidak valid.'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'closed'])
    .withMessage('Status lowongan harus draft, published, atau closed.'),
];

module.exports = { jobVacancyRules };
