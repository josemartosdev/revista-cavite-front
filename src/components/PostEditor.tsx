import { FormEvent, useRef, useState } from 'react';
import { ImagePlus, Loader2, Pencil, Plus, Send, Trash2 } from 'lucide-react';
import { CONTENT_SECTIONS, ContentSection, EditorBlock, MagazineArticle } from '../types';
import { CreateArticlePayload, uploadMedia } from '../services/api';
import RichTextEditor from './RichTextEditor';

interface PostEditorProps {
  token: string;
  authorName: string;
  articles: MagazineArticle[];
  articlesError?: string;
  defaultSection: ContentSection;
  editingArticle?: MagazineArticle;
  categories: Record<ContentSection, string[]>;
  onPublish: (payload: CreateArticlePayload) => Promise<MagazineArticle>;
  onPublished: (article: MagazineArticle) => void;
  onEdit: (article: MagazineArticle) => void;
  onDelete: (article: MagazineArticle) => Promise<void>;
  onAddCategory: (section: ContentSection, category: string) => Promise<void>;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function blocksToHtml(blocks?: EditorBlock[]): string {
  if (!blocks || blocks.length === 0) return '';
  const htmlBlock = blocks.find((block) => block.type === 'html');
  if (htmlBlock) return htmlBlock.content;

  return blocks
    .filter((block) => block.type === 'text' || block.type === 'heading1' || block.type === 'heading2')
    .map((block) => {
      if (block.type === 'heading1') return `<h1>${escapeHtml(block.content)}</h1>`;
      if (block.type === 'heading2') return `<h2>${escapeHtml(block.content)}</h2>`;
      return `<p>${escapeHtml(block.content)}</p>`;
    })
    .join('');
}

export default function PostEditor({
  token,
  authorName,
  articles,
  articlesError,
  defaultSection,
  editingArticle,
  categories,
  onPublish,
  onPublished,
  onEdit,
  onDelete,
  onAddCategory,
}: PostEditorProps) {
  const [section, setSection] = useState<ContentSection>(editingArticle?.section || defaultSection);
  const [title, setTitle] = useState(editingArticle?.title || '');
  const [category, setCategory] = useState<string>(
    editingArticle?.category || categories[editingArticle?.section || defaultSection][0]
  );
  const [excerpt, setExcerpt] = useState(editingArticle?.excerpt || '');
  const [heroImage, setHeroImage] = useState(editingArticle?.heroImage || '');
  const [bodyHtml, setBodyHtml] = useState(blocksToHtml(editingArticle?.blocks));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [heroUploadError, setHeroUploadError] = useState('');
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categorySaving, setCategorySaving] = useState(false);
  const [categoryError, setCategoryError] = useState('');

  const handleSectionChange = (nextSection: ContentSection) => {
    setSection(nextSection);
    setCategory(categories[nextSection][0]);
    setAddingCategory(false);
  };

  const handleStartNewCategory = () => {
    setCategoryError('');
    setNewCategoryName('');
    setAddingCategory(true);
  };

