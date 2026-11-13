import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingReceipt, receiptTime } from "@/components/booking/BookingReceipt";
import { Button, buttonClass } from "@/components/Button";
import { PageIntro } from "@/components/PageIntro";
import { WhatsAppAction } from "@/components/WhatsAppAction";
import { bookingHref, bookStatusPage, contactHref, cta, whatsappMessages } from "@/data/site";
import { bookingStatus, type StatusView } from "@/lib/booking/status";
import { supabaseStore } from "@/lib/booking/store";
import { paystack } from "@/lib/paystack/api";
import { pageMetadata } from "@/lib/seo";
import { bookingsMode } from "@/lib/server/env";

export const metadata: Metadata = pageMetadata(bookStatusPage.meta, { noindex: true });

const t = bookStatusPage;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Where Paystack returns the customer (?reference=, plus ?trxref=). The
 * intro is static; the result streams in once the server has asked
 * Paystack and the database (lib/booking/status.ts).
 */
export default function BookStatusPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <PageIntro copy={t.intro} />
      <section className="w-full border-t border-border bg-surface py-space-2xl lg:py-space-3xl">
        <div className="shell">
          <div className="max-w-3xl rounded-card border border-border bg-card p-space-lg md:p-10 lg:p-12">
            <Suspense
              fallback={
                <p role="status" className="text-body-md text-muted">
                  {t.loading}
                </p>
              }
            >
              <StatusResult searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}

async function StatusResult({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const raw = params.reference ?? params.trxref;
  const reference = typeof raw === "string" ? raw : undefined;

  let view: StatusView | null;
  try {
    view = await bookingStatus(reference, { mode: bookingsMode(), store: supabaseStore, paystack });
  } catch (error) {
    console.error("[bookings] status failed", error instanceof Error ? error.message : error);
    view = null;
  }

  const checkAgain = reference ? (
    <a href={`/book/status?reference=${encodeURIComponent(reference)}`} className={buttonClass("primary")}>
      {t.checkAgain}
    </a>
  ) : null;
  const whatsapp = <WhatsAppAction label={cta.whatsapp} message={whatsappMessages.general} />;

  if (!view) {
    return (
      <Result heading={t.pending.heading} body={t.pending.body}>
        {checkAgain}
        {whatsapp}
      </Result>
    );
  }

  switch (view.kind) {
    case "unavailable":
      return (
        <Result heading={t.unavailable.heading} body={t.unavailable.body}>
          {whatsapp}
        </Result>
      );
    case "not_found":
      return (
        <Result heading={t.notFound.heading} body={t.notFound.body}>
          <Button href={contactHref}>{t.contact}</Button>
          {whatsapp}
        </Result>
      );
    case "confirmed":
      return <Result heading={t.confirmed.heading} body={t.confirmed.body} receipt={view.receipt} />;
    case "pending":
      return (
        <Result
          heading={t.pending.heading}
          body={t.pending.body}
          note={view.holdExpiresAt ? `${t.pending.heldUntil} ${receiptTime(view.holdExpiresAt).split(", ").pop()}.` : undefined}
          receipt={view.receipt}
        >
          {checkAgain}
        </Result>
      );
    case "failed":
    case "expired":
      return (
        <Result heading={t[view.kind].heading} body={t[view.kind].body} receipt={view.receipt}>
          <Button href={bookingHref}>{t.bookAgain}</Button>
          {whatsapp}
        </Result>
      );
    case "refund":
      return (
        <Result heading={t.refund.heading} body={t.refund.body} receipt={view.receipt}>
          <Button href={contactHref}>{t.contact}</Button>
        </Result>
      );
  }
}

function Result({
  heading,
  body,
  note,
  receipt,
  children,
}: {
  heading: string;
  body: string;
  note?: string;
  receipt?: Parameters<typeof BookingReceipt>[0]["receipt"];
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-space-xl">
      <div className="flex flex-col gap-space-sm">
        <h2 className="text-headline-lg text-primary">{heading}</h2>
        <p className="max-w-[60ch] text-pretty text-body-lg text-foreground">{body}</p>
        {note ? <p className="text-body-md text-muted">{note}</p> : null}
      </div>
      {receipt ? <BookingReceipt receipt={receipt} /> : null}
      {children ? <div className="flex flex-wrap items-center gap-3">{children}</div> : null}
    </div>
  );
}
