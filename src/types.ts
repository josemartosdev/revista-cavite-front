export interface EditorBlock {
  id: string;
  type: 'text' | 'image' | 'heading1' | 'heading2';
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
  tag: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  heroImage: string;
  category: string;
  contentHtml?: string;
}
