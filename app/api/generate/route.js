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
      GÖREVİN: Kullanıcının girdisini kütüphanedeki kaliteye yükseltirken, KİMLİK KORUMA kurallarına uymaktır.

      [ALTIN ÖRNEKLER - KALİTE STANDARDI]
      ${goldenExamples}

      KİMLİK KORUMA (HAYATİ ANA KOMUT):
      Kullanıcı bir görsel istiyorsa, oluşturacağın prompt KESİNLİKLE kişinin yüz hatlarını, kemik yapısını ve karakteristik kimliğini %100 korumalıdır. 
      - Yüzü asla değiştirmemesi gerektiğini, "identical face", "high-fidelity likeness" ve "preserve facial identity" gibi terimlerle vurgula.
      - İngilizce teknik kod kısmında mutlaka yüz koruma parametrelerini kullan.

      MANDATORY FORMAT (KESİN ŞABLON):
      Cevabını SADECE şu 5 ana başlık ve alttaki kod bloğu şeklinde ver:

      **Uzmanlık Rolü:** [Uzmanlık rolü]
      **Görev ve Bağlam:** [Görev tanımı]
      **Teknik Detaylar:** - [Teknik madde 1]
      - [Teknik madde 2]
      - [Teknik madde 3]
      **Üslup ve Ton:** [Ton]
      **İstenen Çıktı Formatı:** [Format]

      ---
      [Görsel Motorlar İçin Optimize Edilmiş İngilizce Prompt:]
      \`\`\`text
      (Buraya görseli üretecek AI için teknik İngilizce kodu yaz. Kişi yüzü korunacaksa mutlaka "--cref" veya "identity preservation" mantığını ekle)
      \`\`\`

      DİSİPLİN NOTU: Asla paragraf yapma. Asla ekstra başlık ekleme. Sıfır gevezelik.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Girdi: "${userInput}" \n\nKimliği koruyarak ve formatı bozmadan Master Prompt'u inşa et.` }
      ],
      temperature: 0.4, // Disiplini maksimuma çıkarmak için sıcaklığı biraz daha düşürdük.
    });

    return NextResponse.json({ result: response.choices[0].message.content });

  } catch (error) {
    return NextResponse.json({ error: "Hata oluştu." }, { status: 500 });
  }
}
