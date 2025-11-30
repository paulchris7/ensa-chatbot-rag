import { createContext, useState, useEffect } from 'react';

/**
 * React context for providing theme-related data (the theme name and a toggle function).
 */
export const ThemeContext = createContext();

/**
 * Provides theme state and a function to toggle it to its children components.
 * It persists the theme choice to localStorage and applies the corresponding
 * CSS class to the document's root element.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render.
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Initialize state from localStorage or default to 'light'.
    return localStorage.getItem('theme') || 'light'
  });

  // Effect to apply theme changes to the DOM and localStorage.
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Clean up old theme class and apply the new one.
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Persist the theme choice.
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
