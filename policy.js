const escapePolicyHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const normalizePolicySlug = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const POLICY_SLUGS = {
  garantia: 'garantia-instalacion',
  'garantia-de-instalacion': 'garantia-instalacion',
  reembolso: 'reembolso',
  'politica-de-reembolso': 'reembolso',
  'soporte-tecnico': 'soporte-tecnico',
  soporte: 'soporte-tecnico',
  'condiciones-de-servicio': 'condiciones-servicio'
};

const getPolicySlugFromTitle = (value) => {
  const normalized = normalizePolicySlug(value);
  return POLICY_SLUGS[normalized] || normalized || 'condiciones-servicio';
};

const createPolicyWhatsAppUrl = (number, message) => {
  const cleanNumber = String(number || '').replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message || '');
  return `https://wa.me/${cleanNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};

const POLICY_CONTENT = {
  'garantia-instalacion': {
    eyebrow: 'Garantia de instalacion',
    title: 'Garantia de instalacion',
    intro: 'Esta politica explica el respaldo que FULLTECH SRL ofrece sobre la mano de obra y la entrega funcional del servicio instalado.',
    meta: ['Aplica sobre instalacion realizada', 'Se revisa segun diagnostico tecnico'],
    sections: [
      {
        title: 'Alcance de la garantia',
        paragraphs: [
          'La garantia cubre la instalacion realizada por nuestro equipo y corrige fallas relacionadas directamente con el montaje, conexion o configuracion inicial entregada al cliente.',
          'El alcance exacto depende del tipo de servicio contratado, las condiciones del lugar y el uso normal de los equipos despues de la entrega.'
        ]
      },
      {
        title: 'Lo que el cliente debe tomar en cuenta',
        list: [
          'La garantia no cubre danos causados por golpes, humedad, manipulacion externa o alteraciones hechas por terceros.',
          'Tampoco cubre problemas electricos externos, descargas, sabotaje o deterioro por uso indebido.',
          'Si el equipo tiene garantia propia del fabricante, esta se gestiona conforme a la marca y disponibilidad del suplidor.'
        ]
      },
      {
        title: 'Proceso de revision',
        paragraphs: [
          'Cuando el cliente reporta una incidencia, FULLTECH SRL evalua el caso, valida si corresponde a la instalacion realizada y coordina la visita o revision tecnica segun agenda.',
          'Si la falla no corresponde a garantia, se informa el diagnostico y el costo de correccion antes de ejecutar cualquier trabajo adicional.'
        ]
      }
    ]
  },
  reembolso: {
    eyebrow: 'Politica de reembolso',
    title: 'Politica de reembolso',
    intro: 'Aqui se detallan las condiciones bajo las cuales puede evaluarse un reembolso antes o durante la coordinacion del servicio.',
    meta: ['Sujeto a materiales y gastos comprometidos', 'Se evalua caso por caso'],
    sections: [
      {
        title: 'Cuando puede aplicar',
        paragraphs: [
          'Un reembolso puede evaluarse antes de la instalacion final cuando no se han comprometido materiales, equipos, traslados o costos operativos asociados al proyecto.',
          'Cada solicitud se analiza tomando en cuenta el avance real del servicio y los recursos ya reservados para atender al cliente.'
        ]
      },
      {
        title: 'Casos donde puede haber ajustes',
        list: [
          'Si ya se compraron materiales o equipos para el proyecto, esos costos pueden descontarse del monto a reembolsar.',
          'Si hubo visita tecnica, traslado, levantamiento o configuracion previa, esos costos pueden considerarse parte del servicio ejecutado.',
          'Los pedidos especiales o equipos solicitados especificamente para una propiedad pueden no ser reembolsables.'
        ]
      },
      {
        title: 'Como solicitarlo',
        paragraphs: [
          'La solicitud debe hacerse por un canal oficial de FULLTECH SRL para que podamos revisar el estado del proyecto y responder con claridad.',
          'Antes de confirmar cualquier reembolso se informa al cliente el monto aplicable, los descuentos correspondientes y el tiempo estimado de gestion.'
        ]
      }
    ]
  },
  'soporte-tecnico': {
    eyebrow: 'Soporte tecnico',
    title: 'Soporte tecnico',
    intro: 'Esta politica resume como atendemos revisiones, diagnosticos, mantenimiento y ajustes posteriores a la instalacion.',
    meta: ['Atencion por agenda previa', 'Diagnostico y mantenimiento'],
    sections: [
      {
        title: 'Tipo de soporte ofrecido',
        paragraphs: [
          'FULLTECH SRL brinda soporte para diagnostico, mantenimiento, ajustes de configuracion y revision de sistemas instalados por nuestro equipo o, cuando sea posible, sistemas existentes del cliente.',
          'El soporte puede incluir orientacion remota, visita tecnica o mantenimiento programado, dependiendo del tipo de incidencia reportada.'
        ]
      },
      {
        title: 'Condiciones de atencion',
        list: [
          'Las visitas se coordinan por agenda previa segun ubicacion, urgencia y disponibilidad.',
          'Algunos casos pueden resolverse primero con validacion remota para ahorrar tiempo al cliente.',
          'Si el sistema presenta danos por terceros o por condiciones externas, el soporte se maneja como servicio tecnico regular.'
        ]
      },
      {
        title: 'Mantenimiento y continuidad',
        paragraphs: [
          'Recomendamos mantenimiento preventivo para prolongar la vida util de camaras, alarmas, cercos y sistemas de acceso.',
          'Cuando un caso requiere piezas, reemplazos o trabajo correctivo fuera de garantia, se informa al cliente antes de continuar.'
        ]
      }
    ]
  },
  'condiciones-servicio': {
    eyebrow: 'Condiciones de servicio',
    title: 'Condiciones de servicio',
    intro: 'Estas condiciones ayudan al cliente a entender el alcance del servicio, la coordinacion de visitas y la forma correcta de trabajar el proyecto.',
    meta: ['Coordinacion previa', 'Alcance sujeto a diagnostico'],
    sections: [
      {
        title: 'Coordinacion del trabajo',
        paragraphs: [
          'Todo servicio se coordina por agenda previa. La fecha de instalacion o revision puede depender de disponibilidad, ubicacion, tipo de proyecto y materiales requeridos.',
          'Las recomendaciones finales pueden ajustarse luego de una llamada, una revision remota o una visita tecnica cuando el caso lo amerite.'
        ]
      },
      {
        title: 'Alcance y presupuesto',
        list: [
          'El presupuesto depende del tipo de propiedad, cantidad de equipos, complejidad del montaje y necesidades del cliente.',
          'Cualquier cambio solicitado luego de aprobar el trabajo puede modificar el alcance y el precio final.',
          'El cliente debe facilitar acceso razonable al area de trabajo para poder ejecutar el servicio correctamente.'
        ]
      },
      {
        title: 'Entrega y seguimiento',
        paragraphs: [
          'Al finalizar, se valida el funcionamiento general del sistema instalado y se orienta al cliente sobre uso basico cuando corresponda.',
          'Si despues de la entrega el cliente necesita ampliaciones, cambios o soporte adicional, el caso se agenda como continuidad del servicio.'
        ]
      }
    ]
  }
};

const POLICY_LINKS = [
  {
    slug: 'garantia-instalacion',
    title: 'Garantia de instalacion',
    summary: 'Respaldo sobre montaje, configuracion y entrega funcional.',
    icon: 'GT'
  },
  {
    slug: 'reembolso',
    title: 'Politica de reembolso',
    summary: 'Condiciones aplicables antes de la instalacion final.',
    icon: 'RB'
  },
  {
    slug: 'soporte-tecnico',
    title: 'Soporte tecnico',
    summary: 'Diagnostico, ajustes y mantenimiento por agenda.',
    icon: 'ST'
  },
  {
    slug: 'condiciones-servicio',
    title: 'Condiciones de servicio',
    summary: 'Alcance, coordinacion y reglas generales del servicio.',
    icon: 'CS'
  }
];

const POLICY_UPDATE_LABEL = '10 de marzo de 2026';

const setPolicyText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value !== undefined) element.textContent = value;
};

const getRequestedPolicy = () => {
  const params = new URLSearchParams(window.location.search);
  return normalizePolicySlug(params.get('policy')) || 'garantia-instalacion';
};

const renderPolicyPage = async () => {
  const contentManager = window.FulltechContentManager;
  if (!contentManager) return;

  const config = await contentManager.loadConfig();
  const requestedPolicy = getRequestedPolicy();
  const fallbackPolicy = POLICY_CONTENT[requestedPolicy] || POLICY_CONTENT['condiciones-servicio'];
  const matchingItem = Array.isArray(config.policies?.items)
    ? config.policies.items.find((item) => getPolicySlugFromTitle(item?.title) === requestedPolicy)
    : null;

  const resolvedPolicy = {
    ...fallbackPolicy,
    title: matchingItem?.title || fallbackPolicy.title,
    intro: matchingItem?.description || fallbackPolicy.intro
  };
  const activePolicyLink = POLICY_LINKS.find((item) => item.slug === requestedPolicy) || POLICY_LINKS[0];

  document.title = `${resolvedPolicy.title} | FULLTECH SRL`;

  setPolicyText('#policy-brand-name', config.brand?.fullName || 'FULLTECH SRL');
  setPolicyText('#policy-brand-subtitle', 'Politicas y condiciones');
  setPolicyText('#policy-eyebrow', resolvedPolicy.eyebrow);
  setPolicyText('#policy-title', resolvedPolicy.title);
  setPolicyText('#policy-intro', resolvedPolicy.intro);
  setPolicyText('#policy-breadcrumb-current', resolvedPolicy.title);
  setPolicyText('#policy-side-title', resolvedPolicy.title);
  setPolicyText('#policy-side-copy', resolvedPolicy.intro);
  setPolicyText('#policy-updated-date', POLICY_UPDATE_LABEL);
  setPolicyText(
    '#policy-legal-contact',
    config.contact?.whatsapp ? `WhatsApp ${config.contact.whatsapp} y contacto directo FULLTECH SRL` : 'WhatsApp y contacto directo FULLTECH SRL'
  );

  const heroIcon = document.getElementById('policy-hero-icon');
  if (heroIcon) {
    heroIcon.textContent = activePolicyLink.icon;
    heroIcon.setAttribute('data-policy-icon', activePolicyLink.icon);
  }

  const whatsappLink = document.getElementById('policy-whatsapp-link');
  if (whatsappLink) {
    whatsappLink.href = createPolicyWhatsAppUrl(
      config.contact?.whatsapp,
      `Hola FULLTECH SRL, quiero una aclaracion sobre la politica ${resolvedPolicy.title}.`
    );
  }

  const sidebarWhatsappLink = document.getElementById('policy-side-whatsapp');
  if (sidebarWhatsappLink) {
    sidebarWhatsappLink.href = createPolicyWhatsAppUrl(
      config.contact?.whatsapp,
      `Hola FULLTECH SRL, quiero una aclaracion sobre la politica ${resolvedPolicy.title}.`
    );
  }

  const policyMeta = document.getElementById('policy-meta');
  if (policyMeta) {
    policyMeta.innerHTML = resolvedPolicy.meta
      .map((item) => `<span class="policy-meta-chip">${escapePolicyHtml(item)}</span>`)
      .join('');
  }

  const policySideTags = document.getElementById('policy-side-tags');
  if (policySideTags) {
    policySideTags.innerHTML = resolvedPolicy.meta
      .map((item) => `<span class="policy-meta-chip">${escapePolicyHtml(item)}</span>`)
      .join('');
  }

  const policySections = document.getElementById('policy-sections');
  if (policySections) {
    policySections.innerHTML = resolvedPolicy.sections
      .map((section) => {
        const paragraphs = Array.isArray(section.paragraphs)
          ? section.paragraphs.map((paragraph) => `<p>${escapePolicyHtml(paragraph)}</p>`).join('')
          : '';
        const list = Array.isArray(section.list)
          ? `<ul class="policy-reading-list">${section.list
              .map((item) => `<li>${escapePolicyHtml(item)}</li>`)
              .join('')}</ul>`
          : '';

        return `
          <section class="policy-reading-section">
            <h2>${escapePolicyHtml(section.title)}</h2>
            ${paragraphs}
            ${list}
          </section>
        `;
      })
      .join('');
  }

  const relatedList = document.getElementById('policy-related-list');
  if (relatedList) {
    relatedList.innerHTML = POLICY_LINKS.map((item) => {
      const activeClass = item.slug === requestedPolicy ? ' is-active' : '';
      return `
        <a class="policy-related-link${activeClass}" href="politica.html?policy=${encodeURIComponent(item.slug)}" aria-current="${item.slug === requestedPolicy ? 'page' : 'false'}">
          <span class="policy-related-icon" data-policy-icon="${escapePolicyHtml(item.icon)}" aria-hidden="true">${escapePolicyHtml(item.icon)}</span>
          <span class="policy-related-copy">
            <strong>${escapePolicyHtml(item.title)}</strong>
            <span>${escapePolicyHtml(item.summary)}</span>
          </span>
        </a>
      `;
    }).join('');
  }
};

renderPolicyPage().catch((error) => {
  console.error('No se pudo renderizar la politica', error);
});