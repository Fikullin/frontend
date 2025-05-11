'use client';

import React, { useEffect, useState } from 'react';

interface AnimatedDescriptionProps {
  text: string;
}

export default function AnimatedDescription({ text }: AnimatedDescriptionProps) {
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    setTypedText('');
    let index = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return <p className="mt-6 max-w-3xl text-center text-white text-xl whitespace-pre-wrap break-words">{typedText}</p>;
}
