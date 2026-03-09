import React from 'react';
import { ChatGPT, Gemini, Claude, Perplexity, Copilot } from 'lucide-react';

const AIToolSelector = () => {
    const handleCopy = (tool) => {
        const toolLinks = {
            ChatGPT: 'https://chat.openai.com/',
            Gemini: 'https://gemini.com/',
            Claude: 'https://claude.ai/',
            Perplexity: 'https://www.perplexity.ai/',
            Copilot: 'https://github.com/features/copilot',
        };
        navigator.clipboard.writeText(toolLinks[tool]).then(() => {
            alert(`${tool} link copied to clipboard!`);
        });
    };

    const handleLinkOpen = (url) => {
        window.open(url, '_blank');
    };

    return (
        <div style={{ backgroundColor: '#050505', padding: '20px' }}>
            <h1 style={{ color: '#FFFFFF' }}>AI Tool Selector</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleCopy('ChatGPT')}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#FFFFFF', transition: '0.3s' }}>
                    <ChatGPT />
                </button>
                <button onClick={() => handleCopy('Gemini')}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#FFFFFF', transition: '0.3s' }}>
                    <Gemini />
                </button>
                <button onClick={() => handleCopy('Claude')}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#FFFFFF', transition: '0.3s' }}>
                    <Claude />
                </button>
                <button onClick={() => handleCopy('Perplexity')}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#FFFFFF', transition: '0.3s' }}>
                    <Perplexity />
                </button>
                <button onClick={() => handleCopy('Copilot')}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#FFFFFF', transition: '0.3s' }}>
                    <Copilot />
                </button>
            </div>
        </div>
    );
};

export default AIToolSelector;