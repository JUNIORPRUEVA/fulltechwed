const contentManager = window.FulltechContentManager;
const statusMessage = document.getElementById('status-message');

const redirectToLogin = () => {
  window.location.replace('login.html');
};

const ensureAuthenticated = async () => {
  const response = await fetch('/api/auth/session', { cache: 'no-store' });
  if (!response.ok) {
    redirectToLogin();
    throw new Error('No se pudo validar la sesion');
  }

  const payload = await response.json();
  if (!payload.authenticated) {
    redirectToLogin();
    throw new Error('Sesion no activa');
  }

  return payload;
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const isManagedMediaId = (value) => String(value || '').startsWith('db:');

const setStatus = (message, type = '') => {
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.className = `status${type ? ` is-${type}` : ''}`;
};

const setValue = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) element.value = value ?? '';
};

const getValue = (selector) => document.querySelector(selector)?.value?.trim() || '';

const renderPreview = async (container, source, type, file) => {
  if (!container) return;

  let previewSource = '';
  if (file) {
    previewSource = URL.createObjectURL(file);
  } else if (source) {
    previewSource = await contentManager.resolveMediaUrl(source);
  }

  if (!previewSource) {
    container.classList.add('is-empty');
    container.innerHTML = '<span class="preview-note">Sin archivo cargado</span>';
    return;
  }

  container.classList.remove('is-empty');
  container.innerHTML =
    type === 'video'
      ? `<video src="${previewSource}" controls muted playsinline></video>`
      : `<img src="${previewSource}" alt="Vista previa del recurso" />`;
};

const createMetricCard = (metric, index) => `
  <article class="editor-card" data-metric-index="${index}">
    <h3>Metrica ${index + 1}</h3>
    <div class="editor-card-grid two-cols">
      <label>
        Valor
        <input type="text" data-field="value" value="${escapeHtml(metric.value)}" />
      </label>
      <label>
        Descripcion
        <input type="text" data-field="label" value="${escapeHtml(metric.label)}" />
      </label>
    </div>
  </article>
`;

const createProvinceCard = (province, index) => `
  <article class="editor-card" data-province-index="${index}">
    <h3>Provincia ${index + 1}</h3>
    <div class="editor-card-grid two-cols">
      <label>
        Nombre
        <input type="text" data-field="name" value="${escapeHtml(province.name)}" />
      </label>
      <label>
        Descripcion
        <input type="text" data-field="description" value="${escapeHtml(province.description)}" />
      </label>
    </div>
  </article>
`;

const createLocationCard = (location, index) => `
  <article class="editor-card" data-location-index="${index}">
    <h3>Punto ${index + 1}</h3>
    <div class="editor-card-grid two-cols">
      <label>
        Nombre visible
        <input type="text" data-field="name" value="${escapeHtml(location.name)}" />
      </label>
      <label>
        Latitud
        <input type="number" step="0.000001" data-field="lat" value="${escapeHtml(location.lat)}" />
      </label>
      <label>
        Longitud
        <input type="number" step="0.000001" data-field="lng" value="${escapeHtml(location.lng)}" />
      </label>
      <label>
        Offset X etiqueta
        <input type="number" step="1" data-field="offsetX" value="${escapeHtml(location.offsetX)}" />
      </label>
      <label>
        Offset Y etiqueta
        <input type="number" step="1" data-field="offsetY" value="${escapeHtml(location.offsetY)}" />
      </label>
    </div>
  </article>
`;

const createBrandCard = (brand, index) => `
  <article class="editor-card" data-brand-item-index="${index}">
    <h3>Marca ${index + 1}</h3>
    <div class="editor-card-grid">
      <label>
        Nombre
        <input type="text" data-field="name" value="${escapeHtml(brand.name)}" />
      </label>
      <label>
        Descripcion
        <textarea rows="3" data-field="description">${escapeHtml(brand.description)}</textarea>
      </label>
    </div>
  </article>
`;

const createTextCard = (label, value, index, fieldName) => `
  <article class="editor-card" data-${fieldName}-index="${index}">
    <h3>${label} ${index + 1}</h3>
    <div class="editor-card-grid">
      <label>
        Texto
        <textarea rows="3" data-field="value">${escapeHtml(value)}</textarea>
      </label>
    </div>
  </article>
`;

