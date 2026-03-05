'use client';
import { useState, useEffect } from 'react';

// 🔥 25'Lİ SÜPERZEKA PROMPT HAVUZU 🔥
const allPrompts = [
  "[Sinema] Wong Kar-wai estetiğinde, neon ışıkların yağmurlu sokaklara yansıdığı melankolik bir şehir sahnesi kurgula.",
  "[Ürün Tasarımı] Yapay zekâ destekli bir mental sağlık uygulaması için kullanıcı odaklı UX akışı ve ölçeklenebilir backend mimarisi tasarla.",
  "[Reklam] Premium bir su markası için 'buz gibi ferahlık' hissini yansıtan 8K sinematik reklam konsepti oluştur.",
  "[Kripto Analizi] Güncel piyasa verilerini kullanarak death cross formasyonunu analiz et ve risk odaklı bir kripto portföy stratejisi geliştir.",
  "[Çocuk Hikâyesi] 2. sınıf öğrencileri için pedagojik olarak uygun, Mini Kedi Mavi'nin balonla yaşadığı maceraları anlatan bir hikâye yaz.",
  "[Felsefe] Öğrenilmiş benlik ile gerçek benlik arasındaki çatışmayı inceleyen derin bir felsefi makale yaz.",
  "[Müzik] Aşık Mahzuni Şerif geleneğinden ilham alarak Türk halk müziği motiflerini modern bir düzenlemeyle yorumla.",
  "[DevOps] Yüksek trafikli bir platform için mikroservis tabanlı ve zero-downtime hedefleyen bir DevOps mimarisi tasarla.",
  "[Pazarlama] Karar vericileri hedefleyen ve dönüşüm oranını artıran etkili B2B cold email sekansları oluştur.",
  "[Hukuk] GDPR standartlarına tam uyumlu, şirketi hukuki risklerden koruyan kapsamlı bir veri gizliliği sözleşmesi hazırla.",
  "[Senaryo] Rick and Morty tarzında, varoluşsal bir krizi mizahi bir bilimkurgu hikâyesiyle anlatan kısa bir senaryo yaz.",
  "[Prompt Engineering] Karmaşık bir fikri analiz edip yüksek performanslı bir master prompta dönüştür.",
  "[Startup] Yapay zekâ tabanlı bir SaaS ürünü için yatırımcıları etkileyecek pitch deck taslağı oluştur.",
  "[UX Yazımı] Bir mobil uygulama için kullanıcıyı yönlendiren net ve sade onboarding metinleri yaz.",
  "[Marka Stratejisi] Yeni bir teknoloji markası için konumlandırma, slogan ve marka hikâyesi oluştur.",
  "[İçerik Üretimi] Bir YouTube kanalı için dikkat çekici video başlıkları ve açıklamaları üret.",
  "[Kod] Gerçek zamanlı veri işleyen ölçeklenebilir bir Node.js mikroservis mimarisi oluştur.",
  "[Veri Analizi] Satış verilerini analiz ederek büyüme fırsatlarını ortaya çıkaran bir rapor hazırla.",
  "[UI Tasarımı] Minimal ve modern bir AI dashboard arayüzü için tasarım prensipleri oluştur.",
  "[Yazarlık] Distopik bir gelecekte geçen kısa ama etkileyici bir bilimkurgu hikâyesi yaz.",
  "[SEO] Bir teknoloji blogu için yüksek trafik potansiyeline sahip SEO odaklı içerik planı oluştur.",
  "[Sunum] Karmaşık bir konuyu yöneticilere anlatan ikna edici bir sunum yapısı hazırla.",
  "[Eğitim] Yeni başlayanlar için yapay zekâ kavramlarını basit örneklerle anlatan bir ders planı hazırla.",
  "[Finans] Bir startup için sürdürülebilir gelir modeli ve finansal projeksiyon planı oluştur.",
  "[Strateji] Yeni bir dijital ürünün pazara giriş stratejisini adım adım planla."
];

// 🔥 %25 DENGELİ DAKTİLO (TYPEWRITER) ROTASYONU 🔥
const typewriterExamples = [
  "Wong Kar-wai estetiğinde melankolik bir sahne kurgula",
  "Premium bir su markası için reklam konsepti oluştur",
  "Mental sağlık uygulaması için UX ve backend tasarla",
  "Güncel verilerle kripto portföy stratejisi geliştir",
  "Mini Kedi Mavi'nin balonla yaşadığı maceraları yaz",
  "Etkili B2B cold email sekansları oluştur",
  "Yüksek trafikli platform için DevOps mimarisi tasarla",
  "Öğrenilmiş benlik ile gerçek benlik çatışmasını incele",
  "Aşık Mahzuni Şerif motiflerini modern yorumla",
  "Yeni teknoloji markası için konumlandırma ve slogan bul",
  "Gerçek zamanlı Node.js mikroservis mimarisi oluştur",
  "GDPR uyumlu veri gizliliği sözleşmesi hazırla",
];

