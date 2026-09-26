/* =========================================================
   Lumora Magic — main.js
   Edit the values in CONFIG below. Nothing else needs changing.
   ========================================================= */

const CONFIG = {
  whatsappNumber: '918273792119',            // country code + number, digits only
  email: 'connect.lumoramagic@gmail.com',
  instagram: 'lumora.magic',                 // handle without @

  // Optional. Leave empty and the site behaves exactly as before: the booking
  // form only opens WhatsApp. Set it to the backend's address (for example
  // 'http://localhost:3000' or 'https://api.yourdomain.com') and each request
  // is also saved there, in the background, after WhatsApp opens.
  apiBaseUrl: 'https://api.lumoramagic.com',
};

/* ---------- Life path data ---------- */

const LIFE_PATHS = {
  1:  { title: 'The Leader',       meaning: 'Independent and driven, you are here to pioneer and trust your own direction.' },
  2:  { title: 'The Harmoniser',   meaning: 'Sensitive and diplomatic, you bring people and ideas together.' },
  3:  { title: 'The Creator',      meaning: 'Expressive and joyful, your gift is communication and imagination.' },
  4:  { title: 'The Builder',      meaning: 'Steady and practical, you create lasting foundations through effort.' },
  5:  { title: 'The Explorer',     meaning: 'Curious and free, you grow through change, travel and experience.' },
  6:  { title: 'The Nurturer',     meaning: 'Caring and responsible, you are drawn to family, home and service.' },
  7:  { title: 'The Seeker',       meaning: 'Reflective and intuitive, you search for deeper truth and meaning.' },
  8:  { title: 'The Achiever',     meaning: 'Ambitious and capable, you are here to master power and abundance.' },
  9:  { title: 'The Healer',       meaning: 'Compassionate and wise, you are guided toward humanitarian purpose.' },
  11: { title: 'Master Intuitive', meaning: 'A master number of insight and inspiration, carrying a strong inner voice.' },
  22: { title: 'Master Builder',   meaning: 'A master number that turns great visions into real, lasting form.' },
  33: { title: 'Master Teacher',   meaning: 'A master number of compassion, guidance and uplifting others.' },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const $ = (selector, scope) => (scope || document).querySelector(selector);
const $$ = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));

const whatsappLink = () => 'https://wa.me/' + CONFIG.whatsappNumber;

/* ---------- Contact links from CONFIG ---------- */

function applyConfig() {
  const wa = $('#contact-whatsapp');
  const mail = $('#contact-email');
  const insta = $('#contact-instagram');

  if (wa) wa.href = whatsappLink();
  if (mail) mail.href = 'mailto:' + CONFIG.email;
  if (insta) insta.href = 'https://instagram.com/' + CONFIG.instagram;

  const cta = $('#cta-whatsapp');
  if (cta) {
    cta.href = whatsappLink() + '?text=' +
      encodeURIComponent('Hello Lumora Magic, I’m not sure which reading or ritual is right for me. Could you help?');
  }
}

/* ---------- 1. Mobile menu ---------- */

function initMenu() {
  const toggle = $('#nav-toggle');
  const nav = $('#primary-nav');
  if (!toggle || !nav) return;

  const setState = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  const close = (returnFocus) => {
    if (!nav.classList.contains('is-open')) return;
    setState(false);
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    setState(!nav.classList.contains('is-open'));
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) close(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close(true);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) close(false);
  });
}

/* ---------- 2. Header shadow ---------- */

