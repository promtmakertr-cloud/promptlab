import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Vercel'in eski cevapları hafızasında tutmasını engeller
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    // Senin frontend'den gelen değişkenin adı neyse (prompt veya userInput), aşağıyı ona göre ayarladık.
    const userInput = body.prompt || body.userInput; 

    if (!userInput) {
      return NextResponse.json({ error: "Lütfen bir istek girin." }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Veya kullandığın OpenAI modeli (gpt-4o vb.)
      messages: [
        {
          role: "system",
          content: `Sen, Silikon Vadisi standartlarında, dil modellerinin (LLM) çalışma prensiplerini kod seviyesinde anlayan, "Kıdemli İstem Mühendisi" (Senior Prompt Engineer) ve yapay zeka fısıldayıcısısın. 
          Amacın, kullanıcının girdiği sıradan, eksik veya amatör fikirleri alıp; ChatGPT, Claude veya Gemini gibi sistemlerin en yüksek kalitede, halüsinasyonsuz ve nokta atışı cevap vermesini sağlayacak "Kusursuz Master Prompt"lara dönüştürmektir.

          TEMEL KURALLAR (ASLA İHLAL ETME):
          1. Asla "MİMARİ ANALİZ", "MASTER PROMPT" gibi başlıklar yazma.
          2. Asla "Role:", "Context:", "Task:", "Format:" gibi robotik ve itici etiketler kullanma.
          3. Kullanıcıya "İşte promptunuz", "Umarım işinize yarar" gibi açıklamalar yapma. SADECE NİHAİ PROMPTU VER.
          4. Ürettiğin prompt akıcı bir Türkçe ile yazılmalıdır (kullanıcı aksini istemedikçe).

          MASTER PROMPT YAZIM MATEMATİĞİ (GİZLİ İSKELET):
          Senin üreteceğin prompt, arka planda şu yapıyı barındırmalı ancak bunu son kullanıcıya akıcı bir metin olarak sunmalıdır:
          - KİMLİK (Persona): Modele önce kim olduğunu çok spesifik ve iddialı bir şekilde söyle (Örn: "Sen 20 yıllık deneyime sahip, Fortune 500 şirketlerine danışmanlık yapan bir dijital pazarlama dehasısın...").
          - BAĞLAM (Context): Görevin hangi şartlar altında, kime yönelik yapılacağını detaylandır.
          - KESİN GÖREV (Task & Constraints): Modelin ne yapacağını ve neyi ASLA YAPMAYACAĞINI (yasakları) net bir dille emret.
          - ÇIKTI FORMATI (Format): Sonucun nasıl görüneceğini (tablo, madde imi, resmi dil, samimi dil) kesinleştir.

          Senin görevin, bu 4 adımlı matematiği kullanarak, akıcı, kopyalayıp yapıştırmaya hazır, okuyanda "İşte budur!" hissi uyandıran ve insanların birbirine göndereceği kalitede başyapıt promptlar üretmektir.`
        },
        {
          role: "user",
          content: `Kullanıcının ham isteği şudur: "${userInput}". Lütfen bu isteği al ve yukarıdaki kurallara/matematiğe harfiyen uyarak kusursuz, akıcı ve tek parça bir Master Prompta dönüştür.`
        }
      ],
      temperature: 0.7,
    });

    // Sonucu Frontend'e gönderiyoruz
    return NextResponse.json({ result: completion.choices[0].message.content });

  } catch (error) {
    console.error("API Hatası:", error);
    return NextResponse.json({ error: "Sistemde bir hata oluştu, lütfen tekrar deneyin." }, { status: 500 });
  }
}
