import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// INTENT

function intentPrompt() {
  return `Detect intent JSON {intent:""}`;
}


// DOMAIN

function domainPrompt() {
  return `Detect domain JSON {domain:""}`;
}


// FRAMEWORK

function frameworkPrompt() {
  return `Select frameworks JSON {frameworks:[]}`;
}


// ROLE

function rolePrompt() {
  return `Generate expert role JSON {role:""}`;
}


// OUTPUT

function outputPrompt() {
  return `Detect output JSON {output:""}`;
}


// VARIABLES

function variablePrompt() {
  return `
Extract variables

goal
audience
format
tone
constraints

Return JSON

{
goal:"",
audience:"",
format:"",
tone:"",
constraints:""
}
`;
}


// MASTER

function masterPromptBuilder() {
  return `
Create master prompt.

Use:

Role
Domain
Framework
Variables
Output type

Return prompt
`;
}



export async function POST(req) {

  try {

    const { userInput } = await req.json();


    // INTENT

    const intent =
      (
        await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: intentPrompt() },
            { role: "user", content: userInput },
          ],
        })
      ).choices[0].message.content;



    // DOMAIN

    const domain =
      (
        await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: domainPrompt() },
            { role: "user", content: userInput },
          ],
        })
      ).choices[0].message.content;



    // FRAMEWORK

    const frameworks =
      (
        await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: frameworkPrompt() },
            { role: "user", content: intent + domain },
          ],
        })
      ).choices[0].message.content;



    // ROLE

    const role =
      (
        await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: rolePrompt() },
            { role: "user", content: intent + domain },
          ],
        })
      ).choices[0].message.content;



    // OUTPUT

    const output =
      (
        await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: outputPrompt() },
            { role: "user", content: userInput },
          ],
        })
      ).choices[0].message.content;



    // VARIABLES

    const variables =
      (
        await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: variablePrompt() },
            { role: "user", content: userInput },
          ],
        })
      ).choices[0].message.content;



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
              output +
              variables,
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
