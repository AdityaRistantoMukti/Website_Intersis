import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

PDF_OUTPUT_PATH = r"c:\Projek_Magang\website_intersis\DOKUMENTASI_HOME_PAGE_PT_GPT.pdf"

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        # Don't draw running header/footer on cover page (page 1)
        if self._pageNumber == 1:
            return

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#00897B"))
        
        # Running Header
        self.drawString(16 * mm, 285 * mm, "PT. GLOBAL PHILSONIC TECHNOLOGIES")
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawRightString(194 * mm, 285 * mm, "Dokumentasi Arsitektur & Spesifikasi Home Page")
        
        # Header line
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.6)
        self.line(16 * mm, 282 * mm, 194 * mm, 282 * mm)

        # Footer line
        self.line(16 * mm, 14 * mm, 194 * mm, 14 * mm)
        
        # Running Footer
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#94A3B8"))
        self.drawString(16 * mm, 10 * mm, "Automotive Electronics & Industrial Automation — Batam Free Trade Zone")
        page_str = f"Halaman {self._pageNumber} dari {page_count}"
        self.drawRightString(194 * mm, 10 * mm, page_str)
        self.restoreState()


def build_pdf():
    doc = SimpleDocTemplate(
        PDF_OUTPUT_PATH,
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm
    )

    styles = getSampleStyleSheet()
    
    c_primary = colors.HexColor("#00897B")
    c_dark = colors.HexColor("#0B1320")
    c_text = colors.HexColor("#1E293B")
    c_muted = colors.HexColor("#64748B")

    style_normal = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=c_text
    )

    style_title = ParagraphStyle(
        'CoverTitle',
        parent=styles['Title'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=28,
        textColor=colors.HexColor("#FFFFFF"),
        alignment=0
    )

    style_subtitle = ParagraphStyle(
        'CoverSubtitle',
        parent=style_normal,
        fontName='Helvetica',
        fontSize=10,
        leading=15,
        textColor=colors.HexColor("#CBD5E1")
    )

    style_h1 = ParagraphStyle(
        'Heading1_Custom',
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=c_dark,
        spaceBefore=8,
        spaceAfter=4
    )

    style_h2 = ParagraphStyle(
        'Heading2_Custom',
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=c_primary,
        spaceBefore=7,
        spaceAfter=3
    )

    style_table_header = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#0F172A")
    )

    style_table_cell = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=c_text
    )

    style_code = ParagraphStyle(
        'CodeStyle',
        fontName='Courier',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#0284C7")
    )

    story = []

    # ══════════════════════════════════════════════
    # HALAMAN 1: COVER
    # ══════════════════════════════════════════════
    cover_data = [
        [
            Paragraph("<font color='#2DD4BF'><b>PT. GLOBAL PHILSONIC TECHNOLOGIES</b></font><br/><font size='7.5' color='#94A3B8'>BATAM FREE TRADE ZONE · INDONESIA</font>", style_normal),
            Paragraph("<font color='#2DD4BF' size='7.5'><b>DOKUMENTASI SISTEM RESMI</b></font>", ParagraphStyle('CRight', parent=style_normal, alignment=2))
        ]
    ]
    t_cover_header = Table(cover_data, colWidths=[100*mm, 78*mm])
    t_cover_header.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LINEBELOW', (0,0), (-1,-1), 1, colors.HexColor("#334155")),
    ]))

    cover_main = [
        [t_cover_header],
        [Spacer(1, 20*mm)],
        [Paragraph("<font color='#2DD4BF' size='8.5'><b>WEB PLATFORM ARCHITECTURE & SPECIFICATIONS</b></font>", style_normal)],
        [Spacer(1, 2*mm)],
        [Paragraph("Dokumentasi Komprehensif<br/>Landing Page (Home Page)", style_title)],
        [Spacer(1, 4*mm)],
        [Paragraph("Panduan arsitektur sistem, struktur komponen React, penjelasan fungsi bisnis seluruh section, dan metrik telemetri manufaktur elektronik otomotif & otomasi industri.", style_subtitle)],
        [Spacer(1, 28*mm)],
        [
            Table([
                [
                    Paragraph("<font size='7' color='#94A3B8'>ENTITAS PERUSAHAAN</font><br/><b><font size='8.5' color='#FFFFFF'>PT. GPT / Intersis Group</font></b>", style_normal),
                    Paragraph("<font size='7' color='#94A3B8'>STATUS HALAMAN</font><br/><b><font size='8.5' color='#2DD4BF'>100% Production Ready</font></b>", style_normal),
                    Paragraph("<font size='7' color='#94A3B8'>TEKNOLOGI</font><br/><b><font size='8.5' color='#FFFFFF'>React + CSS3 + i18n</font></b>", style_normal),
                    Paragraph("<font size='7' color='#94A3B8'>TANGGAL RILIS</font><br/><b><font size='8.5' color='#FFFFFF'>September 2026</font></b>", style_normal),
                ]
            ], colWidths=[44*mm, 44*mm, 45*mm, 45*mm],
            style=[
                ('LINEABOVE', (0,0), (-1,-1), 1, colors.HexColor("#334155")),
                ('TOPPADDING', (0,0), (-1,-1), 10),
                ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ])
        ]
    ]

    t_cover_box = Table(cover_main, colWidths=[178*mm])
    t_cover_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_dark),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#1E293B")),
    ]))

    story.append(t_cover_box)
    story.append(PageBreak())

    # ══════════════════════════════════════════════
    # HALAMAN 2: RINGKASAN & ARSITEKTUR KOMPONEN
    # ══════════════════════════════════════════════
    story.append(Paragraph("1. Ringkasan Eksekutif & Karakteristik Landing Page", style_h1))
    story.append(HRFlowable(width="100%", thickness=1.2, color=c_primary, spaceBefore=1, spaceAfter=6))
    
    p1_desc = (
        "Landing Page (Home Page) website <b>PT. Global Philsonic Technologies (GPT)</b> dirancang secara khusus "
        "sebagai gerbang representasi bisnis berskala global (B2B). Mengingat perusahaan bergerak di bidang manufaktur "
        "<b>elektronik otomotif</b> (OEM/ODM headunit, DSP, amplifier) dan <b>otomasi industri</b> (test jig & wire harness), "
        "desain visual dan penyajian konten ditujukan langsung kepada mitra pabrikan otomotif, Tier-1 supplier, serta pembeli internasional."
    )
    story.append(Paragraph(p1_desc, style_normal))
    story.append(Spacer(1, 2*mm))

    box_goals = [
        [
            Paragraph(
                "<b>Sasaran Bisnis Utama Landing Page:</b><br/>"
                "• <b>Membangun Kredibilitas Instan:</b> Menampilkan bukti data kapasitas produksi (80K CPH, 10+ tahun, Cleanroom Class 100K).<br/>"
                "• <b>Edukasi Kapabilitas End-to-End:</b> Dari R&D perancangan skematik sirkuit hingga perakitan turnkey SMT & uji reliabilitas.<br/>"
                "• <b>Menonjolkan Keunggulan Batam FTZ:</b> Akses bebas bea masuk (0% import tariff) dan kedekatan 45 menit ke pelabuhan Singapura.<br/>"
                "• <b>Mendorong Konversi Kemitraan:</b> Mempermudah calon klien meminta penawaran (RFQ) atau menghubungi tim teknis.",
                style_normal
            )
        ]
    ]
    t_goals = Table(box_goals, colWidths=[178*mm])
    t_goals.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0FDF4")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#B2DFDB")),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_goals)
    story.append(Spacer(1, 3*mm))

    story.append(Paragraph("Daftar Berkas & Struktur Komponen React", style_h2))
    
    file_table_data = [
        [Paragraph("Nama Komponen", style_table_header), Paragraph("Path Berkas", style_table_header), Paragraph("Peran & Tanggung Jawab", style_table_header)],
        [
            Paragraph("<b>HomePage.jsx</b>", style_table_cell),
            Paragraph("src/pages/public/HomePage.jsx", style_code),
            Paragraph("Komponen induk page; mengorkestrasi state slider hero, typewriter effect, intersection observer, dan data hooks API.", style_table_cell)
        ],
        [
            Paragraph("<b>Navbar.jsx</b>", style_table_cell),
            Paragraph("src/components/layout/Navbar.jsx", style_code),
            Paragraph("Header sticky responsif dengan transisi shrink on scroll, pemilih bahasa (ID/EN) manual, dan mobile drawer.", style_table_cell)
        ],
        [
            Paragraph("<b>AboutProductsSection</b>", style_table_cell),
            Paragraph("src/components/home/AboutProductsSection.jsx", style_code),
            Paragraph("Layout editorial terpisah: profil pabrik Batam FTZ di sisi kiri dan 4 lini master produk di sisi kanan dengan skematik interaktif.", style_table_cell)
        ],
        [
            Paragraph("<b>CompanyLifecycleSection</b>", style_table_cell),
            Paragraph("src/components/home/CompanyLifecycleSection.jsx", style_code),
            Paragraph("Siklus 4 tahap manufaktur otomotif dengan simulasi 3D HUD (Engineering, Kualitas AOI/X-Ray, Produksi, Batam FTZ).", style_table_cell)
        ],
        [
            Paragraph("<b>GlobalFootprintSection</b>", style_table_cell),
            Paragraph("src/components/home/GlobalFootprintSection.jsx", style_code),
            Paragraph("Peta jangkauan ekspor global berbasis kanvas dot matrix koordinat GPS & radar ping rute ekspor.", style_table_cell)
        ],
        [
            Paragraph("<b>Footer.jsx</b>", style_table_cell),
            Paragraph("src/components/layout/Footer.jsx", style_code),
            Paragraph("Footer korporat memuat kontak fisik pabrik Batam FTZ, legalitas, kepatuhan sertifikasi, dan navigasi cepat.", style_table_cell)
        ],
    ]
    t_files = Table(file_table_data, colWidths=[40*mm, 52*mm, 86*mm])
    t_files.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F8FAFC")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_files)

    story.append(PageBreak())

    # ══════════════════════════════════════════════
    # HALAMAN 3: PENJELASAN SECTION 1 - 4
    # ══════════════════════════════════════════════
    story.append(Paragraph("2. Penjelasan Mendalam Setiap Section Home Page", style_h1))
    story.append(HRFlowable(width="100%", thickness=1.2, color=c_primary, spaceBefore=1, spaceAfter=5))

    # Section 1
    story.append(Paragraph("Section 1: Hero Section (100vh Fullscreen Carousel)", style_h2))
    p_sec1 = (
        "<b>Lokasi Kode:</b> <font color='#0284C7'>HomePage.jsx (Baris 108–213)</font><br/>"
        "• <b>Tujuan:</b> Memberikan kesan pertama (*first impression*) kelas dunia kepada calon klien industri.<br/>"
        "• <b>Carousel Dual-Slide:</b> Menggunakan foto riil lini SMT presisi dan gelombang solder (*Wave Soldering*). Slider berganti otomatis setiap 6.5 detik dengan kontrol jeda (*pause/resume*).<br/>"
        "• <b>Efek Ketik Real-time (Typewriter):</b> Menampilkan pergantian dinamis kata kunci: <i>Elektronik Otomotif, Perakitan SMT Presisi, Otomasi Industri, Partner OEM / ODM</i>.<br/>"
        "• <b>Dual CTA Button:</b> Tombol primer menggulir ke katalog produk (<code>#products-catalog</code>) dan tombol sekunder mengarahkan ke kontak/RFQ (<code>/contact</code>)."
    )
    story.append(Paragraph(p_sec1, style_normal))
    story.append(Spacer(1, 2*mm))

    # Section 2
    story.append(Paragraph("Section 2: Stats Section (Enterprise Telemetry Deck)", style_h2))
    p_sec2 = (
        "<b>Lokasi Kode:</b> <font color='#0284C7'>HomePage.jsx (Baris 215–266)</font><br/>"
        "• <b>Tujuan:</b> Menampilkan metrik kuantitatif (*hard proof*) mengenai kapabilitas pabrik PT GPT.<br/>"
        "• <b>Count-Up Hook (<code>useCountUp</code>):</b> Angka berhitung otomatis saat section masuk ke dalam viewport.<br/>"
        "• <b>4 Metrik Telemetri:</b> <b>10+ Tahun</b> Pengalaman di Batam; <b>80K CPH</b> Kecepatan Penempatan Chip SMT; <b>24/7</b> Dukungan Kemitraan; <b>100%</b> Standar Mutu IPC-A-610 Kelas Otomotif."
    )
    story.append(Paragraph(p_sec2, style_normal))
    story.append(Spacer(1, 2*mm))

    # Section 3
    story.append(Paragraph("Section 3: About & Product Lines (Editorial Split)", style_h2))
    p_sec3 = (
        "<b>Lokasi Kode:</b> <font color='#0284C7'>AboutProductsSection.jsx</font><br/>"
        "• <b>Tujuan:</b> Menyajikan profil pabrik Batam FTZ dan 4 lini produk master dalam tata letak editorial seimbang.<br/>"
        "• <b>Sisi Kiri (Profil Pabrik):</b> Menyoroti legalitas, sertifikasi ISO/IATF, dan keunggulan ekosistem Batam FTZ.<br/>"
        "• <b>Sisi Kanan (4 Master Product Lines):</b> Dilengkapi skematik interaktif (<code>ProductSchematic.jsx</code>):<br/>"
        "  1. <i>Infotainment Kokpit:</i> Headunit Android QLED 10.1\" berstandar OEM, CAN-Bus, wireless CarPlay.<br/>"
        "  2. <i>Audio DSP & Amplifier:</i> Prosesor sinyal 32-bit DSP dan amplifier Class-D efisiensi >88%.<br/>"
        "  3. <i>Contract Electronics (EMS):</i> Perakitan PCB multilayer hingga 16 layer, 01005 micro-chip placement.<br/>"
        "  4. <i>Otomasi & Test Jig:</i> Mesin uji ICT/FCT berbasis PLC, pneumatic servo, dan cloud MES tracking."
    )
    story.append(Paragraph(p_sec3, style_normal))
    story.append(Spacer(1, 2*mm))

    # Section 4
    story.append(Paragraph("Section 4: 4-Stage Manufacturing Lifecycle & Interactive HUD", style_h2))
    p_sec4 = (
        "<b>Lokasi Kode:</b> <font color='#0284C7'>CompanyLifecycleSection.jsx</font><br/>"
        "• <b>Tujuan:</b> Membuktikan transparansi proses manufaktur menyeluruh dari desain hingga pengiriman ekspor.<br/>"
        "• <b>4 Tahapan Interaktif:</b><br/>"
        "  • <i>Stage 1 (Desain & Engineering):</i> R&D skematik sirkuit multilayer dan pulse energi mikroelektronik.<br/>"
        "  • <i>Stage 2 (Kualitas & Pengujian):</i> Inspeksi 3D SPI, 3D AOI inline, X-Ray BGA, dan Burn-in Chamber.<br/>"
        "  • <i>Stage 3 (Produksi Presisi):</i> Cleanroom Class 100K ESD, 10-Zone Reflow Oven N2, barcode MES.<br/>"
        "  • <i>Stage 4 (Rantai Pasok & FTZ):</i> Koridor laut 45 menit Batam–Singapura, tarif 0%, dan C/O Indonesia."
    )
    story.append(Paragraph(p_sec4, style_normal))

    story.append(PageBreak())

    # ══════════════════════════════════════════════
    # HALAMAN 4: PENJELASAN SECTION 5 - 8 & ROADMAP
    # ══════════════════════════════════════════════
    story.append(Paragraph("Section 5: Global Market Reach & Interactive Map", style_h2))
    p_sec5 = (
        "<b>Lokasi Kode:</b> <font color='#0284C7'>GlobalFootprintSection.jsx</font><br/>"
        "• <b>Tujuan:</b> Menampilkan jangkauan pasar ekspor global PT GPT ke pusat industri dunia.<br/>"
        "• <b>Kanvas Proyeksi Koordinat GPS:</b> Mengonversi koordinat GPS riil menjadi matriks titik dot-matrix pada peta datar.<br/>"
        "• <b>Animasi Radar Ping & Rute Ekspor:</b> Memvisualisasikan garis rute perdagangan langsung dari Batam ke negara tujuan (Jepang, Jerman, AS, Singapura, dsb).<br/>"
        "• <b>Interactive Node Popover:</b> Menampilkan modal ringkas peranan hub ekspor saat pin diklik atau di-hover, dengan algoritma pemisah anti-tumpang tindih (*collision resolution*)."
    )
    story.append(Paragraph(p_sec5, style_normal))
    story.append(Spacer(1, 2*mm))

    story.append(Paragraph("Section 6: GPT Core Engineering Values", style_h2))
    p_sec6 = (
        "<b>Lokasi Kode:</b> <font color='#0284C7'>HomePage.jsx (Baris 278–299)</font><br/>"
        "• <b>Tujuan:</b> Mengomunikasikan budaya mutu tanpa kompromi (*Zero-Defect Culture*) dan rekayasa presisi.<br/>"
        "• <b>Dukungan API Dinamis:</b> Data nilai-nilai inti ditarik secara otomatis dari backend melalui hook <code>useCoreValues()</code> dengan sistem fallback data aman jika server offline."
    )
    story.append(Paragraph(p_sec6, style_normal))
    story.append(Spacer(1, 2*mm))

    story.append(Paragraph("Section 7 & 8: B2B CTA Banner & Enterprise Footer", style_h2))
    p_sec7 = (
        "<b>Lokasi Kode:</b> <font color='#0284C7'>HomePage.jsx (Baris 301–318) & Footer.jsx</font><br/>"
        "• <b>B2B CTA Banner:</b> Bagian ajakan bertindak akhir dengan tombol interaktif mikro <code>InteractiveHoverButton</code> yang mengarahkan prospek langsung ke formulir kemitraan (<code>/contact</code>).<br/>"
        "• <b>Enterprise Footer:</b> Memuat legalitas lengkap PT GPT, alamat pabrik Batam FTZ, kontak email penjualan B2B, jam operasional, sertifikasi kepatuhan, serta navigasi tautan cepat."
    )
    story.append(Paragraph(p_sec7, style_normal))
    story.append(Spacer(1, 3*mm))

    story.append(Paragraph("3. Status Pelacakan Navbar & Rencana Langkah Berikutnya", style_h1))
    story.append(HRFlowable(width="100%", thickness=1.2, color=c_primary, spaceBefore=1, spaceAfter=5))
    
    p_roadmap_desc = (
        "Seluruh progres implementasi halaman navigasi (navbar) dipantau melalui dokumen tunggal "
        "<b>NAVBAR_DEVELOPMENT_CHECKLIST.md</b>. Status pengerjaan saat ini:"
    )
    story.append(Paragraph(p_roadmap_desc, style_normal))
    story.append(Spacer(1, 1*mm))

    nav_table_data = [
        [Paragraph("Menu Navbar", style_table_header), Paragraph("Route", style_table_header), Paragraph("Status Pengerjaan", style_table_header), Paragraph("Prioritas", style_table_header)],
        [Paragraph("<b>Home</b>", style_table_cell), Paragraph("/", style_code), Paragraph("<font color='#00897B'><b>SELESAI (100%)</b></font>", style_table_cell), Paragraph("—", style_table_cell)],
        [Paragraph("<b>About Us</b>", style_table_cell), Paragraph("/about", style_code), Paragraph("<font color='#D97706'><b>IN PROGRESS (Sprint Sekarang)</b></font>", style_table_cell), Paragraph("P1 (Utama)", style_table_header)],
        [Paragraph("<b>Automation</b>", style_table_cell), Paragraph("/automation", style_code), Paragraph("Belum Dikerjakan", style_table_cell), Paragraph("P2", style_table_cell)],
        [Paragraph("<b>Products</b>", style_table_cell), Paragraph("/products", style_code), Paragraph("Parsial (Katalog 50%)", style_table_cell), Paragraph("P3", style_table_cell)],
        [Paragraph("<b>Gallery</b>", style_table_cell), Paragraph("/gallery", style_code), Paragraph("Belum Dikerjakan", style_table_cell), Paragraph("P4", style_table_cell)],
        [Paragraph("<b>Career</b>", style_table_cell), Paragraph("/career", style_code), Paragraph("Belum Dikerjakan", style_table_cell), Paragraph("P5", style_table_cell)],
        [Paragraph("<b>Contact</b>", style_table_cell), Paragraph("/contact", style_code), Paragraph("Belum Dikerjakan", style_table_cell), Paragraph("P6", style_table_cell)],
    ]
    t_nav = Table(nav_table_data, colWidths=[38*mm, 32*mm, 70*mm, 38*mm])
    t_nav.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F8FAFC")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_nav)
    story.append(Spacer(1, 2.5*mm))

    box_next = [
        [
            Paragraph(
                "<b>Fokus Kerja Selanjutnya: Halaman About Us (<code>/about</code>)</b><br/>"
                "Sesuai arahan, pengerjaan dimulai dari halaman <b>About Us</b>. Komponen yang akan dibuat mencakup: "
                "Hero profil pabrik Batam FTZ, garis waktu sejarah (milestone timeline interaktif), visi-misi korporat, "
                "galeri sertifikat resmi (ISO 9001, IATF 16949), tur fasilitas cleanroom & mesin SMT, serta kepemimpinan rekayasa.",
                style_normal
            )
        ]
    ]
    t_next = Table(box_next, colWidths=[178*mm])
    t_next.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0F9FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#BAE6FD")),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_next)

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"SUCCESS: PDF generated successfully at {PDF_OUTPUT_PATH}")

if __name__ == "__main__":
    build_pdf()
