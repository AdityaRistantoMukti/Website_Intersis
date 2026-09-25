const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:             process.env.DB_HOST     || 'localhost',
  port:             parseInt(process.env.DB_PORT || '3306'),
  user:             process.env.DB_USER     || 'root',
  password:         process.env.DB_PASSWORD || '',
  database:         process.env.DB_NAME     || 'isa_career_hrd',
  waitForConnections: true,
  connectionLimit:  10,
  queueLimit:       0,
  timezone:         '+07:00',
  charset:          'utf8mb4',
});

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
