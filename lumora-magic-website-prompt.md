# Build the Lumora Magic website

You're building a complete, production-ready website for **Lumora Magic**, a practitioner who offers numerology readings and spell/ritual work to clients, mainly in India. The client has already approved the visual design, so your job is to implement it faithfully as a fast, responsive, accessible static site.

Where this brief is specific, follow it exactly. Where it's silent, match the approved feel: soft, airy and pastel. Use peach, butter-yellow and mint with leaf-green and a little gold sparkle. The site should feel calm and trustworthy, never dark or gothic. The footer is the only dark area.

Start with a short plan (file list and CSS approach, a few lines), then build the whole site without waiting for my approval.

---

## 1. Tech stack and files

- Plain **HTML5 + CSS + vanilla JavaScript**. No frameworks, no CSS or JS libraries, no npm packages, no build step.
- It must work when served locally and when deployed to any static host (Netlify, Vercel, GitHub Pages, S3 + CloudFront).
- Mobile-first CSS. Use CSS custom properties for every design token and simple, readable class names (BEM-style is fine). Keep selector specificity low so section spacing rules don't override each other.

```
index.html
css/styles.css
js/main.js
assets/images/lumora-logo.jpg     (provided, do not edit or re-compress)
assets/favicon.svg                (create)
README.md                         (create)
```

Optional files. Check whether they exist when you build:

- `assets/images/lumora-logo-transparent.png`: if present, use it in the header and footer instead of the text wordmark.
- `assets/images/practitioner.jpg`: if present, use it in the About section instead of the photo placeholder.

If `assets/images/lumora-logo.jpg` is missing, build with a clearly marked placeholder box in its place and tell me at the end.

---

## 2. Design tokens

### Colours

Define these on `:root` and use only these variables in the CSS.

| Variable | Hex | Used for |
|---|---|---|
| `--cream` | #FDFBF0 | Page background |
| `--cream-light` | #FFFDF4 | Header background, text on green buttons, secondary button fill |
| `--card` | #FFFFFF | Cards, form fields, photo placeholder |
| `--mint-50` | #EEF8EF | Numbers strip, About band, green icon tiles, step badges |
| `--mint-200` | #D9F1DF | Mint end of gradients |
| `--butter` | #FBF4CF | Middle of gradients |
| `--peach` | #FCE7C2 | Peach start of gradients, hero glow |
| `--gold-tint` | #FDF3D8 | Gold icon tiles, step 2 badge |
| `--gold-line` | #EEDDA6 | Step 2 badge border |
| `--green` | #3F7A2A | Primary buttons, script accents, big numbers, links |
| `--green-dark` | #2C5A1D | Hover states, prices, calculator result title |
| `--ink` | #1F3A24 | Headings, labels, strong text |
| `--body` | #4B5E4D | Body text |
| `--muted` | #667566 | Secondary text: durations, helper text, input placeholders |
| `--gold` | #D4A72C | Decorative sparkles and stars only, never text |
| `--gold-text` | #7A5C0C | Eyebrow labels, gold icons, step 2 number |
| `--line` | #DCEBD8 | Card, section and panel borders |
| `--soft-line` | #B9D3AC | Secondary button border, step badge border, dashed photo placeholder, stats divider |
| `--field-line` | #C3D9B8 | Form field borders |
| `--result-bg` | #FFFDF6 | Calculator result card |
| `--result-line` | #E9E2B8 | Calculator result card border |
| `--wordmark-sub` | #4B6B3A | "MAGIC" under the header wordmark |
| `--footer` | #2C4A2F | Footer background |
| `--footer-text` | #EAF3E4 | Footer links |
| `--footer-muted` | #C4D6BD | Footer small print |
| `--footer-script` | #DDEFC9 | "Lumora" in the footer wordmark |
| `--footer-gold` | #F2D98A | "MAGIC" in the footer wordmark |
| `--error` | #B03A2E | Form error messages |

### Typography

Load from Google Fonts with `preconnect` and `display=swap`:

```
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Great+Vibes&family=Karla:wght@400;500;600&display=swap
```

