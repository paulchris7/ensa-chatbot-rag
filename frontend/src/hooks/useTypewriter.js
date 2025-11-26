import { useState, useEffect } from 'react';

/**
 * A custom hook for a typewriter effect.
 * @param {string} text The text to be typed.
 * @param {number} speed The typing speed in milliseconds.
 * @returns {string} The text that is currently displayed.
 */
export const useTypewriter = (text, speed = 50) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText(''); // Reset on text change

    if (text) {
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, speed);

      return () => {
        clearInterval(typingInterval);
      };
    }
  }, [text, speed]);

  return displayedText;
};
