import React, { useState } from 'react';

/**
 * ActionZone - Drop target area representing Graveyard lifecycle actions
 * Types: 'burial' | 'preserve' | 'revive' | 'crypt' | 'autopsy' | 'restore' | 'delete' | 'progress' | 'export'
 */
const ActionZone = ({
  id,
  title,
  subtitle,
  icon: Icon,
  badgeText,
  accepts, // array of draggable types e.g. ['project', 'draft']
  onDrop,
  colorScheme = 'default', // 'default' | 'mint' | 'gold' | 'accent' | 'destructive'
  children,
  className = '',
}) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      e.dataTransfer.dropEffect = 'move';
    } catch (err) {}
    if (!isOver) setIsOver(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only toggle off if leaving this container
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);

    try {
      const rawData = e.dataTransfer.getData('application/json');
      if (!rawData) return;
      const data = JSON.parse(rawData);
      
      if (accepts && accepts.length > 0 && !accepts.includes(data.type)) {
        return;
      }

      if (onDrop) {
        onDrop(data);
      }
    } catch (err) {
      console.error('Failed to parse dropped data:', err);
    }
  };

  const getColorClasses = () => {
    switch (colorScheme) {
      case 'mint':
        return isOver
          ? 'border-theme-mint bg-theme-mint/10 text-theme-mint shadow-md ring-2 ring-theme-mint/30 scale-[1.01]'
          : 'border-theme-mint/40 bg-theme-surface hover:border-theme-mint/70';
      case 'gold':
        return isOver
          ? 'border-theme-gold bg-theme-gold/10 text-theme-gold shadow-md ring-2 ring-theme-gold/30 scale-[1.01]'
          : 'border-theme-gold/40 bg-theme-surface hover:border-theme-gold/70';
      case 'destructive':
        return isOver
          ? 'border-theme-destructive bg-theme-destructive/10 text-theme-destructive shadow-md ring-2 ring-theme-destructive/30 scale-[1.01]'
          : 'border-theme-destructive/40 bg-theme-surface hover:border-theme-destructive/70';
      case 'accent':
        return isOver
          ? 'border-theme-accent bg-theme-accent-surface text-theme-accent shadow-md ring-2 ring-theme-accent/30 scale-[1.01]'
          : 'border-theme-border bg-theme-surface hover:border-theme-accent/60';
      default:
        return isOver
          ? 'border-theme-accent bg-theme-surface-secondary shadow-md ring-2 ring-theme-ring scale-[1.01]'
          : 'border-theme-border bg-theme-surface hover:border-theme-border-subtle';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative rounded-xl border-2 border-dashed p-4 transition-all duration-200 flex flex-col justify-between ${getColorClasses()} ${className}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="w-7 h-7 rounded-lg bg-theme-surface-secondary border border-theme-border flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-theme-text font-serif-title">
              {title}
            </h4>
            {subtitle && (
              <p className="text-[10px] text-theme-text-muted leading-tight">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {badgeText && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-theme-surface-secondary border border-theme-border text-theme-text-muted">
            {badgeText}
          </span>
        )}
      </div>

      {/* Target drop indicator hint when dragging over */}
      {isOver && (
        <div className="my-2 py-2 px-3 rounded-lg border border-dashed border-current bg-theme-surface/70 text-center animate-pulse">
          <span className="text-[11px] font-medium">Release to activate {title}</span>
        </div>
      )}

      {/* Embedded children/zone contents */}
      {children && <div className="mt-2 flex-1">{children}</div>}
    </div>
  );
};

export default ActionZone;
