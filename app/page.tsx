'use client';

import { useState, useEffect, useRef, type MouseEvent, type ReactNode } from 'react';

// 🔥 GÜNCELLENMİŞ, YÜKSEK HACİMLİ VE GERÇEKÇİ PROMPT HAVUZU 🔥
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
  "Instagram için etkileşim odaklı post yaz",
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

// 🔥 ŞIK YÜKLEME İKONLARI VE MESAJLARI 🔥
const loadingSteps = [
  {
    text: "Girdi semantiği analiz ediliyor ve nöral haritalama yapılıyor...",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="9" stroke="#3A86FF" strokeWidth="2" strokeDasharray="4 4" className="animate-spin" />
        <path d="M12 8V12L15 15" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    text: "Sektörel veri setleri ve bağlamsal parametreler enjekte ediliyor...",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke="#8338EC" strokeWidth="2" />
        <path d="M9 9H15V15H9V9Z" fill="#8338EC" className="animate-pulse" />
      </svg>
    )
  },
  {
    text: "Prompt mimarisi Master Standartlarına göre rafine ediliyor...",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00E5FF" strokeWidth="2" strokeLinejoin="round" />
        <path d="M2 17L12 22L22 17" stroke="#3A86FF" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 12L12 17L22 12" stroke="#3A86FF" strokeWidth="2" opacity="0.5" />
      </svg>
    )
  },
  {
    text: "Kuantum çıktı sentezleniyor, işlem sonlandırılıyor...",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L4 21L12 17L20 21L12 3Z" stroke="#8338EC" strokeWidth="2" strokeLinejoin="round" className="animate-bounce" />
        <circle cx="12" cy="13" r="3" fill="#00E5FF" />
      </svg>
    )
  }
];

const parsePromptData = (fullText: string) => {
  if (!fullText) return { category: '', promptText: '' };
  const match = fullText.match(/^([^|]*)\|\s*(.*)$/);
  if (match) {
    return { category: match[1].trim(), promptText: match[2].trim() };
  }
  return { category: '', promptText: fullText };
};

// İkonlar (Üretim Sonu Platformlar)
const IconChatGPT = <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9" /></svg>;
const IconGemini = <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6" /></svg>;
const IconClaude = <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect width="24" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/><text x="50%" y="50%" textAnchor="middle" dy=".35em" fontFamily="Georgia, serif" fontSize="14" fontWeight="bold">C</text></svg>;
const IconPerplexity = <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="12 2 2 7 2 17 12 22 22 17 22 7" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
const IconCopilot = <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11 2H2v9h9V2zm11 0h-9v9h9V2zm-11 11H2v9h9v-9zm11 0h-9v9h9v-9z" /></svg>;
const IconMidjourney = <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M2 20h20v2H2v-2zm10-18l8 16H4l8-16z" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
const IconLeonardo = <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 2v16h12v4H2V2h4z" /><circle cx="16" cy="8" r="3" /></svg>;
const IconAdobe = <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="14.5 2 22 22 18 22 14.5 12 11 22 7 22" /><polygon points="9.5 2 2 22 6 22 9.5 12" /></svg>;
const IconCanva = <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M15 8a4 4 0 0 0-6 0 4 4 0 0 0 0 6 4 4 0 0 0 6 0"/></svg>;
const IconCopy = <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;

