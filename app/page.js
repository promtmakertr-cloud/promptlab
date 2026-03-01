'use client';
import { useState, useEffect } from 'react';

const allPrompts = [
  "Bana sorular sorarak MBTI kişilik analizimi yap ve içsel potansiyelimi keşfetmemi sağla...",
  "Fincan fotoğrafıma bakarak geleneksel sembollerle, geçmişi ve geleceği yorumlayan derin bir kahve falı bak...",
  "Patronuma maaş zammı talebimi ileteceğim; net, ikna edici ve profesyonel bir e-posta taslağı hazırla...",
  "Doğum haritama göre önümüzdeki 3 aylık süreçte aşk ve kariyer odaklı detaylı astroloji yorumu yap...",
  "Evdeki yarım tavuk ve patatesle şef elinden çıkmış gibi duran 3 pratik akşam yemeği tarifi ver...",
  "5 yaşındaki çocuğum için özgüven aşılayan, sürükleyici ve rahatlatıcı bir uyku öncesi masalı yaz...",
  "Sıfır ekipmanla evde sadece 20 dakikada ter atabileceğim, tüm vücut yağ yakıcı antrenman planı...",
  "Sevgilimin kalbini kırdım. Samimi, içten ve kendimi affettirecek uzunlukta duygusal bir mesaj yaz...",
  "Benimle günlük konularda İngilizce sohbet et ve gramer hatalarını Türkçe açıklayarak düzelt...",
  "Kariyerimde yerimde saydığımı hissediyorum, bana ufuk açacak stratejik tavsiyeler ver...",
  "Yeni kuracağım e-ticaret sitesi için akılda kalıcı, 2 heceli ve modern marka isimleri türet...",
  "Stresli bir günün ardından zihnimi boşaltmamı sağlayacak 10 dakikalık rehberli meditasyon metni yaz..."
];

const fontSizes = ['0.85rem', '0.95rem', '1.05rem', '1.15rem', '1.25rem'];

