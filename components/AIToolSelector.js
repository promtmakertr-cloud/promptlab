'use client';

import { useState, useCallback } from 'react';
import {
  MessageCircle,
  Sparkles,
  Zap,
  Brain,
  Wand2,
  Check,
} from 'lucide-react';

const AI_TOOLS = [
  {
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    Icon: MessageCircle,
    color: 'hover:shadow-[0_0_18px_rgba(16,163,127,0.45)] hover:border-[#10a37f]/60',
    activeColor: 'text-[#10a37f]',
  },
  {
    name: 'Gemini',
    url: 'https://gemini.google.com/app',
    Icon: Sparkles,
    color: 'hover:shadow-[0_0_18px_rgba(138,180,248,0.45)] hover:border-[#8ab4f8]/60',
    activeColor: 'text-[#8ab4f8]',
  },
  {
    name: 'Claude',
    url: 'https://claude.ai',
    Icon: Zap,
    color: 'hover:shadow-[0_0_18px_rgba(204,120,92,0.45)] hover:border-[#cc785c]/60',
    activeColor: 'text-[#cc785c]',
  },
  {
    name: 'Perplexity',
    url: 'https://www.perplexity.ai',
    Icon: Brain,
    color: 'hover:shadow-[0_0_18px_rgba(32,189,188,0.45)] hover:border-[#20bdbc]/60',
    activeColor: 'text-[#20bdbc]',
  },
  {
    name: 'Copilot',
    url: 'https://copilot.microsoft.com',
    Icon: Wand2,
    color: 'hover:shadow-[0_0_18px_rgba(112,187,255,0.45)] hover:border-[#70bbff]/60',
    activeColor: 'text-[#70bbff]',
  },
];

/**
 * AIToolSelector – copies `generatedText` to clipboard and opens the
 * chosen AI platform in a new tab.
 *
 * @param {{ generatedText: string }} props
 */
export default function AIToolSelector({ generatedText }) {
  const [copiedTool, setCopiedTool] = useState(null);

  const handleAiSelection = useCallback(
    async (aiName, targetUrl) => {
      try {
        await navigator.clipboard.writeText(generatedText);
      } catch (err) {
        console.error('Clipboard write failed:', err);
      }

      setCopiedTool(aiName);
      window.open(targetUrl, '_blank', 'noopener,noreferrer');

      setTimeout(() => {
        setCopiedTool(null);
      }, 1500);
    },
    [generatedText]
  );

  return (
    <div
      className="flex flex-wrap gap-3 justify-center"
      role="group"
      aria-label="AI tool selector"
    >
      {AI_TOOLS.map(({ name, url, Icon, color, activeColor }) => {
        const isSuccess = copiedTool === name;

        return (
          <button
            key={name}
            type="button"
            onClick={() => handleAiSelection(name, url)}
            aria-label={`${name} ile aç`}
            className={[
              // Base layout & typography
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium',
              // Glassmorphism surface
              'bg-white/5 border border-white/10 backdrop-blur-sm',
              // Text colour
              'text-white/80',
              // Transitions & interactions
              'transition-all duration-300',
              'hover:bg-white/10 hover:text-white hover:scale-[1.03]',
              color,
              'active:scale-95',
              // Success state highlight
              isSuccess ? activeColor : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {isSuccess ? (
              <Check size={16} className="shrink-0" aria-hidden="true" />
            ) : (
              <Icon size={16} className="shrink-0" aria-hidden="true" />
            )}
            <span>{name}</span>
          </button>
        );
      })}
    </div>
  );
}
