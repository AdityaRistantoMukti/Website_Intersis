/**
 * Master PDF Builder for Dokumentasi Laporan Ketercapaian
 * Generates all 12 Formal Audit Documentation PDFs matching the Mind Map outline
 */

const path = require('path');
const fs = require('fs');
const puppeteer = require('../../frontend/node_modules/puppeteer-core');
const { generateDocHtmlShell } = require('./doc_template');

const docModules01to04 = require('./doc_module_01_04');
const docModules05to08 = require('./doc_module_05_08');
const docModules09to12 = require('./doc_module_09_12');

const allDocModules = [
  ...docModules01to04,
  ...docModules05to08,
  ...docModules09to12
];

function sanitizeFilename(title) {
  return title
    .replace(/\s*\/\s*/g, '_dan_')
    .replace(/[()]/g, '')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_+/g, '_');
}

async function run() {
  console.log('====================================================');
  console.log('🚀 MEMULAI GENERASI DOKUMENTASI RESMI (12 UNIT LENGKAP)');
  console.log('====================================================');

  const baseDir = path.join(__dirname, '..');
  const htmlDir = path.join(baseDir, 'html_sources');
  const pdfOutputDir = baseDir;

  if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir, { recursive: true });
  }

  // 1. Generate All 12 HTML Files
  console.log('\n📄 [1/2] Membuat berkas sumber HTML Dokumentasi...');
  const moduleFileMap = [];

  for (const mod of allDocModules) {
    const rawSlug = sanitizeFilename(mod.unitTitle);
    const filenamePrefix = `${mod.unitNumber}_${rawSlug}`;
    const htmlFilename = `${filenamePrefix}.html`;
    const pdfFilename = `${filenamePrefix}.pdf`;
    const htmlPath = path.join(htmlDir, htmlFilename);
    const pdfPath = path.join(pdfOutputDir, pdfFilename);

    const fullHtml = generateDocHtmlShell(mod);
    fs.writeFileSync(htmlPath, fullHtml, 'utf8');
    console.log(`  ✓ HTML dibuat: ${htmlFilename}`);

    moduleFileMap.push({
      unit: mod.unitNumber,
      title: mod.unitTitle,
      htmlPath,
      pdfPath,
      pdfFilename
    });
  }

  // 2. Launch Puppeteer & Convert to PDF
  console.log('\n🖨️  [2/2] Mengonversi HTML ke Berkas PDF Standar A4 via Headless Chrome...');
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

  const results = [];
  for (let i = 0; i < moduleFileMap.length; i++) {
    const item = moduleFileMap[i];
    console.log(`  [${i + 1}/${moduleFileMap.length}] Merender PDF Dokumentasi: ${item.pdfFilename}...`);

    const fileUrl = 'file:///' + item.htmlPath.replace(/\\/g, '/');
    await page.goto(fileUrl, {
      waitUntil: 'networkidle0'
    });

    await page.pdf({
      path: item.pdfPath,
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

    const stat = fs.statSync(item.pdfPath);
    const sizeKb = (stat.size / 1024).toFixed(1);
    results.push({
      unit: item.unit,
      title: item.title,
      filename: item.pdfFilename,
      size: `${sizeKb} KB`
    });
    console.log(`    ✅ Selesai: ${item.pdfFilename} (${sizeKb} KB)`);
  }

  await browser.close();

  // 3. Print Final Report
  console.log('\n====================================================');
  console.log('🎉 SELURUH 12 BERKAS PDF DOKUMENTASI RESMI SELESAI!');
  console.log('====================================================');
  console.table(results);
  console.log(`\n📁 Lokasi Folder Penyimpanan: ${pdfOutputDir}`);
}

run().catch(err => {
  console.error('\n❌ Gagal membuat PDF dokumentasi:', err);
  process.exit(1);
});
