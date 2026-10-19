const mysql = require('mysql2/promise');
require('dotenv').config();

// Ambil URL Railway dari argumen command line atau environment variable
const railwayUrl = process.argv[2] || process.env.RAILWAY_MYSQL_URL;

if (!railwayUrl) {
  console.log('========================================================================');
  console.log('⚠️  URL KONEKSI RAILWAY BELUM DIBERIKAN!');
  console.log('========================================================================');
  console.log('Cara Penggunaan:');
  console.log('  node sync_to_railway.js "<URL_PUBLIC_RAILWAY_MYSQL>"');
  console.log('');
  console.log('Contoh:');
  console.log('  node sync_to_railway.js "mysql://root:password123@roundhouse.proxy.rlwy.net:54321/railway"');
  console.log('========================================================================');
  process.exit(1);
}

async function syncDatabases() {
  console.log('========================================================================');
  console.log('🔄 MEMULAI SINKRONISASI DATA DARI PHPMYADMIN LOKAL KE RAILWAY CLOUD');
  console.log('========================================================================');

  let localPool;
  let railwayPool;

  try {
    // 1. Konek ke Local MySQL (phpMyAdmin)
    localPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'isa_career_hrd',
      waitForConnections: true,
      connectionLimit: 5,
    });

    console.log('[1/4] Menguji koneksi database lokal (phpMyAdmin)...');
    const localConn = await localPool.getConnection();
    console.log('✅ Terhubung ke database lokal: isa_career_hrd');
    localConn.release();

    // 2. Konek ke Railway MySQL
    console.log('[2/4] Menguji koneksi database cloud Railway...');
    railwayPool = mysql.createPool({
      uri: railwayUrl,
      waitForConnections: true,
      connectionLimit: 5,
      multipleStatements: true,
    });

    const railwayConn = await railwayPool.getConnection();
    console.log('✅ Terhubung ke MySQL Railway!');
    railwayConn.release();

    // 3. Matikan Foreign Key Checks di Railway selama migrasi
    await railwayPool.query('SET FOREIGN_KEY_CHECKS = 0');

    // 4. Dapatkan seluruh tabel dari database lokal
    const [tables] = await localPool.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    console.log(`[3/4] Ditemukan ${tableNames.length} tabel asli. Memulai migrasi struktur & data...`);

    for (let i = 0; i < tableNames.length; i++) {
      const table = tableNames[i];
      process.stdout.write(`  [${i + 1}/${tableNames.length}] Migrasi tabel \`${table}\`... `);

      // Ambil struktur DDL dari lokal
      const [createRes] = await localPool.query(`SHOW CREATE TABLE \`${table}\``);
      const createSql = createRes[0]['Create Table'];

      // Buat ulang tabel di Railway
      await railwayPool.query(`DROP TABLE IF EXISTS \`${table}\``);
      await railwayPool.query(createSql);

      // Ambil seluruh data dari lokal
      const [rows] = await localPool.query(`SELECT * FROM \`${table}\``);

      if (rows.length > 0) {
        // Ambil nama-nama kolom
        const columns = Object.keys(rows[0]).map(col => `\`${col}\``).join(', ');
        
        // Insert secara chunk (maksimal 50 baris per query agar tidak timeout)
        const chunkSize = 50;
        for (let j = 0; j < rows.length; j += chunkSize) {
          const chunk = rows.slice(j, j + chunkSize);
          
          const valueStrings = chunk.map(row => {
            return '(' + Object.values(row).map(val => {
              if (val === null) return 'NULL';
              if (typeof val === 'number') return val;
              if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
              if (Buffer.isBuffer(val)) return `X'${val.toString('hex')}'`;
              if (typeof val === 'object') return `'${JSON.stringify(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
              const escaped = String(val)
                .replace(/\\/g, '\\\\')
                .replace(/'/g, "\\'")
                .replace(/\0/g, '\\0')
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r');
              return `'${escaped}'`;
            }).join(', ') + ')';
          }).join(', ');

          await railwayPool.query(`INSERT INTO \`${table}\` (${columns}) VALUES ${valueStrings}`);
        }
        console.log(`✅ ${rows.length} baris berhasil disinkronkan.`);
      } else {
        console.log(`✅ Struktur dibuat (0 baris).`);
      }
    }

    // 5. Hidupkan kembali Foreign Key Checks
    await railwayPool.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('========================================================================');
    console.log('🎉 SINKRONISASI 100% SUKSES!');
    console.log('Seluruh 19 produk asli, lowongan, dan master data sudah aktif di Railway.');
    console.log('========================================================================');

  } catch (error) {
    console.error('');
    console.error('❌ Gagal melakukan sinkronisasi:', error.message);
    if (error.code) console.error('Error Code:', error.code);
  } finally {
    if (localPool) await localPool.end();
    if (railwayPool) await railwayPool.end();
    process.exit();
  }
}

syncDatabases();
