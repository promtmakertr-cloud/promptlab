'use client';

export default function PromptButton({ result, url, name, icon }) {
  const handleQuickLaunch = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Üretilen promptu sessizce kopyala
    try {
      if (result) navigator.clipboard.writeText(result);
    } catch (err) {
      console.log('Kopyalama hatası', err);
    }

    // 2. 404 KESİN ÇÖZÜM: Next.js router'ını atlayıp saf tarayıcı yönlendirmesi yapıyoruz
    if (typeof window !== "undefined") {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="ai-brand-btn" onClick={handleQuickLaunch} title={`${name} Aç`}>
      {icon} <span>{name}</span>
    </div>
  );
}
