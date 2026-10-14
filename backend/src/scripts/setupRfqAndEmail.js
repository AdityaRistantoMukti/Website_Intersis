const pool = require('../config/database');

async function setup() {
  try {
    console.log('[Setup] Checking and updating rfq_inquiries table...');
    const [cols] = await pool.query('DESCRIBE rfq_inquiries');
    const colNames = cols.map((c) => c.Field);

    if (!colNames.includes('status')) {
      await pool.query("ALTER TABLE rfq_inquiries ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'new' AFTER ip_address");
      console.log('✅ Added status column to rfq_inquiries');
    } else {
      console.log('ℹ️ status column already exists');
    }

    if (!colNames.includes('notes')) {
      await pool.query('ALTER TABLE rfq_inquiries ADD COLUMN notes TEXT NULL AFTER status');
      console.log('✅ Added notes column to rfq_inquiries');
    } else {
      console.log('ℹ️ notes column already exists');
    }

    // Check site_settings for email_smtp_settings default
    const [settings] = await pool.query("SELECT * FROM site_settings WHERE key_name = 'email_smtp_settings'");
    if (settings.length === 0) {
      const defaultSettings = {
        enabled: true,
        smtp_host: '',
        smtp_port: 587,
        smtp_secure: false,
        smtp_user: '',
        smtp_pass: '',
        sender_name: 'PT. Global Philsonic Technologies',
        sender_email: 'noreply@globalphilsonic.com',
        notify_emails: 'sales@globalphilsonic.com',
        auto_reply_enabled: true,
      };

      await pool.query(
        'INSERT INTO site_settings (key_name, content_json, updated_at) VALUES (?, ?, NOW())',
        ['email_smtp_settings', JSON.stringify(defaultSettings)]
      );
      console.log('✅ Created default email_smtp_settings in site_settings');
    } else {
      console.log('ℹ️ email_smtp_settings already exists in site_settings');
    }

    console.log('[Setup] Completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Setup error:', err);
    process.exit(1);
  }
}

setup();