| Font | Role | Fallback |
|---|---|---|
| Great Vibes 400 | The "Lumora" wordmark and the script part of headings only | 'Brush Script MT', cursive |
| Cormorant Garamond 500, 600, italic 500 | Headings, big numbers, testimonial quotes, "MAGIC" in the wordmark | Georgia, 'Times New Roman', serif |
| Karla 400, 500, 600 | Body text, navigation, buttons, labels, forms | 'Helvetica Neue', Arial, sans-serif |

**Signature heading style.** Most headings pair a serif phrase in `--ink` with a script phrase in `--green`. The script part uses Great Vibes at weight 400, about 1.2× the size of the serif part. In this brief, `{curly braces}` mark the script part of a heading. Don't render the braces. Give script text a line-height of about 1.15 so its swashes and descenders are never clipped.

### Type scale

Interpolate between desktop and mobile sizes with `clamp()`.

| Element | Desktop | Mobile |
|---|---|---|
| H1 serif lines | 84px, line-height 1.0, weight 500 | 44px |
| H1 script line | 104px | 56px |
| H2 serif | 60px, line-height 1.05, weight 500 | 38px |
| H2 script part | 72px | 48px |
| Card titles (H3) | Cormorant 600, 29px | 25px |
| Hero paragraph | Karla 19px, line-height 1.65 | 17px |
| Body | Karla 16–17px, line-height 1.6 | 16px |
| Eyebrow labels | Karla 500, 13px, uppercase, letter-spacing 3px, `--gold-text` | same |

Keep long paragraphs under about 70 characters per line.

### Shape, spacing and depth

- **Container:** max-width 1248px, centred, side padding `clamp(20px, 6.7vw, 96px)`.
- **Section spacing:** 120px vertical padding on desktop, 72px on mobile.
- **Buttons:** pill-shaped (radius 999px), height 56px (48px in the header), padding 0 32px, Karla 600 16px.
  - Primary: `--green` fill, `--cream-light` text, `--green-dark` fill on hover.
  - Secondary: `--cream-light` fill, 1px `--soft-line` border, `--green-dark` text.
- **Cards:** `--card` background, 1px `--line` border, radius 24px, padding 36px, shadow `0 10px 30px rgba(63,122,42,0.06)`.
- **Large panels** (calculator and booking): radius 32px.
- **Inputs and selects:** height 52px (the calculator input is 56px), radius 14px, 1px `--field-line` border, `--card` background, 16px text.
- **Focus:** `:focus-visible { outline: 2px solid var(--green); outline-offset: 2px; }` on every interactive element.

---

## 3. Page structure and exact copy

Use the copy exactly as written. Text in [square brackets] is placeholder content the client will replace later. Keep it visible exactly as written, and don't invent real-looking replacements.

Use one `<h1>`, in the hero. Put the sections inside `<main>`, each as a `<section>` with the `id` given.

### 3.1 Header (sticky)

- `--cream-light` background, 1px `--line` bottom border. Height 96px on desktop, 72px on mobile. Sticky at the top, with a soft shadow added once the page has scrolled.
- **Left:** a wordmark linking to `#top` with `aria-label="Lumora Magic home"`. "Lumora" is Great Vibes 46px (38px on mobile) in `--green`. "MAGIC" is centred directly below it in Cormorant Garamond 600, 13px, letter-spacing 5px, `--wordmark-sub`. If the transparent logo PNG exists, use it instead at max height 64px.
- **Right:** links "Services" (`#services`), "Life Path" (`#life-path`), "How it works" (`#process`) and "About" (`#about`), in Karla 15px `--ink`. After them comes a primary button "Book a reading" (`#book`).
- **Below 1024px:** the links collapse into a menu button with a hamburger icon, `aria-label="Open menu"`, `aria-expanded` and `aria-controls`. The menu opens as a full-width `--cream-light` panel under the header with large tap targets.

### 3.2 Hero (`id="top"`)

