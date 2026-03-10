const CURRENT_YEAR = new Date().getFullYear();
const LEGACY_COVERAGE_MAP_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=-69.660%2C18.150%2C-68.000%2C18.950&layer=mapnik';
const DEFAULT_COVERAGE_MAP_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=-69.500%2C18.200%2C-68.000%2C19.150&layer=mapnik';
const COVERAGE_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const COVERAGE_TILE_ATTRIBUTION = '&copy; OpenStreetMap contributors';

const coverageMapState = {
  map: null,
  markerLayer: null,
  tileLayer: null
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value !== undefined) element.textContent = value;
};

const setManyText = (selector, value) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
};

const createWhatsAppUrl = (number, message) => {
  const cleanNumber = String(number || '').replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message || '');
  return `https://wa.me/${cleanNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};

const createPhoneUrl = (phone) => `tel:${String(phone || '').replace(/\s+/g, '')}`;
const createMailUrl = (email) => `mailto:${email || ''}`;
const normalizePolicyText = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const POLICY_PAGE_PATH = 'politica.html';
const POLICY_SLUGS = {
  garantia: 'garantia-instalacion',
  'garantia de instalacion': 'garantia-instalacion',
  reembolso: 'reembolso',
  'politica de reembolso': 'reembolso',
  'soporte tecnico': 'soporte-tecnico',
  soporte: 'soporte-tecnico',
  'condiciones de servicio': 'condiciones-servicio'
};

const getPolicySlug = (title) => {
  const normalized = normalizePolicyText(title);
  if (POLICY_SLUGS[normalized]) return POLICY_SLUGS[normalized];

  return normalized.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'politica';
};

const createPolicyHref = (title) => `${POLICY_PAGE_PATH}?policy=${encodeURIComponent(getPolicySlug(title))}`;

const SERVICE_DETAILS = {
  'sistemas de camaras': {
    points: [
      'Visualizacion en tiempo real desde celular, tablet o computadora.',
      'Grabacion continua con acceso remoto para revisar eventos rapidamente.',
      'Ideal para casas, negocios, villas, oficinas y proyectos turisticos.'
    ]
  },
  'cerco electrico': {
    points: [
      'Refuerza el perimetro y disuade intrusos antes de que entren.',
      'Se adapta a residencias, solares, naves y almacenes.',
      'Instalacion limpia con revision y mantenimiento programado.'
    ]
  },
  intercomunicadores: {
    points: [
      'Permite validar visitas antes de abrir puertas o portones.',
      'Mejora el control de acceso en residenciales, torres y oficinas.',
      'Puede integrarse con video, audio y automatizacion de acceso.'
    ]
  },
  'alarmas de seguridad': {
    points: [
      'Detectan aperturas, movimiento y eventos sospechosos con respuesta inmediata.',
      'Aumentan la proteccion de hogares, negocios y espacios cerrados.',
      'Configuracion pensada para uso simple y confiable todos los dias.'
    ]
  },
  'motores de portones': {
    points: [
      'Automatizan la entrada con mas comodidad, control y seguridad.',
      'Aptos para accesos residenciales y comerciales de uso frecuente.',
      'Instalacion y ajuste para apertura estable y funcionamiento suave.'
    ]
  },
  'mantenimiento tecnico': {
    points: [
      'Revision preventiva y correctiva para evitar fallas inesperadas.',
      'Ajustes, limpieza, configuracion y diagnostico profesional.',
      'Servicio coordinado por agenda para atender cada caso con orden.'
    ]
  }
};

const serviceSheetState = {
  services: [],
  isOpen: false
};

const DEFAULT_NAVIGATION = {
  desktopGalleryLabel: 'Ver trabajos realizados',
  desktopCoverageLabel: 'Cobertura',
  desktopServicesLabel: 'Servicios',
  desktopPoliciesLabel: 'Politicas',
  desktopContactLabel: 'Contacto',
  desktopCtaText: 'Cotizar ahora',
  drawerGalleryLabel: 'Ver trabajos realizados',
  drawerCoverageLabel: 'Mapa de cobertura',
  drawerServicesLabel: 'Ver productos y servicios',
  drawerProcessLabel: 'Como trabajamos',
  drawerPoliciesLabel: 'Garantia y reembolso',
  drawerContactLabel: 'Hablar con un asesor',
  drawerPrimaryCtaText: 'WhatsApp directo',
  drawerSecondaryCtaText: 'Llamar ahora',
  floatingWhatsappText: 'WhatsApp'
};

const DEFAULT_METRICS = [
  { value: '+5 anos', label: 'Instalando camaras y sistemas de seguridad con experiencia local' },
  { value: '9 a 6', label: 'Atencion por WhatsApp para cotizaciones de lunes a domingo' },
  { value: 'Soluciones completas', label: 'Camaras, alarmas, acceso, cercos y automatizacion en un solo equipo' }
];

const DEFAULT_HERO = {
  eyebrow: 'Seguridad profesional para hogares, villas y negocios',
  title: 'Seguridad confiable para proteger lo que mas valoras',
  lead:
    'Instalamos camaras, alarmas, cercos electricos, intercomunicadores y motores con atencion rapida y cobertura en la zona Este de Republica Dominicana.',
  primaryCtaText: 'Solicitar cotizacion',
  primaryCtaHref: 'https://wa.me/8295344286?text=Hola%20FULLTECH%20SRL%2C%20quiero%20una%20cotizaci%C3%B3n.',
  secondaryCtaText: 'Ver servicios',
  secondaryCtaHref: '#servicios'
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

const DEFAULT_COVERAGE_INTRO =
  'Instalaciones: Higuey, Bavaro, Punta Cana, La Romana, Miches y zonas cercanas. Mantenimiento y visita tecnica de preinstalacion: Higuey, Otra Banda y zonas cercanas. Todo servicio se coordina por agenda previa.';

const DEFAULT_COVERAGE_PROVINCES = [
  { name: 'Instalaciones: Higuey, Bavaro, Punta Cana, La Romana, Miches y zonas cercanas.' },
  { name: 'Mantenimiento y visita tecnica de preinstalacion: Higuey, Otra Banda y zonas cercanas.' }
];

const parseMapBounds = (mapUrl) => {
  try {
    const url = new URL(mapUrl, window.location.href);
    const bbox = url.searchParams.get('bbox');
    if (!bbox) return null;

    const [west, south, east, north] = bbox.split(',').map(Number);
    if ([west, south, east, north].some((value) => Number.isNaN(value))) return null;
    if (east === west || north === south) return null;

    return { west, south, east, north };
  } catch (error) {
    return null;
  }
};

const getCoverageMapUrl = (mapUrl) =>
  mapUrl === LEGACY_COVERAGE_MAP_URL ? DEFAULT_COVERAGE_MAP_URL : mapUrl || DEFAULT_COVERAGE_MAP_URL;

const getCoverageBounds = (mapUrl, locations) => {
  const bbox = parseMapBounds(mapUrl);
  if (bbox) {
    return [
      [bbox.south, bbox.west],
      [bbox.north, bbox.east]
    ];
  }

  return locations
    .map((location) => [Number(location?.lat), Number(location?.lng)])
    .filter(([lat, lng]) => !Number.isNaN(lat) && !Number.isNaN(lng));
};

const createCoverageIcon = (location) => {
  const labelOffsetX = Number(location?.offsetX) || 0;
  const labelOffsetY = Number(location?.offsetY) || 0;

  return window.L.divIcon({
    className: 'coverage-marker-icon',
    html: `
      <span class="coverage-marker-dot" aria-hidden="true"></span>
      <span class="coverage-marker-label" style="--label-offset-x: ${labelOffsetX}px; --label-offset-y: ${labelOffsetY}px;">${escapeHtml(location.name)}</span>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

