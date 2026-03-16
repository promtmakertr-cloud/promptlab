import OpenAI from "openai"

import { autoModeEngine } from "@/lib/engine/autoMode"
import { detectDomain } from "@/lib/engine/domain"
import { detectFramework } from "@/lib/engine/framework"
import { detectOutputType } from "@/lib/engine/output"
import { refinePromptInstruction } from "@/lib/engine/refine"
import { calculatePromptScore } from "@/lib/engine/score"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})



function buildStructure(framework) {
  if (framework === "agent") {
    return `
ROLE
GOAL
TOOLS
STEPS
RULES
OUTPUT FORMAT
`
  }

  if (framework === "system") {
    return `
SYSTEM ROLE
CAPABILITIES
LIMITS
RULES
OUTPUT FORMAT
`
  }

  if (framework === "chain") {
    return `
ROLE
STEP 1
STEP 2
STEP 3
OUTPUT
`
  }

  if (framework === "json") {
    return `
ROLE
GOAL
JSON SCHEMA
RULES
OUTPUT JSON
`
  }

  return `
ROLE
CONTEXT
TASK
RULES
OUTPUT FORMAT
`
}



function masterPromptBuilder(
  mode,
  domain,
  framework,
  output
) {

  const structure = buildStructure(framework)

  const blocker = `

IMPORTANT:

You are NOT the final AI.
You are a PROMPT ENGINE.

Do NOT execute task.
Do NOT generate final content.
Do NOT write story.
Do NOT write blog.
Do NOT write code.

Only build PROMPT.

Output must be instructions.

`


  if (mode === "ULTRA") {
    return `

${blocker}

You are MASTER PROMPT ENGINE.

Create SYSTEM PROMPT.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

STRICT RULES:

- Use structure
- Use constraints
- Use rules
- Enforce output format
- Add limits
- Add behavior rules
- Add validation rules
- Add failure rules

Structure:

${structure}

Return prompt only.

`
  }


  if (mode === "PRO") {
    return `

${blocker}

Create professional prompt.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

${structure}

Return prompt only.

`
  }


  if (mode === "FAST") {
    return `

${blocker}

Write short prompt.

`
  }

  return `

${blocker}

Create prompt only.

`
}



export async function POST(req) {

  const body = await req.json()

  const input = body.input || ""

  let mode = body.mode || "AUTO"

  const model =
    body.model || "gpt-4o"



  const domain =
    detectDomain(input)

  const framework =
    detectFramework(input)

  const output =
    detectOutputType(input)



  const score =
    calculatePromptScore(input)



  // 🔴 MODE FIX

  if (mode === "AUTO") {
    mode = autoModeEngine({
      input,
      domain,
      framework,
      output,
      score,
    })
  }



  // 🔴 ULTRA FORCE

  if (score.total > 80 && mode !== "ULTRA") {
    mode = "ULTRA"
  }



  const systemPrompt =
    masterPromptBuilder(
      mode,
      domain,
      framework,
      output
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
          content:
            "USER REQUEST:\n" +
            input +
            "\n\nBUILD MASTER PROMPT ONLY.",
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
            content: `
You are PROMPT OPTIMIZER.

Do NOT execute.
Do NOT generate content.

Improve prompt only.
Return prompt only.
`,
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



  // 🔴 DEBUG RETURN

  return Response.json({
    prompt: result,
    mode,
    score,
    domain,
    framework,
    output,
    model,
  })

}
