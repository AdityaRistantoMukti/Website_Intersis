# 🗺️ DEVELOPMENT ROADMAP
## ISA Career & HRD Website — PT. Intersis Sejahtera Abadi

> **Dokumen ini adalah patokan utama pengerjaan project.**
> Update status checklist setiap kali satu item selesai dikerjakan.

---

## 📌 Informasi Project

| Item | Detail |
|---|---|
| **Project** | ISA Career & HRD Website |
| **Perusahaan** | PT. Intersis Sejahtera Abadi (ISA) |
| **Tujuan** | Public Career Site + Internal HRD Portal |
| **Backend** | Node.js + Express.js |
| **Database** | MySQL |
| **Frontend** | React.js (Public) + React.js (Admin Dashboard) |
| **Testing** | Postman |
| **Dimulai** | September 2026 |

---

## 📁 Referensi Dokumen

| Dokumen | Path | Keterangan |
|---|---|---|
| Sitemap Website | `bahan/SITE_MAP_WEBSITE.pdf` | Peta halaman & menu |
| Struktur Database | `bahan/Struktur_Database_ISA_Career_HRD.pdf` | Desain tabel DB |
| Roadmap (ini) | `DEVELOPMENT_ROADMAP.md` | Patokan fase pengerjaan |
| ERD Database | `database/ERD.md` | Entity Relationship Diagram |
| Schema SQL | `database/schema.sql` | Script CREATE TABLE MySQL |

---

## 🔄 Alur Integrasi Sistem

```
React Public Website  ──────►  REST API  ◄──────  React Admin Dashboard
        │                         │                         │
        │                         ▼                         │
        │                     Express.js                    │
        │                         │                         │
        │                         ▼                         │
        │                       MySQL                       │
        │                                                   │
        └── Lowongan → Apply Now → Google Form → Google Spreadsheet → HRD
```

---

## 👥 Role Pengguna

| Role | Value di DB | Akses | Keterangan |
|---|---|---|---|
| **Public / Guest** | — (tanpa login) | Read-only API | Calon pelamar, masyarakat umum |
| **Administrator** | `administrator` | Full system access | Super admin, kelola semua termasuk user & sistem |
| **HRD** | `hrd` | Full CRUD + kelola Staff HRD | Mengelola konten & akun Staff HRD |
| **Staff HRD** | `staff` | CRUD konten saja | Input & edit konten website publik |

---

## 📂 Scope Pengerjaan

### Area 1 — Area Publik (Career & Employer Branding)

| Menu | Tabel | Status |
|---|---|---|
| A. Tentang Kami / Life at Company | `company_profile`, `core_values`, `gallery` | ⏳ Belum |
| B. Lowongan Kerja (Career / Job Openings) | `job_categories`, `job_vacancies` | ⏳ Belum |
| C. Manfaat & Fasilitas (Benefits & Perks) | `benefits` | ⏳ Belum |
| D. Program Khusus (Internship, MT, OJT) | `programs` | ⏳ Belum |
| E. FAQ & Kontak Recruitment | `faqs`, `contact_recruitment` | ⏳ Belum |

### Area 2 — Area Internal (HRD Portal) *(Fase Berikutnya)*

| Menu | Keterangan |
|---|---|
| Dashboard & Announcements | Pengumuman resmi HRD |
| Profil Karyawan | Data mandiri karyawan |
| Kehadiran & Cuti | Absensi, cuti, lembur |
| Penggajian & Tunjangan | Payslip, BPJS, reimbursement |
| Manajemen Kinerja | KPI/OKR, self-assessment |
| Learning & Development | LMS, materi onboarding |
| Pusat Dokumen | SOP, PP/PKB, formulir |
| HR Helpdesk | Pengaduan, whistleblowing |

---
---

# 📋 FASE PENGERJAAN

---

## ✅ FASE 1 — ANALISIS

> **Tujuan**: Memahami kebutuhan sistem secara menyeluruh sebelum menyentuh kode.

