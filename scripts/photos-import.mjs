/**
 * npm run photos:import
 *
 * Takes final photographs from photoshoot/ (git-ignored; named per
 * reference/photoshoot.md) and publishes them for the site:
 *
 * 1. Each file whose name matches a slot in data/photo-slots.ts, or the
 *    product-<slug> / team-<firstname> patterns, is auto-oriented, stripped
 *    of ALL metadata (EXIF, GPS, camera, ICC; converted to sRGB), resized to
 *    fit its long edge (hero 2400px, everything else 1600px, never
 *    enlarged), and encoded as a progressive JPEG at quality 80 to
 *    public/images/shoot/<group>/<slot>.jpg.
 * 2. data/photos.generated.ts is rewritten from what is in
 *    public/images/shoot, so an empty photoshoot/ (a fresh clone) never
 *    drops photos that were already imported. To remove a photo, delete its
 *    file from public/images/shoot and run this again.
 * 3. Reports imported, unchanged, skipped (unknown names) and missing slots.
 *
 * Idempotent: a file is re-encoded only when its source changed (tracked in
 * photoshoot/.import-manifest.json), and written only when the output bytes
 * differ, so re-running replaces changed files only.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { longEdge, photoSlots, slotPatterns } from "../data/photo-slots.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const inbox = join(root, "photoshoot");
const outRoot = join(root, "public", "images", "shoot");
const generated = join(root, "data", "photos.generated.ts");
const manifestPath = join(inbox, ".import-manifest.json");

/** Bump when the encoding settings change, to force a re-encode. */
const PIPELINE = "v1:q80-progressive-mozjpeg-srgb-strip";
const INPUT_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);
const IGNORED = new Set(["readme.md", ".gitkeep", ".import-manifest.json"]);

const rel = (path) => relative(root, path).split(sep).join("/");
const byId = new Map(photoSlots.map((slot) => [slot.id, slot]));

/** The slot a file name belongs to: { id, group } or null. */
function resolveSlot(name) {
  const id = name.toLowerCase();
  const slot = byId.get(id);
  if (slot) return { id, group: slot.group };
  for (const pattern of slotPatterns) {
    if (id.startsWith(pattern.prefix) && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id.slice(pattern.prefix.length))) {
      return { id, group: pattern.group };
    }
  }
  return null;
}

function readManifest() {
  try {
    return JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch {
    return {};
  }
}

async function encode(input, group) {
  const edge = longEdge[group];
  return sharp(input, { failOn: "error" })
    .rotate() // auto-orient from EXIF, before the EXIF is dropped
    .resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true })
    .toColourspace("srgb")
    // sharp writes no metadata unless asked (no keepMetadata/withMetadata):
    // EXIF, GPS, XMP, IPTC and the ICC profile are all left out.
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toBuffer();
}

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, files);
    else files.push(path);
  }
  return files;
}

async function main() {
  mkdirSync(inbox, { recursive: true });
  const manifest = readManifest();
  const imported = [];
  const unchanged = [];
  const skipped = [];
  const failed = [];
  const seen = new Map();

  const inputs = readdirSync(inbox)
    .filter((name) => !IGNORED.has(name.toLowerCase()) && !name.startsWith("."))
    .filter((name) => statSync(join(inbox, name)).isFile())
    .sort();

  for (const file of inputs) {
    const ext = extname(file).toLowerCase();
    const slot = INPUT_EXT.has(ext) ? resolveSlot(basename(file, extname(file))) : null;
    if (!slot) {
      skipped.push(file);
      continue;
    }
    if (seen.has(slot.id)) {
      failed.push(`${file}: ${seen.get(slot.id)} is already the photo for "${slot.id}"`);
      continue;
    }
    seen.set(slot.id, file);

    const source = readFileSync(join(inbox, file));
    const hash = createHash("sha256").update(source).update(PIPELINE).digest("hex");
    const out = join(outRoot, slot.group, slot.id + ".jpg");
    if (manifest[slot.id] === hash && existsSync(out)) {
      unchanged.push(slot.id);
      continue;
    }
    try {
      const jpeg = await encode(source, slot.group);
      const same = existsSync(out) && readFileSync(out).equals(jpeg);
      if (!same) {
        // A slot moves group only if photo-slots.ts changes: clear old copies.
        for (const old of walk(outRoot).filter((path) => basename(path) === slot.id + ".jpg" && path !== out)) {
          rmSync(old);
        }
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, jpeg);
        imported.push(`${file} -> ${rel(out)} (${Math.round(jpeg.length / 1024)} KB)`);
      } else {
        unchanged.push(slot.id);
      }
      manifest[slot.id] = hash;
    } catch (error) {
      failed.push(`${file}: ${error.message}`);
    }
  }

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

  // Rebuild the generated list from what is published.
  const entries = [];
  for (const path of walk(outRoot).filter((path) => path.endsWith(".jpg")).sort()) {
    const id = basename(path, ".jpg");
    if (!resolveSlot(id)) {
      failed.push(`${rel(path)} does not match any slot; rename or delete it`);
      continue;
    }
    const { width, height } = await sharp(path).metadata();
    entries.push([id, { src: "/" + rel(path).replace(/^public\//, ""), width, height }]);
  }
  entries.sort(([a], [b]) => a.localeCompare(b));
  const body = entries
    .map(([id, photo]) => `  ${JSON.stringify(id)}: { src: ${JSON.stringify(photo.src)}, width: ${photo.width}, height: ${photo.height} },`)
    .join("\n");
  const source =
    "// Generated by `npm run photos:import` from public/images/shoot. Do not edit by hand.\n\n" +
    "export type ShootPhoto = { src: string; width: number; height: number };\n\n" +
    `export const shootPhotos: Record<string, ShootPhoto> = {${body ? "\n" + body + "\n" : ""}};\n`;
  const previous = existsSync(generated) ? readFileSync(generated, "utf8").replace(/\r\n/g, "\n") : "";
  if (previous !== source) writeFileSync(generated, source);

  const have = new Set(entries.map(([id]) => id));
  const missingCore = photoSlots.filter((slot) => !slot.optional && !have.has(slot.id)).map((slot) => slot.id);
  const missingOptional = photoSlots.filter((slot) => slot.optional && !have.has(slot.id)).map((slot) => slot.id);
  const coreTotal = photoSlots.filter((slot) => !slot.optional).length;

  const list = (title, items) => {
    console.log(`${title} (${items.length})${items.length ? ":" : ""}`);
    for (const item of items) console.log("  " + item);
  };
  console.log("photos:import\n");
  list("Imported", imported);
  list("Unchanged", unchanged);
  list("Skipped, name matches no slot", skipped);
  console.log(`\nPublished: ${entries.length} photos (${coreTotal - missingCore.length} of ${coreTotal} core slots)`);
  list("Missing core slots", missingCore);
  list("Missing optional slots", missingOptional);
  if (failed.length) {
    console.error("");
    list("FAILED", failed);
    process.exit(1);
  }
}

await main();
