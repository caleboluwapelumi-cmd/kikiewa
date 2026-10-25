# Image credits

Temporary images, used until the photoshoot. Every row here is tagged in `data/site.ts`, and `npm run check:images` lists each one still in use (and fails a production build while any remain).

## Stock (`source: "stock-temp"`)

All from Unsplash, under the [Unsplash License](https://unsplash.com/license): free for commercial use, no permission or attribution required (credited here anyway). None are Unsplash+.

Rules for stock: Black or African models, or no people; warm, natural light; no brand names, logos, watermarks or text. Never used in Our work, Gallery, Inside our classes, Locations, the team or Testimonials (`OwnImageAsset` in `data/site.ts` makes that a type error).

| Slot | File | Photographer | Unsplash URL | Licence | Notes |
|---|---|---|---|---|---|
| Home hero, slide 1 | `home/hero-1.jpg` | Dominik Neuner | https://unsplash.com/photos/a-modern-steam-room-with-a-candle-and-ambient-lighting-9qYFu1NzpS8 | Unsplash License | |
| Home hero, slide 2 | `home/hero-2.jpg` | Iwaria Inc. | https://unsplash.com/photos/a-woman-getting-a-facial-massage-with-an-electric-device-_sYJQjqopus | Unsplash License | |
| Home hero, slide 3 | `home/hero-3.jpg` | Iwaria Inc. | https://unsplash.com/photos/a-woman-getting-a-back-massage-at-a-beauty-salon-VWELT4w5jj8 | Unsplash License | |
| Home hero, slide 4 | `home/hero-4.jpg` | Lisa Marie Theck | https://unsplash.com/photos/a-woman-smiles-with-her-hair-in-a-bun-wjSSZ7r-iA0 | Unsplash License | |
| Home, About Kikiewa portrait | `home/about.jpg` | Gideon Hezekiah | https://unsplash.com/photos/woman-in-black-tank-top-WCEMFqEIVek | Unsplash License | |
| Facials (card and page hero) | `services/facials.jpg` | Leighann Blackwood | https://unsplash.com/photos/a-woman-is-putting-a-lotion-on-her-face-OSC6FLeoEOE | Unsplash License | |
| Massage & Spa (card and page hero) | `services/massage.jpg` | Iwaria Inc. | https://unsplash.com/photos/a-woman-laying-on-a-bed-with-a-towel-and-a-cup-of-coffee-Bv826LRAgIc | Unsplash License | |
| Aesthetics (card and page hero) | `services/aesthetics.jpg` | Atikah Akhtar | https://unsplash.com/photos/white-wooden-vanity-table-with-mirror-6xlyKFFvufg | Unsplash License | Cropped to the right of the room to leave out branded products; two small labels softened |
| Hair & Barbing (card) | `services/hair.jpg` | Mohamed B. | https://unsplash.com/photos/hands-braiding-dark-hair-with-red-nails-WgMOZWSi2g8 | Unsplash License | |
| Hair & Barbing (page hero, barber option) | `services/hair-barber.jpg` | Obi | https://unsplash.com/photos/man-cutting-hair-man--sRVfY0f2d8 | Unsplash License | Bottom cropped to leave out text printed on the cape |
| Nails (card and page hero) | `services/nails.jpg` | Christian Agbede | https://unsplash.com/photos/a-woman-with-white-nails-and-a-black-sweater-BIIXmb3on9s | Unsplash License | |
| Makeup (card and page hero) | `services/makeup.jpg` | Jabari Timothy | https://unsplash.com/photos/a-person-with-makeup-on-the-face-2rEFgXcAZLA | Unsplash License | |
| Academy hero | `academy/hero.jpg` | Iwaria Inc. | https://unsplash.com/photos/a-person-getting-the-nails-painted-DzMmp0uewcg | Unsplash License | |
| Cosmetology course (card and page hero) | `academy/cosmetology.jpg` | Mohamed B. | https://unsplash.com/photos/close-up-of-hands-braiding-dark-hair-Jit2v8RVBaU | Unsplash License | |
| Aesthetics course (card and page hero) | `academy/aesthetics.jpg` | Iwaria Inc. | https://unsplash.com/photos/a-woman-getting-a-facial-mask-on-her-face-TLLro7iVLtk | Unsplash License | |

## Client's Instagram (`source: "instagram-temp"`)

From Kikiewa's own Instagram, renamed and re-encoded (metadata stripped). Original filenames are not kept.

| Slot | File | Notes |
|---|---|---|
| Facials, "Signs your facial is overdue" | `services/facials-overdue-cover.jpg` | Carousel cover slide. Text and logo are baked into the image. Only 864px wide, so it renders at 432px at most |
| About, "We keep learning" 1 | `about/learning-01.jpg` | Training workshop. The name on the certificate is blurred |
| About, "We keep learning" 2 | `about/learning-02.jpg` | Training workshop |