function initHeaderShadow() {
  const header = $('#site-header');
  if (!header) return;

  const update = () => {
    header.classList.toggle('header--scrolled', window.scrollY > 8);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* ---------- Shared: open the booking page, pre-filled ---------- */

// /book?service=…&dob=YYYY-MM-DD — read back by prefillBooking() on that page.
function bookingUrl(service, birthdate) {
  const params = new URLSearchParams();
  if (service) params.set('service', service);
  if (birthdate) params.set('dob', birthdate);
  const query = params.toString();
  return '/book' + (query ? '?' + query : '');
}

function prefillBooking() {
  if (!$('#booking-form')) return;

  const params = new URLSearchParams(window.location.search);
  const service = params.get('service');
  const birthdate = params.get('dob');
  if (!service && !birthdate) return;

  const serviceField = $('#service');
  const birthField = $('#birthdate');
  const nameField = $('#name');

  if (birthdate && birthField && /^\d{4}-\d{2}-\d{2}$/.test(birthdate)) birthField.value = birthdate;

  if (service && serviceField) {
    const match = $$('option', serviceField).find((option) => option.text === service);
    if (match) serviceField.value = match.value || match.text;
  }

  if (nameField) nameField.focus();
}

/* ---------- Services from the backend ---------- */

// Icons for the original six cards; any service added later gets the star.
const SERVICE_ICONS = {
  'full-numerology-reading': '<circle cx="12" cy="12" r="9"/><path d="M9.2 8.8h5.6l-3.2 7.4"/>',
  'name-business-numerology': '<path d="M4.5 18.5V5.5L12 13l7.5-7.5v13"/>',
  'lucky-dates-muhurat': '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  'love-relationship-spells': '<path d="M20.4 5.6a5 5 0 0 0-7.1 0L12 6.9l-1.3-1.3a5 5 0 1 0-7.1 7.1l1.3 1.3L12 21.1l7.1-7.1 1.3-1.3a5 5 0 0 0 0-7.1Z"/>',
  'protection-cleansing': '<path d="M12 2.8 19.2 6v5.6c0 4.5-3 7.8-7.2 8.8-4.2-1-7.2-4.3-7.2-8.8V6Z"/><path d="M9.1 11.9 11 13.8l3.9-3.9"/>',
  'career-prosperity-rituals': '<path d="M3 17.5 8.8 11.7l3.6 3.6L20.5 7.2"/><path d="M14.8 7.2h5.7v5.7"/>',
};
const DEFAULT_SERVICE_ICON = '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z"/>';

// /service?slug=… and /product?slug=… — each item's own page, read back by loadItemPage().
const serviceUrl = (slug) => '/service?slug=' + encodeURIComponent(slug);
const productUrl = (slug) => '/product?slug=' + encodeURIComponent(slug);

function setServiceIcon(icon, service) {
  icon.className = 'card__icon card__icon--' + (service.tile === 'gold' ? 'gold' : 'green');
  icon.innerHTML =
    '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    (SERVICE_ICONS[service.slug] || DEFAULT_SERVICE_ICON) + '</svg>';
}

/** '₹1,799' → 1799, or null when the text holds no amount. */
function priceNumber(text) {
  const value = Number.parseFloat(String(text || '').replace(/[^\d.]/g, ''));
  return Number.isFinite(value) && value > 0 ? value : null;
}

/** Percentage off, when both prices are plain amounts and the original is higher. */
function discountPercent(price, compareAt) {
  const now = priceNumber(price);
  const was = priceNumber(compareAt);
  if (!now || !was || was <= now) return null;
  return Math.floor((1 - now / was) * 100); // rounded down, so it never overstates the saving
}

/** A card's price: the original struck through, then the price. */
function cardPrice(item) {
  const price = document.createElement('span');
  price.className = 'card__price';
  if (item.compareAtPrice && item.price) {
    const was = document.createElement('s');
    was.className = 'card__compare';
    was.textContent = item.compareAtPrice;
    price.append(was, document.createTextNode(' '));
  }
  price.append(document.createTextNode(item.price || ''));
  return price;
}

function cardBadge(text) {
  const badge = document.createElement('span');
  badge.className = 'card__badge';
  badge.textContent = text;
  return badge;
}

/** The first photo across the top of a card, with the badge on it. */
function cardMedia(item, alt) {
  const media = document.createElement('div');
  media.className = 'card__media';
  const image = document.createElement('img');
  image.className = 'card__image';
  image.src = item.images[0];
  image.alt = alt;
  image.loading = 'lazy';
  image.width = 400;
  image.height = 300;
  media.append(image);
  if (item.badge) media.append(cardBadge(item.badge));
  return media;
}

/** The title link covers the whole card (see .card__title-link in the CSS). */
function cardTitle(text, href) {
  const title = document.createElement('h3');
  title.className = 'card__title';
  const link = document.createElement('a');
  link.className = 'card__title-link';
  link.href = href;
  link.textContent = text;
  title.append(link);
  return title;
}

function cardLinks(action) {
  const links = document.createElement('div');
  links.className = 'card__links';
  const more = document.createElement('span');
  more.className = 'card__more';
  more.setAttribute('aria-hidden', 'true');
  more.textContent = 'View details →';
  links.append(more, action);
  return links;
}

function serviceCard(service) {
  const item = document.createElement('li');
  item.className = 'card card--linked';

  if (service.images && service.images.length) {
    item.append(cardMedia(service, service.title));
  } else {
    const icon = document.createElement('span');
    setServiceIcon(icon, service);
    item.append(icon);
    if (service.badge) item.append(cardBadge(service.badge));
  }

  const text = document.createElement('p');
  text.className = 'card__text';
  text.textContent = service.description;

  item.append(cardTitle(service.title, serviceUrl(service.slug)), text);

  if (service.price || service.duration) {
    const meta = document.createElement('p');
    meta.className = 'card__meta';
    const duration = document.createElement('span');
    duration.className = 'card__duration';
    duration.textContent = service.duration || '';
    meta.append(cardPrice(service), document.createTextNode(' '), duration);
    item.append(meta);
  }

  const book = document.createElement('a');
  book.className = 'card__link';
  book.href = bookingUrl(service.title);
  book.textContent = 'Book this service';
  item.append(cardLinks(book));

  return item;
}

/* Detailed text: a blank line starts a new paragraph, a single newline breaks the line. */
function renderParagraphs(container, text) {
  const paragraphs = String(text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  container.replaceChildren(
    ...paragraphs.map((paragraph) => {
      const p = document.createElement('p');
      paragraph.split('\n').forEach((line, index) => {
        if (index > 0) p.append(document.createElement('br'));
        p.append(document.createTextNode(line));
      });
      return p;
    })
  );
}

const whatsappText = (message) => whatsappLink() + '?text=' + encodeURIComponent(message);

/** Main photo with arrows, thumbnails, arrow keys and swipe. */
function initGallery(images, name, placeholderItem) {
  const image = $('#gallery-image');
  const thumbs = $('#gallery-thumbs');
  const prev = $('#gallery-prev');
  const next = $('#gallery-next');
  const stage = image.parentElement;

  if (images.length === 0) {
    setServiceIcon($('#item-icon'), placeholderItem);
    $('#gallery-placeholder').hidden = false;
    return;
  }

  let index = 0;
  const buttons = images.map((src, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery__thumb';
    button.setAttribute('aria-label', 'Show photo ' + (i + 1) + ' of ' + images.length);
    const thumb = document.createElement('img');
    thumb.src = src;
    thumb.alt = '';
    thumb.loading = 'lazy';
    button.append(thumb);
    button.addEventListener('click', () => show(i));
    return button;
  });

  function show(i) {
    index = (i + images.length) % images.length;
    image.src = images[index];
    image.alt = images.length > 1 ? name + ' — photo ' + (index + 1) + ' of ' + images.length : name;
    buttons.forEach((button, b) => button.setAttribute('aria-current', String(b === index)));
  }

  image.hidden = false;
  show(0);
  if (images.length < 2) return;

  thumbs.replaceChildren(...buttons);
  thumbs.hidden = false;
  prev.hidden = false;
  next.hidden = false;
  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));

  $('#gallery').addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });

  let startX = null;
  stage.addEventListener('touchstart', (event) => { startX = event.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (event) => {
    if (startX === null) return;
    const dx = event.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
  });
}

