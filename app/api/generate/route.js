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



function buildStructure() {
  return `
ROLE
CONTEXT
TASK
RULES
CONSTRAINTS
OUTPUT FORMAT
VALIDATION
`
}



function masterPromptBuilder(
  mode,
  domain,
  framework,
  output,
  language
) {

  const structure = buildStructure()

  const langRule =
    language === "TR"
      ? "Write prompt in Turkish."
      : "Write prompt in English."



  const blocker = `

YOU ARE PROMPT ENGINE.

You are NOT allowed to do the task.

Never write article
Never write story
Never write blog
Never write outline
Never write plan
Never write content

You must build PROMPT only.

Output must be SYSTEM PROMPT.

`



  if (mode === "ULTRA") {
    return `

${blocker}

${langRule}

Create MASTER PROMPT.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

STRICT:

Use structure
Use rules
Use constraints
Use validation
Use limits

Result MUST look like:

ROLE:
CONTEXT:
TASK:
RULES:
CONSTRAINTS:
OUTPUT FORMAT:
VALIDATION:

${structure}

Return only prompt.

`
  }



  return `

${blocker}

${langRule}

Create prompt using structure.

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
