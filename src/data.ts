import { JournalEntry, Project, MagazineArticle } from './types';

export const initialJournalEntries: JournalEntry[] = [
  {
    id: 'log-dosificacion-mortero',
    date: '09.07.2026',
    logNum: 'LOG #101',
    tag: 'TALLER PRÁCTICO',
    title: 'Control de Consistencia y Dosificación de Mortero',
    blocks: [
      {
        id: 'b1',
        type: 'text',
        content: 'Hoy realizamos una práctica intensiva de dosificación en el taller de edificación del I.E.S. Virgen del Mar para conseguir un mortero de cemento tipo M-5. Usando la hormigonera del ciclo formativo, medimos meticulosamente la arena de río y el cemento CEM II/B-L 32,5 N en proporciones 1:4 en volumen.'
      },
      {
        id: 'b2',
        type: 'text',
        content: 'El control del agua es crítico. Al añadir agua poco a poco en el tambor giratorio de la hormigonera, comprobamos cómo pequeñas variaciones de apenas un 5% de agua alteran drásticamente la trabajabilidad. Realizamos el ensayo del Cono de Abrams para medir la consistencia del mortero fresco, obteniendo una consistencia plástica idónea para el levantamiento de fábricas.'
      },
      {
        id: 'b3',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=1200',
        caption: 'Figura 1: Práctica de amasado mecánico mediante la hormigonera del ciclo y vertido en cajas de mortero.',
        metadata: 'DEPARTAMENTO: EDIFICACIÓN Y OBRA CIVIL | I.E.S. VIRGEN DEL MAR'
      },
      {
        id: 'b4',
        type: 'text',
        content: 'Nota técnica para los alumnos: recordad que una dosificación excesivamente rica en cemento aumentará la resistencia pero provocará mayores retracciones mecánicas y fisuras superficiales durante el proceso de curado.'
      }
    ]
  },
  {
    id: 'log-seguridad-epis',
    date: '09.05.2026',
    logNum: 'LOG #102',
    tag: 'SEGURIDAD Y SALUD',
    title: 'Inspección de Equipos de Protección Individual (EPIs)',
    blocks: [
      {
        id: 'sv-1',
        type: 'text',
        content: 'La seguridad es el pilar de toda obra de construcción. En los ciclos formativos de FP Construcción del I.E.S. Virgen del Mar, la cultura preventiva se implanta desde la primera semana. Llevamos a cabo un taller práctico de revisión, ajuste y uso correcto del casco de protección homologado (EN 397) y las botas de seguridad con puntera reforzada.'
      },
      {
        id: 'sv-2',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200',
        caption: 'El casco de seguridad, elemento indispensable para el acceso al patio de prácticas y laboratorios.',
        metadata: 'NORMATIVA: RD 773/1997 | EVALUACIÓN: APTO'
      },
      {
        id: 'sv-3',
        type: 'text',
        content: 'Revisamos los componentes críticos del casco: el barbuquejo, el arnés de suspensión de amortiguación interna y la fecha de caducidad impresa en la visera (generalmente 5 años desde fabricación). Un casco agrietado o que haya sufrido un impacto fuerte debe desecharse inmediatamente del inventario del taller.'
      }
    ]
  },
  {
    id: 'log-replanteo-estacion',
    date: '09.02.2026',
    logNum: 'LOG #103',
    tag: 'TOPOGRAFÍA',
    title: 'Replanteo Geométrico de Cimentación con Estación Total',
    blocks: [
      {
        id: 'ab-1',
        type: 'text',
        content: 'Los alumnos de segundo año de Técnico Superior en Proyectos de Edificación llevaron a cabo el replanteo a escala real de una zapata aislada y una viga de atado en el solar del patio de prácticas. Conectamos la estación total Leica para definir los ejes de simetría y las líneas de excavación utilizando clavos de acero y camillas de replanteo.'
      },
      {
        id: 'ab-2',
        type: 'text',
        content: 'El replanteo técnico exige rigor absoluto. Un error milimétrico en esta fase inicial se magnifica exponencialmente conforme la estructura crece en altura.'
      },
      {
        id: 'ab-3',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200',
        caption: 'Ajuste de niveles y plomos en camillas de madera para el replanteo técnico de zapatas.',
        metadata: 'INSTRUMENTACIÓN: ESTACIÓN TOTAL LEICA | TOLERANCIA: < 3mm'
      }
    ]
  }
];

