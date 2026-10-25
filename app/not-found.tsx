import type { Metadata } from "next";
import { Button, ButtonGroup } from "@/components/Button";
import { PageIntro } from "@/components/PageIntro";
import { notFoundPage } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: "Page not found | Kikiewa" },
  robots: { index: false, follow: true },
};

/** 404 (site plan, section 7): links to Home, Services and Book. */
export default function NotFound() {
  return (
    <PageIntro copy={notFoundPage} className="pb-space-3xl">
      <ButtonGroup stack>
        {notFoundPage.links.map((link, index) => (
          <Button key={link.href} href={link.href} variant={index === 0 ? "primary" : "secondary"}>
            {link.label}
          </Button>
        ))}
      </ButtonGroup>
    </PageIntro>
  );
}