const fontSizes = ['0.85rem', '0.95rem', '1.05rem', '1.1rem'];
const slotZones = {
  0: [ {top: '12%', left: '5%', maxWidth: '320px'} ],  
  1: [ {top: '65%', right: '5%', maxWidth: '320px'} ], 
  2: [ {top: '65%', left: '5%', maxWidth: '320px'} ],  
  3: [ {top: '12%', right: '5%', maxWidth: '320px'} ]  
};

// 🔥 METİN AYRIŞTIRICI (PARSER) 🔥
// "[Kategori] Prompt" formatını ayırır.
const parsePromptData = (fullText) => {
  if (!fullText) return { category: '', promptText: '' };
  const match = fullText.match(/^\[(.*?)\]\s*(.*)$/);
  if (match) {
    return { category: match[1], promptText: match[2] };
  }
  return { category: '', promptText: fullText };
};

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Metni Kopyala');
  const [slots, setSlots] = useState([]);

  const [typewriterText, setTypewriterText] = useState('');
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

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
      setTypewriterText((prev) => 
        isDeleting 
          ? prev.slice(0, -1) 
          : currentFullText.slice(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typewriterText, isDeleting, typewriterIndex]);

  useEffect(() => {
    const shuffledTexts = [...allPrompts].sort(() => 0.5 - Math.random());
    setSlots([
      { id: 0, text: shuffledTexts[0], pos: slotZones[0][0], size: fontSizes[2], delay: '0s' },
      { id: 1, text: shuffledTexts[1], pos: slotZones[1][0], size: fontSizes[1], delay: '6s' },
      { id: 2, text: shuffledTexts[2], pos: slotZones[2][0], size: fontSizes[3], delay: '12s' },
      { id: 3, text: shuffledTexts[3], pos: slotZones[3][0], size: fontSizes[0], delay: '18s' },
    ]);
  }, []);

  const handleAnimationIteration = (slotId) => {
    setSlots(prevSlots => {
      const currentTexts = prevSlots.map(s => s.text);
      const availablePrompts = allPrompts.filter(p => !currentTexts.includes(p));
      const newText = availablePrompts[Math.floor(Math.random() * availablePrompts.length)] || allPrompts[0];
      const newSize = fontSizes[Math.floor(Math.random() * fontSizes.length)];

      return prevSlots.map(slot =>
        slot.id === slotId ? { ...slot, text: newText, pos: slotZones[slotId][0], size: newSize } : slot
      );
    });
  };

  const handleReset = () => {
    setResult('');
    setInput('');
  };

  const handleGenerate = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: input }),
      });
      const data = await res.json();
      setResult(data.result);
      setInput(''); 
    } catch (err) {
      alert("Sistemde bir aksama oldu.");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceTyping = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Tarayıcınız sesli yazmayı desteklemiyor. Lütfen Chrome veya Safari kullanın.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => setInput((prev) => prev + " " + event.results[0][0].transcript);
    recognition.onerror = () => setIsListening(false);
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
      @keyframes elegantGlow {
        0%   { box-shadow: 0 0 8px rgba(0, 242, 254, 0.1), inset 0 0 4px rgba(0, 242, 254, 0.05); border-color: rgba(0, 242, 254, 0.15); }
        50%  { box-shadow: 0 0 20px rgba(10, 100, 255, 0.25), inset 0 0 8px rgba(10, 100, 255, 0.1); border-color: rgba(10, 100, 255, 0.35); }
        100% { box-shadow: 0 0 8px rgba(0, 242, 254, 0.1), inset 0 0 4px rgba(0, 242, 254, 0.05); border-color: rgba(0, 242, 254, 0.15); }
      }

      @keyframes perfectBreathing {
        0%   { opacity: 0; filter: blur(10px); transform: translateY(10px); }
        10%  { opacity: 1; filter: blur(0px); transform: translateY(0px); }
        25%  { opacity: 1; filter: blur(0px); transform: translateY(0px); }
        35%  { opacity: 0; filter: blur(10px); transform: translateY(-10px); }
        100% { opacity: 0; filter: blur(10px); transform: translateY(-10px); }
      }

      .cinematic-text {
        position: absolute;
        color: #888888;
        cursor: pointer;
        animation: perfectBreathing 24s infinite linear; 
        text-align: left; /* Metin sola hizalı daha şık durur */
        line-height: 1.5;
        font-weight: 300;
        transition: transform 0.3s ease, filter 0.3s ease;
      }

      .cinematic-text:hover {
        animation-play-state: paused;
        z-index: 50;
      }
      
      .cinematic-text:hover .prompt-category {
        color: #00f2fe; /* Üzerine gelince kategori neon mavi parlar */
        text-shadow: 0 0 10px rgba(0, 242, 254, 0.5);
      }

      .cinematic-text:hover .prompt-body {
        color: #ffffff;
        opacity: 1;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
      }

      /* 🔥 TIMES NEW ROMAN KATEGORİ STİLİ 🔥 */
      .prompt-category {
        font-family: "Times New Roman", Times, serif;
        font-size: 1.35em;
        font-style: italic;
        color: #ffffff;
        margin-bottom: 6px;
        letter-spacing: 0.5px;
        opacity: 0.95;
        transition: color 0.3s ease, text-shadow 0.3s ease;
      }

      .prompt-body {
        font-family: inherit;
        font-size: 0.95em;
        opacity: 0.75;
        transition: color 0.3s ease, opacity 0.3s ease, text-shadow 0.3s ease;
      }

      .pulse-mic { animation: pulse 1.5s infinite; color: #00f2fe !important; }
      @keyframes pulse {
        0%   { transform: scale(1); }
        50%  { transform: scale(1.1); }
        100% { transform: scale(1); }
      }

      @media (max-width: 768px) {
        .hero-section { margin-top: 25vh !important; gap: 12px !important; }
        .hero-title { font-size: 1.8rem !important; line-height: 1.3 !important; padding: 0 10px !important; margin-bottom: 0 !important; }
        .hero-sub { font-size: 0.95rem !important; padding: 0 15px !important; margin-top: 0 !important; line-height: 1.5 !important; }
        
        .cinematic-text {
          font-size: 0.85rem !important;
          width: 90vw !important;        
          max-width: 90vw !important;
          left: 5vw !important;              
          right: 5vw !important;            
          margin: 0 auto !important;
        }
        
        .slot-0 { top: 8% !important; bottom: auto !important; } 
        .slot-1 { top: 78% !important; bottom: auto !important; } 
        .slot-2 { display: none !important; }
        .slot-3 { display: none !important; } 
        
        .floor-glow { opacity: 0.2 !important; height: 50px !important; bottom: -5px !important;}
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const dynamicPlaceholder = `Ne oluşturmak istiyorsun? Örn: “${typewriterText}${typewriterText.length > 0 ? '”' : ''}`;

  return (
    <main style={container}>
      <div style={topBar}>
        <div style={logoWrapper} onClick={handleReset}>
          <img src="/logo.png" alt="Logo" style={miniLogo} />
        </div>
        {result && (
          <button onClick={handleReset} style={backButton}>← Yeni Prompt</button>
        )}
      </div>
      
      <div style={contentArea}>
        {!result ? (
          <>
            <div style={floatingContainer}>
              {slots.map((slot) => {
                const { category, promptText } = parsePromptData(slot.text);
                return (
                  <div 
                    key={slot.id} 
                    className={`cinematic-text slot-${slot.id}`}
                    onClick={() => setInput(promptText)} // Tıklanınca sadece saf prompt inputa gider!
                    onAnimationIteration={() => handleAnimationIteration(slot.id)}
                    style={{
                      top: slot.pos.top || 'auto',
                      bottom: slot.pos.bottom || 'auto',
                      left: slot.pos.left || 'auto',
                      right: slot.pos.right || 'auto', 
                      maxWidth: slot.pos.maxWidth,
                      fontSize: slot.size,
                      animationDelay: slot.delay,
                    }}
                  >
                    {/* 🔥 YENİ ESTETİK KATEGORİ BAŞLIĞI 🔥 */}
                    {category && (
                      <div className="prompt-category">
                        / {category}
                      </div>
                    )}
                    <div className="prompt-body">
                      {promptText}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={heroSection} className="hero-section">
              <div style={logoFrame}>
                 <img src="/logo.png" alt="Logo" style={centerLogo} />
              </div>
              <h2 style={heroTitle} className="hero-title">Fikirlerini Güçlü Promptlara Dönüştür.</h2>
              <p style={heroSub} className="hero-sub">Metni yaz. Optimize edilmiş promptu al. Kopyala ve diğer AI araçlarında kullan.</p>
            </div>
          </>
        ) : (
          <div style={resultContainer}>
             <div style={aiResponseWrapper}>
                <div style={aiLabel}>ÜRETİLEN MASTER PROMPT</div>
                <div style={aiText}>{result}</div>
                <button onClick={handleCopy} style={copyBtn}>{copyStatus}</button>
             </div>
          </div>
        )}
      </div>

      <div style={bottomArea}>
        <div className="floor-glow" style={floorGlow}></div>
        <div style={glowWrapper}>
          <div style={inputBoxInner} className="input-box-inner">
            <textarea 
              style={inputField} 
              placeholder={dynamicPlaceholder} 
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }}}
            />
            
            <div style={actionButtons}>
              <button 
                onClick={handleVoiceTyping} 
                style={iconButton}
                className={isListening ? "pulse-mic" : ""}
                title="Sesle Yaz"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="22"></line>
                </svg>
              </button>

              <button onClick={handleGenerate} disabled={loading || !input.trim()} style={sendButton}>
                {loading ? '⏳' : '↑'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// STİLLER
const container = { backgroundColor: '#050505', minHeight: '100vh', color: '#ECECEC', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' };
const topBar = { padding: '20px 25px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const logoWrapper = { display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.8, cursor: 'pointer' };
const miniLogo = { height: '20px', width: 'auto', objectFit: 'contain' };
const backButton = { backgroundColor: 'transparent', color: '#fff', border: '1px solid #333', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' };
const contentArea = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', paddingBottom: '100px' };
const floatingContainer = { position: 'absolute', top: '70px', left: 0, right: 0, height: '70vh', pointerEvents: 'auto', zIndex: 5, overflow: 'hidden' };
const heroSection = { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10, marginTop: '25vh', width: '100%', gap: '15px', height: 'auto', minHeight: 'min-content' };
const logoFrame = { display: 'flex', alignItems: 'center', justifyContent: 'center' };
const centerLogo = { width: '100%', maxWidth: '180px', height: 'auto', display: 'block', objectFit: 'contain' };
const heroTitle = { fontSize: '2.2rem', fontWeight: '600', color: '#fff', letterSpacing: '-0.5px', margin: 0 };
const heroSub = { color: '#888', fontSize: '1rem', maxWidth: '550px', padding: '0 20px', lineHeight: '1.5', margin: 0 };
const resultContainer = { maxWidth: '850px', width: '100%', marginTop: '80px', marginBottom: '160px', zIndex: 10, padding: '0 20px' };
const aiResponseWrapper = { width: '100%', backgroundColor: '#0a0a0a', padding: '25px', borderRadius: '16px', border: '1px solid rgba(0, 242, 254, 0.2)', boxShadow: '0 0 20px rgba(10, 100, 255, 0.15)' };
const aiLabel = { fontSize: '0.75rem', fontWeight: '700', color: '#00f2fe', marginBottom: '20px', letterSpacing: '2px' };
const aiText = { fontSize: '1rem', lineHeight: '1.6', color: '#E0E0E0', whiteSpace: 'pre-wrap', fontFamily: 'monospace', opacity: 0.9 };
const copyBtn = { marginTop: '25px', background: '#fff', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' };
const bottomArea = { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '30px 20px 40px 20px', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20 };
const cyberGradient = 'linear-gradient(90deg, #00f2fe, #0a64ff, #00f2fe, #0a64ff)';
const floorGlow = { position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', width: '50vw', maxWidth: '600px', height: '60px', background: cyberGradient, backgroundSize: '200% 100%', filter: 'blur(45px)', opacity: 0.35, zIndex: 1, pointerEvents: 'none', animation: 'glowingBorder 15s linear infinite' };
const glowWrapper = { position: 'relative', width: '100%', maxWidth: '680px', zIndex: 2 };
const inputBoxInner = { backgroundColor: '#0a0a0a', borderRadius: '40px', border: '1px solid rgba(0, 242, 254, 0.2)', animation: 'elegantGlow 8s infinite alternate', display: 'flex', alignItems: 'center', padding: '6px 10px 6px 18px', width: '100%', height: '100%' };
const inputField = { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1rem', outline: 'none', resize: 'none', padding: '8px 0', maxHeight: '150px', fontFamily: 'inherit' };
const actionButtons = { display: 'flex', alignItems: 'center', gap: '6px' };
const iconButton = { background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const sendButton = { width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: '#fff', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold' };