| # | Checklist | Status | Catatan |
|---|---|---|---|
| 1.1 | Pelajari sitemap | ✅ Selesai | Lihat `bahan/SITE_MAP_WEBSITE.pdf` |
| 1.2 | Tentukan data yang diperlukan | ✅ Selesai | 11 tabel, lihat bagian Database |
| 1.3 | Tentukan role pengguna | ✅ Selesai | Public, Staff HRD, HRD Admin |
| 1.4 | Tentukan alur lamaran | ✅ Selesai | Apply Now → Google Form → Spreadsheet → HRD |
| 1.5 | Tentukan kebutuhan admin | ✅ Selesai | CRUD konten + manajemen user + activity log |

### Hasil Analisis Fase 1

**Alur Lamaran:**
```
Pengunjung Website → Halaman Lowongan → Detail Lowongan
        → Klik "Apply Now" → Google Form (eksternal)
        → Data masuk ke Google Spreadsheet
        → HRD review secara manual
```
> PENTING: Tidak ada tabel `applicants` di database tahap ini.

**Keputusan Desain:**
- Semua PK menggunakan `INT AUTO_INCREMENT` (bukan BIGINT)
- Semua FK menyesuaikan tipe `INT`
- `gallery.status` → `ENUM('active','inactive')`
- `programs.status` → `ENUM('active','inactive')`
- `company_profile` & `contact_recruitment` bersifat **singleton** (1 baris)

---

## 🗄️ FASE 2 — DATABASE

> **Tujuan**: Merancang struktur database yang solid sebelum implementasi.

| # | Checklist | Status | Catatan |
|---|---|---|---|
| 2.1 | Buat ERD (Entity Relationship Diagram) | ✅ Selesai | Lihat `database/ERD.md` |
| 2.2 | Tentukan PK/FK | ✅ Selesai | Semua PK → INT, FK menyesuaikan |
| 2.3 | Normalisasi database | ✅ Selesai | Sudah 3NF, lihat ERD |
| 2.4 | Buat database MySQL | ✅ Selesai | Sudah di-seed dengan data dummy |
| 2.5 | Buat migration / schema SQL | ✅ Selesai | Lihat `database/schema.sql` |

### Daftar Tabel

| No | Tabel | Fungsi | PK | Relasi |
|---|---|---|---|---|
| 1 | `users` | Login HRD & Staff | INT | — |
| 2 | `company_profile` | Profil, visi, misi | INT | FK: users.id (updated_by) |
| 3 | `core_values` | Nilai-nilai perusahaan | INT | — |
| 4 | `gallery` | Life at ISA / galeri kegiatan | INT | FK: users.id (created_by) |
| 5 | `job_categories` | Kategori/divisi lowongan | INT | — |
| 6 | `job_vacancies` | Data lowongan kerja | INT | FK: job_categories.id, users.id |
| 7 | `benefits` | Benefits & Perks | INT | — |
| 8 | `programs` | Internship, OJT, MT, dll. | INT | — |
| 9 | `faqs` | Pertanyaan & jawaban FAQ | INT | — |
| 10 | `contact_recruitment` | Kontak rekrutmen | INT | FK: users.id (updated_by) |
| 11 | `activity_logs` | Riwayat aktivitas internal | INT | FK: users.id (user_id) |

### Relasi Utama

```
users ──(1:N)──► company_profile     via updated_by
users ──(1:N)──► gallery             via created_by
users ──(1:N)──► job_vacancies       via created_by
users ──(1:N)──► contact_recruitment via updated_by
users ──(1:N)──► activity_logs       via user_id
job_categories ──(1:N)──► job_vacancies via category_id
```

---

## ⚙️ FASE 3 — BACKEND SETUP

> **Tujuan**: Menyiapkan fondasi project Node.js + Express yang bersih dan terstruktur.

| # | Checklist | Status | Catatan |
|---|---|---|---|
| 3.1 | Setup Node.js & inisialisasi project | ✅ Selesai | `backend/package.json` |
| 3.2 | Setup Express.js | ✅ Selesai | Installed Express 5.2 |
| 3.3 | Setup koneksi database MySQL | ✅ Selesai | `mysql2/promise` pool connection |
| 3.4 | Setup environment (`.env`) | ✅ Selesai | DB_HOST, DB_USER, JWT_SECRET, CORS, dll. |
| 3.5 | Buat struktur folder project | ✅ Selesai | Controllers, Middlewares, Routes, Validators, Utils |
| 3.6 | Buat routing | ✅ Selesai | Public (`/api/public/*`) & Admin (`/api/admin/*`) |
| 3.7 | Buat controller | ✅ Selesai | Public controllers & Admin CRUD controllers |
| 3.8 | Buat validation (middleware) | ✅ Selesai | `express-validator` schemas |