const ensureCoverageMap = (mapElement, mapTag) => {
  if (!mapElement || !window.L) return null;

  mapElement.setAttribute('aria-label', mapTag || 'Mapa de cobertura');

  if (!coverageMapState.map) {
    const map = window.L.map(mapElement, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true
    });

    const tileLayer = window.L.tileLayer(COVERAGE_TILE_URL, {
      attribution: COVERAGE_TILE_ATTRIBUTION,
      maxZoom: 18
    }).addTo(map);

    coverageMapState.map = map;
    coverageMapState.tileLayer = tileLayer;
    coverageMapState.markerLayer = window.L.layerGroup().addTo(map);
  }

  window.setTimeout(() => {
    coverageMapState.map?.invalidateSize();
  }, 0);

  return coverageMapState;
};

const setCoverageFallbackState = (mapUrl, mapTag, showFallback) => {
  const mapElement = document.getElementById('coverage-map');
  const fallbackElement = document.getElementById('coverage-map-fallback');

  if (mapElement) mapElement.hidden = showFallback;
  if (fallbackElement) {
    fallbackElement.hidden = !showFallback;
    fallbackElement.src = mapUrl;
    fallbackElement.title = mapTag || 'Mapa de cobertura';
  }
};

const removeSanPedroText = (value) =>
  String(value || '')
    .replace(/,?\s*San Pedro de Macor[ií]s/gi, '')
    .replace(/San Pedro de Macor[ií]s,?\s*/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+,/g, ',')
    .trim();

