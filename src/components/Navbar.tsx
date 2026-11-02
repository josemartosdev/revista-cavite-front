import { MouseEvent } from 'react';
import { Search, HardHat, LogOut, Palette } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'portfolio' | 'notebook' | 'editor';
  setActiveTab: (tab: 'home' | 'portfolio' | 'notebook' | 'editor') => void;
  isAuthenticated: boolean;
  canEditSite: boolean;
  userName?: string;
  onLogout: () => void;
  visualEditMode: boolean;
  onToggleVisualEdit: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  isAuthenticated,
  canEditSite,
  userName,
  onLogout,
  visualEditMode,
  onToggleVisualEdit,
}: NavbarProps) {
  const handleNavClick = (tab: 'home' | 'portfolio' | 'notebook' | 'editor', e: MouseEvent) => {
    e.preventDefault();
    setActiveTab(tab);
  };

  return (
    <>
      <header data-site-region="global" className="fixed top-0 left-0 w-full h-28 md:h-20 bg-white border-b-[4px] border-black z-50 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:justify-between items-stretch w-full px-2 md:px-8 h-full">
          <div className="flex min-w-0 flex-col md:flex-row md:items-stretch md:gap-4">
            <div className="flex h-20 shrink-0 items-center gap-2 py-1 md:gap-3">
              <a 
                href="#" 
                onClick={(e) => handleNavClick('home', e)}
                className="flex items-center gap-2 group"
                id="brand-logo"
              >
                {/* Mini Mondrian Logo Block */}
                <div className="flex gap-1 items-center h-8 shrink-0">
                  <div className="w-5 h-7 bg-[#ef4444] border-2 border-black shrink-0"></div>
                  <div className="flex flex-col gap-1 h-7">
                    <div className="w-4 h-3 bg-[#facc15] border-2 border-black shrink-0"></div>
                    <div className="w-4 h-3 bg-[#2563eb] border-2 border-black shrink-0"></div>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <span className="font-sans font-black tracking-tight text-sm md:text-lg text-black uppercase leading-none">
                    FP CONSTRUCCIÓN
                  </span>
                  <span className="font-mono text-[9px] font-bold text-[#444748] tracking-widest uppercase leading-none mt-1">
                    I.E.S. VIRGEN DEL MAR
                  </span>
                </div>
              </a>
            </div>

            <nav className="no-scrollbar flex h-8 w-full shrink-0 items-stretch overflow-x-auto md:ml-4 md:h-20 md:w-auto md:border-l-[3px] md:border-black">
              <a
                href="#"
                onClick={(e) => handleNavClick('home', e)}
                className={`label-nav shrink-0 transition-all duration-150 px-3 md:px-6 flex items-center border-r-[3px] border-black ${
                  activeTab === 'home'
                    ? 'bg-[#ef4444] text-white'
                    : 'bg-white text-black hover:bg-[#ef4444]/10'
                }`}
                id="nav-home"
              >
                REVISTA / LOGS
              </a>
              <a
                href="#"
                onClick={(e) => handleNavClick('portfolio', e)}
                className={`label-nav shrink-0 transition-all duration-150 px-3 md:px-6 flex items-center border-r-[3px] border-black ${
                  activeTab === 'portfolio'
                    ? 'bg-[#facc15] text-black'
                    : 'bg-white text-black hover:bg-[#facc15]/20'
                }`}
                id="nav-portfolio"
              >
                PROYECTO TALLER
              </a>
              <a
                href="#"
                onClick={(e) => handleNavClick('notebook', e)}
                className={`label-nav shrink-0 transition-all duration-150 px-3 md:px-6 flex items-center border-r-[3px] border-black ${
                  activeTab === 'notebook'
                    ? 'bg-[#2563eb] text-white'
                    : 'bg-white text-black hover:bg-[#2563eb]/10'
                }`}
                id="nav-notebook"
              >
                BITÁCORA ALUMNOS
              </a>
              <a
                href="#"
                onClick={(e) => handleNavClick('editor', e)}
                className={`label-nav shrink-0 transition-all duration-150 px-3 md:px-6 flex items-center border-r-[3px] border-black ${
                  activeTab === 'editor'
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-black/10'
                }`}
                id="nav-editor"
              >
                REDACCIÓN
              </a>
            </nav>
          </div>

          <div className="absolute right-2 top-0 flex h-20 items-stretch border-l-[3px] border-black bg-white md:static md:right-auto md:top-auto md:h-auto">
            <button className="btn-icon px-1 border-r-[3px] border-black md:px-5" aria-label="Search">
              <Search className="w-4 h-4 text-black" />
            </button>
            <button 
              onClick={(e) => handleNavClick('editor', e)}
              className="btn-icon px-1 md:px-5"
              aria-label="Profile"
              title={isAuthenticated ? `Redacción: ${userName}` : 'Acceso de redacción'}
            >
              <HardHat className="w-5 h-5 text-black" />
            </button>
            {isAuthenticated && canEditSite && (
              <button
                onClick={onToggleVisualEdit}
                className={`btn-icon border-l-[3px] border-black px-1 md:px-3 ${visualEditMode ? 'bg-[#facc15]' : ''}`}
                aria-label={visualEditMode ? 'Salir del modo diseño' : 'Editar diseño del sitio'}
                title={visualEditMode ? 'Salir del modo diseño' : 'Editar diseño del sitio'}
              >
                <Palette className="h-4 w-4 text-black" />
              </button>
            )}
            {isAuthenticated && (
              <button
                onClick={onLogout}
                className="btn-icon border-l-[3px] border-black px-1 md:px-3"
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4 text-black" />
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
