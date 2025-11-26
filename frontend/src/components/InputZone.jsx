import { useState } from 'react';
import { Send, ClipboardPaste, LoaderCircle } from 'lucide-react';

const InputZone = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (event) => {
    // Action B (FIX) : La logique est correcte.
    // "Enter" envoie, "Shift+Enter" va à la ligne (comportement par défaut).
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  // Action A : Bouton "Coller"
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputValue(prev => prev + text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <div className="flex items-center p-2 bg-white/70 dark:bg-black/50 backdrop-blur-lg border border-slate-300/50 dark:border-slate-700/50 rounded-full shadow-lg">
          <button 
            onClick={handlePaste}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors disabled:opacity-50"
            disabled={isLoading}
            aria-label="Coller depuis le presse-papier"
          >
            <ClipboardPaste size={22} />
          </button>
          <input
            type="text"
            placeholder={isLoading ? "L'IA est en train d'écrire..." : "Posez votre question à l'IA..."}
            className="flex-grow bg-transparent text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none px-4"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-white
                       bg-gradient-to-br from-blue-900 to-blue-700 
                       border border-blue-400/30
                       shadow-lg shadow-blue-900/50
                       transition-all duration-300 
                       hover:scale-110 hover:brightness-110 active:scale-95
                       disabled:scale-100 disabled:bg-gradient-to-br disabled:from-slate-500 disabled:to-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {isLoading ? <LoaderCircle size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputZone;