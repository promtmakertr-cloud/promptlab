'use client';

import { useState, useRef, useCallback } from 'react';
import AIToolSelector from '../components/AIToolSelector';

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Kopyala');
  const abortRef = useRef(null);

  const handleGenerate = useCallback(async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    setResult('');

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setResult((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
      setResult(`Bir hata oluştu: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [userInput]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopyStatus('Kopyalandı ✓');
      setTimeout(() => setCopyStatus('Kopyala'), 2000);
    } catch {
      setCopyStatus('Hata');
    }
  }, [result]);

  return (
    <main
      style={{ backgroundColor: '#050505' }}
      className="min-h-screen text-white flex flex-col items-center px-4 py-16"
    >
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Prompt<span className="text-white/40">Lab</span>
        </h1>
        <p className="text-white/40 text-sm">
          Yapay zeka için optimize prompt üreticisi
        </p>
      </div>

      {/* Input */}
      <div className="w-full max-w-2xl">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ne üretmek istiyorsunuz? (örn: bir kahve markası için logo)"
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:border-white/25 transition-all duration-300"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !userInput.trim()}
          className="mt-3 w-full py-3 rounded-xl bg-white/10 border border-white/10 text-white text-sm font-medium transition-all duration-300 hover:bg-white/15 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.06)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Üretiliyor…' : 'Prompt Üret'}
        </button>
      </div>

      {/* Result */}
      {(result || loading) && (
        <div className="w-full max-w-2xl mt-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
            <pre className="text-white/80 text-sm whitespace-pre-wrap font-sans leading-relaxed min-h-[3rem]">
              {result}
              {loading && <span className="animate-pulse opacity-60">▌</span>}
            </pre>
          </div>

          {/* Copy & AI Selector – only show when generation is complete */}
          {!loading && result && (
            <div className="mt-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-white/30 uppercase tracking-widest">
                  ✨ Aracı seçin, prompt kopyalanacak
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs text-white/50 hover:text-white transition-colors duration-200"
                >
                  {copyStatus}
                </button>
              </div>
              <AIToolSelector generatedText={result} />
            </div>
          )}
        </div>
      )}
    </main>
  );
}