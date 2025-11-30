import { useTheme } from '../hooks/useTheme';

import { Sun, Moon } from 'lucide-react';

/**
 * A button component that allows the user to toggle between light and dark themes.
 * It uses the `useTheme` hook to access the current theme and the toggle function.
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;