- **Background:** `--cream` with a soft peach glow in the top-left and a mint glow in the bottom-right. Make these with two large radial gradients using `--peach` and `--mint-200`, fading to transparent.
- **Layout:** two columns on desktop, text left and image right, vertically centred, 72px gap, about 140px vertical padding. On mobile, stack the text first and the image below it at max-width 360px.
- **Eyebrow:** a small gold four-point sparkle icon, then "Numerology · Spell work · Rituals".
- **H1**, on three lines: "Your numbers" / "already know" / "{the way forward}".
- **Paragraph** (max-width 520px, `--body`): "Personal numerology readings and gentle, carefully prepared spell work for love, protection, career and new beginnings — rooted in your birth date and your name."
- **Buttons:** primary "Book a consultation" linking to `#book`, and secondary "Find your life path number" linking to `#life-path`. On small screens they stack at full width.
- **Image:** `assets/images/lumora-logo.jpg` with alt "Lumora Magic logo". It is square, up to 540×540px, with `width` and `height` attributes, radius 36px, shadow `0 30px 80px rgba(63,122,42,0.18)` and `fetchpriority="high"`.
- **Motion:** this is the page's one decorative animation. Place 6–8 tiny gold sparkles (inline SVG, `--gold`, `aria-hidden="true"`) around the logo. Each slowly twinkles through opacity and scale, 3–5 seconds, staggered. Turn the animation off completely under `prefers-reduced-motion: reduce`.

### 3.3 Numbers strip (no id)

- A full-width band with `--mint-50` background, 1px `--line` borders top and bottom, and about 80px vertical padding.
- Build it as a `<ul>` of nine items: one row of nine equal columns on desktop, a 3×3 grid on mobile.
- Each item has the number in Cormorant Garamond 600, 62px (44px on mobile), `--green`. Below it is the label in Karla 14px `--body`, letter-spacing 1px.
- Items: 1 Leader, 2 Harmoniser, 3 Creator, 4 Builder, 5 Explorer, 6 Nurturer, 7 Seeker, 8 Achiever, 9 Healer.

### 3.4 Services (`id="services"`)

- **Heading row:** on the left, eyebrow "Services" and H2 "Readings & {spell work}". On the right, bottom-aligned, a paragraph (max-width 420px): "Every session is personal. Choose a reading to understand your path, or a ritual to move it." The two stack on mobile.
- **Grid:** 64px below the heading row, six cards with a 24px gap. Use 3 columns from 1024px, 2 columns from 640px and 1 column below that. All cards in a row are equal height.
- **Each card, top to bottom:**
  1. A 56×56px icon tile (radius 16px) holding a 30px line icon: inline SVG, stroke width 1.8, no fill.
  2. The H3 title.
  3. The description, which grows to push the rest of the card down.
  4. A row with "[PRICE]" on the left (`--green-dark`, weight 600) and "[DURATION]" on the right (`--muted`).
  5. A text link "Book this service" in `--green`, underlined on hover.
- **Tile colours:** green tiles use a `--mint-50` tile with a `--green` icon. Gold tiles use a `--gold-tint` tile with a `--gold-text` icon.

| # | Title | Description | Icon | Tile |
|---|---|---|---|---|
| 1 | Full Numerology Reading | Life path, destiny, soul urge and personal year numbers, explained in a one-to-one session. | Circle containing a stroked "7" | Green |
| 2 | Name & Business Numerology | Name spelling corrections, baby names and brand names aligned with your numbers. | Stroked letter "M" | Green |
| 3 | Lucky Dates & Muhurat | Favourable dates for weddings, launches, property, travel and important decisions. | Calendar | Gold |
| 4 | Love & Relationship Spells | Rituals to invite harmony, heal communication and open the heart to new love. | Heart | Gold |
| 5 | Protection & Cleansing | Energy cleansing for you, your home or workplace, with protective ritual work. | Shield with a tick | Green |
| 6 | Career & Prosperity Rituals | Spell work focused on abundance, opportunity, business growth and steady success. | Rising trend line with arrowhead | Gold |

### 3.5 Life path calculator (`id="life-path"`)

- **Panel:** inside the container, radius 32px, padding 80px (32px on mobile), background `linear-gradient(120deg, var(--peach) 0%, var(--butter) 45%, var(--mint-200) 100%)`. Two columns with an 80px gap on desktop, stacked on mobile.
- **Left column:**
  - Eyebrow "Free · Try it now".
  - H2 on two lines: "Discover your" / "{life path number}".
  - Paragraph: "Enter your date of birth. Your life path number reveals the core lessons and gifts you carry through life."
  - Label "Date of birth" (Karla 600, 14px, `--ink`) above a date input (height 56px, max-width 360px).