/** A service's or a product's own page: /service?slug=… or /product?slug=… */
function loadItemPage() {
  const page = $('#item-page');
  if (!page) return;

  const kind = page.dataset.kind; // 'service' or 'product'
  const slug = new URLSearchParams(window.location.search).get('slug');

  const finish = (found) => {
    page.removeAttribute('aria-busy');
    $('#item-loading').hidden = true;
    $('#item-missing').hidden = found;
    $('#item-content').hidden = !found;
  };

  if (!slug || !CONFIG.apiBaseUrl) {
    finish(false);
    return;
  }

  fetch(CONFIG.apiBaseUrl.replace(/\/+$/, '') + '/api/' + kind + 's/' + encodeURIComponent(slug))
    .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
    .then((item) => {
      const name = kind === 'service' ? item.title : item.name;

      document.title = name + ' — Lumora Magic';
      const description = document.querySelector('meta[name="description"]');
      if (description) description.setAttribute('content', item.description);

      $('#item-title').textContent = name;
      $('#item-description').textContent = item.description;

      if (item.price) {
        $('#item-price').textContent = item.price;
        if (item.compareAtPrice) {
          $('#item-compare').textContent = item.compareAtPrice;
          $('#item-compare').hidden = false;
        }
        const off = discountPercent(item.price, item.compareAtPrice);
        if (off) {
          $('#item-discount').textContent = '−' + off + '%';
          $('#item-discount').hidden = false;
        }
        $('#item-price-row').hidden = false;
      }

      if (item.duration) {
        $('#item-duration').textContent = 'Session length: ' + item.duration;
        $('#item-duration').hidden = false;
      }

      if (item.badge) {
        $('#item-badge').textContent = item.badge;
        $('#item-badge').hidden = false;
      }

      initGallery(item.images || [], name, kind === 'service' ? item : { slug: '', tile: 'gold' });

      // Description, then the item's own sections (Delivery, Care…), all collapsible.
      renderParagraphs($('#item-details'), item.details || item.description);
      for (const section of item.sections || []) {
        const block = document.createElement('details');
        block.className = 'accordion';
        const summary = document.createElement('summary');
        summary.className = 'accordion__summary';
        summary.textContent = section.title;
        const body = document.createElement('div');
        body.className = 'accordion__body';
        renderParagraphs(body, section.body);
        block.append(summary, body);
        $('#item-sections').append(block);
      }

      const primary = $('#item-primary');
      if (kind === 'service') {
        primary.href = bookingUrl(name);
        primary.textContent = 'Book this service';
      } else {
        primary.href = whatsappText(
          'Hello Lumora Magic, I’d like to order: ' + name + (item.price ? ' (' + item.price + ')' : '') + '.'
        );
        primary.target = '_blank';
        primary.rel = 'noopener';
        primary.textContent = 'Order on WhatsApp';
      }
      $('#item-ask').href = whatsappText('Hello Lumora Magic, I have a question about ' + name + '.');

      finish(true);
    })
    .catch(() => finish(false));
}

/**
 * Replaces the service cards and the booking form's options with the list
 * the practitioner manages in the backend admin. The services written into
 * the HTML stay in place if there is no backend or it cannot be reached.
 */
function loadServices() {
  const cards = $('#service-cards');
  const select = $('#service');
  if (!CONFIG.apiBaseUrl || (!cards && !select)) return;

  fetch(CONFIG.apiBaseUrl.replace(/\/+$/, '') + '/api/services')
    .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
    .then(({ items }) => {
      if (!Array.isArray(items) || items.length === 0) return;

      // The home page shows only the first few (data-limit).
      const limit = Number(cards && cards.dataset.limit) || items.length;
      if (cards) cards.replaceChildren(...items.slice(0, limit).map(serviceCard));

      if (select) {
        const chosen = select.value || new URLSearchParams(window.location.search).get('service');
        const placeholder = select.options[0];
        const options = items.map((service) => {
          const option = document.createElement('option');
          option.textContent = service.title;
          return option;
        });
        select.replaceChildren(placeholder, ...options);
        const match = options.find((option) => option.text === chosen);
        if (match) select.value = match.text;
      }
    })
    .catch(() => {
      /* Keep the services already in the page. */
    });
}

/* ---------- Products from the backend ---------- */

