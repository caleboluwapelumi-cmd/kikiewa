import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingFlow, BookingLoading } from "@/components/booking/BookingFlow";
import { CallSheetList } from "@/components/CallSheetList";
import { PageIntro } from "@/components/PageIntro";
import { WhatsAppAction } from "@/components/WhatsAppAction";
import { bookPage, cta, seo, whatsappMessages } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(seo.book);

/**
 * Book an appointment (site plan, section 7). The form reads its state from
 * the URL, so it renders in the browser; the static page carries the intro,
 * a loading line, a no-JavaScript route (WhatsApp or call) and the call
 * option underneath. The canonical stays /book whatever the query.
 */
export default function BookPage() {
  return (
    <>
      <PageIntro copy={bookPage.intro} />
      <section className="w-full border-t border-border bg-surface py-space-2xl lg:py-space-3xl">
        <div className="shell">
          <noscript>
            <div className="mb-space-xl flex flex-col items-start gap-space-md border border-border bg-card p-space-lg">
              <p className="text-body-md text-foreground">{bookPage.noscript}</p>
              <WhatsAppAction label={cta.whatsapp} message={whatsappMessages.general} />
            </div>
          </noscript>
          <Suspense fallback={<BookingLoading />}>
            <BookingFlow />
          </Suspense>
        </div>
      </section>
      <section aria-labelledby="book-call-heading" className="w-full border-t border-border bg-background py-space-2xl lg:py-space-3xl">
        <div className="shell grid grid-cols-1 gap-space-xl lg:grid-cols-12 lg:gap-gutter-desktop">
          <div className="lg:col-span-5">
            <h2 id="book-call-heading" className="text-headline-md text-primary">
              {bookPage.callHeading}
            </h2>
            <p className="mt-space-sm text-body-md text-muted">{bookPage.callBody}</p>
          </div>
          <div className="border border-border bg-card lg:col-span-7">
            <CallSheetList />
          </div>
        </div>
      </section>
    </>
  );
}
