// lib/externalLinkHandler.js

class ExternalLinkManager {
  navigateToExternal(config) {
    // 1. Metni kopyala
    if (config.copyText) {
      navigator.clipboard.writeText(config.copyText).catch((err) => {
        console.error('Kopyalama başarısız:', err);
      });
    }

    // 2. Yeni sekmede aç (Next.js'i tamamen atlar)
    if (typeof window !== 'undefined') {
      window.open(config.url, '_blank', 'noopener,noreferrer');
    }
  }
}

export const externalLinkManager = new ExternalLinkManager();
