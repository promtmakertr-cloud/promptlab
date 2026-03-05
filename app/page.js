'use client';
import { useState, useEffect } from 'react';

// 🔥 PROMPT HAVUZU VE DAKTİLO AYNI KALDI 🔥
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
  if (match) {
    return { category: match[1].trim(), promptText: match[2].trim() };
  }
  return { category: '', promptText: fullText };
};

const loadingMessages = [
  "🧠 Fikriniz yapay zeka tarafından analiz ediliyor...",
  "📚 Master Kütüphane standartlarına uyarlanıyor...",
  "⚙️ Sektörel jargon ve teknik detaylar ekleniyor...",
  "✨ Son rötuşlar yapılıyor, promptunuz hazır olmak üzere..."
];

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
  const [isVisual, setIsVisual] = useState(false); // 🔥 Prompt türünü takip eder

  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Rastgele Koordinat Motoru
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
    if (slotId === 0) { top = `${6 + (r1 * 6)}%`; left = `${2 + (r2 * 12)}%`; right = 'auto'; }
    else if (slotId === 1) { top = `${10 + (r1 * 6)}%`; left = 'auto'; right = `${2 + (r2 * 12)}%`; }
    else if (slotId === 2) { top = `${38 + (r1 * 5)}%`; left = `${2 + (r2 * 12)}%`; right = 'auto'; }
    else { top = `${42 + (r1 * 5)}%`; left = 'auto'; right = `${2 + (r2 * 12)}%`; }

    return { top, left, right, maxWidth: '340px' };
  };

  useEffect(() => {
    let interval;
    if (loading && !result) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [loading, result]);

  useEffect(() => {
    const currentFullText = typewriterExamples[typewriterIndex];
    let typingSpeed = isDeleting ? 30 : 50; 
    if (!isDeleting && typewriterText === currentFullText) { setTimeout(() => setIsDeleting(true), 2500); return; }
    else if (isDeleting && typewriterText === '') { setIsDeleting(false); setTypewriterIndex((prev) => (prev + 1) % typewriterExamples.length); return; }
    const timeout = setTimeout(() => { setTypewriterText((prev) => isDeleting ? prev.slice(0, -1) : currentFullText.slice(0, prev.length + 1)); }, typingSpeed);
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
      return prevSlots.map(slot => slot.id === slotId ? { ...slot, text: newText, pos: getRandomPos(slotId), size: fontSizes[Math.floor(Math.random() * fontSizes.length)] } : slot );
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: currentInput }),
      });
      if (!res.ok) throw new Error("Sunucu Hatası");
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
          // 🔥 Eğer metinde "```text" geçiyorsa bu bir görsel prompttur!
          if (fullContent.includes("```text")) setIsVisual(true);
        }
      }
    } catch (err) { alert("Hata Oluştu"); setInput(currentInput); setSubmittedPrompt(''); } 
    finally { setLoading(false); }
  };

  // 🔥 Hızlı Başlatma Fonksiyonu
  const handleQuickLaunch = (url) => {
    navigator.clipboard.writeText(result);
    setCopyStatus('Kopyalandı! Yönlendiriliyor...');
    setTimeout(() => {
        window.open(url, '_blank');
        setCopyStatus('Metni Kopyala');
    }, 1000);
  };

  const handleVoiceTyping = () => {
    if (!('webkitSpeechRecognition' in window)) { alert("Desteklenmiyor."); return; }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => setInput((prev) => prev + " " + event.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopyStatus('Kopyalandı! ✓');
    setTimeout(() => setCopyStatus('Metni Kopyala'), 2000);
  };

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes elegantGlow { 0% { box-shadow: 0 0 8px rgba(0, 242, 254, 0.1); } 50% { box-shadow: 0 0 20px rgba(10, 100, 255, 0.25); } 100% { box-shadow: 0 0 8px rgba(0, 242, 254, 0.1); } }
      @keyframes perfectBreathing { 0% { opacity: 0; filter: blur(10px); } 10% { opacity: 1; filter: blur(0px); } 25% { opacity: 1; } 35% { opacity: 0; filter: blur(10px); } 100% { opacity: 0; } }
      @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      .cursor-blink { display: inline-block; width: 8px; height: 1.2em; background-color: #00f2fe; vertical-align: middle; margin-left: 4px; animation: blink 1s step-end infinite; }
      .cinematic-text { position: absolute; color: #888; cursor: pointer; animation: perfectBreathing 24s infinite linear; pointer-events: auto; }
      .cinematic-text:hover { animation-play-state: paused; color: #fff; }
      .prompt-category { font-family: "Times New Roman", serif; font-style: italic; color: #fff; font-size: 1.2em; }
      .quick-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #888; padding: 8px 15px; borderRadius: 8px; fontSize: 0.8rem; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px; }
      .quick-btn:hover { background: rgba(0, 242, 254, 0.1); color: #00f2fe; border-color: #00f2fe; transform: translateY(-2px); }
      @media (max-width: 768px) {
        .hero-section { margin-top: 42vh !important; }
        .main-input { font-size: 16px !important; }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  return (
    <main style={container}>
      {/* Üst Bar */}
      <div style={topBar}>
        <div style={logoWrapper} onClick={handleReset}><img src="/logo.png" alt="Logo" style={miniLogo} /></div>
        {submittedPrompt && <button onClick={handleReset} style={backButton}>← Ana Sayfa</button>}
      </div>
      
      <div style={contentArea}>
        {!submittedPrompt ? (
          <>
            <div style={floatingContainer}>
              {slots.map((slot) => {
                const { category, promptText } = parsePromptData(slot.text);
                return (
                  <div key={slot.id} className={`cinematic-text slot-${slot.id}`} onClick={() => setInput(promptText)} onAnimationIteration={() => handleAnimationIteration(slot.id)} style={{ ...slot.pos, fontSize: slot.size, animationDelay: slot.delay }}>
                    {category && <div className="prompt-category">{category}</div>}
                    <div>{promptText}</div>
                  </div>
                );
              })}
            </div>
            <div style={heroSection} className="hero-section">
              <img src="/logo.png" alt="Logo" style={centerLogo} />
              <h2 style={heroTitle}>Fikirlerini Güçlü Promptlara Dönüştür.</h2>
              <p style={heroSub}>Metni yaz. Optimize edilmiş promptu al. Tüm AI araçlarında tek tıkla kullan.</p>
            </div>
          </>
        ) : (
          <div style={resultContainer}>
             {/* Akordeon Kullanıcı Promptu */}
             <div style={userPromptWrapper}>
               <div style={userPromptHeader} onClick={() => setIsPromptExpanded(!isPromptExpanded)}>
                 <div style={userPromptTitle}>✦ {isPromptExpanded ? "Senin Promptun" : `Senin Promptun: "${submittedPrompt.slice(0, 45)}..."`}</div>
                 <button style={editBtn} onClick={(e) => { e.stopPropagation(); setInput(submittedPrompt); window.scrollTo({ top: 9999, behavior: 'smooth' }); }}>Düzenle</button>
               </div>
               {isPromptExpanded && <div style={userPromptBody}>{submittedPrompt}</div>}
             </div>

             {/* Yapay Zeka Çıktısı */}
             <div style={aiResponseWrapper}>
                <div style={aiLabel}>ÜRETİLEN MASTER PROMPT</div>
                <div style={aiText}>{result}{loading && <span className="cursor-blink"></span>}</div>
                
                {/* 🔥 HIZLI BAŞLATMA BUTONLARI 🔥 */}
                {!loading && result && (
                  <div style={{ marginTop: '25px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <button onClick={handleCopy} style={copyBtn}>{copyStatus}</button>
                    
                    {/* Metin Araçları (Her zaman gösterilebilir veya mantığa göre ayrılabilir) */}
                    {!isVisual ? (
                      <>
                        <button className="quick-btn" onClick={() => handleQuickLaunch('https://chatgpt.com')}>ChatGPT</button>
                        <button className="quick-btn" onClick={() => handleQuickLaunch('https://gemini.google.com')}>Gemini</button>
                        <button className="quick-btn" onClick={() => handleQuickLaunch('https://claude.ai')}>Claude</button>
                      </>
                    ) : (
                      <>
                        <button className="quick-btn" onClick={() => handleQuickLaunch('https://discord.com/channels/@me')}>Midjourney</button>
                        <button className="quick-btn" onClick={() => handleQuickLaunch('https://leonardo.ai')}>Leonardo</button>
                        <button className="quick-btn" onClick={() => handleQuickLaunch('https://chatgpt.com')}>DALL-E 3</button>
                      </>
                    )}
                  </div>
                )}
             </div>
          </div>
        )}
      </div>

      {/* Arama Kutusu */}
      <div style={bottomArea}>
        <div style={glowWrapper}>
          <div style={inputBoxInner} className="input-box-inner">
            <textarea className="main-input" style={inputField} placeholder={`Ne oluşturmak istiyorsun?\nÖrn: “${typewriterText}”`} rows={2} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }}} />
            <div style={actionButtons}>
              <button onClick={handleVoiceTyping} style={iconButton} className={isListening ? "pulse-mic" : ""} title="Sesle Yaz">🎤</button>
              <button onClick={handleGenerate} disabled={loading || !input.trim()} style={sendButton}>{loading ? '⏳' : '↑'}</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// 🔥 STİLLER 🔥
const container = { backgroundColor: '#050505', minHeight: '100vh', color: '#ECECEC', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' };
const topBar = { padding: '20px 25px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const logoWrapper = { cursor: 'pointer' };
const miniLogo = { height: '20px' };
const backButton = { background: 'none', color: '#fff', border: '1px solid #333', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' };
const contentArea = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', paddingBottom: '100px' };
const floatingContainer = { position: 'absolute', top: '70px', left: 0, right: 0, height: '70vh', pointerEvents: 'none' };
const heroSection = { textAlign: 'center', zIndex: 10, marginTop: '60vh', pointerEvents: 'none' };
const centerLogo = { maxWidth: '180px', marginBottom: '15px' };
const heroTitle = { fontSize: '2.2rem', fontWeight: '600' };
const heroSub = { color: '#888', maxWidth: '550px', margin: '0 auto' };
const resultContainer = { maxWidth: '850px', width: '100%', marginTop: '80px', padding: '0 20px', zIndex: 10 };
const userPromptWrapper = { backgroundColor: '#0f0f0f', borderRadius: '12px', border: '1px solid #222', marginBottom: '20px' };
const userPromptHeader = { padding: '15px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' };
const userPromptTitle = { fontSize: '0.9rem', color: '#ccc' };
const editBtn = { color: '#00f2fe', background: 'none', border: '1px solid #222', padding: '5px 10px', borderRadius: '5px' };
const userPromptBody = { padding: '15px', borderTop: '1px solid #222', color: '#888' };
const aiResponseWrapper = { backgroundColor: '#0a0a0a', padding: '25px', borderRadius: '16px', border: '1px solid rgba(0, 242, 254, 0.2)' };
const aiLabel = { fontSize: '0.75rem', color: '#00f2fe', marginBottom: '15px' };
const aiText = { fontSize: '1rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace' };
const copyBtn = { background: '#fff', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' };
const bottomArea = { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '30px', display: 'flex', justifyContent: 'center', pointerEvents: 'none' };
const glowWrapper = { width: '100%', maxWidth: '680px', pointerEvents: 'auto' };
const inputBoxInner = { backgroundColor: '#0a0a0a', border: '1px solid #333', display: 'flex', padding: '10px', borderRadius: '30px' };
const inputField = { flex: 1, background: 'none', border: 'none', color: '#fff', outline: 'none', resize: 'none' };
const actionButtons = { display: 'flex', gap: '10px', alignItems: 'center' };
const iconButton = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' };
const sendButton = { width: '35px', height: '35px', borderRadius: '50%', background: '#fff', border: 'none', cursor: 'pointer' };
