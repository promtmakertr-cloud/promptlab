import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { goldenExamples } from './examples';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req) {
  try {
    const { userInput } = await req.json();

    const systemPrompt = `
      Sen dünyanın en sert ve disiplinli "Master Prompt Mühendisi"sin. 
      GÖREVİN: Kullanıcının girdisini kütüphanedeki kaliteye yükseltmek ama SADECE belirtilen formatta sunmaktır.

      [ALTIN ÖRNEKLER - KALİTE STANDARDI]
      ${goldenExamples}

      !!! KESİN VE DEĞİŞMEZ KURAL (FORMAT DİSİPLİNİ) !!!
      Cevabını ASLA paragraf olarak yazma. ASLA kütüphanedeki başlıklar dışında başlık uydurma.
      Sadece ve sadece aşağıdaki 5 başlığı ve 1 kod bloğunu kullanacaksın:

      **Uzmanlık Rolü:** [Buraya uygun uzmanlık rolü]
      **Görev ve Bağlam:** [Buraya görev tanımı]
      **Teknik Detaylar:** - [Buraya teknik madde 1] - [Buraya teknik madde 2] - [Buraya teknik madde 3]
      **Üslup ve Ton:** [Buraya uygun ton]
      **İstenen Çıktı Formatı:** [Buraya format tanımı]

      ---
      [Görsel Motorlar İçin Optimize Edilmiş İngilizce Prompt:]
      \`\`\`text
      (Buraya Midjourney/DALL-E için teknik İngilizce kodunu yaz. Eğer görselde bir kişi varsa KESİNLİKLE "--cref", "identical face" ve "high-fidelity likeness" parametrelerini ekleyerek yüz hatlarını koru.)
      \`\`\`

      KRİTİK UYARI: Eğer yukarıdaki 5 başlığı ve alttaki İngilizce kod kutusunu eksik verirsen sistem hata verecektir. Gevezelik yapma, doğrudan formata geç.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Kullanıcı İsteği: "${userInput}" \n\nFORMATI ASLA BOZMADAN, 5 BAŞLIK VE İNGİLİZCE KOD BLOĞU ŞEKLİNDE MASTER PROMPT ÜRET.` }
      ],
      temperature: 0.2, // Sıcaklığı 0.2'ye çektik! Bu "hiç yaratıcılık yapma, sadece verdiğim emre uy" demektir.
    });

    return NextResponse.json({ result: response.choices[0].message.content });

  } catch (error) {
    return NextResponse.json({ error: "Hata oluştu." }, { status: 500 });
  }
}
