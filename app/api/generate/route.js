import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { goldenExamples } from './examples';

const TONE_INSTRUCTIONS = {
  professional: 'Otoriter, stratejik ve sonuç odaklı bir profesyonel ton kullan.',
  creative: 'Sınırları zorlayan, metaforik ve ilham verici bir sanatçı tonu kullan.',
  technical: 'Mühendislik disipliniyle, metrik odaklı ve jargon kullanımı yüksek bir ton kullan.',
  concise: 'Sadece hayati bilgiyi veren, minimal ve vurucu bir ton kullan.',
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

    if (!userInput || typeof userInput !== 'string' || !userInput.trim()) {
      return NextResponse.json({ error: "Geçerli bir girdi gerekli." }, { status: 400 });
    }

    const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.professional;

    const languageInstruction = language === 'en'
      ? 'CRITICAL: Write ALL headers and content in ENGLISH. Headers: **Expertise Role:**, **Task & Context:**, **Technical Details:**, **Style & Tone:**, **Desired Output Format:**'
      : 'Tüm başlıkları ve içeriği Türkçe olarak yaz.';

    const systemPrompt = `
      Sen dünyanın en gelişmiş "Master Prompt Mühendisi" ve Yapay Zeka Stratejistisin. 
      GÖREVİN: Kullanıcının basit girdisini, başka bir yapay zekadan (ChatGPT, Claude, Midjourney vb.) %100 verim alacak "Master" seviyesinde bir komut setine dönüştürmektir.

      [PROSES ALGORİTMASI]
      1. Niyet Analizi: Kullanıcı ne istiyor? (Pazarlama, Yazılım, Sanat, Akademi vb.)
      2. Eksik Veri Tespiti: Kullanıcının belirtmediği ama sonucun mükemmel olması için gereken parametreleri (Hedef kitle, teknik stack, ışık açısı vb.) Master Prompt içine "Değişken" olarak ekle.
      3. Metodoloji Enjeksiyonu: 
         - Pazarlamaysa: AIDA, PAS veya StoryBrand çerçevelerini kullan.
         - Yazılımsa: Clean Code, SOLID ve Design Patterns prensiplerini ekle.
         - Akademikse: Eleştirel düşünce ve kaynakça standartlarını göm.

      [TON VE DİL]
      ${toneInstruction}
      ${languageInstruction}

      [FORMAT KURALLARI]
      - SADECE aşağıdaki 5 ana başlığı kullan.
      - **Teknik Detaylar** bölümünde en az 4 madde olmalı ve her biri sektörel derinlik içermeli.
      - Görsel işlerde mutlaka sonuna İngilizce kod bloğunu ekle.

      [GÖRSEL VS METİN AYRIMI]
      - İstek görsel üretimiyle ilgili değilse sadece 5 başlık ver.
      - İstek görsel üretimiyle (Fotoğraf, Logo, 3D vb.) ilgiliyse 5 başlığın altına Midjourney/DALL-E teknik promptunu ekle.

      **Expertise Role:** (Buraya dünya çapında bir uzmanlık tanımla)
      **Task & Context:** (Görevi ve neden yapıldığını derinleştirerek açıkla)
      **Technical Details:** (Buraya sektörel frameworkleri, parametreleri ve kısıtlamaları madde madde yaz)
      **Style & Tone:** (İletişim dilinin psikolojik derinliğini tanımla)
      **Desired Output Format:** (Çıktının yapısını, uzunluğunu ve sunum şeklini netleştir)

      [Eğer Görselse Ek Bölüm:]
      ---
      [Görsel Motorlar İçin Optimize Edilmiş İngilizce Prompt:]
      \`\`\`text
      (Ultra-detaylı, ışık, kamera açısı ve render motoru parametrelerini içeren teknik İngilizce prompt. Görselde insan varsa '--cref' ve 'consistent features' parametrelerini dahil et.)
      \`\`\`

      Kritik: Açıklama yapma, giriş cümlesi kurma. Doğrudan Master Prompt'u üretmeye baş.
    `;

    let userMessage;
    if (previousPrompt) {
      userMessage = `MEVCUT MASTER PROMPT:\n${previousPrompt}\n\nİSTEK: "${userInput}"\n\nBu Master Prompt'u kullanıcının yeni niyetine göre yeniden yapılandır. Zekasını ve derinliğini artır.`;
    } else {
      userMessage = `KULLANICI GİRDİSİ: "${userInput}"\n\nBu girdiyi analiz et ve profesyonel bir Master Prompt setine dönüştür.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Master Prompt için her zaman en zeki modeli kullanıyoruz
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.4, // Mantıksal tutarlılık ve yaratıcılık dengesi için 0.4
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error("Generate Error:", error);
    return NextResponse.json({ error: "Sistemde bir aksaklık oluştu." }, { status: 500 });
  }
}
