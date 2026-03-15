import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function intentPrompt() {
  return `Intent belirle JSON {intent:""}`;
}

function frameworkPrompt() {
  return `
Framework seç

AIDA
SWOT
JTBD
First Principles
SCAMPER
Lean
StoryBrand

JSON {frameworks:[]}
`;
}

function rolePrompt() {
  return `
Rol üret

JSON {role:""}
`;
}

function variablePrompt() {
  return `
Değişken çıkar

JSON

{
goal:"",
format:"",
tone:""
}
`;
}

function masterPromptBuilder(mode) {

  if (mode === "FAST") {
    return `
Türkçe kısa prompt yaz.
Rol yaz.
Framework yaz.
`;
  }

  if (mode === "PRO") {
    return `
Türkçe detaylı master prompt yaz.

Rol
Amaç
Framework
Kurallar
Format
Detaylı yaz
`;
  }

  // BALANCED default

  return `
Türkçe master prompt yaz.

Ne kısa ne uzun.

Rol
Amaç
Detay
Framework
Kurallar
Format
`;
}


export async function POST(req) {

  try {

    const body = await req.json();

    const userInput = body.userInput;
    const mode = body.mode || "BALANCED";


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


    const variables =
      (await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: variablePrompt() },
          { role: "user", content: userInput },
        ],
      })).choices[0].message.content;


    const master =
      await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: masterPromptBuilder(mode),
          },
          {
            role: "user",
            content:
              userInput +
              intent +
              frameworks +
              role +
              variables,
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
