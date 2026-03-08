'use client';
import { useState, useEffect } from 'react';

// 🔥 KISALTILMIŞ VİZYONER PROMPT HAVUZU 🔥
const allPrompts = [
  "Sinema | Wong Kar-wai estetiğinde neon sokaklar ve melankolik bir sahne.",
  "Ürün Tasarımı | Mental sağlık uygulaması için UX akışı ve backend mimarisi.",
  "Reklam | Premium su markası için buz gibi ferahlık hissini yansıtan sinematik konsept.",
  "Kripto | Death cross formasyonunu analiz ederek risk odaklı portföy stratejisi.",
  "Çocuk Hikâyesi | Mini Kedi Mavi'nin balonla yaşadığı pedagojik olarak uygun maceraları.",
  "Felsefe | Öğrenilmiş benlik ile gerçek benlik arasındaki çatışmayı inceleyen makale.",
  "Müzik | Aşık Mahzuni Şerif ekolünden ilham alan modern Türk halk müziği.",
  "DevOps | Yüksek trafikli bir platform için mikroservis tabanlı DevOps altyapısı.",
  "Pazarlama | Karar vericileri hedefleyen etkili B2B cold email sekansları.",
  "Hukuk | GDPR standartlarına tam uyumlu kapsamlı veri gizliliği sözleşmesi.",
  "Senaryo | Rick and Morty tarında varoluşsal krizi anlatan mizahi bir hikâye.",
  "Prompt Engineering | Karmaşık bir fikri analiz edip master prompta dönüştür.",
  "Startup | SaaS ürünü için yatırımcıları etkileyecek pitch deck taslağı.",
  "UX Yazımı | Mobil uygulama için net ve sade onboarding metinleri.",
  "Marka Stratejisi | Teknoloji markası için konumlandırma, slogan ve marka hikâyesi.",
  "İçerik Üretimi | YouTube kanalı için dikkat çekici video başlıkları.",
  "Kod | Gerçek zamanlı veri işleyen ölçeklenebilir Node.js mikroservisi.",
  "Veri Analizi | Satış verilerini analiz ederek büyüme fırsatlarını raporla.",
  "UI Tasarımı | Minimal ve modern bir AI dashboard arayüzü.",
  "Yazarlık | Distopik bir gelecekte geçen etkileyici bilimkurgu hikâyesi.",
  "SEO | Teknoloji blogu için yüksek trafik potansiyeline sahip içerik planı.",
  "Sunum | Karmaşık bir konuyu yöneticilere anlatan sunum yapısı.",
  "Eğitim | Yeni başlayanlar için yapay zekâ kavramlarını basitçe anlat.",
  "Finans | Startup için sürdürülebilir gelir modeli ve finansal projeksiyon.",
  "Strateji | Yeni bir dijital ürünün pazara giriş stratejisini planla."
];

const typewriterExamples = [
  "Wong Kar-wai estetiğinde sahne kurgula", 
  "Premium su markası için reklam konsepti", 
  "Mental sağlık uygulaması için UX tasarla", 
  "Kripto portföy stratejisi geliştir", 
  "Mini Kedi Mavi'nin maceralarını yaz", 
  "Etkili B2B cold email sekansları", 
  "Mikroservis tabanlı DevOps mimarisi", 
  "Öğrenilmiş benlik çatışmasını incele", 
  "Aşık Mahzuni motiflerini modern yorumla", 
  "Teknoloji markası için slogan bul", 
  "Node.js mikroservisi oluştur", 
  "GDPR uyumlu veri sözleşmesi hazırla", 
];

const fontSizes = ['0.85rem', '0.95rem', '1.05rem', '1.1rem'];

const parsePromptData = (fullText) => {
  if (!fullText) return { category: '', promptText: '' };
  const match = fullText.match(/^([^|]*)\|\s*(.*)$/); 
  if (match) { return { category: match[1].trim(), promptText: match[2].trim() }; }
  return { category: '', promptText: fullText };
};

const loadingMessages = [
  "🧠 Fikriniz yapay zeka tarafından analiz ediliyor...",
  "📚 Master Kütüphane standartlarına uyarlanıyor...",
  "⚙️ Sektörel jargon ve teknik detaylar ekleniyor...",
  "✨ Son rötuşlar yapılıyor, promptunuz hazır olmak üzere..."
];