const ensureAgendaMessage = (value) => {
  const text = String(value || '').trim();
  if (!text) return 'Trabajamos por agenda y coordinacion previa.';
  if (/trabajamos por agenda|coordinacion previa/i.test(text)) return text;
  return `${text} Trabajamos por agenda y coordinacion previa.`;
};

const ensureCoverageClarification = (value) => {
  const text = String(value || '').trim();
  if (!text) return DEFAULT_COVERAGE_INTRO;
  if (/Instalaciones:|Mantenimiento y visita tecnica de preinstalacion:/i.test(text)) return text;
  return DEFAULT_COVERAGE_INTRO;
};

const normalizeCoverage = (coverage) => {
  const normalized = { ...(coverage || {}) };

  normalized.title = 'Cobertura por tipo de servicio';
  normalized.intro = ensureCoverageClarification(removeSanPedroText(normalized.intro));
  normalized.mapTag = 'Mapa de instalaciones FULLTECH SRL';
  normalized.locations = Array.isArray(normalized.locations)
    ? normalized.locations.filter((location) => !/san pedro/i.test(String(location?.name || '')))
    : [];
  normalized.provinces = DEFAULT_COVERAGE_PROVINCES;

  return normalized;
};

const normalizeContact = (contact) => {
  const normalized = { ...(contact || {}) };

  normalized.eyebrow = 'Habla con nosotros';
  normalized.title = 'Solicita tu cotizacion y recibe orientacion personalizada';
  normalized.intro = ensureCoverageClarification(normalized.intro);
  normalized.whatsapp = '8295344286';
  normalized.phone = '809 690 6440';
  normalized.email = 'fulltechsd@gmail.com';
  normalized.location = removeSanPedroText(normalized.location);

  return normalized;
};

const normalizeBrands = (brands) => {
  const normalized = { ...(brands || {}) };
  normalized.items = Array.isArray(normalized.items) ? normalized.items : [];
  normalized.intro = 'Marcas con las que trabajamos';
  normalized.title = 'Equipos confiables para una proteccion segura y duradera';
  return normalized;
};

const normalizeHero = (hero) => ({
  ...DEFAULT_HERO,
  ...(hero || {}),
  eyebrow: DEFAULT_HERO.eyebrow,
  title: DEFAULT_HERO.title,
  lead: DEFAULT_HERO.lead,
  primaryCtaHref: DEFAULT_HERO.primaryCtaHref
});

const normalizeServicesSection = (section) => ({
  ...(section || {}),
  eyebrow: 'Soluciones de seguridad',
  title: 'Servicios para proteger hogares, negocios y proyectos',
  intro:
    'Te ayudamos a elegir e instalar la solucion ideal para vigilar, controlar accesos y reforzar la seguridad de tu propiedad.'
});

const normalizeTrust = (trust) => ({
  ...(trust || {}),
  eyebrow: 'Por que elegir FULLTECH',
  title: 'Atencion clara, respaldo local y soluciones confiables',
  quoteText: '"Protegemos lo que mas valoras con orientacion clara, instalacion profesional y atencion confiable."'
});

const normalizeProcess = (process) => ({
  ...(process || {}),
  eyebrow: 'Como trabajamos',
  title: 'Te acompanamos desde la orientacion hasta la instalacion'
});

const normalizePolicies = (policies, footer) => {
  const normalized = {
    ...(policies || {}),
    eyebrow: policies?.eyebrow || 'Politicas claras',
    title: policies?.title || 'Garantia, reembolso y condiciones explicadas de forma profesional'
  };

  const items = Array.isArray(normalized.items) ? [...normalized.items] : [];
  const hasTerms = items.some((item) => getPolicySlug(item?.title) === 'condiciones-servicio');

  if (!hasTerms) {
    items.push({
      title: footer?.policyTermsLabel || 'Condiciones de servicio',
      description: 'Consulta el alcance del servicio, coordinacion, tiempos y condiciones generales antes de contratar.'
    });
  }

  normalized.items = items;
  return normalized;
};

