import { MapPin, Plus, Share2, Mail, ExternalLink, HardHat, ClipboardList } from 'lucide-react';
import { JournalEntry } from '../types';

interface JournalFeedProps {
  entries: JournalEntry[];
  onAddClick: () => void;
}

export default function JournalFeed({ entries, onAddClick }: JournalFeedProps) {
  const handleMapClick = (title: string) => {
    alert(`Ubicación de Obra: Patio de Prácticas del I.E.S. Virgen del Mar\nCoordenadas: 36.7513° N, 3.0134° W (Almería, España)\nUso académico autorizado.`);
  };

  return (
    <div className="w-full bg-white min-h-screen pt-32 pb-24" id="journal-feed-view">
      <main className="max-w-screen-xl mx-auto px-4 md:px-8">
        
        {/* Header Section styled in Mondrian horizontal panel */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b-[4px] border-black">
            <div>
              <span className="label-mono-sm text-[#ef4444] mb-2 block">
                CUADERNO DE TALLER
              </span>
              <h2 className="font-serif font-black text-3xl md:text-5xl text-black">
                Bitácora de Prácticas
              </h2>
            </div>
            <div className="font-mono text-xs text-gray-700 text-left md:text-right leading-relaxed uppercase tracking-wider font-bold">
              CURSO 2025/2026 / VOLUMEN I<br />
              DEPARTAMENTO DE EDIFICACIÓN Y OBRA CIVIL
            </div>
          </div>
        </section>

        {/* The Notebook Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          
          {/* Left Margin Labels (Desktop Only) - styled as Mondrian grid rail */}
          <aside className="hidden lg:block lg:col-span-1 border-r-[3px] border-black h-full pt-4">
            <div className="sticky top-40 space-y-48">
              <div className="rotate-90 origin-left translate-x-4 mb-16 shrink-0">
                <span className="font-mono text-[9px] font-black text-gray-500 tracking-widest uppercase">CONSTRUCCIÓN</span>
              </div>
              <div className="rotate-90 origin-left translate-x-4 pt-16 shrink-0">
                <span className="font-mono text-[9px] font-black text-gray-500 tracking-widest uppercase">SEGURIDAD</span>
              </div>
            </div>
          </aside>

          {/* Entries Stream */}
          <div className="lg:col-span-11 space-y-24">
            {entries.map((entry, idx) => {
              // Custom layout maps for student content
              const isEpiLog = entry.id === 'log-seguridad-epis';
              const isReplanteoLog = entry.id === 'log-replanteo-estacion';

              if (isEpiLog) {
                // Technical safety helmet study layout with red/yellow indicators
                return (
                  <article key={entry.id} className="group" id={`entry-${entry.id}`}>
                    <div className="border-[3px] border-black p-6 md:p-10 bg-white relative">
                      
                      {/* Mondrian corners */}
                      <div className="absolute top-4 right-4 flex gap-1.5">
                        <span className="w-4 h-4 bg-[#ef4444] border border-black"></span>
                        <span className="w-4 h-4 bg-[#facc15] border border-black"></span>
                        <span className="w-4 h-4 bg-[#2563eb] border border-black"></span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 mb-6">
                        <span className="tag-red-light">{entry.tag}</span>
                        <span className="font-mono text-xs text-gray-400 font-bold">{entry.date}</span>
                        <h3 className="font-serif text-2xl font-black text-black w-full mt-2 md:w-auto md:mt-0">{entry.title}</h3>
                      </div>

                      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Image column with handwritten style absolute annotations */}
                        <div className="relative border-2 border-black bg-gray-100 p-2">
                          <img 
                            className="w-full h-auto object-cover border border-black" 
                            src={entry.blocks.find(b => b.type === 'image')?.content} 
                            alt={entry.title}
                            referrerPolicy="no-referrer"
                          />
                          {/* Annotations overlay mimicking blueprint guidelines */}
                          <div className="absolute top-1/4 -right-2 md:-right-4 italic font-sans font-bold text-[#ef4444] text-[11px] bg-white border-2 border-black px-2 py-1 rotate-[-2deg] shadow-md">
                            Barbuquejo EN 397 regulado
                          </div>
                          <div className="absolute bottom-1/4 -left-2 italic font-sans font-bold text-black text-[11px] bg-[#facc15] border-2 border-black px-2 py-1 rotate-[2deg] shadow-md">
                            Suela antiperforación S3
                          </div>
                        </div>

                        {/* Narrative specifications column */}
                        <div className="space-y-6 h-full flex flex-col justify-between">
                          <div className="p-4 border-l-4 border-[#ef4444] bg-gray-50">
                            <p className="font-serif italic text-sm text-gray-700 leading-relaxed">
                              "La cultura preventiva es fundamental en edificación. El casco de seguridad protege contra impactos mecánicos severos de cascotes en caída y descargas eléctricas imprevistas en zanjas húmedas."
                            </p>
                          </div>
                          
                          {/* Spec Table */}
                          <div className="grid grid-cols-2 gap-3 font-mono text-[10px] uppercase tracking-wider border-t-2 border-black pt-4">
                            <div className="border-b border-gray-200 pb-2">
                              <span className="text-gray-500 block font-bold">Normativa</span>
                              <span className="font-black text-black">RD 773/1997 // EPI</span>
                            </div>
                            <div className="border-b border-gray-200 pb-2">
                              <span className="text-gray-500 block font-bold">Elementos</span>
                              <span className="font-black text-black">Casco + Botas S3</span>
                            </div>
                            <div className="border-b border-gray-200 pb-2">
                              <span className="text-gray-500 block font-bold">Control</span>
                              <span className="font-black text-black">Diario / Obligatorio</span>
                            </div>
                            <div className="border-b border-gray-200 pb-2">
                              <span className="text-gray-500 block font-bold">Estado</span>
                              <span className="font-black text-[#ef4444]">APTO / CERTIFICADO</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }

              if (isReplanteoLog) {
                // Surveying / Total station layout
                const textBlocks = entry.blocks.filter(b => b.type === 'text');
                const imageBlock = entry.blocks.find(b => b.type === 'image');
                
                return (
                  <article key={entry.id} className="group" id={`entry-${entry.id}`}>
                    <div className="border-[3px] border-black p-6 bg-white">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/2 space-y-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <span className="tag-blue-light">{entry.tag}</span>
                              <div className="h-0.5 flex-grow bg-black"></div>
                              <span className="font-mono text-xs font-bold text-gray-400">{entry.logNum}</span>
                            </div>
                            <h3 className="font-serif font-black text-2xl md:text-3xl text-black group-hover:text-[#2563eb] transition-colors leading-snug">
                              {entry.title}
                            </h3>
                            <div className="space-y-3 font-sans text-xs text-gray-700 leading-relaxed font-semibold mt-4">
                              {textBlocks.map((block, bIdx) => (
                                <p 
                                  key={block.id}
                                  className={bIdx === 1 ? 'font-black text-black border-l-4 border-black pl-3 italic bg-gray-50 py-2' : ''}
                                >
                                  {block.content}
                                </p>
                              ))}
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => handleMapClick(entry.title)}
                            className="btn-outline px-4 py-3 mt-4 flex items-center justify-center gap-2 shrink-0 w-fit"
                          >
                            VER UBICACIÓN EN EL PATIO
                            <ExternalLink className="w-3.5 h-3.5 text-[#ef4444]" />
                          </button>
                        </div>
                        
                        <div className="md:w-1/2">
                          <div className="bg-gray-100 p-4 border-2 border-black flex flex-col items-center">
                            {imageBlock && (
                              <img 
                                className="w-full aspect-video md:aspect-square object-cover border border-black" 
                                src={imageBlock.content} 
                                alt={entry.title}
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <span className="font-mono text-[9px] font-bold mt-3 text-gray-500 uppercase tracking-widest block text-center">
                              {imageBlock?.caption || 'REPLANTEO GEOMÉTRICO CON ESTACIÓN TOTAL'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }

              // Default rendering (e.g. Dosificación de mortero)
              const textBlocks = entry.blocks.filter(b => b.type === 'text');
              const imageBlock = entry.blocks.find(b => b.type === 'image');

              return (
                <article key={entry.id} className="group" id={`entry-${entry.id}`}>
                  <div className="border-[3px] border-black p-6 bg-white">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/2 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="tag-yellow">{entry.tag}</span>
                          <div className="h-0.5 flex-grow bg-black"></div>
                          <span className="font-mono text-xs font-bold text-gray-400">{entry.logNum}</span>
                        </div>
                        <h3 className="font-serif font-black text-2xl text-black group-hover:text-[#ef4444] transition-colors leading-snug">
                          {entry.title}
                        </h3>
                        <div className="space-y-3 font-sans text-xs text-gray-600 leading-relaxed font-semibold mt-4">
                          {textBlocks.map(block => (
                            <p key={block.id}>{block.content}</p>
                          ))}
                        </div>
                      </div>
                      <div className="md:w-1/2">
                        {imageBlock && (
                          <div className="relative overflow-hidden border-2 border-black p-2 bg-gray-50">
                            <img 
                              className="w-full aspect-[4/3] object-cover border border-black transition-transform duration-700 group-hover:scale-102" 
                              src={imageBlock.content} 
                              alt={entry.title}
                              referrerPolicy="no-referrer"
                            />
                            {imageBlock.metadata && (
                              <div className="absolute bottom-4 left-4 font-mono text-[9px] font-black text-[#facc15] bg-black px-3 py-1 border border-black">
                                {imageBlock.metadata}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>

      {/* Float Action Button (FAB) for adding new entries */}
      <button 
        onClick={onAddClick}
        className="btn-fab group"
        title="Crear Nueva Entrada en Bitácora"
        id="fab-add-entry"
      >
        <Plus className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
}
