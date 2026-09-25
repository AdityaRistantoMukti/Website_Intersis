/**
 * Consistent API response helpers
 * Semua endpoint wajib menggunakan fungsi ini agar format response konsisten.
 */

const success = (res, message, data = null, statusCode = 200) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  return res.status(statusCode).json(payload);
};

const paginated = (res, message, data, pagination) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

const error = (res, message, statusCode = 500, errors = null) => {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

const validationError = (res, errors) => {
  return res.status(422).json({
    success: false,
    message: 'Validasi gagal. Periksa kembali data yang dikirim.',
    errors,
  });
};

module.exports = { success, paginated, error, validationError };
