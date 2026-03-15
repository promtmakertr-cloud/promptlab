import OpenAI from "openai"

import { autoModeEngine } from "@/lib/engine/autoMode"
import { detectDomain } from "@/lib/engine/domain"
import { detectFramework } from "@/lib/engine/framework"
import { detectOutputType } from "@/lib/engine/output"


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})



function masterPromptBuilder(
  mode,
  domain,
  framework,
  output
) {

  if (!mode) mode = "BALANCED"



  if (mode === "FAST") {

    return `
Sen bir prompt builder'sın.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

Kısa prompt üret.
İçerik üretme.
`

  }



  if (mode === "PRO") {

    return `
Sen bir MASTER PROMPT ENGINE'sin.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

Profesyonel prompt üret.

ROL
BAĞLAM
AMAÇ
FRAMEWORK
OUTPUT
KURALLAR
FORMAT

Output tipi:

${output}

Sadece prompt döndür.
`

  }



  return `
Sen bir prompt builder'sın.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

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

  const output =
    detectOutputType(input)



  mode = autoModeEngine({
    input,
    mode,
  })



  const systemPrompt =
    masterPromptBuilder(
      mode,
      domain,
      framework,
      output
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