function productCard(product) {
  const item = document.createElement('li');
  item.className = 'card card--linked';

  if (product.images && product.images.length) {
    item.append(cardMedia(product, product.name));
  } else if (product.badge) {
    item.append(cardBadge(product.badge));
  }

  const text = document.createElement('p');
  text.className = 'card__text';
  text.textContent = product.description;

  item.append(cardTitle(product.name, productUrl(product.slug)), text);

  if (product.price) {
    const meta = document.createElement('p');
    meta.className = 'card__meta';
    meta.append(cardPrice(product));
    item.append(meta);
  }

  const order = document.createElement('a');
  order.className = 'card__link';
  order.href = whatsappText(
    'Hello Lumora Magic, I’d like to order: ' + product.name + (product.price ? ' (' + product.price + ')' : '') + '.'
  );
  order.target = '_blank';
  order.rel = 'noopener';
  order.textContent = 'Order on WhatsApp';
  item.append(cardLinks(order));

  return item;
}

/**
 * Fills the Products page from the list the practitioner manages in the
 * backend admin. With no products, or no backend, it points to WhatsApp.
 */
function loadProducts() {
  const cards = $('#product-cards');
  if (!cards) return;

  const empty = $('#products-empty');
  const emptyText = $('#products-empty-text');
  const whatsapp = $('#products-whatsapp');

  const showEmpty = (message) => {
    emptyText.textContent = message;
    whatsapp.href = whatsappLink() + '?text=' +
      encodeURIComponent('Hello Lumora Magic, I’d like to know which products you have available.');
    whatsapp.hidden = false;
    empty.hidden = false;
  };

  if (!CONFIG.apiBaseUrl) {
    showEmpty('Message us on WhatsApp to see what’s available.');
    return;
  }

  fetch(CONFIG.apiBaseUrl.replace(/\/+$/, '') + '/api/products')
    .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
    .then(({ items }) => {
      if (!Array.isArray(items) || items.length === 0) {
        showEmpty('New products are on their way. Message us on WhatsApp to ask what’s available.');
        return;
      }
      cards.replaceChildren(...items.map(productCard));
      empty.hidden = true;
    })
    .catch(() => {
      showEmpty('Products couldn’t be loaded just now. Message us on WhatsApp to see what’s available.');
    });
}

/* ---------- About: practitioners ---------- */

/** Two letters for a practitioner without a photo. */
function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('');
}

function practitionerBlock(person, index, isOnly) {
  const article = document.createElement('article');
  article.className = index % 2 === 1 ? 'about__inner about__inner--flip' : 'about__inner';

  const media = document.createElement('div');
  media.className = 'about__media';
  if (person.photo) {
    const img = document.createElement('img');
    img.className = 'about__photo';
    img.src = person.photo;
    img.alt = person.name;
    img.width = 900;
    img.height = 1200;
    if (index > 0) img.loading = 'lazy';
    media.append(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'about__photo about__photo--initials';
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.textContent = initials(person.name);
    media.append(placeholder);
  }

  const text = document.createElement('div');
  text.className = 'about__text';

  // One practitioner: the page's own "Hello, I'm …" heading.
  // Several: the page heading sits above, and each name is a sub-heading.
  const heading = document.createElement(isOnly ? 'h1' : 'h2');
  heading.className = 'h2';
  if (isOnly) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = 'About Lumora Magic';
    text.append(eyebrow);

    const hello = document.createElement('span');
    hello.className = 'h2__serif';
    hello.textContent = 'Hello, I’m';
    heading.append(hello, ' ');
  }
  const name = document.createElement('span');
  name.className = 'script script--h2';
  name.textContent = person.name;
  heading.append(name);
  text.append(heading);

  if (person.role) {
    const role = document.createElement('p');
    role.className = 'about__role';
    role.textContent = person.role;
    text.append(role);
  }

  const bio = document.createElement('div');
  bio.className = 'about__lede';
  renderParagraphs(bio, person.bio);
  text.append(bio);

  const stats = [
    [person.years, 'Years of practice'],
    [person.readings, 'Readings given'],
    [person.languages, 'Languages'],
  ].filter(([value]) => value);

  if (stats.length) {
    const list = document.createElement('dl');
    list.className = 'stats';
    for (const [value, label] of stats) {
      const stat = document.createElement('div');
      stat.className = 'stat';
      const dt = document.createElement('dt');
      dt.className = 'stat__value';
      dt.textContent = value;
      const dd = document.createElement('dd');
      dd.className = 'stat__label';
      dd.textContent = label;
      stat.append(dt, dd);
      list.append(stat);
    }
    text.append(list);
  }

  const cta = document.createElement('p');
  cta.className = 'section__cta section__cta--start';
  const link = document.createElement('a');
  link.className = 'btn btn--primary';
  link.href = '/book';
  link.textContent = isOnly ? 'Book a consultation' : 'Book with ' + person.name.split(/\s+/)[0];
  cta.append(link);
  text.append(cta);

  article.append(media, text);
  return article;
}

/** Replaces the About page's general introduction with the practitioners from /admin. */
function loadPractitioners() {
  const list = document.getElementById('practitioners');
  if (!list || !CONFIG.apiBaseUrl) return;

  fetch(CONFIG.apiBaseUrl.replace(/\/+$/, '') + '/api/practitioners')
    .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
    .then(({ items }) => {
      // Nothing added yet: the general introduction stays.
      if (!Array.isArray(items) || items.length === 0) return;

      const isOnly = items.length === 1;
      const blocks = items.map((person, index) => practitionerBlock(person, index, isOnly));

      if (!isOnly) {
        const head = document.createElement('div');
        head.className = 'section__head section__head--center about__head';
        const eyebrow = document.createElement('p');
        eyebrow.className = 'eyebrow';
        eyebrow.textContent = 'About Lumora Magic';
        const heading = document.createElement('h1');
        heading.className = 'h2';
        const serif = document.createElement('span');
        serif.className = 'h2__serif';
        serif.textContent = 'Meet the';
        const script = document.createElement('span');
        script.className = 'script script--h2';
        script.textContent = 'practitioners';
        heading.append(serif, ' ', script);
        head.append(eyebrow, heading);
        blocks.unshift(head);
      }

      list.replaceChildren(...blocks);
    })
    .catch(() => {
      /* the general introduction stays */
    });
}

