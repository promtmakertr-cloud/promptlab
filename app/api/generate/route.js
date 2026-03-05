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

      !!! HAYATİ KURAL (GÖRSEL VS. METİN AYRIMI) !!!
      Kullanıcının isteğini analiz et. 
      - İstek "Metin, Senaryo, Strateji, Kariyer, Yazılım, İş Planı, Sunum, SEO, E-posta vb." gibi GÖRSEL OLMAYAN bir konudaysa SADECE 5 Türkçe başlığı ver ve DUR. Kesinlikle İngilizce kod bloğu EKLEME.
      - Eğer istek "Fotoğrafçılık, 3D Render, Çizim, Logo, Karikatür, Görsel Tasarım, Sinematik Sahne vb." gibi GÖRSEL ÜRETİMİ gerektiriyorsa, 5 Türkçe başlığın altına mutlaka İngilizce kod bloğunu ekle.

      [FORMAT 1: GÖRSEL OLMAYAN İŞLER İÇİN (Sadece 5 Başlık)]
      **Uzmanlık Rolü:** [Buraya uygun uzmanlık rolü]
      **Görev ve Bağlam:** [Buraya görev tanımı]
      **Teknik Detaylar:** - [Buraya teknik madde 1] - [Buraya teknik madde 2] - [Buraya teknik madde 3]
      **Üslup ve Ton:** [Buraya uygun ton]
      **İstenen Çıktı Formatı:** [Buraya format tanımı]

      [FORMAT 2: GÖRSEL İŞLER İÇİN (5 Başlık + İngilizce Kod Kutusu)]
      **Uzmanlık Rolü:** ...
      **Görev ve Bağlam:** ...
      **Teknik Detaylar:** ...
      **Üslup ve Ton:** ...
      **İstenen Çıktı Formatı:** ...

      ---
      [Görsel Motorlar İçin Optimize Edilmiş İngilizce Prompt:]
      \`\`\`text
      (Buraya Midjourney/DALL-E için teknik İngilizce kodunu yaz. Eğer görselde bir kişi varsa KESİNLİKLE "--cref", "identical face" ve "high-fidelity likeness" parametrelerini ekleyerek yüz hatlarını koru.)
      \`\`\`

      KRİTİK UYARI: Kendi kendine yeni başlık uydurma. Gevezelik yapma, isteğin TÜRÜNE UYGUN (Görsel veya Metin) doğrudan formata geç.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        { role: "system", content: systemPrompt },
        // KULLANICI MESAJINI DA GÜNCELLEDİK! Artık her defasında İngilizce kod bloğu emretmiyoruz.
        { role: "user", content: `Kullanıcı İsteği: "${userInput}" \n\nFORMATI ASLA BOZMADAN, İSTEĞİN TÜRÜNE UYGUN (Görselse İngilizce kodlu, değilse sadece 5 başlık) MASTER PROMPT ÜRET.` }
      ],
      temperature: 0.2, // Sıcaklığı 0.2'de tutuyoruz, disiplinden taviz yok.
    });

    return NextResponse.json({ result: response.choices[0].message.content });

  } catch (error) {
    return NextResponse.json({ error: "Hata oluştu." }, { status: 500 });
  }
}
