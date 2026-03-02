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
      Sen dünyanın en disiplinli "Master Prompt Mühendisi"sin. 
      GÖREVİN: Kullanıcının girdisini kütüphanedeki kaliteye yükseltmek.

      [ALTIN ÖRNEKLER - KALİTE STANDARDI]
      ${goldenExamples}

      MANDATORY FORMAT (BU FORMATIN DIŞINA ÇIKARSAN SİSTEM HATA VERİR):
      Cevabını SADECE şu 5 ana başlık ve en alttaki kod bloğu şeklinde ver. Başka hiçbir başlık uydurma.

      **Uzmanlık Rolü:** [Buraya uzmanlık rolünü yaz]
      **Görev ve Bağlam:** [Buraya görev tanımını yaz]
      **Teknik Detaylar:** - [Buraya teknik madde 1]
      - [Buraya teknik madde 2]
      - [Buraya teknik madde 3]
      **Üslup ve Ton:** [Buraya tonu yaz]
      **İstenen Çıktı Formatı:** [Buraya formatı yaz]

      ---
      [Görsel Motorlar İçin Optimize Edilmiş İngilizce Prompt:]
      \`\`\`text
      (Buraya Midjourney/DALL-E için teknik İngilizce kodunu yaz)
      \`\`\`

      NOT: Asla "İşte promptunuz" deme. Asla paragraf yapma. Kütüphanedeki teknik bilgileri kullan ama SADECE yukarıdaki şablona sadık kal.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Girdi: "${userInput}" \n\nFormatı bozmadan Master Prompt'u inşa et.` }
      ],
      temperature: 0.5, // Yaratıcılığı biraz azaltıp disiplini (formatı) artırdık.
    });

    return NextResponse.json({ result: response.choices[0].message.content });

  } catch (error) {
    return NextResponse.json({ error: "Hata oluştu." }, { status: 500 });
  }
}
