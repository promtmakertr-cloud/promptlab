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
  "Benimle günlük konularda İngilizce sohbet et ve yaptığım gramer hatalarını Türkçe açıklayarak düzelt...",
  "Kariyerimde yerimde saydığımı hissediyorum, bana vizyon katacak ve ufuk açacak stratejik tavsiyeler ver..."
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

  // MOBİL UYUMLU VE SİNEMATİK CSS (Apple Style animasyonlar eklendi)
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes cinematicFocus {
        0% { opacity: 0; filter: blur(20px); transform: scale(0.95); }
        25% { opacity: 0.5; filter: blur(1px); transform: scale(1); }
        75% { opacity: 0.5; filter: blur(1px); transform: scale(1); }
        100% { opacity: 0; filter: blur(20px); transform: scale(1.05); }
      }
      .cinematic-text {
        position: absolute;
        color: #aaaaaa;
        cursor: pointer;
        animation: cinematicFocus infinite;
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        line-height: 1.4;
      }
      .cinematic-text:hover {
        color: #ffffff !important;
        opacity: 1 !important;
        filter: blur(0px) !important;
        text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
        z-index: 50;
      }
      .pulse-mic { animation: pulse 1.5s infinite; color: #ff4444 !important; }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      
      /* Apple Tarzı Hover Efekti */
      .apple-card {
        transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 0.7;
      }
      .apple-card:hover {
        opacity: 1;
        transform: translateY(-2px);
      }

      /* MOBİL EKRANLAR (İç içe geçmeyi ve kalabalığı önleme) */
      @media (max-width: 768px) {
        .cinematic-text {
          font-size: 0.9rem !important;
          max-width: 85vw !important;
          left: 7.5vw !important;
          right: auto !important;
          text-align: center !important;
        }
        /* Mobilde sadece 2 yazı çıksın, temiz dursun */
        .cinematic-text:nth-child(n+3) {
          display: none !important;
        }
        /* Yazılar sadece en üst %20'lik alanda çıksın */
        .cinematic-text:nth-child(1) { top: 8% !important; animation-delay: 0s !important;}
        .cinematic-text:nth-child(2) { top: 18% !important; animation-delay: 6s !important;}
        
        .mobile-hero {
          margin-top: 35vh !important; 
        }
        .mobile-title {
          font-size: 1.6rem !important;
        }
        .cards-container {
          flex-direction: column !important;
          gap: 25px !important;
          padding: 0 20px !important;
          margin-top: 20px !important;
        }
        .apple-card {
          width: 100% !important;
        }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // YAZILARIN YENİ KORDİNATLARI: Artık %30'dan aşağıya inemezler!
  const positions = [
    { top: '5%', left: '10%', maxWidth: '25%', animationDuration: '14s', delay: '0s', fontSize: '1.2rem' },
    { top: '12%', right: '8%', maxWidth: '28%', animationDuration: '18s', delay: '4s', fontSize: '1.3rem' },
    { top: '22%', left: '5%', maxWidth: '22%', animationDuration: '16s', delay: '8s', fontSize: '1.1rem' },
    { top: '18%', right: '12%', maxWidth: '24%', animationDuration: '15s', delay: '2s', fontSize: '1.1rem' },
    { top: '28%', left: '20%', maxWidth: '26%', animationDuration: '17s', delay: '6s', fontSize: '1rem' },
    { top: '25%', right: '25%', maxWidth: '25%', animationDuration: '19s', delay: '10s', fontSize: '1rem' },
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

            <div style={heroSection} className="mobile-hero">
              <div style={logoFrame}>
                 <img src="/logo.png" alt="Logo" style={centerLogo} />
              </div>
              <h2 style={heroTitle} className="mobile-title">Size nasıl yardımcı olabilirim?</h2>
              <p style={heroSub}>Sıradan cümlelerinizi, yapay zekanın anlayacağı kusursuz komutlara dönüştürüyoruz.</p>
              
              {/* YENİ EKLENEN: APPLE TARZI MİNİMAL KARTLAR */}
              <div style={cardsContainer} className="cards-container">
                <div style={appleCard} className="apple-card">
                  <span style={cardIcon}>✍️</span>
                  <h3 style={cardTitle}>Fikrini Yaz</h3>
                  <p style={cardDesc}>Günlük dilde ne istediğini belirt.</p>
                </div>
                <div style={appleCard} className="apple-card">
                  <span style={cardIcon}>🧠</span>
                  <h3 style={cardTitle}>Sistem İşlesin</h3>
                  <p style={cardDesc}>Profesyonel bir komuta dönüşsün.</p>
                </div>
                <div style={appleCard} className="apple-card">
                  <span style={cardIcon}>✨</span>
                  <h3 style={cardTitle}>Kopyala & Kullan</h3>
                  <p style={cardDesc}>ChatGPT veya Claude'a yapıştır.</p>
                </div>
              </div>

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
        <div style={inputBox}>
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
        <div style={legalText}>PromptLab yanılabilir. Önemli bilgileri kontrol edin.</div>
      </div>
    </main>
  );
}

// STİLLER
const container = { backgroundColor: '#080808', minHeight: '100vh', color: '#ECECEC', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' };
const topBar = { padding: '20px 25px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const logoWrapper = { display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.8, cursor: 'pointer' };
const miniLogo = { height: '22px', width: 'auto', objectFit: 'contain' };
const logoText = { fontWeight: '600', fontSize: '0.9rem', letterSpacing: '1px' };
const backButton = { backgroundColor: 'transparent', color: '#fff', border: '1px solid #333', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' };

const contentArea = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', paddingBottom: '120px' };

const floatingContainer = { position: 'absolute', top: 0, left: 0, right: 0, height: '35vh', pointerEvents: 'auto', zIndex: 5, overflow: 'hidden' }; // SADECE ÜST KISMA HAPSEDİLDİ

const heroSection = { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10, marginTop: '25vh', width: '100%' };
const logoFrame = { marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const centerLogo = { width: '100%', maxWidth: '160px', height: 'auto', display: 'block', objectFit: 'contain' };
const heroTitle = { fontSize: '2.2rem', fontWeight: '600', marginBottom: '10px', color: '#fff' };
const heroSub = { color: '#888', fontSize: '0.95rem', maxWidth: '450px', padding: '0 20px', lineHeight: '1.5', marginBottom: '40px' };

// YENİ EKLENEN APPLE STYLE KART STİLLERİ (Kutusuz, Çizgisiz, Minimal)
const cardsContainer = { display: 'flex', gap: '40px', justifyContent: 'center', width: '100%', zIndex: 15, flexWrap: 'wrap' };
const appleCard = { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '180px', padding: '10px' };
const cardIcon = { fontSize: '1.6rem', marginBottom: '10px', opacity: 0.9 };
const cardTitle = { fontSize: '0.85rem', fontWeight: '600', color: '#d1d1d1', marginBottom: '6px', letterSpacing: '0.5px' };
const cardDesc = { fontSize: '0.75rem', color: '#666', lineHeight: '1.4' };

const resultContainer = { maxWidth: '850px', width: '100%', marginTop: '80px', marginBottom: '160px', zIndex: 10, padding: '0 20px' };
const aiResponseWrapper = { width: '100%', backgroundColor: '#111', padding: '20px', borderRadius: '16px', border: '1px solid #222' };
const aiLabel = { fontSize: '0.75rem', fontWeight: '700', color: '#888', marginBottom: '20px', letterSpacing: '2px' };
const aiText = { fontSize: '1.05rem', lineHeight: '1.6', color: '#E0E0E0', whiteSpace: 'pre-wrap' };
const copyBtn = { marginTop: '25px', background: '#222', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' };

const bottomArea = { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(transparent, #080808 85%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20 };
const inputBox = { maxWidth: '750px', width: '100%', backgroundColor: '#1A1A1A', borderRadius: '30px', padding: '8px 12px 8px 20px', display: 'flex', alignItems: 'center', border: '1px solid #2A2A2A' };
const inputField = { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.05rem', outline: 'none', resize: 'none', padding: '12px 0', maxHeight: '150px', fontFamily: 'inherit' };

const actionButtons = { display: 'flex', alignItems: 'center', gap: '8px' };
const iconButton = { background: 'none', border: 'none', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const sendButton = { width: '38px', height: '38px', borderRadius: '50%', border: 'none', backgroundColor: '#fff', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' };
const legalText = { fontSize: '0.65rem', color: '#444', marginTop: '12px', textAlign: 'center' };
