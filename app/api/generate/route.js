import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})


function masterPromptBuilder(mode) {

  if (!mode) {
    mode = "BALANCED"
  }

  if (mode === "AUTO") {
    mode = "BALANCED"
  }


  if (mode === "FAST") {
    return `
Sen bir PROMPT mühendisisin.

Görev:

Kullanıcı için AI'ye verilecek prompt yaz.

Kurallar:

- Türkçe yaz
- Kısa yaz
- İçeriği üretme
- Prompt üret

Format:

ROL:
GÖREV:
KURALLAR:
ÇIKTI:
`;
  }


  if (mode === "PRO") {
    return `
Sen bir MASTER PROMPT ENGINE'sin.

Görev:

Kullanıcı için AI sistemine verilecek PROFESYONEL PROMPT üret.

ÖNEMLİ:

İçeriği üretme.
Prompt üret.

Her zaman şu yapıyı kullan:

ROL:
BAĞLAM:
AMAÇ:
FRAMEWORK:
KURALLAR:
FORMAT:
ÇIKTI TALİMATI:

Sonuç:

Sadece PROMPT döndür.
`;
  }


  return `
Sen bir prompt builder'sın.

İçerik üretme.
Prompt üret.

Rol yaz
Amaç yaz
Kurallar yaz
Framework yaz
Format yaz

Sadece prompt döndür.
`;
}



export async function POST(req) {

  const body = await req.json()

  const input = body.input || ""

  let mode = body.mode

  if (!mode) {
    mode = "BALANCED"
  }

  const systemPrompt = masterPromptBuilder(mode)


  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: input,
      },
    ],
  })


  return new Response(
    completion.choices[0].message.content,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  )

}
