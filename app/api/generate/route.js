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
GOAL
STEP 1
STEP 2
STEP 3
OUTPUT
`
  }

  if (framework === "system") {

    return `
SYSTEM ROLE
CAPABILITIES
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
RULES
OUTPUT JSON
`
  }

  if (framework === "tool") {

    return `
ROLE
TOOLS
USAGE
RULES
OUTPUT
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



  if (mode === "FAST") {

    return `
Sen bir prompt builder'sın.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

${structure}

Kısa yaz.
Prompt üret.
`

  }



  if (mode === "PRO") {

    return `
Sen bir MASTER PROMPT ENGINE'sin.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

${structure}

Profesyonel yaz.

Sadece prompt döndür.
`

  }



  if (mode === "ULTRA") {

    return `
Sen bir ULTRA PROMPT ENGINE'sin.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

${structure}

En iyi promptu üret.

Detaylı ol.
Profesyonel ol.
Optimize et.

Sadece prompt döndür.
`

  }



  return `
Sen bir prompt builder'sın.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

${structure}

Prompt üret.
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



  // FIRST

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
          content: input,
        },
      ],

    })



  let result =
    first.choices[0].message.content



  // REFINE

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
