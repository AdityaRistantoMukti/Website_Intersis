# 📋 Dokumentasi Laporan Rekayasa Perangkat Lunak
## Proyek: Website Resmi & Profil Industri PT Global Philsonic Technologies (Automation GPT)
**Pengembang:** Aditya Ristanto Mukti  
**Format:** Monokrom (Hitam Putih) Resmi — Tanpa Badge — Fokus Produk & Arsitektur Sistem  
**Tahun:** 2026  

---

### 📌 Ringkasan Isi Folder `Dokumentasi`

Seluruh berkas laporan di folder ini telah diperbarui dan digenerate ulang dalam format **hitam putih (monokrom) formal**, **tanpa badge**, dan **tanpa contoh lowongan kerja/karir**. Seluruh contoh dan diagram berfokus langsung pada modul nyata website: **Katalog Produk Manufaktur Otomasi**, **Profil Perusahaan**, **Galeri Industri**, **Automation-GPT**, dan **Formulir Kontak**.

---

### 📑 Daftar 12 Berkas PDF Laporan

| No | Berkas PDF Laporan | Unit Outline | Sub-Title yang Dibahas | Fokus Implementasi & Diagram |
|---|---|---|---|---|
| **01** | [`01_Mengimplementasikan_User_Interface.pdf`](./01_Mengimplementasikan_User_Interface.pdf) | **Mengimplementasikan User Interface** | &bull; Identifikasi mock-up<br>&bull; Penyusunan hirarki dialog UI<br>&bull; Penerapan tampilan interaktif | Wireframe layout Hero, direct redirection ke `/products` & `/contact`, WebGL 3D Robot Canvas, form multi-tab produk. |
| **02** | [`02_Mengimplementasikan_Rancangan_Entitas_dan_Keterkaitan_Antar_Entitas.pdf`](./02_Mengimplementasikan_Rancangan_Entitas_dan_Keterkaitan_Antar_Entitas.pdf) | **Mengimplementasikan Rancangan Entitas dan Keterkaitan Antar Entitas** | &bull; Perancangan ERD<br>&bull; Identifikasi hubungan antar entitas<br>&bull; Eksekusi query dasar | **Diagram Visual ERD Monokrom Lengkap (Total 15 Tabel Terdaftar)**: 4 domain arsitektural (Katalog Produk & RFQ, Profil CMS FTZ, Keamanan & Telemetri, Fasilitas Internal), Kamus Data 15 tabel, dan DDL/DQL aktual. |
| **03** | [`03_Menerapkan_Perintah_Eksekusi_Bahasa_Pemrograman_Berbasis_Teks_Grafik_dan_Multimedia.pdf`](./03_Menerapkan_Perintah_Eksekusi_Bahasa_Pemrograman_Berbasis_Teks_Grafik_dan_Multimedia.pdf) | **Menerapkan Perintah Eksekusi Bahasa Pemrograman Berbasis Teks, Grafik, dan Multimedia** | &bull; Mekanisme running source code<br>&bull; Debugging<br>&bull; Pengelolaan executable files | Diagram eksekusi runtime Node.js/Vite, logging Morgan, upload gambar produk Multer, Puppeteer CLI. |
| **04** | [`04_Menyusun_Fungsi_File_atau_Sumber_Daya_Pemrograman_dalam_Organisasi_yang_Rapi.pdf`](./04_Menyusun_Fungsi_File_atau_Sumber_Daya_Pemrograman_dalam_Organisasi_yang_Rapi.pdf) | **Menyusun Fungsi, File atau Sumber Daya Pemrograman dalam Organisasi yang Rapi** | &bull; Konvensi penamaan<br>&bull; Penulisan komentar/dokumentasi kode<br>&bull; Struktur folder rapi | Matriks konvensi penamaan, anotasi JSDoc controller produk, dan pohon berkas /backend & /frontend. |
| **05** | [`05_Menulis_Kode_dengan_Prinsip_Sesuai_Guidelines_dan_Best_Practices.pdf`](./05_Menulis_Kode_dengan_Prinsip_Sesuai_Guidelines_dan_Best_Practices.pdf) | **Menulis Kode dengan Prinsip Sesuai Guidelines dan Best Practices** | &bull; Penerapan coding guidelines<br>&bull; Penanganan error/exception<br>&bull; Optimasi efisiensi kode | Diagram arsitektur DRY HTTP client interceptor, penanganan error 1062 duplicate, dan Gzip compression. |
| **06** | [`06_Mengimplementasikan_Pemrograman_Terstruktur.pdf`](./06_Mengimplementasikan_Pemrograman_Terstruktur.pdf) | **Mengimplementasikan Pemrograman Terstruktur** | &bull; Penguasaan tipe data<br>&bull; Percabangan<br>&bull; Perulangan<br>&bull; Prosedur/Fungsi<br>&bull; Array<br>&bull; File I/O | Diagram alur Guard Clauses, filtering array produk manufaktur, dan pembersihan file disk via fs.unlinkSync. |
| **07** | [`07_Mengimplementasikan_Pemrograman_Berorientasi_Objek_OOP.pdf`](./07_Mengimplementasikan_Pemrograman_Berorientasi_Objek_OOP.pdf) | **Mengimplementasikan Pemrograman Berorientasi Objek (OOP)** | &bull; Penerapan Class<br>&bull; Object<br>&bull; Encapsulation<br>&bull; Inheritance<br>&bull; Polymorphism<br>&bull; Interface &amp; Package | Diagram UML Class Inheritance (`class ApiError extends Error`), enkapsulasi bcrypt, dan Button polimorfis. |
| **08** | [`08_Menggunakan_Library_atau_Komponen_Pre_Existing.pdf`](./08_Menggunakan_Library_atau_Komponen_Pre_Existing.pdf) | **Menggunakan Library atau Komponen Pre-Existing** | &bull; Identifikasi unit reuse<br>&bull; Integrasi library eksternal (npm)<br>&bull; Pembaruan versi library | Matriks lengkap dependensi open-source NPM backend & frontend, SemVer, dan verifikasi npm audit. |
| **09** | [`09_Menggunakan_SQL.pdf`](./09_Menggunakan_SQL.pdf) | **Menggunakan SQL** | &bull; Operasi DML<br>&bull; Manipulasi tabel/view<br>&bull; Stored procedure<br>&bull; Function<br>&bull; Trigger<br>&bull; Commit/Rollback | Diagram siklus transaksi ACID (Begin -> Insert Products -> Insert Logs -> Commit / Rollback), trigger produk. |
| **10** | [`10_Menerapkan_Akses_Basis_Data.pdf`](./10_Menerapkan_Akses_Basis_Data.pdf) | **Menerapkan Akses Basis Data** | &bull; Koneksi database dari Node.js/React<br>&bull; Penggunaan library database<br>&bull; Pengujian query | Diagram arsitektur Decoupled 3-Tier Security, konfigurasi pool mysql2, dan profiling EXPLAIN produk. |
| **11** | [`11_Menggunakan_Source_Code_Versioning.pdf`](./11_Menggunakan_Source_Code_Versioning.pdf) | **Menggunakan Source Code Versioning** | &bull; Penggunaan Git/Repository<br>&bull; Alur kerja branching<br>&bull; Merging<br>&bull; Commit<br>&bull; Push/Pull<br>&bull; Cloning | Repositori GitHub resmi, diagram alur Git-Flow Feature Branching, Conventional Commits, dan panduan kloning. |
| **12** | [`12_Soft_Skills_dan_Design_Thinking_Kelompok_Penunjang.pdf`](./12_Soft_Skills_dan_Design_Thinking_Kelompok_Penunjang.pdf) | **Soft Skills / Design Thinking (Kelompok Penunjang)** | &bull; Pengembangan pemikiran inovatif<br>&bull; Kemampuan interpersonal pengembang web | Diagram visual siklus 5 Tahap Design Thinking & tabel pemecahan masalah kebutuhan klien industri. |