const createPolicyCard = (item, index) => `
  <article class="editor-card" data-policy-index="${index}">
    <h3>Politica ${index + 1}</h3>
    <div class="editor-card-grid">
      <label>
        Titulo
        <input type="text" data-field="title" value="${escapeHtml(item.title)}" />
      </label>
      <label>
        Descripcion
        <textarea rows="3" data-field="description">${escapeHtml(item.description)}</textarea>
      </label>
    </div>
  </article>
`;

const createGalleryCard = (item, index) => `
  <article class="editor-card media-card" data-gallery-index="${index}" data-current-src="${escapeHtml(item.src)}">
    <div class="block-head">
      <h3>Trabajo ${index + 1}</h3>
      <button class="btn btn-ghost" type="button" data-gallery-remove="${index}">Eliminar</button>
    </div>
    <div class="editor-card-grid two-cols">
      <label>
        Tipo
        <select data-field="type">
          <option value="image" ${item.type === 'image' ? 'selected' : ''}>Imagen</option>
          <option value="video" ${item.type === 'video' ? 'selected' : ''}>Video</option>
        </select>
      </label>
      <label>
        Etiqueta superior
        <input type="text" data-field="eyebrow" value="${escapeHtml(item.eyebrow)}" />
      </label>
      <label class="full-span">
        Titulo del slide
        <input type="text" data-field="title" value="${escapeHtml(item.title)}" />
      </label>
      <label class="full-span">
        Texto alternativo
        <input type="text" data-field="alt" value="${escapeHtml(item.alt)}" />
      </label>
      <label class="full-span">
        URL del archivo
        <input type="url" data-field="src" value="${isManagedMediaId(item.src) ? '' : escapeHtml(item.src)}" placeholder="https://..." />
      </label>
      <label class="full-span file-input-wrap">
        Subir archivo
        <input type="file" data-field="file" accept="image/*,video/*" />
      </label>
    </div>
    <div class="preview-box is-empty"></div>
  </article>
`;

const createEmptyGalleryItem = () => ({
  type: 'image',
  eyebrow: 'Trabajo realizado',
  title: 'Nueva instalacion FULLTECH',
  alt: 'Trabajo realizado por FULLTECH SRL',
  src: ''
});

const renderGalleryEditor = (gallery) => {
  const editor = document.getElementById('gallery-editor');
  if (!editor) return;
  editor.innerHTML = gallery.map(createGalleryCard).join('');
  attachMediaPreviews();
};

const getCurrentGalleryDraft = () =>
  Array.from(document.querySelectorAll('[data-gallery-index]')).map((card) => ({
    type: card.querySelector('[data-field="type"]')?.value || 'image',
    eyebrow: card.querySelector('[data-field="eyebrow"]')?.value?.trim() || '',
    title: card.querySelector('[data-field="title"]')?.value?.trim() || '',
    alt: card.querySelector('[data-field="alt"]')?.value?.trim() || '',
    src: card.querySelector('[data-field="src"]')?.value?.trim() || card.dataset.currentSrc || ''
  }));

const setupGalleryEditorActions = () => {
  document.getElementById('add-gallery-item')?.addEventListener('click', () => {
    const gallery = [...getCurrentGalleryDraft(), createEmptyGalleryItem()];
    renderGalleryEditor(gallery);
  });

  document.getElementById('gallery-editor')?.addEventListener('click', (event) => {
    const removeButton = event.target.closest('[data-gallery-remove]');
    if (!removeButton) return;

    const index = Number(removeButton.getAttribute('data-gallery-remove'));
    const gallery = getCurrentGalleryDraft().filter((_, itemIndex) => itemIndex !== index);
    renderGalleryEditor(gallery);
  });
};

