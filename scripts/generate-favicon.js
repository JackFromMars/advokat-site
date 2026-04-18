const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const logoPath = path.join(__dirname, "..", "public", "images", "logo.svg");
const logoSvg = fs.readFileSync(logoPath, "utf8");
// Base64-encode to avoid escaping hassles inside the HTML wrapper
const logoSvgBase64 = Buffer.from(logoSvg).toString("base64");
const logoDataUri = `data:image/svg+xml;base64,${logoSvgBase64}`;

const outputDir = path.join(__dirname, "..", "src", "app");

/**
 * Render the logo centered on a dark rounded-square canvas,
 * then capture at the requested size.
 */
async function renderIcon(browser, size, filename) {
  const page = await browser.newPage();
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });

  // Padding ratio — leave some breathing room around the logo mark
  const pad = Math.round(size * 0.14);
  const inner = size - pad * 2;

  const html = `<!DOCTYPE html>
<html>
<head>
<style>
  html, body {
    margin: 0;
    padding: 0;
    width: ${size}px;
    height: ${size}px;
    background: transparent;
  }
  .bg {
    width: ${size}px;
    height: ${size}px;
    background: #0B0E18;
    border-radius: ${Math.round(size * 0.18)}px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .logo {
    width: ${inner}px;
    height: ${inner}px;
    display: block;
  }
</style>
</head>
<body>
  <div class="bg">
    <img class="logo" src="${logoDataUri}" />
  </div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: "networkidle0" });
  const el = await page.$(".bg");
  const out = path.join(outputDir, filename);
  await el.screenshot({ path: out, omitBackground: true, type: "png" });
  await page.close();
  console.log("Wrote", filename, `(${size}x${size})`);
}

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });

  // Next.js App Router auto-detects these by filename
  await renderIcon(browser, 32, "icon.png");            // standard favicon
  await renderIcon(browser, 180, "apple-icon.png");     // iOS home-screen

  await browser.close();
  console.log("Done!");
})();
