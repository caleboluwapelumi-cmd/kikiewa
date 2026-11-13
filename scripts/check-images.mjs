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
 *   build step can block on it. Kept stock is allowed in production,
 * - a shoot photo listed in data/photos.generated.ts is missing from public/.
 *
 * Photo slots (data/photo-slots.ts): a slot's stock stand-in counts as in
 * use only until its shoot photo is imported. Once replaced, it is listed
 * as replaced and no longer referenced.
 *
 * Also reports (without failing) every file in public/images that nothing
 * references any more, such as a stock or Instagram image a shoot photo
 * replaced, so it can be deleted along with its CREDITS.md row.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { photoSlots } from "../data/photo-slots.ts";
import { shootPhotos } from "../data/photos.generated.ts";

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
const SLOTS_FILE = "data/photo-slots.ts";
/** Stock stand-ins whose slot now has its shoot photo: src -> slot id. */
const replaced = new Map(
  photoSlots
    .filter((slot) => slot.id in shootPhotos)
    .flatMap((slot) => [slot.stock, slot.stockHero].filter(Boolean).map((asset) => [asset.src, slot.id])),
);
/** Every /images/... path the site still uses. */
const referenced = new Set(Object.values(shootPhotos).map((photo) => photo.src));
const IMAGE_PATH = /["'`](\/images\/[^"'`\s)]+)["'`]/g;

const tagged = [];
const legacy = [];
for (const file of SOURCE_DIRS.flatMap((dir) => walk(join(root, dir)))) {
  if (!SOURCE_EXT.test(file)) continue;
  const text = readFileSync(file, "utf8");
  const inSlots = rel(file) === SLOTS_FILE;
  for (const match of text.matchAll(IMAGE_PATH)) {
    if (!(inSlots && replaced.has(match[1]))) referenced.add(match[1]);
  }
  for (const match of text.matchAll(TAG)) {
    const open = text.lastIndexOf("{", match.index);
    const close = text.indexOf("}", match.index);
    const src = text.slice(open, close).match(SRC)?.[1] ?? null;
    // A stand-in replaced by its shoot photo is no longer in use.
    if (inSlots && src && replaced.has(src)) continue;
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

const shootIds = Object.keys(shootPhotos);
console.log(`Shoot photos imported: ${shootIds.length} (npm run photos:import)`);
for (const [id, photo] of Object.entries(shootPhotos)) {
  if (!existsSync(join(root, "public", photo.src))) problems.push(`Missing shoot photo ${photo.src} for "${id}"`);
}
if (replaced.size) {
  console.log("Stock stand-ins replaced by shoot photos (no longer in use):");
  for (const [src, id] of replaced) console.log(`  ${src}  <- ${id}`);
}
console.log("");

const IMAGE_FILE = /\.(jpe?g|png|webp|avif|gif)$/i;
const unreferenced = walk(join(root, "public", "images"))
  .filter((file) => IMAGE_FILE.test(file))
  .map((file) => "/" + rel(file).replace(/^public\//, ""))
  .filter((src) => !referenced.has(src));
if (unreferenced.length) {
  console.log(`Unreferenced files in public/images (${unreferenced.length}), safe to delete with their CREDITS.md rows:`);
  for (const src of unreferenced) console.log(`  ${src}`);
} else {
  console.log("No unreferenced files in public/images.");
}
console.log("");

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
