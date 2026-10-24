import Link from "next/link";
import { Confirmable } from "@/components/Confirmable";
import { Icon } from "@/components/Icon";
import { ImageFrame } from "@/components/ImageFrame";
import { academy, courses, cta, type Course } from "@/data/site";
import { formatNaira } from "@/lib/format";

/**
 * The two course cards. `compact` (Home) shows the name, what it covers and
 * "View course". The full card (/academy) adds a class photograph and the
 * facts, with "To be confirmed" for anything the client hasn't supplied.
 */
type CourseCardsProps = {
  compact?: boolean;
  titleAs?: "h2" | "h3";
};

function facts(course: Course) {
  return [
    { label: academy.facts.duration, value: <Confirmable value={course.duration} /> },
    { label: academy.facts.fee, value: <Confirmable value={course.fee} format={formatNaira} /> },
    { label: academy.facts.nextIntake, value: <Confirmable value={course.nextIntake} /> },
    { label: academy.facts.certificate, value: <Confirmable value={course.certificate} /> },
  ];
}

export function CourseCards({ compact = false, titleAs: Title = "h3" }: CourseCardsProps) {
  return (
    <ul className={["grid grid-cols-1 gap-gutter", compact ? "" : "md:grid-cols-2 lg:gap-gutter-desktop"].join(" ")}>
      {courses.map((course) => (
        <li
          key={course.slug}
          className={[
            "group relative flex flex-col border border-border bg-card",
            compact ? "border-t-2 border-t-primary p-space-lg md:p-8" : "",
          ].join(" ")}
        >
          {compact ? null : (
            <ImageFrame
              image={course.image.image}
              alt={course.image.alt}
              ratio="aspect-[3/2]"
              tone="warm"
              bleed
              sizes="(max-width: 768px) 100vw, (max-width: 1360px) 50vw, 600px"
              zoomOnHover
            />
          )}
          <div className={compact ? "contents" : "flex flex-1 flex-col border-t-2 border-t-primary p-space-lg md:p-8"}>
            <Title className="text-headline-md text-primary">{course.name}</Title>
            <p className="mt-space-sm text-pretty text-body-md text-muted">{course.cardLine}</p>

            {compact ? null : (
              <dl className="mt-space-lg divide-y divide-border border-y border-border">
                {facts(course).map((fact) => (
                  <div
                    key={fact.label}
                    className="grid grid-cols-[minmax(0,8.5rem)_1fr] items-baseline gap-space-md py-space-sm"
                  >
                    <dt className="text-label-sm uppercase text-muted">{fact.label}</dt>
                    <dd className="text-body-sm text-foreground">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <Link
              href={course.href}
              className="mt-auto flex w-fit items-center pt-space-lg gap-space-sm text-label-md uppercase text-primary transition-colors duration-200 after:absolute after:inset-0 group-hover:text-secondary focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-3 focus-visible:after:outline-secondary"
            >
              {cta.viewCourse}
              <span className="sr-only">: {course.name}</span>
              <Icon
                name="arrowRight"
                className="size-4 shrink-0 transition-transform duration-300 ease-out-soft group-hover:translate-x-1"
              />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
