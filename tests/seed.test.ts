import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSeed } from "../scripts/generate-seed.mjs";
import { locations, serviceMenus } from "@/data/site";

// The seed migration was applied to the live project on 2026-11-13 and is
// now history, so there is no longer a "matches data/site.ts" check. Later
// menu changes go in a new migration (or, from Prompt H, the admin screens).
describe("catalogue seed", () => {
  it("seeds every branch and every menu item, with no payment while prices are unset", () => {
    const seed: string = buildSeed();
    for (const location of locations) assert.match(seed, new RegExp(`'${location.id}', '${location.title}'`));
    for (const item of Object.values(serviceMenus).flat()) {
      const line = seed.split("\n").find((entry) => entry.includes(`values ('${item.slug}',`));
      assert.ok(line, `${item.slug} seeded`);
      if (item.priceFrom === "TBC") assert.match(line, /, null, 'none',/);
    }
  });
});
