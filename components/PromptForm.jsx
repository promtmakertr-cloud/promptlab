'use client';

import { useState, useRef, useCallback } from 'react';
import AiLaunchButtons from './AiLaunchButtons';

export default function PromptForm() {
  const [userInput, setUserInput] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const outputRef = useRef(null);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!userInput.trim()) return;

      setIsLoading(true);
      setError('');
      setGeneratedPrompt('');

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userInput: userInput.trim() }),
        });

        if (!res.ok) {
          let message = `Sunucu hatası (${res.status}).`;
          try {
            const data = await res.json();
            if (data?.error) message = data.error;
          } catch {
            // ignore parse errors
          }
          throw new Error(message);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setGeneratedPrompt(accumulated);
        }

        if (outputRef.current) {
          outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } catch (err) {
        setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setIsLoading(false);
      }
    },
    [userInput]
  );

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Prompt'unuzu yazın..."
          rows={5}
          disabled={isLoading}
          className="w-full rounded-xl border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-500 p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className="self-end flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Oluşturuluyor...
            </>
          ) : (
            'Oluştur'
          )}
        </button>
      </form>

      {error && (
        <div className="rounded-xl border border-red-700 bg-red-950 text-red-300 p-4 text-sm">
          {error}
        </div>
      )}

      {(generatedPrompt || isLoading) && (
        <div ref={outputRef} className="flex flex-col gap-4">
          <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">
              Oluşturulan Prompt
            </p>
            <pre className="text-gray-100 text-sm font-mono whitespace-pre-wrap leading-relaxed">
              {generatedPrompt}
              {isLoading && (
                <span className="inline-block w-0.5 h-4 bg-indigo-400 animate-pulse ml-0.5 align-middle" />
              )}
            </pre>
          </div>

          {!isLoading && generatedPrompt && (
            <AiLaunchButtons generatedPrompt={generatedPrompt} />
          )}
        </div>
      )}
    </div>
  );
}
