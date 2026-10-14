const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const inputHtmlPath = path.join(__dirname, 'laporan_evaluasi_simple.html');
const outputPathHtml = path.join(__dirname, 'laporan_evaluasi.html');
const outputPathPdf = path.join(__dirname, 'LAPORAN_EVALUASI_DAN_REKOMENDASI_WEBSITE_GPT.pdf');

// Read clean simplified HTML
const htmlContent = fs.readFileSync(inputHtmlPath, 'utf8');

// Sync to laporan_evaluasi.html
fs.writeFileSync(outputPathHtml, htmlContent, 'utf8');
console.log('laporan_evaluasi.html updated from laporan_evaluasi_simple.html');

// If old PDF exists, delete it first
if (fs.existsSync(outputPathPdf)) {
  fs.unlinkSync(outputPathPdf);
  console.log('Old PDF deleted successfully.');
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const cmd = `"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${outputPathPdf}" --no-pdf-header-footer "file:///${outputPathHtml.replace(/\\/g, '/')}"`;

try {
  console.log('Generating new clean executive PDF...');
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(outputPathPdf)) {
    const stats = fs.statSync(outputPathPdf);
    console.log('SUCCESS! New PDF generated at:', outputPathPdf);
    console.log('File Size:', (stats.size / 1024).toFixed(2), 'KB');
  } else {
    console.error('PDF file was not found after execution.');
  }
} catch (err) {
  console.error('Execution error:', err);
}
