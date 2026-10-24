import { ImageFrame } from "@/components/ImageFrame";
import { SectionHeading } from "@/components/SectionHeading";
import { isTBC, medicalSpa, team } from "@/data/site";

/**
 * "Your clinical team" (copy deck section 3). Renders nothing until a
 * medical spa team member has a confirmed name; registration and bio show
 * only once confirmed. Never shows an unverified role or qualification.
 */
export function ClinicalTeam() {
  const members = team.filter(
    (member) => member.division === "medical-spa" && !isTBC(member.name),
  );
  if (members.length === 0) return null;
  const { teamIntro } = medicalSpa;

  return (
    <section className="section-y w-full border-t border-border bg-background">
      <div className="shell">
        <SectionHeading
          eyebrow={teamIntro.eyebrow}
          heading={teamIntro.heading}
          className="mb-space-2xl"
        />
        <ul className="grid grid-cols-1 gap-space-2xl md:grid-cols-2 lg:grid-cols-3 lg:gap-gutter-desktop">
          {members.map((member) => (
            <li key={member.name} className="flex flex-col">
              {member.image ? (
                <ImageFrame
                  image={member.image}
                  alt={member.image.alt}
                  ratio="aspect-[4/5]"
                  orientation="portrait"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="mb-space-lg"
                />
              ) : null}
              <h3 className="text-headline-sm text-primary">{member.name}</h3>
              <p className="mt-space-xs text-label-sm uppercase text-secondary">{member.role}</p>
              {member.registration && !isTBC(member.registration) ? (
                <dl className="mt-space-md flex flex-wrap gap-x-space-sm border-t border-border pt-space-md text-body-sm">
                  <dt className="text-label-sm uppercase text-muted">{teamIntro.registrationLabel}</dt>
                  <dd className="text-foreground">{member.registration}</dd>
                </dl>
              ) : null}
              {isTBC(member.bio) ? null : (
                <p className="mt-space-md text-pretty text-body-md text-muted">{member.bio}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
