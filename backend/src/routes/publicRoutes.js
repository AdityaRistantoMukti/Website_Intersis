const express = require('express');
const router = express.Router();

const { getCompanyProfile, getCoreValues, getContact } = require('../controllers/public/publicCompanyController');
const { getJobCategories, getJobVacancies, getJobVacancyById } = require('../controllers/public/publicJobController');
const { getGalleryItems } = require('../controllers/public/publicGalleryController');
const { getBenefits } = require('../controllers/public/publicBenefitController');
const { getPrograms, getProgramBySlug } = require('../controllers/public/publicProgramController');
const { getFaqs } = require('../controllers/public/publicFaqController');
const { apiLimiter } = require('../middlewares/rateLimiter');

// Terapkan rate limiter untuk semua endpoint publik
router.use(apiLimiter);

// Company & Core Values & Contact
router.get('/company', getCompanyProfile);
router.get('/core-values', getCoreValues);
router.get('/contact', getContact);

// Job Vacancies & Categories
router.get('/job-categories', getJobCategories);
router.get('/jobs', getJobVacancies);
router.get('/jobs/:id', getJobVacancyById);

// Gallery (Life at ISA)
router.get('/gallery', getGalleryItems);

// Benefits & Perks
router.get('/benefits', getBenefits);

// Programs (Internship, MT, OJT)
router.get('/programs', getPrograms);
router.get('/programs/:slugOrId', getProgramBySlug);

// FAQs
router.get('/faqs', getFaqs);

module.exports = router;
