/**
 * npm run check:images
 *
 * Lists temporary Instagram images the site still uses: any path under
 * /images/{folder}/temp/ and any asset tagged source: "instagram-temp" in
 * data/, app/ or components/. Also lists temp files on disk that nothing
 * uses, and tags pointing outside a temp/ folder.
 *
 * Exits non-zero when NEXT_PUBLIC_SITE_ENV is "production" and any temporary
 * image is still referenced, so a production build step can block on it.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIRS = ["data", "app", "components", "lib"];
const SOURCE_EXT = /\.(tsx?|jsx?|mjs|json|css)$/;
const TEMP_PATH = /\/images\/[\w-]+\/temp\/[^"'`\s)]+/g;
const TEMP_TAG = /source\s*:\s*["'`]instagram-temp["'`]/g;

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

// References in source
const references = [];
const tags = [];
for (const file of SOURCE_DIRS.flatMap((dir) => walk(join(root, dir)))) {
  if (!SOURCE_EXT.test(file)) continue;
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const [match] of line.matchAll(TEMP_PATH)) {
      references.push({ src: match, at: `${rel(file)}:${index + 1}` });
    }
    if (TEMP_TAG.test(line)) tags.push({ at: `${rel(file)}:${index + 1}` });
    TEMP_TAG.lastIndex = 0;
  });
}

// Temp files on disk
const imagesDir = join(root, "public", "images");
const onDisk = walk(imagesDir)
  .filter((file) => file.split(sep).includes("temp") && !file.endsWith(".gitkeep"))
  .map((file) => "/" + relative(join(root, "public"), file).split(sep).join("/"));

const referenced = new Set(references.map((ref) => ref.src));
const unused = onDisk.filter((src) => !referenced.has(src));
const missing = [...referenced].filter((src) => !onDisk.includes(src));

const env = process.env.NEXT_PUBLIC_SITE_ENV ?? "(not set)";
console.log(`check:images  NEXT_PUBLIC_SITE_ENV=${env}\n`);

if (references.length === 0 && tags.length === 0) {
  console.log("No temporary Instagram images are referenced.");
} else {
  console.log(`Temporary Instagram images still referenced (${referenced.size}):`);
  for (const ref of references) console.log(`  ${ref.src}  <- ${ref.at}`);
  if (tags.length) {
    console.log(`\nAssets tagged source: "instagram-temp" (${tags.length}):`);
    for (const tag of tags) console.log(`  ${tag.at}`);
  }
  if (tags.length !== references.length) {
    console.log(
      `\nNote: ${references.length} temp path(s) but ${tags.length} instagram-temp tag(s). ` +
        "Every temp image should live in a temp/ folder and carry the tag.",
    );
  }
}

if (missing.length) {
  console.log("\nReferenced but missing from public/images:");
  for (const src of missing) console.log(`  ${src}`);
}
if (unused.length) {
  console.log("\nTemp files on disk that nothing references (safe to delete):");
  for (const src of unused) console.log(`  ${src}`);
}

const inUse = references.length > 0 || tags.length > 0;
if (inUse && process.env.NEXT_PUBLIC_SITE_ENV === "production") {
  console.error(
    "\nFAIL: temporary Instagram images are still referenced in a production build. " +
      "Replace them with final photography (see public/images/README.md).",
  );
  process.exit(1);
}
if (missing.length) process.exit(1);