// 🔥 YAPAY ZEKA UYGULAMA İKONLARI (SVG) 🔥
const IconChatGPT = <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5967 8.3829a.0804.0804 0 0 1 .0332-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.1408 1.6464 4.4708 4.4708 0 0 1 .5346 3.0137l-.1416-.0852-4.783-2.7582a.7712.7712 0 0 0-.7806 0l-5.8428 3.3685v-2.3324zm2.0107-3.0231l-4.8-2.7677a.7664.7664 0 0 0-.3879-.6764V1.1925a.0757.0757 0 0 1 .071 0l4.8303 2.7866a4.504 4.504 0 0 1 2.28 4.6138zM8.5035 1.5165l-.1419.0804-4.7783 2.7582a.7948.7948 0 0 0-.3927.6813v6.7369l-2.02-1.1686a.071.071 0 0 1-.038-.052V4.9701a4.504 4.504 0 0 1 7.371-3.4536zM14.793 9.4042l-2.7932-1.6127-2.7932 1.6127v3.2255l2.7932 1.6127 2.7932-1.6127z"/></svg>;
const IconGemini = <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0Z"/></svg>;
const IconClaude = <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect width="24" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/><text x="50%" y="50%" textAnchor="middle" dy=".35em" fontFamily="Georgia, serif" fontSize="14" fontWeight="bold">C</text></svg>;
const IconPerplexity = <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="12 2 2 7 2 17 12 22 22 17 22 7" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="2"/></svg>;
const IconCopilot = <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11 2H2v9h9V2zm11 0h-9v9h9V2zm-11 11H2v9h9v-9zm11 0h-9v9h9v-9z"/></svg>;
const IconMidjourney = <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M2 20h20v2H2v-2zm10-18l8 16H4l8-16z" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M12 6l-4 10h8z"/></svg>;
const IconLeonardo = <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 2v16h12v4H2V2h4z"/><circle cx="16" cy="8" r="3"/></svg>;
const IconAdobe = <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="14.5 2 22 22 18 22 14.5 12 11 22 7 22"/><polygon points="9.5 2 2 22 6 22 9.5 12"/></svg>;
const IconCanva = <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M15 8a4 4 0 0 0-6 0 4 4 0 0 0 0 6 4 4 0 0 0 6 0"/></svg>;
const IconCopy = <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0); 
  const [isListening, setIsListening] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Metni Kopyala');
  const [slots, setSlots] = useState([]);

  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [isVisual, setIsVisual] = useState(false); 

  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const getRandomPos = (slotId) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const r1 = Math.random();
    const r2 = Math.random();

    if (isMobile) {
      if (slotId === 0) return { top: `${8 + (r1 * 10)}%`, left: '0', right: '0', margin: '0 auto', maxWidth: '85vw' };
      if (slotId === 1) return { top: `${26 + (r1 * 10)}%`, left: '0', right: '0', margin: '0 auto', maxWidth: '85vw' };
      return { top: '-100%', left: '-100%', display: 'none' }; 
    }

    let top, left, right;
    const maxWidth = '340px'; 

    if (slotId === 0) { top = `${6 + (r1 * 6)}%`; left = `${2 + (r2 * 12)}%`; right = 'auto'; } 
    else if (slotId === 1) { top = `${10 + (r1 * 6)}%`; left = 'auto'; right = `${2 + (r2 * 12)}%`; } 
    else if (slotId === 2) { top = `${38 + (r1 * 5)}%`; left = `${2 + (r2 * 12)}%`; right = 'auto'; } 
    else { top = `${42 + (r1 * 5)}%`; left = 'auto'; right = `${2 + (r2 * 12)}%`; }

    return { top, left, right, maxWidth };
  };

  useEffect(() => {
    let interval;
    if (loading && !result) {
      setLoadingStep(0);
      interval = setInterval(() => { setLoadingStep((prev) => (prev + 1) % loadingMessages.length); }, 1800);
    }
    return () => clearInterval(interval);
  }, [loading, result]);

  useEffect(() => {
    const currentFullText = typewriterExamples[typewriterIndex];
    let typingSpeed = isDeleting ? 30 : 50; 

    if (!isDeleting && typewriterText === currentFullText) {
      setTimeout(() => setIsDeleting(true), 2500);
      return;
    } else if (isDeleting && typewriterText === '') {
      setIsDeleting(false);
      setTypewriterIndex((prev) => (prev + 1) % typewriterExamples.length);
      return;
    }

    const timeout = setTimeout(() => {
      setTypewriterText((prev) => isDeleting ? prev.slice(0, -1) : currentFullText.slice(0, prev.length + 1));
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typewriterText, isDeleting, typewriterIndex]);

  useEffect(() => {
    const shuffledTexts = [...allPrompts].sort(() => 0.5 - Math.random());
    setSlots([
      { id: 0, text: shuffledTexts[0], pos: getRandomPos(0), size: fontSizes[2], delay: '0s' },
      { id: 1, text: shuffledTexts[1], pos: getRandomPos(1), size: fontSizes[1], delay: '6s' },
      { id: 2, text: shuffledTexts[2], pos: getRandomPos(2), size: fontSizes[3], delay: '12s' },
      { id: 3, text: shuffledTexts[3], pos: getRandomPos(3), size: fontSizes[0], delay: '18s' },
    ]);
  }, []);

  const handleAnimationIteration = (slotId) => {
    setSlots(prevSlots => {
      const currentTexts = prevSlots.map(s => s.text);
      const availablePrompts = allPrompts.filter(p => !currentTexts.includes(p));
      const newText = availablePrompts[Math.floor(Math.random() * availablePrompts.length)] || allPrompts[0];
      const newSize = fontSizes[Math.floor(Math.random() * fontSizes.length)];
      return prevSlots.map(slot => slot.id === slotId ? { ...slot, text: newText, pos: getRandomPos(slotId), size: newSize } : slot );
    });
  };

  const handleReset = () => {
    setResult(''); setInput(''); setSubmittedPrompt(''); setIsPromptExpanded(false); setIsVisual(false); 
  };

  const handleGenerate = async () => {
    if (!input.trim() || loading) return;
    setLoading(true); setSubmittedPrompt(input); setIsPromptExpanded(false); setResult(''); setIsVisual(false); 
    
    const currentInput = input; setInput(''); 
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userInput: currentInput }),
      });

      if (!res.ok) { const errText = await res.text(); throw new Error(`Sunucu Hatası (${res.status}): ${errText}`); }
      if (!res.body) throw new Error("Tarayıcınız akış (streaming) desteklemiyor.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let fullContent = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          setResult((prev) => prev + chunk); 
          if (fullContent.includes("```text")) { setIsVisual(true); }
        }
      }
    } catch (err) { alert("Hata Oluştu: " + err.message); setInput(currentInput); setSubmittedPrompt(''); } 
    finally { setLoading(false); }
  };

  // 🔥 NÜKLEER ÇÖZÜM: LİNK VE BUTONLARI DEVREDEN ÇIKARAN SAF JS YÖNLENDİRMESİ 🔥
  const handleQuickLaunch = (e, url, name) => {
    e.stopPropagation(); // Diğer tıklama olaylarını tamamen durdur
    
    // 1. Kopyalama işlemi
    try {
      navigator.clipboard.writeText(result);
      setCopyStatus(name + ' Açıldı!');
      setTimeout(() => setCopyStatus('Metni Kopyala'), 2000);
    } catch(err) {
      console.log('Kopyalama yapılamadı');
    }

    // 2. Doğrudan yeni sekme (Next.js'in araya girmesi %100 imkansızdır)
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleVoiceTyping = () => {
    if (!('webkitSpeechRecognition' in window)) { alert("Tarayıcınız sesli yazmayı desteklemiyor. Lütfen Chrome veya Safari kullanın."); return; }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR'; recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => setInput((prev) => prev + " " + event.results[0][0].transcript);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(result);
    setCopyStatus('Kopyalandı! ✓');
    setTimeout(() => setCopyStatus('Metni Kopyala'), 2000);
  };

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes elegantGlow {
        0%   { box-shadow: 0 0 8px rgba(0, 242, 254, 0.1), inset 0 0 4px rgba(0, 242, 254, 0.05); border-color: rgba(0, 242, 254, 0.15); }
        50%  { box-shadow: 0 0 20px rgba(10, 100, 255, 0.25), inset 0 0 8px rgba(10, 100, 255, 0.1); border-color: rgba(10, 100, 255, 0.35); }
        100% { box-shadow: 0 0 8px rgba(0, 242, 254, 0.1), inset 0 0 4px rgba(0, 242, 254, 0.05); border-color: rgba(0, 242, 254, 0.15); }
      }
      @keyframes perfectBreathing { 0% { opacity: 0; filter: blur(10px); transform: translateY(10px); } 10% { opacity: 1; filter: blur(0px); transform: translateY(0px); } 25% { opacity: 1; filter: blur(0px); transform: translateY(0px); } 35% { opacity: 0; filter: blur(10px); transform: translateY(-10px); } 100% { opacity: 0; filter: blur(10px); transform: translateY(-10px); } }
      @keyframes loadingPulse { 0% { opacity: 0.6; transform: scale(0.98); } 50% { opacity: 1; transform: scale(1); } 100% { opacity: 0.6; transform: scale(0.98); } }
      @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

      .loading-box { width: 100%; max-width: 600px; background: rgba(10, 10, 10, 0.8); border: 1px solid rgba(0, 242, 254, 0.3); border-radius: 16px; padding: 40px 20px; text-align: center; box-shadow: 0 0 30px rgba(0, 242, 254, 0.1); animation: loadingPulse 2s infinite ease-in-out; }
      .loading-text { font-size: 1.1rem; color: #00f2fe; font-weight: 500; margin-top: 15px; letter-spacing: 0.5px; }
      .cursor-blink { display: inline-block; width: 8px; height: 1.2em; background-color: #00f2fe; vertical-align: middle; margin-left: 4px; animation: blink 1s step-end infinite; }
      .cinematic-text { position: absolute; color: #888888; cursor: pointer; animation: perfectBreathing 24s infinite linear; text-align: left; line-height: 1.5; font-weight: 300; transition: transform 0.3s ease, filter 0.3s ease; pointer-events: auto; }
      .cinematic-text:hover { animation-play-state: paused; z-index: 50; }
      .cinematic-text:hover .prompt-category { color: #00f2fe; text-shadow: 0 0 10px rgba(0, 242, 254, 0.5); }
      .cinematic-text:hover .prompt-body { color: #ffffff; opacity: 1; text-shadow: 0 0 10px rgba(255, 255, 255, 0.4); }
      .prompt-category { font-family: "Times New Roman", Times, serif; font-size: 1.35em; font-style: italic; color: #ffffff; margin-bottom: 6px; letter-spacing: 0.5px; opacity: 0.95; transition: color 0.3s ease, text-shadow 0.3s ease; }
      .prompt-body { font-family: inherit; font-size: 0.95em; opacity: 0.75; transition: color 0.3s ease, opacity 0.3s ease, text-shadow 0.3s ease; }
      .pulse-mic { animation: pulse 1.5s infinite; color: #00f2fe !important; }
      @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
      .edit-btn:hover { background: rgba(0, 242, 254, 0.2) !important; color: #fff !important; }

      /* 🔥 YENİ NESİL ŞIK AI KUTULARI (DIV KULLANILDI) 🔥 */
      .ai-brand-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(20, 20, 20, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #d1d1d1;
        padding: 8px 15px;
        border-radius: 10px;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        font-family: inherit;
        backdrop-filter: blur(10px);
        user-select: none; /* Metin seçimini engeller */
      }
      .ai-brand-btn:hover {
        background: rgba(0, 242, 254, 0.1);
        border-color: rgba(0, 242, 254, 0.5);
        color: #fff;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 242, 254, 0.2);
      }

      /* Kopyala kutusu hover efekti */
      .copy-box:hover {
        background: #e0e0e0 !important;
        transform: translateY(-1px);
      }

      @media (max-width: 768px) {
        .hero-section { margin-top: 42vh !important; gap: 10px !important; }
        .hero-title { font-size: 1.55rem !important; line-height: 1.2 !important; padding: 0 10px !important; margin-bottom: 0 !important; }
        .hero-sub { font-size: 0.85rem !important; padding: 0 15px !important; margin-top: 0 !important; line-height: 1.5 !important; }
        .cinematic-text { font-size: 0.85rem !important; margin: 0 auto !important; }
        .slot-2 { display: none !important; }
        .slot-3 { display: none !important; } 
        .floor-glow { opacity: 0.2 !important; height: 50px !important; bottom: -5px !important;}
        .main-input { font-size: 16px !important; white-space: pre-wrap !important; overflow-y: auto !important; line-height: 1.4 !important; }
        .main-input::placeholder { font-size: 14px !important; }
        .input-box-inner { padding: 12px 14px 12px 18px !important; border-radius: 28px !important; }
        
        .ai-brand-btn { font-size: 0.8rem; padding: 8px 12px; }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const dynamicPlaceholder = `Ne oluşturmak istiyorsun?\nÖrn: “${typewriterText}${typewriterText.length > 0 ? '”' : ''}`;

  return (
    <main style={container}>
      <div style={topBar}>
        <div style={logoWrapper} onClick={handleReset}>
          <img src="/logo.png" alt="Logo" style={miniLogo} />
        </div>
        {(submittedPrompt) && ( <button onClick={handleReset} style={backButton}>← Ana Sayfa</button> )}
      </div>
      
      <div style={contentArea}>
        {!submittedPrompt ? (
          <>
            <div style={floatingContainer}>
              {slots.map((slot) => {
                const { category, promptText } = parsePromptData(slot.text);
                return (
                  <div key={slot.id} className={`cinematic-text slot-${slot.id}`} onClick={() => setInput(promptText)} onAnimationIteration={() => handleAnimationIteration(slot.id)}
                    style={{ top: slot.pos.top || 'auto', bottom: slot.pos.bottom || 'auto', left: slot.pos.left || 'auto', right: slot.pos.right || 'auto', maxWidth: slot.pos.maxWidth, fontSize: slot.size, animationDelay: slot.delay, display: slot.pos.display || 'block' }} >
                    {category && <div className="prompt-category">{category}</div>}
                    <div className="prompt-body">{promptText}</div>
                  </div>
                );
              })}
            </div>

            <div style={heroSection} className="hero-section">
              <div style={logoFrame}> <img src="/logo.png" alt="Logo" style={centerLogo} /> </div>
              <h2 style={heroTitle} className="hero-title">Fikirlerini Güçlü Promptlara Dönüştür.</h2>
              <p style={heroSub} className="hero-sub">Metni yaz. Optimize edilmiş promptu al. Kopyala ve diğer AI araçlarında kullan.</p>
            </div>
          </>
        ) : (
          <div style={resultContainer}>
              
             <div style={userPromptWrapper}>
               <div style={userPromptHeader} onClick={() => setIsPromptExpanded(!isPromptExpanded)}>
                 <div style={userPromptTitle}>
                    <span style={{ color: '#00f2fe', marginRight: '8px' }}>✦</span>
                    {isPromptExpanded ? "Senin Promptun" : `Senin Promptun: "${submittedPrompt.length > 45 ? submittedPrompt.slice(0, 45) + '...' : submittedPrompt}"`}
                 </div>
                 <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                   <button className="edit-btn" style={editBtn} onClick={(e) => { e.stopPropagation(); setInput(submittedPrompt); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }}>Düzenle</button>
                   <span style={{ transform: isPromptExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', color: '#888', fontSize: '0.8rem' }}>▼</span>
                 </div>
               </div>
               {isPromptExpanded && ( <div style={userPromptBody}>{submittedPrompt}</div> )}
             </div>

             {(!result && loading) ? (
               <div className="flex flex-col items-center justify-center mt-10">
                 <div className="loading-box">
                   <svg className="animate-spin" style={{ margin: '0 auto', width: '40px', height: '40px', color: '#00f2fe' }} xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   <div className="loading-text">{loadingMessages[loadingStep]}</div>
                 </div>
               </div>
             ) : (
               <div style={aiResponseWrapper}>
                  <div style={aiLabel}>ÜRETİLEN MASTER PROMPT</div>
                  <div style={aiText}>
                    {result}
                    {loading && <span className="cursor-blink"></span>}
                  </div>
                  
                  {/* 🔥 KUSURSUZ YÖNETİM PANELİ (Tamamen DIV Etiketleri) 🔥 */}
                  {!loading && result && (
                    <div style={{ marginTop: '35px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#888', letterSpacing: '0.5px' }}>✨ ÜRETİMİ BAŞLAT:</span>
                        {/* Kopyalama kutusu da artık bir div */}
                        <div onClick={handleCopy} className="copy-box" style={copyBtn}>
                          {IconCopy} <span>{copyStatus}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {!isVisual ? (
                          <>
                            {/* BUNLAR KESİNLİKLE BUTON VEYA LİNK DEĞİLDİR. SAF DIV'DİR VE DÜZ URL İÇERİRLER */}
                            <div className="ai-brand-btn" onClick={(e) => handleQuickLaunch(e, '[https://chatgpt.com](https://chatgpt.com)', 'ChatGPT')}>
                              {IconChatGPT} <span>ChatGPT</span>
                            </div>
                            <div className="ai-brand-btn" onClick={(e) => handleQuickLaunch(e, '[https://gemini.google.com](https://gemini.google.com)', 'Gemini')}>
                              {IconGemini} <span>Gemini</span>
                            </div>
                            <div className="ai-brand-btn" onClick={(e) => handleQuickLaunch(e, '[https://claude.ai](https://claude.ai)', 'Claude')}>
                              {IconClaude} <span>Claude</span>
                            </div>
                            <div className="ai-brand-btn" onClick={(e) => handleQuickLaunch(e, '[https://www.perplexity.ai](https://www.perplexity.ai)', 'Perplexity')}>
                              {IconPerplexity} <span>Perplexity</span>
                            </div>
                            <div className="ai-brand-btn" onClick={(e) => handleQuickLaunch(e, '[https://copilot.microsoft.com](https://copilot.microsoft.com)', 'Copilot')}>
                              {IconCopilot} <span>Copilot</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="ai-brand-btn" onClick={(e) => handleQuickLaunch(e, '[https://discord.com/channels/@me](https://discord.com/channels/@me)', 'Midjourney')}>
                              {IconMidjourney} <span>Midjourney</span>
                            </div>
                            <div className="ai-brand-btn" onClick={(e) => handleQuickLaunch(e, '[https://chatgpt.com](https://chatgpt.com)', 'DALL-E 3')}>
                              {IconChatGPT} <span>DALL-E 3</span>
                            </div>
                            <div className="ai-brand-btn" onClick={(e) => handleQuickLaunch(e, '[https://leonardo.ai](https://leonardo.ai)', 'Leonardo')}>
                              {IconLeonardo} <span>Leonardo</span>
                            </div>
                            <div className="ai-brand-btn" onClick={(e) => handleQuickLaunch(e, '[https://firefly.adobe.com](https://firefly.adobe.com)', 'Adobe Firefly')}>
                              {IconAdobe} <span>Adobe Firefly</span>
                            </div>
                            <div className="ai-brand-btn" onClick={(e) => handleQuickLaunch(e, '[https://www.canva.com](https://www.canva.com)', 'Canva')}>
                              {IconCanva} <span>Canva</span>
                            </div>
                          </>
                        )}
                      </div>

                    </div>
                  )}

               </div>
             )}
          </div>
        )}
      </div>

      <div style={bottomArea}>
        <div className="floor-glow" style={floorGlow}></div>
        <div style={glowWrapper}>
          <div style={inputBoxInner} className="input-box-inner">
            <textarea 
              className="main-input" style={inputField} placeholder={dynamicPlaceholder} rows={2} 
              value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }}}
            />
            <div style={actionButtons}>
              <button onClick={handleVoiceTyping} style={iconButton} className={isListening ? "pulse-mic" : ""} title="Sesle Yaz">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
              </button>
              <button onClick={handleGenerate} disabled={loading || !input.trim()} style={sendButton}> {loading ? '⏳' : '↑'} </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// 🔥 KUSURSUZ STİLLER 🔥
const container = { backgroundColor: '#050505', minHeight: '100vh', color: '#ECECEC', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' };
const topBar = { padding: '20px 25px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const logoWrapper = { display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.8, cursor: 'pointer' };
const miniLogo = { height: '20px', width: 'auto', objectFit: 'contain' };
const backButton = { backgroundColor: 'transparent', color: '#fff', border: '1px solid #333', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' };
const contentArea = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', paddingBottom: '100px' };

const floatingContainer = { position: 'absolute', top: '70px', left: 0, right: 0, height: '70vh', pointerEvents: 'none', zIndex: 5, overflow: 'hidden' };

const heroSection = { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10, marginTop: '60vh', width: '100%', gap: '15px', height: 'auto', minHeight: 'min-content', pointerEvents: 'none' };
const logoFrame = { display: 'flex', alignItems: 'center', justifyContent: 'center' };
const centerLogo = { width: '100%', maxWidth: '180px', height: 'auto', display: 'block', objectFit: 'contain' };
const heroTitle = { fontSize: '2.2rem', fontWeight: '600', color: '#fff', letterSpacing: '-0.5px', margin: 0 };
const heroSub = { color: '#888', fontSize: '1rem', maxWidth: '550px', padding: '0 20px', lineHeight: '1.5', margin: 0 };
const resultContainer = { maxWidth: '850px', width: '100%', marginTop: '80px', marginBottom: '160px', zIndex: 10, padding: '0 20px' };

const userPromptWrapper = { width: '100%', backgroundColor: '#0f0f0f', borderRadius: '12px', border: '1px solid #222', marginBottom: '20px', overflow: 'hidden', transition: 'all 0.3s ease' };
const userPromptHeader = { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: '#141414' };
const userPromptTitle = { fontSize: '0.9rem', color: '#ccc', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '75%' };
const editBtn = { background: 'rgba(0, 242, 254, 0.08)', color: '#00f2fe', border: '1px solid rgba(0, 242, 254, 0.25)', padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s ease' };
const userPromptBody = { padding: '20px', borderTop: '1px solid #222', fontSize: '0.95rem', color: '#aaa', lineHeight: '1.6', whiteSpace: 'pre-wrap' };
const aiResponseWrapper = { width: '100%', backgroundColor: '#0a0a0a', padding: '25px', borderRadius: '16px', border: '1px solid rgba(0, 242, 254, 0.2)', boxShadow: '0 0 20px rgba(10, 100, 255, 0.15)' };
const aiLabel = { fontSize: '0.75rem', fontWeight: '700', color: '#00f2fe', marginBottom: '20px', letterSpacing: '2px' };
const aiText = { fontSize: '1rem', lineHeight: '1.6', color: '#E0E0E0', whiteSpace: 'pre-wrap', fontFamily: 'monospace', opacity: 0.9 };

const copyBtn = { display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', transition: 'all 0.2s ease' };

const bottomArea = { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '30px 20px 40px 20px', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20, pointerEvents: 'none' };
const cyberGradient = 'linear-gradient(90deg, #00f2fe, #0a64ff, #00f2fe, #0a64ff)';
const floorGlow = { position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', width: '50vw', maxWidth: '600px', height: '60px', background: cyberGradient, backgroundSize: '200% 100%', filter: 'blur(45px)', opacity: 0.35, zIndex: 1, pointerEvents: 'none', animation: 'glowingBorder 15s linear infinite' };

const glowWrapper = { position: 'relative', width: '100%', maxWidth: '680px', zIndex: 2, pointerEvents: 'auto' };
const inputBoxInner = { backgroundColor: '#0a0a0a', borderRadius: '40px', border: '1px solid rgba(0, 242, 254, 0.2)', animation: 'elegantGlow 8s infinite alternate', display: 'flex', alignItems: 'center', padding: '6px 10px 6px 18px', width: '100%', height: '100%' };
const inputField = { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1rem', outline: 'none', resize: 'none', padding: '8px 0', maxHeight: '150px', fontFamily: 'inherit' };
const actionButtons = { display: 'flex', alignItems: 'center', gap: '6px' };
const iconButton = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const sendButton = { width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: '#fff', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold' };
