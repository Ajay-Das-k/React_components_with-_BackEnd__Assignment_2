import React, { useEffect, useState } from 'react';

function TypingEffect({ text, delay }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (displayedText.length === text.length) {
        clearInterval(typingInterval);
      } else {
        setDisplayedText((prevText) => prevText + text.charAt(prevText.length));
      }
    }, delay);

    return () => clearInterval(typingInterval);
  }, [displayedText, text, delay]);

  return <p>{displayedText}</p>;
}

export default TypingEffect;
