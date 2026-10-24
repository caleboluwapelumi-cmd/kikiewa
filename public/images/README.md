# Kikiewa images

Photographs for the site. Everything here is served publicly, so only add files that are cleared for use.

## Folders

| Folder | What goes in it |
|---|---|
| `home/` | Home hero slides and section images |
| `services/` | The six services: facials, massage, aesthetics, hair, nails, makeup |
| `academy/` | Academy classes and teaching rooms |
| `locations/` | Building exteriors, reception areas, street views (Ebute and Nitel) |
| `team/` | Team portraits |
| `gallery/` | Our work |
| `{folder}/temp/` | **Temporary** images taken from Instagram (see below) |

## Naming

`{folder}-{subject}-{detail}-{width}.jpg`, all lowercase, words joined with hyphens. For example:

- `services-facial-treatment-2400.jpg`
- `academy-nails-class-1600.jpg`
- `team-portrait-01-1600.jpg`

Use `.jpg` for photographs (next/image serves AVIF and WebP from it). Never put photographs in as `.svg`. SVGs are inlined as components, not served through next/image.

## Minimum sizes

| Use | Minimum width |
|---|---|
| Heroes (full-bleed or half-width) | **2400px** |
| Gallery and cards | **1600px** |
| Team portraits | 1600px |

Export at roughly 80% JPEG quality. Keep files under about 1MB where you can, because next/image resizes them but cannot add detail that isn't there.

## Adding an image to the site

Images are wired up in `data/site.ts` as an `ImageAsset`:

```ts
{
  src: "/images/services/services-facial-treatment-2400.jpg",
  alt: "Facial treatment at Kikiewa, Ikorodu",
  width: 2400,
  height: 3000,
}
```

Write alt text that describes the photograph for someone who cannot see it. Never leave it blank or write "image".

## Temporary Instagram images

Until the photoshoot, an approved Instagram photo can stand in:

1. Put it in `public/images/{folder}/temp/`.
2. Tag it in `data/site.ts` with `source: "instagram-temp"`.
3. `npm run check:images` lists every temporary image still in use. It exits with an error when `NEXT_PUBLIC_SITE_ENV=production`, so temporary images can't ship to the live site unnoticed.

## Consent

**No client faces and no before-and-after images are used without the client's written consent.** This applies to temporary Instagram images too: being on Kikiewa's Instagram is not consent for the website. Keep the signed consent on file before the image is added, and remove the image if consent is withdrawn.
