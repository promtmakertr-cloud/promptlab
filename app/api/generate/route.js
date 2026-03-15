import OpenAI from "openai"

import { autoModeEngine } from "@/lib/engine/autoMode"
import { detectDomain } from "@/lib/engine/domain"
import { detectFramework } from "@/lib/engine/framework"


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})



function masterPromptBuilder(
  mode,
  domain,
  framework
) {

  if (!mode) mode = "BALANCED"



  if (mode === "FAST") {

    return `
Sen bir prompt builder'sın.

Domain: ${domain}
Framework: ${framework}

Kısa prompt üret.
İçerik üretme.
`

  }



  if (mode === "PRO") {

    return `
Sen bir MASTER PROMPT ENGINE'sin.

Domain: ${domain}
Framework: ${framework}

Profesyonel prompt üret.

ROL
BAĞLAM
AMAÇ
FRAMEWORK
KURALLAR
FORMAT

Framework kullan:

${framework}

Sadece prompt döndür.
`

  }



  return `
Sen bir prompt builder'sın.

Domain: ${domain}
Framework: ${framework}

Prompt üret.

Rol yaz
Amaç yaz
Kurallar yaz
Format yaz
`

}



export async function POST(req) {

  const body = await req.json()

  const input = body.input || ""

  let mode = body.mode



  const domain =
    detectDomain(input)

  const framework =
    detectFramework(input)



  mode = autoModeEngine({
    input,
    mode,
  })



  const systemPrompt =
    masterPromptBuilder(
      mode,
      domain,
      framework
    )



  const completion =
    await client.chat.completions.create({

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
