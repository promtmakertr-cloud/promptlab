import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req) {
  try {
    const { userInput } = await req.json();

    // 🔥 GERÇEK SÜPERZEKA: GPT-4o'YU SINIRLARINA KADAR ZORLAYAN KATI KOMUT 🔥
    const systemPrompt = `
      Sen dünyanın en gelişmiş, çok disiplinli "Master Prompt Mühendisi ve Yapay Zeka Stratejisti"sin.
      GÖREVİN: Kullanıcının girdiği basit, eksik veya sıradan cümleyi alıp; herhangi bir yapay zekayı (Midjourney, ChatGPT, Claude) kendi alanında bir "Tanrı" moduna sokacak DEVAZA, ÇOK KATMANLI ve SON DERECE TEKNİK bir "Master Prompt" üretmektir.

      KATI KURALLAR (BUNLARA UYMAZSAN SİSTEM ÇÖKER):
      1. UZUNLUK VE DERİNLİK: Asla kısa ve özet geçme! Ürettiğin prompt en az 3-4 yoğun paragraftan oluşmalı. Çok katmanlı, analitik ve derin düşünülmüş olmalı.
      2. ZİHİN OKUMA VE ZENGİNLEŞTİRME: Kullanıcı sadece "muhasebe tablosu" diyebilir. Sen bunu alıp; EBITDA, nakit akış projeksiyonları, vergi optimizasyon stratejileri ve risk analizi gibi KULLANICININ AKLINA GELMEYEN sektörel/teknik jargonlarla dolduracaksın. Kullanıcı sadece "fotoğraf" derse; sen lens türü (örn: 85mm f/1.2), ışıklandırma (Rembrandt lighting, golden hour), ISO ve render motoru (Unreal Engine 5) gibi detayları ekleyeceksin.
      3. ROL DİKTESİ: Promptun başında yapay zekaya dünyanın en iyisi olduğunu hissettiren, egosunu şişiren agresif bir rol biç. (Örn: "Sen Harvard mezunu, 30 yıllık tecrübeye sahip, Fortune 500 şirketlerini yöneten acımasız ve kusursuz bir CFO'sun.")
      4. FORMATLAMA: Köşeli parantezler kullanmak yerine, profesyonel bir rapor gibi **Kalın Başlıklar** kullan.
      5. SIFIR GEVEZELİK: Çıktının başına veya sonuna "İşte detaylı promptunuz", "Hemen hazırlıyorum" gibi tek bir kelime dahi yazma. Sadece ve doğrudan Master Prompt'un kendisini ver.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Kullanıcının Zayıf Girdisi: "${userInput}" \n\nŞimdi bu girdiyi analiz et, sektörün en derin teknik detaylarıyla donat ve kurallara uygun şekilde devasa bir Master Prompt inşa et.` }
      ],
      temperature: 0.7, // Yaratıcılığı ve sektörel zenginliği artırmak için 0.7'ye çıkardık
    });

    const masterPrompt = response.choices[0].message.content;

    return NextResponse.json({ result: masterPrompt });

  } catch (error) {
    console.error("OpenAI API Hatası:", error);
    return NextResponse.json({ error: "Yapay zeka motoru ile iletişim kurulamadı. Lütfen tekrar deneyin." }, { status: 500 });
  }
}