const normalizeFooter = (footer) => ({
  ...(footer || {}),
  description:
    'Instalacion y mantenimiento de soluciones de seguridad para hogares, negocios, villas y proyectos empresariales.',
  legal: 'FULLTECH SRL | Garantia, soporte, mantenimiento y atencion profesional.'
});

const normalizeNavigation = (navigation) => ({
  ...DEFAULT_NAVIGATION,
  ...(navigation || {})
});

const normalizeWorksPage = (worksPage) => ({
  ...DEFAULT_WORKS_PAGE,
  ...(worksPage || {}),
  eyebrow: 'Trabajos realizados',
  title: 'Instalaciones, proyectos y resultados que ya hemos entregado',
  intro:
    'Conoce fotos y videos de instalaciones reales realizadas por FULLTECH SRL en hogares, negocios, villas y proyectos de la zona Este.',
  emptyMessage: 'Pronto compartiremos nuevas instalaciones realizadas por nuestro equipo.'
});

const normalizeMetrics = (metrics) => {
  const items = Array.isArray(metrics) ? metrics.filter(Boolean) : [];
  if (!items.length) return DEFAULT_METRICS;

  return items.map((metric, index) => {
    const fallback = DEFAULT_METRICS[index] || DEFAULT_METRICS[DEFAULT_METRICS.length - 1];
    const value = String(metric?.value || '').trim();
    const label = String(metric?.label || '').trim();

    if (
      /\+?8\s*anos/i.test(value) ||
      /24\/?7/i.test(value) ||
      /5\s*servicios/i.test(value) ||
      /instalando soluciones de seguridad en la zona este/i.test(label) ||
      /atencion por whatsapp para cotizacion y soporte/i.test(label) ||
      /lineas clave de instalacion, automatizacion y control/i.test(label)
    ) {
      return fallback;
    }

    return {
      value: value || fallback.value,
      label: label || fallback.label
    };
  });
};

const normalizeServiceKey = (title) => String(title || '').trim().toLowerCase();

const getServiceDetails = (service) => {
  const details = SERVICE_DETAILS[normalizeServiceKey(service?.title)] || {};
  return {
    points: Array.isArray(details.points) ? details.points : [],
    brands: 'Hikvision, HiLook, Dahua, D-World y ZKTeco.',
    schedule: 'Instalacion y visitas coordinadas por agenda previa.',
    highlight: service?.badge || 'Solucion recomendada para proteger y dar mas tranquilidad a tu propiedad.'
  };
};

const renderMetrics = (metrics) => {
  const metricsList = document.getElementById('metrics-list');
  if (!metricsList) return;

  metricsList.innerHTML = metrics
    .map(
      (metric) => `
        <article class="metric" role="listitem">
          <strong>${escapeHtml(metric.value)}</strong>
          <span>${escapeHtml(metric.label)}</span>
        </article>
      `
    )
    .join('');
};

const renderNavigation = (navigation) => {
  const resolvedNavigation = normalizeNavigation(navigation);

  setText('#nav-link-gallery', resolvedNavigation.desktopGalleryLabel);
  setText('#nav-link-coverage', resolvedNavigation.desktopCoverageLabel);
  setText('#nav-link-services', resolvedNavigation.desktopServicesLabel);
  setText('#nav-link-policies', resolvedNavigation.desktopPoliciesLabel);
  setText('#nav-link-contact', resolvedNavigation.desktopContactLabel);
  setText('#nav-desktop-cta', resolvedNavigation.desktopCtaText);
  setText('#drawer-link-gallery', resolvedNavigation.drawerGalleryLabel);
  setText('#drawer-link-coverage', resolvedNavigation.drawerCoverageLabel);
  setText('#drawer-link-services', resolvedNavigation.drawerServicesLabel);
  setText('#drawer-link-process', resolvedNavigation.drawerProcessLabel);
  setText('#drawer-link-policies', resolvedNavigation.drawerPoliciesLabel);
  setText('#drawer-link-contact', resolvedNavigation.drawerContactLabel);
  setText('#drawer-primary-cta', resolvedNavigation.drawerPrimaryCtaText);
  setText('#drawer-secondary-cta', resolvedNavigation.drawerSecondaryCtaText);
  setText('#wa-float-label', resolvedNavigation.floatingWhatsappText);
};

