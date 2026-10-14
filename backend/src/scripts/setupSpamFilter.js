const pool = require('../config/database');

async function setup() {
  try {
    console.log('[Setup] Checking rfq_inquiries table columns...');
    const [cols] = await pool.query('DESCRIBE rfq_inquiries');
    const colNames = cols.map((c) => c.Field);

    if (!colNames.includes('spam_score')) {
      await pool.query('ALTER TABLE rfq_inquiries ADD COLUMN spam_score INT NOT NULL DEFAULT 0 AFTER status');
      console.log('✅ Added spam_score column to rfq_inquiries');
    } else {
      console.log('ℹ️ spam_score column already exists');
    }

    if (!colNames.includes('spam_reason')) {
      await pool.query('ALTER TABLE rfq_inquiries ADD COLUMN spam_reason VARCHAR(255) NULL AFTER spam_score');
      console.log('✅ Added spam_reason column to rfq_inquiries');
    } else {
      console.log('ℹ️ spam_reason column already exists');
    }

    console.log('[Setup] Migration for spam filter completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    process.exit(1);
  }
}

setup();
