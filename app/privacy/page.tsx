import type { Metadata } from "next";
import { LegalPage, policyIsPending } from "@/components/LegalPage";
import { legalPages, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.privacy, {
  noindex: policyIsPending(legalPages.privacy),
});

/** The policy text itself must come from the client; nothing is drafted here. */
export default function PrivacyPage() {
  return <LegalPage page={legalPages.privacy} />;
}
