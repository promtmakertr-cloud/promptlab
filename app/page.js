import PromptForm from '@/components/PromptForm';

export const metadata = {
  title: 'PromptLab – AI Prompt Üreticisi',
  description: 'ChatGPT, Claude ve Gemini için anında güçlü AI promptları üretin.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-2xl flex flex-col items-center gap-10">
        <header className="text-center flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Prompt<span className="text-indigo-400">Lab</span>
          </h1>
          <p className="text-gray-400 text-base">AI Prompt Üreticisi</p>
        </header>

        <PromptForm />
      </div>
    </main>
  );
}