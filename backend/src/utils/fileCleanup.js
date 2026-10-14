const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../../../uploads');

/**
 * Safely delete a file from the uploads directory if it is a local upload
 * Prevents directory traversal attacks and protects non-upload system files
 * @param {string} filePath - File path like '/uploads/branding/logo_123.png'
 */
const deleteFileIfLocal = (filePath) => {
  if (!filePath || typeof filePath !== 'string') return;

  // Only target files within /uploads/
  if (filePath.startsWith('/uploads/')) {
    const relativePart = filePath.replace(/^\/uploads\//, '');
    const absolutePath = path.resolve(uploadDir, relativePart);

    // Security check: ensure path is strictly within uploadDir
    if (!absolutePath.startsWith(path.resolve(uploadDir))) {
      console.warn(`[FILE CLEANUP BLOCKED] Attempted traversal attack: ${filePath}`);
      return;
    }

    if (fs.existsSync(absolutePath)) {
      try {
        fs.unlinkSync(absolutePath);
        console.log(`[FILE CLEANUP] Successfully deleted unused asset: ${absolutePath}`);
      } catch (err) {
        console.error(`[FILE CLEANUP ERROR] Failed to delete ${absolutePath}:`, err.message);
      }
    }
  }
};

module.exports = { deleteFileIfLocal };
