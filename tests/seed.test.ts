import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { buildSeed, SEED_PATH } from "../scripts/generate-seed.mjs";
import { locations, serviceMenus } from "@/data/site";

describe("catalogue seed", () => {
  it("matches data/site.ts (run `npm run db:seed` after changing the menu)", () => {
    assert.equal(readFileSync(SEED_PATH, "utf8").replace(/\r\n/g, "\n"), buildSeed());
  });

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
