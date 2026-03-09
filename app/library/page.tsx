'use client';

import { useRouter } from 'next/navigation';
import PromptTemplates from '@/components/PromptTemplates';

export default function LibraryPage() {
  const router = useRouter();

  const handleSelect = (value: string) => {
    router.push(`/?template=${encodeURIComponent(value)}`);
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
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0 }}>⚡ Prompt Kütüphanesi</h1>
        <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.4rem' }}>
          Hazır şablonlardan birini seçerek prompt oluşturmaya başlayın
        </p>
      </div>

      <PromptTemplates onSelect={handleSelect} />
    </main>
  );
}
