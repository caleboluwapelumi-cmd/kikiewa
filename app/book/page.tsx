import type { Metadata } from "next";
import { Confirmable } from "@/components/Confirmable";
import { PageIntro } from "@/components/PageIntro";
import { WhatsAppAction } from "@/components/WhatsAppAction";
import { bookingPaths, locations, pages } from "@/data/site";
import { telHref } from "@/lib/phone";

export const metadata: Metadata = pages.book.meta;

/**
 * Booking starts on WhatsApp or by phone until the online booking flow is
 * built. Query strings from booking links (?location=, ?service=) are kept
 * in the URL for that flow; this page does not read them.
 */
export default function BookPage() {
  return (
    <>
      <PageIntro copy={pages.book} />
      <section className="w-full border-t border-border bg-surface pb-space-3xl">
        <div className="shell">
          <ul className="grid grid-cols-1 gap-gutter pt-space-2xl xl:grid-cols-3 lg:gap-gutter-desktop">
            {bookingPaths.map((path) => {
              const location = locations.find((item) => item.id === path.location);
              const tel = telHref(location?.phone);
              return (
                <li
                  key={path.title}
                  className="flex flex-col border border-border bg-card p-space-lg md:p-8"
                >
                  <h2 className="text-headline-sm text-primary">{path.title}</h2>
                  {location ? (
                    <p className="mt-space-xs text-label-sm uppercase text-secondary">
                      {location.name} branch
                    </p>
                  ) : null}
                  <p className="mt-space-sm mb-space-lg text-pretty text-body-md text-muted">
                    {path.body}
                  </p>
                  <div className="mt-auto flex flex-col gap-space-md">
                    <WhatsAppAction label={path.cta} message={path.whatsappMessage} />
                    {location ? (
                      <p className="flex flex-wrap items-baseline gap-x-space-sm text-body-sm text-foreground">
                        <span className="text-label-sm uppercase text-muted">Call</span>
                        {tel ? (
                          <a href={tel} className="link-rule hover:text-secondary">
                            {location.phone}
                          </a>
                        ) : (
                          <Confirmable value={location.phone} />
                        )}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
