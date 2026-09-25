const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const pool = require('./config/database');
const routes = require('./routes');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── 1. SECURITY & MIDDLEWARES ───────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Agar static files upload bisa diakses oleh frontend
}));

// Setup CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: (origin, callback) => {
    // Izinkan request tanpa origin (seperti Postman, curl, atau mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Error: Origin '${origin}' tidak diizinkan.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve file statis untuk folder uploads
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// ─── 2. ROUTES ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ISA Career & HRD Website REST API Status: ONLINE 🚀',
    version: '1.0.0',
    documentation: '/api/public/company',
  });
});

app.get('/health', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    conn.release();
    res.json({ status: 'UP', database: 'CONNECTED', timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ status: 'DOWN', database: err.message, timestamp: new Date() });
  }
});

// Bind main API router
app.use('/api', routes);

// ─── 3. ERROR HANDLING ───────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(globalErrorHandler);

// ─── 4. START SERVER ─────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 ISA Career REST API Server running on port ${PORT}`);
    console.log(`🌐 Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`📁 Uploads Dir : ${uploadsPath}`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