const renderWorksPageLink = (worksPage) => {
  const resolvedWorksPage = normalizeWorksPage(worksPage);
  setText('#gallery-page-link', resolvedWorksPage.linkText);
};

const renderCoverage = (coverage) => {
  const mapUrl = getCoverageMapUrl(coverage.mapUrl);
  const locations = Array.isArray(coverage.locations) ? coverage.locations : [];

  setText('#coverage-eyebrow', coverage.eyebrow);
  setText('#coverage-title', coverage.title);
  setText('#coverage-intro', coverage.intro);
  setText('#coverage-map-tag', coverage.mapTag);

  const mapElement = document.getElementById('coverage-map');
  const mapState = ensureCoverageMap(mapElement, coverage.mapTag);
  if (mapState) {
    setCoverageFallbackState(mapUrl, coverage.mapTag, false);
    mapState.markerLayer.clearLayers();

    locations.forEach((location) => {
      const lat = Number(location?.lat);
      const lng = Number(location?.lng);
      if (Number.isNaN(lat) || Number.isNaN(lng)) return;

      window.L.marker([lat, lng], {
        icon: createCoverageIcon(location),
        title: location.name,
        keyboard: false
      }).addTo(mapState.markerLayer);
    });

    const bounds = getCoverageBounds(mapUrl, locations);
    if (bounds.length) {
      mapState.map.fitBounds(bounds, {
        padding: [28, 28]
      });
    }
  } else {
    setCoverageFallbackState(mapUrl, coverage.mapTag, true);
  }

  const list = document.getElementById('coverage-list');
  if (!list) return;

  list.innerHTML = coverage.provinces
    .map(
      (province) => `
        <article class="coverage-item" role="listitem">
          <strong>${escapeHtml(province.name)}</strong>
        </article>
      `
    )
    .join('');
};

const renderBrands = (brands) => {
  setText('#brands-intro', brands.intro);

  const list = document.getElementById('brands-list');
  if (!list) return;

  const items = Array.isArray(brands.items) ? brands.items : [];
  const repeatedItems = [...items, ...items];

  list.innerHTML = `
    <div class="brands-track">
      ${repeatedItems
        .map(
          (brand, index) => `
            <article class="brand-card" role="listitem" ${index >= items.length ? 'aria-hidden="true"' : ''}>
              <span class="brand-card-name">${escapeHtml(brand.name)}</span>
            </article>
          `
        )
        .join('')}
    </div>
  `;
};

const renderTrust = (trust) => {
  setText('#trust-eyebrow', trust.eyebrow);
  setText('#trust-title', trust.title);
  setText('#quote-text', trust.quoteText);
  setText('#quote-author', trust.quoteAuthor);
  setText('#quote-role', trust.quoteRole);

  const trustPoints = document.getElementById('trust-points');
  if (!trustPoints) return;

  trustPoints.innerHTML = trust.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('');
};

const renderProcess = (process) => {
  setText('#process-eyebrow', process.eyebrow);
  setText('#process-title', process.title);

  const steps = document.getElementById('process-steps');
  if (!steps) return;

  steps.innerHTML = process.steps
    .map(
      (step, index) => `
        <div class="step" role="listitem"><span>${index + 1}</span>${escapeHtml(step)}</div>
      `
    )
    .join('');
};

const renderPolicies = (policies) => {
  setText('#policies-eyebrow', policies.eyebrow);
  setText('#policies-title', policies.title);

  const list = document.getElementById('policies-list');
  if (!list) return;

  list.innerHTML = policies.items
    .map(
      (item) => `
        <a class="policy-card-link" href="${escapeHtml(createPolicyHref(item.title))}" aria-label="Ver politica completa: ${escapeHtml(item.title)}">
          <article class="policy-card">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
            <span class="policy-card-cta">Leer politica completa</span>
          </article>
        </a>
      `
    )
    .join('');
};

const renderSlider = async (gallery) => {
  const sliderTrack = document.getElementById('slider-track');
  if (!sliderTrack) return;

  const slidesMarkup = await Promise.all(
    gallery.map(async (item, index) => {
      const source = await window.FulltechContentManager.resolveMediaUrl(item.src);
      const media =
        item.type === 'video'
          ? `<video src="${escapeHtml(source)}" autoplay muted loop playsinline controls preload="metadata"></video>`
          : `<img src="${escapeHtml(source)}" alt="${escapeHtml(item.alt)}" width="1400" height="900" ${
              index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'
            } />`;

      return `
        <article class="slide${index === 0 ? ' is-active' : ''}" data-slide>
          ${media}
          <div class="slide-copy">
            <p>${escapeHtml(item.eyebrow)}</p>
            <h2>${escapeHtml(item.title)}</h2>
          </div>
        </article>
      `;
    })
  );

  sliderTrack.innerHTML = slidesMarkup.join('');
};

