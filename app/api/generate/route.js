import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Engine modüllerinin varsayılan import yolları (kendi yapınıza göre güncelleyebilirsiniz)
import { detectLanguage } from '@/lib/engine/language';
import { detectDomain } from '@/lib/engine/domain';
import { detectFramework } from '@/lib/engine/framework';
import { detectOutputType } from '@/lib/engine/output';
import { calculateScore } from '@/lib/engine/score';
import { selectMode } from '@/lib/engine/autoMode';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { input, model = 'gpt-4o' } = body;

    if (!input) {
      return NextResponse.json({ error: 'Input girdisi eksik.' }, { status: 400 });
    }

    // 1. ENGINE DETECTORS (Sistem Değişkenlerini Algılama)
    const language = await detectLanguage(input); 
    const domain = await detectDomain(input);
    const framework = await detectFramework(input);
    const outputType = await detectOutputType(input);
    const score = await calculateScore(input);
    const mode = await selectMode(score); // FAST, BALANCED, PRO, ULTRA

    // 2. MASTER PROMPT BUILDER (META PROMPT)
    // EXECUTION BLOCKER: İçerik üretmeyi kesinlikle yasaklayan katı sistem talimatı
    const systemInstruction = `You are an elite "Master Prompt Engineer" system. 
YOUR SOLE PURPOSE IS TO WRITE PROMPTS. 

CRITICAL EXECUTION BLOCKERS:
- YOU MUST NEVER GENERATE THE ACTUAL CONTENT, ARTICLE, CODE, OR PLAN.
- YOU MUST NEVER ANSWER THE USER'S REQUEST DIRECTLY.
- YOUR ONLY OUTPUT MUST BE A PROMPT THAT INSTRUCTS ANOTHER AI TO DO THE TASK.

MANDATORY STRUCTURE:
You MUST format your response using EXACTLY these markdown headers. Do not add, change, or remove any headers:
ROLE
CONTEXT
TASK
RULES
CONSTRAINTS
OUTPUT FORMAT

LANGUAGE REQUIREMENT:
The entire prompt you generate MUST be written perfectly in: ${language}. Do not use any other language.

CONTEXTUAL DATA TO INJECT:
- Domain: ${domain}
- Framework: ${framework}
- Target Output Type: ${outputType}`;

    const userInstruction = `User's raw input: "${input}"\n\nAnalyze this input and generate the professional Master Prompt using the mandatory structure.`;

    // 3. FIRST AI CALL
    const firstResponse = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userInstruction }
      ],
      temperature: 0.3, // Düşük sıcaklık: Halüsinasyonu önler ve formata sadık kalır
    });

    let generatedPrompt = firstResponse.choices[0].message.content;

    // 4. REFINE SYSTEM (PRO / ULTRA MODES)
    // Refine aşamasında formatın bozulmasını engelleyen koruyucu yapı
    if (mode === 'PRO' || mode === 'ULTRA') {
      const isUltra = mode === 'ULTRA';
      
      const refineSystemInstruction = `You are a strict Prompt Optimizer. Your job is to enhance an existing prompt.
      
CRITICAL RULES:
1. DO NOT execute the prompt. DO NOT generate the content it asks for.
2. YOU MUST strictly keep the text in this language: ${language}.
3. YOU MUST strictly preserve these exact headers without adding markdown symbols like # unless they were already there: ROLE, CONTEXT, TASK, RULES, CONSTRAINTS, OUTPUT FORMAT.
4. Enhance the instructions to be more precise, professional, and foolproof.
${isUltra ? '5. ULTRA MODE ACTIVE: Inject advanced edge-case handling, negative constraints (what NOT to do), and structural rigidity into the RULES and CONSTRAINTS sections. Ensure the target AI has zero room for error.' : ''}`;

      const refineResponse = await openai.chat.completions.create({
        model: isUltra ? 'gpt-4o' : model, // ULTRA modda her zaman en güçlü modeli zorla
        messages: [
          { role: 'system', content: refineSystemInstruction },
          { role: 'user', content: `Enhance the following prompt while strictly maintaining its structure:\n\n${generatedPrompt}` }
        ],
        temperature: 0.2, // Refine aşamasında çok daha düşük sıcaklık, yapıyı kilitler
      });

      generatedPrompt = refineResponse.choices[0].message.content;
    }

    // 5. RESULT & DEBUG JSON
    return NextResponse.json({
      success: true,
      debug: {
        mode,
        language,
        domain,
        framework,
        outputType,
        score
      },
      prompt: generatedPrompt,
    });

  } catch (error) {
    console.error('Master Prompt Engine Error:', error);
    return NextResponse.json({ error: 'Engine execution failed', details: error.message }, { status: 500 });
  }
}
