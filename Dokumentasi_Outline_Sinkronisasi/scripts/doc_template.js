/**
 * Formal Technical Documentation Report Template with VS Code IDE Theme
 * Website PT Global Philsonic Technologies (Automation GPT)
 */

function highlightVsCode(rawCode, filename = '') {
  if (!rawCode) return '';
  // Tokenizer regex matching comments, strings, keywords, numbers, functions
  const tokenRegex = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|--[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\b(?:const|let|var|function|return|async|await|import|from|export|default|class|extends|super|new|try|catch|finally|throw|if|else|while|for|switch|case|break|typeof|instanceof|SELECT|FROM|WHERE|ORDER|BY|GROUP|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|AUTO_INCREMENT|DEFAULT|ON|CASCADE|DELIMITER|BEGIN|END|COMMIT|ROLLBACK|TRIGGER|PROCEDURE|AFTER|BEFORE|ROW|AND|OR|ASC|DESC)\b)|(\b(?:true|false|null|undefined|this)\b)|(\b\d+\b)|(\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\())/g;

  let lastIndex = 0;
  let html = '';
  let match;

  while ((match = tokenRegex.exec(rawCode)) !== null) {
    const before = rawCode.slice(lastIndex, match.index);
    html += escapeHtml(before);

    const [full, comment, str, kw, boolConst, num, fn] = match;

    if (comment) {
      html += `<span style="color:#6a9955;font-style:italic;">${escapeHtml(comment)}</span>`;
    } else if (str) {
      html += `<span style="color:#ce9178;">${escapeHtml(str)}</span>`;
    } else if (kw) {
      html += `<span style="color:#569cd6;font-weight:bold;">${escapeHtml(kw)}</span>`;
    } else if (boolConst) {
      html += `<span style="color:#569cd6;">${escapeHtml(boolConst)}</span>`;
    } else if (num) {
      html += `<span style="color:#b5cea8;">${escapeHtml(num)}</span>`;
    } else if (fn) {
      html += `<span style="color:#dcdcaa;">${escapeHtml(fn)}</span>`;
    } else {
      html += escapeHtml(full);
    }
    lastIndex = tokenRegex.lastIndex;
  }
  html += escapeHtml(rawCode.slice(lastIndex));
  return html;
}

const BASE_DOC_CSS = `
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
    font-size: 13.5pt;
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
    page-break-inside: avoid;
  }
  .code-caption {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 8pt;
    font-weight: bold;
    margin-bottom: 3px;
    color: #000000;
  }
  
  /* VS Code IDE Code Block Theme */
  .vscode-box {
    background: #1e1e1e;
    border: 1px solid #333333;
    border-radius: 6px;
    overflow: hidden;
    margin: 4px 0 8px 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  }
  .vscode-titlebar {
    background: #252526;
    border-bottom: 1px solid #333333;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .vscode-dots {
    display: inline-flex;
    gap: 5px;
    align-items: center;
  }
  .vsc-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }
  .vsc-dot-red { background: #ff5f56; }
  .vsc-dot-yellow { background: #ffbd2e; }
  .vsc-dot-green { background: #27c93f; }
  .vscode-tab {
    display: inline-flex;
    align-items: center;
    background: #1e1e1e;
    padding: 3px 12px;
    border-radius: 4px 4px 0 0;
    border-top: 2px solid #007acc;
    color: #ffffff;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 7.5pt;
  }
  .vscode-lang {
    color: #858585;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 6.8pt;
    letter-spacing: 0.5px;
  }
  .vscode-body {
    padding: 8px 12px;
    background: #1e1e1e;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 7.2pt;
    line-height: 1.4;
    text-align: left;
  }
  .vscode-body pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
    color: #d4d4d4;
  }

  /* Architectural Sitemap / Tree Diagram Theme (Clean & Formal, Non-VSCode) */
  .sitemap-tree-box {
    border: 1px solid #000000;
    background: #ffffff;
    margin: 8px 0 12px 0;
    page-break-inside: avoid;
  }
  .sitemap-tree-header {
    background: #f0f0f0;
    border-bottom: 1px solid #000000;
    padding: 6px 10px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 8pt;
    font-weight: bold;
    color: #000000;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .sitemap-tree-header-tag {
    font-size: 7pt;
    font-weight: normal;
    background: #e2e8f0;
    border: 1px solid #cbd5e1;
    padding: 1px 6px;
    border-radius: 3px;
    color: #334155;
    font-family: monospace;
  }
  .sitemap-tree-body {
    padding: 10px 14px;
    background: #fcfcfc;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 7.5pt;
    line-height: 1.45;
    color: #111827;
    text-align: left;
  }
  .sitemap-tree-body pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
    font-family: inherit;
    color: inherit;
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
`;

