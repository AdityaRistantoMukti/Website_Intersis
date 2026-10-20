/**
 * Formal Monochrome Technical Documentation Report Template
 * STRICTLY BLACK & WHITE / MONOCHROME — NO BADGES — NO COLORFUL TEXT
 * Website PT Global Philsonic Technologies (Automation GPT)
 */

function generateDocHtmlShell({
  unitNumber,
  unitCode,
  unitTitle,
  executiveSummary,
  checklistMatrix,
  subSections,
  conclusion
}) {
  const checklistRows = checklistMatrix.map((item, idx) => `
    <tr>
      <td style="text-align: center;">${idx + 1}</td>
      <td style="font-weight: bold;">${item.subTitle}</td>
      <td><code>${item.codeRef}</code></td>
      <td>${item.summary}</td>
    </tr>
  `).join('\n');

  const subSectionsHtml = subSections.map(sec => `
    <div class="sub-section-block">
      <h3>${sec.subNumber}. ${sec.title}</h3>
      
      ${sec.fileLocation ? `
        <div class="meta-file">
          <strong>Lokasi Berkas:</strong> <code>${sec.fileLocation}</code>
        </div>
      ` : ''}

      <div class="content-body">
        ${sec.descriptionHtml}
      </div>

      ${sec.diagramHtml ? `
        <div class="diagram-wrapper">
          <div class="diagram-caption">Diagram Alur / Arsitektur:</div>
          ${sec.diagramHtml}
        </div>
      ` : ''}

      ${sec.codeSnippet ? `
        <div class="code-wrapper">
          <div class="code-caption">Bukti Implementasi Kode Sumber:</div>
          <div class="code-box">
            <span class="file-tag">${sec.codeSnippet.filename}</span>
            <pre>${escapeHtml(sec.codeSnippet.code)}</pre>
          </div>
        </div>
      ` : ''}

      ${sec.tableData ? sec.tableData : ''}
    </div>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Unit ${unitNumber} - ${unitTitle}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 20mm 18mm 20mm 18mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      font-family: 'Times New Roman', Times, Georgia, serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #000000;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    .doc-header {
      border-top: 2px solid #000000;
      border-bottom: 1px solid #000000;
      padding: 5px 0;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #000000;
    }
    .title-banner {
      border-left: 3px solid #000000;
      padding-left: 12px;
      margin-bottom: 14px;
    }
    .unit-title-num {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9pt;
      font-weight: bold;
      text-transform: uppercase;
      color: #000000;
      margin-bottom: 3px;
    }
    h1 {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 14pt;
      font-weight: bold;
      color: #000000;
      margin: 0;
      line-height: 1.25;
      text-transform: uppercase;
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
      border: 1px solid #000000;
      color: #000000;
    }
    .meta-table td.lbl {
      font-weight: bold;
      background: #f0f0f0;
      width: 20%;
    }
    h2 {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10.5pt;
      font-weight: bold;
      color: #000000;
      border-bottom: 1px solid #000000;
      padding-bottom: 3px;
      margin-top: 18px;
      margin-bottom: 8px;
      page-break-after: avoid;
      text-transform: uppercase;
    }
    h3 {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9.5pt;
      font-weight: bold;
      color: #000000;
      margin-top: 12px;
      margin-bottom: 4px;
      page-break-after: avoid;
    }
    p {
      margin: 0 0 6px 0;
      text-align: justify;
    }
    ul, ol {
      margin: 0 0 8px 0;
      padding-left: 18px;
    }
    li {
      margin-bottom: 3px;
      text-align: justify;
    }
    .meta-file {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      margin-bottom: 6px;
      color: #000000;
    }
    .meta-file code {
      font-weight: bold;
    }
    .table-custom {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 12px 0;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      page-break-inside: avoid;
    }
    .table-custom th {
      background: #e5e5e5;
      color: #000000;
      padding: 5px 6px;
      text-align: left;
      border: 1px solid #000000;
      font-weight: bold;
    }
    .table-custom td {
      padding: 4px 6px;
      border: 1px solid #000000;
      vertical-align: top;
      color: #000000;
    }
    .sub-section-block {
      border: 1px solid #000000;
      padding: 10px;
      margin-bottom: 12px;
      background: #ffffff;
    }
    .diagram-wrapper {
      border: 1px solid #000000;
      background: #ffffff;
      padding: 8px;
      margin: 8px 0;
      page-break-inside: avoid;
    }
    .diagram-caption {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      font-weight: bold;
      margin-bottom: 6px;
      text-transform: uppercase;
      color: #000000;
    }
    .code-wrapper {
      margin: 8px 0 4px 0;
    }
    .code-caption {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      font-weight: bold;
      margin-bottom: 3px;
      color: #000000;
    }
    .code-box {
      background: #f9f9f9;
      color: #000000;
      border: 1px solid #000000;
      padding: 6px 8px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 7.2pt;
      line-height: 1.35;
      page-break-inside: avoid;
      text-align: left;
    }
    .code-box .file-tag {
      font-weight: bold;
      border-bottom: 1px solid #cccccc;
      padding-bottom: 2px;
      margin-bottom: 4px;
      display: block;
      color: #333333;
    }
    .code-box pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .conclusion-box {
      border: 1px solid #000000;
      background: #f5f5f5;
      padding: 8px 10px;
      margin-top: 14px;
      page-break-inside: avoid;
    }
    .conclusion-title {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      font-weight: bold;
      color: #000000;
      margin-bottom: 3px;
      text-transform: uppercase;
    }
    .conclusion-box p {
      font-size: 8.5pt;
      color: #000000;
      margin: 0;
    }
    .page-break {
      page-break-after: always;
    }
  </style>
</head>
<body>

  <!-- HEADER DOKUMEN RESMI -->
  <div class="doc-header">
    <div>DOKUMENTASI REKAYASA PERANGKAT LUNAK</div>
    <div>PT GLOBAL PHILSONIC TECHNOLOGIES &bull; 2026</div>
  </div>

  <!-- TITLE BANNER -->
  <div class="title-banner">
    <div class="unit-title-num">UNIT ${unitNumber} &bull; ${unitCode}</div>
    <h1>${unitTitle}</h1>
  </div>

  <!-- METADATA TABEL -->
  <table class="meta-table">
    <tr>
      <td class="lbl">Pengembang</td>
      <td>Aditya Ristanto Mukti</td>
      <td class="lbl">Proyek</td>
      <td>Website Resmi &amp; Profil Industri PT Global Philsonic Technologies</td>
    </tr>
    <tr>
      <td class="lbl">Deskripsi Unit</td>
      <td colspan="3">${executiveSummary}</td>
    </tr>
  </table>

  <!-- TABEL MATRIKS PEMENUHAN OUTLINE -->
  <h2>I. Matriks Pemenuhan Sub-Title Outline</h2>
  <table class="table-custom">
    <thead>
      <tr>
        <th style="width: 5%; text-align: center;">No</th>
        <th style="width: 25%;">Sub-Title Outline</th>
        <th style="width: 35%;">Berkas Implementasi</th>
        <th style="width: 35%;">Deskripsi Teknis Hasil Pengerjaan</th>
      </tr>
    </thead>
    <tbody>
      ${checklistRows}
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- PEMBAHASAN TEKNIS INTI PER SUB-TITLE -->
  <h2>II. Pembahasan Teknis Inti &amp; Bukti Konkret</h2>
  ${subSectionsHtml}

  <!-- KESIMPULAN AKHIR -->
  <div class="conclusion-box">
    <div class="conclusion-title">Kesimpulan Ketercapaian Unit ${unitNumber}</div>
    <p>${conclusion}</p>
  </div>

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
  generateDocHtmlShell,
  escapeHtml
};
