// Fails if any number on the site renders as exactly "0" or "0+".
//   npm run check:stats
// The site is plain HTML (built by v3/build.py), so what is in the files is what visitors see.
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const pages = ["index.html", ...readdirSync(resolve("../work")).filter((f) => f.endsWith(".html")).map((f) => "work/" + f)];
let bad = 0;
for (const p of pages) {
  const html = readFileSync(resolve("..", p), "utf8");
  for (const m of html.matchAll(/<(b|span|dd|td)\b[^>]*>([^<]*)<\/\1>/g)) if (/^\s*0\+?\s*$/.test(m[2])) { bad++; console.error(`✗ ${p}: ${m[0]}`); }
}
console.log(bad ? `${bad} zero values found` : `✓ ${pages.length} pages: no stat renders as 0 or 0+`);
process.exit(bad ? 1 : 0);