---

### 📂 Struktur Direktori

```text
c:/Projek_Magang/website_intersis/Dokumentasi/
├── 01_Mengimplementasikan_User_Interface.pdf
├── 02_Mengimplementasikan_Rancangan_Entitas_dan_Keterkaitan_Antar_Entitas.pdf
├── 03_Menerapkan_Perintah_Eksekusi_Bahasa_Pemrograman_Berbasis_Teks_Grafik_dan_Multimedia.pdf
├── 04_Menyusun_Fungsi_File_atau_Sumber_Daya_Pemrograman_dalam_Organisasi_yang_Rapi.pdf
├── 05_Menulis_Kode_dengan_Prinsip_Sesuai_Guidelines_dan_Best_Practices.pdf
├── 06_Mengimplementasikan_Pemrograman_Terstruktur.pdf
├── 07_Mengimplementasikan_Pemrograman_Berorientasi_Objek_OOP.pdf
├── 08_Menggunakan_Library_atau_Komponen_Pre_Existing.pdf
├── 09_Menggunakan_SQL.pdf
├── 10_Menerapkan_Akses_Basis_Data.pdf
├── 11_Menggunakan_Source_Code_Versioning.pdf
├── 12_Soft_Skills_dan_Design_Thinking_Kelompok_Penunjang.pdf
├── README_DOKUMENTASI_CAPAIAN.md
├── html_sources/                # Sumber HTML monokrom
└── scripts/                     # Skrip Puppeteer builder
```
