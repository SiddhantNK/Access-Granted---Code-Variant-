import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Clock, Moon, Sparkles, Archive, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import GhostMascot from '../components/GhostMascot';
import NewBurialModal from '../components/NewBurialModal';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

/**
 * Dashboard - The Graveyard
 * 
 * Clean visual hierarchy:
 * 1. Page title & concise description
 * 2. Primary action: "New Burial" modal
 * 3. Compact overview metrics (Resting, Time Capsules, Revived)
 * 4. Categorized project cards with status badges and salvage tags
 */

const Dashboard = () => {
  const { projects } = useProjects();
  const { loginJustSucceeded, clearLoginSuccess } = useAuth();
  const [burialModalOpen, setBurialModalOpen] = useState(false);
  const [showEntranceGhost, setShowEntranceGhost] = useState(false);

  useEffect(() => {
    if (loginJustSucceeded) {
      setShowEntranceGhost(true);
      clearLoginSuccess();
      const timer = setTimeout(() => {
        setShowEntranceGhost(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loginJustSucceeded, clearLoginSuccess]);

  const categorizedProjects = {
    timeCapsule: projects.filter((p) => p.revisitAt && new Date(p.revisitAt) <= new Date()),
    resting: projects.filter((p) => p.status === 'Resting' || p.status === 'Fresh Grave'),
    revived: projects.filter((p) => p.status === 'Revived' || p.status === 'Reborn'),
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Fresh Grave':
        return 'bg-theme-gold-surface text-theme-gold border border-theme-gold/30';
      case 'Revived':
      case 'Reborn':
        return 'bg-theme-accent-surface text-theme-accent border border-theme-accent/30';
      case 'Resting':
      default:
        return 'bg-theme-surface-secondary text-theme-text-muted border border-theme-border';
    }
  };

  const ProjectCard = ({ project }) => (
    <Link
      to={`/grave/${project.id}`}
      className="block p-5 bg-theme-surface border border-theme-border hover:border-theme-accent/60 rounded-xl transition-all shadow-sm hover:shadow-md group"
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="min-w-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-theme-text-muted">
            {project.category || 'Project'}
          </span>
          <h3 className="text-base font-semibold text-theme-text group-hover:text-theme-accent transition-colors truncate">
            {project.name}
          </h3>
        </div>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md flex-shrink-0 ${getStatusBadgeStyle(project.status)}`}>
          {project.status}
        </span>
      </div>

      <p className="text-xs text-theme-text-muted line-clamp-2 leading-relaxed mb-4">
        {project.epitaph || project.originalIdea}
      </p>

      {/* Tags & Action */}
      <div className="flex items-center justify-between pt-3 border-t border-theme-border/60 text-xs">
        <div className="flex gap-1.5 flex-wrap">
          {project.salvageTags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-theme-surface-secondary text-theme-text-muted text-[11px] font-mono rounded"
            >
              {tag}
            </span>
          ))}
          {project.salvageTags.length > 2 && (
            <span className="text-[10px] text-theme-text-subtle self-center">
              +{project.salvageTags.length - 2}
            </span>
          )}
        </div>
        <span className="text-theme-text-subtle group-hover:text-theme-accent flex items-center gap-0.5 transition-colors text-[11px] font-medium">
          View Dossier <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-200">
      
      {/* Header Banner */}
      <section className="border-b border-theme-border bg-theme-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-theme-accent" />
                <span className="text-xs font-mono uppercase tracking-wider text-theme-text-muted">
                  Overview Registry
                </span>
              </div>
              <h1 className="text-3xl font-serif-title font-semibold text-theme-text mt-1">
                The Graveyard
              </h1>
              <p className="text-xs sm:text-sm text-theme-text-muted mt-1">
                {projects.length === 0
                  ? 'No projects recorded in the archive yet.'
                  : `${projects.length} project${projects.length === 1 ? '' : 's'} preserved in the vault.`}
              </p>
            </div>
            
            <div className="flex items-center gap-2.5 relative">
              {showEntranceGhost && (
                <div 
                  className="animate-ghost-entrance flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-theme-surface-secondary border border-theme-border shadow-md pointer-events-none"
                  aria-live="polite"
                >
                  <GhostMascot size="sm" expression="happy" animated={true} trackMouse={false} autoCycle={false} />
                  <span className="text-[11px] font-mono text-theme-accent font-medium">Welcome back!</span>
                </div>
              )}
              <Link
                to="/crypt"
                className="px-3.5 py-2 rounded-lg border border-theme-border text-xs font-medium text-theme-text hover:bg-theme-surface-secondary transition-colors"
              >
                Search Crypt
              </Link>
              <button
                onClick={() => setBurialModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-foreground text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>New Burial</span>
              </button>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-theme-border/60">
            <div className="bg-theme-surface-secondary/60 p-3 rounded-lg border border-theme-border/60">
              <p className="text-[11px] font-mono text-theme-text-muted uppercase">Resting</p>
              <p className="text-xl font-serif-title font-semibold text-theme-text mt-0.5">{categorizedProjects.resting.length}</p>
            </div>
            <div className="bg-theme-surface-secondary/60 p-3 rounded-lg border border-theme-border/60">
              <p className="text-[11px] font-mono text-theme-text-muted uppercase">Time Capsules Due</p>
              <p className="text-xl font-serif-title font-semibold text-theme-gold mt-0.5">{categorizedProjects.timeCapsule.length}</p>
            </div>
            <div className="bg-theme-surface-secondary/60 p-3 rounded-lg border border-theme-border/60">
              <p className="text-[11px] font-mono text-theme-text-muted uppercase">Revived</p>
              <p className="text-xl font-serif-title font-semibold text-theme-accent mt-0.5">{categorizedProjects.revived.length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {projects.length === 0 ? (
          // Empty State
          <div className="max-w-md mx-auto my-12 p-8 bg-theme-surface border border-theme-border rounded-2xl text-center shadow-sm">
            <GhostMascot size="lg" expression="happy" animated={true} className="mx-auto mb-4" />
            <h2 className="text-xl font-serif-title font-semibold text-theme-text mb-2">
              The Crypt is Empty
            </h2>
            <p className="text-xs sm:text-sm text-theme-text-muted mb-6 leading-relaxed">
              Whenever an idea stalls, don&apos;t just close the tab. Document your learnings and lay it to rest with clean context.
            </p>
            <button
              onClick={() => setBurialModalOpen(true)}
              className="px-4 py-2.5 bg-theme-accent hover:bg-theme-accent-hover text-theme-accent-foreground text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              Document Your First Project
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* Time Capsules Section */}
            {categorizedProjects.timeCapsule.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-theme-gold" />
                  <h2 className="text-base font-serif-title font-semibold text-theme-text">
                    Time Capsules Ready to Revisit ({categorizedProjects.timeCapsule.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorizedProjects.timeCapsule.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </section>
            )}

            {/* Resting Projects Section */}
            {categorizedProjects.resting.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-theme-text-muted" />
                  <h2 className="text-base font-serif-title font-semibold text-theme-text">
                    Resting Projects ({categorizedProjects.resting.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorizedProjects.resting.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </section>
            )}

            {/* Revived Section */}
            {categorizedProjects.revived.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-theme-accent" />
                  <h2 className="text-base font-serif-title font-semibold text-theme-text">
                    Brought Back to Life ({categorizedProjects.revived.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorizedProjects.revived.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </section>
            )}

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-theme-border flex items-center justify-between text-xs text-theme-text-muted">
              <span>Looking for historical statistics?</span>
              <Link to="/autopsy" className="text-theme-accent font-semibold hover:underline">
                View Full Autopsy Report →
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Burial Modal */}
      <NewBurialModal 
        isOpen={burialModalOpen} 
        onClose={() => setBurialModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