### Struktur Folder Project (Monorepo Clean Architecture)

```
website_intersis/
├── backend/                       # REST API (Node.js + Express.js + MySQL)
│   ├── src/
│   │   ├── config/database.js     # Pool Koneksi MySQL
│   │   ├── controllers/           # Public & Admin Controllers
│   │   ├── middlewares/           # JWT Auth, RBAC, Rate Limiter, Upload, Error Handler
│   │   ├── routes/                # Public & Admin Express Routes
│   │   ├── validators/            # express-validator schemas
│   │   ├── seeders/               # Node.js DB Seeder script
│   │   ├── utils/                 # Response & Activity Logger helpers
│   │   └── server.js              # Express App Entry Point
│   ├── uploads/                   # Folder simpan file gambar yang diupload
│   ├── .env                       # Environment variables
│   └── package.json               # Dependencies backend (express, mysql2, bcrypt, jwt, dll)
├── frontend/                      # Public Website (React.js + Vite)
│   ├── src/                       # Component & Page Views React
│   ├── public/                    # Asset publik
│   ├── index.html                 # Entry point Vite
│   ├── vite.config.js
│   └── package.json               # Dependencies frontend (react, react-dom, vite)
├── database/                      # Skema Database & Dokumentasi
│   ├── schema.sql                 # Script CREATE TABLE MySQL
│   ├── ERD.md                     # ERD Mermaid Diagram
│   ├── seeders/seed_data.sql      # Script Insert Dummy Data MySQL
│   └── docs/                      # 4 File Dokumentasi PDF
├── bahan/                         # Spesifikasi & Referensi Awal
└── DEVELOPMENT_ROADMAP.md         # Patokan Acuan Development
```

---

## 🔐 FASE 4 — AUTHENTICATION

> **Tujuan**: Keamanan akses internal HRD menggunakan JWT.

| # | Checklist | Status | Catatan |
|---|---|---|---|
| 4.1 | Endpoint Register user admin | ✅ Selesai | Dikontrol via Admin/HRD RBAC (`POST /api/admin/users`) |
| 4.2 | Endpoint Login | ✅ Selesai | `POST /api/admin/auth/login` |
| 4.3 | Password hashing | ✅ Selesai | `bcrypt` (10 rounds) |
| 4.4 | JWT generation & verification | ✅ Selesai | `jsonwebtoken` (8h expire) |
| 4.5 | Authentication middleware | ✅ Selesai | `verifyToken` middleware |
| 4.6 | Role & permission middleware | ✅ Selesai | `restrictTo` middleware (`administrator`, `hrd`, `staff`) |

### Alur Authentication

```
POST /api/auth/login
        │
        ▼
   Cek email + password (bcrypt.compare)
        │
        ▼
   Generate JWT (payload: id, role, name)
        │
        ▼
   Return: { token, user: { id, name, role } }

--- Request ke endpoint protected ---

Request Header: Authorization: Bearer <token>
        │
        ▼
   authMiddleware → verifikasi JWT
        │
        ▼
   roleMiddleware → cek role jika perlu
        │
        ▼
   Controller dieksekusi
```

### Hak Akses per Role

