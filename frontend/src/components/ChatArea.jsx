import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import InputZone from './InputZone';
import { Bot, User, LoaderCircle, CalendarDays, BookText, Milestone } from 'lucide-react';
import ensaLogo from '../assets/ensa-logo.png';

const WelcomeScreen = ({ onPromptClick }) => {
  const prompts = [
    { 
      icon: <CalendarDays size={20} className="mr-2" />, 
      displayText: "Calendrier des examens",
      fullText: "J'aimerais consulter le calendrier des examens pour ce semestre." 
    },
    { 
      icon: <BookText size={20} className="mr-2" />,
      displayText: "Règlement intérieur",
      fullText: "Quels sont les points clés du règlement intérieur ?"
    },
    { 
      icon: <Milestone size={20} className="mr-2" />,
      displayText: "Clubs parascolaires",
      fullText: "Quels sont les clubs parascolaires actifs à l'ENSA ?"
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-fade-in">
      <img src={ensaLogo} alt="ENSA Marrakech Logo" className="w-32 h-32 mb-6 opacity-90" />
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
        Bienvenue sur l'Assistant ENSA
      </h2>
      <p className="text-slate-600 dark:text-slate-300 mb-10 max-w-md">
        Je peux répondre à vos questions sur la scolarité, les règlements et les emplois du temps.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {prompts.map((prompt, index) => (
          <div
            key={index}
            onClick={() => onPromptClick(prompt.fullText)}
            className="p-4 rounded-lg bg-slate-200/40 dark:bg-slate-800/40 border border-slate-300/50 dark:border-slate-700/50 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-800/70 transition-colors duration-300 flex items-center justify-center text-center"
          >
            {prompt.icon}
            <span className="text-slate-700 dark:text-slate-200 text-sm font-medium">{prompt.displayText}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChatArea = ({ activeConversation, messages, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Le Welcome Screen est montré si aucune conversation n'est active.
  const showWelcomeScreen = !activeConversation;

  return (
    <main className="flex-1 flex flex-col h-screen bg-transparent">
      {/* Header: s'affiche seulement si une conversation est active */}
      {activeConversation && (
        <header className="relative bg-white/60 dark:bg-black/40 backdrop-blur-md shadow-md p-4 flex items-center justify-center z-10">
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 truncate">
            {activeConversation.title}
          </h1>
        </header>
      )}

      {/* Conditional Content: Welcome Screen or Messages */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col">
        {showWelcomeScreen && !isLoading ? (
          <WelcomeScreen onPromptClick={onSendMessage} />
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                avatar={msg.sender === 'user' ? <User className="w-6 h-6 text-slate-800 dark:text-slate-200" /> : <Bot className="w-8 h-8 text-slate-800 dark:text-slate-200" />}
              />
            ))}
            {isLoading && (
              <div className="flex justify-center items-center pt-4">
                <LoaderCircle className="w-8 h-8 text-slate-500 dark:text-slate-400 animate-spin" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Zone wrapper is now transparent */}
      <div className="p-6">
        <InputZone onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </main>
  );
};

export default ChatArea;