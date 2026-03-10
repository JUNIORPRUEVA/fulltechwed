(function () {
  const CONFIG_STORAGE_KEY = 'fulltech-config-v2';
  const DB_NAME = 'fulltech-admin-media';
  const DB_VERSION = 1;
  const STORE_NAME = 'media';
  const HEALTH_ENDPOINT = '/api/health';
  const CONTENT_ENDPOINT = '/api/site-content';

  const DEFAULT_CONFIG = {
    brand: {
      shortName: 'FULLTECH',
      fullName: 'FULLTECH SRL',
      mobileSubtitle: 'Seguridad SRL',
      drawerSubtitle: 'Proteccion inteligente',
      footerSubtitle: 'Sistemas de seguridad inteligente',
      logo: 'assets/icon-192.svg'
    },
    navigation: {
      desktopGalleryLabel: 'Trabajos',
      desktopCoverageLabel: 'Cobertura',
      desktopServicesLabel: 'Servicios',
      desktopPoliciesLabel: 'Politicas',
      desktopContactLabel: 'Contacto',
      desktopCtaText: 'Cotizar ahora',
      drawerGalleryLabel: 'Ver trabajos',
      drawerCoverageLabel: 'Mapa de cobertura',
      drawerServicesLabel: 'Ver productos y servicios',
      drawerProcessLabel: 'Como trabajamos',
      drawerPoliciesLabel: 'Garantia y reembolso',
      drawerContactLabel: 'Hablar con un asesor',
      drawerPrimaryCtaText: 'WhatsApp directo',
      drawerSecondaryCtaText: 'Llamar ahora',
      floatingWhatsappText: 'WhatsApp'
    },
    hero: {
      eyebrow: 'Seguridad profesional para hogares, villas, negocios y condominios',
      title: 'Instalamos soluciones reales para proteger lo que mas valoras',
      lead:
        'FULLTECH SRL vende, instala y da mantenimiento a sistemas de seguridad con atencion rapida, marcas reconocidas y cobertura en la zona Este de Republica Dominicana.',
      primaryCtaText: 'Solicitar cotizacion',
      primaryCtaHref: 'https://wa.me/18295344286?text=Hola%20FULLTECH%20SRL%2C%20quiero%20una%20cotizaci%C3%B3n.',
      secondaryCtaText: 'Ver servicios',
      secondaryCtaHref: '#servicios'
    },
    metrics: [
      { value: '+8 anos', label: 'Instalando soluciones de seguridad en la zona Este' },
      { value: '24/7', label: 'Atencion por WhatsApp para cotizacion y soporte' },
      { value: '5 servicios', label: 'Lineas clave de instalacion, automatizacion y control' }
    ],
    gallery: [
      {
        type: 'image',
        eyebrow: 'Camaras de seguridad',
        title: 'Monitoreo visual para hogares, villas y negocios',
        alt: 'Solucion de camaras de seguridad FULLTECH',
        src: 'assets/services/camaras.svg'
      },
      {
        type: 'image',
        eyebrow: 'Cerco electrico',
        title: 'Proteccion perimetral para residencias y proyectos',
        alt: 'Sistema de cerco electrico FULLTECH',
        src: 'assets/services/cerco-electrico.svg'
      },
      {
        type: 'image',
        eyebrow: 'Intercom y acceso',
        title: 'Comunicacion y control de acceso mas ordenado',
        alt: 'Sistema de intercom FULLTECH',
        src: 'assets/services/intercom.svg'
      },
      {
        type: 'image',
        eyebrow: 'Alarmas y sensores',
        title: 'Respuesta temprana ante intrusiones o aperturas',
        alt: 'Sistema de alarmas FULLTECH',
        src: 'assets/services/alarmas.svg'
      },
      {
        type: 'image',
        eyebrow: 'Motores de portones',
        title: 'Acceso automatizado con instalacion profesional',
        alt: 'Motor de porton instalado por FULLTECH',
        src: 'assets/services/motores-portones.svg'
      }
    ],
    brands: {
      eyebrow: 'Marcas con las que trabajamos',
      title: 'Instalamos equipos confiables para vender seguridad con respaldo',
      intro:
        'Trabajamos con Hikvision, HiLook, Dahua, D-World y ZKTeco para ofrecer soluciones seguras, rapidas y compatibles con hogares y negocios.',
      items: [
        { name: 'Hikvision', description: 'Camaras, grabadores y soluciones de vigilancia con buen respaldo tecnico.' },
        { name: 'HiLook', description: 'Linea funcional para proyectos residenciales y comerciales con buena relacion costo-beneficio.' },
        { name: 'Dahua', description: 'Equipos de seguridad y video con opciones para pequenos y medianos negocios.' },
        { name: 'D-World', description: 'Alternativas practicas para control, monitoreo y accesorios de instalacion.' },
        { name: 'ZKTeco', description: 'Control de acceso, asistencia e intercomunicacion para oficinas y condominios.' }
      ]
    },
    coverage: {
      eyebrow: 'Mapa de cobertura',
      title: 'Este es nuestro mapa de cobertura en la zona Este',
      intro:
        'Atendemos instalaciones, mantenimiento y visitas tecnicas en Higuey, Bavaro, Punta Cana, La Romana, Miches y zonas aledanas del Este. Trabajamos por agenda y coordinacion previa.',
      mapTag: 'Cobertura FULLTECH SRL',
      mapUrl:
        'https://www.openstreetmap.org/export/embed.html?bbox=-69.500%2C18.200%2C-68.000%2C19.150&layer=mapnik',
      provinces: [
        { name: 'La Altagracia', description: 'Higuey, Bavaro, Punta Cana, Veron y zonas cercanas.' },
        { name: 'La Romana', description: 'La Romana, Villa Hermosa y residenciales aledanos.' },
        { name: 'Miches', description: 'Atencion coordinada para proyectos residenciales y comerciales.' }
      ],
      locations: [
        { name: 'Higuey', lat: 18.615, lng: -68.707, offsetX: 0, offsetY: -4 },
        { name: 'Bavaro', lat: 18.6504, lng: -68.3897, offsetX: 10, offsetY: -6 },
        { name: 'Punta Cana', lat: 18.582, lng: -68.4043, offsetX: 12, offsetY: 12 },
        { name: 'La Romana', lat: 18.4273, lng: -68.9728, offsetX: -6, offsetY: 10 },
        { name: 'Miches', lat: 18.9833, lng: -69.05, offsetX: -6, offsetY: -8 }
      ]
    },
    servicesSection: {
      eyebrow: 'Servicios que vendemos e instalamos',
      title: 'Productos y servicios disenados para vender seguridad con claridad',
      intro:
        'Presentamos cada solucion con beneficios claros para que el cliente entienda rapido que problema resuelve y por que debe comprarte hoy.'
    },
    services: [
      {
        title: 'Camaras de seguridad',
        badge: 'Instalacion y configuracion',
        description: 'Instalamos camaras con grabacion local o remota para vigilar hogares, villas, oficinas y negocios.',
        alt: 'Servicio de instalacion de camaras de seguridad',
        image: 'assets/services/camaras.svg'
      },
      {
        title: 'Cerco electrico',
        badge: 'Proteccion perimetral',
        description: 'Montaje de cercos electricos para reforzar el perimetro y elevar la disuasion en propiedades residenciales.',
        alt: 'Servicio de cerco electrico',
        image: 'assets/services/cerco-electrico.svg'
      },
      {
        title: 'Intercom y videoportero',
        badge: 'Control de acceso',
        description: 'Soluciones de voz y video para controlar accesos de manera ordenada en casas, torres y oficinas.',
        alt: 'Servicio de intercom y videoportero',
        image: 'assets/services/intercom.svg'
      },
      {
        title: 'Alarmas y sensores',
        badge: 'Alertas en tiempo real',
        description: 'Instalacion de alarmas, sensores magneticos y de movimiento con respuesta temprana ante eventos.',
        alt: 'Servicio de alarmas y sensores',
        image: 'assets/services/alarmas.svg'
      },
      {
        title: 'Motores de portones',
        badge: 'Automatizacion',
        description: 'Automatizamos portones para mejorar comodidad, acceso y seguridad diaria en residencias y negocios.',
        alt: 'Servicio de motores de portones',
        image: 'assets/services/motores-portones.svg'
      },
      {
        title: 'Mantenimiento tecnico',
        badge: 'Revision y soporte',
        description: 'Realizamos mantenimiento preventivo y correctivo para extender la vida util de tus sistemas de seguridad.',
        alt: 'Servicio de mantenimiento tecnico',
        image: 'assets/services/mantenimiento.svg'
      }
    ],
    trust: {
      eyebrow: 'Informacion relevante',
      title: 'Lo que necesita leer un cliente antes de decidirse',
      points: [
        'Cotizaciones claras con recomendaciones segun el tipo de propiedad o negocio.',
        'Cobertura local en la zona Este para responder con mayor rapidez.',
        'Instalacion, configuracion, mantenimiento y soporte desde un mismo equipo.'
      ],
      quoteText:
        '"La seguridad se vende mejor cuando el cliente entiende el valor, ve cobertura real y siente respaldo tecnico."',
      quoteAuthor: 'FULLTECH SRL',
      quoteRole: 'Soluciones de seguridad para la zona Este'
    },
    process: {
      eyebrow: 'Proceso comercial',
      title: 'Asi convertimos una consulta en una instalacion completa',
      steps: [
        'Recibimos tu solicitud y definimos el objetivo de seguridad.',
        'Recomendamos equipos y alcances segun presupuesto y propiedad.',
        'Coordinamos visita, instalacion, pruebas y entrega funcional.'
      ]
    },
    policies: {
      eyebrow: 'Politicas claras',
      title: 'Garantia, reembolso y condiciones explicadas de forma profesional',
      items: [
        {
          title: 'Garantia de instalacion',
          description: 'Respaldamos el trabajo realizado segun el servicio contratado y las condiciones de uso del equipo.'
        },
        {
          title: 'Politica de reembolso',
          description: 'Los reembolsos aplican antes de la instalacion final, sujeto a costos ya comprometidos o materiales pedidos.'
        },
        {
          title: 'Soporte tecnico',
          description: 'Brindamos soporte para diagnostico, mantenimiento y ajustes posteriores a la instalacion.'
        }
      ]
    },
    contact: {
      eyebrow: 'Cierre comercial',
      title: 'Solicita tu cotizacion y deja tu seguridad en manos de un equipo local',
      intro:
        'Atendemos por WhatsApp, llamada y correo para cotizaciones rapidas y visitas tecnicas. Trabajamos por agenda y coordinacion previa.',
      whatsapp: '18295344286',
      whatsappText: 'Hola FULLTECH SRL, quiero una cotizacion de sistemas de seguridad.',
      whatsappLabel: 'WhatsApp',
      phone: '+1 928 531 9442',
      phoneLabel: 'Llamar',
      email: 'fulltechsd@gmail.com',
      emailLabel: 'Correo',
      location: 'Higuey, Bavaro, Punta Cana, La Romana, Miches y zonas cercanas'
    },
    footer: {
      description:
        'Instalacion, mantenimiento y venta de soluciones de seguridad para hogares, negocios, villas y proyectos empresariales.',
      legal: 'FULLTECH SRL | Garantia, soporte, mantenimiento y atencion profesional.',
      linksHeading: 'Enlaces',
      linksGalleryLabel: 'Trabajos',
      linksCoverageLabel: 'Cobertura',
      linksServicesLabel: 'Servicios',
      linksContactLabel: 'Contacto',
      policiesHeading: 'Politicas',
      policyWarrantyLabel: 'Garantia',
      policyRefundLabel: 'Reembolso',
      policySupportLabel: 'Soporte tecnico',
      policyTermsLabel: 'Condiciones de servicio',
      adminLinkLabel: 'Panel administrativo',
      contactHeading: 'Contacto',
      whatsappLabel: 'WhatsApp comercial'
    }
  };

  let currentConfigCache = null;
  let apiAvailability = null;
  let databasePromise;
  let mediaCache = new Map();
  let mediaLoaded = false;

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

  const mergeConfig = (base, override) => {
    if (Array.isArray(base)) {
      return Array.isArray(override) ? clone(override) : clone(base);
    }

    if (!isPlainObject(base)) {
      return override === undefined ? base : override;
    }

    const result = {};
    const keys = new Set([...Object.keys(base), ...Object.keys(override || {})]);
    keys.forEach((key) => {
      const baseValue = base[key];
      const overrideValue = override?.[key];
      if (overrideValue === undefined) {
        result[key] = clone(baseValue);
        return;
      }
      if (Array.isArray(baseValue)) {
        result[key] = Array.isArray(overrideValue) ? clone(overrideValue) : clone(baseValue);
        return;
      }
      if (isPlainObject(baseValue)) {
        result[key] = mergeConfig(baseValue, overrideValue);
        return;
      }
      result[key] = overrideValue;
    });
    return result;
  };

  const openDatabase = () => {
    if (!('indexedDB' in window)) return Promise.resolve(null);
    if (databasePromise) return databasePromise;

    databasePromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('No se pudo abrir IndexedDB'));
    });

    return databasePromise;
  };

  const withStore = async (mode, callback) => {
    const database = await openDatabase();
    if (!database) return null;

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, mode);
      const store = transaction.objectStore(STORE_NAME);
      const request = callback(store);
      transaction.oncomplete = () => resolve(request?.result ?? null);
      transaction.onerror = () => reject(transaction.error || new Error('Fallo la operacion con IndexedDB'));
      transaction.onabort = () => reject(transaction.error || new Error('Operacion abortada en IndexedDB'));
    });
  };

  const getAllStoredMedia = async () => {
    const records = await withStore('readonly', (store) => store.getAll());
    return Array.isArray(records) ? records : [];
  };

  const replaceStoredMedia = async (records) => {
    await withStore('readwrite', (store) => {
      store.clear();
      records.forEach((record) => store.put(record));
      return null;
    });
  };

  const ensureMediaLoaded = async () => {
    if (mediaLoaded) return;
    const records = await getAllStoredMedia();
    mediaCache = new Map(records.map((record) => [record.id, record]));
    mediaLoaded = true;
  };

  const hydrateMediaCache = async (records) => {
    mediaCache = new Map((Array.isArray(records) ? records : []).map((record) => [record.id, record]));
    mediaLoaded = true;
    await replaceStoredMedia([...mediaCache.values()]);
  };

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error || new Error('No se pudo leer el archivo'));
      reader.readAsDataURL(file);
    });

  const readLocalConfig = () => {
    try {
      const raw = window.localStorage.getItem(CONFIG_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  };

  const writeLocalConfig = (config) => {
    window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  };

  const checkApiAvailability = async () => {
    if (apiAvailability !== null) return apiAvailability;
    try {
      const response = await fetch(HEALTH_ENDPOINT, { cache: 'no-store' });
      apiAvailability = response.ok;
    } catch (error) {
      apiAvailability = false;
    }
    return apiAvailability;
  };

  const readRemoteBundle = async () => {
    const response = await fetch(CONTENT_ENDPOINT, { cache: 'no-store' });
    if (!response.ok) throw new Error('No se pudo leer el contenido remoto');
    return response.json();
  };

  const writeRemoteBundle = async (bundle) => {
    const response = await fetch(CONTENT_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bundle)
    });
    if (!response.ok) {
      throw new Error('No se pudo guardar el contenido remoto');
    }
  };

  const getMediaList = async () => {
    await ensureMediaLoaded();
    return [...mediaCache.values()];
  };

  const loadConfig = async () => {
    if (currentConfigCache) return mergeConfig(DEFAULT_CONFIG, currentConfigCache);

    if (await checkApiAvailability()) {
      try {
        const remoteBundle = await readRemoteBundle();
        const mergedConfig = mergeConfig(DEFAULT_CONFIG, remoteBundle.config || {});
        currentConfigCache = mergedConfig;
        writeLocalConfig(mergedConfig);
        await hydrateMediaCache(remoteBundle.media || []);
        return mergeConfig(DEFAULT_CONFIG, mergedConfig);
      } catch (error) {
        apiAvailability = false;
      }
    }

    const localConfig = mergeConfig(DEFAULT_CONFIG, readLocalConfig());
    currentConfigCache = localConfig;
    await ensureMediaLoaded();
    return mergeConfig(DEFAULT_CONFIG, localConfig);
  };

  const saveConfig = async (config) => {
    const normalizedConfig = mergeConfig(DEFAULT_CONFIG, config || {});
    currentConfigCache = normalizedConfig;
    writeLocalConfig(normalizedConfig);

    const media = await getMediaList();
    if (await checkApiAvailability()) {
      await writeRemoteBundle({ config: normalizedConfig, media });
    }

    return mergeConfig(DEFAULT_CONFIG, normalizedConfig);
  };

  const resetConfig = async () => {
    currentConfigCache = clone(DEFAULT_CONFIG);
    writeLocalConfig(currentConfigCache);
    await hydrateMediaCache([]);

    if (await checkApiAvailability()) {
      await writeRemoteBundle({ config: currentConfigCache, media: [] });
    }

    return clone(DEFAULT_CONFIG);
  };

  const saveMediaFile = async (file) => {
    await ensureMediaLoaded();
    const dataUrl = await readFileAsDataUrl(file);
    const id = `db:${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const record = {
      id,
      name: file.name,
      mimeType: file.type || '',
      dataUrl,
      updatedAt: new Date().toISOString()
    };

    mediaCache.set(id, record);
    await replaceStoredMedia([...mediaCache.values()]);
    return id;
  };

  const resolveMediaUrl = async (source) => {
    if (!source) return '';
    if (!String(source).startsWith('db:')) return String(source);

    await ensureMediaLoaded();
    return mediaCache.get(source)?.dataUrl || '';
  };

  const exportBundle = async () => {
    const config = await loadConfig();
    const media = await getMediaList();
    return { config, media };
  };

  const importBundle = async (bundle) => {
    if (!isPlainObject(bundle) || !isPlainObject(bundle.config) || !Array.isArray(bundle.media)) {
      throw new Error('Respaldo invalido');
    }

    const mergedConfig = mergeConfig(DEFAULT_CONFIG, bundle.config);
    currentConfigCache = mergedConfig;
    writeLocalConfig(mergedConfig);
    await hydrateMediaCache(bundle.media);

    if (await checkApiAvailability()) {
      await writeRemoteBundle({ config: mergedConfig, media: bundle.media });
    }

    return mergeConfig(DEFAULT_CONFIG, mergedConfig);
  };

  window.FulltechContentManager = {
    getDefaultConfig: () => clone(DEFAULT_CONFIG),
    loadConfig,
    saveConfig,
    resetConfig,
    saveMediaFile,
    resolveMediaUrl,
    exportBundle,
    importBundle
  };
})();
