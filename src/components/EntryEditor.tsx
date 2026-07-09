import { useState, useEffect } from 'react';
import { 
  FileText, FolderOpen, Archive, BookOpen, Brain, Settings,
  ChevronRight, Bold, Italic, Link2, Image as ImageIcon, Video, FileDown, Share2, 
  Plus, Zap, Calendar, ArrowUp, ArrowDown, Trash2, Edit2, Loader2, RefreshCw, HardHat, GraduationCap
} from 'lucide-react';
import { JournalEntry, EditorBlock } from '../types';

interface EntryEditorProps {
  onPublish: (entry: JournalEntry) => void;
  initialEntry?: JournalEntry;
}

export default function EntryEditor({ onPublish, initialEntry }: EntryEditorProps) {
  // Prefill with a construction student notebook entry template
  const [title, setTitle] = useState<string>(initialEntry?.title || 'Práctica de Taller: Dosificación de Morteros en Patio');
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialEntry?.blocks || [
    {
      id: 'eb1',
      type: 'text',
      content: 'Durante la jornada técnica de prácticas de Edificación y Obra Civil, los alumnos de primer curso de FP realizaron el amasado y control de consistencia para un mortero de cemento de resistencia normalizada M-5.'
    },
    {
      id: 'eb2',
      type: 'image',
      content: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=1000',
      caption: 'Fig 1. Práctica de amasado de mortero y toma de muestras en el patio de edificación.'
    },
    {
      id: 'eb3',
      type: 'text',
      content: 'Para la dosificación 1:4 (una parte de cemento CEM II por cuatro partes de arena de río seca) se calculó una relación agua/cemento de 0.55. Se controló minuciosamente la homogeneidad de la masa para evitar la segregación de finos.'
    }
  ]);

  // AI Assistant States
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiActiveTask, setAiActiveTask] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>('');

  // Metadata metrics calculated in real-time
  const [wordCount, setWordCount] = useState<number>(0);
  const [readingTime, setReadingTime] = useState<number>(5);
  const [metadataScore, setMetadataScore] = useState<number>(85);
  const [scoreFeedback, setScoreFeedback] = useState<string>('El contenido técnico es consistente.');

  // Calculate metrics dynamically
  useEffect(() => {
    let totalWords = 0;
    let textToAnalyze = title + ' ';
    
    blocks.forEach(b => {
      if (b.type === 'text' || b.type === 'heading1' || b.type === 'heading2') {
        totalWords += b.content.split(/\s+/).filter(w => w.length > 0).length;
        textToAnalyze += b.content + ' ';
      }
    });

    setWordCount(totalWords);
    
    // Dynamic reading time (avg 150 words per min for technical spanish text)
    const minutes = Math.max(1, Math.ceil(totalWords / 130));
    setReadingTime(initialEntry ? minutes : (totalWords > 0 ? minutes : 5));

    // Dynamic Metadata Score calculation
    let score = 50;
    const hasConcrete = /mortero|hormig[oó]n|mezcla|cemento/i.test(textToAnalyze);
    const hasMaterials = /arena|grava|agua|dosificación/i.test(textToAnalyze);
    const hasCoordinates = /patio|taller|ies|práctica|obra/i.test(textToAnalyze);
    const hasImages = blocks.some(b => b.type === 'image');
    const hasGoodLength = totalWords > 100;

    if (hasConcrete) score += 10;
    if (hasMaterials) score += 10;
    if (hasCoordinates) score += 10;
    if (hasImages) score += 10;
    if (hasGoodLength) score += 10;

    // Constrain score
    score = Math.min(100, Math.max(30, score));
    setMetadataScore(score);

    // Dynamic recommendations
    if (score < 60) {
      setScoreFeedback('Faltan términos técnicos clave. Añade detalles sobre la dosificación o materiales empleados.');
    } else if (score < 80) {
      setScoreFeedback('Análisis intermedio. Considera agregar datos sobre prevención de riesgos laborales o herramientas.');
    } else {
      setScoreFeedback('¡Perfecto! El log técnico cumple con la calidad pedagógica requerida para la bitácora escolar.');
    }
  }, [title, blocks]);

  // Block management
  const handleBlockChange = (id: string, newContent: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: newContent } : b));
  };

  const handleCaptionChange = (id: string, newCaption: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, caption: newCaption } : b));
  };

  const handleAddBlock = (type: 'text' | 'image' | 'heading1' | 'heading2') => {
    const newBlock: EditorBlock = {
      id: `eb-${Date.now()}`,
      type,
      content: type === 'image' 
        ? 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&q=80&w=1000' 
        : '',
      caption: type === 'image' ? 'Fig. Muestra técnica de replanteo en el patio...' : undefined
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    setBlocks(newBlocks);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  // Run AI Task with Server-side Gemini API
  const handleAIAssistantTask = async (task: 'SUMMARY' | 'SEO_TITLE' | 'LINKEDIN') => {
    setAiLoading(true);
    setAiError('');
    setAiResponse('');
    setAiActiveTask(
      task === 'SUMMARY' 
        ? 'RESUMEN' 
        : task === 'SEO_TITLE' 
          ? 'TÍTULO_SEO' 
          : 'DIVULGACIÓN_RRSS'
    );

    const fullContent = blocks
      .filter(b => b.type === 'text' || b.type === 'heading1' || b.type === 'heading2')
      .map(b => b.content)
      .join('\n\n');

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task,
          title,
          content: fullContent
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'No se pudo conectar con el servicio de IA.');
      }

      const data = await response.json();
      setAiResponse(data.result);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Error al conectar con la API de Gemini.');
    } finally {
      setAiLoading(false);
    }
  };

  const handlePublishClick = () => {
    const newEntry: JournalEntry = {
      id: initialEntry?.id || `entry-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      logNum: initialEntry?.logNum || `PRÁCTICA #${Math.floor(100 + Math.random() * 900)}`,
      tag: 'TALLER',
      title: title.trim() || 'Bitácora sin título',
      blocks
    };
    onPublish(newEntry);
  };

  return (
    <div className="flex min-h-screen pt-20 pb-20 md:pb-0 bg-white" id="editor-workspace">
      
      {/* Sidebar Navigation (Desktop Only) - styled as Mondrian grid dividers */}
      <aside className="hidden lg:flex flex-col w-64 border-r-[4px] border-black bg-white sticky top-20 h-[calc(100vh-80px)] p-6 justify-between" id="editor-sidebar">
        <div className="space-y-6">
          <section className="space-y-4">
            <h3 className="font-mono text-[10px] font-black text-gray-400 tracking-widest uppercase">CONTENIDOS</h3>
            <ul className="space-y-2">
              <li>
                <span className="flex items-center gap-3 font-sans text-xs font-bold p-2 hover:bg-[#ef4444]/10 transition-colors cursor-pointer text-black">
                  <FileText className="w-4 h-4 text-[#ef4444]" />
                  Lecciones Técnicas
                </span>
              </li>
              <li>
                <span className="flex items-center gap-3 font-sans text-xs font-bold p-2 hover:bg-[#facc15]/10 transition-colors cursor-pointer text-black">
                  <FolderOpen className="w-4 h-4 text-[#facc15]" />
                  Maquetas / Proyectos
                </span>
              </li>
              <li>
                <span className="flex items-center gap-3 font-sans text-xs font-bold p-2 hover:bg-[#2563eb]/10 transition-colors cursor-pointer text-black">
                  <Archive className="w-4 h-4 text-[#2563eb]" />
                  Archivo de Planos
                </span>
              </li>
              <li>
                <span className="flex items-center gap-3 font-sans text-xs font-black p-2 bg-black text-white rounded-none">
                  <BookOpen className="w-4 h-4 text-white" />
                  Bitácora Alumnos
                </span>
              </li>
            </ul>
          </section>
          
          <section className="space-y-4 pt-4 border-t-2 border-black">
            <h3 className="font-mono text-[10px] font-black text-gray-400 tracking-widest uppercase">ASISTENTES</h3>
            <ul className="space-y-2">
              <li>
                <span className="flex items-center gap-3 font-sans text-xs font-bold p-2 hover:bg-gray-100 transition-colors cursor-pointer text-black">
                  <Brain className="w-4 h-4 text-black" />
                  Optimización de IA
                </span>
              </li>
              <li>
                <span className="flex items-center gap-3 font-sans text-xs font-bold p-2 hover:bg-gray-100 transition-colors cursor-pointer text-black">
                  <Settings className="w-4 h-4 text-black" />
                  Configuración
                </span>
              </li>
            </ul>
          </section>
        </div>
        
        <div className="pt-6 border-t-[3px] border-black">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border-2 border-black bg-[#facc15] flex items-center justify-center font-mono text-xs font-black text-black">
              MO
            </div>
            <div>
              <p className="font-mono text-xs font-black text-black leading-none">M. Ortiz</p>
              <p className="font-mono text-[9px] text-gray-500 font-bold uppercase mt-1">Delegado de Aula</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Editor Canvas and Assistant Sidebar Split */}
      <main className="flex-1 bg-white flex flex-col lg:flex-row relative">
        
        {/* Central Column */}
        <div className="flex-1 max-w-3xl mx-auto px-4 md:px-8 py-10">
          
          {/* Status & Breadcrumbs */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-black">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] font-black text-black bg-[#facc15] px-2 py-0.5 border border-black uppercase tracking-wider">AULA</span>
              <ChevronRight className="w-3 h-3 text-black" />
              <span className="font-mono text-[10px] font-black text-gray-500 uppercase tracking-wider">REDACTOR DE PRÁCTICAS</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 bg-[#ef4444] border border-black inline-block"></span>
                <span className="font-mono text-xs text-[#ef4444] uppercase tracking-widest font-black">BORRADOR</span>
              </div>
              <button 
                onClick={handlePublishClick}
                className="btn-primary px-4 py-1.5"
                id="publish-entry-btn"
              >
                PUBLICAR EN BITÁCORA
              </button>
            </div>
          </div>

          {/* Editor Title */}
          <div className="mb-8">
            <input 
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none font-serif font-black text-2xl md:text-4xl text-black placeholder:text-gray-300 p-0" 
              placeholder="Ej. Replanteo de cimentaciones..." 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="mt-4 flex flex-wrap gap-4 border-b-2 border-black pb-2">
              <span className="font-mono text-xs text-gray-500 font-bold">Curso: 2025/2026</span>
              <span className="font-mono text-xs text-gray-500 font-bold">Tiempo estimado: {readingTime} min</span>
              <span className="font-mono text-xs text-gray-500 font-bold">Palabras: {wordCount}</span>
            </div>
          </div>

          {/* Toolbar - Styled cleanly with black borders */}
          <div className="flex flex-wrap items-center gap-1 mb-8 p-1 bg-white border-2 border-black shadow-sm">
            <button 
              onClick={() => handleAddBlock('heading1')}
              className="px-3 py-2 hover:bg-gray-100 flex items-center justify-center cursor-pointer border border-transparent hover:border-black font-mono text-xs font-black" 
              title="Añadir Título (H1)"
            >
              H1
            </button>
            <button 
              onClick={() => handleAddBlock('heading2')}
              className="px-3 py-2 hover:bg-gray-100 flex items-center justify-center cursor-pointer border border-transparent hover:border-black font-mono text-xs font-black" 
              title="Añadir Subtítulo (H2)"
            >
              H2
            </button>
            <div className="w-0.5 h-6 bg-black mx-1"></div>
            <button 
              onClick={() => handleAddBlock('text')}
              className="px-3 py-2 hover:bg-gray-100 flex items-center justify-center cursor-pointer border border-transparent hover:border-black font-serif italic font-bold text-xs" 
              title="Añadir Párrafo"
            >
              Párr
            </button>
            <div className="w-0.5 h-6 bg-black mx-1"></div>
            <button 
              onClick={() => handleAddBlock('image')}
              className="px-3 py-2 hover:bg-[#ef4444]/10 flex items-center justify-center cursor-pointer border border-transparent hover:border-black text-[#ef4444]" 
              title="Añadir Imagen"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Content Area */}
          <article className="space-y-6">
            {blocks.map((block, idx) => {
              const numStr = String(idx + 1).padStart(2, '0');
              
              return (
                <div key={block.id} className="group/block relative border-l-2 border-transparent hover:border-black pl-4 transition-all py-1">
                  
                  {/* Left Side Controls (Hover) */}
                  <div className="absolute -left-12 top-2 hidden group-hover/block:flex flex-col gap-1 bg-white border-2 border-black p-1 shadow-md z-10">
                    <button 
                      onClick={() => handleMoveBlock(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      title="Mover Arriba"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-black" />
                    </button>
                    <button 
                      onClick={() => handleMoveBlock(idx, 'down')}
                      disabled={idx === blocks.length - 1}
                      className="p-1 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                      title="Mover Abajo"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-black" />
                    </button>
                    <button 
                      onClick={() => handleDeleteBlock(block.id)}
                      className="p-1 hover:bg-red-50 text-red-600 border-t border-gray-100 mt-1 cursor-pointer"
                      title="Eliminar Bloque"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="absolute -left-7 top-2.5 font-mono text-[9px] font-black text-gray-300 select-none">
                    {numStr}
                  </span>

                  {/* Rendering based on block types */}
                  {block.type === 'text' && (
                    <textarea
                      rows={Math.max(2, Math.ceil(block.content.length / 80))}
                      className="w-full bg-transparent border-none focus:ring-0 focus:outline-none font-sans text-sm text-gray-700 leading-relaxed p-0 resize-none font-semibold"
                      value={block.content}
                      placeholder="Escribe el contenido de esta sección..."
                      onChange={(e) => handleBlockChange(block.id, e.target.value)}
                    />
                  )}

                  {block.type === 'heading1' && (
                    <input
                      type="text"
                      className="w-full bg-transparent border-none focus:ring-0 focus:outline-none font-serif font-black text-xl text-black p-0 uppercase"
                      value={block.content}
                      placeholder="Subtítulo Principal (H1)..."
                      onChange={(e) => handleBlockChange(block.id, e.target.value)}
                    />
                  )}

                  {block.type === 'heading2' && (
                    <input
                      type="text"
                      className="w-full bg-transparent border-none focus:ring-0 focus:outline-none font-serif font-bold text-base text-black p-0"
                      value={block.content}
                      placeholder="Apartado Técnico (H2)..."
                      onChange={(e) => handleBlockChange(block.id, e.target.value)}
                    />
                  )}

                  {block.type === 'image' && (
                    <div className="space-y-2 my-4">
                      <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden border-2 border-black p-1 group/img">
                        <img 
                          className="w-full h-full object-cover border border-black" 
                          src={block.content} 
                          alt={block.caption}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center p-4">
                          <div className="bg-white border-2 border-black p-3 max-w-sm w-full shadow-lg">
                            <span className="font-mono text-[9px] text-gray-500 font-bold block mb-1 uppercase">DIRECCIÓN DE IMAGEN (URL)</span>
                            <input 
                              type="text" 
                              value={block.content} 
                              onChange={(e) => handleBlockChange(block.id, e.target.value)}
                              className="w-full bg-white border border-black text-xs py-1 px-2 focus:outline-none focus:border-[#ef4444] font-mono"
                              placeholder="Pegar dirección URL de la foto..."
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Image caption */}
                      <input 
                        type="text" 
                        value={block.caption || ''} 
                        onChange={(e) => handleCaptionChange(block.id, e.target.value)}
                        placeholder="Fig. Explicación de la ilustración técnica..."
                        className="w-full text-center font-mono text-[11px] text-gray-500 font-bold border-none focus:ring-0 p-0"
                      />
                    </div>
                  )}

                </div>
              );
            })}

            {/* Empty block guide */}
            {blocks.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-black text-gray-500 font-serif italic text-sm">
                No hay bloques todavía. Haz click en la barra de herramientas para añadir texto o imágenes.
              </div>
            )}

            {/* Add New Block trigger button */}
            <div className="py-8 border-t-2 border-black border-dashed flex items-center justify-center">
              <button 
                onClick={() => handleAddBlock('text')}
                className="btn-outline px-4 py-2 flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#ef4444]" />
                AÑADIR BLOQUE TÉCNICO
              </button>
            </div>
          </article>
        </div>

        {/* Right Sidebar (AI Assistant & Metadata Panel) - styled with heavy black frames */}
        <aside className="w-full lg:w-80 border-t-[4px] lg:border-t-0 lg:border-l-[4px] border-black bg-gray-50 p-6 shrink-0" id="editor-ai-sidebar">
          <div className="lg:sticky lg:top-28 space-y-8">
            
            {/* AI assistant section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-black fill-black" />
                <h3 className="font-mono text-xs font-black text-black tracking-widest uppercase">ASISTENTE IA DE REDACCIÓN</h3>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleAIAssistantTask('SUMMARY')}
                  disabled={aiLoading}
                  className="w-full text-left p-3 bg-white border-2 border-black hover:bg-red-50 hover:border-black transition-colors group disabled:opacity-50 cursor-pointer"
                >
                  <p className="font-mono text-[9px] text-gray-400 mb-1 group-hover:text-[#ef4444] uppercase tracking-wider font-black">AUTO-RESUMEN</p>
                  <p className="font-sans text-xs font-black text-black flex justify-between items-center">
                    Escribir Resumen Técnico
                    {aiLoading && aiActiveTask === 'RESUMEN' && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ef4444]" />}
                  </p>
                </button>

                <button 
                  onClick={() => handleAIAssistantTask('SEO_TITLE')}
                  disabled={aiLoading}
                  className="w-full text-left p-3 bg-white border-2 border-black hover:bg-yellow-50 hover:border-black transition-colors group disabled:opacity-50 cursor-pointer"
                >
                  <p className="font-mono text-[9px] text-gray-400 mb-1 group-hover:text-[#facc15] uppercase tracking-wider font-black">OPTIMIZACIÓN</p>
                  <p className="font-sans text-xs font-black text-black flex justify-between items-center">
                    Sugerir Título de Práctica
                    {aiLoading && aiActiveTask === 'TÍTULO_SEO' && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#facc15]" />}
                  </p>
                </button>

                <button 
                  onClick={() => handleAIAssistantTask('LINKEDIN')}
                  disabled={aiLoading}
                  className="w-full text-left p-3 bg-white border-2 border-black hover:bg-blue-50 hover:border-black transition-colors group disabled:opacity-50 cursor-pointer"
                >
                  <p className="font-mono text-[9px] text-gray-400 mb-1 group-hover:text-[#2563eb] uppercase tracking-wider font-black">DIVULGACIÓN</p>
                  <p className="font-sans text-xs font-black text-black flex justify-between items-center">
                    Preparar Publicación LinkedIn
                    {aiLoading && aiActiveTask === 'DIVULGACIÓN_RRSS' && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2563eb]" />}
                  </p>
                </button>
              </div>
            </section>

            {/* AI Assistant Output Display Box */}
            {(aiResponse || aiLoading || aiError) && (
              <section className="p-4 bg-white border-[3px] border-black shadow-md space-y-3" id="ai-output-box">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="font-mono text-[9px] font-black text-black uppercase tracking-wider flex items-center gap-1">
                    <RefreshCw className={`w-3 h-3 ${aiLoading ? 'animate-spin' : ''}`} />
                    RESPUESTA GEMINI API ({aiActiveTask})
                  </span>
                  <button 
                    onClick={() => { setAiResponse(''); setAiError(''); }} 
                    className="font-mono text-[9px] text-gray-400 hover:text-black uppercase font-bold"
                  >
                    Limpiar
                  </button>
                </div>
                {aiLoading && (
                  <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#ef4444]" />
                    <p className="font-sans font-bold text-xs text-gray-500">Alineando ladrillos con el modelo Gemini...</p>
                  </div>
                )}
                {aiError && (
                  <p className="font-mono text-xs text-red-600 leading-relaxed p-2 bg-red-50 border border-red-200">
                    {aiError}
                  </p>
                )}
                {aiResponse && (
                  <div className="font-sans text-xs text-black leading-relaxed space-y-2 max-h-64 overflow-y-auto pr-1">
                    <p className="whitespace-pre-line font-medium text-gray-700">{aiResponse}</p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(aiResponse);
                        alert('¡Copiado con éxito!');
                      }}
                      className="mt-2 text-[10px] font-black text-black underline cursor-pointer uppercase block"
                    >
                      Copiar al Portapapeles
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Metadata score segment */}
            <section className="p-4 bg-black text-white border-2 border-black">
              <h4 className="font-mono text-[9px] uppercase tracking-wider mb-2 text-gray-400 font-black">
                CALIDAD DE LA BITÁCORA (SEO)
              </h4>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-black text-[#facc15]">{metadataScore}</span>
                <span className="font-mono text-xs opacity-60">/ 100</span>
              </div>
              
              {/* Score slider bar */}
              <div className="mt-4 h-1.5 bg-gray-800 w-full relative">
                <div 
                  className="h-full bg-[#facc15] transition-all duration-500" 
                  style={{ width: `${metadataScore}%` }}
                />
              </div>
              
              <p className="mt-4 font-mono text-[10px] leading-snug text-gray-300 italic font-bold">
                {scoreFeedback}
              </p>
            </section>

            {/* Instruction Panel */}
            <section className="p-4 border-2 border-black bg-white">
              <h4 className="font-mono text-[10px] uppercase tracking-wider mb-2 text-black font-black flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#2563eb]" />
                REGLAS DE BITÁCORA IES
              </h4>
              <p className="font-sans text-[11px] text-gray-600 leading-normal font-semibold">
                Sube fotos nítidas con pies de figura explicativos. Siempre detalla las relaciones de dosificación agua/cemento y la normativa de seguridad de obra civil aplicada.
              </p>
            </section>

          </div>
        </aside>

      </main>

    </div>
  );
}
