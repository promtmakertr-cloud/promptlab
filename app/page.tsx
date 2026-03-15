'use client';

import { useState, useEffect, useRef, type MouseEvent, type ReactNode } from 'react';

// 🔥 PROMPT DATA 🔥
const allPrompts = [
  "Pazarlama | Instagram için dikkat çekici ve etkileşim odaklı ürün lansman postu.",
  "İçerik Üretimi | Teknoloji blogu için SEO uyumlu ve okuyucuyu içine çeken makale taslağı.",
  "Görsel Tasarım | Unreal Engine 5 tarzında, neon ışıklı fütüristik bir siberpunk şehir manzarası.",
  "İş Dünyası | Potansiyel müşterilere gönderilecek, ikna edici ve profesyonel soğuk e-posta (cold email).",
  "Yazılım | React ve Tailwind kullanarak modern ve duyarlı (responsive) bir landing page kodu.",
  "Eğitim | Kuantum bilgisayarların çalışma mantığını 10 yaşındaki bir çocuğa anlatır gibi açıkla.",
  "Kişisel Gelişim | Zaman yönetimi ve odaklanma becerilerini artırmak için 30 günlük eylem planı.",
  "Girişimcilik | Yeni bir e-ticaret markası için rakip analizi ve pazara giriş stratejisi.",
  "Verimlilik | Karmaşık ve uzun bir PDF raporunu yöneticiler için 3 maddede özetle.",
  "Metin Yazarlığı | Kullanıcıları bültene abone olmaya ikna edecek vurucu bir 'Call to Action' (CTA) metni.",
  "Kariyer | Yazılım mühendisliği mülakatı için en sık sorulan teknik ve davranışsal sorular.",
  "Senaryo | Bir kafede yanlışlıkla kahveleri karışan iki yabancının romantik komedi tarzında tanışma hikayesi.",
  "Logo Tasarımı | Minimalist, modern ve güven veren bir finans teknolojisi (FinTech) girişimi logosu.",
  "Çeviri | Akademik bir İngilizce metni, anlam bütünlüğünü bozmadan akıcı bir Türkçeye çevir.",
  "Veri Analizi | E-ticaret satış verilerini inceleyerek müşteri sadakatini artıracak stratejiler öner.",
  "Sunum | Yapay zekanın iş dünyasındaki geleceği hakkında yöneticilere yapılacak 10 slaytlık sunum taslağı.",
  "Seyahat | Roma'da düşük bütçeli, yerel lezzetleri ve gizli kalmış mekanları kapsayan 3 günlük gezi planı.",
  "Sağlık | Evde ekipmansız yapılabilecek, yeni başlayanlar için 20 dakikalık yağ yakıcı HIIT antrenmanı.",
  "Arayüz (UI) | Koyu tema (dark mode) destekli, kullanıcı dostu ve modern bir mobil bankacılık ekranı.",
  "Marka Stratejisi | Organik cilt bakım ürünleri satan bir marka için isim önerileri ve marka hikayesi.",
  "Satış | Bir B2B yazılım ürünü (SaaS) için müşterinin itirazlarını çürütecek satış konuşması (pitch).",
  "YouTube | Yemek tarifi kanalı için izlenme rekorları kıracak, merak uyandırıcı 5 video başlığı.",
  "Oyun Tasarımı | Orta Çağ'da geçen bir RPG oyunu için derinlikli bir ana karakter arka plan hikayesi.",
  "Finans | Küçük bir işletme için aylık gelir-gider tablosu ve nakit akışı optimizasyon önerileri."
];

const typewriterExamples = [
  "Instagram için etkili bir post yaz",
  "Siberpunk tarzı şehir görseli üret",
  "İkna edici bir satış e-postası hazırla",
  "React ile landing page kodla",
  "Kuantum fiziğini basitçe anlat",
  "Yeni girişimim için iş planı oluştur",
  "YouTube videom için SEO başlıkları bul",
  "Minimalist bir şirket logosu tasarla",
  "3 günlük Roma seyahati planla",
  "İngilizce makaleyi Türkçeye çevir",
  "Yöneticiler için raporu özetle"
];

