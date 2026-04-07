#!/usr/bin/env node

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const PLACE_ID = "ChIJbYTlkMwPNEcRWuXS1vymzcE";
const PLACE_URL = `https://www.google.com/maps/place/?q=place_id:${PLACE_ID}`;
const OUTPUT_PATH = path.join(__dirname, "..", "public", "data", "reviews.json");
const MIN_RATING = 3;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchReviews() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--lang=uk-UA", "--disable-blink-features=AutomationControlled"],
  });

  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36");
  await page.setExtraHTTPHeaders({ "Accept-Language": "uk-UA,uk;q=0.9" });
  await page.setViewport({ width: 1280, height: 900 });

  console.log("Loading Google Maps...");
  await page.goto(PLACE_URL, { waitUntil: "networkidle2", timeout: 45000 });
  await sleep(2000);

  // Dismiss any popups/dialogs
  console.log("Dismissing popups...");
  await page.evaluate(() => {
    // Close sign-in dialog
    document.querySelectorAll('button').forEach(b => {
      const txt = (b.textContent || '').toLowerCase();
      if (txt.includes('скасувати') || txt.includes('cancel') || txt.includes('not now') || txt.includes('ні')) b.click();
    });
    // Close consent
    document.querySelectorAll('button').forEach(b => {
      const txt = (b.textContent || '').toLowerCase();
      if (txt.includes('прийняти') || txt.includes('accept all') || txt.includes('reject all')) b.click();
    });
  });
  await sleep(2000);

  // Take screenshot after dismissing
  await page.screenshot({ path: path.join(__dirname, 'debug-1.png') });

  // Click reviews tab
  console.log("Looking for reviews tab...");
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('button[role="tab"], button.hh2c6');
    tabs.forEach(tab => {
      const text = tab.textContent || tab.getAttribute('aria-label') || '';
      if (text.match(/відгук|review/i)) tab.click();
    });
  });
  await sleep(3000);

  await page.screenshot({ path: path.join(__dirname, 'debug-2.png') });

  // Scroll reviews panel
  console.log("Scrolling reviews...");
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => {
      const containers = document.querySelectorAll('.m6QErb.DxyBCb, div[tabindex="-1"][role="feed"], div.m6QErb');
      containers.forEach(c => { c.scrollTop = c.scrollHeight; });
    });
    await sleep(1000);
  }

  // Expand all "More" text
  await page.evaluate(() => {
    document.querySelectorAll('button.w8nwRe, button[aria-expanded="false"][jsaction*="review"]').forEach(b => b.click());
  });
  await sleep(500);

  // Extract
  console.log("Extracting...");
  const data = await page.evaluate(() => {
    const result = { rating: 0, totalReviews: 0, reviews: [] };

    // Rating
    const ratingTexts = document.querySelectorAll('.fontDisplayLarge, .F7nice span[aria-hidden="true"]');
    for (const el of ratingTexts) {
      const val = parseFloat((el.textContent || '').replace(',', '.'));
      if (val > 0 && val <= 5) { result.rating = val; break; }
    }

    // Count
    const body = document.body.innerText;
    const m = body.match(/(\d+)\s*відгук/);
    if (m) result.totalReviews = parseInt(m[1]);

    // Reviews
    document.querySelectorAll('div[data-review-id]').forEach(el => {
      const name = el.querySelector('.d4r55, .WNxzHc span')?.textContent?.trim();
      const text = el.querySelector('.wiI7pd, .Jtu6Td span, .MyEned')?.textContent?.trim();
      const time = el.querySelector('.rsqaWe, .dehysf')?.textContent?.trim();

      // Rating from stars
      let rating = 0;
      const starsEl = el.querySelector('.kvMYJc, span[role="img"]');
      if (starsEl) {
        const label = starsEl.getAttribute('aria-label') || '';
        const rm = label.match(/(\d)/);
        if (rm) rating = parseInt(rm[1]);
      }

      if (name && rating) {
        result.reviews.push({ authorName: name, rating, text: text || '', relativeTimeDescription: time || '' });
      }
    });

    return result;
  });

  await page.screenshot({ path: path.join(__dirname, 'debug-3.png') });
  await browser.close();

  data.reviews = data.reviews.filter(r => r.rating >= MIN_RATING);

  console.log(`Rating: ${data.rating}, Total reviews: ${data.totalReviews}`);
  console.log(`Extracted ${data.reviews.length} reviews (${MIN_RATING}+ stars):`);
  data.reviews.forEach((r, i) => console.log(`  ${i + 1}. ${r.authorName} — ${r.rating}★ — "${(r.text || '').slice(0, 80)}"`));

  // Save
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ fetchedAt: new Date().toISOString(), placeId: PLACE_ID, ...data }, null, 2));
  console.log(`\nSaved to ${OUTPUT_PATH}`);
}

fetchReviews().catch(err => { console.error("Error:", err); process.exit(1); });
