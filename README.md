# Lumora Magic — website

A static, multi-page site for Lumora Magic: numerology readings and spell/ritual work.

Plain HTML5, CSS and vanilla JavaScript. No frameworks, no build step, no dependencies —
the files in this folder are the deployable site.

```
index.html                ← home (hero, numbers, testimonials)
services.html             ← /services
products.html             ← /products   (filled in from the backend)
service.html              ← /service?slug=…  (one service's page, from the backend)
product.html              ← /product?slug=…  (one product's page, from the backend)
life-path.html            ← /life-path  (calculator)
how-it-works.html         ← /how-it-works
about.html                ← /about
book.html                 ← /book       (booking form)
css/styles.css
js/main.js
assets/favicon.svg
assets/images/            ← put lumora-logo.jpg (and optional images) here
README.md
backend/                  ← optional booking API (see backend/README.md)
```

The site is complete on its own: the booking form opens a pre-filled WhatsApp chat and
needs no server. The `backend/` folder is an optional add-on that also stores each
request, so nothing is lost if a WhatsApp message never gets sent. It stays switched off
until you set `apiBaseUrl` in `js/main.js` — see
[Saving bookings to the backend](#saving-bookings-to-the-backend-optional).

---

## Run it locally

The menu links use clean URLs (`/services`, `/book`…), so use a server that maps
`/services` to `services.html`, as the production host does. From this folder:

```bash
npx serve .
```

Then open <http://localhost:3000>. The backend can also serve the site with the same
behaviour (`SERVE_SITE=true`, see [backend/README.md](backend/README.md)).

`python -m http.server` and VS Code's "Live Server" load each page but show "not found"
when you click the menu links, and opening the files straight from disk breaks them too.

---

## Images you still need to add

Everything goes in `assets/images/`.

### 1. `lumora-logo.jpg` — required (currently missing)

The hero shows a dashed **[LOGO IMAGE MISSING]** box because this file was not supplied.
Once you drop the file in, open `index.html`, search for `LOGO IMAGE MISSING`, and replace
the whole `<div class="hero__logo hero__logo-fallback"> … </div>` block with the `<img>` tag
written just above it in the comment:

```html
<img class="hero__logo" src="assets/images/lumora-logo.jpg" alt="Lumora Magic logo"
     width="540" height="540" fetchpriority="high">
```

The same file is already referenced by the Open Graph and Twitter share tags in `<head>`,
so sharing previews start working as soon as the file exists.

### 2. `practitioner.jpg` — optional

Search `about.html` for `PRACTITIONER PHOTO` and replace the placeholder `<div>` with the
`<img>` tag in the comment above it:

```html
<img class="about__photo" src="assets/images/practitioner.jpg" alt="[Practitioner Name]"
     width="520" height="540" loading="lazy">
```

Use a portrait-shaped image — it is cropped with `object-fit: cover` into the arch frame.
Put the real name in the `alt` text.

### 3. `lumora-logo-transparent.png` — optional

To use a transparent logo instead of the text wordmark in the header, replace the contents
of the `<a class="wordmark">` element in every page's header with:

```html
<img class="wordmark__logo" src="assets/images/lumora-logo-transparent.png"
     alt="" width="180" height="64">
```

(The link already carries `aria-label="Lumora Magic home"`, so the image `alt` stays empty.)
The `.wordmark__logo` class is already in the stylesheet and caps the height at 56–64px.
Do the same inside `<p class="footer__wordmark">` for the footer if you want it there too.

---

## Contact details — `js/main.js`

Open `js/main.js`. The first lines are the only settings you need to touch:

```js
const CONFIG = {
  whatsappNumber: '910000000000',  // country code + number, digits only, no + or spaces
  email: 'hello@yourdomain.com',
  instagram: 'lumoramagic',        // handle without the @
};
```

These drive the three contact links in the Book section, the link in the confirmation
message, and the WhatsApp message the booking form opens.

### Saving bookings to the backend (optional)

`CONFIG` has a fourth setting, empty by default:

```js
  apiBaseUrl: '',   // e.g. 'http://127.0.0.1:3000' or 'https://api.yourdomain.com'
```

Leave it empty and the form behaves exactly as designed — it opens WhatsApp, nothing
else. Set it to a running backend and the form still opens WhatsApp first, then quietly
posts a copy of the request to the API so you have a record of every enquiry. If the API
is unreachable, the client sees no difference.

Start the backend with `cd backend && npm start` (no install needed, Node 22.5+), and add
your site's origin to `ALLOWED_ORIGINS` in `backend/.env`. Full instructions are in
[backend/README.md](backend/README.md).

### Placeholder text on the contact links

The **visible text** of those links is separate placeholder copy. In `book.html`, search for:

| Search for | Replace with |
|---|---|
| `[+91 00000 00000]` | the phone number as you want it displayed |
| `[hello@yourdomain.com]` | the email address as displayed |
| `[@lumoramagic]` | the Instagram handle as displayed |

---

## The rest of the placeholders

All placeholder copy is written in `[square brackets]` so it is easy to find. Search
the `.html` files for each one:

| Placeholder | Where | What to put |
|---|---|---|
| `[PRICE]` (×6) | Service cards, `services.html` | Price for each service, in card order |
| `[DURATION]` (×6) | Service cards, `services.html` | Session length for each service |
| `[Practitioner Name]` | About heading, photo `alt`, `about.html` | The practitioner's name |
| `[A short introduction — …]` | About paragraph, `about.html` | 2–4 sentences of introduction |
| `[00]` / `[000]` / `[Lang]` | About stats, `about.html` | Years of practice, readings given, languages |
| `[PRACTITIONER PHOTO]` | About, `about.html` | Replaced by the photo (see above) |
| `[Client testimonial]` (×3) | Testimonials, `index.html` | Real client quotes |
| `[Client name] · [City]` (×3) | Testimonials, `index.html` | Attribution for each quote |
| `[LOGO IMAGE MISSING]` | Hero, `index.html` | Replaced by the logo (see above) |

The services, the life path meanings, the three steps, the disclaimer and the headings are
final copy — no placeholders there.

---

## Deploying

The site is fully static: upload the whole folder, no build command, no environment
variables.

### Netlify (drag and drop)

1. Sign in at <https://app.netlify.com>.
2. Go to **Sites** and drag this entire project folder onto the drop area.
3. Netlify serves `index.html` at the root and gives you a `*.netlify.app` URL.
4. **Domain settings → Add a domain** to attach a custom domain; HTTPS is automatic.

To update later, drag the folder on again (or connect the Git repo and leave the build
command empty with the publish directory set to `/`).

### GitHub Pages

1. Push these files to a repository, with `index.html` at the repository root.
2. **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and the
   `/ (root)` folder, then **Save**.
4. The site appears at `https://<user>.github.io/<repo>/` within a minute or two.

Because every link in the page is relative, it works from a subfolder like `/<repo>/`
without changes.

### S3 + CloudFront

```bash
aws s3 sync . s3://YOUR-BUCKET --delete \
  --exclude ".git/*" --exclude "README.md" --exclude "*.md"

# long cache for static assets, no cache for the HTML
aws s3 cp s3://YOUR-BUCKET s3://YOUR-BUCKET --recursive --metadata-directive REPLACE \
  --exclude "*" --include "css/*" --include "js/*" --include "assets/*" \
  --cache-control "public, max-age=31536000, immutable"
aws s3 cp index.html s3://YOUR-BUCKET/index.html \
  --cache-control "no-cache" --content-type "text/html; charset=utf-8"
```

1. Create the bucket with **Block all public access** left on.
2. Create a CloudFront distribution with the bucket as origin, using **Origin access
   control (OAC)**, and apply the bucket policy CloudFront offers you.
3. Set **Default root object** to `index.html`.
4. Attach your certificate (ACM, in `us-east-1`) and domain under **Alternate domain names**.
5. After each deploy that changes the HTML: `aws cloudfront create-invalidation
   --distribution-id YOUR-ID --paths "/index.html" "/"`.

---

## Notes for whoever edits this next

- **After changing `css/styles.css` or `js/main.js`**, bump the `?v=` number on their
  `<link>` and `<script>` tags in every `.html` file (search for `?v=`). The host sends
  no cache headers, so without a new number browsers keep using the old file.

- **Design tokens** — every colour, font, size and radius is a CSS custom property at the
  top of `css/styles.css`. Change a value there and it updates everywhere. There are no
  hard-coded colours anywhere else in the stylesheet.
- **Type scale** — headings use `clamp()` to interpolate between the mobile and desktop
  sizes; the comment beside each one gives the two endpoints in pixels.
- **Breakpoints** — 640px (two-column cards, side-by-side form fields) and 1024px (full
  desktop layout, and where the nav stops collapsing into the menu button).
- **Life path numbers** — the titles and meanings live in the `LIFE_PATHS` object in
  `js/main.js`. Digits of the whole date are summed and reduced to one digit, stopping early
  on the master numbers 11, 22 and 33.
- **Motion** — the only animation is the sparkle twinkle around the hero logo, and it is
  switched off entirely under `prefers-reduced-motion: reduce`.
- **Accessibility** — one `<h1>`, semantic landmarks, a skip link, a label on every field,
  visible focus rings, and inline form errors wired up with `aria-describedby` and
  `aria-invalid`. Please keep these if you restructure anything.
- The booking form has no backend: it opens a pre-filled WhatsApp chat in a new tab. If you
  later want the submissions emailed instead, that is the one function to swap out
  (`initBookingForm` in `js/main.js`).
