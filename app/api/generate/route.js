import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// ✅ INTENT

function intentPrompt() {
  return `
Detect intent

Return JSON

{
intent:""
}
`;
}


// ✅ DOMAIN

function domainPrompt() {
  return `
Detect domain

Return JSON

{
domain:""
}
`;
}


// ✅ FRAMEWORK

function frameworkPrompt() {
  return `
Select frameworks

Return JSON

{
frameworks:[]
}
`;
}


// ✅ ROLE

function rolePrompt() {
  return `
Generate expert role

Return JSON

{
role:""
}
`;
}


// ✅ OUTPUT TYPE

function outputPrompt() {
  return `
Detect output type

Types:

prompt
analysis
table
plan
json
strategy
report
steps
code

Return JSON

{
output:""
}
`;
}


// ✅ MASTER

function masterPromptBuilder() {
  return `
Create master prompt.

Include:

Role
Context
Framework
Format
Technical detail
Output type

Return prompt
`;
}



export async function POST(req) {

  try {

    const { userInput } = await req.json();


    // INTENT

    const intentRes =
      await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: intentPrompt() },
          { role: "user", content: userInput },
        ],
      });

    const intent =
      intentRes.choices[0].message.content;


    // DOMAIN

    const domainRes =
      await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: domainPrompt() },
          { role: "user", content: userInput },
        ],
      });

    const domain =
      domainRes.choices[0].message.content;


    // FRAMEWORK

    const frameRes =
      await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: frameworkPrompt() },
          { role: "user", content: intent + domain },
        ],
      });

    const frameworks =
      frameRes.choices[0].message.content;


    // ROLE

    const roleRes =
      await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: rolePrompt() },
          { role: "user", content: intent + domain },
        ],
      });

    const role =
      roleRes.choices[0].message.content;


    // OUTPUT

    const outputRes =
      await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: outputPrompt() },
          { role: "user", content: userInput },
        ],
      });

    const output =
      outputRes.choices[0].message.content;


    // MASTER

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
              frameworks +
              role +
              output,
          },
        ],
      });


    const refined =
      master.choices[0].message.content;


    const stream =
      new ReadableStream({
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
