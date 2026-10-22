import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Eye, EyeOff, GripVertical, ImagePlus, Loader2, Minus, Plus as PlusIcon, Save, Trash2, X } from 'lucide-react';
import {
  CustomSiteModule,
  SiteModuleSettings,
  SitePage,
  SiteVisualConfig,
} from '../types';
import { uploadMedia } from '../services/api';

interface VisualSiteEditorProps {
  token: string;
  config: SiteVisualConfig;
  page: SitePage;
  editing: boolean;
  panelOpen: boolean;
  saving: boolean;
  loadError: string;
  saveError: string;
  onConfigChange: (config: SiteVisualConfig) => void;
  onSave: () => void;
  onCancel: () => void;
  onClose: () => void;
}

interface PendingImageTarget {
  key: string;
  customModuleId?: string;
}

const moduleLabels: Record<SitePage, Record<string, string>> = {
  home: {
    'home-welcome': 'Bienvenida',
    'home-featured-article': 'Artículo destacado',
    'home-categories': 'Categorías',
    'home-featured-projects': 'Proyectos destacados',
    'home-articles': 'Lista de artículos',
    'home-newsletter': 'Boletín',
  },
  notebook: {
    'notebook-heading': 'Cabecera de bitácora',
    'notebook-stream': 'Entradas de prácticas',
  },
  project: {
    'project-hero': 'Portada del proyecto',
    'project-metadata': 'Datos del proyecto',
    'project-description': 'Descripción técnica',
    'project-updates': 'Diario del proyecto',
    'project-gallery': 'Galería',
    'project-comments': 'Comentarios',
  },
};

function moduleSettings(config: SiteVisualConfig, id: string, index: number): SiteModuleSettings {
  return config.modules[id] || { order: index * 10, hidden: false, width: 'full' };
}

function updateModule(
  config: SiteVisualConfig,
  id: string,
  index: number,
  patch: Partial<SiteModuleSettings>
): SiteVisualConfig {
  return {
    ...config,
    modules: {
      ...config.modules,
      [id]: { ...moduleSettings(config, id, index), ...patch },
    },
  };
}

function getStableElementKey(element: HTMLElement, page: SitePage): string | null {
  const boundary = element.closest<HTMLElement>('[data-site-module], [data-site-region], [data-site-page]');
  if (!boundary) return null;

  const boundaryId = boundary.dataset.siteModule || boundary.dataset.siteRegion || page;
  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== boundary) {
    const parent: HTMLElement | null = current.parentElement;
    if (!parent) return null;
    path.unshift(`${current.tagName.toLowerCase()}-${Array.prototype.indexOf.call(parent.children, current)}`);
    current = parent;
  }

  return `text:${boundaryId}:${path.join('.') || boundary.tagName.toLowerCase()}`;
}

function getModuleId(element: HTMLElement): string {
  return element.dataset.siteModule || '';
}

