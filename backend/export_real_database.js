const fs = require('fs');
const path = require('path');
const pool = require('./src/config/database');

async function dumpDatabase() {
  const outputPath = path.join(__dirname, '../database/BACKUP_DATABASE_ASLI_INTERSIS.sql');
  console.log('Mengekspor seluruh data asli dari database lokal ke:', outputPath);

  let sqlDump = `-- =====================================================================\n`;
  sqlDump += `-- BACKUP & DUMP DATA ASLI DATABASE: isa_career_hrd\n`;
  sqlDump += `-- Diekspor pada: ${new Date().toISOString()}\n`;
  sqlDump += `-- Mencakup 19 Produk Asli, Lowongan, Profil, dan Seluruh Master Data\n`;
  sqlDump += `-- Siap di-import langsung ke Railway MySQL\n`;
  sqlDump += `-- =====================================================================\n\n`;
  sqlDump += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

  const [tables] = await pool.query('SHOW TABLES');

  for (const t of tables) {
    const table = Object.values(t)[0];
    console.log(`Processing table: ${table}...`);

    // Dapatkan DDL CREATE TABLE
    const [createTableResult] = await pool.query(`SHOW CREATE TABLE \`${table}\``);
    const createTableSql = createTableResult[0]['Create Table'];

    sqlDump += `-- -------------------------------------------------------------\n`;
    sqlDump += `-- Struktur Tabel: \`${table}\`\n`;
    sqlDump += `-- -------------------------------------------------------------\n`;
    sqlDump += `DROP TABLE IF EXISTS \`${table}\`;\n`;
    sqlDump += `${createTableSql};\n\n`;

    // Dapatkan seluruh baris data
    const [rows] = await pool.query(`SELECT * FROM \`${table}\``);
    if (rows.length > 0) {
      sqlDump += `-- Data untuk Tabel: \`${table}\` (${rows.length} baris)\n`;
      
      const columns = Object.keys(rows[0]).map(col => `\`${col}\``).join(', ');
      
      for (const row of rows) {
        const values = Object.values(row).map(val => {
          if (val === null) return 'NULL';
          if (typeof val === 'number') return val;
          if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
          if (Buffer.isBuffer(val)) return `X'${val.toString('hex')}'`;
          if (typeof val === 'object') return `'${JSON.stringify(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
          // Escape string
          const escaped = String(val)
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/\0/g, '\\0')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r');
          return `'${escaped}'`;
        }).join(', ');

        sqlDump += `INSERT INTO \`${table}\` (${columns}) VALUES (${values});\n`;
      }
      sqlDump += `\n`;
    }
  }

  sqlDump += `SET FOREIGN_KEY_CHECKS = 1;\n`;

  fs.writeFileSync(outputPath, sqlDump, 'utf8');
  const stats = fs.statSync(outputPath);
  console.log(`✅ BERHASIL! Berkas SQL lengkap tersimpan: ${(stats.size / 1024).toFixed(2)} KB`);
  process.exit();
}

dumpDatabase().catch(err => {
  console.error('Gagal mengekspor database:', err);
  process.exit(1);
});
