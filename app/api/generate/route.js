import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function intentPrompt() {
  return `Detect intent JSON {intent:""}`;
}

function domainPrompt() {
  return `Detect domain JSON {domain:""}`;
}

function frameworkPrompt() {
  return `
Select MULTIPLE frameworks.

AIDA
PAS
SWOT
STP
StoryBrand
JTBD
First Principles
SCAMPER
Lean
Porter Five Forces
PESTLE
OKR
Agile
Design Thinking
Clean Architecture
MVC
Prompt Engineering
Chain of Thought

Return JSON
{frameworks:[]}
`;
}

function rolePrompt() {
  return `Generate expert role JSON {role:""}`;
}

function outputPrompt() {
  return `Detect output JSON {output:""}`;
}

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

function masterPromptBuilder() {
  return `
Create structured master prompt

ROLE
CONTEXT
GOAL
VARIABLES
FRAMEWORKS
INSTRUCTIONS
OUTPUT FORMAT
`;
}

function scorePrompt() {
  return `
Score this prompt 1-10

Return JSON

{
score:0,
feedback:""
}
`;
}

function refinePrompt() {
  return `
Improve this prompt.

Make it more clear
More structured
Better role
Better framework use
Better instructions

Return improved prompt
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

    const domain =
      (await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: domainPrompt() },
          { role: "user", content: userInput },
        ],
      })).choices[0].message.content;

    const frameworks =
      (await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: frameworkPrompt() },
          { role: "user", content: intent + domain },
        ],
      })).choices[0].message.content;

    const role =
      (await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: rolePrompt() },
          { role: "user", content: intent + domain },
        ],
      })).choices[0].message.content;

    const output =
      (await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: outputPrompt() },
          { role: "user", content: userInput },
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

    let promptText =
      master.choices[0].message.content;

    // SCORE

    const scoreRes =
      await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: scorePrompt() },
          { role: "user", content: promptText },
        ],
      });

    const scoreText =
      scoreRes.choices[0].message.content;

    let finalPrompt = promptText;

    // REFINE if needed

    if (!scoreText.includes('"score":9') &&
        !scoreText.includes('"score":10')) {

      const refineRes =
        await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: refinePrompt(),
            },
            {
              role: "user",
              content: promptText,
            },
          ],
        });

      finalPrompt =
        refineRes.choices[0].message.content;
    }

    const stream =
      new ReadableStream({
        async start(controller) {
          controller.enqueue(
            new TextEncoder().encode(finalPrompt)
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