export default function VisualSiteEditor({
  token,
  config,
  page,
  editing,
  panelOpen,
  saving,
  loadError,
  saveError,
  onConfigChange,
  onSave,
  onCancel,
  onClose,
}: VisualSiteEditorProps) {
  const [minimized, setMinimized] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const moduleFileInputRef = useRef<HTMLInputElement>(null);
  const pendingImageTargetRef = useRef<PendingImageTarget | null>(null);

  const customModules = config.customModules[page];
  const pageModules = useMemo(
    () => ({
      ...moduleLabels[page],
      ...Object.fromEntries(customModules.map((module) => [module.id, module.title || 'Módulo nuevo'])),
    }),
    [customModules, page]
  );
  const moduleIds = useMemo(() => Object.keys(pageModules), [pageModules]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('site-theme');
    root.style.setProperty('--site-primary', config.theme.primary);
    root.style.setProperty('--site-secondary', config.theme.secondary);
    root.style.setProperty('--site-accent', config.theme.accent);
    root.style.setProperty('--site-background', config.theme.background);
    root.style.setProperty('--site-border-width', `${config.theme.borderWidth}px`);
    root.style.setProperty('--site-font-family', config.theme.fontFamily);
    document.body.style.backgroundColor = config.theme.background;

    const modules = Array.from(document.querySelectorAll<HTMLElement>('[data-site-module]'));
    const groups = new Map<HTMLElement, HTMLElement[]>();

    modules.forEach((module) => {
      const parent = module.parentElement;
      if (!parent) return;
      const siblings = groups.get(parent) || [];
      const siblingIndex = siblings.length;
      siblings.push(module);
      groups.set(parent, siblings);

      const settings = config.modules[module.dataset.siteModule || ''];
      module.style.display = settings?.hidden ? 'none' : '';
      module.style.order = String(settings?.order ?? siblingIndex * 10);
      module.style.maxWidth = settings?.width === 'wide'
        ? '1100px'
        : settings?.width === 'half'
          ? '760px'
          : '';
      module.style.width = settings?.width && settings.width !== 'full' ? '100%' : '';
      module.style.marginLeft = settings?.width && settings.width !== 'full' ? 'auto' : '';
      module.style.marginRight = settings?.width && settings.width !== 'full' ? 'auto' : '';
    });

    groups.forEach((siblings, parent) => {
      if (siblings.length < 2) return;
      parent.style.display = 'flex';
      parent.style.flexDirection = 'column';
    });

    const roots = [
      ...document.querySelectorAll<HTMLElement>(`[data-site-page="${page}"]`),
      ...document.querySelectorAll<HTMLElement>('[data-site-region="global"]'),
    ];
    const editedElements: HTMLElement[] = [];
    const editedImages: HTMLImageElement[] = [];
    const editedBackgrounds: HTMLElement[] = [];
    const editableModules = modules.filter((module) => module.dataset.sitePage === page);

    roots.forEach((scopeRoot) => {
      scopeRoot.querySelectorAll<HTMLElement>('*').forEach((element) => {
        if (
          element.childElementCount > 0 ||
          !element.textContent?.trim() ||
          element.matches('script, style, textarea, input, select, button, svg, path, [data-visual-editor-ui]') ||
          element.closest('article, [data-visual-editor-ui], [contenteditable="true"]')
        ) return;

        const key = getStableElementKey(element, page);
        if (!key) return;
        element.dataset.siteEditKey = key;
        const contentOverride = config.content[key];
        if (contentOverride !== undefined && element.textContent !== contentOverride) {
          element.textContent = contentOverride;
        }
        if (editing) {
          element.contentEditable = 'true';
          element.spellcheck = true;
          element.classList.add('site-editable-text');
          editedElements.push(element);
        }
      });

      scopeRoot.querySelectorAll<HTMLImageElement>('img').forEach((image) => {
        if (image.closest('article, [data-visual-editor-ui]')) return;
        const key = getStableElementKey(image, page);
        if (!key) return;
        const imageKey = `image:${key}`;
        image.dataset.siteImageKey = imageKey;
        const imageOverride = config.images[imageKey];
        if (imageOverride && image.src !== imageOverride) image.src = imageOverride;
        if (editing) {
          image.classList.add('site-editable-image');
          editedImages.push(image);
        }
      });

      scopeRoot.querySelectorAll<HTMLElement>('[data-site-image-editable]').forEach((element) => {
        const imageKey = `background:${element.dataset.siteImageEditable}`;
        element.dataset.siteImageKey = imageKey;
        const imageOverride = config.images[imageKey];
        if (imageOverride) element.style.backgroundImage = `url("${imageOverride}")`;
        if (editing) {
          element.classList.add('site-editable-image');
          editedBackgrounds.push(element);
        }
      });
    });

    if (!editing) {
      modules.forEach((module) => {
        module.removeAttribute('draggable');
        module.classList.remove('site-editable-module');
      });
      return () => root.classList.remove('site-theme');
    }

    const saveText = (event: Event) => {
      const element = event.target as HTMLElement;
      const key = element.dataset.siteEditKey;
      if (!key) return;
      onConfigChange({
        ...config,
        content: { ...config.content, [key]: element.innerText.trim() },
      });
    };

    const preventNavigation = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest('[data-site-edit-key]');
      if (!target) return;
      event.stopPropagation();
      if (target instanceof HTMLAnchorElement) event.preventDefault();
    };

    const updateImage = (event: MouseEvent) => {
      const image = event.currentTarget as HTMLElement;
      const key = image.dataset.siteImageKey;
      if (!key) return;
      event.preventDefault();
      event.stopPropagation();
      const customModuleElement = image.closest<HTMLElement>('[data-site-custom-module]');
      const customModuleId = customModuleElement?.dataset.siteModule;
      pendingImageTargetRef.current = { key, customModuleId };
      imageFileInputRef.current?.click();
    };

    editedElements.forEach((element) => {
      element.addEventListener('blur', saveText);
      element.addEventListener('click', preventNavigation, true);
      element.addEventListener('keydown', preventNavigation, true);
    });
    [...editedImages, ...editedBackgrounds].forEach((image) => image.addEventListener('click', updateImage));

    editableModules.forEach((module) => {
      module.draggable = true;
      module.classList.add('site-editable-module');
    });

    const dragStart = (event: globalThis.DragEvent) => {
      const module = (event.target as HTMLElement).closest<HTMLElement>('[data-site-module]');
      if (!module) return;
      event.dataTransfer?.setData('text/site-module', getModuleId(module));
      if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
    };
    const dragOver = (event: globalThis.DragEvent) => {
      if ((event.target as HTMLElement).closest('[data-site-module]')) event.preventDefault();
    };
    const drop = (event: globalThis.DragEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('[data-site-module]');
      const sourceId = event.dataTransfer?.getData('text/site-module');
      const targetId = target?.dataset.siteModule;
      if (!target || !sourceId || !targetId || sourceId === targetId) return;
      event.preventDefault();
      const ordered = editableModules
        .map((module) => module.dataset.siteModule || '')
        .filter(Boolean)
        .sort((a, b) => (config.modules[a]?.order ?? moduleIds.indexOf(a) * 10) - (config.modules[b]?.order ?? moduleIds.indexOf(b) * 10));
      const from = ordered.indexOf(sourceId);
      const to = ordered.indexOf(targetId);
      if (from < 0 || to < 0) return;
      ordered.splice(to, 0, ...ordered.splice(from, 1));
      const nextModules = { ...config.modules };
      ordered.forEach((id, index) => {
        nextModules[id] = { ...moduleSettings(config, id, moduleIds.indexOf(id)), order: index * 10 };
      });
      onConfigChange({ ...config, modules: nextModules });
    };

    document.addEventListener('dragstart', dragStart as EventListener);
    document.addEventListener('dragover', dragOver as EventListener);
    document.addEventListener('drop', drop as EventListener);

    return () => {
      editedElements.forEach((element) => {
        element.removeEventListener('blur', saveText);
        element.removeEventListener('click', preventNavigation, true);
        element.removeEventListener('keydown', preventNavigation, true);
        element.removeAttribute('contenteditable');
        element.classList.remove('site-editable-text');
      });
      editedImages.forEach((image) => {
        image.removeEventListener('click', updateImage);
        image.classList.remove('site-editable-image');
      });
      editedBackgrounds.forEach((element) => {
        element.removeEventListener('click', updateImage);
        element.classList.remove('site-editable-image');
      });
      editableModules.forEach((module) => {
        module.removeAttribute('draggable');
        module.classList.remove('site-editable-module');
      });
      document.removeEventListener('dragstart', dragStart as EventListener);
      document.removeEventListener('dragover', dragOver as EventListener);
      document.removeEventListener('drop', drop as EventListener);
      root.classList.remove('site-theme');
    };
  }, [config, editing, moduleIds, onConfigChange, page]);

  const updateTheme = (key: keyof SiteVisualConfig['theme'], value: string | number) => {
    onConfigChange({ ...config, theme: { ...config.theme, [key]: value } });
  };

  const reorder = (id: string, direction: -1 | 1) => {
    const ordered = [...moduleIds].sort((a, b) =>
      moduleSettings(config, a, moduleIds.indexOf(a)).order -
      moduleSettings(config, b, moduleIds.indexOf(b)).order
    );
    const currentIndex = ordered.indexOf(id);
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= ordered.length) return;
    [ordered[currentIndex], ordered[nextIndex]] = [ordered[nextIndex], ordered[currentIndex]];
    let nextConfig = config;
    ordered.forEach((moduleId, index) => {
      nextConfig = updateModule(nextConfig, moduleId, moduleIds.indexOf(moduleId), { order: index * 10 });
    });
    onConfigChange(nextConfig);
  };

  const addCustomModule = (withImage: boolean) => {
    if (withImage) {
      moduleFileInputRef.current?.click();
      return;
    }
    const module: CustomSiteModule = {
      id: `custom-${page}-${Date.now()}`,
      title: 'Nuevo módulo',
      body: 'Haz clic aquí para escribir el contenido de esta sección.',
    };
    onConfigChange({
      ...config,
      customModules: {
        ...config.customModules,
        [page]: [...config.customModules[page], module],
      },
    });
  };

  const handleModuleImageFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setImageUploadError('');
    setImageUploading(true);
    try {
      const media = await uploadMedia(token, file);
      const module: CustomSiteModule = {
        id: `custom-${page}-${Date.now()}`,
        title: 'Nuevo módulo',
        body: 'Haz clic aquí para escribir el contenido de esta sección.',
        imageUrl: media.url,
      };
      onConfigChange({
        ...config,
        customModules: {
          ...config.customModules,
          [page]: [...config.customModules[page], module],
        },
      });
    } catch (error) {
      setImageUploadError(error instanceof Error ? error.message : 'No se pudo subir la imagen.');
    } finally {
      setImageUploading(false);
    }
  };

  const handleInlineImageFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    const pending = pendingImageTargetRef.current;
    pendingImageTargetRef.current = null;
    if (!file || !pending) return;

    setImageUploadError('');
    setImageUploading(true);
    try {
      const media = await uploadMedia(token, file);
      const { key, customModuleId } = pending;
      if (key.startsWith('background:')) {
        onConfigChange({ ...config, images: { ...config.images, [key]: media.url } });
      } else if (customModuleId) {
        onConfigChange({
          ...config,
          customModules: {
            ...config.customModules,
            [page]: config.customModules[page].map((module) =>
              module.id === customModuleId ? { ...module, imageUrl: media.url } : module
            ),
          },
        });
      } else {
        onConfigChange({ ...config, images: { ...config.images, [key]: media.url } });
      }
    } catch (error) {
      setImageUploadError(error instanceof Error ? error.message : 'No se pudo subir la imagen.');
    } finally {
      setImageUploading(false);
    }
  };

  const removeCustomModule = (id: string) => {
    const nextContent = { ...config.content };
    const nextImages = { ...config.images };
    Object.keys(nextContent).forEach((key) => {
      if (key.includes(`:${id}:`)) delete nextContent[key];
    });
    Object.keys(nextImages).forEach((key) => {
      if (key.includes(`:${id}:`)) delete nextImages[key];
    });
    const nextModules = { ...config.modules };
    delete nextModules[id];
    onConfigChange({
      ...config,
      content: nextContent,
      images: nextImages,
      modules: nextModules,
      customModules: {
        ...config.customModules,
        [page]: config.customModules[page].filter((module) => module.id !== id),
      },
    });
  };

  return (
    <>
      {editing && (
        <div className="fixed inset-0 z-[70] pointer-events-none border-[5px] border-[#2563eb]" aria-hidden="true" />
      )}
      {panelOpen && <aside
        data-visual-editor-ui
        className={`fixed bottom-3 left-3 z-[80] w-[min(390px,calc(100vw-24px))] border-[3px] border-black bg-white shadow-2xl ${minimized ? '' : 'max-h-[82vh] overflow-y-auto'}`}
      >
        <input ref={imageFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleInlineImageFile} />
        <input ref={moduleFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleModuleImageFile} />
        <header className="flex items-center justify-between border-b-[3px] border-black bg-black px-4 py-3 text-white">
          <div>
            <p className="font-mono text-[9px] font-black tracking-widest text-[#facc15]">EDITOR DEL SITIO</p>
            <h2 className="font-serif text-lg font-black">Modo visual</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMinimized((current) => !current)}
              aria-label={minimized ? 'Restaurar editor' : 'Minimizar editor'}
              className="border-2 border-white p-1 hover:bg-white hover:text-black"
            >
              {minimized ? <PlusIcon className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
            </button>
            <button type="button" onClick={onClose} aria-label="Cerrar editor" className="border-2 border-white p-1 hover:bg-white hover:text-black">
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {!minimized && <div className="space-y-4 p-4">
          <p className="font-sans text-xs leading-relaxed text-gray-700">
            Haz clic en un texto para editarlo, en una imagen para subir una nueva o arrastra los módulos para cambiar su orden. Los cambios se guardan en la API.
          </p>
          {loadError && (
            <p role="alert" className="border-2 border-red-700 bg-red-50 p-2 font-mono text-[10px] text-red-800">
              No se pudo cargar la configuración guardada: {loadError}
            </p>
          )}
          {saveError && (
            <p role="alert" className="border-2 border-red-700 bg-red-50 p-2 font-mono text-[10px] text-red-800">
              No se pudo guardar en el servidor: {saveError}
            </p>
          )}
          {imageUploadError && (
            <p role="alert" className="border-2 border-red-700 bg-red-50 p-2 font-mono text-[10px] text-red-800">
              No se pudo subir la imagen: {imageUploadError}
            </p>
          )}
          {imageUploading && (
            <p className="flex items-center gap-2 border-2 border-black bg-blue-50 p-2 font-mono text-[10px] font-bold text-black">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> SUBIENDO IMAGEN...
            </p>
          )}

          <section className="border-t-2 border-black pt-3">
            <h3 className="mb-3 font-mono text-[10px] font-black tracking-wider">ESTILO GLOBAL</h3>
            <div className="grid grid-cols-2 gap-3">
              {([
                ['primary', 'Color principal'],
                ['secondary', 'Color secundario'],
                ['accent', 'Color de acento'],
                ['background', 'Fondo'],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between gap-2 font-mono text-[9px] font-bold">
                  {label}
                  <input type="color" value={config.theme[key]} onChange={(event) => updateTheme(key, event.target.value)} className="h-8 w-10 cursor-pointer border border-black bg-white p-0.5" />
                </label>
              ))}
              <label className="col-span-2 flex items-center justify-between font-mono text-[9px] font-bold">
                Grosor de bordes
                <select value={config.theme.borderWidth} onChange={(event) => updateTheme('borderWidth', Number(event.target.value))} className="border-2 border-black bg-white px-2 py-1">
                  <option value={1}>Fino</option>
                  <option value={2}>Medio</option>
                  <option value={3}>Grueso</option>
                  <option value={4}>Muy grueso</option>
                </select>
              </label>
              <label className="col-span-2 flex items-center justify-between font-mono text-[9px] font-bold">
                Tipografía base
                <select value={config.theme.fontFamily} onChange={(event) => updateTheme('fontFamily', event.target.value)} className="border-2 border-black bg-white px-2 py-1">
                  <option value="Inter">Inter</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Arial">Arial</option>
                </select>
              </label>
            </div>
          </section>

          <section className="border-t-2 border-black pt-3">
            <h3 className="mb-2 font-mono text-[10px] font-black tracking-wider">MÓDULOS DE ESTA PÁGINA</h3>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => addCustomModule(false)} className="flex items-center justify-center gap-1 border-2 border-dashed border-black bg-gray-50 px-2 py-2 font-mono text-[8px] font-black hover:bg-yellow-50">
                <ImagePlus className="h-3.5 w-3.5" /> AÑADIR TEXTO
              </button>
              <button type="button" onClick={() => addCustomModule(true)} className="flex items-center justify-center gap-1 border-2 border-dashed border-black bg-gray-50 px-2 py-2 font-mono text-[8px] font-black hover:bg-yellow-50">
                <ImagePlus className="h-3.5 w-3.5" /> TEXTO + IMAGEN
              </button>
            </div>
            <ul className="space-y-2">
              {[...moduleIds].sort((a, b) =>
                moduleSettings(config, a, moduleIds.indexOf(a)).order -
                moduleSettings(config, b, moduleIds.indexOf(b)).order
              ).map((id, index) => {
                const settings = moduleSettings(config, id, moduleIds.indexOf(id));
                return (
                  <li key={id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-1 border border-black p-2">
                    <span className="flex min-w-0 items-center gap-1 font-sans text-[10px] font-bold text-black">
                      <GripVertical className="h-3.5 w-3.5 shrink-0 text-gray-500" />
                      <span className="truncate">{pageModules[id]}</span>
                    </span>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => reorder(id, -1)} disabled={index === 0} className="border border-black px-1.5 py-1 font-mono text-[9px] disabled:opacity-30" aria-label="Subir módulo">↑</button>
                      <button type="button" onClick={() => reorder(id, 1)} disabled={index === moduleIds.length - 1} className="border border-black px-1.5 py-1 font-mono text-[9px] disabled:opacity-30" aria-label="Bajar módulo">↓</button>
                    </div>
                    <div className="flex gap-1">
                      <select
                        aria-label={`Ancho de ${pageModules[id]}`}
                        value={settings.width}
                        onChange={(event) => onConfigChange(updateModule(config, id, moduleIds.indexOf(id), { width: event.target.value as SiteModuleSettings['width'] }))}
                        className="max-w-[78px] border border-black bg-white px-1 py-1 font-mono text-[8px]"
                      >
                        <option value="full">100%</option>
                        <option value="wide">Amplio</option>
                        <option value="half">Medio</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => onConfigChange(updateModule(config, id, moduleIds.indexOf(id), { hidden: !settings.hidden }))}
                        className="border border-black p-1 hover:bg-yellow-100"
                        aria-label={settings.hidden ? 'Mostrar módulo' : 'Ocultar módulo'}
                      >
                        {settings.hidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </button>
                    </div>
                    {id.startsWith('custom-') ? (
                      <button type="button" onClick={() => removeCustomModule(id)} aria-label="Eliminar módulo personalizado" className="border border-black p-1 text-red-700 hover:bg-red-50">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    ) : <span />}
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="grid grid-cols-2 gap-2 border-t-2 border-black pt-3">
            <button type="button" onClick={onCancel} disabled={saving} className="flex items-center justify-center gap-2 border-2 border-black bg-white px-3 py-2 font-mono text-[9px] font-black hover:bg-gray-100 disabled:opacity-50">
              <X className="h-3.5 w-3.5" /> DESCARTAR
            </button>
            <button type="button" onClick={onSave} disabled={saving} className="flex items-center justify-center gap-2 border-2 border-black bg-[#facc15] px-3 py-2 font-mono text-[9px] font-black hover:bg-yellow-300 disabled:opacity-50">
              {saving ? <span className="animate-spin">◌</span> : <Save className="h-3.5 w-3.5" />}
              {saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
          <p className="flex items-center gap-1 font-mono text-[9px] text-gray-500">
            <Check className="h-3 w-3 text-green-700" />
            El sitio público conserva estos cambios tras guardar.
          </p>
        </div>}
      </aside>}
    </>
  );
}
