const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function seedDatabase() {
  console.log('🌱 Starting database seeding for ISA Career & HRD System...');

  const config = {
    host:             process.env.DB_HOST     || 'localhost',
    port:             parseInt(process.env.DB_PORT || '3306'),
    user:             process.env.DB_USER     || 'root',
    password:         process.env.DB_PASSWORD || '',
    database:         process.env.DB_NAME     || 'isa_career_hrd',
    multipleStatements: true,
  };

  let connection;

  try {
    connection = await mysql.createConnection(config);
    console.log(`[DB] Connected to MySQL database: '${config.database}' on '${config.host}'`);

    // Prioritaskan file export phpMyAdmin isa_career_hrd.sql jika ada, atau seed_data.sql
    let sqlPath = path.join(__dirname, '../../../database/isa_career_hrd.sql');
    if (!fs.existsSync(sqlPath)) {
      sqlPath = path.join(__dirname, '../../../database/seeders/seed_data.sql');
    }

    if (!fs.existsSync(sqlPath)) {
      throw new Error(`SQL file tidak ditemukan di: ${sqlPath}`);
    }

    console.log(`📄 Menggunakan file SQL: ${path.basename(sqlPath)}`);
    let sqlScript = fs.readFileSync(sqlPath, 'utf8');

    // Hapus perintah USE database agar eksekusi langsung masuk ke database aktif (misal: railway)
    sqlScript = sqlScript.replace(/USE\s+`?[a-zA-Z0-9_]+`?;/gi, '');
    sqlScript = sqlScript.replace(/CREATE\s+DATABASE\s+IF\s+NOT\s+EXISTS\s+`?[a-zA-Z0-9_]+`?;/gi, '');

    console.log('⚡ Executing seed SQL statements...');
    await connection.query(sqlScript);

    console.log('✅ Database seeded successfully with all tables and dummy data!');
    console.log('\n🔑 Default Logins Created:');
    console.log('  1. Administrator : admin@isa.co.id / Admin@ISA2026');
    console.log('  2. HRD Manager   : hrd@isa.co.id / Hrd@ISA2026');
    console.log('  3. Staff HRD     : staff.hrd@isa.co.id / Staff@ISA2026\n');
  } catch (error) {
    console.error('❌ Database Seeding Failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedDatabase();
