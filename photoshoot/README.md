# Photoshoot inbox

Drop the photographer's final files here, then run:

```
npm run photos:import
```

- **Names:** use exactly the filenames in the shot list, [reference/photoshoot.md](../reference/photoshoot.md) (for example `facials-01.jpg`, `hero-01-mobile.jpg`, `product-glow-serum.jpg`, `team-ada.jpg`). A file whose name matches no slot is skipped and listed in the report.
- **What the import does:** auto-orients, strips all metadata (EXIF, GPS, camera details), resizes (hero 2400px long edge, everything else 1600px), saves a progressive JPEG at quality 80 to `public/images/shoot/<group>/<slot>.jpg`, and updates `data/photos.generated.ts`. The site then uses the photo in its slot automatically, in place of the placeholder or stock stand-in.
- **This folder is not committed** (only this README is). Raw files stay on your machine; commit what the import writes to `public/images/shoot/` and `data/photos.generated.ts`.
- **Re-running is safe:** only changed files are replaced. To take a photo off the site, delete it from `public/images/shoot/` and run the import again.
- **Consent first:** every recognisable person must have signed a photo release. No before/after photos without separate written consent.
