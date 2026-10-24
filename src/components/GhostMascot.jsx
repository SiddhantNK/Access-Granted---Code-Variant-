import React, { useState, useEffect } from 'react';

/**
 * GhostMascot Component - Enhanced with Expressions & Animations
 * 
 * Props:
 * - size: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
 * - expression: 'happy' | 'sad' | 'thinking' | 'scared' | 'neutral' (default: 'happy')
 * - animated: boolean (default: true)
 * - onClick: callback function
 * - className: additional CSS classes
 */
export const GhostMascot = ({ 
  size = 'md', 
  expression = 'happy', 
  animated = true,
  onClick,
  className = '' 
}) => {
  const [blinking, setBlinking] = useState(false);

  // Auto blink every 4-5 seconds
  useEffect(() => {
    if (!animated) return;
    
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, Math.random() * 1000 + 4000);

    return () => clearInterval(blinkInterval);
  }, [animated]);

  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64',
  };

  // Expression-based mouth and eye styles
  const expressionConfig = {
    happy: {
      mouthPath: 'M 86 102 Q 100 118 114 102',
      eyeOffset: 0,
      eyeScale: 1,
      eyeY: 92,
    },
    sad: {
      mouthPath: 'M 86 110 Q 100 100 114 110',
      eyeOffset: 0,
      eyeScale: 0.9,
      eyeY: 92,
    },
    thinking: {
      mouthPath: 'M 95 110 Q 100 105 105 110',
      eyeOffset: 0,
      eyeScale: 0.8,
      eyeY: 88,
    },
    scared: {
      mouthPath: 'M 98 115 L 102 115',
      eyeOffset: 0,
      eyeScale: 1.3,
      eyeY: 90,
    },
    neutral: {
      mouthPath: 'M 86 108 L 114 108',
      eyeOffset: 0,
      eyeScale: 1,
      eyeY: 92,
    },
  };

  const config = expressionConfig[expression] || expressionConfig.happy;

  return (
    <div
      className={`inline-block cursor-pointer ${animated ? 'animate-float' : ''} ${sizeMap[size]} ${className}`}
      onClick={onClick}
      role="img"
      aria-label="Ghost mascot"
    >
      <svg
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        {/* Ghost Body with gradient */}
        <defs>
          <linearGradient id="ghostGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#f0f4f8', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#e8eef5', stopOpacity: 1 }} />
          </linearGradient>
          
          {/* Glow effect */}
          <filter id="ghostGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ghost Body */}
        <path
          id="ghost-body"
          d="M 20 100 
             C 20 20, 180 20, 180 100 
             L 180 180 
             Q 160 160, 140 180 
             T 100 180 
             T 60 180 
             T 20 180 
             Z"
          fill="url(#ghostGradient)"
          filter="url(#ghostGlow)"
          className={expression === 'scared' ? 'animate-pulse' : ''}
        />

        {/* Ghost Outline */}
        <path
          d="M 20 100 
             C 20 20, 180 20, 180 100 
             L 180 180 
             Q 160 160, 140 180 
             T 100 180 
             T 60 180 
             T 20 180 
             Z"
          stroke="#c7d2e0"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Ghost Face Container */}
        <g id="ghost-face">
          {/* Left Eye Background */}
          <circle
            cx="68"
            cy={config.eyeY}
            r="16"
            fill="#f0f4f8"
          />

          {/* Right Eye Background */}
          <circle
            cx="132"
            cy={config.eyeY}
            r="16"
            fill="#f0f4f8"
          />

          {/* Left Eye Pupil */}
          <circle
            id="ghost-eye-left"
            cx="68"
            cy={config.eyeY}
            r={12 * config.eyeScale}
            fill="#0f1419"
            className={blinking ? 'animate-blink' : ''}
          />

          {/* Right Eye Pupil */}
          <circle
            id="ghost-eye-right"
            cx="132"
            cy={config.eyeY}
            r={12 * config.eyeScale}
            fill="#0f1419"
            className={blinking ? 'animate-blink' : ''}
          />

          {/* Mouth / Expression */}
          <path
            id="ghost-mouth"
            d={config.mouthPath}
            stroke="#0f1419"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-300"
          />

          {/* Eyebrows (optional for emotions) */}
          {expression === 'thinking' && (
            <>
              <path d="M 55 75 Q 68 70 81 75" stroke="#0f1419" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 119 75 Q 132 70 145 75" stroke="#0f1419" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          )}

          {expression === 'scared' && (
            <>
              <path d="M 55 70 Q 68 65 81 70" stroke="#0f1419" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 119 70 Q 132 65 145 70" stroke="#0f1419" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

export default GhostMascot;