/**
 * The home page's "Meet your practitioner": each practitioner with the first
 * paragraph of their introduction and a link to the About page. The section
 * stays hidden until one is added in /admin.
 */
function loadHomePractitioners() {
  const list = document.getElementById('home-practitioners');
  const section = document.getElementById('meet');
  if (!list || !section || !CONFIG.apiBaseUrl) return;

  fetch(CONFIG.apiBaseUrl.replace(/\/+$/, '') + '/api/practitioners')
    .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
    .then(({ items }) => {
      if (!Array.isArray(items) || items.length === 0) return;

      const blocks = items.map((person, index) => {
        const block = practitionerBlock(person, index, false);
        $$('.about__lede > p', block).slice(1).forEach((p) => p.remove());

        const more = document.createElement('a');
        more.className = 'btn btn--secondary';
        more.href = '/about';
        more.textContent = 'Read more';
        $('.section__cta', block).append(' ', more);
        return block;
      });

      list.replaceChildren(...blocks);
      if (items.length > 1) $('#meet-title .script').textContent = 'practitioners';
      section.hidden = false;
    })
    .catch(() => {
      /* the section stays hidden */
    });
}

function testimonialCard(testimonial) {
  const item = document.createElement('li');
  item.className = 'cards__cell';

  const figure = document.createElement('figure');
  figure.className = 'card quote';

  const sparks = document.createElement('span');
  sparks.className = 'quote__sparks';
  sparks.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 3; i += 1) {
    sparks.insertAdjacentHTML('beforeend',
      '<svg width="14" height="14" viewBox="0 0 24 24" focusable="false"><path d="M12 1.6c.7 5.2 4.5 9 9.7 9.7-5.2.7-9 4.5-9.7 9.7-.7-5.2-4.5-9-9.7-9.7 5.2-.7 9-4.5 9.7-9.7Z" fill="currentColor"/></svg>');
  }

  const quote = document.createElement('blockquote');
  quote.className = 'quote__text';
  renderParagraphs(quote, testimonial.quote);
  const paragraphs = $$('p', quote);
  paragraphs[0].prepend('“');
  paragraphs[paragraphs.length - 1].append('”');

  const cite = document.createElement('figcaption');
  cite.className = 'quote__cite';
  cite.textContent = [testimonial.name, testimonial.place].filter(Boolean).join(' · ');
  if (testimonial.service) {
    const service = document.createElement('span');
    service.className = 'quote__service';
    service.textContent = testimonial.service;
    cite.append(service);
  }

  figure.append(sparks, quote, cite);
  item.append(figure);
  return item;
}

/** "Words from clients" on the home page: Reviews from /admin, hidden until there is one. */
function loadTestimonials() {
  const list = document.getElementById('testimonial-cards');
  const section = document.getElementById('testimonials');
  if (!list || !section || !CONFIG.apiBaseUrl) return;

  fetch(CONFIG.apiBaseUrl.replace(/\/+$/, '') + '/api/testimonials')
    .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
    .then(({ items }) => {
      if (!Array.isArray(items) || items.length === 0) return;
      list.replaceChildren(...items.map(testimonialCard));
      section.hidden = false;
    })
    .catch(() => {
      /* the section stays hidden */
    });
}

/* ---------- 3. Life path calculator ---------- */

function reduceToLifePath(digits) {
  let total = digits.reduce((sum, digit) => sum + digit, 0);

  while (total > 9 && total !== 11 && total !== 22 && total !== 33) {
    total = String(total).split('').reduce((sum, char) => sum + Number(char), 0);
  }

  return total;
}

function lifePathFromISO(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
  if (!isRealDate) return null;

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (date > today) return null;

  const digits = value.replace(/-/g, '').split('').map(Number);
  return reduceToLifePath(digits);
}

function renderEmptyResult(region) {
  region.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.className = 'result__empty';

  const sparks = document.createElement('span');
  sparks.className = 'result__sparks';
  sparks.setAttribute('aria-hidden', 'true');
  [18, 30, 18].forEach((size) => {
    sparks.insertAdjacentHTML(
      'beforeend',
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" focusable="false">' +
        '<path d="M12 1.6c.7 5.2 4.5 9 9.7 9.7-5.2.7-9 4.5-9.7 9.7-.7-5.2-4.5-9-9.7-9.7 5.2-.7 9-4.5 9.7-9.7Z" fill="currentColor"/></svg>'
    );
  });

  const title = document.createElement('p');
  title.className = 'result__empty-title';
  title.textContent = 'Your number appears here';

  const text = document.createElement('p');
  text.className = 'result__empty-text';
  text.textContent = 'A full reading goes much deeper.';

  wrap.append(sparks, title, text);
  region.append(wrap);
}

function renderResult(region, number, isoDate) {
  const data = LIFE_PATHS[number];
  if (!data) {
    renderEmptyResult(region);
    return;
  }

  region.innerHTML = '';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'Your life path';

  const digit = document.createElement('p');
  digit.className = 'result__number';
  digit.textContent = String(number);

  const title = document.createElement('p');
  title.className = 'result__title';
  title.textContent = data.title;

  const meaning = document.createElement('p');
  meaning.className = 'result__meaning';
  meaning.textContent = data.meaning;

  const cta = document.createElement('a');
  cta.className = 'btn btn--primary';
  cta.href = bookingUrl('Full Numerology Reading', isoDate);
  cta.textContent = 'Get my full reading';

  region.append(eyebrow, digit, title, meaning, cta);
}