- **Right column:** a result card with min-height 420px, `--result-bg` background, 1px `--result-line` border, radius 28px, padding 48px, shadow `0 20px 50px rgba(63,122,42,0.12)`, and centred content. Wrap the changing content in a region with `aria-live="polite"`.
  - **Empty state:** three gold sparkles, the middle one larger. Below them, "Your number appears here" (Cormorant 600, 32px, `--ink`) and "A full reading goes much deeper." (`--body`).
  - **Result state:** eyebrow "Your life path"; the number (Cormorant 600, 140px, `--green`, line-height 1); the title (Great Vibes, 44px, `--green-dark`); the meaning (16px, `--body`, max-width 380px); and a primary button "Get my full reading".
- There is no calculate button. The card updates as soon as a complete date is entered (see section 4).

| Number | Title | Meaning |
|---|---|---|
| 1 | The Leader | Independent and driven, you are here to pioneer and trust your own direction. |
| 2 | The Harmoniser | Sensitive and diplomatic, you bring people and ideas together. |
| 3 | The Creator | Expressive and joyful, your gift is communication and imagination. |
| 4 | The Builder | Steady and practical, you create lasting foundations through effort. |
| 5 | The Explorer | Curious and free, you grow through change, travel and experience. |
| 6 | The Nurturer | Caring and responsible, you are drawn to family, home and service. |
| 7 | The Seeker | Reflective and intuitive, you search for deeper truth and meaning. |
| 8 | The Achiever | Ambitious and capable, you are here to master power and abundance. |
| 9 | The Healer | Compassionate and wise, you are guided toward humanitarian purpose. |
| 11 | Master Intuitive | A master number of insight and inspiration, carrying a strong inner voice. |
| 22 | Master Builder | A master number that turns great visions into real, lasting form. |
| 33 | Master Teacher | A master number of compassion, guidance and uplifting others. |

### 3.6 How it works (`id="process"`)

- **Heading**, centred: eyebrow "How it works" and H2 "Three {gentle} steps".
- **Steps:** 64px below, an `<ol>` of three centred columns with a 48px gap, stacked on mobile. Each step has:
  - a 72px circular badge with the step number in Cormorant 600, 34px;
  - an H3 in Karla 600, 20px, `--ink`;
  - a description with max-width 320px.
- **Badges:** steps 1 and 3 have a `--mint-50` fill, 1px `--soft-line` border and `--green` number. Step 2 has a `--gold-tint` fill, 1px `--gold-line` border and `--gold-text` number.

| Step | Title | Description |
|---|---|---|
| 1 | Share your details | Your full name, date of birth and what you are hoping to understand or change. |
| 2 | Consultation | A private session by call, video or in person to read your numbers and discuss your intention. |
| 3 | Reading or ritual | Receive your written report, or your ritual is performed on an aligned date with follow-up guidance. |

### 3.7 About (`id="about"`)

- A full-width band with `--mint-50` background. Two columns with a 96px gap on desktop; on mobile, stack them with the image first.
- **Left:** an arch-shaped frame with border-radius `260px 260px 28px 28px`, height 540px (400px on mobile) and full column width.
  - If `assets/images/practitioner.jpg` exists, show it in that shape with `object-fit: cover` and alt "[Practitioner Name]".
  - Otherwise show a placeholder: 2px dashed `--soft-line` border, `--card` background, and centred text "[PRACTITIONER PHOTO]" in `--muted`.
- **Right:**
  - Eyebrow "About Lumora Magic".
  - H2 "Hello, I'm {[Practitioner Name]}".
  - Paragraph (18px, line-height 1.7): "[A short introduction — how you came to numerology and spell work, your tradition or training, and what clients can expect when working with you.]"
  - A stats row: three columns with 20px top padding and a 1px `--soft-line` top border. Each stat has its value in Cormorant 600, 40px, `--green`, and its label in 14px `--body`. The stats are "[00]" Years of practice, "[000]" Readings given, and "[Lang]" Languages.

### 3.8 Testimonials (no id)

