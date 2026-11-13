import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { signPaystackBody, verifyPaystackSignature } from "@/lib/paystack/signature";

const SECRET = "sk_test_unit_secret";
const body = JSON.stringify({ event: "charge.success", data: { reference: "KKW-A2B3-0123456789", amount: 500000 } });

describe("Paystack webhook signature", () => {
  it("accepts a valid HMAC-SHA512 signature of the raw body", () => {
    assert.equal(verifyPaystackSignature(body, signPaystackBody(body, SECRET), SECRET), true);
    // Bytes work the same as the string.
    assert.equal(verifyPaystackSignature(new TextEncoder().encode(body), signPaystackBody(body, SECRET), SECRET), true);
  });

  it("rejects a tampered body", () => {
    const signature = signPaystackBody(body, SECRET);
    const tampered = body.replace("500000", "1");
    assert.equal(verifyPaystackSignature(tampered, signature, SECRET), false);
  });

  it("rejects a tampered or truncated signature", () => {
    const signature = signPaystackBody(body, SECRET);
    const flipped = (signature[0] === "a" ? "b" : "a") + signature.slice(1);
    assert.equal(verifyPaystackSignature(body, flipped, SECRET), false);
    assert.equal(verifyPaystackSignature(body, signature.slice(0, 64), SECRET), false);
    assert.equal(verifyPaystackSignature(body, "not-hex".padEnd(128, "z"), SECRET), false);
  });

  it("rejects a signature made with another key", () => {
    assert.equal(verifyPaystackSignature(body, signPaystackBody(body, "sk_test_other"), SECRET), false);
  });

  it("rejects a missing signature or a missing secret", () => {
    assert.equal(verifyPaystackSignature(body, null, SECRET), false);
    assert.equal(verifyPaystackSignature(body, undefined, SECRET), false);
    assert.equal(verifyPaystackSignature(body, "", SECRET), false);
    assert.equal(verifyPaystackSignature(body, signPaystackBody(body, SECRET), ""), false);
  });
});
