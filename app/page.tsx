'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AIToolSelector from '@/components/AIToolSelector';
import { Copy, Check, Star, Share2, RefreshCw, Save, Mic, ArrowUp } from 'lucide-react';
import type { Language, Tone, SavedPrompt } from '@/lib/types';
import { MAX_TITLE_LENGTH } from '@/lib/types';

const HISTORY_KEY = 'promptlab_history';
const FAVORITES_KEY = 'promptlab_favorites';
const MAX_HISTORY = 20;
const MAX_FAVORITES = 50;

type HistoryEntry = {
  id: number;
  input: string;
  output: string;
  createdAt: string;
};

const TONE_LABELS: Record<Tone, string> = {
  professional: 'Profesyonel',
  creative: 'Yaratıcı',
  technical: 'Teknik',
  concise: 'Kısa & Öz',
};

const floatingExamples = [
  {
    title: 'Pazarlama',
    text: 'Instagram için dikkat çekici ve etkileşim odaklı ürün lansman postu.',
    pos: { top: '18%', left: '3%' },
  },
  {
    title: 'Veri Analizi',
    text: 'E-ticaret satış verilerini inceleyerek müşteri sadakatini artıracak stratejiler öner.',
    pos: { top: '18%', right: '5%' },
  },
  {
    title: 'İçerik Üretimi',
    text: 'Teknoloji blogu için SEO uyumlu ve okuyucuyu içine çeken makale taslağı.',
    pos: { top: '44%', left: '3%' },
  },
  {
    title: 'Sunum',
    text: 'Yapay zekanın iş dünyasındaki geleceği hakkında yöneticilere yapılacak 10 slaytlık sunum taslağı.',
    pos: { top: '49%', right: '5%' },
  },
];

function encodeForShare(text: string): string {
  const bytes = new TextEncoder().encode(text);
  return btoa(Array.from(bytes).map((b) => String.fromCharCode(b)).join(''));
}

function decodeFromShare(encoded: string): string {
  try {
    const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return '';
  }
}

