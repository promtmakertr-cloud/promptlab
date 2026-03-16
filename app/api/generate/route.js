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
    language === "Turkish"
      ? "Write in Turkish."
      : "Write in English."


  const blocker = `

You are a MASTER PROMPT ENGINE.

CRITICAL RULES:

- NEVER execute the task
- NEVER generate final content
- NEVER answer the user
- ONLY create prompt
- The prompt will be used by another AI

`


  if (mode === "ULTRA") {

    return `

${blocker}

${langRule}

Create MASTER PROMPT.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

Use EXACT structure:

${STRUCTURE}

Be strict.
Be detailed.
Add constraints.
Return only prompt.

`
  }


  if (mode === "PRO") {

    return `

${blocker}

${langRule}

Create professional prompt.

${STRUCTURE}

Return only prompt.

`
  }


  return `

${blocker}

${langRule}

Create prompt.

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


  // ✅ FIXED SCORE

  const score =
    calculatePromptScore(
      input,
      domain,
      framework,
      output
    )


  // ✅ FIXED AUTO MODE

  if (!mode || mode === "AUTO") {

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
      temperature: 0.3,

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


  // ✅ REFINE FIX

  if (mode === "PRO" || mode === "ULTRA") {

    const refine =
      await client.chat.completions.create({

        model,
        temperature: 0.2,

        messages: [

          {
            role: "system",
            content:
              refinePromptInstruction(
                language,
                mode
              ),
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