const renderServices = async (section, services) => {
  setText('#services-eyebrow', section.eyebrow);
  setText('#services-title', section.title);
  setText('#services-intro', section.intro);

  const list = document.getElementById('services-list');
  if (!list) return;

  serviceSheetState.services = services;

  const cards = await Promise.all(
    services.map(async (service, index) => {
      const image = await window.FulltechContentManager.resolveMediaUrl(service.image);
      return `
        <article class="card feature-card service-card" role="listitem">
          <button class="service-card-button" type="button" data-service-index="${index}" aria-label="Ver detalles de ${escapeHtml(service.title)}">
            <img src="${escapeHtml(image)}" alt="${escapeHtml(service.alt)}" loading="lazy" decoding="async" width="960" height="600" />
            <div class="card-body service-card-body">
              <h3>${escapeHtml(service.title)}</h3>
              <span>${escapeHtml(service.badge)}</span>
              <strong class="service-card-link">Ver producto</strong>
            </div>
          </button>
        </article>
      `;
    })
  );

  list.innerHTML = cards.join('');
};

const openServiceSheet = async (service, contact) => {
  const sheet = document.getElementById('service-sheet');
  if (!sheet || !service) return;

  const details = getServiceDetails(service);
  const image = await window.FulltechContentManager.resolveMediaUrl(service.image);
  const imageElement = document.getElementById('service-sheet-image');
  const titleElement = document.getElementById('service-sheet-title');
  const descriptionElement = document.getElementById('service-sheet-description');
  const highlightElement = document.getElementById('service-sheet-highlight');
  const pointsElement = document.getElementById('service-sheet-points');
  const brandsElement = document.getElementById('service-sheet-brands');
  const scheduleElement = document.getElementById('service-sheet-schedule');
  const whatsappElement = document.getElementById('service-sheet-whatsapp');
  const phoneElement = document.getElementById('service-sheet-phone');

  if (imageElement) {
    imageElement.src = image;
    imageElement.alt = service.alt || service.title;
  }

  if (titleElement) titleElement.textContent = service.title;
  if (descriptionElement) descriptionElement.textContent = service.description;
  if (highlightElement) highlightElement.textContent = details.highlight;
  if (pointsElement) {
    pointsElement.innerHTML = details.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('');
  }
  if (brandsElement) brandsElement.textContent = details.brands;
  if (scheduleElement) scheduleElement.textContent = details.schedule;

  if (whatsappElement) {
    whatsappElement.href = createWhatsAppUrl(
      contact?.whatsapp,
      `Hola FULLTECH SRL, quiero informacion y cotizacion sobre ${service.title}.`
    );
  }
  if (phoneElement) phoneElement.href = createPhoneUrl(contact?.phone);

  sheet.hidden = false;
  sheet.setAttribute('aria-hidden', 'false');
  document.body.classList.add('service-sheet-open');
  serviceSheetState.isOpen = true;
};

const closeServiceSheet = () => {
  const sheet = document.getElementById('service-sheet');
  if (!sheet) return;

  sheet.hidden = true;
  sheet.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('service-sheet-open');
  serviceSheetState.isOpen = false;
};

const setupServiceSheet = (contact) => {
	closeServiceSheet();

  document.querySelectorAll('[data-service-index]').forEach((button) => {
    button.addEventListener('click', async () => {
      const index = Number(button.getAttribute('data-service-index'));
      const service = serviceSheetState.services[index];
      await openServiceSheet(service, contact);
    });
  });

  document.querySelectorAll('[data-service-sheet-close]').forEach((element) => {
    element.addEventListener('click', closeServiceSheet);
  });

  document.getElementById('service-sheet-close')?.addEventListener('click', closeServiceSheet);
};

const renderBrand = async (brand) => {
  const logoUrl = await window.FulltechContentManager.resolveMediaUrl(brand.logo);

  document.querySelectorAll('.brand-logo').forEach((logo) => {
    logo.src = logoUrl;
    logo.alt = `Logo ${brand.fullName}`;
  });

  setManyText('[data-brand-name]', brand.shortName);
  setText('[data-brand-full-name]', brand.fullName);
  setText('[data-brand-mobile-subtitle]', brand.mobileSubtitle);
  setText('[data-brand-drawer-subtitle]', brand.drawerSubtitle);
  setText('[data-brand-footer-subtitle]', brand.footerSubtitle);
};

