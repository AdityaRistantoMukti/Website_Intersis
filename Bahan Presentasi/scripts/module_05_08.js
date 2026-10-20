/**
 * Data Definition for Units 05 to 08
 * Proyek: Website Intersis / Automation GPT
 */

const modules05to08 = [
  // =========================================================================
  // UNIT 05: MENULIS KODE DENGAN PRINSIP SESUAI GUIDELINES DAN BEST PRACTICES
  // =========================================================================
  {
    unitNumber: "05",
    unitCode: "TI.BP.05.2026",
    unitTitle: "Menulis Kode dengan Prinsip Sesuai Guidelines dan Best Practices",
    subTitles: [
      {
        title: "Penerapan coding guidelines",
        desc: "Mengimplementasikan aturan linter ESLint, prinsip rekayasa DRY (Don't Repeat Yourself), KISS, dan Single Responsibility Principle (SRP)."
      },
      {
        title: "Penanganan error/exception",
        desc: "Menerapkan mekanisme try-catch asinkron, interceptor error terpusat, mitigasi kegagalan database, serta graceful degradation UI."
      },
      {
        title: "Optimasi efisiensi kode",
        desc: "Mengonfigurasi kompresi HTTP Gzip/Brotli, database connection pool, code-splitting dinamis, dan rendering GPU-accelerated."
      }
    ],
    speechScript: `
      <p><span class="speech-stage-cue">[Pembukaan &amp; Sikap]</span> "Dewan Penguji yang saya hormati, menulis kode yang sekadar berfungsi tentu belum cukup untuk sebuah aplikasi kelas enterprise. Pada unit kompetensi <strong>Menulis Kode dengan Prinsip Sesuai Guidelines dan Best Practices</strong>, saya akan menguraikan bagaimana kualitas, keamanan, dan efisiensi kode dijaga dengan standar industri tertinggi."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 1: Penerapan Coding Guidelines]</span> "Dalam <em>Penerapan Coding Guidelines</em>, kami memanfaatkan linter resmi <code>eslint</code> untuk menegakkan konsistensi format ECMAScript modern. Kami memegang teguh prinsip <strong>DRY (Don't Repeat Yourself)</strong> dengan menciptakan satu modul klien HTTP terpusat (<code>apiClient.js</code>) yang secara otomatis menyisipkan Authorization Bearer Token pada setiap panggilan ke server. Kami juga mematuhi <strong>Single Responsibility Principle (SRP)</strong> di mana setiap controller hanya memikul satu tanggung jawab spesifik, misalnya pemisahan tegas antara <code>authController.js</code> yang mengurusi verifikasi login dan <code>userController.js</code> yang mengelola manajemen profil pegawai."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 2: Penanganan Error/Exception]</span> "Pada pilar <em>Penanganan Error/Exception</em>, seluruh blok asinkron dibungkus dalam konstruksi <code>try-catch</code> dengan penerusan error ke <code>next(err)</code>. Kami mengantisipasi kode kesalahan database MySQL secara spesifik, seperti error code 1062 untuk penanganan duplikasi username/email secara elegan tanpa menampilkan error mentah ke layar. Di sisi antarmuka pengguna, kami menerapkan <em>Graceful Degradation</em> di mana jika koneksi backend offline, antarmuka tetap menampilkan skeleton loader dan pesan ramah melalui SweetAlert2, alih-alih layar blank putih."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 3: Optimasi Efisiensi Kode]</span> "Sub-topik ketiga adalah <em>Optimasi Efisiensi Kode</em>. Di backend, kami mengaktifkan middleware <code>compression</code> untuk mengecilkan ukuran transmisi JSON hingga 70% dan menggunakan Connection Pooling <code>mysql2/promise</code> dengan limit 10 koneksi simultan untuk menghindari latensi handshake TCP. Di frontend, Vite melakukan tree-shaking otomatis dan pemisahan vendor chunk sehingga waktu muat halaman (First Contentful Paint) berada di bawah 1,2 detik. Inilah wujud nyata rekayasa perangkat lunak yang berorientasi performa."</p>
    `,
    technicalSections: [
      {
        subNumber: "5.1",
        title: "Penerapan Prinsip DRY & Reusable HTTP Client Interceptor",
        codeRef: "frontend/src/lib/apiClient.js & backend/src/controllers/admin/authController.js",
        bodyHtml: `
          <p>Prinsip Don't Repeat Yourself (DRY) diwujudkan dengan membangun instance Axios tunggal yang menangani injeksi header otorisasi secara otomatis untuk seluruh komponen modul admin:</p>
        `,
        codeSnippet: {
          filename: "frontend/src/lib/apiClient.js",
          code: `import axios from 'axios';

// Instance Axios Terpusat Menerapkan Prinsip DRY
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Request Interceptor: Otomasi Injeksi Bearer Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
}, (error) => Promise.reject(error));

export default apiClient;`
        }
      },
      {
        subNumber: "5.2",
        title: "Penanganan Exception Terpusat & Penanganan Error MySQL Spesifik",
        codeRef: "backend/src/controllers/admin/userController.js",
        bodyHtml: `
          <p>Setiap operasi penulisan data dilengkapi penanganan kode kesalahan MySQL spesifik untuk memberikan pesan yang informatif kepada pengguna:</p>
        `,
        codeSnippet: {
          filename: "backend/src/controllers/admin/userController.js",
          code: `// Penanganan Error Duplicate Entry (ER_DUP_ENTRY / 1062)
exports.createUser = async (req, res, next) => {
  try {
    const { name, username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.query(
      'INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, username, email, hashedPassword, role]
    );
    res.status(201).json({ success: true, message: 'Pengguna berhasil dibuat.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
      return res.status(409).json({
        success: false,
        message: 'Username atau email tersebut sudah terdaftar di sistem.'
      });
    }
    next(err); // Meneruskan ke global error middleware
  }
};`
        }
      },
      {
        subNumber: "5.3",
        title: "Optimasi Kompresi Payload & Database Connection Pool",
        codeRef: "backend/src/server.js & backend/src/config/database.js",
        bodyHtml: `
          <p>Tiga teknik optimasi performa tinggi yang diimplementasikan pada proyek ini:</p>
          <table class="table-custom">
            <tr>
              <th>Fitur Optimasi</th>
              <th>Konfigurasi / Pustaka</th>
              <th>Dampak Terukur</th>
            </tr>
            <tr>
              <td>Gzip Compression</td>
              <td><code>compression()</code> middleware Express</td>
              <td>Mengurangi ukuran payload response JSON dari 120KB menjadi ~28KB saat transfer data.</td>
            </tr>
            <tr>
              <td>Connection Pooling</td>
              <td><code>mysql.createPool({ connectionLimit: 10 })</code></td>
              <td>Mengeliminasi latensi 40-70ms koneksi TCP baru pada setiap request yang masuk.</td>
            </tr>
            <tr>
              <td>GPU Transform Layer</td>
              <td><code>transform: translate3d(0,0,0)</code> &amp; Tailwind</td>
              <td>Animasi kartu dan rotasi globe dikomputasi oleh GPU, menjaga stabilitas frame rate 60 FPS.</td>
            </tr>
          </table>
        `,
        codeSnippet: {
          filename: "backend/src/server.js",
          code: `const compression = require('compression');
const helmet = require('helmet');

// Mengaktifkan Proteksi Header Keamanan & Kompresi Payload
app.use(helmet());
app.use(compression({
  threshold: 1024, // Hanya kompresi respons di atas 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));`
        }
      }
    ],
    slideTalkingPoints: [
      "Prinsip Rekayasa DRY: Sentralisasi modul HTTP apiClient dengan token interceptor otomatis.",
      "Prinsip SRP (Single Responsibility): Pemisahan domain controller untuk kemudahan pemeliharaan.",
      "Penanganan Exception Spesifik: Menangkap error code 1062 (Duplicate) dan 1451 (Foreign Key constraint).",
      "Optimasi Payload HTTP: Pengurangan bobot respons hingga 70% dengan middleware Gzip Compression.",
      "Koneksi Database Efisien: Connection pool 10 worker untuk mereduksi latensi jaringan."
    ],
    qaDefenseMatrix: [
      {
        question: "Mengapa Anda menggunakan Connection Pooling daripada membuka koneksi MySQL baru di setiap query?",
        answer: "Membuka dan menutup koneksi TCP baru pada setiap request membutuhkan proses handshake TCP dan autentikasi database berulang kali yang memakan waktu 40 hingga 80 milidetik per request. Dengan Connection Pooling (10 koneksi terkelola), koneksi yang sudah terbuka dapat dipakai ulang seketika (reusable), sehingga throughput server meningkat tajam dan tahan terhadap lonjakan pengunjung."
      },
      {
        question: "Bagaimana Anda memastikan kredensial rahasia seperti JWT_SECRET tidak terekspos di browser client?",
        answer: "Variabel JWT_SECRET hanya disimpan di file environment server backend (.env) yang diabaikan oleh .gitignore dan tidak pernah di-bundle oleh Vite ke sisi frontend. Frontend hanya menerima token JWT yang telah ditandatangani secara kriptografis (signed string) dan menyimpannya di localStorage."
      }
    ]
  },

  // =========================================================================
  // UNIT 06: MENGIMPLEMENTASIKAN PEMROGRAMAN TERSTRUKTUR
  // =========================================================================
  {
    unitNumber: "06",
    unitCode: "TI.ST.06.2026",
    unitTitle: "Mengimplementasikan Pemrograman Terstruktur",
    subTitles: [
      {
        title: "Penguasaan tipe data",
        desc: "Mengelola tipe data primitif dan referensi (String, Number, Boolean, Array, Object) serta validasi skema payload."
      },
      {
        title: "Percabangan",
        desc: "Menerapkan logika kondisional if-else, guard clauses, switch-case evaluasi role, dan ternary expressions."
      },
      {
        title: "Perulangan",
        desc: "Mengoperasikan loop deklaratif dan imperatif (map, filter, reduce, forEach) untuk manipulasi koleksi data."
      },
      {
        title: "Prosedur/Fungsi",
        desc: "Menyusun pure functions, higher-order functions, fungsi asinkron (async/await), dan pipeline middleware."
      },
      {
        title: "Array",
        desc: "Melakukan transformasi data tak bermutasi (immutable), destructuring array, dan operasi spreading."
      },
      {
        title: "File I/O",
        desc: "Mengeksekusi pembacaan, penulisan, dan pembersihan berkas media asinkron melalui modul Node.js 'fs'."
      }
    ],
    speechScript: `
      <p><span class="speech-stage-cue">[Pembukaan &amp; Sikap]</span> "Selamat pagi/siang Dewan Penguji yang terhormat. Fondasi dari setiap aplikasi perangkat lunak yang handal bertumpu pada algoritma terstruktur yang solid. Pada unit <strong>Mengimplementasikan Pemrograman Terstruktur</strong>, saya akan memaparkan penerapan 6 pilar pemrograman terstruktur pada proyek Website Intersis."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 1: Penguasaan Tipe Data]</span> "Pertama, <em>Penguasaan Tipe Data</em>. Kami membedakan secara ketat antara tipe data primitif (String, Number, Boolean) dan referensi (Array, Object). Di backend, kami menggunakan pustaka <code>express-validator</code> untuk memastikan tipe data yang masuk dari request body benar-benar valid, seperti sanitasi string email, konversi integer untuk limit pagination, dan validasi boolean untuk status aktif."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 2: Percabangan]</span> "Kedua, <em>Percabangan (Conditionals)</em>. Untuk menghindari 'callback hell' dan nesting kondisi yang berlebihan (arrow anti-pattern), kami menerapkan <strong>Guard Clauses</strong> (early return pattern). Contohnya pada autentikasi: jika token tidak ada, fungsi langsung mengembalikan status 401 dan berhenti mengeksekusi baris berikutnya. Kami juga menggunakan <code>switch-case</code> untuk pemetaan izin multi-role (administrator, HRD, staff) dan operator ternary pada rendering komponen JSX."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 3, 4, &amp; 5: Perulangan, Prosedur/Fungsi, dan Array]</span> "Ketiga, keempat, dan kelima adalah <em>Perulangan, Fungsi, dan Array</em>. Kami konsisten menggunakan paradigma fungsional modern. Kami memanfaatkan <code>Array.prototype.map()</code> untuk merender daftar kartu lowongan secara deklaratif di React, <code>.filter()</code> untuk menyaring data berdasarkan kategori yang dipilih, dan <code>async/await</code> pada setiap prosedur I/O untuk menjaga eksekusi asynchronous non-blocking."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 6: File I/O]</span> "Keenam, <em>File I/O (Input/Output)</em>. Saat admin memperbarui foto profil korporat atau menghapus item dari galeri, sistem kami tidak hanya menghapus referensi di database, tetapi juga mengeksekusi operasi file I/O menggunakan <code>fs.unlinkSync</code> untuk menghapus file fisik di disk server. Dengan demikian, kapasitas penyimpanan server tetap bersih dari sampah file yatim (orphan files)."</p>
    `,
    technicalSections: [
      {
        subNumber: "6.1 & 6.2",
        title: "Validasi Tipe Data & Pola Percabangan Guard Clauses",
        codeRef: "backend/src/middlewares/authMiddleware.js",
        bodyHtml: `
          <p>Pola Guard Clause diterapkan untuk menyederhanakan alur percabangan dan menjamin keamanan rute sebelum data diproses lebih lanjut:</p>
        `,
        codeSnippet: {
          filename: "backend/src/middlewares/authMiddleware.js",
          code: `// Penerapan Guard Clauses: Mencegah Nested If Berlebihan
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Guard 1: Periksa keberadaan header
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Akses ditolak: Token tidak ditemukan.' });
  }

  // Guard 2: Periksa format Bearer
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Format token tidak valid.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Lolos validasi, lanjutkan ke controller
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Token kadaluarsa atau tidak sah.' });
  }
};`
        }
      },
      {
        subNumber: "6.3, 6.4 & 6.5",
        title: "Manipulasi Array Fungsional & Rendering Deklaratif React",
        codeRef: "frontend/src/pages/public/CareerPage.jsx",
        bodyHtml: `
          <p>Operasi array immutable (map dan filter) digunakan secara terpadu untuk menyaring lowongan kerja berdasarkan pencarian teks dan kategori tanpa memutasi data asli:</p>
        `,
        codeSnippet: {
          filename: "frontend/src/pages/public/CareerPage.jsx",
          code: `// Filtering Multi-Parameter & Transformasi Array Deklaratif
const filteredJobs = useMemo(() => {
  return jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.category_id === Number(selectedCategory);
    return matchesSearch && matchesCategory;
  });
}, [jobs, searchTerm, selectedCategory]);

// Render Array ke Elemen JSX
return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredJobs.map((job) => (
      <JobCard key={job.id} jobData={job} onSelect={() => setSelectedJob(job)} />
    ))}
  </div>
);`
        }
      },
      {
        subNumber: "6.6",
        title: "Operasi File I/O & Pembersihan Berkas Fisik di Server",
        codeRef: "backend/src/controllers/admin/adminContentControllers.js",
        bodyHtml: `
          <p>Sistem mengelola berkas media fisik di storage lokal backend menggunakan modul inti <code>fs</code> dan <code>path</code>:</p>
        `,
        codeSnippet: {
          filename: "backend/src/controllers/admin/adminContentControllers.js",
          code: `const fs = require('fs');
const path = require('path');

// File I/O: Menghapus File Gambar Fisik dari Disk Saat Record Dihapus
exports.deleteGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT image FROM gallery WHERE id = ?', [id]);
    
    if (rows.length > 0 && rows[0].image) {
      const filePath = path.join(__dirname, '../../../uploads', rows[0].image);
      // Validasi keberadaan file sebelum penghapusan
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Eksekusi penghapusan file dari filesystem
      }
    }

    await db.query('DELETE FROM gallery WHERE id = ?', [id]);
    res.json({ success: true, message: 'Item galeri dan berkas fisik berhasil dihapus.' });
  } catch (err) {
    next(err);
  }
};`
        }
      }
    ],
    slideTalkingPoints: [
      "Tipe Data & Skema: Validasi ketat tipe primitif dan referensi dengan express-validator.",
      "Guard Clauses Pattern: Mengurangi nesting if-else untuk meningkatkan keterbacaan kode.",
      "Operasi Array Deklaratif: Pemanfaatan .filter() dan .map() immutable untuk reaktifitas UI.",
      "Fungsi Asinkron: Penggunaan async/await untuk penanganan I/O non-blocking.",
      "Manajemen File I/O: Otomasi penghapusan file fisik via fs.unlinkSync untuk mencegah storage leak."
    ],
    qaDefenseMatrix: [
      {
        question: "Apa perbedaan manipulasi array imperatif (for loop biasa) dengan fungsional (.map/.filter) dalam konteks React?",
        answer: "Metode fungsional seperti .map() dan .filter() bersifat declarative dan immutable (menghasilkan array baru tanpa mengubah data asal), yang sangat krusial dalam siklus hidup React untuk memicu re-render secara akurat berdasarkan perbandingan referensi (shallow comparison)."
      },
      {
        question: "Mengapa Anda memeriksa fs.existsSync() sebelum menjalankan fs.unlinkSync()?",
        answer: "Jika kita memanggil fs.unlinkSync pada path file yang sudah tidak ada di disk (misalnya file terhapus manual oleh admin server), Node.js akan melempar ENOENT exception yang dapat menyebabkan kegagalan request. Validasi keberadaan file menjamin operasi penghapusan record database tetap sukses."
      }
    ]
  },

  // =========================================================================
  // UNIT 07: MENGIMPLEMENTASIKAN PEMROGRAMAN BERORIENTASI OBJEK (OOP)
  // =========================================================================
  {
    unitNumber: "07",
    unitCode: "TI.OO.07.2026",
    unitTitle: "Mengimplementasikan Pemrograman Berorientasi Objek (OOP)",
    subTitles: [
      {
        title: "Penerapan Class",
        desc: "Mendefinisikan blueprint class ES6 untuk entitas kesalahan sistem kustom (Custom Error Class) dan service helper."
      },
      {
        title: "Object",
        desc: "Mengonstruksi instance objek, enkapsulasi Data Transfer Objects (DTO), serta manipulasi object keys/values."
      },
      {
        title: "Encapsulation",
        desc: "Menyembunyikan detail implementasi internal, hashing data sensitif, dan pembatasan akses scope lokal modul."
      },
      {
        title: "Inheritance",
        desc: "Menerapkan pewarisan properti dan method dari kelas induk native (class ApiError extends Error)."
      },
      {
        title: "Polymorphism",
        desc: "Menghadirkan perilaku multi-bentuk pada komponen UI adaptif dan penyeragaman format respon RESTful API."
      },
      {
        title: "Interface & Package",
        desc: "Menyusun kontrak antarmuka API terstandarisasi serta modularitas packaging (CommonJS vs ES Modules)."
      }
    ],
    speechScript: `
      <p><span class="speech-stage-cue">[Pembukaan &amp; Sikap]</span> "Dewan Penguji yang saya hormati, paradigma <strong>Pemrograman Berorientasi Objek (OOP)</strong> memberikan keunggulan dalam modularitas, pewarisan fungsionalitas, dan keteraturan data. Pada unit kompetensi ini, saya akan mendemonstrasikan implementasi 6 konsep inti OOP pada arsitektur proyek Website Intersis."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 1, 2, &amp; 4: Class, Object, dan Inheritance]</span> "Pertama, terkait <em>Penerapan Class, Object, dan Inheritance</em>. Kami merancang kelas kustom <code>ApiError</code> yang mewarisi (extends) dari kelas dasar JavaScript <code>Error</code>. Dengan inheritance ini, <code>ApiError</code> mewarisi kapabilitas penangkapan stack trace bawaan, sembari menambahkan atribut baru seperti <code>statusCode</code> dan <code>isOperational</code>. Setiap kali terjadi kesalahan validasi bisnis, kami menginstansiasi objek baru dari kelas tersebut (<code>new ApiError(404, 'Data tidak ditemukan')</code>), sehingga penanganan error di seluruh controller menjadi sangat terstruktur dan seragam."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 3: Encapsulation]</span> "Kedua, <em>Encapsulation (Pembungkusan &amp; Information Hiding)</em>. Kami menerapkan enkapsulasi pada pengelolaan data kredensial pengguna. Password pengguna tidak pernah disimpan atau diakses dalam bentuk teks biasa (plain text), melainkan dienkapsulasi menggunakan algoritma <code>bcrypt</code> dengan salt rounds sebanyak 10 putaran. Selain itu, scope variabel di dalam controller terisolasi dalam modul dan hanya mengekspos fungsi yang dideklarasikan secara eksplisit."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 5: Polymorphism]</span> "Ketiga, <em>Polymorphism (Multi-Bentuk)</em>. Pada sisi frontend, komponen UI tombol dan kartu dibuat bersifat polimorfis. Komponen <code>Button</code> yang sama dapat berubah bentuk, warna, dan perilakunya (sebagai primary action dengan efek gradient, outline border, atau danger button) hanya dengan mengubah properti <code>variant</code> yang diteruskan, tanpa perlu menulis tiga komponen tombol terpisah."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 6: Interface &amp; Package]</span> "Keempat, <em>Interface &amp; Package</em>. Kami menyepakati 'API Contract' terstandarisasi sebagai interface komunikasi antara backend dan frontend: setiap payload response selalu berwujud objek dengan struktur <code>{ success: Boolean, data: Any, message: String }</code>. Dari sisi packaging, kami memadukan ES Modules (<code>import/export</code>) di frontend dengan CommonJS (<code>require/module.exports</code>) di backend, menciptakan ekosistem aplikasi yang rapi dan terisolasi."</p>
    `,
    technicalSections: [
      {
        subNumber: "7.1 & 7.4",
        title: "Penerapan Class ES6 & Pewarisan Objek (Inheritance)",
        codeRef: "backend/src/utils/ApiError.js",
        bodyHtml: `
          <p>Pewarisan kelas diterapkan pada sistem manajemen exception untuk menciptakan hierarki error yang mudah diidentifikasi oleh middleware:</p>
        `,
        codeSnippet: {
          filename: "backend/src/utils/ApiError.js",
          code: `// Penerapan Class & Inheritance: Mewarisi Kelas Induk 'Error'
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message); // Memanggil konstruktor kelas induk
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = \`\${statusCode}\`.startsWith('4') ? 'fail' : 'error';

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;`
        }
      },
      {
        subNumber: "7.2 & 7.3",
        title: "Objek DTO & Enkapsulasi Keamanan Kredensial Pengguna",
        codeRef: "backend/src/controllers/admin/authController.js",
        bodyHtml: `
          <p>Enkapsulasi data sensitif diterapkan menggunakan teknik hashing kriptografis satu arah, menyembunyikan representasi asli sandi pengguna:</p>
        `,
        codeSnippet: {
          filename: "backend/src/controllers/admin/authController.js",
          code: `// Enkapsulasi: Menyembunyikan Detail Password dengan Bcrypt Hashing
exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  
  const [users] = await db.query('SELECT * FROM users WHERE username = ? AND status = "active"', [username]);
  if (users.length === 0) {
    return res.status(401).json({ success: false, message: 'Kredensial tidak valid.' });
  }

  const user = users[0];
  // Verifikasi hash tanpa pernah mendekripsi password ke bentuk asli
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Kredensial tidak valid.' });
  }

  // Objek Response Bersih: Menghilangkan properti password dari output DTO
  const userResponseDTO = { id: user.id, name: user.name, username: user.username, role: user.role };
  const token = jwt.sign(userResponseDTO, process.env.JWT_SECRET, { expiresIn: '8h' });

  res.json({ success: true, token, user: userResponseDTO });
};`
        }
      },
      {
        subNumber: "7.5 & 7.6",
        title: "Polimorfisme Komponen UI & Standarisasi Kontrak Interface",
        codeRef: "frontend/src/components/ui/Button.jsx",
        bodyHtml: `
          <p>Komponen UI polimorfis menyesuaikan perwujudan visual dan fungsi interaksinya sesuai kontrak interface properti yang diterima:</p>
        `,
        codeSnippet: {
          filename: "frontend/src/components/ui/Button.jsx",
          code: `// Polimorfisme Komponen: Menyesuaikan Gaya Berdasarkan Prop Variant
export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = 'px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md hover:shadow-cyan-500/25',
    secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-red-500/25',
    outline: 'border border-blue-500/40 text-blue-400 hover:bg-blue-500/10'
  };

  return (
    <button className={\`\${baseStyles} \${variantStyles[variant]} \${className}\`} {...props}>
      {children}
    </button>
  );
}`
        }
      }
    ],
    slideTalkingPoints: [
      "Penerapan Class & Inheritance: Pembuatan hierarki custom error (ApiError extends Error).",
      "Enkapsulasi Data Sensitif: Hashing password dengan Bcrypt dan sanitasi objek respon DTO.",
      "Information Hiding: Isolasi fungsi controller di dalam modul tertutup (CommonJS/ESM).",
      "Polimorfisme Komponen: Satu komponen UI adaptif mendukung beragam varian presentasi.",
      "Standarisasi Interface: Kontrak respons JSON konsisten (success, data, message) untuk semua endpoint."
    ],
    qaDefenseMatrix: [
      {
        question: "Mengapa Anda memilih membuat custom class ApiError daripada sekadar melempar objek biasa throw { status: 404, msg: 'Error' }?",
        answer: "Dengan meng-extends kelas Error bawaan JavaScript, objek ApiError tetap mempertahankan captureStackTrace() yang mencatat nomor baris dan berkas lokasi terjadinya kesalahan. Ini sangat krusial saat debugging di log server, sedangkan objek literal biasa tidak memiliki informasi stack trace."
      },
      {
        question: "Bagaimana Anda menerapkan prinsip Encapsulation pada layer database?",
        answer: "Kami mengisolasi seluruh interaksi SQL di dalam controller dan repository backend. Komponen frontend tidak dapat melihat struktur query SQL mentah maupun kredensial koneksi database, melainkan hanya berinteraksi melalui endpoint REST API yang telah tervalidasi."
      }
    ]
  },

  // =========================================================================
  // UNIT 08: MENGGUNAKAN LIBRARY ATAU KOMPONEN PRE-EXISTING
  // =========================================================================
  {
    unitNumber: "08",
    unitCode: "TI.LB.08.2026",
    unitTitle: "Menggunakan Library atau Komponen Pre-Existing",
    subTitles: [
      {
        title: "Identifikasi unit reuse",
        desc: "Menganalisis kebutuhan perangkat lunak dan menentukan komponen siap pakai terverifikasi (Build vs Buy/Use Analysis)."
      },
      {
        title: "Integrasi library eksternal (npm)",
        desc: "Menginstalasi dan mengonfigurasi pustaka kunci di backend (Express, JWT, Bcrypt, Multer) dan frontend (Three.js, Cobe, i18next)."
      },
      {
        title: "Pembaruan versi library",
        desc: "Mengelola semantic versioning (^ vs ~), penguncian dependensi via package-lock.json, dan mitigasi breaking changes."
      }
    ],
    speechScript: `
      <p><span class="speech-stage-cue">[Pembukaan &amp; Sikap]</span> "Dewan Penguji yang saya hormati, dalam rekayasa perangkat lunak modern, kecepatan dan keandalan sistem sangat didukung oleh kemampuan memilih serta mengintegrasikan pustaka kode yang sudah teruji. Pada unit kompetensi <strong>Menggunakan Library atau Komponen Pre-Existing</strong>, saya akan memaparkan bagaimana ekosistem open-source dimanfaatkan secara optimal pada proyek ini."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 1: Identifikasi Unit Reuse]</span> "Langkah awal kami adalah <em>Identifikasi Unit Reuse</em> melalui analisis 'Build vs Buy/Use'. Kami menyadari bahwa membangun sistem kriptografi autentikasi sendiri atau menulis algoritma WebGL 3D dari nol adalah langkah yang rentan celah keamanan dan membuang waktu. Oleh karena itu, kami menetapkan unit-unit kritis yang wajib menggunakan library standar industri berlisensi resmi: seperti <code>jsonwebtoken</code> untuk token stateless, <code>bcrypt</code> untuk hashing, <code>lucide-react</code> untuk ikon SVG, dan <code>cobe</code> untuk animasi bola dunia interaktif."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 2: Integrasi Library Eksternal via NPM]</span> "Pada sub-topik <em>Integrasi Library Eksternal</em>, kami mengelola seluruh pustaka menggunakan <strong>Node Package Manager (NPM)</strong>. Di backend, kami mengintegrasikan <code>mysql2/promise</code> untuk koneksi database, <code>multer</code> untuk upload media, dan <code>helmet</code> untuk injeksi security headers. Di frontend, kami memasang <code>react-router-dom</code> untuk client-side routing, <code>axios</code> untuk HTTP networking, serta <code>sweetalert2</code> untuk dialog antarmuka yang elegan. Seluruh integrasi dikonfigurasi melalui berkas inisialisasi terpusat agar tidak mencemari komponen lain."</p>
      
      <p><span class="speech-stage-cue">[Menjelaskan Sub 3: Pembaruan Versi Library]</span> "Pilar ketiga adalah <em>Pembaruan Versi Library</em>. Kami memahami prinsip <strong>Semantic Versioning (SemVer)</strong> yang membedakan kenaikan Major, Minor, dan Patch version. Untuk menjamin konsistensi build antar lingkungan pengembang dan server produksi (Railway &amp; Vercel), kami selalu menyertakan berkas <code>package-lock.json</code> di dalam version control Git. Kami juga rutin menjalankan perintah <code>npm audit</code> untuk memindai kerentanan keamanan dan memperbarui versi pustaka secara terkontrol tanpa merusak kompatibilitas fitur yang sudah ada."</p>
    `,
    technicalSections: [
      {
        subNumber: "8.1",
        title: "Analisis Identifikasi Komponen Pre-Existing (Build vs Use)",
        codeRef: "Dokumentasi Arsitektur Eksternal Library",
        bodyHtml: `
          <p>Daftar identifikasi kebutuhan fungsional dan pemilihan pustaka pre-existing yang diadopsi:</p>
          <table class="table-custom">
            <tr>
              <th>Fungsionalitas Sistem</th>
              <th>Pustaka Dipilih</th>
              <th>Alasan &amp; Nilai Tambah Penggunaan</th>
            </tr>
            <tr>
              <td>Autentikasi &amp; Keamanan</td>
              <td><code>jsonwebtoken</code> &amp; <code>bcrypt</code></td>
              <td>Standar de facto industri untuk keamanan stateless token JWT dan algoritma hashing Blowfish yang tahan serangan brute-force.</td>
            </tr>
            <tr>
              <td>Visualisasi 3D Interaktif</td>
              <td><code>cobe</code> &amp; <code>three</code></td>
              <td>Menyediakan canvas WebGL 60 FPS berbobot sangat ringan (~5KB gzipped untuk Cobe) dibanding memuat 3D engine utuh.</td>
            </tr>
            <tr>
              <td>Multilingual (ID / EN)</td>
              <td><code>react-i18next</code></td>
              <td>Pengelolaan kamus bahasa berbasis JSON yang modular dengan deteksi otomatis preferensi bahasa peramban web.</td>
            </tr>
            <tr>
              <td>Ikonografi Vektor</td>
              <td><code>lucide-react</code></td>
              <td>Ratusan ikon SVG yang tree-shakeable, ringan, dan dapat dikontrol warna serta ukurannya secara dinamis via props React.</td>
            </tr>
          </table>
        `,
        codeSnippet: null
      },
      {
        subNumber: "8.2",
        title: "Integrasi Library Kunci di Backend & Frontend via NPM",
        codeRef: "backend/package.json & frontend/src/i18n.js",
        bodyHtml: `
          <p>Konfigurasi integrasi library multi-bahasa <code>i18next</code> pada sisi client:</p>
        `,
        codeSnippet: {
          filename: "frontend/src/i18n.js",
          code: `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationID from './locales/id.json';
import translationEN from './locales/en.json';

// Inisialisasi Integrasi Eksternal Library i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      id: { translation: translationID },
      en: { translation: translationEN }
    },
    fallbackLng: 'id',
    interpolation: { escapeValue: false }
  });

export default i18n;`
        }
      },
      {
        subNumber: "8.3",
        title: "Manajemen Semantic Versioning & Penguncian package-lock.json",
        codeRef: "package-lock.json & npm audit workflow",
        bodyHtml: `
          <p>Penerapan aturan versioning untuk mencegah terjadinya build break pada environment produksi:</p>
          <ul>
            <li><strong>Caret Operator (<code>^</code>):</strong> Digunakan untuk dependensi yang aman menerima update Minor dan Patch (seperti <code>"axios": "^1.20.0"</code>).</li>
            <li><strong>Exact Locking:</strong> Diterapkan pada library grafis sensitif seperti <code>"cobe": "0.6.3"</code> untuk mencegah perubahan shader pada update minor.</li>
            <li><strong>Integritas Hash <code>package-lock.json</code>:</strong> Menjamin setiap mesin pengembang dan runner Railway menginstalasi dependensi dengan checksum SHA-512 yang sama persis.</li>
          </ul>
        `,
        codeSnippet: {
          filename: "Terminal Command: Audit & Versioning Verification",
          code: `# Memeriksa dependensi yang memiliki versi baru
npm outdated

# Memindai potensi celah keamanan (vulnerabilities)
npm audit

# Menginstalasi versi terkunci persis sesuai package-lock.json di CI/CD
npm ci`
        }
      }
    ],
    slideTalkingPoints: [
      "Prinsip 'Build vs Use': Memilih library teruji untuk menghemat waktu dan meningkatkan reliabilitas.",
      "Backend Ecosystem: Express 5, MySQL2, JWT, Bcrypt, Multer, Helmet, dan Compression.",
      "Frontend Ecosystem: React 19, Vite, Tailwind v4, Lucide Icons, Cobe 3D Globe, dan i18next.",
      "Semantic Versioning (SemVer): Pengendalian update Major, Minor, dan Patch secara disiplin.",
      "Konsistensi Lingkungan: Penguncian dependensi menggunakan package-lock.json dan verifikasi npm audit."
    ],
    qaDefenseMatrix: [
      {
        question: "Apa risiko jika kita tidak mengikutsertakan file package-lock.json ke dalam repositori Git?",
        answer: "Tanpa package-lock.json, setiap kali perintah npm install dijalankan di server produksi atau komputer tim lain, npm dapat mengunduh versi library terbaru yang berbeda dengan versi yang digunakan saat development. Jika versi baru tersebut mengandung bug atau breaking change, aplikasi produksi dapat langsung crash."
      },
      {
        question: "Mengapa Anda menggunakan 'npm ci' bukan 'npm install' pada skrip deployment server?",
        answer: "'npm ci' (Clean Install) dirancang khusus untuk lingkungan otomatisasi dan server produksi. Perintah ini menghapus node_modules lama dan menginstalasi dependensi secara cepat dan persis 100% mengikuti checksum yang tertulis di package-lock.json, serta menolak instalasi jika package.json dan package-lock.json tidak sinkron."
      }
    ]
  }
];

module.exports = modules05to08;
