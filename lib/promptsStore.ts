/**
 * Server-side prompt store backed by a local JSON file.
 *
 * In production, swap `read()` / `write()` for a Prisma/Drizzle/KV call.
 * The `.data/` directory is git-ignored; on read-only file-systems (some
 * serverless runtimes) the store silently falls back to an empty list.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { SavedPrompt } from './types';

const DATA_DIR =
  process.env.NODE_ENV === 'production'
    ? '/tmp/promptlab-data'
    : join(process.cwd(), '.data');

const DATA_FILE = join(DATA_DIR, 'saved-prompts.json');

function ensureDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function read(): SavedPrompt[] {
  try {
    ensureDir();
    if (!existsSync(DATA_FILE)) return [];
    const raw = readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as SavedPrompt[];
  } catch {
    return [];
  }
}

function write(prompts: SavedPrompt[]): void {
  try {
    ensureDir();
    writeFileSync(DATA_FILE, JSON.stringify(prompts, null, 2), 'utf-8');
  } catch {
    // Ignore write errors (e.g., read-only filesystem in some envs)
  }
}

function generateId(): string {
  // crypto.randomUUID is available in Node.js 19+ and all modern runtimes.
  // Fall back to a timestamp+random suffix for older environments.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 6)}`;
}

export const promptsStore = {
  list(): SavedPrompt[] {
    return read();
  },

  create(
    data: Omit<SavedPrompt, 'id' | 'createdAt' | 'updatedAt'>
  ): SavedPrompt {
    const prompts = read();
    const now = new Date().toISOString();
    const entry: SavedPrompt = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    write([entry, ...prompts]);
    return entry;
  },

  update(
    id: string,
    data: Partial<Pick<SavedPrompt, 'title'>>
  ): SavedPrompt | null {
    const prompts = read();
    const index = prompts.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated: SavedPrompt = {
      ...prompts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    prompts[index] = updated;
    write(prompts);
    return updated;
  },

  delete(id: string): boolean {
    const prompts = read();
    const filtered = prompts.filter((p) => p.id !== id);
    if (filtered.length === prompts.length) return false;
    write(filtered);
    return true;
  },
};
