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
  { text: "Girdi semantiği analiz ediliyor...", icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#3A86FF" strokeWidth="2" strokeDasharray="4 4" className="animate-spin" /></svg> },
  { text: "Veri setleri enjekte ediliyor...", icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#8338EC" strokeWidth="2" /></svg> },
  { text: "Prompt mimarisi rafine ediliyor...", icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00E5FF" strokeWidth="2" /></svg> },
  { text: "Kuantum çıktı sentezleniyor...", icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M12 3L4 21L12 17L20 21L12 3Z" stroke="#8338EC" strokeWidth="2" /></svg> }
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
  if (match) { return { category: match[1].trim(), promptText: match[2].trim() }; }
  return { category: '', promptText: fullText };
};

// 🔥 HATA VEREN ANİMASYON DÜZELTİLDİ (useRef GERİ GELDİ) 🔥
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
  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

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
    if (!isDeleting && typewriterText === currentFullText) { setTimeout(() => setIsDeleting(true), 2500); return; }
    else if (isDeleting && typewriterText === '') { setIsDeleting(false); setTypewriterIndex((p) => (p + 1) % typewriterExamples.length); return; }
    const timeout = setTimeout(() => { setTypewriterText((p) => isDeleting ? p.slice(0, -1) : currentFullText.slice(0, p.length + 1)); }, typingSpeed);
    return () => clearTimeout(timeout);
  }, [typewriterText, isDeleting, typewriterIndex]);

  useEffect(() => {
    const shuffled = [...allPrompts].sort(() => 0.5 - Math.random());
    setSlots([
      { id: 0, text: shuffled[0], pos: getRandomPos(0), size: fontSizes[2], delay: '0s' },
      { id: 1, text: shuffled[1], pos: getRandomPos(1), size: fontSizes[1], delay: '6s' },
      { id: 2, text: shuffled[2], pos: getRandomPos(2), size: fontSizes[3], delay: '12s' },
      { id: 3, text: shuffled[3], pos: getRandomPos(3), size: fontSizes[0], delay: '18s' },
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
    setResult(''); setInput(''); setSubmittedPrompt(''); setIsPromptExpanded(false);
  };

  const handleGenerate = async () => {
    if (!input.trim() || loading) return;
    setLoading(true); setSubmittedPrompt(input); setIsPromptExpanded(false); setResult(''); 
    const currentInput = input; setInput(''); 
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userInput: currentInput }) });
      if (!res.body) return;
      const reader = res.body.getReader(); const decoder = new TextDecoder();
      let done = false; while (!done) { const { value, done: d } = await reader.read(); done = d; if (value) setResult((p) => p + decoder.decode(value)); }
    } catch (e) { alert("Hata oluştu."); } finally { setLoading(false); }
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

  const AIPlatformButton = ({ url, icon, name, platformClass }: AIPlatformButtonProps) => (
    <button className={`ai-brand-btn ${platformClass}`} onClick={() => { navigator.clipboard.writeText(result); window.open(url, '_blank'); }}>
      {icon} <span>{name}</span>
    </button>
  );

  return (
    <main style={container}>
      <div style={contentArea}>
        {!submittedPrompt ? (
          <>
            <div style={floatingContainer}>
              {slots.map((slot) => {
                const { category, promptText } = parsePromptData(slot.text);
                const delayMs = parseFloat(slot.delay || '0') * 1000;
                return (
                  <div key={slot.id} className={`cinematic-text slot-${slot.id}`} style={{ ...slot.pos, position: 'absolute' as const, fontSize: slot.size, animationDelay: slot.delay, display: slot.pos.display || 'block' }} onClick={() => setInput(promptText)} onAnimationIteration={() => handleAnimationIteration(slot.id)}>
                    {category && <div className="prompt-category" style={pCat}><ScrambleText text={category} initialDelayMs={delayMs} /></div>}
                    <div className="prompt-body" style={pBody}><ScrambleText text={promptText} initialDelayMs={delayMs} /></div>
                  </div>
                );
              })}
            </div>
            
            {/* 🔥 ORİJİNAL LOGO VE BOŞLUK (60vh) GERİ GELDİ 🔥 */}
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
                 <div style={userPromptTitle}> <span style={{ color: '#00E5FF', marginRight: '8px' }}>✦</span> Senin Promptun: "{submittedPrompt.slice(0, 35)}..." </div>
                 <div style={{ display: 'flex', gap: '10px' }}>
                   <button onClick={(e) => { e.stopPropagation(); handleReset(); }} style={newBtn}>+ Yeni</button>
                   <button onClick={(e) => { e.stopPropagation(); setInput(submittedPrompt); setSubmittedPrompt(''); }} style={editBtn}>Düzenle</button>
                 </div>
               </div>
               {isPromptExpanded && <div style={userPromptBody}>{submittedPrompt}</div>}
             </div>
             
             {loading && !result ? (
               <div style={loadingBox}><div style={loadingText}>{loadingSteps[loadingStep].text}</div></div>
             ) : (
               <div style={aiResponseWrapper}>
                  <div style={aiLabel}>ÜRETİLEN MASTER PROMPT</div>
                  <div style={aiText}>{result}{loading && <span className="cursor-blink"></span>}</div>
                  
                  {!loading && result && (
                    <div style={actionRow}>
                      <div style={{ flex: 1, minWidth: '300px' }}>
                        <div style={labelStart}>✨ ÜRETİMİ BAŞLAT:</div>
                        <div style={btnGrid}>
                          <AIPlatformButton url="https://chatgpt.com" icon={IconChatGPT} name="ChatGPT" platformClass="btn-chatgpt" />
                          <AIPlatformButton url="https://gemini.google.com" icon={IconGemini} name="Gemini" platformClass="btn-gemini" />
                          <AIPlatformButton url="https://claude.ai" icon={IconClaude} name="Claude" platformClass="btn-claude" />
                          <AIPlatformButton url="https://www.perplexity.ai" icon={IconPerplexity} name="Perplexity" platformClass="btn-perplexity" />
                          <AIPlatformButton url="https://copilot.microsoft.com" icon={IconCopilot} name="Copilot" platformClass="btn-copilot" />
                        </div>
                      </div>
                      <button onClick={() => { navigator.clipboard.writeText(result); setCopyStatus('Kopyalandı!'); setTimeout(() => setCopyStatus('Metni Kopyala'), 2000); }} style={copyBtnPrimary}> {IconCopy} {copyStatus} </button>
                    </div>
                  )}
               </div>
             )}
          </div>
        )}
      </div>

      {/* 🔥 ORİJİNAL ALT IŞIK (floorGlow) VE INPUT YAPISI GERİ GELDİ 🔥 */}
      <div style={bottomArea}>
        <div className="floor-glow" style={floorGlow}></div>
        <div style={glowWrapper}>
          <div className="input-box-inner" style={inputBoxInner}>
            <textarea className="main-input" style={inputField} placeholder={`Ne oluşturmak istiyorsun?\nÖrn: “${typewriterText}”`} rows={2} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }}} />
            <div style={actionButtons}>
              <button onClick={handleVoiceTyping} style={iconButton} className={isListening ? "pulse-mic" : ""}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg></button>
              <button onClick={handleGenerate} disabled={loading || !input.trim()} style={sendButton}> {loading ? '⏳' : '↑'} </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
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
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        .glowing-logo { filter: drop-shadow(0 0 2px rgba(0, 229, 255, 0.2)); transition: filter 0.3s ease; }
        .cinematic-text { position: absolute; color: #888888; cursor: pointer; animation: perfectBreathing 24s infinite linear both; text-align: left; line-height: 1.5; font-weight: 300; transition: transform 0.3s ease, filter 0.3s ease; pointer-events: auto; opacity: 0; }
        .cinematic-text:hover { animation-play-state: paused; z-index: 50; }
        .cinematic-text:hover .prompt-category { color: #00E5FF; text-shadow: 0 0 10px rgba(0, 229, 255, 0.5); }
        .cinematic-text:hover .prompt-body { color: #ffffff; opacity: 1; text-shadow: 0 0 10px rgba(255, 255, 255, 0.4); }
        
        .cursor-blink { display: inline-block; width: 8px; height: 1.2em; background-color: #00E5FF; vertical-align: middle; margin-left: 4px; animation: blink 1s step-end infinite; }
        
        .ai-brand-btn { background: transparent; color: #888; border: 1px solid transparent; padding: 8px 12px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; transition: all 0.3s ease; }
        .ai-brand-btn:hover { color: #fff; transform: translateY(-3px) scale(1.02); background: rgba(255,255,255,0.05); }
        .btn-chatgpt:hover { border-color: #10a37f !important; background: rgba(16, 163, 127, 0.1) !important; box-shadow: 0 0 20px rgba(16, 163, 127, 0.2) !important; }
        .btn-gemini:hover { border-color: #4285f4 !important; background: rgba(66, 133, 244, 0.1) !important; box-shadow: 0 0 20px rgba(66, 133, 244, 0.2) !important; }
        .btn-claude:hover { border-color: #d97757 !important; background: rgba(217, 119, 87, 0.1) !important; box-shadow: 0 0 20px rgba(217, 119, 87, 0.2) !important; }
        .btn-perplexity:hover { border-color: #20b2aa !important; background: rgba(32, 178, 170, 0.1) !important; box-shadow: 0 0 20px rgba(32, 178, 170, 0.2) !important; }
        .btn-copilot:hover { border-color: #3c78d8 !important; background: rgba(60, 120, 216, 0.1) !important; box-shadow: 0 0 20px rgba(60, 120, 216, 0.2) !important; }
        
        @media (max-width: 768px) { 
          .hero-section { margin-top: 52vh !important; } 
          .hero-title { font-size: 1.25rem !important; } 
          .hero-sub { font-size: 0.8rem !important; } 
          .main-input { font-size: 0.85rem !important; } 
        }
      `}</style>
    </main>
  );
}

// 🔥 ANA SAYFA STİLLERİ (ORİJİNAL) 🔥
const container = { backgroundColor: '#050505', minHeight: '100vh', color: '#ECECEC', fontFamily: 'Inter, sans-serif', position: 'relative' as const, overflowX: 'hidden' as const };
const contentArea = { minHeight: '100vh', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', paddingBottom: '150px' };
const floatingContainer = { position: 'absolute' as const, inset: 0, pointerEvents: 'none' as const };

// 🔥 60VH BOŞLUK VE LOGO FRAME GERİ GELDİ 🔥
const heroSection = { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', textAlign: 'center' as const, zIndex: 10, marginTop: '60vh', width: '100%', gap: '15px', height: 'auto', minHeight: 'min-content', pointerEvents: 'none' as const };
const logoFrame = { display: 'flex', alignItems: 'center', justifyContent: 'center' };
const centerLogo = { width: '100%', maxWidth: '180px', height: 'auto', display: 'block', objectFit: 'contain' as const };

const heroTitle = { fontSize: '2.2rem', fontWeight: '600' as const, color: '#fff', margin: 0, letterSpacing: '-0.5px' };
const heroSub = { color: '#888', fontSize: '1rem', maxWidth: '500px', padding: '0 20px', lineHeight: '1.5' };
const pCat = { fontFamily: 'Times New Roman, serif', fontStyle: 'italic', fontSize: '1.35em', color: '#fff', marginBottom: '6px', opacity: 0.95 };
const pBody = { opacity: 0.75, fontSize: '0.95em' };
const resultContainer = { maxWidth: '900px', width: '100%', marginTop: '120px', padding: '0 20px', zIndex: 20 };
const userPromptWrapper = { backgroundColor: '#0f0f0f', borderRadius: '12px', border: '1px solid #222', marginBottom: '20px', overflow: 'hidden' as const };
const userPromptHeader = { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' };
const userPromptTitle = { fontSize: '0.9rem', color: '#ccc', fontWeight: '500' as const };
const editBtn = { background: 'rgba(131,56,236,0.1)', color: '#00E5FF', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' as const };
const newBtn = { background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' as const };
const userPromptBody = { padding: '20px', borderTop: '1px solid #222', color: '#aaa', fontSize: '0.95rem', lineHeight: '1.6' };
const aiResponseWrapper = { backgroundColor: '#0a0a0a', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' };
const aiLabel = { fontSize: '0.75rem', fontWeight: '700' as const, color: '#00E5FF', marginBottom: '20px', letterSpacing: '2px' };
const aiText = { fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' as const, fontFamily: 'monospace' };
const actionRow = { marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap' as const, gap: '20px' };
const btnGrid = { display: 'flex', flexWrap: 'wrap' as const, gap: '10px' };
const labelStart = { fontSize: '0.85rem', color: '#888', marginBottom: '12px', fontWeight: 'bold' as const, letterSpacing: '0.5px' };
const copyBtnPrimary = { background: '#fff', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold' as const, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };

// 🔥 ALT IŞIK (floorGlow) VE INPUT YAPISI GERİ GELDİ 🔥
const bottomArea = { position: 'fixed' as const, bottom: 0, left: 0, right: 0, padding: '30px 20px 40px 20px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', zIndex: 100, pointerEvents: 'none' as const };
const floorGlow = { position: 'absolute' as const, bottom: '-10px', left: '50%', transform: 'translateX(-50%)', width: '50vw', maxWidth: '600px', height: '60px', background: 'linear-gradient(90deg, #3A86FF, #8338EC, #00E5FF, #8338EC, #3A86FF)', backgroundSize: '200% 100%', filter: 'blur(45px)', opacity: 0.25, zIndex: 1, pointerEvents: 'none' as const };
const glowWrapper = { position: 'relative' as const, width: '100%', maxWidth: '680px', zIndex: 2, pointerEvents: 'auto' as const };
const inputBoxInner = { backgroundColor: '#0a0a0a', borderRadius: '40px', border: '1px solid rgba(58, 134, 255, 0.2)', animation: 'elegantGlow 8s infinite alternate', padding: '6px 10px 6px 18px', width: '100%', display: 'flex', alignItems: 'center' };
const inputField = { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1rem', outline: 'none', resize: 'none' as const, padding: '8px 0', maxHeight: '150px' };
const actionButtons = { display: 'flex', alignItems: 'center', gap: '6px' };
const iconButton = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' };
const sendButton = { width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: '#fff', color: '#000', fontWeight: 'bold' as const, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' };
const loadingBox = { width: '100%', maxWidth: '600px', background: 'rgba(10, 10, 10, 0.85)', padding: '40px 20px', textAlign: 'center' as const };
const loadingText = { color: '#888', fontSize: '0.95rem', fontFamily: 'monospace', opacity: 0.8 };
