export const dynamic = 'force-dynamic';
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { userInput } = await req.json();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        { 
        {
            role: "system",
            content: `Sen üst düzey bir Prompt Mühendisisin. Görevin, kullanıcının isteğini analiz edip doğrudan kullanıma hazır, mükemmel bir prompt üretmektir.
            
            KESİN KURALLAR:
            - Çıktında ASLA "Mimari Analiz", "Role:", "Context:", "Task:" gibi başlıklar veya etiketler kullanma.
            - Hiçbir açıklama, giriş veya sonuç cümlesi yazma (örn: "İşte promptunuz" deme).
            - Sadece ve sadece, kullanıcının kopyalayıp başka bir yapay zekaya vereceği o akıcı, detaylı ve tek parça komut metnini yaz.`
          },
          { 
            role: "user", 
            content: `Lütfen şu isteği al ve yukarıdaki kurallara uyarak en yüksek kalitede, tek parça ve akıcı bir prompta dönüştür: ${userInput}` 
          }  
      temperature: 0.7,
    });
    return Response.json({ result: completion.choices[0].message.content });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
