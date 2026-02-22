import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export async function POST(req) {
  try {
    const { userInput } = await req.json();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Sen dünyanın en iyi Prompt Mühendisisin. Kullanıcının dağınık cümlelerini alıp, AI modellerinin kusursuz çalışacağı profesyonel promptlar oluşturursun. Sadece dönüştürülmüş promptu ver." },
        { role: "user", content: `Aşağıdaki dağınık isteği profesyonel bir prompta çevir: ${userInput}` }
      ],
    });
    return Response.json({ result: completion.choices[0].message.content });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