function generateDocHtmlShell({
  unitNumber,
  unitCode,
  unitTitle,
  executiveSummary,
  checklistMatrix,
  subSections,
  conclusion
}) {
  const checklistRows = (checklistMatrix || []).map((item, idx) => `
    <tr>
      <td style="text-align: center;">${idx + 1}</td>
      <td style="font-weight: bold;">${item.subTitle}</td>
      <td><code>${item.codeRef}</code></td>
      <td>${item.summary}</td>
    </tr>
  `).join('\n');

  const subSectionsHtml = (subSections || []).map(sec => `
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
          <div class="code-caption">Bukti Implementasi Kode Sumber (Visual Studio Code):</div>
          <div class="code-box vscode-box">
            <div class="vscode-titlebar">
              <div class="vscode-dots">
                <span class="vsc-dot vsc-dot-red"></span>
                <span class="vsc-dot vsc-dot-yellow"></span>
                <span class="vsc-dot vsc-dot-green"></span>
              </div>
              <div class="vscode-tab">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#75beff" stroke-width="2.5" style="vertical-align:middle;margin-right:5px;">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                <span>${sec.codeSnippet.filename}</span>
              </div>
              <div class="vscode-lang">VS CODE &bull; UTF-8</div>
            </div>
            <div class="vscode-body">
              <pre><code>${highlightVsCode(sec.codeSnippet.code, sec.codeSnippet.filename)}</code></pre>
            </div>
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
    ${BASE_DOC_CSS}
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

function generateReportHtmlShell({
  docNumber,
  docCode,
  docTitle,
  docSubtitle,
  executiveSummary,
  sections,
  conclusion
}) {
  const sectionsHtml = (sections || []).map(sec => `
    <div class="sub-section-block">
      <h3>${sec.secNumber ? `${sec.secNumber}. ` : ''}${sec.title}</h3>
      <div class="content-body">
        ${sec.contentHtml || ''}
      </div>
      ${sec.diagramHtml ? `
        <div class="diagram-wrapper">
          <div class="diagram-caption">Diagram Alur / Arsitektur:</div>
          ${sec.diagramHtml}
        </div>
      ` : ''}
    </div>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${docNumber ? `Dokumen ${docNumber} - ` : ''}${docTitle}</title>
  <style>
    ${BASE_DOC_CSS}
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
    <div class="unit-title-num">DOKUMEN ${docNumber} &bull; ${docCode}</div>
    <h1>${docTitle}</h1>
    ${docSubtitle ? `<div style="font-family: Arial, sans-serif; font-size: 8.5pt; color: #444444; margin-top: 4px; font-style: italic;">${docSubtitle}</div>` : ''}
  </div>

  <!-- METADATA TABEL -->
  <table class="meta-table">
    <tr>
      <td class="lbl">Penyusun</td>
      <td>Aditya Ristanto Mukti</td>
      <td class="lbl">Proyek</td>
      <td>Website Resmi &amp; Profil Industri PT Global Philsonic Technologies</td>
    </tr>
    <tr>
      <td class="lbl">Ringkasan Dokumen</td>
      <td colspan="3">${executiveSummary}</td>
    </tr>
  </table>

  <!-- PEMBAHASAN MATERI -->
  <h2>Pembahasan &amp; Petunjuk Teknis</h2>
  ${sectionsHtml}

  ${conclusion ? `
    <div class="conclusion-box">
      <div class="conclusion-title">Kesimpulan Dokumen ${docNumber}</div>
      <p>${conclusion}</p>
    </div>
  ` : ''}

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
  generateReportHtmlShell,
  escapeHtml,
  highlightVsCode
};
