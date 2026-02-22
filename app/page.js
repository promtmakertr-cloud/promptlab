'use client';
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if(!input || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: input }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (err) { alert("Sistemde bir aksama oldu."); }
    finally { setLoading(false); }
  };

  return (
    <main style={container}>
      {/* Üst Logo ve İsim */}
      <div style={topBar}>
        <div style={logoWrapper}>
          <img src="/logo.png" alt="Logo" style={miniLogo} />
          <span style={logoText}>PromptLab</span>
        </div>
      </div>
      
      <div style={contentArea}>
        {!result && !loading ? (
          /* MERKEZDEKİ ANA LOGO - ÖLÇEK SORUNU GİDERİLDİ */
          <div style={heroSection}>
            <div style={logoFrame}>
               <img src="/logo.png" alt="Logo" style={centerLogo} />
            </div>
            <h2 style={heroTitle}>Size nasıl yardımcı olabilirim?</h2>
            <p style={heroSub}>Karmaşık fikirlerinizi profesyonel bir prompta dönüştürün.</p>
          </div>
        ) : (
          /* SONUÇ EKRANI */
          <div style={resultContainer}>
             <div style={userBubble}>{input}</div>
             <div style={aiResponseWrapper}>
                <div style={aiLabel}>ÜRETİLEN PROMPT</div>
                <div style={aiText}>{result || "Prompt hazırlanıyor..."}</div>
                {result && (
                  <button onClick={() => navigator.clipboard.writeText(result)} style={copyBtn}>
                    Metni Kopyala
                  </button>
                )}
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
          <button onClick={handleGenerate} disabled={loading} style={sendButton}>
            {loading ? '...' : '↑'}
          </button>
        </div>
        <div style={legalText}>PromptLab yanılabilir. Önemli bilgileri kontrol edin.</div>
      </div>
    </main>
  );
}

// GROK / GPT STİL SİSTEMİ
const container = { backgroundColor: '#0D0D0D', minHeight: '100vh', color: '#ECECEC', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', position: 'relative' };
const topBar = { padding: '20px 25px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 };
const logoWrapper = { display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.5 };
const miniLogo = { height: '18px', width: 'auto', objectFit: 'contain' };
const logoText = { fontWeight: '600', fontSize: '0.8rem', letterSpacing: '1px' };

const contentArea = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px' };

const heroSection = { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' };
const logoFrame = { marginBottom: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
// LOGO ÖLÇEĞİ: Yükseklik auto, genişlik sınırlandı, sünme engellendi
const centerLogo = { width: '100%', maxWidth: '160px', height: 'auto', display: 'block', objectFit: 'contain' };

const heroTitle = { fontSize: '2rem', fontWeight: '500', marginBottom: '10px' };
const heroSub = { color: '#666', fontSize: '1rem', maxWidth: '450px' };

const resultContainer = { maxWidth: '750px', width: '100%', marginTop: '80px', marginBottom: '160px', display: 'flex', flexDirection: 'column', gap: '40px' };
const userBubble = { alignSelf: 'flex-end', backgroundColor: '#2F2F2F', padding: '15px 25px', borderRadius: '22px', maxWidth: '85%', fontSize: '1rem' };
const aiResponseWrapper = { alignSelf: 'flex-start', width: '100%' };
const aiLabel = { fontSize: '0.7rem', fontWeight: 'bold', color: '#444', marginBottom: '10px', letterSpacing: '1px' };
const aiText = { fontSize: '1.1rem', lineHeight: '1.8', color: '#D1D1D1', whiteSpace: 'pre-wrap' };
const copyBtn = { marginTop: '20px', background: '#1A1A1A', border: '1px solid #333', color: '#888', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' };

const bottomArea = { position: 'fixed', bottom: 0, left: 0, right: 0, padding: '30px 20px', background: 'linear-gradient(transparent, #0D0D0D 40%)', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const inputBox = { maxWidth: '750px', width: '100%', backgroundColor: '#212121', borderRadius: '26px', padding: '10px 15px', display: 'flex', alignItems: 'flex-end', border: '1px solid #333' };
const inputField = { flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.05rem', outline: 'none', resize: 'none', padding: '12px', maxHeight: '200px', fontFamily: 'inherit' };
const sendButton = { width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: '#fff', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '4px' };
const legalText = { fontSize: '0.65rem', color: '#444', marginTop: '15px' };
