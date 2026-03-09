import { NextResponse } from 'next/server';
import { promptsStore } from '@/lib/promptsStore';
import { MAX_TITLE_LENGTH } from '@/lib/types';

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  const deleted = promptsStore.delete(id);
  if (!deleted) {
    return NextResponse.json(
      { error: 'Prompt bulunamadı.' },
      { status: 404 }
    );
  }
  return new Response(null, { status: 204 });
}

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  try {
    const { title } = await req.json();
    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { error: 'Başlık boş olamaz.' },
        { status: 400 }
      );
    }
    const updated = promptsStore.update(id, { title: title.trim().slice(0, MAX_TITLE_LENGTH) });
    if (!updated) {
      return NextResponse.json(
        { error: 'Prompt bulunamadı.' },
        { status: 404 }
      );
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 });
  }
}
