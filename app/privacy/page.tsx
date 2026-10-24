import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { TbcLabel } from "@/components/Confirmable";
import { legalPages, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.privacy);

/** The policy text itself must come from the client; nothing is drafted here. */
export default function PrivacyPage() {
  return (
    <PageIntro copy={legalPages.privacy} className="pb-space-3xl">
      <TbcLabel className="normal-case tracking-normal">{legalPages.pending}</TbcLabel>
    </PageIntro>
  );
}
