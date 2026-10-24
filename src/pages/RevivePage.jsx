import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Sparkles, ChevronRight, Check } from 'lucide-react';
import GhostMascot from '../components/GhostMascot';
import { useProjects } from '../context/ProjectContext';

/**
 * RevivePage - Dedicated Decision Screen for Awakening Dormant Projects
 */
const RevivePage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, getProject, setRevivalPath, logProgress } = useProjects();
  const [progress, setProgress] = useState('');
  const [selectedPath, setSelectedPath] = useState(null);

  const revivalPaths = [
    { 
      name: 'Revive', 
      tag: 'Resume Build',
      description: 'Continue actively developing the codebase directly from where you paused with the original plan.' 
    },
    { 
      name: 'Reborn', 
      tag: 'Fresh Start',
      description: 'Restart the repository with a cleaner, simplified architecture, newer framework, or smaller MVP scope.' 
    },
    { 
      name: 'Pivot', 
      tag: 'New Angle',
      description: 'Repurpose the core technology or codebase to serve a different user problem or market opportunity.' 
    },
    { 
      name: 'Salvage', 
      tag: 'Harvest Code',
      description: 'Extract valuable utilities, hooks, smart contracts, or UI components into other active projects.' 
    },
    { 
      name: 'Lay to Rest', 
      tag: 'Archive Peacefully',
      description: 'Acknowledge the idea served its learning purpose, document final insights, and mark it permanently at peace.' 
    },
  ];

  // If no projectId or general overview, let user select which project to awaken
  if (!projectId || projectId === 'overview') {
    return (
      <div className="min-h-screen bg-theme-bg text-theme-text py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <GhostMascot size="md" expression="auto" animated={true} trackMouse={true} className="mx-auto mb-2" />
            <h1 className="text-3xl font-serif-title font-semibold text-theme-text">
              Revival Chamber
            </h1>
            <p className="text-xs sm:text-sm text-theme-text-muted max-w-md mx-auto">
              Select an archived project to set its revival trajectory, log recent progress, or harvest its components.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/revive/${p.id}`)}
                className="p-5 rounded-xl bg-theme-surface border border-theme-border hover:border-theme-accent/60 transition-all cursor-pointer group flex items-start justify-between shadow-sm hover:shadow-md"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-theme-text-muted">
                      {p.category}
                    </span>
                    <span className="text-[11px] font-medium px-1.5 py-0.2 rounded bg-theme-surface-secondary text-theme-text-muted border border-theme-border">
                      {p.status}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-theme-text group-hover:text-theme-accent transition-colors truncate">
                    {p.name}
                  </h3>
                  <p className="text-xs text-theme-text-muted mt-1 line-clamp-2">{p.epitaph || p.originalIdea}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-theme-text-subtle group-hover:text-theme-accent group-hover:translate-x-0.5 transition-all mt-1 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const project = getProject(projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <GhostMascot size="lg" expression="sad" animated={true} className="mb-4 mx-auto" />
          <h2 className="text-xl font-serif-title font-semibold mb-1">Project Not Found</h2>
          <p className="text-xs text-theme-text-muted mb-6">This repository tomb could not be found.</p>
          <Link to="/crypt" className="text-xs font-semibold text-theme-accent hover:underline">
            ← Browse the Crypt
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (progress.trim()) {
      logProgress(projectId, progress.trim());
    }
    if (selectedPath) {
      setRevivalPath(projectId, selectedPath);
    }
    navigate(`/grave/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-200">
      
      {/* Header */}
      <section className="bg-theme-surface border-b border-theme-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(`/grave/${projectId}`)}
            className="flex items-center gap-1.5 text-xs text-theme-text-muted hover:text-theme-text mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dossier</span>
          </button>
          
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-theme-text-muted">
              Revival Strategy
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif-title font-semibold text-theme-text">
              Awaken: {project.name}
            </h1>
            <p className="text-xs sm:text-sm text-theme-text-muted">
              Choose the next deliberate path for this project rather than letting it drift.
            </p>
          </div>
        </div>
      </section>

      {/* Content Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Revival Paths Selection Matrix */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-theme-accent" />
            <h2 className="text-sm font-serif-title font-semibold text-theme-text">
              1. Choose a Revival Path
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {revivalPaths.map((path) => {
              const isSelected = (selectedPath || project.revivalPath) === path.name;
              return (
                <button
                  key={path.name}
                  type="button"
                  onClick={() => setSelectedPath(path.name)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-theme-surface-secondary border-theme-accent shadow-sm'
                      : 'bg-theme-surface border-theme-border hover:border-theme-border/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-theme-text">{path.name}</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-theme-surface-secondary text-theme-text-muted border border-theme-border">
                      {path.tag}
                    </span>
                  </div>
                  <p className="text-xs text-theme-text-muted leading-relaxed">{path.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Log Progress */}
        <section className="p-6 bg-theme-surface border border-theme-border rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-theme-accent" />
            <h2 className="text-sm font-serif-title font-semibold text-theme-text">
              2. Log Recent Insights or Milestones (Optional)
            </h2>
          </div>
          <p className="text-xs text-theme-text-muted">
            Document what you just updated, code you extracted, or new reasons to revisit.
          </p>
          <textarea
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            rows={3}
            placeholder="e.g. Cleared unused dependencies, extracted the auth hook, or drafted updated database schema."
            className="w-full p-3 rounded-lg bg-theme-surface-secondary border border-theme-border text-xs sm:text-sm text-theme-text placeholder-theme-text-subtle focus:border-theme-accent focus:outline-none transition-colors resize-none"
          />
        </section>

        {/* Next step highlight if available */}
        {project.nextSmallestStep && (
          <div className="p-4 bg-theme-surface-secondary/70 border border-theme-border rounded-xl flex items-start gap-3">
            <GhostMascot size="sm" expression="thinking" animated={true} />
            <div className="text-xs">
              <span className="font-semibold text-theme-text">Suggested Starting Step: </span>
              <span className="text-theme-text-muted">{project.nextSmallestStep}</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-foreground text-xs font-semibold transition-all shadow-sm active:scale-95"
          >
            Save Strategy & Return
          </button>
        </div>
      </main>
    </div>
  );
};

export default RevivePage;