const createServiceCard = (item, index) => `
  <article class="editor-card media-card" data-service-index="${index}" data-current-src="${escapeHtml(item.image)}">
    <h3>Servicio ${index + 1}</h3>
    <div class="editor-card-grid two-cols">
      <label>
        Titulo
        <input type="text" data-field="title" value="${escapeHtml(item.title)}" />
      </label>
      <label>
        Texto corto final
        <input type="text" data-field="badge" value="${escapeHtml(item.badge)}" />
      </label>
      <label class="full-span">
        Descripcion
        <textarea rows="3" data-field="description">${escapeHtml(item.description)}</textarea>
      </label>
      <label class="full-span">
        Texto alternativo
        <input type="text" data-field="alt" value="${escapeHtml(item.alt)}" />
      </label>
      <label class="full-span">
        URL de imagen
        <input type="url" data-field="src" value="${isManagedMediaId(item.image) ? '' : escapeHtml(item.image)}" placeholder="https://..." />
      </label>
      <label class="full-span file-input-wrap">
        Subir imagen
        <input type="file" data-field="file" accept="image/*" />
      </label>
    </div>
    <div class="preview-box is-empty"></div>
  </article>
`;

const attachMediaPreviews = () => {
  document.querySelectorAll('.media-card').forEach((card) => {
    const typeSelect = card.querySelector('[data-field="type"]');
    const srcInput = card.querySelector('[data-field="src"]');
    const fileInput = card.querySelector('[data-field="file"]');
    const preview = card.querySelector('.preview-box');

    const update = async () => {
      const currentSrc = srcInput?.value.trim() || card.dataset.currentSrc || '';
      const mediaType = typeSelect?.value || (fileInput?.files?.[0]?.type?.startsWith('video/') ? 'video' : 'image');
      await renderPreview(preview, currentSrc, mediaType, fileInput?.files?.[0]);
    };

    typeSelect?.addEventListener('change', update);
    srcInput?.addEventListener('input', update);
    fileInput?.addEventListener('change', update);
    update();
  });
};

