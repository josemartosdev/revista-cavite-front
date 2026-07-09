import { useState, FormEvent } from 'react';
import { ArrowUpRight, Check, Hammer, Award, ShieldCheck, HelpCircle, HardHat, RefreshCw, Layers } from 'lucide-react';
import { initialArticles, featuredProjects } from '../data';
import { MagazineArticle } from '../types';

interface HomeFeedProps {
  onArticleClick: (article: MagazineArticle) => void;
  onProjectClick: (projectId: string) => void;
  onNavClick: (tab: 'home' | 'portfolio' | 'notebook' | 'editor') => void;
}

export default function HomeFeed({ onArticleClick, onProjectClick, onNavClick }: HomeFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSuccess, setNewsletterSuccess] = useState<boolean>(false);

  // Modal control states
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [showSafetyChecklist, setShowSafetyChecklist] = useState<boolean>(false);
  const [showDeptInfo, setShowDeptInfo] = useState<boolean>(false);

  // Calculator states
  const [mixType, setMixType] = useState<'concrete-structure' | 'concrete-floor' | 'mortar-m5' | 'mortar-m7'>(
    'concrete-structure'
  );
  const [volume, setVolume] = useState<number>(1.0);

  // Checklist states
  const [safetyChecks, setSafetyChecks] = useState({
    helmet: false,
    boots: false,
    glasses: false,
    gloves: false,
    mask: false,
  });

  const categories = ['ALL', 'TECNOLOGÍA DE MEZCLAS', 'SEGURIDAD EN OBRA', 'SALIDAS PROFESIONALES'];

  const filteredArticles = selectedCategory === 'ALL'
    ? initialArticles
    : initialArticles.filter(art => art.category === selectedCategory);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setTimeout(() => {
        setNewsletterSuccess(false);
        setNewsletterEmail('');
      }, 5000);
    }
  };

  const mainFeaturedArticle = initialArticles[0]; // El Arte de la Hormigonera

  // Calculator logic based on standard real-world construction dosages:
  // - structural concrete (1:2:3): ~300kg cement, 650kg sand, 1100kg gravel, 180L water per m3
  // - floor concrete (1:3:4): ~250kg cement, 750kg sand, 1150kg gravel, 175L water per m3
  // - mortar M-5 (1:4): ~350kg cement, 1400kg sand, 0kg gravel, 220L water per m3
  // - mortar M-7.5 (1:3): ~450kg cement, 1350kg sand, 0kg gravel, 225L water per m3
  const calculateMaterials = () => {
    let cementRatio = 0, sandRatio = 0, gravelRatio = 0, waterRatio = 0;

    switch (mixType) {
      case 'concrete-structure':
        cementRatio = 300; sandRatio = 650; gravelRatio = 1100; waterRatio = 180;
        break;
      case 'concrete-floor':
        cementRatio = 250; sandRatio = 750; gravelRatio = 1150; waterRatio = 175;
        break;
      case 'mortar-m5':
        cementRatio = 350; sandRatio = 1400; gravelRatio = 0; waterRatio = 220;
        break;
      case 'mortar-m7':
        cementRatio = 450; sandRatio = 1350; gravelRatio = 0; waterRatio = 225;
        break;
    }

    const cementKg = Math.round(cementRatio * volume);
    const sandKg = Math.round(sandRatio * volume);
    const gravelKg = Math.round(gravelRatio * volume);
    const waterL = Math.round(waterRatio * volume);

    const bags25kg = Math.ceil(cementKg / 25);
    // Standard construction wheelbarrow is ~60 liters or approx 90 kg of dry aggregate
    const sandWheelbarrows = sandKg > 0 ? Math.round(sandKg / 90) : 0;
    const gravelWheelbarrows = gravelKg > 0 ? Math.round(gravelKg / 90) : 0;

    return { cementKg, sandKg, gravelKg, waterL, bags25kg, sandWheelbarrows, gravelWheelbarrows };
  };

  const results = calculateMaterials();

  // Reset checklist helper
  const resetSafetyChecklist = () => {
    setSafetyChecks({
      helmet: false,
      boots: false,
      glasses: false,
      gloves: false,
      mask: false,
    });
  };

  const allSafetyChecked = Object.values(safetyChecks).every(val => val === true);

  return (
    <div className="w-full bg-white min-h-screen pt-28 pb-12" id="home-feed-view">
      
      {/* 🎨 INTERACTIVE MONDRIAN WELCOME PANEL (CENTERPIECE FROM USER IMAGE) */}
      <section className="px-4 md:px-8 mt-2 mb-12">
        <div className="border-[4px] border-black bg-black grid grid-cols-1 md:grid-cols-12 gap-[4px] overflow-hidden shadow-xl" id="mondrian-banner-grid">
          
          {/* Box 1: Large RED Block - welcomes users */}
          <div className="md:col-span-5 bg-[#ef4444] p-6 md:p-8 flex flex-col justify-between text-white min-h-[220px]">
            <div className="space-y-3">
              <span className="tag-black !py-0.5">
                SALA DE RECURSOS
              </span>
              <h2 className="font-serif font-black text-3xl md:text-4xl leading-none">
                CONSTRUIMOS TU FUTURO
              </h2>
              <p className="font-sans text-xs md:text-sm leading-relaxed text-red-50 font-medium">
                Explora los talleres del ciclo formativo de Edificación y Obra Civil. Haz clic en la <strong>Hormigonera</strong> o en el <strong>Casco</strong> para activar las herramientas técnicas interactivas de nuestros alumnos.
              </p>
            </div>
            <button 
              onClick={() => setShowDeptInfo(true)}
              className="btn-outline-white mt-6 w-fit px-4 py-2"
            >
              PLAN DE ESTUDIOS
            </button>
          </div>

          {/* Box 2: White Block - Text Title (Mondrian composition top right) */}
          <div className="md:col-span-7 bg-white p-6 md:p-8 flex flex-col justify-center border-b-[2px] md:border-b-0 border-black">
            <h1 className="font-sans font-black text-3xl md:text-5xl text-black leading-none uppercase tracking-tighter">
              Ciclos FP
            </h1>
            <h2 className="font-sans font-black text-2xl md:text-4xl text-black leading-none uppercase tracking-tighter mt-1">
              Edificación y Construcción
            </h2>
            <div className="w-16 h-[6px] bg-[#ef4444] mt-4"></div>
            <p className="font-sans text-xs md:text-sm text-gray-700 mt-4 leading-relaxed font-semibold">
              I.E.S. Virgen del Mar // Almería, España.
            </p>
          </div>

          {/* Box 3: CONCRETE MIXER Interactive Block (Middle Left) */}
          <div 
            onClick={() => setShowCalculator(true)}
            className="md:col-span-5 bg-white p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-yellow-50 group transition-colors min-h-[200px]"
            title="Abrir Dosificador de Hormigón"
          >
            {/* Custom SVG Concrete Mixer exactly like the image outline */}
            <svg viewBox="0 0 100 100" className="w-24 h-24 text-black group-hover:scale-105 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Support legs */}
              <path d="M25 75 L38 75 M38 75 L38 55 M38 75 L25 83" />
              <circle cx="25" cy="83" r="3.5" fill="none" />
              <path d="M38 55 L65 55 M65 55 L65 75 M65 75 L78 75" />
              {/* Handwheel */}
              <circle cx="75" cy="55" r="4" />
              <path d="M75 51 L75 59" />
              <path d="M71 55 L79 55" />
              {/* Main Drum Container */}
              <path d="M35 38 L43 23 L57 23 L65 38 L60 55 L40 55 Z" />
              <path d="M43 23 L57 23" strokeWidth="4" />
              <line x1="37" y1="45" x2="63" y2="45" />
              {/* Motor Box */}
              <rect x="15" y="48" width="10" height="15" rx="1" />
              <path d="M20 63 L20 75" />
            </svg>
            
            <span className="font-mono text-[10px] font-black tracking-widest text-black uppercase mt-4 block border-2 border-black px-3 py-1 bg-white group-hover:bg-[#facc15] transition-colors">
              ⚙️ CALCULAR MEZCLAS (HORMIGONERA)
            </span>
          </div>

          {/* Box 4: I.E.S. Virgen del Mar Logo Block (Middle Right) */}
          <div className="md:col-span-7 bg-white p-6 md:p-8 flex flex-col justify-between min-h-[180px]">
            {/* Custom SVG logo based on Wave and title line */}
            <div className="flex flex-col space-y-4">
              <svg viewBox="0 0 200 60" className="w-48 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Handdrawn styled Wave */}
                <path d="M10,35 C35,35 45,15 65,38 C50,22 40,43 20,48 C40,43 60,18 80,38 C60,23 50,43 30,53 C60,48 90,23 115,43 C90,33 70,53 50,58" fill="currentColor" stroke="none" />
                {/* Horizontal line extending below wave */}
                <path d="M50,53 L190,53" strokeWidth="2" />
              </svg>
              <p className="font-mono text-[10px] tracking-widest font-black uppercase text-gray-700">
                I.E.S. Virgen del Mar — Almería
              </p>
            </div>
            <div className="font-mono text-[11px] text-gray-600 bg-gray-100 p-2 border-l-4 border-black">
              Centro Público de Formación Técnica y Profesional de Alta Cualificación.
            </div>
          </div>

          {/* Box 5: Yellow Block (Bottom Left-Middle) */}
          <div className="md:col-span-3 bg-[#facc15] p-6 flex flex-col justify-between text-black min-h-[160px]">
            <span className="font-mono text-[9px] font-black tracking-widest uppercase bg-black text-white px-2 py-0.5 w-fit">
              REGLA DE ORO
            </span>
            <p className="font-serif italic text-base font-bold leading-tight mt-2">
              "La plomada no miente, y un milímetro de desfase en la base son diez centímetros en cubierta."
            </p>
            <span className="font-mono text-[9px] font-semibold uppercase tracking-wider block mt-2 text-right">
              — Dpto. Edificación
            </span>
          </div>

          {/* Box 6: SAFETY HELMET Interactive Block (Bottom Right-Middle) */}
          <div 
            onClick={() => setShowSafetyChecklist(true)}
            className="md:col-span-5 bg-white p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 group transition-colors min-h-[160px]"
            title="Abrir Control de Seguridad / EPIs"
          >
            {/* Custom SVG Safety Helmet */}
            <svg viewBox="0 0 100 100" className="w-20 h-20 text-black group-hover:scale-105 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Helmet Dome */}
              <path d="M18 62 C18 30 38 25 50 25 C62 25 82 30 82 62" />
              {/* Brim / Visor */}
              <path d="M12 62 C28 62 48 65 88 56 C88 61 78 67 50 67 C22 67 12 62 12 62 Z" fill="none" />
              {/* Outer Top Ridge */}
              <path d="M50 25 L50 62" strokeWidth="4" />
              {/* Lateral Ridges */}
              <path d="M36 29 C41 35 43 45 43 62" />
              <path d="M64 29 C59 35 57 45 57 62" />
            </svg>
            
            <span className="font-mono text-[10px] font-black tracking-widest text-black uppercase mt-3 block border-2 border-black px-3 py-1 bg-white group-hover:bg-[#2563eb] group-hover:text-white transition-colors">
              👷‍♂️ AUTOEVALUACIÓN DE SEGURIDAD (EPIS)
            </span>
          </div>

          {/* Box 7: Blue Block (Bottom Right) */}
          <div className="md:col-span-4 bg-[#2563eb] p-6 flex flex-col justify-between text-white min-h-[160px]">
            <span className="font-mono text-[9px] font-black tracking-widest uppercase bg-white text-[#2563eb] px-2 py-0.5 w-fit">
              DATO DE INSERCIÓN
            </span>
            <div className="space-y-1">
              <p className="font-sans font-black text-4xl leading-none">100%</p>
              <p className="font-mono text-[10px] uppercase tracking-wider font-bold">
                Empleabilidad Inmediata
              </p>
            </div>
            <p className="font-sans text-[11px] leading-tight text-blue-100 font-medium">
              El mercado laboral absorbe la totalidad de nuestros egresados al finalizar las prácticas en empresa (FCT).
            </p>
          </div>

        </div>
      </section>

      {/* Hero Featured Article Section */}
      <section className="px-4 md:px-8 mt-12">
        <div className="border-[3px] border-black grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden bg-white">
          <div className="lg:col-span-7 group cursor-pointer overflow-hidden border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-black" onClick={() => onArticleClick(mainFeaturedArticle)}>
            <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102" 
                src={mainFeaturedArticle.heroImage} 
                alt={mainFeaturedArticle.title}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between bg-white">
            <div className="space-y-4">
              <div className="flex gap-2">
                <span className="tag-red">
                  {mainFeaturedArticle.tag}
                </span>
                <span className="tag-black">
                  DESTACADO
                </span>
              </div>
              <h1 
                onClick={() => onArticleClick(mainFeaturedArticle)}
                className="font-serif font-black text-2xl md:text-3xl lg:text-4xl text-black hover:text-[#ef4444] cursor-pointer transition-colors leading-tight"
              >
                {mainFeaturedArticle.title}
              </h1>
              <p className="font-sans text-sm text-gray-600 leading-relaxed font-medium">
                {mainFeaturedArticle.excerpt}
              </p>
            </div>
            <button 
              onClick={() => onArticleClick(mainFeaturedArticle)}
              className="btn-outline mt-8 w-fit px-6 py-3.5"
            >
              LEER LECCIÓN TÉCNICA
            </button>
          </div>
        </div>
      </section>

      {/* Categories Scroller - Styled with Mondrian Borders */}
      <section className="mt-16 border-t-[3px] border-b-[3px] border-black py-4 bg-[#fafaf9]">
        <div className="px-4 md:px-8 overflow-x-auto no-scrollbar flex items-center gap-6">
          <span className="font-mono text-xs font-black text-black tracking-widest uppercase shrink-0 flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#facc15] border border-black"></div>
            CATEGORÍAS:
          </span>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-mono text-[10px] font-bold tracking-widest uppercase whitespace-nowrap transition-colors py-2 px-4 border-2 border-black cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {cat === 'ALL' ? 'VER TODO' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Student Projects / Maquetas */}
      <section className="px-4 md:px-8 mt-16">
        <div className="flex justify-between items-end mb-8 border-b-[3px] border-black pb-4">
          <div>
            <span className="label-section">
              01 // PRÁCTICAS ESTRELLA
            </span>
            <h2 className="font-serif font-black text-2xl md:text-3xl text-black">
              Módulos Realizados por Alumnos
            </h2>
          </div>
          <button 
            onClick={() => onNavClick('portfolio')}
            className="font-mono text-xs font-black tracking-widest uppercase underline decoration-2 underline-offset-4 text-black hover:text-[#2563eb]"
          >
            VER PROYECTO COMPLETO
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map((project) => (
            <div 
              key={project.id} 
              className="border-[3px] border-black bg-white overflow-hidden group cursor-pointer" 
              onClick={() => onProjectClick('proyecto-modulo-practicas')} // Redirects to our high-fidelity student project
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-100 border-b-[3px] border-black">
                <img 
                  className="w-full h-full object-cover group-hover:scale-102 transition-all duration-500" 
                  src={project.image} 
                  alt={project.title}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 flex justify-between items-start bg-white">
                <div>
                    <span className="tag-yellow">
                    {project.country}
                  </span>
                  <h3 className="font-serif font-black text-lg md:text-xl text-black mt-2 group-hover:text-[#2563eb] transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="font-sans text-xs text-gray-600 font-medium mt-1">{project.architect}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-xs font-black text-black">{project.year}</p>
                  <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest mt-1">CURSO FP</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Articles Grid / Revista */}
      <section className="px-4 md:px-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t-[3px] border-black pt-12">
          
          <div className="lg:col-span-3">
            <span className="label-section">
              02 // REVISTA TÉCNICA
            </span>
            <h2 className="font-serif font-black text-2xl md:text-3xl text-black leading-tight">
              Lecciones de Edificación
            </h2>
            <p className="font-sans text-xs text-gray-600 leading-relaxed mt-4 font-medium hidden lg:block">
              Publicaciones periódicas redactadas por el profesorado del departamento técnico de Edificación y Obra Civil para reforzar los conceptos de taller.
            </p>
          </div>

          <div className="lg:col-span-9 flex flex-col divide-y-[3px] divide-black border-t-[3px] md:border-t-0 border-b-[3px] border-black divide-black">
            {filteredArticles.map((art) => (
              <article 
                key={art.id} 
                className="py-6 grid grid-cols-1 md:grid-cols-4 gap-6 group cursor-pointer bg-white hover:bg-gray-50/50 transition-colors"
                onClick={() => onArticleClick(art)}
              >
                <div className="md:col-span-1 aspect-square bg-gray-100 border-2 border-black overflow-hidden max-w-[140px] md:max-w-none">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" 
                    src={art.heroImage} 
                    alt={art.title}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="md:col-span-3 flex flex-col justify-between py-1">
                  <div>
                    <span className="tag-red-light">
                      {art.tag}
                    </span>
                    <h4 className="font-serif font-black text-xl text-black mt-2 group-hover:text-[#ef4444] transition-colors leading-snug">
                      {art.title}
                    </h4>
                    <p className="font-sans text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed font-medium">
                      {art.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-4 border-t border-gray-100 pt-3">
                    <span className="font-mono text-[10px] text-black font-bold uppercase">
                      Por {art.author}
                    </span>
                    <span className="w-1.5 h-1.5 bg-black"></span>
                    <span className="font-mono text-[10px] font-bold text-gray-500 uppercase">
                      {art.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* Newsletter Section */}
      <section className="mt-20 bg-white border-t-[3px] border-b-[3px] border-black py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <span className="font-mono text-xs font-black tracking-widest text-[#ef4444] mb-2 block uppercase">
            SINDICACIÓN
          </span>
          <h2 className="font-serif font-black text-2xl md:text-3xl text-black mb-6">
            Recibe alertas de convocatorias, cursos y becas de edificación
          </h2>
          
          {newsletterSuccess ? (
            <div className="p-6 bg-[#fafaf8] border-2 border-black text-center" id="newsletter-success">
              <p className="font-serif italic font-bold text-[#ef4444] text-lg">¡Suscripción completada!</p>
              <p className="font-mono text-[10px] text-gray-600 mt-2 font-bold uppercase">
                Te mantendremos al tanto de las novedades del departamento del I.E.S. Virgen del Mar.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3 items-end" id="newsletter-form">
              <div className="w-full text-left">
                <label className="font-mono text-[9px] font-black text-black tracking-widest mb-1 block uppercase">
                  DIRECCIÓN DE CORREO ELECTRÓNICO
                </label>
                <input 
                  className="form-input" 
                  placeholder="alumno@iesvirgendelmar.es" 
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
              </div>
              <button 
                className="btn-primary px-8 py-3.5 h-[48px]"
                type="submit"
              >
                SUSCRIBIRME
              </button>
            </form>
          )}
          
          {!newsletterSuccess && (
            <p className="font-mono text-[10px] text-gray-500 mt-4 italic font-bold uppercase">
              Boletín académico libre de spam. Datos protegidos según RGPD.
            </p>
          )}
        </div>
      </section>

      {/* ⚙️ MODAL 1: INTERACTIVE CONCRETE MIX CALCULATOR */}
      {showCalculator && (
        <div className="modal-overlay">
          <div className="modal-box max-w-xl animate-fade-in">
            {/* Header bar styled like a Mondrian banner */}
            <div className="modal-header bg-[#facc15] text-black">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-black" />
                <span className="font-mono text-xs font-black uppercase tracking-widest">
                  DOSIFICADOR INTERACTIVO // HOR-IES-01
                </span>
              </div>
              <button 
                onClick={() => setShowCalculator(false)}
                className="btn-close"
              >
                [ CERRAR ]
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="font-sans text-xs font-semibold text-gray-700 leading-relaxed">
                Herramienta oficial de dosificación práctica para alumnos en prácticas. Selecciona el tipo de mezcla y el volumen en metros cúbicos ($m^3$) para amasar en la hormigonera del ciclo formativo:
              </p>

              {/* Selection */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-black text-black block uppercase">
                  TIPO DE MEZCLA / RESISTENCIA:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => setMixType('concrete-structure')}
                    className={`text-left p-3 border-2 border-black font-sans text-xs flex flex-col justify-between transition-colors ${
                      mixType === 'concrete-structure' ? 'bg-[#ef4444] text-white' : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-mono font-black text-[10px] uppercase">Hormigón Estructural fck 25MPa</span>
                    <span className="mt-1 font-medium opacity-90">Zapatas, pilares y vigas (Relación 1:2:3)</span>
                  </button>
                  <button
                    onClick={() => setMixType('concrete-floor')}
                    className={`text-left p-3 border-2 border-black font-sans text-xs flex flex-col justify-between transition-colors ${
                      mixType === 'concrete-floor' ? 'bg-[#ef4444] text-white' : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-mono font-black text-[10px] uppercase">Hormigón para Aceras/Suelos</span>
                    <span className="mt-1 font-medium opacity-90">Pavimentos y soleras de patio (Relación 1:3:4)</span>
                  </button>
                  <button
                    onClick={() => setMixType('mortar-m5')}
                    className={`text-left p-3 border-2 border-black font-sans text-xs flex flex-col justify-between transition-colors ${
                      mixType === 'mortar-m5' ? 'bg-[#ef4444] text-white' : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-mono font-black text-[10px] uppercase">Mortero de Cemento M-5</span>
                    <span className="mt-1 font-medium opacity-90">Fábricas de ladrillo y tabiques (Relación 1:4)</span>
                  </button>
                  <button
                    onClick={() => setMixType('mortar-m7')}
                    className={`text-left p-3 border-2 border-black font-sans text-xs flex flex-col justify-between transition-colors ${
                      mixType === 'mortar-m7' ? 'bg-[#ef4444] text-white' : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-mono font-black text-[10px] uppercase">Mortero Reforzado M-7.5</span>
                    <span className="mt-1 font-medium opacity-90">Muros exteriores y de carga (Relación 1:3)</span>
                  </button>
                </div>
              </div>

              {/* Volume Slider */}
              <div className="space-y-2 border-t-2 border-black pt-4">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[10px] font-black text-black block uppercase">
                    VOLUMEN REQUERIDO:
                  </label>
                  <span className="font-mono font-black text-sm bg-black text-[#facc15] px-3 py-1">
                    {volume.toFixed(1)} m³
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="5.0" 
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-black h-2 bg-gray-200 border border-black rounded-none appearance-none cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[9px] text-gray-500 font-bold uppercase">
                  <span>0.1 m³ (Capacidad hormigonera pequeña)</span>
                  <span>5.0 m³ (Unidad camion hormigón)</span>
                </div>
              </div>

              {/* Results Grid - Styled in beautiful Mondrian cards */}
              <div className="border-2 border-black bg-black p-1 grid grid-cols-2 gap-1 text-center font-mono">
                
                {/* Cement Block (Yellow) */}
                <div className="bg-white p-3 border border-black text-black">
                  <span className="text-[10px] font-black block text-gray-500">CEMENTO</span>
                  <span className="text-xl font-black text-[#ef4444] block my-1">{results.cementKg} kg</span>
                  <span className="text-[9px] font-bold block bg-gray-100 p-1 border border-gray-300">
                    ~ {results.bags25kg} sacos de 25kg
                  </span>
                </div>

                {/* Sand Block (White) */}
                <div className="bg-white p-3 border border-black text-black">
                  <span className="text-[10px] font-black block text-gray-500">ARENA DE RÍO</span>
                  <span className="text-xl font-black text-black block my-1">{results.sandKg} kg</span>
                  {results.sandWheelbarrows > 0 ? (
                    <span className="text-[9px] font-bold block bg-gray-100 p-1 border border-gray-300">
                      ~ {results.sandWheelbarrows} carretillas
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold block bg-red-100 text-red-700 p-1">No requiere</span>
                  )}
                </div>

                {/* Gravel Block (White) */}
                <div className="bg-white p-3 border border-black text-black">
                  <span className="text-[10px] font-black block text-gray-500">GRAVA ESPESOR MEDIO</span>
                  <span className="text-xl font-black text-black block my-1">{results.gravelKg} kg</span>
                  {results.gravelWheelbarrows > 0 ? (
                    <span className="text-[9px] font-bold block bg-gray-100 p-1 border border-gray-300">
                      ~ {results.gravelWheelbarrows} carretillas
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold block bg-red-100 text-red-700 p-1">No requiere</span>
                  )}
                </div>

                {/* Water Block (Blue) */}
                <div className="bg-white p-3 border border-black text-black">
                  <span className="text-[10px] font-black block text-gray-500">AGUA</span>
                  <span className="text-xl font-black text-[#2563eb] block my-1">{results.waterL} Litros</span>
                  <span className="text-[9px] font-bold block bg-blue-50 text-blue-800 p-1 border border-blue-200">
                    a/c aprox.: {mixType.includes('mortar') ? '0.55' : '0.50'}
                  </span>
                </div>

              </div>

              <div className="font-mono text-[9px] text-gray-500 uppercase font-bold leading-relaxed">
                * Las dosificaciones mostradas son indicativas basadas en densidades aparentes de áridos sueltos húmedos. Realice siempre los ensayos de resistencia en obra mediante probetas normalizadas según CTE/Código Estructural.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 👷‍♂️ MODAL 2: SAFETY CHECKLIST / AUTOEVALUACIÓN EPIS */}
      {showSafetyChecklist && (
        <div className="modal-overlay">
          <div className="modal-box max-w-md animate-fade-in">
            {/* Header styled like a Mondrian banner */}
            <div className="modal-header bg-[#2563eb] text-white">
              <div className="flex items-center gap-2">
                <HardHat className="w-5 h-5 text-white" />
                <span className="font-mono text-xs font-black uppercase tracking-widest">
                  CONTROL DE ACCESO // EPI COMPLIANCE
                </span>
              </div>
              <button 
                onClick={() => setShowSafetyChecklist(false)}
                className="btn-close-inv"
              >
                [ CERRAR ]
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="font-serif font-black text-lg text-black uppercase">
                  Lista de Verificación de Equipos
                </h3>
                <p className="font-sans text-xs text-gray-600 leading-relaxed font-semibold">
                  Antes de entrar a la nave de encofrados o al foso de replanteos del <strong>I.E.S. Virgen del Mar</strong>, todo alumno debe cumplimentar su examen obligatorio de Equipos de Protección Individual:
                </p>
              </div>

              {/* Checklist Items */}
              <div className="space-y-3 font-sans text-xs">
                
                {/* 1. Casco */}
                <label 
                  className={`flex items-start gap-3 p-3 border-2 border-black cursor-pointer transition-colors ${
                    safetyChecks.helmet ? 'bg-green-50/70 border-green-600' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={safetyChecks.helmet}
                    onChange={(e) => setSafetyChecks({...safetyChecks, helmet: e.target.checked})}
                    className="mt-0.5 accent-green-600 w-4 h-4"
                  />
                  <div>
                    <span className="font-mono font-black text-[10px] block text-black uppercase">1. Casco de Seguridad (EN 397)</span>
                    <span className="text-gray-600 font-medium leading-normal block mt-0.5">
                      Sujeto con arnés de protección interna, barbuquejo ajustado y sin fisuras ni caducidad excedida.
                    </span>
                  </div>
                </label>

                {/* 2. Botas */}
                <label 
                  className={`flex items-start gap-3 p-3 border-2 border-black cursor-pointer transition-colors ${
                    safetyChecks.boots ? 'bg-green-50/70 border-green-600' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={safetyChecks.boots}
                    onChange={(e) => setSafetyChecks({...safetyChecks, boots: e.target.checked})}
                    className="mt-0.5 accent-green-600 w-4 h-4"
                  />
                  <div>
                    <span className="font-mono font-black text-[10px] block text-black uppercase">2. Calzado con Puntera Reforzada</span>
                    <span className="text-gray-600 font-medium leading-normal block mt-0.5">
                      Botas de seguridad con puntera de acero contra aplastamiento de áridos y suela de agarre metálica.
                    </span>
                  </div>
                </label>

                {/* 3. Gafas */}
                <label 
                  className={`flex items-start gap-3 p-3 border-2 border-black cursor-pointer transition-colors ${
                    safetyChecks.glasses ? 'bg-green-50/70 border-green-600' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={safetyChecks.glasses}
                    onChange={(e) => setSafetyChecks({...safetyChecks, glasses: e.target.checked})}
                    className="mt-0.5 accent-green-600 w-4 h-4"
                  />
                  <div>
                    <span className="font-mono font-black text-[10px] block text-black uppercase">3. Gafas Oculares Herméticas</span>
                    <span className="text-gray-600 font-medium leading-normal block mt-0.5">
                      Obligatorias durante el vertido de aglomerantes, el aserrado de miras o el batido en la hormigonera.
                    </span>
                  </div>
                </label>

                {/* 4. Guantes */}
                <label 
                  className={`flex items-start gap-3 p-3 border-2 border-black cursor-pointer transition-colors ${
                    safetyChecks.gloves ? 'bg-green-50/70 border-green-600' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={safetyChecks.gloves}
                    onChange={(e) => setSafetyChecks({...safetyChecks, gloves: e.target.checked})}
                    className="mt-0.5 accent-green-600 w-4 h-4"
                  />
                  <div>
                    <span className="font-mono font-black text-[10px] block text-black uppercase">4. Guantes de Obra (Nitrilo/Piel)</span>
                    <span className="text-gray-600 font-medium leading-normal block mt-0.5">
                      Protección contra abrasiones de ladrillo y la alcalinidad agresiva del mortero húmedo.
                    </span>
                  </div>
                </label>

                {/* 5. Mascarilla */}
                <label 
                  className={`flex items-start gap-3 p-3 border-2 border-black cursor-pointer transition-colors ${
                    safetyChecks.mask ? 'bg-green-50/70 border-green-600' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    checked={safetyChecks.mask}
                    onChange={(e) => setSafetyChecks({...safetyChecks, mask: e.target.checked})}
                    className="mt-0.5 accent-green-600 w-4 h-4"
                  />
                  <div>
                    <span className="font-mono font-black text-[10px] block text-black uppercase">5. Mascarilla FFP2 para Polvo</span>
                    <span className="text-gray-600 font-medium leading-normal block mt-0.5">
                      Para la dosificación de cemento seco y áridos finos en suspensión en la tolva de carga.
                    </span>
                  </div>
                </label>

              </div>

              {/* Compliance Status */}
              {allSafetyChecked ? (
                <div className="p-4 bg-green-100 border-2 border-green-700 text-green-900 flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-green-700 shrink-0" />
                  <div>
                    <p className="font-mono text-[10px] font-black uppercase">ACCESO CONCEDIDO ✔</p>
                    <p className="font-sans text-[11px] font-bold mt-0.5">
                      EPIs verificados por autodiagnóstico. Cumple normativa de seguridad académica I.E.S. Virgen del Mar. ¡Buen trabajo en el taller!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border-2 border-yellow-500 text-yellow-900 flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-yellow-600 shrink-0" />
                  <div>
                    <p className="font-mono text-[9px] font-black uppercase">ACCESO DETENIDO 🛑</p>
                    <p className="font-sans text-[11px] font-semibold mt-0.5 text-gray-700">
                      Por favor, marque los 5 controles de seguridad requeridos para obtener su pase de entrada simulado para el patio de construcción.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button 
                  onClick={resetSafetyChecklist}
                  className="btn-outline flex-1 py-2"
                >
                  RESETEAR
                </button>
                <button 
                  onClick={() => setShowSafetyChecklist(false)}
                  className="flex-1 bg-black text-white font-mono text-xs font-bold py-2 hover:bg-[#2563eb] border-2 border-black hover:border-[#2563eb] uppercase transition-colors"
                >
                  ENTENDIDO
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 📚 MODAL 3: DEPARTMENT INFO / PLAN DE ESTUDIOS */}
      {showDeptInfo && (
        <div className="modal-overlay">
          <div className="modal-box max-w-lg animate-fade-in">
            {/* Header styled like a Mondrian banner */}
            <div className="modal-header bg-[#ef4444] text-white">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-white" />
                <span className="font-mono text-xs font-black uppercase tracking-widest">
                  PLAN DOCENTE // I.E.S. VIRGEN DEL MAR
                </span>
              </div>
              <button 
                onClick={() => setShowDeptInfo(false)}
                className="btn-close-inv"
              >
                [ CERRAR ]
              </button>
            </div>

            <div className="p-6 space-y-5">
              <h3 className="font-serif font-black text-xl text-black uppercase border-b-2 border-black pb-2">
                Ciclos de Edificación y Obra Civil
              </h3>
              
              <div className="space-y-4 font-sans text-xs">
                {/* Ciclo 1 */}
                <div className="p-3 border-2 border-black bg-[#fafafa]">
                  <span className="font-mono font-black text-[9px] bg-[#ef4444] text-white px-2 py-0.5 uppercase">
                    GRADO MEDIO
                  </span>
                  <h4 className="font-sans font-black text-sm text-black mt-1.5 uppercase">
                    Técnico en Construcción y Albañilería
                  </h4>
                  <p className="text-gray-600 mt-1 font-medium leading-normal">
                    Formación 100% práctica en operaciones de replanteo, albañilería, acabados, encofrados, instalación de andamios y manipulación de hormigones en taller.
                  </p>
                </div>

                {/* Ciclo 2 */}
                <div className="p-3 border-2 border-black bg-[#fafafa]">
                  <span className="font-mono font-black text-[9px] bg-[#facc15] text-black px-2 py-0.5 uppercase">
                    GRADO SUPERIOR
                  </span>
                  <h4 className="font-sans font-black text-sm text-black mt-1.5 uppercase">
                    Técnico Superior en Proyectos de Edificación
                  </h4>
                  <p className="text-gray-600 mt-1 font-medium leading-normal">
                    Modelado de información en construcción (BIM), levantamientos de solares por topografía, desarrollo de planos técnicos ejecutivos, memorias de CTE y mediciones de obra.
                  </p>
                </div>

                {/* Ciclo 3 */}
                <div className="p-3 border-2 border-black bg-[#fafafa]">
                  <span className="font-mono font-black text-[9px] bg-[#2563eb] text-white px-2 py-0.5 uppercase">
                    GRADO SUPERIOR
                  </span>
                  <h4 className="font-sans font-black text-sm text-black mt-1.5 uppercase">
                    Técnico Superior en Organización de Obras
                  </h4>
                  <p className="text-gray-600 mt-1 font-medium leading-normal">
                    Planificación temporal (diagramas de Gantt), control presupuestario de compras, supervisión de tajos, control de calidad y prevención de riesgos laborales.
                  </p>
                </div>
              </div>

              <div className="bg-gray-100 p-3 border-l-4 border-black font-mono text-[9px] text-gray-500 uppercase font-black leading-relaxed">
                * Todos los ciclos habilitan para el acceso directo a estudios de Grado Universitario en Ingeniería de Edificación (Arquitectura Técnica) o Ingeniería Civil.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
