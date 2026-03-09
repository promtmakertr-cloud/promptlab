'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SavedPrompts from '@/components/SavedPrompts';
import type { SavedPrompt } from '@/lib/types';

export default function SavedPage() {
  const router = useRouter();
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);

  useEffect(() => {
    fetch('/api/prompts')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SavedPrompt[]) => setSavedPrompts(data))
      .catch(() => {});
  }, []);

  const handleLoad = (input: string, output: string) => {
    router.push(
      `/?input=${encodeURIComponent(input)}&output=${encodeURIComponent(output)}`
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
      setSavedPrompts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      /* ignore */
    }
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <a
            href="/"
            aria-label="Ana Sayfaya dön"
            style={{
              color: '#555',
              fontSize: '0.85rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ← Ana Sayfa
          </a>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>💾 Kaydedilen Promptlar</h1>
        <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.4rem' }}>
          Daha önce kaydettiğiniz promptları görüntüleyin ve yönetin
        </p>
      </div>

      <SavedPrompts
        prompts={savedPrompts}
        onLoad={handleLoad}
        onDelete={handleDelete}
      />
    </main>
  );
}
