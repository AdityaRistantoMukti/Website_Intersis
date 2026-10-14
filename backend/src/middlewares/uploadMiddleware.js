const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subFolder = req.body.folder || 'general';
    const targetPath = path.join(uploadDir, subFolder);
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }
    cb(null, targetPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${cleanName}_${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|svg|ico/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype) ||
    file.mimetype === 'image/x-icon' ||
    file.mimetype === 'image/vnd.microsoft.icon' ||
    file.mimetype === 'image/ico';

  if (extName && (mimeType || path.extname(file.originalname).toLowerCase() === '.ico')) {
    return cb(null, true);
  }
  cb(new Error('Format file tidak didukung! Hanya diperbolehkan file gambar (JPG, PNG, WEBP, SVG, ICO).'));
};

const upload = multer({
  storage,
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB || '5')) * 1024 * 1024, // Default 5MB
  },
  fileFilter,
});

module.exports = upload;