- A centred H2: "Words from {clients}".
- 56px below it, three cards in the same style as the service cards: 3 columns on desktop, 1 column on mobile.
- Each card is a `<figure>` containing:
  - three small gold sparkles;
  - a `<blockquote>` reading “[Client testimonial]” in Cormorant Garamond italic 500, 24px, line-height 1.4, `--ink`;
  - a `<figcaption>` reading "[Client name] · [City]" in 14px `--body`.

### 3.9 Booking (`id="book"`)

- **Panel:** inside the container, radius 32px, 1px `--line` border, padding 72px 80px (32px 20px on mobile), background `linear-gradient(135deg, var(--butter) 0%, var(--mint-200) 100%)`. Two columns with an 80px gap on desktop, stacked on mobile.
- **Left column:**
  - Eyebrow "Book".
  - H2 on two lines: "Begin your" / "{reading}".
  - Paragraph: "Send your details and you'll receive a reply with available times."
  - Three contact lines (16px, `--ink`), each a real link:
    - "WhatsApp · [+91 00000 00000]" links to `https://wa.me/` followed by the configured number.
    - "Email · [hello@yourdomain.com]" is a `mailto:` link.
    - "Instagram · [@lumoramagic]" links to `https://instagram.com/` followed by the handle.
- **Right column:** a `<form novalidate>` with a visible label (Karla 600, 14px, `--ink`) above each field:
  1. Full name: text, required, placeholder "As on birth certificate". From 640px it sits side by side with Date of birth.
  2. Date of birth: date, required.
  3. WhatsApp or email: text, required, placeholder "Where should we reply?"
  4. Service: select, required. Its first option is a disabled, preselected "Choose a service", followed by the six service titles in card order.
  5. What would you like guidance on?: textarea, 4 rows, optional, placeholder "A few lines is enough", not resizable.
  6. A full-width primary button "Request a session".
  7. Helper text under the button (14px, `--muted`): "This opens WhatsApp with your details filled in."
  8. A status region with `role="status"` for confirmation messages.

### 3.10 Footer

- `--footer` background, 56px vertical padding.
- **Top row:** the wordmark on the left ("Lumora" in `--footer-script`, "MAGIC" in `--footer-gold`). On the right, links "Services", "Life Path", "About" and "Book" in `--footer-text`. The row stacks on mobile.
- **Disclaimer** (13px, `--footer-muted`, max-width 820px): "Readings and ritual services are offered for spiritual guidance and personal reflection. They are not a substitute for medical, legal, financial or psychological advice."
- **Copyright:** "© YEAR Lumora Magic. All rights reserved." JavaScript replaces YEAR with the current year. Hard-code 2026 in the HTML as the fallback.

---

## 4. JavaScript behaviour (`js/main.js`)

Put all editable settings at the very top of the file:

```js
const CONFIG = {
  whatsappNumber: '910000000000',  // [placeholder] country code + number, digits only
  email: 'hello@yourdomain.com',   // [placeholder]
  instagram: 'lumoramagic',        // [placeholder] handle without @
};
```

1. **Mobile menu.**
   - Toggle the menu open and closed, and keep `aria-expanded` and the button label ("Open menu" / "Close menu") in sync.
   - Close it when a link is clicked or Escape is pressed.
   - Return focus to the menu button when it closes.
2. **Header shadow.** Add a class to the header when `window.scrollY > 8`.
3. **Life path calculator.**
   - Set the date input's `max` to today's date.
   - On `input` and `change`, when the field holds a complete, valid date:
     1. Add up every digit of the full date: day, month and year.
     2. Add up the digits of the result, and repeat until you reach a single digit.
     3. Stop early if the result is 11, 22 or 33, because these are master numbers.
   - Show the matching title and meaning from the table in 3.5.
   - Return to the empty state if the field is cleared, or the date is invalid or in the future.
   - Use these test cases:

     | Date of birth | Result |
     |---|---|
     | 15 Jul 1990 | 5, The Explorer |
     | 6 Feb 1992 | 11, Master Intuitive |
     | 9 Jun 2005 | 22, Master Builder |

   - When "Get my full reading" is clicked:
     1. Scroll to `#book`.
     2. Copy the date into the booking form's Date of birth field.
     3. Select "Full Numerology Reading".
     4. Move focus to the Full name field.
