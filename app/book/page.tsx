import type { Metadata } from "next";
import { CallSheetList } from "@/components/CallSheetList";
import { PageIntro } from "@/components/PageIntro";
import { WhatsAppAction } from "@/components/WhatsAppAction";
import { bookPage, cta, seo, whatsappMessages } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.book);

/**
 * Booking happens on WhatsApp or by phone until the step-by-step booking
 * form is built (next step: service, location, date and time, details,
 * review). Query strings from booking links (?service=, ?location=) stay in
 * the URL for that form; this page does not read them yet.
 */
export default function BookPage() {
  return (
    <>
      <PageIntro copy={bookPage.intro} />
      <section className="w-full border-t border-border bg-surface py-space-2xl lg:py-space-3xl">
        <div className="shell grid grid-cols-1 gap-space-2xl lg:grid-cols-2 lg:gap-gutter-desktop">
          <div className="flex flex-col items-start gap-space-md border border-border bg-card p-space-lg md:p-10">
            <h2 className="text-headline-md text-primary">{bookPage.whatsappHeading}</h2>
            <p className="text-pretty text-body-md text-muted">{bookPage.whatsappBody}</p>
            <p className="border-l border-border-strong pl-space-md text-body-sm text-muted">
              {bookPage.consultationNote}
            </p>
            <div className="mt-space-sm">
              <WhatsAppAction label={cta.whatsapp} message={whatsappMessages.general} />
            </div>
          </div>
          <div className="border border-border bg-card p-space-lg md:p-10">
            <h2 className="mb-space-md text-headline-md text-primary">{bookPage.callHeading}</h2>
            <CallSheetList />
          </div>
        </div>
      </section>
    </>
  );
}
