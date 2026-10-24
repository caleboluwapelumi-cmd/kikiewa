import { Button } from "@/components/Button";
import { Confirmable } from "@/components/Confirmable";
import { courses, isTBC, type Course } from "@/data/site";
import { formatNaira } from "@/lib/format";

/**
 * Course catalogue. Every card carries the same fields in the same order —
 * level, entry requirements, duration, fee — so prospective students can
 * compare courses side by side, then the next intake and certifying body.
 */

function fields(course: Course): { label: string; value: React.ReactNode }[] {
  return [
    { label: "Level", value: <Confirmable value={course.level} /> },
    { label: "Entry requirements", value: <Confirmable value={course.entryRequirements} /> },
    { label: "Duration", value: <Confirmable value={course.duration} /> },
    { label: "Fee", value: <Confirmable value={course.fee} format={formatNaira} /> },
    { label: "Next intake", value: <Confirmable value={course.nextIntake} /> },
    { label: "Certifying body", value: <Confirmable value={course.certifyingBody} /> },
  ];
}

export function CourseCards() {
  return (
    // Three-up only from xl: below that the cards are too narrow for the action.
    <ul className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:gap-gutter-desktop xl:grid-cols-3">
      {courses.map((course) => (
        <li
          key={course.slug}
          className="flex flex-col border border-t-2 border-border border-t-primary bg-card p-space-lg md:p-8"
        >
          <h2 className="text-headline-sm text-primary">{course.name}</h2>
          {isTBC(course.summary) ? null : (
            <p className="mt-space-sm text-pretty text-body-md text-muted">{course.summary}</p>
          )}

          <dl className="mt-space-lg mb-space-xl divide-y divide-border border-y border-border">
            {fields(course).map((field) => (
              <div
                key={field.label}
                className="grid grid-cols-[minmax(0,8.5rem)_1fr] items-baseline gap-space-md py-space-sm"
              >
                <dt className="text-label-sm uppercase text-muted">{field.label}</dt>
                <dd className="text-body-sm text-foreground">{field.value}</dd>
              </div>
            ))}
          </dl>

          <Button
            href="/beauty-institute/admissions"
            variant="subtle"
            icon="arrowRight"
            className="mt-auto self-start"
          >
            Ask about this course
          </Button>
        </li>
      ))}
    </ul>
  );
}