const fontSizes = ['0.85rem', '0.95rem', '1.05rem', '1.1rem'];

const loadingSteps = [
  {
    text: "Girdi semantiği analiz ediliyor ve nöral haritalama yapılıyor...",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#3A86FF" strokeWidth="2" strokeDasharray="4 4" className="animate-spin" />
        <path d="M12 8V12L15 15" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    text: "Sektörel veri setleri ve bağlamsal parametreler enjekte ediliyor...",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="#8338EC" strokeWidth="2" />
        <path d="M9 9H15V15H9V9Z" fill="#8338EC" className="animate-pulse" />
      </svg>
    )
  },
  {
    text: "Prompt mimarisi Master Standartlarına göre rafine ediliyor...",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00E5FF" strokeWidth="2" strokeLinejoin="round" />
        <path d="M2 17L12 22L22 17" stroke="#3A86FF" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 12L12 17L22 12" stroke="#3A86FF" strokeWidth="2" opacity="0.5" />
      </svg>
    )
  },
  {
    text: "Kuantum çıktı sentezleniyor, işlem sonlandırılıyor...",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L4 21L12 17L20 21L12 3Z" stroke="#8338EC" strokeWidth="2" strokeLinejoin="round" className="animate-bounce" />
        <circle cx="12" cy="13" r="3" fill="#00E5FF" />
      </svg>
    )
  }
];

const IconChatGPT = <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9" /></svg>;
const IconGemini = <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6" /></svg>;
const IconClaude = <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><rect width="24" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/><text x="50%" y="50%" textAnchor="middle" dy=".35em" fontFamily="Georgia, serif" fontSize="14" fontWeight="bold">C</text></svg>;
const IconPerplexity = <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="12 2 2 7 2 17 12 22 22 17 22 7" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
const IconCopilot = <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M11 2H2v9h9V2zm11 0h-9v9h9V2zm-11 11H2v9h9v-9zm11 0h-9v9h9v-9z" /></svg>;
const IconCopy = <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;

type SpeechWindow = Window & { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any };
type AIPlatformButtonProps = { url: string; icon: ReactNode; name: string; platformClass?: string };

const parsePromptData = (fullText: string) => {
  if (!fullText) return { category: '', promptText: '' };
  const match = fullText.match(/^([^|]*)\|\s*(.*)$/);
  if (match) {
    return { category: match[1].trim(), promptText: match[2].trim() };
  }
  return { category: '', promptText: fullText };
};

