/**
 * Builder for Document 15:
 * 15_Cakupan_Sitemap_Lengkap_Website_Publik_dan_Dashboard_Admin.pdf
 */

const path = require('path');
const fs = require('fs');
const puppeteer = require('../../frontend/node_modules/puppeteer-core');
const { generateReportHtmlShell } = require('./doc_template');
const docFullSitemapCoverage = require('./doc_full_sitemap_coverage');

async function run() {
  console.log('====================================================');
  console.log('🚀 MEMULAI GENERASI DOKUMEN 15 (CAKUPAN SITEMAP LENGKAP)');
  console.log('====================================================');

  const baseDir = path.join(__dirname, '..');
  const htmlDir = path.join(baseDir, 'html_sources');
  const pdfOutputDir = baseDir;

  if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir, { recursive: true });
  }

  const filenamePrefix = '15_Cakupan_Sitemap_Lengkap_Website_Publik_dan_Dashboard_Admin';
  const htmlFilename = `${filenamePrefix}.html`;
  const pdfFilename = `${filenamePrefix}.pdf`;
  const htmlPath = path.join(htmlDir, htmlFilename);
  const pdfPath = path.join(pdfOutputDir, pdfFilename);

  console.log(`\n📄 [1/2] Membuat berkas HTML Dokumen 15...`);
  const fullHtml = generateReportHtmlShell(docFullSitemapCoverage);
  fs.writeFileSync(htmlPath, fullHtml, 'utf8');
  console.log(`  ✓ HTML dibuat: ${htmlFilename}`);

  console.log(`\n🖨️  [2/2] Mengonversi HTML ke PDF Standar A4 via Headless Chrome...`);
  const chromeExecutable = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  if (!fs.existsSync(chromeExecutable)) {
    throw new Error(`Executable Chrome tidak ditemukan di path: ${chromeExecutable}`);
  }

  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

  console.log(`  Merender PDF: ${pdfFilename}...`);
  await page.goto(fileUrl, {
    waitUntil: 'networkidle0'
  });

  await page.pdf({
    path: pdfPath,
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

  const stat = fs.statSync(pdfPath);
  const sizeKb = (stat.size / 1024).toFixed(1);

  console.log('\n====================================================');
  console.log(`🎉 BERHASIL! PDF DOKUMEN 15 TELAH DIBUAT:`);
  console.log(`   File: ${pdfFilename} (${sizeKb} KB)`);
  console.log(`   Path: ${pdfPath}`);
  console.log('====================================================');
}

run().catch(err => {
  console.error('\n❌ Gagal membuat PDF Dokumen 15:', err);
  process.exit(1);
});
