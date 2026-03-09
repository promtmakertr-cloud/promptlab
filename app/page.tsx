'use client';

import { useState, useEffect } from 'react';

const allPrompts = [
"Sinema | Wong Kar-wai estetiğinde neon sokaklar ve melankolik bir sahne.",
"Ürün Tasarımı | Mental sağlık uygulaması için UX akışı ve backend mimarisi.",
"Reklam | Premium su markası için buz gibi ferahlık hissini yansıtan sinematik konsept.",
"Kripto | Death cross formasyonunu analiz ederek risk odaklı portföy stratejisi.",
"Çocuk Hikâyesi | Mini Kedi Mavi'nin balonla yaşadığı pedagojik olarak uygun maceraları.",
"Felsefe | Öğrenilmiş benlik ile gerçek benlik arasındaki çatışmayı inceleyen makale.",
"DevOps | Yüksek trafikli bir platform için mikroservis tabanlı DevOps altyapısı.",
"Pazarlama | Karar vericileri hedefleyen etkili B2B cold email sekansları.",
"Startup | SaaS ürünü için yatırımcıları etkileyecek pitch deck taslağı.",
"UX Yazımı | Mobil uygulama için net ve sade onboarding metinleri.",
"Marka Stratejisi | Teknoloji markası için konumlandırma ve slogan üret.",
"SEO | Teknoloji blogu için yüksek trafik potansiyeline sahip içerik planı."
];

const typewriterExamples = [
"Wong Kar-wai estetiğinde sahne kurgula",
"Premium su markası için reklam konsepti",
"Mental sağlık uygulaması için UX tasarla",
"Kripto portföy stratejisi geliştir",
"Etkili B2B cold email sekansları",
"Mikroservis tabanlı DevOps mimarisi",
"Teknoloji markası için slogan bul",
"Node.js mikroservisi oluştur"
];

export default function Home() {

const [input,setInput] = useState('');
const [result,setResult] = useState('');
const [loading,setLoading] = useState(false);
const [typewriterText,setTypewriterText] = useState('');
const [typeIndex,setTypeIndex] = useState(0);
const [isDeleting,setIsDeleting] = useState(false);

useEffect(()=>{

const text = typewriterExamples[typeIndex];
let speed = isDeleting ? 40 : 60;

if(!isDeleting && typewriterText === text){
setTimeout(()=>setIsDeleting(true),2000);
return;
}

if(isDeleting && typewriterText === ''){
setIsDeleting(false);
setTypeIndex((prev)=>(prev+1)%typewriterExamples.length);
return;
}

const timeout = setTimeout(()=>{
setTypewriterText(prev =>
isDeleting ? prev.slice(0,-1) : text.slice(0,prev.length+1)
);
},speed);

return ()=>clearTimeout(timeout);

},[typewriterText,isDeleting,typeIndex]);


const handleGenerate = async ()=>{

if(!input.trim()) return;

setLoading(true);
setResult('');

try{

const res = await fetch('/api/generate',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({userInput:input})
});

const reader = res.body?.getReader();
const decoder = new TextDecoder();

if(!reader){
setLoading(false);
return;
}

let done = false;

while(!done){

const {value,done:doneReading} = await reader.read();
done = doneReading;

if(value){

const chunk = decoder.decode(value);
setResult(prev=>prev+chunk);

}

}

}catch(err){

alert("Hata oluştu");

}

setLoading(false);

};


const handleCopy = ()=>{

navigator.clipboard.writeText(result);

};


return (

<main style={{
background:'#050505',
minHeight:'100vh',
color:'#eee',
fontFamily:'Inter, sans-serif',
display:'flex',
flexDirection:'column',
alignItems:'center',
justifyContent:'center',
padding:'40px'
}}>


<img src="/logo.png" style={{width:160,marginBottom:30}}/>

<h1 style={{
fontSize:'2rem',
marginBottom:10
}}>
Fikirlerini Güçlü Promptlara Dönüştür
</h1>

<p style={{
opacity:0.6,
marginBottom:40
}}>
Metni yaz. Optimize edilmiş promptu al.
</p>


<textarea
value={input}
onChange={(e)=>setInput(e.target.value)}
placeholder={`Ne oluşturmak istiyorsun?\nÖrn: "${typewriterText}"`}
style={{
width:'100%',
maxWidth:700,
height:80,
background:'#0c0c0c',
border:'1px solid #333',
borderRadius:12,
padding:16,
color:'#fff',
resize:'none',
marginBottom:20
}}
/>


<button
onClick={handleGenerate}
disabled={loading}
style={{
padding:'12px 30px',
borderRadius:30,
border:'none',
background:'#fff',
color:'#000',
cursor:'pointer',
fontWeight:'bold',
marginBottom:30
}}
>
{loading ? "Üretiliyor..." : "Prompt Oluştur"}
</button>


{result && (

<div style={{
width:'100%',
maxWidth:700,
background:'#0c0c0c',
border:'1px solid #222',
borderRadius:16,
padding:20
}}>

<div style={{opacity:0.5,fontSize:12,marginBottom:10}}>
MASTER PROMPT
</div>

<pre style={{
whiteSpace:'pre-wrap',
lineHeight:1.6,
fontFamily:'monospace'
}}>
{result}
</pre>

<button
onClick={handleCopy}
style={{
marginTop:20,
padding:'8px 20px',
borderRadius:8,
border:'none',
cursor:'pointer'
}}
>
Kopyala
</button>

</div>

)}

</main>

);

}