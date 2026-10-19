const mysql = require('mysql2/promise');
require('dotenv').config();

const poolConfig = process.env.MYSQL_URL || process.env.DATABASE_URL
  ? {
      uri: process.env.MYSQL_URL || process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: '+07:00',
      charset: 'utf8mb4',
    }
  : {
      host:             process.env.DB_HOST     || process.env.MYSQLHOST     || 'localhost',
      port:             parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306'),
      user:             process.env.DB_USER     || process.env.MYSQLUSER     || 'root',
      password:         process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
      database:         process.env.DB_NAME     || process.env.MYSQLDATABASE || 'isa_career_hrd',
      waitForConnections: true,
      connectionLimit:  10,
      queueLimit:       0,
      timezone:         '+07:00',
      charset:          'utf8mb4',
    };

const pool = mysql.createPool(poolConfig);

// Test koneksi saat startup
pool.getConnection()
  .then(conn => {
    console.log('[DB] MySQL connected — pool ready');
    conn.release();
  })
  .catch(err => {
    console.error('[DB] Connection failed:', err.message);
    // Di lingkungan serverless (seperti Vercel), ulangi log tanpa mematikan proses
  });

module.exports = pool;
