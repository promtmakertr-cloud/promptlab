'use client';

import { useState, useCallback } from 'react';
import { Bot, Sparkles, BrainCircuit, Search, Code } from 'lucide-react';

const tools = [
  { name: 'ChatGPT',    icon: Bot,          url: 'https://chatgpt.com/',           promptParam: 'q' },
  { name: 'Gemini',     icon: Sparkles,     url: 'https://gemini.google.com/app',  promptParam: 'q' },
  { name: 'Claude',     icon: BrainCircuit, url: 'https://claude.ai/new',          promptParam: 'q' },
  { name: 'Perplexity', icon: Search,       url: 'https://www.perplexity.ai/',     promptParam: 'q' },
  { name: 'Copilot',    icon: Code,         url: 'https://copilot.microsoft.com/', promptParam: 'q' },
];

function buildUrl(tool, text) {
  if (!text || !tool.promptParam) return tool.url;
  const url = new URL(tool.url);
  url.searchParams.set(tool.promptParam, text);
  return url.toString();
}

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

  return (
    <div style={{ backgroundColor: '#050505', padding: '20px', borderRadius: '12px' }}>
      <h1 style={{ color: '#FFFFFF' }}>AI Tool Selector</h1>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {tools.map((tool) => {
          const { name, icon: Icon } = tool;
          const openUrl = buildUrl(tool, generatedText);
          return (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => {
                handleCopy(tool);
                window.open(openUrl, '_blank', 'noopener,noreferrer');
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
          );
        })}
      </div>
    </div>
  );
};

export default AIToolSelector;