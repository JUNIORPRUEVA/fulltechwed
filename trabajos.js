const escapePortfolioHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const createPortfolioWhatsAppUrl = (number, message) => {
  const cleanNumber = String(number || '').replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message || '');
  return `https://wa.me/${cleanNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};

const setPortfolioText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value !== undefined) element.textContent = value;
};

const DEFAULT_WORKS_PAGE = {
  eyebrow: 'Trabajos realizados',
  title: 'Instalaciones, proyectos y resultados que ya hemos entregado',
  intro:
    'Conoce fotos y videos de instalaciones reales realizadas por FULLTECH SRL en hogares, negocios, villas y proyectos de la zona Este.',
  linkText: 'Ver trabajos realizados',
  backHomeText: 'Volver al inicio',
  emptyMessage: 'Pronto compartiremos nuevas instalaciones realizadas por nuestro equipo.'
};

const DEFAULT_CONTACT = {
	whatsapp: '8295344286',
	email: 'fulltechsd@gmail.com'
};

const normalizeWorksPage = (worksPage) => ({
  ...DEFAULT_WORKS_PAGE,
  ...(worksPage || {}),
  eyebrow: 'Trabajos realizados',
  title: 'Instalaciones, proyectos y resultados que ya hemos entregado',
  intro:
    'Conoce fotos y videos de instalaciones reales realizadas por FULLTECH SRL en hogares, negocios, villas y proyectos de la zona Este.',
  emptyMessage: 'Pronto compartiremos nuevas instalaciones realizadas por nuestro equipo.'
});

const renderPortfolioGallery = async (gallery, contentManager) => {
  const grid = document.getElementById('portfolio-grid');
  const empty = document.getElementById('portfolio-empty');
  if (!grid || !empty) return;

  if (!Array.isArray(gallery) || !gallery.length) {
    grid.innerHTML = '';
    empty.hidden = false;
    return;
  }

  const cards = await Promise.all(
    gallery.map(async (item) => {
      const source = await contentManager.resolveMediaUrl(item.src);
      const media =
        item.type === 'video'
          ? `<video src="${escapePortfolioHtml(source)}" controls playsinline preload="metadata"></video>`
          : `<img src="${escapePortfolioHtml(source)}" alt="${escapePortfolioHtml(item.alt)}" loading="lazy" decoding="async" width="960" height="720" />`;

      return `
        <article class="portfolio-card" role="listitem">
          <div class="portfolio-media-wrap">
            ${media}
          </div>
          <div class="portfolio-card-body">
            <p>${escapePortfolioHtml(item.eyebrow || 'Trabajo realizado')}</p>
            <h3>${escapePortfolioHtml(item.title || 'Instalacion realizada')}</h3>
            <span>${escapePortfolioHtml(item.alt || 'Proyecto realizado por FULLTECH SRL.')}</span>
          </div>
        </article>
      `;
    })
  );

  grid.innerHTML = cards.join('');
  empty.hidden = true;
};

const renderPortfolioPage = async () => {
  const contentManager = window.FulltechContentManager;
  if (!contentManager) return;

  const config = await contentManager.loadConfig();
  const worksPage = normalizeWorksPage(config.worksPage);
  const whatsappUrl = createPortfolioWhatsAppUrl(
    DEFAULT_CONTACT.whatsapp,
    'Hola FULLTECH SRL, quiero informacion sobre sus trabajos realizados y una cotizacion.'
  );

  setPortfolioText('#portfolio-brand-name', config.brand?.shortName || 'FULLTECH');
  setPortfolioText('#portfolio-brand-subtitle', worksPage.eyebrow);
  setPortfolioText('#portfolio-eyebrow', worksPage.eyebrow);
  setPortfolioText('#portfolio-title', worksPage.title);
  setPortfolioText('#portfolio-lead', worksPage.intro);
  setPortfolioText('#portfolio-back-home', worksPage.backHomeText);
  setPortfolioText('#portfolio-section-eyebrow', 'Nuestra galeria');
  setPortfolioText('#portfolio-section-title', worksPage.title);
  setPortfolioText('#portfolio-section-intro', worksPage.intro);
  setPortfolioText('#portfolio-wa-label', config.navigation?.floatingWhatsappText || 'WhatsApp');
  setPortfolioText('#portfolio-count', String(Array.isArray(config.gallery) ? config.gallery.length : 0));
  setPortfolioText('#portfolio-count-label', 'Instalaciones mostradas');
  setPortfolioText(
    '#portfolio-summary-copy',
    'Cada imagen y video corresponde a trabajos reales realizados por FULLTECH SRL.'
  );

  const empty = document.getElementById('portfolio-empty');
  if (empty) empty.textContent = worksPage.emptyMessage;

  document.querySelectorAll('#portfolio-whatsapp-top, #portfolio-whatsapp-main, #portfolio-wa-float').forEach((link) => {
    link.href = whatsappUrl;
  });

  document.querySelectorAll('.brand-logo').forEach(async (logo) => {
    logo.src = await contentManager.resolveMediaUrl(config.brand?.logo || 'assets/logo-fulltech.png');
    logo.alt = `Logo ${config.brand?.fullName || 'FULLTECH SRL'}`;
  });

  await renderPortfolioGallery(config.gallery || [], contentManager);
};

renderPortfolioPage().catch((error) => {
  console.error('No se pudo renderizar la pagina de trabajos', error);
});
