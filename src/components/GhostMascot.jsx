import React, { useState, useEffect, useRef } from 'react';

/**
 * GhostMascot Component - Restrained Archival Guardian
 * 
 * Calm, subtle, theme-adaptive floating mascot with mouse-tracking eyes.
 * No neon purple drop-shadows or jarring glow effects.
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

  // Subtle blink every 4-5 seconds
  useEffect(() => {
    if (!animated) return;
    
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 140);
    }, Math.random() * 1500 + 4000);

    return () => clearInterval(blinkInterval);
  }, [animated]);

  // Periodic subtle expression change
  useEffect(() => {
    if (!autoCycle || expression !== 'auto') return;

    const expressionsList = ['happy', 'thinking', 'neutral', 'happy'];
    let index = 0;

    const cycleInterval = setInterval(() => {
      index = (index + 1) % expressionsList.length;
      setActiveExpression(expressionsList[index]);
    }, 5000);

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
      const distance = Math.min(Math.hypot(deltaX, deltaY), 240);
      
      const maxOffset = 4.5;
      const strength = (distance / 240) * maxOffset;

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
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
  };

  const expressionConfig = {
    happy: {
      mouthPath: 'M 88 104 Q 100 116 112 104',
      eyeScale: 1,
      eyeY: 92,
    },
    sad: {
      mouthPath: 'M 88 112 Q 100 102 112 112',
      eyeScale: 0.9,
      eyeY: 92,
    },
    thinking: {
      mouthPath: 'M 94 110 Q 100 106 106 110',
      eyeScale: 0.85,
      eyeY: 90,
    },
    scared: {
      mouthPath: 'M 97 114 L 103 114',
      eyeScale: 1.2,
      eyeY: 90,
    },
    neutral: {
      mouthPath: 'M 88 108 L 112 108',
      eyeScale: 1,
      eyeY: 92,
    },
  };

  const config = expressionConfig[activeExpression] || expressionConfig.happy;

  return (
    <div
      ref={ghostRef}
      className={`inline-block select-none ${animated ? 'animate-floatSubtle' : ''} ${sizeMap[size]} ${className}`}
      onClick={onClick}
      role="img"
      aria-label="Ghost mascot"
    >
      <svg
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-transform duration-300"
      >
        <defs>
          {/* Subtle gradient adapted to the theme */}
          <linearGradient id="ghostBodyLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--surface)" />
            <stop offset="100%" stopColor="var(--surface-secondary)" />
          </linearGradient>
        </defs>

        {/* Ghost Body */}
        <path
          d="M 28 100 
             C 28 30, 172 30, 172 100 
             L 172 176 
             Q 154 162, 136 176 
             T 100 176 
             T 64 176 
             T 28 176 
             Z"
          fill="url(#ghostBodyLight)"
          stroke="var(--border)"
          strokeWidth="2"
          className="transition-all duration-300"
        />

        {/* Subtle Archival Stitch Accent */}
        <path
          d="M 38 102 C 38 45, 162 45, 162 102"
          stroke="var(--border-subtle)"
          strokeWidth="1"
          strokeDasharray="3 3"
          fill="none"
        />

        {/* Ghost Face */}
        <g id="ghost-face">
          {/* Eye Sockets */}
          <circle cx="72" cy={config.eyeY} r="14" fill="var(--surface-tertiary)" />
          <circle cx="128" cy={config.eyeY} r="14" fill="var(--surface-tertiary)" />

          {/* Left Eye Pupil with Mouse Following */}
          <circle
            cx={72 + pupilOffset.x}
            cy={config.eyeY + pupilOffset.y}
            r={9 * config.eyeScale}
            fill="var(--text)"
            className={`${blinking ? 'scale-y-[0.1]' : ''} transition-transform duration-75`}
            style={{ transformOrigin: '72px 92px' }}
          />

          {/* Right Eye Pupil with Mouse Following */}
          <circle
            cx={128 + pupilOffset.x}
            cy={config.eyeY + pupilOffset.y}
            r={9 * config.eyeScale}
            fill="var(--text)"
            className={`${blinking ? 'scale-y-[0.1]' : ''} transition-transform duration-75`}
            style={{ transformOrigin: '128px 92px' }}
          />

          {/* Mouth */}
          <path
            d={config.mouthPath}
            stroke="var(--text)"
            strokeWidth="2.75"
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-300"
          />

          {/* Thinking Eyebrows */}
          {activeExpression === 'thinking' && (
            <>
              <path d="M 60 76 Q 72 72 84 76" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M 116 76 Q 128 72 140 76" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* Scared Eyebrows */}
          {activeExpression === 'scared' && (
            <>
              <path d="M 60 72 Q 72 68 84 72" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M 116 72 Q 128 68 140 72" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" fill="none" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

export default GhostMascot;
