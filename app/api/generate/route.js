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

You are a PROMPT ENGINE.

Do not execute the task.
Do not generate article.
Do not generate blog.
Do not generate story.
Do not generate final content.

You must create PROMPT only.

`



  if (mode === "ULTRA") {

    return `

${blocker}

${langRule}

Create a MASTER PROMPT.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

Use this structure:

${STRUCTURE}

Follow the structure as much as possible.

Return only prompt.

`
  }



  return `

${blocker}

${langRule}

Create prompt using structure.

${STRUCTURE}

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
