import React, { useState, useEffect, useRef } from 'react';

/**
 * GhostMascot Component - Interactive Mouse-Tracking & Auto-Expressions
 * 
 * Props:
 * - size: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
 * - expression: 'happy' | 'sad' | 'thinking' | 'scared' | 'neutral' | 'auto' (default: 'happy')
 * - animated: boolean (default: true)
 * - trackMouse: boolean (default: true)
 * - autoCycle: boolean (default: true)
 * - onClick: callback function
 * - className: additional CSS classes
 */
export const GhostMascot = ({ 
  size = 'md', 
  expression = 'happy', 
  animated = true,
  trackMouse = true,
  autoCycle = true,
  onClick,
  className = '' 
}) => {
  const [blinking, setBlinking] = useState(false);
  const [activeExpression, setActiveExpression] = useState(expression === 'auto' ? 'happy' : expression);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const ghostRef = useRef(null);

  // Sync external expression changes
  useEffect(() => {
    if (expression !== 'auto') {
      setActiveExpression(expression);
    }
  }, [expression]);

  // Check ghost visibility setting from localStorage
  useEffect(() => {
    const checkGhostVisibility = () => {
      const hidden = localStorage.getItem('pg_ghost_hidden') === 'true';
      setIsVisible(!hidden);
    };

    checkGhostVisibility();
    window.addEventListener('storage', checkGhostVisibility);
    window.addEventListener('ghost_visibility_change', checkGhostVisibility);

    return () => {
      window.removeEventListener('storage', checkGhostVisibility);
      window.removeEventListener('ghost_visibility_change', checkGhostVisibility);
    };
  }, []);

  // Auto blink every 4-5 seconds
  useEffect(() => {
    if (!animated) return;
    
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 160);
    }, Math.random() * 1000 + 4000);

    return () => clearInterval(blinkInterval);
  }, [animated]);

  // Periodic expression change every 4-5 seconds if autoCycle is enabled
  useEffect(() => {
    if (!autoCycle || expression !== 'auto') return;

    const expressionsList = ['happy', 'thinking', 'neutral', 'happy', 'thinking'];
    let index = 0;

    const cycleInterval = setInterval(() => {
      index = (index + 1) % expressionsList.length;
      setActiveExpression(expressionsList[index]);
    }, 4500);

    return () => clearInterval(cycleInterval);
  }, [autoCycle, expression]);

  // Mouse tracking: Calculate angle and offset for pupils
  useEffect(() => {
    if (!trackMouse) return;

    const handleMouseMove = (e) => {
      if (!ghostRef.current) return;
      const rect = ghostRef.current.getBoundingClientRect();
      const ghostCenterX = rect.left + rect.width / 2;
      const ghostCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - ghostCenterX;
      const deltaY = e.clientY - ghostCenterY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.hypot(deltaX, deltaY), 250);
      
      // Scale offset max to 5px inside the eye
      const maxOffset = 5.5;
      const strength = (distance / 250) * maxOffset;

      setPupilOffset({
        x: Math.cos(angle) * strength,
        y: Math.sin(angle) * strength,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [trackMouse]);

  if (!isVisible) return null;

  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-44 h-44',
    xl: 'w-60 h-60',
  };

  // Expression-based mouth and eye styles
  const expressionConfig = {
    happy: {
      mouthPath: 'M 86 102 Q 100 118 114 102',
      eyeScale: 1,
      eyeY: 92,
    },
    sad: {
      mouthPath: 'M 86 110 Q 100 100 114 110',
      eyeScale: 0.9,
      eyeY: 92,
    },
    thinking: {
      mouthPath: 'M 95 110 Q 100 105 105 110',
      eyeScale: 0.85,
      eyeY: 88,
    },
    scared: {
      mouthPath: 'M 98 115 L 102 115',
      eyeScale: 1.25,
      eyeY: 90,
    },
    neutral: {
      mouthPath: 'M 86 108 L 114 108',
      eyeScale: 1,
      eyeY: 92,
    },
  };

  const config = expressionConfig[activeExpression] || expressionConfig.happy;

  return (
    <div
      ref={ghostRef}
      className={`inline-block select-none ${animated ? 'animate-float' : ''} ${sizeMap[size]} ${className}`}
      onClick={onClick}
      role="img"
      aria-label="Ghost mascot"
    >
      <svg
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl transition-transform duration-300"
      >
        <defs>
          <linearGradient id="ghostGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          
          <filter id="ghostGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ghost Body */}
        <path
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
          className={activeExpression === 'scared' ? 'animate-pulse' : ''}
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
          stroke="#cbd5e1"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Ghost Face */}
        <g id="ghost-face">
          {/* Eye Sockets */}
          <circle cx="68" cy={config.eyeY} r="16" fill="#f8fafc" />
          <circle cx="132" cy={config.eyeY} r="16" fill="#f8fafc" />

          {/* Left Eye Pupil with Mouse Following */}
          <circle
            cx={68 + pupilOffset.x}
            cy={config.eyeY + pupilOffset.y}
            r={11 * config.eyeScale}
            fill="#0f172a"
            className={`${blinking ? 'animate-blink' : ''} transition-transform duration-75`}
          />

          {/* Right Eye Pupil with Mouse Following */}
          <circle
            cx={132 + pupilOffset.x}
            cy={config.eyeY + pupilOffset.y}
            r={11 * config.eyeScale}
            fill="#0f172a"
            className={`${blinking ? 'animate-blink' : ''} transition-transform duration-75`}
          />

          {/* Mouth Expression */}
          <path
            d={config.mouthPath}
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-300"
          />

          {/* Eyebrows */}
          {activeExpression === 'thinking' && (
            <>
              <path d="M 55 74 Q 68 68 81 74" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 119 74 Q 132 68 145 74" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          )}

          {activeExpression === 'scared' && (
            <>
              <path d="M 55 69 Q 68 64 81 69" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 119 69 Q 132 64 145 69" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

export default GhostMascot;
