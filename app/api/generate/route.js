import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { goldenExamples } from './examples'; // Yeni oluşturduğumuz kütüphaneyi buraya çağırıyoruz!

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req) {
  try {
    const { userInput } = await req.json();

    // 🔥 SÜPERZEKA META-PROMPT 🔥
    const systemPrompt = `
      Sen dünyanın en gelişmiş, çok disiplinli "Master Prompt Mühendisi ve Yapay Zeka Stratejisti"sin.
      GÖREVİN: Kullanıcının girdiği basit, eksik veya sıradan cümleyi alıp; herhangi bir yapay zekayı (Midjourney, ChatGPT, vb.) kendi alanında "Tanrı" moduna sokacak DEVAZA, ÇOK KATMANLI ve SON DERECE TEKNİK bir "Master Prompt" üretmektir.

      ÖĞRENME VE KLONLAMA (EN ÖNEMLİ KURAL):
      Aşağıda senin için "Altın Standart" olarak belirlenmiş master prompt örnekleri vardır. Kendi üreteceğin promptun kalitesi, vizyonu, detay seviyesi ve formatı KESİNLİKLE bu örneklere benzemelidir. Onları analiz et ve kalite standardını kopyala.
      
      [ALTIN ÖRNEKLER BAŞLANGICI]
      ${goldenExamples}
      [ALTIN ÖRNEKLER BİTİŞİ]

      KATI KURALLAR:
      1. UZUNLUK VE DERİNLİK: Asla kısa ve özet geçme! Çok katmanlı, analitik ve derin düşünülmüş olmalı.
      2. ZİHİN OKUMA: Kullanıcının aklına gelmeyen teknik terimleri (lens türü, finansal rasyolar, yazılım algoritmaları vb.) sen ekle.
      3. ROL DİKTESİ: Promptun başında yapay zekaya uzmanlığını hissettiren profesyonel bir rol biç.
      4. FORMATLAMA: Parantezler yerine şık **Kalın Başlıklar** kullan.
      5. SIFIR GEVEZELİK: Çıktının başına veya sonuna asla kendi cümlelerini ("İşte promptunuz" vs.) ekleme. Sadece Master Prompt'u ver.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Kullanıcının Zayıf Girdisi: "${userInput}" \n\nŞimdi bu girdiyi analiz et, Altın Örneklerdeki kaliteye ve formata bakarak devasa bir Master Prompt inşa et.` }
      ],
      temperature: 0.7, 
    });

    const masterPrompt = response.choices[0].message.content;

    return NextResponse.json({ result: masterPrompt });

  } catch (error) {
    console.error("OpenAI API Hatası:", error);
    return NextResponse.json({ error: "Yapay zeka motoru ile iletişim kurulamadı. Lütfen tekrar deneyin." }, { status: 500 });
  }
}
