'use client';
import { useState, useEffect } from 'react';
import PromptButton from '../components/PromptButton';

// 🔥 KULLANICI ODAKLI VE VİZYONER PROMPT HAVUZU 🔥
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

// ⌨️ DAKTİLO EFEKTİ İÇİN KULLANICI DOSTU ÖRNEKLER ⌨️
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

// 🔥 KUSURSUZ TAM SVG İKONLAR 🔥
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

  // 🎯 SİMETRİK VE DENGELİ KÖŞE YERLEŞİMLERİ (AMBER TASARIM)
  const getRandomPos = (slotId) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const r1 = Math.random();
    const r2 = Math.random();

    if (isMobile) {
      if (slotId === 0) return { top: `${8 + (r1 * 5)}%`, left: '0', right: '0', margin: '0 auto', maxWidth: '85vw' };
      if (slotId === 1) return { top: `${26 + (r1 * 5)}%`, left: '0', right: '0', margin: '0 auto', maxWidth: '85vw' };
      return { top: '-100%', left: '-100%', display: 'none' }; 
    }

    let top, left, right;
    const maxWidth = '320px'; 

    // Ekranın 4 köşesine asil dağılım
    if (slotId === 0) { top = `${12 + (r1 * 5)}%`; left = `${8 + (r2 * 5)}%`; right = 'auto'; } 
    else if (slotId === 1) { top = `${18 + (r1 * 5)}%`; right = `${8 + (r2 * 5)}%`; left = 'auto'; } 
    else if (slotId === 2) { top = `${55 + (r1 * 5)}%`; left = `${8 + (r2 * 5)}%`; right = 'auto'; } 
    else { top = `${50 + (r1 * 5)}%`; right = `${8 + (r2 * 5)}%`; left = 'auto'; }

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
        0%   { box-shadow: 0 0 8px rgba(255, 191, 0, 0.1), inset 0 0 4px rgba(255, 191, 0, 0.05); border-color: rgba(255, 191, 0, 0.15); }
        50%  { box-shadow: 0 0 20px rgba(255, 126, 0, 0.25), inset 0 0 8px rgba(255, 126, 0, 0.1); border-color: rgba(255, 126, 0, 0.35); }
        100% { box-shadow: 0 0 8px rgba(255, 191, 0, 0.1), inset 0 0 4px rgba(255, 191, 0, 0.05); border-color: rgba(255, 191, 0, 0.15); }
      }
      @keyframes perfectBreathing { 0% { opacity: 0; filter: blur(10px); transform: translateY(10px); } 10% { opacity: 1; filter: blur(0px); transform: translateY(0px); } 25% { opacity: 1; filter: blur(0px); transform: translateY(0px); } 90% { opacity: 1; filter: blur(0px); transform: translateY(0px); } 100% { opacity: 0; filter: blur(10px); transform: translateY(10px); } }
      @keyframes loadingPulse { 0% { opacity: 0.6; transform: scale(0.98); } 50% { opacity: 1; transform: scale(1); } 100% { opacity: 0.6; transform: scale(0.98); } }
      @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

      .loading-box { width: 100%; max-width: 600px; background: rgba(10, 10, 10, 0.8); border: 1px solid rgba(255, 191, 0, 0.3); border-radius: 16px; padding: 40px 20px; text-align: center; box-shadow: 0 0 30px rgba(255, 191, 0, 0.1); }
      .loading-text { font-size: 1.1rem; color: #ffbf00; font-weight: 500; margin-top: 15px; letter-spacing: 0.5px; }
      .cursor-blink { display: inline-block; width: 8px; height: 1.2em; background-color: #ffbf00; vertical-align: middle; margin-left: 4px; animation: blink 1s step-end infinite; }
      .cinematic-text { position: absolute; color: #888888; cursor: pointer; animation: perfectBreathing 24s infinite linear; text-align: left; line-height: 1.5; font-weight: 300; transition: transform 0.3s ease; pointer-events: auto; }
      .cinematic-text:hover { animation-play-state: paused; z-index: 50; }
      .cinematic-text:hover .prompt-category { color: #ffbf00; text-shadow: 0 0 10px rgba(255, 191, 0, 0.5); }
      .cinematic-text:hover .prompt-body { color: #ffffff; opacity: 1; text-shadow: 0 0 10px rgba(255, 255, 255, 0.4); }
      .prompt-category { font-family: "Times New Roman", Times, serif; font-size: 1.35em; font-style: italic; color: #ffffff; margin-bottom: 6px; letter-spacing: 0.5px; opacity: 0.95; transition: color 0.3s ease, text-shadow 0.3s ease; }
      .prompt-body { font-family: inherit; font-size: 0.95em; opacity: 0.75; transition: color 0.3s ease, opacity 0.3s ease, text-shadow 0.3s ease; }
      .pulse-mic { animation: pulse 1.5s infinite; color: #ffbf00 !important; }
      @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
      .edit-btn:hover { background: rgba(255, 191, 0, 0.2) !important; color: #fff !important; }

      .copy-box:hover {
        background: #e0e0e0 !important;
        transform: translateY(-1px);
      }

      @media (max-width: 768px) {
        .hero-title { font-size: 1.55rem !important; line-height: 1.2 !important; padding: 0 10px !important; margin-bottom: 0 !important; }
        .hero-sub { font-size: 0.85rem !important; padding: 0 15px !important; margin-top: 0 !important; line-height: 1.5 !important; }
        .cinematic-text { font-size: 0.85rem !important; margin: 0 auto !important; }
        .slot-2 { display: none !important; }
        .slot-3 { display: none !important; } 
        .floor-glow { opacity: 0.2 !important; height: 50px !important; bottom: -5px !important;}
        .main-input { font-size: 16px !important; white-space: pre-wrap !important; overflow-y: auto !important; line-height: 1.4 !important; }
        .main-input::placeholder { font-size: 14px !important; }
        .input-box-inner { padding: 12px 14px 12px 18px !important; border-radius: 28px !important; }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const dynamicPlaceholder = `Ne oluşturmak istiyorsun?\nÖrn: "${typewriterText}${typewriterText.length > 0 ? '"' : ''}`;

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
                    style={{ top: slot.pos.top, left: slot.pos.left, right: slot.pos.right, maxWidth: slot.pos.maxWidth, fontSize: slot.size, animationDelay: slot.delay }}
                  >
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
                    <span style={{ color: '#ffbf00', marginRight: '8px' }}>✦</span>
                    {isPromptExpanded ? "Senin Promptun" : `Senin Promptun: "${submittedPrompt.length > 45 ? submittedPrompt.slice(0, 45) + '...' : submittedPrompt}"`}
                 </div>
                 <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                   <button className="edit-btn" style={editBtn} onClick={(e) => { e.stopPropagation(); setInput(submittedPrompt); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }} title="Düzenle">✎</button>
                   <span style={{ transform: isPromptExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', color: '#888', fontSize: '0.8rem' }}>▼</span>
                 </div>
               </div>
               {isPromptExpanded && ( <div style={userPromptBody}>{submittedPrompt}</div> )}
             </div>

             {(!result && loading) ? (
               <div className="flex flex-col items-center justify-center mt-10">
                 <div className="loading-box">
                   <svg className="animate-spin" style={{ margin: '0 auto', width: '40px', height: '40px', color: '#ffbf00' }} xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24">
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
                  
                  {!loading && result && (
                    <div style={{ marginTop: '35px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#888', letterSpacing: '0.5px' }}>✨ ÜRETİMİ BAŞLAT:</span>
                        <div onClick={handleCopy} className="copy-box" style={copyBtn}>
                          {IconCopy} <span>{copyStatus}</span>
                        </div>
                      </div>

                      {/* ✅ DÜZELTİLMİŞ PROMPT BUTTON BİLEŞENLERİ KORUNDU */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {!isVisual ? (
                          <>
                            <PromptButton result={result} url="[https://chatgpt.com](https://chatgpt.com)" name="ChatGPT" icon={IconChatGPT} />
                            <PromptButton result={result} url="[https://gemini.google.com/app](https://gemini.google.com/app)" name="Gemini" icon={IconGemini} />
                            <PromptButton result={result} url="[https://claude.ai](https://claude.ai)" name="Claude" icon={IconClaude} />
                            <PromptButton result={result} url="[https://www.perplexity.ai](https://www.perplexity.ai)" name="Perplexity" icon={IconPerplexity} />
                            <PromptButton result={result} url="[https://copilot.microsoft.com](https://copilot.microsoft.com)" name="Copilot" icon={IconCopilot} />
                          </>
                        ) : (
                          <>
                            <PromptButton result={result} url="[https://discord.com/channels/@me](https://discord.com/channels/@me)" name="Midjourney" icon={IconMidjourney} />
                            <PromptButton result={result} url="[https://chatgpt.com](https://chatgpt.com)" name="DALL-E 3" icon={IconChatGPT} />
                            <PromptButton result={result} url="[https://leonardo.ai](https://leonardo.ai)" name="Leonardo" icon={IconLeonardo} />
                            <PromptButton result={result} url="[https://firefly.adobe.com](https://firefly.adobe.com)" name="Adobe Firefly" icon={IconAdobe} />
                            <PromptButton result={result} url="[https://www.canva.com](https://www.canva.com)" name="Canva" icon={IconCanva} />
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

// 🔥 KUSURSUZ STİLLER VE MERKEZİ HİZALAMALAR 🔥
const container = { backgroundColor: '#050505', minHeight: '100vh', color: '#ECECEC', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' };
const topBar = { padding: '20px 25px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const logoWrapper = { display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.8, cursor: 'pointer' };
const miniLogo = { height: '20px', width: 'auto', objectFit: 'contain' };
const backButton = { backgroundColor: 'transparent', color: '#fff', border: '1px solid #333', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' };

// Flexbox ile kusursuz dikey ortalama
const contentArea = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', paddingBottom: '100px' };

const floatingContainer = { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, pointerEvents: 'none', zIndex: 5, overflow: 'hidden' };

const heroSection = { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10, width: '100%', gap: '15px' };
const logoFrame = { display: 'flex', alignItems: 'center', justifyContent: 'center' };
const centerLogo = { width: '100%', maxWidth: '180px', height: 'auto', display: 'block', objectFit: 'contain' };
const heroTitle = { fontSize: '2.2rem', fontWeight: '600', color: '#fff', letterSpacing: '-0.5px', margin: 0 };
const heroSub = { color: '#888', fontSize: '1rem', maxWidth: '550px', padding: '0 20px', lineHeight: '1.5', margin: 0 };
const resultContainer = { maxWidth: '850px', width: '100%', marginTop: '80px', marginBottom: '160px', zIndex: 10, padding: '0 20px' };

const userPromptWrapper = { width: '100%', backgroundColor: '#0f0f0f', borderRadius: '12px', border: '1px solid #222', marginBottom: '20px', overflow: 'hidden', transition: 'all 0.3s ease' };
const userPromptHeader = { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: '#141414' };
const userPromptTitle = { fontSize: '0.9rem', color: '#ccc', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '75%' };
const editBtn = { background: 'rgba(255, 191, 0, 0.08)', color: '#ffbf00', border: '1px solid rgba(255, 191, 0, 0.25)', padding: '6px 14px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '500' };
const userPromptBody = { padding: '20px', borderTop: '1px solid #222', fontSize: '0.95rem', color: '#aaa', lineHeight: '1.6', whiteSpace: 'pre-wrap' };
const aiResponseWrapper = { width: '100%', backgroundColor: '#0a0a0a', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255, 191, 0, 0.2)', boxShadow: '0 0 20px rgba(255, 126, 0, 0.15)' };
const aiLabel = { fontSize: '0.75rem', fontWeight: '700', color: '#ffbf00', marginBottom: '20px', letterSpacing: '2px' };
const aiText = { fontSize: '1rem', lineHeight: '1.6', color: '#E0E0E0', whiteSpace: 'pre-wrap', fontFamily: 'monospace', opacity: 0.9 };

const copyBtn = { display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500', transition: 'all 0.3s ease' };

const bottomArea = { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '30px 20px 40px 20px', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 50 };

// 🔥 ZARİF AMBER GLOW 🔥
const amberGradient = 'linear-gradient(90deg, #ffbf00, #ff7e00, #ffbf00, #ff7e00)';
const floorGlow = { position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', width: '50vw', maxWidth: '600px', height: '60px', background: amberGradient, backgroundSize: '200% 100%', opacity: 0.25, filter: 'blur(40px)', animation: 'pulse 4s infinite' };

const glowWrapper = { position: 'relative', width: '100%', maxWidth: '680px', zIndex: 2, pointerEvents: 'auto' };
const inputBoxInner = { backgroundColor: '#0a0a0a', borderRadius: '40px', border: '1px solid rgba(255, 191, 0, 0.2)', animation: 'elegantGlow 8s infinite alternate', display: 'flex', alignItems: 'center', padding: '12px 14px 12px 18px', gap: '10px' };
const inputField = { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1rem', outline: 'none', resize: 'none', padding: '8px 0', maxHeight: '150px', fontFamily: 'inherit' };
const actionButtons = { display: 'flex', alignItems: 'center', gap: '6px' };
const iconButton = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const sendButton = { width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: '#fff', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', transition: 'transform 0.2s ease', fontSize: '1.2rem' };
