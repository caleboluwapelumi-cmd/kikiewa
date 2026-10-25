import { Button } from "@/components/Button";
import { Confirmable } from "@/components/Confirmable";
import { ImageFrame } from "@/components/ImageFrame";
import { academy, courses, cta, type Course } from "@/data/site";
import { formatNaira } from "@/lib/format";

/**
 * The two course cards. `compact` (Home) shows the name, what it covers and
 * a "View course" button. The full card (/academy) adds a class photograph
 * and the facts, with "To be confirmed" for anything the client hasn't
 * supplied. The button's ::after stretches over the card, so the whole card
 * is clickable while the button stays the one link.
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
    <ul data-reveal-stagger className={["grid grid-cols-1 gap-gutter", compact ? "" : "md:grid-cols-2 lg:gap-gutter-desktop"].join(" ")}>
      {courses.map((course) => (
        <li
          key={course.slug}
          className={[
            "group relative flex flex-col overflow-hidden rounded-card border border-border bg-card",
            compact ? "p-space-lg md:p-8" : "",
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
          <div className={compact ? "contents" : "flex flex-1 flex-col p-space-lg md:p-8"}>
            <Title className="text-headline-md text-primary">{course.name}</Title>
            <p className="mt-space-sm text-body-md text-muted">{course.cardLine}</p>

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

            <div className="mt-auto pt-space-lg">
              <Button
                href={course.href}
                variant="secondary"
                className="after:absolute after:inset-0 group-hover:border-primary-hover group-hover:bg-primary/8"
              >
                {cta.viewCourse}
                <span className="sr-only">: {course.name}</span>
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
