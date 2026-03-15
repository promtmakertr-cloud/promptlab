import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function intentPrompt() {
  return `
Intent belirle.

JSON ver

{intent:""}
`;
}

function frameworkPrompt() {
  return `
Framework seç.

AIDA
SWOT
JTBD
First Principles
SCAMPER
Lean
StoryBrand

JSON ver

{frameworks:[]}
`;
}

function rolePrompt() {
  return `
Uzman rol üret.

Türkçe yaz.

JSON

{role:""}
`;
}

function masterPromptBuilder() {
  return `
Türkçe MASTER PROMPT üret.

Kurallar:

- Türkçe yaz
- Rol yaz
- Framework kullan
- Açık yaz
- Kısa yaz
- Gereksiz uzatma

Format:

ROL:
AMAÇ:
KURALLAR:
FRAMEWORK:
ÇIKTI:

Sadece prompt döndür.
`;
}

export async function POST(req) {
  try {

    const { userInput } = await req.json();

    const intent =
      (await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: intentPrompt() },
          { role: "user", content: userInput },
        ],
      })).choices[0].message.content;

    const frameworks =
      (await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: frameworkPrompt() },
          { role: "user", content: intent },
        ],
      })).choices[0].message.content;

    const role =
      (await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: rolePrompt() },
          { role: "user", content: intent },
        ],
      })).choices[0].message.content;

    const master =
      await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: masterPromptBuilder(),
          },
          {
            role: "user",
            content:
              userInput +
              intent +
              frameworks +
              role,
          },
        ],
      });

    const text =
      master.choices[0].message.content;

    const stream =
      new ReadableStream({
        async start(controller) {
          controller.enqueue(
            new TextEncoder().encode(text)
          );
          controller.close();
        },
      });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
      },
    });

  } catch (e) {
    return NextResponse.json({
      error: "fail",
    });
  }
}
