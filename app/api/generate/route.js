import OpenAI from "openai"

import { autoModeEngine } from "@/lib/engine/autoMode"
import { detectDomain } from "@/lib/engine/domain"
import { detectFramework } from "@/lib/engine/framework"
import { detectOutputType } from "@/lib/engine/output"
import { refinePromptInstruction } from "@/lib/engine/refine"


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})



function buildStructure(framework) {

  if (framework === "agent") {
    return `
ROL
AMAÇ
TOOLS
STEPS
RULES
OUTPUT
`
  }

  if (framework === "chain") {
    return `
ROL
STEP 1
STEP 2
STEP 3
OUTPUT
`
  }

  if (framework === "system") {
    return `
SYSTEM ROLE
RULES
LIMITS
OUTPUT
`
  }

  if (framework === "json") {
    return `
ROLE
GOAL
JSON FORMAT
OUTPUT JSON
`
  }

  return `
ROL
AMAÇ
KURALLAR
FORMAT
ÇIKTI
`
}



function masterPromptBuilder(
  mode,
  domain,
  framework,
  output
) {

  const structure =
    buildStructure(framework)



  if (mode === "ULTRA") {

    return `

SEN BİR PROMPT ENGINE'SİN.

ÖNEMLİ KURALLAR:

- ASLA görevi yapma
- ASLA içerik üretme
- ASLA açıklama yapma
- SADECE PROMPT üret
- Kullanıcının istediğini yapma
- Kullanıcının isteği için PROMPT yaz

Domain: ${domain}
Framework: ${framework}
Output: ${output}

KULLANILACAK YAPI:

${structure}

Sadece PROMPT döndür.

`

  }



  if (mode === "PRO") {

    return `

Sen bir PROMPT ENGINE'sin.

İçerik üretme.
Prompt üret.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

${structure}

Sadece prompt döndür.

`

  }



  if (mode === "FAST") {

    return `

Prompt yaz.
İçerik yazma.

`

  }



  return `

Prompt üret.
İçerik üretme.

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
    domain,
    framework,
    output,
  })



  const systemPrompt =
    masterPromptBuilder(
      mode,
      domain,
      framework,
      output
    )



  const first =
    await client.chat.completions.create({

      model: "gpt-4o",

      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content:
            "KULLANICI İSTEĞİ:\n" + input +
            "\n\nSADECE BUNUN İÇİN PROMPT YAZ.",
        },
      ],

    })



  let result =
    first.choices[0].message.content



  if (mode === "PRO" || mode === "ULTRA") {

    const refine =
      await client.chat.completions.create({

        model: "gpt-4o",

        messages: [
          {
            role: "system",
            content:
              refinePromptInstruction(),
          },
          {
            role: "user",
            content: result,
          },
        ],

      })

    result =
      refine.choices[0].message.content

  }



  return new Response(
    result,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  )

}
