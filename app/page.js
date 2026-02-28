'use client';
import { useState, useEffect } from 'react';

// Geniş Prompt Havuzumuz (Sayfa her yenilendiğinde buradan rastgele seçilecek)
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
  "Yerel bir restoran için TikTok ve Reels odaklı viral video fikirleri..."
];

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Metni Kopyala');
  
  // Ekranda kayacak rastgele promptlar için state
  const [floatingTexts, setFloatingTexts] = useState([]);

  // Sayfa yüklendiğinde rastgele promptları seç (Hydration hatasını önlemek için useEffect içinde)
  useEffect(() => {
    const shuffled = [...allPrompts].sort(() => 0.5 - Math.random());
    // Ekranda 4 satır kayan yazı göstereceğiz
    setFloatingTexts(shuffled.slice(0, 4));
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
      setInput(''); // İşlem bitince kutuyu temizle
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

  // Kayan Yazılar ve Efektler için CSS
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes slideRight {
        0% { transform: translateX(-50%); }
        100% { transform: translateX(50%); }
      }
      @keyframes slideLeft {
        0% { transform: translateX(50%); }
        100% { transform: translateX(-50%); }
      }
      .floating-text {
        white-space: nowrap;
        color: #333333; /* Tasarımdaki silik renk */
        font-size: 1.1rem;
        cursor: pointer;
        transition: color 0.3s ease, transform 0.3s ease;
        display: inline-block;
        padding: 10px;
      }
      .floating-text:hover {
        color: #ffffff; /* Üzerine gelince parlasın */
        text-shadow: 0 0 10px rgba(255,255,255,0.3);
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

  return (
    <main style={container}>
      {/* Üst Bar */}
      <div style={topBar}>
        <div style={{...logoWrapper, cursor: 'pointer'}} onClick={handleReset}>
          <span style={logoText}><span style={{fontWeight: 400, opacity: 0.7}}>promptLab.</span> PromptLab</span>
        </div>
        {result && (
          <button onClick={handleReset} style={backButton}>← Yeni Prompt</button>
        )}
      </div>
      
      <div style={contentArea}>
        {!result ? (
          <>
            {/* ARKAPLANDAKİ KAYAN YAZILAR (Tasarımındaki gibi yukarıda dağınık) */}
            <div style={floatingContainer}>
              {floatingTexts.map((text, index) => (
                <div key={index} style={{ 
                  width: '200%', 
                  animation: `${index % 2 === 0 ? 'slideRight' : 'slideLeft'} ${40 + (index * 10)}s linear infinite`,
                  textAlign: index % 2 === 0 ? 'left' : 'right',
                  marginBottom: '40px',
                  opacity: 0.8
                }}>
                  <span className="floating-text" onClick={() => setInput(text)}>
                    "{text}" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "{text}"
                  </span>
                </div>
              ))}
            </div>

            {/* MERKEZ (Senin tasarımındaki gibi) */}
            <div style={heroSection}>
              <div style={logoFrame}>
                 <h1 style={centerLogoText}>prompt<span style={{fontWeight: 'bold'}}>Lab.</span></h1>
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

      {/* ALT GİRİŞ ALANI (Tasarımındaki yuvarlak hatlı karanlık input) */}
      <div style={bottomArea}>
        <div style={inputBox}>
          <textarea 
            style={inputField} 
            placeholder="Mesajınızı buraya yazın..." 
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }}}
          />
          
          <div style={actionButtons}>
            {/* Mikrofon İkonu (Tasarımındaki gibi sade) */}
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

            {/* Tasarımındaki Bembeyaz Yuvarlak Gönder Butonu */}
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

// GÜNCELLENMİŞ STİLLER (Görseline Birebir Uygun)
const container = { backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#ECECEC', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' };
const topBar = { padding: '20px 25px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const logoWrapper = { display: 'flex', alignItems: 'center', opacity: 0.8 };
const logoText = { fontWeight: '700', fontSize: '1rem', letterSpacing: '0.5px' };
const backButton = { backgroundColor: 'transparent', color: '#fff', border: '1px solid #333', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem' };

const contentArea = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' };

// Kayan Yazıların Kutusu (Merkezin hemen üstünde)
const floatingContainer = { position: 'absolute', top: '20%', left: 0, right: 0, display: 'flex', flexDirection: 'column', pointerEvents: 'auto', zIndex: 5 };

const heroSection = { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 10, marginTop: '80px' };
const logoFrame = { marginBottom: '15px' };
const centerLogoText = { fontSize: '2.5rem', fontWeight: '300', margin: 0, letterSpacing: '-1px' };
const heroTitle = { fontSize: '2.2rem', fontWeight: '600', marginBottom: '10px', color: '#fff' };
const heroSub = { color: '#666', fontSize: '1rem' };

const resultContainer = { maxWidth: '850px', width: '100%', marginTop: '100px', marginBottom: '160px', zIndex: 10 };
const aiResponseWrapper = { width: '100%', backgroundColor: '#111', padding: '30px', borderRadius: '16px', border: '1px solid #222' };
const aiLabel = { fontSize: '0.75rem', fontWeight: '700', color: '#888', marginBottom: '20px', letterSpacing: '2px' };
const aiText = { fontSize: '1.1rem', lineHeight: '1.8', color: '#E0E0E0', whiteSpace: 'pre-wrap' };
const copyBtn = { marginTop: '25px', background: '#222', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' };

const bottomArea = { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '30px 20px', background: 'linear-gradient(transparent, #0A0A0A 70%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20 };
// Tasarımdaki Koyu Gri Input Kutusu
const inputBox = { maxWidth: '700px', width: '100%', backgroundColor: '#1A1A1A', borderRadius: '30px', padding: '8px 12px 8px 20px', display: 'flex', alignItems: 'center', border: '1px solid #2A2A2A' };
const inputField = { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1rem', outline: 'none', resize: 'none', padding: '10px 0', maxHeight: '150px', fontFamily: 'inherit' };

const actionButtons = { display: 'flex', alignItems: 'center', gap: '12px' };
const iconButton = { background: 'none', border: 'none', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
// Tasarımdaki Bembeyaz Gönder Butonu
const sendButton = { width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: '#fff', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' };
const legalText = { fontSize: '0.7rem', color: '#444', marginTop: '12px' };
