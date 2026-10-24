import { Button } from "@/components/Button";
import { ImageFrame, type ImageTone } from "@/components/ImageFrame";
import { SectionHeading } from "@/components/SectionHeading";
import type { FeatureCopy } from "@/data/site";

/**
 * A split feature: one photograph beside an eyebrow, heading, body, an
 * optional small note and an optional action. Used on Home for skin &
 * aesthetics (image right) and for the visit (image left).
 */
type FeatureSplitProps = {
  copy: FeatureCopy;
  imageSide?: "left" | "right";
  surface?: "background" | "surface";
  tone?: ImageTone;
};

export function FeatureSplit({
  copy,
  imageSide = "right",
  surface = "background",
  tone = "neutral",
}: FeatureSplitProps) {
  const imageLeft = imageSide === "left";

  return (
    <section
      className={[
        "section-y w-full",
        surface === "surface" ? "border-y border-border bg-surface" : "bg-background",
      ].join(" ")}
    >
      <div className="shell">
        <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-12 lg:gap-gutter-desktop">
          <div
            className={[
              "flex flex-col",
              imageLeft ? "lg:order-2 lg:col-span-5 lg:col-start-8" : "lg:col-span-5",
            ].join(" ")}
          >
            <SectionHeading eyebrow={copy.eyebrow} heading={copy.heading} />
            <p className="mt-space-lg max-w-[52ch] text-pretty text-body-lg text-muted">
              {copy.body}
            </p>
            {copy.note ? (
              <p className="mt-space-lg border-t border-border pt-space-md text-body-sm text-muted">
                {copy.note}
              </p>
            ) : null}
            {copy.cta ? (
              <div className="mt-space-xl">
                <Button href={copy.cta.href} size="lg" icon="arrowRight">
                  {copy.cta.label}
                </Button>
              </div>
            ) : null}
          </div>

          <div
            className={
              imageLeft ? "lg:order-1 lg:col-span-6" : "lg:col-span-6 lg:col-start-7"
            }
          >
            <ImageFrame
              image={copy.image}
              alt={copy.imageAlt}
              ratio="aspect-[4/5] md:aspect-[4/3] lg:aspect-[5/6]"
              orientation="portrait"
              tone={tone}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
