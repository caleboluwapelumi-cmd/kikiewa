import { ImageFrame } from "@/components/ImageFrame";
import { SectionHeading } from "@/components/SectionHeading";
import type { TeamMember } from "@/data/site";

/**
 * "Our team" on /about: a portrait, name and role per person. Renders
 * nothing until the client supplies real names and roles.
 */
type TeamGridProps = {
  heading: string;
  body?: string;
  members: TeamMember[];
};

export function TeamGrid({ heading, body, members }: TeamGridProps) {
  if (members.length === 0) return null;

  return (
    <section className="section-y w-full border-t border-border bg-background">
      <div className="shell">
        <SectionHeading heading={heading} body={body} className="mb-space-2xl lg:mb-space-3xl" />
        <ul className="grid grid-cols-2 gap-x-gutter gap-y-space-xl lg:grid-cols-4 lg:gap-x-gutter-desktop">
          {members.map((member) => (
            <li key={member.name}>
              <figure>
                <ImageFrame
                  image={member.image}
                  alt={`${member.name}, ${member.role} at Kikiewa, Ikorodu`}
                  ratio="aspect-[4/5]"
                  orientation="portrait"
                  tone="warm"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <figcaption className="mt-space-md">
                  <h3 className="text-headline-sm text-primary">{member.name}</h3>
                  <p className="mt-space-xs text-label-sm uppercase text-muted">{member.role}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
