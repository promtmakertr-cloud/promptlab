export type Language = 'tr' | 'en';
export type Tone = 'professional' | 'creative' | 'technical' | 'concise';

export const MAX_TITLE_LENGTH = 100;

export type SavedPrompt = {
  id: string;
  title: string;
  input: string;
  output: string;
  language: Language;
  tone: Tone;
  createdAt: string;
  updatedAt: string;
};
