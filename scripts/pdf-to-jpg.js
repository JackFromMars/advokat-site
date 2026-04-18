const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const certsDir = path.join(__dirname, '..', 'public', 'images', 'certs');

const pdfs = [
  { pdf: 'cert-hsa-2025.pdf', jpg: 'cert-hsa-2025.jpg' },
  { pdf: 'cert-hsa-2024.pdf', jpg: 'cert-hsa-2024.jpg' },
  { pdf: 'cert-hsa-2023.pdf', jpg: 'cert-hsa-2023.jpg' },
  { pdf: 'cert-personal-data-spec.pdf', jpg: 'cert-personal-data-spec.jpg' },
  { pdf: 'cert-personal-data.pdf', jpg: 'cert-personal-data.jpg' },
  { pdf: 'cert-psea-unhcr.pdf', jpg: 'cert-psea-unhcr.jpg' },
  { pdf: 'cert-undss-bsafe.pdf', jpg: 'cert-undss-bsafe.jpg' },
  { pdf: 'cert-psea-sss.pdf', jpg: 'cert-psea-sss.jpg' },
];

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-pdf-viewer'],
  });

  for (const { pdf, jpg } of pdfs) {
    const pdfPath = path.join(certsDir, pdf);
    if (!fs.existsSync(pdfPath)) { console.log('SKIP:', pdf); continue; }

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1000 });

    // Create HTML page that embeds PDF as image via canvas
    const pdfBytes = fs.readFileSync(pdfPath);
    const base64 = pdfBytes.toString('base64');

    await page.setContent(`
      <html>
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
        <style>
          * { margin: 0; padding: 0; }
          body { background: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          canvas { max-width: 100%; }
        </style>
      </head>
      <body>
        <canvas id="canvas"></canvas>
        <script>
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          const pdfData = atob('${base64}');
          const arr = new Uint8Array(pdfData.length);
          for (let i = 0; i < pdfData.length; i++) arr[i] = pdfData.charCodeAt(i);

          pdfjsLib.getDocument({data: arr}).promise.then(pdf => {
            pdf.getPage(1).then(page => {
              const scale = 2;
              const viewport = page.getViewport({scale});
              const canvas = document.getElementById('canvas');
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              const ctx = canvas.getContext('2d');
              page.render({canvasContext: ctx, viewport}).promise.then(() => {
                document.body.setAttribute('data-ready', 'true');
              });
            });
          });
        </script>
      </body>
      </html>
    `, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for render
    await page.waitForFunction(() => document.body.getAttribute('data-ready') === 'true', { timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 500));

    // Screenshot just the canvas element
    const canvas = await page.$('canvas');
    const jpgPath = path.join(certsDir, jpg);
    if (canvas) {
      await canvas.screenshot({ path: jpgPath, type: 'jpeg', quality: 92 });
    } else {
      await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 92 });
    }

    const size = Math.round(fs.statSync(jpgPath).size / 1024);
    console.log('OK:', jpg, size + 'KB');
    await page.close();
  }

  await browser.close();
  console.log('Done!');
})();
