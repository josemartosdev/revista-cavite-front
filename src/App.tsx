import { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Sparkles, Loader2, Award, HardHat, FileText } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeFeed from './components/HomeFeed';
import JournalFeed from './components/JournalFeed';
import ProjectView from './components/ProjectView';
import EntryEditor from './components/EntryEditor';
import { initialJournalEntries } from './data';
import { JournalEntry, MagazineArticle } from './types';

// Full technical detailed contents for active construction curriculum lessons
const articleFullTexts: Record<string, string[]> = {
  'dosificacion-hormigonera': [
    'La correcta dosificación de hormigones y morteros en la hormigonera eléctrica de tambor del patio de edificación constituye una de las primeras prácticas ineludibles para los alumnos de Grado Medio de Construcción. El balance exacto entre conglomerante (cemento), agua de amasado y áridos (arenas y gravas) determina tanto el comportamiento mecánico proyectado como la durabilidad del elemento edificado final.',
    'En nuestro taller aplicamos la regla práctica de dosificaciones volumétricas basándonos en el peso específico aparente y la humedad de los áridos. Un exceso de agua de amasado es un error recurrente sumamente crítico; si bien simplifica la trabajabilidad del mortero fresco para el operario, debilita la matriz de cemento endurecido al generar huecos capilares tras su evaporación, rebajando drásticamente la resistencia fck calculada en el proyecto técnico según la directiva del Código Estructural.',
    'Para dominar este control, realizamos el Ensayo de Consistencia mediante el Cono de Abrams en el patio de prácticas. Midiendo el asiento de la masa fresca tras retirar el molde cónico, clasificamos el hormigón en consistencia seca, plástica, blanda o fluida. Esta lección práctica faculta a los alumnos para supervisar y certificar mezclas idóneas en cualquier cimentación real.'
  ],
  'cultura-preventiva-casco': [
    'La prevención de riesgos laborales (PRL) no es un módulo teórico inerte de examen escrito; es la disciplina rectora que salva vidas en los tajos reales de edificación. En el I.E.S. Virgen del Mar inculcamos la cultura preventiva como el primer andamio del aprendizaje: el uso obligatorio del casco homologado EN 397 y las botas con puntera reforzada S3 es obligatorio antes de realizar cualquier replanteo.',
    'Los incidentes usuales en obras menores provienen de descuidos fortuitos: el desprendimiento de un bardo cerámico al levantar tabiquería, el tropiezo con varillas de armado expuestas en cimientos o quemaduras químicas en las manos al manipular cemento fresco sin guantes de nitrilo. Un excelente técnico de FP asume la responsabilidad de liderar con rigor higiénico, exigiendo limpieza y orden continuo en el patio de obras.',
    'Estudiamos el Real Decreto 1627/1997 sobre disposiciones mínimas de seguridad en obras de construcción para capacitar a nuestros alumnos como futuros coordinadores de seguridad. El éxito docente reside en integrar las medidas preventivas directamente en la planificación temporal y económica del proyecto, logrando profesionales eficientes, meticulosos y comprometidos con el residuo cero.'
  ],
  'empleo-fp-construccion': [
    'La familia profesional de Edificación y Obra Civil experimenta un periodo de inserción laboral excepcional sin precedentes históricos. La acelerada digitalización de las constructoras mediante metodologías de modelado virtual BIM (Building Information Modeling), sumada a la jubilación masiva de mandos intermedios en Almería, convierte a los técnicos formados en perfiles cotizadísimos.',
    'Nuestros titulados de Grado Superior en Proyectos de Edificación no se limitan al dibujo asistido CAD convencional de planos 2D; se gradúan modelando gemelos digitales completos en 3D, extrayendo de forma automatizada presupuestos de materiales y estructurando planes de control de calidad. Las empresas locales reclaman activamente ayudantes de jefe de obra, encargados de compras, delineantes y técnicos de oficina técnica.',
    'La colaboración bidireccional con el tejido industrial de la provincia permite concertar las estancias de Formación en Centros de Trabajo (FCT) en despachos de ingeniería y constructoras líderes. Esta estrecha relación genera que la práctica totalidad de los alumnos egresados con actitud proactiva consoliden un empleo estable antes de finalizar el curso escolar.'
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'portfolio' | 'notebook' | 'editor'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<MagazineArticle | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | undefined>(undefined);

  // AI Summary states for open article
  const [articleSummary, setArticleSummary] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Load entries from localStorage or fallback to default entries
  useEffect(() => {
    const saved = localStorage.getItem('arch_notebook_entries');
    if (saved) {
      try {
        setJournalEntries(JSON.parse(saved));
      } catch (e) {
        setJournalEntries(initialJournalEntries);
      }
    } else {
      setJournalEntries(initialJournalEntries);
      localStorage.setItem('arch_notebook_entries', JSON.stringify(initialJournalEntries));
    }
  }, []);

  // Save entries when they change
  const saveEntries = (updated: JournalEntry[]) => {
    setJournalEntries(updated);
    localStorage.setItem('arch_notebook_entries', JSON.stringify(updated));
  };

  const handlePublish = (newEntry: JournalEntry) => {
    // Check if editing or creating
    const exists = journalEntries.some(e => e.id === newEntry.id);
    let updated: JournalEntry[];
    if (exists) {
      updated = journalEntries.map(e => e.id === newEntry.id ? newEntry : e);
    } else {
      updated = [newEntry, ...journalEntries];
    }
    saveEntries(updated);
    setEditingEntry(undefined);
    setActiveTab('notebook');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArticleClick = (article: MagazineArticle) => {
    setSelectedArticle(article);
    setArticleSummary('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateAISummary = async () => {
    if (!selectedArticle) return;
    setAiLoading(true);
    setArticleSummary('');

    const fullContent = (articleFullTexts[selectedArticle.id] || [selectedArticle.excerpt]).join('\n\n');

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'SUMMARY',
          title: selectedArticle.title,
          content: fullContent
        })
      });

      if (!response.ok) {
        throw new Error('No se pudo establecer comunicación con el servidor de IA.');
      }

      const data = await response.json();
      setArticleSummary(data.result);
    } catch (e: any) {
      console.error(e);
      setArticleSummary('Error: No se pudo conectar con la API de Gemini. Compruebe la clave GEMINI_API_KEY en la configuración.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedArticle(null);
        }} 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Page Area */}
      <div className="flex-grow">
        {activeTab === 'home' && (
          <HomeFeed 
            onArticleClick={handleArticleClick}
            onProjectClick={(projId) => {
              setActiveTab('portfolio');
              setSelectedArticle(null);
            }}
            onNavClick={(tab) => {
              setActiveTab(tab);
              setSelectedArticle(null);
            }}
          />
        )}

        {activeTab === 'portfolio' && (
          <ProjectView projectId="proyecto-modulo-practicas" />
        )}

        {activeTab === 'notebook' && (
          <JournalFeed 
            entries={journalEntries}
            onAddClick={() => {
              setEditingEntry(undefined);
              setActiveTab('editor');
            }}
          />
        )}

        {activeTab === 'editor' && (
          <EntryEditor 
            onPublish={handlePublish}
            initialEntry={editingEntry}
          />
        )}
      </div>

      {/* Full Article Reader Modal overlay styled in high contrast Mondrian Frame */}
      {selectedArticle && (
        <div className="modal-overlay" id="article-reader-modal">
          <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
            
            {/* Mondrian Modal Header block */}
              <div className="modal-header sticky top-0 bg-[#ef4444] z-10 text-white">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-white" />
                <span className="font-mono text-xs font-black uppercase tracking-widest">
                  REVISTA DIGITAL // {selectedArticle.tag}
                </span>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="bg-black hover:bg-white hover:text-black border-2 border-black text-white px-2 py-1 font-mono text-xs font-bold transition-colors cursor-pointer"
                title="Cerrar Lector"
                aria-label="Cerrar Lector"
              >
                [ CERRAR ]
              </button>
            </div>

            {/* Reading Content */}
            <div className="p-6 md:p-12 space-y-8">
              
              {/* Metadata */}
              <div className="space-y-3">
                <span className="font-mono text-xs font-black tracking-widest text-[#2563eb] uppercase bg-blue-50 border border-blue-150 px-2.5 py-1">
                  {selectedArticle.category}
                </span>
                <h2 className="font-serif font-black text-2xl md:text-4xl text-black leading-tight">
                  {selectedArticle.title}
                </h2>
                
                <div className="flex flex-wrap gap-4 items-center border-t-2 border-b-2 border-black py-3 text-black font-mono text-[10px] uppercase font-bold">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#ef4444]" />
                    POR: {selectedArticle.author}
                  </span>
                  <span className="w-1 h-1 bg-black"></span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#facc15]" />
                    CURSO LECTIVO 2025/26
                  </span>
                  <span className="w-1 h-1 bg-black"></span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#2563eb]" />
                    {selectedArticle.readTime}
                  </span>
                </div>
              </div>

              {/* Huge Image Frame with Mondrian Border */}
              <div className="bg-gray-100 border-[3px] border-black p-1">
                <img 
                  className="w-full h-auto object-cover border border-black" 
                  src={selectedArticle.heroImage} 
                  alt={selectedArticle.title}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text Body */}
              <div className="space-y-5 font-sans text-xs md:text-sm text-gray-700 leading-relaxed font-semibold">
                {articleFullTexts[selectedArticle.id] ? (
                  articleFullTexts[selectedArticle.id].map((para, pIdx) => (
                    <p key={pIdx} className={pIdx === 0 ? 'text-sm md:text-base text-black font-bold leading-relaxed' : ''}>
                      {para}
                    </p>
                  ))
                ) : (
                  <p>{selectedArticle.excerpt}</p>
                )}
              </div>

              {/* Interactive AI Companion Tool styled as a Mondrian bottom card */}
              <div className="bg-gray-50 border-[3px] border-black p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-black fill-black" />
                    <span className="font-mono text-xs font-black text-black tracking-widest uppercase">
                      LECTURA ASISTIDA POR GEMINI AI
                    </span>
                  </div>
                  <button 
                    onClick={handleGenerateAISummary}
                    disabled={aiLoading}
                className="btn-primary px-4 py-2 disabled:opacity-40 w-full sm:w-auto"
                  >
                    {aiLoading ? 'ANALIZANDO...' : 'SINTETIZAR LECCIÓN'}
                  </button>
                </div>

                {aiLoading && (
                  <div className="flex items-center gap-3 py-2 text-gray-500 italic font-sans text-xs font-bold">
                    <Loader2 className="w-4 h-4 animate-spin text-[#ef4444]" />
                    Construyendo síntesis conceptual con IA...
                  </div>
                )}

                {articleSummary && (
                  <div className="p-4 bg-white border-2 border-black font-sans text-xs text-gray-700 leading-relaxed whitespace-pre-line border-l-[6px] border-l-[#ef4444] font-semibold">
                    <p className="font-mono text-[9px] font-black text-[#ef4444] mb-1.5 uppercase">SÍNTESIS INTELIGENTE DEL PROFESORADO:</p>
                    {articleSummary}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Footer Area */}
      <Footer 
        onNavClick={(tab) => {
          setActiveTab(tab);
          setSelectedArticle(null);
        }}
      />
    </div>
  );
}
