'use client';
import { useState, useEffect } from 'react';

// İNSANİ VE İLGİ ÇEKİCİ PROMPT HAVUZU
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
  "Kariyerimde yerimde saydığımı hissediyorum, bana ufuk açacak stratejik tavsiyeler ver..."
];

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Metni Kopyala');
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    const shuffled = [...allPrompts].sort(() => 0.5 - Math.random());
    setPrompts(shuffled);
  }, []);

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

  // SİRİ GİBİ NEON IŞIK VE SİNEMATİK EFEKTLER İÇİN CSS
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      /* Neon Çerçeve Animasyonu (Videondaki gibi) */
      @keyframes glowingBorder {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }

      /* Videondaki gibi aşağıdan yukarıya yavaşça belirip kaybolan yazılar */
      @keyframes floatUpFade {
        0% { opacity: 0; transform: translateY(20px) scale(0.95); filter: blur(5px); }
        20% { opacity: 0.6; transform: translateY(0px) scale(1); filter: blur(0px); }
        80% { opacity: 0.6; transform: translateY(-15px) scale(1); filter: blur(0px); }
        100% { opacity: 0; transform: translateY(-30px) scale(0.95); filter: blur(5px); }
      }

      .cinematic-text {
        position: absolute;
        color: #888888;
        cursor: pointer;
        animation: floatUpFade infinite linear;
        text-align: center;
        line-height: 1.5;
        font-weight: 300;
        transition: color 0.3s ease, text-shadow 0.3s ease;
      }

      .cinematic-text:hover {
        color: #ffffff !important;
        opacity: 1 !important;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
        animation-play-state: paused;
        z-index: 50;
      }

      .pulse-mic { animation: pulse 1.5s infinite; color: #ff4444 !important; }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }

      /* MOBİL EKRANLAR */
      @media (max-width: 768px) {
        .cinematic-text {
          font-size: 0.85rem !important;
          width: 80vw !important;
          left: 10vw !important;
          right: auto !important;
        }
        .hero-title { font-size: 1.8rem !important; }
        .hero-sub { font-size: 0.85rem !important; padding: 0 15px !important; }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // YAZILAR ASLA ÜST ÜSTE BİNMEYECEK: 3 Farklı kanal açtık, süreleri uzattık.
  const positions = [
    { top: '10%', left: '50%', transform: 'translateX(-50%)', maxWidth: '600px', animationDuration: '12s', delay: '0s', fontSize: '1.1rem' },
    { top: '22%', left: '15%', maxWidth: '300px', animationDuration: '14s', delay: '4s', fontSize: '0.95rem' },
    { top: '18%', right: '15%', maxWidth: '300px', animationDuration: '15s', delay: '8s', fontSize: '1rem' },
  ];

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
            {/* VİDEODAKİ GİBİ ÜSTTE SÜZÜLEN SİHİRLİ YAZILAR */}
            <div style={floatingContainer}>
              {prompts.length > 0 && positions.map((pos, index) => (
                <div 
                  key={index} 
                  className="cinematic-text"
                  onClick={() => setInput(prompts[index])}
                  style={{
                    top: pos.top,
                    left: pos.left,
                    right: pos.right,
                    transform: pos.transform,
                    maxWidth: pos.maxWidth,
                    fontSize: pos.fontSize,
                    animationDuration: pos.animationDuration,
                    animationDelay: pos.delay,
                  }}
                >
                  "{prompts[index]}"
                </div>
              ))}
            </div>

            {/* VİDEODAKİ TERTEMİZ MERKEZ EKRAN */}
            <div style={heroSection}>
              <div style={logoFrame}>
                 <img src="/logo.png" alt="Logo" style={centerLogo} />
              </div>
              <h2 style={heroTitle} className="hero-title">Doğru promptu burada üret.</h2>
              <p style={heroSub} className="hero-sub">Karmaşık yazabilirsin. Sistem optimize eder. Çıktıyı kopyalayıp diğer AI araçlarında çalıştır.</p>
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
        
        {/* 🔥 İŞTE VİDEODAKİ O SİRİ GİBİ NEON IŞIKLI ÇERÇEVE 🔥 */}
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
        {/* NEON ÇERÇEVE BİTİŞİ */}

      </div>
    </main>
  );
}

// STİLLER
const container = { backgroundColor: '#050505', minHeight: '100vh', color: '#ECECEC', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' };
const topBar = { padding: '20px 25px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const logoWrapper = { display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.8, cursor: 'pointer' };
const miniLogo = { height: '20px', width: 'auto', objectFit: 'contain' };
const logoText = { fontWeight: '600', fontSize: '0.9rem', letterSpacing: '1px' };
const backButton = { backgroundColor: 'transparent', color: '#fff', border: '1px solid #333', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' };

const contentArea = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', paddingBottom: '100px' };

// Yazılar sadece en üstteki boş alanda çıkacak (Logoya asla değmeyecek)
const floatingContainer = { position: 'absolute', top: 0, left: 0, right: 0, height: '40vh', pointerEvents: 'auto', zIndex: 5, overflow: 'hidden' };

const heroSection = { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10, marginTop: '10vh', width: '100%' };
const logoFrame = { marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const centerLogo = { width: '100%', maxWidth: '180px', height: 'auto', display: 'block', objectFit: 'contain' };
const heroTitle = { fontSize: '2.4rem', fontWeight: '600', marginBottom: '10px', color: '#fff', letterSpacing: '-0.5px' };
const heroSub = { color: '#888', fontSize: '1rem', maxWidth: '550px', padding: '0 20px', lineHeight: '1.5' };

const resultContainer = { maxWidth: '850px', width: '100%', marginTop: '80px', marginBottom: '160px', zIndex: 10, padding: '0 20px' };
const aiResponseWrapper = { width: '100%', backgroundColor: '#111', padding: '20px', borderRadius: '16px', border: '1px solid #222' };
const aiLabel = { fontSize: '0.75rem', fontWeight: '700', color: '#888', marginBottom: '20px', letterSpacing: '2px' };
const aiText = { fontSize: '1.05rem', lineHeight: '1.6', color: '#E0E0E0', whiteSpace: 'pre-wrap' };
const copyBtn = { marginTop: '25px', background: '#222', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' };

const bottomArea = { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '30px 20px 40px 20px', background: 'linear-gradient(transparent, #050505 85%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20 };

// 🔥 NEON ÇERÇEVE CSS MATEMATİĞİ 🔥
const glowWrapper = {
  position: 'relative',
  width: '100%',
  maxWidth: '750px',
  borderRadius: '32px',
  // Videondaki gibi Kırmızı-Mavi-Mor neon geçişi
  background: 'linear-gradient(90deg, #ff0055, #7928ca, #00d2ff, #ff0055, #7928ca)',
  backgroundSize: '200% 100%',
  animation: 'glowingBorder 4s linear infinite',
  padding: '2px', // Neon çizginin kalınlığı
};

const inputBoxInner = {
  backgroundColor: '#0a0a0a', // İçerisi simsiyah
  borderRadius: '30px',
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
