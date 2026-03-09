import { NextResponse } from 'next/server';
import { promptsStore } from '@/lib/promptsStore';
import { MAX_TITLE_LENGTH } from '@/lib/types';

const VALID_LANGUAGES = new Set(['tr', 'en']);
const VALID_TONES = new Set(['professional', 'creative', 'technical', 'concise']);

export async function GET() {
  const prompts = promptsStore.list();
  return NextResponse.json(prompts);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, input, output, language, tone } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { error: 'Kayıt adı (title) zorunludur.' },
        { status: 400 }
      );
    }
    if (!input || typeof input !== 'string' || !input.trim()) {
      return NextResponse.json(
        { error: 'Geçerli bir girdi (input) zorunludur.' },
        { status: 400 }
      );
    }
    if (!output || typeof output !== 'string' || !output.trim()) {
      return NextResponse.json(
        { error: 'Geçerli bir çıktı (output) zorunludur.' },
        { status: 400 }
      );
    }

    const saved = promptsStore.create({
      title: title.trim().slice(0, MAX_TITLE_LENGTH),
      input: input.trim(),
      output,
      language: VALID_LANGUAGES.has(language) ? language : 'tr',
      tone: VALID_TONES.has(tone) ? tone : 'professional',
    });

    return NextResponse.json(saved, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 });
  }
}
