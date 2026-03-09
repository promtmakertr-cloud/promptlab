'use client';

import { useState } from 'react';
import { Trash2, ChevronDown, ChevronRight } from 'lucide-react';

const PromptHistory = ({ history, onSelect, onClear }) => {
  const [expanded, setExpanded] = useState(null);

  if (!history || history.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#555', fontSize: '0.9rem' }}>
        Henüz geçmiş yok. Bir prompt oluşturduğunuzda burada görünecek.
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
          🕒 Prompt Geçmişi ({history.length})
        </h2>
        <button
          onClick={onClear}
          style={{
            background: 'none',
            border: '1px solid #333',
            borderRadius: '6px',
            padding: '0.3rem 0.6rem',
            color: '#888',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Trash2 size={14} /> Temizle
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {history.map((entry) => (
          <div
            key={entry.id}
            style={{
              background: '#111',
              border: '1px solid #222',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '0.75rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    color: '#ddd',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {entry.input}
                </div>
                <div style={{ color: '#555', fontSize: '0.75rem', marginTop: '2px' }}>
                  {new Date(entry.createdAt).toLocaleString('tr-TR')}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); onSelect(entry.input, entry.output); }}
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
                {expanded === entry.id ? (
                  <ChevronDown size={16} color="#666" />
                ) : (
                  <ChevronRight size={16} color="#666" />
                )}
              </div>
            </div>
            {expanded === entry.id && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderTop: '1px solid #1a1a1a',
                  color: '#999',
                  fontSize: '0.82rem',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.5',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                {entry.output}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptHistory;
