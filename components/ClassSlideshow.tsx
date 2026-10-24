import { ImageFrame } from "@/components/ImageFrame";
import { Slider } from "@/components/Slider";
import { classSlides } from "@/data/site";

/**
 * Class photos in the shared Slider (Home academy section and /academy).
 * Captions show only where the data has one.
 */
export function ClassSlideshow({ label, sizes }: { label: string; sizes: string }) {
  return (
    <Slider
      label={label}
      controlsClassName="order-last mt-space-md"
      slideLabels={classSlides.map((slide) => slide.alt)}
    >
      {classSlides.map((slide) => (
        <figure key={slide.alt}>
          <ImageFrame
            image={slide.image}
            alt={slide.alt}
            ratio="aspect-[4/3]"
            tone="warm"
            sizes={sizes}
          />
          {slide.caption ? (
            <figcaption className="mt-space-sm text-body-sm text-muted">{slide.caption}</figcaption>
          ) : null}
        </figure>
      ))}
    </Slider>
  );
}