const ScrambleText = ({ text, initialDelayMs }: { text: string; initialDelayMs: number }) => {
  const [items, setItems] = useState<{char: string, isScrambled: boolean}[]>([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    let iteration = 0;
    const chars = "01@#$ΣλΠ⌘xX>_";
    let interval: any;
    const delay = isFirstRender.current ? initialDelayMs + 200 : 200;
    isFirstRender.current = false;
    setItems(text.split("").map(() => ({ char: chars[Math.floor(Math.random() * chars.length)], isScrambled: true })));

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setItems(text.split("").map((letter, index) => {
          if (index < iteration) return { char: letter, isScrambled: false };
          if (letter === " ") return { char: " ", isScrambled: false };
          return { char: chars[Math.floor(Math.random() * chars.length)], isScrambled: true };
        }));
        if (iteration >= text.length) clearInterval(interval);
        iteration += Math.max(0.6, text.length / 25);
      }, 50);
    }, delay);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [text, initialDelayMs]);

  return (
    <>
      {items.map((item, i) => (
        <span key={i} style={{ color: item.isScrambled ? '#00E5FF' : 'inherit', textShadow: item.isScrambled ? '0 0 8px rgba(0, 229, 255, 0.6)' : 'none', transition: 'color 0.2s ease' }}>{item.char}</span>
      ))}
    </>
  );
};

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0); 
  const [isListening, setIsListening] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Metni Kopyala');
  const [slots, setSlots] = useState<any[]>([]);
  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [isVisual, setIsVisual] = useState(false); 
  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);

  const howItWorksRef = useRef<HTMLDivElement>(null);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getMobileRandomPos = () => {
    const r = Math.random();
    if (r < 0.33) return { top: '10%', left: '10%', right: 'auto', transform: 'none' };
    if (r < 0.66) return { top: '25%', right: '10%', left: 'auto', transform: 'none' };
    return { top: '18%', left: '50%', transform: 'translateX(-50%)' };
  };

  const getRandomPos = (slotId: number) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const r1 = Math.random();
    const r2 = Math.random();
    
    if (isMobile) {
      if (slotId === 0) {
        const mPos = getMobileRandomPos();
        return { ...mPos, maxWidth: '80vw', width: 'fit-content' };
      }
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
    let interval: any;
    if (loading && !result) {
      setLoadingStep(0);
      interval = setInterval(() => { setLoadingStep((prev) => (prev + 1) % loadingSteps.length); }, 1800);
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

  const handleAnimationIteration = (slotId: number) => {
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
        done = readerDone; if (value) { const chunk = decoder.decode(value, { stream: true }); fullContent += chunk; setResult((prev) => prev + chunk); if (fullContent.includes("text")) { setIsVisual(true); } }
      }
    } catch (err: any) { alert("Hata Oluştu: " + err.message); setInput(currentInput); setSubmittedPrompt(''); }
    finally { setLoading(false); }
  };

  const handleVoiceTyping = () => {
    if (!('webkitSpeechRecognition' in window)) { alert("Tarayıcınız sesli yazmayı desteklemiyor. Lütfen Chrome veya Safari kullanın."); return; }
    const speechWindow = window as SpeechWindow;
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR'; recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => setInput((prev) => prev + " " + event.results[0][0].transcript);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopyStatus('Kopyalandı! ✓');
    setTimeout(() => setCopyStatus('Metni Kopyala'), 2000);
  };

  const AIPlatformButton = ({ url, icon, name, platformClass }: AIPlatformButtonProps) => {
    const handleRedirect = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      try {
        navigator.clipboard.writeText(result);
        setCopyStatus(name + ' Açılıyor!');
        setTimeout(() => setCopyStatus('Metni Kopyala'), 2000);
      } catch (err) { console.error('Kopyalama hatası:', err); }
      const link = document.createElement('a');
      link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    };
    return (
      <button className={`ai-module-btn ${platformClass}`} onClick={handleRedirect}>
        {icon} <span>{name}</span>
      </button>
    );
  };

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes elegantGlow {
        0%   { box-shadow: 0 0 8px rgba(58, 134, 255, 0.15), inset 0 0 4px rgba(58, 134, 255, 0.05); border-color: rgba(58, 134, 255, 0.2); }
        50%  { box-shadow: 0 0 20px rgba(131, 56, 236, 0.35), inset 0 0 8px rgba(131, 56, 236, 0.15); border-color: rgba(131, 56, 236, 0.45); }
        100% { box-shadow: 0 0 8px rgba(58, 134, 255, 0.15), inset 0 0 4px rgba(58, 134, 255, 0.05); border-color: rgba(58, 134, 255, 0.2); }
      }
      @keyframes perfectBreathing { 
        0% { opacity: 0; filter: blur(5px); transform: translateY(10px); } 
        5% { opacity: 1; filter: blur(0px); transform: translateY(0px); } 
        25% { opacity: 1; filter: blur(0px); transform: translateY(0px); } 
        35% { opacity: 0; filter: blur(10px); transform: translateY(-10px); } 
        100% { opacity: 0; filter: blur(10px); transform: translateY(-10px); } 
      }
      @keyframes pulseTextOrb {
        0% { opacity: 0.6; text-shadow: 0 0 10px rgba(0, 229, 255, 0.3); }
        50% { opacity: 1; text-shadow: 0 0 25px rgba(0, 229, 255, 0.8), 0 0 40px rgba(131, 56, 236, 0.6); }
        100% { opacity: 0.6; text-shadow: 0 0 10px rgba(0, 229, 255, 0.3); }
      }
      @keyframes bounceChevron { 0%, 100% { transform: translateY(0); opacity: 0.3; } 50% { transform: translateY(10px); opacity: 0.8; } }
      @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

      .discovery-trigger { transition: all 0.3s ease; pointer-events: auto; }
      .discovery-trigger:hover { transform: translate(-50%, -52%) scale(1.05) !important; }
      .discovery-trigger .question-mark { animation: pulseTextOrb 3s infinite ease-in-out; }

      .cursor-blink { display: inline-block; width: 8px; height: 1.2em; background-color: #00E5FF; vertical-align: middle; margin-left: 4px; animation: blink 1s step-end infinite; }
      
      .cinematic-text { position: absolute; color: #888888; cursor: pointer; animation: perfectBreathing 24s infinite linear both; text-align: left; line-height: 1.5; font-weight: 300; transition: transform 0.3s ease, filter 0.3s ease; pointer-events: auto; opacity: 0; }
      .cinematic-text:hover { animation-play-state: paused; z-index: 50; }
      .cinematic-text:hover .prompt-category { color: #00E5FF; text-shadow: 0 0 10px rgba(0, 229, 255, 0.5); }
      .cinematic-text:hover .prompt-body { color: #ffffff; opacity: 1; text-shadow: 0 0 10px rgba(255, 255, 255, 0.4); }
      
      .prompt-category { font-family: "Times New Roman", Times, serif; font-size: 1.35em; font-style: italic; color: #ffffff; margin-bottom: 6px; opacity: 0.95; transition: all 0.3s ease; }
      .prompt-body { font-family: inherit; font-size: 0.95em; opacity: 0.75; transition: all 0.3s ease; }
      
      .ai-module-btn { 
        display: flex; align-items: center; gap: 8px; 
        background: rgba(255, 255, 255, 0.04); color: rgba(255, 255, 255, 0.7); 
        border: 1px solid rgba(255, 255, 255, 0.1); padding: 10px 16px; border-radius: 12px; 
        cursor: pointer; font-size: 0.85rem; font-weight: 500; 
        transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1); 
      }
      .ai-module-btn:hover { 
        background: rgba(255, 255, 255, 0.08); color: #fff; transform: translateY(-2px); 
        border-color: rgba(255, 255, 255, 0.3); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
      }
      .btn-chatgpt:hover { border-color: #10a37f !important; color: #10a37f !important; }
      .btn-gemini:hover { border-color: #4285f4 !important; color: #4285f4 !important; }
      .btn-claude:hover { border-color: #d97757 !important; color: #d97757 !important; }
      .btn-perplexity:hover { border-color: #20b2aa !important; color: #20b2aa !important; }
      .btn-copilot:hover { border-color: #3c78d8 !important; color: #3c78d8 !important; }

      .copy-btn-primary { 
        background: #ffffff; color: #000; border: none; padding: 12px 24px; 
        border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s ease;
        display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1);
      }
      .copy-btn-primary:hover { transform: scale(1.02); background: #f0f0f0; }

      .chevron-scroll { animation: bounceChevron 2s infinite ease-in-out; }

      @media (max-width: 768px) {
        .hero-section { margin-top: 48vh !important; }
        .hero-title { font-size: 1.25rem !important; }
        .discovery-trigger { top: 40% !important; } 
        
        /* 🔥 MOBİL INPUT OPTİMİZASYONU 🔥 */
        .main-input { font-size: 0.88rem !important; line-height: 1.4 !important; }
        .main-input::placeholder { font-size: 0.85rem !important; opacity: 0.6; }
        
        .discovery-row { flex-direction: column-reverse !important; gap: 40px !important; }
        .discovery-video-frame { height: 220px !important; min-height: 220px !important; width: 100% !important; border-radius: 16px !important; flex: none !important; }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => { document.head.removeChild(styleSheet); };
  }, []);

  const dynamicPlaceholder = `Ne oluşturmak istiyorsun?\nÖrn: “${typewriterText}${typewriterText.length > 0 ? "”" : ""}`;

  return (
    <>
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
                  const delayMs = parseFloat(slot.delay || '0') * 1000;
                  return (
                    <div key={slot.id} className={`cinematic-text slot-${slot.id}`} onClick={() => setInput(promptText)} onAnimationIteration={() => handleAnimationIteration(slot.id)}
                      style={{ 
                        top: slot.pos.top || 'auto', bottom: slot.pos.bottom || 'auto', left: slot.pos.left || 'auto', right: slot.pos.right || 'auto', 
                        transform: slot.pos.transform || 'none', maxWidth: slot.pos.maxWidth, width: slot.pos.width || 'auto',
                        fontSize: slot.size, animationDelay: slot.delay, display: slot.pos.display || 'block' 
                      }}
                    >
                      {category && <div className="prompt-category">
                        <ScrambleText text={category} initialDelayMs={delayMs} />
                      </div>}
                      <div className="prompt-body">
                        <ScrambleText text={promptText} initialDelayMs={delayMs} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div onClick={scrollToHowItWorks} className="discovery-trigger" style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)' as const, cursor: 'pointer', zIndex: 15, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '5px' }}>
                <div className="question-mark" style={{ fontSize: '3.5rem', fontWeight: '300', color: '#fff', lineHeight: '1' }}>?</div>
                <div style={{ color: '#00E5FF', fontSize: '0.65rem', letterSpacing: '3px', fontWeight: '600' as const, textShadow: '0 0 10px rgba(0, 229, 255, 0.4)' }}>NASIL ÇALIŞIR?</div>
              </div>

              <div style={heroSection} className="hero-section">
                <img src="/logo.png" alt="Logo" style={centerLogo} /> 
                <h2 style={heroTitle}>Fikirlerini Güçlü Promptlara Dönüştür.</h2>
                <p style={heroSub}>Metni yaz. Optimize edilmiş promptu al. Kopyala ve diğer AI araçlarında kullan.</p>
              </div>
            </>
          ) : (
            <div style={resultContainer}>
               <div style={userPromptWrapper}>
                 <div style={userPromptHeader} onClick={() => setIsPromptExpanded(!isPromptExpanded)}>
                   <div style={userPromptTitle}>
                      <span style={{ color: '#00E5FF', marginRight: '8px' }}>✦</span>
                      {isPromptExpanded ? "Senin Promptun" : `Senin Promptun: "${submittedPrompt.length > 45 ? submittedPrompt.slice(0, 45) + '...' : submittedPrompt}"`}
                   </div>
                   <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                     <button className="edit-btn" style={editBtn} onClick={(e) => { e.stopPropagation(); setInput(submittedPrompt); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }} >Düzenle</button>
                     <span style={{ transform: isPromptExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', color: '#888', fontSize: '0.8rem' }}>▼</span>
                   </div>
                 </div>
                 {isPromptExpanded && ( <div style={userPromptBody}>{submittedPrompt}</div> )}
               </div>
               {(!result && loading) ? (
                 <div style={loadingBox}><div style={loadingText}>{loadingSteps[loadingStep].text}</div></div>
               ) : (
                 <div style={aiResponseWrapper}>
                    <div style={aiLabel}>ÜRETİLEN MASTER PROMPT</div>
                    <div style={aiText}>{result}{loading && <span className="cursor-blink"></span>}</div>
                    
                    {!loading && result && (
                      <div style={{ marginTop: '40px', paddingTop: '25px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                          <div style={{ flex: 1, minWidth: '300px' }}>
                            <div style={{ fontSize: '0.7rem', color: '#555', letterSpacing: '2px', marginBottom: '15px', fontWeight: 'bold' }}>ÜRETİMİ BAŞLAT:</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                              <AIPlatformButton url="https://chatgpt.com" icon={IconChatGPT} name="ChatGPT" platformClass="btn-chatgpt" />
                              <AIPlatformButton url="https://gemini.google.com" icon={IconGemini} name="Gemini" platformClass="btn-gemini" />
                              <AIPlatformButton url="https://claude.ai" icon={IconClaude} name="Claude" platformClass="btn-claude" />
                              <AIPlatformButton url="https://www.perplexity.ai" icon={IconPerplexity} name="Perplexity" platformClass="btn-perplexity" />
                              <AIPlatformButton url="https://copilot.microsoft.com" icon={IconCopilot} name="Copilot" platformClass="btn-copilot" />
                            </div>
                          </div>
                          <button onClick={handleCopy} className="copy-btn-primary"> {IconCopy} {copyStatus} </button>
                        </div>
                      </div>
                    )}
                 </div>
               )}
            </div>
          )}
        </div>

        <div style={bottomArea}>
          <div style={glowWrapper}>
            <div style={inputBoxInner}>
              <textarea className="main-input" style={inputField} placeholder={dynamicPlaceholder} rows={2} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }}} />
              <div style={actionButtons}>
                <button onClick={handleVoiceTyping} style={iconButton} className={isListening ? "pulse-mic" : ""}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg></button>
                <button onClick={handleGenerate} disabled={loading || !input.trim()} style={sendButton}> {loading ? '⏳' : '↑'} </button>
              </div>
            </div>
          </div>
        </div>

        <div ref={howItWorksRef} style={discoverySection}>
           <div className="discovery-row" style={discoveryRow}>
              <div className="discovery-video-frame" style={videoFrame} onClick={() => setIsVideoFullscreen(true)}>
                 <div style={videoOverlay}><div style={{ color: '#8338EC', fontSize: '3rem' }}>▶</div></div>
              </div>
              <div style={{ flex: 1, minWidth: '320px', position: 'relative' as const }}>
                 <h3 style={discoveryTitle}>Promptlab Sizin İçin Ne Yapar?</h3>
                 <div style={stepCard}><div style={stepIconBox}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div><div><h4 style={stepLabel}>01 - Fikrini Özgürce Yaz</h4><p style={stepText}>Sadece ne istediğini doğal bir dille anlat.</p></div></div>
                 <div style={stepCard}><div style={stepIconBox}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8338EC" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div><div><h4 style={stepLabel}>02 - Akıllı Dönüşümü İzle</h4><p style={stepText}>Motorumuz saniyeler içinde cümleni analiz eder.</p></div></div>
                 <div style={stepCard}><div style={stepIconBox}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></div><div><h4 style={stepLabel}>03 - AI Aracını Seç ve Başla</h4><p style={stepText}>Dilediğin AI aracını seçtiğin an metnin kopyalanır.</p></div></div>
                 <div className="chevron-scroll" style={mobileChevron}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div>
              </div>
           </div>
        </div>

        {isVideoFullscreen && (
          <div style={fullscreenOverlay} onClick={() => setIsVideoFullscreen(false)}>
             <button style={closeFullscreenBtn} onClick={() => setIsVideoFullscreen(false)}>✕</button>
             <div style={fullscreenVideoContainer} onClick={(e) => e.stopPropagation()}><div style={{ color: '#fff' }}>REHBER VİDEOSU</div></div>
          </div>
        )}
      </main>
    </>
  );
}

// 🔥 STİLLER (TS-SAFE) 🔥
const container = { backgroundColor: '#050505', minHeight: '100vh', color: '#ECECEC', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' as const, position: 'relative' as const, overflowX: 'hidden' as const };
const topBar = { padding: '20px 25px', position: 'absolute' as const, top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const logoWrapper = { opacity: 0.8, cursor: 'pointer' };
const miniLogo = { height: '20px', width: 'auto' };
const backButton = { backgroundColor: 'transparent', color: '#fff', border: '1px solid #333', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' };
const contentArea = { minHeight: '100vh', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' as const, paddingBottom: '150px' };
const floatingContainer = { position: 'absolute' as const, top: '70px', left: 0, right: 0, height: '70vh', pointerEvents: 'none' as const, zIndex: 5, overflow: 'hidden' as const };
const heroSection = { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', textAlign: 'center' as const, zIndex: 10, marginTop: '60vh', width: '100%', gap: '15px' };
const centerLogo = { width: '100%', maxWidth: '180px', height: 'auto' };
const heroTitle = { fontSize: '2.2rem', fontWeight: '600' as const, color: '#fff', letterSpacing: '-0.5px', margin: 0 };
const heroSub = { color: '#888', fontSize: '1rem', maxWidth: '550px', padding: '0 20px', lineHeight: '1.5', margin: 0 };
const resultContainer = { maxWidth: '900px', width: '100%', marginTop: '80px', marginBottom: '160px', zIndex: 10, padding: '0 20px' };
const userPromptWrapper = { width: '100%', backgroundColor: '#0f0f0f', borderRadius: '12px', border: '1px solid #222', marginBottom: '20px', overflow: 'hidden' as const };
const userPromptHeader = { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: '#141414' };
const userPromptTitle = { fontSize: '0.9rem', color: '#ccc', fontWeight: '500' as const, whiteSpace: 'nowrap' as const, overflow: 'hidden' as const, textOverflow: 'ellipsis' as const, maxWidth: '75%' };
const editBtn = { background: 'rgba(131, 56, 236, 0.1)', color: '#00E5FF', border: '1px solid rgba(131, 56, 236, 0.4)', padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' as const };
const userPromptBody = { padding: '20px', borderTop: '1px solid #222', fontSize: '0.95rem', color: '#aaa', lineHeight: '1.6', whiteSpace: 'pre-wrap' as const };
const aiResponseWrapper = { width: '100%', backgroundColor: '#0a0a0a', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 0 30px rgba(0,0,0,0.5)' };
const aiLabel = { fontSize: '0.7rem', fontWeight: '800' as const, color: '#00E5FF', marginBottom: '25px', letterSpacing: '3px' };
const aiText = { fontSize: '1.05rem', lineHeight: '1.7', color: '#E0E0E0', whiteSpace: 'pre-wrap' as const, fontFamily: 'monospace' };
const bottomArea = { position: 'fixed' as const, bottom: 0, left: 0, right: 0, padding: '30px 20px 40px 20px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', zIndex: 50, pointerEvents: 'none' as const };
const glowWrapper = { position: 'relative' as const, width: '100%', maxWidth: '680px', zIndex: 2, pointerEvents: 'auto' as const };
const inputBoxInner = { backgroundColor: '#0a0a0a', borderRadius: '40px', border: '1px solid rgba(58, 134, 255, 0.2)', animation: 'elegantGlow 8s infinite alternate', display: 'flex', alignItems: 'center', padding: '6px 10px 6px 18px' };
const inputField = { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1rem', outline: 'none', resize: 'none' as const, padding: '8px 0', maxHeight: '150px' };
const actionButtons = { display: 'flex', alignItems: 'center', gap: '6px' };
const iconButton = { background: 'none', border: 'none', cursor: 'pointer' };
const sendButton = { width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: '#fff', color: '#000', fontWeight: 'bold' as const, cursor: 'pointer' };
const loadingBox = { width: '100%', maxWidth: '600px', background: 'rgba(10, 10, 10, 0.85)', padding: '40px 20px', textAlign: 'center' as const };
const loadingText = { fontSize: '0.95rem', color: '#ECECEC', fontFamily: 'monospace' };

// 🔥 DISCOVERY SECTION STYLES 🔥
const discoverySection = { minHeight: '100vh', backgroundColor: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 40px', position: 'relative' as const, borderTop: '1px solid #1a1a1a', zIndex: 10 };
const discoveryRow = { maxWidth: '1100px', width: '100%', display: 'flex', gap: '80px', alignItems: 'center' };
const videoFrame = { flex: 1, height: '400px', background: '#000', borderRadius: '24px', border: '1px solid rgba(131, 56, 236, 0.15)', position: 'relative' as const, overflow: 'hidden' as const, cursor: 'pointer' };
const videoOverlay = { position: 'absolute' as const, inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' };
const discoveryTitle = { fontSize: '2.2rem', fontWeight: '700' as const, color: '#fff', marginBottom: '40px', lineHeight: '1.2' };
const stepCard = { display: 'flex', gap: '20px', marginBottom: '35px' };
const stepIconBox = { minWidth: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const stepLabel = { fontSize: '1.1rem', fontWeight: '600' as const, color: '#fff', marginBottom: '6px' };
const stepText = { fontSize: '0.9rem', color: '#777' };
const mobileChevron = { position: 'absolute' as const, bottom: '-40px', right: '0', pointerEvents: 'none' as const };

// 🔥 FULLSCREEN OVERLAY 🔥
const fullscreenOverlay = { position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.96)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' };
const closeFullscreenBtn = { position: 'absolute' as const, top: '30px', right: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer' };
const fullscreenVideoContainer = { width: '90%', maxWidth: '1000px', aspectRatio: '16/9' as const, background: '#050505', border: '1px solid rgba(0, 229, 255, 0.2)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
