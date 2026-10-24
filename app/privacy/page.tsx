import type { Metadata } from "next";
import { TbcLabel } from "@/components/Confirmable";
import { PageIntro } from "@/components/PageIntro";
import { pages } from "@/data/site";

export const metadata: Metadata = pages.privacy.meta;

/** The policy text itself must come from the client; nothing is drafted here. */
export default function PrivacyPage() {
  return (
    <PageIntro copy={pages.privacy} className="pb-space-3xl">
      <p className="flex flex-wrap items-baseline gap-x-space-sm border-y border-border-strong py-space-md text-body-md text-foreground">
        Policy text
        <TbcLabel />
      </p>
    </PageIntro>
  );
}
