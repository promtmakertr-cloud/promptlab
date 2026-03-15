'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header style={headerStyle}>
      {/* LOGO TEKRAR SOL ÜSTTE */}
      <a href="/" style={logoLink}>
        <img src="/logo.png" alt="Logo" style={miniLogo} />
      </a>

      {/* HAMBURGER BUTONU */}
      <button onClick={() => setIsOpen(!isOpen)} style={menuButton}>
        <div style={{ ...line, transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></div>
        <div style={{ ...line, opacity: isOpen ? 0 : 1 }}></div>
        <div style={{ ...line, transform: isOpen ? 'rotate(-45deg) translate(-5px, 5px)' : 'none' }}></div>
      </button>

      {/* SIDE DRAWER (YAN MENÜ) */}
      {isOpen && (
        <div style={overlay} onClick={() => setIsOpen(false)}>
          <div style={drawer} onClick={(e) => e.stopPropagation()}>
            <div style={drawerHeader}>
              <img src="/logo.png" alt="Logo" style={{ height: '24px' }} />
              <button onClick={() => setIsOpen(false)} style={closeBtn}>✕</button>
            </div>
            
            <nav style={nav}>
              <a href="/" style={navLink}>Ana Sayfa</a>
              <Link href="/nasil-calisir" onClick={() => setIsOpen(false)} style={navLink}>Nasıl Çalışır?</Link>
              
              <div style={navDivider}></div>
              
              <div style={navLinkDisabled}>Prompt Kütüphanesi <span style={tag}>Yakında</span></div>
              <div style={navLinkDisabled}>Favorilerim <span style={tag}>Yakında</span></div>
              <div style={navLinkDisabled}>API Erişimi <span style={tag}>Yakında</span></div>
            </nav>
            
            {/* GEREKSİZ SİSTEM YAZILARI SİLİNDİ SADECE VERSİYON KALDI */}
            <div style={drawerFooter}>
              PROMPTLAB v1.0
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// 🔥 HEADER STİLLERİ 🔥
const headerStyle = { position: 'fixed' as const, top: 0, left: 0, right: 0, padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 9000, background: 'linear-gradient(to bottom, rgba(5,5,5,0.9), transparent)', backdropFilter: 'blur(5px)' };
const logoLink = { display: 'flex', alignItems: 'center', cursor: 'pointer' };
const miniLogo = { height: '22px', width: 'auto', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.2))' };
const menuButton = { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column' as const, gap: '6px', padding: '5px', zIndex: 10001 };
const line = { width: '26px', height: '2px', backgroundColor: '#fff', transition: 'all 0.3s ease', borderRadius: '2px' };
const overlay = { position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', justifyContent: 'flex-end' };
const drawer = { width: '320px', maxWidth: '85vw', height: '100vh', backgroundColor: '#080808', borderLeft: '1px solid rgba(131,56,236,0.2)', padding: '40px 30px', display: 'flex', flexDirection: 'column' as const, boxShadow: '-20px 0 50px rgba(0,0,0,0.8)', animation: 'slideIn 0.3s ease forwards' };
const drawerHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' };
const closeBtn = { background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', padding: '5px' };
const nav = { display: 'flex', flexDirection: 'column' as const, gap: '25px', flex: 1 };
const navLink = { color: '#E0E0E0', fontSize: '1.2rem', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s ease', letterSpacing: '0.5px' };
const navDivider = { height: '1px', background: 'rgba(255,255,255,0.05)', margin: '10px 0' };
const navLinkDisabled = { color: '#555', fontSize: '1.1rem', cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const tag = { fontSize: '0.65rem', padding: '4px 8px', borderRadius: '6px', background: 'rgba(131, 56, 236, 0.15)', color: '#8338EC', fontWeight: 'bold' as const, letterSpacing: '1px' };
const drawerFooter = { fontSize: '0.8rem', color: '#444', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', letterSpacing: '1px' };
