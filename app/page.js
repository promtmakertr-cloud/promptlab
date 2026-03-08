'use client';
import { useState, useEffect } from 'react';

// 🔥 KISALTILMIŞ VİZYONER PROMPT HAVUZU 🔥
const allPrompts = [
  "Sinema | Wong Kar-wai estetiğinde neon sokaklar ve melankolik bir sahne.",
  "Ürün Tasarımı | Mental sağlık uygulaması için UX akışı ve backend mimarisi.",
  "Reklam | Premium su markası için buz gibi ferahlık hissini yansıtan sinematik konsept.",
  "Kripto | Death cross formasyonunu analiz ederek risk odaklı portföy stratejisi.",
  "Çocuk Hikâyesi | Mini Kedi Mavi'nin balonla yaşadığı pedagojik olarak uygun maceraları.",
  "Felsefe | Öğrenilmiş benlik ile gerçek benlik arasındaki çatışmayı inceleyen makale.",
  "Müzik | Aşık Mahzuni Şerif ekolünden ilham alan modern Türk halk müziği.",
  "DevOps | Yüksek trafikli bir platform için mikroservis tabanlı DevOps altyapısı.",
  "Pazarlama | Karar vericileri hedefleyen etkili B2B cold email sekansları.",
  "Hukuk | GDPR standartlarına tam uyumlu kapsamlı veri gizliliği sözleşmesi.",
  "Senaryo | Rick and Morty tarında varoluşsal krizi anlatan mizahi bir hikâye.",
  "Prompt Engineering | Karmaşık bir fikri analiz edip master prompta dönüştür.",
  "Startup | SaaS ürünü için yatırımcıları etkileyecek pitch deck taslağı.",
  "UX Yazımı | Mobil uygulama için net ve sade onboarding metinleri.",
  "Marka Stratejisi | Teknoloji markası için konumlandırma, slogan ve marka hikâyesi.",
  "İçerik Üretimi | YouTube kanalı için dikkat çekici video başlıkları.",
  "Kod | Gerçek zamanlı veri işleyen ölçeklenebilir Node.js mikroservisi.",
  "Veri Analizi | Satış verilerini analiz ederek büyüme fırsatlarını raporla.",
  "UI Tasarımı | Minimal ve modern bir AI dashboard arayüzü.",
  "Yazarlık | Distopik bir gelecekte geçen etkileyici bilimkurgu hikâyesi.",
  "SEO | Teknoloji blogu için yüksek trafik potansiyeline sahip içerik planı.",
  "Sunum | Karmaşık bir konuyu yöneticilere anlatan sunum yapısı.",
  "Eğitim | Yeni başlayanlar için yapay zekâ kavramlarını basitçe anlat.",
  "Finans | Startup için sürdürülebilir gelir modeli ve finansal projeksiyon.",
  "Strateji | Yeni bir dijital ürünün pazara giriş stratejisini planla."
];

const typewriterExamples = [
  "Wong Kar-wai estetiğinde sahne kurgula",
  "Premium su markası için reklam konsepti",
  "Mental sağlık uygulaması için UX tasarla",
  "Kripto portföy stratejisi geliştir",
  "Mini Kedi Mavi'nin maceralarını yaz",
  "Etkili B2B cold email sekansları",
  "Mikroservis tabanlı DevOps mimarisi",
  "Öğrenilmiş benlik çatışmasını incele",
  "Aşık Mahzuni motiflerini modern yorumla",
  "Teknoloji markası için slogan bul",
  "Node.js mikroservisi oluştur",
  "GDPR uyumlu veri sözleşmesi hazırla",
];

const fontSizes = ['0.85rem','0.95rem','1.05rem','1.1rem'];

const parsePromptData = (fullText)=>{
  if(!fullText)return{category:'',promptText:''};
  const match=fullText.match(/^([^|]*)\|\s*(.*)$/);
  if(match)return{category:match[1].trim(),promptText:match[2].trim()};
  return{category:'',promptText:fullText};
};

const loadingMessages=[
  "🧠 Fikriniz yapay zeka tarafından analiz ediliyor...",
  "📚 Master Kütüphane standartlarına uyarlanıyor...",
  "⚙️ Sektörel jargon ve teknik detaylar ekleniyor...",
  "✨ Son rötuşlar yapılıyor, promptunuz hazır olmak üzere..."
];

