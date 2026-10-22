import {
  AuthSession,
  AuthUser,
  ContentSection,
  MagazineArticle,
  SiteVisualConfig,
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '');

interface ApiEnvelope<T> {
  data: T;
}

export interface CreateArticlePayload {
  section: ContentSection;
  title: string;
  category: string;
  excerpt: string;
  heroImage: string;
  blocks: {
    id: string;
    type: 'text' | 'image' | 'heading1' | 'heading2' | 'html';
    content: string;
  }[];
}

export interface UploadedMedia {
  id: string;
  url: string;
  mimeType: string;
  size: number;
}

async function request<T>(path: string, token?: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  if (options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorPayload = payload as { error?: string; message?: string } | null;
    throw new Error(
      errorPayload?.error ||
      errorPayload?.message ||
      `Error del servidor (${response.status}).`
    );
  }

  if (!payload || typeof payload !== 'object' || !('data' in payload)) {
    throw new Error('La respuesta del servidor no tiene el formato esperado.');
  }

  return (payload as ApiEnvelope<T>).data;
}

export async function login(email: string, password: string): Promise<AuthSession> {
  return request<AuthSession>('/auth/login', undefined, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentUser(token: string): Promise<AuthUser> {
  const result = await request<{ user: AuthUser }>('/auth/me', token);
  return result.user;
}

export async function logout(token: string): Promise<void> {
  await request<null>('/auth/logout', token, { method: 'POST' });
}

export async function getPublishedArticles(): Promise<MagazineArticle[]> {
  const result = await request<{ articles: MagazineArticle[] }>('/articles?status=published');
  return result.articles;
}

export async function getMyArticles(token: string): Promise<MagazineArticle[]> {
  const result = await request<{ articles: MagazineArticle[] }>('/articles/mine', token);
  return result.articles;
}

export async function createArticle(
  token: string,
  article: CreateArticlePayload
): Promise<MagazineArticle> {
  const result = await request<{ article: MagazineArticle }>('/articles', token, {
    method: 'POST',
    body: JSON.stringify(article),
  });
  return result.article;
}

export async function updateArticle(
  token: string,
  id: string,
  article: CreateArticlePayload
): Promise<MagazineArticle> {
  const result = await request<{ article: MagazineArticle }>(`/articles/${encodeURIComponent(id)}`, token, {
    method: 'PUT',
    body: JSON.stringify(article),
  });
  return result.article;
}

export async function deleteArticle(token: string, id: string): Promise<void> {
  await request<null>(`/articles/${encodeURIComponent(id)}`, token, { method: 'DELETE' });
}

export async function getSiteVisualConfig(): Promise<SiteVisualConfig> {
  const result = await request<{ config: SiteVisualConfig }>('/site-config');
  return result.config;
}

export async function saveSiteVisualConfig(
  token: string,
  config: SiteVisualConfig
): Promise<SiteVisualConfig> {
  const result = await request<{ config: SiteVisualConfig }>('/site-config', token, {
    method: 'PUT',
    body: JSON.stringify({ config }),
  });
  return result.config;
}

export async function uploadMedia(token: string, file: File): Promise<UploadedMedia> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorPayload = payload as { error?: string } | null;
    throw new Error(errorPayload?.error || `Error al subir el archivo (${response.status}).`);
  }

  if (!payload || typeof payload !== 'object' || !('data' in payload)) {
    throw new Error('La respuesta del servidor no tiene el formato esperado.');
  }

  return (payload as ApiEnvelope<{ media: UploadedMedia }>).data.media;
}
