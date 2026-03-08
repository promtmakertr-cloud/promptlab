'use client';

import { useCallback } from 'react';

export default function PromptButton({ result, url, name, icon }) {
  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Metni kopyala
    navigator.clipboard.writeText(result).catch((err) => {
      console.error('Kopyalama hatası:', err);
    });

    // URL'yi aç (Next.js Router'ı atlıyor)
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    
    if (newWindow) {
      newWindow.opener = null;
    }
  }, [result, url]);

  return (
    <button
      className="ai-brand-btn"
      onClick={handleClick}
      type="button"
      aria-label={`${name} ile aç`}
    >
      {icon} <span>{name}</span>
    </button>
  );
}
