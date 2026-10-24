import Link from "next/link";
import { Confirmable } from "@/components/Confirmable";
import { SectionHeading } from "@/components/SectionHeading";
import { Tag } from "@/components/Tag";
import {
  categoriesFor,
  medicalSpa,
  servicesFor,
  treatmentHref,
  type Service,
} from "@/data/site";
import { formatDuration, formatNaira } from "@/lib/format";

/**
 * Skin & aesthetics treatments as a ruled table, grouped by category:
 * name · duration · from price · "Consultation required". Unconfirmed
 * durations and prices read "To be confirmed" (allowed here). Each name
 * links to the treatment's page; the consultation row links to
 * /medical-spa/consultation and comes first, since everything starts there.
 *
 * Below md the duration and price fold into the name cell, and the separate
 * cells are hidden, so nothing is read twice.
 */
type TreatmentTableProps = {
  id?: string;
  /** Show the section heading and price note. Off where the page intro leads. */
  withHeading?: boolean;
};

const cell = "py-space-lg align-top";

export function TreatmentTable({ id, withHeading = true }: TreatmentTableProps) {
  const { treatmentsIntro, treatmentTable: labels } = medicalSpa;
  const items = servicesFor("medical-spa");
  const groups = categoriesFor("medical-spa")
    .map((category) => ({
      category,
      services: items.filter((service) => service.category === category.slug),
    }))
    .filter((group) => group.services.length > 0)
    .sort(
      (a, b) =>
        Number(b.category.slug === "consultations") - Number(a.category.slug === "consultations"),
    );

  if (groups.length === 0) return null;

  const duration = (service: Service) => (
    <Confirmable value={service.durationMins} format={formatDuration} />
  );
  const price = (service: Service) => (
    <Confirmable value={service.priceFrom} format={formatNaira} />
  );

  return (
    <section id={id} className="section-y w-full border-t border-border bg-background">
      <div className="shell">
        {withHeading ? (
          <SectionHeading
            eyebrow={treatmentsIntro.eyebrow}
            heading={treatmentsIntro.heading}
            body={treatmentsIntro.body}
            className="mb-space-2xl"
          />
        ) : null}

        <table className="w-full border-collapse border-b border-border-strong text-left">
          <caption className="sr-only">{labels.caption}</caption>
          <thead className="hidden md:table-header-group">
            <tr className="border-b border-border-strong">
              <th scope="col" className="pb-space-md text-label-sm font-semibold uppercase text-muted">
                {labels.treatment}
              </th>
              <th scope="col" className="w-36 pb-space-md text-label-sm font-semibold uppercase text-muted lg:w-44">
                {labels.duration}
              </th>
              <th scope="col" className="w-36 pb-space-md text-label-sm font-semibold uppercase text-muted lg:w-44">
                {labels.price}
              </th>
              <th scope="col" className="w-48 pb-space-md lg:w-56">
                <span className="sr-only">{labels.consultationTag}</span>
              </th>
            </tr>
          </thead>

          {groups.map(({ category, services }) => (
            <tbody key={category.slug} className="border-t border-border-strong md:border-t-0">
              <tr>
                <th
                  scope="rowgroup"
                  colSpan={4}
                  className="pt-space-xl pb-space-sm text-left text-label-sm font-semibold uppercase text-secondary"
                >
                  {category.name}
                </th>
              </tr>

              {services.map((service) => (
                <tr key={service.slug} className="border-t border-border">
                  <th scope="row" className={cell + " pr-space-lg text-left font-normal"}>
                    <Link
                      href={treatmentHref(service)}
                      className="link-rule text-title-lg text-foreground hover:text-primary"
                    >
                      {service.name}
                    </Link>
                    <p className="mt-space-xs max-w-[56ch] text-pretty text-body-sm text-muted">
                      {service.summary}
                    </p>

                    {/* Phones: facts and tag under the name */}
                    <dl className="mt-space-md grid grid-cols-[auto_1fr] items-baseline gap-x-space-md gap-y-space-xs text-body-sm md:hidden">
                      <dt className="text-label-sm uppercase text-muted">{labels.duration}</dt>
                      <dd className="text-foreground">{duration(service)}</dd>
                      <dt className="text-label-sm uppercase text-muted">{labels.price}</dt>
                      <dd className="text-foreground">{price(service)}</dd>
                    </dl>
                    {service.requiresConsultation ? (
                      <p className="mt-space-md md:hidden">
                        <Tag label={labels.consultationTag} />
                      </p>
                    ) : null}
                  </th>
                  <td className={cell + " hidden pr-space-lg text-body-md tabular-nums text-foreground md:table-cell"}>
                    {duration(service)}
                  </td>
                  <td className={cell + " hidden pr-space-lg text-body-md tabular-nums text-foreground md:table-cell"}>
                    {price(service)}
                  </td>
                  <td className={cell + " hidden text-right md:table-cell"}>
                    {service.requiresConsultation ? <Tag label={labels.consultationTag} /> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </section>
  );
}