| Endpoint | Public | Staff HRD | HRD | Administrator |
|---|---|---|---|---|
| GET /api/public/* | ✅ | ✅ | ✅ | ✅ |
| POST/PUT/DELETE /api/admin/konten | ❌ | ✅ | ✅ | ✅ |
| GET/POST/PUT/DELETE /api/admin/users (staff) | ❌ | ❌ | ✅ | ✅ |
| GET/POST/PUT/DELETE /api/admin/users (all) | ❌ | ❌ | ❌ | ✅ |
| GET /api/admin/logs | ❌ | ❌ | ✅ | ✅ |
| Akses pengaturan sistem | ❌ | ❌ | ❌ | ✅ |

---

## 🌐 FASE 5 — API ENDPOINTS

> **Tujuan**: Membangun semua endpoint yang dibutuhkan Public Site & Admin Dashboard.

| # | Modul API | Public (GET) | Admin (CRUD) | Status |
|---|---|---|---|---|
| 5.1 | Company Profile | ✅ GET | GET + PUT (singleton) | ✅ Selesai |
| 5.2 | Core Values | ✅ GET | GET/POST/PUT/DELETE | ✅ Selesai |
| 5.3 | Gallery | ✅ GET | GET/POST/PUT/DELETE | ✅ Selesai |
| 5.4 | Job Categories | ✅ GET | GET/POST/PUT/DELETE | ✅ Selesai |
| 5.5 | Job Vacancies | ✅ GET + GET/:id | Full CRUD | ✅ Selesai |
| 5.6 | Benefits | ✅ GET | Full CRUD | ✅ Selesai |
| 5.7 | Programs | ✅ GET | Full CRUD | ✅ Selesai |
| 5.8 | FAQs | ✅ GET | Full CRUD | ✅ Selesai |
| 5.9 | Contact Recruitment | ✅ GET | GET + PUT (singleton) | ✅ Selesai |
| 5.10 | Auth | — | POST login, PUT password, GET me | ✅ Selesai |
| 5.11 | Users (Admin) | — | Full CRUD (HRD & Admin) | ✅ Selesai |
| 5.12 | Activity Logs | — | GET audit logs (HRD & Admin) | ✅ Selesai |

### Detail Endpoint Public (Read Only)

```
GET  /api/public/company               → Profil, visi, misi perusahaan
GET  /api/public/core-values           → Daftar core values (status=active)
GET  /api/public/gallery               → Daftar galeri (status=active)
GET  /api/public/gallery?category=xx   → Filter galeri by kategori
GET  /api/public/job-categories        → Daftar kategori (status=true)
GET  /api/public/jobs                  → Daftar lowongan (status=published)
GET  /api/public/jobs?category_id=1    → Filter by kategori
GET  /api/public/jobs?type=Full+Time   → Filter by employment_type
GET  /api/public/jobs?location=Jakarta → Filter by lokasi
GET  /api/public/jobs/:id              → Detail satu lowongan
GET  /api/public/benefits              → Daftar benefits (status=active)
GET  /api/public/programs              → Daftar program (status=active)
GET  /api/public/faqs                  → Daftar FAQ (status=active)
GET  /api/public/contact               → Info kontak rekrutmen
```

---

## 🧪 FASE 6 — TESTING (Postman)

> **Tujuan**: Memastikan semua endpoint bekerja dengan benar sebelum integrasi frontend.

| # | Checklist | Status | Catatan |
|---|---|---|---|
| 6.1 | Test semua endpoint GET (publik) | ✅ Selesai | Tested & Verified |
| 6.2 | Test endpoint POST (admin) | ✅ Selesai | Tested & Verified |
| 6.3 | Test endpoint PUT (admin) | ✅ Selesai | Tested & Verified |
| 6.4 | Test endpoint DELETE (admin) | ✅ Selesai | Tested & Verified |
| 6.5 | Test validasi input (error handling) | ✅ Selesai | express-validator 422 verified |
| 6.6 | Test authentication (login, token) | ✅ Selesai | JWT login & Bearer token verified |
| 6.7 | Test authorization (role check) | ✅ Selesai | 403 Forbidden verified for unauthorized roles |
| 6.8 | Test upload file/gambar | ✅ Selesai | Multer middleware configured & verified |

### Postman Setup

- Buat **Collection**: `ISA Career HRD API`
- Buat **Environment**: `ISA - Local`
  - Variable `base_url` → `http://localhost:3000`
  - Variable `token` → *(diisi otomatis via test script setelah login)*
- Pisahkan folder request: `Public`, `Auth`, `Admin`

---

## 🔗 FASE 7 — INTEGRASI

> **Tujuan**: Menghubungkan backend API dengan kedua aplikasi React.

| # | Checklist | Status | Catatan |
|---|---|---|---|
| 7.1 | Setup React Public Website | ⏳ Belum | Vite + React |
| 7.2 | Integrasi API publik ke React Public | ⏳ Belum | Axios / Fetch |
| 7.3 | Setup React Admin Dashboard | ⏳ Belum | Vite + React |
| 7.4 | Integrasi Auth (login) ke Admin | ⏳ Belum | JWT disimpan di localStorage |
| 7.5 | Integrasi semua CRUD ke Admin Dashboard | ⏳ Belum | |
| 7.6 | CORS configuration di backend | ⏳ Belum | Allow origin dari kedua frontend |
| 7.7 | End-to-end testing | ⏳ Belum | |

### Arsitektur Integrasi

```
+------------------------+       +---------------------+       +------------------------+
|   React Public Site    |       |    Express.js API   |       |   React Admin Panel    |
|   (Port: 5173)         |◄─────►|    (Port: 3000)     |◄─────►|   (Port: 5174)         |
|                        |       |                     |       |                        |
|  - Tentang Kami        |       |  - Routes           |       |  - Login               |
|  - Lowongan Kerja      |       |  - Controllers      |       |  - CRUD konten         |
|  - Benefits            |       |  - Middleware       |       |  - Kelola lowongan     |
|  - Program Khusus      |       |  - MySQL Connection |       |  - Activity log        |
|  - FAQ & Kontak        |       |                     |       |  - Manajemen user      |
|  - Apply → Google Form |       +---------------------+       +------------------------+
+------------------------+                 |
                                           ▼
                                    +-------------+
                                    |    MySQL    |
                                    |  Database   |
                                    +-------------+
```

---

## 📊 STATUS PROGRESS KESELURUHAN

| Fase | Nama | Progress |
|---|---|---|
| Fase 1 | Analisis | ✅ **Selesai** |
| Fase 2 | Database | ✅ **Selesai** |
| Fase 3 | Backend Setup | ✅ **Selesai** |
| Fase 4 | Authentication | ✅ **Selesai** |
| Fase 5 | API Endpoints | ✅ **Selesai** |
| Fase 6 | Testing & Verifikasi | ✅ **Selesai** |
| Fase 7 | Integrasi Frontend | ⏳ **Siap Dimulai** |

---

## 📝 CATATAN & KEPUTUSAN TEKNIS

| Tanggal | Keputusan | Alasan |
|---|---|---|
| 25 Sep 2026 | PK semua tabel → `INT` bukan `BIGINT` | Skala project tidak membutuhkan BIGINT |
| 25 Sep 2026 | `gallery.status` → `ENUM('active','inactive')` | Konsistensi dengan tabel lain |
| 25 Sep 2026 | `programs.status` → `ENUM('active','inactive')` | Konsistensi, tidak perlu draft/closed |
| 25 Sep 2026 | Tidak ada tabel `applicants` | Apply Now → Google Form, kandidat di Google Spreadsheet |
| 25 Sep 2026 | Backend: Node.js + Express.js | Pilihan stack tim |
| 25 Sep 2026 | Auth: JWT | Stateless, cocok untuk REST API + dua frontend |
| 25 Sep 2026 | Role: 4 level (administrator, hrd, staff, public) | Kebutuhan hierarki akses yang lebih granular |
| 25 Sep 2026 | `users.role` → `ENUM('administrator','hrd','staff')` | Menyesuaikan 4 role yang disepakati |

---

## 🚀 LANGKAH SELANJUTNYA

**Saat ini → Fase 7 — Integrasi Frontend (Public Career Site & Admin Portal):**
- [ ] Setup React Public Site (`frontend/`) dengan Vite & React 19
- [ ] Integrasi API Publik ke komponen UI React (Tentang Kami, Lowongan Kerja, Benefits, Program Khusus, FAQ, Kontak)
- [ ] Setup React Admin Dashboard (`admin/` atau `frontend/src/admin`) untuk manajemen CRUD & Auth Login HRD
- [ ] End-to-end testing integrasi Frontend + Backend REST API + MySQL Database

---

*Last Updated: 25 September 2026 — Fase 1 - 6 Selesai (Analisis, Database, Backend, Auth, API, & Testing)*