function PromptLabLogo({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  const isLg = size === 'lg';
  return (
    <div
      style={{
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: isLg ? '2.6rem' : '1.05rem',
        letterSpacing: '-0.02em',
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: '1px',
      }}
    >
      <span style={{ fontStyle: 'italic', fontWeight: '400', color: '#fff' }}>prompt</span>
      <span style={{ fontStyle: 'normal', fontWeight: '700', color: '#fff' }}>lab</span>
      <span
        style={{
          color: '#fff',
          fontSize: isLg ? '1.6rem' : '0.75rem',
          marginLeft: isLg ? '4px' : '2px',
          fontFamily: 'Arial, sans-serif',
          fontStyle: 'normal',
          fontWeight: '400',
        }}
      >
        ·✦
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<HistoryEntry[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [starred, setStarred] = useState(false);
  const [language, setLanguage] = useState<Language>('tr');
  const [tone, setTone] = useState<Tone>('professional');
  const [refineInput, setRefineInput] = useState('');
  const [refining, setRefining] = useState(false);
  const [showRefine, setShowRefine] = useState(false);
  const [currentFavoriteId, setCurrentFavoriteId] = useState<number | null>(null);
  const [saveTitle, setSaveTitle] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      const savedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    } catch {
      // localStorage may be unavailable
    }
  }, []);

  useEffect(() => {
    fetch('/api/prompts')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SavedPrompt[]) => setSavedPrompts(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const template = searchParams.get('template');
    const input = searchParams.get('input');
    const output = searchParams.get('output');
    if (template) {
      setUserInput(template);
    } else if (input) {
      setUserInput(input);
      if (output) setResult(output);
    } else {
      return;
    }
    window.history.replaceState(null, '', window.location.pathname);
  }, [searchParams]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      const decoded = decodeFromShare(hash.slice(7));
      if (decoded) {
        setResult(decoded);
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, []);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [result]);

  const saveToHistory = (input: string, output: string) => {
    const entry: HistoryEntry = {
      id: Date.now(),
      input,
      output,
      createdAt: new Date().toISOString(),
    };
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, MAX_HISTORY);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  };

  const streamGenerate = useCallback(async (
    input: string,
    options: { language: Language; tone: Tone; previousPrompt?: string }
  ): Promise<string> => {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userInput: input,
        language: options.language,
        tone: options.tone,
        ...(options.previousPrompt ? { previousPrompt: options.previousPrompt } : {}),
      }),
    });

    if (!res.ok || !res.body) throw new Error('API hatası');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullText += decoder.decode(value, { stream: true });
      setResult(fullText);
    }
    const remaining = decoder.decode();
    if (remaining) {
      fullText += remaining;
      setResult(fullText);
    }

    return fullText;
  }, []);

  const handleGenerate = async () => {
    if (!userInput.trim() || loading) return;
    setLoading(true);
    setResult('');
    setStarred(false);
    setCurrentFavoriteId(null);
    setShowRefine(false);
    setShowSaveInput(false);
    setSavedNotice(false);

    try {
      const fullText = await streamGenerate(userInput, { language, tone });
      if (fullText) saveToHistory(userInput, fullText);
    } catch (err: unknown) {
      setResult('Hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!refineInput.trim() || refining || !result) return;
    setRefining(true);

    try {
      const refined = await streamGenerate(refineInput, {
        language,
        tone,
        previousPrompt: result,
      });
      if (refined) {
        saveToHistory(`[Geliştirildi] ${refineInput}`, refined);
        setRefineInput('');
        setStarred(false);
        setCurrentFavoriteId(null);
      }
    } catch (err: unknown) {
      setResult('Hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'));
    } finally {
      setRefining(false);
    }
  };

  const handleCopyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const handleShare = () => {
    if (!result) return;
    const encoded = encodeForShare(result);
    const url = `${window.location.origin}${window.location.pathname}#share=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    }).catch(() => {});
  };

  const handleToggleFavorite = () => {
    if (!result || !userInput) return;
    if (starred && currentFavoriteId !== null) {
      setFavorites((prev) => {
        const updated = prev.filter((f) => f.id !== currentFavoriteId);
        try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
        return updated;
      });
      setStarred(false);
      setCurrentFavoriteId(null);
    } else {
      const entry: HistoryEntry = {
        id: Date.now(),
        input: userInput,
        output: result,
        createdAt: new Date().toISOString(),
      };
      setFavorites((prev) => {
        const updated = [entry, ...prev].slice(0, MAX_FAVORITES);
        try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
        return updated;
      });
      setStarred(true);
      setCurrentFavoriteId(entry.id);
    }
  };

  const handleOpenSaveForm = () => {
    setSaveTitle(userInput.slice(0, MAX_TITLE_LENGTH));
    setShowSaveInput(true);
  };

  const handleSavePrompt = async () => {
    if (!result || !saveTitle.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: saveTitle.trim(),
          input: userInput,
          output: result,
          language,
          tone,
        }),
      });
      if (res.ok) {
        const saved: SavedPrompt = await res.json();
        setSavedPrompts((prev) => [saved, ...prev]);
        setSaveTitle('');
        setShowSaveInput(false);
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 2500);
      }
    } catch { /* ignore */ } finally {
      setSaving(false);
    }
  };

  const showHero = !result && !loading;

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#050505',
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
        overflowX: 'hidden',
      }}
    >
      {/* Top-left logo */}
      <div style={{ position: 'fixed', top: '1.5rem', left: '2rem', zIndex: 20 }}>
        <PromptLabLogo size="sm" />
      </div>

      {/* Floating background examples (only in hero/idle state) */}
      {showHero && floatingExamples.map((ex) => (
        <div
          key={ex.title}
          onClick={() => setUserInput(ex.text)}
          style={{
            position: 'absolute',
            ...ex.pos,
            maxWidth: '280px',
            cursor: 'pointer',
            padding: '0.5rem',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '0.8'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
        >
          <h3
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontStyle: 'italic',
              fontWeight: '400',
              color: '#ffffff',
              fontSize: '1.05rem',
              margin: '0 0 0.5rem',
              letterSpacing: '-0.01em',
            }}
          >
            {ex.title}
          </h3>
          <p
            style={{
              color: '#555',
              fontSize: '0.82rem',
              lineHeight: '1.55',
              margin: 0,
            }}
          >
            {ex.text}
          </p>
        </div>
      ))}

      {/* Main content area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: showHero ? 'flex-end' : 'flex-start',
          minHeight: '100vh',
          padding: showHero ? '0 2rem 8vh' : '5rem 2rem 4rem',
        }}
      >
        {/* Hero content (logo + headline + subtitle) */}
        {showHero && (
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <PromptLabLogo size="lg" />
            </div>
            <h1
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                fontWeight: '800',
                margin: '0 0 1rem',
                letterSpacing: '-0.04em',
                lineHeight: 1.15,
                maxWidth: '680px',
              }}
            >
              Fikirlerini Güçlü Promptlara Dönüştür.
            </h1>
            <p
              style={{
                color: '#888',
                fontSize: '1rem',
                margin: 0,
                lineHeight: '1.6',
                maxWidth: '460px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Metni yaz. Optimize edilmiş promptu al. Kopyala ve diğer AI araçlarında kullan.
            </p>
          </div>
        )}

        {/* Result area (shown when result exists, above input) */}
        {result && (
          <div ref={resultRef} style={{ width: '100%', maxWidth: '700px', marginBottom: '1.5rem' }}>
            {/* Back / new prompt button */}
            <button
              onClick={() => { setResult(''); setUserInput(''); setStarred(false); setCurrentFavoriteId(null); setShowRefine(false); setShowSaveInput(false); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#555',
                fontSize: '0.82rem',
                cursor: 'pointer',
                padding: '0 0 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ← Yeni prompt
            </button>

            {/* Result header with action buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <h2 style={{ margin: 0, fontSize: '0.9rem', color: '#555', fontWeight: '500' }}>
                Oluşturulan Prompt
              </h2>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleToggleFavorite}
                  title={starred ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                  style={{
                    background: starred ? '#78350f22' : '#111',
                    border: `1px solid ${starred ? '#d97706' : '#222'}`,
                    borderRadius: '6px',
                    padding: '0.3rem 0.55rem',
                    color: starred ? '#f59e0b' : '#666',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem',
                    transition: 'all 0.2s',
                  }}
                >
                  <Star size={13} fill={starred ? '#f59e0b' : 'none'} />
                  {starred ? 'Favorilerde' : 'Favorile'}
                </button>

                <button
                  onClick={handleShare}
                  title="Paylaşım bağlantısını kopyala"
                  style={{
                    background: shared ? '#1e3a5f22' : '#111',
                    border: `1px solid ${shared ? '#3b82f6' : '#222'}`,
                    borderRadius: '6px',
                    padding: '0.3rem 0.55rem',
                    color: shared ? '#60a5fa' : '#666',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem',
                    transition: 'all 0.2s',
                  }}
                >
                  <Share2 size={13} />
                  {shared ? 'Link Kopyalandı!' : 'Paylaş'}
                </button>

                <button
                  onClick={handleCopyResult}
                  style={{
                    background: copied ? '#16a34a22' : '#111',
                    border: `1px solid ${copied ? '#16a34a' : '#222'}`,
                    borderRadius: '6px',
                    padding: '0.3rem 0.7rem',
                    color: copied ? '#4ade80' : '#888',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.2s',
                  }}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Kopyalandı!' : 'Kopyala'}
                </button>

                {!loading && !refining && (
                  <button
                    onClick={handleOpenSaveForm}
                    title="Promptu kaydet"
                    style={{
                      background: savedNotice ? '#14532d22' : '#111',
                      border: `1px solid ${savedNotice ? '#16a34a' : '#222'}`,
                      borderRadius: '6px',
                      padding: '0.3rem 0.55rem',
                      color: savedNotice ? '#4ade80' : '#666',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.78rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Save size={13} />
                    {savedNotice ? 'Kaydedildi!' : 'Kaydet'}
                  </button>
                )}
              </div>
            </div>

            {/* Inline save form */}
            {showSaveInput && !loading && !refining && (
              <div
                style={{
                  marginBottom: '0.75rem',
                  padding: '0.75rem',
                  background: '#0a0a0a',
                  borderRadius: '10px',
                  border: '1px solid #1e2a1e',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Save size={13} color="#22c55e" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSavePrompt();
                    if (e.key === 'Escape') setShowSaveInput(false);
                  }}
                  placeholder="Kayıt adı..."
                  maxLength={MAX_TITLE_LENGTH}
                  autoFocus
                  style={{
                    flex: 1,
                    minWidth: '140px',
                    background: '#0d0d0d',
                    border: '1px solid #2a3a2a',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    padding: '0.35rem 0.6rem',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleSavePrompt}
                  disabled={saving || !saveTitle.trim()}
                  style={{
                    padding: '0.35rem 0.9rem',
                    background: saving || !saveTitle.trim() ? '#1a3a5c' : '#16a34a',
                    color: saving || !saveTitle.trim() ? '#5a8ab8' : '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: saving || !saveTitle.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                  }}
                >
                  {saving ? '...' : 'Kaydet'}
                </button>
                <button
                  onClick={() => setShowSaveInput(false)}
                  style={{
                    padding: '0.35rem 0.6rem',
                    background: 'none',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                  }}
                >
                  İptal
                </button>
              </div>
            )}

            {/* Result text */}
            <pre
              style={{
                background: '#0d0d0d',
                border: '1px solid #1a1a1a',
                borderRadius: '14px',
                padding: '1.25rem',
                color: '#e0e0e0',
                fontSize: '0.88rem',
                lineHeight: '1.7',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                margin: 0,
                fontFamily: 'inherit',
              }}
            >
              {result}
              {(loading || refining) && <span style={{ opacity: 0.5 }}>▌</span>}
            </pre>

            {/* Refine section */}
            {!loading && (
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={() => setShowRefine(!showRefine)}
                  style={{
                    background: 'none',
                    border: '1px solid #1a1a1a',
                    borderRadius: '6px',
                    padding: '0.35rem 0.75rem',
                    color: showRefine ? '#fff' : '#555',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <RefreshCw size={12} />
                  Promptu Geliştir
                </button>

                {showRefine && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      padding: '1rem',
                      background: '#0a0a0a',
                      borderRadius: '10px',
                      border: '1px solid #1a1a1a',
                    }}
                  >
                    <p style={{ color: '#555', fontSize: '0.8rem', margin: '0 0 0.6rem' }}>
                      Mevcut promptu nasıl geliştirmek istersiniz?
                    </p>
                    <textarea
                      value={refineInput}
                      onChange={(e) => setRefineInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleRefine();
                      }}
                      placeholder="Örn: Daha kısa yap, teknik detayları artır..."
                      rows={2}
                      style={{
                        width: '100%',
                        background: '#0d0d0d',
                        border: '1px solid #222',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.88rem',
                        padding: '0.75rem',
                        resize: 'vertical',
                        outline: 'none',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        marginBottom: '0.6rem',
                      }}
                    />
                    <button
                      onClick={handleRefine}
                      disabled={refining || !refineInput.trim()}
                      style={{
                        padding: '0.45rem 1.2rem',
                        background: refining || !refineInput.trim() ? '#1a3a5c' : '#0070f3',
                        color: refining || !refineInput.trim() ? '#5a8ab8' : '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: refining || !refineInput.trim() ? 'not-allowed' : 'pointer',
                        fontSize: '0.88rem',
                        fontWeight: '600',
                      }}
                    >
                      {refining ? '⏳ Geliştiriliyor...' : '🔄 Geliştir'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* AI Tool Selector */}
            {!loading && !refining && (
              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ color: '#444', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
                  Bu promptu açmak istediğiniz AI aracına gönderin:
                </div>
                <AIToolSelector generatedText={result} />
              </div>
            )}
          </div>
        )}

        {/* Input box with glow */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '700px' }}>
          {/* Blue glow effect (hero state only) */}
          {showHero && (
            <div
              style={{
                position: 'absolute',
                bottom: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                height: '120px',
                background:
                  'radial-gradient(ellipse at center, rgba(56, 139, 253, 0.28) 0%, rgba(56, 139, 253, 0.06) 50%, transparent 75%)',
                filter: 'blur(18px)',
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Input container */}
          <div
            style={{
              position: 'relative',
              background: '#0f0f0f',
              border: '1px solid #252525',
              borderRadius: '22px',
              padding: '0.85rem 4.5rem 0.85rem 1.4rem',
              zIndex: 1,
              boxShadow: showHero ? '0 0 0 1px #1a1a1a' : 'none',
            }}
          >
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              placeholder={`Ne oluşturmak istiyorsun?\nÖrn: "Siberpunk t"`}
              rows={2}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '0.93rem',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
                lineHeight: '1.55',
                boxSizing: 'border-box',
              }}
            />

            {/* Mic + Send buttons */}
            <div
              style={{
                position: 'absolute',
                right: '0.65rem',
                bottom: '0.65rem',
                display: 'flex',
                gap: '0.4rem',
                alignItems: 'center',
              }}
            >
              <button
                title="Sesli giriş (yakında)"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'default',
                  color: '#3a3a3a',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Mic size={19} />
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading || !userInput.trim()}
                title="Prompt Oluştur"
                style={{
                  background: loading || !userInput.trim() ? '#1c1c1c' : '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  cursor: loading || !userInput.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: loading || !userInput.trim() ? '#444' : '#000',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                {loading ? (
                  <span style={{ fontSize: '12px', animation: 'spin 1s linear infinite' }}>⏳</span>
                ) : (
                  <ArrowUp size={17} />
                )}
              </button>
            </div>
          </div>

          {/* Language + Tone options (compact row below input) */}
          <div
            style={{
              display: 'flex',
              gap: '0.4rem',
              alignItems: 'center',
              marginTop: '0.6rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              paddingLeft: '0.25rem',
            }}
          >
            {(['tr', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                style={{
                  padding: '0.18rem 0.5rem',
                  background: language === lang ? '#1a1a1a' : 'none',
                  border: `1px solid ${language === lang ? '#333' : '#1e1e1e'}`,
                  borderRadius: '5px',
                  color: language === lang ? '#ccc' : '#444',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {lang === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}
              </button>
            ))}

            <div style={{ width: '1px', height: '14px', background: '#1e1e1e' }} />

            {(Object.keys(TONE_LABELS) as Tone[]).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                style={{
                  padding: '0.18rem 0.5rem',
                  background: tone === t ? '#1a1a1a' : 'none',
                  border: `1px solid ${tone === t ? '#0070f3' : '#1e1e1e'}`,
                  borderRadius: '5px',
                  color: tone === t ? '#fff' : '#444',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {TONE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
