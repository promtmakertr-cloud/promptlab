'use client';

import { useState } from 'react';
import {
  Trash2,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  FolderOpen,
  Search,
} from 'lucide-react';
import type { SavedPrompt, Tone } from '@/lib/types';

const TONE_LABELS: Record<Tone, string> = {
  professional: 'Profesyonel',
  creative: 'Yaratıcı',
  technical: 'Teknik',
  concise: 'Kısa & Öz',
};

type Props = {
  prompts: SavedPrompt[];
  onLoad: (input: string, output: string) => void;
  onDelete: (id: string) => void;
};

const SavedPrompts = ({ prompts, onLoad, onDelete }: Props) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyFailedId, setCopyFailedId] = useState<string | null>(null);

  const filtered = prompts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.input.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (prompt: SavedPrompt) => {
    navigator.clipboard
      .writeText(prompt.output)
      .then(() => {
        setCopiedId(prompt.id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => {
        setCopyFailedId(prompt.id);
        setTimeout(() => setCopyFailedId(null), 2000);
      });
  };

  if (prompts.length === 0) {
    return (
      <div
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          color: '#555',
          fontSize: '0.9rem',
          lineHeight: '1.8',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💾</div>
        Henüz kaydedilmiş prompt yok.
        <br />
        <span style={{ fontSize: '0.8rem', color: '#444' }}>
          Bir prompt oluşturduktan sonra &quot;💾 Kaydet&quot; düğmesiyle kaydedin.
        </span>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem 0' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h2
          style={{
            color: '#fff',
            fontSize: '1.1rem',
            fontWeight: '600',
            margin: 0,
          }}
        >
          💾 Kaydedilen Promptlar ({prompts.length})
        </h2>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <Search
          size={14}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#555',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Başlık veya içerik ara..."
          style={{
            width: '100%',
            background: '#0d0d0d',
            border: '1px solid #222',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '0.85rem',
            padding: '0.5rem 0.75rem 0.5rem 2rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* No results message */}
      {filtered.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            color: '#555',
            padding: '1.5rem',
            fontSize: '0.85rem',
          }}
        >
          &quot;{searchTerm}&quot; ile eşleşen prompt bulunamadı.
        </div>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filtered.map((prompt) => (
          <div
            key={prompt.id}
            style={{
              background: '#111',
              border: '1px solid #1a2a1a',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {/* Row header */}
            <div
              style={{
                padding: '0.75rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
              onClick={() =>
                setExpanded(expanded === prompt.id ? null : prompt.id)
              }
            >
              {/* Left: icon + title + meta */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <FolderOpen
                  size={14}
                  color="#22c55e"
                  style={{ marginTop: '3px', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: '#fff',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {prompt.title}
                  </div>
                  <div
                    style={{
                      color: '#555',
                      fontSize: '0.75rem',
                      marginTop: '2px',
                    }}
                  >
                    {new Date(prompt.createdAt).toLocaleString('tr-TR')} ·{' '}
                    {prompt.language.toUpperCase()} ·{' '}
                    {TONE_LABELS[prompt.tone]}
                  </div>
                </div>
              </div>

              {/* Right: action buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLoad(prompt.input, prompt.output);
                  }}
                  title="Bu promptu yükle"
                  style={{
                    background: '#0070f3',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '0.25rem 0.6rem',
                    color: '#fff',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Yükle
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(prompt);
                  }}
                  title={copyFailedId === prompt.id ? 'Kopyalama başarısız' : 'Promptu kopyala'}
                  style={{
                    background: 'none',
                    border: '1px solid #333',
                    borderRadius: '5px',
                    padding: '0.25rem 0.4rem',
                    color:
                      copiedId === prompt.id
                        ? '#4ade80'
                        : copyFailedId === prompt.id
                        ? '#ef4444'
                        : '#888',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {copiedId === prompt.id ? (
                    <Check size={12} />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(prompt.id);
                  }}
                  title="Kaydı sil"
                  style={{
                    background: 'none',
                    border: '1px solid #333',
                    borderRadius: '5px',
                    padding: '0.25rem 0.4rem',
                    color: '#888',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Trash2 size={12} />
                </button>
                {expanded === prompt.id ? (
                  <ChevronDown size={16} color="#666" />
                ) : (
                  <ChevronRight size={16} color="#666" />
                )}
              </div>
            </div>

            {/* Expanded: input + output preview */}
            {expanded === prompt.id && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderTop: '1px solid #1a1a1a',
                }}
              >
                <div
                  style={{
                    color: '#666',
                    fontSize: '0.78rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <strong style={{ color: '#555' }}>İstek: </strong>
                  {prompt.input}
                </div>
                <div
                  style={{
                    color: '#999',
                    fontSize: '0.82rem',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.5',
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}
                >
                  {prompt.output}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedPrompts;
