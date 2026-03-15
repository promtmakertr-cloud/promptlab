import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function frameworkPrompt() {
  return `
Intent'e göre framework seç

marketing →
AIDA
PAS
SWOT
STP
StoryBrand

business →
SWOT
ROI
Financial analysis
Cashflow
Budgeting

sales →
Objection
Closing
Persuasion

software →
Architecture
Clean code

JSON ver

{
frameworks:[]
}
`;
}

function masterPromptBuilder() {
  return `
Master prompt üret

Rol yaz
Bağlam yaz
Teknik detay yaz
Framework kullan
Format ver
`;
}

export async function POST(req) {
  try {
    const { userInput } = await req.json();

    const intentRes = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Intent belirle",
        },
        {
          role: "user",
          content: userInput,
        },
      ],
    });

    const intent =
      intentRes.choices[0].message.content;

    const frameRes =
      await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: frameworkPrompt(),
          },
          {
            role: "user",
            content: intent,
          },
        ],
      });

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
            content: userInput,
          },
        ],
      });

    const refined =
      master.choices[0].message.content;

    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(
          new TextEncoder().encode(refined)
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
