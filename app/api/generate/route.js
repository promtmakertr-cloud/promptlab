import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// ✅ INTENT

function intentPrompt() {
  return `
You are an intent analyzer.

Detect intent type.

Types:

analysis
strategy
content
prompt
code
business
marketing
ai
education
story

Return JSON

{
intent:""
}
`;
}



// ✅ DOMAIN

function domainPrompt() {
  return `
Detect domain.

Domains:

marketing
startup
business
software
ai
finance
psychology
education
design
content
story
prompt-engineering
system-design
general

Return JSON

{
domain:""
}
`;
}



// ✅ FRAMEWORK

function frameworkPrompt() {
  return `
Select frameworks based on intent + domain.

marketing →
AIDA
PAS
SWOT
STP
StoryBrand

business →
SWOT
ROI
Financial
Budget

software →
Architecture
Clean code

Return JSON

{
frameworks:[]
}
`;
}



// ✅ MASTER BUILDER

function masterPromptBuilder() {
  return `
Create master prompt.

Write:

Role
Context
Technical details
Use frameworks
Give format

Return prompt text
`;
}



export async function POST(req) {

  try {

    const { userInput } = await req.json();


    // ✅ INTENT

    const intentRes =
      await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: intentPrompt(),
          },
          {
            role: "user",
            content: userInput,
          },
        ],
      });

    const intent =
      intentRes.choices[0].message.content;



    // ✅ DOMAIN

    const domainRes =
      await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: domainPrompt(),
          },
          {
            role: "user",
            content: userInput,
          },
        ],
      });

    const domain =
      domainRes.choices[0].message.content;



    // ✅ FRAMEWORK

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
            content: intent + domain,
          },
        ],
      });

    const frameworks =
      frameRes.choices[0].message.content;



    // ✅ MASTER

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
              domain +
              frameworks,
          },
        ],
      });


    const refined =
      master.choices[0].message.content;



    // ✅ STREAM

    const stream =
      new ReadableStream({
        async start(controller) {

          controller.enqueue(
            new TextEncoder().encode(
              refined
            )
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