function initCalculator() {
  const input = $('#dob');
  const region = $('#result');
  if (!input || !region) return;

  const today = new Date();
  const iso =
    today.getFullYear() +
    '-' + String(today.getMonth() + 1).padStart(2, '0') +
    '-' + String(today.getDate()).padStart(2, '0');
  input.max = iso;

  const update = () => {
    const value = input.value;
    const number = value ? lifePathFromISO(value) : null;

    if (number === null) {
      renderEmptyResult(region);
      return;
    }

    renderResult(region, number, value);
  };

  input.addEventListener('input', update);
  input.addEventListener('change', update);
}

/* ---------- 4. Booking form ---------- */

function formatDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  return Number(match[3]) + ' ' + MONTHS[Number(match[2]) - 1] + ' ' + match[1];
}

function setFieldError(field, errorId, show) {
  const error = document.getElementById(errorId);
  if (!error) return;

  error.hidden = !show;

  if (show) {
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorId);
  } else {
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  }
}

/**
 * Sends a copy of the request to the backend, if one is configured.
 * Runs after WhatsApp has already opened: the client's hand-off never waits on
 * the network, and a backend that is down or absent changes nothing on screen.
 */
function recordBooking(payload) {
  if (!CONFIG.apiBaseUrl) return;

  const endpoint = CONFIG.apiBaseUrl.replace(/\/+$/, '') + '/api/bookings';

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    /* The WhatsApp hand-off has already happened; nothing to tell the client. */
  });
}

function initBookingForm() {
  const form = $('#booking-form');
  if (!form) return;

  const status = $('#form-status');
  const fields = [
    { el: $('#name'), errorId: 'name-error' },
    { el: $('#birthdate'), errorId: 'birthdate-error' },
    { el: $('#contact'), errorId: 'contact-error' },
    { el: $('#service'), errorId: 'service-error' },
  ];

  fields.forEach(({ el, errorId }) => {
    if (!el) return;
    el.addEventListener('input', () => {
      if (el.value.trim()) setFieldError(el, errorId, false);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let firstInvalid = null;

    fields.forEach(({ el, errorId }) => {
      if (!el) return;
      const invalid = !el.value.trim();
      setFieldError(el, errorId, invalid);
      if (invalid && !firstInvalid) firstInvalid = el;
    });

    if (firstInvalid) {
      if (status) status.textContent = '';
      firstInvalid.focus();
      return;
    }

    const message =
      'Hello Lumora Magic, I’d like to book a session.\n' +
      'Name: ' + $('#name').value.trim() + '\n' +
      'Date of birth: ' + formatDate($('#birthdate').value) + '\n' +
      'Reply to: ' + $('#contact').value.trim() + '\n' +
      'Service: ' + $('#service').value + '\n' +
      'Message: ' + ($('#message').value.trim() || '—');

    const url = whatsappLink() + '?text=' + encodeURIComponent(message);
    window.open(url, '_blank', 'noopener');

    recordBooking({
      name: $('#name').value.trim(),
      birthdate: $('#birthdate').value,
      contact: $('#contact').value.trim(),
      service: $('#service').value,
      message: $('#message').value.trim(),
      website: $('#website') ? $('#website').value : '',
    });

    if (status) {
      status.textContent = '';
      status.append(document.createTextNode('WhatsApp is opening with your details. If it didn’t open, '));

      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'message us on WhatsApp';

      status.append(link, document.createTextNode('.'));
    }
  });
}

/* ---------- 5. Footer year ---------- */

function initYear() {
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
}

/* ---------- Live graphics ---------- */

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Star colours as "r,g,b": gold and green on the light hero, soft light on the dark band.
const STAR_PALETTES = {
  dawn: ['212,167,44', '212,167,44', '63,122,42', '122,92,12'],
  night: ['255,248,225', '242,217,138', '221,239,201', '255,255,255'],
};

/**
 * A slowly drifting, twinkling starfield with the odd shooting star, drawn on
 * every canvas.starfield. It only animates while on screen and while the tab
 * is visible; with reduced motion it is drawn once and stays still.
 */
function initStarfields() {
  $$('canvas.starfield').forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const palette = STAR_PALETTES[canvas.dataset.palette] || STAR_PALETTES.dawn;
    const still = reducedMotion();
    const night = canvas.dataset.palette === 'night';
    let stars = [];
    let width = 0;
    let height = 0;
    let visible = false;
    let frame = 0;
    let last = 0;
    let shooting = null;
    let nextShooting = 3000 + Math.random() * 4000;

    const makeStar = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * (night ? 1.3 : 1.6) + 0.4,
      color: palette[Math.floor(Math.random() * palette.length)],
      base: night ? 0.35 + Math.random() * 0.6 : 0.2 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 5,
      vy: -(1.5 + Math.random() * 5),
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(night ? 140 : 110, (width * height) / (night ? 3500 : 6500)));
      stars = Array.from({ length: count }, makeStar);
      draw(performance.now(), 0);
    };

    // A four-pointed glint on the larger stars, like the site's sparkle icon.
    const glint = (x, y, size) => {
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.quadraticCurveTo(x, y, x + size, y);
      ctx.quadraticCurveTo(x, y, x, y + size);
      ctx.quadraticCurveTo(x, y, x - size, y);
      ctx.quadraticCurveTo(x, y, x, y - size);
      ctx.fill();
    };

    function draw(now, dt) {
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        if (dt) {
          star.x += star.vx * dt;
          star.y += star.vy * dt;
          if (star.y < -4) { star.y = height + 4; star.x = Math.random() * width; }
          if (star.x < -4) star.x = width + 4;
          if (star.x > width + 4) star.x = -4;
        }
        const twinkle = still ? 1 : 0.55 + 0.45 * Math.sin((now / 1000) * star.speed + star.phase);
        ctx.fillStyle = `rgba(${star.color},${(star.base * twinkle).toFixed(3)})`;
        if (star.r > 1.55) {
          glint(star.x, star.y, star.r * 2.6);
        } else {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (shooting) {
        const p = (now - shooting.start) / shooting.life;
        if (p >= 1) {
          shooting = null;
        } else {
          const head = { x: shooting.x + shooting.dx * p, y: shooting.y + shooting.dy * p };
          const tail = { x: head.x - shooting.dx * 0.18, y: head.y - shooting.dy * 0.18 };
          const fade = Math.sin(p * Math.PI);
          const trail = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
          trail.addColorStop(0, `rgba(${palette[1]},0)`);
          trail.addColorStop(1, `rgba(${palette[1]},${(0.9 * fade).toFixed(3)})`);
          ctx.strokeStyle = trail;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(tail.x, tail.y);
          ctx.lineTo(head.x, head.y);
          ctx.stroke();
        }
      }
    }

    function tick(now) {
      frame = 0;
      if (!visible || document.hidden) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;

      nextShooting -= dt * 1000;
      if (!shooting && nextShooting <= 0) {
        const fromLeft = Math.random() < 0.5;
        shooting = {
          x: fromLeft ? Math.random() * width * 0.4 : width * (0.6 + Math.random() * 0.4),
          y: Math.random() * height * 0.35,
          dx: (fromLeft ? 1 : -1) * width * 0.35,
          dy: height * 0.35,
          start: now,
          life: 900,
        };
        nextShooting = 6000 + Math.random() * 7000;
      }

      draw(now, dt);
      frame = requestAnimationFrame(tick);
    }

    const start = () => {
      if (still || frame || !visible || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    resize();
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        start();
      }).observe(canvas);
    } else {
      visible = true;
      start();
    }
    document.addEventListener('visibilitychange', start);
  });
}

