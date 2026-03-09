'use client';

import { useState, useCallback } from 'react';

const AI_PLATFORMS = [
  {
    name: 'ChatGPT',
    url: 'https://chatgpt.com/',
    color: '#10A37F',
    hoverColor: '#0d8c6d',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.843-3.372L15.115 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.403-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    name: 'Claude',
    url: 'https://claude.ai/',
    color: '#D97757',
    hoverColor: '#c4633f',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M13.827 3.52h3.603l-7.744 16.958H6.08L13.827 3.52zm-7.258 0h3.767l-2.197 5.12L6.08 3.52zm7.46 11.836h3.767l-2.197-5.12-1.57 5.12z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    name: 'Gemini',
    url: 'https://gemini.google.com/',
    color: '#4285F4',
    hoverColor: '#2b6de8',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M12 24A14.304 14.304 0 0 0 0 12 14.304 14.304 0 0 0 12 0a14.305 14.305 0 0 0 12 12 14.305 14.305 0 0 0-12 12"
          fill="white"
        />
      </svg>
    ),
  },
];

export default function AiLaunchButtons({ generatedPrompt }) {
  const [copiedPlatform, setCopiedPlatform] = useState(null);

  const handleClick = useCallback(
    (platform) => {
      // Open window synchronously before any async operation to avoid popup blockers
      const newWindow = window.open(platform.url, '_blank', 'noopener,noreferrer');
      if (newWindow) {
        newWindow.opener = null;
      }

      navigator.clipboard.writeText(generatedPrompt).then(() => {
        setCopiedPlatform(platform.name);
        setTimeout(() => setCopiedPlatform(null), 2000);
      }).catch((err) => {
        console.error('Kopyalama hatası:', err);
        setCopiedPlatform(`${platform.name}_error`);
        setTimeout(() => setCopiedPlatform(null), 2000);
      });
    },
    [generatedPrompt]
  );

  if (!generatedPrompt) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {AI_PLATFORMS.map((platform) => {
        const isCopied = copiedPlatform === platform.name;
        const isCopyError = copiedPlatform === `${platform.name}_error`;
        return (
          <button
            key={platform.name}
            type="button"
            aria-label={`${platform.name} ile aç ve promptu kopyala`}
            onClick={() => handleClick(platform)}
            style={{ backgroundColor: platform.color }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-medium transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95 shadow-md cursor-pointer"
          >
            {isCopied ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Kopyalandı!</span>
              </>
            ) : isCopyError ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Kopyalanamadı</span>
              </>
            ) : (
              <>
                {platform.icon}
                <span>{platform.name}</span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
