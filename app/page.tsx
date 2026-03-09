'use client';

import { useState, useEffect, useRef } from 'react';
import AIToolSelector from '@/components/AIToolSelector';
import PromptTemplates from '@/components/PromptTemplates';
import PromptHistory from '@/components/PromptHistory';
import { Copy, Check } from 'lucide-react';

const HISTORY_KEY = 'promptlab_history';
const MAX_HISTORY = 20;

type HistoryEntry = {
  id: number;
  input: string;
  output: string;
  createdAt: string;
};

type Tab = 'generate' | 'templates' | 'history';

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      // localStorage may be unavailable
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
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  };

  const handleGenerate = async () => {
    if (!userInput.trim() || loading) return;
    setLoading(true);
    setResult('');
    setActiveTab('generate');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });

      if (!res.ok || !res.body) {
        setResult('Hata oluştu. Lütfen tekrar deneyin.');
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setResult(fullText);
      }

      if (fullText) saveToHistory(userInput, fullText);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Bilinmeyen hata';
      setResult('Hata oluştu: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleTemplateSelect = (value: string) => {
    setUserInput(value);
    setActiveTab('generate');
  };

  const handleHistorySelect = (input: string, output: string) => {
    setUserInput(input);
    setResult(output);
    setActiveTab('generate');
  };

  const handleHistoryClear = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      // ignore
    }
  };

  const charCount = userInput.length;
  const tabs: { id: Tab; label: string }[] = [
    { id: 'generate', label: '✏️ Oluştur' },
    { id: 'templates', label: '⚡ Şablonlar' },
    { id: 'history', label: `🕒 Geçmiş${history.length ? ` (${history.length})` : ''}` },
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
          paddingBottom: '0',
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
          {/* Input area */}
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
            <span style={{ color: '#444', fontSize: '0.8rem' }}>
              veya Ctrl+Enter
            </span>
          </div>

          {/* Result area */}
          {result && (
            <div ref={resultRef}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <h2 style={{ margin: 0, fontSize: '1rem', color: '#aaa', fontWeight: '500' }}>
                  Oluşturulan Prompt
                </h2>
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
                {loading && <span style={{ opacity: 0.5 }}>▌</span>}
              </pre>

              {!loading && (
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
    </main>
  );
}