import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

/**
 * Custom hook for accessing the theme context.
 * Provides a convenient way to get the current theme and the toggle function.
 * Throws an error if used outside of a ThemeProvider.
 * @returns {{theme: string, toggleTheme: () => void}} The theme context value.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
