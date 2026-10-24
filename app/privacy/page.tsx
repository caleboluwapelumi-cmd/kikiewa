import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { pages, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.privacy);

/** The policy text itself must come from the client; nothing is drafted here. */
export default function PrivacyPage() {
  return <PageIntro copy={pages.privacy} className="pb-space-3xl" />;
}
