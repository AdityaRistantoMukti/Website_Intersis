/**
 * Master PDF Builder for Dokumentasi Laporan Ketercapaian
 * Generates all 14 Formal Audit Documentation PDFs matching the Mind Map outline and special guides:
 * - 12 Competency Units (Units 01-12)
 * - Document 13: Sitemap & Feature Comparison (Reference vs Built)
 * - Document 14: Admin Portal User & Editing Guide (Dummy accounts, workflows)
 */

const path = require('path');
const fs = require('fs');
const puppeteer = require('../../frontend/node_modules/puppeteer-core');
const { generateDocHtmlShell, generateReportHtmlShell } = require('./doc_template');

const docModules01to04 = require('./doc_module_01_04');
const docModules05to08 = require('./doc_module_05_08');
const docModules09to12 = require('./doc_module_09_12');
const docSitemapComparison = require('./doc_sitemap_comparison');
const docAdminGuide = require('./doc_admin_guide');
const docFullSitemapCoverage = require('./doc_full_sitemap_coverage');

const allCompetencyUnits = [
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
  console.log('🚀 MEMULAI GENERASI DOKUMENTASI LENGKAP (15 BERKAS PDF)');
  console.log('   - 12 Unit Pemenuhan Standar Kompetensi');
  console.log('   - 1 Laporan Komparasi Sitemap & Fitur');
  console.log('   - 1 Buku Panduan Penggunaan & Alur Pengeditan Admin');
  console.log('   - 1 Laporan Cakupan Sitemap Lengkap Publik & Admin');
  console.log('====================================================');

  const baseDir = path.join(__dirname, '..');
  const htmlDir = path.join(baseDir, 'html_sources');
  const pdfOutputDir = baseDir;

  if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir, { recursive: true });
  }

  const moduleFileMap = [];

  // 1. Generate 12 Competency Units HTML
  console.log('\n📄 [1/3] Membuat berkas HTML Unit Kompetensi 01 s/d 12...');
  for (const mod of allCompetencyUnits) {
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

  // 2. Generate Special Document 13 (Sitemap & Feature Comparison)
  console.log('\n📄 [2/3] Membuat berkas HTML Dokumen 13 (Sitemap & Fitur Referensi vs Terbangun)...');
  {
    const filenamePrefix = `13_Sitemap_dan_Fitur_Website_Referensi_vs_Website_Terbangun`;
    const htmlFilename = `${filenamePrefix}.html`;
    const pdfFilename = `${filenamePrefix}.pdf`;
    const htmlPath = path.join(htmlDir, htmlFilename);
    const pdfPath = path.join(pdfOutputDir, pdfFilename);

    const fullHtml = generateReportHtmlShell(docSitemapComparison);
    fs.writeFileSync(htmlPath, fullHtml, 'utf8');
    console.log(`  ✓ HTML dibuat: ${htmlFilename}`);

    moduleFileMap.push({
      unit: '13',
      title: docSitemapComparison.docTitle,
      htmlPath,
      pdfPath,
      pdfFilename
    });
  }

  // 3. Generate Special Document 14 (Admin Guide)
  console.log('\n📄 [3/3] Membuat berkas HTML Dokumen 14 (Panduan Penggunaan & Alur Pengeditan Admin)...');
  {
    const filenamePrefix = `14_Panduan_Penggunaan_dan_Alur_Pengeditan_Website_Admin`;
    const htmlFilename = `${filenamePrefix}.html`;
    const pdfFilename = `${filenamePrefix}.pdf`;
    const htmlPath = path.join(htmlDir, htmlFilename);
    const pdfPath = path.join(pdfOutputDir, pdfFilename);

    const fullHtml = generateReportHtmlShell(docAdminGuide);
    fs.writeFileSync(htmlPath, fullHtml, 'utf8');
    console.log(`  ✓ HTML dibuat: ${htmlFilename}`);

    moduleFileMap.push({
      unit: '14',
      title: docAdminGuide.docTitle,
      htmlPath,
      pdfPath,
      pdfFilename
    });
  }

  // 4. Generate Special Document 15 (Full Sitemap & Feature Coverage)
  console.log('\n📄 [4/4] Membuat berkas HTML Dokumen 15 (Cakupan Sitemap Lengkap Publik & Admin)...');
  {
    const filenamePrefix = `15_Cakupan_Sitemap_Lengkap_Website_Publik_dan_Dashboard_Admin`;
    const htmlFilename = `${filenamePrefix}.html`;
    const pdfFilename = `${filenamePrefix}.pdf`;
    const htmlPath = path.join(htmlDir, htmlFilename);
    const pdfPath = path.join(pdfOutputDir, pdfFilename);

    const fullHtml = generateReportHtmlShell(docFullSitemapCoverage);
    fs.writeFileSync(htmlPath, fullHtml, 'utf8');
    console.log(`  ✓ HTML dibuat: ${htmlFilename}`);

    moduleFileMap.push({
      unit: '15',
      title: docFullSitemapCoverage.docTitle,
      htmlPath,
      pdfPath,
      pdfFilename
    });
  }

  // 5. Launch Puppeteer & Convert to PDF
  console.log('\n🖨️  Mengonversi seluruh 15 berkas HTML ke PDF Standar A4 via Headless Chrome...');
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
      doc: item.unit,
      title: item.title,
      filename: item.pdfFilename,
      size: `${sizeKb} KB`
    });
    console.log(`    ✅ Selesai: ${item.pdfFilename} (${sizeKb} KB)`);
  }

  await browser.close();

  console.log('\n====================================================');
  console.log('🎉 SELURUH 15 BERKAS PDF DOKUMENTASI RESMI SELESAI!');
  console.log('====================================================');
  console.table(results);
  console.log(`\n📁 Direktori Output: ${pdfOutputDir}`);
}

run().catch(err => {
  console.error('\n❌ Gagal membuat PDF dokumentasi:', err);
  process.exit(1);
});