const renderContact = (contact) => {
  const whatsappUrl = createWhatsAppUrl(contact.whatsapp, contact.whatsappText);
  const phoneUrl = createPhoneUrl(contact.phone);
  const emailUrl = createMailUrl(contact.email);

  setText('#contact-eyebrow', contact.eyebrow);
  setText('#contact-title', contact.title);
  setText('#contact-intro', contact.intro);
  setText('#footer-location', contact.location);
  setText('#contact-whatsapp', contact.whatsappLabel);
  setText('#contact-phone', contact.phoneLabel);
  setText('#contact-email', contact.emailLabel);

  document.querySelectorAll('[data-whatsapp-link]').forEach((link) => {
    link.href = whatsappUrl;
  });

  document.querySelectorAll('[data-phone-link]').forEach((link) => {
    link.href = phoneUrl;
  });

  const contactWhatsApp = document.getElementById('contact-whatsapp');
  const contactPhone = document.getElementById('contact-phone');
  const contactEmail = document.getElementById('contact-email');
  const footerPhone = document.getElementById('footer-phone');
  const footerWhatsApp = document.getElementById('footer-whatsapp');
  const footerEmail = document.getElementById('footer-email');
  const waFloatLink = document.getElementById('wa-float-link');

  if (contactWhatsApp) contactWhatsApp.href = whatsappUrl;
  if (contactPhone) contactPhone.href = phoneUrl;
  if (contactEmail) contactEmail.href = emailUrl;
  if (footerPhone) {
    footerPhone.href = phoneUrl;
    footerPhone.textContent = contact.phone;
  }
  if (footerWhatsApp) footerWhatsApp.href = whatsappUrl;
  if (footerEmail) {
    footerEmail.href = emailUrl;
    footerEmail.textContent = contact.email;
  }
  if (waFloatLink) waFloatLink.href = whatsappUrl;
};

const renderFooter = (footer) => {
  setText('#footer-links-heading', footer.linksHeading);
  setText('#footer-link-gallery', footer.linksGalleryLabel);
  setText('#footer-link-coverage', footer.linksCoverageLabel);
  setText('#footer-link-services', footer.linksServicesLabel);
  setText('#footer-link-contact', footer.linksContactLabel);
  setText('#footer-policies-heading', footer.policiesHeading);
  setText('#footer-policy-warranty', footer.policyWarrantyLabel);
  setText('#footer-policy-refund', footer.policyRefundLabel);
  setText('#footer-policy-support', footer.policySupportLabel);
  setText('#footer-policy-terms', footer.policyTermsLabel);
  setText('#footer-admin-link', footer.adminLinkLabel);
  setText('#footer-contact-heading', footer.contactHeading);
  setText('#footer-whatsapp', footer.whatsappLabel);
  setText('#footer-description', footer.description);
  setText('#footer-legal', footer.legal);

  const footerPolicyWarranty = document.getElementById('footer-policy-warranty');
  const footerPolicyRefund = document.getElementById('footer-policy-refund');
  const footerPolicySupport = document.getElementById('footer-policy-support');
  const footerPolicyTerms = document.getElementById('footer-policy-terms');

  if (footerPolicyWarranty) footerPolicyWarranty.href = createPolicyHref(footer.policyWarrantyLabel);
  if (footerPolicyRefund) footerPolicyRefund.href = createPolicyHref(footer.policyRefundLabel);
  if (footerPolicySupport) footerPolicySupport.href = createPolicyHref(footer.policySupportLabel);
  if (footerPolicyTerms) footerPolicyTerms.href = createPolicyHref(footer.policyTermsLabel);
};

const setupDrawer = () => {
  const body = document.body;
  const drawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');
  const menuToggle = document.querySelector('.menu-toggle');
  const drawerClose = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-nav a');

  const setDrawerState = (isOpen) => {
    if (!drawer || !menuToggle || !drawerBackdrop) return;

    drawer.classList.toggle('is-open', isOpen);
    drawer.setAttribute('aria-hidden', String(!isOpen));
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    drawerBackdrop.hidden = !isOpen;
    body.classList.toggle('drawer-open', isOpen);
  };

  menuToggle?.addEventListener('click', () => {
    const shouldOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    setDrawerState(shouldOpen);
  });

  drawerClose?.addEventListener('click', () => setDrawerState(false));
  drawerBackdrop?.addEventListener('click', () => setDrawerState(false));

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => setDrawerState(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setDrawerState(false);
  });
};

