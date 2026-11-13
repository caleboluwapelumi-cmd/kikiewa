/**
 * node --import ./scripts/ts-hooks.mjs …
 *
 * Lets plain Node (which strips TypeScript types natively) load the app's
 * modules outside Next.js, for tests and scripts:
 *  - "@/x" resolves to the project root, as in tsconfig.json, adding .ts,
 *    .tsx or /index.ts when the import has no extension.
 *  - "server-only" resolves to an empty module. Next.js enforces it in the
 *    real build; tests import server modules on purpose.
 */
import { existsSync, statSync } from "node:fs";
import { registerHooks } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CANDIDATES = ["", ".ts", ".tsx", "/index.ts"];

function findFile(base) {
  for (const suffix of CANDIDATES) {
    const path = base + suffix;
    if (existsSync(path) && statSync(path).isFile()) return path;
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") {
      return { url: "data:text/javascript,export{}", format: "module", shortCircuit: true };
    }
    if (specifier.startsWith("@/")) {
      const file = findFile(join(root, specifier.slice(2)));
      if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
    }
    if (
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      context.parentURL?.startsWith("file:") &&
      !/\.[cm]?[jt]sx?$/.test(specifier)
    ) {
      const file = findFile(join(dirname(fileURLToPath(context.parentURL)), specifier));
      if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
