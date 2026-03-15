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

  const structure =
    buildStructure(framework)



  // 🔴 STRONG BLOCKER

  const blocker = `

IMPORTANT:

You are NOT allowed to execute the task.

You are NOT the final AI.

You are building a PROMPT for another AI.

Never write story
Never write blog
Never write code
Never answer the request
Never generate final content

Only generate instructions.

Output must be a PROMPT.

`



  if (mode === "ULTRA") {

    return `

${blocker}

You are a MASTER PROMPT ENGINE.

Convert user request into SYSTEM PROMPT.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

Use this structure:

${structure}

Return ONLY the prompt.

`

  }



  if (mode === "PRO") {

    return `

${blocker}

Create a professional prompt.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

${structure}

Return only prompt.

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



  // ✅ FIRST CALL

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
            "USER REQUEST:\n" +
            input +
            "\n\nBUILD MASTER PROMPT ONLY.",
        },

      ],

    })



  let result =
    first.choices[0].message.content



  // ✅ REFINE

  if (mode === "PRO" || mode === "ULTRA") {

    const refine =
      await client.chat.completions.create({

        model: "gpt-4o",

        messages: [

          {
            role: "system",
            content: `
You are a PROMPT OPTIMIZER.

Do NOT execute task.
Do NOT generate content.

Improve the prompt only.
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



  return new Response(
    result,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  )

}
