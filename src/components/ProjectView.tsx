import { useState, FormEvent } from 'react';
import { initialProjects } from '../data';
import { Comment } from '../types';
import { Award, Layers, Compass, AlertTriangle, MessageSquare } from 'lucide-react';

interface ProjectViewProps {
  projectId?: string;
}

export default function ProjectView({ projectId = 'proyecto-modulo-practicas' }: ProjectViewProps) {
  // Always resolve to our custom pre-loaded project if id matches or by default
  const project = initialProjects.find(p => p.id === projectId) || initialProjects[0];

  const [comments, setComments] = useState<Comment[]>(project.comments);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('Manuel Ortiz');

  const handlePostComment = (e: FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const name = authorName.trim() || 'Alumno Anónimo';
    const initials = name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'AL';

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: name,
      avatarInitials: initials,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      content: newCommentText.trim()
    };

    setComments([...comments, newComment]);
    setNewCommentText('');
  };

  return (
    <div className="w-full bg-white min-h-screen pt-20 pb-12" id="project-detail-view">
      
      {/* Hero Section Frame with heavy border */}
      <section className="w-full h-[500px] md:h-[650px] relative overflow-hidden px-4 md:px-8 mt-6">
        <div className="w-full h-full border-[4px] border-black relative overflow-hidden bg-gray-200">
          <div 
            className="w-full h-full bg-cover bg-center transition-all duration-700 hover:scale-101 grayscale-[0.1]" 
            style={{ backgroundImage: `url('${project.heroImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          <div className="absolute bottom-8 left-6 md:left-12 text-white max-w-4xl space-y-3">
              <span className="tag-yellow">
              {project.number}
            </span>
            <h1 className="font-serif font-black text-3xl md:text-5xl lg:text-6xl text-white leading-none">
              {project.title}
            </h1>
            <p className="font-mono text-xs font-semibold tracking-widest uppercase text-[#ef4444]">
              {project.location} // {project.status}
            </p>
          </div>
        </div>
      </section>

      {/* Technical Metadata Bar in Mondrian Layout (Thick borders & divided cells) */}
      <section className="px-4 md:px-8 py-6" id="technical-metadata">
        <div className="border-[4px] border-black bg-black grid grid-cols-2 md:grid-cols-4 gap-[4px]">
          
          <div className="bg-white p-4 flex flex-col justify-center">
            <span className="font-mono text-[9px] font-black text-gray-500 mb-1 uppercase tracking-widest">LOCALIZACIÓN</span>
            <span className="font-sans text-sm text-black font-black uppercase">{project.location}</span>
          </div>
          
          <div className="bg-white p-4 flex flex-col justify-center">
            <span className="font-mono text-[9px] font-black text-gray-500 mb-1 uppercase tracking-widest">CURSO LECTIVO</span>
            <span className="font-sans text-sm text-black font-black uppercase">{project.year}</span>
          </div>
          
          <div className="bg-white p-4 flex flex-col justify-center">
            <span className="font-mono text-[9px] font-black text-[#2563eb] mb-1 uppercase tracking-widest">SUPERFICIE TALLER</span>
            <span className="font-sans text-sm text-black font-black uppercase">{project.area}</span>
          </div>
          
          <div className="bg-[#facc15] p-4 flex flex-col justify-center">
            <span className="font-mono text-[9px] font-black text-black mb-1 uppercase tracking-widest">CALIFICACIÓN / ESTADO</span>
            <span className="font-sans text-sm text-black font-black uppercase">{project.status}</span>
          </div>

        </div>
      </section>

      {/* Project Memory / Description Split */}
      <section className="px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8" id="project-description-section">
        
        {/* Left Side: Material Palette */}
        <aside className="lg:col-span-4 border-[3px] border-black p-6 bg-white h-fit lg:sticky lg:top-28">
          <div className="flex items-center gap-2 mb-6 border-b-2 border-black pb-3">
            <Layers className="w-5 h-5 text-[#ef4444]" />
            <h2 className="font-mono text-xs font-black text-black tracking-widest uppercase">
              PALETA DE MATERIALES
            </h2>
          </div>
          <ul className="space-y-3">
            {project.materials.map((mat) => (
              <li key={mat.num} className="flex justify-between items-baseline border-b border-gray-200 pb-2 group">
                <span className="font-mono text-xs font-bold text-gray-400">{mat.num}</span>
                <span className="font-sans text-xs text-black font-bold uppercase tracking-tight group-hover:text-[#ef4444] transition-colors">{mat.name}</span>
                <span className="font-mono text-[9px] font-black text-gray-500 uppercase tracking-widest">{mat.type}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-4 border-t-2 border-black flex gap-1 justify-center">
            <div className="w-12 h-4 bg-[#ef4444] border border-black"></div>
            <div className="w-6 h-4 bg-[#facc15] border border-black"></div>
            <div className="w-10 h-4 bg-[#2563eb] border border-black"></div>
          </div>
        </aside>

        {/* Right Side: Architectural Memo Chapters */}
        <article className="lg:col-span-8 space-y-12">
          
          <div id="concepto" className="card-padded bg-[#fafafa]">
            <h3 className="font-serif font-black text-xl mb-4 flex items-center gap-3 border-b-2 border-black pb-2 text-black">
              <Compass className="w-5 h-5 text-[#2563eb]" />
              Concepto y Planteamiento
            </h3>
            <p className="font-sans text-sm text-gray-700 leading-relaxed font-semibold">
              {project.concept}
            </p>
          </div>

          <div id="materiales" className="card-padded">
            <h3 className="font-serif font-black text-xl mb-4 flex items-center gap-3 border-b-2 border-black pb-2 text-black">
              <Layers className="w-5 h-5 text-[#facc15]" />
              Materiales e Integración
            </h3>
            <p className="font-sans text-sm text-gray-700 leading-relaxed font-medium">
              {project.materialsDesc}
            </p>
          </div>

          <div id="soluciones" className="card-padded">
            <h3 className="font-serif font-black text-xl mb-4 flex items-center gap-3 border-b-2 border-black pb-2 text-black">
              <Award className="w-5 h-5 text-black" />
              Soluciones de Encofrado y Replanteo
            </h3>
            <p className="font-sans text-sm text-gray-700 leading-relaxed font-medium">
              {project.systemsDesc}
            </p>
          </div>

          <div id="desafios" className="card-padded bg-[#ef4444]/5">
            <h3 className="font-serif font-black text-xl mb-4 flex items-center gap-3 border-b-2 border-black pb-2 text-black">
              <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
              Desafíos de Ejecución y Prevención
            </h3>
            <p className="font-sans text-sm text-gray-700 leading-relaxed font-medium">
              {project.challengesDesc}
            </p>
          </div>

        </article>
      </section>

      {/* Visual Grid Section */}
      <section className="px-4 md:px-8 py-6" id="project-visual-grid">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main big display item with Mondrian border */}
          <div className="lg:col-span-8 group overflow-hidden bg-gray-100 border-[3px] border-black">
            <img 
              className="w-full h-[400px] md:h-[550px] object-cover hover:scale-101 transition-transform duration-700 grayscale-[0.05]" 
              src={project.images[0].src} 
              alt={project.images[0].caption}
              referrerPolicy="no-referrer"
            />
            <div className="p-4 bg-white flex justify-between items-center border-t-2 border-black">
              <span className="font-mono text-xs font-black tracking-wider text-black uppercase">{project.images[0].caption}</span>
              <span className="font-mono text-xs font-black text-gray-500 bg-gray-100 px-2 py-0.5 border border-black">{project.images[0].figNum}</span>
            </div>
          </div>

          {/* Right sidebar column grids */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {project.images.slice(1).map((img, i) => (
              <div key={img.figNum} className="group overflow-hidden bg-gray-100 border-[3px] border-black flex-1 flex flex-col justify-between">
                <img 
                  className="w-full h-[180px] md:h-[220px] object-cover hover:scale-101 transition-transform duration-700 grayscale-[0.05]" 
                  src={img.src} 
                  alt={img.caption}
                  referrerPolicy="no-referrer"
                />
                <div className="p-4 bg-white flex justify-between items-center border-t-2 border-black">
                  <span className="font-mono text-xs font-black tracking-wider text-black uppercase">{img.caption}</span>
                  <span className="font-mono text-xs font-black text-gray-500 bg-gray-100 px-2 py-0.5 border border-black">{img.figNum}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Discussion / Comments section */}
      <section className="px-4 md:px-8 py-12" id="project-discussion">
        <div className="border-[3px] border-black p-6 md:p-8 bg-white max-w-4xl mx-auto">
          
          <h3 className="font-serif font-black text-2xl text-black mb-8 flex items-center gap-2.5 border-b-2 border-black pb-3">
            <MessageSquare className="w-5 h-5 text-[#2563eb]" />
            Control de Calidad / Comentarios del Profesorado
          </h3>

          {/* Comment Stream */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <div className="w-10 h-10 bg-black text-white border-2 border-black rounded-none flex-shrink-0 flex items-center justify-center font-mono text-xs font-black">
                  {comment.avatarInitials}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-mono text-xs font-black tracking-wider text-black uppercase">
                      {comment.author}
                    </span>
                    <span className="font-mono text-[10px] text-gray-400 font-bold">
                      {comment.date}
                    </span>
                  </div>
                  <p className="font-sans text-xs font-semibold text-gray-700 leading-relaxed">
                    {comment.content}
                  </p>
                  <button 
                    onClick={() => {
                      setNewCommentText(`@${comment.author} `);
                      document.getElementById('comment-textarea')?.focus();
                    }}
                    className="mt-2 font-mono text-[10px] font-bold text-[#ef4444] hover:underline cursor-pointer uppercase tracking-wider block"
                  >
                    RESPONDER COMENTARIO
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Comment Input Box */}
          <div className="mt-12 bg-gray-50 border-2 border-black p-6">
            <span className="font-mono text-[10px] font-black tracking-widest text-black mb-4 block uppercase">
              AÑADIR EVALUACIÓN / DUDA DE TALLER
            </span>
            <form onSubmit={handlePostComment}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="form-label">Tu Nombre / Cargo</label>
                  <input 
                    type="text" 
                    value={authorName} 
                    onChange={(e) => setAuthorName(e.target.value)} 
                    placeholder="Ej. Profesor Jose..."
                    className="form-input-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Observación Técnica</label>
                <textarea 
                  id="comment-textarea"
                  rows={4}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="form-textarea" 
                  placeholder="Escribe tu observación o duda aquí..."
                  required
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button 
                  type="submit"
                  className="btn-primary px-6 py-3"
                >
                  PUBLICAR OBSERVACIÓN
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
