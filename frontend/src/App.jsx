import { useState, useEffect } from 'react';

import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';

import { Menu } from 'lucide-react';

// Configuration flag to toggle between mock and real API.
const USE_MOCK_API = false;

/**
 * Main application component.
 * Acts as the root of the application, managing global state such as conversations,
 * loading status, and the active chat. It orchestrates the main layout,
 * including the Sidebar for navigation and the ChatArea for interaction.
 */
function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // This effect resets animation flags after a new message is displayed.
  // It waits for CSS animations to complete, then updates the state to prevent
  // messages from re-animating when switching between conversations.
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
    }, 1000); // This delay should be longer than the message animation duration.

    return () => clearTimeout(timer);
  }, [activeId, conversations]);

  const createNewChat = () => {
    setActiveId(null);
  };

  const handleSelectConversation = (id) => {
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