const express = require('express');
const router = express.Router();

const publicRoutes = require('./publicRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/public', publicRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
