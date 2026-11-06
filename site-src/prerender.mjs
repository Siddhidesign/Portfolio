// After the client build, render the app once and put the HTML inside #root in ../index.html.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const out = resolve("../index.html");
const { render } = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);
const html = readFileSync(out, "utf8");
if (!html.includes('<div id="root"></div>')) throw new Error("index.html has no empty #root to fill");
writeFileSync(out, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`));
rmSync("dist-ssr", { recursive: true, force: true });
console.log("prerendered", out);
