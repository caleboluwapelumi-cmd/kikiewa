/**
 * npm run check:images
 *
 * Lists every non-final image the site uses: any ImageAsset in data/, app/,
 * components/ or lib/ tagged `source: "stock"` (an Unsplash photo approved
 * to keep), `source: "stock-temp"` (an Unsplash photo still to replace) or
 * `source: "instagram-temp"` (a client photo from Instagram).
 *
 * Fails when:
 * - a tagged image's file is missing from public/,
 * - a stock image (kept or temp) has no row in public/images/CREDITS.md,
 * - the old temp/ folder convention is used without a tag,
 * - NEXT_PUBLIC_SITE_ENV is "production" and any temporary image
 *   (stock-temp or instagram-temp) is still referenced, so a production
 *   build step can block on it. Kept stock is allowed in production.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIRS = ["data", "app", "components", "lib"];
const SOURCE_EXT = /\.(tsx?|jsx?|mjs|json|css)$/;
const SOURCES = ["stock", "stock-temp", "instagram-temp"];
/** Blocked in production. */
const TEMP_SOURCES = ["stock-temp", "instagram-temp"];
/** Need a row in CREDITS.md. */
const STOCK_SOURCES = ["stock", "stock-temp"];
const TAG = /source\s*:\s*["'`](stock-temp|stock|instagram-temp)["'`]/g;
const SRC = /src\s*:\s*["'`]([^"'`]+)["'`]/;
const LEGACY_TEMP_PATH = /\/images\/[\w-]+\/temp\/[^"'`\s)]+/g;
const CREDITS = join(root, "public", "images", "CREDITS.md");

function walk(dir, files = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return files;
  }
  for (const name of entries) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, files);
    else files.push(path);
  }
  return files;
}

const rel = (path) => relative(root, path).split(sep).join("/");
const lineOf = (text, index) => text.slice(0, index).split("\n").length;

/**
 * Each tag belongs to the object literal around it: from the last "{" before
 * the tag to the first "}" after it. ImageAssets hold no nested objects, so
 * that span is the whole asset, and its `src` is the image's path.
 */
const tagged = [];
const legacy = [];
for (const file of SOURCE_DIRS.flatMap((dir) => walk(join(root, dir)))) {
  if (!SOURCE_EXT.test(file)) continue;
  const text = readFileSync(file, "utf8");
  for (const match of text.matchAll(TAG)) {
    const open = text.lastIndexOf("{", match.index);
    const close = text.indexOf("}", match.index);
    const src = text.slice(open, close).match(SRC)?.[1] ?? null;
    tagged.push({ source: match[1], src, at: `${rel(file)}:${lineOf(text, match.index)}` });
  }
  for (const match of text.matchAll(LEGACY_TEMP_PATH)) {
    legacy.push({ src: match[0], at: `${rel(file)}:${lineOf(text, match.index)}` });
  }
}

const credits = existsSync(CREDITS) ? readFileSync(CREDITS, "utf8") : "";
const problems = [];

const env = process.env.NEXT_PUBLIC_SITE_ENV ?? "(not set)";
console.log(`check:images  NEXT_PUBLIC_SITE_ENV=${env}\n`);

for (const source of SOURCES) {
  const rows = tagged.filter((item) => item.source === source);
  if (!rows.length) {
    console.log(`No "${source}" images are referenced.\n`);
    continue;
  }
  const unique = new Set(rows.map((row) => row.src));
  const kind = TEMP_SOURCES.includes(source) ? "temporary, blocked in production" : "kept, allowed in production";
  console.log(`"${source}" images referenced, ${kind} (${unique.size} files, ${rows.length} uses):`);
  for (const row of rows) console.log(`  ${row.src ?? "(no src found)"}  <- ${row.at}`);
  console.log("");
}

for (const row of tagged) {
  if (!row.src) {
    problems.push(`Tag without a src at ${row.at}`);
    continue;
  }
  if (!existsSync(join(root, "public", row.src))) {
    problems.push(`Missing file ${row.src} (${row.at})`);
  }
  if (STOCK_SOURCES.includes(row.source) && !credits.includes(row.src.replace(/^\/images\//, ""))) {
    problems.push(`No credit for ${row.src} in public/images/CREDITS.md (${row.at})`);
  }
}
for (const row of legacy) {
  problems.push(`Old temp/ folder path ${row.src} (${row.at}): move it out of temp/ and tag its source instead`);
}

if (problems.length) {
  console.error("Problems:");
  for (const problem of [...new Set(problems)]) console.error(`  ${problem}`);
  process.exit(1);
}

const temporary = tagged.filter((row) => TEMP_SOURCES.includes(row.source));
if (temporary.length && process.env.NEXT_PUBLIC_SITE_ENV === "production") {
  console.error(
    "FAIL: temporary images (stock-temp or instagram-temp) are still referenced in a production build. " +
      "Replace them with final photography, or approve stock to keep as source \"stock\" (see public/images/README.md).",
  );
  process.exit(1);
}

console.log(
  temporary.length ? "OK for previews. Production builds fail until every temporary image is replaced." : "OK.",
);
