/**
 * npm run check:seo   (run after `npm run build`)
 *
 * Checks the built site against reference/site-plan.md, sections 2 and 8:
 *
 * 1. Routes: every page in the site plan is prerendered, and no page exists
 *    that the plan doesn't list. /shop is required on previews; in
 *    production it is a 404 until real products exist. Product pages
 *    (/shop/{slug}) are allowed whenever they are built.
 * 2. Metadata: every page's title (and og:/twitter: title) is ≤ 60
 *    characters, every description ≤ 155, and none contains "TBC" or "{{".
 * 3. Redirects: each old URL redirects permanently (308) to its new home,
 *    no redirect source is also a page, and every destination is a page.
 * 4. Words: no page shows "head office", "division" or "house", or
 *    anything the plan keeps off the website (section 0). "Branch" is
 *    allowed: Ebute and Nitel are "our branches".
 * 5. Dashes: no built page contains an em dash (—) or an en dash (–)
 *    anywhere in its HTML: visible text, attributes, metadata, JSON-LD and
 *    the page data. Copy uses commas, full stops or colons instead.
 *
 * It checks the built output rather than data/site.ts, so whatever a search
 * engine would see is what gets checked.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const appDir = join(root, ".next", "server", "app");
const routesManifest = join(root, ".next", "routes-manifest.json");

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;
const FORBIDDEN = ["TBC", "{{"];
const DASHES = /[\u2013\u2014]/; // en dash, em dash

/** Every page in the site plan (section 2). */
const EXPECTED_ROUTES = [
  "/",
  "/about",
  "/services",
  "/services/facials",
  "/services/massage",
  "/services/aesthetics",
  "/services/hair",
  "/services/nails",
  "/services/makeup",
  "/academy",
  "/academy/cosmetology",
  "/academy/aesthetics",
  "/gallery",
  "/locations",
  "/locations/ebute",
  "/locations/nitel",
  "/book",
  "/contact",
  "/booking-policy",
  "/privacy",
];

/** On previews the shop always builds (sample products); in production only once real products exist. */
const SHOP_ROUTE = "/shop";
if (process.env.NEXT_PUBLIC_SITE_ENV !== "production") EXPECTED_ROUTES.push(SHOP_ROUTE);
/** Built pages the plan allows without listing them one by one. */
const isAllowedExtra = (route) => route === SHOP_ROUTE || /^\/shop\/[a-z0-9-]+$/.test(route);

/** Old URLs and where they must land (site plan, section 2, "Redirects"). */
const EXPECTED_REDIRECTS = [
  ["/salon-spa", "/services"],
  ["/salon-spa/services", "/services"],
  ["/medical-spa", "/services/aesthetics"],
  ["/medical-spa/treatments", "/services/aesthetics"],
  ["/medical-spa/concerns", "/services/aesthetics"],
  ["/medical-spa/concerns/pigmentation", "/services/aesthetics"],
  ["/medical-spa/consultation", "/services/aesthetics"],
  ["/medical-spa/skin-treatment", "/services/aesthetics"],
  ["/beauty-institute", "/academy"],
  ["/beauty-institute/courses", "/academy"],
  ["/beauty-institute/admissions", "/academy"],
  ["/licensing", "/about"],
];

/**
 * Words that must never reach the screen. One brand with equal branches
 * (site plan, section 1; "branch" itself is allowed), and nothing from "Not on the website" (section 0).
 */
const BANNED_WORDS = [
  [/\bhead office\b/i, "head office"],
  [/\bdivisions?\b/i, "division"],
  [/\bhouse\b/i, "house"],
  [/\binjectables?\b/i, "injectable"],
  [/\bfillers?\b/i, "filler"],
  [/\bweight[- ]loss\b/i, "weight loss"],
  [/\bammunization\b/i, "face ammunization"],
  [/\bguaranteed?\b/i, "guaranteed"],
  [/\bpermanent\b/i, "permanent"],
  [/\bpainless\b/i, "painless"],
  [/\bworld[- ]class\b/i, "world-class"],
  [/\bflawless\b/i, "flawless"],
  [/\bmiracle\b/i, "miracle"],
];

// Next's own error shells, not site pages.
const SKIP = new Set(["_global-error.html", "_not-found.html"]);
// Fallback shells for dynamic routes. Templates, never served at that URL.
const DYNAMIC_SHELL = /\[[^\]]+\]/;

