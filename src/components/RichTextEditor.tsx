import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Loader2,
} from 'lucide-react';
import { uploadMedia } from '../services/api';

const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Mono', value: '"JetBrains Mono", monospace' },
];

interface RichTextEditorProps {
  token: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ token, value, onChange, placeholder }: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2] } }),
      Underline,
      TextStyle,
      FontFamily,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: placeholder || 'Escribe el contenido de la publicación...' }),
    ],
    content: value || '',
    onUpdate: ({ editor: updatedEditor }) => {
      onChange(updatedEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
    // Only resync when the external value changes to avoid clobbering the user's cursor on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const handlePickImage = () => {
    setUploadError('');
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploading(true);
    setUploadError('');
    try {
      const media = await uploadMedia(token, file);
      editor.chain().focus().setImage({ src: media.url }).run();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'No se pudo subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  const handleSetLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL del enlace (vacío para quitar):', previousUrl || 'https://');
    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  return (
    <div>
      <div className="rich-editor-toolbar">
        <button
          type="button"
          className={`rich-editor-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Negrita"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`rich-editor-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Cursiva"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`rich-editor-btn ${editor.isActive('underline') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Subrayado"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="rich-editor-divider" />

        <button
          type="button"
          className={`rich-editor-btn ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Título 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`rich-editor-btn ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Título 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <div className="rich-editor-divider" />

        <button
          type="button"
          className={`rich-editor-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Lista"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          className={`rich-editor-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Lista numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="rich-editor-divider" />

        <button
          type="button"
          className={`rich-editor-btn ${editor.isActive('link') ? 'is-active' : ''}`}
          onClick={handleSetLink}
          title="Enlace"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="rich-editor-btn"
          onClick={handlePickImage}
          disabled={uploading}
          title="Insertar imagen"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        <select
          className="rich-editor-select"
          value={(editor.getAttributes('textStyle').fontFamily as string) || ''}
          onChange={(e) => {
            const fontFamily = e.target.value;
            if (!fontFamily) {
              editor.chain().focus().unsetFontFamily().run();
            } else {
              editor.chain().focus().setFontFamily(fontFamily).run();
            }
          }}
          title="Tipo de letra"
        >
          <option value="">Tipo de letra</option>
          {FONT_OPTIONS.map((font) => (
            <option key={font.value} value={font.value}>{font.label}</option>
          ))}
        </select>

        <div className="rich-editor-divider" />

        <button
          type="button"
          className="rich-editor-btn"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Deshacer"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="rich-editor-btn"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Rehacer"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      <div className="rich-editor-content">
        <EditorContent editor={editor} />
      </div>

      {uploadError && (
        <p className="mt-2 font-mono text-[10px] font-bold text-[#ef4444]">{uploadError}</p>
      )}
    </div>
  );
}
