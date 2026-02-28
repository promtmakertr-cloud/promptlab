'use client';
import { useState, useEffect } from 'react';

// Kayan örnek yazılarımız (Marquee Slider)
const samplePrompts = [
  "Sürdürülebilir kahve dükkanı için sosyal medya planı oluştur...",
  "Python ile yılan oyunu yazmak için kodlama promptu...",
  "5 yaşındaki çocuklara uyku öncesi masal anlatan prompt...",
  "Yeni başlayanlar için SEO stratejisi ve blog takvimi...",
  "E-ticaret sitem için terk edilmiş sepet e-posta serisi..."
];

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Metni Kopyala');

  // Geri Dön / Ana Sayfa Butonu Fonksiyonu
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
      setInput(''); // İŞLEM BİTİNCE KUTUYU TEMİZLE (İstediğin özellik 1)
    } catch (err) {
      alert("Sistemde bir aksama oldu.");
    } finally {
      setLoading(false);
    }
  };

  // Sesle Yazma (Mikrofon) Fonksiyonu
  const handleVoiceTyping = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Tarayıcınız sesli yazmayı desteklemiyor. Lütfen Chrome veya Safari kullanın.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'tr-TR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + " " + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Ses tanıma hatası: ", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Kopyalama Efekti
  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopyStatus('Kopyalandı! ✓');
    setTimeout(() => setCopyStatus('Metni Kopyala'), 2000);
  };

  // Kayan Yazı (Marquee) Stili
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
      .pulse-mic { animation: pulse 1.5s infinite; }
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; color: #ff4444; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  return (
    <main style={container}>
      {/* Üst Bar (Logo ve Yeni Geri Butonu) */}
      <div style={topBar}>
        <div style={logoWrapper} onClick={handleReset} style={{cursor: 'pointer', ...logoWrapper}}>
          <img src="/logo.png" alt="Logo" style={miniLogo} />
          <span style={logoText}>PromptLab</span>
        </div>
        
        {/* GERİ DÖN BUTONU SADECE SONUÇ EKRANINDA GÖRÜNÜR */}
        {result && (
          <button onClick={handleReset} style={backButton}>
             ← Yeni Prompt
          </button>
        )}
      </div>
      
      <div style={contentArea}>
        {!result ? (
          /* ANA SAYFA (İlk Giriş) */
          <div style={heroSection}>
            <div style={logoFrame}>
               <img src="/logo.png" alt="Logo" style={centerLogo} />
            </div>
            <h2 style={heroTitle}>Size nasıl yardımcı olabilirim?</h2>
            <p style={heroSub}>Karmaşık fikirlerinizi profesyonel bir prompta dönüştürün.</p>
            
            {/* KAYAN ÖRNEKLER (Marquee Slider) */}
            <div style={marqueeContainer}>
              <div style={marqueeContent}>
                {samplePrompts.map((prompt, index) => (
                  <span 
                    key={index} 
                    style={sampleChip} 
                    onClick={() => setInput(prompt)}
                  >
                    {prompt}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* SONUÇ EKRANI */
          <div style={resultContainer}>
             <div style={aiResponseWrapper}>
                <div style={aiLabel}>ÜRETİLEN MASTER PROMPT</div>
                <div style={aiText}>{result}</div>
                
                {/* YENİ NESİL KOPYALA BUTONU */}
                <button onClick={handleCopy} style={copyBtn}>
                  {copyStatus}
                </button>
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
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }}}
          />
          
          <div style={actionButtons}>
            {/* MİKROFON BUTONU (Sesle Yazma) */}
            <button 
              onClick={handleVoiceTyping} 
              style={{...iconButton, color: isListening ? '#ff4444' : '#888'}}
              className={isListening ? "pulse-mic" : ""}
              title="Sesle Yaz"
            >
              🎙️
            </button>

            {/* GÖNDER BUTONU */}
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

// STİLLER (Güncellenmiş Premium Görünüm)
const container = { backgroundColor: '#0D0D0D', minHeight: '100vh', color: '#ECECEC', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', position: 'relative' };
const topBar = { padding: '20px 25px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const logoWrapper = { display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.8, transition: 'opacity 0.2s' };
const miniLogo = { height: '22px', width: 'auto', objectFit: 'contain' };
const logoText = { fontWeight: '700', fontSize: '1rem', letterSpacing: '1px' };

// Yeni Eklenen: Geri Dön Butonu Stili
const backButton = { backgroundColor: 'transparent', color: '#fff', border: '1px solid #333', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500', transition: 'all 0.2s' };

const contentArea = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', width: '100%' };
const heroSection = { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' };
const logoFrame = { marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const centerLogo = { width: '100%', maxWidth: '160px', height: 'auto', display: 'block', objectFit: 'contain' };
const heroTitle = { fontSize: '2.2rem', fontWeight: '600', marginBottom: '15px', color: '#fff' };
const heroSub = { color: '#888', fontSize: '1.1rem', maxWidth: '500px', marginBottom: '40px' };

// Yeni Eklenen: Kayan Yazı (Marquee) Stilleri
const marqueeContainer = { width: '100%', maxWidth: '800px', overflow: 'hidden', whiteSpace: 'nowrap', position: 'relative', padding: '10px 0', borderTop: '1px solid #222', borderBottom: '1px solid #222' };
const marqueeContent = { display: 'inline-block', animation: 'marquee 25s linear infinite', paddingLeft: '100%' };
const sampleChip = { display: 'inline-block', margin: '0 15px', padding: '10px 20px', backgroundColor: '#1A1A1A', borderRadius: '20px', color: '#A0A0A0', fontSize: '0.9rem', cursor: 'pointer', border: '1px solid #333', transition: 'all 0.2s ease' };

const resultContainer = { maxWidth: '850px', width: '100%', marginTop: '100px', marginBottom: '160px', display: 'flex', flexDirection: 'column', gap: '40px' };
const aiResponseWrapper = { alignSelf: 'center', width: '100%', backgroundColor: '#141414', padding: '30px', borderRadius: '16px', border: '1px solid #2A2A2A', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' };
const aiLabel = { fontSize: '0.75rem', fontWeight: '700', color: '#00D1FF', marginBottom: '20px', letterSpacing: '2px' };
const aiText = { fontSize: '1.15rem', lineHeight: '1.8', color: '#E0E0E0', whiteSpace: 'pre-wrap' };
const copyBtn = { marginTop: '25px', background: '#fff', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', transition: 'background 0.2s' };

const bottomArea = { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '30px 20px', background: 'linear-gradient(transparent, #0D0D0D 60%)', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const inputBox = { maxWidth: '800px', width: '100%', backgroundColor: '#1C1C1C', borderRadius: '30px', padding: '10px 15px', display: 'flex', alignItems: 'flex-end', border: '1px solid #333', boxShadow: '0 5px 20px rgba(0,0,0,0.3)' };
const inputField = { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.1rem', outline: 'none', resize: 'none', padding: '12px 15px', maxHeight: '200px', fontFamily: 'inherit' };

const actionButtons = { display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '5px' };
const iconButton = { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const sendButton = { width: '40px', height: '40px', borderRadius: '50%', border: 'none', backgroundColor: '#fff', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' };
const legalText = { fontSize: '0.7rem', color: '#555', marginTop: '15px' };
