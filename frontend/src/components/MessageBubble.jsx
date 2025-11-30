import React, { useState } from 'react';

import { useTypewriter } from '../hooks/useTypewriter';

import { Bot, User, Copy, Check } from 'lucide-react';

/**
 * Renders a single message bubble in the chat area.
 * It handles different styles for user and AI messages, applies a typewriter effect
 * for AI responses, and includes a copy-to-clipboard functionality.
 * @param {object} props - The component props.
 * @param {object} props.msg - The message object containing text, sender, and animation flag.
 * @param {React.ReactNode} props.avatar - The avatar element to display next to the message.
 */
const MessageBubble = ({ msg, avatar }) => {
  const { text, sender, shouldAnimate } = msg;
  const isUser = sender === 'user';
  
  // Apply typewriter effect only to non-user messages.
  const displayedText = isUser ? text : useTypewriter(text, 20);

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Split the message content to render code blocks separately.
  const parts = displayedText.split(/(```[\s\S]*?```)/g).filter(part => part);

  const bubbleAlignment = isUser ? 'justify-end' : 'justify-start';
  const bubbleStyles = isUser
    ? 'bg-ensa-accent/20 dark:bg-ensa-accent/30 border-ensa-accent/30 dark:border-ensa-accent/40 rounded-tr-lg'
    : 'bg-white/50 dark:bg-slate-500/20 border-slate-200/50 dark:border-slate-600/50 rounded-tl-lg';

  // The outer container acts as a 'group' for CSS hover effects on child elements.
  return (
    <div className={`group w-full flex items-start gap-2 ${bubbleAlignment} ${shouldAnimate ? 'animate-fade-in-up' : ''}`}>
      
      {!isUser && <div className="w-8 h-8 flex-shrink-0">{avatar}</div>}
      
      <div className={`max-w-xl p-3.5 rounded-2xl shadow-md border backdrop-blur-sm ${bubbleStyles}`}>
        {parts.map((part, index) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            const code = part.replace(/```/g, '');
            return (
              <div key={index} className="dark:bg-slate-900/70 bg-slate-200/50 rounded-lg my-2 p-4 text-sm text-slate-800 dark:text-slate-200 font-mono overflow-x-auto">
                <pre><code>{code}</code></pre>
              </div>
            );
          }
          return <p key={index} className="text-slate-800 dark:text-slate-100 text-sm whitespace-pre-wrap">{part}</p>;
        })}
      </div>

      {/* Copy button appears on hover for AI messages only. */}
      {!isUser && (
        <button
          onClick={handleCopy}
          className="self-center p-1.5 rounded-full text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
          aria-label="Copier le message"
        >
          {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        </button>
      )}

      {isUser && <div className="w-6 h-6 flex-shrink-0">{avatar}</div>}

    </div>
  );
};

export default MessageBubble;