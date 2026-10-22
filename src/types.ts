export interface EditorBlock {
  id: string;
  type: 'text' | 'image' | 'heading1' | 'heading2' | 'html';
  content: string;
  caption?: string;
  metadata?: string;
  alt?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  logNum: string;
  tag: string;
  title: string;
  blocks: EditorBlock[];
}

export interface Comment {
  id: string;
  author: string;
  avatarInitials: string;
  date: string;
  content: string;
}

export interface MaterialItem {
  num: string;
  name: string;
  type: string;
}

export interface Project {
  id: string;
  title: string;
  number: string;
  location: string;
  year: string;
  area: string;
  status: string;
  materials: MaterialItem[];
  concept: string;
  materialsDesc: string;
  systemsDesc: string;
  challengesDesc: string;
  heroImage: string;
  images: {
    src: string;
    caption: string;
    figNum: string;
  }[];
  comments: Comment[];
}

export interface MagazineArticle {
  id: string;
  section?: ContentSection;
  tag: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  heroImage: string;
  category: string;
  contentHtml?: string;
  blocks?: EditorBlock[];
  publishedAt?: string;
}

export type ContentSection = 'magazine' | 'notebook' | 'project';

export const CONTENT_SECTIONS: { value: ContentSection; label: string }[] = [
  { value: 'magazine', label: 'Revista técnica' },
  { value: 'notebook', label: 'Bitácora de prácticas' },
  { value: 'project', label: 'Proyecto de taller' },
];

export const ARTICLE_CATEGORIES = [
  'TECNOLOGÍA DE MEZCLAS',
  'SEGURIDAD EN OBRA',
  'SALIDAS PROFESIONALES',
] as const;

export const SECTION_CATEGORIES: Record<ContentSection, readonly string[]> = {
  magazine: ARTICLE_CATEGORIES,
  notebook: ['TALLER PRÁCTICO', 'SEGURIDAD Y SALUD', 'TOPOGRAFÍA'],
  project: ['AVANCE DE OBRA', 'MATERIALES', 'RESULTADO FINAL'],
};

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'editor';
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

// A "page" key covers the three built-in pages ('home' | 'notebook' | 'project')
// plus any custom nav item id created by an admin — hence a plain string.
export type SitePage = string;

export type SiteModuleWidth = 'full' | 'wide' | 'half';

export interface SiteModuleSettings {
  order: number;
  hidden: boolean;
  width: SiteModuleWidth;
}

export interface CustomSiteModule {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
}

export interface NavItem {
  id: string;
  label: string;
}

export interface SiteVisualConfig {
  version: 1;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    borderWidth: number;
    fontFamily: 'Inter' | 'Georgia' | 'Arial';
  };
  content: Record<string, string>;
  images: Record<string, string>;
  modules: Record<string, SiteModuleSettings>;
  categories: Record<ContentSection, string[]>;
  navItems: NavItem[];
  customModules: Record<SitePage, CustomSiteModule[]>;
}

export const DEFAULT_SITE_VISUAL_CONFIG: SiteVisualConfig = {
  version: 1,
  theme: {
    primary: '#ef4444',
    secondary: '#facc15',
    accent: '#2563eb',
    background: '#ffffff',
    borderWidth: 3,
    fontFamily: 'Inter',
  },
  content: {},
  images: {},
  modules: {},
  categories: {
    magazine: [...ARTICLE_CATEGORIES],
    notebook: ['TALLER PRÁCTICO', 'SEGURIDAD Y SALUD', 'TOPOGRAFÍA'],
    project: ['AVANCE DE OBRA', 'MATERIALES', 'RESULTADO FINAL'],
  },
  navItems: [],
  customModules: {
    home: [],
    notebook: [],
    project: [],
  },
};
