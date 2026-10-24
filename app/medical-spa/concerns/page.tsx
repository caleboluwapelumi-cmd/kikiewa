import type { Metadata } from "next";
import { ConcernList } from "@/components/ConcernList";
import { CtaBand } from "@/components/CtaBand";
import { PageIntro } from "@/components/PageIntro";
import { pages } from "@/data/site";

export const metadata: Metadata = pages.concerns.meta;

export default function ConcernsPage() {
  return (
    <>
      <PageIntro copy={pages.concerns} />
      <ConcernList />
      <CtaBand />
    </>
  );
}
