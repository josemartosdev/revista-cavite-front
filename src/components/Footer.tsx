import { Share2, Mail, ShieldAlert, Award } from 'lucide-react';

interface FooterProps {
  onNavClick: (tab: 'home' | 'portfolio' | 'notebook' | 'editor') => void;
}

export default function Footer({ onNavClick }: FooterProps) {
  return (
    <footer className="w-full bg-white border-t-[4px] border-black grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden" id="platform-footer">
      
      {/* Brand Column / Left Block - large white block with right black border */}
      <div className="md:col-span-5 p-8 md:p-12 border-b-[4px] md:border-b-0 md:border-r-[4px] border-black flex flex-col justify-between space-y-6">
        <div>
          {/* Logo element */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex gap-1 items-center h-8">
              <div className="w-4 h-6 bg-[#ef4444] border-2 border-black"></div>
              <div className="flex flex-col gap-1 h-6">
                <div className="w-3 h-2.5 bg-[#facc15] border-2 border-black"></div>
                <div className="w-3 h-2.5 bg-[#2563eb] border-2 border-black"></div>
              </div>
            </div>
            <h2 className="font-sans font-black text-xl tracking-tight text-black uppercase leading-none">
              FP CONSTRUCCIÓN
            </h2>
          </div>

          <p className="font-sans text-sm text-gray-700 leading-relaxed max-w-sm">
            Portal oficial y bitácora técnica de los ciclos formativos de la familia profesional de <strong>Edificación y Obra Civil</strong> en el <strong>I.E.S. Virgen del Mar</strong> (Almería, España).
          </p>
          <p className="font-sans text-xs text-gray-500 mt-4 leading-relaxed max-w-sm">
            Formamos técnicos altamente capacitados en el replanteo, control de ejecución, dosificación de materiales de construcción y prevención de riesgos laborales.
          </p>
        </div>

        {/* Dynamic color chips */}
        <div className="flex gap-1">
          <div className="w-12 h-6 bg-[#ef4444] border-2 border-black"></div>
          <div className="w-8 h-6 bg-[#facc15] border-2 border-black"></div>
          <div className="w-10 h-6 bg-[#2563eb] border-2 border-black"></div>
          <div className="w-6 h-6 bg-black border-2 border-black"></div>
        </div>
      </div>

      {/* Navigation Column 1 / Middle Left - bordered box */}
      <div className="md:col-span-2 p-8 border-b-[4px] md:border-b-0 md:border-r-[4px] border-black bg-[#fafaf8]">
        <h4 className="label-mono-sm text-black mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-[#ef4444] border border-black"></div>
          Revista
        </h4>
        <ul className="space-y-3 font-mono text-xs text-gray-700 font-medium">
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavClick('home'); }}
              className="hover:text-[#ef4444] transition-colors duration-150 flex items-center gap-1.5"
            >
              • Artículos Técnicos
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavClick('notebook'); }}
              className="hover:text-[#ef4444] transition-colors duration-150 flex items-center gap-1.5"
            >
              • Logs de Alumnos
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavClick('notebook'); }}
              className="hover:text-[#ef4444] transition-colors duration-150 flex items-center gap-1.5"
            >
              • Prácticas del Taller
            </a>
          </li>
        </ul>
      </div>

      {/* Navigation Column 2 / Middle Right - bordered box */}
      <div className="md:col-span-2 p-8 border-b-[4px] md:border-b-0 md:border-r-[4px] border-black">
        <h4 className="label-mono-sm text-black mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-[#facc15] border border-black"></div>
          Estudios
        </h4>
        <ul className="space-y-3 font-mono text-xs text-gray-700 font-medium">
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavClick('portfolio'); }}
              className="hover:text-[#facc15] transition-colors duration-150 flex items-center gap-1.5"
            >
              • Grado Medio Construcción
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onNavClick('portfolio'); }}
              className="hover:text-[#facc15] transition-colors duration-150 flex items-center gap-1.5"
            >
              • Grado Superior Edificación
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); }}
              className="hover:text-[#facc15] transition-colors duration-150 flex items-center gap-1.5"
            >
              • Secretaría I.E.S.
            </a>
          </li>
        </ul>
      </div>

      {/* Action and Copyright Column / Right Block - bordered box */}
      <div className="md:col-span-3 p-8 bg-[#f3f4f6] flex flex-col justify-between items-start md:items-stretch gap-8">
        <div className="space-y-4">
          <h4 className="label-mono text-black flex items-center gap-2">
            <div className="w-2 h-2 bg-[#2563eb] border border-black"></div>
            CONTACTO DEPARTAMENTO
          </h4>
          <div className="flex gap-2">
            <button 
              className="btn-icon w-10 h-10 border-2 border-black bg-white hover:bg-black hover:text-white"
              title="Compartir"
              aria-label="Compartir"
            >
              <Share2 className="w-4 h-4 text-black" />
            </button>
            <button 
              className="btn-icon w-10 h-10 border-2 border-black bg-white hover:bg-black hover:text-white"
              aria-label="E-mail"
            >
              <Mail className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        <div className="space-y-2 border-t-2 border-black pt-4">
          <p className="font-mono text-[9px] text-gray-600 tracking-tight uppercase font-bold">
            ©2026 I.E.S. VIRGEN DEL MAR.
          </p>
          <p className="font-mono text-[8px] text-gray-500 tracking-tight uppercase font-semibold leading-relaxed">
            DEPARTAMENTO DE EDIFICACIÓN Y OBRA CIVIL. ALMERÍA, ESPAÑA.
          </p>
        </div>
      </div>
    </footer>
  );
}
