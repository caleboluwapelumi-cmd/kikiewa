import type { Metadata } from "next";
import { CoursePage } from "@/components/CoursePage";
import { seo } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.cosmetology);

export default function Page() {
  return <CoursePage slug="cosmetology" />;
}