const populateForm = async (config) => {
  setValue('#brand-short-name', config.brand.shortName);
  setValue('#brand-full-name', config.brand.fullName);
  setValue('#brand-mobile-subtitle', config.brand.mobileSubtitle);
  setValue('#brand-drawer-subtitle', config.brand.drawerSubtitle);
  setValue('#brand-footer-subtitle', config.brand.footerSubtitle);
  setValue('#brand-logo-url', isManagedMediaId(config.brand.logo) ? '' : config.brand.logo);
  document.getElementById('brand-logo-url').dataset.currentSrc = config.brand.logo || '';

  setValue('#nav-desktop-gallery-input', config.navigation.desktopGalleryLabel);
  setValue('#nav-desktop-coverage-input', config.navigation.desktopCoverageLabel);
  setValue('#nav-desktop-services-input', config.navigation.desktopServicesLabel);
  setValue('#nav-desktop-policies-input', config.navigation.desktopPoliciesLabel);
  setValue('#nav-desktop-contact-input', config.navigation.desktopContactLabel);
  setValue('#nav-desktop-cta-input', config.navigation.desktopCtaText);
  setValue('#nav-drawer-gallery-input', config.navigation.drawerGalleryLabel);
  setValue('#nav-drawer-coverage-input', config.navigation.drawerCoverageLabel);
  setValue('#nav-drawer-services-input', config.navigation.drawerServicesLabel);
  setValue('#nav-drawer-process-input', config.navigation.drawerProcessLabel);
  setValue('#nav-drawer-policies-input', config.navigation.drawerPoliciesLabel);
  setValue('#nav-drawer-contact-input', config.navigation.drawerContactLabel);
  setValue('#nav-drawer-primary-cta-input', config.navigation.drawerPrimaryCtaText);
  setValue('#nav-drawer-secondary-cta-input', config.navigation.drawerSecondaryCtaText);
  setValue('#nav-floating-whatsapp-input', config.navigation.floatingWhatsappText);

  setValue('#hero-eyebrow-input', config.hero.eyebrow);
  setValue('#hero-title-input', config.hero.title);
  setValue('#hero-lead-input', config.hero.lead);
  setValue('#hero-primary-text', config.hero.primaryCtaText);
  setValue('#hero-primary-href', config.hero.primaryCtaHref);
  setValue('#hero-secondary-text', config.hero.secondaryCtaText);
  setValue('#hero-secondary-href', config.hero.secondaryCtaHref);

  setValue('#works-eyebrow-input', config.worksPage.eyebrow);
  setValue('#works-link-text-input', config.worksPage.linkText);
  setValue('#works-title-input', config.worksPage.title);
  setValue('#works-intro-input', config.worksPage.intro);
  setValue('#works-back-home-input', config.worksPage.backHomeText);
  setValue('#works-empty-message-input', config.worksPage.emptyMessage);

  document.getElementById('metrics-editor').innerHTML = config.metrics.map(createMetricCard).join('');
  renderGalleryEditor(config.gallery);

  setValue('#brands-eyebrow-input', config.brands.eyebrow);
  setValue('#brands-title-input', config.brands.title);
  setValue('#brands-intro-input', config.brands.intro);
  document.getElementById('brands-editor').innerHTML = config.brands.items.map(createBrandCard).join('');

  setValue('#coverage-eyebrow-input', config.coverage.eyebrow);
  setValue('#coverage-title-input', config.coverage.title);
  setValue('#coverage-intro-input', config.coverage.intro);
  setValue('#coverage-map-tag-input', config.coverage.mapTag);
  setValue('#coverage-map-url-input', config.coverage.mapUrl);
  document.getElementById('coverage-editor').innerHTML = config.coverage.provinces.map(createProvinceCard).join('');
  document.getElementById('coverage-locations-editor').innerHTML = config.coverage.locations
    .map(createLocationCard)
    .join('');

  setValue('#services-eyebrow-input', config.servicesSection.eyebrow);
  setValue('#services-title-input', config.servicesSection.title);
  setValue('#services-intro-input', config.servicesSection.intro);
  document.getElementById('services-editor').innerHTML = config.services.map(createServiceCard).join('');

  setValue('#trust-eyebrow-input', config.trust.eyebrow);
  setValue('#trust-title-input', config.trust.title);
  setValue('#quote-text-input', config.trust.quoteText);
  setValue('#quote-author-input', config.trust.quoteAuthor);
  setValue('#quote-role-input', config.trust.quoteRole);
  document.getElementById('trust-editor').innerHTML = config.trust.points
    .map((value, index) => createTextCard('Punto de confianza', value, index, 'trust'))
    .join('');

  setValue('#process-eyebrow-input', config.process.eyebrow);
  setValue('#process-title-input', config.process.title);
  document.getElementById('process-editor').innerHTML = config.process.steps
    .map((value, index) => createTextCard('Paso', value, index, 'process'))
    .join('');

  setValue('#policies-eyebrow-input', config.policies.eyebrow);
  setValue('#policies-title-input', config.policies.title);
  document.getElementById('policies-editor').innerHTML = config.policies.items.map(createPolicyCard).join('');

  setValue('#contact-eyebrow-input', config.contact.eyebrow);
  setValue('#contact-title-input', config.contact.title);
  setValue('#contact-intro-input', config.contact.intro);
  setValue('#contact-whatsapp-input', config.contact.whatsapp);
  setValue('#contact-whatsapp-text-input', config.contact.whatsappText);
  setValue('#contact-whatsapp-label-input', config.contact.whatsappLabel);
  setValue('#contact-phone-input', config.contact.phone);
  setValue('#contact-phone-label-input', config.contact.phoneLabel);
  setValue('#contact-email-input', config.contact.email);
  setValue('#contact-email-label-input', config.contact.emailLabel);
  setValue('#contact-location-input', config.contact.location);

  setValue('#footer-links-heading-input', config.footer.linksHeading);
  setValue('#footer-policies-heading-input', config.footer.policiesHeading);
  setValue('#footer-contact-heading-input', config.footer.contactHeading);
  setValue('#footer-whatsapp-label-input', config.footer.whatsappLabel);
  setValue('#footer-link-gallery-input', config.footer.linksGalleryLabel);
  setValue('#footer-link-coverage-input', config.footer.linksCoverageLabel);
  setValue('#footer-link-services-input', config.footer.linksServicesLabel);
  setValue('#footer-link-contact-input', config.footer.linksContactLabel);
  setValue('#footer-policy-warranty-input', config.footer.policyWarrantyLabel);
  setValue('#footer-policy-refund-input', config.footer.policyRefundLabel);
  setValue('#footer-policy-support-input', config.footer.policySupportLabel);
  setValue('#footer-policy-terms-input', config.footer.policyTermsLabel);
  setValue('#footer-admin-link-input', config.footer.adminLinkLabel);
  setValue('#footer-description-input', config.footer.description);
  setValue('#footer-legal-input', config.footer.legal);

  attachMediaPreviews();
  await renderPreview(document.querySelector('#general .preview-box'), document.getElementById('brand-logo-url').dataset.currentSrc, 'image');
};

