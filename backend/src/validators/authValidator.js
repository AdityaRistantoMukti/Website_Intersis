const { body } = require('express-validator');

const loginValidationRules = [
  body('identity')
    .notEmpty()
    .withMessage('Username atau email wajib diisi.')
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('Password wajib diisi.')
    .trim(),
];

const changePasswordRules = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Password saat ini wajib diisi.'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password baru minimal 6 karakter.'),
];

module.exports = { loginValidationRules, changePasswordRules };
