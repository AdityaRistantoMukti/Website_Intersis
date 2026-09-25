const { body } = require('express-validator');

const createUserRules = [
  body('name')
    .notEmpty()
    .withMessage('Nama pengguna wajib diisi.')
    .isLength({ max: 100 })
    .withMessage('Nama pengguna maksimal 100 karakter.')
    .trim(),
  body('username')
    .notEmpty()
    .withMessage('Username wajib diisi.')
    .isAlphanumeric('en-US', { ignore: '_.' })
    .withMessage('Username hanya boleh berisi huruf, angka, underscore, dan titik.')
    .isLength({ min: 4, max: 50 })
    .withMessage('Username harus antara 4 - 50 karakter.')
    .trim(),
  body('email')
    .notEmpty()
    .withMessage('Email wajib diisi.')
    .isEmail()
    .withMessage('Format email tidak valid.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password wajib diisi.')
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter.'),
  body('role')
    .notEmpty()
    .withMessage('Role wajib diisi.')
    .isIn(['administrator', 'hrd', 'staff'])
    .withMessage('Role harus salah satu dari: administrator, hrd, atau staff.'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status harus active atau inactive.'),
];

const updateUserRules = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Nama pengguna tidak boleh kosong.')
    .isLength({ max: 100 })
    .withMessage('Nama pengguna maksimal 100 karakter.')
    .trim(),
  body('username')
    .optional()
    .isAlphanumeric('en-US', { ignore: '_.' })
    .withMessage('Username hanya boleh berisi huruf, angka, underscore, dan titik.')
    .isLength({ min: 4, max: 50 })
    .withMessage('Username harus antara 4 - 50 karakter.')
    .trim(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Format email tidak valid.')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter.'),
  body('role')
    .optional()
    .isIn(['administrator', 'hrd', 'staff'])
    .withMessage('Role harus salah satu dari: administrator, hrd, atau staff.'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status harus active atau inactive.'),
];

module.exports = { createUserRules, updateUserRules };
