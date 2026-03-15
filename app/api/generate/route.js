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

const ROLES = {
  sales:    "Sales Strategist",
  business: "Business Consultant / CFO",
  marketing:"Marketing Strategist",
  software: "Software Architect",
  image:    "Creative Director",
  writing:  "Storyteller",
  academic: "Researcher",
  video:    "Creative Director",
  general:  "Expert Consultant",
};

function systemBase(language, tone, intent) {
  const toneText = TONES[tone] || TONES.professional;
  const role = ROLES[intent] || ROLES.general;

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
Sen MASTER PROMPT ENGINE v8 sistemisin.

Görev:

Kullanıcı isteğini analiz et
niyeti bul
alanı belirle
uzman rol seç
framework seç
eksik parametre ekle
en doğru prompt üret

${lang}

Uzman Rol:
${role}

Ton:
${toneText}

Rol Seçim Kuralları:

- sales → Sales Strategist
- business → Business Consultant / CFO
- marketing → Marketing Strategist
- software → Software Architect
- image → Creative Director
- writing → Storyteller
- academic → Researcher
- video → Creative Director
- general → Expert Consultant

Üretilen master prompt bu rolün bakış açısıyla yazılmalı.
Rol, promptun içinde açıkça belirtilmeli.

Kurallar:

- Domain'e göre rol seç
- Domain'e göre format seç
- Domain'e göre teknik detay ekle
- Gerekirse tablo iste
- Gerekirse liste iste
- Gerekirse analiz iste
- Gerekirse itiraz üret
- Eksik parametreleri tamamla

Master prompt:

✔ rol içermeli
✔ bağlam içermeli
✔ teknik detay içermeli
✔ çıktı formatı içermeli
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

sales →
objection handling
persuasion
closing
AIDA
PAS

business →
financial analysis
cashflow
budgeting
ROI
cost optimization
table output

software →
clean code
architecture
design patterns
api structure

image →
camera
lighting
lens
render engine

writing →
story structure
tone control

academic →
analyse
citation

marketing →
AIDA
PAS
StoryBrand

JSON ver

{
frameworks:[]
}
`;
}

function masterPromptBuilder(language, intent) {

  const lang =
    language === "en"
      ? "Write only English"
      : "Sadece Türkçe yaz";

  const role = ROLES[intent] || ROLES.general;

  return `
Master prompt üret

${lang}

Sen bir ${role} olarak yazıyorsun.
Promptun başında bu rolü açıkça belirt.

Kurallar:

- Rolü promptun ilk satırında tanımla
- Bağlam yaz
- Teknik detay ekle
- Framework kullan
- Çıktı formatı yaz
- Eksik parametreleri değişken olarak ekle
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
              tone,
              intent.intent
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
              masterPromptBuilder(language, intent.intent),
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

    // Stream only the refined prompt text back to the UI
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(refined));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (e) {
    console.log(e);

    return NextResponse.json(
      { error: "fail" },
      { status: 500 }
    );
  }
}
