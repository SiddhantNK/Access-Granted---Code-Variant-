import React from 'react';
import { Link } from 'react-router-dom';
import { GripVertical, ArrowUpRight, Clock, Archive } from 'lucide-react';

/**
 * DraggableProjectCard - Interactive draggable project card for canvas workspace
 */
const DraggableProjectCard = ({ project, onSelect, compact = false }) => {
  const handleDragStart = (e) => {
    const payload = {
      type: 'project',
      projectId: project.id,
      name: project.name,
      status: project.status,
      category: project.category,
      revivalPath: project.revivalPath,
    };
    e.dataTransfer.setData('application/json', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'move';
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Fresh Grave':
        return 'bg-theme-gold-surface text-theme-gold border border-theme-gold/30';
      case 'Revived':
      case 'Reborn':
        return 'bg-theme-surface-secondary text-theme-mint border border-theme-mint/40';
      case 'At Peace':
      case 'Salvaged':
        return 'bg-theme-surface-secondary text-theme-text-subtle border border-theme-border';
      case 'Resting':
      default:
        return 'bg-theme-surface-secondary text-theme-text-muted border border-theme-border';
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onSelect && onSelect(project)}
      className="group relative cursor-grab active:cursor-grabbing p-4 bg-theme-surface border border-theme-border hover:border-theme-accent/50 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 select-none flex flex-col justify-between"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-theme-text-subtle hover:text-theme-text cursor-grab active:cursor-grabbing" title="Drag to action zone">
              <GripVertical className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-theme-text-muted block truncate">
                {project.category || 'Project'}
              </span>
              <h3 className="text-sm font-serif-title font-semibold text-theme-text group-hover:text-theme-accent transition-colors truncate">
                {project.name}
              </h3>
            </div>
          </div>

          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md flex-shrink-0 ${getStatusBadgeStyle(project.status)}`}>
            {project.status}
          </span>
        </div>

        {/* Epitaph / Description */}
        <p className="text-sm text-theme-text-muted line-clamp-2 leading-relaxed mb-3">
          {project.epitaph || project.originalIdea}
        </p>
      </div>

      {/* Footer Details */}
      <div className="pt-2.5 border-t border-theme-border/60 flex items-center justify-between text-xs">
        <div className="flex gap-1 flex-wrap">
          {(project.salvageTags || []).slice(0, compact ? 1 : 2).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 bg-theme-surface-secondary text-theme-text-muted text-[10px] font-mono rounded"
            >
              {tag}
            </span>
          ))}
          {(project.salvageTags || []).length > (compact ? 1 : 2) && (
            <span className="text-[9px] text-theme-text-subtle self-center">
              +{(project.salvageTags || []).length - (compact ? 1 : 2)}
            </span>
          )}
        </div>

        <Link
          to={`/grave/${project.id}`}
          onClick={(e) => e.stopPropagation()}
          className="text-theme-text-subtle group-hover:text-theme-accent flex items-center gap-0.5 transition-colors text-[11px] font-medium"
        >
          Dossier <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default DraggableProjectCard;