// SVG ICONLAR
const IconChatGPT=<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>;
const IconGemini=<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C12 6 6 12 0 12c6 0 12 6 12 12 0-6 6-12 12-12-6 0-12-6-12-12z"/></svg>;
const IconClaude=<svg viewBox="0 0 24 24" width="16" height="16"><rect width="24" height="24" rx="4" stroke="currentColor" fill="none"/></svg>;
const IconPerplexity=<svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="10" stroke="currentColor" fill="none"/></svg>;
const IconCopilot=<svg viewBox="0 0 24 24" width="16" height="16"><rect x="2" y="2" width="8" height="8"/><rect x="14" y="2" width="8" height="8"/></svg>;
const IconMidjourney=<svg viewBox="0 0 24 24" width="16" height="16"><path d="M2 20h20"/></svg>;
const IconLeonardo=<svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="5"/></svg>;
const IconAdobe=<svg viewBox="0 0 24 24" width="16" height="16"><polygon points="12,2 22,22 2,22"/></svg>;
const IconCanva=<svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="10"/></svg>;
const IconCopy=<svg viewBox="0 0 24 24" width="16" height="16"><rect x="8" y="8" width="12" height="12"/></svg>;

export default function Home(){

const[ input,setInput ]=useState('')
const[ result,setResult ]=useState('')
const[ loading,setLoading ]=useState(false)
const[ copyStatus,setCopyStatus ]=useState('Metni Kopyala')
const[ submittedPrompt,setSubmittedPrompt ]=useState('')
const[ isVisual,setIsVisual ]=useState(false)

const handleCopy=()=>{
navigator.clipboard.writeText(result)
setCopyStatus('Kopyalandı ✓')
setTimeout(()=>setCopyStatus('Metni Kopyala'),2000)
}

const AIPlatformButton=({url,icon,name})=>{
const handleRedirect=(e)=>{
e.preventDefault()
navigator.clipboard.writeText(result)

const link=document.createElement('a')
link.href=url
link.target='_blank'
link.rel='noopener noreferrer'
document.body.appendChild(link)
link.click()
document.body.removeChild(link)
}

return(
<button className="ai-brand-btn" onClick={handleRedirect}>
{icon}<span>{name}</span>
</button>
)
}

return(
<main style={{background:"#050505",minHeight:"100vh",color:"#fff",padding:"40px"}}>

<h1>PromptLab</h1>

<textarea
value={input}
onChange={(e)=>setInput(e.target.value)}
placeholder="Ne oluşturmak istiyorsun?"
style={{width:"100%",height:"120px"}}
/>

<button onClick={()=>setResult("Demo Prompt")}>
Prompt Oluştur
</button>

{result&&(
<div style={{marginTop:"40px"}}>

<pre>{result}</pre>

<button onClick={handleCopy}>
{IconCopy} {copyStatus}
</button>

<div style={{display:"flex",gap:"10px",marginTop:"20px",flexWrap:"wrap"}}>

{!isVisual?(
<>
<AIPlatformButton url="https://chatgpt.com" icon={IconChatGPT} name="ChatGPT"/>
<AIPlatformButton url="https://gemini.google.com" icon={IconGemini} name="Gemini"/>
<AIPlatformButton url="https://claude.ai" icon={IconClaude} name="Claude"/>
<AIPlatformButton url="https://www.perplexity.ai" icon={IconPerplexity} name="Perplexity"/>
<AIPlatformButton url="https://copilot.microsoft.com" icon={IconCopilot} name="Copilot"/>
</>
):(
<>
<AIPlatformButton url="https://discord.com/channels/@me" icon={IconMidjourney} name="Midjourney"/>
<AIPlatformButton url="https://chatgpt.com" icon={IconChatGPT} name="DALL-E 3"/>
<AIPlatformButton url="https://leonardo.ai" icon={IconLeonardo} name="Leonardo"/>
<AIPlatformButton url="https://firefly.adobe.com" icon={IconAdobe} name="Adobe Firefly"/>
<AIPlatformButton url="https://www.canva.com" icon={IconCanva} name="Canva"/>
</>
)}

</div>
</div>
)}

</main>
)
}
