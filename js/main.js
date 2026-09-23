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

function serviceCard(service) {
  const item = document.createElement('li');
  item.className = 'card';

  const icon = document.createElement('span');
  icon.className = 'card__icon card__icon--' + (service.tile === 'gold' ? 'gold' : 'green');
  icon.innerHTML =
    '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    (SERVICE_ICONS[service.slug] || DEFAULT_SERVICE_ICON) + '</svg>';

  const title = document.createElement('h3');
  title.className = 'card__title';
  title.textContent = service.title;

  const text = document.createElement('p');
  text.className = 'card__text';
  text.textContent = service.description;

  item.append(icon, title, text);

  if (service.price || service.duration) {
    const meta = document.createElement('p');
    meta.className = 'card__meta';
    const price = document.createElement('span');
    price.className = 'card__price';
    price.textContent = service.price || '';
    const duration = document.createElement('span');
    duration.className = 'card__duration';
    duration.textContent = service.duration || '';
    meta.append(price, document.createTextNode(' '), duration);
    item.append(meta);
  }

  const link = document.createElement('a');
  link.className = 'card__link';
  link.href = bookingUrl(service.title);
  link.textContent = 'Book this service';
  item.append(link);

  return item;
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

      if (cards) cards.replaceChildren(...items.map(serviceCard));

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
  item.className = 'card';

  if (product.imageUrl) {
    const image = document.createElement('img');
    image.className = 'card__image';
    image.src = product.imageUrl;
    image.alt = product.name;
    image.loading = 'lazy';
    image.width = 400;
    image.height = 300;
    item.append(image);
  }

  const title = document.createElement('h3');
  title.className = 'card__title';
  title.textContent = product.name;

  const text = document.createElement('p');
  text.className = 'card__text';
  text.textContent = product.description;

  item.append(title, text);

  if (product.price) {
    const meta = document.createElement('p');
    meta.className = 'card__meta';
    const price = document.createElement('span');
    price.className = 'card__price';
    price.textContent = product.price;
    meta.append(price);
    item.append(meta);
  }

  const message =
    'Hello Lumora Magic, I’d like to order: ' + product.name +
    (product.price ? ' (' + product.price + ')' : '') + '.';

  const link = document.createElement('a');
  link.className = 'card__link';
  link.href = whatsappLink() + '?text=' + encodeURIComponent(message);
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'Order on WhatsApp';
  item.append(link);

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

/* ---------- Boot ---------- */

applyConfig();
initMenu();
initHeaderShadow();
initCalculator();
initBookingForm();
prefillBooking();
loadServices();
loadProducts();
initYear();
