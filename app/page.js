'use client';
import { useState, useEffect } from 'react';

// Geniş Prompt Havuzumuz
const allPrompts = [
  "Sepetini terk eden müşterileri geri döndürecek 3 aşamalı e-posta serisi...",
  "İlkokul seviyesindeki çocuklar için 'Mavi Kedi' temalı eğitici hikaye...",
  "React ve Tailwind CSS kullanarak karanlık tema destekli portfolyo sitesi...",
  "Yeni nesil kahve zinciri için sürdürülebilir paketleme odaklı Instagram takvimi...",
  "Yapay zeka etiği konusunda Google aramalarında üst sıralara çıkacak SEO blog yazısı...",
  "B2B SaaS ürünü için LinkedIn soğuk mesajlaşma (cold outreach) şablonları...",
  "Kişisel finans uygulaması için kullanıcı elde tutma (retention) stratejileri...",
  "Sıfırdan başlayanlar için 4 haftalık evde vücut geliştirme antrenman programı...",
  "Bir podcast bölümü için dikkat çekici açılış metni ve konuk soruları...",
  "Yerel bir restoran için TikTok ve Reels viral video fikirleri..."
];

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Metni Kopyala');
  const [prompts, setPrompts] = useState<string[]>([]);

  // Sayfa yüklendiğinde rastgele promptlar seçiyoruz
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

  // SİNEMATİK ODAKLANMA (BLUR) EFEKTİ İÇİN CSS
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
      /* Fare ile üzerine gelince anında netleşsin ve parlasın */
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
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // Ekranın etrafındaki GÜVENLİ (Merkezi bozanmayan) kordinatlar
  const positions = [
    { top: '15%', left: '8%', maxWidth: '25%', animationDuration: '14s', delay: '0s', fontSize: '1.2rem' },
    { top: '22%', right: '8%', maxWidth: '28%', animationDuration: '18s', delay: '4s', fontSize: '1.4rem' },
    { top: '45%', left: '4%', maxWidth: '22%', animationDuration: '16s', delay: '8s', fontSize: '1rem' },
    { top: '40%', right: '5%', maxWidth: '24%', animationDuration: '15s', delay: '2s', fontSize: '1.1rem' },
    { top: '70%', left: '10%', maxWidth: '26%', animationDuration: '17s', delay: '6s', fontSize: '1.3rem' },
    { top: '65%', right: '12%', maxWidth: '25%', animationDuration: '19s', delay: '10s', fontSize: '1.1rem' },
  ];

  return (
    <main style={container}>
      {/* Üst Bar Logo */}
      <div style={topBar}>
        <div style={{...logoWrapper, cursor: 'pointer'}} onClick={handleReset}>
          <span style={topLogoText}><span style={{fontWeight: 300, opacity: 0.8}}>prompt</span>Lab.</span>
        </div>
        {result && (
          <button onClick={handleReset} style={backButton}>← Yeni Prompt</button>
        )}
      </div>
      
      <div style={contentArea}>
        {!result ? (
          <>
            {/* SİNEMATİK PROMPT BULUTLARI */}
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

            {/* MERKEZ ALAN (Logo ve Başlık) */}
            <div style={heroSection}>
              <div style={logoFrame}>
                 <h1 style={centerLogoText}><span style={{fontWeight: 300}}>prompt</span><span style={{fontWeight: 'bold'}}>Lab.</span></h1>
              </div>
              <h2 style={heroTitle}>Size nasıl yardımcı olabilirim?</h2>
              <p style={heroSub}>Karmaşık fikirlerinizi profesyonel bir prompta dönüştürün.</p>
            </div>
          </>
        ) : (
          /* SONUÇ EKRANI */
          <div style={resultContainer}>
             <div style={aiResponseWrapper}>
                <div style={aiLabel}>ÜRETİLEN MASTER PROMPT</div>
                <div style={aiText}>{result}</div>
                <button onClick={handleCopy} style={copyBtn}>{copyStatus}</button>
             </div>
          </div>
        )}
      </div>

      {/* ALT GİRİŞ ALANI */}
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
const topBar = { padding: '25px 30px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const logoWrapper = { display: 'flex', alignItems: 'center' };
const topLogoText = { fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '0.5px' };
const backButton = { backgroundColor: 'transparent', color: '#fff', border: '1px solid #333', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' };

const contentArea = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' };

// Sinematik Bulutların Alanı
const floatingContainer = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'auto', zIndex: 5, overflow: 'hidden' };

const heroSection = { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10, marginTop: '10vh' };
const logoFrame = { marginBottom: '15px' };
const centerLogoText = { fontSize: '3rem', margin: 0, letterSpacing: '-1px' };
const heroTitle = { fontSize: '2.4rem', fontWeight: '600', marginBottom: '10px', color: '#fff' };
const heroSub = { color: '#666', fontSize: '1.05rem' };

const resultContainer = { maxWidth: '850px', width: '100%', marginTop: '120px', marginBottom: '160px', zIndex: 10 };
const aiResponseWrapper = { width: '100%', backgroundColor: '#111', padding: '30px', borderRadius: '16px', border: '1px solid #222' };
const aiLabel = { fontSize: '0.75rem', fontWeight: '700', color: '#888', marginBottom: '20px', letterSpacing: '2px' };
const aiText = { fontSize: '1.1rem', lineHeight: '1.8', color: '#E0E0E0', whiteSpace: 'pre-wrap' };
const copyBtn = { marginTop: '25px', background: '#222', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' };

const bottomArea = { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '30px 20px', background: 'linear-gradient(transparent, #080808 80%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20 };
const inputBox = { maxWidth: '750px', width: '100%', backgroundColor: '#1A1A1A', borderRadius: '30px', padding: '8px 12px 8px 20px', display: 'flex', alignItems: 'center', border: '1px solid #2A2A2A' };
const inputField = { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.05rem', outline: 'none', resize: 'none', padding: '12px 0', maxHeight: '150px', fontFamily: 'inherit' };

const actionButtons = { display: 'flex', alignItems: 'center', gap: '12px' };
const iconButton = { background: 'none', border: 'none', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const sendButton = { width: '38px', height: '38px', borderRadius: '50%', border: 'none', backgroundColor: '#fff', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' };
const legalText = { fontSize: '0.7rem', color: '#444', marginTop: '12px' };
