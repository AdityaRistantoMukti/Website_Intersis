const express = require('express');
const router = express.Router();

const { verifyToken, restrictTo } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimiter');
const upload = require('../middlewares/uploadMiddleware');
const validate = require('../validators/validate');

// Validators
const { loginValidationRules, changePasswordRules } = require('../validators/authValidator');
const { createUserRules, updateUserRules } = require('../validators/userValidator');
const { jobVacancyRules } = require('../validators/jobVacancyValidator');
const {
  companyProfileRules,
  coreValueRules,
  galleryRules,
  jobCategoryRules,
  benefitRules,
  programRules,
  faqRules,
  contactRules,
} = require('../validators/contentValidators');

// Controllers
const { login, getProfile, changePassword } = require('../controllers/admin/authController');
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/admin/userController');
const { updateCompanyProfile, updateContact, updateSiteSettings } = require('../controllers/admin/adminCompanyController');
const { translateContent } = require('../controllers/admin/translateController');
const { getAdminJobs, getAdminJobById, createJob, updateJob, deleteJob } = require('../controllers/admin/adminJobVacancyController');
const {
  getAdminCoreValues, createCoreValue, updateCoreValue, deleteCoreValue,
  getAdminGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem,
  getAdminJobCategories, createJobCategory, updateJobCategory, deleteJobCategory,
  getAdminBenefits, createBenefit, updateBenefit, deleteBenefit,
  getAdminPrograms, createProgram, updateProgram, deleteProgram,
  getAdminFaqs, createFaq, updateFaq, deleteFaq,
  getAdminProducts, createProduct, updateProduct, deleteProduct,
  getActivityLogs,
} = require('../controllers/admin/adminContentControllers');

// ─── AUTHENTICATION (PUBLIC ADMIN ENDPOINT) ──────────────────────────────────
router.post('/auth/login', authLimiter, loginValidationRules, validate, login);

// ─── PROTECTED ROUTES (MEMBUTUHKAN JWT TOKEN) ───────────────────────────────
router.use(verifyToken);

// Translation Engine (Auto-Translate ID to EN)
router.post('/translate', restrictTo('administrator', 'hrd', 'staff'), translateContent);

// Profile & Password
router.get('/auth/me', getProfile);
router.put('/auth/change-password', changePasswordRules, validate, changePassword);

// ─── MANAJEMEN USER (ADMINISTRATOR & HRD SAJA) ──────────────────────────────
router.get('/users', restrictTo('administrator', 'hrd'), getUsers);
router.get('/users/:id', restrictTo('administrator', 'hrd'), getUserById);
router.post('/users', restrictTo('administrator', 'hrd'), createUserRules, validate, createUser);
router.put('/users/:id', restrictTo('administrator', 'hrd'), updateUserRules, validate, updateUser);
router.delete('/users/:id', restrictTo('administrator', 'hrd'), deleteUser);

// ─── MANAJEMEN KONTEN WEBSITE (ADMINISTRATOR, HRD, STAFF HRD) ───────────────
// Company Profile, Contact & Site Settings
router.put('/company', restrictTo('administrator', 'hrd', 'staff'), upload.single('about_image'), companyProfileRules, validate, updateCompanyProfile);
router.put('/contact', restrictTo('administrator', 'hrd', 'staff'), contactRules, validate, updateContact);
router.put('/site-settings/:key', restrictTo('administrator', 'hrd', 'staff'), updateSiteSettings);


// Core Values
router.get('/core-values', getAdminCoreValues);
router.post('/core-values', restrictTo('administrator', 'hrd', 'staff'), coreValueRules, validate, createCoreValue);
router.put('/core-values/:id', restrictTo('administrator', 'hrd', 'staff'), coreValueRules, validate, updateCoreValue);
router.delete('/core-values/:id', restrictTo('administrator', 'hrd', 'staff'), deleteCoreValue);

// Gallery
router.get('/gallery', getAdminGallery);
router.post('/gallery', restrictTo('administrator', 'hrd', 'staff'), upload.single('image'), galleryRules, validate, createGalleryItem);
router.put('/gallery/:id', restrictTo('administrator', 'hrd', 'staff'), upload.single('image'), galleryRules, validate, updateGalleryItem);
router.delete('/gallery/:id', restrictTo('administrator', 'hrd', 'staff'), deleteGalleryItem);

// Job Categories
router.get('/job-categories', getAdminJobCategories);
router.post('/job-categories', restrictTo('administrator', 'hrd', 'staff'), jobCategoryRules, validate, createJobCategory);
router.put('/job-categories/:id', restrictTo('administrator', 'hrd', 'staff'), jobCategoryRules, validate, updateJobCategory);
router.delete('/job-categories/:id', restrictTo('administrator', 'hrd', 'staff'), deleteJobCategory);

// Job Vacancies
router.get('/jobs', getAdminJobs);
router.get('/jobs/:id', getAdminJobById);
router.post('/jobs', restrictTo('administrator', 'hrd', 'staff'), jobVacancyRules, validate, createJob);
router.put('/jobs/:id', restrictTo('administrator', 'hrd', 'staff'), jobVacancyRules, validate, updateJob);
router.delete('/jobs/:id', restrictTo('administrator', 'hrd', 'staff'), deleteJob);

// Benefits
router.get('/benefits', getAdminBenefits);
router.post('/benefits', restrictTo('administrator', 'hrd', 'staff'), upload.single('image'), benefitRules, validate, createBenefit);
router.put('/benefits/:id', restrictTo('administrator', 'hrd', 'staff'), upload.single('image'), benefitRules, validate, updateBenefit);
router.delete('/benefits/:id', restrictTo('administrator', 'hrd', 'staff'), deleteBenefit);

// Programs
router.get('/programs', getAdminPrograms);
router.post('/programs', restrictTo('administrator', 'hrd', 'staff'), upload.single('image'), programRules, validate, createProgram);
router.put('/programs/:id', restrictTo('administrator', 'hrd', 'staff'), upload.single('image'), programRules, validate, updateProgram);
router.delete('/programs/:id', restrictTo('administrator', 'hrd', 'staff'), deleteProgram);

// FAQs
router.get('/faqs', getAdminFaqs);
router.post('/faqs', restrictTo('administrator', 'hrd', 'staff'), faqRules, validate, createFaq);
router.put('/faqs/:id', restrictTo('administrator', 'hrd', 'staff'), faqRules, validate, updateFaq);
router.delete('/faqs/:id', restrictTo('administrator', 'hrd', 'staff'), deleteFaq);

// ─── AUDIT TRAIL / LOG AKTIVITAS (ADMINISTRATOR & HRD) ──────────────────────
router.get('/logs', restrictTo('administrator', 'hrd'), getActivityLogs);

// ─── TELEMETRY & RFQ INQUIRIES STATS ──────────────────────────────────────────
const { getTelemetryStats } = require('../controllers/telemetryController');
router.get('/telemetry', restrictTo('administrator', 'hrd', 'staff'), getTelemetryStats);

// ─── MANAJEMEN PRODUK (CATALOG PRODUK GPT) ───────────────────────────────────
router.get('/products',          getAdminProducts);
router.post('/products',         restrictTo('administrator', 'hrd', 'staff'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), createProduct);
router.put('/products/:id',      restrictTo('administrator', 'hrd', 'staff'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }]), updateProduct);
router.delete('/products/:id',   restrictTo('administrator', 'hrd', 'staff'), deleteProduct);

module.exports = router;
