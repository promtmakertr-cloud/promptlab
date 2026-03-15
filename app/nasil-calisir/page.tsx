'use client';

export default function HowItWorks() {
  return (
    <main style={container}>
      <div style={heroArea}>
        <div style={badge}>PROTOCOL_01</div>
        <h1 style={title}>Promptlab Sizin İçin Ne Yapar?</h1>
        <p style={sub}>Karmaşık fikirlerinizi saniyeler içinde mükemmel promptlara dönüştüren nöral bir köprü.</p>
      </div>

      <div style={videoSection}>
         <div style={videoOverlay}>
            <div style={playIcon}>▶</div>
            <div style={videoInfo}>PROMPTLAB_REHBERİ_v1.mp4</div>
            <div style={videoSub}>(Video Çok Yakında Eklenecek)</div>
         </div>
      </div>

      <div style={stepsGrid}>
        <div style={stepCard}>
          <div style={stepNum}>01</div>
          <h3 style={stepTitle}>Fikrini Özgürce Yaz</h3>
          <p style={stepText}>Teknik terimlere boğulma. Ne istediğini bir arkadaşına anlatır gibi doğal bir dille giriş kutusuna yaz.</p>
        </div>
        <div style={stepCard}>
          <div style={stepNum}>02</div>
          <h3 style={stepTitle}>Akıllı Dönüşüm</h3>
          <p style={stepText}>Sistemimiz cümleni anlamsal olarak analiz eder ve onu AI modellerinin en yüksek verimle anlayacağı 'Master' yapıya büründürür.</p>
        </div>
        <div style={stepCard}>
          <div style={stepNum}>03</div>
          <h3 style={stepTitle}>Aracını Seç ve Başla</h3>
          <p style={stepText}>Aşağıdaki Action Chip'lerden favori AI aracını seçtiğin an metnin otomatik kopyalanır ve doğrudan o platforma yönlendirilirsin.</p>
        </div>
      </div>
    </main>
  );
}

// 🔥 NASIL ÇALIŞIR STİLLERİ 🔥
const container = { backgroundColor: '#050505', minHeight: '100vh', color: '#fff', padding: '140px 40px 100px 40px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center' };
const heroArea = { textAlign: 'center' as const, marginBottom: '60px', maxWidth: '800px' };
const badge = { display: 'inline-block', color: '#00E5FF', fontSize: '0.7rem', fontWeight: 'bold' as const, letterSpacing: '4px', marginBottom: '20px', padding: '6px 12px', border: '1px solid rgba(0,229,255,0.3)', borderRadius: '20px', backgroundColor: 'rgba(0,229,255,0.05)' };
const title = { fontSize: '2.8rem', fontWeight: '800' as const, marginBottom: '20px', letterSpacing: '-1px' };
const sub = { color: '#888', fontSize: '1.15rem', lineHeight: '1.6' };
const videoSection = { width: '100%', maxWidth: '1000px', margin: '0 auto 80px auto', borderRadius: '30px', border: '1px solid rgba(131,56,236,0.3)', overflow: 'hidden', height: '450px', background: '#0a0a0a', position: 'relative' as const, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' };
const videoOverlay = { position: 'absolute' as const, inset: 0, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, rgba(131,56,236,0.1) 0%, transparent 60%)' };
const playIcon = { fontSize: '4rem', color: '#8338EC', marginBottom: '20px', filter: 'drop-shadow(0 0 20px rgba(131,56,236,0.6))', cursor: 'pointer' };
const videoInfo = { color: '#E0E0E0', letterSpacing: '2px', fontSize: '0.9rem', fontFamily: 'monospace' };
const videoSub = { color: '#555', fontSize: '0.8rem', marginTop: '10px' };
const stepsGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', width: '100%', maxWidth: '1100px' };
const stepCard = { padding: '40px', backgroundColor: '#0a0a0a', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.3s ease, borderColor 0.3s ease' };
const stepNum = { color: '#00E5FF', fontWeight: '900' as const, fontSize: '1.8rem', marginBottom: '20px', fontFamily: 'monospace', opacity: 0.8 };
const stepTitle = { fontSize: '1.4rem', marginBottom: '15px', fontWeight: '600' as const };
const stepText = { color: '#777', lineHeight: '1.7', fontSize: '0.95rem' };
