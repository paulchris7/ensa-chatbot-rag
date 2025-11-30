import { useState } from 'react';

import ThemeToggle from './ThemeToggle';

import { Plus, MessageSquare, PanelLeftClose, PanelLeftOpen, User } from 'lucide-react';
import ensaLogo from '../assets/ensa-logo.png';

/**
 * Renders the application's sidebar for navigation and conversation history.
 * Manages its own collapsed state and handles mobile vs. desktop layouts.
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Controls visibility on mobile screens.
 * @param {() => void} props.onClose - Callback to close the sidebar on mobile.
 * @param {Array<object>} props.conversations - The list of conversation objects.
 * @param {string|null} props.activeId - The ID of the currently active conversation.
 * @param {(id: string) => void} props.onSelectConversation - Callback when a conversation is selected.
 * @param {() => void} props.onCreateNewChat - Callback to create a new chat.
 */
const Sidebar = ({ isOpen, onClose, conversations, activeId, onSelectConversation, onCreateNewChat }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Dynamically sets sidebar classes for responsive and collapsed states.
  const sidebarClasses = `
    h-full flex flex-col
    bg-white/60 dark:bg-black/40 
    backdrop-blur-md
    border-r border-slate-300/30 dark:border-slate-700/30
    shadow-lg
    absolute md:relative 
    z-30 md:z-auto
    transform transition-all duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0
    w-64 ${isCollapsed ? 'md:w-20' : 'md:w-64'}
  `;

  /**
   * Handles the 'New Chat' button click.
   * It triggers the creation of a new chat and closes the sidebar on mobile.
   */
  const handleNewChatClick = () => {
    onCreateNewChat();
    onClose(); // Closes sidebar on mobile after action.
  };

  return (
    <div className={sidebarClasses}>
      {/* --- HEADER --- */}
      <div className={`flex items-center h-[69px] p-4 border-b border-slate-300/30 dark:border-slate-700/30 ${isCollapsed ? 'md:justify-center' : 'justify-between'}`}>
        {/* Logo: visible only when expanded */}
        <div className={isCollapsed ? 'hidden' : 'block'}>
           <img src={ensaLogo} alt="ENSA Marrakech Logo" className="h-10 object-contain" />
        </div>
        
        {/* Toggle Button: visible only on desktop */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:block p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
        >
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>

        {/* Close Button: visible only on mobile */}
        <button onClick={onClose} className="md:hidden absolute top-5 right-4 p-1 text-slate-600 dark:text-slate-300">
          <PanelLeftClose size={24} />
        </button>
      </div>

      {/* --- BODY --- */}
      <div className="px-4 mt-6">
        <button 
          onClick={handleNewChatClick}
          className={`w-full flex items-center gap-3 font-medium text-white
                     bg-blue-800/40 hover:bg-blue-800/60
                     backdrop-blur-md
                     border border-blue-400/20
                     shadow-sm
                     transition-colors duration-200
                     ${isCollapsed ? 'md:justify-center md:w-12 md:h-12 md:rounded-full' : 'justify-center h-12 rounded-lg'}`}
        >
          <Plus size={20} />
          <span className={`${isCollapsed ? 'md:hidden' : 'inline'} whitespace-nowrap`}>Nouvelle conversation</span>
        </button>
      </div>

      {/* Conversation list: hidden on desktop when collapsed */}
      <div className={`flex-grow overflow-y-auto px-4 mt-6 ${isCollapsed ? 'md:hidden' : 'block'}`}>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 px-2">Historique</h2>
        <div className="space-y-2">
          {conversations.map((convo) => {
            const isActive = convo.id === activeId;
            return (
              <div
                key={convo.id}
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-200 ${isActive ? 'bg-blue-100/70 dark:bg-ensa-accent/20 text-slate-900 dark:text-slate-50 font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-blue-100/50 dark:hover:bg-slate-800/60'}`}
                onClick={() => onSelectConversation(convo.id)}
              >
                <MessageSquare size={18} />
                <span className="text-sm truncate">{convo.title}</span>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Spacer to push footer to the bottom */}
      <div className="flex-1"></div>

      {/* --- FOOTER --- */}
      <div className={`flex-shrink-0 p-4 border-t border-slate-300/30 dark:border-slate-700/30 ${isCollapsed ? 'md:flex md:flex-col-reverse md:items-center md:gap-4' : 'flex items-center justify-between'}`}>
        {/* User Profile Section */}
        <button className={`w-full flex items-center gap-3 p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 ${isCollapsed ? 'md:justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-ensa-accent flex items-center justify-center font-semibold text-sm text-white flex-shrink-0">ET</div>
          <span className={isCollapsed ? 'md:hidden' : 'inline'}>Mon Profil</span>
        </button>

        <ThemeToggle />
      </div>
    </div>
  );
};

export default Sidebar;