export const initialProjects: Project[] = [
  {
    id: 'proyecto-modulo-practicas',
    title: 'Taller de Albañilería: Muro de Fábrica y Encuentros',
    number: 'Práctica de Taller № 1',
    location: 'Nave de Prácticas, I.E.S. Virgen del Mar',
    year: 'Curso 2025/2026',
    area: 'Área de Taller: 25 m²',
    status: 'Evaluado con Sobresaliente',
    materials: [
      { num: '01', name: 'Ladrillo Perforado', type: 'FÁBRICA DE LADRILLO' },
      { num: '02', name: 'Mortero de Cemento M-5', type: 'LIGANTE INDUSTRIAL' },
      { num: '03', name: 'Armadura de Tendel (Murfor)', type: 'REFUERZO ANTIFISURAS' },
      { num: '04', name: 'Mirajes y Plomadas', type: 'HERRAMIENTAS DE CONTROL' }
    ],
    concept: 'El proyecto formativo estrella del ciclo de Grado Medio de Construcción consiste en el replanteo y levantamiento de un módulo constructivo completo a escala real. El módulo integra un muro de fábrica de ladrillo visto con aparejo flamenco, un pilar de hormigón armado con encofrado artesanal de madera, y el remate mediante juntas técnicas de dilatación.',
    materialsDesc: 'Se ha seleccionado ladrillo cerámico perforado de alta calidad, caracterizado por una absorción de agua controlada. La dosificación del mortero se ha realizado in situ en la hormigonera del departamento, controlando la consistencia para lograr una adherencia excelente y juntas uniformes de 1.5 cm de espesor.',
    systemsDesc: 'El control de plomo y nivelación geométrica se ha realizado de forma manual mediante plomada tradicional e instrumentos láser de precisión. Para prevenir fisuras por flexo-tracción y asientos diferenciales en el encuentro entre materiales dispares (ladrillo y hormigón), se ha dispuesto armadura electrosoldada Murfor en los tendeles de ladrillo cada tres hiladas.',
    challengesDesc: 'El principal reto constructivo residió en asegurar la estanqueidad y correcta entrega de la fábrica de ladrillo con el pilar de hormigón vertido previamente. Los alumnos diseñaron y colocaron una junta técnica elástica de neopreno celular y fijaciones metálicas de acero galvanizado para permitir el libre movimiento estructural entre la fábrica y el esqueleto de hormigón.',
    heroImage: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=1200',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200',
        caption: 'Replanteo y control de alineación del muro mediante hilos y miras metálicas.',
        figNum: 'FIG 01'
      },
      {
        src: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=1200',
        caption: 'Encofrado de pilar de hormigón y colocación de armaduras metálicas en el taller.',
        figNum: 'FIG 02'
      },
      {
        src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200',
        caption: 'Detalle de la junta elástica y el acabado del llagado de juntas a media caña.',
        figNum: 'FIG 03'
      }
    ],
    comments: [
      {
        id: 'c1',
        author: 'PROF. ALBERTO GARCÍA (Dpto. Edificación)',
        avatarInitials: 'AG',
        date: '20 JUN 2026',
        content: 'Un trabajo impecable en el llagado y la limpieza de la cara vista del ladrillo. La plomada del muro cumple estrictamente los márgenes de tolerancia de la LOE.'
      },
      {
        id: 'c2',
        author: 'MARÍA SÁNCHEZ (Alumna Ciclo Superior)',
        avatarInitials: 'MS',
        date: '22 JUN 2026',
        content: 'La práctica nos ayudó enormemente a entender los problemas reales de coordinación en obra. Organizar el vertido con la hormigonera portátil del ciclo fue una gran lección.'
      }
    ]
  }
];

export const initialArticles: MagazineArticle[] = [
  {
    id: 'dosificacion-hormigonera',
    tag: 'TALLER DE MATERIALES',
    category: 'TECNOLOGÍA DE MEZCLAS',
    title: 'El Arte de la Hormigonera: Dosificación y Trabajabilidad del Hormigón',
    excerpt: 'Estudiamos cómo la correcta dosificación de cemento, agua y áridos determina la consistencia del hormigón y su puesta en obra en zapatas.',
    author: 'Dpto. Edificación y Obra Civil',
    readTime: '8 MIN LECTURA',
    heroImage: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'cultura-preventiva-casco',
    tag: 'PREVENCIÓN',
    category: 'SEGURIDAD EN OBRA',
    title: 'Cultura Preventiva: El Casco y la Protección de la Cabeza en Edificación',
    excerpt: 'Analizamos las normativas del uso de cascos en obra (EN 397) y su asimilación en los talleres formativos del I.E.S. Virgen del Mar.',
    author: 'Dpto. Prevención de Riesgos',
    readTime: '5 MIN LECTURA',
    heroImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'empleo-fp-construccion',
    tag: 'EMPLEABILIDAD',
    category: 'SALIDAS PROFESIONALES',
    title: 'Salidas Profesionales en Construcción: De Alumno a Jefe de Obra',
    excerpt: 'El sector de la edificación y la obra civil experimenta una demanda sin precedentes de técnicos calificados en replanteos y control de ejecución.',
    author: 'Departamento de Orientación',
    readTime: '6 MIN LECTURA',
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200'
  }
];

export const featuredProjects = [
  {
    id: 'obra-adra',
    title: 'Replanteo de Vivienda en Almería',
    architect: 'Alumnos del Ciclo Superior Proyectos',
    year: '2026',
    country: 'ALMERÍA',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'maqueta-cubierta',
    title: 'Maqueta de Estructura de Cubierta de Madera',
    architect: 'Alumnos del Ciclo de Construcción',
    year: '2026',
    country: 'TALLER FP',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200'
  }
];
