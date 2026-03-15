import OpenAI from "openai"

import { autoModeEngine } from "@/lib/engine/autoMode"
import { detectDomain } from "@/lib/engine/domain"
import { detectFramework } from "@/lib/engine/framework"
import { detectOutputType } from "@/lib/engine/output"
import { refinePromptInstruction } from "@/lib/engine/refine"
import { detectLanguage } from "@/lib/engine/language"


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})


function buildStructure(framework, lang) {

  if (lang === "tr") {

    return `
ROL
BAĞLAM
GÖREV
KURALLAR
FORMAT
`
  }

  return `
ROLE
CONTEXT
TASK
RULES
FORMAT
`
}



function masterPromptBuilder(
  mode,
  domain,
  framework,
  output,
  lang
) {

  const structure =
    buildStructure(framework, lang)



  if (mode === "ULTRA") {

    if (lang === "tr") {

      return `

SEN SON MODEL DEĞİLSİN.

SEN BİR PROMPT ENGINE'SİN.

GÖREVİN:

Kullanıcı isteğini,
başka bir yapay zekaya verilecek
MASTER PROMPT haline çevirmek.

KURALLAR:

- Görevi yapma
- İçerik üretme
- Hikaye yazma
- Sadece prompt üret
- Bu prompt başka AI için

Domain: ${domain}
Framework: ${framework}
Output: ${output}

Yapı:

${structure}

Sadece prompt döndür.

`

    }

    return `

YOU ARE A PROMPT ENGINE.

Do not execute task.

Create system prompt.

${structure}

`

  }



  return `Prompt oluştur`
}



export async function POST(req) {

  const body = await req.json()

  const input = body.input || ""

  let mode = body.mode


  const lang =
    detectLanguage(input)

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
      output,
      lang
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
            "KULLANICI İSTEĞİ:\n" +
            input +
            "\nPROMPT OLUŞTUR",
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
