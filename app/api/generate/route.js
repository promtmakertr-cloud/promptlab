import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { goldenExamples } from './examples';

const TONE_INSTRUCTIONS = {
  professional: 'Profesyonel, resmi ve iş odaklı bir ton kullan.',
  creative: 'Yaratıcı, özgün ve ilham verici bir ton kullan. Sıra dışı benzetmeler ve ifadeler kullanabilirsin.',
  technical: 'Teknik, detaylı ve metodoloji odaklı bir ton kullan. Spesifik araçları, metrikleri ve süreçleri ön plana çıkar.',
  concise: 'Kısa, öz ve doğrudan bir ton kullan. Her maddeyi 1-2 cümleyle sınırla, gereksiz açıklama yapma.',
};

export async function POST(req) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const {
      userInput,
      language = 'tr',
      tone = 'professional',
      previousPrompt,
    } = await req.json();

    const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.professional;

    const languageInstruction = language === 'en'
      ? 'CRITICAL: Write ALL section headers and their content in ENGLISH. The 5 headers must be: **Expertise Role:**, **Task & Context:**, **Technical Details:**, **Style & Tone:**, **Desired Output Format:**'
      : 'Tüm başlıkları ve içeriği Türkçe olarak yaz.';

    const systemPrompt = `
      Sen dünyanın en sert ve disiplinli "Master Prompt Mühendisi"sin. 
      GÖREVİN: Kullanıcının girdisini kütüphanedeki kaliteye yükseltmek ama SADECE belirtilen formatta sunmaktır.

      [TON TALİMATI]
      ${toneInstruction}

      [DİL TALİMATI]
      ${languageInstruction}

      [ALTIN ÖRNEKLER - KALİTE STANDARDI]
      ${goldenExamples}

      !!! HAYATİ KURAL (GÖRSEL VS. METİN AYRIMI) !!!
      Kullanıcının isteğini analiz et. 
      - İstek "Metin, Senaryo, Strateji, Kariyer, Yazılım, İş Planı, Sunum, SEO, E-posta vb." gibi GÖRSEL OLMAYAN bir konudaysa SADECE 5 başlığı ver ve DUR. Kesinlikle İngilizce kod bloğu EKLEME.
      - Eğer istek "Fotoğrafçılık, 3D Render, Çizim, Logo, Karikatür, Görsel Tasarım, Sinematik Sahne vb." gibi GÖRSEL ÜRETİMİ gerektiriyorsa, 5 başlığın altına mutlaka İngilizce kod bloğunu ekle.

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
      **İstened Çıktı Formatı:** ...

      ---
      [Görsel Motorlar İçin Optimize Edilmiş İngilizce Prompt:]
      \`\`\`text
      (Buraya Midjourney/DALL-E için teknik İngilizce kodunu yaz. Eğer görselde bir kişi varsa KESİNLİKLE "--cref", "identical face" ve "high-fidelity likeness" parametrelerini ekleyerek yüz hatlarını koru.)
      \`\`\`

      KRİTİK UYARI: Kendi kendine yeni başlık uydurma. Gevezelik yapma, isteğin TÜRÜNE UYGUN (Görsel veya Metin) doğrudan formata geç.
    `;

    let userMessage;
    if (previousPrompt) {
      userMessage = `Mevcut prompt:\n${previousPrompt}\n\nKullanıcının iyileştirme isteği: "${userInput}"\n\nBu promptu kullanıcının isteğine göre geliştir. Orijinal formatı ve yapıyı koru, sadece istenen değişiklikleri uygula.`;
    } else {
      userMessage = `Kullanıcı İsteği: "${userInput}" \n\nFORMATI ASLA BOZMADAN, İSTEĞİN TÜRÜNE UYGUN (Görselse İngilizce kodlu, değilse sadece 5 başlık) MASTER PROMPT ÜRET.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.2,
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    return NextResponse.json({ error: "Hata oluştu." }, { status: 500 });
  }
}
