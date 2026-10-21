const path = require('path');
const fs = require('fs');
const puppeteer = require('../../frontend/node_modules/puppeteer-core');

const chromeExecutable = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const screenshotDir = path.join(__dirname, '../screenshots');

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runCapture() {
  console.log('====================================================');
  console.log('📸 PENGAMBILAN LENGKAP SCREENSHOT ASLI (PUBLIK & ADMIN)');
  console.log('====================================================');

  const browser = await puppeteer.launch({
    executablePath: chromeExecutable,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--window-size=1366,768'
    ]
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(25000);
  await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1.25 });

  async function safeScreenshot(url, filename, setupFn = null, waitMs = 1200) {
    try {
      if (url) {
        console.log(`Navigasi ke ${url}...`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      }
      await sleep(waitMs);
      if (setupFn) {
        await page.evaluate(setupFn);
        await sleep(600);
      }
      const outPath = path.join(screenshotDir, filename);
      await page.screenshot({ path: outPath, type: 'jpeg', quality: 85 });
      console.log(`  ✓ Tersimpan: ${filename}`);
    } catch (err) {
      console.warn(`  ⚠️ Peringatan saat mengambil ${filename}:`, err.message);
    }
  }

  // ─────────────────────────────────────────────
  // 1. BAGIAN WEBSITE PUBLIK (12 Screenshot)
  // ─────────────────────────────────────────────

  // 1.1 Home - Hero Section
  console.log('1. Mengambil Home Hero...');
  await safeScreenshot('http://localhost:5173/', 'pub_01_hero.jpg', null, 1500);

  // 1.2 Home - Capabilities
  console.log('2. Mengambil Home Capabilities...');
  await safeScreenshot(null, 'pub_02_capabilities.jpg', () => {
    const el = document.querySelector('.capabilities-section') || document.querySelector('#capabilities') || document.querySelectorAll('section')[1];
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    else window.scrollTo(0, 850);
  }, 100);

  // 1.3 Home - Lifecycle 5-Stage
  console.log('3. Mengambil Home Lifecycle...');
  await safeScreenshot(null, 'pub_03_lifecycle.jpg', () => {
    const el = document.querySelector('.process-section') || document.querySelector('.lifecycle-container') || document.querySelectorAll('section')[2];
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    else window.scrollTo(0, 1600);
  }, 100);

  // 1.4 About - Profil Perusahaan
  console.log('4. Mengambil About Profile...');
  await safeScreenshot('http://localhost:5173/about', 'pub_04_about_profile.jpg', null, 1500);

  // 1.5 About - Fasilitas & Cleanroom
  console.log('5. Mengambil About Cleanroom...');
  await safeScreenshot(null, 'pub_05_about_cleanroom.jpg', () => {
    const el = document.querySelector('.cleanroom-section') || document.querySelector('.facility-section') || document.querySelectorAll('section')[2] || document.querySelectorAll('section')[1];
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    else window.scrollTo(0, 1100);
  }, 100);

  // 1.6 Automation - 3D Interactive Canvas
  console.log('6. Mengambil Automation 3D...');
  await safeScreenshot('http://localhost:5173/automation', 'pub_06_automation_3d.jpg', null, 2500);

  // 1.7 Automation - Test Jigs & MES Smart Factory
  console.log('7. Mengambil Automation Test Jigs & MES...');
  await safeScreenshot(null, 'pub_07_automation_jigs.jpg', () => {
    const el = document.querySelector('.jigs-section') || document.querySelector('.mes-section') || document.querySelectorAll('section')[1] || document.querySelectorAll('section')[2];
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    else window.scrollTo(0, 1200);
  }, 100);

  // 1.8 Products - Catalog & Filters
  console.log('8. Mengambil Products Catalog...');
  await safeScreenshot('http://localhost:5173/products', 'pub_08_products_catalog.jpg', null, 1500);

  // 1.9 Products - Modal Detail & Quick RFQ
  console.log('9. Mengambil Products Modal Detail...');
  await safeScreenshot(null, 'pub_09_products_modal.jpg', () => {
    const cards = document.querySelectorAll('.product-card') || document.querySelectorAll('[class*="product"]');
    if (cards && cards.length > 0) {
      const btn = cards[0].querySelector('button') || cards[0];
      if (btn) btn.click();
    }
  }, 500);

  // 1.10 Gallery - Documentation
  console.log('10. Mengambil Gallery Facilities...');
  await safeScreenshot('http://localhost:5173/gallery', 'pub_10_gallery.jpg', null, 1500);

  // 1.11 Contact - RFQ Form & Maps
  console.log('11. Mengambil Contact RFQ & Maps...');
  await safeScreenshot('http://localhost:5173/contact', 'pub_11_contact.jpg', null, 1500);

  // 1.12 Cockpit Theme & Global Footer
  console.log('12. Mengambil Footer & Cockpit Theme...');
  await safeScreenshot(null, 'pub_12_footer.jpg', () => {
    window.scrollTo(0, document.body.scrollHeight);
  }, 100);

  // ─────────────────────────────────────────────
  // 2. BAGIAN WEBSITE ADMIN DASHBOARD (11 Screenshot)
  // ─────────────────────────────────────────────

  // 2.1 Admin Login Page
  console.log('13. Mengambil Admin Login Screen...');
  await safeScreenshot('http://localhost:5173/admin/login', 'adm_01_login.jpg', null, 1200);

  // Lakukan Login Cepat via Chip Administrator
  console.log('Melakukan login via Administrator Quick Chip...');
  await page.evaluate(() => {
    const chips = document.querySelectorAll('.admin-quick-chip');
    if (chips[0]) chips[0].click();
  });
  await sleep(400);
  await page.evaluate(() => {
    const btn = document.querySelector('.admin-login-submit');
    if (btn) btn.click();
  });
  await sleep(2500);

  // 2.2 Tab Overview
  console.log('14. Mengambil Admin Overview...');
  await safeScreenshot('http://localhost:5173/admin?tab=overview', 'adm_02_overview.jpg', null, 1800);

  // 2.3 Tab Branding
  console.log('15. Mengambil Admin Branding...');
  await safeScreenshot('http://localhost:5173/admin?tab=branding', 'adm_03_branding.jpg', null, 1500);

  // 2.4 Tab Home
  console.log('16. Mengambil Admin Home Content...');
  await safeScreenshot('http://localhost:5173/admin?tab=home', 'adm_04_home.jpg', null, 1500);

  // 2.5 Tab About
  console.log('17. Mengambil Admin About Content...');
  await safeScreenshot('http://localhost:5173/admin?tab=about', 'adm_05_about.jpg', null, 1500);

  // 2.6 Tab Automation
  console.log('18. Mengambil Admin Automation Content...');
  await safeScreenshot('http://localhost:5173/admin?tab=automation', 'adm_06_automation.jpg', null, 1500);

  // 2.7 Tab Products
  console.log('19. Mengambil Admin Products Catalog...');
  await safeScreenshot('http://localhost:5173/admin?tab=products', 'adm_07_products.jpg', null, 1800);

  // 2.8 Tab Gallery
  console.log('20. Mengambil Admin Gallery...');
  await safeScreenshot('http://localhost:5173/admin?tab=gallery', 'adm_08_gallery.jpg', null, 1500);

  // 2.9 Tab Contact (Inbound RFQ Leads)
  console.log('21. Mengambil Admin Contact & RFQ Inbox...');
  await safeScreenshot('http://localhost:5173/admin?tab=contact', 'adm_09_contact.jpg', null, 1800);

  // 2.10 Tab Users (RBAC)
  console.log('22. Mengambil Admin Users & RBAC...');
  await safeScreenshot('http://localhost:5173/admin?tab=users', 'adm_10_users.jpg', null, 1500);

  // 2.11 Tab Logs (Audit Trail)
  console.log('23. Mengambil Admin Audit Logs...');
  await safeScreenshot('http://localhost:5173/admin?tab=logs', 'adm_11_logs.jpg', null, 1500);

  await browser.close();
  console.log('====================================================');
  console.log('🎉 SELURUH 23 SCREENSHOT BERHASIL DIAMBIL LENGKAP!');
  console.log(`   Direktori: ${screenshotDir}`);
  console.log('====================================================');
}

runCapture().catch(err => {
  console.error('❌ Gagal menjalankan capture script:', err);
  process.exit(1);
});