if (!existsSync(appDir) || !existsSync(routesManifest)) {
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
      !DYNAMIC_SHELL.test(relative(appDir, path)) &&
      !isNotFound(path)
    ) {
      files.push(path);
    }
  }
  return files;
}

/** Pages prerendered as a 404 (the shop with no products in production) are not pages. */
function isNotFound(htmlPath) {
  const meta = htmlPath.replace(/\.html$/, ".meta");
  if (!existsSync(meta)) return false;
  try {
    return JSON.parse(readFileSync(meta, "utf8")).status === 404;
  } catch {
    return false;
  }
}

function decode(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
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

/** What a visitor or screen reader gets: body text plus alt, aria-label and title. */
function visibleText(html) {
  const body = html.slice(html.indexOf("<body"));
  const withoutCode = body.replace(/<(script|style|template)\b[\s\S]*?<\/\1>/g, " ");
  const attributes = [...withoutCode.matchAll(/\b(?:alt|aria-label|title)="([^"]*)"/g)].map((m) => m[1]);
  const text = withoutCode.replace(/<[^>]+>/g, " ");
  return decode([text, ...attributes].join(" ")).replace(/\s+/g, " ");
}

function routeOf(file) {
  const path = relative(appDir, file).split(sep).join("/").replace(/\.html$/, "");
  return path === "index" ? "/" : "/" + path;
}

const pages = walk(appDir).sort();
const routes = new Set(pages.map(routeOf));
const problems = [];

// 1. Routes
for (const route of EXPECTED_ROUTES) {
  if (!routes.has(route)) problems.push(`${route}: in the site plan but not built`);
}
for (const route of routes) {
  if (!EXPECTED_ROUTES.includes(route) && !isAllowedExtra(route)) problems.push(`${route}: built, but not in the site plan`);
}

// 2. Metadata, 4. Words
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

  const decoded = decode(html);
  const dash = decoded.match(DASHES);
  if (dash) {
    const at = decoded.indexOf(dash[0]);
    const context = decoded.slice(Math.max(0, at - 50), at + 30).replace(/\s+/g, " ").trim();
    const count = decoded.match(new RegExp(DASHES.source, "g")).length;
    problems.push(`${route}: contains ${count} dash(es) (— or –), first: "…${context}…"`);
  }

  const text = [visibleText(html), ...titles.map(([, v]) => v), ...descriptions.map(([, v]) => v)].join(" ");
  for (const [pattern, word] of BANNED_WORDS) {
    const match = text.match(pattern);
    if (match) {
      const at = text.indexOf(match[0]);
      const context = text.slice(Math.max(0, at - 40), at + 40).trim();
      problems.push(`${route}: shows "${word}": "…${context}…"`);
    }
  }
}

// 3. Redirects
const manifest = JSON.parse(readFileSync(routesManifest, "utf8"));
const redirects = (manifest.redirects ?? []).filter((rule) => !rule.internal);
for (const [from, to] of EXPECTED_REDIRECTS) {
  const rule = redirects.find((item) => new RegExp(item.regex).test(from));
  if (!rule) problems.push(`${from}: no redirect (expected 308 to ${to})`);
  else if (rule.destination !== to) problems.push(`${from}: redirects to ${rule.destination}, expected ${to}`);
  else if (rule.statusCode !== 308) problems.push(`${from}: redirect is ${rule.statusCode}, expected 308`);
  if (routes.has(from)) problems.push(`${from}: is a redirect source but still built as a page`);
}
for (const rule of redirects) {
  if (!routes.has(rule.destination)) problems.push(`redirect ${rule.source}: destination ${rule.destination} is not a page`);
  for (const route of routes) {
    if (new RegExp(rule.regex).test(route)) problems.push(`${route}: page is shadowed by redirect ${rule.source}`);
  }
}

if (problems.length) {
  console.error(`check:seo: ${problems.length} problem(s) in ${pages.length} pages\n`);
  for (const problem of problems) console.error("  " + problem);
  process.exit(1);
}

console.log(
  `check:seo: ${pages.length} pages OK (all ${EXPECTED_ROUTES.length} site-plan routes built; ` +
    `titles ≤ ${TITLE_MAX}, descriptions ≤ ${DESCRIPTION_MAX}, no TBC or {{; ` +
    `${EXPECTED_REDIRECTS.length} old URLs redirect 308; no banned words; no em or en dashes).`,
);
