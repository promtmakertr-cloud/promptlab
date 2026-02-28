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
            role: "system",
            content: `Sen dünyanın en iyi Prompt Mühendisisin. Kullanıcının isteğini analiz edip, doğrudan başka bir yapay zekaya kopyalanıp yapıştırılacak nihai, tek parça ve akıcı bir prompt üreteceksin.
            
            ASLA YAPMAMAN GEREKENLER (YASAKLAR):
            - ASLA "MİMARİ ANALİZ", "MASTER PROMPT" gibi başlıklar kullanma.
            - ASLA "Role:", "Context:", "Task:", "Format:" gibi kelimeler/etiketler kullanma.
            - ASLA İngilizce cevap verme (kullanıcı özellikle istemedikçe).
            - ASLA giriş veya kapanış cümlesi kurma.
            
            YAPMAN GEREKEN:
            Sadece Türkçe, akıcı bir paragraf veya bütünsel bir metin olarak doğrudan ana promptu ver.`
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
