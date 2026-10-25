import {
  contact,
  isTBC,
  site,
  socials,
  type Course,
  type FaqItem,
  type Location,
  type NavLink,
  type ServiceCategory,
  type Weekday,
} from "@/data/site";
import { phoneE164 } from "@/lib/phone";

/**
 * Structured data builders (site plan, section 8). Only verified fields go
 * in: anything TBC is left out, never filled in. No `offers` until prices
 * are confirmed, no review schema until real reviews are shown, and
 * BeautySalon rather than MedicalClinic until a medical licence is
 * confirmed.
 */

type JsonLdObject = Record<string, unknown>;

const ORG_ID = site.url + "/#organization";

function absolute(href: string): string {
  return href === "/" ? site.url : site.url + href;
}

/** A reference to the site-wide Organization node. */
const organizationRef = { "@id": ORG_ID };

/** Organization, site-wide (app/layout.tsx). */
export function organizationJsonLd(): JsonLdObject {
  const telephone = phoneE164(contact.phone);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    ...(isTBC(site.legalName) ? {} : { legalName: site.legalName }),
    url: site.url,
    logo: absolute("/icons/icon-512.png"),
    ...(telephone ? { telephone } : {}),
    ...(socials.length ? { sameAs: socials.map((link) => link.href) } : {}),
  };
}

const SCHEMA_DAY: Record<Weekday, string> = {
  monday: "https://schema.org/Monday",
  tuesday: "https://schema.org/Tuesday",
  wednesday: "https://schema.org/Wednesday",
  thursday: "https://schema.org/Thursday",
  friday: "https://schema.org/Friday",
  saturday: "https://schema.org/Saturday",
  sunday: "https://schema.org/Sunday",
};

/**
 * BeautySalon for one location page. Town and region are confirmed; the
 * street address, phone, map and opening hours are added only once each is
 * confirmed. No geo, image, priceRange or reviews until they are real.
 */
export function locationJsonLd(location: Location): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "@id": absolute(location.href) + "#location",
    name: location.title,
    url: absolute(location.href),
    parentOrganization: organizationRef,
    address: {
      "@type": "PostalAddress",
      ...(isTBC(location.address) ? {} : { streetAddress: location.address }),
      addressLocality: "Ikorodu",
      addressRegion: "Lagos",
      addressCountry: "NG",
    },
    ...(isTBC(location.phone) ? {} : { telephone: location.phone }),
    ...(isTBC(location.mapUrl) ? {} : { hasMap: location.mapUrl }),
    ...(isTBC(location.hours)
      ? {}
      : {
          openingHoursSpecification: location.hours.map((row) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: row.days.map((day) => SCHEMA_DAY[day]),
            opens: row.opens,
            closes: row.closes,
          })),
        }),
  };
}

/** Service for a service page. No offers until prices are confirmed. */
export function serviceJsonLd(category: ServiceCategory): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: category.name,
    serviceType: category.name,
    description: category.seo.description,
    url: absolute(category.href),
    provider: organizationRef,
    areaServed: { "@type": "City", name: "Ikorodu" },
  };
}

/**
 * Course for a course page. The modules come from the client's brief; the
 * certificate, fee and schedule are added only once confirmed.
 */
export function courseJsonLd(course: Course): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.overview,
    url: absolute(course.href),
    provider: organizationRef,
    teaches: course.modules,
    ...(isTBC(course.certificate) ? {} : { educationalCredentialAwarded: course.certificate }),
    ...(isTBC(course.fee)
      ? {}
      : { offers: { "@type": "Offer", category: "Fees", price: course.fee, priceCurrency: "NGN" } }),
    ...(isTBC(course.schedule)
      ? {}
      : {
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseSchedule: { "@type": "Schedule", description: course.schedule },
          },
        }),
  };
}

/** BreadcrumbList for a trail of links, the current page last. */
export function breadcrumbJsonLd(trail: NavLink[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((link, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: link.label,
      item: absolute(link.href),
    })),
  };
}

/** Questions that render on the page: those with a confirmed answer. */
export function answeredFaqs(items: FaqItem[]): { question: string; answer: string }[] {
  return items.flatMap((item) =>
    isTBC(item.answer) ? [] : [{ question: item.question, answer: item.answer }],
  );
}

/** FAQPage for the questions actually rendered. Null when there are none. */
export function faqJsonLd(items: FaqItem[]): JsonLdObject | null {
  const answered = answeredFaqs(items);
  if (answered.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: answered.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