4. **"Book this service" links.** Scroll to `#book`, select that card's service in the dropdown, then focus the Full name field.
5. **Booking form.**
   - On submit, validate every required field. For each invalid field:
     - show an inline error under it, in `--error`, linked with `aria-describedby`;
     - set `aria-invalid="true"`.

     Then focus the first invalid field.

     | Field | Error message |
     |---|---|
     | Full name | Enter your full name. |
     | Date of birth | Choose your date of birth. |
     | WhatsApp or email | Add a WhatsApp number or email so we can reply. |
     | Service | Choose a service. |

   - When the form is valid, build this message and open `https://wa.me/${CONFIG.whatsappNumber}?text=` plus `encodeURIComponent(message)` in a new tab:

     ```
     Hello Lumora Magic, I'd like to book a session.
     Name: <name>
     Date of birth: <DD MMM YYYY>
     Reply to: <contact>
     Service: <service>
     Message: <message, or "—" if empty>
     ```

   - Then show this in the status region, where "message us on WhatsApp" is a link to the same WhatsApp chat: "WhatsApp is opening with your details. If it didn't open, message us on WhatsApp."
6. **Footer year.** Replace YEAR with the current year.
7. **Smooth scrolling.** In CSS, set `scroll-behavior: smooth`, and turn it off under reduced motion. Give sections a `scroll-margin-top` equal to the header height so headings aren't hidden under the sticky header.

---

## 5. Quality bar

- **Responsive:**
  - Check at 360, 390, 768, 1024, 1280 and 1440px widths.
  - There must be no horizontal scrolling, no overlapping or clipped text, and no stretched images.
  - Tap targets are at least 44×44px.
- **Accessibility:**
  - Use semantic landmarks (`header`, `nav`, `main`, `footer`) and add a "Skip to content" link.
  - Keep one H1 and a logical heading order.
  - Every field has a `<label>`.
  - Keep visible `:focus-visible` styles and WCAG AA colour contrast; never use `--gold` for text.
  - Decorative SVGs get `aria-hidden="true"`.
  - Everything must be usable with the keyboard alone.
- **Performance:**
  - Load scripts with `defer`.
  - Give images explicit width and height, and `loading="lazy"` if they are below the fold.
  - Load fonts with `display=swap`.
  - Aim for a Lighthouse score of 90+ in Performance, Accessibility, Best Practices and SEO.
- **SEO and sharing:**
  - Set `<html lang="en-IN">`.
  - Title: "Lumora Magic — Numerology Readings & Spell Work".
  - Meta description: "Personal numerology readings, name numerology, lucky dates and spell work for love, protection and prosperity. Book a consultation with Lumora Magic."
  - Add Open Graph and Twitter card tags using the logo image.
  - Set `theme-color` to #3F7A2A.
  - Favicon: `assets/favicon.svg`, a gold four-point sparkle on a mint circle.
- **Motion:** only the hero sparkle twinkle and small colour changes on button and link hover. No scroll-triggered fade-ins, parallax or carousels.

---

## 6. Don'ts

- Don't invent testimonials, prices, durations, credentials, statistics, names or contact details. Keep the [placeholders].
- Don't add claims of guaranteed or instant results anywhere.
- Don't add extra sections, dark mode, stock photos, external images, icon fonts or icon libraries.
- Don't change the copy, except to fix a genuine typo.

---

## 7. When you finish

1. **Test locally.** Serve the site (for example `python3 -m http.server 8080`) and check:
   - each responsive width;
   - the three calculator test cases;
   - form validation and the WhatsApp link format;
   - keyboard-only navigation.

   If you can take screenshots, compare them against this brief and fix anything that doesn't match.
2. **Write `README.md`**, covering:
   - how to run the site locally;
   - where to replace each placeholder (file name and the text to search for);
   - how to change the WhatsApp number, email and Instagram handle in `CONFIG`;
   - how to add `practitioner.jpg` and a transparent logo;
   - how to deploy to Netlify (drag and drop), GitHub Pages, and S3 + CloudFront.
3. **Reply with a short summary**, covering:
   - what you built;
   - the placeholders still to be filled in;
   - anything you couldn't do or had to decide yourself.
