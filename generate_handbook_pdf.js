const puppeteer = require('./frontend/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

async function generate() {
  const htmlPath = path.join(__dirname, 'Dokumentasi_Per_BAB', 'html_sources', 'PANDUAN_PENGETAHUAN_TEKNIKAL_DAN_GLOSARIUM.html');
  const outputPath = path.join(__dirname, 'Dokumentasi_Per_BAB', 'PANDUAN_PENGETAHUAN_TEKNIS_DAN_GLOSARIUM_WEBSITE.pdf');
  const rootOutputPath = path.join(__dirname, 'PANDUAN_PENGETAHUAN_TEKNIS_DAN_GLOSARIUM_WEBSITE.pdf');

  console.log('Loading HTML:', htmlPath);

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {
    waitUntil: 'networkidle0'
  });

  await page.pdf({
    path: outputPath,
    format: 'A4',
    margin: {
      top: '16mm',
      bottom: '16mm',
      left: '16mm',
      right: '16mm'
    },
    printBackground: true,
    displayHeaderFooter: false
  });

  await browser.close();

  // Also copy to root directory for easy access
  fs.copyFileSync(outputPath, rootOutputPath);

  const stats = fs.statSync(outputPath);
  console.log('✅ SUCCESS! PDF generated successfully:');
  console.log('File 1:', outputPath);
  console.log('File 2:', rootOutputPath);
  console.log('Size:', (stats.size / 1024).toFixed(2), 'KB');
}

generate().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
