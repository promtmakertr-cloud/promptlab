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


const STRUCTURE = `

ROLE:
CONTEXT:
TASK:
RULES:
CONSTRAINTS:
OUTPUT FORMAT:
VALIDATION:

`



function masterPromptBuilder(
  mode,
  domain,
  framework,
  output,
  language
) {

  const langRule =
    language === "tr"
      ? "Write in Turkish."
      : "Write in English."


  const blocker = `

YOU ARE PROMPT ENGINE.

You are NOT final AI.

Never execute task.
Never write article.
Never write blog.
Never write outline.
Never write story.
Never write content.

You must generate PROMPT only.

The result MUST follow template.

If format is wrong → output INVALID.

`



  if (mode === "ULTRA") {

    return `

${blocker}

${langRule}

Create MASTER PROMPT.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

STRICT TEMPLATE:

${STRUCTURE}

Rules:

- Must start with ROLE:
- Must include TASK:
- Must include RULES:
- Must include OUTPUT FORMAT:
- Must include VALIDATION:
- No extra text
- No explanation
- No article
- No plan

Return ONLY prompt.

`
  }



  return `

${blocker}

${langRule}

Use template:

${STRUCTURE}

Return prompt only.

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
