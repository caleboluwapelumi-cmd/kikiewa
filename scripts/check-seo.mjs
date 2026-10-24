/**
 * npm run check:seo   (run after `npm run build`)
 *
 * Reads every prerendered page in .next/server/app and fails when any page's
 * title (or og:/twitter: title) is longer than 60 characters, any
 * description (or og:/twitter: description) is longer than 155, or any of
 * them contains "TBC" or "{{". Limits from reference/seo-plan.md.
 *
 * It checks the built HTML rather than data/site.ts, so whatever a search
 * engine would see is what gets checked.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const appDir = join(root, ".next", "server", "app");

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;
const FORBIDDEN = ["TBC", "{{"];
// Next's own error shell, not a site page.
const SKIP = new Set(["_global-error.html"]);
// Fallback shells for dynamic routes (e.g. medical-spa/[treatment].html).
// They are templates, never served at that URL: real slugs are prerendered
// and checked, and unknown slugs return a 404.
const DYNAMIC_SHELL = /\[[^\]]+\]/;

if (!existsSync(appDir)) {
  console.error("check:seo: no build output found. Run `npm run build` first.");
  process.exit(1);
}

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, files);
    else if (
      name.endsWith(".html") &&
      !SKIP.has(relative(appDir, path)) &&
      !DYNAMIC_SHELL.test(relative(appDir, path))
    ) {
      files.push(path);
    }
  }
  return files;
}

function decode(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** content="" of every <meta> whose name/property is `key`. */
function metaContents(html, key) {
  const values = [];
  for (const tag of html.match(/<meta\b[^>]*>/g) ?? []) {
    const id = tag.match(/\b(?:name|property)="([^"]*)"/)?.[1];
    if (id !== key) continue;
    const content = tag.match(/\bcontent="([^"]*)"/)?.[1];
    if (content !== undefined) values.push(decode(content));
  }
  return values;
}

function routeOf(file) {
  const path = relative(appDir, file).split(sep).join("/").replace(/\.html$/, "");
  return path === "index" ? "/" : "/" + path;
}

const pages = walk(appDir).sort();
if (pages.length === 0) {
  console.error("check:seo: no prerendered pages found in .next/server/app.");
  process.exit(1);
}

const problems = [];

for (const file of pages) {
  const html = readFileSync(file, "utf8");
  const route = routeOf(file);
  const headEnd = html.indexOf("</head>");
  const head = headEnd === -1 ? html : html.slice(0, headEnd);

  const titleTags = [...head.matchAll(/<title>([\s\S]*?)<\/title>/g)].map((m) => decode(m[1]));
  const titles = [
    ...titleTags.map((value) => ["title", value]),
    ...metaContents(head, "og:title").map((value) => ["og:title", value]),
    ...metaContents(head, "twitter:title").map((value) => ["twitter:title", value]),
  ];
  const descriptions = [
    ...metaContents(head, "description").map((value) => ["description", value]),
    ...metaContents(head, "og:description").map((value) => ["og:description", value]),
    ...metaContents(head, "twitter:description").map((value) => ["twitter:description", value]),
  ];

  if (titleTags.length === 0) problems.push(`${route}: no <title>`);
  if (!descriptions.some(([field]) => field === "description")) {
    problems.push(`${route}: no meta description`);
  }

  const check = (field, value, max) => {
    if (value.length > max) {
      problems.push(`${route}: ${field} is ${value.length} characters (max ${max}): "${value}"`);
    }
    for (const token of FORBIDDEN) {
      if (value.includes(token)) problems.push(`${route}: ${field} contains "${token}": "${value}"`);
    }
  };
  for (const [field, value] of titles) check(field, value, TITLE_MAX);
  for (const [field, value] of descriptions) check(field, value, DESCRIPTION_MAX);
}

if (problems.length) {
  console.error(`check:seo: ${problems.length} problem(s) in ${pages.length} pages\n`);
  for (const problem of problems) console.error("  " + problem);
  process.exit(1);
}

console.log(`check:seo: ${pages.length} pages OK (titles ≤ ${TITLE_MAX}, descriptions ≤ ${DESCRIPTION_MAX}, no TBC or {{).`);
