/**
 * Template Helper for Bahan Presentasi PDF Generation
 * Website Intersis / Automation GPT - PT Global Philsonic Technologies
 */

function generateHtmlShell({
  unitNumber,
  unitCode,
  unitTitle,
  subTitles,
  speechScript,
  technicalSections,
  slideTalkingPoints,
  qaDefenseMatrix
}) {
  const subTitlesList = subTitles.map(st => `<li><strong>${st.title}</strong>: ${st.desc}</li>`).join('\n');
  
  const techSectionsHtml = technicalSections.map(sec => `
    <div class="tech-section">
      <h3>${sec.subNumber}. ${sec.title}</h3>
      <div class="tech-meta-badge">Kaitkan ke Codebase: <code>${sec.codeRef}</code></div>
      ${sec.bodyHtml}
      ${sec.codeSnippet ? `
        <div class="code-box">
          <span class="file-tag">${sec.codeSnippet.filename}</span>
          <pre>${escapeHtml(sec.codeSnippet.code)}</pre>
        </div>
      ` : ''}
    </div>
  `).join('\n');

  const qaHtml = qaDefenseMatrix.map((item, idx) => `
    <div class="qa-card">
      <div class="qa-q">Q${idx + 1}: ${item.question}</div>
      <div class="qa-a"><strong>Jawaban Pembelaan Presenter:</strong> ${item.answer}</div>
    </div>
  `).join('\n');

  const slidePointsHtml = slideTalkingPoints.map(point => `<li>${point}</li>`).join('\n');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${unitNumber} - ${unitTitle}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 18mm 16mm 18mm 16mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: 'Times New Roman', Times, Georgia, serif;
      font-size: 10pt;
      line-height: 1.55;
      color: #111827;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    .doc-header {
      border-top: 3px solid #0f172a;
      border-bottom: 1px solid #94a3b8;
      padding: 6px 0;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 7.5pt;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #475569;
    }
    .title-banner {
      border-left: 5px solid #1e40af;
      padding-left: 14px;
      margin-bottom: 16px;
    }
    .unit-badge {
      display: inline-block;
      background: #1e3a8a;
      color: #ffffff;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 3px;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    h1 {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 14.5pt;
      font-weight: bold;
      color: #0f172a;
      margin: 4px 0 6px 0;
      line-height: 1.25;
      text-transform: uppercase;
    }
    .project-subtitle {
      font-size: 9.5pt;
      color: #475569;
      font-style: italic;
      margin: 0;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
    }
    .meta-table td {
      padding: 4px 8px;
      border: 1px solid #cbd5e1;
    }
    .meta-table td.lbl {
      font-weight: bold;
      background: #f1f5f9;
      width: 25%;
      color: #1e293b;
    }
    .speech-box {
      background: #f8fafc;
      border: 1.5px solid #2563eb;
      border-radius: 6px;
      padding: 12px 14px;
      margin: 16px 0;
      page-break-inside: avoid;
    }
    .speech-header {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9pt;
      font-weight: bold;
      color: #1d4ed8;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px dashed #93c5fd;
      padding-bottom: 4px;
    }
    .speech-content {
      color: #0f172a;
      font-size: 9.5pt;
      line-height: 1.55;
    }
    .speech-content p {
      margin-bottom: 8px;
      text-align: justify;
    }
    .speech-stage-cue {
      display: inline-block;
      background: #dbeafe;
      color: #1e40af;
      font-family: Arial, sans-serif;
      font-size: 7.5pt;
      font-weight: bold;
      padding: 1px 5px;
      border-radius: 3px;
      margin-right: 4px;
    }
    h2 {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      font-weight: bold;
      color: #0f172a;
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 3px;
      margin-top: 20px;
      margin-bottom: 10px;
      page-break-after: avoid;
      text-transform: uppercase;
    }
    h3 {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9.5pt;
      font-weight: bold;
      color: #1e40af;
      margin-top: 14px;
      margin-bottom: 4px;
      page-break-after: avoid;
    }
    .tech-meta-badge {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      color: #475569;
      margin-bottom: 8px;
      background: #f1f5f9;
      display: inline-block;
      padding: 2px 6px;
      border-radius: 3px;
    }
    .tech-meta-badge code {
      color: #0284c7;
      font-weight: bold;
    }
    p {
      margin: 0 0 8px 0;
      text-align: justify;
    }
    ul, ol {
      margin: 0 0 10px 0;
      padding-left: 20px;
    }
    li {
      margin-bottom: 4px;
      text-align: justify;
    }
    .table-custom {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px 0;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      page-break-inside: avoid;
    }
    .table-custom th {
      background: #1e293b;
      color: #ffffff;
      padding: 5px 8px;
      text-align: left;
      border: 1px solid #1e293b;
    }
    .table-custom td {
      padding: 4px 8px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
    }
    .table-custom tr:nth-child(even) td {
      background: #f8fafc;
    }
    .code-box {
      background: #0f172a;
      color: #f8fafc;
      border-radius: 4px;
      padding: 8px 12px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 7.5pt;
      line-height: 1.4;
      margin: 8px 0 12px 0;
      page-break-inside: avoid;
      border-left: 3px solid #38bdf8;
    }
    .code-box .file-tag {
      color: #94a3b8;
      font-size: 7pt;
      border-bottom: 1px solid #334155;
      padding-bottom: 2px;
      margin-bottom: 5px;
      display: block;
    }
    .code-box pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .qa-card {
      border: 1px solid #cbd5e1;
      border-left: 4px solid #10b981;
      background: #fdfdfd;
      padding: 8px 12px;
      margin-bottom: 8px;
      border-radius: 4px;
      page-break-inside: avoid;
    }
    .qa-q {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      font-weight: bold;
      color: #065f46;
      margin-bottom: 3px;
    }
    .qa-a {
      font-size: 8.5pt;
      color: #1e293b;
      line-height: 1.45;
    }
    .slide-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-left: 4px solid #f59e0b;
      padding: 8px 12px;
      border-radius: 4px;
      margin: 12px 0 16px 0;
      page-break-inside: avoid;
    }
    .slide-box-title {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      font-weight: bold;
      color: #b45309;
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    .slide-box ul {
      margin: 0;
      padding-left: 18px;
    }
    .slide-box li {
      font-size: 8.5pt;
      color: #78350f;
      margin-bottom: 2px;
    }
    .page-break {
      page-break-after: always;
    }
  </style>
</head>
<body>

  <!-- HEADER DOKUMEN RESMI -->
  <div class="doc-header">
    <div>DOSSIER PRESENTASI KOMPETENSI REKAYASA PERANGKAT LUNAK</div>
    <div>PT GLOBAL PHILSONIC TECHNOLOGIES (INTERSIS) &bull; 2026</div>
  </div>

  <!-- TITLE BANNER -->
  <div class="title-banner">
    <div class="unit-badge">UNIT KOMPETENSI ${unitNumber} &bull; ${unitCode}</div>
    <h1>${unitTitle}</h1>
    <div class="project-subtitle">Implementasi Riil pada Proyek: Portal Karir, Profil Industri & Modul Automation-GPT (Fullstack Web)</div>
  </div>

  <!-- METADATA TABEL -->
  <table class="meta-table">
    <tr>
      <td class="lbl">Presenter / Mahasiswa</td>
      <td>Aditya Ristanto Mukti (Fullstack Web Developer Intern)</td>
      <td class="lbl">Repository</td>
      <td><code>github.com/AdityaRistantoMukti/Website_Intersis</code></td>
    </tr>
    <tr>
      <td class="lbl">Institusi / Mitra</td>
      <td>PT Global Philsonic Technologies (Intersis) Batam</td>
      <td class="lbl">Tech Stack Utama</td>
      <td>React 19, Vite, Tailwind CSS v4, Node.js Express 5, MySQL2</td>
    </tr>
    <tr>
      <td class="lbl">Cakupan Outline Sub-Title</td>
      <td colspan="3">${subTitles.map(s => s.title).join(' &bull; ')}</td>
    </tr>
  </table>

  <!-- OUTLINE SUB-TITLE OVERVIEW -->
  <h2>I. Peta Outline & Struktur Pembahasan</h2>
  <p>Unit kompetensi <strong>${unitTitle}</strong> ini disusun secara berkesinambungan mencakup seluruh sub-judul yang didefinisikan pada diagram alur kompetensi, diaplikasikan langsung pada arsitektur website yang telah dibangun:</p>
  <ul>
    ${subTitlesList}
  </ul>

  <!-- SPEAKING SCRIPT RESMI PRESENTER -->
  <h2>II. Naskah Wicara Lengkap Presenter (Verbatim Speech Script)</h2>
  <div class="speech-box">
    <div class="speech-header">
      <span>🎤 PANDUAN NARASI WICARA PRESENTER (SPEAKING SCRIPT)</span>
    </div>
    <div class="speech-content">
      ${speechScript}
    </div>
  </div>

  <div class="page-break"></div>

  <!-- PEMBAHASAN TEKNIS RINCI PER SUB-TITLE -->
  <h2>III. Pembahasan Teknis Rinci & Bedah Kode Nyata Proyek</h2>
  <p>Berikut adalah pembuktian implementasi teknis dari masing-masing sub-judul berdasarkan baris kode dan berkas nyata di dalam repository proyek:</p>
  ${techSectionsHtml}

  <!-- SLIDE TALKING POINTS -->
  <h2>IV. Poin Kunci Presentasi (Slide Talking Points)</h2>
  <div class="slide-box">
    <div class="slide-box-title">Pointer Ringkas untuk Tampilan Slide / Layar</div>
    <ul>
      ${slidePointsHtml}
    </ul>
  </div>

  <!-- Q&A DEFENSE MATRIX -->
  <h2>V. Matriks Tanya Jawab & Panduan Pembelaan Sidang (Q&A Defense)</h2>
  <p>Prediksi pertanyaan evaluasi dari Penguji / Asesor / Pembimbing Industri beserta jawaban teknis yang siap dipertahankan:</p>
  ${qaHtml}

</body>
</html>`;
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = {
  generateHtmlShell,
  escapeHtml
};
