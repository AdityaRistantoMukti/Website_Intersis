const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlPath = path.join(__dirname, 'Dokumentasi_Project', 'dokumentasi_lengkap_sistem.html');
const pdfPath1 = path.join(__dirname, 'Dokumentasi_Project', 'DOKUMENTASI_LENGKAP_WEBSITE_GPT_INTERSIS.pdf');
const pdfPath2 = path.join(__dirname, 'DOKUMENTASI_LENGKAP_WEBSITE_GPT_INTERSIS.pdf');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

const cmd = `"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath1}" --no-pdf-header-footer "${fileUrl}"`;

console.log('Generating PDF from:', htmlPath);
try {
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(pdfPath1)) {
    fs.copyFileSync(pdfPath1, pdfPath2);
    const stats = fs.statSync(pdfPath1);
    console.log('SUCCESS! PDF generated successfully:');
    console.log('Location 1:', pdfPath1);
    console.log('Location 2:', pdfPath2);
    console.log('Size:', (stats.size / 1024).toFixed(2), 'KB');
  } else {
    console.error('PDF file was not created.');
  }
} catch (err) {
  console.error('Error running Chrome:', err);
}
