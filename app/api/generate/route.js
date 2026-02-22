import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { userInput } = await req.json();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        { 
          role: "system", 
          content: `Sen dünyanın en iyi Prompt Mühendisi ve Yapay Zeka Stratejistisin. Görevin, kullanıcının dağınık ve yüzeysel isteklerini analiz ederek, CO-STAR (Context, Objective, Style, Tone, Audience, Response) çerçevesinde kusursuz bir Master Prompt üretmektir.

          YAPILANDIRMA KURALLARIN:
          1. ANALİZ: Önce isteğin özünü ve eksiklerini tespit et.
          2. ROL: Konuyla ilgili en üst düzey uzman kimliğini ata.
          3. BAĞLAM: AI'nın durumu anlaması için derinlikli bir arka plan kurgula.
          4. GÖREV: Adım adım, net ve mantıksal bir emir silsilesi oluştur.
          5. KISITLAMALAR: Yanlış anlaşılmaları önlemek için sınırlar koy.
          6. FORMAT: Çıktının nasıl (Tablo, kod bloğu, liste vb.) olacağını belirt.

          ÇIKTI YAPISI:
          ## 🏗️ MİMARİ ANALİZ: (Neden bu yapıyı kurduğunu açıkla)
          ---
          ## 🚀 MASTER PROMPT:
          (Kopyalanabilir, profesyonel prompt metni burada yer almalı. Role, Context, Task, Constraints ve Format başlıklarını içermelidir.)`
        },
        { role: "user", content: `Aşağıdaki karmaşık isteği analiz et ve profesyonel bir Master Prompt dökümanına dönüştür: ${userInput}` }
      ],
      temperature: 0.7,
    });
    return Response.json({ result: completion.choices[0].message.content });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
