import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TONE = {
  professional:
    "Otoriter, stratejik, sonuç odaklı.",
  creative:
    "Yaratıcı, metaforik, ilham verici.",
  technical:
    "Mühendislik dili, metrik odaklı, jargon yüksek.",
  concise:
    "Minimal, kısa, vurucu.",
};

function buildSystemPrompt(tone, language) {
  const toneText = TONE[tone] || TONE.professional;

  const langText =
    language === "en"
      ? "Write everything in English."
      : "Tüm içeriği Türkçe yaz.";

  return `
Sen MASTER PROMPT ENGINE v4 sistemisin.

GÖREV:
Kullanıcı girdisini analiz et,
eksikleri tamamla,
framework ekle,
optimize et,
final master prompt üret.

ALGORİTMA

1. intent detect
2. missing params
3. inject framework
4. optimize structure
5. final master prompt

TON:
${toneText}

DİL:
${langText}

FORMAT:

**Expertise Role:**
**Task & Context:**
**Technical Details:**
**Style & Tone:**
**Desired Output Format:**

Kurallar:

- en az 4 teknik madde
- açıklama yapma
- direkt prompt üret
`;
}

function buildRefinePrompt() {
  return `
Sen Prompt Refiner AI'sın.

Görev:

Verilen master prompt'u

- daha derin
- daha teknik
- daha net
- daha optimize

hale getir.

Kurallar:

- aynı format
- daha güçlü
- daha uzun
- daha profesyonel
`;
}

function buildScorePrompt() {
  return `
Prompt Quality Analyzer

0-100 arası puan ver.

Kriterler:

- clarity
- completeness
- ai efficiency
- depth
- structure

JSON ver:

{
score: number,
reason: string
}
`;
}

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      userInput,
      language = "tr",
      tone = "professional",
      previousPrompt,
    } = body;

    if (!userInput) {
      return NextResponse.json(
        { error: "input gerekli" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(
      tone,
      language
    );

    const userMessage = previousPrompt
      ? `MEVCUT PROMPT:\n${previousPrompt}\n\nİSTEK:\n${userInput}`
      : `INPUT:\n${userInput}`;

    // -------------------
    // STEP 1 → MASTER
    // -------------------

    const master = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const masterPrompt =
      master.choices[0].message.content;

    // -------------------
    // STEP 2 → REFINE
    // -------------------

    const refine = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: buildRefinePrompt(),
        },
        {
          role: "user",
          content: masterPrompt,
        },
      ],
    });

    const refinedPrompt =
      refine.choices[0].message.content;

    // -------------------
    // STEP 3 → SCORE
    // -------------------

    const score = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: buildScorePrompt(),
        },
        {
          role: "user",
          content: refinedPrompt,
        },
      ],
    });

    const scoreData = JSON.parse(
      score.choices[0].message.content
    );

    // -------------------
    // FINAL
    // -------------------

    return NextResponse.json({
      prompt: refinedPrompt,
      score: scoreData.score,
      reason: scoreData.reason,
    });
  } catch (e) {
    console.log(e);

    return NextResponse.json(
      { error: "fail" },
      { status: 500 }
    );
  }
}