type SpeechWindow = Window & { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any };
type AIPlatformButtonProps = { url: string; icon: ReactNode; name: string };

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

  const getRandomPos = (slotId: number) => {
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

  const AIPlatformButton = ({ url, icon, name }: AIPlatformButtonProps) => {
    const handleRedirect = (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      try {
        navigator.clipboard.writeText(result);
        setCopyStatus(name + ' Açılıyor!');
        setTimeout(() => setCopyStatus('Metni Kopyala'), 2000);
      } catch (err) {
        console.error('Kopyalama hatası:', err);
      }
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    return (
      <button className="ai-brand-btn" onClick={handleRedirect}>
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
      @keyframes perfectBreathing { 0% { opacity: 0; filter: blur(5px); transform: translateY(10px); } 5% { opacity: 1; filter: blur(0px); transform: translateY(0px); } 25% { opacity: 1; filter: blur(0px); transform: translateY(0px); } 35% { opacity: 0; filter: blur(10px); transform: translateY(-10px); } 100% { opacity: 0; filter: blur(10px); transform: translateY(-10px); } }
      @keyframes loadingPulse { 0% { opacity: 0.6; transform: scale(0.98); } 50% { opacity: 1; transform: scale(1); } 100% { opacity: 0.6; transform: scale(0.98); } }
      @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      @keyframes glowingBorder { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
      @keyframes starPulse { 0% { filter: drop-shadow(0 0 2px rgba(0, 229, 255, 0.2)) drop-shadow(0 0 8px rgba(131, 56, 236, 0.2)); } 50% { filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.6)) drop-shadow(0 0 16px rgba(131, 56, 236, 0.5)); } 100% { filter: drop-shadow(0 0 2px rgba(0, 229, 255, 0.2)) drop-shadow(0 0 8px rgba(131, 56, 236, 0.2)); } }
      .glowing-logo { animation: starPulse 3s infinite alternate ease-in-out; }
      .loading-box { width: 100%; max-width: 600px; background: rgba(10, 10, 10, 0.85); border: 1px solid rgba(131, 56, 236, 0.3); border-radius: 16px; padding: 40px 20px; text-align: center; box-shadow: 0 0 40px rgba(58, 134, 255, 0.1); transition: all 0.5s ease; }
      .loading-text { font-size: 0.95rem; color: #ECECEC; font-weight: 400; margin-top: 20px; letter-spacing: 0.8px; opacity: 0.8; font-family: monospace; }
      .cursor-blink { display: inline-block; width: 8px; height: 1.2em; background-color: #00E5FF; vertical-align: middle; margin-left: 4px; animation: blink 1s step-end infinite; }
      .cinematic-text { position: absolute; color: #888888; cursor: pointer; animation: perfectBreathing 24s infinite linear both; text-align: left; line-height: 1.5; font-weight: 300; transition: transform 0.3s ease, filter 0.3s ease; pointer-events: auto; opacity: 0; }
      .cinematic-text:hover { animation-play-state: paused; z-index: 50; }
      .cinematic-text:hover .prompt-category { color: #00E5FF; text-shadow: 0 0 10px rgba(0, 229, 255, 0.5); }
      .cinematic-text:hover .prompt-body { color: #ffffff; opacity: 1; text-shadow: 0 0 10px rgba(255, 255, 255, 0.4); }
      .prompt-category { font-family: "Times New Roman", Times, serif; font-size: 1.35em; font-style: italic; color: #ffffff; margin-bottom: 6px; letter-spacing: 0.5px; opacity: 0.95; transition: color 0.3s ease, text-shadow 0.3s ease; }
      .prompt-body { font-family: inherit; font-size: 0.95em; opacity: 0.75; transition: color 0.3s ease, opacity 0.3s ease, text-shadow 0.3s ease; }
      .pulse-mic { animation: pulse 1.5s infinite; color: #00E5FF !important; }
      @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
      .edit-btn:hover { background: rgba(131, 56, 236, 0.25) !important; color: #fff !important; }
      .ai-brand-btn { display: inline-flex; align-items: center; gap: 8px; background: rgba(20, 20, 20, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); color: #d1d1d1; padding: 8px 15px; border-radius: 10px; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); font-family: inherit; backdrop-filter: blur(10px); outline: none; }
      .ai-brand-btn:hover { background: rgba(58, 134, 255, 0.1); border-color: rgba(0, 229, 255, 0.5); color: #fff; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0, 229, 255, 0.2); }
      @media (max-width: 768px) {
        .hero-section { margin-top: 42vh !important; gap: 10px !important; }
        .hero-title { font-size: 1.55rem !important; line-height: 1.2 !important; padding: 0 10px !important; margin-bottom: 0 !important; }
        .hero-sub { font-size: 0.85rem !important; padding: 0 15px !important; margin-top: 0 !important; line-height: 1.5 !important; }
        .cinematic-text { font-size: 0.85rem !important; margin: 0 auto !important; }
        .slot-2, .slot-3 { display: none !important; }
        .floor-glow { opacity: 0.2 !important; height: 50px !important; bottom: -5px !important;}
        .main-input { font-size: 16px !important; white-space: pre-wrap !important; overflow-y: auto !important; line-height: 1.4 !important; }
        .main-input::placeholder { font-size: 14px !important; }
        .input-box-inner { padding: 12px 14px 12px 18px !important; border-radius: 28px !important; }
        .ai-brand-btn { font-size: 0.8rem; padding: 8px 12px; }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => { document.head.removeChild(styleSheet); };
  }, []);

  const dynamicPlaceholder = `Ne oluşturmak istiyorsun?\nÖrn: “${typewriterText}${typewriterText.length > 0 ? "”" : ""}`;

  return (
    <main style={container}>
      <div style={topBar}>
        <div style={logoWrapper} onClick={handleReset}>
          <img src="/logo.png" alt="Logo" className="glowing-logo" style={miniLogo} />
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
                    style={{ top: slot.pos.top || 'auto', bottom: slot.pos.bottom || 'auto', left: slot.pos.left || 'auto', right: slot.pos.right || 'auto', maxWidth: slot.pos.maxWidth, fontSize: slot.size, animationDelay: slot.delay, display: slot.pos.display || 'block' }}
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
            <div style={heroSection} className="hero-section">
              <div style={logoFrame}> 
                <img src="/logo.png" alt="Logo" className="glowing-logo" style={centerLogo} /> 
              </div>
              <h2 style={heroTitle} className="hero-title">Fikirlerini Güçlü Promptlara Dönüştür.</h2>
              <p style={heroSub} className="hero-sub">Metni yaz. Optimize edilmiş promptu al. Kopyala ve diğer AI araçlarında kullan.</p>
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
               <div className="flex flex-col items-center justify-center mt-10">
                 {/* 🔥 YENİ NESİL LOADER 🔥 */}
                 <div className="loading-box">
                   <div className="flex justify-center mb-4 transition-all duration-500">
                     {loadingSteps[loadingStep].icon}
                   </div>
                   <div className="loading-text">
                     {loadingSteps[loadingStep].text}
                   </div>
                 </div>
               </div>
             ) : (
               <div style={aiResponseWrapper}>
                  <div style={aiLabel}>ÜRETİLEN MASTER PROMPT</div>
                  <div style={aiText}>
                    {result}
                    {loading && <span className="cursor-blink"></span>}
                  </div>
                  
                  {!loading && result && (
                    <div style={{ marginTop: '35px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#888', letterSpacing: '0.5px' }}>✨ ÜRETİMİ BAŞLAT:</span>
                        <button onClick={handleCopy} style={copyBtn}> {IconCopy} {copyStatus} </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {!isVisual ? (
                          <>
                            <AIPlatformButton url="https://chatgpt.com" icon={IconChatGPT} name="ChatGPT" />
                            <AIPlatformButton url="https://gemini.google.com" icon={IconGemini} name="Gemini" />
                            <AIPlatformButton url="https://claude.ai" icon={IconClaude} name="Claude" />
                            <AIPlatformButton url="https://www.perplexity.ai" icon={IconPerplexity} name="Perplexity" />
                            <AIPlatformButton url="https://copilot.microsoft.com" icon={IconCopilot} name="Copilot" />
                          </>
                        ) : (
                          <>
                            <AIPlatformButton url="https://discord.com/channels/@me" icon={IconMidjourney} name="Midjourney" />
                            <AIPlatformButton url="https://chatgpt.com" icon={IconChatGPT} name="DALL-E 3" />
                            <AIPlatformButton url="https://leonardo.ai" icon={IconLeonardo} name="Leonardo" />
                            <AIPlatformButton url="https://firefly.adobe.com" icon={IconAdobe} name="Adobe Firefly" />
                            <AIPlatformButton url="https://www.canva.com" icon={IconCanva} name="Canva" />
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
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
const container = { backgroundColor: '#050505', minHeight: '100vh', color: '#ECECEC', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' } as const;
const topBar = { padding: '20px 25px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' } as const;
const logoWrapper = { display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.8, cursor: 'pointer' } as const;
const miniLogo = { height: '20px', width: 'auto', objectFit: 'contain' } as const;
const backButton = { backgroundColor: 'transparent', color: '#fff', border: '1px solid #333', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' } as const;
const contentArea = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', paddingBottom: '100px' } as const;
const floatingContainer = { position: 'absolute', top: '70px', left: 0, right: 0, height: '70vh', pointerEvents: 'none', zIndex: 5, overflow: 'hidden' } as const;
const heroSection = { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10, marginTop: '60vh', width: '100%', gap: '15px', height: 'auto', minHeight: 'min-content', pointerEvents: 'none' } as const;
const logoFrame = { display: 'flex', alignItems: 'center', justifyContent: 'center' } as const;
const centerLogo = { width: '100%', maxWidth: '180px', height: 'auto', display: 'block', objectFit: 'contain' } as const;
const heroTitle = { fontSize: '2.2rem', fontWeight: '600', color: '#fff', letterSpacing: '-0.5px', margin: 0 } as const;
const heroSub = { color: '#888', fontSize: '1rem', maxWidth: '550px', padding: '0 20px', lineHeight: '1.5', margin: 0 } as const;
const resultContainer = { maxWidth: '850px', width: '100%', marginTop: '80px', marginBottom: '160px', zIndex: 10, padding: '0 20px' } as const;
const userPromptWrapper = { width: '100%', backgroundColor: '#0f0f0f', borderRadius: '12px', border: '1px solid #222', marginBottom: '20px', overflow: 'hidden', transition: 'all 0.3s ease' } as const;
const userPromptHeader = { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: '#141414' } as const;
const userPromptTitle = { fontSize: '0.9rem', color: '#ccc', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '75%' } as const;
const editBtn = { background: 'rgba(131, 56, 236, 0.1)', color: '#00E5FF', border: '1px solid rgba(131, 56, 236, 0.4)', padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s ease' } as const;
const userPromptBody = { padding: '20px', borderTop: '1px solid #222', fontSize: '0.95rem', color: '#aaa', lineHeight: '1.6', whiteSpace: 'pre-wrap' } as const;
const aiResponseWrapper = { width: '100%', backgroundColor: '#0a0a0a', padding: '25px', borderRadius: '16px', border: '1px solid rgba(131, 56, 236, 0.3)', boxShadow: '0 0 20px rgba(58, 134, 255, 0.15)' } as const;
const aiLabel = { fontSize: '0.75rem', fontWeight: '700', color: '#00E5FF', marginBottom: '20px', letterSpacing: '2px' } as const;
const aiText = { fontSize: '1rem', lineHeight: '1.6', color: '#E0E0E0', whiteSpace: 'pre-wrap', fontFamily: 'monospace', opacity: 0.9 } as const;
const copyBtn = { display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', transition: 'all 0.2s ease' } as const;
const bottomArea = { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '30px 20px 40px 20px', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20, pointerEvents: 'none' } as const;
const cyberGradient = 'linear-gradient(90deg, #3A86FF, #8338EC, #00E5FF, #8338EC, #3A86FF)';
const floorGlow = { position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', width: '50vw', maxWidth: '600px', height: '60px', background: cyberGradient, backgroundSize: '200% 100%', filter: 'blur(45px)', opacity: 0.25, zIndex: 1, pointerEvents: 'none', animation: 'glowingBorder 15s linear infinite' } as const;
const glowWrapper = { position: 'relative', width: '100%', maxWidth: '680px', zIndex: 2, pointerEvents: 'auto' } as const;
const inputBoxInner = { backgroundColor: '#0a0a0a', borderRadius: '40px', border: '1px solid rgba(58, 134, 255, 0.2)', animation: 'elegantGlow 8s infinite alternate', display: 'flex', alignItems: 'center', padding: '6px 10px 6px 18px', width: '100%', height: '100%' } as const;
const inputField = { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1rem', outline: 'none', resize: 'none', padding: '8px 0', maxHeight: '150px', fontFamily: 'inherit' } as const;
const actionButtons = { display: 'flex', alignItems: 'center', gap: '6px' } as const;
const iconButton = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' } as const;
const sendButton = { width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: '#fff', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', transition: 'transform 0.2s ease', fontSize: '1.2rem' } as const;
