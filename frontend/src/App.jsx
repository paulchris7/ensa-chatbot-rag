import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { Menu } from 'lucide-react';

const USE_MOCK_API = false;

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // FIX DÉFINITIF ANIMATION: Ce `useEffect` se déclenche après la sélection d'un nouveau chat.
  // Il attend que l'animation se joue, puis met à jour le state pour que les messages
  // ne se ré-animent plus la prochaine fois.
  useEffect(() => {
    if (!activeId) return;

    const timer = setTimeout(() => {
      setConversations(prev =>
        prev.map(convo => {
          if (convo.id === activeId && convo.messages.some(m => m.shouldAnimate)) {
            return {
              ...convo,
              messages: convo.messages.map(m => ({ ...m, shouldAnimate: false })),
            };
          }
          return convo;
        })
      );
    }, 1000); // Délai supérieur à la durée de l'animation

    return () => clearTimeout(timer);
  }, [activeId, conversations]); // Déclenché quand on change de chat ou que la conv est mise à jour

  const createNewChat = () => {
    setActiveId(null);
  };

  const handleSelectConversation = (id) => {
    // La logique de nettoyage est maintenant dans le useEffect.
    // On se contente de changer l'ID actif.
    if (id !== activeId) {
      setActiveId(id);
    }
  };

  const handleSendMessage = async (text) => {
    const userMessage = { id: Date.now(), text, sender: 'user', shouldAnimate: true };
    let conversationIdForApi = activeId;

    setIsLoading(true);

    if (activeId === null) {
      const newId = Date.now();
      conversationIdForApi = newId;
      
      const newConversation = {
        id: newId,
        title: text.length > 30 ? text.substring(0, 30) + '...' : text,
        messages: [userMessage],
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setActiveId(newId);
    } else {
      setConversations(prev =>
        prev.map(convo =>
          convo.id === activeId
            ? { ...convo, messages: [...convo.messages, userMessage] }
            : convo
        )
      );
    }

    if (USE_MOCK_API) {
      setTimeout(() => {
        const aiResponse = { 
          id: Date.now() + 1, 
          text: "Ceci est une simulation de réponse de l'IA.",
          sender: 'ai',
          shouldAnimate: true,
        };
        setConversations(prev =>
          prev.map(convo =>
            convo.id === conversationIdForApi
              ? { ...convo, messages: [...convo.messages, aiResponse] }
              : convo
          )
        );
        setIsLoading(false);
      }, 1500);
    } else {
      try {
        const response = await fetch('http://localhost:5000/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: text, conversationId: conversationIdForApi }),
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const aiResponse = { 
          id: Date.now() + 1, 
          text: data.answer, 
          sender: 'ai', 
          shouldAnimate: true,
        };
        
        setConversations(prev =>
          prev.map(convo =>
            convo.id === conversationIdForApi
              ? { ...convo, messages: [...convo.messages, aiResponse] }
              : convo
          )
        );

      } catch (error) {
        console.error('Error fetching data:', error);
        const errorResponse = {
          id: Date.now() + 1,
          text: "Désolé, une erreur s'est produite.",
          sender: 'ai',
          isError: true,
          shouldAnimate: true,
        };
        setConversations(prev =>
          prev.map(convo =>
            convo.id === conversationIdForApi
              ? { ...convo, messages: [...convo.messages, errorResponse] }
              : convo
          )
        );
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const activeConversation = conversations.find(c => c.id === activeId);
  const currentMessages = activeConversation?.messages || [];

  return (
    <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 text-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 dark:text-slate-100">
      {!isSidebarOpen && (
        <div className="md:hidden absolute top-4 left-4 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-800 dark:text-slate-200">
            <Menu size={24} />
          </button>
        </div>
      )}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={handleSelectConversation}
        onCreateNewChat={createNewChat}
      />
      <ChatArea 
        activeConversation={activeConversation}
        messages={currentMessages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default App;