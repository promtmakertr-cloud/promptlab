'use client';
import { useState, useEffect } from 'react';

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

const parsePromptData = (fullText) => {
  if (!fullText) return { category: '', promptText: '' };
  const match = fullText.match(/^([^|]*)\|\s*(.*)$/); 
  if (match) return { category: match[1].trim(), promptText: match[2].trim() };
  return { category: '', promptText: fullText };
};

export default function Home() {

  const [input,setInput] = useState('')
  const [result,setResult] = useState('')
  const [loading,setLoading] = useState(false)
  const [copyStatus,setCopyStatus] = useState('Metni Kopyala')
  const [submittedPrompt,setSubmittedPrompt] = useState('')
  const [isVisual,setIsVisual] = useState(false)

  const handleGenerate = async () => {

    if(!input.trim() || loading) return

    setLoading(true)
    setSubmittedPrompt(input)
    setResult('')
    setIsVisual(false)

    const currentInput = input
    setInput('')

    try{

      const res = await fetch('/api/generate',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({userInput:currentInput})
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let done = false
      let fullContent = ""

      while(!done){

        const {value,done:readerDone} = await reader.read()
        done = readerDone

        if(value){

          const chunk = decoder.decode(value)
          fullContent += chunk
          setResult(prev => prev + chunk)

          if(fullContent.includes("```text")) setIsVisual(true)

        }

      }

    }catch(err){

      alert(err.message)

    }finally{

      setLoading(false)

    }

  }

  const handleCopy = () => {

    navigator.clipboard.writeText(result)
    setCopyStatus("Kopyalandı ✓")

    setTimeout(()=>{

      setCopyStatus("Metni Kopyala")

    },2000)

  }

  const AIButton = ({url,name}) => (

    <button
      onClick={()=>{

        navigator.clipboard.writeText(result)
        window.open(url,'_blank','noopener,noreferrer')

      }}
      style={{
        background:'#141414',
        border:'1px solid #333',
        padding:'8px 14px',
        borderRadius:'10px',
        cursor:'pointer',
        color:'#fff',
        fontSize:'0.85rem'
      }}
    >

      {name}

    </button>

  )

  return (

    <main style={{background:"#050505",minHeight:"100vh",color:"#fff",padding:"40px"}}>

      {!submittedPrompt && (

        <>

        <h1>PromptLab</h1>

        <textarea
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Ne oluşturmak istiyorsun?"
          style={{width:"100%",height:"120px"}}
        />

        <br/><br/>

        <button onClick={handleGenerate}>
          Prompt Oluştur
        </button>

        </>

      )}

      {submittedPrompt && (

        <div>

          <h3>ÜRETİLEN MASTER PROMPT</h3>

          <pre>{result}</pre>

          <button onClick={handleCopy}>
            {copyStatus}
          </button>

          <div style={{marginTop:"20px",display:"flex",gap:"10px",flexWrap:"wrap"}}>

            {!isVisual ? (

              <>
                <AIButton url="https://chatgpt.com" name="ChatGPT"/>
                <AIButton url="https://gemini.google.com" name="Gemini"/>
                <AIButton url="https://claude.ai" name="Claude"/>
                <AIButton url="https://www.perplexity.ai" name="Perplexity"/>
                <AIButton url="https://copilot.microsoft.com" name="Copilot"/>
              </>

            ) : (

              <>
                <AIButton url="https://discord.com/channels/@me" name="Midjourney"/>
                <AIButton url="https://chatgpt.com" name="DALL-E"/>
                <AIButton url="https://leonardo.ai" name="Leonardo"/>
                <AIButton url="https://firefly.adobe.com" name="Adobe Firefly"/>
                <AIButton url="https://www.canva.com" name="Canva"/>
              </>

            )}

          </div>

        </div>

      )}

    </main>

  )

}
