import { MouseEvent } from 'react';
import { Menu, Search, User, HardHat } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'portfolio' | 'notebook' | 'editor';
  setActiveTab: (tab: 'home' | 'portfolio' | 'notebook' | 'editor') => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Navbar({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }: NavbarProps) {
  const handleNavClick = (tab: 'home' | 'portfolio' | 'notebook' | 'editor', e: MouseEvent) => {
    e.preventDefault();
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-20 bg-white border-b-[4px] border-black z-50 transition-all duration-300">
        <div className="flex justify-between items-stretch w-full px-4 md:px-8 h-full">
          {/* Left Side: Brand and Desktop Nav */}
          <div className="flex items-stretch gap-4">
            <div className="flex items-center gap-2 md:gap-3 py-1">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="btn-icon p-2 border-2 border-black rounded-none md:hidden"
                aria-label="Toggle Menu"
                id="mobile-menu-btn"
              >
                <Menu className="w-5 h-5 text-black" />
              </button>
              
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

            {/* Desktop Navigation Links - Structured as contiguous Mondrian blocks */}
            <nav className="hidden md:flex items-stretch ml-4 border-l-[3px] border-black h-20">
              <a
                href="#"
                onClick={(e) => handleNavClick('home', e)}
                className={`label-nav transition-all duration-150 px-6 flex items-center border-r-[3px] border-black ${
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
                className={`label-nav transition-all duration-150 px-6 flex items-center border-r-[3px] border-black ${
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
                className={`label-nav transition-all duration-150 px-6 flex items-center border-r-[3px] border-black ${
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
                className={`label-nav transition-all duration-150 px-6 flex items-center border-r-[3px] border-black ${
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

          {/* Right Side: Actions - structured inside a white block with black borders */}
          <div className="flex items-stretch border-l-[3px] border-black">
            <button className="btn-icon px-5 border-r-[3px] border-black" aria-label="Search">
              <Search className="w-4 h-4 text-black" />
            </button>
            <button 
              onClick={(e) => handleNavClick('editor', e)}
              className="btn-icon px-5" 
              aria-label="Profile"
              title="Panel de Redacción de IA"
            >
              <HardHat className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#1a1c1c]/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          id="mobile-drawer-overlay"
        />
      )}

      {/* Mobile Drawer Menu - Styled with heavy borders and primary color squares */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r-[4px] border-black z-50 shadow-2xl transition-transform duration-300 md:hidden pt-24 px-6 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        id="mobile-drawer"
      >
        <div className="space-y-6">
          <div className="border-b-2 border-black pb-4">
            <h3 className="font-mono text-xs font-bold text-black tracking-widest uppercase">Navegación</h3>
          </div>
          <nav className="flex flex-col gap-3">
            <a
              href="#"
              onClick={(e) => handleNavClick('home', e)}
              className={`label-nav py-3 px-4 border-2 border-black flex items-center gap-3 transition-colors ${
                activeTab === 'home'
                  ? 'bg-[#ef4444] text-white'
                  : 'bg-white text-black hover:bg-[#ef4444]/10'
              }`}
            >
              <div className="w-3 h-3 bg-[#ef4444] border border-black"></div>
              Revista / Logs
            </a>
            <a
              href="#"
              onClick={(e) => handleNavClick('portfolio', e)}
              className={`label-nav py-3 px-4 border-2 border-black flex items-center gap-3 transition-colors ${
                activeTab === 'portfolio'
                  ? 'bg-[#facc15] text-black'
                  : 'bg-white text-black hover:bg-[#facc15]/20'
              }`}
            >
              <div className="w-3 h-3 bg-[#facc15] border border-black"></div>
              Proyecto Taller
            </a>
            <a
              href="#"
              onClick={(e) => handleNavClick('notebook', e)}
              className={`label-nav py-3 px-4 border-2 border-black flex items-center gap-3 transition-colors ${
                activeTab === 'notebook'
                  ? 'bg-[#2563eb] text-white'
                  : 'bg-white text-black hover:bg-[#2563eb]/10'
              }`}
            >
              <div className="w-3 h-3 bg-[#2563eb] border border-black"></div>
              Bitácora Alumnos
            </a>
            <a
              href="#"
              onClick={(e) => handleNavClick('editor', e)}
              className={`label-nav py-3 px-4 border-2 border-black flex items-center gap-3 transition-colors ${
                activeTab === 'editor'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-black/10'
              }`}
            >
              <div className="w-3 h-3 bg-black border border-white"></div>
              Redacción IA
            </a>
          </nav>

          <div className="pt-8 border-t-2 border-black flex flex-col gap-2">
            <div className="flex gap-1.5 justify-center">
              <div className="w-8 h-8 bg-[#ef4444] border-2 border-black"></div>
              <div className="w-8 h-8 bg-[#facc15] border-2 border-black"></div>
              <div className="w-8 h-8 bg-[#2563eb] border-2 border-black"></div>
            </div>
            <p className="font-mono text-[9px] text-center text-gray-500 uppercase font-bold tracking-widest mt-2">
              Edificación y Obra Civil
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
