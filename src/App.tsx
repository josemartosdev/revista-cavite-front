import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { X, Calendar, Clock, User, Sparkles, Loader2, Award, HardHat, FileText } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeFeed from './components/HomeFeed';
import JournalFeed from './components/JournalFeed';
import ProjectView from './components/ProjectView';
import LoginPanel from './components/LoginPanel';
import PostEditor from './components/PostEditor';
import VisualSiteEditor from './components/VisualSiteEditor';
import {
  AuthSession,
  AuthUser,
  ContentSection,
  DEFAULT_SITE_VISUAL_CONFIG,
  JournalEntry,
  MagazineArticle,
  SitePage,
  SiteVisualConfig,
} from './types';
import {
  createArticle as createArticleRequest,
  CreateArticlePayload,
  deleteArticle as deleteArticleRequest,
  getCurrentUser,
  getMyArticles,
  getPublishedArticles,
  getSiteVisualConfig,
  login as loginRequest,
  logout as logoutRequest,
  saveSiteVisualConfig,
  updateArticle as updateArticleRequest,
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'portfolio' | 'notebook' | 'editor'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<MagazineArticle | null>(null);
  const [editingPost, setEditingPost] = useState<MagazineArticle | undefined>();
  const [defaultPostSection, setDefaultPostSection] = useState<ContentSection>('magazine');
  const [publishedArticles, setPublishedArticles] = useState<MagazineArticle[]>([]);
  const [myArticles, setMyArticles] = useState<MagazineArticle[]>([]);
  const [articlesError, setArticlesError] = useState('');
  const [myArticlesError, setMyArticlesError] = useState('');
  const [siteConfig, setSiteConfig] = useState<SiteVisualConfig>(DEFAULT_SITE_VISUAL_CONFIG);
  const [savedSiteConfig, setSavedSiteConfig] = useState<SiteVisualConfig>(DEFAULT_SITE_VISUAL_CONFIG);
  const [visualEditorOpen, setVisualEditorOpen] = useState(false);
  const [visualEditMode, setVisualEditMode] = useState(false);
  const [siteConfigLoadingError, setSiteConfigLoadingError] = useState('');
  const [siteConfigSavingError, setSiteConfigSavingError] = useState('');
  const [siteConfigSaving, setSiteConfigSaving] = useState(false);
  const [token, setToken] = useState(() => sessionStorage.getItem('revista_access_token') || '');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(() => Boolean(sessionStorage.getItem('revista_access_token')));
  const [authError, setAuthError] = useState('');

  // AI Summary states for open article
  const [articleSummary, setArticleSummary] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  useEffect(() => {
    getPublishedArticles()
      .then(setPublishedArticles)
      .catch((error: unknown) => {
        setArticlesError(error instanceof Error ? error.message : 'Error de conexión.');
      });
  }, []);

  useEffect(() => {
    getSiteVisualConfig()
      .then((config) => {
        setSiteConfig(config);
        setSavedSiteConfig(config);
      })
      .catch((error: unknown) => {
        setSiteConfigLoadingError(error instanceof Error ? error.message : 'Error de conexión.');
      });
  }, []);

  useEffect(() => {
    if (!token) {
      setMyArticles([]);
      setAuthLoading(false);
      return;
    }

    getCurrentUser(token)
      .then(setUser)
      .catch((error: unknown) => {
        sessionStorage.removeItem('revista_access_token');
        setToken('');
        setUser(null);
        setAuthError(error instanceof Error ? error.message : 'La sesión ya no es válida.');
      })
      .finally(() => setAuthLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token || !user) return;
    getMyArticles(token)
      .then(setMyArticles)
      .catch((error: unknown) => {
        setMyArticlesError(error instanceof Error ? error.message : 'No se pudieron cargar tus publicaciones.');
      });
  }, [token, user]);

  const handleLogin = async (email: string, password: string): Promise<AuthSession> => {
    const session = await loginRequest(email, password);
    return session;
  };

  const handleAuthenticated = (session: AuthSession) => {
    sessionStorage.setItem('revista_access_token', session.token);
    setToken(session.token);
    setUser(session.user);
    setAuthError('');
    setActiveTab('editor');
  };

  const handleLogout = async () => {
    const currentToken = token;
    sessionStorage.removeItem('revista_access_token');
    setToken('');
    setUser(null);
    setMyArticles([]);
    setVisualEditMode(false);
    setVisualEditorOpen(false);
    setActiveTab('home');
    if (currentToken) {
      try {
        await logoutRequest(currentToken);
      } catch (error) {
        setAuthError(error instanceof Error ? error.message : 'No se pudo invalidar la sesión en el servidor.');
      }
    }
  };

  const handlePublish = async (payload: CreateArticlePayload): Promise<MagazineArticle> => {
    if (!token) {
      throw new Error('Inicia sesión de nuevo para publicar.');
    }
    return editingPost
      ? updateArticleRequest(token, editingPost.id, payload)
      : createArticleRequest(token, payload);
  };

  const handlePublished = (article: MagazineArticle) => {
    setPublishedArticles((currentArticles) => [article, ...currentArticles.filter(item => item.id !== article.id)]);
    setMyArticles((currentArticles) => [article, ...currentArticles.filter(item => item.id !== article.id)]);
    setEditingPost(undefined);
    setDefaultPostSection(article.section || 'magazine');
    setActiveTab(article.section === 'notebook' ? 'notebook' : article.section === 'project' ? 'portfolio' : 'home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePost = async (article: MagazineArticle) => {
    if (!token) throw new Error('Inicia sesión de nuevo para eliminar publicaciones.');
    await deleteArticleRequest(token, article.id);
    setPublishedArticles(currentArticles => currentArticles.filter(item => item.id !== article.id));
    setMyArticles(currentArticles => currentArticles.filter(item => item.id !== article.id));
    if (editingPost?.id === article.id) setEditingPost(undefined);
  };

  const handleAddPost = (section: ContentSection) => {
    setDefaultPostSection(section);
    setEditingPost(undefined);
    setActiveTab('editor');
  };

  const handleVisualEditToggle = () => {
    if (user?.role !== 'admin') return;
    if (activeTab === 'editor') setActiveTab('home');
    setVisualEditorOpen(true);
    setVisualEditMode(current => !current);
    setSiteConfigSavingError('');
  };

  const handleSaveSiteConfig = async () => {
    if (!token) {
      setSiteConfigSavingError('Inicia sesión para guardar los cambios del diseño.');
      return;
    }
    setSiteConfigSaving(true);
    setSiteConfigSavingError('');
    try {
      const config = await saveSiteVisualConfig(token, siteConfig);
      setSiteConfig(config);
      setSavedSiteConfig(config);
    } catch (error) {
      setSiteConfigSavingError(error instanceof Error ? error.message : 'Error al guardar el diseño.');
    } finally {
      setSiteConfigSaving(false);
    }
  };

  const handleCancelVisualChanges = () => {
    setSiteConfig(savedSiteConfig);
    setVisualEditMode(false);
    setVisualEditorOpen(false);
    setSiteConfigSavingError('');
  };

  const visualEditorPage: SitePage = activeTab === 'notebook'
    ? 'notebook'
    : activeTab === 'portfolio'
      ? 'project'
      : 'home';

  const handleArticleClick = (article: MagazineArticle) => {
    setSelectedArticle(article);
    setArticleSummary('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateAISummary = async () => {
    if (!selectedArticle) return;
    setAiLoading(true);
    setArticleSummary('');

    const fullContent = selectedArticle.blocks?.length
      ? selectedArticle.blocks
          .filter(block => block.type === 'text' || block.type === 'heading1' || block.type === 'heading2')
          .map(block => block.content)
          .join('\n\n')
      : selectedArticle.excerpt;

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'SUMMARY',
          title: selectedArticle.title,
          content: fullContent
        })
      });

      if (!response.ok) {
        throw new Error('No se pudo establecer comunicación con el servidor de IA.');
      }

      const data = await response.json();
      setArticleSummary(data.result);
    } catch (e: any) {
      console.error(e);
      setArticleSummary('Error: No se pudo conectar con la API de Gemini. Compruebe la clave GEMINI_API_KEY en la configuración.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedArticle(null);
        }} 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isAuthenticated={Boolean(user)}
        canEditSite={user?.role === 'admin'}
        userName={user?.name}
        onLogout={handleLogout}
        visualEditMode={visualEditMode}
        onToggleVisualEdit={handleVisualEditToggle}
      />

      {/* Main Page Area */}
      <div className="flex-grow">
        {activeTab === 'home' && (
          <HomeFeed 
            onArticleClick={handleArticleClick}
            siteConfig={siteConfig}
            articles={[
              ...publishedArticles.filter(article => !article.section || article.section === 'magazine'),
            ]}
            articlesError={articlesError}
            onProjectClick={(projId) => {
              setActiveTab('portfolio');
              setSelectedArticle(null);
            }}
            onNavClick={(tab) => {
              setActiveTab(tab);
              setSelectedArticle(null);
            }}
          />
        )}

        {activeTab === 'portfolio' && (
          <ProjectView
            projectId="proyecto-modulo-practicas"
            updates={publishedArticles.filter(article => article.section === 'project')}
            onAddUpdate={() => handleAddPost('project')}
            onReadUpdate={handleArticleClick}
            siteConfig={siteConfig}
          />
        )}

        {activeTab === 'notebook' && (
          <JournalFeed 
            siteConfig={siteConfig}
            entries={[
              ...publishedArticles
                .filter(article => article.section === 'notebook')
                .map((article): JournalEntry => ({
                  id: article.id,
                  date: article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString('es-ES')
                    : '',
                  logNum: article.id,
                  tag: article.category,
                  title: article.title,
                  blocks: article.blocks || [{ id: `${article.id}-body`, type: 'text', content: article.excerpt }],
                })),
            ]}
            onAddClick={() => {
              handleAddPost('notebook');
            }}
          />
        )}

        {activeTab === 'editor' && (
          authLoading ? (
            <main className="flex min-h-[70vh] items-center justify-center pt-20 font-mono text-xs font-bold text-gray-600">
              COMPROBANDO SESIÓN...
            </main>
          ) : user ? (
            <PostEditor
              key={editingPost?.id || `new-${defaultPostSection}`}
              token={token}
              authorName={user.name}
              articles={myArticles}
              articlesError={myArticlesError}
              defaultSection={defaultPostSection}
              editingArticle={editingPost}
              onPublish={handlePublish}
              onPublished={handlePublished}
              onEdit={(article) => setEditingPost(article)}
              onDelete={handleDeletePost}
            />
          ) : (
            <LoginPanel onLogin={handleLogin} onAuthenticated={handleAuthenticated} />
          )
        )}
      </div>

      {/* Full Article Reader Modal overlay styled in high contrast Mondrian Frame */}
      {selectedArticle && (
        <div className="modal-overlay" id="article-reader-modal">
          <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
            
            {/* Mondrian Modal Header block */}
              <div className="modal-header sticky top-0 bg-[#ef4444] z-10 text-white">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-white" />
                <span className="font-mono text-xs font-black uppercase tracking-widest">
                  PUBLICACIÓN // {selectedArticle.tag}
                </span>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="bg-black hover:bg-white hover:text-black border-2 border-black text-white px-2 py-1 font-mono text-xs font-bold transition-colors cursor-pointer"
                title="Cerrar Lector"
                aria-label="Cerrar Lector"
              >
                [ CERRAR ]
              </button>
            </div>

            {/* Reading Content */}
            <div className="p-6 md:p-12 space-y-8">
              
              {/* Metadata */}
              <div className="space-y-3">
                <span className="font-mono text-xs font-black tracking-widest text-[#2563eb] uppercase bg-blue-50 border border-blue-150 px-2.5 py-1">
                  {selectedArticle.category}
                </span>
                <h2 className="font-serif font-black text-2xl md:text-4xl text-black leading-tight">
                  {selectedArticle.title}
                </h2>
                
                <div className="flex flex-wrap gap-4 items-center border-t-2 border-b-2 border-black py-3 text-black font-mono text-[10px] uppercase font-bold">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#ef4444]" />
                    POR: {selectedArticle.author}
                  </span>
                  <span className="w-1 h-1 bg-black"></span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#facc15]" />
                    {selectedArticle.publishedAt
                      ? new Date(selectedArticle.publishedAt).toLocaleDateString('es-ES')
                      : 'REVISTA DIGITAL'}
                  </span>
                  <span className="w-1 h-1 bg-black"></span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#2563eb]" />
                    {selectedArticle.readTime}
                  </span>
                </div>
              </div>

              {/* Huge Image Frame with Mondrian Border */}
              <div className="bg-gray-100 border-[3px] border-black p-1">
                {selectedArticle.heroImage && (
                  <img
                    className="w-full h-auto object-cover border border-black"
                    src={selectedArticle.heroImage}
                    alt={selectedArticle.title}
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              {/* Text Body */}
              <div className="article-rich-content space-y-5 font-sans text-xs md:text-sm text-gray-700 leading-relaxed font-semibold">
                {selectedArticle.blocks?.some(block => block.type === 'html') ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        selectedArticle.blocks.find(block => block.type === 'html')?.content || ''
                      ),
                    }}
                  />
                ) : selectedArticle.blocks?.length ? (
                  selectedArticle.blocks
                    .filter(block => block.type === 'text' || block.type === 'heading1' || block.type === 'heading2')
                    .map((block) => (
                      <p key={block.id} className={block.type === 'heading1' || block.type === 'heading2' ? 'font-serif text-base font-black text-black' : ''}>
                        {block.content}
                      </p>
                    ))
                ) : (
                  <p>{selectedArticle.excerpt}</p>
                )}
              </div>

              {/* Interactive AI Companion Tool styled as a Mondrian bottom card */}
              <div className="bg-gray-50 border-[3px] border-black p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-black fill-black" />
                    <span className="font-mono text-xs font-black text-black tracking-widest uppercase">
                      LECTURA ASISTIDA POR GEMINI AI
                    </span>
                  </div>
                  <button 
                    onClick={handleGenerateAISummary}
                    disabled={aiLoading}
                className="btn-primary px-4 py-2 disabled:opacity-40 w-full sm:w-auto"
                  >
                    {aiLoading ? 'ANALIZANDO...' : 'SINTETIZAR LECCIÓN'}
                  </button>
                </div>

                {aiLoading && (
                  <div className="flex items-center gap-3 py-2 text-gray-500 italic font-sans text-xs font-bold">
                    <Loader2 className="w-4 h-4 animate-spin text-[#ef4444]" />
                    Construyendo síntesis conceptual con IA...
                  </div>
                )}

                {articleSummary && (
                  <div className="p-4 bg-white border-2 border-black font-sans text-xs text-gray-700 leading-relaxed whitespace-pre-line border-l-[6px] border-l-[#ef4444] font-semibold">
                    <p className="font-mono text-[9px] font-black text-[#ef4444] mb-1.5 uppercase">SÍNTESIS INTELIGENTE DEL PROFESORADO:</p>
                    {articleSummary}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Footer Area */}
      <Footer 
        onNavClick={(tab) => {
          setActiveTab(tab);
          setSelectedArticle(null);
        }}
      />
      <VisualSiteEditor
        token={token}
        config={siteConfig}
        page={visualEditorPage}
        editing={Boolean(user?.role === 'admin' && visualEditMode)}
        panelOpen={Boolean(user?.role === 'admin' && visualEditorOpen)}
        saving={siteConfigSaving}
        loadError={siteConfigLoadingError}
        saveError={siteConfigSavingError}
        onConfigChange={setSiteConfig}
        onSave={handleSaveSiteConfig}
        onCancel={handleCancelVisualChanges}
        onClose={() => {
          setVisualEditorOpen(false);
          setVisualEditMode(false);
        }}
      />
      {authError && !user && (
        <div role="status" className="fixed bottom-4 left-4 z-[60] max-w-sm border-2 border-black bg-yellow-100 p-3 font-mono text-[10px] font-bold text-black shadow-lg">
          {authError}
          <button onClick={() => setAuthError('')} className="ml-3 underline">Cerrar</button>
        </div>
      )}
    </div>
  );
}
