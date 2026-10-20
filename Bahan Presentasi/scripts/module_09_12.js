/**
 * Data Definition for Units 09 to 12
 * Proyek: Website Intersis / Automation GPT
 */

const modules09to12 = [
  // ==========================================
  // UNIT 09: MENGGUNAKAN SQL
  // ==========================================
  {
    unitNumber: "09",
    unitCode: "TI.SQL.09.2026",
    unitTitle: "Menggunakan SQL",
    subTitles: [
      {
        title: "Operasi DML",
        desc: "Mengeksekusi manipulasi data (SELECT, INSERT, UPDATE, DELETE) menggunakan Prepared Statements berparameter aman."
      },
      {
        title: "Manipulasi tabel/view",
        desc: "Mengelola struktur skema tabel melalui DDL (ALTER TABLE, migrasi bilingual, produk) dan pembuatan virtual view pelaporan."
      },
      {
        title: "Stored procedure",
        desc: "Menyusun prosedur tersimpan di database engine untuk eksekusi batch kompleks seperti otomasi penutupan lowongan kadaluarsa."
      },
      {
        title: "Function",
        desc: "Memanfaatkan fungsi agregasi bawaan (COUNT, NOW, COALESCE) dan User Defined Functions untuk komputasi data terpusat."
      },
      {
        title: "Trigger",
        desc: "Mengimplementasikan pemicu database otomatis (AFTER INSERT/UPDATE) untuk mencatat histori perubahan ke activity_logs."
      },
      {
        title: "Commit/Rollback",
        desc: "Menerapkan prinsip ACID transaksi multi-tabel di Node.js (beginTransaction, commit, rollback) untuk menjaga integritas data."
      }
    ],
    speechScript: `
      <p><span class="speech-stage-cue">[Pembukaan &amp; Sikap]</span> "Selamat pagi/siang Dewan Penguji yang saya hormati. Structured Query Language (SQL) merupakan instrumen inti dalam interaksi data pada sistem berbasis relasional. Pada unit kompetensi <strong>Menggunakan SQL</strong>, saya akan mendemonstrasikan penguasaan menyeluruh dari operasi DML tingkat lanjut hingga manajemen transaksi perbankan/enterprise (ACID)."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 1 &amp; 2: Operasi DML dan Manipulasi Tabel/View]</span> "Pertama, dalam <em>Operasi DML (Data Manipulation Language)</em>, kami menulis perintah <code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code>, dan <code>DELETE</code> dengan standar keamanan tertinggi, yaitu selalu menggunakan <strong>Prepared Statements</strong> bertanda tanya (<code>?</code>). Pendekatan ini secara mutlak memblokir potensi serangan SQL Injection. Terkait <em>Manipulasi Tabel/View</em>, kami menyusun skrip migrasi DDL terstruktur seperti <code>add_bilingual_support.sql</code> dan <code>add_products_table.sql</code> untuk memperluas skema tabel tanpa merusak integritas data eksisting."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 3, 4, &amp; 5: Stored Procedure, Function, dan Trigger]</span> "Kedua, kami mendalami otomasi tingkat basis data melalui <em>Stored Procedure, Function, dan Trigger</em>. Kami merancang Stored Procedure <code>sp_archive_expired_jobs()</code> yang dapat dipanggil secara terjadwal untuk mengubah status lowongan yang melewati batas waktu menjadi 'closed' secara otomatis. Kami memanfaatkan fungsi SQL bawaan seperti <code>COUNT()</code>, <code>NOW()</code>, dan <code>COALESCE()</code> untuk agregasi ringkasan dashboard, serta merancang konsep <strong>Database Trigger</strong> (<code>trg_after_job_update</code>) yang secara otomatis menyisipkan rekaman log ke tabel <code>activity_logs</code> setiap kali ada mutasi status lowongan kerja."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 6: Commit/Rollback (Transaksi ACID)]</span> "Ketiga, pilar paling kritikal adalah <em>Commit &amp; Rollback</em>. Dalam transaksi multi-langkah—seperti saat memperbarui lowongan pekerjaan sekaligus mencatat entri log audit—kami membungkus operasi tersebut di dalam mekanisme transaksi database MySQL. Kami menjalankan <code>await connection.beginTransaction()</code>. Jika seluruh proses berhasil, kami mengeksekusi <code>commit()</code>. Namun jika salah satu tahapan gagal, seluruh perubahan seketika kami batalkan melalui <code>rollback()</code>. Dengan cara ini, database kami selalu konsisten dan terlindungi dari kondisi data korup."</p>
    `,
    technicalSections: [
      {
        subNumber: "9.1 & 9.2",
        title: "Operasi DML Aman (Prepared Statements) & Migrasi Skema DDL",
        codeRef: "backend/src/controllers/admin/adminJobVacancyController.js & database/add_products_table.sql",
        bodyHtml: `
          <p>Operasi DML selalu menggunakan prepared statement binding untuk memastikan parameter masukan tidak diinterpretasikan sebagai kode SQL:</p>
        `,
        codeSnippet: {
          filename: "backend/src/controllers/admin/adminJobVacancyController.js",
          code: `// Operasi DML Terparameterisasi (Pencegahan SQL Injection)
exports.createJob = async (req, res, next) => {
  try {
    const { category_id, title, location, employment_type, description, requirements, form_url, status } = req.body;
    const adminId = req.user.id;

    const query = \`
      INSERT INTO job_vacancies 
      (category_id, title, location, employment_type, description, requirements, form_url, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    \`;
    const [result] = await db.query(query, [
      category_id, title, location, employment_type, description, requirements, form_url, status || 'draft', adminId
    ]);

    res.status(201).json({ success: true, message: 'Lowongan berhasil dipublikasikan.', id: result.insertId });
  } catch (err) {
    next(err);
  }
};`
        }
      },
      {
        subNumber: "9.3, 9.4 & 9.5",
        title: "Penerapan Stored Procedure, Built-in Functions & Trigger",
        codeRef: "database/isa_career_hrd.sql (Prosedur & Trigger)",
        bodyHtml: `
          <p>Pemanfaatan fitur native engine MySQL InnoDB untuk automasi pemeliharaan data dan jejak audit:</p>
        `,
        codeSnippet: {
          filename: "database/stored_procedures_triggers.sql",
          code: `-- 1. Stored Procedure: Otomasi Penutupan Lowongan Kadaluarsa
DELIMITER //
CREATE PROCEDURE sp_archive_expired_jobs(IN p_days_threshold INT)
BEGIN
  UPDATE job_vacancies 
  SET status = 'closed', updated_at = NOW()
  WHERE status = 'published' 
    AND DATEDIFF(NOW(), created_at) > p_days_threshold;
END //
DELIMITER ;

-- 2. Trigger Otomatis: Pencatatan Audit Trail Pasca Mutasi Lowongan
DELIMITER //
CREATE TRIGGER trg_audit_job_update
AFTER UPDATE ON job_vacancies
FOR EACH ROW
BEGIN
  IF OLD.status <> NEW.status THEN
    INSERT INTO activity_logs (user_id, action, module, description, created_at)
    VALUES (NEW.created_by, 'UPDATE_STATUS', 'CAREER', 
            CONCAT('Status lowongan "', NEW.title, '" diubah dari ', OLD.status, ' ke ', NEW.status), NOW());
  END IF;
END //
DELIMITER ;`
        }
      },
      {
        subNumber: "9.6",
        title: "Manajemen Transaksi ACID (Begin Transaction, Commit, Rollback)",
        codeRef: "backend/src/config/database.js & Contoh Transaksi Controller",
        bodyHtml: `
          <p>Prinsip Atomicity diimplementasikan pada operasi yang melibatkan lebih dari satu tabel secara simultan:</p>
        `,
        codeSnippet: {
          filename: "backend/src/utils/transactionDemo.js",
          code: `// Implementasi Transaksi ACID: Menjamin Operasi All-or-Nothing
const db = require('../config/database');

async function executeTransactionalJobCreation(jobData, adminId) {
  // 1. Dapatkan dedicated connection dari connection pool
  const connection = await db.getConnection();
  try {
    // 2. Mulai transaksi
    await connection.beginTransaction();

    // Langkah A: Insert lowongan kerja
    const [jobResult] = await connection.query(
      'INSERT INTO job_vacancies (category_id, title, description, requirements, created_by) VALUES (?, ?, ?, ?, ?)',
      [jobData.category_id, jobData.title, jobData.description, jobData.requirements, adminId]
    );

    // Langkah B: Insert activity audit log
    await connection.query(
      'INSERT INTO activity_logs (user_id, action, module, description) VALUES (?, "CREATE", "CAREER", ?)',
      [adminId, \`Menerbitkan lowongan baru ID: \${jobResult.insertId}\`]
    );

    // 3. Jika kedua query sukses, komit perubahan permanen
    await connection.commit();
    return { success: true, jobId: jobResult.insertId };
  } catch (error) {
    // 4. Jika ada tahapan yang gagal, batalkan seluruh mutasi data
    await connection.rollback();
    throw error;
  } finally {
    // 5. Kembalikan koneksi ke pool
    connection.release();
  }
}`
        }
      }
    ],
    slideTalkingPoints: [
      "DML Berparameter: Prepared statement placeholder '?' untuk mengeliminasi celah SQL Injection.",
      "Manipulasi Skema DDL: Skrip migrasi terstruktur untuk ekspansi tabel produk dan bilingual.",
      "Stored Procedure: Prosedur pemeliharaan berkala penutupan lowongan kadaluarsa.",
      "Database Trigger: Logging audit trail instan berbasis event INSERT/UPDATE di level database.",
      "Transaksi ACID Penuh: Menjamin integritas data all-or-nothing dengan beginTransaction, commit, dan rollback."
    ],
    qaDefenseMatrix: [
      {
        question: "Mengapa Anda memilih menggunakan Prepared Statements di library mysql2 dibandingkan string concatenation biasa?",
        answer: "Prepared statements memisahkan antara struktur query SQL dan nilai data yang dikirimkan. Database engine mengompilasi struktur query terlebih dahulu sebelum menyisipkan data parameter, sehingga karakter khusus dari input pengguna (seperti tanda petik atau statement OR 1=1) diperlakukan murni sebagai literal string, bukan perintah SQL yang dapat dieksekusi (kebal SQL Injection)."
      },
      {
        question: "Dalam situasi apa saja kita wajib menggunakan mekanisme Commit dan Rollback?",
        answer: "Transaksi commit dan rollback wajib digunakan pada setiap proses bisnis yang melibatkan lebih dari satu operasi penulisan data yang saling bergantung (multi-table write). Misalnya: saat memotong saldo pengguna sekaligus membuat riwayat tagihan, atau saat merilis lowongan kerja sekaligus mencatat log audit ke sistem HRD."
      }
    ]
  },

  // ==========================================
  // UNIT 10: MENERAPKAN AKSES BASIS DATA
  // ==========================================
  {
    unitNumber: "10",
    unitCode: "TI.DA.10.2026",
    unitTitle: "Menerapkan Akses Basis Data",
    subTitles: [
      {
        title: "Koneksi database dari Node.js/React",
        desc: "Membangun arsitektur decoupled 3-tier: memisahkan antarmuka klien React dari akses langsung DB, mengamankan gateway via REST API Express."
      },
      {
        title: "Penggunaan library database",
        desc: "Mengonfigurasi pustaka 'mysql2/promise' dengan Connection Pooling, time-zone '+07:00', charset utf8mb4, serta konektivitas cloud Railway."
      },
      {
        title: "Pengujian query",
        desc: "Menjalankan skrip benchmarking latensi 'test_api_runner.js', query profiling (EXPLAIN), dan verifikasi indeks database."
      }
    ],
    speechScript: `
      <p><span class="speech-stage-cue">[Pembukaan &amp; Sikap]</span> "Dewan Penguji yang saya hormati, jembatan penghubung antara logika aplikasi dan penyimpanan fisik data harus dirancang dengan prinsip keamanan dan efisiensi throughput yang tinggi. Pada unit kompetensi <strong>Menerapkan Akses Basis Data</strong>, saya akan menjelaskan bagaimana saluran data diintegrasikan dan diuji secara komprehensif."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 1: Koneksi Database dari Node.js / React]</span> "Pertama, mari kita tinjau <em>Koneksi Database dari Node.js dan React</em>. Kami secara sadar menerapkan arsitektur <strong>Decoupled 3-Tier</strong>. Frontend React yang berjalan di browser pengguna <strong>TIDAK PERNAH</strong> diberikan akses langsung untuk membuka socket TCP ke database MySQL. Mengizinkan koneksi langsung dari browser ke database adalah anti-pattern fatal yang membocorkan password database ke publik. Sebagai gantinya, React berkomunikasi secara eksklusif melalui protokol HTTP aman ke backend Node.js, dan backend Node.js bertindak sebagai gatekeeper terpercaya yang mengeksekusi koneksi ke database."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 2: Penggunaan Library Database]</span> "Kedua, dalam <em>Penggunaan Library Database</em>, kami memilih pustaka <code>mysql2/promise</code> yang mendukung sintaksis modern berbasis async/await. Konfigurasi kami terapkan menggunakan <strong>Connection Pool</strong> dengan kapasitas hingga 10 koneksi bersamaan, encoding <code>utf8mb4</code> untuk mendukung karakter internasional dan simbol, serta timezone <code>+07:00</code> (Waktu Indonesia Barat). Konfigurasi ini juga dirancang dinamis: dapat membaca kredensial lokal (XAMPP/MySQL) maupun connection string cloud Railway (<code>MYSQL_URL</code>) secara otomatis tanpa perlu mengubah baris kode."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 3: Pengujian Query]</span> "Ketiga, pada pilar <em>Pengujian Query</em>, kami tidak hanya menguji keberhasilan query di tahap pengembangan, melainkan membuat skrip otomatis <code>test_api_runner.js</code> yang menguji response time query di setiap endpoint. Kami juga melakukan profiling query menggunakan klausa <code>EXPLAIN SELECT</code> untuk memastikan query pencarian lowongan kerja memanfaatkan index (<code>idx_jobs_category</code> dan <code>idx_jobs_status</code>), sehingga tidak terjadi Full Table Scan saat data bertumbuh menjadi ribuan baris."</p>
    `,
    technicalSections: [
      {
        subNumber: "10.1",
        title: "Arsitektur Akses Decoupled 3-Tier (React - Express - MySQL)",
        codeRef: "Alur Data: Frontend Axios &rarr; Express Route &rarr; MySQL Pool",
        bodyHtml: `
          <p>Diagram alur arsitektur menunjukkan batas keamanan (trust boundary) antara browser client dan basis data:</p>
          <div class="code-box">
            <span class="file-tag">Alur Komunikasi Data 3-Tier</span>
            <pre>[Client Browser / React 19]
      |
      | HTTP GET /api/public/jobs (JSON Payload via Axios)
      v  [DMZ / Public Internet Boundary]
[Backend Gateway / Express v5 Node.js]
      |
      | Validasi Token JWT, Sanitasi Param, Rate Limiting
      v  [Private Network / VNet Boundary]
[MySQL Database Pool / mysql2 Engine] (Port 3306 / Railway Cloud)</pre>
          </div>
        `,
        codeSnippet: null
      },
      {
        subNumber: "10.2",
        title: "Konfigurasi Connection Pool & Adaptabilitas Cloud Database",
        codeRef: "backend/src/config/database.js",
        bodyHtml: `
          <p>Konfigurasi pool mendeteksi keberadaan URL koneksi cloud otomatis, memberikan fallback ke parameter localhost saat pengembangan offline:</p>
        `,
        codeSnippet: {
          filename: "backend/src/config/database.js",
          code: `const mysql = require('mysql2/promise');
require('dotenv').config();

// Konfigurasi Dinamis: Mendukung Railway Cloud URL & Local XAMPP
const poolConfig = process.env.MYSQL_URL || process.env.DATABASE_URL
  ? {
      uri: process.env.MYSQL_URL || process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: '+07:00',
      charset: 'utf8mb4'
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'isa_career_hrd',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: '+07:00',
      charset: 'utf8mb4'
    };

const pool = mysql.createPool(poolConfig);

// Validasi Konektivitas Saat Inisialisasi Server
pool.getConnection()
  .then(conn => {
    console.log('[DB] MySQL Connected — Pool Ready');
    conn.release();
  })
  .catch(err => console.error('[DB] Connection Error:', err.message));

module.exports = pool;`
        }
      },
      {
        subNumber: "10.3",
        title: "Pengujian Query Otomatis & Profiling Kinerja Indeks",
        codeRef: "backend/test_api_runner.js & Query EXPLAIN",
        bodyHtml: `
          <p>Pengujian profiling query SQL membuktikan bahwa filter pencarian memanfaatkan indeks B-Tree yang telah didefinisikan:</p>
        `,
        codeSnippet: {
          filename: "Terminal / MySQL Console: Query Profiling",
          code: `-- Profiling Query dengan EXPLAIN
EXPLAIN SELECT j.id, j.title, c.name 
FROM job_vacancies j 
LEFT JOIN job_categories c ON j.category_id = c.id 
WHERE j.status = 'published';

-- Hasil Analisis Output:
-- table: j | type: ref | possible_keys: idx_jobs_status | key: idx_jobs_status | rows: 12
-- Status: OPTIMIZED (Tidak melakukan Full Table Scan, langsung membaca index b-tree)`
        }
      }
    ],
    slideTalkingPoints: [
      "Decoupled 3-Tier Security: Mengisolasi database di balik REST API aman, browser tidak pernah memegang kredensial DB.",
      "Pustaka 'mysql2/promise': Mendukung penuh async/await modern dan transmisi biner teroptimasi.",
      "Connection Pool 10 Pekerja: Penanganan antrean request konkuren tanpa membebani memori server.",
      "Dual Environment Support: Mendukung koneksi Railway Cloud (MYSQL_URL) dan Localhost XAMPP otomatis.",
      "Pengujian & Profiling: Skrip otomatis test_api_runner.js dan verifikasi EXPLAIN index performance."
    ],
    qaDefenseMatrix: [
      {
        question: "Mengapa tidak menghubungkan React langsung ke database menggunakan driver MySQL browser?",
        answer: "Database MySQL menggunakan protokol TCP berbasis socket mentah yang tidak didukung langsung oleh browser tanpa perantara, dan yang terpenting: menyematkan kredensial database pada kode JavaScript client-side akan memungkinkan siapa saja membuka DevTools browser untuk melihat password database dan memanipulasi seluruh tabel sesuka hati."
      },
      {
        question: "Apa fungsi dari parameter queueLimit: 0 pada konfigurasi pool mysql2?",
        answer: "queueLimit: 0 menandakan bahwa jumlah antrean permintaan koneksi tidak memiliki batas buatan. Jika ke-10 koneksi sedang sibuk, request baru akan mengantre secara tertib (FIFO) hingga ada koneksi yang selesai dan di-release, alih-alih langsung menolak request dengan pesan error 'Queue Limit Reached'."
      }
    ]
  },

  // ==========================================
  // UNIT 11: MENGGUNAKAN SOURCE CODE VERSIONING
  // ==========================================
  {
    unitNumber: "11",
    unitCode: "TI.VC.11.2026",
    unitTitle: "Menggunakan Source Code Versioning",
    subTitles: [
      {
        title: "Penggunaan Git/Repository",
        desc: "Menginisialisasi repositori Git lokal dan sinkronisasi dengan remote GitHub (AdityaRistantoMukti/Website_Intersis), konfigurasi .gitignore."
      },
      {
        title: "Alur kerja branching",
        desc: "Menerapkan alur branching Git-Flow / Feature Branching (master/main produksi, fitur modular dan hotfix)."
      },
      {
        title: "Merging",
        desc: "Mengintegrasikan perubahan kode, fast-forward merge, pengelolaan merge conflict, dan validasi pasca merger."
      },
      {
        title: "Commit",
        desc: "Menulis commit atomik dengan pesan berstandar Conventional Commits (feat, fix, docs, style, refactor)."
      },
      {
        title: "Push/Pull",
        desc: "Menyinkronkan delta commit ke remote GitHub dan memicu pipeline CI/CD Continuous Deployment Vercel & Railway."
      },
      {
        title: "Cloning",
        desc: "Menduplikasi proyek ke lingkungan baru, konfigurasi dependensi, dan restorasi skema basis data dari fresh state."
      }
    ],
    speechScript: `
      <p><span class="speech-stage-cue">[Pembukaan &amp; Sikap]</span> "Selamat pagi/siang Dewan Penguji yang terhormat. Dalam pengembangan perangkat lunak modern, manajemen versi berkas kode sumber adalah jaminan atas integritas, histori perubahan, dan kelancaran kolaborasi tim. Pada unit kompetensi <strong>Menggunakan Source Code Versioning</strong>, saya akan memperlihatkan alur kerja Git profesional yang diterapkan pada repositori proyek ini."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 1: Penggunaan Git/Repository]</span> "Pertama, <em>Penggunaan Git &amp; Repositori</em>. Proyek ini diinisialisasi dan dilacak penuh menggunakan Git dengan remote repository publik di GitHub pada alamat <code>github.com/AdityaRistantoMukti/Website_Intersis</code>. Kami mengonfigurasi berkas <code>.gitignore</code> secara disiplin untuk memastikan direktori berat seperti <code>node_modules/</code>, folder artefak kompilasi <code>dist/</code>, serta berkas sensitif <code>.env</code> tidak pernah terunggah ke repositori publik demi keamanan kredensial."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 2, 3, &amp; 4: Branching, Merging, dan Commit]</span> "Kedua, mengenai <em>Branching, Merging, dan Commit</em>. Kami memisahkan pengembangan fitur ke dalam branch kerja sebelum digabungkan ke branch utama <code>master</code>. Setiap kali penggabungan (<em>Merging</em>) dilakukan, kami memeriksa potensi konflik dan memastikan pengujian fungsional lolos. Kami menerapkan standar <strong>Conventional Commits</strong> yang ketat pada setiap commit history, seperti <code>feat(about): enhance layout spacing</code>, <code>fix(mobile): responsive fixes for hero controls</code>, dan <code>docs: add technical handbook</code>. Pesan commit yang atomik dan deskriptif mempermudah penelusuran audit perubahan kapan pun dibutuhkan."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 5 &amp; 6: Push/Pull dan Cloning]</span> "Ketiga, <em>Push/Pull dan Cloning</em>. Setiap kali perintah <code>git push origin master</code> dieksekusi, webhook GitHub secara otomatis memicu pipeline <strong>Continuous Deployment (CD)</strong> ke platform Vercel untuk frontend dan Railway untuk backend. Terakhir, repositori ini dirancang 100% <em>reproducible</em>: pengembang lain dapat melakukan <code>git clone</code>, menjalankan <code>npm install</code>, menyalin file <code>.env.example</code>, mengeksekusi seeder database, dan aplikasi langsung siap berjalan dalam waktu kurang dari 5 menit."</p>
    `,
    technicalSections: [
      {
        subNumber: "11.1 & 11.4",
        title: "Konfigurasi Repositori Git & Standarisasi Conventional Commits",
        codeRef: ".gitignore & Git Commit Log",
        bodyHtml: `
          <p>Catatan log commit membuktikan kedisiplinan penggunaan standar Conventional Commits pada proyek ini:</p>
        `,
        codeSnippet: {
          filename: "Git Commit Log History (git log -n 5 --oneline)",
          code: `e31edd3 fix(home): dynamic redirection for hero action buttons to products and contact
0ea54a5 docs: add technical handbook and glossary PDF for internship defense
d05a057 fix(mobile): responsive fixes for hero controls, padding, monochrome stats, theme icon
f4e15bd feat: track real product uploads, add database backup, and sync utilities
467fc25 setup Vercel & Railway`
        }
      },
      {
        subNumber: "11.2 & 11.3",
        title: "Strategi Alur Kerja Branching & Resolusi Konflik (Merging)",
        codeRef: "Git Branching Workflow",
        bodyHtml: `
          <p>Siklus hidup isolasi fitur dan penggabungan kode sumber:</p>
          <div class="code-box">
            <span class="file-tag">Alur Branching & Merging</span>
            <pre>[master / production] -------------------------------------------------> [Deployment Vercel/Railway]
          ^                                               |
          |  (git merge --no-ff)                          | (git pull)
          |                                               v
[feature/products-module] -----> [Commit 1] -> [Commit 2] -+</pre>
          </div>
        `,
        codeSnippet: {
          filename: "Terminal Commands: Branching & Merging Cycle",
          code: `# Membuat branch fitur baru yang terisolasi
git checkout -b feat/products-module

# Mengembangkan kode dan melakukan commit atomik
git add .
git commit -m "feat(products): create responsive bento product showcase"

# Berpindah ke master dan menggabungkan perubahan
git checkout master
git merge feat/products-module

# Menghapus branch fitur lokal pasca merge sukses
git branch -d feat/products-module`
        }
      },
      {
        subNumber: "11.5 & 11.6",
        title: "Sinkronisasi Cloud Push/Pull & Prosedur Replikasi Cloning",
        codeRef: "Panduan Cloning & Eksekusi Proyek",
        bodyHtml: `
          <p>Panduan langkah demi langkah mereplikasi seluruh proyek di mesin baru dari fresh clone:</p>
          <table class="table-custom">
            <tr>
              <th>Tahapan</th>
              <th>Perintah Shell</th>
              <th>Luaran yang Dihasilkan</th>
            </tr>
            <tr>
              <td>1. Kloning Repositori</td>
              <td><code>git clone https://github.com/AdityaRistantoMukti/Website_Intersis.git</code></td>
              <td>Menduplikasi seluruh source code dan commit history lengkap ke lokal disk.</td>
            </tr>
            <tr>
              <td>2. Instalasi Dependensi</td>
              <td><code>cd backend &amp;&amp; npm install &amp;&amp; cd ../frontend &amp;&amp; npm install</code></td>
              <td>Mengunduh seluruh pustaka yang terkunci di package-lock.json.</td>
            </tr>
            <tr>
              <td>3. Inisialisasi Database</td>
              <td><code>mysql -u root -p &lt; database/isa_career_hrd.sql</code></td>
              <td>Membuat 12 tabel relasional lengkap dengan data awal (seeders).</td>
            </tr>
            <tr>
              <td>4. Menjalankan Layanan</td>
              <td><code>npm run dev</code> (di backend dan frontend)</td>
              <td>Website interaktif siap diakses di http://localhost:5173.</td>
            </tr>
          </table>
        `,
        codeSnippet: null
      }
    ],
    slideTalkingPoints: [
      "Pelacakan Repositori Penuh: Terkelola di GitHub 'AdityaRistantoMukti/Website_Intersis'.",
      "Proteksi .gitignore: Mengabaikan node_modules, build bundle, dan berkas kredensial .env.",
      "Standar Conventional Commits: Penggunaan prefix feat, fix, docs, style yang konsisten.",
      "Alur Branching & Merging: Isolasi fitur independen sebelum digabungkan ke cabang produksi.",
      "Otomasi CI/CD & Reproducibility: Auto-deploy ke Vercel/Railway dan kemudahan fresh cloning."
    ],
    qaDefenseMatrix: [
      {
        question: "Bagaimana strategi Anda dalam menyelesaikan Merge Conflict saat ada perubahan bertabrakan?",
        answer: "Ketika terjadi merge conflict, Git menandai baris yang bertabrakan dengan marker <<<<<<< HEAD, =======, dan >>>>>>>. Kami melakukan inspeksi manual bersama rekan tim untuk menganalisis baris logika mana yang harus dipertahankan, membersihkan marker konflik, menjalankan pengujian unit/sistem lokal untuk memastikan aplikasi tetap berjalan, lalu melakukan commit resolusi merge."
      },
      {
        question: "Mengapa penting menulis pesan commit dengan pola Conventional Commits?",
        answer: "Conventional Commits memformat pesan commit menjadi terstruktur mesin dan manusia (misal feat untuk fitur baru, fix untuk perbaikan bug). Hal ini memudahkan pelacakan changelog otomatis, pemahaman riwayat perubahan oleh tim, dan memfasilitasi penentuan kenaikan nomor versi Semantic Versioning secara otomatis."
      }
    ]
  },

  // =========================================================================
  // UNIT 12: SOFT SKILLS / DESIGN THINKING (KELOMPOK PENUNJANG)
  // =========================================================================
  {
    unitNumber: "12",
    unitCode: "TI.SK.12.2026",
    unitTitle: "Soft Skills / Design Thinking (Kelompok Penunjang)",
    subTitles: [
      {
        title: "Pengembangan pemikiran inovatif",
        desc: "Menerapkan 5 tahapan Design Thinking (Empathize, Define, Ideate, Prototype, Test) untuk memecahkan problem nyata rekrutmen & branding industri."
      },
      {
        title: "Kemampuan interpersonal pengembang web",
        desc: "Mengasah komunikasi lintas fungsional (tim teknis & stakeholder HRD), etika rekayasa, manajemen waktu, dan presentasi persuasif."
      }
    ],
    speechScript: `
      <p><span class="speech-stage-cue">[Pembukaan &amp; Sikap]</span> "Dewan Penguji dan Bapak/Ibu Pembimbing yang saya hormati. Keberhasilan seorang insinyur perangkat lunak tidak hanya ditentukan oleh kecakapan menulis sintaksis kode (hard skills), melainkan juga kepekaan dalam memahami masalah manusia dan kecakapan berkolaborasi (soft skills). Pada unit <strong>Soft Skills &amp; Design Thinking</strong>, saya akan memaparkan bagaimana pendekatan berbasis empati dan inovasi diterapkan dalam proyek ini."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 1: Pengembangan Pemikiran Inovatif &amp; Design Thinking]</span> "Dalam <em>Pengembangan Pemikiran Inovatif</em>, kami memandu seluruh rekayasa perangkat lunak melalui metodologi <strong>5 Tahap Design Thinking</strong>:
      1. <strong>Empathize</strong>: Kami mengamati kendala tim HRD PT Global Philsonic Technologies yang kesulitan menerima berkas pelamar secara manual lewat email yang berceceran, serta calon kandidat yang sulit memahami profil teknologi perusahaan.
      2. <strong>Define</strong>: Kami merumuskan masalah inti: 'Bagaimana menciptakan portal karir digital yang terpadu, bilingual, dan sekaligus memamerkan keunggulan manufaktur otomasi perusahaan?'.
      3. <strong>Ideate</strong>: Kami menggagas ide inovatif: menghadirkan 3D interactive globe yang memukau calon pelamar internasional, sistem dual-theme (Dark/Light mode), dan dashboard CMS mandiri agar staf HRD dapat memperbarui lowongan tanpa ketergantungan programmer.
      4. <strong>Prototype</strong>: Kami membangun purwarupa interaktif secara cepat menggunakan stack Vite, React, dan Tailwind CSS.
      5. <strong>Test</strong>: Kami menguji purwarupa langsung kepada pengguna akhir di lingkungan mobile dan desktop untuk memastikan keterbacaan dan kecepatan akses."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 2: Kemampuan Interpersonal Pengembang Web]</span> "Selanjutnya, dalam <em>Kemampuan Interpersonal Pengembang Web</em>, proyek ini membuktikan kapasitas komunikasi lintas bidang. Saya secara aktif menjembatani jargon teknis (seperti database indexing, response time, dan API) menjadi bahasa bisnis yang mudah dipahami oleh manajemen HRD. Kami mengedepankan keterbukaan lewat dokumentasi transparan, mendengarkan umpan balik (active listening) saat ada revisi desain bento grid atau penyesuaian alur formulir kontak, serta disiplin dalam manajemen waktu (time management) sehingga proyek berhasil diselesaikan tepat waktu sesuai target magang."</p>
      
      <p><span class="speech-stage-cue">[Penutup Presentasi Seluruh Unit]</span> "Sebagai penutup, penguasaan 12 unit kompetensi yang telah saya paparkan—dari antarmuka, basis data, backend, pemrograman terstruktur, SQL, versioning, hingga soft skills—membuktikan kesiapan saya sebagai Fullstack Web Developer yang siap terjun dan berkontribusi secara nyata di industri teknologi. Terima kasih atas perhatian Dewan Penguji, dan saya siap untuk sesi tanya jawab."</p>
    `,
    technicalSections: [
      {
        subNumber: "12.1",
        title: "Penerapan 5 Tahapan Design Thinking pada Proyek Intersis",
        codeRef: "Metodologi Inovasi Produk Web",
        bodyHtml: `
          <p>Matriks implementasi tahapan Design Thinking dalam merancang fitur website:</p>
          <table class="table-custom">
            <tr>
              <th>Tahap Design Thinking</th>
              <th>Aktivitas Nyata Pengembang</th>
              <th>Hasil / Solusi yang Diimplementasikan</th>
            </tr>
            <tr>
              <td>1. Empathize (Empati)</td>
              <td>Wawancara dengan staf HRD dan calon kandidat magang mengenai kendala website karir konvensional.</td>
              <td>Mengetahui fakta bahwa kandidat enggan membaca teks panjang tanpa hierarki visual yang jelas.</td>
            </tr>
            <tr>
              <td>2. Define (Definisi Masalah)</td>
              <td>Memetakan pain point: data lowongan statis, tidak ada filter kategori, dan tidak ramah di ponsel pintar.</td>
              <td>Rumusan User Story: 'Kandidat membutuhkan pencarian lowongan kerja instan dan visualisasi budaya kerja yang modern.'</td>
            </tr>
            <tr>
              <td>3. Ideate (Gagasan Solusi)</td>
              <td>Brainstorming fitur: visualisasi 3D WebGL, sistem kartu lowongan terfilter dinamis, dan sistem bilingual.</td>
              <td>Rancangan arsitektur bento gallery 5-kolom dan modul Automation-GPT yang berkelas internasional.</td>
            </tr>
            <tr>
              <td>4. Prototype (Purwarupa)</td>
              <td>Pengembangan iteratif menggunakan React 19 dan Tailwind CSS v4.</td>
              <td>Frontend reaktif dengan komponen reusable yang langsung tersambung ke mock REST API.</td>
            </tr>
            <tr>
              <td>5. Test (Pengujian Pengguna)</td>
              <td>Uji coba fungsionalitas formulir kontak, rotasi globe di perangkat mobile, dan keterbacaan teks kontras tinggi.</td>
              <td>Penyesuaian responsivitas mobile nav drawer dan penyesuaian font monokrom agar nyaman dibaca.</td>
            </tr>
          </table>
        `,
        codeSnippet: null
      },
      {
        subNumber: "12.2",
        title: "Kemampuan Interpersonal, Komunikasi Stakeholder & Etika Rekayasa",
        codeRef: "Dokumentasi Kolaborasi & Manajemen Proyek",
        bodyHtml: `
          <p>Aspek soft skills yang diasah dan dibuktikan selama pengerjaan proyek:</p>
          <ul>
            <li><strong>Komunikasi Efektif dengan Non-Teknis:</strong> Menerangkan konsep database relasional dan manajemen konten kepada pihak HRD tanpa menggunakan istilah teknis yang membingungkan.</li>
            <li><strong>Active Listening & Adaptabilitas:</strong> Menampung feedback mengenai kebutuhan pengubahan warna background call-to-action pada mode terang dan gelap, lalu mengeksekusinya secara cepat.</li>
            <li><strong>Integritas &amp; Keamanan Data:</strong> Menjaga etika profesi dengan menerapkan enkripsi password, tidak mengekspos data log pelamar ke area publik, dan melindungi hak cipta aset perusahaan.</li>
            <li><strong>Penyusunan Dokumentasi Komprehensif:</strong> Menulis 10 Bab buku panduan teknis dan glosarium untuk menjamin kemudahan transfer pengetahuan bagi penerus proyek di perusahaan.</li>
          </ul>
        `,
        codeSnippet: null
      }
    ],
    slideTalkingPoints: [
      "Metodologi 5 Tahap Design Thinking: Empathize, Define, Ideate, Prototype, dan Test.",
      "Inovasi Berorientasi Solusi: 3D interactive canvas, sistem bilingual otomatis, dan CMS dashboard mandiri.",
      "Komunikasi Stakeholder Lintas Bidang: Menerjemahkan kebutuhan bisnis HRD ke dalam arsitektur teknis.",
      "Active Listening & Feedback Iteration: Adaptabilitas tinggi terhadap masukan ergonomi antarmuka.",
      "Etika Rekayasa & Integritas: Penegakan privasi data kandidat dan penyusunan dokumentasi transfer knowledge."
    ],
    qaDefenseMatrix: [
      {
        question: "Mengapa pemikiran inovatif dan Design Thinking sangat penting bagi seorang pengembang web, bukan hanya desainer UI/UX?",
        answer: "Pengembang web bukan sekadar juru ketik kode, melainkan problem solver. Tanpa Design Thinking, pengembang dapat menghabiskan waktu berminggu-minggu membangun fitur yang rumit secara teknis namun ternyata tidak dibutuhkan atau membingungkan bagi pengguna akhir. Dengan Design Thinking, setiap baris kode yang ditulis berakar kuat pada pemecahan masalah nyata pengguna."
      },
      {
        question: "Bagaimana cara Anda menjelaskan masalah teknis yang rumit (seperti kegagalan query database) kepada pimpinan perusahaan atau HRD?",
        answer: "Kami menggunakan pendekatan analogi bisnis dan berorientasi solusi. Alih-alih menjelaskan tentang 'MySQL connection pool timeout', kami menjelaskan bahwa 'saat ini sistem sedang mengalami antrean akses data yang padat, dan solusi yang sedang kami terapkan adalah memperbesar jalur penampungan data agar form dapat diakses kembali dalam beberapa menit tanpa ada data yang hilang'."
      }
    ]
  }
];

module.exports = modules09to12;
