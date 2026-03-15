import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TONES = {
  professional: "Profesyonel, stratejik, güven veren",
  creative: "Yaratıcı, metaforik, ilham verici",
  technical: "Teknik, mühendislik dili",
  concise: "Minimal, net, kısa",
};

function systemBase(language, tone) {
  const toneText = TONES[tone] || TONES.professional;

  const lang =
    language === "en"
      ? `
CRITICAL:
Write ONLY in English.
Do not use Turkish.
`
      : `
KRİTİK:
Tüm çıktıyı SADECE Türkçe yaz.
İngilizce kelime kullanma.
Başlıklar dahil Türkçe olacak.
`;

  return `
Sen MASTER PROMPT ENGINE v6 sistemisin.

Görev:

Kullanıcı girdisini analiz et
niyeti bul
alanı belirle
framework seç
eksikleri tamamla
en güçlü master prompt üret

${lang}

Ton:
${toneText}

Kurallar:

- Her isteğe aynı format verme
- Gereksiz karmaşıklık ekleme
- Domain'e göre prompt üret
- Framework gerekiyorsa ekle
- Psikoloji gerekiyorsa ekle
- Teknik gerekiyorsa ekle
- AI'dan maksimum verim alacak prompt yaz
`;
}

function intentPrompt() {
  return `
User input analiz et

Kategori seç:

marketing
sales
software
image
video
writing
academic
business
general

JSON ver

{
intent:""
}
`;
}

function frameworkPrompt() {
  return `
Intent'e göre framework seç

marketing → AIDA PAS StoryBrand
sales → objection persuasion closing
software → clean code architecture
image → camera light render
academic → citation analysis
business → strategy ROI

JSON ver

{
frameworks:[]
}
`;
}

function masterPromptBuilder(language) {
  const lang =
    language === "en"
      ? `
Write in English only
`
      : `
KRİTİK:
Sadece Türkçe yaz
`;

  return `
Master prompt üret

${lang}

Kurallar:

- Gereksiz başlık ekleme
- Gerekirse başlık ekle
- Framework kullan
- Eksikleri tamamla
- AI için optimize et
- Açıklama yazma
- Direkt prompt üret
`;
}

function refinePrompt() {
  return `
Prompt Refiner

Görev:

Prompt'u daha güçlü yap

- daha net
- daha derin
- daha ikna edici
- daha teknik
- daha optimize

Formatı bozma
`;
}

function scorePrompt(language) {
  if (language === "en") {
    return `
Score prompt 0-100

JSON:

{
score:number,
reason:string
}
`;
  }

  return `
KRİTİK:
Sadece Türkçe yaz

Promptu değerlendir

0-100 puan ver

JSON:

{
score:number,
reason:string
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

    // INTENT

    const intentRes =
      await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0,
        response_format: { type: "json_object" },
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
      JSON.parse(
        intentRes.choices[0].message.content
      );

    // FRAMEWORK

    const frameRes =
      await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: frameworkPrompt(),
          },
          {
            role: "user",
            content: intent.intent,
          },
        ],
      });

    const frameworks =
      JSON.parse(
        frameRes.choices[0].message.content
      );

    // MASTER

    const master =
      await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content: systemBase(
              language,
              tone
            ),
          },
          {
            role: "user",
            content: `
INPUT:
${userInput}

INTENT:
${intent.intent}

FRAMEWORKS:
${frameworks.frameworks.join(",")}

${previousPrompt || ""}
`,
          },
          {
            role: "system",
            content:
              masterPromptBuilder(language),
          },
        ],
      });

    const masterPrompt =
      master.choices[0].message.content;

    // REFINE

    const refine =
      await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: refinePrompt(),
          },
          {
            role: "user",
            content: masterPrompt,
          },
        ],
      });

    const refined =
      refine.choices[0].message.content;

    // SCORE

    const score =
      await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              scorePrompt(language),
          },
          {
            role: "user",
            content: refined,
          },
        ],
      });

    const scoreData =
      JSON.parse(
        score.choices[0].message.content
      );

    return NextResponse.json({
      prompt: refined,
      intent: intent.intent,
      frameworks: frameworks.frameworks,
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