const masterPositions = [
  { top: '5%', left: '5%', maxWidth: '280px' },
  { top: '35%', left: '10%', maxWidth: '290px' },
  { top: '65%', left: '6%', maxWidth: '260px' },
  { top: '8%', left: '50%', maxWidth: '340px', isCenter: true },
  { top: '40%', left: '50%', maxWidth: '320px', isCenter: true },
  { top: '75%', left: '50%', maxWidth: '350px', isCenter: true },
  { top: '10%', right: '5%', maxWidth: '280px', isRight: true },
  { top: '45%', right: '10%', maxWidth: '290px', isRight: true },
  { top: '60%', right: '6%', maxWidth: '260px', isRight: true },
];

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Metni Kopyala');
  
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const shuffledTexts = [...allPrompts].sort(() => 0.5 - Math.random());
    const shuffledPos = [...masterPositions].sort(() => 0.5 - Math.random());
    
    setSlots([
      { id: 0, text: shuffledTexts[0], pos: shuffledPos[0], size: fontSizes[2], delay: '0s' },
      { id: 1, text: shuffledTexts[1], pos: shuffledPos[1], size: fontSizes[1], delay: '4s' },
      { id: 2, text: shuffledTexts[2], pos: shuffledPos[2], size: fontSizes[4], delay: '8s' },
      { id: 3, text: shuffledTexts[3], pos: shuffledPos[3], size: fontSizes[0], delay: '12s' },
    ]);
  }, []);

  const handleAnimationIteration = (slotId) => {
    setSlots(prevSlots => {
      const currentTexts = prevSlots.map(s => s.text);
      const currentPositions = prevSlots.map(s => s.pos);

      const availablePrompts = allPrompts.filter(p => !currentTexts.includes(p));
      const newText = availablePrompts[Math.floor(Math.random() * availablePrompts.length)] || allPrompts[0];

      const availablePos = masterPositions.filter(p => !currentPositions.includes(p));
      const newPos = availablePos[Math.floor(Math.random() * availablePos.length)] || masterPositions[0];

      const newSize = fontSizes[Math.floor(Math.random() * fontSizes.length)];

      return prevSlots.map(slot =>
        slot.id === slotId ? { ...slot, text: newText, pos: newPos, size: newSize } : slot
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
      @keyframes glowingBorder {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }

      @keyframes trueBreathing {
        0% { opacity: 0; transform: translateX(var(--translateX, 0)) scale(0.8); filter: blur(15px); }
        30% { opacity: 0.85; transform: translateX(var(--translateX, 0)) scale(1); filter: blur(0px); }
        70% { opacity: 0.85; transform: translateX(var(--translateX, 0)) scale(1.05); filter: blur(0px); }
        100% { opacity: 0; transform: translateX(var(--translateX, 0)) scale(1.2); filter: blur(15px); }
      }

      .cinematic-text {
        position: absolute;
        color: #999999;
        cursor: pointer;
        animation: trueBreathing 16s infinite cubic-bezier(0.4, 0, 0.2, 1);
        text-align: center;
        line-height: 1.5;
        font-weight: 300;
        transition: color 0.3s ease, text-shadow 0.3s ease;
      }

      .cinematic-text:hover {
        color: #ffffff !important;
        opacity: 1 !important;
        text-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
        animation-play-state: paused;
        z-index: 50;
      }

      .pulse-mic { animation: pulse 1.5s infinite; color: #00f2fe !important; }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }

      @media (max-width: 768px) {
        .hero-section { margin-top: 35vh !important; }
        .hero-title { font-size: 1.6rem !important; line-height: 1.2 !important; padding: 0 10px !important; }
        .hero-sub { font-size: 0.9rem !important; padding: 0 15px !important; margin-top: 15px !important; }
        
        .cinematic-text {
          font-size: 0.85rem !important;
          width: 100vw !important;         
          max-width: 100vw !important;
          left: 0 !important;              
          right: 0 !important;             
          padding: 0 25px !important;      
          box-sizing: border-box !important;
          --translateX: 0px !important;    
        }
        
        .slot-0 { top: 0% !important; }
        .slot-1 { top: 30% !important; }
        .slot-2 { top: 60% !important; }
        .slot-3 { display: none !important; } 
        
        /* Mobilde yansıma gücü korundu */
        .floor-glow { opacity: 0.35 !important; height: 60px !important; bottom: -15px !important;}
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  return (
    <main style={container}>
      <div style={topBar}>
        <div style={logoWrapper} onClick={handleReset}>
          <img src="/logo.png" alt="Logo" style={miniLogo} />
          <span style={logoText}>PromptLab</span>
        </div>
        {result && (
          <button onClick={handleReset} style={backButton}>← Yeni Prompt</button>
        )}
      </div>
      
      <div style={contentArea}>
        {!result ? (
          <>
            <div style={floatingContainer}>
              {slots.map((slot) => (
                <div 
                  key={slot.id} 
                  className={`cinematic-text slot-${slot.id}`}
                  onClick={() => setInput(slot.text)}
                  onAnimationIteration={() => handleAnimationIteration(slot.id)}
                  style={{
                    top: slot.pos.top,
                    left: slot.pos.left || 'auto',
                    right: slot.pos.isRight ? slot.pos.right : 'auto',
                    maxWidth: slot.pos.maxWidth,
                    fontSize: slot.size,
                    animationDelay: slot.delay,
                    '--translateX': slot.pos.isCenter ? '-50%' : '0px' 
                  }}
                >
                  "{slot.text}"
                </div>
              ))}
            </div>

            <div style={heroSection} className="hero-section">
              <div style={logoFrame}>
                 <img src="/logo.png" alt="Logo" style={centerLogo} />
              </div>
              <h2 style={heroTitle} className="hero-title">Doğru promptu oluştur.</h2>
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
        
        {/* 🔥 YENİDEN GÖRÜNÜR HALE GELEN SİBER MAVİ YANSIMA 🔥 */}
        <div className="floor-glow" style={floorGlow}></div>

        <div style={glowWrapper}>
          <div style={inputBoxInner}>
            <textarea 
              style={inputField} 
              placeholder="Mesajınızı buraya yazın..." 
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
const logoText = { fontWeight: '600', fontSize: '0.9rem', letterSpacing: '1px' };
const backButton = { backgroundColor: 'transparent', color: '#fff', border: '1px solid #333', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' };

const contentArea = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', paddingBottom: '100px' };

const floatingContainer = { position: 'absolute', top: '70px', left: 0, right: 0, height: '40vh', pointerEvents: 'auto', zIndex: 5, overflow: 'hidden' };

const heroSection = { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10, marginTop: '30vh', width: '100%' };
const logoFrame = { marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const centerLogo = { width: '100%', maxWidth: '180px', height: 'auto', display: 'block', objectFit: 'contain' };
const heroTitle = { fontSize: '2rem', fontWeight: '600', marginBottom: '10px', color: '#fff', letterSpacing: '-0.5px' };
const heroSub = { color: '#888', fontSize: '1rem', maxWidth: '550px', padding: '0 20px', lineHeight: '1.5' };

const resultContainer = { maxWidth: '850px', width: '100%', marginTop: '80px', marginBottom: '160px', zIndex: 10, padding: '0 20px' };
const aiResponseWrapper = { width: '100%', backgroundColor: '#111', padding: '20px', borderRadius: '16px', border: '1px solid #222' };
const aiLabel = { fontSize: '0.75rem', fontWeight: '700', color: '#888', marginBottom: '20px', letterSpacing: '2px' };
const aiText = { fontSize: '1.05rem', lineHeight: '1.6', color: '#E0E0E0', whiteSpace: 'pre-wrap' };
const copyBtn = { marginTop: '25px', background: '#222', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' };

const bottomArea = { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '30px 20px 40px 20px', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20 };

// 🔥 SİBER MAVİ VE NEON CAMGÖBEĞİ TONLARI 🔥
const cyberGradient = 'linear-gradient(90deg, #00f2fe, #0a64ff, #00f2fe, #0a64ff)';

const floorGlow = {
  position: 'absolute',
  bottom: '-20px', 
  left: '50%',
  transform: 'translateX(-50%)',
  width: '60vw', 
  maxWidth: '800px',
  height: '80px', 
  background: cyberGradient,
  backgroundSize: '200% 100%',
  filter: 'blur(50px)',
  opacity: 0.45, // 🔥 Görünürlük artırıldı, ışık geri döndü! 🔥
  zIndex: 1,
  pointerEvents: 'none',
  animation: 'glowingBorder 15s linear infinite' // Çok yavaş ve ağır akış
};

const glowWrapper = {
  position: 'relative',
  width: '100%',
  maxWidth: '750px',
  borderRadius: '50px', 
  background: cyberGradient,
  backgroundSize: '200% 100%',
  animation: 'glowingBorder 15s linear infinite', // Çok yavaş ve ağır akış
  padding: '1px', 
  zIndex: 2,
  boxShadow: '0 0 15px rgba(0, 242, 254, 0.2)' // Kutuya da hafif teknolojik bir dış ışıltı eklendi
};

const inputBoxInner = {
  backgroundColor: '#0a0a0a', 
  borderRadius: '49px', 
  display: 'flex',
  alignItems: 'center',
  padding: '10px 12px 10px 20px',
  width: '100%',
  height: '100%',
};

const inputField = { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.05rem', outline: 'none', resize: 'none', padding: '12px 0', maxHeight: '150px', fontFamily: 'inherit' };

const actionButtons = { display: 'flex', alignItems: 'center', gap: '8px' };
const iconButton = { background: 'none', border: 'none', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const sendButton = { width: '38px', height: '38px', borderRadius: '50%', border: 'none', backgroundColor: '#fff', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' };
