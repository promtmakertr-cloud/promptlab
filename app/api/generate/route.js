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

YOU ARE NOT THE FINAL AI.

YOU ARE A PROMPT ENGINE.

Your job:
Create a SYSTEM PROMPT
for another AI model.

STRICT RULES:

- Do NOT execute the task
- Do NOT answer the user
- Do NOT generate story / text / code
- Only generate a PROMPT
- The prompt will be used later
- You are building instructions

User request will be given.

You must convert it into a MASTER PROMPT.

Domain: ${domain}
Framework: ${framework}
Output: ${output}

Use this structure:

${structure}

The result must be usable as a SYSTEM PROMPT.

Return ONLY the prompt.

`

  }



  if (mode === "PRO") {

    return `

You are a prompt builder.

Do not execute task.

Create prompt only.

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
Do not execute.
`

  }



  return `
Create prompt.
Do not answer.
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
            "\n\nBUILD MASTER PROMPT.",
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