/** Splits the home page headline into letters that rise in one after another. */
function initHeadline() {
  const heading = $('.hero .h1');
  if (!heading || reducedMotion()) return;

  // Screen readers get the sentence once, not letter by letter.
  heading.setAttribute('aria-label', heading.textContent.replace(/\s+/g, ' ').trim());

  let i = 0;
  $$('.h1__line, .h1__script', heading).forEach((line) => {
    const words = line.textContent.trim().split(/\s+/);
    line.replaceChildren(
      ...words.flatMap((word, w) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        wordSpan.setAttribute('aria-hidden', 'true');
        for (const letter of word) {
          const char = document.createElement('span');
          char.className = 'char';
          char.style.setProperty('--i', String(i++));
          char.textContent = letter;
          wordSpan.append(char);
        }
        return w < words.length - 1 ? [wordSpan, document.createTextNode(' ')] : [wordSpan];
      })
    );
  });
}

/** Sections and cards fade up as they scroll into view. */
function initReveal() {
  if (reducedMotion() || !('IntersectionObserver' in window)) return;

  const targets = $$('.section__head, .cards > li, .cta-band__panel, .steps > li, .promises > li, .about__inner > *');
  if (targets.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px' });

  targets.forEach((target) => {
    // Cards in a row follow each other by a beat.
    const index = Array.prototype.indexOf.call(target.parentElement.children, target);
    target.style.setProperty('--reveal-delay', Math.min(index, 5) * 90 + 'ms');
    target.classList.add('reveal');
    observer.observe(target);
  });
}

/** The 1–9 strip becomes an endless, slowly moving ribbon. */
function initMarquee() {
  const strip = $('.numbers');
  const list = strip && $('.numbers__list', strip);
  if (!list || reducedMotion()) return;

  const copy = list.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  const track = document.createElement('div');
  track.className = 'numbers__track';
  list.replaceWith(track);
  track.append(list, copy);
  strip.classList.add('numbers--marquee');
}

/* Golden glitter flight in the hero: a glowing head sweeps along a looping
   path and sheds gold dust that drifts, twinkles and fades, with soft
   out-of-focus bokeh among it. Pauses off screen; still for reduced motion. */

// Deep to light golds as "r,g,b" — deep enough to read on the cream hero.
const GLITTER_GOLDS = ['176,122,20', '201,148,38', '212,167,44', '226,178,62', '240,196,92', '246,214,140'];

/** A soft round sprite per colour, drawn once and stamped for every glow and bokeh. */
function glitterSprite(rgb, size = 64) {
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = size;
  const g = sprite.getContext('2d');
  const gradient = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, `rgba(${rgb},1)`);
  gradient.addColorStop(0.35, `rgba(${rgb},0.55)`);
  gradient.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = gradient;
  g.fillRect(0, 0, size, size);
  return sprite;
}

