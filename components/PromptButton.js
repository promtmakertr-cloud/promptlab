// components/PromptButton.js
'use client';

import { useCallback } from 'react';
import { externalLinkManager } from '../lib/externalLinkHandler';

export default function PromptButton({ result, url, name, icon }) {
  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    externalLinkManager.navigateToExternal({
      url: url,
      copyText: result,
    });
  }, [result, url]);

  return (
    <div className="ai-brand-btn" onClick={handleClick}>
      {icon} <span>{name}</span>
    </div>
  );
}
