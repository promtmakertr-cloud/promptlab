'use client';

import { useState, useCallback } from 'react';
import { Bot, Sparkles, BrainCircuit, Search, Code } from 'lucide-react';

const tools = [
  { name: 'ChatGPT',    icon: Bot,          url: 'https://chatgpt.com/' },
  { name: 'Gemini',     icon: Sparkles,     url: 'https://gemini.google.com/' },
  { name: 'Claude',     icon: BrainCircuit, url: 'https://claude.ai/' },
  { name: 'Perplexity', icon: Search,       url: 'https://www.perplexity.ai/' },
  { name: 'Copilot',    icon: Code,         url: 'https://github.com/features/copilot' },
];

const AIToolSelector = ({ generatedText }) => {
  const [copiedTool, setCopiedTool] = useState(null);

  const handleCopy = useCallback((tool) => {
    const textToCopy = generatedText || tool.url;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopiedTool(tool.name);
        setTimeout(() => setCopiedTool(null), 2000);
      })
      .catch((err) => console.error('Clipboard hatası:', err));
  }, [generatedText]);

  const handleLinkOpen = useCallback((url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <div style={{ backgroundColor: '#050505', padding: '20px', borderRadius: '12px' }}>
      <h1 style={{ color: '#FFFFFF' }}>AI Tool Selector</h1>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {tools.map(({ name, icon: Icon, url }) => (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => {
                handleCopy({ name, url });
                handleLinkOpen(url);
              }}
              title={`${name}: metni kopyala ve aç`}
              style={{
                border: '1px solid #333',
                background: 'none',
                cursor: 'pointer',
                color: copiedTool === name ? '#4ade80' : '#FFFFFF',
                transition: 'color 0.3s',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              <Icon size={28} />
            </button>
            <span style={{ color: '#aaa', fontSize: '12px' }}>
              {copiedTool === name ? '✅ Kopyalandı!' : name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIToolSelector;