'use client';

import { useState } from 'react';
import AIToolSelector from '@/components/AIToolSelector';

export default function Home() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <main style={{ 
      padding: '2rem', 
      background: '#050505', 
      color: '#fff', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🎯 PromptLab</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => setResult('Your generated prompt here...')}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Generating...' : 'Generate Prompt'}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Generated Prompt:</h2>
          <p style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px' }}>
            {result}
          </p>
          <AIToolSelector generatedText={result} />
        </div>
      )}
    </main>
  );
}