  const handleConfirmNewCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setCategoryError('Escribe un nombre para la categoría.');
      return;
    }
    setCategorySaving(true);
    setCategoryError('');
    try {
      await onAddCategory(section, trimmed);
      setCategory(trimmed);
      setAddingCategory(false);
      setNewCategoryName('');
    } catch (addError) {
      setCategoryError(addError instanceof Error ? addError.message : 'No se pudo crear la categoría.');
    } finally {
      setCategorySaving(false);
    }
  };

  const handlePickHeroImage = () => {
    setHeroUploadError('');
    heroFileInputRef.current?.click();
  };

  const handleHeroFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploadingHero(true);
    setHeroUploadError('');
    try {
      const media = await uploadMedia(token, file);
      setHeroImage(media.url);
    } catch (uploadError) {
      setHeroUploadError(uploadError instanceof Error ? uploadError.message : 'No se pudo subir la imagen.');
    } finally {
      setUploadingHero(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const plainText = bodyHtml.replace(/<[^>]+>/g, '').trim();
    if (plainText.length === 0) {
      setError('El contenido de la publicación no puede estar vacío.');
      return;
    }

    setSaving(true);

    const payload: CreateArticlePayload = {
      section,
      title: title.trim(),
      category,
      excerpt: excerpt.trim(),
      heroImage: heroImage.trim(),
      blocks: [{ id: 'content', type: 'html' as const, content: bodyHtml.trim() }],
    };

    try {
      const article = await onPublish(payload);
      onPublished(article);
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : 'No se pudo publicar la entrada.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 pt-32 pb-20 md:px-8" id="post-editor">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-col gap-4 border-b-[4px] border-black pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label-mono-sm mb-2 block text-[#ef4444]">REDACCIÓN // {editingArticle ? 'EDITAR PUBLICACIÓN' : 'NUEVA PUBLICACIÓN'}</span>
            <h1 className="font-serif text-3xl font-black text-black md:text-5xl">{editingArticle ? 'Editar publicación' : 'Nueva publicación'}</h1>
          </div>
          <p className="font-mono text-xs font-bold uppercase text-gray-600">Autor: {authorName}</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="grid gap-5 border-[3px] border-black bg-white p-5 md:grid-cols-2 md:p-8">
            <label className="block">
              <span className="label-mono-sm mb-2 block text-black">SECCIÓN</span>
              <select
                required
                value={section}
                onChange={(event) => handleSectionChange(event.target.value as ContentSection)}
                className="w-full border-2 border-black bg-white px-3 py-3 font-mono text-xs font-bold text-black outline-none focus:border-[#2563eb]"
              >
                {CONTENT_SECTIONS.map((contentSection) => (
                  <option key={contentSection.value} value={contentSection.value}>{contentSection.label}</option>
                ))}
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="label-mono-sm mb-2 block text-black">TÍTULO</span>
              <input
                required
                maxLength={180}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Título de la publicación"
                className="w-full border-2 border-black px-3 py-3 font-serif text-xl font-black text-black outline-none focus:border-[#ef4444]"
              />
            </label>
            <label className="block">
              <span className="label-mono-sm mb-2 block text-black">CATEGORÍA</span>
              {!addingCategory ? (
                <div className="flex gap-2">
                  <select
                    required
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full border-2 border-black bg-white px-3 py-3 font-mono text-xs font-bold text-black outline-none focus:border-[#2563eb]"
                  >
                    {categories[section].map((articleCategory) => (
                      <option key={articleCategory} value={articleCategory}>{articleCategory}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleStartNewCategory}
                    title="Crear una categoría nueva"
                    className="flex shrink-0 items-center gap-2 border-2 border-black bg-white px-3 py-2 font-mono text-[10px] font-black hover:bg-[#facc15]"
                  >
                    <Plus className="h-4 w-4" /> NUEVA
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={newCategoryName}
                    onChange={(event) => setNewCategoryName(event.target.value)}
                    placeholder="Nombre de la categoría nueva"
                    className="w-full border-2 border-black px-3 py-3 font-mono text-xs font-bold text-black outline-none focus:border-[#2563eb]"
                  />
                  <button
                    type="button"
                    onClick={handleConfirmNewCategory}
                    disabled={categorySaving}
                    className="flex shrink-0 items-center gap-2 border-2 border-black bg-[#facc15] px-3 py-2 font-mono text-[10px] font-black disabled:opacity-50"
                  >
                    {categorySaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'GUARDAR'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddingCategory(false)}
                    disabled={categorySaving}
                    className="shrink-0 border-2 border-black bg-white px-3 py-2 font-mono text-[10px] font-black hover:bg-gray-100 disabled:opacity-50"
                  >
                    CANCELAR
                  </button>
                </div>
              )}
              {categoryError && (
                <span className="mt-2 block font-mono text-[10px] font-bold text-[#ef4444]">{categoryError}</span>
              )}
            </label>
            <label className="block">
              <span className="label-mono-sm mb-2 block text-black">IMAGEN DE PORTADA</span>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={heroImage}
                  onChange={(event) => setHeroImage(event.target.value)}
                  placeholder="https://... o sube una foto"
                  className="w-full border-2 border-black px-3 py-3 font-sans text-sm text-black outline-none focus:border-[#2563eb]"
                />
                <button
                  type="button"
                  onClick={handlePickHeroImage}
                  disabled={uploadingHero}
                  title="Subir foto desde el ordenador"
                  className="flex shrink-0 items-center gap-2 border-2 border-black bg-white px-3 py-2 font-mono text-[10px] font-black hover:bg-[#facc15] disabled:opacity-50"
                >
                  {uploadingHero ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                  SUBIR
                </button>
                <input
                  ref={heroFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleHeroFileChange}
                />
              </div>
              {heroUploadError && (
                <span className="mt-2 block font-mono text-[10px] font-bold text-[#ef4444]">{heroUploadError}</span>
              )}
              {heroImage && (
                <img
                  src={heroImage}
                  alt="Vista previa de la portada"
                  className="mt-3 h-32 w-full border-2 border-black object-cover"
                />
              )}
            </label>
            <label className="block md:col-span-2">
              <span className="label-mono-sm mb-2 block text-black">RESUMEN</span>
              <textarea
                required
                maxLength={500}
                rows={3}
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                placeholder="Breve descripción que aparecerá en la portada de la revista."
                className="w-full resize-y border-2 border-black px-3 py-3 font-sans text-sm text-black outline-none focus:border-[#2563eb]"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="label-mono-sm mb-2 block text-black">CONTENIDO</span>
              <div className="border-2 border-black">
                <RichTextEditor
                  token={token}
                  value={bodyHtml}
                  onChange={setBodyHtml}
                  placeholder="Escribe el artículo. Usa la barra de herramientas para añadir títulos, enlaces e imágenes."
                />
              </div>
              <span className="mt-2 block font-mono text-[10px] text-gray-500">
                El nombre del autor, la fecha y la publicación se asignan en el servidor.
              </span>
            </label>
          </section>

          {error && (
            <p role="alert" className="border-2 border-red-700 bg-red-50 p-3 font-mono text-xs text-red-800">
              No se ha publicado la entrada: {error}
            </p>
          )}

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-6 py-3 disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {saving ? 'GUARDANDO...' : editingArticle ? 'GUARDAR CAMBIOS' : 'PUBLICAR EN LA SECCIÓN'}
            </button>
          </div>
        </form>

        <section className="mt-16 border-t-[4px] border-black pt-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <span className="label-mono-sm mb-2 block text-[#2563eb]">GESTIÓN DE CONTENIDO</span>
              <h2 className="font-serif text-2xl font-black text-black">Mis publicaciones</h2>
            </div>
            <span className="font-mono text-xs font-bold text-gray-500">{articles.length} ENTRADAS</span>
          </div>
          {articlesError && (
            <p role="alert" className="mb-4 border-2 border-red-700 bg-red-50 p-3 font-mono text-xs text-red-800">
              No se pudo cargar la lista de publicaciones: {articlesError}
            </p>
          )}
          <div className="divide-y-2 divide-black border-y-[3px] border-black">
            {articles.map((article) => (
              <article key={article.id} className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase text-[#2563eb]">
                    {CONTENT_SECTIONS.find(item => item.value === (article.section || 'magazine'))?.label || article.section}
                    {' // '}{article.category}
                  </p>
                  <h3 className="mt-1 font-serif text-lg font-black text-black">{article.title}</h3>
                  <p className="mt-1 line-clamp-2 font-sans text-xs text-gray-600">{article.excerpt}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(article)}
                    className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 font-mono text-[10px] font-black hover:bg-[#facc15]"
                  >
                    <Pencil className="h-3.5 w-3.5" /> EDITAR
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === article.id}
                    onClick={async () => {
                      if (!window.confirm(`¿Eliminar "${article.title}"? Esta acción no se puede deshacer.`)) return;
                      setDeletingId(article.id);
                      setError('');
                      try {
                        await onDelete(article);
                      } catch (deleteError) {
                        setError(deleteError instanceof Error ? deleteError.message : 'No se pudo eliminar la publicación.');
                      } finally {
                        setDeletingId(null);
                      }
                    }}
                    className="flex items-center gap-2 border-2 border-black bg-white px-3 py-2 font-mono text-[10px] font-black text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === article.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    ELIMINAR
                  </button>
                </div>
              </article>
            ))}
            {articles.length === 0 && (
              <p className="py-6 font-mono text-xs font-bold uppercase text-gray-500">Aún no tienes publicaciones.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
