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
    // Izinkan request tanpa origin (seperti Postman/mobile), allowedOrigins, IP LAN lokal, atau domain vercel.app
    const isLocalNetwork = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/.test(origin);
    const isVercel = /^https?:\/\/([a-zA-Z0-9-]+\.)?vercel\.app$/.test(origin);
    if (!origin || allowedOrigins.includes(origin) || isLocalNetwork || isVercel) {
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

// Serve file statis untuk folder uploads dan images
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Fallback jika file tersimpan di general tetapi direquest pada subfolder lain (misal /uploads/about/:filename)
app.use('/uploads/:folder/:filename', (req, res, next) => {
  const { folder, filename } = req.params;
  const targetFolder = folder === 'about' ? 'general' : 'about';
  const altPath = path.join(uploadsPath, targetFolder, filename);
  if (require('fs').existsSync(altPath)) {
    return res.sendFile(altPath);
  }
  next();
});

// Fallback serve static images jika diakses langsung melalui backend port 3000
const backendImagesPath = path.join(__dirname, '../uploads/images');
const frontendImagesPath = path.join(__dirname, '../../frontend/public/images');
if (require('fs').existsSync(backendImagesPath)) {
  app.use('/images', express.static(backendImagesPath));
} else if (require('fs').existsSync(frontendImagesPath)) {
  app.use('/images', express.static(frontendImagesPath));
}

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
