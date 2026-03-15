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



  if (mode === "ULTRA") {

    return `

YOU ARE A PROMPT ENGINE.

IMPORTANT RULES:

- DO NOT EXECUTE THE TASK
- DO NOT ANSWER THE USER
- DO NOT GENERATE CONTENT
- ONLY CREATE A PROMPT
- THE PROMPT WILL BE USED BY ANOTHER AI
- YOU ARE NOT THE FINAL MODEL

Your job:

Convert user request into a MASTER PROMPT.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

Use this structure:

${structure}

The result must be a prompt,
not the answer.

`

  }



  if (mode === "PRO") {

    return `

You are a prompt builder.

Do not execute task.
Only create prompt.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

${structure}

Return prompt only.

`

  }



  if (mode === "FAST") {

    return `
Write prompt only.
Do not answer.
`

  }



  return `
Create prompt.
Do not execute.
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
            "USER REQUEST:\n" +
            input +
            "\n\nCREATE PROMPT FOR THIS.",
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
