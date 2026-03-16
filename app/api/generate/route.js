import OpenAI from "openai"

import { autoModeEngine } from "@/lib/engine/autoMode"
import { detectDomain } from "@/lib/engine/domain"
import { detectFramework } from "@/lib/engine/framework"
import { detectOutputType } from "@/lib/engine/output"
import { refinePromptInstruction } from "@/lib/engine/refine"
import { calculatePromptScore } from "@/lib/engine/score"
import { detectLanguage } from "@/lib/engine/language"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})



function buildStructure(framework) {
  if (framework === "agent") {
    return `
ROL
AMAÇ
ARAÇLAR
ADIMLAR
KURALLAR
ÇIKTI FORMATI
`
  }

  if (framework === "system") {
    return `
SYSTEM ROLÜ
YETENEKLER
SINIRLAR
KURALLAR
ÇIKTI
`
  }

  return `
ROL
BAĞLAM
GÖREV
KURALLAR
ÇIKTI FORMATI
`
}



function masterPromptBuilder(
  mode,
  domain,
  framework,
  output,
  language
) {

  const structure =
    buildStructure(framework)



  const blocker = `

You are NOT final AI.
You are PROMPT ENGINE.

Do NOT execute task.
Do NOT generate content.

Only build prompt.

`



  const langRule =
    language === "TR"
      ? "Write prompt in TURKISH."
      : "Write prompt in ENGLISH."



  if (mode === "ULTRA") {
    return `

${blocker}

${langRule}

Create MASTER PROMPT.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

STRICT RULES

Use structure
Add constraints
Add rules
Add validation
Add limits

${structure}

Return prompt only.

`
  }



  return `

${blocker}

${langRule}

Create prompt.

${structure}

`
}



export async function POST(req) {

  const body = await req.json()

  const input = body.input || ""

  let mode = body.mode || "AUTO"

  const model =
    body.model || "gpt-4o"



  const language =
    detectLanguage(input)

  const domain =
    detectDomain(input)

  const framework =
    detectFramework(input)

  const output =
    detectOutputType(input)

  const score =
    calculatePromptScore(input)



  // AUTO only

  if (mode === "AUTO") {
    mode = autoModeEngine({
      input,
      domain,
      framework,
      output,
      score,
    })
  }



  const systemPrompt =
    masterPromptBuilder(
      mode,
      domain,
      framework,
      output,
      language
    )



  const first =
    await client.chat.completions.create({

      model,

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



  if (mode === "PRO" || mode === "ULTRA") {

    const refine =
      await client.chat.completions.create({

        model,

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



  return Response.json({
    prompt: result,
    mode,
    score,
    language,
    domain,
    framework,
    output,
    model,
  })

}
