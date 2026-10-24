import type { Metadata } from "next";
import { ConcernList } from "@/components/ConcernList";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { pages, seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.concerns);

export default function ConcernsPage() {
  return (
    <>
      <PageIntro copy={pages.concerns} />
      <ConcernList />
      <CtaBand />
    </>
  );
}