function initGlitter() {
  $$('canvas.glitter').forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const still = reducedMotion();
    const sprites = GLITTER_GOLDS.map((rgb) => glitterSprite(rgb));
    let particles = [];
    let width = 0;
    let height = 0;
    let visible = false;
    let frame = 0;
    let last = 0;
    let clock = Math.random() * 20;
    let head = null;

    // The head's path: a slow, looping swoosh across the box.
    const pathAt = (t) => ({
      x: width * (0.5 + 0.38 * Math.sin(t * 0.7)),
      y: height * (0.5 + 0.26 * Math.sin(t * 1.4 + 0.7)),
    });

    const maxParticles = () => Math.round(Math.min(1700, (width * height) / 55));

    const emit = (x, y, vx, vy, count) => {
      for (let i = 0; i < count; i += 1) {
        const bokeh = Math.random() < 0.1;
        const angle = Math.random() * Math.PI * 2;
        const spread = Math.pow(Math.random(), 0.7) * 34;
        particles.push({
          x: x + Math.cos(angle) * spread,
          y: y + Math.sin(angle) * spread,
          // drift back along the trail, then scatter and settle
          vx: -vx * (0.05 + Math.random() * 0.15) + (Math.random() - 0.5) * 44,
          vy: -vy * (0.05 + Math.random() * 0.15) + (Math.random() - 0.5) * 44 + 6,
          r: bokeh ? 6 + Math.random() * 14 : 0.5 + Math.random() * 2.1,
          bokeh,
          color: Math.floor(Math.random() * sprites.length),
          age: 0,
          life: bokeh ? 2 + Math.random() * 3 : 1.8 + Math.random() * 3.6,
          phase: Math.random() * Math.PI * 2,
          twinkle: 6 + Math.random() * 10,
        });
      }
      const cap = maxParticles();
      if (particles.length > cap) particles.splice(0, particles.length - cap);
    };

    // A four-pointed glint, like the site's sparkle icon.
    const glint = (x, y, size) => {
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.quadraticCurveTo(x, y, x + size, y);
      ctx.quadraticCurveTo(x, y, x, y + size);
      ctx.quadraticCurveTo(x, y, x - size, y);
      ctx.quadraticCurveTo(x, y, x, y - size);
      ctx.fill();
    };

    const step = (dt) => {
      clock += dt;
      const next = pathAt(clock);
      if (head) {
        const vx = (next.x - head.x) / dt;
        const vy = (next.y - head.y) / dt;
        // Emit along the segment so a fast head still leaves an even trail.
        const count = Math.max(3, Math.round(dt * 480));
        for (let i = 0; i < count; i += 1) {
          const f = i / count;
          emit(head.x + (next.x - head.x) * f, head.y + (next.y - head.y) * f, vx, vy, 1);
        }
      }
      head = next;

      for (const p of particles) {
        p.age += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 1 - 1.2 * dt;
        p.vy = p.vy * (1 - 1.2 * dt) + 5 * dt; // a little gravity: the dust settles
      }
      particles = particles.filter((p) => p.age < p.life);
    };

    function draw(now) {
      ctx.clearRect(0, 0, width, height);
      const t = now / 1000;

      // Bokeh first, behind the glitter.
      for (const p of particles) {
        if (!p.bokeh) continue;
        const fade = Math.sin((p.age / p.life) * Math.PI);
        ctx.globalAlpha = 0.32 * fade;
        const size = p.r * 2;
        ctx.drawImage(sprites[p.color], p.x - size / 2, p.y - size / 2, size, size);
      }

      for (const p of particles) {
        if (p.bokeh) continue;
        const life = p.age / p.life;
        const fade = life < 0.1 ? life / 0.1 : 1 - (life - 0.1) / 0.9;
        const sparkle = still ? 1 : 0.45 + 0.55 * Math.abs(Math.sin(t * p.twinkle + p.phase));
        const alpha = Math.max(0, fade * sparkle);

        // soft halo, then the bright grain
        ctx.globalAlpha = alpha * 0.35;
        const halo = p.r * 5;
        ctx.drawImage(sprites[p.color], p.x - halo / 2, p.y - halo / 2, halo, halo);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${GLITTER_GOLDS[p.color]})`;
        if (p.r > 1.9 && sparkle > 0.8) {
          glint(p.x, p.y, p.r * 2.4);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // The glowing head of the flight.
      if (head) {
        ctx.globalAlpha = 0.5;
        ctx.drawImage(sprites[3], head.x - 45, head.y - 45, 90, 90);
        ctx.globalAlpha = 0.95;
        ctx.drawImage(sprites[5], head.x - 14, head.y - 14, 28, 28);
      }
      ctx.globalAlpha = 1;
    }

    function tick(now) {
      frame = 0;
      if (!visible || document.hidden) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      step(dt);
      draw(now);
      frame = requestAnimationFrame(tick);
    }

    const start = () => {
      if (still || frame || !visible || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = [];
      head = null;
      // Run the flight for a few seconds first, so the trail is already
      // there when the page opens (and is the still picture for reduced motion).
      for (let i = 0; i < 250; i += 1) step(1 / 50);
      draw(performance.now());
    };

    resize();
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        start();
      }).observe(canvas);
    } else {
      visible = true;
      start();
    }
    document.addEventListener('visibilitychange', start);
  });
}

/* ---------- Boot ---------- */

applyConfig();
initMenu();
initHeaderShadow();
initCalculator();
initBookingForm();
prefillBooking();
loadServices();
loadItemPage();
loadProducts();
loadPractitioners();
loadHomePractitioners();
loadTestimonials();
initYear();
initStarfields();
initGlitter();
initHeadline();
initMarquee();
initReveal();
