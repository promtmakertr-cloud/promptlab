'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import AIToolSelector from '@/components/AIToolSelector';
import PromptTemplates from '@/components/PromptTemplates';
import PromptHistory from '@/components/PromptHistory';
import FavoritesList from '@/components/FavoritesList';
import { Copy, Check, Star, Share2, RefreshCw } from 'lucide-react';

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

type Tab = 'generate' | 'templates' | 'history' | 'favorites';
type Language = 'tr' | 'en';
type Tone = 'professional' | 'creative' | 'technical' | 'concise';

const TONE_LABELS: Record<Tone, string> = {
  professional: 'Profesyonel',
  creative: 'Yaratıcı',
  technical: 'Teknik',
  concise: 'Kısa & Öz',
};

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

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [starred, setStarred] = useState(false);
  const [language, setLanguage] = useState<Language>('tr');
  const [tone, setTone] = useState<Tone>('professional');
  const [refineInput, setRefineInput] = useState('');
  const [refining, setRefining] = useState(false);
  const [showRefine, setShowRefine] = useState(false);
  const [currentFavoriteId, setCurrentFavoriteId] = useState<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Load persisted data from localStorage
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

  // Decode shared prompt from URL hash on initial load
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
    // Flush any remaining buffered bytes (important for multi-byte UTF-8 characters)
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
    setActiveTab('generate');

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
    }).catch(() => {
      // Clipboard access may be denied; fail silently
    });
  };

  const handleShare = () => {
    if (!result) return;
    const encoded = encodeForShare(result);
    const url = `${window.location.origin}${window.location.pathname}#share=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    }).catch(() => {
      // Clipboard access may be denied; fail silently
    });
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

  const handleDeleteFavorite = (id: number) => {
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  };

  const handleTemplateSelect = (value: string) => {
    setUserInput(value);
    setActiveTab('generate');
  };

  const handleHistorySelect = (input: string, output: string) => {
    setUserInput(input);
    setResult(output);
    setStarred(false);
    setCurrentFavoriteId(null);
    setActiveTab('generate');
  };

  const handleHistoryClear = () => {
    setHistory([]);
    try { localStorage.removeItem(HISTORY_KEY); } catch { /* ignore */ }
  };

  const charCount = userInput.length;
  const tabs: { id: Tab; label: string }[] = [
    { id: 'generate', label: '✏️ Oluştur' },
    { id: 'templates', label: '⚡ Şablonlar' },
    { id: 'history', label: `🕒 Geçmiş${history.length ? ` (${history.length})` : ''}` },
    { id: 'favorites', label: `⭐ Favoriler${favorites.length ? ` (${favorites.length})` : ''}` },
  ];

  return (
    <main
      style={{
        padding: '2rem',
        background: '#050505',
        color: '#fff',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '860px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>🎯 PromptLab</h1>
        <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.4rem' }}>
          Fikrinizi profesyonel yapay zeka promptlarına dönüştürün
        </p>
      </div>

      {/* Tab Bar */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #1a1a1a',
          flexWrap: 'wrap',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #0070f3' : '2px solid transparent',
              color: activeTab === tab.id ? '#fff' : '#666',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: activeTab === tab.id ? '600' : '400',
              transition: 'color 0.2s',
              marginBottom: '-1px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <div>
          {/* Textarea */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleGenerate();
              }}
              placeholder="Ne yapmak istediğinizi yazın... (örn: 'Sinematik bir portre fotoğrafı' veya 'B2B satış e-postası')"
              rows={4}
              style={{
                width: '100%',
                background: '#0d0d0d',
                border: '1px solid #222',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.95rem',
                padding: '1rem',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: '1.6',
                boxSizing: 'border-box',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '0.6rem',
                right: '0.75rem',
                color: charCount > 800 ? '#ef4444' : '#444',
                fontSize: '0.75rem',
              }}
            >
              {charCount} karakter
            </div>
          </div>

          {/* Options Row: Language + Tone */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center',
              marginBottom: '1rem',
              padding: '0.75rem',
              background: '#0a0a0a',
              borderRadius: '8px',
              border: '1px solid #1a1a1a',
            }}
          >
            {/* Language Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: '#555', fontSize: '0.8rem' }}>Dil:</span>
              {(['tr', 'en'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  style={{
                    padding: '0.25rem 0.6rem',
                    background: language === lang ? '#0070f3' : 'none',
                    border: `1px solid ${language === lang ? '#0070f3' : '#333'}`,
                    borderRadius: '5px',
                    color: language === lang ? '#fff' : '#888',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {lang === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}
                </button>
              ))}
            </div>

            <div style={{ width: '1px', height: '20px', background: '#222' }} />

            {/* Tone Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ color: '#555', fontSize: '0.8rem' }}>Ton:</span>
              {(Object.keys(TONE_LABELS) as Tone[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  style={{
                    padding: '0.25rem 0.6rem',
                    background: tone === t ? '#1a1a1a' : 'none',
                    border: `1px solid ${tone === t ? '#0070f3' : '#2a2a2a'}`,
                    borderRadius: '5px',
                    color: tone === t ? '#fff' : '#888',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {TONE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '2rem' }}>
            <button
              onClick={handleGenerate}
              disabled={loading || !userInput.trim()}
              style={{
                padding: '0.65rem 1.5rem',
                background: loading || !userInput.trim() ? '#1a3a5c' : '#0070f3',
                color: loading || !userInput.trim() ? '#5a8ab8' : '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: loading || !userInput.trim() ? 'not-allowed' : 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'background 0.2s',
              }}
            >
              {loading ? '⏳ Oluşturuluyor...' : '✨ Prompt Oluştur'}
            </button>
            <span style={{ color: '#444', fontSize: '0.8rem' }}>veya Ctrl+Enter</span>
          </div>

          {/* Result Area */}
          {result && (
            <div ref={resultRef}>
              {/* Result Header */}
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
                <h2 style={{ margin: 0, fontSize: '1rem', color: '#aaa', fontWeight: '500' }}>
                  Oluşturulan Prompt
                </h2>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {/* Favorite button */}
                  <button
                    onClick={handleToggleFavorite}
                    title={starred ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                    style={{
                      background: starred ? '#78350f22' : '#1a1a1a',
                      border: `1px solid ${starred ? '#d97706' : '#333'}`,
                      borderRadius: '6px',
                      padding: '0.35rem 0.6rem',
                      color: starred ? '#f59e0b' : '#888',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Star size={14} fill={starred ? '#f59e0b' : 'none'} />
                    {starred ? 'Favorilerde' : 'Favorile'}
                  </button>

                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    title="Paylaşım bağlantısını kopyala"
                    style={{
                      background: shared ? '#1e3a5f22' : '#1a1a1a',
                      border: `1px solid ${shared ? '#3b82f6' : '#333'}`,
                      borderRadius: '6px',
                      padding: '0.35rem 0.6rem',
                      color: shared ? '#60a5fa' : '#888',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <Share2 size={14} />
                    {shared ? 'Link Kopyalandı!' : 'Paylaş'}
                  </button>

                  {/* Copy button */}
                  <button
                    onClick={handleCopyResult}
                    style={{
                      background: copied ? '#16a34a22' : '#1a1a1a',
                      border: `1px solid ${copied ? '#16a34a' : '#333'}`,
                      borderRadius: '6px',
                      padding: '0.35rem 0.75rem',
                      color: copied ? '#4ade80' : '#aaa',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.2s',
                    }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Kopyalandı!' : 'Kopyala'}
                  </button>
                </div>
              </div>

              {/* Result Text */}
              <pre
                style={{
                  background: '#0d0d0d',
                  border: '1px solid #1a1a1a',
                  borderRadius: '10px',
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

              {/* Iterative Refinement Section */}
              {!loading && (
                <div style={{ marginTop: '1rem' }}>
                  <button
                    onClick={() => setShowRefine(!showRefine)}
                    style={{
                      background: 'none',
                      border: '1px solid #222',
                      borderRadius: '6px',
                      padding: '0.4rem 0.8rem',
                      color: showRefine ? '#fff' : '#666',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <RefreshCw size={13} />
                    Promptu Geliştir
                  </button>

                  {showRefine && (
                    <div
                      style={{
                        marginTop: '0.75rem',
                        padding: '1rem',
                        background: '#0a0a0a',
                        borderRadius: '8px',
                        border: '1px solid #1a1a1a',
                      }}
                    >
                      <p style={{ color: '#666', fontSize: '0.82rem', margin: '0 0 0.6rem' }}>
                        Mevcut promptu nasıl geliştirmek istersiniz?
                      </p>
                      <textarea
                        value={refineInput}
                        onChange={(e) => setRefineInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleRefine();
                        }}
                        placeholder="Örn: Daha kısa yap, teknik detayları artır, daha yaratıcı bir ton ekle..."
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
                          padding: '0.5rem 1.2rem',
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
                  <div style={{ color: '#555', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    Bu promptu açmak istediğiniz AI aracına gönderin:
                  </div>
                  <AIToolSelector generatedText={result} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <PromptTemplates onSelect={handleTemplateSelect} />
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <PromptHistory
          history={history}
          onSelect={handleHistorySelect}
          onClear={handleHistoryClear}
        />
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <FavoritesList
          favorites={favorites}
          onSelect={handleHistorySelect}
          onDelete={handleDeleteFavorite}
        />
      )}
    </main>
  );
}