const setupSlider = () => {
  const slides = Array.from(document.querySelectorAll('[data-slide]'));
  const sliderDots = document.querySelector('[data-slider-dots]');
  const prevButton = document.querySelector('[data-slider-prev]');
  const nextButton = document.querySelector('[data-slider-next]');
  let currentSlideIndex = 0;
  let autoplayId = 0;

  if (!sliderDots) return;
  sliderDots.innerHTML = '';

  const renderSlide = (index) => {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === index);
    });

    Array.from(sliderDots.children).forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === index);
      dot.setAttribute('aria-current', String(dotIndex === index));
    });

    currentSlideIndex = index;
  };

  const showNextSlide = () => {
    if (!slides.length) return;
    renderSlide((currentSlideIndex + 1) % slides.length);
  };

  const showPreviousSlide = () => {
    if (!slides.length) return;
    renderSlide((currentSlideIndex - 1 + slides.length) % slides.length);
  };

  const resetAutoplay = () => {
    window.clearInterval(autoplayId);
    if (slides.length < 2) return;
    autoplayId = window.setInterval(showNextSlide, 5000);
  };

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'slider-dot';
    dot.setAttribute('aria-label', `Ir a la imagen ${index + 1}`);
    dot.addEventListener('click', () => {
      renderSlide(index);
      resetAutoplay();
    });
    sliderDots.append(dot);
  });

  prevButton?.addEventListener('click', () => {
    showPreviousSlide();
    resetAutoplay();
  });

  nextButton?.addEventListener('click', () => {
    showNextSlide();
    resetAutoplay();
  });

  renderSlide(0);
  resetAutoplay();
};

const renderSite = async () => {
  const contentManager = window.FulltechContentManager;
  if (!contentManager) return;

  const config = await contentManager.loadConfig();
  config.hero = normalizeHero(config.hero);
  config.coverage = normalizeCoverage(config.coverage);
  config.brands = normalizeBrands(config.brands);
  config.navigation = normalizeNavigation(config.navigation);
  config.metrics = normalizeMetrics(config.metrics);
  config.servicesSection = normalizeServicesSection(config.servicesSection);
  config.trust = normalizeTrust(config.trust);
  config.process = normalizeProcess(config.process);
  config.contact = normalizeContact(config.contact);
  config.footer = normalizeFooter(config.footer);
  config.policies = normalizePolicies(config.policies, config.footer);
  config.worksPage = normalizeWorksPage(config.worksPage);
  const yearElement = document.getElementById('year');
  if (yearElement) yearElement.textContent = String(CURRENT_YEAR);

  await renderBrand(config.brand);
  renderNavigation(config.navigation);
  renderWorksPageLink(config.worksPage);
  setText('#hero-eyebrow', config.hero.eyebrow);
  setText('#hero-title', config.hero.title);
  setText('#hero-lead', config.hero.lead);

  const heroPrimary = document.getElementById('hero-primary-cta');
  const heroSecondary = document.getElementById('hero-secondary-cta');

  if (heroPrimary) {
    heroPrimary.textContent = config.hero.primaryCtaText;
    heroPrimary.href = config.hero.primaryCtaHref;
  }

  if (heroSecondary) {
    heroSecondary.textContent = config.hero.secondaryCtaText;
    heroSecondary.href = config.hero.secondaryCtaHref;
  }

  renderMetrics(config.metrics);
  await renderSlider(config.gallery);
  renderBrands(config.brands);
  renderCoverage(config.coverage);
  await renderServices(config.servicesSection, config.services);
  renderTrust(config.trust);
  renderProcess(config.process);
  renderPolicies(config.policies);
  renderContact(config.contact);
  renderFooter(config.footer);

  setupDrawer();
  setupSlider();
  setupServiceSheet(config.contact);
};

renderSite().catch((error) => {
  console.error('No se pudo renderizar la pagina', error);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && serviceSheetState.isOpen) closeServiceSheet();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('sw.js')
      .then((registration) => {
        registration.update();
      })
      .catch((error) => {
        console.error('SW registration failed', error);
      });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  });
}
