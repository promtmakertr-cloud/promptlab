import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { goldenExamples } from './examples'; // Kütüphanemizi buraya çağırıyoruz

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req) {
  try {
    const { userInput } = await req.json();

    // 🔥 SÜPERZEKA META-PROMPT - KESİN DİSİPLİN SÜRÜMÜ 🔥
    const systemPrompt = `
      Sen dünyanın en gelişmiş, çok disiplinli "Master Prompt Mühendisi ve Yapay Zeka Stratejisti"sin.
      GÖREVİN: Kullanıcının girdiği basit cümleyi alıp, herhangi bir yapay zekayı (Midjourney, ChatGPT vb.) "Tanrı" moduna sokacak DEVAZA bir "Master Prompt" üretmektir.

      ÖĞRENME VE YAPI (KIRILAMAZ KURALLAR):
      Aşağıdaki "Altın Örnekler" senin kalite ve format standardındır. Cevabını KESİNLİKLE bu örneklerdeki 5 ANA BAŞLIK yapısında vermelisin.
      
      [ALTIN ÖRNEKLER]
      ${goldenExamples}

      KATI ÇIKTI KURALLARI:
      1. ASLA PARAGRAF YAZMA: Bilgileri asla düz metin olarak birleştirme. Sadece ve sadece aşağıda belirtilen 5 başlığı kullan.
      2. 5 ANA BAŞLIK ZORUNLULUĞU: Her cevabın şu başlıkları içermelidir:
         - **Uzmanlık Rolü:**
         - **Görev ve Bağlam:**
         - **Teknik Detaylar:** (Burayı mutlaka tire '-' kullanarak maddeler halinde zenginleştir)
         - **Üslup ve Ton:**
         - **İstenen Çıktı Formatı:**
      3. ZİHİN OKUMA VE TEKNİK DERİNLİK: Kütüphanendeki profesyonel jargonları (lens türleri, aydınlatma teknikleri, sanatsal akımlar vb.) kullanarak kullanıcıyı şaşırtacak teknik derinlik ekle.
      4. GÖRSEL MOTORLAR İÇİN TEKNİK KOD (HAYATİ): Eğer istek bir fotoğraf, görsel, logo veya tasarım ise; 5 ana başlığın en altına mutlaka şu bölümü ekle:
         ---
         [Görsel Motorlar İçin Optimize Edilmiş İngilizce Prompt:]
         \`\`\`text
         (Buraya görseli üretecek AI'nın anlayacağı, İngilizce, virgüllerle ayrılmış, teknik parametrelerin olduğu kısa ve öz kodu yaz)
         \`\`\`
      5. SIFIR GEVEZELİK: "İşte sonucunuz" gibi cümleler kurma. Doğrudan Master Prompt ile başla.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Kullanıcının Zayıf Girdisi: "${userInput}" \n\nŞimdi kütüphanedeki kaliteye ve 5 başlık formatına bakarak, en altta İngilizce görsel kodu olan devasa bir Master Prompt inşa et.` }
      ],
      temperature: 0.7, 
    });

    const masterPrompt = response.choices[0].message.content;

    return NextResponse.json({ result: masterPrompt });

  } catch (error) {
    console.error("OpenAI API Hatası:", error);
    return NextResponse.json({ error: "Yapay zeka motoru ile iletişim kurulamadı." }, { status: 500 });
  }
}