const ensureLogoPreview = () => {
  const generalPanel = document.getElementById('general');
  if (!generalPanel.querySelector('.preview-box')) {
    const preview = document.createElement('div');
    preview.className = 'preview-box is-empty';
    generalPanel.append(preview);
  }

  const urlInput = document.getElementById('brand-logo-url');
  const fileInput = document.getElementById('brand-logo-file');
  const preview = generalPanel.querySelector('.preview-box');

  const update = async () => {
    const currentSrc = urlInput.value.trim() || urlInput.dataset.currentSrc || '';
    await renderPreview(preview, currentSrc, 'image', fileInput.files[0]);
  };

  urlInput.addEventListener('input', update);
  fileInput.addEventListener('change', update);
};

const collectSimpleArray = (selector) =>
  Array.from(document.querySelectorAll(selector)).map((card) => card.querySelector('[data-field="value"]').value.trim());

const resolveUploadedMedia = async (urlInput, fileInput, existingSource) => {
  if (fileInput?.files?.[0]) {
    return contentManager.saveMediaFile(fileInput.files[0]);
  }

  const manualUrl = urlInput?.value?.trim();
  if (manualUrl) return manualUrl;
  return existingSource || '';
};

const collectConfig = async () => {
  const galleryCards = Array.from(document.querySelectorAll('[data-gallery-index]'));
  const serviceCards = Array.from(document.querySelectorAll('[data-service-index]'));

  const logoSource = await resolveUploadedMedia(
    document.getElementById('brand-logo-url'),
    document.getElementById('brand-logo-file'),
    document.getElementById('brand-logo-url').dataset.currentSrc
  );

  const gallery = await Promise.all(
    galleryCards.map(async (card) => ({
      type: card.querySelector('[data-field="type"]').value,
      eyebrow: card.querySelector('[data-field="eyebrow"]').value.trim(),
      title: card.querySelector('[data-field="title"]').value.trim(),
      alt: card.querySelector('[data-field="alt"]').value.trim(),
      src: await resolveUploadedMedia(
        card.querySelector('[data-field="src"]'),
        card.querySelector('[data-field="file"]'),
        card.dataset.currentSrc
      )
    }))
  );

  const services = await Promise.all(
    serviceCards.map(async (card) => ({
      title: card.querySelector('[data-field="title"]').value.trim(),
      badge: card.querySelector('[data-field="badge"]').value.trim(),
      description: card.querySelector('[data-field="description"]').value.trim(),
      alt: card.querySelector('[data-field="alt"]').value.trim(),
      image: await resolveUploadedMedia(
        card.querySelector('[data-field="src"]'),
        card.querySelector('[data-field="file"]'),
        card.dataset.currentSrc
      )
    }))
  );

  return {
    brand: {
      shortName: getValue('#brand-short-name'),
      fullName: getValue('#brand-full-name'),
      mobileSubtitle: getValue('#brand-mobile-subtitle'),
      drawerSubtitle: getValue('#brand-drawer-subtitle'),
      footerSubtitle: getValue('#brand-footer-subtitle'),
      logo: logoSource
    },
    navigation: {
      desktopGalleryLabel: getValue('#nav-desktop-gallery-input'),
      desktopCoverageLabel: getValue('#nav-desktop-coverage-input'),
      desktopServicesLabel: getValue('#nav-desktop-services-input'),
      desktopPoliciesLabel: getValue('#nav-desktop-policies-input'),
      desktopContactLabel: getValue('#nav-desktop-contact-input'),
      desktopCtaText: getValue('#nav-desktop-cta-input'),
      drawerGalleryLabel: getValue('#nav-drawer-gallery-input'),
      drawerCoverageLabel: getValue('#nav-drawer-coverage-input'),
      drawerServicesLabel: getValue('#nav-drawer-services-input'),
      drawerProcessLabel: getValue('#nav-drawer-process-input'),
      drawerPoliciesLabel: getValue('#nav-drawer-policies-input'),
      drawerContactLabel: getValue('#nav-drawer-contact-input'),
      drawerPrimaryCtaText: getValue('#nav-drawer-primary-cta-input'),
      drawerSecondaryCtaText: getValue('#nav-drawer-secondary-cta-input'),
      floatingWhatsappText: getValue('#nav-floating-whatsapp-input')
    },
    hero: {
      eyebrow: getValue('#hero-eyebrow-input'),
      title: getValue('#hero-title-input'),
      lead: getValue('#hero-lead-input'),
      primaryCtaText: getValue('#hero-primary-text'),
      primaryCtaHref: getValue('#hero-primary-href'),
      secondaryCtaText: getValue('#hero-secondary-text'),
      secondaryCtaHref: getValue('#hero-secondary-href')
    },
    worksPage: {
      eyebrow: getValue('#works-eyebrow-input'),
      linkText: getValue('#works-link-text-input'),
      title: getValue('#works-title-input'),
      intro: getValue('#works-intro-input'),
      backHomeText: getValue('#works-back-home-input'),
      emptyMessage: getValue('#works-empty-message-input')
    },
    metrics: Array.from(document.querySelectorAll('[data-metric-index]')).map((card) => ({
      value: card.querySelector('[data-field="value"]').value.trim(),
      label: card.querySelector('[data-field="label"]').value.trim()
    })),
    gallery,
    brands: {
      eyebrow: getValue('#brands-eyebrow-input'),
      title: getValue('#brands-title-input'),
      intro: getValue('#brands-intro-input'),
      items: Array.from(document.querySelectorAll('[data-brand-item-index]')).map((card) => ({
        name: card.querySelector('[data-field="name"]').value.trim(),
        description: card.querySelector('[data-field="description"]').value.trim()
      }))
    },
    coverage: {
      eyebrow: getValue('#coverage-eyebrow-input'),
      title: getValue('#coverage-title-input'),
      intro: getValue('#coverage-intro-input'),
      mapTag: getValue('#coverage-map-tag-input'),
      mapUrl: getValue('#coverage-map-url-input'),
      provinces: Array.from(document.querySelectorAll('[data-province-index]')).map((card) => ({
        name: card.querySelector('[data-field="name"]').value.trim(),
        description: card.querySelector('[data-field="description"]').value.trim()
      })),
      locations: Array.from(document.querySelectorAll('[data-location-index]')).map((card) => ({
        name: card.querySelector('[data-field="name"]').value.trim(),
        lat: Number(card.querySelector('[data-field="lat"]').value),
        lng: Number(card.querySelector('[data-field="lng"]').value),
        offsetX: Number(card.querySelector('[data-field="offsetX"]').value || 0),
        offsetY: Number(card.querySelector('[data-field="offsetY"]').value || 0)
      }))
    },
    servicesSection: {
      eyebrow: getValue('#services-eyebrow-input'),
      title: getValue('#services-title-input'),
      intro: getValue('#services-intro-input')
    },
    services,
    trust: {
      eyebrow: getValue('#trust-eyebrow-input'),
      title: getValue('#trust-title-input'),
      points: collectSimpleArray('[data-trust-index]'),
      quoteText: getValue('#quote-text-input'),
      quoteAuthor: getValue('#quote-author-input'),
      quoteRole: getValue('#quote-role-input')
    },
    process: {
      eyebrow: getValue('#process-eyebrow-input'),
      title: getValue('#process-title-input'),
      steps: collectSimpleArray('[data-process-index]')
    },
    policies: {
      eyebrow: getValue('#policies-eyebrow-input'),
      title: getValue('#policies-title-input'),
      items: Array.from(document.querySelectorAll('[data-policy-index]')).map((card) => ({
        title: card.querySelector('[data-field="title"]').value.trim(),
        description: card.querySelector('[data-field="description"]').value.trim()
      }))
    },
    contact: {
      eyebrow: getValue('#contact-eyebrow-input'),
      title: getValue('#contact-title-input'),
      intro: getValue('#contact-intro-input'),
      whatsapp: getValue('#contact-whatsapp-input'),
      whatsappText: getValue('#contact-whatsapp-text-input'),
      whatsappLabel: getValue('#contact-whatsapp-label-input'),
      phone: getValue('#contact-phone-input'),
      phoneLabel: getValue('#contact-phone-label-input'),
      email: getValue('#contact-email-input'),
      emailLabel: getValue('#contact-email-label-input'),
      location: getValue('#contact-location-input')
    },
    footer: {
      linksHeading: getValue('#footer-links-heading-input'),
      policiesHeading: getValue('#footer-policies-heading-input'),
      contactHeading: getValue('#footer-contact-heading-input'),
      whatsappLabel: getValue('#footer-whatsapp-label-input'),
      linksGalleryLabel: getValue('#footer-link-gallery-input'),
      linksCoverageLabel: getValue('#footer-link-coverage-input'),
      linksServicesLabel: getValue('#footer-link-services-input'),
      linksContactLabel: getValue('#footer-link-contact-input'),
      policyWarrantyLabel: getValue('#footer-policy-warranty-input'),
      policyRefundLabel: getValue('#footer-policy-refund-input'),
      policySupportLabel: getValue('#footer-policy-support-input'),
      policyTermsLabel: getValue('#footer-policy-terms-input'),
      adminLinkLabel: getValue('#footer-admin-link-input'),
      description: getValue('#footer-description-input'),
      legal: getValue('#footer-legal-input')
    }
  };
};

