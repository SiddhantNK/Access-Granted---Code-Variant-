import React, { useState, useEffect, useRef, useCallback } from 'react';
import GhostMascot from './GhostMascot';

/**
 * RoamingGhost
 * 
 * Floats gently within a bounded region of the screen.
 * When the user touches or moves their cursor too close (~80px),
 * the ghost gets startled and flees to a new random location.
 * 
 * - Does not block clicks (pointer-events-none on body)
 * - Honors prefers-reduced-motion
 * - Honors pg_ghost_hidden state
 */
export const RoamingGhost = () => {
  const [hidden, setHidden] = useState(() => localStorage.getItem('pg_ghost_hidden') === 'true');
  const [position, setPosition] = useState({ x: 80, y: 300 });
  const [isFleeing, setIsFleeing] = useState(false);
  const [expression, setExpression] = useState('neutral');
  const ghostRef = useRef(null);
  const lastFleeTime = useRef(0);

  // Sync visibility with navbar ghost toggle
  useEffect(() => {
    const handleVisibilityChange = () => {
      setHidden(localStorage.getItem('pg_ghost_hidden') === 'true');
    };
    window.addEventListener('ghost_visibility_change', handleVisibilityChange);
    return () => window.removeEventListener('ghost_visibility_change', handleVisibilityChange);
  }, []);

  // Flee logic: pick a new distant coordinate
  const flee = useCallback((fromX, fromY) => {
    const now = Date.now();
    if (now - lastFleeTime.current < 600) return; // Debounce rapid triggers
    lastFleeTime.current = now;

    setIsFleeing(true);
    setExpression('scared');

    const viewportW = window.innerWidth || 1200;
    const viewportH = window.innerHeight || 800;

    // Pick new coordinates away from edges and away from trigger point
    const minX = 80;
    const maxX = Math.max(minX + 100, viewportW - 140);
    const minY = 100;
    const maxY = Math.max(minY + 100, viewportH - 140);

    let nextX = minX + Math.random() * (maxX - minX);
    let nextY = minY + Math.random() * (maxY - minY);

    // Make sure it moves at least 150px
    if (Math.hypot(nextX - fromX, nextY - fromY) < 150) {
      nextX = nextX > viewportW / 2 ? minX + 50 : maxX - 50;
      nextY = nextY > viewportH / 2 ? minY + 50 : maxY - 50;
    }

    setPosition({ x: nextX, y: nextY });

    setTimeout(() => {
      setIsFleeing(false);
      setExpression('happy');
    }, 700);

    setTimeout(() => {
      setExpression('neutral');
    }, 2400);
  }, []);

  // Proximity detection
  useEffect(() => {
    if (hidden) return;

    const handlePointerMove = (e) => {
      if (!ghostRef.current) return;
      const rect = ghostRef.current.getBoundingClientRect();
      const ghostCenterX = rect.left + rect.width / 2;
      const ghostCenterY = rect.top + rect.height / 2;

      const dist = Math.hypot(e.clientX - ghostCenterX, e.clientY - ghostCenterY);
      if (dist < 85) {
        flee(ghostCenterX, ghostCenterY);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchstart', (e) => {
      if (e.touches[0]) {
        handlePointerMove(e.touches[0]);
      }
    }, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, [hidden, flee]);

  if (hidden) return null;

  return (
    <div
      ref={ghostRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: 'left 0.65s cubic-bezier(0.2, 0.9, 0.3, 1), top 0.65s cubic-bezier(0.2, 0.9, 0.3, 1)',
        zIndex: 30,
        pointerEvents: 'none',
      }}
      className={`select-none ${isFleeing ? 'animate-flee-pop' : 'animate-roam-drift'}`}
      aria-hidden="true"
    >
      <div className="relative group cursor-pointer pointer-events-auto">
        <GhostMascot
          size="sm"
          expression={expression}
          animated={true}
          trackMouse={true}
          autoCycle={false}
        />
        {/* Subtle tooltip on hover */}
        <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity bg-theme-surface border border-theme-border text-[10px] font-mono text-theme-text-muted px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
          *poof*
        </div>
      </div>
    </div>
  );
};

export default RoamingGhost;
