'use client';

import React, { useEffect, useState } from 'react';

interface AnimatedPopupProps {
  text: string;
  className?: string;
}

export default function AnimatedPopup({ text, className }: AnimatedPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        transform: visible ? 'scale(1)' : 'scale(0)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.5s ease, opacity 0.5s ease',
      }}
    >
      {text}
    </span>
  );
}