const downloadJson = (fileName, payload) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

const loadForm = async () => {
  await ensureAuthenticated();
  const config = await contentManager.loadConfig();
  await populateForm(config);
  setStatus('Configuracion cargada.', 'success');
};

document.getElementById('save-config')?.addEventListener('click', async () => {
  try {
    setStatus('Guardando cambios...');
    const config = await collectConfig();
    await contentManager.saveConfig(config);
    await loadForm();
    setStatus('Cambios guardados correctamente.', 'success');
  } catch (error) {
    console.error(error);
    if (String(error?.message || '').includes('401')) redirectToLogin();
    setStatus('No se pudieron guardar los cambios.', 'error');
  }
});

document.getElementById('logout-button')?.addEventListener('click', async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
  } finally {
    redirectToLogin();
  }
});

document.getElementById('reset-config')?.addEventListener('click', async () => {
  try {
    setStatus('Restaurando configuracion por defecto...');
    await contentManager.resetConfig();
    await loadForm();
    setStatus('Configuracion restaurada.', 'success');
  } catch (error) {
    console.error(error);
    setStatus('No se pudo restaurar la configuracion.', 'error');
  }
});

document.getElementById('export-config')?.addEventListener('click', async () => {
  try {
    setStatus('Generando respaldo...');
    const bundle = await contentManager.exportBundle();
    downloadJson('fulltech-respaldo.json', bundle);
    setStatus('Respaldo exportado.', 'success');
  } catch (error) {
    console.error(error);
    setStatus('No se pudo exportar el respaldo.', 'error');
  }
});

document.getElementById('import-config')?.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    setStatus('Importando respaldo...');
    const raw = await file.text();
    const bundle = JSON.parse(raw);
    await contentManager.importBundle(bundle);
    await loadForm();
    setStatus('Respaldo importado correctamente.', 'success');
  } catch (error) {
    console.error(error);
    setStatus('No se pudo importar el respaldo.', 'error');
  } finally {
    event.target.value = '';
  }
});

ensureLogoPreview();
setupGalleryEditorActions();
loadForm().catch((error) => {
  console.error(error);
  if (!String(error?.message || '').includes('Sesion no activa')) {
    setStatus('No se pudo cargar el panel administrativo.', 'error');
  }
});