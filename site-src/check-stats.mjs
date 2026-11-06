// Fails if any stat on the page shows exactly "0" or "0+".
//   npm run check:stats            checks ../index.html as built (what a no-JS visitor sees)
//   npm run check:stats -- --live  also loads it in a browser with JS on: normal, reduced motion,
//                                  a #hash jump past the stats, and after scrolling the whole page.
//                                  Needs Playwright on the machine; it is not a project dependency.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const STAT_SEL = [".hstats b", ".node b", ".theme i", ".counters .c b", ".run .metric b", ".dstat b", ".commit .st b", ".proof-stat b"];
const ZERO = /^\s*0\+?\s*$/;
let failed = 0;
const fail = (where, msg) => { failed++; console.error(`✗ ${where}: ${msg}`); };

// 1. Static HTML, no JavaScript
const html = readFileSync(resolve("../index.html"), "utf8");
const root = html.slice(html.indexOf('<div id="root">'));
if (!root.includes('class="counters')) fail("static", "stats are not in the HTML. Run npm run build first.");
for (const m of root.matchAll(/<(b|i)\b[^>]*>([^<]*)<\/\1>/g)) if (ZERO.test(m[2])) fail("static", `found ${m[0]}`);
const need = ["16,767", "200+", "150+", "40+", ">24<", "~10", "~200"];
for (const n of need) if (!root.includes(n)) fail("static", `expected value ${n} is missing`);
console.log(failed ? "" : "✓ static HTML: every stat has its real value");

// 2. Live browser checks
if (process.argv.includes("--live")) {
  let chromium;
  try { ({ chromium } = (await import("node:module")).createRequire(import.meta.url)("playwright")); } catch { console.error("Playwright not found; skipping --live"); process.exit(failed ? 1 : 0); }
  const { createServer } = await import("node:http");
  const { extname } = await import("node:path");
  const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
  const srv = createServer((q, r) => { try { const f = resolve("..", "." + decodeURIComponent(q.url.split("?")[0]).replace(/\/$/, "/index.html")); const body = readFileSync(f); r.writeHead(200, { "content-type": types[extname(f)] || "application/octet-stream" }); r.end(body); } catch { r.writeHead(404); r.end(); } }).listen(0);
  const base = `http://localhost:${srv.address().port}/`;
  const b = await chromium.launch();
  const scan = async (page, where) => {
    const bad = await page.evaluate(({ sel }) => sel.flatMap((s) => [...document.querySelectorAll(s)].filter((e) => /^\s*0\+?\s*$/.test(e.textContent)).map((e) => s + " → " + JSON.stringify(e.textContent))), { sel: STAT_SEL });
    bad.forEach((x) => fail(where, x)); if (!bad.length) console.log(`✓ ${where}`);
  };
  for (const [name, opts, hash] of [["JS on, top of page", {}, ""], ["reduced motion", { reducedMotion: "reduce" }, ""], ["#contact jump past the stats", {}, "#contact"], ["JS off", { javaScriptEnabled: false }, ""]]) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ...opts }); const page = await ctx.newPage();
    await page.goto(base + hash); await page.waitForTimeout(1200); await scan(page, name); await ctx.close();
  }
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  await page.goto(base); await page.waitForTimeout(600);
  for (let y = 0; y < 30000; y += 450) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(60); }
  await page.waitForTimeout(1800); await scan(page, "after scrolling the whole page");
  await b.close(); srv.close();
}
process.exit(failed ? 1 : 0);
